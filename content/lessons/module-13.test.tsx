// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { readFileSync } from "node:fs";
import { URL as NodeURL } from "node:url";
import { render, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { checkLesson, termProblems, learnerText } from "@platform/lesson-schema";
import { LessonView, memoryStorage } from "@platform/lesson-runtime";
import { createBook } from "@al/views";
import { LESSONS } from ".";
import { moduleByNumber, lessonsOf } from "../plan/plan";

const lessons = LESSONS.filter((l) => l.module === 13);
afterEach(cleanup);
describe("Raspberry Pi 5 physical-board extension", () => {
  it("adds four practical pages after QEMU and four optional A comparisons", () => {
    expect(lessons.map((l) => l.id)).toEqual([
      "raspberry-pi-5",
      "raspberry-pi-boot",
      "capture-pi-boot",
      "restore-pi-boot",
    ]);
    const ids = LESSONS.map((l) => l.id);
    expect(ids.indexOf("raspberry-pi-5")).toBe(ids.indexOf("diagnosing-native-failure") + 1);
    expect(ids.indexOf("same-c-on-a32")).toBe(ids.indexOf("restore-pi-boot") + 1);
    expect(ids.indexOf("twos-complement")).toBe(ids.indexOf("a32-division-helper") + 1);
    expect(ids.at(-1)).toBe("twos-complement");
    expect(moduleByNumber(13)?.label).toBe("13");
    expect(lessonsOf(moduleByNumber(14)!, LESSONS).map((l) => l.id)).toEqual([
      "same-c-on-a32",
      "a32-conditions",
      "a32-constants",
      "a32-division-helper",
    ]);
    expect(termProblems(LESSONS)).toEqual([]);
  });

  it.each(lessons)("$id: renders every required activity without a prediction lock", (lesson) => {
    expect(checkLesson(lesson)).toEqual([]);
    expect(lesson.sectionLayout).toBe("selected");
    const { container } = render(
      <LessonView
        book={createBook({ title: "Assembly Lab", lessons: LESSONS })}
        lesson={lesson}
        storage={memoryStorage()}
      />,
    );
    expect(container.querySelector(".al-problem, .al-locked")).toBeNull();
    expect(container.textContent).toMatch(
      /Hardware verification (?:is|remains) pending|physical boot and serial path await verification/,
    );
    for (const interactive of lesson.sections.flatMap((s) => s.interactives))
      expect(container.querySelector(`#ix-${interactive.id}`)).not.toBeNull();
  });

  it("keeps Pi connector, raw-image and physical verification facts visible", () => {
    const prep = learnerText(lessons[0]!).join("\n");
    expect(prep).toContain("official Raspberry Pi Debug Probe");
    expect(prep).toContain("**U**");
    expect(prep).toContain("**UART**");
    expect(prep).toContain("not a pin-orientation drawing");
    const schematics = lessons[0]!.sections.flatMap((s) => s.interactives);
    expect(schematics.map((x) => x.kind)).toEqual(["board-schematic"]);
    expect(schematics.every((x) => !x.props["after"])).toBe(true);
    const boot = learnerText(lessons[1]!).join("\n");
    expect(boot).toContain("0x200000");
    expect(learnerText(lessons[2]!).join("\n")).toContain("115200");
    expect(boot).toContain("device_tree=");
    expect(boot).toContain("trip_distance.s");
  });

  it("includes all rendered prose in the canonical review copy", () => {
    const canonical = readFileSync(
      new NodeURL("../../docs/notes/module-13/prose.md", import.meta.url),
      "utf8",
    );
    const flat = (s: string) => s.replace(/[`*]/g, "").replace(/\s+/g, " ").trim();
    for (const lesson of lessons)
      for (const text of learnerText(lesson)) {
        const copy = readFileSync(
          new NodeURL("../../docs/notes/course-pacing-implementation/copy.md", import.meta.url),
          "utf8",
        );
        const recorded = canonical + "\n" + copy.replace(/\\n/g, "\n").replace(/\\"/g, '"');
        for (const paragraph of text.split("\n\n"))
          expect(flat(recorded), paragraph).toContain(flat(paragraph));
      }
  });
});
