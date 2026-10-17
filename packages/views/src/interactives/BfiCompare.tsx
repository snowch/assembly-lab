// Copyright © 2026 Christopher Snow

// The learner's own instructions and the compiler's one, run on the same call, once the challenge
// has been passed. The compiler's function is the recorded GCC listing, shown with its C; both are
// run on the model and each answer is drawn as the low byte of what w0 holds at the return. The
// sentence under them says whether they agree, from the two runs.

import { useMemo } from "react";
import { z } from "zod";

import { Prose, useStored } from "@platform/lesson-runtime";

import { BitCells, callText, hex, range, unsignedOf } from "../bits";
import { challengeOf, passedChallenge, ranText } from "../challengeState";
import { cLinesOf, parseListing } from "../listing";
import { ListingView, withCode } from "../parts";
import { VIEW_STRINGS as S } from "../strings";
import { traceOf, wValue } from "../trace";
import { traceText } from "../traceText";
import { CallSchema, RecordedSchema, withProps } from "./props";
import { withoutComments } from "./SolutionStepper";

const Props = z.object({
  /** The id of the written challenge: the figure opens once the learner's saved work passes it. */
  afterChallenge: z.string(),
  /** Markdown shown once it is open. */
  note: z.string(),
  /** The recorded compiler function. */
  gcc: RecordedSchema,
  call: CallSchema,
  /** The field the function writes: its bits are underlined. */
  field: z.object({ from: z.number().int().min(0).max(31), to: z.number().int().min(0).max(31) }),
});

const text = (v: number) => `${hex(v)} (${unsignedOf(v)})`;

export const BfiCompare = withProps(Props, function BfiCompare({ data, store, lesson }) {
  const stored = useStored(store);
  const open = passedChallenge(lesson, stored, data.afterChallenge);
  const saved = ranText(stored, data.afterChallenge);
  const challenge = challengeOf(lesson, data.afterChallenge);
  const allowed = useMemo(
    () => (challenge ? new Set(challenge.allowedConstructs) : undefined),
    [challenge],
  );
  const theirs = useMemo(() => traceOf(data.gcc, data.call), [data.gcc, data.call]);
  const mine = useMemo(() => {
    if (!open || saved === null) return null;
    try {
      return traceText(withoutComments(saved), data.call.args, allowed);
    } catch {
      return null;
    }
  }, [open, saved, data.call, allowed]);
  if (!open) {
    return (
      <p role="note" className="al-locked">
        {S.bfi.locked}
      </p>
    );
  }
  if (mine === null) {
    return (
      <p role="note" className="al-locked">
        {S.solution.noRun}
      </p>
    );
  }
  const yours = wValue(mine.result.final, 0);
  const gccs = wValue(theirs.result.final, 0);
  const call = callText(data.call.entry, data.call.args);
  const field = range(data.field.from, data.field.to);
  return (
    <div className="al-figure al-bficompare" data-figure="bfi-compare">
      <Prose markdown={data.note} />
      <ListingView cLines={cLinesOf(data.gcc.c)} lines={parseListing(data.gcc.listing)} showC />
      <div className="al-cellrows">
        <BitCells
          row="yours"
          name={S.bfi.yours}
          value={yours}
          text={text(yours)}
          marks={{ field }}
          numbers
        />
        <BitCells row="gcc" name={S.bfi.gcc} value={gccs} text={text(gccs)} marks={{ field }} />
      </div>
      <p className="al-status" role="status">
        {withCode(S.bfi.result(call, hex(yours), hex(gccs), yours === gccs))}
      </p>
    </div>
  );
});
