// Copyright © 2026 Christopher Snow

// Two recorded functions side by side: the C of each and the instructions GCC made from it, with
// every instruction that differs from the instruction in the same place in the other listing
// marked. Static: it draws the recorded listings and runs nothing.

import { useRef } from "react";
import { z } from "zod";

import { cLinesOf, programLines, type ListingLine } from "../listing";
import { ListingView } from "../parts";
import { COMPARISON_STRINGS as C } from "../strings.comparison";
import { RecordedSchema, withProps } from "./props";

const Side = z.object({ title: z.string(), program: RecordedSchema });
const Props = z.object({
  sides: z.tuple([Side, Side]),
  alignCommon: z.boolean().default(false),
  referenceTitle: z.string().optional(),
});

const instructionsOf = (lines: readonly ListingLine[]): string[] =>
  lines.flatMap((l) => (l.kind === "instruction" ? [l.text] : []));

/** Match unchanged instruction text in order, allowing inserted or removed instructions. */
export function commonInstructions(
  left: readonly string[],
  right: readonly string[],
): [Set<number>, Set<number>] {
  const lengths = Array.from({ length: left.length + 1 }, () => new Uint32Array(right.length + 1));
  for (let i = left.length - 1; i >= 0; i--)
    for (let j = right.length - 1; j >= 0; j--)
      lengths[i]![j] =
        left[i] === right[j]
          ? 1 + lengths[i + 1]![j + 1]!
          : Math.max(lengths[i + 1]![j]!, lengths[i]![j + 1]!);
  const matched: [Set<number>, Set<number>] = [new Set(), new Set()];
  let i = 0,
    j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] === right[j]) {
      matched[0].add(i++);
      matched[1].add(j++);
    } else if (lengths[i + 1]![j]! >= lengths[i]![j + 1]!) i++;
    else j++;
  }
  return matched;
}

export const ListingPairFigure = withProps(Props, function ListingPairFigure({ data }) {
  const pairRef = useRef<HTMLDivElement>(null);
  const reveal = (pane: "al-c" | "al-asm") => {
    pairRef.current?.querySelectorAll<HTMLElement>(".al-listing").forEach((listing) => {
      const target = listing.querySelector<HTMLElement>(`.${pane}`);
      if (target)
        listing.scrollLeft +=
          target.getBoundingClientRect().left - listing.getBoundingClientRect().left;
    });
  };
  const [left, right] = data.sides;
  const parsed = [left, right].map((s) => programLines(s.program));
  const texts = parsed.map(instructionsOf);
  const matched = commonInstructions(texts[0] ?? [], texts[1] ?? []);
  const content = (
    <>
      <div className="al-controls" role="group" aria-label={C.navigation}>
        <button type="button" className="button secondary" onClick={() => reveal("al-asm")}>
          {C.instructions}
        </button>
        <button type="button" className="button secondary" onClick={() => reveal("al-c")}>
          {C.source}
        </button>
      </div>
      <div className="al-pair-sides">
        {[left, right].map((side, s) => {
          const other = texts[1 - s] ?? [];
          let n = 0;
          const lines = parsed[s] ?? [];
          const differences = new Set<number>();
          lines.forEach((line, i) => {
            if (line.kind !== "instruction") return;
            if (data.alignCommon ? !matched[s]!.has(n) : line.text !== other[n]) differences.add(i);
            n += 1;
          });
          return (
            <div className="al-pane al-pair-side" key={side.title} data-side={side.title}>
              <div className="al-pane-head">
                <span>{side.title}</span>
              </div>
              <ListingView
                cLines={cLinesOf(side.program.c)}
                lines={lines}
                differences={differences}
              />
            </div>
          );
        })}
      </div>
    </>
  );
  return (
    <div ref={pairRef} className="al-figure al-pair" data-figure="listing-pair">
      {data.referenceTitle ? (
        <details className="al-recorded-reference">
          <summary>{data.referenceTitle}</summary>
          {content}
        </details>
      ) : (
        content
      )}
    </div>
  );
});
