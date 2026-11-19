// Copyright © 2026 Christopher Snow

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Challenge, Lesson } from "@platform/lesson-schema";
import { isWritten } from "@al/views";
import type { InstructionHelpRequest } from "@al/views";
import { INSTRUCTION_QUICK_REFERENCE, QUICK_REFERENCE_NOTATION } from "@al/content";
import { REFERENCE_STRINGS as S } from "./strings.instruction-reference";

export interface ReferenceRequest extends InstructionHelpRequest {
  readonly serial: number;
}

/** Only public instruction metadata and the exercise allow-list enter this tool. */
export function referenceExercises(lesson?: Lesson): readonly Challenge[] {
  return lesson?.challenges.filter(isWritten) ?? [];
}

export function HeaderInstructionReference({
  lesson,
  request,
  activeChallengeId,
  onOpen,
  onClose,
  updating,
}: {
  lesson?: Lesson;
  request: ReferenceRequest | null;
  activeChallengeId?: string;
  onOpen: (request: InstructionHelpRequest) => void;
  onClose: () => void;
  updating?: boolean;
}) {
  const id = useId();
  const [phone, setPhone] = useState(() => matchMedia("(max-width: 760px)").matches);
  const [search, setSearch] = useState("");
  const [scope, setScope] = useState<"allowed" | "all">("allowed");
  const [exerciseId, setExerciseId] = useState("");
  const panel = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const dismiss = useCallback(() => {
    // Release native modal inertness before the shell restores the opening control's focus.
    panel.current?.close();
    onClose();
  }, [onClose]);
  const exercises = referenceExercises(lesson);
  const exercise = exercises.find((item) => item.id === exerciseId) ?? exercises[0];
  const allowed = new Set(exercise?.allowedConstructs ?? []);
  const all = scope === "all" || !exercise;
  const query = search.trim().toLowerCase();
  const lookup = /^b\.(eq|ne|cs|hs|cc|lo|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)$/.test(query)
    ? "b.cond"
    : query;
  const entries = INSTRUCTION_QUICK_REFERENCE.filter(
    (entry) =>
      (all || allowed.has(entry.mnemonic)) &&
      `${entry.mnemonic} ${entry.summary}`.toLowerCase().includes(lookup),
  ).sort((a, b) => Number(b.mnemonic === lookup) - Number(a.mnemonic === lookup));
  useEffect(() => {
    const media = matchMedia("(max-width: 760px)");
    const changed = () => setPhone(media.matches);
    media.addEventListener("change", changed);
    return () => media.removeEventListener("change", changed);
  }, []);
  useEffect(() => {
    if (!request) return;
    const choices = referenceExercises(lesson);
    const selected =
      choices.find((item) => item.id === (request.challengeId ?? activeChallengeId)) ?? choices[0];
    setExerciseId(selected?.id ?? "");
    setSearch(request.mnemonic ?? "");
    setScope(
      selected && (!request.mnemonic || selected.allowedConstructs.includes(request.mnemonic))
        ? "allowed"
        : "all",
    );
    // Each opening starts from the requested exercise. Editing focus alone must not reset a lookup.
  }, [request]);
  useEffect(() => {
    const dialog = panel.current;
    if (!request || !dialog) return;
    if (dialog.open) dialog.close();
    if (phone) dialog.showModal();
    else dialog.show();
    input.current?.focus({ preventScroll: true });
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dismiss();
      }
    };
    document.addEventListener("keydown", escape);
    const previous = document.body.style.overflow;
    if (phone) document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", escape);
      document.body.style.overflow = previous;
      dialog.close();
    };
  }, [request, phone, dismiss]);
  return (
    <>
      <button
        type="button"
        className="header-reference-button"
        aria-label={S.button}
        aria-expanded={!!request}
        aria-controls={id}
        onClick={() => (request ? dismiss() : onOpen({}))}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="21"
          height="21"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        >
          <path d="M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1Zm0 0v15" />
        </svg>
        <span>{S.button}</span>
      </button>
      {request &&
        createPortal(
          <dialog
            ref={panel}
            id={id}
            className="instruction-reference-dialog"
            aria-labelledby={`${id}-title`}
            aria-modal={phone ? true : undefined}
            inert={updating}
            onCancel={(event) => {
              event.preventDefault();
              dismiss();
            }}
          >
            <div className="instruction-reference-heading">
              <h2 id={`${id}-title`}>{S.title}</h2>
              <button type="button" onClick={dismiss}>
                {S.close}
              </button>
            </div>
            <label className="reference-search">
              <span>{S.search}</span>
              <input
                ref={input}
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={S.searchPlaceholder}
              />
            </label>
            {exercise ? (
              <>
                <div className="reference-scope" role="group" aria-label={S.scope}>
                  <button type="button" aria-pressed={!all} onClick={() => setScope("allowed")}>
                    {S.allowedHere}
                  </button>
                  <button type="button" aria-pressed={all} onClick={() => setScope("all")}>
                    {S.allInstructions}
                  </button>
                </div>
                {exercises.length > 1 ? (
                  <label className="reference-exercise">
                    <span>{S.exercise}</span>
                    <select
                      value={exercise.id}
                      onChange={(event) => setExerciseId(event.target.value)}
                    >
                      {exercises.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.title}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <p className="reference-context">{S.context(exercise.title)}</p>
                )}
              </>
            ) : (
              <p className="reference-context">{S.noExercise}</p>
            )}
            <p className="reference-scope-note">{S.scopeNote}</p>
            <details className="reference-notation">
              <summary>{S.notation}</summary>
              <ul>
                {QUICK_REFERENCE_NOTATION.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </details>
            <p role="status" className="reference-count">
              {S.shown(entries.length)}
            </p>
            {entries.length === 0 && <p>{S.noResults}</p>}
            <div
              className="reference-entries"
              key={`${request.serial}-${scope}-${exercise?.id ?? "all"}`}
            >
              {entries.map((entry) => (
                <details
                  key={entry.mnemonic}
                  open={lookup === entry.mnemonic || entries.length === 1}
                >
                  <summary>
                    <code>{entry.mnemonic}</code>
                    <span>{entry.summary}</span>
                  </summary>
                  {exercise && !allowed.has(entry.mnemonic) && (
                    <p className="reference-unavailable">{S.unavailable}</p>
                  )}
                  <h3>{S.syntax}</h3>
                  {entry.forms.map((form) => (
                    <pre key={form}>
                      <code>{form}</code>
                    </pre>
                  ))}
                  <h3>{S.rules}</h3>
                  <ul>
                    {entry.rules.map((rule) => (
                      <li key={rule}>{rule}</li>
                    ))}
                  </ul>
                  <p>
                    <strong>{S.flags}</strong> {entry.flags}
                  </p>
                  <h3>{S.examples}</h3>
                  {entry.examples.map((example) => (
                    <pre key={example}>
                      <code>{example}</code>
                    </pre>
                  ))}
                  <details className="reference-official">
                    <summary>{S.official}</summary>
                    <ul>
                      {entry.references.map((source) => (
                        <li key={source.url}>
                          <a href={source.url} target="_blank" rel="noreferrer">
                            {source.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </details>
                </details>
              ))}
            </div>
          </dialog>,
          document.body,
        )}
    </>
  );
}
