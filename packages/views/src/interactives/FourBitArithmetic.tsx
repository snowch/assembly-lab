// Copyright © 2026 Christopher Snow

import { useMemo } from "react";
import { z } from "zod";
import { FOUR_BIT_EXAMPLES, fourBitAddition, fourBitSubtraction } from "../four-bit-arithmetic";
import { shown } from "../readings";
import { FOUR_BIT_STRINGS as S } from "../strings.four-bit-arithmetic";
import { useHandoffState } from "../update-handoff";
import { withProps } from "./props";

const Props = z.object({ mode: z.enum(["addition", "width", "subtraction"]) });
type Sum = ReturnType<typeof fourBitAddition>;

function Columns({
  sum,
  done,
  outside = false,
  opposite = false,
}: {
  sum: Sum;
  done: number;
  outside?: boolean;
  opposite?: boolean;
}) {
  const columns = [...sum.columns].reverse();
  const hidden = <span aria-label={S.unrevealed}>?</span>;
  return (
    <table className="al-four-columns" aria-label={S.columnsLabel}>
      <thead>
        <tr>
          <td />
          {outside && (
            <th scope="col" className="al-four-outside-label">
              {S.extraRow}
            </th>
          )}
          {columns.map(({ bit }) => (
            <th key={bit} scope="col">
              {S.bit(bit)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr data-row="carry">
          <th scope="row">{S.carryRow}</th>
          {outside && <td />}
          {columns.map((column) => (
            <td key={column.bit} data-bit={column.bit} className="al-four-carry">
              {column.bit === 0 || column.bit <= done ? column.carryIn : hidden}
            </td>
          ))}
        </tr>
        <tr data-row="a">
          <th scope="row">
            {S.firstRow} <code>({shown(sum.a.unsigned)})</code>
          </th>
          {outside && <td />}
          {columns.map((column) => (
            <td key={column.bit} data-bit={column.bit} className="al-four-input">
              {column.a}
            </td>
          ))}
        </tr>
        <tr data-row="b">
          <th scope="row">
            <code>+</code> {opposite ? S.opposite : S.secondRow}{" "}
            <code>({shown(opposite ? sum.b.signed : sum.b.unsigned)})</code>
          </th>
          {outside && <td />}
          {columns.map((column) => (
            <td key={column.bit} data-bit={column.bit} className="al-four-input">
              {column.b}
            </td>
          ))}
        </tr>
        <tr data-row="result">
          <th scope="row">{S.resultRow}</th>
          {outside && (
            <td className="al-four-extra" data-outside="true">
              <span aria-label={`${S.outside}: ${sum.carryOut}`}>{sum.carryOut}</span>
            </td>
          )}
          {columns.map((column) => (
            <td
              key={column.bit}
              data-bit={column.bit}
              data-revealed={column.bit < done}
              className="al-four-result"
            >
              {column.bit < done ? column.kept : hidden}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}

export const FourBitArithmetic = withProps(Props, function FourBitArithmetic({ data }) {
  const [revealed, setRevealed] = useHandoffState(`FourBitArithmetic.${data.mode}.columns`, 0);
  const done = Number.isInteger(revealed) ? Math.max(0, Math.min(4, revealed)) : 0;
  const worked = useMemo(() => {
    const { a, b } = FOUR_BIT_EXAMPLES[data.mode];
    return data.mode === "subtraction" ? fourBitSubtraction(a, b) : fourBitAddition(a, b);
  }, [data.mode]);
  const subtraction = "negation" in worked ? worked : null;
  const sum = subtraction ? subtraction.addition : (worked as Sum);
  const visible = data.mode === "addition" ? done : sum.columns.length;
  const lastColumn = done > 0 ? sum.columns[done - 1]! : null;
  return (
    <div className="al-figure al-four-arithmetic" data-mode={data.mode} data-done={visible}>
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
        </>
      )}
      <Columns sum={sum} done={visible} outside={data.mode === "width"} opposite={!!subtraction} />
      {data.mode === "addition" && (
        <>
          <div className="al-controls">
            <button
              type="button"
              className="button primary"
              disabled={done === sum.columns.length}
              onClick={() => setRevealed(Math.min(sum.columns.length, done + 1))}
            >
              {S.nextColumn}
            </button>
            <button type="button" className="button secondary" onClick={() => setRevealed(0)}>
              {S.reset}
            </button>
          </div>
          <div className="al-four-status" role="status" aria-live="polite">
            <p>{lastColumn ? S.column(lastColumn) : S.start}</p>
            {done === sum.columns.length && (
              <p>
                {S.done} {S.unsigned}:{" "}
                <code data-reading="unsigned">{shown(sum.result.unsigned)}</code>
              </p>
            )}
          </div>
        </>
      )}
      {data.mode === "width" && (
        <div className="al-four-status">
          <p>
            {S.outside}: <code>{sum.carryOut}</code>.{" "}
            {S.wrapSummary(sum.fullPattern, sum.result.pattern)}
          </p>
          <p>
            {S.unsigned}: <code data-reading="unsigned">{shown(sum.result.unsigned)}</code>
          </p>
        </div>
      )}
      {subtraction && (
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
      )}
    </div>
  );
});
