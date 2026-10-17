// Copyright © 2026 Christopher Snow

// What a prediction is checked against: the model, run on the call and on words chosen to tell the
// choices apart. The choice that fits is the name of what the function did, never a value the
// lesson's words hold.

import { describe, expect, it } from "vitest";

import { measure } from "./probe";

const fn = (label: string, ...instructions: string[]) => ({
  listing: [`${label}:`, ...instructions.map((i) => `  ${i}`), "  ret"].join("\n"),
});

describe("cleared-bits", () => {
  const ones = (entry: string) => ({ entry, args: [0xffffffff] });

  it("names the one bit that clear_door clears, and says so", () => {
    const out = measure({ kind: "cleared-bits" }, fn("f", "and w0, w0, -5"), ones("f"));
    expect(out.value).toBe("cleared:2");
    expect(out.said).toContain("Only bit 2 came out 0");
    expect(out.rows).toEqual({ before: 0xffffffff, after: 0xfffffffb });
  });

  it("names every bit when several clear, and none when an orr only sets", () => {
    expect(measure({ kind: "cleared-bits" }, fn("f", "and w0, w0, -113"), ones("f")).value).toBe(
      "cleared:4,5,6",
    );
    expect(
      measure({ kind: "cleared-bits" }, fn("f", "and w0, w0, -113"), ones("f")).said,
    ).toContain("Bits 4, 5 and 6");
    const none = measure({ kind: "cleared-bits" }, fn("f", "orr w0, w0, 1"), ones("f"));
    expect(none.value).toBe("cleared:");
    expect(none.said).toContain("No bit came out 0");
  });

  it("says the run stopped when it did not return", () => {
    const out = measure({ kind: "cleared-bits" }, fn("f", "ldr w0, [x1]"), {
      entry: "f",
      args: [1, 0],
    });
    expect(out.value).toBe("error");
  });
});

describe("register-hex", () => {
  it("gives the register the run ends with, as its decimal value, and says it in hexadecimal", () => {
    const out = measure(
      { kind: "register-hex", register: 0 },
      fn("f", "and w1, w1, 7", "lsl w1, w1, 4", "orr w0, w0, w1"),
      { entry: "f", args: [0x35, 5] },
    );
    expect(out.value).toBe("117");
    expect(out.said).toContain("0x75");
  });
});

describe("fill-rule", () => {
  const call = { entry: "f", args: [-7] };
  const rule = (instruction: string) =>
    measure({ kind: "fill-rule" }, fn("f", instruction), call).value;

  it("is a copy of the old top bit for asr, and zero for lsr, by any amount", () => {
    expect(rule("asr w0, w0, 1")).toBe("copy");
    expect(rule("asr w0, w0, 3")).toBe("copy");
    expect(rule("lsr w0, w0, 1")).toBe("zero");
    expect(rule("lsr w0, w0, 3")).toBe("zero");
  });

  it("is the bit that fell off for a rotate, which the lesson does not name", () => {
    expect(rule("ror w0, w0, 1")).toBe("fell-off");
  });

  it("is other when the top bit is filled in no way a choice describes", () => {
    expect(rule("mvn w0, w0")).toBe("other");
  });

  it("says what the model did, and returns the word before and after", () => {
    const out = measure({ kind: "fill-rule" }, fn("f", "asr w0, w0, 1"), call);
    expect(out.said).toContain("asr w0, w0, 1");
    expect(out.said).toContain("copy of the old top bit");
    expect(out.rows).toEqual({ before: 0xfffffff9, after: 0xfffffffc });
  });
});

describe("first-add", () => {
  const call = { entry: "f", args: [-7] };
  const rule = (...instructions: string[]) =>
    measure({ kind: "first-add" }, fn("f", ...instructions), call);

  it("is the sign for GCC's first instruction for g / 2: 1 for a negative value, 0 for any other", () => {
    const out = rule("add w0, w0, w0, lsr 31", "asr w0, w0, 1");
    expect(out.value).toBe("sign");
    expect(out.said).toContain("added 1 to a negative value and 0 to any other");
  });

  it("tells always 1, 31 and half of g apart from it", () => {
    expect(rule("add w0, w0, 1").value).toBe("one");
    expect(rule("add w0, w0, 31").value).toBe("thirty-one");
    expect(rule("add w0, w0, w0, asr 1").value).toBe("half");
    expect(rule("add w0, w0, 2").value).toBe("other");
    expect(rule("add w0, w0, 2").said).toContain("The simulator ran `add w0, w0, 2`");
  });
});
