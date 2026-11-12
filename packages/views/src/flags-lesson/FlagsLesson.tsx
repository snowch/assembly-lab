// Copyright © 2026 Christopher Snow

import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  HintLadder,
  StringsContext,
  DEFAULT_STRINGS,
  useStored,
  type LessonStore,
} from "@platform/lesson-runtime";
import type { Challenge } from "@platform/lesson-schema";
import type { CourseBook } from "../book";
import { useLessonStore, type LessonViewProps } from "@platform/lesson-runtime";
import { RecordedSchema } from "../interactives/props";
import { mountFlagsLesson } from "./controller";
import { MARKUP } from "./strings";

const AUTHORED_HTML = { __html: MARKUP };

/** One course-owned presentation, preserving the approved authored DOM and the runtime's store. */
function FlagsHints({ store, challenge }: { store: LessonStore; challenge: Challenge }) {
  const stored = useStored(store);
  return (
    <HintLadder
      hints={challenge.hints}
      revealed={stored.challenges[challenge.id]?.hintsRevealed ?? 0}
      onReveal={() =>
        store.setChallenge(challenge.id, (c) => ({ ...c, hintsRevealed: c.hintsRevealed + 1 }))
      }
      idPrefix={`challenge-${challenge.id}`}
    />
  );
}
export function FlagsLesson({
  book,
  lesson,
  storage,
  strings = DEFAULT_STRINGS,
}: Omit<LessonViewProps, "book"> & { book: CourseBook }) {
  const host = useRef<HTMLDivElement>(null);
  const store = useLessonStore(storage, book.id, lesson.id);
  const [hintHost, setHintHost] = useState<HTMLElement | null>(null);
  const challenge = lesson.challenges.find((c) => c.id === "predict-flags");
  if (!challenge) throw new Error("The flags lesson needs its registered flag challenge.");
  useLayoutEffect(() => {
    const root = host.current;
    if (!root) return;
    // Reset the authored boundary on remount (including React StrictMode), never on a theme change.
    root.innerHTML = MARKUP;
    const prediction = lesson.sections
      .flatMap((s) => s.interactives)
      .find((x) => x.id === "predict-readings");
    const program = RecordedSchema.parse(prediction?.props["program"]);

    root.querySelector("#lesson-title")!.textContent = lesson.title;
    const cleanup = mountFlagsLesson(root, store, program, challenge);
    const position = document.createElement("span");
    position.className = "flags-current-position";
    position.textContent = book.references.position(lesson.id) ?? "";
    root.querySelector(".hero .eyebrow")!.prepend(position);
    root.querySelectorAll<HTMLAnchorElement>("[data-lesson-reference]").forEach((link) => {
      const id = link.dataset["lessonReference"];
      if (id) link.textContent = book.references.label(id);
    });
    setHintHost(root.querySelector<HTMLElement>("#challengeHints"));
    return cleanup;
  }, [book, lesson, store, challenge]);
  return (
    <StringsContext.Provider value={strings}>
      <div className="flags-lesson-host" ref={host} dangerouslySetInnerHTML={AUTHORED_HTML} />
      {hintHost && createPortal(<FlagsHints store={store} challenge={challenge} />, hintHost)}
    </StringsContext.Provider>
  );
}
