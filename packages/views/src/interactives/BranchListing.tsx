// Copyright © 2026 Christopher Snow

// A listing with an arrow from each branch to the label it names, for a run the learner chooses. The
// model runs the listing for the chosen value. Each arrow is drawn from the program the model
// assembled (which instruction names which label) and the steps it recorded (whether the branch ran,
// and whether it was taken); an instruction the run did not reach is greyed. `ret` goes back to the
// code that called the function and is not drawn as a branch. The figure stays shut until the
// prediction it names has been checked.

import { useId, useMemo, useState, type CSSProperties } from "react";
import { z } from "zod";

import { useSlot } from "@platform/lesson-runtime";

import { branchArrows, parseInt32, ranLines, type BranchArrow } from "../branch";
import { stopSentence } from "../messages";
import { withCode } from "../parts";
import { VIEW_STRINGS as S } from "../strings";
import { BRANCH_STRINGS as B } from "../strings.branch";
import { traceOf, wValue, wValueAsInt, type Trace } from "../trace";
import { RecordedSchema, withProps } from "./props";

const Props = z.object({
  program: RecordedSchema,
  /** The label the run starts at. */
  entry: z.string(),
  /** What the value is called, as the function's C names it: "gradient". */
  argument: z.string(),
  /** The value the figure starts with. */
  start: z.number().int(),
  /** Values the lesson has already used, offered as buttons. */
  presets: z.array(z.number().int()).default([]),
  /** How the function's own type reads what it returns. */
  reading: z.enum(["signed", "unsigned"]).default("signed"),
  /** The id of a prediction in this lesson. The figure stays shut until it has been checked. */
  after: z.string().optional(),
});

/** The height of a row, the width of a lane and the room an arrow's head takes, in pixels. */
export const ROW = 36;
export const LANE = 14;
export const HEAD = 14;

function Arrows({
  arrows,
  rows,
  gutter,
}: {
  arrows: readonly BranchArrow[];
  rows: number;
  gutter: number;
}) {
  const y = (i: number) => i * ROW + ROW / 2;
  return (
    <svg
      className="al-barrows"
      width={gutter}
      height={rows * ROW}
      viewBox={`0 0 ${gutter} ${rows * ROW}`}
      aria-hidden="true"
      focusable="false"
    >
      {arrows.map((a) => {
        const x = gutter - HEAD - a.lane * LANE;
        return (
          <g
            key={`${a.from}-${a.to}`}
            className="al-arrow"
            data-state={a.state}
            data-from={a.from}
            data-to={a.to}
            data-label={a.label}
          >
            <path
              className="al-arrow-line"
              d={`M ${gutter - 2} ${y(a.from)} H ${x} V ${y(a.to)} H ${gutter - 8}`}
            />
            <polygon
              className="al-arrow-head"
              points={`${gutter - 2},${y(a.to)} ${gutter - 9},${y(a.to) - 4} ${gutter - 9},${y(a.to) + 4}`}
            />
          </g>
        );
      })}
    </svg>
  );
}

function Rows({ trace, arrows }: { trace: Trace; arrows: readonly BranchArrow[] }) {
  const ran = useMemo(() => ranLines(trace), [trace]);
  return (
    <div className="al-brows">
      {trace.lines.map((line, i) => {
        if (line.kind === "label") {
          // A label is reached when the instruction under it ran.
          const reached = ran.has(i + 1);
          return (
            <div key={i} className="al-brow al-brow-label" data-ran={reached}>
              <code>{line.text}:</code>
            </div>
          );
        }
        const arrow = arrows.find((a) => a.from === i);
        const did = ran.has(i);
        return (
          <div
            key={i}
            className="al-brow al-brow-insn"
            data-ran={did}
            data-branch={arrow?.state ?? "none"}
          >
            <code className="al-text">{line.text}</code>
            {arrow?.state === "taken" && <span className="al-btag">{B.arrows.taken}</span>}
            {arrow?.state === "not-taken" && <span className="al-btag">{B.arrows.notTaken}</span>}
            {!did && <span className="visually-hidden">{B.arrows.didNotRun}</span>}
          </div>
        );
      })}
    </div>
  );
}

export const BranchListing = withProps(Props, function BranchListing({ data, store }) {
  const inputId = useId();
  const [text, setText] = useState(String(data.start));
  const [prediction] = useSlot<{ choice: string }>(store, data.after ?? "");
  const value = parseInt32(text);
  const trace = useMemo(
    () => (value === null ? null : traceOf(data.program, { entry: data.entry, args: [value] })),
    [value, data.program, data.entry],
  );
  const arrows = useMemo(() => (trace ? branchArrows(trace) : []), [trace]);
  if (data.after !== undefined && prediction === undefined) {
    return (
      <p role="note" className="al-locked">
        {S.stepper.locked}
      </p>
    );
  }
  const lanes = Math.max(1, ...arrows.map((a) => a.lane + 1));
  const gutter = HEAD + lanes * LANE;
  const style = { "--row-h": `${ROW}px`, "--gutter": `${gutter}px` } as CSSProperties;
  const result = trace?.result;
  const stopped = result ? stopSentence(result.stop) : null;
  return (
    <div className="al-figure al-branch" data-figure="branch-listing">
      <div className="al-branch-chooser">
        <label className="al-branch-label" htmlFor={inputId}>
          {B.arrows.chooser(data.argument)}
        </label>
        <input
          id={inputId}
          type="text"
          className="al-tester-input"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          aria-invalid={value === null}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {data.presets.length > 0 && (
          <div className="al-branch-presets" role="group" aria-label={B.arrows.presets}>
            {data.presets.map((p) => (
              <button
                key={p}
                type="button"
                className="button secondary"
                aria-pressed={text.trim() === String(p)}
                onClick={() => setText(String(p))}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
      {value === null && <p className="al-nomatch">{B.arrows.notWhole}</p>}
      {trace && (
        <div
          className="al-blist"
          style={style}
          role="group"
          aria-label={B.arrows.figure}
          data-lanes={lanes}
        >
          <Arrows arrows={arrows} rows={trace.lines.length} gutter={gutter} />
          <Rows trace={trace} arrows={arrows} />
        </div>
      )}
      {trace && result && (
        <p className="al-branch-result" role="status">
          {stopped !== null
            ? withCode(stopped)
            : withCode(
                B.arrows.result(
                  `${data.entry}(${wValueAsInt(result.initial, 0)})`,
                  data.reading === "signed"
                    ? wValueAsInt(result.final, 0)
                    : wValue(result.final, 0),
                  result.steps.length,
                ),
              )}
        </p>
      )}
    </div>
  );
});
