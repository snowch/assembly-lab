// Copyright © 2026 Christopher Snow

import { RegisterStateLabel } from "../RegisterStateLabel";
import { useHandoffState } from "../update-handoff";

// Native stops are recorded by scripts/native/check.py. The adjacent browser values are
// independently computed by the course machine, never copied from those stops.
import { useMemo } from "react";
import { z } from "zod";
import { Prose, useSlot } from "@platform/lesson-runtime";
import { RegisterSummary } from "../parts";
import { NativeBootDiagrams, NativeDiagramProps } from "./NativeBootDiagrams";
import { VIEW_STRINGS as S } from "../strings";
import { traceOf, viewAt, wValue } from "../trace";
import { CallSchema, RecordedSchema, withProps } from "./props";

const Props = z.object({
  stages: z.array(z.object({ name: z.string(), detail: z.string() })),
  diagram: NativeDiagramProps.optional(),
  program: RecordedSchema.optional(),
  call: CallSchema.optional(),
  recorded: z.array(z.array(z.number())).optional(),
  pcOffsets: z.array(z.number()).optional(),
  after: z.string().optional(),
  prose: z.string().optional(),
  environment: z.string().optional(),
  versions: z.record(z.string(), z.string()).optional(),
  referenceSummary: z.string().optional(),
  boot: z
    .object({
      startupStops: z.array(z.object({ pc: z.number(), sp: z.number(), result: z.number() })),
      regions: z.array(z.object({ kind: z.string(), start: z.number(), end: z.number() })),
    })
    .optional(),
  bootLabels: z
    .object({
      title: z.string(),
      recordedNote: z.string(),
      pc: z.string(),
      sp: z.string(),
      result: z.string(),
      memory: z.string(),
      stackTop: z.string().optional(),
      rangeNote: z.string(),
      stops: z.array(z.string()),
      regions: z.record(z.string(), z.string()),
    })
    .optional(),
  labels: z
    .object({
      next: z.string(),
      ran: z.string(),
      recorded: z.string(),
      model: z.string(),
      recordedNote: z.string(),
      stops: z.array(z.string()),
      returnToMain: z.string(),
      pc: z.string(),
    })
    .optional(),
});

export const NativeFigure = withProps(Props, function NativeFigure({ data, store }) {
  const [k, setK] = useHandoffState("NativeFigure.k", 0);
  const [bootStop, setBootStop] = useHandoffState("NativeFigure.bootStop", 0);
  const [prediction] = useSlot<{ choice: string }>(store, data.after ?? "");
  const trace = useMemo(
    () => (data.program && data.call ? traceOf(data.program, data.call) : null),
    [data.program, data.call],
  );
  if (data.after && !prediction) return <p className="al-locked">{S.stepper.locked}</p>;
  const view = trace ? viewAt(trace, k) : null;
  const labels = data.labels;
  return (
    <div className="al-figure" data-figure="native">
      {data.prose && <Prose markdown={data.prose} />}
      {data.versions && (
        <details className="lesson-details">
          <summary>{data.referenceSummary}</summary>
          <p>{data.environment}</p>
          <ul>
            {Object.entries(data.versions).map(([tool, version]) => (
              <li key={tool}>
                <code>{version}</code>
              </li>
            ))}
          </ul>
        </details>
      )}
      {data.stages.length > 0 && (
        <ol className="al-native-pipeline">
          {data.stages.map((stage) => (
            <li key={stage.name}>
              <strong>{stage.name}</strong>
              <span>{stage.detail}</span>
            </li>
          ))}
        </ol>
      )}
      {data.diagram && <NativeBootDiagrams {...data.diagram} />}
      {data.boot && data.bootLabels && (
        <div className="al-native-boot" data-native-boot>
          <h3>{data.bootLabels.title}</h3>
          <p>{data.bootLabels.recordedNote}</p>
          <div className="al-controls">
            {data.boot.startupStops.map((_, index) => (
              <button
                key={index}
                className="button secondary"
                type="button"
                aria-pressed={bootStop === index}
                onClick={() => setBootStop(index)}
              >
                {data.bootLabels?.stops[index]}
              </button>
            ))}
          </div>
          <p role="status">{data.bootLabels.stops[bootStop]}</p>
          <div className="al-memory-registers" aria-live="polite">
            {(
              [
                ["pc", data.bootLabels.pc],
                ["sp", data.bootLabels.sp],
                ["result", data.bootLabels.result],
              ] as const
            ).map(([key, label]) =>
              key === "result" ? (
                <div
                  key={key}
                  className="al-register-summary"
                  role="group"
                  aria-label={label}
                  data-memory="result"
                >
                  <code className="al-dreg-name">{label}</code>
                  <code className="al-dreg-value">
                    0x{data.boot?.startupStops[bootStop]?.result.toString(16)}
                  </code>
                </div>
              ) : (
                <RegisterSummary
                  key={key}
                  name={key}
                  written={false}
                  label={label}
                  value={`0x${data.boot?.startupStops[bootStop]?.[key].toString(16)}`}
                />
              ),
            )}
          </div>
          {data.bootLabels.stackTop &&
            data.boot.regions.some((region) => region.kind === "stack") && (
              <RegisterSummary
                name="stack_top"
                label={data.bootLabels.stackTop}
                value={`0x${data.boot.regions.find((region) => region.kind === "stack")!.end.toString(16)}`}
                written={false}
              />
            )}
        </div>
      )}
      {view && labels && (
        <>
          <div className="al-controls">
            <button
              className="button secondary"
              type="button"
              disabled={k === 0}
              onClick={() => setK(k - 1)}
            >
              {S.stepper.back}
            </button>
            <button
              className="button"
              type="button"
              disabled={k === view.total}
              onClick={() => setK(k + 1)}
            >
              {S.stepper.next}
            </button>
            <button
              className="button secondary"
              type="button"
              disabled={k === 0}
              onClick={() => setK(0)}
            >
              {S.stepper.reset}
            </button>
          </div>
          <p role="status">{labels.stops[k]}</p>
          {view.ran !== null && (
            <p>
              {labels.ran}: <code>{trace?.lines[view.ran]?.text}</code>
            </p>
          )}
          {view.next !== null && (
            <p>
              {labels.next}: <code>{trace?.lines[view.next]?.text}</code>
            </p>
          )}
          <p className="al-native-pc">
            <code>
              {labels.pc}:{" "}
              {k < view.total ? `trip_distance + ${data.pcOffsets?.[k]}` : labels.returnToMain}
            </code>
          </p>
          <div className="al-native-comparison">
            {[
              { title: labels.recorded, values: data.recorded?.[k], kind: "recorded" },
              {
                title: labels.model,
                values: [0, 1, 2, 3].map((n) => wValue(view.state, n)),
                kind: "model",
              },
            ].map((side) => (
              <div key={side.kind} data-native-side={side.kind}>
                <p>{side.title}</p>
                {side.kind === "model" && trace && <RegisterStateLabel trace={trace} view={view} />}
                <div className="al-memory-registers">
                  {side.values?.map((value, n) => (
                    <RegisterSummary
                      key={n}
                      name={`w${n}`}
                      value={value}
                      written={view.written.has(n)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p>{labels.recordedNote}</p>
        </>
      )}
    </div>
  );
});
