// Copyright © 2026 Christopher Snow

// Keep the review copy and the learner-facing strings in agreement in both directions.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { STRINGS } from "../../apps/course/src/strings";
import { VIEW_STRINGS } from "../../packages/views/src/strings";
import { MEMORY_STRINGS } from "../../packages/views/src/strings.memory";
import { MEMORY_RUNTIME_STRINGS } from "../../packages/views/src/strings.memory-runtime";
import { LABELS as FIRST_LABELS } from "./memory-and-addresses.labels";
import { PROSE as FIRST_PROSE } from "./memory-and-addresses.prose";
import { LABELS as SECOND_LABELS } from "./loading-widths.labels";
import { PROSE as SECOND_PROSE } from "./loading-widths.prose";

const canonical = readFileSync(
  new URL("../../docs/notes/module-6/prose.md", import.meta.url),
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
])("Module 6 lesson $n review copy", ({ n, prose, labels }) => {
  const start = canonical.indexOf(`# Lesson ${n}:`);
  const next = canonical.indexOf(n === 1 ? "# Lesson 2:" : "# Memory figure interface");
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

it("keeps figure, grader and shared course wording in the review copy", () => {
  const samples = Object.entries(MEMORY_STRINGS).flatMap(([key, value]) => {
    if (typeof value === "string") return [value];
    const render = value as (...args: (string | number)[]) => string;
    switch (key) {
      case "byte":
        return [render("0x00410000", "f9"), render("{address}", "{byte}")];
      case "sourceBits":
        return [render(0, 7), render("{from}", "{to}")];
      case "register":
        return [render("w0"), render("{register}")];
      case "loadTransfer":
      case "storeTransfer":
        return [
          render(key === "loadTransfer" ? "ldrb" : "strb", "0x00410000", 1, "w0"),
          render(key === "loadTransfer" ? "ldrh" : "strh", "0x00410000", 2, "w0"),
          render("{instruction}", "{address}", "{count}", "{register}"),
        ];
      case "memoryOutcome":
        return [render("0x00410000", "78 56 34 12"), render("{address}", "{bytes}")];
      case "registerOutcome":
        return [render("w0", "0xfffffff9"), render("{register}", "{value}")];
      case "extensionTransfer":
        return [render("sxtb", "w0", "w0"), render("{instruction}", "{source}", "{destination}")];
      default:
        throw new Error(`No review-copy samples for ${key}`);
    }
  });
  samples.push(...strings(MEMORY_RUNTIME_STRINGS), VIEW_STRINGS.modelNote, STRINGS.prereqs.cNot);
  const body = canonical.slice(canonical.indexOf("# Memory figure interface"));
  for (const text of samples) expect(flat(body), text).toContain(flat(text));
  const source = flat(samples.join("\n"));
  for (const line of body.split("\n")) {
    if (!line.trim() || line.startsWith("#") || line.startsWith("Parameterized messages")) continue;
    expect(source, line).toContain(flat(line));
  }
});
