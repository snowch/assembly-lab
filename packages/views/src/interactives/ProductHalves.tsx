// Copyright © 2026 Christopher Snow

import { useMemo } from "react";
import { z } from "zod";
import { useSlot } from "@platform/lesson-runtime";
import { productHalves, divisionParts } from "../products";
import { traceOf } from "../trace";
import { VIEW_STRINGS as S } from "../strings";
import { PRODUCT_STRINGS as P } from "../strings.products";
import { MemoryCallSchema, RecordedSchema, withProps } from "./props";

const Props = z.object({ program: RecordedSchema, call: MemoryCallSchema, after: z.string() });
export const ProductHalves = withProps(Props, function ProductHalves({ data, store }) {
  const [prediction] = useSlot<{ choice: string }>(store, data.after);
  const result = useMemo(
    () => (prediction === undefined ? null : productHalves(traceOf(data.program, data.call))),
    [prediction, data.program, data.call],
  );
  if (result === null)
    return (
      <p role="note" className="al-locked">
        {S.stepper.locked}
      </p>
    );
  const half = (label: string, value: typeof result.low) => (
    <div className="al-product-half">
      <strong>{label}</strong>
      <code>{value.hex}</code>
      <div className="al-product-bytes" aria-hidden="true">
        {value.bytes.map((byte, i) => (
          <span key={i}>{byte}</span>
        ))}
      </div>
    </div>
  );
  return (
    <div
      className="al-figure al-products"
      data-figure="product-halves"
      role="group"
      aria-label={P.diagram}
    >
      <p role="note">{P.completed}</p>
      <p>
        {P.inputs}: <code>{result.inputs[0]}</code> × <code>{result.inputs[1]}</code>
      </p>
      {[
        { label: P.unsignedProduct, high: result.unsignedHigh },
        { label: P.signedProduct, high: result.signedHigh },
      ].map((row) => (
        <div key={row.label}>
          <p>
            <strong>{row.label}</strong>
          </p>
          <div className="al-product-pair">
            {half(P.highHalf, row.high)}
            {half(P.lowHalf, result.low)}
          </div>
        </div>
      ))}
    </div>
  );
});

export const DivisionParts = withProps(Props, function DivisionParts({ data, store }) {
  const [prediction] = useSlot<{ choice: string }>(store, data.after);
  const result = useMemo(
    () => (prediction === undefined ? null : divisionParts(traceOf(data.program, data.call))),
    [prediction, data.program, data.call],
  );
  if (result === null)
    return (
      <p role="note" className="al-locked">
        {S.stepper.locked}
      </p>
    );
  const blocks = [...result.groups, result.remainder];
  return (
    <div
      className="al-figure al-division-parts"
      data-figure="division-parts"
      role="group"
      aria-label={P.divisionDiagram}
    >
      <p>
        {P.dividend}: <code>{result.dividend}</code>
      </p>
      <p>{P.groupedPart}</p>
      <div className="al-division-bar" aria-hidden="true">
        {blocks.map((value, i) => (
          <div
            key={i}
            className={i === blocks.length - 1 ? "al-division-remainder" : ""}
            style={{ flex: Math.abs(value) || 0.2 }}
          >
            <code>{value}</code>
          </div>
        ))}
      </div>
      <p>
        {P.quotient}: <code>{result.quotient}</code>; {P.remainder}: <code>{result.remainder}</code>
      </p>
    </div>
  );
});
