// Copyright © 2026 Christopher Snow
import { describe, expect, it } from "vitest";
import { assemble, run } from "@al/machine";
import { executedCall } from "./callContract";

function check(text: string, name = "helper") {
  const { program, errors } = assemble(text);
  expect(errors).toEqual([]);
  return executedCall(program!, run(program!, { entry: "main", maxSteps: 30 }), name);
}
describe("required dynamic calls", () => {
  it("accepts an executed BL to the named target", () => {
    expect(
      check(
        "main:\n stp x29,x30,[sp,#-16]!\n bl helper\n ldp x29,x30,[sp],#16\n ret\nhelper:\n ret",
      ),
    ).toBe(true);
  });
  it("rejects an unreachable BL and a branch that is not a call", () => {
    expect(check("main:\n ret\n bl helper\nhelper:\n ret")).toBe(false);
    expect(check("main:\n b helper\nhelper:\n ret")).toBe(false);
  });
  it("rejects an executed call to another function and a missing target", () => {
    expect(
      check(
        "main:\n stp x29,x30,[sp,#-16]!\n bl other\n ldp x29,x30,[sp],#16\n ret\nother:\n ret\nhelper:\n ret",
      ),
    ).toBe(false);
    expect(check("main:\n ret")).toBe(false);
  });
});
