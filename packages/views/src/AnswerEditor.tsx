// Copyright © 2026 Christopher Snow

// The editor for a challenge whose artifact is the learner's answers: the recorded program the
// challenge is about, if the challenge carries one in `initial.data.program`, and one box for each
// field. What the learner types is kept as text, by field id, and graded by the challenge's grader.

import type { ComponentType } from "react";

import type { ChallengeEditorProps } from "@platform/lesson-runtime";

import { BitToggles } from "./BitToggles";
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
  return (
    <div className="answer-editor">
      {program.success && (
        <ListingView cLines={cLinesOf(program.data.c)} lines={parseListing(program.data.listing)} />
      )}
      {challenge.fields.map((f) => {
        const id = `answer-${challenge.id}-${f.id}`;
        // A field of bits is 32 buttons, set one at a time; it is kept as 32 characters.
        if (f.kind === "bits") {
          const stored = answers[f.id];
          return (
            <div key={f.id} className="answer-field" data-field={f.id}>
              <span className="answer-label">{withCode(f.label)}</span>
              <BitToggles
                bits={isPattern(stored) ? stored : NO_BITS}
                onChange={(bits) => set(f.id, bits)}
                label={plain(f.label)}
              />
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
                inputMode={f.kind === "number" ? "numeric" : "text"}
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
