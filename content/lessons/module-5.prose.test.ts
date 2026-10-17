// Copyright © 2026 Christopher Snow

// Hold the canonical review copy and the displayed words to each other in both directions.
// Editorial markers identify when a passage appears; they are not learner-facing text.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { LOOP_STRINGS } from "../../packages/views/src/strings.loop";
import { LABELS as UP_LABELS } from "./counting-up.labels";
import { PROSE as UP_PROSE } from "./counting-up.prose";
import { LABELS as DOWN_LABELS } from "./counting-down.labels";
import { PROSE as DOWN_PROSE } from "./counting-down.prose";

const canonical = readFileSync(
  new URL("../../docs/notes/module-5/prose.md", import.meta.url),
  "utf8",
);
const flat = (text: string) => text.replace(/[`*]/g, "").replace(/\s+/g, " ").trim();
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object")
    return Object.entries(value)
      .filter(([key]) => key !== "value") // Prediction option values are identifiers.
      .flatMap(([, child]) => strings(child));
  return [];
}

const editorial =
  /^(?:# Lesson |## (?:0\. Objectives|Model and reality|Figure captions and labels|Originality record)$|\*(?:Closed note:|End of closed note|After committing|Hints, in order:|Feedback:))/;

describe.each([
  { n: 1, prose: UP_PROSE, labels: UP_LABELS },
  { n: 2, prose: DOWN_PROSE, labels: DOWN_LABELS },
])("Module 5 lesson $n canonical prose", ({ n, prose, labels }) => {
  const start = canonical.indexOf(`# Lesson ${n}:`);
  const next =
    n === 1 ? canonical.indexOf("# Lesson 2:") : canonical.indexOf("# Loop figure interface");
  const body = canonical.slice(start, next);
  const displayed = [...strings(prose), ...strings(labels)];

  it("records every exported paragraph, hint, note and label", () => {
    expect(start).toBeGreaterThan(0);
    expect(next).toBeGreaterThan(start);
    for (const text of displayed) expect(flat(body), text).toContain(flat(text));
  });

  it("contains no extra learner prose absent from the lesson strings", () => {
    const source = flat(displayed.join("\n"));
    for (const line of body.split("\n")) {
      if (!line.trim() || editorial.test(line)) continue;
      const text = line.replace(/^#+\s*(?:\d+\.\s*)?/, "").replace(/^- /, "");
      expect(source, line).toContain(flat(text));
    }
  });
});

it("keeps loop figure messages and their singular/plural forms in the review copy", () => {
  const body = canonical.slice(canonical.indexOf("# Loop figure interface"));
  const samples = Object.entries(LOOP_STRINGS).flatMap(([key, value]) => {
    if (typeof value === "string") return [value];
    const render = value as (sample: string | number) => string;
    return key === "history" ? [render("w0")] : [render(1), render(2), render("{n}")];
  });
  for (const text of samples) expect(flat(body), text).toContain(flat(text));
  const source = flat(samples.join("\n"));
  for (const line of body.split("\n")) {
    if (!line.trim() || line.startsWith("#") || line.startsWith("Parameterized messages")) continue;
    expect(source, line).toContain(flat(line));
  }
});
