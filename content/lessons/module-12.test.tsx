// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow
import { readFileSync } from "node:fs";
import { URL as NodeURL } from "node:url";
import { render, cleanup, fireEvent, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SECTION_KINDS, checkLesson, termProblems } from "@platform/lesson-schema";
import { LessonView, memoryStorage } from "@platform/lesson-runtime";
import { createBook, gradeWritten } from "@al/views";
import { LESSONS } from ".";
import { TRIP_DISTANCE } from "./meet-the-machine.listings";
import { NATIVE_CALL, BROKEN_TRIP, TWICE_TEXT, NATIVE_CASES } from "./native.listings";
import { traceOf, viewAt, wValue } from "../../packages/views/src/trace";
import EVIDENCE from "./module-12.evidence.json" with { type: "json" };
import { LABELS as DIAGRAM_LABELS } from "./native-diagrams.labels";
import { NativeBootDiagrams } from "../../packages/views/src/interactives/NativeBootDiagrams";

const lessons = LESSONS.filter((lesson) => lesson.module === 12);
afterEach(cleanup);
describe("final core native module", () => {
  it("maps stored ELF contents and memory-only sections without inventing file bytes", () => {
    const { container, getByRole } = render(
      <NativeBootDiagrams kind="memory" evidence={EVIDENCE.boot} labels={DIAGRAM_LABELS} />,
    );
    for (const section of EVIDENCE.boot.image.sections) {
      const row = container.querySelector(`[data-elf-section="${section.name}"]`)!;
      expect(row.getAttribute("data-file-backed")).toBe(String(section.fileSize > 0));
      const source = row.querySelector(".al-elf-source")!;
      expect(source.querySelector("code") !== null).toBe(section.fileSize > 0);
      expect(row.querySelector(".al-elf-target")?.textContent).toContain(
        `0x${section.address.toString(16)}–0x${(section.address + section.size).toString(16)}`,
      );
      fireEvent.click(row);
      expect(row.getAttribute("aria-pressed")).toBe("true");
      expect(getByRole("status").textContent).toContain(
        DIAGRAM_LABELS.memory.sectionDetails[
          section.name as keyof typeof DIAGRAM_LABELS.memory.sectionDetails
        ],
      );
    }
    expect(container.querySelector("[data-native-device]")?.closest(".al-elf-rows")).toBeNull();
  });
  it("draws the recorded stack frame towards lower addresses within the reservation", () => {
    const { container } = render(
      <NativeBootDiagrams kind="memory" evidence={EVIDENCE.boot} labels={DIAGRAM_LABELS} />,
    );
    const frame = EVIDENCE.boot.stackFrame;
    expect(frame.beforeSp - frame.frameSp).toBe(frame.frameSize);
    expect(frame.beforeSp).toBe(EVIDENCE.boot.stackTop);
    expect(frame.frameSp).toBeGreaterThanOrEqual(EVIDENCE.boot.stackBottom);
    const stack = container.querySelector("[data-native-stack]")!;
    expect(stack.textContent).toContain(`0x${frame.beforeSp.toString(16)}`);
    expect(stack.textContent).toContain(`−${frame.frameSize}`);
    expect(stack.textContent).toContain(`0x${frame.frameSp.toString(16)}`);
  });
  it("keeps observed control order distinct from address order and the board example", () => {
    const { container, getByRole } = render(
      <NativeBootDiagrams kind="flow" evidence={EVIDENCE.boot} labels={DIAGRAM_LABELS} />,
    );
    const path = getByRole("list", { name: DIAGRAM_LABELS.flow.qemuTitle });
    expect(
      [...path.querySelectorAll("[data-flow-stage]")].map((n) => n.getAttribute("data-flow-stage")),
    ).toEqual(["loader", "entry", "startup", "trip", "result", "uart", "halt"]);
    expect(EVIDENCE.boot.flow.returned).toBeLessThan(EVIDENCE.boot.flow.trip);
    const trip = within(path).getByRole("button", { name: /trip_distance/ });
    fireEvent.click(trip);
    expect(getByRole("status").textContent).toContain(
      DIAGRAM_LABELS.flow.nodes.find((n) => n.id === "trip")!.detail,
    );
    expect(container.querySelector(".al-board-example [data-flow-stage]")).toBeNull();
  });
  it("precedes optional A without changing its stored-work ID", () => {
    expect(lessons.map((l) => l.id)).toEqual([
      "from-function-to-executable",
      "debug-native-instructions",
    ]);
    expect(LESSONS.at(-1)?.id).toBe("same-c-on-a32");
    expect(LESSONS.at(-1)?.module).toBe(14);
    expect(termProblems(LESSONS)).toEqual([]);
  });
  it.each(lessons)(
    "$id: renders ten sections, a mounted challenge, and no broken figures",
    (lesson) => {
      expect(checkLesson(lesson)).toEqual([]);
      expect(lesson.sections.map((s) => s.kind)).toEqual([...SECTION_KINDS]);
      const book = createBook({ title: "Assembly Lab", lessons: LESSONS });
      const { container } = render(
        <LessonView book={book} lesson={lesson} storage={memoryStorage()} />,
      );
      expect(container.querySelector(".al-problem")).toBeNull();
      expect(container.querySelectorAll("section.lesson-section")).toHaveLength(10);
      expect(container.querySelectorAll("section.challenge")).toHaveLength(1);
      for (const challenge of lesson.challenges) {
        expect(gradeWritten(challenge, challenge.initial).passed).toBe(false);
        expect(gradeWritten(challenge, challenge.reference).passed).toBe(true);
        expect(challenge.hints).toHaveLength(5);
      }
    },
  );
  it("agrees with each recorded native stop, including ret leaving w0 unwritten", () => {
    for (const [program, record] of [
      [TRIP_DISTANCE, EVIDENCE.good],
      [BROKEN_TRIP, EVIDENCE.broken],
    ] as const) {
      const trace = traceOf(program, NATIVE_CALL);
      expect(record.registers).toEqual(
        Array.from({ length: 5 }, (_, k) =>
          [0, 1, 2, 3].map((n) => wValue(viewAt(trace, k).state, n)),
        ),
      );
      expect(viewAt(trace, 4).written.has(0)).toBe(false);
      expect(record.pcOffsets).toEqual([0, 4, 8, 12]);
      expect(record.returnTo).toBe("after_trip");
    }
    expect(EVIDENCE.stdout).toBe("Assembly Lab: trip check passed");
    expect(EVIDENCE.brokenStdout).toBe("Assembly Lab: trip check failed");
    const boot = EVIDENCE.boot;
    expect(boot.resetPc).toBe(boot.entry);
    expect(boot.stackTop % 16).toBe(0);
    expect(boot.startupStops.map((s) => s.result)).toEqual([0xa5a5a5a5, 0, 232]);
    expect(boot.startupStops.slice(1).map((s) => s.sp)).toEqual([boot.stackTop, boot.stackTop]);
  });
  it("checks behaviour instead of exact reference text and shares native cases", () => {
    const challenge = lessons[1]!.challenges[0]!;
    const alternative = TWICE_TEXT.replace(
      "sub w0, w0, w3\nsub w0, w0, w3",
      "add w3, w3, w3\nsub w0, w0, w3",
    );
    expect(gradeWritten(challenge, { text: alternative }).passed).toBe(true);
    const harness = readFileSync(
      new NodeURL("../../apps/course/public/native/verify-boot.s", import.meta.url),
      "utf8",
    );
    for (const [a, b, c, d] of NATIVE_CASES)
      expect(harness.replace(/\s/g, "")).toContain(`.word${a},${b},${c},${d},${a + b + c - 2 * d}`);
  });
});
