// Copyright © 2026 Christopher Snow
import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { RETURNING_PROSE } from "./returning-to-caller.prose";
import { RETURNING_LABELS } from "./returning-to-caller.labels";
import { RETURNING_STRINGS as S } from "../../packages/views/src/strings.returning";
const strings = (value: unknown): string[] =>
  typeof value === "string"
    ? [value]
    : value && typeof value === "object"
      ? Object.values(value).flatMap(strings)
      : [];
const flat = (s: string) => s.replace(/[`*]/g, "").replace(/\s+/g, " ").trim();
it("keeps lesson and figure wording in the separately reviewed canonical record", () => {
  const canonical = flat(
    readFileSync(new URL("../../docs/notes/returning-to-caller/prose.md", import.meta.url), "utf8"),
  );
  for (const value of [
    ...strings(RETURNING_PROSE),
    ...strings(RETURNING_LABELS),
    ...strings(S),
    ...[0, 1, 2, 3].map((step) => S.status(step, 8, 16)),
  ])
    expect(canonical).toContain(flat(value));
});
