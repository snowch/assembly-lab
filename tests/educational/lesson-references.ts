// Copyright © 2026 Christopher Snow

import { LESSONS } from "@al/content";
import { MODULES } from "@al/content/plan";

/** Expected visible course position, independently derived from the published plan and order. */
export function lessonPosition(id: string): string {
  const lesson = LESSONS.find((item) => item.id === id);
  if (!lesson) throw new Error(`No published lesson: ${id}`);
  const module = MODULES.find((item) => item.lessonModule === lesson.module);
  if (!module) throw new Error(`No planned module for lesson: ${id}`);
  const siblings = LESSONS.filter((item) => item.module === lesson.module);
  return `Module ${module.label}, lesson ${siblings.findIndex((item) => item.id === id) + 1}`;
}

/** Retain authored link wording while pinning the course's visible numbering contract. */
export function lessonLabel(id: string, title?: string): string {
  const lesson = LESSONS.find((item) => item.id === id);
  if (!lesson) throw new Error(`No published lesson: ${id}`);
  const position = lessonPosition(id)
    .replace(/^Module /, "M")
    .replace(", lesson ", ", L");
  return `${position}: ${title ?? lesson.title}`;
}

/** Compact labels only within an already named module on the plan. */
export function planLessonLabel(id: string): string {
  const lesson = LESSONS.find((item) => item.id === id);
  if (!lesson) throw new Error(`No published lesson: ${id}`);
  const siblings = LESSONS.filter((item) => item.module === lesson.module).sort(
    (a, b) => a.order - b.order,
  );
  return `L${siblings.findIndex((item) => item.id === id) + 1}: ${lesson.title}`;
}
