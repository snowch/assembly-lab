// Copyright © 2026 Christopher Snow

// The compiler listings Module 3's lessons show or describe, copied from
// docs/notes/module-3/listings.md (ARM64 GCC 16.1.0, -O1, fetched from Compiler Explorer on 16
// October 2026), and the few programs the lessons run that no compiler made: the reader's own
// `set_gear`, its variant without the clearing step, and the programs the graders run to work out
// the answers of the answers challenges. Each function is shown by itself: its C is the one
// recorded line that defines it, and every instruction carries the tag C1, since the lesson draws
// that one line as line 1. logic-shifts-masks.facts.test.ts holds this copy to the recorded file
// (the C line, each instruction, and the line each instruction was recorded against).

/** A program as a figure takes it: the C and the compiler's listing (packages/views/src/listing.ts). */
interface RecordedProgram {
  readonly c: string;
  readonly listing: string;
  readonly sourceLines?: readonly (readonly number[])[];
}

/** One recorded function: the C line that defines it, and its instructions, each tagged `C1`. */
const recorded = (c: string, label: string, instructions: readonly string[]): RecordedProgram => ({
  c,
  sourceLines: instructions.map(() => [1]),
  listing: [`${label}:`, ...instructions.map((text) => `  ${text} C1`)].join("\n"),
});

export const WARN_FUEL = recorded(
  "unsigned warn_fuel(unsigned w) { return w | FUEL_LOW; }",
  "warn_fuel",
  ["orr w0, w0, 1", "ret"],
);
export const CLEAR_DOOR = recorded(
  "unsigned clear_door(unsigned w) { return w & ~DOOR_OPEN; }",
  "clear_door",
  ["and w0, w0, -5", "ret"],
);
export const SERVICE_DUE = recorded(
  "bool service_due(unsigned w) { return (w & SERVICE_DUE) != 0; }",
  "service_due",
  ["ubfx x0, x0, 1, 1", "ret"],
);
export const GEAR_OF = recorded(
  "unsigned gear_of(unsigned w) { return (w >> 4) & 7; }",
  "gear_of",
  ["ubfx x0, x0, 4, 3", "ret"],
);
export const SET_GEAR = recorded(
  "unsigned set_gear(unsigned w, unsigned g) { return (w & ~(7u << 4)) | ((g & 7) << 4); }",
  "set_gear",
  ["bfi w0, w1, 4, 3", "ret"],
);
export const TOGGLE_LIGHTS = recorded(
  "unsigned toggle_lights(unsigned w) { return w ^ (1u << 3); }",
  "toggle_lights",
  ["eor w0, w0, 8", "ret"],
);
export const HALVE_GRADIENT = recorded(
  "int halve_gradient(int g) { return g >> 1; }",
  "halve_gradient",
  ["asr w0, w0, 1", "ret"],
);
export const HALVE_COUNT = recorded(
  "unsigned halve_count(unsigned n) { return n >> 1; }",
  "halve_count",
  ["lsr w0, w0, 1", "ret"],
);
export const DIV2 = recorded("int div2(int g) { return g / 2; }", "div2", [
  "add w0, w0, w0, lsr 31",
  "asr w0, w0, 1",
  "ret",
]);
export const TIMES8 = recorded("unsigned times8(unsigned n) { return n * 8; }", "times8", [
  "lsl w0, w0, 3",
  "ret",
]);

/** The first listing's functions, in the recorded file's order. */
export const RECORDED_FUNCTIONS = {
  warn_fuel: WARN_FUEL,
  clear_door: CLEAR_DOOR,
  service_due: SERVICE_DUE,
  gear_of: GEAR_OF,
  set_gear: SET_GEAR,
  toggle_lights: TOGGLE_LIGHTS,
  halve_gradient: HALVE_GRADIENT,
  halve_count: HALVE_COUNT,
  div2: DIV2,
  times8: TIMES8,
} as const;

/** The second listing, "The shifts in Lesson 2's last challenge": one function for each case. */
export const SHR3_INT = recorded("int shr3_int(int x) { return x >> 3; }", "shr3_int", [
  "asr w0, w0, 3",
  "ret",
]);
export const SHR3_UNSIGNED = recorded(
  "unsigned shr3_unsigned(unsigned x) { return x >> 3; }",
  "shr3_unsigned",
  ["lsr w0, w0, 3", "ret"],
);
export const SHL3_INT = recorded("int shl3_int(int x) { return x << 3; }", "shl3_int", [
  "lsl w0, w0, 3",
  "ret",
]);
export const SHL3_UNSIGNED = recorded(
  "unsigned shl3_unsigned(unsigned x) { return x << 3; }",
  "shl3_unsigned",
  ["lsl w0, w0, 3", "ret"],
);

export const RECORDED_SHIFTS = {
  shr3_int: SHR3_INT,
  shr3_unsigned: SHR3_UNSIGNED,
  shl3_int: SHL3_INT,
  shl3_unsigned: SHL3_UNSIGNED,
} as const;

// ---------------------------------------------------------------------------------------------
// Programs no compiler made

/** The challenge's starting point: the function returns its first argument as it came. */
export const SET_GEAR_START_TEXT = "ret";

/** The challenge's reference: clear the field, move the new gear into place, join the two. */
export const SET_GEAR_REFERENCE_TEXT = [
  "and w1, w1, 7",
  "lsl w1, w1, 4",
  "and w0, w0, -113",
  "orr w0, w0, w1",
  "ret",
].join("\n");

/** The failure experiment: the reference without the instruction that clears the field. */
export const SET_GEAR_WITHOUT_CLEAR = {
  c: "",
  listing: ["set_gear:", "  and w1, w1, 7", "  lsl w1, w1, 4", "  orr w0, w0, w1", "  ret"].join(
    "\n",
  ),
} as const satisfies RecordedProgram;

/**
 * Lesson 1's last challenge: the three instructions its task names, each as a function of its
 * own. The grader runs them to work out the answers; the learner is never shown this program.
 */
export const TRACE_THREE = {
  c: "",
  listing: [
    "after_orr:",
    "  orr w0, w0, 1",
    "  ret",
    "after_and:",
    "  and w0, w0, -9",
    "  ret",
    "the_gear:",
    "  ubfx x0, x0, 4, 3",
    "  ret",
  ].join("\n"),
} as const satisfies RecordedProgram;

/**
 * Lesson 2's first challenge: `asr` by 2, `lsr` by 2, and C's `/ 4` (which rounds towards zero,
 * as `sdiv` does). The grader runs them to work out the answers; the learner is never shown
 * this program.
 */
export const COMPARE_SHIFTS = {
  c: "",
  listing: [
    "asr_by_2:",
    "  asr w0, w0, 2",
    "  ret",
    "lsr_by_2:",
    "  lsr w0, w0, 2",
    "  ret",
    "div_by_4:",
    "  mov w1, 4",
    "  sdiv w0, w0, w1",
    "  ret",
  ].join("\n"),
} as const satisfies RecordedProgram;

/** Lesson 2's last challenge: GCC's four shifts by 3, which the grader runs and the learner is not shown. */
export const PICK_INSTRUCTION = {
  c: [SHR3_INT.c, SHR3_UNSIGNED.c, SHL3_INT.c, SHL3_UNSIGNED.c].join("\n"),
  sourceLines: [[1], [1], [2], [2], [3], [3], [4], [4]],
  listing: [SHR3_INT, SHR3_UNSIGNED, SHL3_INT, SHL3_UNSIGNED].map((p) => p.listing).join("\n"),
} as const satisfies RecordedProgram;

/** The shifts and amounts the shift figure offers. */
export const SHIFT_OPS = ["lsl", "lsr", "asr"] as const;
export const SHIFT_AMOUNTS = [1, 2, 3, 4, 8] as const;
