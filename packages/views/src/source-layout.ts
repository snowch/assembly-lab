// Copyright © 2026 Christopher Snow

import type { ListingLine } from "./listing";

/** A source excerpt and the original listing indexes that serve it. Labels occupy their own row. */
export interface SourceRow {
  readonly sourceLines: readonly number[];
  readonly listingIndexes: readonly number[];
}

export interface SourceLayout {
  /** Ordered, non-overlapping source spans let the complete C appear once in the paired rows. */
  readonly inlineSource: boolean;
  readonly rows: readonly SourceRow[];
}

const sameLines = (a: readonly number[], b: readonly number[]) =>
  a.length === b.length && a.every((line, i) => line === b[i]);

/** Keep assembly order and label boundaries; never infer a source association from a GCC tag. */
export function sourceLayout(lines: readonly ListingLine[], sourceLength: number): SourceLayout {
  const groups: SourceRow[] = [];
  for (const [index, line] of lines.entries()) {
    const sourceLines = line.kind === "instruction" ? (line.sourceLines ?? []) : [];
    const previous = groups.at(-1);
    const previousIndex = previous?.listingIndexes.at(-1);
    if (
      line.kind === "instruction" &&
      previous !== undefined &&
      previousIndex !== undefined &&
      lines[previousIndex]?.kind === "instruction" &&
      sameLines(previous.sourceLines, sourceLines)
    ) {
      groups[groups.length - 1] = {
        sourceLines,
        listingIndexes: [...previous.listingIndexes, index],
      };
    } else {
      groups.push({ sourceLines, listingIndexes: [index] });
    }
  }

  // Without parsing C, source gaps around a second label cannot safely be assigned to either
  // function or block. Keep complete C separate rather than putting a previous function's
  // return/closing brace under the following label (especially after deleting an instruction).
  const singleLabel = lines.filter((line) => line.kind === "label").length <= 1;
  let previousEnd = 0;
  const inlineSource =
    singleLabel &&
    groups.every((group) => {
      if (lines[group.listingIndexes[0] ?? -1]?.kind === "label") return true;
      const first = group.sourceLines[0];
      const last = group.sourceLines.at(-1);
      if (
        first === undefined ||
        last === undefined ||
        first <= previousEnd ||
        last > sourceLength ||
        !group.sourceLines.every((line, i) => line === first + i)
      )
        return false;
      previousEnd = last;
      return true;
    });
  if (!inlineSource) return { inlineSource, rows: groups };

  const rows: SourceRow[] = [];
  let cursor = 1;
  for (const group of groups) {
    const first = group.sourceLines[0];
    if (first !== undefined && first > cursor) {
      const filler = Array.from({ length: first - cursor }, (_, i) => cursor + i);
      const previous = rows.at(-1);
      if (previous !== undefined && lines[previous.listingIndexes[0] ?? -1]?.kind === "label") {
        rows[rows.length - 1] = { ...previous, sourceLines: filler };
      } else {
        rows.push({ sourceLines: filler, listingIndexes: [] });
      }
    }
    rows.push(group);
    const last = group.sourceLines.at(-1);
    if (last !== undefined) cursor = last + 1;
  }
  if (cursor <= sourceLength)
    rows.push({
      sourceLines: Array.from({ length: sourceLength - cursor + 1 }, (_, i) => cursor + i),
      listingIndexes: [],
    });
  return { inlineSource, rows };
}
