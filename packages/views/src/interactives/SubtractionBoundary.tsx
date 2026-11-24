// Copyright © 2026 Christopher Snow

import { useMemo } from "react";
import { Prose } from "@platform/lesson-runtime";
import type { RecordedProgram } from "../listing";
import type { TraceCall } from "../trace";
import { subtractionBoundary } from "../subtraction-bridge";
import { SUBTRACTION_BOUNDARY_STRINGS as S } from "../strings.subtraction-boundary";

/** Three independent calls, held at the same unsigned subtraction boundary. */
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
  const values: Record<string, string> = {
    b: String(fixed.b),
    inverted: String(fixed.inverted),
    carryIn: String(fixed.carryIn),
    range: String(fixed.range),
  };
  const text = (template: string) =>
    template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? `{${key}}`);
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
        {cases.map(({ small: example }, index) => {
          const relation = [S.less, S.equal, S.greater][index]!;
          return (
            <div
              className="al-sub-boundary-row"
              data-boundary-a={String(example.a)}
              key={String(example.a)}
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
                aria-label={`${S.carryOut}: ${example.carryOut}`}
              >
                {example.carryOut}
              </code>
              <div className="al-sub-boundary-kept">
                <code data-boundary-bits aria-label={`${S.keptBits}: ${example.patterns.result}`}>
                  {example.patterns.result}
                </code>
                <small data-boundary-reading aria-label={`${S.unsigned}: ${example.result}`}>
                  {String(example.result)}
                </small>
              </div>
            </div>
          );
        })}
      </div>
      <Prose markdown={text(S.takeaway)} />
    </section>
  );
}
