// Copyright © 2026 Christopher Snow
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { LABELS as FIRST_LABELS } from "./c-and-overflow.labels";
import { PROSE as FIRST_PROSE } from "./c-and-overflow.prose";
import { LABELS as SECOND_LABELS } from "./checked-arithmetic.labels";
import { PROSE as SECOND_PROSE } from "./checked-arithmetic.prose";
const canonical = readFileSync(
  new URL("../../docs/notes/module-11/prose.md", import.meta.url),
  "utf8",
);
const flat = (text: string) => text.replace(/[`*]/g, "").replace(/\s+/g, " ").trim();
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object")
    return Object.entries(value)
      .filter(([key]) => key !== "value")
      .flatMap(([, child]) => strings(child));
  return [];
}
const editorial =
  /^(?:# Lesson |## (?:0\. Objectives|Model and reality|Figure captions and labels|Originality record)$|\*(?:Closed note:|End of closed note|After committing|Hints, in order:|Feedback:))/;

describe.each([
  { n: 1, prose: FIRST_PROSE, labels: FIRST_LABELS },
  { n: 2, prose: SECOND_PROSE, labels: SECOND_LABELS },
])("Module 11 lesson $n review copy", ({ n, prose, labels }) => {
  const start = canonical.indexOf(`# Lesson ${n}:`);
  const next = n === 1 ? canonical.indexOf("# Lesson 2:") : canonical.length;
  const body = canonical.slice(start, next);
  const displayed = [...strings(prose), ...strings(labels)];
  it("records every exported paragraph, hint, note and label", () => {
    expect(start).toBeGreaterThan(0);
    expect(next).toBeGreaterThan(start);
    for (const text of displayed) expect(flat(body), text).toContain(flat(text));
  });
  it("has no extra learner prose absent from the displayed strings", () => {
    const source = flat(displayed.join("\n"));
    for (const line of body.split("\n")) {
      if (!line.trim() || editorial.test(line)) continue;
      const text = line.replace(/^#+\s*(?:\d+\.\s*)?/, "").replace(/^- /, "");
      expect(source, line).toContain(flat(text));
    }
  });
});
