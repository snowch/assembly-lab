// Copyright © 2026 Christopher Snow

import type {
  ExplainedReferenceExample,
  InstructionFormGuide,
  ReferenceGuideFamily,
  ReferenceWatch,
} from "./types";

const reg = (
  name: string,
  reading: "signed" | "unsigned" | "hex" = "unsigned",
): ReferenceWatch => ({
  kind: "register",
  name,
  reading,
});
const watched = (names: readonly string[], flags = false): readonly ReferenceWatch[] => [
  ...names.map((name) => reg(name)),
  ...(flags ? [{ kind: "flags" } as const] : []),
];
const example = (
  id: string,
  setup: string,
  instruction: string,
  explanation: string,
  watch: readonly ReferenceWatch[],
): ExplainedReferenceExample => ({ id, setup, instruction, explanation, watch });

const matching =
  "Use w names for a 32-bit operation or x names for a 64-bit operation. The register operands must use matching widths.";
const plainRegisters =
  "General registers and the matching zero register are accepted. sp and wsp are not accepted in this form.";
const immediateRule =
  "Use a number from 0 to 4095, or a multiple of 4096 up to 16773120. The instruction can encode these values even though the register itself can hold many more values.";
const explicitImmediateRule =
  "You may also write #imm, lsl #12 with imm from 0 to 4095. This shifts the encoded number left by 12 bits. lsl #0 leaves it unshifted.";
const negativeImmediateRule =
  "A negative immediate reverses the underlying add/sub operation. Its positive magnitude must meet the same encoding limits; flags follow the reversed operation.";
const shiftedRules = [
  "lsl shifts left and fills low bits with zero.",
  "lsr shifts right and fills high bits with zero. asr shifts right and copies the sign bit into high bits.",
  "The amount is 0–31 with w registers or 0–63 with x registers. The shift affects the value used by this instruction; the input register is not written.",
];
const extensionRule =
  "An extension reads a smaller signed or unsigned value from the second input and expands it to the operation's width. sxtw copies the sign of a 32-bit input; uxtw fills its new upper bits with zero.";
const extensionOptions =
  "The other extension names are uxtb, uxth, uxtx, sxtb, sxth and sxtx. b selects 8 bits, h selects 16, w selects 32 and x selects 64. u means fill new bits with zero; s means copy the selected value's sign bit.";
const extensionAmount =
  "The amount after the extension is an optional left shift from 0 to 4. It scales the extended input without changing that input register.";
const extensionSp =
  "The first input may be sp/wsp, but not the zero register. With sp/wsp involved, the extension may be omitted or written lsl with an amount from 0 to 4.";

/** The same negative input exposes the different high-bit fills of lsr and asr. */
function rightShiftExamples(
  name: string,
  kind: "arithmetic" | "comparison" | "negation",
  setsFlags: boolean,
): readonly ExplainedReferenceExample[] {
  const operands =
    kind === "comparison" ? "w9, w10" : kind === "negation" ? "w8, w10" : "w8, w9, w10";
  const names =
    kind === "comparison"
      ? ["w9", "w10"]
      : kind === "negation"
        ? ["w8", "w10"]
        : ["w8", "w9", "w10"];
  const watch = [
    ...names.map((name) => reg(name, "hex")),
    ...(setsFlags ? [{ kind: "flags" } as const] : []),
  ];
  const setup = `mov w8, #37\nmov w9, #20\nmov w10, #-12${setsFlags ? "\ncmp wzr, wzr" : ""}`;
  return (["lsr", "asr"] as const).map((shift) =>
    example(
      `${name}-${shift}-register`,
      setup,
      `${name} ${operands}, ${shift} #1`,
      shift === "lsr"
        ? "lsr shifts the input right and fills the new high bit with zero. The instruction uses that shifted value; the stored input stays unchanged. Hexadecimal shows the bit patterns."
        : "asr shifts the input right and copies its sign bit into the new high bit. The instruction uses that shifted value; the stored input stays unchanged. Hexadecimal shows the bit patterns.",
      watch,
    ),
  );
}

function addSub(name: "add" | "adds" | "sub" | "subs"): readonly InstructionFormGuide[] {
  const subtract = name.startsWith("sub");
  const setsFlags = name.endsWith("s");
  const flagSetup = setsFlags ? "\ncmp wzr, wzr" : "";
  const effect = subtract
    ? "Subtracts the second input from the first and writes the destination. Both input registers keep their values."
    : "Adds the two inputs and writes the destination. Both input registers keep their values.";
  const immediateSp = setsFlags
    ? "The first input may be sp/wsp, but not the zero register. The destination may be the matching zero register, but not sp/wsp."
    : "The first input and destination may be sp/wsp, but neither may be the zero register.";
  return [
    {
      id: "register",
      title: "Two register inputs",
      syntax: [`${name} Rd, Rn, Rm`],
      rules: [
        matching,
        "Rd is the destination. Rn is the first input; Rm is the second input.",
        plainRegisters,
      ],
      examples: [
        example(
          `${name}-register`,
          `mov w8, #37\nmov w9, #8\nmov w10, #3${flagSetup}`,
          `${name} w8, w9, w10`,
          effect,
          watched(["w8", "w9", "w10"], setsFlags),
        ),
      ],
      mistakes: [
        {
          source: `${name} w8, x9, w10`,
          explanation:
            "The destination and first input use different widths. Choose matching w names or matching x names.",
          errorKey: "operand.width",
        },
      ],
    },
    {
      id: "immediate",
      title: "A number written in the instruction",
      syntax: [`${name} Rd, Rn, #imm`, `${name} Rd, Rn, #imm, lsl #12`],
      rules: [
        immediateRule,
        "An immediate is a number written directly in the instruction. Rd receives the result; Rn supplies the register input.",
        "Rd and Rn must use matching w or x widths.",
        explicitImmediateRule,
      ],
      advancedRules: [immediateSp, negativeImmediateRule],
      examples: [
        example(
          `${name}-small-immediate`,
          `mov w8, #37\nmov w9, #8${flagSetup}`,
          `${name} w8, w9, #3`,
          "The instruction uses the written number as its second input. The first input register keeps its value.",
          watched(["w8", "w9"], setsFlags),
        ),
        example(
          `${name}-scaled-immediate`,
          `mov x8, #37\nmov x9, #8192${flagSetup}`,
          `${name} x8, x9, #4096`,
          "This value is encodable because it is a multiple of 4096. The assembler selects the shifted immediate encoding.",
          watched(["x8", "x9"], setsFlags),
        ),
        example(
          `${name}-explicit-immediate-shift`,
          `mov x8, #37\nmov x9, #8192${flagSetup}`,
          `${name} x8, x9, #1, lsl #12`,
          "The explicit shift produces the same second input as the previous example. Each example starts independently from its own Before values.",
          watched(["x8", "x9"], setsFlags),
        ),
      ],
      mistakes: [
        {
          source: `${name} w8, w9, #4097`,
          explanation:
            "4097 is above 4095 and is not a multiple of 4096. This immediate form cannot encode it, even though a w register can hold it.",
          errorKey: "immediate.addsub",
        },
        {
          source: `${name} w8, w9, #4294966296`,
          explanation:
            "4294966296 fits in 32 bits as an unsigned value. It exceeds this instruction form's immediate limit. Register capacity and immediate encoding are separate constraints.",
          errorKey: "immediate.addsub",
        },
      ],
    },
    {
      id: "shifted-register",
      title: "A shifted register input",
      syntax: [`${name} Rd, Rn, Rm, lsl #amount`],
      rules: [matching, plainRegisters, ...shiftedRules],
      examples: [
        example(
          `${name}-shifted-register`,
          `mov w8, #37\nmov w9, #20\nmov w10, #3${flagSetup}`,
          `${name} w8, w9, w10, lsl #2`,
          "The instruction shifts the second input left before the arithmetic operation. The original second-input register is unchanged.",
          watched(["w8", "w9", "w10"], setsFlags),
        ),
        ...rightShiftExamples(name, "arithmetic", setsFlags),
      ],
      mistakes: [
        {
          source: `${name} w8, w9, w10, lsl #32`,
          explanation:
            "A w-register shift amount must be from 0 to 31. The shift limit follows the operation's width.",
          errorKey: "shift.range",
        },
      ],
    },
    {
      id: "extended-register",
      title: "An extended register input",
      syntax: [`${name} Xd, Xn, Wm, uxtw #amount`],
      advanced: true,
      rules: [
        "The destination and first input use matching widths. A 32-bit operation needs a w second input.",
        extensionRule,
        extensionAmount,
      ],
      advancedRules: [
        extensionOptions,
        extensionSp,
        setsFlags
          ? "The destination may be the matching zero register, but not sp/wsp."
          : "The destination may be sp/wsp, but not the zero register.",
      ],
      examples: [
        example(
          `${name}-unsigned-extension`,
          `mov x8, #37\nmov x9, #20\nmov w10, #3${flagSetup}`,
          `${name} x8, x9, w10, uxtw #1`,
          "uxtw expands the unsigned w input to 64 bits, then the left shift scales it. The instruction uses that value in the arithmetic operation.",
          watched(["x8", "x9", "w10"], setsFlags),
        ),
        example(
          `${name}-signed-extension`,
          `mov x8, #37\nmov x9, #20\nmov w10, #-3${flagSetup}`,
          `${name} x8, x9, w10, sxtw #1`,
          "sxtw interprets the w input as signed, extends its sign to 64 bits and then shifts it. The input register's bits stay unchanged.",
          [
            reg("x8", "signed"),
            reg("x9", "signed"),
            reg("w10", "signed"),
            ...(setsFlags ? [{ kind: "flags" } as const] : []),
          ],
        ),
      ],
      mistakes: [
        {
          source: `${name} x8, x9, w10`,
          explanation:
            "This second input has a different width. State how it is extended, such as uxtw or sxtw.",
          errorKey: "operand.extendMissing",
        },
      ],
    },
  ];
}

function compare(name: "cmp" | "cmn"): readonly InstructionFormGuide[] {
  const effect =
    name === "cmp"
      ? "The instruction subtracts the second input from the first to write N, Z, C and V. It discards the arithmetic result; the input registers are unchanged."
      : "The instruction adds the inputs to write N, Z, C and V. It discards the arithmetic result; the input registers are unchanged.";
  const prepare = "mov w9, #8\nmov w10, #3\ncmp wzr, wzr";
  return [
    {
      id: "register",
      title: "Two register inputs",
      syntax: [`${name} Rn, Rm`],
      rules: [
        matching,
        "There is no destination register. The result is used only to write the flags.",
        plainRegisters,
      ],
      examples: [
        example(
          `${name}-register`,
          prepare,
          `${name} w9, w10`,
          effect,
          watched(["w9", "w10"], true),
        ),
      ],
      mistakes: [
        {
          source: `${name} w9, x10`,
          explanation: "Both plain register inputs must use the same width.",
          errorKey: "operand.width",
        },
      ],
    },
    {
      id: "immediate",
      title: "A number written in the instruction",
      syntax: [`${name} Rn, #imm`, `${name} Rn, #imm, lsl #12`],
      rules: [
        immediateRule,
        "The register supplies the first input. The written number supplies the second input. Only N, Z, C and V are written.",
        explicitImmediateRule,
      ],
      advancedRules: [
        "The register input may be sp/wsp, but not the zero register.",
        negativeImmediateRule,
      ],
      examples: [
        example(
          `${name}-small-immediate`,
          "mov w9, #8\ncmp wzr, wzr",
          `${name} w9, #3`,
          effect,
          watched(["w9"], true),
        ),
        example(
          `${name}-scaled-immediate`,
          "mov x9, #8192\ncmp wzr, wzr",
          `${name} x9, #4096`,
          effect,
          watched(["x9"], true),
        ),
        example(
          `${name}-explicit-immediate-shift`,
          "mov x9, #8192\ncmp wzr, wzr",
          `${name} x9, #1, lsl #12`,
          "The shifted number is used as the second input for the flag calculation. The register input is unchanged.",
          watched(["x9"], true),
        ),
      ],
      mistakes: [
        {
          source: `${name} w9, #4097`,
          explanation:
            "This number is neither from 0 to 4095 nor a multiple of 4096. It cannot be encoded by the immediate form.",
          errorKey: "immediate.addsub",
        },
      ],
    },
    {
      id: "shifted-register",
      title: "A shifted register input",
      syntax: [`${name} Rn, Rm, lsl #amount`],
      rules: [matching, plainRegisters, ...shiftedRules],
      examples: [
        example(
          `${name}-shifted-register`,
          prepare,
          `${name} w9, w10, lsl #2`,
          "The instruction shifts the second input before computing the flags. Neither input register is written.",
          watched(["w9", "w10"], true),
        ),
        ...rightShiftExamples(name, "comparison", true),
      ],
      mistakes: [
        {
          source: `${name} w9, w10, lsl #32`,
          explanation: "A 32-bit operation allows shift amounts only from 0 to 31.",
          errorKey: "shift.range",
        },
      ],
    },
    {
      id: "extended-register",
      title: "An extended register input",
      syntax: [`${name} Xn, Wm, sxtw #amount`],
      advanced: true,
      rules: [
        extensionRule,
        extensionAmount,
        "Only the flags are written. The input registers are unchanged.",
      ],
      advancedRules: [extensionOptions, extensionSp],
      examples: [
        example(
          `${name}-extended-register`,
          "mov x9, #20\nmov w10, #-3\ncmp wzr, wzr",
          `${name} x9, w10, sxtw #1`,
          "The signed w input is extended to 64 bits and shifted before the flag calculation. Both stored inputs are unchanged.",
          [reg("x9", "signed"), reg("w10", "signed"), { kind: "flags" }],
        ),
      ],
      mistakes: [
        {
          source: `${name} x9, w10`,
          explanation:
            "The inputs have different widths. State the extension applied to the second input.",
          errorKey: "operand.extendMissing",
        },
      ],
    },
  ];
}

function negate(name: "neg" | "negs"): readonly InstructionFormGuide[] {
  const flags = name === "negs";
  const prepare = `mov w8, #37\nmov w9, #3${flags ? "\ncmp wzr, wzr" : ""}`;
  const watch = [
    reg("w8", "signed"),
    reg("w9", "signed"),
    ...(flags ? [{ kind: "flags" } as const] : []),
  ];
  return [
    {
      id: "register",
      title: "Negate a register input",
      syntax: [`${name} Rd, Rm`],
      rules: [
        matching,
        plainRegisters,
        "The instruction subtracts the input from zero and writes the destination.",
      ],
      examples: [
        example(
          `${name}-register`,
          prepare,
          `${name} w8, w9`,
          "The destination receives the input's two's-complement negation. The input register is unchanged.",
          watch,
        ),
      ],
      mistakes: [
        {
          source: `${name} w8, #3`,
          explanation: "This form needs a register input. It does not accept an immediate number.",
          errorKey: "operand.register",
        },
      ],
    },
    {
      id: "shifted-register",
      title: "Negate a shifted input",
      syntax: [`${name} Rd, Rm, lsl #amount`],
      rules: [matching, plainRegisters, ...shiftedRules],
      examples: [
        example(
          `${name}-shifted-register`,
          prepare,
          `${name} w8, w9, lsl #2`,
          "The instruction shifts the input first, then subtracts that value from zero. The input register is unchanged.",
          watch,
        ),
        ...rightShiftExamples(name, "negation", flags),
      ],
      mistakes: [
        {
          source: `${name} w8, w9, ror #1`,
          explanation: "This arithmetic form allows lsl, lsr and asr, but not ror.",
          errorKey: "shift.notAllowed",
        },
      ],
    },
  ];
}

const mov: readonly InstructionFormGuide[] = [
  {
    id: "register",
    title: "Copy a register",
    syntax: ["mov Rd, Rm"],
    rules: [
      matching,
      "The destination receives the input's bits. The input register is unchanged. General and zero registers are accepted.",
    ],
    advancedRules: [
      "A copy involving sp/wsp must use matching widths and cannot also use a zero register.",
    ],
    examples: [
      example(
        "mov-register",
        "mov w8, #37\nmov w9, #8",
        "mov w8, w9",
        "The input's bits replace the destination's bits. The input keeps its original value.",
        watched(["w8", "w9"]),
      ),
    ],
    mistakes: [
      {
        source: "mov w8, x9",
        explanation:
          "This copy uses different register widths. Select matching w names or matching x names.",
        errorKey: "operand.width",
      },
    ],
  },
  {
    id: "immediate",
    title: "Write an encodable number",
    syntax: ["mov Rd, #imm"],
    rules: [
      "mov with an immediate selects one machine instruction. It does not automatically build every possible register-sized number.",
      "The value must fit a movz instruction, a movn instruction, or a logical bitmask encoding. movz places one 16-bit part and clears the rest. movn inverts that result.",
      "A logical bitmask repeats a rotated run of 1 bits. For example, 0x55555555 repeats the two-bit pattern 01. All-zero and all-one values cannot use that encoding, but may use movz or movn.",
    ],
    advancedRules: [
      "The destination may be sp/wsp only when the value uses a logical-bitmask encoding. A zero-register destination is accepted only for a movz/movn encoding.",
      "A w destination writes 32 bits and clears the matching x register's upper half. More complex constants can be built with movz and movk where those instructions are allowed.",
    ],
    examples: [
      example(
        "mov-wide-immediate",
        "mov w8, #37",
        "mov w8, #0x5100",
        "This value fits one 16-bit part. The assembler chooses a movz encoding.",
        [reg("w8", "hex")],
      ),
      example(
        "mov-inverted-immediate",
        "mov x8, #37",
        "mov x8, #-1",
        "The assembler can produce this value with a movn encoding. The displayed value is a signed reading of the stored bits.",
        [reg("x8", "signed")],
      ),
      example(
        "mov-bitmask-immediate",
        "mov w8, #37",
        "mov w8, #0x55555555",
        "The repeating bit pattern fits the logical-immediate encoding and is produced by one instruction.",
        [reg("w8", "hex")],
      ),
    ],
    mistakes: [
      {
        source: "mov w8, #0x12345",
        explanation:
          "This number needs more than one 16-bit part and does not fit a movn or logical-bitmask encoding. mov cannot produce it in one instruction.",
        errorKey: "immediate.move",
      },
    ],
  },
];

function wideMove(name: "movz" | "movn" | "movk"): readonly InstructionFormGuide[] {
  const setup = "mov x8, #0x5555555555555555";
  const explanation =
    name === "movk"
      ? "The selected 16-bit part is replaced. Every other part of the destination keeps its previous bits."
      : name === "movz"
        ? "The selected 16-bit part receives the immediate. Every other part is cleared."
        : "The instruction places the immediate in the selected 16-bit part, clears the rest, then inverts all the bits.";
  return [
    {
      id: "immediate",
      title: "An unshifted 16-bit immediate",
      syntax: [`${name} Rd, #imm`],
      rules: [
        "The written immediate must be from 0 to 65535. With no shift operand, it selects the low 16-bit part.",
        "The destination may be a w or x general register or matching zero register. sp/wsp are not accepted.",
      ],
      examples: [
        example(`${name}-immediate`, setup, `${name} x8, #0x51`, explanation, [reg("x8", "hex")]),
      ],
      mistakes: [
        {
          source: `${name} x8, #65536`,
          explanation:
            "The immediate itself is a 16-bit number, so it cannot exceed 65535. A wider destination does not make this immediate field wider.",
          errorKey: "immediate.range",
        },
      ],
    },
    {
      id: "shifted-immediate",
      title: "Choose another 16-bit part",
      syntax: [`${name} Rd, #imm, lsl #amount`],
      rules: [
        "The immediate remains from 0 to 65535. The shift chooses the destination part.",
        "Use lsl with an amount of 0 or 16 for a w destination; 0, 16, 32 or 48 for an x destination. Other shift kinds are not accepted.",
      ],
      examples: [
        example(`${name}-shifted-immediate`, setup, `${name} x8, #0x51, lsl #32`, explanation, [
          reg("x8", "hex"),
        ]),
      ],
      mistakes: [
        {
          source: `${name} x8, #1, lsl #8`,
          explanation:
            "The shift chooses a 16-bit part, so its amount must be a permitted multiple of 16.",
          errorKey: "shift.multiple16",
        },
      ],
    },
  ];
}

export const ARITHMETIC_GUIDES: ReferenceGuideFamily = {
  add: addSub("add"),
  adds: addSub("adds"),
  sub: addSub("sub"),
  subs: addSub("subs"),
  cmp: compare("cmp"),
  cmn: compare("cmn"),
  neg: negate("neg"),
  negs: negate("negs"),
  mov,
  movz: wideMove("movz"),
  movn: wideMove("movn"),
  movk: wideMove("movk"),
};
