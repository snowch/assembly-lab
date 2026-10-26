// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";
import { assemble } from "@al/machine";
import { flowAt } from "../../packages/views/src/flow";
import { traceOf, viewAt, wValue } from "@al/views";
import { SHIFTED_IMMEDIATE_ADD, SHIFTED_REGISTER_ADD } from "./operand-additions";

describe("small examples of ADD operand formation", () => {
  it.each([
    [SHIFTED_REGISTER_ADD, "add_scaled_register", [12, 7, 0], "7", "14", "26", [12, 7]],
    [SHIFTED_IMMEDIATE_ADD, "add_scaled_constant", [7, 0, 0], "1", "4096", "4103", [7, 0]],
  ] as const)(
    "derives the original input, formed operand and result from %s",
    (program, entry, args, input, effective, result, kept) => {
      const trace = traceOf(program, { entry, args: [...args] });
      const flow = flowAt(trace, 1, { shiftedOperands: true });
      expect(flow?.kind).toBe("arith");
      if (flow?.kind !== "arith") throw new Error("Arithmetic flow expected");
      expect(flow.sources[1].transform?.input).toBe(input);
      expect(flow.sources[1].value).toBe(effective);
      expect(flow.destination.after).toBe(result);
      expect(flow.changed).toEqual(["w2"]);
      expect([wValue(viewAt(trace, 1).state, 0), wValue(viewAt(trace, 1).state, 1)]).toEqual(kept);
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
