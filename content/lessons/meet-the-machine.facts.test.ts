// Copyright © 2026 Christopher Snow

// Every number Module 0 states, run on the model, and every listing it shows, held to the recorded
// file. The lesson's words say 205, 247 and 232; this test says what the simulator gives, so a
// number cannot be right in the prose and wrong in the machine. The listings are held to
// docs/notes/module-0/listings.md (ARM64 GCC 16.1.0, -O1): the lesson shows the C without that
// file's first line, so its C line numbers are the recorded ones minus one.

import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { assemble, run, stateAfter, type Program } from "@al/machine";
import { learnerText } from "@platform/lesson-schema";
import {
  assemblyOf,
  deleteLine,
  parseListing,
  traceOf,
  viewAt,
  wValue,
  wValueAsInt,
  type ListingLine,
} from "@al/views";

import { LESSONS } from ".";
import { PRIMITIVE_PROGRAMS, primitiveProgram } from "./meet-the-machine.primitives";
import {
  INCREMENT_INT,
  FUEL_USED_FIXED_TEXT,
  FUEL_USED_MISTAKEN_TEXT,
  KM_TO_SERVICE,
  TRIP_DISTANCE,
  TRIP_DISTANCE_AND_FUEL_USED,
} from "./meet-the-machine.listings";

const lesson = LESSONS.find((l) => l.id === "meet-the-machine")!;

describe("the first arithmetic applications", () => {
  it("gets each result from the model and retains the unmodified inputs", () => {
    const outcomes = PRIMITIVE_PROGRAMS.map((item) => {
      const trace = traceOf(primitiveProgram(item), { entry: item.entry, args: [...item.args] });
      const view = viewAt(trace, item.instructions.length);
      return item.registers.map((register) => wValue(view.state, register));
    });
    expect(outcomes).toEqual([
      [12, 7, 19],
      [8],
      [14, 19, 5],
      [13, 4],
      [20, 14],
      [8, 3, 8],
      [7, 8],
      [8],
      [10, 13],
      [12, 5],
    ]);
  });

  it("keeps every displayed arithmetic snippet in the real-tool corpus", () => {
    for (const item of PRIMITIVE_PROGRAMS) {
      const name =
        item.entry === "increment_int"
          ? "module0-increment"
          : item.entry === "add_ints"
            ? "module0-add-ints"
            : "module0-primitives";
      const source = readFileSync(
        new URL(`../../scripts/real-tools/corpus/${name}.s`, import.meta.url),
        "utf8",
      );
      const calls = JSON.parse(
        readFileSync(
          new URL(`../../scripts/real-tools/corpus/${name}.json`, import.meta.url),
          "utf8",
        ),
      );
      expect(
        assemblyOf(
          parseListing(
            source
              .split("\n")
              .filter((line) => !line.startsWith("//"))
              .join("\n"),
          ),
        ),
      ).toContain(assemblyOf(parseListing(primitiveProgram(item).listing)).trim());
      expect(calls.calls).toContainEqual({
        ...(item.kind === "function" ? {} : { entry: item.entry }),
        args: item.args.map((value) => [String(value), 32]),
      });
    }
  });
});

// ---------------------------------------------------------------------------------------------
// The recorded file

const recorded = readFileSync(
  new URL("../../docs/notes/module-0/listings.md", import.meta.url),
  "utf8",
);

/** The fenced blocks under the heading `## <title>`, as [language, text]. */
function blocksUnder(title: string): [string, string][] {
  const start = recorded.indexOf(`\n## ${title}\n`);
  if (start < 0) throw new Error(`listings.md has no heading ${title}`);
  const rest = recorded.slice(start + 1);
  const end = rest.indexOf("\n## ", 3);
  const section = end < 0 ? rest : rest.slice(0, end);
  return [...section.matchAll(/```(\w*)\n([\s\S]*?)```/g)].map((m) => [
    m[1] as string,
    m[2] as string,
  ]);
}

/** The recorded C without its first line, and the recorded listing. */
function recordedProgram(title: string) {
  const blocks = blocksUnder(title);
  const c = blocks.find(([lang]) => lang === "c")![1];
  const listing = blocks.find(([lang]) => lang === "")![1];
  const cLines = c.replace(/\n+$/, "").split("\n");
  expect(cLines[0], "the recorded C starts with the copyright line").toMatch(/^\/\/ Copyright/);
  return { cShown: cLines.slice(1), listing: parseListing(listing) };
}

const m0b = recordedProgram("`m0b.c`");
const m0c = recordedProgram("`m0c.c`");
const increment = recordedProgram("`increment_int.c`");

/** The listing with every recorded C line number lowered by one, as the lesson shows it. */
const shown = (lines: ListingLine[]): ListingLine[] =>
  lines.map((l) =>
    l.kind === "instruction" ? { ...l, cLine: l.cLine === null ? null : l.cLine - 1 } : l,
  );

const cOf = (c: string) => c.split("\n");

describe("the listings the lesson shows", () => {
  it("names the compiler and the setting the recorded file records", () => {
    expect(recorded).toContain("ARM64 GCC 16.1.0");
    expect(recorded).toContain("flags `-O1`");
  });

  it("keeps the increment source, emitted instructions and original debug references unchanged", () => {
    expect(cOf(INCREMENT_INT.c)).toEqual(increment.cShown);
    expect(parseListing(INCREMENT_INT.listing)).toEqual(shown(increment.listing));
    expect(INCREMENT_INT.sourceLines).toEqual([[3], [3]]);
    const response = JSON.parse(
      readFileSync(
        new URL("../../docs/notes/module-0/increment/response.json", import.meta.url),
        "utf8",
      ),
    );
    expect(response.code).toBe(0);
    expect(
      response.asm.map((row: { text: string; source: { line: number } | null }) => ({
        text: row.text.trim().replace(/\s+/g, " "),
        cLine: row.source ? row.source.line - 1 : null,
      })),
    ).toEqual([
      { text: "increment_int:", cLine: null },
      { text: "add w0, w0, 1", cLine: 4 },
      { text: "ret", cLine: 4 },
    ]);
  });

  it("show trip_distance's C and instructions as recorded, C line numbers one less", () => {
    expect(cOf(TRIP_DISTANCE.c)).toEqual(m0b.cShown.slice(0, 7));
    expect(parseListing(TRIP_DISTANCE.listing)).toEqual(shown(m0b.listing).slice(0, 5));
  });

  it("show trip_distance and fuel_used together as recorded", () => {
    expect(cOf(TRIP_DISTANCE_AND_FUEL_USED.c)).toEqual(m0b.cShown);
    expect(parseListing(TRIP_DISTANCE_AND_FUEL_USED.listing)).toEqual(shown(m0b.listing));
  });

  it("show km_to_service's C and instructions as recorded, C line numbers one less", () => {
    expect(cOf(KM_TO_SERVICE.c)).toEqual(m0c.cShown.slice(0, 7));
    expect(parseListing(KM_TO_SERVICE.listing)).toEqual(shown(m0c.listing).slice(0, 6));
  });

  it("start the construction challenge from the recorded mistaken fuel_used, and fix it to the recorded one", () => {
    const text = (lines: ListingLine[]) =>
      lines.flatMap((l) => (l.kind === "instruction" ? [l.text] : []));
    expect(parseListing(FUEL_USED_MISTAKEN_TEXT).map((l) => (l as { text: string }).text)).toEqual(
      text(m0c.listing.slice(7)),
    );
    expect(parseListing(FUEL_USED_FIXED_TEXT).map((l) => (l as { text: string }).text)).toEqual(
      text(m0b.listing.slice(5)),
    );
  });

  it("record the last subtraction of trip_distance and of km_to_service against the closing brace", () => {
    const braceOf = (c: string[]) => c.findIndex((line, i) => i > 0 && line === "}") + 1;
    const lines = (p: { listing: string }) =>
      parseListing(p.listing).flatMap((l) => (l.kind === "instruction" ? [l] : []));
    expect(lines(TRIP_DISTANCE).at(-2)?.cLine).toBe(braceOf(cOf(TRIP_DISTANCE.c)));
    expect(lines(KM_TO_SERVICE).at(-2)?.cLine).toBe(braceOf(cOf(KM_TO_SERVICE.c)));
  });

  it("are the programs the differential test runs against QEMU, with the ret deleted for the failure experiment", () => {
    const corpus = (name: string) =>
      assemblyOf(
        parseListing(
          readFileSync(
            new URL(`../../scripts/real-tools/corpus/${name}.s`, import.meta.url),
            "utf8",
          )
            .split("\n")
            .filter((l) => !l.startsWith("//"))
            .join("\n"),
        ),
      );
    const text = (p: { listing: string }) => assemblyOf(parseListing(p.listing));
    expect(corpus("module0-trip")).toBe(text(TRIP_DISTANCE_AND_FUEL_USED));
    expect(corpus("module0-noret")).toBe(
      assemblyOf(
        deleteLine(parseListing(TRIP_DISTANCE_AND_FUEL_USED.listing), {
          label: "trip_distance",
          text: "ret",
        }),
      ),
    );
    expect(corpus("module0-km")).toBe(
      assemblyOf(
        parseListing(
          [KM_TO_SERVICE.listing, "fuel_used:", ...FUEL_USED_MISTAKEN_TEXT.split("\n")].join("\n"),
        ),
      ),
    );
  });

  it("make twenty instructions of trip_distance at -O0, as the lesson says", () => {
    const o0 = blocksUnder("`m0b.c` at `-O0`")[0]![1];
    const instructions = parseListing(o0.slice(0, o0.indexOf("fuel_used:")));
    expect(instructions.filter((l) => l.kind === "instruction")).toHaveLength(20);
  });
});

// ---------------------------------------------------------------------------------------------
// The model

const build = (text: string): Program => {
  const { program, errors } = assemble(text);
  if (!program) throw new Error(errors.map((e) => e.key).join(", "));
  return program;
};
const call = (program: Program, entry: string | number, args: number[]) =>
  run(program, { entry, args: args.map((value) => ({ value: BigInt(value), width: 32 })) });
const w = (state: { x: bigint[] }, n: number) => Number(state.x[n]! & 0xffffffffn);

describe("trip_distance(120, 85, 42, 15)", () => {
  const program = build(assemblyOf(parseListing(TRIP_DISTANCE.listing)));
  const result = call(program, "trip_distance", [120, 85, 42, 15]);

  it("leaves 205, then 247, then 232 in w0, and never changes w1, w2 or w3", () => {
    expect([0, 1, 2].map((k) => w(stateAfter(result, k), 0))).toEqual([205, 247, 232]);
    for (let k = 0; k < 4; k++) {
      const s = stateAfter(result, k);
      expect([w(s, 1), w(s, 2), w(s, 3)]).toEqual([85, 42, 15]);
    }
  });

  it("runs four instructions, and ret ends the run with 232 in w0", () => {
    expect(result.steps.map((s) => s.text)).toEqual([
      "add w0, w0, w1",
      "add w0, w0, w2",
      "sub w0, w0, w3",
      "ret",
    ]);
    expect(result.stop.kind).toBe("returned");
    expect(w(result.final, 0)).toBe(232);
  });

  it("writes w0 with the first instruction, and that is the only register it writes", () => {
    expect(result.steps[0]!.writes.map((x) => x.reg)).toEqual([0]);
  });

  it("agrees with the figure's own view of the run", () => {
    const trace = traceOf(TRIP_DISTANCE, { entry: "trip_distance", args: [120, 85, 42, 15] });
    expect([1, 2, 3].map((k) => wValue(viewAt(trace, k).state, 0))).toEqual([205, 247, 232]);
    expect(viewAt(trace, 4).stop).toEqual({ kind: "returned" });
  });
});

describe("trip_distance with ret deleted", () => {
  const lines = deleteLine(parseListing(TRIP_DISTANCE_AND_FUEL_USED.listing), {
    label: "trip_distance",
    text: "ret",
  });
  const result = call(build(assemblyOf(lines)), "trip_distance", [120, 85, 42, 15]);

  it("runs fuel_used's sub next: w0 becomes 232 minus 85, which is 147, in five instructions", () => {
    expect(result.steps).toHaveLength(5);
    expect(result.steps.map((s) => s.text)).toEqual([
      "add w0, w0, w1",
      "add w0, w0, w2",
      "sub w0, w0, w3",
      "sub w0, w0, w1",
      "ret",
    ]);
    expect(w(stateAfter(result, 2), 0)).toBe(232);
    expect(result.stop.kind).toBe("returned");
    expect(w(result.final, 0)).toBe(147);
  });

  it("does not stop with an error, so the prediction's right option is 147", () => {
    expect(result.stop.kind).not.toBe("fault");
  });
});

describe("fuel_used", () => {
  const mistaken = build(FUEL_USED_MISTAKEN_TEXT);
  const fixed = build(FUEL_USED_FIXED_TEXT);
  const calls: [number, number][] = [
    [50, 38],
    [45, 45],
    [60, 5],
  ];

  it("returns -12 for the mistaken fuel_used(50, 38)", () => {
    expect(wValueAsInt(call(mistaken, 0x400000, [50, 38]).final, 0)).toBe(-12);
  });

  it("fails all three calls but (45, 45), as written by mistake", () => {
    const got = calls.map(([a, b]) => wValueAsInt(call(mistaken, 0x400000, [a, b]).final, 0));
    expect(got).toEqual([-12, 0, -55]);
  });

  it("returns 12, 0 and 55 once corrected", () => {
    const got = calls.map(([a, b]) => wValueAsInt(call(fixed, 0x400000, [a, b]).final, 0));
    expect(got).toEqual([12, 0, 55]);
  });
});

describe("km_to_service(30000, 28750, 140, 390)", () => {
  const program = build(assemblyOf(parseListing(KM_TO_SERVICE.listing)));
  const result = call(program, "km_to_service", [30000, 28750, 140, 390]);

  it("leaves 1250, 1110, 720 and then 670 in w0", () => {
    expect([0, 1, 2, 3].map((k) => w(stateAfter(result, k), 0))).toEqual([1250, 1110, 720, 670]);
  });

  it("runs five instructions and returns with 670 in w0 and w1 still 28750", () => {
    expect(result.steps).toHaveLength(5);
    expect(result.stop.kind).toBe("returned");
    expect([w(result.final, 0), w(result.final, 1)]).toEqual([670, 28750]);
  });

  it("is what the challenge's reference answers", () => {
    const c = lesson.challenges.find((x) => x.id === "trace-the-call")!;
    expect(c.reference.answers).toEqual({ w0: "670", w1: "28750" });
  });
});

// ---------------------------------------------------------------------------------------------
// Every number the learner reads

describe("every number the lesson states", () => {
  // The numbers of the calls, and what the model gives for them. A number in the lesson's words
  // that is in no list here is a number nothing pins.
  const model = new Set<number>([
    // trip_distance's arguments, and its w0 after each of its first three instructions, and 232 - 85.
    120,
    85, 42, 15, 205, 247, 232, 147,
    // km_to_service's arguments and its results, and the 50 in its listing.
    30000, 28750, 140, 390, 1250, 1110, 720, 670, 50,
    // A register's 32 bits.
    32,
    // The wrong option "0" that the prediction about ret offers: not a fact the lesson states.
    0,
    // The compiler and the processor, from the recorded file's header.
    16.1, 64,
    // C line 7, the closing brace that GCC records the last two instructions against (held to the
    // recorded listing below), and Module 1, which the lesson points to for the rest of a register.
    7, 1,
    // Lines 5 and 6, which the last sub does the work of, and -O0's 20 instructions for
    // trip_distance with its subtraction recorded against line 5 (held to the recorded file below).
    5, 6, 20,
    // Part 3, which names w0 to w3 registers.
    3,
    // The closing question: before `sub w1, w2, w1`, w1 holds 5 and w2 holds 9; afterwards w1 is 4.
    // (Held to the model below.)
    9, 4,
  ]);

  it("is pinned: each is an argument of a call, a result of the model, or a fact the recorded file states", () => {
    // Names such as w0, leg1 and -O1 hold digits that are not numbers.
    const text = learnerText(lesson)
      .join("\n")
      .replace(/[A-Za-z_][A-Za-z_0-9]*/g, " ");
    const numbers = [...text.matchAll(/\d+(?:\.\d+)?/g)].map((m) => Number(m[0]));
    expect(numbers.length).toBeGreaterThan(20);
    expect(numbers.filter((n) => !model.has(n))).toEqual([]);
  });

  it("records the last two instructions of trip_distance against C line 7, the closing brace", () => {
    const lines = parseListing(TRIP_DISTANCE.listing);
    const lastTwo = lines.slice(-2).map((l) => (l.kind === "instruction" ? l.cLine : null));
    expect(lastTwo).toEqual([7, 7]);
  });

  it("records, at -O0, 20 instructions for trip_distance, its subtraction against line 5", () => {
    const listing = blocksUnder("`m0b.c` at `-O0`").find(([lang]) => lang === "")![1];
    const body = listing.slice(listing.indexOf("trip_distance:"), listing.indexOf("fuel_used:"));
    const instructions = body.split("\n").filter((l) => /^\s+[a-z]/.test(l));
    expect(instructions).toHaveLength(20);
    // The recorded file's C starts with a copyright line, which the lesson leaves out: its line
    // numbers are one more than the page's.
    const sub = instructions.filter((l) => /^\s+sub\s+w0, w1, w0/.test(l));
    expect(sub.map((l) => Number(/C(\d+)\s*$/.exec(l)![1]) - 1)).toEqual([5]);
    // The lines the -O1 sub does the work of.
    const c = TRIP_DISTANCE.c.split("\n");
    expect(c[4]!.trim()).toBe("total = total - detour;");
    expect(c[5]!.trim()).toBe("return total;");
  });

  it("agrees with the model on every pinned result", () => {
    const trip = call(
      build(assemblyOf(parseListing(TRIP_DISTANCE.listing))),
      "trip_distance",
      [120, 85, 42, 15],
    );
    const km = call(
      build(assemblyOf(parseListing(KM_TO_SERVICE.listing))),
      "km_to_service",
      [30000, 28750, 140, 390],
    );
    const results = [
      ...[0, 1, 2].map((k) => w(stateAfter(trip, k), 0)),
      ...[0, 1, 2, 3].map((k) => w(stateAfter(km, k), 0)),
      w(stateAfter(trip, 2), 0) - 85,
    ];
    for (const n of results) expect(model.has(n), String(n)).toBe(true);
    expect(wValue(trip.final, 1)).toBe(85);
  });
});

describe("increment_int: preparing a result and returning are different steps", () => {
  it("takes the argument in w0 and preserves its prepared result through ret", () => {
    const trace = traceOf(INCREMENT_INT, { entry: "increment_int", args: [7] });
    const views = [0, 1, 2].map((k) => viewAt(trace, k));
    expect(views.map((view) => wValue(view.state, 0))).toEqual([7, 8, 8]);
    expect([...views[1]!.written]).toEqual([0]);
    expect([...views[2]!.written]).toEqual([]);
    expect(views.map((view) => view.stop?.kind ?? null)).toEqual([null, null, "returned"]);
    expect(trace.lines[views[1]!.next!]!.kind).toBe("instruction");
    expect(views[2]!.next).toBeNull();
  });
});
