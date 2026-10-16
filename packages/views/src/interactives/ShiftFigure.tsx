// Copyright © 2026 Christopher Snow

// One word, shifted by the instruction the learner chooses, by an amount the learner chooses. The
// figure runs `<instruction> w0, w0, <amount>` and `ret` on the simulator for the word the learner
// types, and draws the word before and after: the bits that fell off the end struck through, and
// the bits the shift filled in with a dashed outline. The word after is what `run()` left in w0;
// which columns fell off or were filled follows from the instruction and the amount, and the
// values in them are read from the word before and the word after.

import { useMemo, useState } from "react";
import { z } from "zod";

import { useSlot } from "@platform/lesson-runtime";

import {
  BitRow,
  Ruler,
  bitString,
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
import { withProps } from "./props";

const SHIFTS = ["lsl", "lsr", "asr"] as const;
type Shift = (typeof SHIFTS)[number];

const Props = z.object({
  /** The instructions the learner may choose from. */
  ops: z.array(z.enum(SHIFTS)).min(1),
  /** The amounts the learner may choose from, each 1 to 31. */
  amounts: z.array(z.number().int().min(1).max(31)).min(1),
  /** The word the figure starts with. */
  word: z.number().int(),
  /** The id of a prediction in this lesson. The figure stays shut until it has been checked. */
  after: z.string().optional(),
});

/** The program the figure runs: one shift of w0, then `ret`. */
export const shiftProgram = (op: Shift, amount: number) => ({
  listing: `shift:\n  ${op} w0, w0, ${amount}\n  ret`,
});

export const ShiftFigure = withProps(Props, function ShiftFigure({ data, store }) {
  const [op, setOp] = useState<Shift>(data.ops[0] ?? "lsl");
  const [amount, setAmount] = useState(data.amounts[0] ?? 1);
  const [text, setText] = useState(() => hex(data.word));
  const [prediction] = useSlot<{ choice: string }>(store, data.after ?? "");
  const typed = parseWord(text);
  const word = typed ?? unsignedOf(data.word);
  const trace = useMemo(
    () => traceOf(shiftProgram(op, amount), { entry: "shift", args: [word] }),
    [op, amount, word],
  );
  if (data.after !== undefined && prediction === undefined) {
    return (
      <p role="note" className="al-locked">
        {S.stepper.locked}
      </p>
    );
  }
  const after = wValue(trace.result.final, 0);
  const left = op === "lsl";
  // Left: the top bits fall off and the bottom ones are filled. Right: the other way about.
  const lost = left ? range(32 - amount, 31) : range(0, amount - 1);
  const filled = left ? range(0, amount - 1) : range(32 - amount, 31);
  const beforeMarks: Marks = { lost };
  const afterMarks: Marks = { fill: filled };
  const instruction = trace.lines[1]?.kind === "instruction" ? trace.lines[1].text : "";
  return (
    <div className="al-figure al-shift" data-figure="shift" data-op={op} data-amount={amount}>
      <div className="asm-field" role="group" aria-label={S.shift.instruction}>
        <span className="asm-field-label">{S.shift.instruction}</span>
        <div className="asm-chips">
          {data.ops.map((o) => (
            <button
              key={o}
              type="button"
              className="chip"
              aria-pressed={o === op}
              onClick={() => setOp(o)}
            >
              {o}
            </button>
          ))}
        </div>
      </div>
      <div className="asm-field" role="group" aria-label={S.shift.by}>
        <span className="asm-field-label">{S.shift.by}</span>
        <div className="asm-chips">
          {data.amounts.map((a) => (
            <button
              key={a}
              type="button"
              className="chip"
              aria-pressed={a === amount}
              onClick={() => setAmount(a)}
            >
              {a}
            </button>
          ))}
        </div>
      </div>
      <div className="al-inputs">
        <label className="al-input" htmlFor="shift-word">
          <span>{S.shift.inputLabel}</span>
          <input
            id="shift-word"
            type="text"
            inputMode="text"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-invalid={typed === null}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </label>
      </div>
      {typed === null && (
        <p className="al-problem" role="note">
          {S.shift.inputProblem}
        </p>
      )}
      <div className="al-bitrows">
        <Ruler />
        <BitRow
          row="before"
          name={S.shift.rowBefore}
          value={word}
          text={hex(word)}
          marks={beforeMarks}
        />
        <BitRow
          row="after"
          name={S.shift.rowAfter}
          value={after}
          text={hex(after)}
          marks={afterMarks}
        />
      </div>
      <p className="al-status" role="status">
        {withCode(
          S.shift.result(
            instruction,
            hex(after),
            String(unsignedOf(after)),
            String(signedOf(after)),
          ),
        )}
      </p>
      <p className="al-shift-bits">
        <span data-part="fell">{S.shift.fellOff(bitString(word, lost))}</span>{" "}
        <span data-part="filled">{S.shift.filledWith(bitString(after, filled))}</span>
      </p>
      <p className="al-legend">{S.shift.legend}</p>
    </div>
  );
});
