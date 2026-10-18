// Copyright © 2026 Christopher Snow
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { LABELS as A } from "./products-and-widths.labels";
import { PROSE as B } from "./products-and-widths.prose";
import { LABELS as C } from "./division-and-remainders.labels";
import { PROSE as D } from "./division-and-remainders.prose";
import { PRODUCT_STRINGS } from "../../packages/views/src/strings.products";
const canonical = readFileSync(
  new URL("../../docs/notes/module-8/prose.md", import.meta.url),
  "utf8",
);
const flat = (s: string) => s.replace(/[`*]/g, "").replace(/\s+/g, " ").trim();
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object")
    return Object.entries(value)
      .filter(([key]) => key !== "value")
      .flatMap(([, v]) => strings(v));
  return [];
}
describe.each([
  { n: 1, prose: B, labels: A },
  { n: 2, prose: D, labels: C },
])("Module8 lesson$n canonical copy", ({ n, prose, labels }) => {
  const start = canonical.indexOf(`# Lesson ${n}:`);
  const end = canonical.indexOf(n === 1 ? "# Lesson 2:" : "# Figure interface");
  const body = canonical.slice(start, end);
  const text = strings([prose, labels]);
  it("contains every exported paragraph and label", () => {
    expect(start).toBeGreaterThan(0);
    expect(end).toBeGreaterThan(start);
    for (const s of text) expect(flat(body), s).toContain(flat(s));
  });
  it("contains no unmounted extra passage", () => {
    const source = flat(text.join("\n"));
    for (const line of body.split("\n")) {
      if (
        !line.trim() ||
        line.startsWith("#") ||
        line.startsWith("*Closed note:") ||
        line.startsWith("*End of closed note") ||
        line.startsWith("*After committing") ||
        line.startsWith("*Hints, in order:") ||
        line.startsWith("*Feedback:")
      )
        continue;
      expect(source, line).toContain(flat(line.replace(/^- /, "")));
    }
  });
});
it("keeps all diagram labels in the canonical copy", () => {
  const body = canonical.slice(canonical.indexOf("# Figure interface"));
  for (const text of strings(PRODUCT_STRINGS)) expect(flat(body)).toContain(flat(text));
});
