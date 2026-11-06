// Copyright © 2026 Christopher Snow

// The course's Book: the contract between the platform's runtime and this course
// (platform/lesson-runtime/src/book.ts). The lessons, the figures they name by kind, the editor for
// a challenge's artifact, the grader, and the notes for distinct figure interactions.

import type { Book, ChallengeEditorProps } from "@platform/lesson-runtime";
import type { Lesson } from "@platform/lesson-schema";

import { ViewHandoffScope } from "./update-handoff";
import { CEditor } from "./CEditor";
import { RUN_C } from "./grader-c";
import { AnswerEditor } from "./AnswerEditor";
import { FourBitAnswerEditor, FourBitEditorSchema } from "./FourBitAnswerEditor";
import { AssemblyEditor } from "./AssemblyEditor";
import { grade, isWritten } from "./grader";
import { INTERACTIVES } from "./interactives";
import { VIEW_STRINGS as S } from "./strings";
import {
  createLessonReferences,
  LessonReferenceProvider,
  numberLessonMarkdown,
} from "./lesson-references";
import type { LessonReferences } from "./lesson-references";

/** The book's id: learner state is kept under keys that start `assembly-lab:v1:`. */
export const BOOK_ID = "assembly-lab";

/** The name the course's figures give the model they run: one instruction to a step. */
export const STEPS = "steps";

export function ChallengeEditor(props: ChallengeEditorProps) {
  const fourBit = FourBitEditorSchema.safeParse(props.challenge.initial.data?.["editor"]);
  const editor =
    props.challenge.tests.kind === "answers" && props.challenge.tests.grader === RUN_C ? (
      <CEditor {...props} />
    ) : isWritten(props.challenge) ? (
      <AssemblyEditor {...props} />
    ) : fourBit.success ? (
      <FourBitAnswerEditor {...props} first={fourBit.data.first} />
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

export interface CourseBook extends Book {
  readonly references: LessonReferences;
  /** The runtime uses these titles for prerequisite anchors; the current lesson keeps its own title. */
  readonly referenceLessons: readonly Lesson[];
}

export function createBook(options: {
  title: string;
  lessons: readonly Lesson[];
  moduleLabels?: Readonly<Record<number, string>>;
}): CourseBook {
  const references = createLessonReferences(options.lessons, options.moduleLabels);
  const lessons = options.lessons.map((lesson) => numberLessonMarkdown(lesson, references));
  const interactives = Object.fromEntries(
    Object.entries(INTERACTIVES).map(([kind, View]) => [
      kind,
      (props: React.ComponentProps<typeof View>) => (
        <LessonReferenceProvider references={references}>
          <View {...props} />
        </LessonReferenceProvider>
      ),
    ]),
  );
  return {
    id: BOOK_ID,
    title: options.title,
    lessons,
    references,
    referenceLessons: lessons.map((lesson) => ({ ...lesson, title: references.label(lesson.id) })),
    interactives,
    ChallengeEditor: (props) => (
      <LessonReferenceProvider references={references}>
        <ChallengeEditor {...props} />
      </LessonReferenceProvider>
    ),
    grade,
    // Explain stepping in the introductory lesson, not in every figure and footer.
    timeModelNotes: {},
    roleNotes: S.figureRoleNotes,
  };
}
