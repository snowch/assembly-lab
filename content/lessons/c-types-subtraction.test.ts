// Copyright © 2026 Christopher Snow

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { assemble, run } from "@al/machine";
import { assemblyOf, parseListing } from "@al/views";
import { TRIP_REMAINING, TRIP_REMAINING_U } from "./module-1.listings";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");
const records = "../../docs/notes/module-1/c-types-subtraction/";

describe("the two C subtraction recordings", () => {
  for (const [suffix, shown] of [
    ["", TRIP_REMAINING],
    ["_u", TRIP_REMAINING_U],
  ] as const) {
    it(`preserves the actual compiler source and instructions for trip_remaining${suffix}`, () => {
      const request = JSON.parse(read(`${records}request${suffix}.json`));
      const response = JSON.parse(read(`${records}response${suffix}.json`));
      expect(request.source).toBe(shown.c);
      expect(request.options.userArguments).toBe("-O1 -g");
      expect(response.code).toBe(0);
      const name = `trip_remaining${suffix}`;
      const actual = response.asm
        .filter(
          (line: { text: string }) =>
            line.text.trim() === `${name}:` || /^(sub\s|ret\b)/.test(line.text.trim()),
        )
        .map(
          (line: { text: string; source: { line: number } | null }) =>
            line.text.trim() + (line.source ? ` C${line.source.line}` : ""),
        )
        .join("\n");
      expect(parseListing(shown.listing)).toEqual(parseListing(actual));
      expect(shown.sourceLines).toEqual([[3], [3]]);
      expect(shown.c.split("\n")[2]).toContain("return planned - travelled;");
      const { program } = assemble(assemblyOf(parseListing(shown.listing)));
      expect(program).not.toBeNull();
      const result = run(program!, {
        entry: name,
        args: [3, 5].map((value) => ({ value: BigInt(value), width: 32 as const })),
      });
      expect(result.stop.kind).toBe("returned");
      const bits = BigInt.asUintN(32, result.final.x[0]!);
      expect(bits.toString(16)).toBe("fffffffe");
      expect(BigInt.asIntN(32, bits)).toBe(-2n);
      expect(bits).toBe(4294967294n);
    });
  }

  it("runs the displayed compiler instructions and both page calls in the GNU/QEMU corpus", () => {
    const corpus = read("../../scripts/real-tools/corpus/module1-c-types.s");
    expect(assemblyOf(parseListing(corpus.replace(/^\/\/.*\n/gm, "")))).toBe(
      assemblyOf(parseListing([TRIP_REMAINING.listing, TRIP_REMAINING_U.listing].join("\n"))),
    );
    const spec = JSON.parse(read("../../scripts/real-tools/corpus/module1-c-types.json"));
    expect(spec.calls).toEqual(
      ["trip_remaining", "trip_remaining_u"].map((entry) => ({
        entry,
        args: [
          ["3", 32],
          ["5", 32],
        ],
      })),
    );
  });
});
