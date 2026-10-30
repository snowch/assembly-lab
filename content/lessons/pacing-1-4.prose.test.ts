// Copyright © 2026 Christopher Snow

import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { COPY } from "./pacing-1-4.copy";

it("keeps the separately drafted Module 1–4 pacing copy in its canonical record", () => {
  const record = readFileSync(
    new URL("../../docs/notes/course-pacing-implementation/copy.md", import.meta.url),
    "utf8",
  );
  const json = record.split("## pacing-1-4.copy.ts\n")[1]?.match(/```json\n([\s\S]*?)\n```/)?.[1];
  expect(json).toBeDefined();
  expect(JSON.parse(json!)).toEqual(COPY);
});
