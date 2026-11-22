// Copyright © 2026 Christopher Snow

import type { Addition } from "@al/machine";
import { Prose } from "@platform/lesson-runtime";
import { subtractionBridge } from "../subtraction-bridge";
import { SUBTRACTION_BRIDGE_STRINGS as S } from "../strings.subtraction-bridge";

const decimal = (value: bigint | number) => value.toLocaleString("en-GB");
const fill = (text: string, values: Record<string, string>) =>
  text.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? `{${key}}`);

function Pattern({ value }: { value: string }) {
  return <code className="al-sub-bridge-bits">{value}</code>;
}

/** An always-visible worked miniature of this same run, before its real 32-bit columns. */
export function SubtractionBridge({ record }: { record: Addition }) {
  const { small: m, wide: w } = subtractionBridge(record);
  const values = {
    a: decimal(m.a),
    b: decimal(m.b),
    inverted: decimal(m.inverted),
    maximum: decimal(m.allOnes),
    range: decimal(m.range),
    sum: decimal(m.fullSum),
    result: decimal(m.result),
    wideMaximum: decimal(w.allOnes),
    wideRange: decimal(w.range),
    wideInverted: decimal(w.inverted),
    wideSum: decimal(w.fullSum),
    carryValue: decimal(BigInt(m.carryOut) * m.range),
    bBits: m.patterns.b,
    invertedBits: m.patterns.inverted,
    maximumBits: m.patterns.allOnes,
    resultBits: m.patterns.result,
  };
  const text = (template: string) => fill(template, values);
  return (
    <section className="al-sub-bridge" aria-label={S.title}>
      <h3>{S.title}</h3>
      <Prose markdown={text(S.scope)} />
      <div className="al-sub-bridge-panels">
        <div className="al-sub-bridge-panel">
          <h4>{S.inversionTitle}</h4>
          <div className="al-sub-bridge-stack" role="group" aria-label={S.inversionTitle}>
            <div className="al-sub-bridge-head" aria-hidden="true">
              <span />
              <span />
              <span>{S.bits}</span>
              <span>{S.decimal}</span>
            </div>
            {(
              [
                ["b", S.originalB, "", m.patterns.b, m.b],
                ["inverted", S.invertedB, "+", m.patterns.inverted, m.inverted],
                ["all-ones", S.allOnes, "=", m.patterns.allOnes, m.allOnes],
              ] as const
            ).map(([key, label, sign, bits, number]) => (
              <div className="al-sub-bridge-row" data-bridge-row={key} key={String(key)}>
                <span>{label}</span>
                <span aria-hidden="true">{sign}</span>
                <Pattern value={bits} />
                <span
                  className="al-sub-bridge-decimal"
                  aria-label={`${S.unsigned}: ${decimal(number)}`}
                >
                  {decimal(number)}
                </span>
              </div>
            ))}
          </div>
          <Prose markdown={text(S.inversionWhy)} />
        </div>
        <div className="al-sub-bridge-panel">
          <h4>{S.additionTitle}</h4>
          <div className="al-sub-bridge-stack" role="group" aria-label={S.additionTitle}>
            <div className="al-sub-bridge-head" aria-hidden="true">
              <span />
              <span />
              <span>{S.bits}</span>
              <span>{S.decimal}</span>
            </div>
            {(
              [
                ["a", S.inputA, "", m.patterns.a, m.a],
                ["inverse-added", S.invertedB, "+", m.patterns.inverted, m.inverted],
                ["carry-in", S.carryIn, "+", m.patterns.carryIn, BigInt(m.carryIn)],
              ] as const
            ).map(([key, label, sign, bits, number]) => (
              <div className="al-sub-bridge-row" data-bridge-row={key} key={String(key)}>
                <span>{label}</span>
                <span aria-hidden="true">{sign}</span>
                <Pattern value={bits} />
                <span
                  className="al-sub-bridge-decimal"
                  aria-label={`${S.unsigned}: ${decimal(number)}`}
                >
                  {decimal(number)}
                </span>
              </div>
            ))}
          </div>
          <div className="al-sub-bridge-output" role="group" aria-label={S.fullSum}>
            <span>{S.carryOut}</span>
            <span>{S.storedBits}</span>
            <code className="al-sub-bridge-carry" data-bridge-carry>
              {m.carryOut}
            </code>
            <code className="al-sub-bridge-stored" data-bridge-result>
              {m.patterns.result}
            </code>
            <small>{text(S.carryPlace)}</small>
            <small>{text(S.storedReading)}</small>
          </div>
          <p className="al-sub-bridge-total">{text(S.fullSumReading)}</p>
          <Prose markdown={text(S.sumWhy)} />
        </div>
      </div>
      <div className="al-sub-bridge-wide">
        <h3>{S.wideTitle}</h3>
        <Prose markdown={text(S.wideWhy)} />
        <Prose markdown={text(S.rule)} />
      </div>
    </section>
  );
}
