// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";

import { memoryRegister, memoryTransferAt } from "./memoryFigure";
import { memoryAt, traceOf } from "./trace";

const base = 0x410000;
function trace(instruction: string, memory = [0xf9, 0x12, 0x34, 0x56]) {
  return traceOf(
    { listing: `f:\n ${instruction}\n ret` },
    {
      entry: "f",
      args: [
        { value: "0x410000", width: 64 },
        { value: "0xffffffffffffffff", width: 64 },
      ],
      memory,
    },
  );
}

describe("memory transfer views", () => {
  it("reads address order and register byte order from a model load", () => {
    const t = trace("ldr w1, [x0]");
    const transfer = memoryTransferAt(t, 1)!;
    expect(transfer.address).toBe(base);
    expect(
      transfer.bytes.filter((b) => b.role === "loaded").map((b) => [b.address, b.value]),
    ).toEqual([
      [base + 3, 0x56],
      [base + 2, 0x34],
      [base + 1, 0x12],
      [base, 0xf9],
    ]);
    expect(memoryRegister(t, 1, "w1")).toBe("0x563412f9");
    expect(memoryTransferAt(t, 0)).toBeNull();
    expect(memoryTransferAt(t, 2)).toBeNull();
  });

  it.each([
    [
      "ldrb w1, [x0]",
      "00000000000000f9",
      [
        "clearedUpper",
        "clearedUpper",
        "clearedUpper",
        "clearedUpper",
        "zeroFill",
        "zeroFill",
        "zeroFill",
        "loaded",
      ],
    ],
    [
      "ldrsb w1, [x0]",
      "00000000fffffff9",
      [
        "clearedUpper",
        "clearedUpper",
        "clearedUpper",
        "clearedUpper",
        "signFill",
        "signFill",
        "signFill",
        "loaded",
      ],
    ],
    [
      "ldrsb x1, [x0]",
      "fffffffffffffff9",
      [
        "signFill",
        "signFill",
        "signFill",
        "signFill",
        "signFill",
        "signFill",
        "signFill",
        "loaded",
      ],
    ],
  ])("draws actual extension bits for %s", (instruction, value, roles) => {
    const t = trace(instruction as string);
    const transfer = memoryTransferAt(t, 1)!;
    expect(memoryRegister(t, 1, "x1")).toBe(`0x${value}`);
    expect(transfer.bytes.map((b) => b.role)).toEqual(roles);
    expect(transfer.bytes.map((b) => b.bits).join("")).toBe(
      BigInt(`0x${value as string}`)
        .toString(2)
        .padStart(64, "0"),
    );
  });

  it("sign filling a positive byte copies zero bits, not hardcoded ones", () => {
    const t = trace("ldrsb x1, [x0]", [0x79]);
    const transfer = memoryTransferAt(t, 1)!;
    expect(transfer.bytes.filter((b) => b.role === "signFill").map((b) => b.value)).toEqual([
      0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it("stores only selected low bytes and rewinds the visible memory", () => {
    const t = trace("strb w1, [x0]");
    expect(memoryAt(t, 0, base, 4)).toEqual([0xf9, 0x12, 0x34, 0x56]);
    expect(memoryAt(t, 1, base, 4)).toEqual([0xff, 0x12, 0x34, 0x56]);
    expect(
      memoryTransferAt(t, 1)!
        .bytes.filter((b) => b.address !== null)
        .map((b) => [b.address, b.value]),
    ).toEqual([[base, 0xff]]);
  });

  it("keeps all 64 address/value bits precise", () => {
    const t = trace("ret");
    expect(memoryRegister(t, 0, "x1")).toBe("0xffffffffffffffff");
    expect(memoryRegister(t, 0, "w1")).toBe("0xffffffff");
  });
});
