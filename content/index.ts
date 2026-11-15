// Copyright © 2026 Christopher Snow

export * from "./plan/plan";
export { LESSONS, SOURCE_LESSONS } from "./lessons";
export { TRIP_DISTANCE } from "./lessons/meet-the-machine.listings";
// The cover's live figure runs a program of its own, which is in no lesson.
export { COVER_CALL, COVER_PROGRAM } from "./cover";

export { WHERE_NEXT } from "./where-next.prose";
export { PLAYGROUND_STARTER } from "./where-next.example";

export {
  lessonSources,
  FIRST_INSTRUCTION_FORMS,
  LESSON_INSTRUCTION_FORMS,
} from "./lesson-source-references";
export type { LessonSources, SourceReference } from "./lesson-source-references";
