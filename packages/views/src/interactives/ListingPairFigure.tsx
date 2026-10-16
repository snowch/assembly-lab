// Copyright © 2026 Christopher Snow

// Two recorded functions side by side: the C of each and the instructions GCC made from it, with
// every instruction that differs from the instruction in the same place in the other listing
// marked. Static: it draws the recorded listings and runs nothing.

import { z } from "zod";

import { parseListing, type ListingLine } from "../listing";
import { VIEW_STRINGS as S } from "../strings";
import { RecordedSchema, withProps } from "./props";

const Side = z.object({ title: z.string(), program: RecordedSchema });
const Props = z.object({ sides: z.tuple([Side, Side]) });

const instructionsOf = (lines: readonly ListingLine[]): string[] =>
  lines.flatMap((l) => (l.kind === "instruction" ? [l.text] : []));

export const ListingPairFigure = withProps(Props, function ListingPairFigure({ data }) {
  const [left, right] = data.sides;
  const parsed = [left, right].map((s) => parseListing(s.program.listing));
  const texts = parsed.map(instructionsOf);
  return (
    <div className="al-figure al-pair" data-figure="listing-pair">
      <div className="al-pair-sides">
        {[left, right].map((side, s) => {
          const other = texts[1 - s] ?? [];
          let n = 0;
          return (
            <div className="al-pane al-pair-side" key={side.title} data-side={side.title}>
              <div className="al-pane-head">
                <span>{side.title}</span>
              </div>
              <div className="al-pair-c">
                <code>{side.program.c}</code>
              </div>
              {(parsed[s] ?? []).map((line, i) => {
                if (line.kind === "label")
                  return (
                    <div className="al-label" key={i}>
                      {line.text}:
                    </div>
                  );
                const differs = line.text !== other[n];
                n += 1;
                return (
                  <div className="al-insn al-pair-insn" key={i} data-differs={differs}>
                    <span className="al-mark" aria-hidden="true" />
                    <code className="al-text">{line.text}</code>
                    {differs && <span className="visually-hidden">{S.pair.differs}</span>}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
});
