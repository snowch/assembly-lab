// Copyright © 2026 Christopher Snow

import { useMemo } from "react";
import { z } from "zod";
import { fourBitNegation, fourBitReadings } from "../complement";
import { shown } from "../readings";
import { COMPLEMENT_STRINGS as S } from "../strings.complement";
import { MODULE1_STRINGS as M1 } from "../strings.module1";
import { useHandoffState } from "../update-handoff";
import { withProps } from "./props";

const Props = z.object({ mode: z.enum(["readings", "negation"]) });

export const ComplementExplorer = withProps(Props, function ComplementExplorer({ data }) {
  const [pattern, setPattern] = useHandoffState(`ComplementExplorer.${data.mode}`, "1010");
  const readings = useMemo(() => fourBitReadings(pattern), [pattern]);
  const negation = useMemo(() => fourBitNegation(pattern), [pattern]);
  const sum = (reading: "unsigned" | "signed") =>
    `${readings.places.map((place) => shown(place[reading])).join(" + ")} = ${shown(readings[reading])}`;
  const row = (label: string, bits: string, extra = false) => (
    <div className="al-complement-flow-row">
      <span>{label}</span>
      <code className="al-complement-pattern">
        {extra ? (
          <>
            <span className="al-complement-extra" title={S.extra}>
              {bits.slice(0, -4)}
            </span>
            {bits.slice(-4)}
          </>
        ) : (
          bits
        )}
      </code>
    </div>
  );
  return (
    <div className="al-figure al-complement" data-mode={data.mode} data-pattern={pattern}>
      <div className="al-complement-grid" role="group" aria-label={S.group}>
        {[...pattern].map((bit, index) => (
          <button
            key={index}
            type="button"
            className="al-toggle"
            aria-label={S.bit(3 - index)}
            aria-pressed={bit === "1"}
            data-bit={3 - index}
            data-top={index === 0 ? "true" : undefined}
            onClick={() =>
              setPattern(
                pattern.slice(0, index) + (bit === "1" ? "0" : "1") + pattern.slice(index + 1),
              )
            }
          >
            {index === 0 && (
              <span className="al-top-flag" aria-hidden="true">
                {M1.toggles.topBit}
              </span>
            )}
            <span className="al-toggle-n" aria-hidden="true">
              {3 - index}
            </span>
            <span className="al-toggle-v" aria-hidden="true">
              {bit}
            </span>
          </button>
        ))}
        {data.mode === "readings" && (
          <>
            <span className="al-complement-row-label">{S.unsignedWeight}</span>
            {readings.places.map((place) => (
              <code key={place.index} data-weight="unsigned" data-active={place.set}>
                {shown(place.unsignedWeight)}
              </code>
            ))}
            <span className="al-complement-row-label">{S.signedWeight}</span>
            {readings.places.map((place) => (
              <code key={place.index} data-weight="signed" data-active={place.set}>
                {shown(place.signedWeight)}
              </code>
            ))}
          </>
        )}
      </div>
      <div className="al-controls">
        {data.mode === "negation" && (
          <>
            <button type="button" className="button secondary" onClick={() => setPattern("0000")}>
              {S.zero}
            </button>
            <button type="button" className="button secondary" onClick={() => setPattern("1000")}>
              {S.minimum}
            </button>
          </>
        )}
        <button type="button" className="button secondary" onClick={() => setPattern("1010")}>
          {S.reset}
        </button>
      </div>
      {data.mode === "readings" ? (
        <dl className="al-complement-sums" role="status">
          <div>
            <dt>{S.unsignedSum}</dt>
            <dd>
              <code data-sum="unsigned">{sum("unsigned")}</code>
            </dd>
          </div>
          <div>
            <dt>{S.signedSum}</dt>
            <dd>
              <code data-sum="signed">{sum("signed")}</code>
            </dd>
          </div>
        </dl>
      ) : (
        <div className="al-complement-negation" role="status">
          <p>
            {S.before}: <code data-value="before">{shown(negation.before.signed)}</code>
          </p>
          <div className="al-complement-flow">
            {row(S.original, pattern)}
            <span className="al-complement-arrow" aria-hidden="true">
              ↓
            </span>
            {row(S.inverted, negation.inverted.pattern)}
            <span className="al-complement-arrow" aria-hidden="true">
              ↓ <code>+ 1</code>
            </span>
            {row(S.fullSum, negation.fullPattern, negation.discarded)}
            <span className="al-complement-arrow" aria-hidden="true">
              ↓
            </span>
            {row(S.retained, negation.after.pattern)}
          </div>
          <p>
            {S.after}: <code data-value="after">{shown(negation.after.signed)}</code>
          </p>
          {negation.outsideSignedRange && <strong>{S.outOfRange}</strong>}
          <p data-feedback>
            {negation.outsideSignedRange
              ? S.minimumFeedback
              : pattern === "0000"
                ? S.zeroFeedback
                : S.fitsFeedback}
          </p>
          {negation.discarded && <p>{S.extraFeedback}</p>}
        </div>
      )}
    </div>
  );
});
