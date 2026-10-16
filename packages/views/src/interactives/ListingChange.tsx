// Copyright © 2026 Christopher Snow

// A prediction about how one listing changes into another: the instructions of the first are shown,
// with what both functions return, and the learner says what the compiler changed to make the
// second. Nothing is asked of the model before the commit. Then the model assembles both listings,
// compares the instructions and says what differs; the right option is that, never the lesson's
// words. The second listing is not shown here; the figure that follows draws both.

import { useCallback } from "react";
import { z } from "zod";

import { changeBetween } from "../branch";
import { cLinesOf, parseListing } from "../listing";
import { ListingView } from "../parts";
import { BRANCH_STRINGS as B } from "../strings.branch";
import { PredictionBox, type Outcome } from "./PredictionBox";
import { RunSchema, RunsList } from "./RunsList";
import { RecordedSchema, withProps } from "./props";

const Props = z.object({
  /** Markdown: the question. */
  question: z.string(),
  /**
   * The options. The right option's value is `<name>:<how>` for the one instruction that differs
   * (`csel:last` when only its last item differs, `cmp:operands` when more of its items differ,
   * `cmp:instruction` when it is another instruction), `several` or `none`.
   */
  options: z.array(z.object({ value: z.string(), label: z.string() })).min(2),
  /** Markdown, shown once the prediction is checked. */
  explain: z.string().default(""),
  /** What is shown: the C of both functions, and the instructions of the first. */
  program: RecordedSchema,
  /** The listing the model compares it with: the second function's. Not shown here. */
  changed: RecordedSchema,
  /** The calls whose results are shown. */
  runs: z.array(RunSchema).default([]),
});

export const ListingChange = withProps(Props, function ListingChange({ data, interactive, store }) {
  const measure = useCallback((): Outcome => {
    const change = changeBetween(data.program, data.changed);
    switch (change.value) {
      case "none":
        return { value: "none", said: B.change.said.none };
      case "several":
        return { value: "several", said: B.change.said.several };
      default: {
        if (!("mnemonic" in change)) return { value: change.value, said: B.change.said.several };
        return { value: change.value, said: B.change.said[change.how](change.mnemonic) };
      }
    }
  }, [data.program, data.changed]);
  return (
    <div className="al-figure al-change" data-figure="listing-change">
      <ListingView cLines={cLinesOf(data.program.c)} lines={parseListing(data.program.listing)} />
      {data.runs.length > 0 && <RunsList runs={data.runs} />}
      <PredictionBox
        id={interactive.id}
        store={store}
        question={data.question}
        options={data.options}
        explain={data.explain}
        measure={measure}
        kind="listing-change-prediction"
      />
    </div>
  );
});
