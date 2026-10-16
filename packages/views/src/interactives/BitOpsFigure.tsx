// Copyright © 2026 Christopher Snow

// A recorded function that works on the bits of a word, run on a word the learner types. The
// figure draws the word, the constant the instruction carries (its mask) under it, and the answer,
// one column to a bit, with the bits that changed outlined and a field's bits underlined. The
// answer is what `run()` leaves in w0; the mask and the field are the instruction's own operands
// as the assembler parsed them; which bits changed is the difference between the word the call
// started with and the word the run ended with.

import { useMemo, useState } from "react";
import { z } from "zod";

import { useSlot } from "@platform/lesson-runtime";

import {
  BitKey,
  BitRow,
  Ruler,
  bitList,
  differing,
  hex,
  parseWord,
  range,
  signedOf,
  unsignedOf,
  type Marks,
} from "../bits";
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

/** What the figure reads from the function's first instruction. */
type Shape =
  | { kind: "logic"; mask: number }
  | { kind: "extract"; lsb: number; width: number }
  | { kind: "insert"; lsb: number; width: number }
  | { kind: "other" };

const imm = (operand: { kind: string; value?: bigint } | undefined): number | null =>
  operand?.kind === "imm" && operand.value !== undefined ? Number(operand.value) : null;

function shapeOf(ins: {
  mnemonic: string;
  operands: readonly { kind: string; value?: bigint }[];
}): Shape {
  const [, , third, fourth] = ins.operands;
  if (["and", "orr", "eor", "bic"].includes(ins.mnemonic)) {
    const value = third?.kind === "imm" && third.value !== undefined ? third.value : null;
    return value === null
      ? { kind: "other" }
      : { kind: "logic", mask: Number(BigInt.asUintN(32, value)) };
  }
  const lsb = imm(third);
  const width = imm(fourth);
  if (lsb !== null && width !== null && ins.mnemonic === "ubfx")
    return { kind: "extract", lsb, width };
  if (lsb !== null && width !== null && ins.mnemonic === "bfi")
    return { kind: "insert", lsb, width };
  return { kind: "other" };
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
  const [prediction] = useSlot<{ choice: string }>(store, data.after ?? "");
  const fn = data.functions[which] ?? data.functions[0]!;
  const typedWord = parseWord(wordText);
  const typedSecond = parseWord(secondText);
  const word = typedWord ?? unsignedOf(data.word);
  const second = typedSecond ?? unsignedOf(data.secondValue);
  const trace = useMemo(
    () => traceOf(fn.program, { entry: fn.entry, args: fn.second ? [word, second] : [word] }),
    [fn, word, second],
  );
  if (data.after !== undefined && prediction === undefined) {
    return (
      <p role="note" className="al-locked">
        {S.stepper.locked}
      </p>
    );
  }
  const entryAddress = trace.program.symbols[fn.entry]?.address;
  const first = trace.program.instructions.find((i) => i.address === entryAddress);
  const shape: Shape = first ? shapeOf(first) : { kind: "other" };
  const result = wValue(trace.result.final, 0);
  const changed = differing(word, result);
  const wordMarks: Marks =
    shape.kind === "extract"
      ? { field: range(shape.lsb, shape.lsb + shape.width - 1) }
      : shape.kind === "insert"
        ? { field: range(shape.lsb, shape.lsb + shape.width - 1) }
        : {};
  const resultMarks: Marks =
    shape.kind === "extract"
      ? { field: range(0, shape.width - 1), changed }
      : shape.kind === "insert"
        ? { field: range(shape.lsb, shape.lsb + shape.width - 1), changed }
        : { changed };
  const secondMarks: Marks = shape.kind === "insert" ? { field: range(0, shape.width - 1) } : {};
  const rowText = (v: number) => `${hex(v)} (${unsignedOf(v)})`;
  return (
    <div className="al-figure al-bitops" data-figure="bit-ops" data-function={fn.entry}>
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
      {(typedWord === null || typedSecond === null) && (
        <p className="al-problem" role="note">
          {S.bitOps.inputProblem}
        </p>
      )}
      <div className="al-bitrows">
        <Ruler />
        <BitRow
          row="word"
          name={S.bitOps.rowBefore("w0")}
          value={word}
          text={rowText(word)}
          marks={wordMarks}
        />
        {fn.second && (
          <BitRow
            row="second"
            name={S.bitOps.rowBefore("w1")}
            value={second}
            text={rowText(second)}
            marks={secondMarks}
          />
        )}
        {shape.kind === "logic" && (
          <BitRow
            row="mask"
            name={S.bitOps.rowMask}
            value={shape.mask}
            text={`${hex(shape.mask)} (${signedOf(shape.mask)})`}
          />
        )}
        <BitRow
          row="result"
          name={S.bitOps.rowAfter("w0")}
          value={result}
          text={rowText(result)}
          marks={resultMarks}
        />
      </div>
      <p className="al-status" role="status">
        {withCode(S.bitOps.result("w0", hex(result), String(unsignedOf(result))))}{" "}
        {fn.returns === "word" &&
          (changed.size === 0 ? S.bitOps.unchanged : S.bitOps.changed(bitList(changed)))}
      </p>
      <p className="al-legend">{S.bitOps.legend}</p>
      {fn.returns === "word" && <BitKey entries={data.entries} before={word} after={result} />}
    </div>
  );
});
