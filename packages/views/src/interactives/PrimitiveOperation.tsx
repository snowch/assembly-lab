// Copyright © 2026 Christopher Snow

import { useHandoffState } from "../update-handoff";

// Small first applications of arithmetic. All displayed input/result values and read/write
// relationships come from a simulator trace. Operation activities stop at their arithmetic
// prefix; the function activity also executes its return to the model's caller.
import { useMemo } from "react";
import { z } from "zod";
import { Prose, useSlot } from "@platform/lesson-runtime";
import { flowAt } from "../flow";
import { cLinesOf } from "../listing";
import { DecimalRegister, ListingView } from "../parts";
import { PRIMITIVE_STRINGS as S } from "../strings.primitive";
import { traceOf, viewAt, wValue } from "../trace";
import { CallSchema, RecordedSchema, withProps } from "./props";

const Stage = z.object({
  kind: z.enum(["operation", "function"]).default("operation"),
  title: z.string(),
  prose: z.string(),
  program: RecordedSchema,
  call: CallSchema,
  registers: z.array(z.number().int().min(0).max(30)).min(1).max(3),
  steps: z.number().int().min(1).max(2).default(1),
  predict: z.boolean().default(false),
  showCompilerLines: z.boolean().default(false),
});
const Props = z.object({ stage: Stage });
interface Stored {
  step: number;
  prediction?: string;
}

export const PrimitiveOperation = withProps(
  Props,
  function PrimitiveOperation({ data, store, interactive }) {
    const [stored, setStored] = useSlot<Stored>(store, interactive.id);
    const [answer, setAnswer] = useHandoffState("PrimitiveOperation.answer", "");
    const stage = data.stage;
    const isFunction = stage.kind === "function";
    const trace = useMemo(() => traceOf(stage.program, stage.call), [stage.program, stage.call]);
    const callInputs = stage.call.args.map((_, index) => wValue(viewAt(trace, 0).state, index));
    const position = Math.max(0, Math.min(stage.steps, stored?.step ?? 0));
    const view = viewAt(trace, position);
    const flow = flowAt(trace, position, { shiftedOperands: true });
    const complete = position === stage.steps;
    const returned = isFunction && view.stop?.kind === "returned";
    const nextFlow = flowAt(trace, position + 1, { shiftedOperands: true });
    const target = nextFlow?.kind === "arith" ? nextFlow.destination.name : "";
    const matches =
      flow?.kind === "arith" && stored?.prediction !== undefined
        ? Number(stored.prediction) === Number(flow.destination.after)
        : null;
    const shownLines = trace.result.steps.slice(0, stage.steps);
    const unchanged =
      flow?.kind === "arith"
        ? stage.registers.map((n) => `w${n}`).filter((name) => name !== flow.destination.name)
        : [];
    function reset() {
      setStored({ step: 0 });
      setAnswer("");
    }
    function advance() {
      setStored({
        step: position + 1,
        ...(stage.predict ? { prediction: answer } : {}),
      });
      setAnswer("");
    }
    return (
      <div className="al-figure al-primitive" data-figure="primitive-operation" data-k={position}>
        <h4>{stage.title}</h4>
        <Prose markdown={stage.prose} />
        {isFunction ? (
          <div
            className="al-primitive-call-flow"
            data-returned={returned}
            data-ready={position > 0}
          >
            <div className="al-primitive-caller" data-caller-returned={returned}>
              <strong>{S.caller}</strong>
              <code>{S.callerCall(stage.call.entry, callInputs)}</code>
              <span>{returned ? S.callerReturned(wValue(view.state, 0)) : S.callerWaiting}</span>
            </div>
            <div className="al-primitive-call-path" data-active={position === 0 || returned}>
              {returned && <span>{S.returnPath}</span>}
              <span className="al-primitive-call-arrow" aria-hidden="true" />
            </div>
            <div className="al-primitive-call-registers">
              {stage.registers.map((n) => (
                <div className="al-primitive-call-register" key={n}>
                  <span>
                    {n === 0 && position > 0
                      ? returned
                        ? S.result
                        : S.resultReady
                      : callInputs.length === 1
                        ? S.argumentPath
                        : S.argumentPathAt(n)}
                  </span>
                  <DecimalRegister
                    name={`w${n}`}
                    value={wValue(view.state, n)}
                    changed={view.written.has(n)}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <p className="al-primitive-state-label">{stage.steps > 1 ? S.current : S.before}</p>
            <div
              className="al-primitive-registers"
              role="group"
              aria-label={stage.steps > 1 ? S.current : S.before}
            >
              {stage.registers.map((n) => (
                <DecimalRegister
                  key={n}
                  name={`w${n}`}
                  value={wValue(stage.steps > 1 ? view.state : viewAt(trace, 0).state, n)}
                  changed={stage.steps > 1 && view.written.has(n)}
                />
              ))}
            </div>
          </>
        )}
        {isFunction ? (
          <div className="al-primitive-function-listing">
            <ListingView
              cLines={cLinesOf(stage.program.c)}
              lines={trace.lines}
              ran={view.ran}
              next={view.next}
              showCompilerLines={stage.showCompilerLines}
            />
          </div>
        ) : (
          <ol className="al-primitive-instructions" aria-label={S.instruction}>
            {shownLines.map((step, index) => (
              <li key={index} data-next={index === position} data-ran={index === position - 1}>
                <span className="al-primitive-marker" aria-hidden="true">
                  {index === position ? "▸" : ""}
                </span>
                <code>{step.text}</code>
                {stage.steps > 1 && (index === position || index === position - 1) && (
                  <span className="al-primitive-line-label">
                    {index === position ? S.nextInstruction : S.ranInstruction}
                  </span>
                )}
              </li>
            ))}
          </ol>
        )}
        {!isFunction && position === 0 && nextFlow?.kind === "arith" && (
          <div className="al-primitive-flow al-primitive-preview" aria-label={S.instruction}>
            <div className="al-primitive-inputs">
              {nextFlow.sources.map((source, index) => (
                <span key={index}>
                  <small>{source.isRegister ? S.input : S.constant}</small>{" "}
                  <code>
                    {source.isRegister
                      ? `${source.name} = ${source.transform?.input ?? source.value}`
                      : (source.transform?.input ?? source.value)}
                  </code>
                  {source.transform && (
                    <span className="al-primitive-transform">
                      <span aria-hidden="true">→</span> <code>{source.transform.text}</code>
                      <span aria-hidden="true">→</span> <code>{source.value}</code>
                    </span>
                  )}
                  {index === 0 && (
                    <b aria-hidden="true">{nextFlow.operation === "add" ? "+" : "−"}</b>
                  )}
                </span>
              ))}
            </div>
            <span className="al-primitive-arrow" aria-hidden="true">
              ↓
            </span>
            <div className="al-primitive-output" data-pending="true">
              <small>{S.outputPending}</small> <code>{nextFlow.destination.name} = ?</code>
            </div>
          </div>
        )}
        {isFunction && (
          <p className="al-primitive-function-status" role="status">
            {returned
              ? S.functionReturned
              : position === 0
                ? callInputs.length === 1
                  ? S.functionEntry
                  : S.functionEntryMany(stage.registers.map((n) => `w${n}`).join(" and "))
                : S.functionAfterAdd}
          </p>
        )}
        {!isFunction && position > 0 && flow?.kind === "arith" && (
          <div className="al-primitive-result" role="status">
            {stored?.prediction !== undefined && (
              <p className="al-primitive-submitted">
                {S.answer}: <code>{stored.prediction}</code>
              </p>
            )}
            {matches !== null && <p>{matches ? S.correct : S.incorrect}</p>}
            <div className="al-primitive-flow" aria-label={S.ranInstruction}>
              <div className="al-primitive-inputs">
                {flow.sources.map((source, index) => (
                  <span key={index}>
                    <small>{source.isRegister ? S.input : S.constant}</small>{" "}
                    <code>
                      {source.isRegister
                        ? `${source.name} = ${source.transform?.input ?? source.value}`
                        : (source.transform?.input ?? source.value)}
                    </code>
                    {source.transform && (
                      <span className="al-primitive-transform">
                        <span aria-hidden="true">→</span> <code>{source.transform.text}</code>
                        <span aria-hidden="true">→</span> <code>{source.value}</code>
                      </span>
                    )}
                    {index === 0 && (
                      <b aria-hidden="true">{flow.operation === "add" ? "+" : "−"}</b>
                    )}
                  </span>
                ))}
              </div>
              <span className="al-primitive-arrow" aria-hidden="true">
                ↓
              </span>
              <div className="al-primitive-output">
                <small>{S.output}</small>{" "}
                <code>
                  {flow.destination.name} = {flow.destination.after}
                </code>
              </div>
            </div>
            {flow.sources.some((source) => source.name === flow.destination.name) && (
              <p>{S.reused(flow.destination.name)}</p>
            )}
            {unchanged.length > 0 && <p>{S.unchanged(unchanged.join(", "))}</p>}
          </div>
        )}
        {!complete && stage.predict && (
          <label className="al-primitive-answer">
            {S.question(target)}
            <input
              type="number"
              inputMode="numeric"
              aria-label={S.answer}
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
            />
          </label>
        )}
        <div className="al-controls">
          {!complete && (
            <button
              className="button primary"
              type="button"
              disabled={stage.predict && answer.trim() === ""}
              onClick={advance}
            >
              {stage.predict ? S.check : S.run}
            </button>
          )}
          {position > 0 && (
            <button className="button secondary" type="button" onClick={reset}>
              {S.restart}
            </button>
          )}
        </div>
        {complete && !isFunction && <p className="al-primitive-stopped">{S.stopped}</p>}
      </div>
    );
  },
);
