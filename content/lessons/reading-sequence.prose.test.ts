// Copyright © 2026 Christopher Snow
import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { READING_SEQUENCE } from "@al/views";
it("keeps the separately drafted and reviewed reading sequence in its canonical record", () => {
  const text = readFileSync(
    new URL("../../docs/notes/readings-learning-design/implementation-prose.md", import.meta.url),
    "utf8",
  );
  expect(JSON.parse(text.match(/```json\n([\s\S]*?)\n```/)![1]!)).toEqual(READING_SEQUENCE);
});
