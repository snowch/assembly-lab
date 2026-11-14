// Copyright © 2026 Christopher Snow

// The course's Book, the contract between the platform's runtime and this course (see
// platform/lesson-runtime/src/book.ts): the lessons that are written, joined to the figures, the
// editor and the grader of packages/views.

import { LESSONS, lessonSources } from "@al/content";
import { MODULES } from "@al/content/plan";
import {
  createBook as createCourseBook,
  createLessonReferences,
  linkLessonInstructionIntroductions,
} from "@al/views";
import type { CourseBook } from "@al/views";

import { STRINGS } from "./strings";

export const COURSE_REFERENCES = createLessonReferences(
  LESSONS,
  Object.fromEntries(MODULES.map((module) => [module.lessonModule, module.label])),
);

export const COURSE_SOURCES = new Map(LESSONS.map((lesson) => [lesson.id, lessonSources(lesson)]));

export function createBook(): CourseBook {
  const linked = new Set<string>();
  const lessons = LESSONS.map((lesson) =>
    linkLessonInstructionIntroductions(
      lesson,
      COURSE_SOURCES.get(lesson.id)!.introductions,
      linked,
    ),
  );
  return createCourseBook({
    title: STRINGS.title,
    lessons,
    moduleLabels: Object.fromEntries(MODULES.map((module) => [module.lessonModule, module.label])),
  });
}
