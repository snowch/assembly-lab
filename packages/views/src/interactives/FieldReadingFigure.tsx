// Copyright © 2026 Christopher Snow

// A field read out of a word, in one compact picture: the low eight bits of the word the call
// starts with, the field the function's instruction takes (underlined, with its bit numbers over
// the bits), the same eight bits after the run, with the number the field made at the bottom, and
// one sentence that says which bits were selected and what they make. The field is the
// instruction's own operands as the assembler parsed them; the selected bits and the number are
// the model's, from the start state and the end of the run.

import { useMemo } from "react";
import { z } from "zod";
import { Prose, useSlot } from "@platform/lesson-runtime";

import { BitCells, bitString, callText, hex, range, unsignedOf } from "../bits";
import { firstInstruction, shapeOf } from "../bitops";
import { withCode } from "../parts";
import { VIEW_STRINGS as S } from "../strings";
import { traceOf, viewAt, wValue } from "../trace";
import { CallSchema, RecordedSchema, withProps } from "./props";

const Props = z.object({
  program: RecordedSchema,
  call: CallSchema,
  /** Required field notation belongs beside this diagram, after the basic experiment. */
  intro: z.string().optional(),
  after: z.string().optional(),
});

export const FieldReadingFigure = withProps(Props, function FieldReadingFigure({ data, store }) {
  const [prediction] = useSlot<{ choice: string }>(store, data.after ?? "");
  const trace = useMemo(() => traceOf(data.program, data.call), [data.program, data.call]);
  const word = wValue(viewAt(trace, 0).state, 0);
  const result = wValue(trace.result.final, 0);
  const first = firstInstruction(trace, data.call.entry);
  const shape = first ? shapeOf(first) : null;
  if (shape === null || shape.kind !== "extract") throw new Error(S.fieldReading.noField);
  const top = shape.lsb + shape.width - 1;
  const text = (v: number) => `${hex(v)} (${unsignedOf(v)})`;
  const call = callText(data.call.entry, data.call.args);
  if (data.after !== undefined && prediction === undefined)
    return (
      <p role="note" className="al-locked">
        {S.stepper.locked}
      </p>
    );
  return (
    <>
      {data.intro && <Prose markdown={data.intro} />}
      <div className="al-figure al-fieldreading" data-figure="field-reading">
        <div className="al-cellrows">
          <BitCells
            row="word"
            name={S.bits.onEntry("w0")}
            value={word}
            text={text(word)}
            marks={{ field: range(shape.lsb, top) }}
            numbers
          />
          <BitCells
            row="result"
            name={S.bitOps.rowAfter("w0")}
            value={result}
            text={text(result)}
            marks={{ field: range(0, shape.width - 1) }}
          />
        </div>
        <p className="al-status" role="status">
          {withCode(
            `${S.fieldReading.selected(shape.lsb, top, bitString(word, range(shape.lsb, top)))} ${S.fieldReading.gives(call, String(result))}`,
          )}
        </p>
        <p className="al-legend">{S.fieldReading.legend}</p>
      </div>
    </>
  );
});
