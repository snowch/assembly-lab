// Copyright © 2026 Christopher Snow

// One register read three ways. The learner sets the 32 bits one at a time; the page puts the
// pattern in the register by running `mov` and `movk` on the model, and the three readings are what
// the register then holds: its hexadecimal digits, its unsigned reading and its signed reading.
// Each reading that is a number is drawn with the sum of the worths of the bits that are 1, so the
// worth of the top bit, plus or minus 2147483648, is there to see.
//
// Two optional props change the figure; without them it is the figure every other lesson has.
// `start` says where the first pattern comes from: a recorded program and call, run on the model,
// whose `w0` the register starts as (the pattern is then written nowhere in the lesson). `topBit`
// draws the readings as a small table, the top bit's worth and the other 31 bits' worth in each
// column and the result under them, with the pattern on a line of its own because it is not a
// reading, and keeps the sum of every bit in a closed part. It also adds a button that clears the
// bits.

import { Fragment, useMemo, useState } from "react";
import { z } from "zod";

import { BitToggles } from "../BitToggles";
import {
  NO_BITS,
  patternAfterRun,
  readingsOfPattern,
  shown,
  topBitTable,
  worths,
} from "../readings";
import { VIEW_STRINGS as S } from "../strings";
import { MODULE1_STRINGS as M1 } from "../strings.module1";
import { CallSchema, RecordedSchema, withProps } from "./props";

const Props = z.object({
  /** The register the figure reads: it is always `w0` in Module 1. */
  register: z.string().regex(/^w\d{1,2}$/),
  /** A recorded program and call whose result register is the first pattern; else all zeros. */
  start: z.object({ program: RecordedSchema, call: CallSchema }).optional(),
  /** Draw the top bit's table, and the button that clears the bits. */
  topBit: z.boolean().default(false),
  /** An optional adjacent scratch area, initially closed. */
  disclosure: z.string().optional(),
});

function Sum({
  pattern,
  reading,
  total,
}: {
  pattern: string;
  reading: "unsigned" | "signed";
  total: number;
}) {
  const terms = worths(pattern, reading);
  return (
    <span className="al-sum">
      {terms.length === 0 ? (
        <span className="al-term">0</span>
      ) : (
        terms.map((t, i) => (
          <Fragment key={i}>
            {i > 0 && " + "}
            <span className="al-term">{shown(t)}</span>
          </Fragment>
        ))
      )}
      {" = "}
      <span className="al-term al-total">{shown(total)}</span>
    </span>
  );
}

/** A part of a reading: a plus sign on what is added, the minus sign on what is taken away. */
const part = (n: number): string => (n > 0 ? `+${n}` : shown(n));

export const RegisterReader = withProps(Props, function RegisterReader({ data }) {
  const first = useMemo(() => {
    if (data.start === undefined) return NO_BITS;
    return patternAfterRun(data.start.program, data.start.call, Number(data.register.slice(1)));
  }, [data.start, data.register]);
  const [bits, setBits] = useState(first);
  const readings = useMemo(() => readingsOfPattern(bits), [bits]);
  const table = useMemo(() => (data.topBit ? topBitTable(bits) : null), [data.topBit, bits]);

  if (table === null) {
    return (
      <div
        className="al-figure al-reader"
        data-figure="register-reader"
        data-register={data.register}
      >
        <BitToggles
          bits={bits}
          onChange={setBits}
          label={S.toggles.group(data.register)}
          digits={readings.digits}
        />
        <div className="al-readings" role="group" aria-label={S.reader.readings}>
          <div className="al-reading" data-reading="hex">
            <span className="al-reading-name">{S.reader.hex}</span>
            <code className="al-reading-value">0x{readings.digits}</code>
          </div>
          <div className="al-reading" data-reading="unsigned">
            <span className="al-reading-name">{S.reader.unsigned}</span>
            <span className="al-reading-value">{readings.unsigned}</span>
            <Sum pattern={readings.pattern} reading="unsigned" total={readings.unsigned} />
          </div>
          <div className="al-reading" data-reading="signed">
            <span className="al-reading-name">{S.reader.signed}</span>
            <span className="al-reading-value">{shown(readings.signed)}</span>
            <Sum pattern={readings.pattern} reading="signed" total={readings.signed} />
          </div>
        </div>
      </div>
    );
  }

  const figure = (
    <div
      className="al-figure al-reader"
      data-figure="register-reader"
      data-register={data.register}
      data-view="top-bit"
    >
      <BitToggles
        bits={bits}
        onChange={setBits}
        label={S.toggles.group(data.register)}
        digits={readings.digits}
        topBit
        groupOutline
      />
      <div className="al-pattern" data-reading="hex">
        <span className="al-reading-name">{M1.reader.pattern}</span>
        <code className="al-reading-value">0x{readings.digits}</code>
        <button
          type="button"
          className="button secondary al-clear"
          onClick={() => setBits(NO_BITS)}
        >
          {M1.reader.clearBits}
        </button>
      </div>
      <table className="al-top-table" aria-label={M1.reader.table}>
        <thead>
          <tr>
            <td />
            <th scope="col">{S.reader.unsigned}</th>
            <th scope="col">{S.reader.signed}</th>
          </tr>
        </thead>
        <tbody>
          <tr data-row="top">
            <th scope="row">{M1.reader.topBitRow}</th>
            <td data-cell="unsigned">{part(table.top.unsigned)}</td>
            <td data-cell="signed">{part(table.top.signed)}</td>
          </tr>
          <tr data-row="other">
            <th scope="row">{M1.reader.otherRow}</th>
            <td data-cell="unsigned">{part(table.other)}</td>
            <td data-cell="signed">{part(table.other)}</td>
          </tr>
          <tr data-row="result" className="al-top-result">
            <th scope="row">{M1.reader.resultRow}</th>
            <td data-reading="unsigned">
              <span className="al-reading-value">{readings.unsigned}</span>
            </td>
            <td data-reading="signed">
              <span className="al-reading-value">{shown(readings.signed)}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <details className="lesson-details al-calc">
        <summary>{M1.reader.showCalculation}</summary>
        <div className="al-calc-body">
          <div className="al-reading" data-sum="unsigned">
            <span className="al-reading-name">{S.reader.unsigned}</span>
            <Sum pattern={readings.pattern} reading="unsigned" total={readings.unsigned} />
          </div>
          <div className="al-reading" data-sum="signed">
            <span className="al-reading-name">{S.reader.signed}</span>
            <Sum pattern={readings.pattern} reading="signed" total={readings.signed} />
          </div>
        </div>
      </details>
    </div>
  );
  return data.disclosure === undefined ? (
    figure
  ) : (
    <details className="lesson-details al-reader-scratch">
      <summary>{data.disclosure}</summary>
      {figure}
    </details>
  );
});
