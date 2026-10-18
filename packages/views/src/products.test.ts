// Copyright © 2026 Christopher Snow
import { describe, expect, it } from "vitest";
import { productHalves, divisionParts } from "./products";
import { traceOf } from "./trace";
const product = { c: "", listing: "f:\nmul x2, x0, x1\numulh x3, x0, x1\nsmulh x4, x0, x1\nret" };
const division = { c: "", listing: "f:\nsdiv w2, w0, w1\nmsub w0, w2, w1, w0\nret" };
describe("product and division diagrams", () => {
  it("joins the actual high and low registers without Number rounding", () => {
    const r = productHalves(
      traceOf(product, {
        entry: "f",
        args: [
          { value: "18446744073709551615", width: 64 },
          { value: 2, width: 64 },
        ],
      }),
    );
    expect(r.low.hex).toBe("0xfffffffffffffffe");
    expect(r.unsignedHigh.hex).toBe("0x0000000000000001");
    expect(r.signedHigh.hex).toBe("0xffffffffffffffff");
    expect(r.low.bytes.join("")).toBe("fffffffffffffffe");
  });
  it("keeps a negative dividend's quotient and remainder signs", () => {
    expect(divisionParts(traceOf(division, { entry: "f", args: [-17, 5] }))).toEqual({
      dividend: -17,
      divisor: 5,
      quotient: -3,
      remainder: -2,
      groups: [-5, -5, -5],
    });
  });
  it("does not draw exceptional or unbounded divisions as small grouped diagrams", () => {
    for (const args of [
      [17, 0],
      [1000, 1],
    ])
      expect(() => divisionParts(traceOf(division, { entry: "f", args }))).toThrow();
  });
});
