// Copyright © 2026 Christopher Snow

import { expect, it } from "vitest";
import { exactPlusOne, floatingAnswer } from "./interactives/FloatingPoint";

it("keeps the exact addition separate from a rounded format value", () => {
  expect(exactPlusOne("16777216")).toBe("16777217");
  expect(exactPlusOne("12.3500003814697265625")).toBe("13.3500003814697265625");
  expect(exactPlusOne("-1.25")).toBe("-0.25");
  expect(exactPlusOne("-0.25")).toBe("0.75");
  expect(exactPlusOne("0.000000000000000000000001")).toBe("1.000000000000000000000001");
  expect(exactPlusOne("-Infinity")).toBe("-Infinity");
  expect(exactPlusOne("NaN")).toBe("NaN");
});

it("derives fresh practice from the formats and conversion rule", () => {
  expect(floatingAnswer("fields")).toBe("101.01");
  expect(floatingAnswer("rounding")).toBe("16777220");
  expect(floatingAnswer("arithmetic")).toBe("double");
  expect(floatingAnswer("conversion")).toBe("-6");
});
