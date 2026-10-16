// Copyright © 2026 Christopher Snow

// The course's Book, the contract between the platform's runtime and this course (see
// platform/lesson-runtime/src/book.ts): the lessons that are written, joined to the figures, the
// editor and the grader of packages/views.

import { LESSONS } from "@al/content";
import { createBook as createCourseBook } from "@al/views";
import type { Book } from "@platform/lesson-runtime";

import { STRINGS } from "./strings";

export function createBook(): Book {
  return createCourseBook({ title: STRINGS.title, lessons: LESSONS });
}
