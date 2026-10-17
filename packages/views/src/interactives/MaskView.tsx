// Copyright © 2026 Christopher Snow

// A logic instruction run on a word, drawn so that its mask can be read: the mask as the signed
// number the listing prints and as the bit pattern it is, then the low eight bits of the word, the
// mask and the result in three rows over one set of bit numbers, with the columns where the mask has
// a 0 framed in all three. The full 32 bits are one press away. The mask is the instruction's own
// operand as the assembler parsed it; the word and the result come from the run.

import { useMemo } from "react";

import {
  BitCells,
  BitRow,
  CellLegend,
  Ruler,
  bitList,
  bitOf,
  differing,
  hex,
  signedOf,
  unsignedOf,
  type Marks,
} from "../bits";
import { firstInstruction, shapeOf } from "../bitops";
import { VIEW_STRINGS as S } from "../strings";
import { traceOf, wValue } from "../trace";
import type { RecordedProgram } from "../listing";

export function MaskView({
  program,
  entry,
  word,
}: {
  program: Pick<RecordedProgram, "listing">;
  entry: string;
  word: number;
}) {
  const trace = useMemo(() => traceOf(program, { entry, args: [word] }), [program, entry, word]);
  const first = firstInstruction(trace, entry);
  const shape = first ? shapeOf(first) : null;
  if (shape === null || shape.kind !== "logic") return null;
  const result = wValue(trace.result.final, 0);
  const start = wValue(trace.result.initial, 0);
  const zeros = new Set([...Array(32).keys()].filter((n) => bitOf(shape.mask, n) === 0));
  const changed = differing(start, result);
  const framed: Marks = { picked: zeros };
  const text = (v: number) => `${hex(v)} (${unsignedOf(v)})`;
  return (
    <div className="al-maskview" data-view="mask">
      <p className="al-maskline">
        {S.maskView.mask(String(signedOf(shape.mask)), hex(shape.mask))}
      </p>
      <div className="al-cellrows">
        <BitCells
          row="view-word"
          name={S.bitOps.rowBefore("w0")}
          value={start}
          text={text(start)}
          marks={framed}
          numbers
        />
        <BitCells
          row="view-mask"
          name={S.bitOps.rowMask}
          value={shape.mask}
          text={`${hex(shape.mask)} (${signedOf(shape.mask)})`}
          marks={framed}
        />
        <BitCells
          row="view-result"
          name={S.bitOps.rowAfter("w0")}
          value={result}
          text={text(result)}
          marks={{ ...framed, changed }}
        />
      </div>
      <p className="al-legend">
        {S.maskView.frame(
          zeros.size === 1 ? S.bits.bit([...zeros][0] ?? 0) : S.bits.bitsList(bitList(zeros)),
          zeros.size,
        )}
      </p>
      <CellLegend tags={["changed"]} />
      <details className="al-all32">
        <summary>{S.maskView.all}</summary>
        <div className="al-bitrows">
          <Ruler />
          <BitRow
            row="full-word"
            name={S.bitOps.rowBefore("w0")}
            value={start}
            text={text(start)}
            marks={framed}
          />
          <BitRow
            row="full-mask"
            name={S.bitOps.rowMask}
            value={shape.mask}
            text={`${hex(shape.mask)} (${signedOf(shape.mask)})`}
            marks={framed}
          />
          <BitRow
            row="full-result"
            name={S.bitOps.rowAfter("w0")}
            value={result}
            text={text(result)}
            marks={{ ...framed, changed }}
          />
        </div>
      </details>
    </div>
  );
}
