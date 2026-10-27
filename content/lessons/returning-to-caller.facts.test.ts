// Copyright © 2026 Christopher Snow

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { RETURN_ADDRESS, STACK_TOP } from "@al/machine";
import { parseListing } from "../../packages/views/src/listing";
import { traceOf, viewAt, wValue } from "../../packages/views/src/trace";
import { INCREMENT_INT } from "./meet-the-machine.listings";
import {
  RETURNING_PROGRAM,
  RETURNING_CALL,
  RETURNING_START_STEP,
  RETURNING_END_STEP,
  RETURNING_CALLER_LABEL,
} from "./returning-to-caller.example";

const trace = () => traceOf(RETURNING_PROGRAM, RETURNING_CALL);

describe("returning to the visible caller", () => {
  it("checks the identical whole program in the GNU/QEMU corpus", () => {
    const native = readFileSync(
      new URL("../../scripts/real-tools/corpus/returning-to-caller.s", import.meta.url),
      "utf8",
    );
    expect(parseListing(native.slice(native.indexOf("caller:\n")))).toEqual(
      parseListing(RETURNING_PROGRAM.listing),
    );
    const cases = JSON.parse(
      readFileSync(
        new URL("../../scripts/real-tools/corpus/returning-to-caller.json", import.meta.url),
        "utf8",
      ),
    );
    expect(cases.entry).toBe(RETURNING_CALL.entry);
    expect(cases.calls).toContainEqual({ args: RETURNING_CALL.args.map((value) => [value, 32]) });
  });

  it("keeps the recorded increment_int body unchanged", () => {
    const body = RETURNING_PROGRAM.listing.split("increment_int:\n")[1]!;
    expect(parseListing(body).map((line) => line.text)).toEqual(
      parseListing(INCREMENT_INT.listing)
        .filter((line) => line.kind === "instruction")
        .map((line) => line.text),
    );
  });

  it("BL saves the following instruction's address and enters the function", () => {
    const t = trace();
    const initial = viewAt(t, RETURNING_START_STEP);
    const called = viewAt(t, RETURNING_START_STEP + 1);
    expect(wValue(initial.state, 0)).toBe(7);
    expect(wValue(initial.state, 1)).toBe(0);
    expect(initial.state.x[30]).toBe(BigInt(RETURN_ADDRESS));
    expect(t.result.steps[RETURNING_START_STEP]!.text).toBe("bl increment_int");
    const continuation = t.program.symbols[RETURNING_CALLER_LABEL]!.address;
    expect(continuation).toBe(initial.state.pc + 4);
    expect(called.state.x[30]).toBe(BigInt(continuation));
    expect(called.state.pc).toBe(t.program.symbols["increment_int"]!.address);
    expect(called.state.x.slice(0, 30)).toEqual(initial.state.x.slice(0, 30));
    expect([...called.written]).toEqual([30]);
    expect(t.result.steps[RETURNING_START_STEP + 1]!.text).toBe("add w0, w0, 1");
  });

  it("ret selects the caller continuation without writing a general-purpose register", () => {
    const t = trace();
    const before = viewAt(t, RETURNING_START_STEP + 2);
    const after = viewAt(t, RETURNING_START_STEP + 3);
    expect(wValue(before.state, 0)).toBe(8);
    expect(after.state.x).toEqual(before.state.x);
    expect(after.state.pc).toBe(Number(before.state.x[30]));
    expect(after.written.size).toBe(0);
    expect(t.result.steps[RETURNING_START_STEP + 2]!.text).toBe("ret");
    expect(t.result.steps[RETURNING_START_STEP + 3]!.text).toBe("add w1, w0, w0");
  });

  it("the caller uses the same w0 and writes another register", () => {
    const t = trace();
    const after = viewAt(t, RETURNING_END_STEP);
    expect(wValue(after.state, 0)).toBe(8);
    expect(wValue(after.state, 1)).toBe(16);
    expect([...after.written]).toEqual([1]);
    expect(t.result.final.sp).toBe(BigInt(STACK_TOP));
    expect(t.result.final.x[30]).toBe(BigInt(RETURN_ADDRESS));
    expect(t.result.stop.kind).toBe("returned");
  });

  it.each([0, 3, 4])("supports a fresh argument %i through the same caller", (argument) => {
    const t = traceOf(RETURNING_PROGRAM, { entry: RETURNING_CALL.entry, args: [argument, 0] });
    const returned = viewAt(t, RETURNING_START_STEP + 3);
    const used = viewAt(t, RETURNING_END_STEP);
    expect(wValue(returned.state, 0)).toBe(argument + 1);
    expect(wValue(used.state, 0)).toBe(argument + 1);
    expect(wValue(used.state, 1)).toBe((argument + 1) * 2);
  });
});
