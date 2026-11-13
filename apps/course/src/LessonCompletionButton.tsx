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
        data-complete={complete}
        onClick={() => store.set(lessonId, !complete)}
        aria-label={complete ? STRINGS.completion.undo : undefined}
        aria-describedby="lesson-completion-note"
      >
        <svg className="lesson-completion-icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          {complete && <path d="m7.5 12 3 3 6-6" />}
        </svg>
        {complete ? (
          <span className="lesson-completion-label">
            <span>{STRINGS.completion.complete}</span>
            <span className="lesson-completion-undo">{` · ${STRINGS.completion.undoAction}`}</span>
          </span>
        ) : (
          <span>{STRINGS.completion.mark}</span>
        )}
      </button>
    </div>
  );
}
