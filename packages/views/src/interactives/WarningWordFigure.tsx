// Copyright © 2026 Christopher Snow

import { useHandoffState } from "../update-handoff";

// A word as the trip computer keeps it: the 32 bits of w0 at the start of a call, the seven bits in
// use drawn large and numbered, each warning as its own on or off bit and the gear as one bracketed
// field with its value, the bits above them drawn as unused, and a key that says what the labelled
// bits mean. The word is what the model puts in w0 for the call; the gear is what the run of the
// function leaves in w0; the key's values are read from the word. Focusing a named warning (or
// the field) marks its bits in both drawings. Nothing here runs anything after the call starts.

import { useMemo } from "react";
import { z } from "zod";

import {
  BitCell,
  BitKey,
  BitRow,
  Ruler,
  bitOf,
  bitsFrom,
  fieldOf,
  hex,
  range,
  unsignedOf,
  type KeyEntry,
  type Marks,
} from "../bits";
import { firstInstruction, shapeOf } from "../bitops";
import { VIEW_STRINGS as S } from "../strings";
import { traceOf, viewAt, wValue } from "../trace";
import { CallSchema, KeyEntrySchema, RecordedSchema, withProps } from "./props";

const Props = z.object({
  program: RecordedSchema,
  call: CallSchema,
  entries: z.array(KeyEntrySchema).min(1),
});

export const WarningWordFigure = withProps(Props, function WarningWordFigure({ data }) {
  const [picked, setPicked] = useHandoffState<KeyEntry | null>("WarningWordFigure.picked", null);
  const trace = useMemo(() => traceOf(data.program, data.call), [data.program, data.call]);
  const word = wValue(viewAt(trace, 0).state, 0);
  // What the function returns: the field it reads, as the model computed it.
  const read = wValue(trace.result.final, 0);
  const first = firstInstruction(trace, data.call.entry);
  const shape = first ? shapeOf(first) : null;
  const reads = shape?.kind === "extract" ? shape : null;
  const top = Math.max(...data.entries.map((e) => e.to));
  const used = bitsFrom(top, 0);
  const unused = range(top + 1, 31);
  const marks: Marks = {
    unused,
    ...(picked ? { picked: range(picked.from, picked.to) } : {}),
  };
  const cellMarks: Marks = picked ? { picked: range(picked.from, picked.to) } : {};
  // Each entry sits in the grid by the columns of its bits: bit `top` is column 1.
  const column = (bit: number) => top - bit + 1;
  return (
    <div className="al-figure al-warning" data-figure="warning-word">
      <div className="al-bitrows">
        <Ruler />
        <BitRow
          row="word"
          name={S.bits.onEntry("w0")}
          value={word}
          text={`${hex(word)} (${unsignedOf(word)})`}
          marks={marks}
        />
      </div>
      <p className="al-legend al-unused-note">{S.warning.unused(top + 1, 31)}</p>
      <div
        className="al-use"
        role="group"
        aria-label={S.warning.inUse}
        style={{ gridTemplateColumns: `repeat(${used.length}, minmax(0, 1fr))` }}
      >
        {used.map((n) => (
          <div className="al-use-cell" key={n} style={{ gridColumn: column(n), gridRow: 1 }}>
            <BitCell n={n} on={bitOf(word, n) === 1} marks={cellMarks} numbers glyphs={false} />
          </div>
        ))}
        {data.entries.map((e) => {
          const single = e.from === e.to;
          const state = single ? (bitOf(word, e.from) === 1 ? S.warning.on : S.warning.off) : "";
          // The field the function reads is shown as the number the function returned.
          const value = single
            ? state
            : String(
                reads && reads.lsb === e.from && reads.lsb + reads.width - 1 === e.to
                  ? read
                  : fieldOf(word, e.from, e.to),
              );
          return (
            <button
              key={e.from}
              type="button"
              className="al-use-label"
              data-entry={`${e.from}-${e.to}`}
              data-kind={single ? "bit" : "field"}
              aria-pressed={picked?.from === e.from}
              style={{
                gridColumn: `${column(e.to)} / span ${e.to - e.from + 1}`,
                gridRow: 2,
              }}
              onFocus={() => setPicked(e)}
              onClick={() => setPicked(e)}
              onBlur={() => setPicked((now) => (now?.from === e.from ? null : now))}
            >
              <span className="al-use-name">{e.label}</span>
              <span className="al-use-state">{value}</span>
            </button>
          );
        })}
      </div>
      <BitKey entries={data.entries} before={word} />
    </div>
  );
});
