// Copyright © 2026 Christopher Snow

import { useHandoffState } from "../update-handoff";

// Small, explicitly selected calls shown as body-execution bars and a register history. The model
// supplies every count and value. A limited run is a prefix, never a completed iteration count.
// The ordinary stepper shows the individual instructions and the backward branch's next target.

import { useMemo } from "react";
import { z } from "zod";

import { useSlot } from "@platform/lesson-runtime";

import { loopSummary } from "../loop";
import { stopSentence } from "../messages";
import { withCode } from "../parts";
import { VIEW_STRINGS as S } from "../strings";
import { LOOP_STRINGS as L } from "../strings.loop";
import { traceOf, wValue } from "../trace";
import { CallSchema, RecordedSchema, withProps } from "./props";

const Props = z.object({
  program: RecordedSchema,
  /** A label directly before the body operation whose executions are counted. */
  bodyLabel: z.string(),
  /** Fixed, deliberately small calls: no free input can request billions of iterations. */
  runs: z
    .array(z.object({ label: z.string(), call: CallSchema }))
    .min(1)
    .max(12),
  historyRegister: z.number().int().min(0).max(30).default(0),
  after: z.string().optional(),
});

const HISTORY_LIMIT = 12;

export const LoopFigure = withProps(Props, function LoopFigure({ data, store }) {
  const [selected, setSelected] = useHandoffState("LoopFigure.selected", 0);
  const [prediction] = useSlot<{ choice: string }>(store, data.after ?? "");
  const unlocked = data.after === undefined || prediction !== undefined;
  const runs = useMemo(
    () =>
      unlocked
        ? data.runs.map((item) => {
            const trace = traceOf(data.program, {
              ...item.call,
              maxSteps: item.call.maxSteps ?? 256,
            });
            return {
              label: item.label,
              trace,
              summary: loopSummary(trace, data.bodyLabel, data.historyRegister),
            };
          })
        : [],
    [unlocked, data.program, data.runs, data.bodyLabel, data.historyRegister],
  );
  if (!unlocked)
    return (
      <p role="note" className="al-locked">
        {S.stepper.locked}
      </p>
    );
  const chosen = runs[selected] ?? runs[0];
  if (chosen === undefined) return null;
  const largest = Math.max(1, ...runs.map((item) => item.summary.visits.length));
  const { trace, summary } = chosen;
  const stop = trace.result.stop;
  const status =
    stop.kind === "returned"
      ? L.returned(wValue(trace.result.final, 0))
      : stop.kind === "limit"
        ? L.limited(stop.steps)
        : stopSentence(stop);
  return (
    <div className="al-figure al-loop" data-figure="loop-runs">
      <div className="al-loop-choices" role="group" aria-label={L.chooseRun}>
        {runs.map((item, index) => (
          <button
            key={index}
            type="button"
            className="button secondary"
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
          >
            {withCode(item.label)}
          </button>
        ))}
      </div>
      <ol className="al-loop-bars" aria-label={L.chart}>
        {runs.map((item, index) => {
          const count = item.summary.visits.length;
          return (
            <li
              key={index}
              className="al-loop-bar-row"
              data-selected={selected === index}
              data-visits={count}
              data-returned={item.summary.returned}
            >
              <span className="al-loop-label">{withCode(item.label)}</span>
              <span className="al-loop-bar-track" aria-hidden="true">
                <span className="al-loop-bar" style={{ width: `${(count / largest) * 100}%` }} />
              </span>
              <span className="al-loop-count">
                {item.summary.returned ? L.iterations(count) : L.partialIterations(count)}
              </span>
            </li>
          );
        })}
      </ol>
      <div
        className="al-loop-history"
        role="group"
        aria-label={L.history(`w${data.historyRegister}`)}
      >
        <p className="al-loop-history-title">{withCode(L.history(`w${data.historyRegister}`))}</p>
        <ol className="al-loop-values">
          <li data-iteration="0">
            <span>{L.initial}</span>
            <strong>{summary.initial}</strong>
          </li>
          {summary.visits.slice(0, HISTORY_LIMIT).map((visit, index) => (
            <li key={visit.step} data-iteration={index + 1}>
              <span>{L.iteration(index + 1)}</span>
              <strong>{visit.value}</strong>
            </li>
          ))}
        </ol>
        {summary.visits.length === 0 && <p>{L.noIterations}</p>}
        {summary.visits.length > HISTORY_LIMIT && (
          <p>{L.moreHistory(summary.visits.length - HISTORY_LIMIT)}</p>
        )}
      </div>
      <p role="status" data-stop={stop.kind}>
        {status && withCode(status)}
      </p>
    </div>
  );
});
