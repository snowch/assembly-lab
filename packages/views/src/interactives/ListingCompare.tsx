// Copyright © 2026 Christopher Snow

// Two C functions and the instructions GCC made from them, compared line by line. The C of both is
// there from the start. Their listings, and the page's comparison of them, wait for the learner's
// prediction: the course's assembler turns each listing into instructions, and a line is marked
// the same when the two assembled instructions are the same, so the mark is what the model found,
// not a claim in the lesson's words.

import { useCallback, useMemo } from "react";
import { z } from "zod";

import { assemble, type Instruction } from "@al/machine";
import { useSlot } from "@platform/lesson-runtime";

import { assemblyOf, cLinesOf, parseListing } from "../listing";
import { VIEW_STRINGS as S } from "../strings";
import { PredictionBox, type Outcome } from "./PredictionBox";
import { RecordedSchema, withProps } from "./props";

const Props = z.object({
  left: RecordedSchema,
  right: RecordedSchema,
  /** Markdown: the question. */
  question: z.string(),
  options: z.array(z.object({ value: z.string(), label: z.string() })).min(2),
  /** Markdown, shown once the prediction is checked. */
  explain: z.string().default(""),
});

type Recorded = z.infer<typeof RecordedSchema>;

/** The assembled instructions of a listing, with the text each was written as. */
function instructionsOf(recorded: Recorded): Instruction[] {
  const { program, errors } = assemble(assemblyOf(parseListing(recorded.listing)));
  if (program === null) throw new Error(`The listing does not assemble: ${errors[0]?.key ?? ""}`);
  return program.instructions;
}

/** What an instruction does, as a string: two instructions with the same string do the same. */
const doing = (i: Instruction | undefined): string =>
  i === undefined ? "" : JSON.stringify(i.op, (_key, v) => (typeof v === "bigint" ? `${v}n` : v));

/** The label that opens a listing: the function's name. */
const nameOf = (recorded: Recorded): string => {
  const first = parseListing(recorded.listing)[0];
  return first?.kind === "label" ? first.text : "";
};

export interface Row {
  readonly left: string;
  readonly right: string;
  readonly same: boolean;
}

/** The two listings paired line by line, each pair marked by whether the model gives it one result. */
export function compareListings(left: Recorded, right: Recorded): Row[] {
  const a = instructionsOf(left);
  const b = instructionsOf(right);
  return Array.from({ length: Math.max(a.length, b.length) }, (_, i) => ({
    left: a[i]?.text ?? "",
    right: b[i]?.text ?? "",
    same: a[i] !== undefined && b[i] !== undefined && doing(a[i]) === doing(b[i]),
  }));
}

function CPane({ recorded }: { recorded: Recorded }) {
  const name = nameOf(recorded);
  return (
    <div className="al-pane al-c" role="group" aria-label={S.compare.cPane(name)}>
      <div className="al-pane-head">{name}</div>
      {cLinesOf(recorded.c).map((text, i) => (
        <div className="al-cline" key={i}>
          <span className="al-ln">{i + 1}</span>
          <code className="al-src">{text}</code>
        </div>
      ))}
    </div>
  );
}

export const ListingCompare = withProps(
  Props,
  function ListingCompare({ data, interactive, store }) {
    const [committed] = useSlot<{ choice: string }>(store, interactive.id);
    const rows = useMemo(
      () => (committed ? compareListings(data.left, data.right) : []),
      [committed, data.left, data.right],
    );
    const measure = useCallback((): Outcome => {
      const all = compareListings(data.left, data.right);
      const same = all.length > 0 && all.every((r) => r.same);
      return {
        value: same ? "same" : "different",
        said: same ? S.compare.resultSame : S.compare.resultDiffer,
      };
    }, [data.left, data.right]);
    const names = [nameOf(data.left), nameOf(data.right)];
    return (
      <div className="al-figure al-compare" data-figure="listing-compare">
        <div className="al-compare-c">
          <CPane recorded={data.left} />
          <CPane recorded={data.right} />
        </div>
        <PredictionBox
          id={interactive.id}
          store={store}
          question={data.question}
          options={data.options}
          explain={data.explain}
          measure={measure}
          kind="listing-compare-prediction"
        />
        {committed && (
          <div className="al-compare-result">
            <ol className="al-compare-rows" aria-label={S.compare.table}>
              {rows.map((r, i) => (
                <li key={i} className="al-compare-row" data-same={r.same}>
                  <span className="al-cmp-n">{i + 1}</span>
                  <span className="al-cmp-side" data-side="left">
                    <span className="al-cmp-name">{names[0]}</span>
                    <code>{r.left}</code>
                  </span>
                  <span className="al-cmp-side" data-side="right">
                    <span className="al-cmp-name">{names[1]}</span>
                    <code>{r.right}</code>
                  </span>
                  <span className="al-cmp-mark">{r.same ? S.compare.same : S.compare.differs}</span>
                </li>
              ))}
            </ol>
            <p role="status" className="al-compare-summary">
              {rows.every((r) => r.same) ? S.compare.allSame(rows.length) : S.compare.notAllSame}
            </p>
          </div>
        )}
      </div>
    );
  },
);
