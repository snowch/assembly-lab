// Copyright © 2026 Christopher Snow

import type { Lesson } from "@platform/lesson-schema";
import { TAUGHT } from "./lessons/introduced";
import { FUNDAMENTALS_PROSE } from "./lessons/fundamentals.prose";
import { RETURNING_PROSE } from "./lessons/returning-to-caller.prose";
import {
  INSTRUCTION_REFERENCE_CATALOG as I,
  type InstructionReferenceKey,
} from "./instruction-reference-catalog";
import {
  EXTENDED_REFERENCES as X,
  EXTENDED_LESSON_REFERENCE_KEYS as EXTENDED,
} from "./extended-reference-catalog";

export interface SourceReference {
  readonly label: string;
  readonly url: string;
  readonly mnemonic?: string;
  readonly codePattern?: string;
}
export interface LessonSources {
  readonly instructions: readonly SourceReference[];
  readonly otherSources: readonly SourceReference[];
  readonly introductions: readonly SourceReference[];
  /** Previously authored reference notes move intact from the explanation to this footer. */
  readonly authoredProse?: string;
}

export const FIRST_INSTRUCTION_FORMS = {
  add: "add-register",
  ret: "ret",
  bl: "bl",
  sub: "sub-register",
  mov: "mov-wide-immediate",
  movk: "movk",
  adds: "adds-register",
  subs: "subs-register",
  neg: "neg",
  negs: "negs",
  and: "and-immediate",
  orr: "orr-register",
  eor: "eor-immediate",
  ubfx: "ubfx",
  bfi: "bfi",
  lsl: "lsl-immediate",
  lsr: "lsr-immediate",
  asr: "asr-immediate",
  cmp: "cmp-register",
  cmn: "cmn-register",
  csel: "csel",
  cset: "cset",
  tst: "tst-immediate",
  ands: "ands-immediate",
  b: "b",
  "b.cond": "b-cond",
  cbz: "cbz",
  cbnz: "cbnz",
  tbz: "tbz",
  tbnz: "tbnz",
  ldr: "ldr-immediate",
  str: "str-immediate",
  strb: "strb-immediate",
  strh: "strh-immediate",
  ldrb: "ldrb-immediate",
  ldrsb: "ldrsb-immediate",
  ldrh: "ldrh-immediate",
  ldrsh: "ldrsh-immediate",
  ldrsw: "ldrsw-immediate",
  sxtb: "sxtb",
  uxtb: "uxtb",
  sxtw: "sxtw",
  mul: "mul",
  madd: "madd",
  smull: "smull",
  umull: "umull",
  smulh: "smulh",
  umulh: "umulh",
  msub: "msub",
  sdiv: "sdiv",
  udiv: "udiv",
  stp: "stp",
  ldp: "ldp",
  movz: "movz",
} as const satisfies Record<string, InstructionReferenceKey>;

/** Additional forms actually explained or used by the named lesson, not every architectural encoding. */
export const LESSON_INSTRUCTION_FORMS = {
  "adding-a-constant": ["add-immediate"],
  "tiny-function": ["add-immediate", "ret"],
  "returning-to-caller": ["bl", "ret", "add-immediate", "add-register"],
  "subtraction-and-reuse": ["sub-register", "add-register"],
  "instructions-in-sequence": ["add-register", "sub-register"],
  "meet-the-machine": ["add-register", "ret"],
  "constants-and-widths": [
    "mov-wide-immediate",
    "mov-inverted-wide-immediate",
    "mov-bitmask-immediate",
    "mov-register",
  ],
  "building-constants": ["movk", "mov-wide-immediate", "mov-bitmask-immediate"],
  "register-widths": ["mov-register", "mov-wide-immediate", "mov-inverted-wide-immediate"],
  "flags-and-overflow": ["adds-register", "add-register"],
  "subtracting-and-the-tick-counter": ["subs-register", "sub-register"],
  masks: [
    "and-immediate",
    "and-register",
    "orr-register",
    "orr-immediate",
    "eor-immediate",
    "eor-register",
  ],
  "reading-and-writing-fields": ["ubfx", "bfi", "lsl-immediate", "orr-register"],
  shifts: ["lsr-immediate", "asr-immediate", "lsl-immediate", "add-register"],
  "shifts-and-signed-division": ["asr-immediate", "sdiv"],
  "compare-and-choose": ["cmp-immediate", "cmp-register", "cmn-immediate", "cmn-register", "csel"],
  "conditions-and-boolean-results": ["cset", "tst-immediate", "ands-immediate"],
  branches: ["b", "b-cond", "cmp-immediate", "cmn-immediate"],
  "zero-and-threshold-branches": ["cbz", "b-cond", "cmp-immediate"],
  "register-and-bit-branches": ["cbnz", "tbz", "tbnz"],
  "counting-up": ["add-immediate", "cmp-immediate", "b-cond"],
  "writing-an-upward-loop": ["add-immediate", "cmp-immediate", "b-cond"],
  "counting-down": ["subs-immediate", "sub-immediate", "b-cond"],
  "testing-before-and-after": ["cmp-immediate", "b-cond", "subs-immediate"],
  "stopping-when-work-ends": ["cbz", "b-cond", "cmp-immediate"],
  "memory-and-addresses": ["ldr-immediate", "str-immediate"],
  "transfer-widths": ["ldr-immediate", "str-immediate", "strb-immediate", "strh-immediate"],
  "loading-widths": [
    "ldrb-immediate",
    "ldrsb-immediate",
    "ldrh-immediate",
    "ldrsh-immediate",
    "ldrsw-immediate",
  ],
  "extending-register-values": ["sxtb", "uxtb", "sxtw"],
  "array-addresses": ["ldr-register", "ldr-immediate"],
  "traversing-arrays": ["ldr-immediate", "add-extended-register", "add-immediate", "b-cond"],
  "zero-terminated-strings": ["ldrb-register", "ldrb-immediate", "cbz"],
  "products-and-widths": ["mul", "madd"],
  "widening-products": ["smull", "umull"],
  "reading-product-halves": ["smulh", "umulh"],
  "division-and-remainders": ["sdiv", "udiv", "msub"],
  "consumption-calculation": ["mul", "udiv", "msub"],
  "dividing-by-a-constant": ["umulh", "lsr-immediate"],
  "calls-and-returns": ["bl", "ret", "stp", "ldp", "mov-sp"],
  "preserving-values-across-calls": ["bl", "ret", "stp", "ldp"],
  "recursive-calls": ["bl", "ret", "stp", "ldp"],
  "making-recursive-progress": ["bl", "ret", "sub-immediate", "b-cond"],
  "from-c-to-instructions": ["movz", "add-register", "ret"],
  "equivalent-trip-charge": ["mul", "add-register", "ret"],
  "change-c-calculation": ["add-register", "mul", "ret"],
  "cap-charge-in-c": ["cmp-immediate", "csel", "ret"],
  "compile-a-loop": ["add-immediate", "cmp-register", "b-cond"],
  "write-assembly-loop": ["add-immediate", "cmp-register", "b-cond"],
  "change-loop-boundary": ["cmp-register", "b-cond"],
  "repeated-shifts-in-c": ["lsl-immediate"],
  "c-and-overflow": ["adds-immediate", "adds-register", "add-register"],
  "checked-arithmetic": ["adds-register", "cset"],
  "checked-addition": ["adds-register", "cset"],
} as const satisfies Record<string, readonly InstructionReferenceKey[]>;

const ARCHITECTURE: SourceReference = {
  label: "Arm Architecture Reference Manual for A-profile architecture",
  url: "https://developer.arm.com/documentation/ddi0487/latest/",
};
const C_LANGUAGE: SourceReference = { label: "C23 public draft N3096", url: X.c23.url };
const REGISTER_LABELS: Partial<Record<InstructionReferenceKey, string>> = {
  "add-register": "ADD (register inputs)",
  "sub-register": "SUB (register inputs)",
  "adds-register": "ADDS (register inputs)",
  "subs-register": "SUBS (register inputs)",
};
const MOVED_REFERENCE_PROSE: Readonly<Record<string, string>> = {
  "one-addition": FUNDAMENTALS_PROSE.addition.references.prose,
  "returning-to-caller": RETURNING_PROSE.references.prose,
};
const EXTENDED_ORIGIN: Readonly<Record<string, keyof typeof EXTENDED>> = {
  "loading-and-startup": "from-function-to-executable",
  "runtime-startup": "from-function-to-executable",
  "stepping-native-function": "debug-native-instructions",
  "diagnosing-native-failure": "debug-native-instructions",
  "capture-pi-boot": "raspberry-pi-boot",
  "restore-pi-boot": "raspberry-pi-boot",
  "a32-conditions": "same-c-on-a32",
  "a32-constants": "same-c-on-a32",
  "a32-division-helper": "same-c-on-a32",
};
const FORM_INTRODUCTIONS: Readonly<
  Record<string, readonly { key: InstructionReferenceKey; codePattern: string }[]>
> = {
  "adding-a-constant": [
    { key: "add-immediate", codePattern: "^add\\s+[^,]+,\\s*[^,]+,\\s*#?[-0-9]" },
  ],
  "array-addresses": [{ key: "ldr-register", codePattern: "^ldr\\s+.*\\[[^,\\]]+,\\s*[wx][0-9]" }],
  "traversing-arrays": [
    { key: "add-extended-register", codePattern: "^add\\s+.*\\b(?:uxtw|sxtw|uxtx|sxtx)\\b" },
  ],
  "zero-terminated-strings": [
    { key: "ldrb-register", codePattern: "^ldrb\\s+.*\\[[^,\\]]+,\\s*[wx][0-9]" },
  ],
  "c-and-overflow": [
    { key: "adds-immediate", codePattern: "^adds\\s+[^,]+,\\s*[^,]+,\\s*#?[-0-9]" },
  ],
};
function unique(entries: readonly SourceReference[]): SourceReference[] {
  return [...new Map(entries.map((entry) => [entry.url, entry])).values()];
}
/** No lesson answers, machine programs or source claims are passed to the reference UI. */
export function lessonSources(lesson: Pick<Lesson, "id" | "module">): LessonSources {
  const coreKeys: readonly InstructionReferenceKey[] = [
    ...(TAUGHT[lesson.id] ?? []).map(
      (mnemonic) => FIRST_INSTRUCTION_FORMS[mnemonic as keyof typeof FIRST_INSTRUCTION_FORMS],
    ),
    ...((LESSON_INSTRUCTION_FORMS as Record<string, readonly InstructionReferenceKey[]>)[
      lesson.id
    ] ?? []),
  ];
  const extendedId = EXTENDED_ORIGIN[lesson.id] ?? lesson.id;
  const extendedKeys = (EXTENDED as Record<string, readonly (keyof typeof X)[]>)[extendedId] ?? [];
  const extendedEntries: SourceReference[] = extendedKeys.map((key) => X[key]);
  const instructions = unique([
    ...coreKeys.map((key) => ({ ...I[key], label: REGISTER_LABELS[key] ?? I[key].label })),
    ...extendedEntries.filter((entry) => entry.mnemonic),
  ]);
  const otherSources = unique([
    ...(lesson.module < 14 ? [ARCHITECTURE] : []),
    ...extendedEntries.filter((entry) => !entry.mnemonic),
    ...([
      "tiny-function",
      "returning-to-caller",
      "calls-and-returns",
      "preserving-values-across-calls",
      "recursive-calls",
      "making-recursive-progress",
    ].includes(lesson.id)
      ? [X.aapcs64]
      : []),
    ...(lesson.module === 10 ||
    lesson.module === 15 ||
    lesson.module === 16 ||
    ["c-integer-types", "same-bits-two-readings"].includes(lesson.id)
      ? [C_LANGUAGE]
      : []),
    ...(["constants-and-widths", "building-constants"].includes(lesson.id)
      ? [X["gnu-aarch64"]]
      : []),
  ]);
  const introducedKeys = [
    ...(TAUGHT[lesson.id] ?? []).map(
      (mnemonic) => FIRST_INSTRUCTION_FORMS[mnemonic as keyof typeof FIRST_INSTRUCTION_FORMS],
    ),
  ];
  return {
    instructions,
    otherSources,
    introductions: unique([
      ...introducedKeys.map((key) => I[key]),
      ...(FORM_INTRODUCTIONS[lesson.id] ?? []).map(({ key, codePattern }) => ({
        ...I[key],
        codePattern,
      })),
      ...extendedEntries.filter((entry) => entry.mnemonic),
    ]),
    ...(MOVED_REFERENCE_PROSE[lesson.id]
      ? { authoredProse: MOVED_REFERENCE_PROSE[lesson.id] }
      : {}),
  };
}
