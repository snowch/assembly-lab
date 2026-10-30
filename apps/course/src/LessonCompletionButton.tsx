// Copyright © 2026 Christopher Snow

import { type LessonCompletionStore, useLessonCompletion } from "./lesson-completion";
import { STRINGS } from "./strings";

export function LessonCompletionButton({
  store,
  lessonId,
}: {
  store: LessonCompletionStore;
  lessonId: string;
}) {
  const { completed } = useLessonCompletion(store);
  const complete = completed.has(lessonId);
  return (
    <div className="lesson-completion">
      <button
        className="button"
        type="button"
        onClick={() => store.set(lessonId, !complete)}
        aria-describedby="lesson-completion-note"
      >
        {complete ? STRINGS.completion.undo : STRINGS.completion.mark}
      </button>
    </div>
  );
}
