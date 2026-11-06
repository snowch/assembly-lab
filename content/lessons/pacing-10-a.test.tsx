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
  it("keeps terminal roles and build guidance complete across Markdown page boundaries", () => {
    const text = (id: string) =>
      lessons
        .find((lesson) => lesson.id === id)!
        .sections.map((section) => section.prose)
        .join("\n\n");
    for (const id of ["stepping-native-function", "diagnosing-native-failure"]) {
      const page = text(id);
      expect(page).toContain("- Terminal 1 will run QEMU.\n- Terminal 2 will run GDB.");
      expect(page).toContain("Keep both open while stepping.");
      expect(page.indexOf("Keep both open while stepping.")).toBeLessThan(
        page.indexOf("qemu-system-aarch64"),
      );
      expect(page).toContain("gdb-multiarch ./boot.elf");
      expect(page).toContain("target remote 127.0.0.1:1234");
    }
    const build = text("from-function-to-executable");
    expect(build).toContain("- `-T boot.ld` selects the **linker script**");
    expect(build).toContain("1. Change only the third instruction in `trip_distance.s`.");
    expect(build).toContain("3. Restore the subtraction and rebuild before the next lesson.");
    const layout = text("loading-and-startup");
    expect(layout).toContain("- `.stack` reserves stack space.");
    expect(layout).toContain("- `.skip` reserves space.");
    expect(layout).toContain("[Finding and repairing a native error]");
    expect(layout).not.toContain("Assemble the startup code and the function separately");
    const startup = text("runtime-startup");
    expect(startup).toContain("Follow `_start` in `boot.s`.");
    expect(startup).not.toContain("To reproduce the arithmetic failure");
    expect(text("diagnosing-native-failure")).toContain(
      "- `-g` includes information that lets a debugger relate machine code to source names and lines.",
    );
    expect(text("diagnosing-native-failure")).toContain(
      "aarch64-linux-gnu-as -g boot.s -o boot.o\naarch64-linux-gnu-as -g trip_distance.s -o trip_distance.o\naarch64-linux-gnu-ld -T boot.ld boot.o trip_distance.o -o boot.elf",
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
