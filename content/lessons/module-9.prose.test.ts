// Copyright © 2026 Christopher Snow

// Keep the review copy and the learner-facing strings in agreement in both directions.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { STACK_STRINGS } from "../../packages/views/src/strings.stack";
import { LABELS as FIRST_LABELS } from "./calls-and-returns.labels";
import { PROSE as FIRST_PROSE } from "./calls-and-returns.prose";
import { LABELS as SECOND_LABELS } from "./recursive-calls.labels";
import { PROSE as SECOND_PROSE } from "./recursive-calls.prose";

const canonical = readFileSync(
  new URL("../../docs/notes/module-9/prose.md", import.meta.url),
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
])("Module 9 lesson $n review copy", ({ n, prose, labels }) => {
  const start = canonical.indexOf(`# Lesson ${n}:`);
  const next = canonical.indexOf(n === 1 ? "# Lesson 2:" : "# Figure interface");
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

it("records every stack diagram label and parameterised message", () => {
  const samples: string[] = Object.values(STACK_STRINGS).flatMap((v) =>
    typeof v === "string" ? [v] : [],
  );
  samples.push(
    STACK_STRINGS.requiredCall("{function}"),
    ...["half_distance", "fade_sum", "lit_count"].map(STACK_STRINGS.requiredCall),
    STACK_STRINGS.frame("{function}", 32),
    STACK_STRINGS.frame("{function}", "{bytes}" as unknown as number),
    STACK_STRINGS.invocation("{number}" as unknown as number),
    STACK_STRINGS.savedRegister("{register}"),
    STACK_STRINGS.returnTarget("{address}", "{instruction}"),
    STACK_STRINGS.returnOutside("{address}"),
    STACK_STRINGS.frameRange("{first}", "{last}"),
    STACK_STRINGS.slotRange("{first}", "{last}"),
    STACK_STRINGS.address("{address}"),
    STACK_STRINGS.byte("{address}", "{byte}"),
    STACK_STRINGS.depth(0),
    STACK_STRINGS.depth(32),
    STACK_STRINGS.depth("{bytes}" as unknown as number),
  );
  const body = canonical.slice(canonical.indexOf("# Figure interface"));
  for (const text of samples) expect(flat(body), text).toContain(flat(text));
  const source = flat(samples.join("\n"));
  for (const line of body.split("\n")) {
    if (!line.trim() || line.startsWith("#")) continue;
    expect(source, line).toContain(flat(line));
  }
});
