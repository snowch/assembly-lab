// Copyright © 2026 Christopher Snow

import type { ReactNode } from "react";
import { Prose } from "@platform/lesson-runtime";
import { LessonLink } from "./lesson-references";
import { CALL_COMPARISON_STRINGS as C } from "./strings.call-comparison";
import type { SubtractionWork } from "./subtraction-work";
import { bitsOf } from "./trace";

function Pattern({
  label,
  row,
  value,
  operator = "",
}: {
  label: string;
  row: string;
  value: number;
  operator?: string;
}) {
  const bits = bitsOf(value);
  return (
    <div className="al-subtraction-row" data-work-row={row} data-work-value={value}>
      <span className="al-subtraction-label">{label}</span>
      <span className="al-subtraction-operator" aria-hidden="true">
        {operator}
      </span>
      <code className="al-subtraction-pattern" data-work-pattern>
        {[0, 8, 16, 24].map((from) => (
          <span key={from}>
            {[...bits.slice(from, from + 8)].map((bit, index) => (
              <span key={index}>{bit}</span>
            ))}
          </span>
        ))}
      </code>
    </div>
  );
}

/** One compact 32-bit working, ending in the existing shared returned-word view. */
export function SubtractionWorking({
  work,
  returnedWord,
}: {
  work: SubtractionWork;
  returnedWord: ReactNode;
}) {
  const S = C.subtraction;
  return (
    <div className="al-subtraction-work" data-subtraction-work role="group" aria-label={S.heading}>
      <Prose markdown={S.calculationNote(work.width)} />
      <p className="al-subtraction-width">{S.widthNote(work.width - 1, 0)}</p>
      <div className="al-subtraction-panel al-compare-panel">
        <div className="al-subtraction-chunks">
          <div className="al-subtraction-chunk">
            <h4>{S.oppositeHeading}</h4>
            <div className="al-subtraction-scroll">
              <div className="al-subtraction-calculation">
                <Pattern label={S.second(String(work.second))} row="second" value={work.second} />
                <Pattern label={S.inverted} row="inverted" value={work.inverted} />
                <Pattern
                  label={`${S.plusOne(String(work.one))}: ${S.opposite}`}
                  row="opposite"
                  value={work.opposite}
                />
              </div>
            </div>
          </div>
          <div className="al-subtraction-chunk">
            <h4>{S.sumHeading}</h4>
            <div className="al-subtraction-scroll">
              <div className="al-subtraction-calculation al-subtraction-sum">
                <Pattern label={S.first(String(work.first))} row="first" value={work.first} />
                <Pattern label={S.opposite} row="add-opposite" value={work.opposite} operator="+" />
                <div
                  className="al-subtraction-result"
                  data-work-row="result"
                  data-work-value={work.result}
                >
                  <p>{C.sharedReturnedBits}</p>
                  <div className="al-subtraction-returned">
                    <span className="al-subtraction-equals" aria-hidden="true">
                      =
                    </span>
                    {returnedWord}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="al-subtraction-reminder">
          {S.reminder} <LessonLink href="#/lesson/four-bit-arithmetic">{S.link}</LessonLink>.
        </p>
      </div>
    </div>
  );
}
