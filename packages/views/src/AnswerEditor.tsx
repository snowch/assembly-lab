// Copyright © 2026 Christopher Snow

// The editor for a challenge whose artifact is the learner's answers: the recorded program the
// challenge is about, if the challenge carries one in `initial.data.program`, and one box for each
// field. What the learner types is kept as text, by field id, and graded by the challenge's grader.

import type { ComponentType } from "react";
import { z } from "zod";

import type { ChallengeEditorProps } from "@platform/lesson-runtime";

import { BitToggles } from "./BitToggles";
import { HexEntry } from "./HexEntry";
import { RecordedSchema } from "./interactives/props";
import { cLinesOf, parseListing } from "./listing";
import { ListingView, withCode } from "./parts";
import { NO_BITS, isPattern } from "./readings";
import { plain } from "./strings";

export const AnswerEditor: ComponentType<ChallengeEditorProps> = ({
  challenge,
  artifact,
  onChange,
}) => {
  const answers = { ...(challenge.initial.answers ?? {}), ...(artifact.answers ?? {}) };
  const set = (id: string, value: string) =>
    onChange({ ...artifact, answers: { ...(artifact.answers ?? {}), [id]: value } });
  const program = RecordedSchema.safeParse(challenge.initial.data?.["program"]);
  // The fields of bits that also take hexadecimal, named in the challenge's `initial.data.hexEntry`.
  // A challenge that does not name a field gets 32 buttons and nothing else, as before.
  const hexFields = z.array(z.string()).safeParse(challenge.initial.data?.["hexEntry"]);
  return (
    <div className="answer-editor">
      {program.success && (
        <ListingView cLines={cLinesOf(program.data.c)} lines={parseListing(program.data.listing)} />
      )}
      {challenge.fields.map((f) => {
        const id = `answer-${challenge.id}-${f.id}`;
        // A choice is a row of radio buttons, none chosen until the learner chooses.
        if (f.kind === "choice" && f.options)
          return (
            <fieldset key={f.id} className="answer-field answer-choice" data-field={f.id}>
              <legend className="answer-label">{withCode(f.label)}</legend>
              <span className="answer-options">
                {f.options.map((o) => (
                  <label key={o.value} className="answer-option">
                    <input
                      type="radio"
                      name={id}
                      value={o.value}
                      checked={answers[f.id] === o.value}
                      onChange={() => set(f.id, o.value)}
                    />
                    <span>{withCode(o.label)}</span>
                  </label>
                ))}
              </span>
            </fieldset>
          );
        // A field of bits is 32 buttons, set one at a time; it is kept as 32 characters.
        if (f.kind === "bits") {
          const stored = answers[f.id];
          const bits = isPattern(stored) ? stored : NO_BITS;
          return (
            <div key={f.id} className="answer-field" data-field={f.id}>
              <span className="answer-label">{withCode(f.label)}</span>
              <BitToggles bits={bits} onChange={(next) => set(f.id, next)} label={plain(f.label)} />
              {hexFields.success && hexFields.data.includes(f.id) && (
                <HexEntry bits={bits} onBits={(next) => set(f.id, next)} />
              )}
            </div>
          );
        }
        return (
          <label key={f.id} className="answer-field" data-field={f.id} htmlFor={id}>
            <span className="answer-label">{withCode(f.label)}</span>
            <span className="answer-input">
              <input
                id={id}
                type="text"
                // A number keypad has no minus sign on every phone: a field that takes a negative
                // number (it says so with a `min` below 0) gets the full keyboard.
                inputMode={
                  f.kind === "number" && !(f.min !== undefined && f.min < 0) ? "numeric" : "text"
                }
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                value={answers[f.id] ?? ""}
                onChange={(e) => set(f.id, e.target.value)}
              />
              {f.unit && <span className="answer-unit">{f.unit}</span>}
            </span>
          </label>
        );
      })}
    </div>
  );
};
