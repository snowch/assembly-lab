// Copyright © 2026 Christopher Snow

import { useEffect, useId, useState } from "react";
import { ProgrammerCalculator } from "./ProgrammerCalculator";
import { PREDICTION_TOOLS as S } from "./strings.prediction-tools";
import { useHandoffState } from "./update-handoff";

// A graded-editor reset remounts this component. Retain unsaved text for this tab
// when browser storage is unavailable; a successful save or clear removes it.
const unsaved = new Map<string, string>();

/** Scratch work has no program, answer artifact or grading callback. */
export function PredictionTools({
  lessonId,
  challengeId,
}: {
  lessonId: string;
  challengeId: string;
}) {
  const id = useId();
  const key = `assembly-lab:notes:v1:${lessonId}:${challengeId}`;
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useHandoffState(`WorkingNotes.${challengeId}`, () => {
    if (unsaved.has(key)) return { text: unsaved.get(key)!, saved: false };
    try {
      return { text: window.localStorage.getItem(key) ?? "", saved: true };
    } catch {
      return { text: "", saved: false };
    }
  });
  // Also retain state restored by the coordinated offline-update handoff.
  useEffect(() => {
    if (!notes.saved) unsaved.set(key, notes.text);
    else unsaved.delete(key);
  }, [key, notes]);
  function write(text: string, clear = false) {
    let saved = true;
    try {
      if (clear) window.localStorage.removeItem(key);
      else window.localStorage.setItem(key, text);
    } catch {
      saved = false;
    }
    const next = { text: clear && !saved ? notes.text : text, saved };
    if (saved) unsaved.delete(key);
    else unsaved.set(key, next.text);
    setNotes(next);
  }
  return (
    <div className="al-prediction-tools">
      <ProgrammerCalculator preset="widths" handoffKey={`${lessonId}.${challengeId}`} />
      <details
        className="al-calculator al-working-notes"
        open={open}
        onToggle={(e) => setOpen(e.currentTarget.open)}
      >
        <summary>{S.summary}</summary>
        {open && (
          <div className="al-calculator-panel">
            <p id={`${id}-help`} role={notes.saved ? undefined : "status"}>
              {notes.saved ? S.help : S.storageFailure}
            </p>
            <label htmlFor={id}>{S.label}</label>
            <textarea
              id={id}
              rows={4}
              value={notes.text}
              aria-describedby={`${id}-help`}
              onChange={(e) => write(e.target.value)}
            />
            <button type="button" className="button secondary" onClick={() => write("", true)}>
              {S.clear}
            </button>
          </div>
        )}
      </details>
    </div>
  );
}
