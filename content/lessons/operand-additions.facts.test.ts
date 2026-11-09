// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { assemble } from "@al/machine";
import { flowAt } from "../../packages/views/src/flow";
import { assemblyOf, parseListing, traceOf, viewAt, wValue } from "@al/views";
import { SHIFTED_IMMEDIATE_ADD, SHIFTED_REGISTER_ADD } from "./operand-additions";

describe("small examples of ADD operand formation", () => {
  it.each([
    [SHIFTED_REGISTER_ADD, "add_scaled_register", [12, 7, 0], "7", "14", "26", "w2", ["12", "7"]],
    [
      SHIFTED_IMMEDIATE_ADD,
      "add_scaled_constant",
      [{ value: 65536, width: 64 }, 0, 0],
      "3",
      "12288",
      "77824",
      "x2",
      ["65536", "0"],
    ],
  ] as const)(
    "derives the original input, formed operand and result from %s",
    (program, entry, args, input, effective, result, destination, kept) => {
      const trace = traceOf(program, { entry, args: [...args] });
      const flow = flowAt(trace, 1, { shiftedOperands: true });
      expect(flow?.kind).toBe("arith");
      if (flow?.kind !== "arith") throw new Error("Arithmetic flow expected");
      expect(flow.sources[1].transform?.input).toBe(input);
      expect(flow.sources[1].value).toBe(effective);
      expect(flow.destination.after).toBe(result);
      expect(flow.changed).toEqual([destination]);
      expect(viewAt(trace, 1).state.x.slice(0, 2).map(String)).toEqual(kept);
      expect(trace.result.stop.kind).toBe("returned");
    },
  );

  it("keeps a truncated register operand distinct from its source bits", () => {
    const trace = traceOf(SHIFTED_REGISTER_ADD, {
      entry: "add_scaled_register",
      args: [0xffffffff, 0x80000000, 0],
    });
    const flow = flowAt(trace, 1, { shiftedOperands: true });
    expect(flow?.kind === "arith" && flow.sources[1]).toMatchObject({
      value: "0",
      transform: { input: "2147483648" },
    });
    expect(wValue(viewAt(trace, 1).state, 1)).toBe(0x80000000);
    // Existing callers do not opt into shifted operand flows.
    expect(flowAt(trace, 1)).toBeNull();
  });

  it("uses the same arithmetic operation for the plain and shifted byte distance", () => {
    const explicit = assemble(SHIFTED_IMMEDIATE_ADD.listing).program!;
    const plain = assemble("add x2, x0, #12288\nret").program!;
    expect(plain.instructions[0]!.op).toEqual(explicit.instructions[0]!.op);
  });

  it("keeps the shown examples and the equivalent plain form in the native corpus", () => {
    const corpus = readFileSync(
      new URL("../../scripts/real-tools/corpus/operand-additions.s", import.meta.url),
      "utf8",
    )
      .split("\n")
      .filter((line) => !line.startsWith("//") && !line.startsWith("."))
      .join("\n");
    const shown = [
      SHIFTED_REGISTER_ADD.listing,
      SHIFTED_IMMEDIATE_ADD.listing,
      "add_plain_constant:\n  add x2, x0, #12288\n  ret",
    ].join("\n");
    expect(assemblyOf(parseListing(corpus))).toBe(assemblyOf(parseListing(shown)));
  });

  it("distinguishes the constant field and its permitted scaling from register shift amounts", () => {
    const errors = (line: string) => assemble(`f:\n${line}\nret`).errors;
    expect(errors("add w2, w0, #4095, lsl #12")).toEqual([]);
    expect(errors("add w2, w0, #1, lsl #0")).toEqual([]);
    expect(errors("add w2, w0, #1, lsl #1")).not.toEqual([]);
    expect(errors("add w2, w0, #4096, lsl #12")).not.toEqual([]);
    expect(errors("add w2, w0, w1, lsl #31")).toEqual([]);
    expect(errors("add w2, w0, w1, lsl #32")).not.toEqual([]);
  });
});
