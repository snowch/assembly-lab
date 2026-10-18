// Copyright © 2026 Christopher Snow

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { assemble, run } from "@al/machine";
import {
  LIMIT_TRIP_A32,
  LIMIT_TRIP_A64,
  SERVICE_MARKER_A32,
  SERVICE_MARKER_A64,
  AVERAGE_TRIP_A32,
  AVERAGE_TRIP_A64,
} from "./a32.listings";

const records = new URL("../../docs/notes/module-a/compiler/", import.meta.url);
const read = (file: string) => readFileSync(new URL(file, records), "utf8");
const plain = (listing: string) => listing.replace(/ C\d+$/gm, "");
const normal = (listing: string) =>
  plain(listing)
    .split("\n")
    .map((line) => line.trim().replace(/\s+/g, " "))
    .filter((line) => line && !line.startsWith("//"))
    .join("\n");
describe("Optional A's actual compiler records", () => {
  it.each([
    ["limit_trip", "a32", LIMIT_TRIP_A32],
    ["limit_trip", "a64", LIMIT_TRIP_A64],
    ["service_marker", "a32", SERVICE_MARKER_A32],
    ["service_marker", "a64", SERVICE_MARKER_A64],
    ["average_trip", "a32", AVERAGE_TRIP_A32],
    ["average_trip", "a64", AVERAGE_TRIP_A64],
  ] as const)(
    "%s %s is exactly the recorded source, output and source-line map",
    (name, target, shown) => {
      const source = read(`${name}.c`),
        request = JSON.parse(read(`${name}.${target}.request.json`));
      const response = JSON.parse(read(`${name}.${target}.response.json`)) as {
        code: number;
        asm: { text: string; source?: { line: number } | null }[];
      };
      expect(request.source).toBe(source);
      expect(request.options.userArguments).toBe(
        target === "a32" ? "-O1 -marm -march=armv7-a" : "-O1",
      );
      expect(response.code).toBe(0);
      expect(shown.c).toBe(source.split("\n").slice(1).join("\n").trim());
      expect(shown.listing).toBe(
        response.asm
          .map(
            (row) =>
              row.text.trim().replace(/\s+/g, " ") + (row.source ? ` C${row.source.line - 1}` : ""),
          )
          .join("\n"),
      );
      if (target === "a64") {
        const corpus = readFileSync(
          new URL(
            `../../scripts/real-tools/corpus/moduleA-${name.replaceAll("_", "-")}.s`,
            import.meta.url,
          ),
          "utf8",
        );
        expect(normal(corpus)).toBe(normal(shown.listing));
      }
    },
  );
  it("records conditional moves, wider immediates and baseline library division without an A32 execution claim", () => {
    expect(plain(LIMIT_TRIP_A32.listing)).toContain("movcs r0, r1");
    expect(plain(LIMIT_TRIP_A32.listing)).toContain("bx lr");
    expect(plain(SERVICE_MARKER_A32.listing)).toContain("movw r0, #1001");
    expect(plain(AVERAGE_TRIP_A32.listing)).toContain("bl __aeabi_uidiv");
    expect(plain(AVERAGE_TRIP_A32.listing)).toContain("push {r4, lr}");
    expect(plain(AVERAGE_TRIP_A32.listing)).toContain("pop {r4, pc}");
    expect(plain(AVERAGE_TRIP_A64.listing)).toContain("udiv w0, w0, w1");
    expect(assemble("movcs r0, r1\nret").program).toBeNull();
    expect(assemble("movcs w0, w1\nret").program).toBeNull();
  });
  it.each([
    [LIMIT_TRIP_A64, [80, 50], 50],
    [LIMIT_TRIP_A64, [20, 50], 20],
    [LIMIT_TRIP_A64, [50, 50], 50],
    [LIMIT_TRIP_A64, [0xffffffff, 0x80000000], 0x80000000],
    [SERVICE_MARKER_A64, [], 1001],
    [AVERAGE_TRIP_A64, [95, 4], 23],
    [AVERAGE_TRIP_A64, [0xffffffff, 1], 0xffffffff],
  ] as const)("pins the A64 result for call %j", (program, args, value) => {
    const assembled = assemble(plain(program.listing));
    expect(assembled.errors).toEqual([]);
    if (!assembled.program) throw new Error(program.listing);
    const result = run(assembled.program, {
      entry: 0x400000,
      args: args.map((value) => ({ value: BigInt(value), width: 32 })),
    });
    expect(result.stop.kind).toBe("returned");
    expect(Number(result.final.x[0])).toBe(value);
  });
});
