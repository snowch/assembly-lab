// Copyright © 2026 Christopher Snow

// Every number the second lesson of Module 1 states, run on the model, and every claim about which
// constants one `mov` holds, put to the course's assembler. The assembler agrees with GNU as line by
// line (scripts/real-tools/lines/module1-constants.txt), so what it accepts is what GNU as does.
// The listings are held to the recorded file in module-1.listings.test.ts.

import { describe, expect, it } from "vitest";

import { TEXT_BASE, assemble, run, stateAfter, type Program } from "@al/machine";
import { learnerText } from "@platform/lesson-schema";
import { assemblyOf, parseListing, readingsOfValue, tryMov } from "@al/views";

import { LESSONS } from ".";
import {
  FOUR_INSTRUCTIONS,
  ODOMETER_LIMIT_START_TEXT,
  ODOMETER_LIMIT_TEXT,
  SERVICE_AND_ODOMETER,
  WIDTHS,
} from "./module-1.listings";

const lesson = LESSONS.find((l) => l.id === "constants-and-widths")!;
const challenge = (id: string) => lesson.challenges.find((c) => c.id === id)!;

const build = (text: string): Program => {
  const { program, errors } = assemble(text);
  if (!program) throw new Error(errors.map((e) => e.key).join(", "));
  return program;
};
const runText = (text: string) =>
  run(build(text.endsWith("\n") ? text : text + "\n"), { entry: TEXT_BASE });
const x = (state: { x: bigint[] }, n: number) => state.x[n]!;
/** The first instruction `mov w0, <n>` assembles to, or the first error's key. */
const mov = (n: string | number) => {
  const { program, errors } = assemble(`mov w0, ${n}\nret\n`);
  return program
    ? { ok: true as const, op: program.instructions[0]!.op }
    : { ok: false as const, key: errors[0]!.key };
};

describe("service_interval and odometer_limit", () => {
  const program = build(assemblyOf(parseListing(SERVICE_AND_ODOMETER.listing)));
  const call = (entry: string) => run(program, { entry });

  it("make one instruction of 30000: mov w0, 30000, then ret", () => {
    const result = call("service_interval");
    expect(result.steps.map((s) => s.text)).toEqual(["mov w0, 30000", "ret"]);
    expect(x(result.final, 0)).toBe(30000n);
  });

  it("make two of 1000000: mov w0, 16960, then movk w0, 0xf, lsl 16", () => {
    const result = call("odometer_limit");
    expect(result.steps.map((s) => s.text)).toEqual([
      "mov w0, 16960",
      "movk w0, 0xf, lsl 16",
      "ret",
    ]);
    expect(x(stateAfter(result, 0), 0)).toBe(16960n);
    expect(x(stateAfter(result, 1), 0)).toBe(1000000n);
    expect(x(result.final, 0)).toBe(1000000n);
  });

  it("leave 1000000 as 0x000f4240: the lower half 0x4240 is 16960, the upper half 0xf is 15", () => {
    expect(readingsOfValue(1000000).digits).toBe("000f4240");
    expect(0x4240).toBe(16960);
    expect(0xf).toBe(15);
    expect(1000000 & 0xffff).toBe(16960);
    expect(1000000 >>> 16).toBe(15);
  });

  it("have movk replace one 16-bit half and keep the rest", () => {
    // The lower half is kept when the upper is replaced...
    expect(x(runText("mov w0, 16960\nmovk w0, 15, lsl 16\nret").final, 0)).toBe(1000000n);
    // ...a second mov replaces the whole register, as the hint says...
    expect(x(runText("mov w0, 16960\nmov w0, 15\nret").final, 0)).toBe(15n);
    // ...and mov w0, 1 then movk w0, 1, lsl 16 leaves 65537.
    expect(x(runText("mov w0, 1\nmovk w0, 1, lsl 16\nret").final, 0)).toBe(65537n);
  });
});

describe("which numbers one mov can put in w0", () => {
  it("takes 65536 in one instruction: a single 1, in the upper half", () => {
    const m = mov(65536);
    expect(m.ok).toBe(true);
    if (m.ok) expect(m.op).toMatchObject({ k: "movz", imm: 1n, shift: 16 });
    expect(x(runText("mov w0, 65536\nret").final, 0)).toBe(65536n);
  });

  it("takes 30000 and 65535 in one instruction each, as movz of the lower half", () => {
    for (const n of [30000, 65535]) {
      const m = mov(n);
      expect(m.ok, String(n)).toBe(true);
      if (m.ok) expect(m.op).toMatchObject({ k: "movz", shift: 0 });
    }
  });

  it("refuses 70000, 100000 and 1000000: each has bits in both halves, and the assembler says no single instruction can hold it", () => {
    for (const n of [70000, 100000, 1000000]) {
      expect(n & 0xffff, String(n)).not.toBe(0);
      expect(n >>> 16, String(n)).not.toBe(0);
      expect(mov(n)).toEqual({ ok: false, key: "immediate.move" });
    }
  });

  it("takes exactly one of the prediction's four numbers", () => {
    const options = lesson.sections[2]!.interactives[0]!.props["options"] as { value: string }[];
    expect(options.map((o) => o.value)).toEqual(["65536", "70000", "100000", "1000000"]);
    expect(options.filter((o) => mov(o.value).ok).map((o) => o.value)).toEqual(["65536"]);
  });

  it("takes a number whose bits repeat one short pattern: 65537 is 0x00010001", () => {
    expect(65537).toBe(0x00010001);
    const m = mov(65537);
    expect(m.ok).toBe(true);
    if (m.ok) expect(m.op.k).toBe("logic");
    expect(mov("0x00010001")).toEqual(m);
    expect(x(runText("mov w0, 65537\nret").final, 0)).toBe(65537n);
  });

  it("takes -1, and other numbers whose bits are all ones except in one 16-bit half", () => {
    for (const n of ["-1", "0xffff1234", "0x1234ffff", "0xffff0000", "-65536"]) {
      const m = mov(n);
      expect(m.ok, n).toBe(true);
    }
    const m = mov(-1);
    if (m.ok) expect(m.op.k).toBe("movn");
  });

  it("takes -1 and 4294967295 as the same instruction, and leaves the same 32 bits in w0", () => {
    const a = mov(-1);
    const b = mov(4294967295);
    expect(a).toEqual(b);
    expect(x(runText("mov w0, -1\nret").final, 0)).toBe(4294967295n);
    expect(x(runText("mov w0, 4294967295\nret").final, 0)).toBe(4294967295n);
  });

  it("is what the tester says: the number typed, the register as the model leaves it", () => {
    expect(tryMov("65536")).toEqual({ kind: "one", w0: 65536 });
    expect(tryMov("-1")).toEqual({ kind: "one", w0: 4294967295 });
    expect(tryMov("65537")).toEqual({ kind: "one", w0: 65537 });
    expect(tryMov("1000000")).toMatchObject({ kind: "refused" });
    expect(tryMov("")).toEqual({ kind: "empty" });
    expect(tryMov("w1")).toEqual({ kind: "not-a-number" });
  });
});

describe("the challenge, Build 1000000", () => {
  const c = challenge("build-1000000");

  it("starts from mov w0, 1000000, which does not assemble, and ends at GCC's own two instructions", () => {
    expect(c.initial.text).toBe(ODOMETER_LIMIT_START_TEXT);
    expect(c.reference.text).toBe(ODOMETER_LIMIT_TEXT);
    const { program, errors } = assemble(c.initial.text ?? "");
    expect(program).toBeNull();
    expect(errors.map((e) => [e.line, e.key])).toEqual([[1, "immediate.move"]]);
  });

  it("puts 1000000 in w0 with the reference, and the only expected value is 1000000", () => {
    expect(x(runText(c.reference.text ?? "").final, 0)).toBe(1000000n);
    if (c.tests.kind !== "answers") throw new Error("answer tests");
    expect(c.tests.cases.map((t) => t.expect)).toEqual([{ w0: 1000000 }]);
  });
});

describe("two names, one register", () => {
  const program = build(assemblyOf(parseListing(WIDTHS.listing)));
  const result = run(program, { entry: TEXT_BASE });

  it("sets all 64 bits with mov x3, -1", () => {
    expect(x(stateAfter(result, 0), 3)).toBe(0xffffffffffffffffn);
  });

  it("leaves the lower 32 bits set and the upper 32 cleared after mov w3, -1: 0x00000000ffffffff", () => {
    const after = x(stateAfter(result, 1), 3);
    expect(after).toBe(0x00000000ffffffffn);
    expect(after >> 32n).toBe(0n);
    expect(after & 0xffffffffn).toBe(0xffffffffn);
    expect(result.stop.kind).toBe("returned");
  });

  it("is the right option of the prediction, and not an error", () => {
    const options = lesson.sections[5]!.interactives[0]!.props["options"] as {
      value: string;
      label: string;
    }[];
    expect(options.map((o) => o.value)).toEqual(["all-set", "low-set", "unknown", "error"]);
    expect(options.find((o) => o.value === "low-set")!.label).toBe(
      "The lower 32 bits set and the upper 32 cleared.",
    );
  });

  it("turns return -1; with long into mov x0, -1, which sets all 64 bits of x0", () => {
    expect(x(runText("mov x0, -1\nret").final, 0)).toBe(0xffffffffffffffffn);
  });

  it("clears the upper half of x0 when w0 is written, so a caller that reads x0 finds zeros there", () => {
    const after = x(runText("mov x0, -1\nmov w0, -1\nret").final, 0);
    expect(after >> 32n).toBe(0n);
    expect(x(runText("mov w0, -1\nret").final, 0) >> 32n).toBe(0n);
  });
});

describe("the challenge, Predict two registers", () => {
  const result = run(build(assemblyOf(parseListing(FOUR_INSTRUCTIONS.listing))), {
    entry: TEXT_BASE,
  });
  const last = result.steps.length - 1;

  it("runs the four instructions the task names", () => {
    expect(result.steps.map((s) => s.text)).toEqual([
      "mov x1, -1",
      "mov w1, 5",
      "mov w2, 16960",
      "movk w2, 0xf, lsl 16",
    ]);
  });

  it("leaves x1 as 5, because writing w1 clears the upper half that mov x1, -1 set", () => {
    expect(x(stateAfter(result, 0), 1)).toBe(0xffffffffffffffffn);
    expect(x(stateAfter(result, last), 1)).toBe(5n);
  });

  it("leaves w2 as 1000000, which is 0x000f4240", () => {
    expect(x(stateAfter(result, last), 2)).toBe(1000000n);
    expect(readingsOfValue(1000000).digits).toBe("000f4240");
  });

  it("is what the challenge's reference answers", () => {
    expect(challenge("predict-two-registers").reference.answers).toEqual({
      x1: "5",
      w2: "1000000",
    });
  });
});

// ---------------------------------------------------------------------------------------------
// Every number the learner reads

describe("every number the lesson states", () => {
  // The numbers of the listings, and what the model gives for them. A number in the lesson's
  // words that is in no list here is a number nothing pins.
  const model = new Set<number>([
    // service_interval's and odometer_limit's constants, and the halves of 1000000.
    30000, 1000000, 16960, 15,
    // The prediction's options.
    65536, 70000, 100000,
    // A 16-bit half, a register's 32 bits and its 64.
    16, 32, 64,
    // 65537, and the 1 of the hint that builds it, and 4294967295 (the same bits as -1).
    65537, 1, 4294967295,
    // mov w1, 5, and x1 at the end.
    5,
  ]);

  const text = learnerText(lesson).join("\n");
  const hexes = [...text.matchAll(/0x[0-9a-f]+/g)].map((m) => m[0]);

  it("is pinned: each is a constant in a listing, a result of the model, or a fact the tests above check", () => {
    // Names such as w0 and x3 hold digits that are not numbers; hexadecimal numbers are held to the
    // model below.
    const plain = text.replace(/0x[0-9a-f]+/g, " ").replace(/[A-Za-z_][A-Za-z_0-9]*/g, " ");
    const numbers = [...plain.matchAll(/\d+/g)].map((m) => Number(m[0]));
    expect(numbers.length).toBeGreaterThan(30);
    expect(numbers.filter((n) => !model.has(n))).toEqual([]);
  });

  it("writes each hexadecimal number as a value the model holds", () => {
    expect([...new Set(hexes)].sort()).toEqual(
      ["0x00000000ffffffff", "0x000f4240", "0x00010001", "0x4240", "0xf"].sort(),
    );
    const value: Record<string, bigint> = {
      "0x00000000ffffffff": x(stateAfterWidths(), 3),
      "0x000f4240": 1000000n,
      "0x00010001": 65537n,
      "0x4240": 16960n,
      "0xf": 15n,
    };
    for (const h of hexes) expect(BigInt(h), h).toBe(value[h]);
  });

  it("agrees with the model on every pinned result", () => {
    const odometer = run(build(assemblyOf(parseListing(SERVICE_AND_ODOMETER.listing))), {
      entry: "odometer_limit",
    });
    const results = [
      x(stateAfter(odometer, 0), 0),
      x(odometer.final, 0),
      x(runText("mov w0, 30000\nret").final, 0),
      x(runText("mov w0, -1\nret").final, 0),
    ].map(Number);
    for (const n of results) expect(model.has(n), String(n)).toBe(true);
  });
});

function stateAfterWidths() {
  const result = run(build(assemblyOf(parseListing(WIDTHS.listing))), { entry: TEXT_BASE });
  return stateAfter(result, 1);
}
