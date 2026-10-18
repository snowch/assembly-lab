// Copyright © 2026 Christopher Snow
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { assemble, run } from "@al/machine";
import * as A from "./arrays.listings";
const file = (p: string) => readFileSync(new URL(`../../${p}`, import.meta.url), "utf8");
const plain = (s: string) => s.replace(/ C\d+$/gm, "");
const normal = (s: string) =>
  plain(s)
    .split("\n")
    .map((s) => s.trim().replace(/\s+/g, " "))
    .filter((s) => s && !s.startsWith("//"))
    .join("\n");
function execute(
  program: { listing: string },
  args: (number | bigint)[],
  bytes: readonly number[],
) {
  const a = assemble(`${plain(program.listing)}\n.data\nsensor:\n.byte ${bytes.join(",")}`);
  if (!a.program) throw Error(JSON.stringify(a.errors));
  return run(a.program, {
    entry: 0x400000,
    args: args.map((value) => ({ value: BigInt(value), width: 64 })),
    maxSteps: 200,
  });
}
const compiled = { read_trip: A.READ_TRIP, sum_trips: A.SUM_TRIPS, label_length: A.LABEL_LENGTH };
it.each(Object.entries(compiled))(
  "%s matches the recorded GCC source, options, instructions and mappings",
  (name, shown) => {
    const base = `docs/notes/module-7/compiler/${name}`;
    const source = file(base + ".c"),
      request = JSON.parse(file(base + ".request.json")),
      response = JSON.parse(file(base + ".response.json"));
    expect(request.source).toBe(source);
    expect(request.options.userArguments).toBe("-O1");
    expect(source.split("\n").slice(1).join("\n").trimEnd()).toBe(shown.c);
    expect(response.code).toBe(0);
    expect(shown.listing).toBe(
      response.asm
        .map(
          (row: { text: string; source?: { line: number } | null }) =>
            row.text.trim().replace(/\s+/g, " ") + (row.source ? ` C${row.source.line - 1}` : ""),
        )
        .join("\n"),
    );
    expect(
      normal(
        file(`scripts/real-tools/corpus/module7-${name.replaceAll("_", "-")}.s`).split(".data")[0]!,
      ),
    ).toBe(normal(shown.listing));
    expect(file("docs/notes/module-7/listings.md")).toContain(shown.listing);
  },
);
it.each([
  ["offset", A.OFFSET],
  ["pre-index", A.PRE_INDEX],
  ["post-index", A.POST_INDEX],
  ["wrong-scale", A.WRONG_SCALE],
  ["walk-label", A.WALK_LABEL],
  ["wrong-terminator", A.WRONG_TERMINATOR],
  ["read-trip-reference", { listing: `read_trip_reference:\n${A.READ_TRIP_TEXT}` }],
  ["sum-trips-reference", { listing: `sum_trips_reference:\n${A.SUM_TRIPS_TEXT}` }],
  ["label-length-reference", { listing: `label_length_reference:\n${A.LENGTH_TEXT}` }],
  ["count-marker-reference", { listing: `count_marker_reference:\n${A.COUNT_MARKER_TEXT}` }],
] as const)("%s has the exact course-authored instructions in the QEMU corpus", (name, program) =>
  expect(normal(file(`scripts/real-tools/corpus/module7-${name}.s`).split(".data")[0]!)).toBe(
    normal(program.listing),
  ),
);
describe("array facts", () => {
  it("scales index2 by four, loads7, and leaves the index unchanged", () => {
    const r = execute(A.READ_TRIP, [A.LOG_ADDRESS, 2], A.TRIP_BYTES);
    expect(r.stop.kind).toBe("returned");
    expect(r.final.x[0]).toBe(7n);
    expect(r.final.x[1]).toBe(2n);
    expect(r.steps[0]!.loads).toEqual([{ address: A.LOG_ADDRESS + 8, size: 4 }]);
  });
  it.each([
    [A.OFFSET, 25, A.LOG_ADDRESS, A.LOG_ADDRESS + 4],
    [A.PRE_INDEX, 25, A.LOG_ADDRESS + 4, A.LOG_ADDRESS + 4],
    [A.POST_INDEX, 12, A.LOG_ADDRESS + 4, A.LOG_ADDRESS],
  ] as const)(
    "addressing mode selects bytes independently from writeback",
    (program, value, pointer, address) => {
      const r = execute(program, [A.LOG_ADDRESS], A.TRIP_BYTES);
      expect(r.stop.kind).toBe("returned");
      expect(r.final.x[2]).toBe(BigInt(value));
      expect(r.final.x[0]).toBe(BigInt(pointer));
      expect(r.steps[0]!.loads).toEqual([{ address, size: 4 }]);
    },
  );
  it("missing scale starts halfway through an element and crosses into its neighbour", () => {
    const r = execute(A.WRONG_SCALE, [A.LOG_ADDRESS, 2], A.TRIP_BYTES);
    expect(r.final.x[0]).toBe(1638400n);
    expect(r.steps[0]!.loads[0]!.address).toBe(A.LOG_ADDRESS + 2);
    expect(A.TRIP_BYTES.slice(2, 6)).toEqual([0, 0, 25, 0]);
  });
  it("compiler and reference sum agree, including empty and wrapping totals", () => {
    for (const [values, count, want] of [
      [A.TRIP_VALUES, 0, 0],
      [A.TRIP_VALUES, 1, 12],
      [A.TRIP_VALUES, 3, 44],
      [A.TRIP_VALUES, 4, 84],
      [[0xffffffff, 2], 2, 1],
    ] as const) {
      for (const program of [A.SUM_TRIPS, { listing: `sum_reference:\n${A.SUM_TRIPS_TEXT}` }]) {
        const r = execute(program, [A.LOG_ADDRESS, count], A.tripBytes(values));
        expect(r.stop.kind).toBe("returned");
        expect(r.final.x[0]).toBe(BigInt(want));
        expect(r.steps.flatMap((s) => s.loads).map((l) => l.address)).toEqual(
          Array.from({ length: count }, (_, i) => A.LOG_ADDRESS + i * 4),
        );
        if (count > 0) expect(r.final.x[2]).toBe(BigInt(A.LOG_ADDRESS + count * 4));
      }
    }
  });
});
describe("string facts", () => {
  it("records ASCII bytes, including digit zero as48", () => {
    expect(new TextEncoder().encode("A-B-C\0X\0")).toEqual(new Uint8Array(A.LABEL_BYTES));
    expect(new TextEncoder().encode("0")[0]).toBe(48);
  });
  it.each([
    [A.LABEL_BYTES, 8, 5],
    [[0, 88], 2, 0],
    [[65], 0, 0],
    [[65, 66, 67], 3, 3],
    [[65, 0, 66, 67], 4, 1],
  ] as const)(
    "bounded scan agrees with the reference and never reads beyond its capacity",
    (bytes, capacity, want) => {
      for (const program of [A.LABEL_LENGTH, { listing: `length_reference:\n${A.LENGTH_TEXT}` }]) {
        const r = execute(program, [A.LOG_ADDRESS, capacity], bytes);
        expect(r.stop.kind).toBe("returned");
        expect(r.final.x[0]).toBe(BigInt(want));
        expect(
          r.steps.flatMap((s) => s.loads).every((l) => l.address < A.LOG_ADDRESS + capacity),
        ).toBe(true);
      }
    },
  );
  it("moving pointer counts five bytes and stops after reading the first terminator", () => {
    const r = execute(A.WALK_LABEL, [A.LOG_ADDRESS], A.LABEL_BYTES);
    expect(r.final.x[0]).toBe(5n);
    expect(r.final.x[2]).toBe(BigInt(A.LOG_ADDRESS + 6));
    expect(r.steps.flatMap((s) => s.loads)).toHaveLength(6);
    const empty = execute(A.WALK_LABEL, [A.LOG_ADDRESS], [0, 88]);
    expect(empty.final.x[0]).toBe(0n);
  });
  it("counting before the zero test incorrectly includes the terminator", () => {
    expect(execute(A.WRONG_TERMINATOR, [A.LOG_ADDRESS], A.LABEL_BYTES).final.x[0]).toBe(6n);
    expect(execute(A.WRONG_TERMINATOR, [A.LOG_ADDRESS], [0, 88]).final.x[0]).toBe(1n);
  });
  it.each([
    [A.LABEL_BYTES, 45, 2],
    [[0, 45], 45, 0],
    [[65, 0, 45], 45, 0],
    [[45, 45, 45, 0], 45, 3],
    [[48, 45, 48, 0], 48, 2],
  ] as const)("counts markers only before the terminator", (bytes, marker, want) => {
    const r = execute(
      { listing: `count_marker_reference:\n${A.COUNT_MARKER_TEXT}` },
      [A.LOG_ADDRESS, marker],
      bytes,
    );
    expect(r.stop.kind).toBe("returned");
    expect(r.final.x[0]).toBe(BigInt(want));
    expect(r.steps.flatMap((s) => s.loads).at(-1)!.address).toBe(A.LOG_ADDRESS + bytes.indexOf(0));
  });
});
