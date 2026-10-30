// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { readFileSync } from "node:fs";
import { URL as NodeURL } from "node:url";
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { checkLesson, parseLesson, testCount } from "@platform/lesson-schema";
import { LessonView, memoryStorage } from "@platform/lesson-runtime";
import { createBook, grade } from "@al/views";
import { paced10ToA } from "./pacing-10-a";
import { pacing10A } from "./pacing-10-a.copy";

const lessons = paced10ToA.map(parseLesson);
afterEach(cleanup);
describe("paced compiler, native and target-comparison activities", () => {
  it.each(lessons)("$id owns its complete local activities", (lesson) => {
    expect(checkLesson(lesson)).toEqual([]);
    expect(lesson.objectives.length).toBeGreaterThan(0);
    const figures = lesson.sections.flatMap((section) => section.interactives);
    const ids = new Set(figures.map((figure) => figure.id));
    for (const figure of figures) {
      const after = figure.props["after"];
      if (after) expect(ids.has(String(after)), `${figure.id}: ${after}`).toBe(true);
    }
    for (const challenge of lesson.challenges) {
      expect(figures.some((figure) => figure.props["challengeId"] === challenge.id)).toBe(true);
      expect(grade(challenge, challenge.reference)).toEqual({
        passed: true,
        total: testCount(challenge),
        failures: [],
      });
      expect(grade(challenge, challenge.initial).passed).toBe(false);
    }
    const { container } = render(
      <LessonView
        book={createBook({ title: "Assembly Lab", lessons })}
        lesson={lesson}
        storage={memoryStorage()}
      />,
    );
    expect(container.querySelector(".interactive-problem,.interactive-missing")).toBeNull();
  });
  it("moves each existing A32 field to exactly one local exercise", () => {
    const local = lessons.filter((lesson) => lesson.module === 14);
    expect(
      local.map((lesson) =>
        lesson.challenges.flatMap((challenge) => challenge.fields.map((field) => field.id)),
      ),
    ).toEqual([["return"], ["conditional"], ["constant"], ["helper", "divide", "result"]]);
  });
  it("preserves complete Pi command workflows and their practical boundaries", () => {
    const text = (id: string) =>
      lessons
        .find((lesson) => lesson.id === id)!
        .sections.map((section) => section.prose)
        .join("\n");
    const prepare = text("raspberry-pi-5");
    expect(prepare.indexOf("**EEPROM**")).toBeGreaterThanOrEqual(0);
    expect(prepare.indexOf("**EEPROM**")).toBeLessThan(prepare.indexOf("rpi-eeprom-update"));
    const build = text("raspberry-pi-boot");
    expect(build).toContain(
      "sudo apt-get install picocom\nunzip assembly-lab-pi5.zip\ncd assembly-lab-pi5\nmake\nmake card-files",
    );
    expect(build).not.toContain("picocom --baud");
    const capture = text("capture-pi-boot");
    expect(capture).toContain("picocom --baud 115200");
    expect(capture).toContain("Ctrl-X");
    expect(capture).toContain("**A trip-check failure:**");
    expect(capture).not.toContain("Change the third arithmetic instruction");
    const restored = text("restore-pi-boot");
    expect(restored).toContain(
      "Restore the subtraction, rebuild, replace the image and boot once more",
    );
  });
  it("records the separately drafted strings exactly", () => {
    const canonical = readFileSync(
      new NodeURL("../../docs/notes/course-pacing-implementation/copy.md", import.meta.url),
      "utf8",
    );
    const block = canonical
      .split("## pacing-10-a.copy.ts")[1]!
      .match(/```json\n([\s\S]*?)\n```/)![1]!;
    expect(JSON.parse(block)).toEqual(pacing10A);
  });
});
