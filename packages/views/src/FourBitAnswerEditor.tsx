// Copyright © 2026 Christopher Snow

// Align the learner's own answers without computing or correcting them.
import { z } from "zod";
import type { ChallengeEditorProps } from "@platform/lesson-runtime";
import { AnswerEditor } from "./AnswerEditor";
import { withCode } from "./parts";
import { FOUR_BIT_STRINGS as S } from "./strings.four-bit-arithmetic";

export const FourBitEditorSchema = z.object({
  kind: z.literal("four-bit-subtraction"),
  first: z.string().regex(/^[01]{4}$/),
});

const CarryNotesSchema = z.record(z.string(), z.string());
const BITS = [3, 2, 1, 0] as const;

export function FourBitAnswerEditor({ first, ...props }: ChallengeEditorProps & { first: string }) {
  const { challenge, artifact, onChange } = props;
  const fields = ["negated", "result"].map((id) => challenge.fields.find((f) => f.id === id));
  if (fields.some((f) => !f || f.kind !== "text")) return <AnswerEditor {...props} />;
  const answers = { ...challenge.initial.answers, ...artifact.answers };
  const savedNotes = CarryNotesSchema.safeParse(artifact.data?.["fourBitCarryNotes"]);
  const notes = savedNotes.success ? savedNotes.data : {};
  const setNote = (bit: number, value: string) =>
    onChange({
      ...artifact,
      data: {
        ...artifact.data,
        fourBitCarryNotes: { ...notes, [bit]: value },
      },
    });
  return (
    <div className="answer-editor al-four-answer-editor">
      <div className="al-four-workspace">
        <fieldset className="al-four-carry-notes">
          <legend>{S.carryNotes}</legend>
          <div className="al-four-note-grid">
            {BITS.map((bit) => (
              <label key={bit}>
                <span className="visually-hidden">{S.carryNote(bit)}</span>
                <span aria-hidden="true">{bit}</span>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  spellCheck={false}
                  value={notes[bit] ?? ""}
                  onChange={(e) => setNote(bit, e.target.value)}
                />
              </label>
            ))}
          </div>
        </fieldset>
        <div className="al-four-work-row" data-row="first">
          <span className="answer-label">{S.firstRow}</span>
          <code className="al-four-pattern">{first}</code>
        </div>
        {fields.map((field) => {
          if (!field) return null;
          const id = `answer-${challenge.id}-${field.id}`;
          return (
            <div
              key={field.id}
              className={`al-four-work-row${field.id === "result" ? " al-four-result-row" : ""}`}
              data-row={field.id}
              data-field={field.id}
            >
              <label className="answer-label" htmlFor={id}>
                {withCode(field.label)}
              </label>
              {field.id === "negated" && (
                <span className="al-four-work-sign" aria-hidden="true">
                  {S.plusSign}
                </span>
              )}
              <input
                id={id}
                className="al-four-pattern"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                value={(answers[field.id] ?? "").replace(/\s/g, "")}
                onChange={(e) =>
                  onChange({
                    ...artifact,
                    answers: {
                      ...artifact.answers,
                      [field.id]: e.target.value.replace(/\s/g, ""),
                    },
                  })
                }
              />
            </div>
          );
        })}
      </div>
      <AnswerEditor
        {...props}
        challenge={{
          ...challenge,
          fields: challenge.fields.filter((f) => f.id !== "negated" && f.id !== "result"),
        }}
      />
    </div>
  );
}
