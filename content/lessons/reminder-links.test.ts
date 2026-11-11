// Copyright © 2026 Christopher Snow

import { readFileSync } from "node:fs";
import { fromMarkdown } from "mdast-util-from-markdown";
import { expect, it } from "vitest";
import { learnerText } from "@platform/lesson-schema";
import { LESSONS } from ".";

/** Inspect complete destinations, so another course's hash route stays external. */
function internalLessonIds(text: string): string[] {
  const tree = fromMarkdown(text);
  const destinations = [text.trim()]; // Also check a standalone href in figure props.
  type Node = (typeof tree)["children"][number] | typeof tree;
  const visit = (node: Node) => {
    if ("url" in node && typeof node.url === "string") destinations.push(node.url);
    if ("children" in node) for (const child of node.children) visit(child as Node);
  };
  visit(tree);
  return destinations.flatMap((href) => {
    const match = /^#\/lesson\/([a-z0-9-]+)/.exec(href);
    return match ? [match[1]!] : [];
  });
}

it("distinguishes internal destinations from external lesson fragments without hiding missing routes", () => {
  expect(
    internalLessonIds(
      "[Recap](#/lesson/four-bit-arithmetic) [Missing](#/lesson/missing-route) " +
        "[Hardware](https://snowch.github.io/bit-lab/#/lesson/alu)",
    ),
  ).toEqual(["four-bit-arithmetic", "missing-route"]);
  expect(internalLessonIds("#/lesson/missing-route")).toEqual(["missing-route"]);
  expect(internalLessonIds("https://example.com/#/lesson/missing-route")).toEqual([]);
});

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
    for (const id of learnerText(lesson).flatMap(internalLessonIds)) {
      expect(routes.has(id), `${lesson.id} links to ${id}`).toBe(true);
    }
  }
});
