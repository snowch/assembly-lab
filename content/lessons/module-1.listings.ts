// Copyright © 2026 Christopher Snow

// The compiler listings Module 1 shows, copied from docs/notes/module-1/listings.md (ARM64 GCC
// 16.1.0, -O1, fetched from Compiler Explorer on 16 October 2026), and the two short programs that
// no compiler made. The recorded file holds nine one-line functions, each recorded against its own
// line of C: a figure shows the functions it needs, so the C it shows starts at its first function
// and every C line number here is the recorded one minus the number of recorded lines before that
// first function (the copyright line, and any function a figure leaves out).
// module-1.listings.test.ts holds this copy to the recorded file. The white space of a recorded
// line is not kept.

/**
 * The C and the listing of `service_interval` alone: recorded line 2. The Question shows this and
 * not `odometer_limit`, whose two instructions are the answer to the first challenge.
 */
export const SERVICE_INTERVAL = {
  c: "int service_interval(void) { return 30000; }",
  listing: ["service_interval:", "  mov w0, 30000 C1", "  ret C1"].join("\n"),
} as const;

/** The C and the listing of `service_interval` and `odometer_limit`: recorded lines 2 and 3. */
export const SERVICE_AND_ODOMETER = {
  c: [
    "int service_interval(void) { return 30000; }",
    "int odometer_limit(void) { return 1000000; }",
  ].join("\n"),
  listing: [
    "service_interval:",
    "  mov w0, 30000 C1",
    "  ret C1",
    "odometer_limit:",
    "  mov w0, 16960 C2",
    "  movk w0, 0xf, lsl 16 C2",
    "  ret C2",
  ].join("\n"),
} as const;

/** `fuel_used_wrong`, which returns `int`: recorded line 9. */
export const FUEL_USED_WRONG = {
  c: "int fuel_used_wrong(int at_start, int at_end) { return at_end - at_start; }",
  listing: ["fuel_used_wrong:", "  sub w0, w1, w0 C1", "  ret C1"].join("\n"),
} as const;

/** `fuel_used_wrong_u`, the same C with `unsigned`: recorded line 10. */
export const FUEL_USED_WRONG_U = {
  c: "unsigned fuel_used_wrong_u(unsigned at_start, unsigned at_end) { return at_end - at_start; }",
  listing: ["fuel_used_wrong_u:", "  sub w0, w1, w0 C1", "  ret C1"].join("\n"),
} as const;

/** `fuel_used_wrong` with `add w0, w0, 12` before its `ret`: the instruction no compiler made has no C line. */
export const FUEL_USED_WRONG_PLUS_12 = {
  c: FUEL_USED_WRONG.c,
  listing: ["fuel_used_wrong:", "  sub w0, w1, w0 C1", "  add w0, w0, 12", "  ret C1"].join("\n"),
} as const;

/** The call every figure of the first lesson runs: `fuel_used(50, 38)`. */
export const FUEL_CALL = { entry: "fuel_used_wrong", args: [50, 38] } as const;

/** `mov x3, -1` and then `mov w3, -1`: no compiler made them, and they have no C. */
export const WIDTHS = {
  c: "",
  listing: ["mov x3, -1", "mov w3, -1", "ret"].join("\n"),
} as const;

/** The four instructions of the second lesson's last challenge: no compiler made them, and they have no C. */
export const FOUR_INSTRUCTIONS = {
  c: "",
  listing: ["mov x1, -1", "mov w1, 5", "mov w2, 16960", "movk w2, 0xf, lsl 16"].join("\n"),
} as const;

/**
 * The second lesson's worked example of `movk`: no compiler made it, and it has no C. A figure
 * shows it as hand-written (docs/notes/module-1/listings.md records only compiler output), and the
 * differential test runs it (scripts/real-tools/corpus/module1-halves.s).
 */
export const MOVK_EXAMPLE = {
  c: "",
  listing: ["mov w0, 3", "movk w0, 2, lsl 16", "ret"].join("\n"),
} as const;

/**
 * The program the second lesson's closing question describes: no page draws it, and the facts test
 * and the differential test run it (`x5` all ones, then a write to `w5`).
 */
export const X5_QUESTION = {
  c: "",
  listing: ["mov x5, -1", "mov w5, 7", "ret"].join("\n"),
} as const;

/** The starting text of the second lesson's written challenge: it does not assemble. */
export const ODOMETER_LIMIT_START_TEXT = ["mov w0, 1000000", "ret"].join("\n");

/** The reference answer: GCC's own `odometer_limit`. */
export const ODOMETER_LIMIT_TEXT = ["mov w0, 16960", "movk w0, 0xf, lsl 16", "ret"].join("\n");
