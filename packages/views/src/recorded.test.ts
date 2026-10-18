// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";
import { RecordedQuerySchema, recordedAnswer, recordedInstruction } from "./recorded";
import {
  LIMIT_TRIP_A32,
  LIMIT_TRIP_A64,
  AVERAGE_TRIP_A32,
} from "../../../content/lessons/a32.listings";

describe("queries use records, and only A64 queries execute", () => {
  it("selects instructions while ignoring labels and C-line tags", () => {
    expect(recordedInstruction(LIMIT_TRIP_A32, 1)).toBe("movcs r0, r1");
    expect(
      recordedAnswer({ kind: "token", program: LIMIT_TRIP_A32, instruction: 2, part: "mnemonic" }),
    ).toBe("bx");
    expect(
      recordedAnswer({
        kind: "token",
        program: AVERAGE_TRIP_A32,
        instruction: 1,
        part: "first-operand",
      }),
    ).toBe("__aeabi_uidiv");
  });
  it("derives acceptance from the actual A64 assembler", () => {
    expect(
      recordedAnswer({ kind: "a64-acceptance", program: LIMIT_TRIP_A32, instruction: 1 }),
    ).toBe("rejected");
    expect(
      recordedAnswer({ kind: "a64-acceptance", program: LIMIT_TRIP_A64, instruction: 0 }),
    ).toBe("accepted");
  });
  it("derives A64 answers from a real trace", () =>
    expect(
      recordedAnswer({
        kind: "a64-result",
        program: LIMIT_TRIP_A64,
        call: { entry: "limit_trip", args: [80, 50] },
      }),
    ).toBe("50"));
  it("rejects invalid queries instead of making up an answer", () => {
    expect(() => recordedInstruction(LIMIT_TRIP_A32, 99)).toThrow();
    expect(
      RecordedQuerySchema.safeParse({
        kind: "token",
        program: LIMIT_TRIP_A32,
        instruction: -1,
        part: "mnemonic",
      }).success,
    ).toBe(false);
    expect(() =>
      recordedAnswer({
        kind: "a64-result",
        program: LIMIT_TRIP_A32,
        call: { entry: "limit_trip", args: [80, 50] },
      }),
    ).toThrow();
  });
});
