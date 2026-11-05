// Copyright © 2026 Christopher Snow

// Align the learner's own answers without computing or correcting them.
import { z } from "zod";
import { useRef, useState } from "react";
import type { ChallengeEditorProps } from "@platform/lesson-runtime";
import { AnswerEditor } from "./AnswerEditor";
import { withCode } from "./parts";
import { plain } from "./strings";
import { FOUR_BIT_STRINGS as S } from "./strings.four-bit-arithmetic";

export const FourBitEditorSchema = z.object({
  kind: z.literal("four-bit-subtraction"),
  first: z.string().regex(/^[01]{4}$/),
});

const CarryNotesSchema = z.record(z.string(), z.string());
const BITS = [3, 2, 1, 0] as const;

function BitAnswerRow({
  field,
  challengeId,
  value,
  onChange,
}: {
  field: ChallengeEditorProps["challenge"]["fields"][number];
  challengeId: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const [error, setError] = useState("");
  const pattern = value.replace(/\s/g, "");
  const valid = /^[01_]{0,4}$/.test(pattern);
  const cells = (valid ? pattern : "").padEnd(4, "_").split("");
  const id = `answer-${challengeId}-${field.id}`;
  const message = error || (!valid ? S.savedBitEntry(value) : "");
  const focus = (index: number) => {
    const input = inputs.current[Math.max(0, Math.min(3, index))];
    input?.focus();
    input?.select();
  };
  const write = (start: number, digits: string) => {
    const next = [...cells];
    [...digits].forEach((digit, offset) => {
      next[start + offset] = digit;
    });
    setError("");
    onChange(next.every((digit) => digit === "_") ? "" : next.join(""));
  };
  return (
    <div
      className={`al-four-work-row${field.id === "result" ? " al-four-result-row" : ""}`}
      data-row={field.id}
      data-field={field.id}
      role="group"
      aria-labelledby={`${id}-label`}
    >
      <span className="answer-label" id={`${id}-label`}>
        {withCode(field.label)}
      </span>
      {field.id === "negated" && (
        <span className="al-four-work-sign" aria-hidden="true">
          {S.plusSign}
        </span>
      )}
      <div className="al-four-bit-grid">
        {BITS.map((bit, index) => (
          <input
            key={bit}
            ref={(element) => {
              inputs.current[index] = element;
            }}
            id={`${id}-bit-${bit}`}
            data-bit={bit}
            aria-label={S.answerBit(plain(field.label), bit)}
            aria-describedby={message ? `${id}-message` : undefined}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            value={cells[index] === "_" ? "" : cells[index]}
            onFocus={(event) => event.target.select()}
            onChange={(event) => {
              const digit = event.target.value;
              if (!/^[01]?$/.test(digit)) {
                setError(S.bitEntryError);
                return;
              }
              write(index, digit || "_");
              if (digit && index < 3) focus(index + 1);
            }}
            onPaste={(event) => {
              event.preventDefault();
              const digits = event.clipboardData.getData("text").replace(/\s/g, "");
              const start = digits.length === 4 ? 0 : index;
              if (!/^[01]+$/.test(digits) || start + digits.length > 4) {
                setError(S.bitEntryError);
                return;
              }
              write(start, digits);
              focus(start + digits.length);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                event.preventDefault();
                focus(index + (event.key === "ArrowLeft" ? -1 : 1));
              } else if (event.key === "Backspace" || event.key === "Delete") {
                event.preventDefault();
                const target =
                  event.key === "Backspace" && cells[index] === "_"
                    ? Math.max(0, index - 1)
                    : index;
                write(target, "_");
                focus(target);
              } else if (event.key === "Home" || event.key === "End") {
                event.preventDefault();
                focus(event.key === "Home" ? 0 : 3);
              }
            }}
          />
        ))}
      </div>
      {message && (
        <p className="al-four-entry-message" id={`${id}-message`} role="alert">
          {message}
        </p>
      )}
    </div>
  );
}

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
          <div className="al-four-bit-grid al-four-note-grid">
            {BITS.map((bit) => (
              <label key={bit}>
                <span className="visually-hidden">{S.carryNote(bit)}</span>
                <span aria-hidden="true">{bit}</span>
                <input
                  data-bit={bit}
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
        <div className="al-four-work-row" data-row="first" role="group" aria-label={S.firstRow}>
          <span className="answer-label">{S.firstRow}</span>
          <div className="al-four-bit-grid">
            {[...first].map((digit, index) => (
              <code key={index} data-bit={BITS[index]}>
                {digit}
              </code>
            ))}
          </div>
        </div>
        {fields.map((field) => {
          if (!field) return null;
          return (
            <BitAnswerRow
              key={field.id}
              field={field}
              challengeId={challenge.id}
              value={answers[field.id] ?? ""}
              onChange={(value) =>
                onChange({
                  ...artifact,
                  answers: {
                    ...artifact.answers,
                    [field.id]: value,
                  },
                })
              }
            />
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
