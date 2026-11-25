// Copyright © 2026 Christopher Snow

import { Fragment, useMemo } from "react";
import { Prose } from "@platform/lesson-runtime";
import type { RecordedProgram } from "../listing";
import type { TraceCall } from "../trace";
import { subtractionBoundary } from "../subtraction-bridge";
import { SUBTRACTION_BOUNDARY_STRINGS as S } from "../strings.subtraction-boundary";

/** Independent calls, held at the same unsigned subtraction boundary. */
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
  const places = Array.from({ length: fixed.width }, (_, index) =>
    String(1n << BigInt(fixed.width - index - 1)),
  );
  const values: Record<string, string> = {
    b: String(fixed.b),
    inverted: String(fixed.inverted),
    carryIn: String(fixed.carryIn),
    range: String(fixed.range),
    maximum: String(fixed.range - 1n),
  };
  const text = (template: string, extra: Record<string, string> = {}) =>
    template.replace(/\{(\w+)\}/g, (_, key: string) => extra[key] ?? values[key] ?? `{${key}}`);
  return (
    <section className="al-figure al-sub-boundary" aria-label={S.title}>
      <h3>{S.title}</h3>
      <Prose markdown={text(S.setup)} />
      <div className="al-sub-boundary-grid" role="group" aria-label={S.title}>
        <div className="al-sub-boundary-head" aria-hidden="true">
          <span>{S.calculation}</span>
          <span>{S.fullSum}</span>
          <span>{S.carryOut}</span>
          <span>{S.keptBits}</span>
        </div>
        <div className="al-sub-boundary-places" role="group" aria-label={S.placeValues}>
          <span className="al-sub-boundary-place-label" aria-hidden="true">
            {S.placeValues}
          </span>
          <span data-boundary-place aria-label={text(S.carryPlace)}>
            {values.range}
          </span>
          <div className="al-sub-boundary-weights">
            {places.map((place) => (
              <span key={place}>{place}</span>
            ))}
          </div>
        </div>
        {cases.map(({ small: example }, index) => {
          const relation =
            example.a < example.b ? S.less : example.a === example.b ? S.equal : S.greater;
          const previous = cases[index - 1]?.small;
          const crosses =
            previous && previous.fullSum < fixed.range && example.fullSum >= fixed.range;
          return (
            <Fragment key={String(example.a)}>
              {crosses && (
                <p className="al-sub-boundary-increase" data-boundary-increase>
                  <span aria-hidden="true">↓</span>{" "}
                  {text(S.increase, { increase: String(example.fullSum - previous.fullSum) })}
                </p>
              )}
              <div
                className="al-sub-boundary-row"
                data-boundary-a={String(example.a)}
                role="group"
                aria-label={relation}
              >
                <div className="al-sub-boundary-input">
                  <code>
                    {String(example.a)} − {String(example.b)}
                  </code>
                  <small>{relation}</small>
                </div>
                <span
                  className="al-sub-boundary-sum"
                  data-boundary-sum
                  aria-label={`${S.fullSum}: ${example.fullSum}`}
                >
                  {String(example.fullSum)}
                </span>
                <code
                  className="al-sub-boundary-carry"
                  data-boundary-carry
                  data-on={example.carryOut === 1}
                  aria-label={`${S.carryOut}: ${example.carryOut}`}
                >
                  {example.carryOut}
                </code>
                <div className="al-sub-boundary-kept">
                  <code data-boundary-bits aria-label={`${S.keptBits}: ${example.patterns.result}`}>
                    {example.patterns.result.split("").map((bit, bitIndex) => (
                      <span data-on={bit === "1"} key={bitIndex}>
                        {bit}
                      </span>
                    ))}
                  </code>
                  <small data-boundary-reading aria-label={`${S.unsigned}: ${example.result}`}>
                    {String(example.result)}
                  </small>
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>
      <Prose markdown={text(S.visualCaption)} />
      <Prose markdown={text(S.takeaway)} />
    </section>
  );
}
