// Copyright © 2026 Christopher Snow

import { useMemo } from "react";
import { z } from "zod";
import { Prose, useSlot } from "@platform/lesson-runtime";
import { cLinesOf, programLines } from "../listing";
import { DecimalRegister, ListingView } from "../parts";
import { traceOf, viewAt, wValue } from "../trace";
import { RETURNING_STRINGS as S } from "../strings.returning";
import { CallSchema, RecordedSchema, withProps } from "./props";

const Props = z.object({
  program: RecordedSchema,
  call: CallSchema,
  functionProgram: RecordedSchema,
  startStep: z.number().int().min(0),
  endStep: z.number().int().min(1),
  callerLabel: z.string(),
  functionLabel: z.string(),
});

export const ReturningToCaller = withProps(
  Props,
  function ReturningToCaller({ data, store, interactive }) {
    const [stored, setStored] = useSlot<{ step: number; startStep?: number }>(
      store,
      interactive.id,
    );
    const trace = useMemo(() => traceOf(data.program, data.call), [data.program, data.call]);
    // Old saved positions began after BL (trace step 2). Keep the same machine state.
    const savedPosition = stored ? stored.step + (stored.startStep ?? 2) - data.startStep : 0;
    const position = Math.max(0, Math.min(data.endStep - data.startStep, savedPosition));
    const savePosition = (step: number) => setStored({ step, startStep: data.startStep });
    const view = viewAt(trace, data.startStep + position);
    const callerIndex =
      trace.lines.findIndex((line) => line.kind === "label" && line.text === data.callerLabel) + 1;
    const functionIndex = trace.lines.findIndex(
      (line) => line.kind === "label" && line.text === data.functionLabel,
    );
    const functionLines = programLines(data.functionProgram);
    const localIndex = (index: number | null) =>
      index !== null && index > functionIndex && index < functionIndex + functionLines.length
        ? index - functionIndex
        : null;
    const callIndex = trace.lineAt.get(trace.result.steps[data.startStep]!.address)!;
    const addressAtLine = new Map([...trace.lineAt].map(([address, index]) => [index, address]));
    const callerAddress = [...trace.lineAt].find(([, index]) => index === callerIndex)?.[0];
    const pointsToCaller =
      callerAddress !== undefined && view.state.x[30] === BigInt(callerAddress);
    const complete = data.startStep + position === data.endStep;
    return (
      <div className="al-figure al-returning" data-figure="returning-to-caller" data-k={position}>
        <h4>{S.title}</h4>
        <div className="al-returning-registers" role="group" aria-label={S.sharedRegisters}>
          <strong>{S.sharedRegisters}</strong>
          <p className="al-returning-moment">{position === 0 ? S.beforeCall : S.registersNow}</p>
          {[0, 1].map((n) => (
            <DecimalRegister
              key={n}
              name={`w${n}`}
              value={wValue(view.state, n)}
              changed={position > 0 && view.written.has(n)}
            />
          ))}
          <div className="al-returning-target" data-written={position > 0 && view.written.has(30)}>
            <code>x30</code>
            <span>{S.returnAddress}</span>
            {pointsToCaller && (
              <code className="al-returning-saved-address">{String(view.state.x[30])}</code>
            )}
            {pointsToCaller && <span aria-hidden="true">→</span>}
            <span>{pointsToCaller ? S.returnTarget : S.beforeCallTarget}</span>
            {position > 0 && view.written.has(30) && <strong>{S.written}</strong>}
          </div>
        </div>
        <section className="al-returning-caller" aria-label={S.caller}>
          <h5>{S.caller}</h5>
          <Prose markdown={S.callerProse} />
          <div className="al-returning-instruction-head" aria-hidden="true">
            <span>{S.address}</span>
            <span>{S.instruction}</span>
          </div>
          {[callIndex, callerIndex].map((index) => (
            <div
              key={index}
              className="al-returning-instruction"
              data-next={!complete && view.next === index}
              data-ran={position > 0 && view.ran === index}
            >
              <code className="al-returning-address">
                <span className="visually-hidden">{S.address} </span>
                {addressAtLine.get(index)}
              </code>
              <span className="al-returning-marker" aria-hidden="true">
                {!complete && view.next === index ? "▸" : ""}
              </span>
              <code className="al-returning-code">{trace.lines[index]?.text}</code>
              {!complete && view.next === index && (
                <span className="al-returning-instruction-status">{S.next}</span>
              )}
              {position > 0 && view.ran === index && (
                <span className="al-returning-instruction-status">{S.ran}</span>
              )}
            </div>
          ))}
        </section>
        <section className="al-returning-function" aria-label={S.functionName}>
          <h5>{S.functionName}</h5>
          <ListingView
            cLines={cLinesOf(data.functionProgram.c)}
            lines={functionLines}
            ran={position > 0 ? localIndex(view.ran) : null}
            next={complete ? null : localIndex(view.next)}
          />
        </section>
        <p className="al-returning-current">
          <span>{complete ? S.ran : S.next}</span>{" "}
          <code>{trace.lines[(complete ? view.ran : view.next) ?? -1]?.text}</code>
        </p>
        <p role="status">{S.status(position, wValue(view.state, 0), wValue(view.state, 1))}</p>
        <div className="al-controls">
          <button
            className="button secondary"
            disabled={position === 0}
            onClick={() => savePosition(position - 1)}
          >
            {S.back}
          </button>
          <button
            className="button primary"
            disabled={complete}
            onClick={() => savePosition(position + 1)}
          >
            {S.run}
          </button>
          <button
            className="button secondary"
            disabled={position === 0}
            onClick={() => savePosition(0)}
          >
            {S.reset}
          </button>
        </div>
        {complete && <p>{S.complete}</p>}
      </div>
    );
  },
);
