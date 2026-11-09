// Copyright © 2026 Christopher Snow

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PRIMITIVE_STRINGS as S } from "./strings.primitive";

const canonical = readFileSync(
  new URL("../../../docs/notes/fundamentals/primitive-prose.md", import.meta.url),
  "utf8",
);
const flat = (s: string) => s.replace(/[`*]/g, "").replace(/\s+/g, " ").trim();

describe("primitive figure prose record", () => {
  it("keeps all fixed labels and representative generated messages in the review copy", () => {
    const samples = [
      ...Object.values(S).flatMap((v) => (typeof v === "string" ? [v] : [])),
      S.question("w0"),
      S.question("w1"),
      S.unchanged("w1"),
      S.unchanged("w0, w1"),
      S.reused("w0"),
      S.callerCall("increment_int", 7),
      S.callerCall("increment_int", [7]),
      S.callerCall("add_ints", [7, 5]),
      S.callerReturned(8),
      S.callerReturned(12),
      S.functionEntryMany("w0 and w1"),
      ...[0, 1, 2, 3].map(S.argumentPathAt),
    ];
    for (const sample of samples) expect(flat(canonical), sample).toContain(flat(sample));
  });
});
