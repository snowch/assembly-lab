// Copyright © 2026 Christopher Snow

import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { pacing5To9 } from "./pacing-5-9.copy";

it("keeps the separately drafted Module 5–9 pacing copy in its canonical record", () => {
  const record = readFileSync(
    new URL("../../docs/notes/course-pacing-implementation/copy.md", import.meta.url),
    "utf8",
  );
  const section = record.split("## pacing-5-9.copy.ts\n")[1];
  expect(section).toBeDefined();
  const json = section!.match(/```json\n([\s\S]*?)\n```/)?.[1];
  expect(json).toBeDefined();
  expect(JSON.parse(json!)).toEqual(pacing5To9);
});
