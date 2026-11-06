// Copyright © 2026 Christopher Snow

// The course's Book, the contract between the platform's runtime and this course (see
// platform/lesson-runtime/src/book.ts): the lessons that are written, joined to the figures, the
// editor and the grader of packages/views.

import { LESSONS } from "@al/content";
import { MODULES } from "@al/content/plan";
import { createBook as createCourseBook, createLessonReferences } from "@al/views";
import type { CourseBook } from "@al/views";

import { STRINGS } from "./strings";

export const COURSE_REFERENCES = createLessonReferences(
  LESSONS,
  Object.fromEntries(MODULES.map((module) => [module.lessonModule, module.label])),
);

export function createBook(): CourseBook {
  return createCourseBook({
    title: STRINGS.title,
    lessons: LESSONS,
    moduleLabels: Object.fromEntries(MODULES.map((module) => [module.lessonModule, module.label])),
  });
}
