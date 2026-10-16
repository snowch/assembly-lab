// Copyright © 2026 Christopher Snow

// The differential test (docs/machine.md, "The differential test"). It holds the course's
// simulator and assembler to the real tools:
//
//   1. Every program in corpus/ is assembled with GNU as, linked at the course's layout, and run
//      under QEMU's user mode with a per-instruction register dump. The same call runs on the
//      simulator. The program counter, x0 to x30, sp and the flags are compared before every
//      instruction, and the data the program names is compared at the end.
//   2. Every line in lines/ is assembled with GNU as and with the course's assembler. They must
//      agree on whether it is accepted. A line outside the subset counts as agreeing when the
//      course's assembler rejects it with the "not in the machine" message.
//
// The tools come from AL_TOOLS (a directory holding usr/bin and usr/lib, as unpacked from the
// Ubuntu packages) or from PATH. Usage: node check.mjs [--only name] [--corpus] [--lines] [-v]

import { execFile } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { availableParallelism } from "node:os";
import { assemble, run, stateAfter } from "../../packages/machine/src/index.ts";

const run_ = promisify(execFile);
const here = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------------------------
// Tools

function findTools() {
  const root = process.env.AL_TOOLS;
  const env = { ...process.env };
  let bin = (name) => name;
  if (root) {
    const dir = join(root, "usr", "bin");
    bin = (name) => join(dir, name);
    const lib = join(root, "usr", "lib", "x86_64-linux-gnu");
    env.LD_LIBRARY_PATH = [lib, process.env.LD_LIBRARY_PATH].filter(Boolean).join(":");
  }
  return {
    env,
    as: bin("aarch64-linux-gnu-as"),
    ld: bin("aarch64-linux-gnu-ld"),
    nm: bin("aarch64-linux-gnu-nm"),
    qemu: bin("qemu-aarch64"),
  };
}

const tools = findTools();
let comparedSteps = 0;

async function exec(file, args, options = {}) {
  try {
    const { stdout, stderr } = await run_(file, args, {
      env: tools.env,
      encoding: options.binary ? "buffer" : "utf8",
      maxBuffer: 512 * 1024 * 1024,
      ...options.spawn,
    });
    return { ok: true, stdout, stderr };
  } catch (e) {
    if (e.code === "ENOENT") {
      console.error(
        `The tool ${file} was not found. Install qemu-user and binutils-aarch64-linux-gnu, or set AL_TOOLS.`,
      );
      process.exit(2);
    }
    return { ok: false, stdout: e.stdout, stderr: e.stderr, code: e.code };
  }
}

// ---------------------------------------------------------------------------------------------
// The call harness

const LINKER_SCRIPT = `ENTRY(__al_start)
SECTIONS {
  . = 0x400000;
  .text : { *(.text .text.*) }
  . = 0x410000;
  .data : { *(.data .data.*) }
  .rodata : { *(.rodata .rodata.*) }
  .bss : { *(.bss .bss.* COMMON) }
  . = 0x420000;
  .alstack : { *(.alstack) }
  /DISCARD/ : { *(.comment) *(.eh_frame) *(.note*) *(.gnu*) *(.ARM.attributes) }
}
`;

const hex = (v, digits = 16) => v.toString(16).padStart(digits, "0");

/** The 64-bit pattern of an argument: a decimal or 0x string, or a number. */
const argValue = (v, width) => BigInt.asUintN(width, BigInt(v));

function startCode(program, entry, args, flags, compare) {
  const lines = [];
  lines.push("\t.text", "\t.global __al_start", "__al_start:");
  const nzcv = flags ? parseInt(flags, 2) : 0;
  lines.push(`\tmovz x0, #${nzcv << 12}, lsl 16`, "\tmsr nzcv, x0");
  lines.push("\tmovz x0, #0x43, lsl 16", "\tmov sp, x0");
  const setReg = (n, value) => {
    lines.push(`\tmovz x${n}, #${value & 0xffffn}`);
    for (let s = 16; s < 64; s += 16) {
      const chunk = (value >> BigInt(s)) & 0xffffn;
      if (chunk !== 0n) lines.push(`\tmovk x${n}, #${chunk}, lsl ${s}`);
    }
  };
  // x0 last, because it was the scratch register above; x1 to x7 first.
  for (let i = 1; i < 8; i++) {
    const a = args[i];
    setReg(i, a ? argValue(a[0], a[1]) : 0n);
  }
  const a0 = args[0];
  setReg(0, a0 ? argValue(a0[0], a0[1]) : 0n);
  lines.push(`\tbl ${entry}`, "__al_ret:");
  for (const c of compare) {
    lines.push(
      `\tadrp x1, ${c.label}`,
      `\tadd x1, x1, :lo12:${c.label}`,
      `\tmovz x2, #${c.length}`,
      "\tmovz x0, #1",
      "\tmovz x8, #64",
      "\tsvc 0",
    );
  }
  lines.push("\tmovz x0, #0", "\tmovz x8, #93", "\tsvc 0");
  lines.push('\t.section .alstack,"aw",@nobits', "\t.zero 65536");
  void program;
  return lines.join("\n") + "\n";
}

/** Parse QEMU's `-d cpu` dump into one record per instruction. */
function parseQemuLog(text) {
  const records = [];
  const chunks = text.split(/^ ?PC=/m).slice(1);
  for (const chunk of chunks) {
    const pc = BigInt("0x" + /^([0-9a-f]+)/.exec(chunk)[1]);
    const x = new Array(31);
    for (const m of chunk.matchAll(/X(\d\d)=([0-9a-f]+)/g)) x[Number(m[1])] = BigInt("0x" + m[2]);
    const sp = BigInt("0x" + /SP=([0-9a-f]+)/.exec(chunk)[1]);
    const ps = parseInt(/PSTATE=([0-9a-f]+)/.exec(chunk)[1], 16);
    records.push({ pc, x, sp, nzcv: (ps >>> 28) & 0xf });
  }
  return records;
}

const nzcvOf = (f) => (f.n ? 8 : 0) | (f.z ? 4 : 0) | (f.c ? 2 : 0) | (f.v ? 1 : 0);
const flagText = (n) =>
  `${n & 8 ? "N" : "-"}${n & 4 ? "Z" : "-"}${n & 2 ? "C" : "-"}${n & 1 ? "V" : "-"}`;

function stateDiff(sim, real) {
  const diffs = [];
  if (BigInt(sim.pc) !== real.pc)
    diffs.push(["pc", "0x" + hex(BigInt(sim.pc)), "0x" + hex(real.pc)]);
  for (let i = 0; i < 31; i++) {
    if (sim.x[i] !== real.x[i]) diffs.push([`x${i}`, "0x" + hex(sim.x[i]), "0x" + hex(real.x[i])]);
  }
  if (sim.sp !== real.sp) diffs.push(["sp", "0x" + hex(sim.sp), "0x" + hex(real.sp)]);
  const sf = nzcvOf(sim.flags);
  if (sf !== real.nzcv) diffs.push(["nzcv", flagText(sf), flagText(real.nzcv)]);
  return diffs;
}

/** One call of one program, on QEMU and on the simulator. Returns null on success. */
async function checkCall(name, source, spec, call, index) {
  const dir = mkdtempSync(join(tmpdir(), "al-rt-"));
  try {
    const entry = call.entry ?? spec.entry;
    const compare = spec.compare ?? [];
    const asm = assemble(source);
    if (asm.program === null) {
      return `${name}: the course's assembler rejected the program: ${asm.errors
        .map((e) => `line ${e.line}: ${e.key} ${JSON.stringify(e.params)}`)
        .join("; ")}`;
    }
    const args = call.args ?? [];
    const full = source + "\n" + startCode(asm.program, entry, args, call.flags, compare);
    writeFileSync(join(dir, "p.s"), full);
    writeFileSync(join(dir, "p.ld"), LINKER_SCRIPT);
    const a = await exec(tools.as, [join(dir, "p.s"), "-o", join(dir, "p.o")]);
    if (!a.ok) return `${name}: GNU as rejected the program:\n${a.stderr}`;
    const l = await exec(tools.ld, [
      "-T",
      join(dir, "p.ld"),
      join(dir, "p.o"),
      "-o",
      join(dir, "p"),
    ]);
    if (!l.ok) return `${name}: ld failed:\n${l.stderr}`;
    const nm = await exec(tools.nm, [join(dir, "p")]);
    const sym = {};
    for (const line of nm.stdout.split("\n")) {
      const m = /^([0-9a-f]+) \w (\S+)$/.exec(line);
      if (m) sym[m[2]] = parseInt(m[1], 16);
    }
    const retAddr = sym.__al_ret;
    // The layout the simulator assumes must be the one the linker made.
    for (const [label, s] of Object.entries(asm.program.symbols)) {
      if (sym[label] !== undefined && sym[label] !== s.address) {
        return `${name}: the label ${label} is at 0x${sym[label].toString(16)} in the real link and 0x${s.address.toString(16)} in the simulator`;
      }
    }
    const q = await exec(tools.qemu, ["-one-insn-per-tb", "-d", "cpu", join(dir, "p")], {
      binary: true,
    });
    const logText = Buffer.from(q.stderr).toString("latin1");
    const records = parseQemuLog(logText);
    const first = records.findIndex((r) => r.pc === BigInt(sym[entry]));
    const last = records.findIndex((r, i) => i > first && r.pc === BigInt(retAddr));
    if (first < 0 || last < 0) {
      const lastPc = records.length ? "0x" + records[records.length - 1].pc.toString(16) : "none";
      const noise = logText
        .split("\n")
        .filter(
          (l) => l.trim() !== "" && !/^ ?PC=|^X\d\d=|^PSTATE=|^ ?SP=/.test(l) && !/X\d\d=/.test(l),
        )
        .slice(0, 3)
        .join(" | ");
      return `${name}, call ${index}: QEMU stopped at ${lastPc} after ${records.length} records, before the return address. ${noise}`;
    }
    const real = records.slice(first, last + 1);

    const result = run(asm.program, {
      entry: entry,
      args: args.map((a) => ({ value: BigInt(a[0]), width: a[1] })),
      returnAddress: retAddr,
      flags: call.flags
        ? {
            n: call.flags[0] === "1",
            z: call.flags[1] === "1",
            c: call.flags[2] === "1",
            v: call.flags[3] === "1",
          }
        : undefined,
      maxSteps: 200000,
    });

    const describe = () =>
      `${name}, call ${index} ${entry}(${args.map((a) => `${a[0]}:${a[1]}`).join(", ")})${
        call.flags ? ` flags ${call.flags}` : ""
      }`;
    const n = Math.min(real.length, result.steps.length + 1);
    comparedSteps += n;
    // Walk the simulator's state forward one step at a time.
    const simState = stateAfter(result, -1);
    for (let k = 0; k < n; k++) {
      if (k > 0) {
        const s = result.steps[k - 1];
        for (const w of s.writes) {
          if (w.reg === "sp") simState.sp = w.after;
          else simState.x[w.reg] = w.after;
        }
        simState.flags = s.flagsAfter;
        simState.pc = s.nextPc;
      }
      const diffs = stateDiff(simState, real[k]);
      if (diffs.length > 0) {
        const prev = result.steps[k - 1];
        const at = result.steps[k];
        return [
          `${describe()}: first difference at step ${k}, before ${at ? `line ${at.line}: ${at.text}` : "the return"}`,
          prev
            ? `  the step before it: line ${prev.line}: ${prev.text}`
            : "  (the first instruction)",
          ...diffs.map(([r, s, w]) => `  ${r.padEnd(5)} simulator ${s}   QEMU ${w}`),
          "  the program:",
          ...source.split("\n").map((s, i) => `    ${String(i + 1).padStart(3)}  ${s}`),
        ].join("\n");
      }
    }
    if (result.steps.length + 1 !== real.length) {
      const stop = result.stop;
      return `${describe()}: the simulator ran ${result.steps.length} instructions and then stopped (${stop.kind}${
        stop.kind === "fault" ? " " + stop.key + " " + JSON.stringify(stop.params) : ""
      }); QEMU ran ${real.length - 1}`;
    }
    if (result.stop.kind !== "returned") {
      return `${describe()}: the simulator stopped with ${result.stop.kind}`;
    }
    // The data.
    const out = Buffer.from(q.stdout);
    let at = 0;
    for (const c of compare) {
      const want = out.subarray(at, at + c.length);
      at += c.length;
      const got = result.read(asm.program.symbols[c.label].address, c.length);
      if (!got || Buffer.compare(Buffer.from(got), want) !== 0) {
        return `${describe()}: the bytes at ${c.label} differ:\n  simulator ${Buffer.from(got ?? []).toString("hex")}\n  QEMU      ${want.toString("hex")}`;
      }
    }
    return null;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------------------------
// The lines

const PREAMBLE = ["\t.text", "L:\tnop", "\t.data", "D:\t.quad 0"];

/** The lines of GNU as's output that are errors, by source line. */
function gnuErrorLines(stderr) {
  const lines = new Set();
  for (const m of (stderr ?? "").matchAll(/^[^:]*:(\d+): Error: /gm)) lines.add(Number(m[1]));
  return lines;
}

/** Assemble `source` with GNU as in `dir`; returns the set of source lines with an error. */
async function gnuAssemble(dir, source) {
  writeFileSync(join(dir, "l.s"), source);
  const a = await exec(tools.as, [join(dir, "l.s"), "-o", join(dir, "l.o")]);
  return { ok: a.ok, errors: gnuErrorLines(a.stderr) };
}

/**
 * GNU as's verdict on each line of a file, all lines in one file. It reports an error found while
 * reading a line at once, but one found when it fixes up an offset or a range (`ldr x0, [x1,
 * 4095]`) only if it found no error of the first kind anywhere. So it runs twice: on everything,
 * and then on the lines that passed the first time.
 */
async function gnuVerdicts(dir, lines) {
  const build = (subset) => {
    const src = [...PREAMBLE];
    const lineOf = new Map();
    subset.forEach((i) => {
      src.push("\t.text", lines[i]);
      lineOf.set(src.length, i);
    });
    return { source: src.join("\n") + "\n", lineOf };
  };
  const all = lines.map((_, i) => i);
  const first = build(all);
  const a = await gnuAssemble(dir, first.source);
  const rejected = new Set();
  for (const n of a.errors) if (first.lineOf.has(n)) rejected.add(first.lineOf.get(n));
  const rest = all.filter((i) => !rejected.has(i));
  if (rest.length > 0) {
    const second = build(rest);
    const b = await gnuAssemble(dir, second.source);
    for (const n of b.errors) if (second.lineOf.has(n)) rejected.add(second.lineOf.get(n));
  }
  return { rejected, source: first.source, lineOf: first.lineOf };
}

async function checkLines(file, text) {
  const raw = text.split("\n");
  // A file whose first line is `// each line alone` has every line assembled on its own: its lines
  // are directives, which can swallow the lines after them.
  const alone = raw[0]?.trim() === "// each line alone";
  const origin = [];
  const lines = raw.filter((l, n) => {
    const keep = l.trim() !== "" && !l.trim().startsWith("//");
    if (keep) origin.push(n + 1);
    return keep;
  });
  const problems = [];
  let both = 0;
  let outside = 0;
  const note = (i, gnuRejects, ours) => {
    const l = lines[i];
    if (gnuRejects && ours) both++;
    else if (!gnuRejects && !ours) both++;
    else if (!gnuRejects && ours && ours.key === "notInMachine") outside++;
    else if (gnuRejects) {
      problems.push(
        `${file}:${origin[i]}: GNU as rejects \`${l}\` and the course's assembler accepts it`,
      );
    } else {
      problems.push(
        `${file}:${origin[i]}: GNU as accepts \`${l}\` and the course's assembler rejects it: ${ours.key} ${JSON.stringify(ours.params)}`,
      );
    }
  };
  if (alone) {
    await pool(
      lines.map((_, i) => i),
      Math.max(2, availableParallelism()),
      async (i) => {
        const dir = mkdtempSync(join(tmpdir(), "al-line-"));
        try {
          const source = [...PREAMBLE, "\t.text", lines[i]].join("\n") + "\n";
          const g = await gnuAssemble(dir, source);
          const mine = assemble(source);
          note(i, !g.ok, mine.errors[0]);
        } finally {
          rmSync(dir, { recursive: true, force: true });
        }
      },
    );
  } else {
    const dir = mkdtempSync(join(tmpdir(), "al-lines-"));
    try {
      const v = await gnuVerdicts(dir, lines);
      const mine = assemble(v.source);
      const ours = new Map();
      for (const e of mine.errors) if (!ours.has(e.line)) ours.set(e.line, e);
      for (const [n, i] of v.lineOf) note(i, v.rejected.has(i), ours.get(n));
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }
  problems.sort();
  return { count: lines.length, problems, both, outside };
}

// ---------------------------------------------------------------------------------------------
// Main

async function pool(items, size, fn) {
  const results = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(size, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return results;
}

const argv = process.argv.slice(2);
const only = argv.includes("--only") ? argv[argv.indexOf("--only") + 1] : null;
const doCorpus = argv.includes("--corpus") || !argv.includes("--lines");
const doLines = argv.includes("--lines") || !argv.includes("--corpus");
const verbose = argv.includes("-v");

let failed = false;

if (doCorpus) {
  const corpusDir = join(here, "corpus");
  const names = readdirSync(corpusDir)
    .filter((f) => f.endsWith(".s"))
    .map((f) => f.slice(0, -2))
    .filter((n) => !only || n === only)
    .sort();
  const jobs = [];
  for (const name of names) {
    const source = readFileSync(join(corpusDir, `${name}.s`), "utf8");
    const specFile = join(corpusDir, `${name}.json`);
    if (!existsSync(specFile)) {
      console.error(`${name}.s has no ${name}.json`);
      process.exit(1);
    }
    const spec = JSON.parse(readFileSync(specFile, "utf8"));
    spec.calls.forEach((call, index) => jobs.push({ name, source, spec, call, index }));
  }
  const started = Date.now();
  const results = await pool(jobs, Math.max(2, availableParallelism()), (j) =>
    checkCall(j.name, j.source, j.spec, j.call, j.index),
  );
  const bad = results.filter((r) => r !== null);
  for (const b of bad) console.error(b + "\n");
  console.log(
    `corpus: ${names.length} programs, ${jobs.length} calls, ${comparedSteps} instruction states compared, ${bad.length} differences (${((Date.now() - started) / 1000).toFixed(1)} s)`,
  );
  if (bad.length > 0) failed = true;
}

if (doLines) {
  const linesDir = join(here, "lines");
  const files = readdirSync(linesDir)
    .filter((f) => f.endsWith(".txt"))
    .sort();
  let total = 0;
  let outside = 0;
  let problems = [];
  for (const f of files) {
    const r = await checkLines(f, readFileSync(join(linesDir, f), "utf8"));
    total += r.count;
    outside += r.outside;
    problems = problems.concat(r.problems);
    if (verbose) console.log(`  ${f}: ${r.count} lines`);
  }
  for (const p of problems) console.error(p);
  console.log(
    `lines: ${files.length} files, ${total} lines, ${outside} outside the subset, ${problems.length} disagreements`,
  );
  if (problems.length > 0) failed = true;
}

process.exit(failed ? 1 : 0);
