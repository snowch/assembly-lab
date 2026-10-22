// Copyright © 2026 Christopher Snow

// A C function beside the instructions GCC made from it, each instruction showing the C line GCC
// recorded for it. Static: it draws the recorded listing and runs nothing. A lesson may hang
// closed notes under it (`notes`): each is a `details` the learner opens, with the summary as its
// control and Markdown for its body.

import { z } from "zod";

import { Prose, useStored } from "@platform/lesson-runtime";

import { passedChallenge } from "./gate";
import { ARITH_STRINGS } from "../strings.arith";
import { cLinesOf, programLines } from "../listing";
import { ListingView } from "../parts";
import { RecordedSchema, withProps } from "./props";

const Props = z.object({
  program: RecordedSchema,
  /** Opt in for the introductory example or a lesson about compiler/source mismatches. */
  showCompilerLines: z.boolean().default(false),
  afterChallenge: z.string().optional(),
  /** Closed notes under the listing: the words on the control, and Markdown for what opens. */
  notes: z.array(z.object({ summary: z.string().min(1), body: z.string().min(1) })).default([]),
});

export const ListingFigure = withProps(Props, function ListingFigure({ data, lesson, store }) {
  const stored = useStored(store);
  if (data.afterChallenge && !passedChallenge(lesson, stored, data.afterChallenge))
    return (
      <p role="note" className="al-locked">
        {ARITH_STRINGS.adder.lockedUntilPassed}
      </p>
    );
  return (
    <div className="al-figure" data-figure="listing">
      <ListingView
        cLines={cLinesOf(data.program.c)}
        lines={programLines(data.program)}
        showCompilerLines={data.showCompilerLines}
      />
      {data.notes.length > 0 && (
        <div className="al-notes">
          {data.notes.map((note) => (
            <details className="lesson-details" key={note.summary}>
              <summary>{note.summary}</summary>
              <Prose markdown={note.body} />
            </details>
          ))}
        </div>
      )}
    </div>
  );
});
