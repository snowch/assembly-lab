// Copyright © 2026 Christopher Snow
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { LABELS as L1 } from "./from-c-to-instructions.labels";
import { PROSE as P1 } from "./from-c-to-instructions.prose";
import { LABELS as L2 } from "./compile-a-loop.labels";
import { PROSE as P2 } from "./compile-a-loop.prose";
import { COMPILER_STRINGS as C } from "../../packages/views/src/strings.compiler";
const canonical = readFileSync(
  new URL("../../docs/notes/module-10/prose.md", import.meta.url),
  "utf8",
);
const flat = (s: string) => s.replace(/[`*]/g, "").replace(/\s+/g, " ").trim();
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object")
    return Object.entries(value)
      .filter(([key]) => key !== "value")
      .flatMap(([, child]) => strings(child));
  return [];
}
const ui = [
  ...strings(C),
  C.editor.line("{line}" as unknown as number, "{source}"),
  C.playground.input("{name}"),
  C.playground.compiled(1),
  C.playground.compiled(2),
  C.playground.checked("{value}"),
  C.playground.diagnostic(
    "{line}" as unknown as number,
    "{column}" as unknown as number,
    "{message}",
  ),
];
describe.each([
  {
    name: "first lesson",
    start: "# Lesson 1:",
    end: "# Lesson 2:",
    displayed: [...strings(P1), ...strings(L1)],
  },
  {
    name: "second lesson",
    start: "# Lesson 2:",
    end: "# Figure interface",
    displayed: [...strings(P2), ...strings(L2)],
  },
  { name: "compiler interface", start: "# Figure interface", end: undefined, displayed: ui },
])("Module 10 $name review copy", ({ start, end, displayed }) => {
  const body = canonical.slice(canonical.indexOf(start), end ? canonical.indexOf(end) : undefined);
  it("retains every learner string", () => {
    for (const text of displayed) expect(flat(body), text).toContain(flat(text));
  });
  it("has no extra learner prose", () => {
    const source = flat(displayed.join("\n"));
    for (const line of body.split("\n")) {
      if (!line.trim() || line.startsWith("#")) continue;
      expect(source, line).toContain(flat(line));
    }
  });
});
