// Copyright © 2026 Christopher Snow

// A C function beside the instructions GCC made from it, and under them what one or more functions
// return for a call, each worked out by running the function on the model. The listing shown and the
// functions run need not be the same: Lesson 1 opens by showing the C of both `steeper_s` and
// `steeper_u`, the instructions of `steeper_s` alone, and what each returns for the same two patterns.

import { z } from "zod";

import { cLinesOf, programLines } from "../listing";
import { ListingView } from "../parts";
import { RunSchema, RunsList } from "./RunsList";
import { RecordedSchema, withProps } from "./props";

const Props = z.object({
  /** What is drawn: the C, and the instructions of the functions the figure shows. */
  program: RecordedSchema,
  /** The calls that are run, and shown with what they return. */
  runs: z.array(RunSchema).min(1),
});

export const ListingRuns = withProps(Props, function ListingRuns({ data }) {
  return (
    <div className="al-figure" data-figure="listing-runs">
      <ListingView cLines={cLinesOf(data.program.c)} lines={programLines(data.program)} />
      <RunsList runs={data.runs} />
    </div>
  );
});
