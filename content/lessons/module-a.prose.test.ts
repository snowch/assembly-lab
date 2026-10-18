// Copyright © 2026 Christopher Snow

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { LABELS } from "./same-c-on-a32.labels";
import { PROSE } from "./same-c-on-a32.prose";
import { RECORDED_STRINGS } from "../../packages/views/src/strings.recorded";

const canonical = readFileSync(
  new URL("../../docs/notes/module-a/prose.md", import.meta.url),
  "utf8",
);
const flat = (text: string) => text.replace(/[`*]/g, "").replace(/\s+/g, " ").trim();
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (typeof value === "function") return [value("{value}")];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object")
    return Object.entries(value)
      .filter(([key]) => key !== "value")
      .flatMap(([, entry]) => strings(entry));
  return [];
}
describe("Optional A canonical prose", () => {
  const start = canonical.indexOf("# Lesson 1:"),
    body = canonical.slice(start),
    exported = strings([PROSE, LABELS, RECORDED_STRINGS]);
  it("retains every paragraph, label and dynamic figure message", () => {
    expect(start).toBeGreaterThan(0);
    for (const text of exported) expect(flat(body), text).toContain(flat(text));
  });
  it("has no extra passage absent from the lesson exports", () => {
    const source = flat(exported.join("\n"));
    for (const line of body.split("\n")) {
      if (!line.trim() || line.startsWith("#")) continue;
      expect(source, line).toContain(flat(line));
    }
  });
});
