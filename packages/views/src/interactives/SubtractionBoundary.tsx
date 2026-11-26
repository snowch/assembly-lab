// Copyright © 2026 Christopher Snow

import { useMemo } from "react";
import { Prose } from "@platform/lesson-runtime";
import type { RecordedProgram } from "../listing";
import type { TraceCall } from "../trace";
import { subtractionBoundary } from "../subtraction-bridge";
import { SUBTRACTION_BOUNDARY_STRINGS as S } from "../strings.subtraction-boundary";

/** Four complete mathematical workings, each from its own recorded subtraction. */
export function SubtractionBoundary({
  program,
  call,
  which,
}: {
  program: RecordedProgram;
  call: TraceCall;
  which: number;
}) {
  const cases = useMemo(() => subtractionBoundary(program, call, which), [program, call, which]);
  const fixed = cases[0]!.small;
  const below = cases.find(({ small }) => small.fullSum === fixed.range - 1n)!.small;
  const equal = cases.find(({ small }) => small.fullSum === fixed.range)!.small;
  const values: Record<string, string> = {
    width: String(fixed.width),
    minimum: String(fixed.minimum),
    maximum: String(fixed.maximum),
    range: String(fixed.range),
    zeroPattern: fixed.patterns.minimum,
    maxPattern: fixed.patterns.allOnes,
    realWidth: String(cases[0]!.wide.width),
    b: String(fixed.b),
    inverted: String(fixed.inverted),
    carryIn: String(fixed.carryIn),
    topPlace: String(1n << BigInt(fixed.width - 1)),
    belowA: String(below.a),
    belowTopA: String(below.top.a),
    belowTopB: String(below.top.b),
    belowTopCarryIn: String(below.top.carryIn),
    belowTopBinary: below.top.total.toString(2),
    belowTopCarryOut: String(below.top.carryOut),
    equalA: String(equal.a),
    equalTopA: String(equal.top.a),
    equalTopB: String(equal.top.b),
    equalTopCarryIn: String(equal.top.carryIn),
    equalTopBinary: equal.top.total.toString(2),
    equalTopKept: String(equal.top.kept),
    equalTopCarryOut: String(equal.top.carryOut),
  };
  const text = (template: string) =>
    template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? `{${key}}`);
  const digits = (pattern: string) => (
    <span className="al-sub-boundary-digits">
      {pattern.split("").map((bit, index) => (
        <span key={index}>{bit}</span>
      ))}
    </span>
  );
  return (
    <section className="al-figure al-sub-boundary" aria-label={S.title}>
      <h3>{S.title}</h3>
      <Prose markdown={text(S.setup)} />
      <div className="al-sub-boundary-grid" role="group" aria-label={S.title}>
        {cases.map(({ small }) => {
          const expression = `${small.a} − ${small.b}`;
          const operands = [
            { id: "a", label: S.inputA, pattern: small.patterns.a, operator: "" },
            { id: "inverted", label: S.invertedB, pattern: small.patterns.inverted, operator: "+" },
            { id: "one", label: text(S.addOne), pattern: small.patterns.carryIn, operator: "+" },
          ];
          return (
            <div
              className="al-sub-boundary-case"
              data-boundary-a={String(small.a)}
              data-full-sum={String(small.fullSum)}
              role="group"
              aria-label={expression}
              key={expression}
            >
              <h4>{expression}</h4>
              <div className="al-sub-boundary-working">
                {operands.map(({ id, label, pattern, operator }) => (
                  <div className="al-sub-boundary-work-row" data-boundary-operand={id} key={id}>
                    <span className="al-sub-boundary-label">{label}</span>
                    <code className="al-sub-boundary-number" aria-label={`${label}: ${pattern}`}>
                      <span className="al-sub-boundary-prefix" aria-hidden="true">
                        {operator}
                      </span>
                      {digits(pattern)}
                    </code>
                  </div>
                ))}
              </div>
              <div className="al-sub-boundary-answer">
                <div className="al-sub-boundary-label">
                  {S.carryOut} | {S.keptBits}
                </div>
                <div className="al-sub-boundary-work-row">
                  <span aria-hidden="true" />
                  <div className="al-sub-boundary-result-value">
                    <code
                      className="al-sub-boundary-number"
                      data-boundary-sum
                      aria-label={`${S.carryOut}: ${small.carryOut}; ${S.keptBits}: ${small.patterns.result}`}
                    >
                      <span
                        className="al-sub-boundary-prefix al-sub-boundary-carry"
                        data-boundary-carry
                        data-on={small.carryOut === 1}
                      >
                        {small.carryOut}
                      </span>
                      <span className="al-sub-boundary-kept" data-boundary-bits>
                        {digits(small.patterns.result)}
                      </span>
                    </code>
                    <span
                      className="al-sub-boundary-reading"
                      data-boundary-reading
                      aria-label={`${S.unsigned}: ${small.result}`}
                    >
                      {String(small.result)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="al-sub-boundary-reason">
        <h4>{S.reasonTitle}</h4>
        <Prose markdown={text(S.topColumn)} />
        <Prose markdown={text(S.belowColumn)} />
        <Prose markdown={text(S.equalColumn)} />
        <Prose markdown={text(S.takeaway)} />
      </div>
    </section>
  );
}
