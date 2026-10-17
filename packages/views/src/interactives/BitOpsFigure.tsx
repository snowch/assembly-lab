// Copyright © 2026 Christopher Snow

// A recorded function that works on the bits of a word, run on a word the learner types. The
// figure draws the word, the constant the instruction carries (its mask) under it, and the answer,
// one column to a bit, with the bits that changed outlined and marked, a field's bits underlined,
// and a one-line rule for the chosen operation. A column can be picked (a press, a focus, or the
// two buttons that step along the bits) and is then read out in one line: that bit's input, mask
// and result. The answer is what `run()` leaves in w0; the mask and the field are the
// instruction's own operands as the assembler parsed them; which bits changed is the difference
// between the word the call started with and the word the run ended with.
//
// A word that cannot be read (empty, unfinished, too large, not a number) gets its message and no
// result: nothing is run, and nothing is drawn, until the word is valid.

import { useMemo, useState, type KeyboardEvent } from "react";
import { z } from "zod";

import { useSlot } from "@platform/lesson-runtime";

import {
  BitKey,
  BitRow,
  MarkRow,
  Ruler,
  bitList,
  differing,
  hex,
  parseWord,
  range,
  signedOf,
  unsignedOf,
  wordProblem,
  type Marks,
} from "../bits";
import { columnOf, firstInstruction, shapeOf, type Shape } from "../bitops";
import { withCode } from "../parts";
import { VIEW_STRINGS as S } from "../strings";
import { traceOf, wValue } from "../trace";
import { KeyEntrySchema, RecordedSchema, withProps } from "./props";

const FunctionSchema = z.object({
  /** The label of the function in its listing. */
  entry: z.string(),
  program: RecordedSchema,
  /** What it returns: a word of the same kind (its labelled bits mean something), or a plain number. */
  returns: z.enum(["word", "number"]),
  /** Whether it takes a second value, in w1. */
  second: z.boolean().default(false),
});

const Props = z.object({
  functions: z.array(FunctionSchema).min(1),
  /** The function the figure starts with (the first, if none is named). */
  start: z.string().optional(),
  /** The word the figure starts with, and the second value. */
  word: z.number().int(),
  secondValue: z.number().int().default(0),
  entries: z.array(KeyEntrySchema).min(1),
  /** The id of a prediction in this lesson. The figure stays shut until it has been checked. */
  after: z.string().optional(),
});

/** The message for a word that cannot be read: out of range gets its own, the rest the general one. */
export function problemSentence(text: string): string | null {
  const problem = wordProblem(text);
  if (problem === null) return null;
  return problem === "range" ? S.bitOps.inputRange : S.bitOps.inputProblem;
}

export const BitOpsFigure = withProps(Props, function BitOpsFigure({ data, store }) {
  const [which, setWhich] = useState(() =>
    Math.max(
      0,
      data.functions.findIndex((f) => f.entry === data.start),
    ),
  );
  const [wordText, setWordText] = useState(() => hex(data.word));
  const [secondText, setSecondText] = useState(() => hex(data.secondValue));
  const [picked, setPicked] = useState<number | null>(null);
  const [prediction] = useSlot<{ choice: string }>(store, data.after ?? "");
  const fn = data.functions[which] ?? data.functions[0]!;
  const typedWord = parseWord(wordText);
  const typedSecond = fn.second ? parseWord(secondText) : 0;
  const valid = typedWord !== null && typedSecond !== null;
  // Nothing is run for a word that cannot be read: the trace is of the last word that could be.
  const word = typedWord ?? 0;
  const second = typedSecond ?? 0;
  const trace = useMemo(
    () =>
      valid
        ? traceOf(fn.program, { entry: fn.entry, args: fn.second ? [word, second] : [word] })
        : null,
    [valid, fn, word, second],
  );
  // The function's first instruction does not depend on the word: it is read from a run that is
  // not drawn, so the instruction and its mask can be shown while the word is being typed.
  const base = useMemo(
    () => traceOf(fn.program, { entry: fn.entry, args: fn.second ? [0, 0] : [0] }),
    [fn],
  );
  if (data.after !== undefined && prediction === undefined) {
    return (
      <p role="note" className="al-locked">
        {S.stepper.locked}
      </p>
    );
  }
  const first = firstInstruction(base, fn.entry);
  const shape: Shape = first ? shapeOf(first) : { kind: "other" };
  const inputs = (
    <div className="al-inputs">
      <label className="al-input" htmlFor="bitops-word">
        <span>{S.bitOps.inputLabel("w0")}</span>
        <input
          id="bitops-word"
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          aria-invalid={typedWord === null}
          value={wordText}
          onChange={(e) => setWordText(e.target.value)}
        />
      </label>
      {fn.second && (
        <label className="al-input" htmlFor="bitops-second">
          <span>{S.bitOps.inputLabel("w1")}</span>
          <input
            id="bitops-second"
            type="text"
            inputMode="text"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-invalid={typedSecond === null}
            value={secondText}
            onChange={(e) => setSecondText(e.target.value)}
          />
        </label>
      )}
    </div>
  );
  const head = (
    <>
      <div className="asm-field" role="group" aria-label={S.bitOps.functions}>
        <span className="asm-field-label">{S.bitOps.functions}</span>
        <div className="asm-chips">
          {data.functions.map((f, i) => (
            <button
              key={f.entry}
              type="button"
              className="chip"
              aria-pressed={i === which}
              onClick={() => setWhich(i)}
            >
              {f.entry}
            </button>
          ))}
        </div>
      </div>
      <div className="al-code-lines">
        <div className="al-code-line">
          <span className="al-code-label">{S.bitOps.cLabel}</span>
          <code className="al-code-c">{fn.program.c}</code>
        </div>
        <div className="al-code-line">
          <span className="al-code-label">{S.bitOps.instructionLabel}</span>
          <code className="al-code-ins">{first?.text ?? ""}</code>
        </div>
      </div>
      {shape.kind === "logic" && (
        <p className="al-rule" data-rule={shape.op}>
          {withCode(S.bitOps.rule[shape.op])}
        </p>
      )}
    </>
  );
  if (trace === null) {
    // The word cannot be read: the message, and no row, no result, no key.
    const sentence = [wordText, ...(fn.second ? [secondText] : [])]
      .map(problemSentence)
      .find((p) => p !== null);
    return (
      <div className="al-figure al-bitops" data-figure="bit-ops" data-function={fn.entry}>
        {head}
        {inputs}
        <p className="al-problem" role="note">
          {sentence ?? S.bitOps.inputProblem}
        </p>
        <p className="al-legend">{S.bitOps.noResult}</p>
      </div>
    );
  }
  const result = wValue(trace.result.final, 0);
  const changed = differing(word, result);
  const pickedSet: ReadonlySet<number> = picked === null ? new Set() : new Set([picked]);
  const wordMarks: Marks =
    shape.kind === "extract" || shape.kind === "insert"
      ? { field: range(shape.lsb, shape.lsb + shape.width - 1), picked: pickedSet }
      : { picked: pickedSet };
  const resultMarks: Marks =
    shape.kind === "extract"
      ? { field: range(0, shape.width - 1), changed, picked: pickedSet }
      : shape.kind === "insert"
        ? { field: range(shape.lsb, shape.lsb + shape.width - 1), changed, picked: pickedSet }
        : { changed, picked: pickedSet };
  const secondMarks: Marks =
    shape.kind === "insert"
      ? { field: range(0, shape.width - 1), picked: pickedSet }
      : { picked: pickedSet };
  const maskMarks: Marks = { picked: pickedSet };
  const rowText = (v: number) => `${hex(v)} (${unsignedOf(v)})`;
  const pick = (n: number) => setPicked(Math.max(0, Math.min(31, n)));
  const column = picked === null ? null : columnOf(picked, word, shape, result);
  const readout =
    column === null
      ? S.bitOps.pickHint
      : column.mask === null
        ? S.bitOps.columnPlain(column.bit, column.input, column.result)
        : S.bitOps.column(column.bit, column.input, column.mask, column.result);
  const onKeys = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") pick((picked ?? 0) + 1);
    else if (e.key === "ArrowRight") pick((picked ?? 1) - 1);
    else return;
    e.preventDefault();
  };
  return (
    <div className="al-figure al-bitops" data-figure="bit-ops" data-function={fn.entry}>
      {head}
      {inputs}
      <div className="al-bitrows">
        <Ruler />
        <BitRow
          row="word"
          name={S.bitOps.rowBefore("w0")}
          value={word}
          text={rowText(word)}
          marks={wordMarks}
          pick={{ onPick: pick }}
        />
        {fn.second && (
          <BitRow
            row="second"
            name={S.bitOps.rowBefore("w1")}
            value={second}
            text={rowText(second)}
            marks={secondMarks}
            pick={{ onPick: pick }}
          />
        )}
        {shape.kind === "logic" && (
          <BitRow
            row="mask"
            name={S.bitOps.rowMask}
            value={shape.mask}
            text={`${hex(shape.mask)} (${signedOf(shape.mask)})`}
            marks={maskMarks}
            pick={{ onPick: pick }}
          />
        )}
        <BitRow
          row="result"
          name={S.bitOps.rowAfter("w0")}
          value={result}
          text={rowText(result)}
          marks={resultMarks}
          pick={{ onPick: pick, keyboard: true, at: picked ?? 0 }}
        />
        {changed.size > 0 && (
          <MarkRow
            row="changed"
            name={S.bitOps.rowChanged}
            glyphs={new Map([...changed].map((n) => [n, S.bitOps.changedGlyph]))}
          />
        )}
      </div>
      <div className="al-pick" role="group" aria-label={S.bitOps.pickGroup} onKeyDown={onKeys}>
        <button
          type="button"
          className="button secondary"
          disabled={picked !== null && picked >= 31}
          onClick={() => pick(picked === null ? 0 : picked + 1)}
        >
          {S.bitOps.higherBit}
        </button>
        <button
          type="button"
          className="button secondary"
          disabled={picked !== null && picked <= 0}
          onClick={() => pick(picked === null ? 0 : picked - 1)}
        >
          {S.bitOps.lowerBit}
        </button>
        <p className="al-readout" data-readout="column" aria-live="polite">
          {readout}
        </p>
      </div>
      <p className="al-status" role="status">
        {withCode(S.bitOps.result("w0", hex(result), String(unsignedOf(result))))}{" "}
        {fn.returns === "word" &&
          (changed.size === 0
            ? S.bitOps.unchanged
            : S.bitOps.changed(bitList(changed), changed.size))}
      </p>
      <p className="al-legend">{S.bitOps.legend}</p>
      {fn.returns === "word" && <BitKey entries={data.entries} before={word} after={result} />}
    </div>
  );
});
