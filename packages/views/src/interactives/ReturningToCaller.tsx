// Copyright © 2026 Christopher Snow

import { useId, useLayoutEffect, useMemo, useRef, useState } from "react";
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
    const flowRef = useRef<HTMLDivElement>(null);
    const bankRef = useRef<HTMLDivElement>(null);
    const linkRef = useRef<HTMLDivElement>(null);
    const addressRef = useRef<HTMLElement>(null);
    const id = useId();
    const [connector, setConnector] = useState<{
      x: number;
      y: number;
      bend: number;
      endX: number;
      endY: number;
    } | null>(null);
    useLayoutEffect(() => {
      if (!pointsToCaller) {
        setConnector(null);
        return;
      }
      let active = true;
      const measure = () => {
        if (
          !active ||
          !flowRef.current ||
          !bankRef.current ||
          !linkRef.current ||
          !addressRef.current
        )
          return;
        const flow = flowRef.current.getBoundingClientRect();
        const bank = bankRef.current.getBoundingClientRect();
        const link = linkRef.current.getBoundingClientRect();
        const address = addressRef.current.getBoundingClientRect();
        const next = {
          x: link.x + link.width / 2 - flow.x,
          y: link.bottom - flow.y,
          bend: bank.bottom - flow.y + 20,
          endX: address.x - flow.x - 4,
          endY: address.y + address.height / 2 - flow.y,
        };
        setConnector((previous) =>
          previous &&
          Object.keys(next).every(
            (key) => previous[key as keyof typeof next] === next[key as keyof typeof next],
          )
            ? previous
            : next,
        );
      };
      measure();
      const observer = new ResizeObserver(measure);
      for (const element of [flowRef.current, bankRef.current, linkRef.current, addressRef.current])
        if (element) observer.observe(element);
      window.addEventListener("resize", measure);
      void document.fonts.ready.then(measure);
      return () => {
        active = false;
        observer.disconnect();
        window.removeEventListener("resize", measure);
      };
    }, [pointsToCaller, position]);
    return (
      <div className="al-figure al-returning" data-figure="returning-to-caller" data-k={position}>
        <h4>{S.title}</h4>
        <div ref={flowRef} className="al-returning-flow">
          <div
            ref={bankRef}
            className="al-returning-registers"
            role="group"
            aria-label={S.sharedRegisters}
          >
            <strong>{S.sharedRegisters}</strong>
            <p className="al-returning-moment">{position === 0 ? S.beforeCall : S.registersNow}</p>
            <div className="al-returning-register-values">
              {[0, 1].map((n) => (
                <DecimalRegister
                  key={n}
                  name={`w${n}`}
                  value={wValue(view.state, n)}
                  changed={position > 0 && view.written.has(n)}
                />
              ))}
              <div
                ref={linkRef}
                className="al-register-summary al-returning-target"
                role="group"
                aria-labelledby={`${id}-register ${id}-role`}
                aria-describedby={pointsToCaller ? `${id}-connection` : undefined}
                data-register="x30"
                data-written={position > 0 && view.written.has(30)}
                data-changed={position > 0 && view.written.has(30)}
              >
                <code id={`${id}-register`} className="al-dreg-name">
                  x30
                </code>
                {pointsToCaller ? (
                  <code className="al-dreg-value al-returning-saved-address">
                    {String(view.state.x[30])}
                  </code>
                ) : (
                  <span className="al-returning-unset">{S.beforeCallTarget}</span>
                )}
                <span id={`${id}-role`} className="al-returning-link-name">
                  {S.returnAddress}
                </span>
                {position > 0 && view.written.has(30) && (
                  <span className="al-dreg-flag">{S.written}</span>
                )}
              </div>
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
                <code
                  ref={index === callerIndex ? addressRef : undefined}
                  className="al-returning-address"
                >
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
          {pointsToCaller && connector && (
            <>
              <svg className="al-returning-connector" aria-hidden="true">
                <path
                  className="al-returning-connector-line"
                  d={`M ${connector.x} ${connector.y} V ${connector.bend} H 8 V ${connector.endY} H ${connector.endX}`}
                />
                <path
                  className="al-returning-connector-tip"
                  d={`M ${connector.endX - 7} ${connector.endY - 5} L ${connector.endX} ${connector.endY} L ${connector.endX - 7} ${connector.endY + 5}`}
                />
              </svg>
              <span
                id={`${id}-connection`}
                className="al-returning-connector-label"
                style={{ top: connector.bend }}
              >
                {S.connection}
                <span className="visually-hidden">
                  : {String(view.state.x[30])}, {S.returnTarget}
                </span>
              </span>
            </>
          )}
        </div>
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
