// Copyright © 2026 Christopher Snow

// The course's Book: the contract between the platform's runtime and this course
// (platform/lesson-runtime/src/book.ts). The lessons, the figures they name by kind, the editor for
// a challenge's artifact, the grader, and a note for the one model the figures run.

import type { Book, ChallengeEditorProps } from "@platform/lesson-runtime";
import type { Lesson } from "@platform/lesson-schema";

import { ViewHandoffScope } from "./update-handoff";
import { CEditor } from "./CEditor";
import { RUN_C } from "./grader-c";
import { AnswerEditor } from "./AnswerEditor";
import { AssemblyEditor } from "./AssemblyEditor";
import { grade, isWritten } from "./grader";
import { INTERACTIVES } from "./interactives";
import { VIEW_STRINGS as S } from "./strings";

/** The book's id: learner state is kept under keys that start `assembly-lab:v1:`. */
export const BOOK_ID = "assembly-lab";

/** The name the course's figures give the model they run: one instruction to a step. */
export const STEPS = "steps";

export function ChallengeEditor(props: ChallengeEditorProps) {
  const editor =
    props.challenge.tests.kind === "answers" && props.challenge.tests.grader === RUN_C ? (
      <CEditor {...props} />
    ) : isWritten(props.challenge) ? (
      <AssemblyEditor {...props} />
    ) : (
      <AnswerEditor {...props} />
    );
  return (
    <ViewHandoffScope
      id={`${BOOK_ID}:${props.lesson.id}:challenge:${props.challenge.id}`}
      signature={JSON.stringify(props.challenge.initial)}
    >
      {editor}
    </ViewHandoffScope>
  );
}

export function createBook(options: { title: string; lessons: readonly Lesson[] }): Book {
  return {
    id: BOOK_ID,
    title: options.title,
    lessons: options.lessons,
    interactives: INTERACTIVES,
    ChallengeEditor,
    grade,
    timeModelNotes: { [STEPS]: S.modelNote },
    roleNotes: S.figureRoleNotes,
  };
}
