// Copyright © 2026 Christopher Snow

import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { learnerText } from "@platform/lesson-schema";
import { LESSONS } from ".";

it("reviews every published lesson once in the prerequisite audit", () => {
  const rows = ["modules-0-4", "modules-5-9", "modules-10-b"].flatMap((name) =>
    readFileSync(new URL(`../../docs/notes/reminder-links/${name}.md`, import.meta.url), "utf8")
      .split("\n")
      .flatMap((line) => {
        const match = line.match(/^\|\s*(?:\d+\s*\|\s*)?`([^`]+)`/);
        return match ? [match[1]!] : [];
      }),
  );
  expect(rows.sort()).toEqual(LESSONS.map((lesson) => lesson.id).sort());
});

it("keeps internal lesson reminders and references pointed at published routes", () => {
  const routes = new Set(LESSONS.map((lesson) => lesson.id));
  for (const lesson of LESSONS) {
    for (const match of learnerText(lesson)
      .join("\n")
      .matchAll(/#\/lesson\/([a-z0-9-]+)/g)) {
      expect(routes.has(match[1]!), `${lesson.id} links to ${match[1]}`).toBe(true);
    }
  }
});
