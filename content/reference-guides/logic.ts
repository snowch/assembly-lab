// Copyright © 2026 Christopher Snow

import type {
  ExplainedReferenceExample,
  InstructionFormGuide,
  ReferenceGuideFamily,
  ReferenceWatch,
} from "./types";

const registerRule =
  "Use w registers for a 32-bit operation or x registers for a 64-bit operation. All register operands in this form use the same width.";
const specialRegisters =
  "The matching zero register is accepted. sp and wsp are not accepted in the register form.";
const logicalMaskRule =
  "An immediate mask must be an encodable bit pattern. For example, #0xf0 is accepted; #0 is not. The number fitting the register is not enough.";
const logicalMaskDetails =
  "The pattern is a rotated run of 1 bits, repeated across groups of 2, 4, 8, 16, 32 or 64 bits. A group cannot be wider than the register. All-zero and all-one patterns are excluded.";
const shiftRule =
  "The amount is from 0 to 31 for w registers or 0 to 63 for x registers. Register widths still match.";
const hex = (name: string): ReferenceWatch => ({ kind: "register", name, reading: "hex" });
const signed = (name: string): ReferenceWatch => ({ kind: "register", name, reading: "signed" });
const unsigned = (name: string): ReferenceWatch => ({ kind: "register", name });
const flags: ReferenceWatch = { kind: "flags" };

const logicalEffects = {
  and: "Keep a 1 bit only where both inputs have a 1 bit. The source registers keep their values.",
  ands: "Keep a 1 bit only where both inputs have a 1 bit. Update N and Z from the result, and clear C and V.",
  orr: "Set a bit where either input has a 1 bit. The source registers keep their values.",
  eor: "Set a bit where the two inputs differ. The source registers keep their values.",
  bic: "Invert the second input, then AND it with the first input. This clears the first input’s bits selected by the second input.",
  bics: "Clear the first input’s bits selected by the second input. Update N and Z from the result, and clear C and V.",
  orn: "Invert the second input, then OR it with the first input. The inversion covers the operation’s full register width.",
  eon: "Invert the second input, then XOR it with the first input. The inversion covers the operation’s full register width.",
  tst: "AND the inputs to set N and Z, then discard the result. Clear C and V. Both source registers keep their values.",
  mvn: "Invert every input bit across the operation’s register width. The source register keeps its value.",
} as const;

type LogicName = keyof typeof logicalEffects;
const immediateLogic = new Set<LogicName>(["and", "ands", "orr", "eor", "bic", "tst"]);
const flagLogic = new Set<LogicName>(["ands", "bics", "tst"]);

function logicExample(name: LogicName, form: "register" | "immediate" | "shifted-register") {
  const unary = name === "mvn";
  const test = name === "tst";
  const source = unary ? "w9" : "w10";
  const prefix = test ? `${name} w9, ` : unary ? `${name} w8, ` : `${name} w8, w9, `;
  const operand = form === "immediate" ? "#0xf0" : source;
  const instruction = prefix + operand + (form === "shifted-register" ? ", lsr #2" : "");
  const watch = [hex("w9"), ...(form === "immediate" || unary ? [] : [hex("w10")])];
  if (!test) watch.push(hex("w8"));
  if (flagLogic.has(name)) watch.push(flags);
  return {
    id: `${name}-${form}`,
    setup: "mov w8, #0x0f\nmov w9, #0x5a\nmov w10, #0x3c\ncmp w8, w8",
    instruction,
    watch,
    explanation:
      form === "shifted-register"
        ? `The lsr operand shifts ${source} right, filling its high bits with zero, before the logical operation. ${logicalEffects[name]}`
        : form === "immediate"
          ? `The mask is written directly in the instruction. ${name === "tst" ? "Test the source bits selected by the mask, update flags and discard the result." : name === "bic" ? "Clear the source bits selected by the mask." : logicalEffects[name]}`
          : logicalEffects[name],
  } satisfies ExplainedReferenceExample;
}

function logicGuides(name: LogicName): readonly InstructionFormGuide[] {
  const unary = name === "mvn";
  const test = name === "tst";
  const prefix = test ? `${name} Rn, ` : unary ? `${name} Rd, ` : `${name} Rd, Rn, `;
  return [
    {
      id: "register",
      title: unary ? "Invert a register" : "Register inputs",
      syntax: [prefix + "Rm"],
      rules: [registerRule, specialRegisters],
      examples: [logicExample(name, "register")],
      mistakes: [
        {
          source: unary ? `${name} w8, x9` : test ? `${name} w9, x10` : `${name} w8, w9, x10`,
          explanation:
            "A w operand and an x operand have different widths. Choose the same width for all register operands in this form.",
          errorKey: "operand.width",
        },
      ],
    },
    ...(immediateLogic.has(name)
      ? [
          {
            id: "immediate",
            title: "Immediate mask",
            syntax: [prefix + "#imm"],
            rules: [
              "#imm supplies a fixed mask directly in the instruction. No extra register holds that mask.",
              logicalMaskRule,
            ],
            advancedRules: [
              logicalMaskDetails,
              ...(name === "bic"
                ? ["For bic, the mask after inversion must have the encodable pattern."]
                : []),
              test
                ? "tst has no destination. It allows a zero-register input, but not sp or wsp."
                : name === "ands"
                  ? "ands allows the matching zero register as destination, but not sp or wsp. The source may be a zero register, but not sp or wsp."
                  : "This immediate form allows sp or wsp as destination, but not a zero-register destination. The source may be a zero register, but not sp or wsp.",
            ],
            examples: [logicExample(name, "immediate")],
            mistakes: [
              {
                source: prefix.replace(/Rn/g, "w9").replace(/Rd/g, "w8") + "#0",
                explanation:
                  "Zero fits in the register, but the logical-immediate encoding excludes an all-zero mask. Operand encoding has rules beyond the register’s capacity.",
                errorKey: name === "bic" ? "immediate.bitmaskBic" : "immediate.bitmask",
              },
            ],
          } satisfies InstructionFormGuide,
        ]
      : []),
    {
      id: "shifted-register",
      title: "Shifted register input",
      syntax: [prefix + "Rm, lsr #amount"],
      rules: [
        "Shift the final register input before applying the logical operation. The shift does not change that source register.",
        "Use lsl, lsr, asr or ror. lsl fills low bits with zero; lsr fills high bits with zero; asr copies the sign bit; ror rotates bits around.",
        shiftRule,
      ],
      advanced: true,
      examples: [logicExample(name, "shifted-register")],
      mistakes: [
        {
          source:
            (test ? `${name} w9, ` : unary ? `${name} w8, ` : `${name} w8, w9, `) +
            `${unary ? "w9" : "w10"}, lsl #32`,
          explanation:
            "A shifted w-register operand accepts amounts only through 31. The amount 32 is outside that instruction form’s range.",
          errorKey: "shift.range",
        },
      ],
    },
  ];
}

const shiftEffects = {
  lsl: "Move bits left and fill the low positions with zero. Bits that move beyond the register width are discarded.",
  lsr: "Move bits right and fill the high positions with zero. The input’s sign is not used.",
  asr: "Move bits right and copy the input’s sign bit into the high positions. Read the before and after values as signed integers.",
  ror: "Move bits right and put the low bits back into the high positions. Rotation does not discard those bits.",
} as const;

type ShiftName = keyof typeof shiftEffects;
function shiftExample(name: ShiftName, variable: boolean, boundary = false) {
  const amount = boundary ? "#31" : variable ? "w10" : "#2";
  return {
    id: `${name}-${boundary ? "last-amount" : variable ? "register" : "immediate"}`,
    setup:
      name === "asr"
        ? "mov w8, #0\nmov w9, #-36\nmov w10, #34"
        : name === "ror"
          ? "mov w8, #0\nmov w9, #5\nmov w10, #34"
          : "mov w8, #0\nmov w9, #36\nmov w10, #34",
    instruction: `${name} w8, w9, ${amount}`,
    watch: [
      name === "asr" ? signed("w9") : unsigned("w9"),
      ...(variable ? [unsigned("w10")] : []),
      name === "asr" ? signed("w8") : unsigned("w8"),
    ],
    explanation: variable
      ? `For a w operation, only the amount register’s low 5 bits select the shift. The register value 34 therefore selects the same amount as #2. ${shiftEffects[name]}`
      : boundary
        ? `The amount #31 is the largest immediate accepted for a w operation. ${shiftEffects[name]}`
        : shiftEffects[name],
  } satisfies ExplainedReferenceExample;
}

function shiftGuides(name: ShiftName): readonly InstructionFormGuide[] {
  return [
    {
      id: "immediate",
      title: "Immediate shift amount",
      syntax: [`${name} Rd, Rn, #amount`],
      rules: [registerRule, shiftRule],
      advancedRules: [specialRegisters],
      examples: [shiftExample(name, false), shiftExample(name, false, true)],
      mistakes: [
        {
          source: `${name} w8, w9, #32`,
          explanation:
            "A w-register operation has immediate amounts from 0 to 31. An immediate amount of 32 is outside this form’s range.",
          errorKey: "immediate.range",
        },
      ],
    },
    {
      id: "register",
      title: "Register shift amount",
      syntax: [`${name} Rd, Rn, Rm`],
      rules: [
        registerRule,
        "Use the low 5 bits of Rm for a w operation or the low 6 bits for an x operation. A larger register value wraps within that amount range.",
      ],
      advancedRules: [specialRegisters],
      examples: [shiftExample(name, true)],
      mistakes: [
        {
          source: `${name} w8, w9, x10`,
          explanation:
            "The amount register uses the same width spelling as the destination and input. A 64-bit amount register does not belong in this 32-bit form.",
          errorKey: "operand.width",
        },
      ],
    },
  ];
}

const fieldEffects = {
  ubfx: "Copy the selected source bits into the low result positions. Fill the higher result bits with zero.",
  sbfx: "Copy the selected source bits into the low result positions. Copy the selected field’s sign bit into the higher result positions.",
  ubfiz:
    "Copy the source’s low field into the chosen destination position. Clear every destination bit outside that field.",
  sbfiz:
    "Copy the source’s low field into the chosen destination position. Clear lower destination bits, then copy the field’s sign bit into higher positions.",
  bfi: "Replace the selected destination field with low source bits. Destination bits outside the field keep their previous values.",
  bfxil:
    "Copy the selected source field into the destination’s low positions. Higher destination bits keep their previous values.",
} as const;

type FieldName = keyof typeof fieldEffects;
function fieldGuides(name: FieldName): readonly InstructionFormGuide[] {
  return [
    {
      id: "field",
      title: name === "ubfx" || name === "sbfx" ? "Extract a bit field" : "Place a bit field",
      syntax: [`${name} Rd, Rn, #lsb, #count`],
      rules: [
        registerRule,
        "Bit positions start at 0 at the right-hand end. lsb selects the first bit position; count gives the number of bits.",
        name.endsWith("iz") || name === "bfi"
          ? "lsb is the destination position. The field comes from the source’s low count bits."
          : "lsb is the source position. The field goes into the destination’s low count positions.",
        "lsb is from 0 to register width minus 1. count is from 1 to register width minus lsb, so the selected field cannot cross the register boundary.",
      ],
      advancedRules: [specialRegisters],
      examples: [
        {
          id: `${name}-field`,
          setup: name === "sbfiz" ? "mov w8, #0x5a\nmov w9, #0x6d" : "mov w8, #0x5a\nmov w9, #0xd6",
          instruction: `${name} w8, w9, #4, #4`,
          watch: [hex("w9"), hex("w8")],
          explanation: fieldEffects[name],
        },
      ],
      mistakes: [
        {
          source: `${name} w8, w9, #31, #2`,
          explanation:
            "Starting at bit 31 leaves room for one bit in a 32-bit register. A field of two bits would cross the register boundary.",
          errorKey: "immediate.range",
        },
      ],
    },
  ];
}

function extensionGuides(name: "uxtb" | "uxth" | "sxtb" | "sxth" | "sxtw") {
  const isUnsigned = name.startsWith("u");
  const size = name.endsWith("b") ? 8 : name.endsWith("h") ? 16 : 32;
  const destination = name === "sxtw" ? "x8" : "w8";
  const initial = name === "sxtw" ? "mov w9, #-11" : "mov w9, #0x80f5\nmovk w9, #0x1234, lsl #16";
  const guides: InstructionFormGuide[] = [
    {
      id: name === "sxtw" ? "x-result" : "w-result",
      title: name === "sxtw" ? "Extend into 64 bits" : "Extend into 32 bits",
      syntax: [name === "sxtw" ? `${name} Xd, Wn` : `${name} Wd, Wn`],
      rules: [
        `Read the input’s low ${size} bits. ${isUnsigned ? "Fill the remaining result bits with zero." : "Copy the selected field’s sign bit into the remaining result bits."}`,
        "The source uses its w-register name. A w result also clears the upper 32 bits of the corresponding x register.",
        ...(name === "sxtw" ? ["sxtw requires an x destination."] : []),
      ],
      advancedRules: [
        "General registers and matching zero registers are accepted. sp and wsp are not accepted.",
      ],
      examples: [
        {
          id: `${name}-base`,
          setup: `mov x8, #-1\n${initial}`,
          instruction: `${name} ${destination}, w9`,
          watch: [hex("w9"), isUnsigned ? unsigned(destination) : signed(destination)],
          explanation: isUnsigned
            ? "Ignore source bits above the selected field. The result uses zeros above that field, so its unsigned reading is non-negative."
            : "The selected field’s top bit determines how to fill the remaining result positions. The after value uses the signed reading of the destination width.",
        },
      ],
      mistakes: [
        {
          source: name === "sxtw" ? "sxtw w8, w9" : `${name} w8, x9`,
          explanation:
            name === "sxtw"
              ? "sxtw extends a 32-bit input into a 64-bit result. Its destination must use the x name."
              : "This extension takes a w-register source, even when the destination is an x register.",
          errorKey: "operand.width",
        },
      ],
    },
  ];
  if (name === "sxtb" || name === "sxth") {
    guides.push({
      id: "x-result",
      title: "Extend into 64 bits",
      syntax: [`${name} Xd, Wn`],
      rules: [
        `Read the w input’s low ${size} bits. Copy that field’s sign bit into all higher positions of the x destination.`,
      ],
      advancedRules: [
        "The input still uses a w-register name. General and zero registers are accepted; sp and wsp are not.",
      ],
      examples: [
        {
          id: `${name}-x-result`,
          setup: `mov x8, #0\n${initial}`,
          instruction: `${name} x8, w9`,
          watch: [hex("w9"), signed("x8")],
          explanation:
            "The x spelling makes this a full 64-bit signed result. A negative selected field fills all its higher positions with 1 bits.",
        },
      ],
    });
  } else if (isUnsigned) {
    guides.push({
      id: "x-spelling",
      title: "Alternate x destination spelling",
      syntax: [`${name} Xd, Wn`],
      rules: [
        "The assembler also accepts this x destination spelling. It means the same 32-bit write as the w spelling, including clearing the corresponding x register’s upper half.",
      ],
      advanced: true,
      examples: [
        {
          id: `${name}-x-spelling`,
          setup: `mov x8, #-1\n${initial}`,
          instruction: `${name} x8, w9`,
          watch: [hex("w9"), hex("x8")],
          explanation:
            "The x spelling does not change this unsigned extension into a different operation. Inspect the full x result to see that its upper half is cleared.",
        },
      ],
    });
  }
  return guides;
}

export const LOGIC_GUIDES: ReferenceGuideFamily = Object.fromEntries([
  ...(Object.keys(logicalEffects) as LogicName[]).map((name) => [name, logicGuides(name)]),
  ...(Object.keys(shiftEffects) as ShiftName[]).map((name) => [name, shiftGuides(name)]),
  ...(Object.keys(fieldEffects) as FieldName[]).map((name) => [name, fieldGuides(name)]),
  ...(["uxtb", "uxth", "sxtb", "sxth", "sxtw"] as const).map((name) => [
    name,
    extensionGuides(name),
  ]),
]);
