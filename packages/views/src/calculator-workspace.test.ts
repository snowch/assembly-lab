// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";
import { initialWorkspace, restoreWorkspace, workspaceCalculation } from "./calculator-workspace";

describe("header calculator working", () => {
  it.each([
    [32, "unsigned", "4294967295", "add", "1", "0", "4294967296"],
    [32, "unsigned", "0", "subtract", "1", "4294967295", "-1"],
    [32, "signed", "2147483647", "add", "1", "2147483648", "2147483648"],
    [64, "unsigned", "18446744073709551615", "add", "1", "0", "18446744073709551616"],
    [
      64,
      "signed",
      "9223372036854775808",
      "subtract",
      "1",
      "9223372036854775807",
      "-9223372036854775809",
    ],
  ] as const)(
    "retains exact inputs and bounded result: %s/%s/%s/%s/%s",
    (width, reading, pattern, operation, operand, result, full) => {
      const work = { ...initialWorkspace(), width, reading, pattern, operation, operand };
      const before = structuredClone(work);
      expect(workspaceCalculation(work)).toEqual({
        ok: true,
        trace: { a: pattern, b: operand, width, reading, operation, pattern: result, full },
      });
      expect(work).toEqual(before);
    },
  );

  it("uses hexadecimal operand patterns exactly, and treats shift amount as a decimal count", () => {
    expect(
      workspaceCalculation({
        ...initialWorkspace(),
        pattern: "4294967295",
        operandFormat: "hex",
        operand: "0xFFFF FFFF",
        operation: "subtract",
      }),
    ).toMatchObject({ ok: true, trace: { pattern: "0", b: "4294967295", full: "0" } });
    expect(
      workspaceCalculation({
        ...initialWorkspace(),
        width: 64,
        pattern: "983040",
        operation: "shift-left",
        shift: "32",
      }),
    ).toMatchObject({
      ok: true,
      trace: { a: "983040", b: "32", pattern: "4222124650659840", full: "4222124650659840" },
    });
    expect(
      workspaceCalculation({ ...initialWorkspace(), operation: "shift-left", shift: "32" }),
    ).toEqual({ ok: false, field: "shift", code: "shift" });
    expect(workspaceCalculation({ ...initialWorkspace(), operand: "4294967296" })).toEqual({
      ok: false,
      field: "operand",
      code: "range",
    });
  });

  it("migrates the old header snapshot without losing exact values or pending fields", () => {
    const migrated = restoreWorkspace({
      width: 64,
      reading: "signed",
      pattern: "18446744073709551615",
      entry: "pending value",
      operand: "-2",
      half: "lower",
      halfValue: "123",
      shift: "31",
      selected: 63,
      full: "-1",
      operation: "subtract",
    });
    expect(migrated).toMatchObject({
      view: "calculate",
      width: 64,
      reading: "signed",
      pattern: "18446744073709551615",
      entry: "pending value",
      operand: "-2",
      half: "lower",
      halfValue: "123",
      shift: "31",
      selected: 63,
      full: "-1",
      trace: null,
      operandFormat: "decimal",
    });
  });

  it("recomputes restored result metadata and rejects a stale source rather than inventing a trace", () => {
    const work = { ...initialWorkspace(), pattern: "4294967295" };
    const result = workspaceCalculation(work);
    if (!result.ok) throw new Error("Expected valid fixture");
    expect(
      restoreWorkspace({ ...work, trace: { ...result.trace, pattern: "999", full: "999" } }).trace,
    ).toEqual(result.trace);
    expect(restoreWorkspace({ ...work, trace: { ...result.trace, a: "1" } }).trace).toBeNull();
    expect(
      restoreWorkspace({
        width: 17,
        pattern: "not a pattern",
        selected: 999,
        scrollLeft: Infinity,
      }),
    ).toMatchObject({ width: 32, pattern: "0", selected: 31, scrollLeft: -1 });
  });
});
