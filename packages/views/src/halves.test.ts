// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";

import { halves16 } from "./halves";
import { traceText } from "./traceText";

describe("16-bit write marks follow the decoded instruction, including identical writes", () => {
  it.each([
    ["mov w0, 3\nmovk w0, 0, lsl 16\nret", "0000", "0003", "new", "kept"],
    ["mov w0, 3\nmovk w0, 3\nret", "0000", "0003", "kept", "new"],
    ["mov w0, 3\nmov w0, 3\nret", "0000", "0003", "new", "new"],
    ["mov w0, 3\nmovk w1, 2, lsl 16\nret", "0000", "0003", "kept", "kept"],
    ["mov w0, 3\nmovk x0, 2, lsl 32\nret", "0000", "0003", "kept", "kept"],
  ])("%s", (listing, upper, lower, upperTag, lowerTag) => {
    const trace = traceText(listing);
    expect(trace).not.toBeNull();
    const half = halves16(trace!, 2, 0);
    expect([half.upper, half.lower, half.tag?.upper, half.tag?.lower]).toEqual([
      upper,
      lower,
      upperTag,
      lowerTag,
    ]);
  });
});
