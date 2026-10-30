// Copyright © 2026 Christopher Snow

import { RegisterStateLabel } from "../RegisterStateLabel";
import { useHandoffState } from "../update-handoff";

// The learner's own solution to a written challenge, run one instruction at a time on a test call
// they choose, with the stages of its compare and `csel` beside it. It stays shut until the learner's
// saved work for the challenge passes its tests (graded afresh, never read as a mark), so nothing of
// the run is on the page before the challenge is done. The listing is the learner's own text, its
// comments left out, and every value comes from running it on the model.

import { useMemo } from "react";
import { z } from "zod";

import { useStored, type StoredLesson } from "@platform/lesson-runtime";
import type { Lesson } from "@platform/lesson-schema";

import { branchStatusAt, jumpedAt } from "../branchPath";
import { FlagsRow } from "../FlagsRow";
import { grade } from "../grader";
import { cLinesOf, labelOf } from "../listing";
import { stopSentence } from "../messages";
import { PanelSchema, StepPanel } from "../panels";
import { ListingView, RegisterRow, withCode } from "../parts";
import { VIEW_STRINGS as S } from "../strings";
import { ARITH_STRINGS as A } from "../strings.arith";
import { BRANCH_STRINGS as B } from "../strings.branch";
import { traceOf, viewAt, wValue, type Trace } from "../trace";
import { withProps } from "./props";

const Props = z.object({
  /** The id of the challenge whose saved work is run, and whose test calls are offered. */
  challenge: z.string().min(1),
  /** The name the function takes in the listing. */
  entry: z.string().min(1),
  /** The registers to draw: 0 is `w0`. */
  registers: z.array(z.number().int().min(0).max(30)).min(1),
  /** Markdown, shown once the challenge has passed: what to do with the figure. */
  intro: z.string().default(""),
  panel: PanelSchema.optional(),
  /** Say, after a step that ran a branch, whether it was taken and what runs next. */
  branchStatus: z.boolean().default(false),
});

/** Whether the learner's saved work for a challenge passes its tests now. */
function passed(lesson: Lesson, stored: StoredLesson, id: string): boolean {
  const challenge = lesson.challenges?.find((c) => c.id === id);
  const saved = stored.challenges[id];
  if (!challenge || !saved) return false;
  try {
    return grade(challenge, saved.artifact).passed;
  } catch {
    return false;
  }
}

/** The learner's text as a listing the figures draw: the function's label, then each line, comments out. */
export function listingOfText(entry: string, text: string): string {
  const lines = text
    .split("\n")
    .map((l) => l.replace(/\/\/.*$/, "").trim())
    .filter((l) => l !== "");
  return [`${entry}:`, ...lines].join("\n");
}

/** What the status line says: what ran, what runs next. */
function statusOf(trace: Trace, k: number, branchStatus: boolean): string {
  const view = viewAt(trace, k);
  if (view.k === 0) return S.stepper.start;
  const branch = branchStatus ? branchStatusAt(trace, view) : null;
  if (branch !== null) return branch;
  const ran = view.ran === null ? undefined : trace.lines[view.ran];
  const next = view.next === null ? undefined : trace.lines[view.next];
  const parts: string[] = [];
  if (ran) parts.push(S.stepper.ran(ran.text));
  if (view.stop !== null) parts.push(stopSentence(view.stop) ?? S.stepper.ended);
  else if (next) {
    const into = labelOf(trace.lines, view.next as number);
    const from = view.ran === null ? null : labelOf(trace.lines, view.ran);
    parts.push(
      into !== null && from !== null && into !== from
        ? S.stepper.upNextIn(next.text, into)
        : S.stepper.upNext(next.text),
    );
  }
  return parts.join(" ");
}

export const SelectStepper = withProps(Props, function SelectStepper({ data, store, lesson }) {
  const stored = useStored(store);
  const [call, setCall] = useHandoffState("SelectStepper.call", 0);
  const [k, setK] = useHandoffState("SelectStepper.k", 0);
  const challenge = lesson.challenges?.find((c) => c.id === data.challenge);
  const ok = challenge !== undefined && passed(lesson, stored, data.challenge);
  const text = stored.challenges[data.challenge]?.artifact.text ?? "";
  const cases = useMemo(
    () =>
      challenge?.tests.kind === "answers"
        ? challenge.tests.cases.map((c) => ({
            label: c.label,
            args: [0, 1, 2, 3]
              .map((n) => c.given[`w${n}`])
              .filter((v): v is string | number => v !== undefined)
              .map(Number),
          }))
        : [],
    [challenge],
  );
  const chosen = cases[call];
  const trace = useMemo(() => {
    if (!ok || chosen === undefined) return null;
    try {
      return traceOf(
        { listing: listingOfText(data.entry, text) },
        { entry: data.entry, args: chosen.args },
      );
    } catch {
      return null;
    }
  }, [ok, chosen, data.entry, text]);
  if (!ok || trace === null || chosen === undefined) {
    return (
      <p role="note" className="al-locked">
        {A.adder.lockedUntilPassed}
      </p>
    );
  }
  const view = viewAt(trace, k);
  const atEnd = view.k >= view.total;
  return (
    <div
      className="al-figure al-stepper al-solution"
      data-figure="select-stepper"
      data-k={view.k}
      data-jump={data.branchStatus && jumpedAt(trace, view) ? "true" : undefined}
    >
      {data.intro !== "" && <p className="al-solution-intro">{withCode(data.intro)}</p>}
      <div className="al-diff-choose" role="group" aria-label={B.solution.choose}>
        {cases.map((c, i) => (
          <button
            key={c.label}
            type="button"
            className="button secondary"
            aria-pressed={call === i}
            onClick={() => {
              setCall(i);
              setK(0);
            }}
          >
            <code>{c.label}</code>
          </button>
        ))}
      </div>
      <ListingView cLines={cLinesOf("")} lines={trace.lines} next={view.next} ran={view.ran} />
      <div className="al-controls" role="group" aria-label={B.solution.figure}>
        <button
          type="button"
          className="button secondary"
          disabled={view.k === 0}
          onClick={() => setK(Math.max(0, view.k - 1))}
        >
          {S.stepper.back}
        </button>
        <button
          type="button"
          className="button primary"
          disabled={atEnd}
          onClick={() => setK(view.k + 1)}
        >
          {S.stepper.next}
        </button>
        <button
          type="button"
          className="button secondary"
          disabled={view.k === 0}
          onClick={() => setK(0)}
        >
          {S.stepper.reset}
        </button>
      </div>
      <p className="al-status" role="status">
        {withCode(statusOf(trace, view.k, data.branchStatus))}
      </p>
      <RegisterStateLabel trace={trace} view={view} />
      <div className="al-registers" role="group" aria-label={S.stepper.registers}>
        {data.registers.map((n) => (
          <RegisterRow
            key={n}
            name={`w${n}`}
            value={wValue(view.state, n)}
            changed={view.written.has(n)}
          />
        ))}
      </div>
      <FlagsRow
        flags={view.state.flags}
        before={view.k > 0 ? viewAt(trace, view.k - 1).state.flags : null}
      />
      {data.panel && <StepPanel panel={data.panel} trace={trace} k={view.k} />}
    </div>
  );
});
