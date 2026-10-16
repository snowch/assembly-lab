// Copyright © 2026 Christopher Snow

// The course's Book, the contract between the platform's runtime and this course (see
// platform/lesson-runtime/src/book.ts). There are no lessons yet, so it holds no interactives, an
// editor that says there is nothing to edit, and a grader that says nothing can be graded. The
// first lesson adds data here; the model and its views (packages/) fill in the rest.

import { LESSONS } from "@al/content";
import type { Book, ChallengeEditorProps, Verdict } from "@platform/lesson-runtime";

import { STRINGS } from "./strings";

/** The book's id: learner state is kept under keys that start `assembly-lab:v1:`. */
export const BOOK_ID = "assembly-lab";

function ChallengeEditor(_props: ChallengeEditorProps) {
  return <p role="note">{STRINGS.noEditor}</p>;
}

export function grade(): Verdict {
  return { passed: false, total: 0, failures: [], blocked: STRINGS.noGrader };
}

export function createBook(): Book {
  return {
    id: BOOK_ID,
    title: STRINGS.title,
    lessons: LESSONS,
    interactives: {},
    ChallengeEditor,
    grade,
    timeModelNotes: {},
  };
}
