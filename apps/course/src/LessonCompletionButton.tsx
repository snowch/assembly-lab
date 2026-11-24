// Copyright © 2026 Christopher Snow

import { type LessonCompletionStore, useLessonCompletion } from "./lesson-completion";
import { STRINGS } from "./strings";
import { MaterialSymbol } from "./MaterialSymbol";

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
        aria-pressed={complete}
        onClick={() => store.set(lessonId, !complete)}
        aria-label={complete ? STRINGS.completion.undo : undefined}
        aria-describedby="lesson-completion-note"
      >
        <MaterialSymbol
          name={complete ? "check_box" : "check_box_outline_blank"}
          className="lesson-completion-icon"
        />
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
