// Copyright © 2026 Christopher Snow

// A word as the trip computer keeps it: the 32 bits of w0 at the start of a call, and a key that
// says what the labelled bits and the field mean. The word is what the model puts in w0 for the
// call; the key's values are read from that word. Static: it runs nothing after the call starts.

import { useMemo } from "react";
import { z } from "zod";

import { BitKey, BitRow, Ruler, hex, unsignedOf } from "../bits";
import { VIEW_STRINGS as S } from "../strings";
import { traceOf, viewAt, wValue } from "../trace";
import { CallSchema, KeyEntrySchema, RecordedSchema, withProps } from "./props";

const Props = z.object({
  program: RecordedSchema,
  call: CallSchema,
  entries: z.array(KeyEntrySchema).min(1),
});

export const WarningWordFigure = withProps(Props, function WarningWordFigure({ data }) {
  const trace = useMemo(() => traceOf(data.program, data.call), [data.program, data.call]);
  const word = wValue(viewAt(trace, 0).state, 0);
  return (
    <div className="al-figure al-warning" data-figure="warning-word">
      <div className="al-bitrows">
        <Ruler />
        <BitRow
          row="word"
          name={S.bits.onEntry("w0")}
          value={word}
          text={`${hex(word)} (${unsignedOf(word)})`}
        />
      </div>
      <BitKey entries={data.entries} before={word} />
    </div>
  );
});
