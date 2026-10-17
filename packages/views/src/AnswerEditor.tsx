// Copyright © 2026 Christopher Snow

// The editor for a challenge whose artifact is the learner's answers: the recorded program the
// challenge is about, if the challenge carries one in `initial.data.program`, and one box for each
// field. What the learner types is kept as text, by field id, and graded by the challenge's grader.

import type { ComponentType } from "react";
import { z } from "zod";

import type { ChallengeEditorProps } from "@platform/lesson-runtime";

import { BitToggles } from "./BitToggles";
import { RecordedSchema } from "./interactives/props";
import { cLinesOf, parseListing } from "./listing";
import { ListingView, withCode } from "./parts";
import { NO_BITS, isPattern } from "./readings";
import { plain } from "./strings";

/**
 * An optional grouping of a challenge's choices, in `initial.data.editor.groups`: each group is a
 * heading and the choices it holds, each with the short label drawn over it. The choices of a group
 * are drawn together in a compact row; any field no group names is drawn as it always was.
 */
const GroupsSchema = z.object({
  groups: z
    .array(
      z.object({
        label: z.string().min(1),
        fields: z.array(z.object({ id: z.string().min(1), label: z.string().min(1) })).min(1),
      }),
    )
    .min(1),
});

export const AnswerEditor: ComponentType<ChallengeEditorProps> = ({
  challenge,
  artifact,
  onChange,
}) => {
  const answers = { ...(challenge.initial.answers ?? {}), ...(artifact.answers ?? {}) };
  const set = (id: string, value: string) =>
    onChange({ ...artifact, answers: { ...(artifact.answers ?? {}), [id]: value } });
  const program = RecordedSchema.safeParse(challenge.initial.data?.["program"]);
  const grouping = GroupsSchema.safeParse(challenge.initial.data?.["editor"]);
  const groups = grouping.success ? grouping.data.groups : [];
  const grouped = new Set(groups.flatMap((g) => g.fields.map((f) => f.id)));
  return (
    <div className="answer-editor">
      {program.success && (
        <ListingView cLines={cLinesOf(program.data.c)} lines={parseListing(program.data.listing)} />
      )}
      {groups.length > 0 && (
        <div className="answer-groups">
          {groups.map((g, n) => (
            <fieldset key={n} className="answer-group" data-group={n}>
              <legend className="answer-group-label">{withCode(g.label)}</legend>
              <div className="answer-group-row">
                {g.fields.map(({ id: fieldId, label: short }) => {
                  const f = challenge.fields.find((x) => x.id === fieldId);
                  if (!f || f.kind !== "choice" || !f.options) return null;
                  return (
                    <fieldset
                      key={f.id}
                      className="answer-field answer-choice answer-compact"
                      data-field={f.id}
                    >
                      <legend className="answer-label">{withCode(short)}</legend>
                      <span className="answer-options">
                        {f.options.map((o) => (
                          <label key={o.value} className="answer-option">
                            <input
                              type="radio"
                              name={`answer-${challenge.id}-${f.id}`}
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
                })}
              </div>
            </fieldset>
          ))}
        </div>
      )}
      {challenge.fields
        .filter((f) => !grouped.has(f.id))
        .map((f) => {
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
