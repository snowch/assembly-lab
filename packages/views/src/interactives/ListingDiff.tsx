// Copyright © 2026 Christopher Snow

import { useHandoffState } from "../update-handoff";

// Two listings side by side, instruction by instruction, with each item that differs marked. The
// course's assembler turns each listing into instructions and the figure compares those, so the
// mark is what the model found, not a claim in the lesson's words. The figure stays shut until the
// prediction it names has been checked, because it draws the second listing. With a `panel`, it also
// runs the function the learner chooses on the call the panel names and draws the three stages
// (compare, condition, select) of that run.

import { Fragment, useMemo } from "react";
import { z } from "zod";

import { useSlot } from "@platform/lesson-runtime";

import { diffRows, differingItems, type DiffRow } from "../branch";
import { parseListing } from "../listing";
import { SelectPanel } from "../panels";
import { VIEW_STRINGS as S } from "../strings";
import { BRANCH_STRINGS as B } from "../strings.branch";
import { traceOf } from "../trace";
import { RecordedSchema, withProps } from "./props";

const Props = z.object({
  left: RecordedSchema,
  right: RecordedSchema,
  /** The id of a prediction in this lesson. The figure stays shut until it has been checked. */
  after: z.string().optional(),
  /**
   * Run either function on `args` (`w0`, `w1` and on) and draw its compare, condition and select. The
   * learner chooses which. `names` are what the C calls the arguments.
   */
  panel: z
    .object({
      args: z.array(z.number().int()).min(1),
      names: z.array(z.string()).default(["a", "b"]),
    })
    .optional(),
});

type Recorded = z.infer<typeof RecordedSchema>;

/** The function's name: the label that opens a listing. */
const nameOf = (recorded: Recorded): string => {
  const first = parseListing(recorded.listing)[0];
  return first?.kind === "label" ? first.text : "";
};

/** An instruction's items as `name a, b, c`, each differing item marked. */
function Items({ items, differing }: { items: readonly string[]; differing: ReadonlySet<number> }) {
  return (
    <code className="al-diff-code">
      {items.map((item, k) => (
        <Fragment key={k}>
          {k === 1 ? " " : k > 1 ? ", " : ""}
          {differing.has(k) ? (
            <mark className="al-diff-item">
              {item}
              <span className="visually-hidden"> ({B.diff.mark})</span>
            </mark>
          ) : (
            <span>{item}</span>
          )}
        </Fragment>
      ))}
    </code>
  );
}

export const ListingDiff = withProps(Props, function ListingDiff({ data, store }) {
  const [prediction] = useSlot<{ choice: string }>(store, data.after ?? "");
  const rows: DiffRow[] = useMemo(() => diffRows(data.left, data.right), [data.left, data.right]);
  const [which, setWhich] = useHandoffState("ListingDiff.which", 0);
  const names = [nameOf(data.left), nameOf(data.right)];
  // Each function is run on the panel's call, whichever the learner looks at.
  const traces = useMemo(
    () =>
      data.panel
        ? [data.left, data.right].map((p) =>
            traceOf(p, { entry: nameOf(p), args: data.panel?.args ?? [] }),
          )
        : [],
    [data.left, data.right, data.panel],
  );
  if (data.after !== undefined && prediction === undefined) {
    return (
      <p role="note" className="al-locked">
        {S.stepper.locked}
      </p>
    );
  }
  const chosen = traces[which];
  return (
    <div className="al-figure al-diff" data-figure="listing-diff">
      <ol className="al-compare-rows" aria-label={B.diff.table}>
        {rows.map((r, i) => (
          <li key={i} className="al-compare-row al-diff-row" data-differs={r.differing.size > 0}>
            <span className="al-cmp-n">{i + 1}</span>
            <span className="al-cmp-side" data-side="left">
              <span className="al-cmp-name">{names[0]}</span>
              <Items items={r.left} differing={r.differing} />
            </span>
            <span className="al-cmp-side" data-side="right">
              <span className="al-cmp-name">{names[1]}</span>
              <Items items={r.right} differing={r.differing} />
            </span>
          </li>
        ))}
      </ol>
      <p role="status" className="al-compare-summary">
        {B.diff.summary(differingItems(rows))}
      </p>
      {data.panel && chosen && (
        <div className="al-diff-panel">
          <div className="al-diff-choose" role="group" aria-label={B.select.choose}>
            {names.map((name, i) => (
              <button
                key={name}
                type="button"
                className="button secondary"
                aria-pressed={which === i}
                onClick={() => setWhich(i)}
              >
                <code>{name}</code>
              </button>
            ))}
          </div>
          <SelectPanel trace={chosen} names={data.panel.names} k={Number.POSITIVE_INFINITY} />
        </div>
      )}
    </div>
  );
});
