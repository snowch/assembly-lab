// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";

import { deleteLine, parseListing } from "./listing";
import { sourceLayout } from "./source-layout";

describe("checked source layout", () => {
  it("shows the full C once and preserves every assembly line in order", () => {
    const lines = parseListing("trip:\nadd w0, w0, w1 C3\nsub w0, w0, w2 C7\nret C7", [
      [3],
      [4],
      [5],
    ]);
    const layout = sourceLayout(lines, 6);
    expect(layout.inlineSource).toBe(true);
    expect(layout.rows.flatMap((row) => row.sourceLines)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(layout.rows.flatMap((row) => row.listingIndexes)).toEqual([0, 1, 2, 3]);
    expect(layout.rows[0]).toEqual({ sourceLines: [1, 2], listingIndexes: [0] });
    expect(layout.rows.find((row) => row.listingIndexes.includes(2))?.sourceLines).toEqual([4]);
  });

  it("keeps several instructions with their operation without crossing a label", () => {
    const lines = parseListing("f:\nmov w0, #1 C3\nadd w0, w0, #2 C3\n.L1:\nret C3", [
      [3],
      [3],
      [3],
    ]);
    const layout = sourceLayout(lines, 4);
    expect(layout.inlineSource).toBe(false);
    expect(layout.rows.map((row) => row.listingIndexes)).toEqual([[0], [1, 2], [3], [4]]);
  });

  it.each([
    { associations: [[4], [3]], reason: "reordered operations" },
    { associations: [[3], [4], [3]], reason: "revisited operations" },
    { associations: [[3, 5]], reason: "nonadjacent source lines" },
    { associations: [[], [3]], reason: "support instructions without a direct source operation" },
  ])("uses excerpts for $reason without inventing associations", ({ associations }) => {
    const lines = parseListing(
      associations.map(() => "add w0, w0, w1 C7").join("\n"),
      associations,
    );
    const layout = sourceLayout(lines, 7);
    expect(layout.inlineSource).toBe(false);
    expect(layout.rows.map((row) => row.sourceLines)).toEqual(associations);
    expect(layout.rows.flatMap((row) => row.listingIndexes)).toEqual(associations.map((_, i) => i));
  });

  it("does not move a previous function's source into the next function when ret is deleted", () => {
    const original = parseListing(
      "trip:\nadd w0, w0, w1 C3\nret C5\nfuel:\nsub w0, w0, w1 C9\nret C9",
      [[3], [4], [8], [8]],
    );
    for (const lines of [original, deleteLine(original, { label: "trip", text: "ret" })]) {
      const layout = sourceLayout(lines, 9);
      expect(layout.inlineSource).toBe(false);
      const fuelIndex = lines.findIndex((line) => line.kind === "label" && line.text === "fuel");
      expect(
        layout.rows.find((row) => row.listingIndexes.includes(fuelIndex))?.sourceLines,
      ).toEqual([]);
      expect(
        layout.rows
          .filter((row) => row.listingIndexes.some((index) => index > fuelIndex))
          .flatMap((row) => row.sourceLines),
      ).toEqual([8]);
    }
  });

  it("keeps a consecutive multi-line operation together", () => {
    const lines = parseListing("add w0, w0, w1 C5\nret C7", [[3, 4], [6]]);
    const layout = sourceLayout(lines, 7);
    expect(layout.inlineSource).toBe(true);
    expect(layout.rows.find((row) => row.listingIndexes.includes(0))?.sourceLines).toEqual([3, 4]);
    expect(layout.rows.flatMap((row) => row.sourceLines)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });
});
