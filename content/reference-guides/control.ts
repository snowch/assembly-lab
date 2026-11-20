// Copyright © 2026 Christopher Snow

import type {
  ExplainedReferenceExample,
  InstructionFormGuide,
  ReferenceGuideFamily,
  ReferenceWatch,
} from "./types";

const register = (
  name: string,
  reading: "signed" | "unsigned" | "hex" = "unsigned",
): ReferenceWatch => ({ kind: "register", name, reading });
const flags: ReferenceWatch = { kind: "flags" };
const pc: ReferenceWatch = { kind: "pc" };
const matchingRegisters =
  "Use w registers for a 32-bit operation or x registers for a 64-bit operation. Every register in this form must have the same width.";
const ordinaryRegisters =
  "General registers and the matching zero register are accepted. sp and wsp are not accepted.";
const conditionRules = [
  matchingRegisters,
  ordinaryRegisters,
  "cond tests the flags already present. ne means Z is clear; eq means Z is set. This instruction does not compare its inputs first.",
];
const conditionDetails = [
  "The full list of conditions is in Reading the syntax. A previous comparison or flag-setting instruction must prepare the flags you intend to test.",
];

const selects = Object.fromEntries(
  (["csel", "csinc", "csinv", "csneg"] as const).map((name) => {
    const otherwise = {
      csel: "copies the second input",
      csinc: "adds one to the second input",
      csinv: "inverts every bit of the second input",
      csneg: "negates the second input",
    }[name];
    const examples: ExplainedReferenceExample[] = [true, false].map((holds) => ({
      id: `${name}-${holds ? "condition-holds" : "condition-fails"}`,
      setup: `mov w9, #7\nmov w10, #3\ncmp w9, ${holds ? "w10" : "w9"}`,
      instruction: `${name} w8, w9, w10, ne`,
      watch: [register("w9"), register("w10"), flags, register("w8", "hex")],
      explanation: holds
        ? "The prepared comparison leaves Z clear, so ne holds. The instruction copies the first input into the destination. Both input registers keep their values."
        : `The prepared comparison leaves Z set, so ne does not hold. The instruction ${otherwise} and writes the destination. Both input registers keep their values.`,
    }));
    const guide: InstructionFormGuide = {
      id: "register-condition",
      title: "Choose between register inputs",
      syntax: [`${name} Rd, Rn, Rm, cond`],
      rules: [
        ...conditionRules,
        `When cond holds, copy Rn into Rd. Otherwise this form ${otherwise} from Rm and writes Rd.`,
      ],
      advancedRules: conditionDetails,
      examples,
      mistakes: [
        {
          source: `${name} w8, w9, x10, ne`,
          errorKey: "operand.width",
          explanation:
            "The destination and both inputs must use the same width. An x input cannot be mixed into this w-register form.",
        },
      ],
    };
    return [name, [guide]];
  }),
);

const conditionalAliases = Object.fromEntries(
  (["cset", "csetm", "cinc", "cneg"] as const).map((name) => {
    const set = name === "cset" || name === "csetm";
    const operation = {
      cset: "Write 1 when cond holds; write 0 otherwise.",
      csetm: "Write all 1 bits when cond holds; write all 0 bits otherwise.",
      cinc: "Add one to Rn when cond holds; copy Rn unchanged otherwise.",
      cneg: "Negate Rn when cond holds; copy Rn unchanged otherwise.",
    }[name];
    const examples: ExplainedReferenceExample[] = [true, false].map((holds) => ({
      id: `${name}-${holds ? "condition-holds" : "condition-fails"}`,
      setup: `mov w8, #19\nmov w9, #7\ncmp w9, ${holds ? "#3" : "w9"}`,
      instruction: set ? `${name} w8, ne` : `${name} w8, w9, ne`,
      watch: [register("w9"), flags, register("w8", name === "csetm" ? "hex" : "signed")],
      explanation: `${holds ? "Z is clear, so ne holds." : "Z is set, so ne does not hold."} ${operation} The flags keep the prepared comparison result.`,
    }));
    const guide: InstructionFormGuide = {
      id: "register-condition",
      title: set ? "Write a value from a condition" : "Change a register value conditionally",
      syntax: [set ? `${name} Rd, cond` : `${name} Rd, Rn, cond`],
      rules: [
        ...(set ? [ordinaryRegisters] : [matchingRegisters, ordinaryRegisters]),
        "cond tests existing flags. ne means Z is clear; eq means Z is set. This instruction does not compare a register first.",
        operation,
        "The always condition al is not accepted for this form.",
      ],
      advancedRules: conditionDetails,
      examples,
      mistakes: [
        {
          source: set ? `${name} w8, al` : `${name} w8, w9, al`,
          errorKey: "operand.conditionAl",
          explanation:
            "This conditional alias cannot use al. Choose one of the supported tests of the existing flags.",
        },
      ],
    };
    return [name, [guide]];
  }),
);

const products = Object.fromEntries(
  (["mul", "madd", "msub", "mneg"] as const).map((name) => {
    const accumulate = name === "madd" || name === "msub";
    const operation = {
      mul: "Multiply Rn by Rm and write the low register-width bits into Rd.",
      madd: "Multiply Rn by Rm, add Ra, then write the low register-width bits into Rd.",
      msub: "Multiply Rn by Rm, subtract that product from Ra, then write the low register-width bits into Rd.",
      mneg: "Multiply Rn by Rm, negate the product, then write the low register-width bits into Rd.",
    }[name];
    const guide: InstructionFormGuide = {
      id: "register",
      title: accumulate ? "Multiply and combine with another register" : "Multiply register inputs",
      syntax: [accumulate ? `${name} Rd, Rn, Rm, Ra` : `${name} Rd, Rn, Rm`],
      rules: [matchingRegisters, ordinaryRegisters, operation],
      examples: [
        {
          id: `${name}-register`,
          setup: "mov w9, #7\nmov w10, #3\nmov w11, #11",
          instruction: accumulate ? `${name} w8, w9, w10, w11` : `${name} w8, w9, w10`,
          watch: [
            register("w9"),
            register("w10"),
            ...(accumulate ? [register("w11")] : []),
            register("w8", "signed"),
          ],
          explanation:
            operation +
            " The input registers keep their values. The destination receives the combined result.",
        },
      ],
      mistakes: [
        {
          source: accumulate ? `${name} w8, w9, w10, x11` : `${name} w8, w9, #3`,
          errorKey: accumulate ? "operand.width" : "operand.register",
          explanation: accumulate
            ? "The added or subtracted input must have the same width as the other registers. A separate x input is not accepted in a w operation."
            : "The multiplier must be a register. This form has no immediate multiplier operand.",
        },
      ],
    };
    return [name, [guide]];
  }),
);

const wideProducts = Object.fromEntries(
  (["smull", "umull", "smaddl", "umaddl"] as const).map((name) => {
    const signed = name.startsWith("s");
    const accumulate = name.endsWith("addl");
    const guide: InstructionFormGuide = {
      id: "widening-register",
      title: "Multiply 32-bit inputs into a 64-bit result",
      syntax: [accumulate ? `${name} Xd, Wn, Wm, Xa` : `${name} Xd, Wn, Wm`],
      rules: [
        "Both multiplied inputs use w names. The destination uses an x name; an added input also uses an x name.",
        ordinaryRegisters,
        `Read the multiplied inputs as ${signed ? "signed" : "unsigned"} 32-bit values. Keep the 64-bit ${accumulate ? "sum of their product and Xa" : "product"}.`,
      ],
      examples: [
        {
          id: `${name}-widening`,
          setup: `mov w9, #${signed ? "-65536" : "65536"}\nmov w10, #65536\nmov x11, #9`,
          instruction: accumulate ? `${name} x8, w9, w10, x11` : `${name} x8, w9, w10`,
          watch: [
            register("w9", signed ? "signed" : "unsigned"),
            register("w10"),
            ...(accumulate ? [register("x11")] : []),
            register("x8", signed ? "signed" : "unsigned"),
          ],
          explanation: `The w inputs are interpreted as ${signed ? "signed" : "unsigned"} values. The x destination keeps the full-width ${accumulate ? "combined result" : "product"}, including bits that would not fit in a w result.`,
        },
      ],
      mistakes: [
        {
          source: accumulate ? `${name} w8, w9, w10, x11` : `${name} w8, w9, w10`,
          errorKey: "operand.width",
          explanation:
            "This widening form requires an x destination. A w destination cannot hold its 64-bit result.",
        },
      ],
    };
    return [name, [guide]];
  }),
);

const highProducts = Object.fromEntries(
  (["smulh", "umulh"] as const).map((name) => {
    const signed = name === "smulh";
    const guide: InstructionFormGuide = {
      id: "register",
      title: "Keep the high half of a wide product",
      syntax: [`${name} Xd, Xn, Xm`],
      rules: [
        "All operands use x names. General and zero registers are accepted; sp is not.",
        `Multiply the ${signed ? "signed" : "unsigned"} 64-bit inputs. Write bits 127 down to 64 of the product into Xd.`,
      ],
      examples: [
        {
          id: `${name}-high-half`,
          setup: "mov x9, #-1\nmov x10, #2",
          instruction: `${name} x8, x9, x10`,
          watch: [
            register("x9", signed ? "signed" : "unsigned"),
            register("x10"),
            register("x8", signed ? "signed" : "unsigned"),
          ],
          explanation: `The inputs use ${signed ? "signed" : "unsigned"} readings. The destination receives the upper half of the product; mul would keep its lower half.`,
        },
      ],
      mistakes: [
        {
          source: `${name} w8, w9, w10`,
          errorKey: "operand.width",
          explanation:
            "This high-product form requires 64-bit x operands. It has no w-register form.",
        },
      ],
    };
    return [name, [guide]];
  }),
);

const divisions = Object.fromEntries(
  (["sdiv", "udiv"] as const).map((name) => {
    const signed = name === "sdiv";
    const guide: InstructionFormGuide = {
      id: "register",
      title: "Divide register inputs",
      syntax: [`${name} Rd, Rn, Rm`],
      rules: [
        matchingRegisters,
        ordinaryRegisters,
        `Divide Rn by Rm using ${signed ? "signed" : "unsigned"} readings. Write the quotient into Rd; discard the fractional part towards zero.`,
        "A zero divisor produces zero. This instruction does not raise a division-by-zero exception.",
      ],
      advancedRules: signed
        ? [
            "Dividing the most-negative value by −1 keeps the most-negative bit pattern. No arithmetic flags are written.",
          ]
        : undefined,
      examples: [
        {
          id: `${name}-quotient`,
          setup: `mov w9, #${signed ? "-20" : "20"}\nmov w10, #6`,
          instruction: `${name} w8, w9, w10`,
          watch: [
            register("w9", signed ? "signed" : "unsigned"),
            register("w10"),
            register("w8", signed ? "signed" : "unsigned"),
          ],
          explanation:
            "The destination receives the whole-number quotient. Both inputs keep their values; the remainder is not written anywhere.",
        },
        {
          id: `${name}-zero-divisor`,
          setup: "mov w9, #20\nmov w10, #0",
          instruction: `${name} w8, w9, w10`,
          watch: [register("w9"), register("w10"), register("w8")],
          explanation:
            "The prepared divisor is zero. A64 writes zero into the destination and continues execution.",
        },
      ],
      mistakes: [
        {
          source: `${name} w8, w9, #6`,
          errorKey: "operand.register",
          explanation:
            "The divisor must be held in a register. This form does not accept an immediate divisor.",
        },
      ],
    };
    return [name, [guide]];
  }),
);

const directBranches = Object.fromEntries(
  (["b", "bl"] as const).map((name) => {
    const link = name === "bl";
    const guide: InstructionFormGuide = {
      id: "label",
      title: link ? "Call a labelled location" : "Branch to a labelled location",
      syntax: [`${name} label`],
      rules: [
        "Define label in this program. Execution continues at that label, not at the following instruction.",
        ...(link
          ? [
              "Write the address of the following instruction into x30 so a return can resume there.",
            ]
          : ["This branch does not save a return address."]),
      ],
      advancedRules: [
        "The target must be on a 4-byte instruction boundary and within −134217728 to 134217724 bytes of the branch.",
      ],
      examples: [
        {
          id: `${name}-label`,
          instruction: `${name} .Ltarget`,
          continuation: link ? "b .Lafter\n.Ltarget:\nret" : "nop\n.Ltarget:\nnop",
          watch: [...(link ? [register("x30", "hex")] : []), pc],
          explanation: link
            ? "The next instruction address is saved in x30. Execution jumps to the prepared target; its return can use the saved address."
            : "The next program-counter value is the target address. The intervening instruction is skipped.",
        },
      ],
      mistakes: [
        {
          source: `${name} 3`,
          errorKey: "branch.align",
          explanation:
            "An instruction address must be a multiple of four. A target between instruction boundaries cannot be encoded.",
        },
      ],
    };
    return [name, [guide]];
  }),
);

const conditionalBranch: readonly InstructionFormGuide[] = [
  {
    id: "label-condition",
    title: "Branch using existing flags",
    syntax: ["b.cond label"],
    rules: [
      "Replace cond in the instruction name with a condition. For example, b.eq branches when Z is set; b.ne branches when Z is clear.",
      "The instruction tests the flags already present. It does not compare a register or update the flags.",
      "Define label in this program. If the condition fails, execution continues with the following instruction.",
    ],
    advancedRules: [
      "The full list of conditions is in Reading the syntax. The target must be 4-byte aligned and within −1048576 to 1048572 bytes of this branch.",
    ],
    examples: [true, false].map((holds) => ({
      id: `b-cond-${holds ? "taken" : "not-taken"}`,
      setup: `mov w9, #7\ncmp w9, #${holds ? "7" : "3"}`,
      instruction: "b.eq .Ltarget",
      continuation: "nop\n.Ltarget:\nnop",
      watch: [flags, pc],
      explanation: holds
        ? "The prepared comparison sets Z, so eq holds. The program counter moves to the target and skips the intervening instruction."
        : "The prepared comparison clears Z, so eq does not hold. The program counter moves to the following instruction.",
    })),
    mistakes: [
      {
        source: "b.eq 3",
        errorKey: "branch.align",
        explanation:
          "The condition does not relax target alignment. The target must still be on an instruction boundary.",
      },
    ],
  },
];

const zeroBranches = Object.fromEntries(
  (["cbz", "cbnz"] as const).map((name) => {
    const nonZero = name === "cbnz";
    const guide: InstructionFormGuide = {
      id: "register-label",
      title: "Branch after testing a register for zero",
      syntax: [`${name} Rt, label`],
      rules: [
        "Rt may use a w or x name. General and zero registers are accepted; sp and wsp are not.",
        `${name} branches when Rt is ${nonZero ? "not zero" : "zero"}. It tests the register directly; existing flags are neither read nor changed.`,
        "If the test fails, execution continues with the following instruction. Define the target label in this program.",
      ],
      advancedRules: [
        "The target must be 4-byte aligned and within −1048576 to 1048572 bytes of this instruction.",
      ],
      examples: [true, false].map((taken) => ({
        id: `${name}-${taken ? "taken" : "not-taken"}`,
        setup: `mov w8, #${taken === nonZero ? "1" : "0"}`,
        instruction: `${name} w8, .Ltarget`,
        continuation: "nop\n.Ltarget:\nnop",
        watch: [register("w8"), pc],
        explanation: taken
          ? "The prepared register value satisfies the zero test. The branch selects the target address and skips the intervening instruction."
          : "The prepared register value fails the zero test. Execution continues at the following instruction. The tested register keeps its value.",
      })),
      mistakes: [
        {
          source: `${name} sp, 4`,
          errorKey: "operand.noSp",
          explanation:
            "This form tests a general or zero register. The stack pointer cannot be its tested register.",
        },
      ],
    };
    return [name, [guide]];
  }),
);

const bitBranches = Object.fromEntries(
  (["tbz", "tbnz"] as const).map((name) => {
    const nonZero = name === "tbnz";
    const guide: InstructionFormGuide = {
      id: "register-bit-label",
      title: "Branch after testing one register bit",
      syntax: [`${name} Rt, #bit, label`],
      rules: [
        "bit is a position from 0 to 31 with a w name, or 0 to 63 with an x name. Count positions from the right, starting at zero.",
        `${name} branches when the selected bit is ${nonZero ? "one" : "zero"}. Other bits do not affect this test.`,
        "General and zero registers are accepted; sp and wsp are not. This instruction neither reads nor changes the flags.",
        "Define the target label in this program. If the test fails, continue at the following instruction.",
      ],
      advancedRules: [
        "The target must be 4-byte aligned and within −32768 to 32764 bytes of this instruction.",
      ],
      examples: [true, false].map((taken) => ({
        id: `${name}-${taken ? "taken" : "not-taken"}`,
        setup: `mov w8, #${taken === nonZero ? "512" : "0"}`,
        instruction: `${name} w8, #9, .Ltarget`,
        continuation: "nop\n.Ltarget:\nnop",
        watch: [register("w8", "hex"), pc],
        explanation: taken
          ? "The prepared bit satisfies the test. The program counter selects the target address; the tested register keeps its bits."
          : "The prepared bit fails the test. Execution continues at the following instruction, leaving the register unchanged.",
      })),
      mistakes: [
        {
          source: `${name} w8, #32, 4`,
          errorKey: "immediate.range",
          explanation:
            "A w register has bit positions 0 through 31. Use an x form when you need to test a position in the upper half.",
        },
      ],
    };
    return [name, [guide]];
  }),
);

const registerBranches = Object.fromEntries(
  (["br", "blr"] as const).map((name) => {
    const link = name === "blr";
    const guide: InstructionFormGuide = {
      id: "register",
      title: link
        ? "Call an address held in a register"
        : "Branch to an address held in a register",
      syntax: [`${name} Xn`],
      rules: [
        "The operand must use an x name and hold an aligned address of executable code. sp is not accepted.",
        ...(link
          ? [
              "Save the address of the following instruction in x30, then continue at the register-held address.",
            ]
          : ["Continue at the register-held address without saving a return address."]),
      ],
      advancedRules: [
        "xzr is accepted as an operand name, but its zero value must not be mistaken for a valid executable target in this browser model.",
      ],
      examples: [
        {
          id: `${name}-register`,
          setup: "adr x9, .Ltarget",
          instruction: `${name} x9`,
          continuation: link ? "b .Lafter\n.Ltarget:\nret" : "nop\n.Ltarget:\nnop",
          watch: [register("x9", "hex"), ...(link ? [register("x30", "hex")] : []), pc],
          explanation: link
            ? "The example prepares x9 with the target address. The call selects that address and saves where execution can resume in x30."
            : "The example prepares x9 with the target address. The branch copies that address into the program counter and skips the intervening instruction.",
        },
      ],
      mistakes: [
        {
          source: `${name} w9`,
          errorKey: "operand.width",
          explanation:
            "An executable address for this form must be held in a 64-bit x register. A w operand is not accepted.",
        },
      ],
    };
    return [name, [guide]];
  }),
);

const returns: readonly InstructionFormGuide[] = [
  {
    id: "default",
    title: "Return through x30",
    syntax: ["ret"],
    rules: [
      "With no operand, ret branches to the address in x30. It does not fetch a return address from the stack.",
      "x30 must already hold an aligned executable return address. A call normally prepares it; the example prepares a local return target.",
    ],
    examples: [
      {
        id: "ret-default",
        setup: "adr x30, .Lafter",
        instruction: "ret",
        watch: [register("x30", "hex"), pc],
        explanation:
          "The prepared return address in x30 becomes the next program-counter value. ret leaves x30 unchanged.",
      },
    ],
    mistakes: [
      {
        source: "ret w30",
        errorKey: "operand.width",
        explanation:
          "An explicitly named return-address register must use its x name. Omitting the operand selects x30 automatically.",
      },
    ],
  },
  {
    id: "register",
    title: "Return through a named register",
    syntax: ["ret Xn"],
    rules: [
      "Use an x register holding an aligned executable return address. The named register supplies the address instead of x30.",
      "sp is not accepted. The instruction branches to the address; it does not load a value from memory.",
    ],
    advancedRules: [
      "xzr is accepted as a register name, but zero is not a valid return target in this browser model.",
    ],
    examples: [
      {
        id: "ret-register",
        setup: "adr x9, .Lafter",
        instruction: "ret x9",
        watch: [register("x9", "hex"), pc],
        explanation:
          "The prepared address in x9 becomes the next program-counter value. The register keeps its address after the return instruction.",
      },
    ],
    mistakes: [
      {
        source: "ret sp",
        errorKey: "operand.noSp",
        explanation:
          "The stack pointer cannot be used as ret’s address-register operand. Use an accepted x register name holding a valid return address.",
      },
    ],
  },
];

const noOperation: readonly InstructionFormGuide[] = [
  {
    id: "default",
    title: "Continue without changing data",
    syntax: ["nop"],
    rules: [
      "No operands. Continue with the following instruction; registers, memory and flags stay unchanged.",
    ],
    examples: [
      {
        id: "nop-default",
        setup: "mov w8, #7\ncmp w8, #7",
        instruction: "nop",
        watch: [register("w8"), flags, pc],
        explanation:
          "The program counter advances to the following instruction. The prepared register value and comparison flags stay the same.",
      },
    ],
    mistakes: [
      {
        source: "nop w8",
        errorKey: "operands.many",
        explanation:
          "nop takes no operands. It does not read or write a register supplied after its name.",
      },
    ],
  },
];

export const CONTROL_GUIDES: ReferenceGuideFamily = {
  ...selects,
  ...conditionalAliases,
  ...products,
  ...wideProducts,
  ...highProducts,
  ...divisions,
  ...directBranches,
  "b.cond": conditionalBranch,
  ...zeroBranches,
  ...bitBranches,
  ...registerBranches,
  ret: returns,
  nop: noOperation,
};
