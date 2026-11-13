// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";
import { LessonStore, memoryStorage, verifyCompletion } from "@platform/lesson-runtime";
import { LESSONS } from "@al/content";
import { createBook } from "../book";
import { S, MARKUP } from "./strings";
import { flagsModel } from "./model";
import { PLUS } from "../../../../content/lessons/adding-and-the-flags.listings";
import {
  blank,
  commitCase,
  committedCase,
  gradeCase,
  stateFor,
  FLAGS_VIEW_SLOT,
  type Answers,
} from "./state";

const lesson = LESSONS.find((l) => l.id === "adding-and-the-flags")!;
const challenge = lesson.challenges.find((c) => c.id === "predict-flags")!;
const book = createBook({ title: "Assembly Lab", lessons: LESSONS });
const store = () => new LessonStore(memoryStorage(), book.id, lesson.id);
const answers = (n: 0 | 1, z: 0 | 1, c: 0 | 1, v: 0 | 1): Answers => ({
  choices: { n, z, c, v },
  checked: true,
});
const correct = [
  answers(0, 1, 1, 0),
  answers(0, 0, 0, 0),
  answers(0, 1, 1, 1),
  answers(1, 0, 0, 1),
  answers(1, 0, 0, 0),
  answers(0, 1, 0, 0),
] as const;

describe("the imported flags presentation uses canonical work and graders", () => {
  it("owns only the published addition challenge; the later challenge remains in its lesson", () => {
    expect(lesson.challenges.map((c) => c.id)).toEqual(["predict-flags"]);
    expect(
      LESSONS.find((l) => l.id === "flags-and-overflow")!.challenges.map((c) => c.id),
    ).toContain("smallest-overflow");
  });
  it("requires genuine checked cases and preserves independent correct work after an edit", () => {
    const s = store();
    correct.forEach((a, i) => commitCase(s, challenge, i, a, true));
    expect(verifyCompletion(book, lesson, s.get()).passed).toBe(1);
    expect(s.challenge(challenge.id)!.firstPassedAt).toBeDefined();
    commitCase(s, challenge, 1, answers(1, 0, 0, 0), false);
    expect(verifyCompletion(book, lesson, s.get()).passed).toBe(0);
    expect(gradeCase(s, challenge, 0).passed).toBe(true);
    expect(gradeCase(s, challenge, 1).passed).toBe(false);
    expect(gradeCase(s, challenge, 2).passed).toBe(true);
    expect(s.challenge(challenge.id)!.artifact.answers).not.toHaveProperty("second-n");
    expect(committedCase(s, challenge, 1, correct[1])).toBe(false);
    commitCase(s, challenge, 1, answers(1, 0, 0, 0), true);
    expect(gradeCase(s, challenge, 1).passed).toBe(false);
    commitCase(s, challenge, 1, correct[1], true);
    expect(verifyCompletion(book, lesson, s.get()).passed).toBe(1);
  });
  it("does not accept forged presentation check bits or a pending prediction as a canonical result", () => {
    const s = store(),
      snapshot = blank(correct.length);
    snapshot.practice.cases = correct.map((a) => structuredClone(a));
    snapshot.arm.committed = 1;
    s.setSlot(FLAGS_VIEW_SLOT, snapshot);
    const restored = stateFor(s, challenge);
    expect(restored.practice.cases.every((a) => !a.checked)).toBe(true);
    expect(restored.arm.committed).toBeNull();
    expect(verifyCompletion(book, lesson, s.get()).passed).toBe(0);
  });
  it("migrates legacy prediction and challenge answers without rewriting them or the older miniature", () => {
    const s = store();
    s.setSlot("predict-readings", { choice: "unsigned" });
    s.setSlot("four-bit-flag-practice", {
      choices: { n: "0", z: "0", c: "1", v: "1" },
      submitted: true,
    });
    s.setChallenge(challenge.id, (c) => ({
      ...c,
      artifact: challenge.reference,
      attempts: 1,
      hintsRevealed: 2,
    }));
    const before = JSON.stringify(s.get()),
      restored = stateFor(s, challenge);
    expect(restored.arm.committed).toBe(1);
    expect(restored.practice.cases).toEqual(correct);
    expect(restored.mini.checked).toBe(false);
    expect(JSON.stringify(s.get())).toBe(before);
    expect(verifyCompletion(book, lesson, s.get()).passed).toBe(1);
  });
  it("sanitises malformed presentation slots without enabling either gate", () => {
    const s = store();
    s.setSlot(FLAGS_VIEW_SLOT, {
      example: 900,
      mini: { choices: { n: 7 }, intent: "x" },
      arm: { done: Infinity, committed: "1" },
      practice: { index: -1, cases: [null, { choices: { n: true } }] },
    });
    const result = stateFor(s, challenge);
    expect(result.example).toBe(0);
    expect(result.arm.done).toBe(0);
    expect(result.practice.index).toBe(0);
    expect(result.arm.committed).toBeNull();
    expect(result.practice.cases.every((a) => !a.checked)).toBe(true);
  });
  it("preserves the former three checked cases and leaves added cases unanswered", () => {
    const s = store();
    correct.slice(0, 3).forEach((answer, i) => commitCase(s, challenge, i, answer, true));
    const previous = blank(3);
    previous.practice.index = 2;
    previous.practice.cases = correct.slice(0, 3).map((answer) => structuredClone(answer));
    s.setSlot(FLAGS_VIEW_SLOT, previous);
    s.setChallenge(challenge.id, (value) => ({
      ...value,
      firstPassedAt: "2026-11-12T12:00:00.000Z",
    }));
    const restored = stateFor(s, challenge);
    expect(restored.practice.index).toBe(2);
    expect(restored.practice.cases.slice(0, 3)).toEqual(correct.slice(0, 3));
    expect(restored.practice.cases.slice(3)).toEqual([
      { choices: {}, checked: false },
      { choices: {}, checked: false },
      { choices: {}, checked: false },
    ]);
    expect(verifyCompletion(book, lesson, s.get()).passed).toBe(0);
    correct.slice(3).forEach((answer, i) => commitCase(s, challenge, i + 3, answer, true));
    expect(verifyCompletion(book, lesson, s.get()).passed).toBe(1);
  });
});

describe("every illustrated pattern and flag comes from the model", () => {
  it.each([
    [4, 15, 1, "0000", 0, 1, 1, 0, 1, 1],
    [4, 7, 1, "1000", 1, 0, 0, 1, 1, 0],
    [4, 8, 8, "0000", 0, 1, 1, 1, 0, 1],
    [4, 8, 15, "0111", 0, 0, 1, 1, 0, 1],
    [4, 5, 12, "0001", 0, 0, 1, 0, 1, 1],
    [32, 0x7fffffff, 1, "10000000000000000000000000000000", 1, 0, 0, 1, 1, 0],
  ] as const)("width%s, %s + %s", (width, a, b, bits, n, z, c, v, into, out) => {
    const m = flagsModel(PLUS, width, a, b);
    expect(m.result.bits).toBe(bits);
    expect(m.flags).toEqual({ n, z, c, v });
    expect(m.carryIn).toBe(into);
    expect(m.carryOut).toBe(out);
    expect(m.columns).toHaveLength(width);
    m.columns.forEach((work) => {
      expect(work.kept).toBe(work.total % 2);
      expect(work.carryOut).toBe(Math.floor(work.total / 2));
    });
  });
  it("retains the important user heading and no executable prototype code", () => {
    expect(MARKUP).toContain("C is for unsigned. V is for signed.");
    expect(MARKUP).not.toMatch(/<script|onclick=|<iframe/);
    expect(MARKUP).toContain('id="challengeHints"');
    expect(S.carryMatch).toContain("V = 0");
  });
});
