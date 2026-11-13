// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";
import { PLUS } from "../../../../content/lessons/adding-and-the-flags.listings";
import { flagsModel } from "./model";
import { readFileSync } from "node:fs";
import { PROSE } from "../../../../content/lessons/adding-and-the-flags.prose";

describe("additional flag practice contrasts", () => {
  it("includes all added inputs in the GNU/QEMU differential corpus", () => {
    const corpus = JSON.parse(
      readFileSync(
        new URL("../../../../scripts/real-tools/corpus/module2-flags.json", import.meta.url),
        "utf8",
      ),
    ) as { calls: { entry: string; args: [string, number][] }[] };
    for (const [a, b] of [
      [0x7ffffffe, 2],
      [0xfffffff9, 2],
      [0, 0],
    ])
      expect(
        corpus.calls.some(
          (call) =>
            call.entry === "plus" &&
            call.args[0]?.[0] === String(a) &&
            call.args[1]?.[0] === String(b),
        ),
      ).toBe(true);
  });
  it("sets V without C when the positive signed sum exceeds its range", () => {
    const model = flagsModel(PLUS, 32, 0x7ffffffe, 2);
    expect(model.result).toMatchObject({
      hex: "0x80000000",
      unsigned: "2147483648",
      signed: "-2147483648",
    });
    expect(model.unsignedSum).toBe("2147483648");
    expect(model.signedSum).toBe("2147483648");
    expect(model.flags).toEqual({ n: 1, z: 0, c: 0, v: 1 });
  });

  it("has a negative reading while both exact sums fit", () => {
    const model = flagsModel(PLUS, 32, 0xfffffff9, 2);
    expect(model.result).toMatchObject({ hex: "0xfffffffb", unsigned: "4294967291", signed: "-5" });
    expect(model.unsignedSum).toBe("4294967291");
    expect(model.signedSum).toBe("-5");
    expect(model.a.signed).toBe("-7");
    expect(model.flags).toEqual({ n: 1, z: 0, c: 0, v: 0 });
  });
  it("keeps the final answer hint accurate for every added case", () => {
    for (const [label, a, b] of [
      ["`0x7ffffffe` plus 2", 0x7ffffffe, 2],
      ["`0xfffffff9` plus 2", 0xfffffff9, 2],
      ["0 plus 0", 0, 0],
    ] as const) {
      const flags = flagsModel(PLUS, 32, a, b).flags;
      expect(PROSE.flagsHints.at(-1)).toContain(
        `${label} gives N ${flags.n}, Z ${flags.z}, C ${flags.c} and V ${flags.v}.`,
      );
    }
  });

  it("sets Z with neither carry nor signed overflow", () => {
    const model = flagsModel(PLUS, 32, 0, 0);
    expect(model.result).toMatchObject({ hex: "0x00000000", unsigned: "0", signed: "0" });
    expect(model.unsignedSum).toBe("0");
    expect(model.signedSum).toBe("0");
    expect(model.flags).toEqual({ n: 0, z: 1, c: 0, v: 0 });
  });
});
