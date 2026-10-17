// Copyright © 2026 Christopher Snow

// Every number the second lesson of Module 1 states, run on the model, and every claim about which
// constants one `mov` holds, put to the course's assembler. The assembler agrees with GNU as line by
// line (scripts/real-tools/lines/module1-constants.txt), so what it accepts is what GNU as does.
// The listings are held to the recorded file in module-1.listings.test.ts.

import { describe, expect, it } from "vitest";

import { TEXT_BASE, assemble, run, stateAfter, type Program } from "@al/machine";
import { learnerText } from "@platform/lesson-schema";
import {
  assemblyOf,
  halves16,
  parseListing,
  readingsOfValue,
  traceAssembly,
  traceText,
  tryMov,
  wide64,
} from "@al/views";

import { LESSONS } from ".";
import {
  FOUR_INSTRUCTIONS,
  MOVK_EXAMPLE,
  ODOMETER_LIMIT_START_TEXT,
  ODOMETER_LIMIT_TEXT,
  SERVICE_AND_ODOMETER,
  SERVICE_INTERVAL,
  WIDTHS,
  X5_QUESTION,
} from "./module-1.listings";

const lesson = LESSONS.find((l) => l.id === "constants-and-widths")!;
const challenge = (id: string) => lesson.challenges.find((c) => c.id === id)!;

const build = (text: string): Program => {
  const { program, errors } = assemble(text);
  if (!program) throw new Error(errors.map((e) => e.key).join(", "));
  return program;
};
const runText = (text: string) =>
  run(build(text.endsWith("\n") ? text : text + "\n"), { entry: TEXT_BASE });
const x = (state: { x: bigint[] }, n: number) => state.x[n]!;
/** The first instruction `mov w0, <n>` assembles to, or the first error's key. */
const mov = (n: string | number) => {
  const { program, errors } = assemble(`mov w0, ${n}\nret\n`);
  return program
    ? { ok: true as const, op: program.instructions[0]!.op }
    : { ok: false as const, key: errors[0]!.key };
};

describe("service_interval and odometer_limit", () => {
  const program = build(assemblyOf(parseListing(SERVICE_AND_ODOMETER.listing)));
  const call = (entry: string) => run(program, { entry });

  it("make one instruction of 30000: mov w0, 30000, then ret", () => {
    const result = call("service_interval");
    expect(result.steps.map((s) => s.text)).toEqual(["mov w0, 30000", "ret"]);
    expect(x(result.final, 0)).toBe(30000n);
  });

  it("make two of 1000000: mov w0, 16960, then movk w0, 0xf, lsl 16", () => {
    const result = call("odometer_limit");
    expect(result.steps.map((s) => s.text)).toEqual([
      "mov w0, 16960",
      "movk w0, 0xf, lsl 16",
      "ret",
    ]);
    expect(x(stateAfter(result, 0), 0)).toBe(16960n);
    expect(x(stateAfter(result, 1), 0)).toBe(1000000n);
    expect(x(result.final, 0)).toBe(1000000n);
  });

  it("leave 1000000 as 0x000f4240: the lower half 0x4240 is 16960, the upper half 0xf is 15", () => {
    expect(readingsOfValue(1000000).digits).toBe("000f4240");
    expect(0x4240).toBe(16960);
    expect(0xf).toBe(15);
    expect(1000000 & 0xffff).toBe(16960);
    expect(1000000 >>> 16).toBe(15);
  });

  it("have movk replace one 16-bit half and keep the rest", () => {
    // The lower half is kept when the upper is replaced...
    expect(x(runText("mov w0, 16960\nmovk w0, 15, lsl 16\nret").final, 0)).toBe(1000000n);
    // ...a second mov replaces the whole register, as the hint says...
    expect(x(runText("mov w0, 16960\nmov w0, 15\nret").final, 0)).toBe(15n);
    // ...and mov w0, 1 then movk w0, 1, lsl 16 leaves 65537.
    expect(x(runText("mov w0, 1\nmovk w0, 1, lsl 16\nret").final, 0)).toBe(65537n);
  });
});

describe("which numbers one mov can put in w0", () => {
  it("takes 65536 in one instruction: a single 1, in the upper half", () => {
    const m = mov(65536);
    expect(m.ok).toBe(true);
    if (m.ok) expect(m.op).toMatchObject({ k: "movz", imm: 1n, shift: 16 });
    expect(x(runText("mov w0, 65536\nret").final, 0)).toBe(65536n);
  });

  it("takes 30000 and 65535 in one instruction each, as movz of the lower half", () => {
    for (const n of [30000, 65535]) {
      const m = mov(n);
      expect(m.ok, String(n)).toBe(true);
      if (m.ok) expect(m.op).toMatchObject({ k: "movz", shift: 0 });
    }
  });

  it("refuses 70000, 100000 and 1000000: each has bits in both halves, and the assembler says no single instruction can hold it", () => {
    for (const n of [70000, 100000, 1000000]) {
      expect(n & 0xffff, String(n)).not.toBe(0);
      expect(n >>> 16, String(n)).not.toBe(0);
      expect(mov(n)).toEqual({ ok: false, key: "immediate.move" });
    }
  });

  it("takes exactly one of the prediction's four numbers", () => {
    const options = lesson.sections[2]!.interactives[0]!.props["options"] as { value: string }[];
    expect(options.map((o) => o.value)).toEqual(["65536", "70000", "100000", "1000000"]);
    expect(options.filter((o) => mov(o.value).ok).map((o) => o.value)).toEqual(["65536"]);
  });

  it("takes a number whose bits repeat one short pattern: 65537 is 0x00010001", () => {
    expect(65537).toBe(0x00010001);
    const m = mov(65537);
    expect(m.ok).toBe(true);
    if (m.ok) expect(m.op.k).toBe("logic");
    expect(mov("0x00010001")).toEqual(m);
    expect(x(runText("mov w0, 65537\nret").final, 0)).toBe(65537n);
  });

  it("takes -1, and other numbers whose bits are all ones except in one 16-bit half", () => {
    for (const n of ["-1", "0xffff1234", "0x1234ffff", "0xffff0000", "-65536"]) {
      const m = mov(n);
      expect(m.ok, n).toBe(true);
    }
    const m = mov(-1);
    if (m.ok) expect(m.op.k).toBe("movn");
  });

  it("takes -1 and 1048575 (0x000fffff) in one instruction each, though their bits are in both 16-bit halves", () => {
    for (const [n, bits] of [
      [-1, 0xffffffff],
      [1048575, 0x000fffff],
    ] as const) {
      // The bits are in both halves of the register...
      expect(bits & 0xffff, String(n)).not.toBe(0);
      expect(bits >>> 16, String(n)).not.toBe(0);
      // ...and the assembler takes the number as one instruction, which leaves exactly those bits.
      const { program, errors } = assemble(`mov w0, ${n}\nret\n`);
      expect(errors, String(n)).toEqual([]);
      expect(program!.instructions.map((i) => i.mnemonic)).toEqual(["mov", "ret"]);
      expect(x(runText(`mov w0, ${n}\nret`).final, 0), String(n)).toBe(BigInt(bits));
    }
    expect(1048575).toBe(0x000fffff);
    // Written in hexadecimal it is the same instruction.
    expect(mov("0x000fffff")).toEqual(mov(1048575));
    // The tester says so, with the register it leaves.
    expect(tryMov("-1")).toEqual({ kind: "one", w0: 0xffffffff });
    expect(tryMov("1048575")).toEqual({ kind: "one", w0: 0x000fffff });
  });

  it("takes -1 and 4294967295 as the same instruction, and leaves the same 32 bits in w0", () => {
    const a = mov(-1);
    const b = mov(4294967295);
    expect(a).toEqual(b);
    expect(x(runText("mov w0, -1\nret").final, 0)).toBe(4294967295n);
    expect(x(runText("mov w0, 4294967295\nret").final, 0)).toBe(4294967295n);
  });

  it("is what the tester says: the number typed, the register as the model leaves it", () => {
    expect(tryMov("65536")).toEqual({ kind: "one", w0: 65536 });
    expect(tryMov("-1")).toEqual({ kind: "one", w0: 4294967295 });
    expect(tryMov("65537")).toEqual({ kind: "one", w0: 65537 });
    expect(tryMov("1000000")).toMatchObject({ kind: "refused" });
    expect(tryMov("")).toEqual({ kind: "empty" });
    expect(tryMov("w1")).toEqual({ kind: "not-a-number" });
  });
});

// ---------------------------------------------------------------------------------------------
// The halves of 16 bits

/** The four hexadecimal digits of each half of `n`, as the lesson writes a number with a space between. */
const halvesOf = (n: number) => {
  const digits = readingsOfValue(n).digits;
  return `${digits.slice(0, 4)} ${digits.slice(4)}`;
};

describe("the four candidates, and the halves the lesson writes for them", () => {
  it("are 0x0001 0000, 0x0001 1170, 0x0001 86a0 and 0x000f 4240", () => {
    expect([65536, 70000, 100000, 1000000].map(halvesOf)).toEqual([
      "0001 0000",
      "0001 1170",
      "0001 86a0",
      "000f 4240",
    ]);
  });

  it("have a lower half of 0000 only for 65536, the one the assembler takes", () => {
    const lower = (n: number) => readingsOfValue(n).digits.slice(4);
    expect([65536, 70000, 100000, 1000000].filter((n) => lower(n) === "0000")).toEqual([65536]);
    expect([65536, 70000, 100000, 1000000].filter((n) => mov(n).ok)).toEqual([65536]);
  });

  it("give 30000 as 0x00007530, whose upper half is 0000", () => {
    expect(halvesOf(30000)).toBe("0000 7530");
    expect(0x7530).toBe(30000);
  });

  it("give 1048575 as 0x000fffff (twenty 1s in a row) and 65537 as 0x00010001, and the assembler takes both", () => {
    expect(readingsOfValue(1048575).digits).toBe("000fffff");
    expect(1048575).toBe(0x000fffff);
    expect(readingsOfValue(1048575).pattern.replace(/^0+/, "")).toBe("1".repeat(20));
    expect(readingsOfValue(65537).digits).toBe("00010001");
    expect([mov(1048575).ok, mov(65537).ok, mov(-1).ok]).toEqual([true, true, true]);
  });
});

describe("mov w0, 30000 in halves of 16, the first figure of the second section", () => {
  const trace = traceText(SERVICE_INTERVAL.listing);

  it("shows 0000 over 7530 after the mov, the whole register new, and nothing before it has run", () => {
    expect(halves16(trace, 0, 0)).toMatchObject({ upper: "0000", lower: "0000", tag: null });
    expect(halves16(trace, 1, 0)).toMatchObject({
      upper: "0000",
      lower: "7530",
      tag: { upper: "new", lower: "new" },
    });
  });
});

describe("the worked example, mov w0, 3 then movk w0, 2, lsl 16", () => {
  const result = runText(MOVK_EXAMPLE.listing);
  const trace = traceText(MOVK_EXAMPLE.listing);

  it("leaves 0x00020003, which is 131075", () => {
    expect(x(stateAfter(result, 0), 0)).toBe(3n);
    expect(x(stateAfter(result, 1), 0)).toBe(0x00020003n);
    expect(0x00020003).toBe(131075);
    expect(2 * 65536 + 3).toBe(131075);
    expect(readingsOfValue(131075).digits).toBe("00020003");
  });

  it("draws 0000 0003 after the mov, both halves new, then 0002 0003 with the upper new and the lower kept", () => {
    expect(halves16(trace, 1, 0)).toMatchObject({
      upper: "0000",
      lower: "0003",
      tag: { upper: "new", lower: "new" },
    });
    expect(halves16(trace, 2, 0)).toMatchObject({
      upper: "0002",
      lower: "0003",
      tag: { upper: "new", lower: "kept" },
    });
  });

  it("keeps both halves at the ret, which writes no register", () => {
    expect(halves16(trace, 3, 0)).toMatchObject({
      upper: "0002",
      lower: "0003",
      tag: { upper: "kept", lower: "kept" },
    });
  });
});

describe("two different solutions of Build 1000000 in halves of 16", () => {
  const gate = {
    allowed: new Set(["mov", "movk", "ret"]),
    introduced: new Set(["add", "sub", "ret", "mov", "movk"]),
  };
  const tags = (text: string) => {
    const trace = traceAssembly(text, gate)!;
    return {
      end: x(trace.result.final, 0),
      steps: trace.result.steps.length,
      tags: [...Array(trace.result.steps.length + 1).keys()].map((k) => {
        const h = halves16(trace, k, 0);
        return `${h.upper} ${h.lower} ${h.tag ? `${h.tag.upper}/${h.tag.lower}` : "-"}`;
      }),
    };
  };

  it("mov, then movk: the lower half is put first, the upper is new and the lower kept", () => {
    expect(tags(ODOMETER_LIMIT_TEXT)).toEqual({
      end: 1000000n,
      steps: 3,
      tags: ["0000 0000 -", "0000 4240 new/new", "000f 4240 new/kept", "000f 4240 kept/kept"],
    });
  });

  it("mov, movk, movk: the middle step replaces the upper half, the last the lower half", () => {
    expect(tags("mov w0, 1\nmovk w0, 15, lsl 16\nmovk w0, 16960\nret")).toEqual({
      end: 1000000n,
      steps: 4,
      tags: [
        "0000 0000 -",
        "0000 0001 new/new",
        "000f 0001 new/kept",
        "000f 4240 kept/new",
        "000f 4240 kept/kept",
      ],
    });
  });

  it("movk, movk from the start: the first movk changes only the lower half, whatever it is", () => {
    expect(tags("movk w0, #16960\nmovk w0, #15, lsl 16\nret")).toMatchObject({
      end: 1000000n,
      tags: ["0000 0000 -", "0000 4240 kept/new", "000f 4240 new/kept", "000f 4240 kept/kept"],
    });
  });

  it("is the text the learner wrote, assembled with the challenge's gate: another instruction is refused", () => {
    expect(traceAssembly("mov w0, 16960\nadd w0, w0, 1\nret", gate)).toBeNull();
  });
});

describe("x3 and w3 in one box", () => {
  const trace = traceText(WIDTHS.listing);

  it("tags both 32-bit halves written by mov x3, -1", () => {
    expect(wide64(trace, 0, 3)).toEqual({ tag: null, clearedByW: false });
    expect(wide64(trace, 1, 3)).toEqual({
      tag: { upper: "written", lower: "written" },
      clearedByW: false,
    });
  });

  it("tags the upper half cleared and the lower half written by mov w3, -1, which leaves the upper half 0", () => {
    const after = wide64(trace, 2, 3);
    expect(after).toEqual({ tag: { upper: "cleared", lower: "written" }, clearedByW: true });
    expect(x(trace.result.final, 3) >> 32n).toBe(0n);
    expect(x(trace.result.final, 3)).toBe(0x00000000ffffffffn);
  });

  it("says nothing at the ret", () => {
    expect(wide64(trace, 3, 3)).toEqual({ tag: null, clearedByW: false });
  });
});

describe("the closing question, x5 then mov w5, 7", () => {
  it("leaves x5 holding 7: the lower 32 bits written, the upper 32 cleared", () => {
    const result = runText(X5_QUESTION.listing);
    expect(x(stateAfter(result, 0), 5)).toBe(0xffffffffffffffffn);
    expect(x(result.final, 5)).toBe(7n);
    expect(x(result.final, 5) >> 32n).toBe(0n);
  });
});

describe("the challenge, Build 1000000", () => {
  const c = challenge("build-1000000");

  it("starts from mov w0, 1000000, which does not assemble, and ends at GCC's own two instructions", () => {
    expect(c.initial.text).toBe(ODOMETER_LIMIT_START_TEXT);
    expect(c.reference.text).toBe(ODOMETER_LIMIT_TEXT);
    const { program, errors } = assemble(c.initial.text ?? "");
    expect(program).toBeNull();
    expect(errors.map((e) => [e.line, e.key])).toEqual([[1, "immediate.move"]]);
  });

  it("puts 1000000 in w0 with the reference, and the only expected value is 1000000", () => {
    expect(x(runText(c.reference.text ?? "").final, 0)).toBe(1000000n);
    if (c.tests.kind !== "answers") throw new Error("answer tests");
    expect(c.tests.cases.map((t) => t.expect)).toEqual([{ w0: 1000000 }]);
  });
});

describe("two names, one register", () => {
  const program = build(assemblyOf(parseListing(WIDTHS.listing)));
  const result = run(program, { entry: TEXT_BASE });

  it("sets all 64 bits with mov x3, -1", () => {
    expect(x(stateAfter(result, 0), 3)).toBe(0xffffffffffffffffn);
  });

  it("leaves the lower 32 bits set and the upper 32 cleared after mov w3, -1: 0x00000000ffffffff", () => {
    const after = x(stateAfter(result, 1), 3);
    expect(after).toBe(0x00000000ffffffffn);
    expect(after >> 32n).toBe(0n);
    expect(after & 0xffffffffn).toBe(0xffffffffn);
    expect(result.stop.kind).toBe("returned");
  });

  it("is the right option of the prediction, and not an error", () => {
    const options = lesson.sections[5]!.interactives[0]!.props["options"] as {
      value: string;
      label: string;
    }[];
    expect(options.map((o) => o.value)).toEqual(["all-set", "low-set", "unknown", "error"]);
    expect(options.find((o) => o.value === "low-set")!.label).toBe(
      "The lower 32 bits set and the upper 32 cleared.",
    );
  });

  it("turns return -1; with long into mov x0, -1, which sets all 64 bits of x0", () => {
    expect(x(runText("mov x0, -1\nret").final, 0)).toBe(0xffffffffffffffffn);
  });

  it("clears the upper half of x0 when w0 is written, so a caller that reads x0 finds zeros there", () => {
    const after = x(runText("mov x0, -1\nmov w0, -1\nret").final, 0);
    expect(after >> 32n).toBe(0n);
    expect(x(runText("mov w0, -1\nret").final, 0) >> 32n).toBe(0n);
  });
});

describe("the challenge, Predict two registers", () => {
  const result = run(build(assemblyOf(parseListing(FOUR_INSTRUCTIONS.listing))), {
    entry: TEXT_BASE,
  });
  const last = result.steps.length - 1;

  it("runs the four instructions the task names", () => {
    expect(result.steps.map((s) => s.text)).toEqual([
      "mov x1, -1",
      "mov w1, 5",
      "mov w2, 16960",
      "movk w2, 0xf, lsl 16",
    ]);
  });

  it("leaves x1 as 5, because writing w1 clears the upper half that mov x1, -1 set", () => {
    expect(x(stateAfter(result, 0), 1)).toBe(0xffffffffffffffffn);
    expect(x(stateAfter(result, last), 1)).toBe(5n);
  });

  it("leaves w2 as 1000000, which is 0x000f4240", () => {
    expect(x(stateAfter(result, last), 2)).toBe(1000000n);
    expect(readingsOfValue(1000000).digits).toBe("000f4240");
  });

  it("is what the challenge's reference answers", () => {
    expect(challenge("predict-two-registers").reference.answers).toEqual({
      x1: "5",
      w2: "1000000",
    });
  });
});

// ---------------------------------------------------------------------------------------------
// Every number the learner reads

describe("every number the lesson states", () => {
  // The numbers of the listings, and what the model gives for them. A number in the lesson's
  // words that is in no list here is a number nothing pins.
  const model = new Set<number>([
    // service_interval's and odometer_limit's constants, and the halves of 1000000.
    30000, 1000000, 16960, 15,
    // The prediction's options.
    65536, 70000, 100000,
    // The worked example: mov w0, 3, movk w0, 2, lsl 16, which leaves 131075 (the tests above), and
    // bits 16 to 31 of a register, whose upper half they are.
    2, 3, 131075, 31,
    // Seven, which mov w5, 7 puts in x5 (the tests above).
    7,
    // A 16-bit half, a register's 32 bits and its 64.
    16, 32, 64,
    // 65537, and the 1 of the hint that builds it, and 4294967295 (the same bits as -1).
    65537, 1, 4294967295,
    // mov w1, 5, and x1 at the end.
    5,
    // A number one mov holds though its bits are in both halves (the model takes it, below).
    1048575,
    // Module 0, by its number, and its #50, a constant in Module 0's recorded listing.
    0,
  ]);

  const text = learnerText(lesson).join("\n");
  // A number written with a space between its halves (`0x0001 1170`) is one number.
  const HEX = /0x[0-9a-f]{4} [0-9a-f]{4}|0x[0-9a-f]+/g;
  const hexes = [...text.matchAll(HEX)].map((m) => m[0].replace(" ", ""));

  it("is pinned: each is a constant in a listing, a result of the model, or a fact the tests above check", () => {
    // Names such as w0 and x3 hold digits that are not numbers; hexadecimal numbers are held to the
    // model below.
    const plain = text.replace(HEX, " ").replace(/[A-Za-z_][A-Za-z_0-9]*/g, " ");
    const numbers = [...plain.matchAll(/\d+/g)].map((m) => Number(m[0]));
    expect(numbers.length).toBeGreaterThan(30);
    expect(numbers.filter((n) => !model.has(n))).toEqual([]);
  });

  it("writes each hexadecimal number as a value the model holds", () => {
    expect([...new Set(hexes)].sort()).toEqual(
      [
        "0x00000000ffffffff",
        "0x00000003",
        "0x00007530",
        "0x00010000",
        "0x00011170",
        "0x000186a0",
        "0x00020003",
        "0x000f4240",
        "0x000fffff",
        "0x00010001",
        "0xf",
        "0xffffffffffffffff",
      ].sort(),
    );
    const value: Record<string, bigint> = {
      "0x00000000ffffffff": x(stateAfterWidths(), 3),
      // The candidates, and 30000, as the model holds them.
      "0x00007530": BigInt(readingsOfValue(30000).unsigned),
      "0x00010000": BigInt(readingsOfValue(65536).unsigned),
      "0x00011170": BigInt(readingsOfValue(70000).unsigned),
      "0x000186a0": BigInt(readingsOfValue(100000).unsigned),
      // w0 after mov w0, 3, and after movk w0, 2, lsl 16.
      "0x00000003": x(stateAfter(runText(MOVK_EXAMPLE.listing), 0), 0),
      "0x00020003": x(stateAfter(runText(MOVK_EXAMPLE.listing), 1), 0),
      // x5 after mov x5, -1.
      "0xffffffffffffffff": x(stateAfter(runText(X5_QUESTION.listing), 0), 5),
      "0x000f4240": 1000000n,
      "0x00010001": 65537n,
      "0xf": 15n,
      // w0 after mov w0, 1048575.
      "0x000fffff": x(runText("mov w0, 1048575\nret").final, 0),
      // w0 after mov w0, -1.
      "0xffffffff": x(runText("mov w0, -1\nret").final, 0),
    };
    // Every hexadecimal number the lesson writes is one of these, and equals the model's value.
    expect([...new Set(hexes)].filter((h) => !(h in value))).toEqual([]);
    expect(hexes.length).toBeGreaterThan(0);
    for (const h of hexes) expect(BigInt(h), h).toBe(value[h]);
  });

  it("agrees with the model on every pinned result", () => {
    const odometer = run(build(assemblyOf(parseListing(SERVICE_AND_ODOMETER.listing))), {
      entry: "odometer_limit",
    });
    const results = [
      x(stateAfter(odometer, 0), 0),
      x(odometer.final, 0),
      x(runText("mov w0, 30000\nret").final, 0),
      x(runText("mov w0, -1\nret").final, 0),
      x(runText("mov w0, 1048575\nret").final, 0),
    ].map(Number);
    for (const n of results) expect(model.has(n), String(n)).toBe(true);
  });
});

function stateAfterWidths() {
  const result = run(build(assemblyOf(parseListing(WIDTHS.listing))), { entry: TEXT_BASE });
  return stateAfter(result, 1);
}
