// Copyright © 2026 Christopher Snow

// The programs lesson 2 of Module 4 shows or runs. `describe` is a compiler listing, copied from
// docs/notes/module-4/listings.md (ARM64 GCC 16.1.0, -O1, fetched from Compiler Explorer on 16
// October 2026); branches.facts.test.ts holds the copy to that file. The others are assembly the
// lesson wrote itself: `describe` with `bge` for `bgt` (the failure experiment), the course's own
// `service`, and the challenge's starting point and references. The same test holds each to the
// differential test's corpus, which runs it under QEMU.
//
// The recorded file puts `describe` on lines 14 to 21 after a copyright line, an `#include` and
// five one-line functions. The lesson shows only `describe`'s own lines as the C, so the line GCC
// records for each instruction is the recorded one less 13.

/** `describe`: the C as recorded, lines 14 to 21 of the file. */
const DESCRIBE_C = [
  "int describe(int gradient)",
  "{",
  "    if (gradient > 10)",
  "        return 2;",
  "    if (gradient < -10)",
  "        return -2;",
  "    return 0;",
  "}",
].join("\n");

const describeListing = (branch: string) =>
  [
    "describe:",
    "  cmp w0, 10 C3",
    `  ${branch} .L9 C3`,
    "  cmn w0, #10 C7",
    "  mov w0, -2 C7",
    "  csel w0, w0, wzr, lt C7",
    ".L7:",
    "  ret C8",
    ".L9:",
    "  mov w0, 2 C4",
    "  b .L7 C4",
  ].join("\n");

/** `describe`, as GCC 16.1 at `-O1` made it. */
export const DESCRIBE = {
  c: DESCRIBE_C,
  listing: describeListing("bgt"),
  sourceLines: [[3], [3], [5], [6], [5, 6, 7], [4, 6, 7], [4], [4]],
} as const;

/** `describe` with `bgt .L9` changed to `bge .L9`: the failure experiment. */
export const DESCRIBE_BGE = {
  c: DESCRIBE_C,
  listing: describeListing("bge"),
  sourceLines: DESCRIBE.sourceLines,
} as const;

/** The gradients the lesson's sentences run, offered as buttons in the figure of arrows. */
export const TOLD_GRADIENTS = [15, 10, -15, 0] as const;

/** The construction challenge starts from a function that returns 0 whatever it is given. */
export const FUEL_WARNING_STARTING_TEXT = ["mov w0, 0", "ret"].join("\n");

/** The reference: ask whether `litres` is 0 first, then whether it is below `reserve`. */
export const FUEL_WARNING_TEXT = [
  "cbz w0, .Lempty",
  "cmp w0, w1",
  "b.cc .Llow",
  "mov w0, 0",
  "ret",
  ".Llow:",
  "mov w0, 1",
  "ret",
  ".Lempty:",
  "mov w0, 2",
  "ret",
].join("\n");

/** A second answer that passes: `b.cs` and two `b` instructions to one `ret`. */
export const FUEL_WARNING_SHARED_RET_TEXT = [
  "cbz w0, .Lempty",
  "cmp w0, w1",
  "b.cs .Lok",
  "mov w0, 1",
  "b .Ldone",
  ".Lok:",
  "mov w0, 0",
  "b .Ldone",
  ".Lempty:",
  "mov w0, 2",
  ".Ldone:",
  "ret",
].join("\n");

/** The course's own example of `tbz`, which is not GCC's output. */
export const SERVICE = {
  c: "",
  listing: [
    "service:",
    "  tbz w0, 1, .Lno",
    "  mov w0, 1",
    "  ret",
    ".Lno:",
    "  mov w0, 0",
    "  ret",
  ].join("\n"),
} as const;
