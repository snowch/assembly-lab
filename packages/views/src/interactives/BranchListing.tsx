// Copyright © 2026 Christopher Snow

import { useHandoffState } from "../update-handoff";

// A listing with an arrow from each branch to the label it names, for a run the learner chooses. The
// model runs the listing for the chosen value. Each arrow is drawn from the program the model
// assembled (which instruction names which label) and the steps it recorded (whether the branch ran,
// and whether it was taken). The instructions that ran are the strongest element of the listing and
// the ones the run did not reach are greyed; each branch is tagged taken, not taken or not reached,
// in words and by a mark as well as by colour, and the taken branch's arrow is drawn heavier. `ret`
// goes back to the code that called the function and is not drawn as a branch. Under the listing, the
// instructions that ran are listed in order, with the outcome of each branch, then how many ran and
// what the function returned: all from the run. The figure stays shut until the prediction it names
// has been checked.

import { useId, useMemo, type CSSProperties } from "react";
import { z } from "zod";

import { useSlot } from "@platform/lesson-runtime";

import { branchArrows, parseInt32, ranLines, type BranchArrow } from "../branch";
import { pathOf, type PathItem } from "../branchPath";
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
  /**
   * Where the value comes from: "any" is a box the learner types in (and the buttons), "presets" only
   * the buttons. A lesson whose challenge asks for runs of this function for other values uses the
   * buttons only, so the figure never shows what the challenge asks for.
   */
  choices: z.enum(["any", "presets"]).default("any"),
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
        // A taken branch's head is larger, as its line is heavier.
        const h = a.state === "taken" ? 6 : 4;
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
              points={`${gutter - 2},${y(a.to)} ${gutter - 3 - h - 3},${y(a.to) - h} ${gutter - 3 - h - 3},${y(a.to) + h}`}
            />
          </g>
        );
      })}
    </svg>
  );
}

/** The tag for a branch: its words, and a mark that tells it apart from the others without colour. */
function tagOf(state: BranchArrow["state"]): string {
  return state === "taken"
    ? B.arrows.taken
    : state === "not-taken"
      ? B.arrows.notTaken
      : B.arrows.notReached;
}

function Rows({
  trace,
  arrows,
  entryLine,
}: {
  trace: Trace;
  arrows: readonly BranchArrow[];
  entryLine: number | undefined;
}) {
  const ran = useMemo(() => ranLines(trace), [trace]);
  return (
    <div className="al-brows">
      {trace.lines.map((line, i) => {
        if (line.kind === "label") {
          // A label is reached when the instruction under it ran.
          const reached = ran.has(i + 1);
          const jumpedTo = arrows.some((a) => a.to === i && a.state === "taken");
          return (
            <div
              key={i}
              className="al-brow al-brow-label"
              data-ran={reached}
              data-jumped={jumpedTo}
            >
              <code>{line.text}:</code>
              {jumpedTo && <span className="al-bjump">{B.arrows.jumpedHere}</span>}
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
            data-entry={entryLine === i}
          >
            <code className="al-text">{line.text}</code>
            <span className="al-btags">
              {entryLine === i && <span className="al-bstart">{B.arrows.start}</span>}
              {arrow && (
                <span className="al-btag" data-state={arrow.state}>
                  {tagOf(arrow.state)}
                </span>
              )}
            </span>
            {!did && <span className="visually-hidden">{B.arrows.didNotRun}</span>}
          </div>
        );
      })}
    </div>
  );
}

/** The instructions that ran, in order, each branch with how it went. */
function PathList({ path }: { path: readonly PathItem[] }) {
  return (
    <ol className="al-path" aria-label={B.arrows.path}>
      {path.map((item) => (
        <li key={item.step} className="al-path-item" data-branch={item.branch?.taken ?? "none"}>
          <code>{item.text}</code>
          {item.branch !== null && (
            <span className="al-btag" data-state={item.branch.taken ? "taken" : "not-taken"}>
              {item.branch.taken ? B.arrows.taken : B.arrows.notTaken}
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

export const BranchListing = withProps(Props, function BranchListing({ data, store }) {
  const inputId = useId();
  const [text, setText] = useHandoffState("BranchListing.text", String(data.start));
  const [prediction] = useSlot<{ choice: string }>(store, data.after ?? "");
  const value = parseInt32(text);
  const trace = useMemo(
    () => (value === null ? null : traceOf(data.program, { entry: data.entry, args: [value] })),
    [value, data.program, data.entry],
  );
  const arrows = useMemo(() => (trace ? branchArrows(trace) : []), [trace]);
  const path = useMemo(() => (trace ? pathOf(trace) : []), [trace]);
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
  const entryLine = result ? trace?.lineAt.get(result.initial.pc) : undefined;
  const buttons = data.presets.length > 0 && (
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
  );
  return (
    <div className="al-figure al-branch" data-figure="branch-listing">
      <div className="al-branch-chooser">
        {data.choices === "any" ? (
          <>
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
          </>
        ) : (
          <span className="al-branch-label">{B.arrows.chooser(data.argument)}</span>
        )}
        {buttons}
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
          <Rows trace={trace} arrows={arrows} entryLine={entryLine} />
        </div>
      )}
      {trace && result && (
        <>
          <PathList path={path} />
          <div className="al-branch-result" role="status">
            {stopped !== null ? (
              <p>{withCode(stopped)}</p>
            ) : (
              <>
                <p className="al-branch-ran">{B.arrows.ranCount(result.steps.length)}</p>
                <p className="al-branch-returned">
                  {B.arrows.returned(
                    data.reading === "signed"
                      ? wValueAsInt(result.final, 0)
                      : wValue(result.final, 0),
                  )}
                </p>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
});
