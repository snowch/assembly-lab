// Copyright © 2026 Christopher Snow

// The front page's program: the function the cover steps. It is in no lesson, and it uses only
// additions, so the cover gives away no prediction or challenge (Module 0's review, finding 23).
// Copied from docs/notes/front-page/cover.md (ARM64 GCC 16.1.0, -O1, fetched from Compiler
// Explorer on 16 October 2026). As in the lessons, the C is shown without the recorded file's first
// line (its copyright comment), so every C line number here is the recorded one minus one;
// cover.test.ts holds this copy to the recorded file and runs the call.

/** `fuel_on_board`: two additions. */
export const COVER_PROGRAM = {
  c: [
    "int fuel_on_board(int tank, int reserve, int can)",
    "{",
    "    int litres = tank + reserve;",
    "    return litres + can;",
    "}",
  ].join("\n"),
  listing: ["fuel_on_board:", "  add w0, w0, w1 C3", "  add w0, w0, w2 C5", "  ret C5"].join("\n"),
} as const;

/** The call the cover steps: `w0` is 38, then 44, then 54. */
export const COVER_CALL = { entry: "fuel_on_board", args: [38, 6, 10] } as const;
