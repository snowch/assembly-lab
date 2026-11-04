// Copyright © 2026 Christopher Snow

import { useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { FOUR_BIT_EXAMPLES, fourBitAddition, fourBitSubtraction } from "../four-bit-arithmetic";
import { shown } from "../readings";
import { FOUR_BIT_STRINGS as S } from "../strings.four-bit-arithmetic";
import { useHandoffState } from "../update-handoff";
import { withProps } from "./props";

const Props = z.object({ mode: z.enum(["addition", "width", "subtraction"]) });
type Sum = ReturnType<typeof fourBitAddition>;

function CarryWalkthrough({
  sum,
  done,
  reveal,
}: {
  sum: Sum;
  done: number;
  reveal: (value: number) => void;
}) {
  const diagram = useRef<HTMLDivElement>(null);
  const marker = useId();
  const [path, setPath] = useState("");
  const count = sum.columns.length;
  const complete = done === count;
  const active = sum.columns[done ? done - 1 : 0]!;
  const pair = done ? active.total.toString(2).padStart(2, "0") : "??";

  useLayoutEffect(() => {
    const root = diagram.current;
    if (!root) return;
    const draw = () => {
      const source = root.querySelector('[data-carry-source="true"]');
      const target = root.querySelector('[data-destination="carry"]');
      const gap = root.querySelector(".al-four-route-space");
      if (!done || !source || !target || !gap) {
        setPath("");
        return;
      }
      const bounds = root.getBoundingClientRect();
      const from = source.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      if (!bounds.width) {
        setPath("");
        return;
      }
      const x1 = from.left + from.width / 2 - bounds.left;
      const y1 = from.bottom - bounds.top;
      const x2 = to.left + to.width / 2 - bounds.left;
      const y2 = to.top - bounds.top;
      const elbow = gap.getBoundingClientRect().top - bounds.top + 8;
      setPath(`M ${x1} ${y1} V ${elbow} H ${x2} V ${y2}`);
    };
    draw();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(draw);
    observer?.observe(root);
    window.addEventListener("resize", draw);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", draw);
    };
  }, [done]);

  return (
    <div className="al-four-walkthrough">
      <div className="al-four-top">
        <span>{S.starting}</span>
        <span>{S.progress(done, count)}</span>
      </div>
      <div className="al-four-operands">
        <span>
          <b>{S.inputA}</b>
          <code>{sum.a.pattern}</code>
        </span>
        <span aria-hidden="true">+</span>
        <span>
          <b>{S.inputB}</b>
          <code>{sum.b.pattern}</code>
        </span>
      </div>
      <div className="al-four-diagram" ref={diagram}>
        <div className="al-four-split">
          <p className="al-four-current">{S.current(active.bit, done > 0)}</p>
          <div
            className="al-four-binary-equation"
            role="img"
            aria-label={S.binaryEquation(active, done > 0)}
          >
            {[
              [S.inputA, active.a],
              [S.inputB, active.b],
              [S.carryIn, active.carryIn],
            ].map(([label, value], index) => (
              <span className="al-four-equation-part" key={label}>
                {index > 0 && <span className="al-four-sign">+</span>}
                <span className="al-four-term">
                  <span>{label}</span>
                  <strong>{value}</strong>
                </span>
              </span>
            ))}
            <span className="al-four-sign">=</span>
            <span className="al-four-binary">
              {[S.carry, S.kept].map((label, index) => (
                <span className="al-four-output" data-known={done > 0} key={label}>
                  <span>{label}</span>
                  <strong data-carry-source={index === 0}>{pair[index]}</strong>
                </span>
              ))}
              <sub>₂</sub>
            </span>
          </div>
        </div>
        <div className="al-four-route-space">
          {complete && (
            <div
              className="al-four-final-carry"
              data-outside="true"
              data-destination="carry"
              aria-label={S.finalCarry(sum.carryOut)}
            >
              <span>{S.carryOut}</span>
              <strong className="al-four-value">{sum.carryOut}</strong>
            </div>
          )}
        </div>
        <div className="al-four-grid" role="group" aria-label={S.columnsLabel}>
          <div className="al-four-row-labels" aria-hidden="true">
            <span>{S.carryIn}</span>
            <span>{S.inputA}</span>
            <span>+ {S.inputB}</span>
            <span>{S.resultRow}</span>
            <span />
          </div>
          {[...sum.columns].reverse().map((column) => {
            const keptNew = done > 0 && column.bit === active.bit;
            const carryNew = done > 0 && !complete && column.bit === sum.columns[done]!.bit;
            const known = column.bit < done;
            const carryKnown = column.bit <= done;
            const next = !complete && column.bit === sum.columns[done]!.bit;
            const cells = [
              {
                row: "carry",
                value: carryKnown ? column.carryIn : "?",
                label: S.carryIn,
                destination: carryNew ? "carry" : undefined,
              },
              { row: "a", value: column.a, label: S.inputA },
              { row: "b", value: column.b, label: S.inputB },
              {
                row: "result",
                value: known ? column.kept : "?",
                label: S.resultRow,
                destination: keptNew ? "kept" : undefined,
              },
            ];
            return (
              <div
                key={column.bit}
                className="al-four-column"
                data-bit={column.bit}
                data-active={keptNew}
                data-next={next}
                role="group"
                aria-label={S.columnLabel(column.bit, keptNew, next)}
              >
                {cells.map((cell) => (
                  <div
                    key={cell.row}
                    className="al-four-cell"
                    data-row={cell.row}
                    data-bit={column.bit}
                    data-destination={cell.destination}
                    data-unknown={cell.value === "?"}
                    role="img"
                    aria-label={S.cell(cell.label, cell.value, cell.destination)}
                  >
                    <span className="al-four-value">{cell.value}</span>
                    {cell.destination && (
                      <span className="al-four-role">
                        {cell.destination === "carry" ? S.carry : S.kept}
                      </span>
                    )}
                  </div>
                ))}
                <div className="al-four-bit-label">
                  <strong>{S.bit(column.bit)}</strong>
                  <span>{keptNew ? S.revealed : next ? S.next : "\u00a0"}</span>
                </div>
              </div>
            );
          })}
        </div>
        <svg className="al-four-connector" aria-hidden="true">
          <defs>
            <marker
              id={marker}
              markerWidth="8"
              markerHeight="8"
              refX="8"
              refY="4"
              orient="auto"
              markerUnits="userSpaceOnUse"
            >
              <path d="M 0 0 L 8 4 L 0 8 Z" />
            </marker>
          </defs>
          <path className="al-four-carry-path" d={path} markerEnd={`url(#${marker})`} />
        </svg>
      </div>
      <div className="al-four-outcome" role="status" aria-live="polite" aria-atomic="true">
        <p>
          {done
            ? complete
              ? S.complete(sum.result.pattern, sum.carryOut)
              : S.column(active)
            : S.start}
        </p>
        {complete && (
          <p>
            {S.unsigned}: <code data-reading="unsigned">{shown(sum.result.unsigned)}</code>
          </p>
        )}
      </div>
      <div className="al-controls">
        <button
          type="button"
          className="button primary"
          aria-disabled={complete}
          onClick={() => {
            if (!complete) reveal(done + 1);
          }}
        >
          {S.nextColumn}
          <span aria-hidden="true"> ←</span>
        </button>
        <button type="button" className="button secondary" onClick={() => reveal(0)}>
          {S.reset}
        </button>
      </div>
    </div>
  );
}

export const FourBitArithmetic = withProps(Props, function FourBitArithmetic({ data }) {
  const [revealed, setRevealed] = useHandoffState(`FourBitArithmetic.${data.mode}.columns`, 0);
  const worked = useMemo(() => {
    const { a, b } = FOUR_BIT_EXAMPLES[data.mode];
    return data.mode === "subtraction" ? fourBitSubtraction(a, b) : fourBitAddition(a, b);
  }, [data.mode]);
  const subtraction = "negation" in worked ? worked : null;
  const sum = subtraction ? subtraction.addition : (worked as Sum);
  const done = Number.isInteger(revealed) ? Math.max(0, Math.min(sum.columns.length, revealed)) : 0;
  return (
    <div
      className="al-figure al-four-arithmetic"
      data-mode={data.mode}
      data-done={data.mode === "addition" ? done : sum.columns.length}
    >
      {data.mode === "addition" && <CarryWalkthrough sum={sum} done={done} reveal={setRevealed} />}
      {data.mode === "width" && (
        <>
          <div className="al-four-width-sum" role="group" aria-label={S.widthSum}>
            <code>
              {sum.a.pattern} + {sum.b.pattern} =
            </code>
            <div className="al-four-width-result">
              <span className="al-four-width-carry">
                <span>{S.carryOut}</span>
                <strong data-outside="true" aria-label={`${S.outside}: ${sum.carryOut}`}>
                  <span className="al-four-value">{sum.carryOut}</span>
                </strong>
              </span>
              <span className="al-four-width-kept">
                <span>{S.retained}</span>
                <code data-reading="pattern">{sum.result.pattern}</code>
              </span>
            </div>
          </div>
          <p>{S.wrapSummary(sum.fullPattern, sum.result.pattern)}</p>
          <p>
            {S.unsigned}: <code data-reading="unsigned">{shown(sum.result.unsigned)}</code>
          </p>
        </>
      )}
      {subtraction && (
        <>
          <p className="al-four-equation">
            <code>
              {shown(subtraction.a.unsigned)} − {shown(subtraction.b.unsigned)}
            </code>
          </p>
          <div className="al-four-negation" role="group" aria-label={S.negationLabel}>
            <div>
              <span>{S.original}</span>
              <code data-stage="original">{subtraction.b.pattern}</code>
            </div>
            <span className="al-four-arrow" aria-hidden="true">
              <span className="al-four-arrow-glyph">→</span>
            </span>
            <div>
              <span>{S.inverted}</span>
              <code data-stage="inverted">{subtraction.negation.inverted.pattern}</code>
            </div>
            <span className="al-four-arrow">
              <span className="al-four-arrow-glyph" aria-hidden="true">
                →
              </span>
              <span>{S.plusOne}</span>
            </span>
            <div className="al-four-opposite">
              <span>{S.opposite}</span>
              <code data-stage="opposite">{subtraction.negation.after.pattern}</code>
              <span>
                {S.signed}: <code>{shown(subtraction.negation.after.signed)}</code>
              </span>
            </div>
          </div>
          <p className="al-four-stage-label">{S.additionLabel}</p>
          <p className="al-four-compact-addition">
            <code>
              {sum.a.pattern} + {sum.b.pattern} ={" "}
              <span data-reading="pattern">{sum.result.pattern}</span>
            </code>
          </p>
          <p className="al-four-reading">
            {S.signed}:{" "}
            <code data-reading="signed">
              {subtraction.result.places
                .filter((place) => place.set)
                .map((place) => shown(place.signed))
                .join(" + ")}
              {" = "}
              {shown(subtraction.result.signed)}
            </code>
          </p>
        </>
      )}
    </div>
  );
});
