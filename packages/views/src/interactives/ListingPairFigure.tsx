// Copyright © 2026 Christopher Snow

// Two recorded functions side by side: the C of each and the instructions GCC made from it, with
// every instruction that differs from the instruction in the same place in the other listing
// marked. Static: it draws the recorded listings and runs nothing.

import { z } from "zod";

import { cLinesOf, programLines, type ListingLine } from "../listing";
import { ListingView } from "../parts";
import { RecordedSchema, withProps } from "./props";

const Side = z.object({ title: z.string(), program: RecordedSchema });
const Props = z.object({ sides: z.tuple([Side, Side]), alignCommon: z.boolean().default(false) });

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
  const [left, right] = data.sides;
  const parsed = [left, right].map((s) => programLines(s.program));
  const texts = parsed.map(instructionsOf);
  const matched = commonInstructions(texts[0] ?? [], texts[1] ?? []);
  return (
    <div className="al-figure al-pair" data-figure="listing-pair">
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
    </div>
  );
});
