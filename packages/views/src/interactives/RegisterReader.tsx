// Copyright © 2026 Christopher Snow

// One register read three ways. The learner sets the 32 bits one at a time; the page puts the
// pattern in the register by running `mov` and `movk` on the model, and the three readings are what
// the register then holds: its hexadecimal digits, its unsigned reading and its signed reading.
// Each reading that is a number is drawn with the sum of the worths of the bits that are 1, so the
// worth of the top bit, plus or minus 2147483648, is there to see.

import { Fragment, useMemo, useState } from "react";
import { z } from "zod";

import { BitToggles } from "../BitToggles";
import { NO_BITS, readingsOfPattern, shown, worths } from "../readings";
import { VIEW_STRINGS as S } from "../strings";
import { withProps } from "./props";

const Props = z.object({
  /** The register the figure reads: it is always `w0` in Module 1. */
  register: z.string().regex(/^w\d{1,2}$/),
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

export const RegisterReader = withProps(Props, function RegisterReader({ data }) {
  const [bits, setBits] = useState(NO_BITS);
  const readings = useMemo(() => readingsOfPattern(bits), [bits]);
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
});
