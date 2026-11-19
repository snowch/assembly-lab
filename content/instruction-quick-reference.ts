// Copyright © 2026 Christopher Snow

import { INSTRUCTION_REFERENCE_CATALOG } from "./instruction-reference-catalog";

export interface QuickInstruction {
  readonly mnemonic: string;
  readonly summary: string;
  readonly forms: readonly string[];
  readonly rules: readonly string[];
  readonly flags: string;
  readonly examples: readonly string[];
  readonly references: readonly { label: string; url: string }[];
}

export const QUICK_REFERENCE_NOTATION = [
  "Replace Rd, Rn, Rm and Ra with register names. Rd receives the result; the other names supply inputs unless the entry says otherwise.",
  "R means either a w register (32 bits) or an x register (64 bits). Use the same width throughout a form unless it explicitly mixes W and X. Writing a w register also clears its x register’s upper 32 bits.",
  "General registers are w0–w30 and x0–x30. wzr and xzr read as zero and discard writes. sp (64 bits) and wsp (32 bits) name the stack pointer; use them only where an entry permits them. x31 and w31 are not register names.",
  "#imm is a number written directly in an instruction. # is optional in this browser assembler. Decimal and 0x hexadecimal numbers are accepted. A label names a position in your program; define it on a line ending with a colon.",
  "Rt and Rt2 name registers transferred to or from memory. A load writes them; a store reads them. Xn inside brackets holds the memory address.",
  "Square brackets in a form are typed as shown: [Xn] means memory at the address held in Xn. Optional operands are described in the rules, rather than shown with extra brackets.",
  "cond is a condition tested against the existing N, Z, C and V flags. eq means Z = 1; ne means Z = 0; cs/hs means C = 1; cc/lo means C = 0; mi means N = 1; pl means N = 0; vs means V = 1; vc means V = 0; hi means C = 1 and Z = 0; ls means C = 0 or Z = 1; ge means N = V; lt means N differs from V; gt means Z = 0 and N = V; le means Z = 1 or N differs from V; al means always.",
] as const;

const unchanged =
  "Leaves N, Z, C and V unchanged: their values still come from the previous instruction that wrote them.";
const arithmeticFlags =
  "Writes N and Z from the result, C from carry (addition) or no borrow (subtraction), and V from signed overflow.";
const logicFlags = "Writes N and Z from the result. Clears C and V to 0.";
const normalRegisters =
  "Use matching w or x widths. General registers and the matching zero register are accepted; sp and wsp are not.";
const conditionRule =
  "Use one of the conditions defined in Reading the syntax. These instructions read the existing flags; they do not perform a comparison first.";
const indexReference = {
  label: "Arm Base Instructions index",
  url: "https://documentation-service.arm.com/documentation/ddi0602/2026-09/Base-Instructions",
};

function entry(
  mnemonic: string,
  summary: string,
  forms: readonly string[],
  rules: readonly string[],
  examples: readonly string[],
  flags = unchanged,
): QuickInstruction {
  const references = Object.values(INSTRUCTION_REFERENCE_CATALOG)
    .filter((ref) => ref.mnemonic === mnemonic)
    .map(({ label, url }) => ({ label, url }));
  return {
    mnemonic,
    summary,
    forms,
    rules,
    flags,
    examples,
    references: references.length ? references : [indexReference],
  };
}

const addRules = [
  "The plain register form uses matching widths, accepts the zero register, and does not accept sp/wsp. You may append lsl, lsr or asr with an amount from 0 to 31 for w registers or 0 to 63 for x registers.",
  "An immediate’s magnitude must be 0–4095, or a multiple of 4096 through 16773120. Alternatively write #imm, lsl #12 with imm from 0 to 4095. A negative immediate reverses addition and subtraction.",
  "The immediate form allows sp/wsp as the first input, but not the zero register there. add/sub allow sp/wsp as destination, but not the zero register; adds/subs allow the zero register as destination, but not sp/wsp.",
  "The extended-register form appends uxtb, uxth, uxtw, uxtx, sxtb, sxth, sxtw or sxtx, optionally followed by an amount from 0 to 4. The first input and destination have matching widths; a 32-bit operation needs a w second input. This form allows sp/wsp as first input; destination restrictions match the immediate form.",
  "For ordinary 64-bit inputs use uxtx or sxtx; for a 32-bit second input use uxtw or sxtw to extend it to 64 bits. With sp/wsp involved, the extension may be omitted or written lsl with an amount from 0 to 4.",
];
const comparisons = [
  "The register form accepts matching widths and zero registers, but not sp/wsp. You may append lsl, lsr or asr with an amount from 0 to 31 for w registers or 0 to 63 for x registers.",
  "The immediate follows the add/sub limits: magnitude 0–4095, or a multiple of 4096 through 16773120. An explicit lsl #0 or lsl #12 takes an immediate magnitude from 0 to 4095. Negative immediates reverse addition and subtraction. The first input may be sp/wsp, but not a zero register.",
  "An extended second register follows the add/sub extension rules. The first input may be sp/wsp, but not a zero register in this form.",
];
const logicalImmediate =
  "An immediate must fit the register width and encode a rotated run of 1 bits in a repeating 2-, 4-, 8-, 16-, 32- or 64-bit pattern (no pattern wider than the register). All-zero and all-one patterns are excluded. For example, 0xff and 0x55555555 are encodable.";
const logicalShift =
  "You may append lsl, lsr, asr or ror and an amount from 0 to 31 for w registers or 0 to 63 for x registers.";
const bitfieldRules = [
  normalRegisters,
  "lsb is the first bit position, from 0 to register width minus 1. count is the number of bits, from 1 to register width minus lsb.",
];

export const INSTRUCTION_QUICK_REFERENCE: readonly QuickInstruction[] = [
  ...(["add", "adds", "sub", "subs"] as const).map((name) =>
    entry(
      name,
      name.startsWith("add")
        ? "Add the two inputs and keep the register-width result."
        : "Subtract the second input from the first and keep the register-width result.",
      [`${name} Rd, Rn, Rm`, `${name} Rd, Rn, #imm`, `${name} Xd, Xn, Wm, uxtw #amount`],
      addRules,
      [`${name} w8, w9, w10`, `${name} x8, x9, #4095`, `${name} x8, x9, w10, sxtw #2`],
      name.endsWith("s") ? arithmeticFlags : unchanged,
    ),
  ),
  ...(["cmp", "cmn"] as const).map((name) =>
    entry(
      name,
      name === "cmp"
        ? "Set flags for the first input minus the second. Discard the result."
        : "Set flags for the sum of the inputs. Discard the result.",
      [`${name} Rn, Rm`, `${name} Rn, #imm`, `${name} Xn, Wm, sxtw #amount`],
      comparisons,
      [`${name} x9, #24`, `${name} w9, w10`],
      arithmeticFlags,
    ),
  ),
  ...(["neg", "negs"] as const).map((name) =>
    entry(
      name,
      "Subtract the input from zero.",
      [`${name} Rd, Rm`],
      [
        normalRegisters,
        "You may append lsl, lsr or asr and an amount from 0 to register width minus 1. An immediate input is not accepted.",
      ],
      [`${name} w8, w9`],
      name === "negs" ? arithmeticFlags : unchanged,
    ),
  ),
  entry(
    "mov",
    "Copy a register or an encodable immediate into the destination.",
    ["mov Rd, Rm", "mov Rd, #imm"],
    [
      "Register copies use matching widths. A copy involving sp/wsp cannot use a zero register. Other register copies accept the zero register.",
      "An immediate must fit one movz or movn instruction, or an encodable logical bitmask. mov does not expand an arbitrary number into several instructions. Use movz and movk to build a larger number.",
      "An immediate destination may be sp/wsp only for the logical-bitmask form. A zero-register destination is accepted only for a movz/movn form.",
    ],
    ["mov x8, x9", "mov w8, #0x5100", "mov x8, #-1"],
  ),
  ...(["movz", "movn", "movk"] as const).map((name) =>
    entry(
      name,
      name === "movz"
        ? "Place a 16-bit immediate in one part of the register and clear the other bits."
        : name === "movn"
          ? "Place a 16-bit immediate, clear the other bits, then invert every bit."
          : "Replace one 16-bit part of the register and keep its other bits.",
      [`${name} Rd, #imm`, `${name} Rd, #imm, lsl #amount`],
      [
        "imm is 0–65535. amount is 0 or 16 for w registers; 0, 16, 32 or 48 for x registers. The default amount is 0.",
        "General and zero-register destinations are accepted; sp/wsp are not.",
      ],
      [`${name} x8, #0x51, lsl #32`],
    ),
  ),
  ...(["and", "ands", "orr", "eor", "bic", "bics", "orn", "eon", "tst", "mvn"] as const).map(
    (name) => {
      const summaries = {
        and: "Keep bits set in both inputs.",
        ands: "Keep bits set in both inputs and update flags.",
        orr: "Keep bits set in either input.",
        eor: "Set bits where the inputs differ.",
        bic: "Clear the first input’s bits where the second input has 1 bits.",
        bics: "Clear selected bits and update flags.",
        orn: "OR the first input with the inverted second input.",
        eon: "XOR the first input with the inverted second input.",
        tst: "AND the inputs, update flags and discard the result.",
        mvn: "Invert every input bit.",
      };
      const prefix =
        name === "tst" ? `${name} Rn, ` : name === "mvn" ? `${name} Rd, ` : `${name} Rd, Rn, `;
      const immediate = ["and", "ands", "orr", "eor", "bic", "tst"].includes(name);
      return entry(
        name,
        summaries[name],
        [prefix + "Rm", ...(immediate ? [prefix + "#imm"] : [])],
        [
          "The register form uses matching w or x widths. General and matching zero registers are accepted; sp/wsp are not.",
          logicalShift,
          ...(immediate
            ? [
                logicalImmediate,
                "In the immediate form, and/orr/eor/bic allow sp/wsp as destination but not the zero register; ands allows the zero-register destination but not sp/wsp. tst has no destination. No immediate form allows sp/wsp as an input.",
              ]
            : []),
          ...(name === "bic"
            ? [
                "For bic with an immediate, the inverted immediate must be an encodable logical bitmask.",
              ]
            : []),
        ],
        [name === "tst" ? "tst w9, #0xff" : name === "mvn" ? "mvn x8, x9" : `${name} w8, w9, w10`],
        ["ands", "bics", "tst"].includes(name) ? logicFlags : unchanged,
      );
    },
  ),
  ...(["lsl", "lsr", "asr", "ror"] as const).map((name) =>
    entry(
      name,
      {
        lsl: "Shift left and fill low bits with zero.",
        lsr: "Shift right and fill high bits with zero.",
        asr: "Shift right and copy the sign bit into high bits.",
        ror: "Rotate right, moving low bits into high positions.",
      }[name],
      [`${name} Rd, Rn, #amount`, `${name} Rd, Rn, Rm`],
      [
        normalRegisters,
        "An immediate amount is 0–31 for w registers or 0–63 for x registers. A register amount uses only its low 5 bits for w operations or low 6 bits for x operations.",
      ],
      [`${name} x8, x9, #5`, `${name} w8, w9, w10`],
    ),
  ),
  ...(["ubfx", "sbfx", "ubfiz", "sbfiz", "bfi", "bfxil"] as const).map((name) =>
    entry(
      name,
      {
        ubfx: "Extract count bits starting at lsb, filling higher bits with zero.",
        sbfx: "Extract count bits starting at lsb, copying the field’s sign into higher bits.",
        ubfiz: "Insert the input’s low count bits at lsb; clear all other bits.",
        sbfiz:
          "Insert the input’s low count bits at lsb; clear lower bits and sign-extend above the field.",
        bfi: "Replace count destination bits starting at lsb with the input’s low bits. Keep other destination bits.",
        bfxil:
          "Replace the low count destination bits with input bits starting at lsb. Keep other destination bits.",
      }[name],
      [`${name} Rd, Rn, #lsb, #count`],
      bitfieldRules,
      [`${name} w8, w9, #4, #8`],
    ),
  ),
  ...(["uxtb", "uxth", "sxtb", "sxth", "sxtw"] as const).map((name) =>
    entry(
      name,
      `Extend the low ${name.endsWith("b") ? "8" : name.endsWith("h") ? "16" : "32"} input bits with ${name.startsWith("u") ? "zeros" : "copies of the sign bit"}.`,
      [
        name === "sxtw" ? "sxtw Xd, Wn" : `${name} Wd, Wn`,
        ...(name === "sxtb" || name === "sxth" ? [`${name} Xd, Wn`] : []),
      ],
      [
        "The input must be a w register. General and zero registers are accepted; sp/wsp are not.",
        name === "sxtw"
          ? "The destination must be an x register."
          : name.startsWith("u")
            ? "The result is a 32-bit write. An x destination spelling is also accepted and means the same w-register write, clearing the upper half."
            : "The destination may be a w or x register.",
      ],
      [`${name} ${name === "sxtw" ? "x8" : "w8"}, w9`],
    ),
  ),
  ...(["csel", "csinc", "csinv", "csneg"] as const).map((name) =>
    entry(
      name,
      `If cond holds, copy Rn. Otherwise ${{ csel: "copy Rm", csinc: "copy Rm plus one", csinv: "invert Rm", csneg: "negate Rm" }[name]}.`,
      [`${name} Rd, Rn, Rm, cond`],
      [normalRegisters, conditionRule],
      [`${name} w8, w9, w10, ne`],
    ),
  ),
  ...(["cset", "csetm", "cinc", "cneg"] as const).map((name) =>
    entry(
      name,
      {
        cset: "Write 1 if cond holds, otherwise 0.",
        csetm: "Write all 1 bits if cond holds, otherwise 0.",
        cinc: "Copy Rn plus one if cond holds; otherwise copy Rn.",
        cneg: "Negate Rn if cond holds; otherwise copy Rn.",
      }[name],
      [name === "cset" || name === "csetm" ? `${name} Rd, cond` : `${name} Rd, Rn, cond`],
      [normalRegisters, conditionRule, "al is not accepted for these aliases."],
      [name === "cset" || name === "csetm" ? `${name} w8, ne` : `${name} w8, w9, ne`],
    ),
  ),
  ...(["mul", "madd", "msub", "mneg"] as const).map((name) =>
    entry(
      name,
      {
        mul: "Multiply Rn by Rm and keep the low register-width bits.",
        madd: "Write Ra + Rn × Rm, keeping the low register-width bits.",
        msub: "Write Ra − Rn × Rm, keeping the low register-width bits.",
        mneg: "Write −(Rn × Rm), keeping the low register-width bits.",
      }[name],
      [name === "madd" || name === "msub" ? `${name} Rd, Rn, Rm, Ra` : `${name} Rd, Rn, Rm`],
      [normalRegisters],
      [name === "madd" || name === "msub" ? `${name} x8, x9, x10, x11` : `${name} w8, w9, w10`],
    ),
  ),
  ...(["smull", "umull", "smaddl", "umaddl"] as const).map((name) =>
    entry(
      name,
      `${name.startsWith("s") ? "Signed" : "Unsigned"} 32-bit multiplication producing a 64-bit ${name.endsWith("addl") ? "product, added to Xa" : "result"}.`,
      [name.endsWith("addl") ? `${name} Xd, Wn, Wm, Xa` : `${name} Xd, Wn, Wm`],
      [
        "The destination is an x register; both multiplied inputs are w registers. The added input, when present, is an x register. General and zero registers are accepted; sp/wsp are not.",
      ],
      [name.endsWith("addl") ? `${name} x8, w9, w10, x11` : `${name} x8, w9, w10`],
    ),
  ),
  ...(["smulh", "umulh"] as const).map((name) =>
    entry(
      name,
      `Keep the upper 64 bits of a ${name === "smulh" ? "signed" : "unsigned"} 64 × 64-bit product.`,
      [`${name} Xd, Xn, Xm`],
      ["All operands must be x registers. General and zero registers are accepted; sp is not."],
      [`${name} x8, x9, x10`],
    ),
  ),
  ...(["sdiv", "udiv"] as const).map((name) =>
    entry(
      name,
      `${name === "sdiv" ? "Signed" : "Unsigned"} division: write Rn divided by Rm.`,
      [`${name} Rd, Rn, Rm`],
      [
        normalRegisters,
        "Division rounds towards zero. Division by zero produces zero; it does not raise an exception. sdiv of the most-negative value by −1 keeps that most-negative bit pattern.",
      ],
      [`${name} x8, x9, x10`],
    ),
  ),
  ...(
    [
      "ldr",
      "str",
      "ldrb",
      "strb",
      "ldrh",
      "strh",
      "ldrsb",
      "ldrsh",
      "ldrsw",
      "ldur",
      "stur",
    ] as const
  ).map((name) => {
    const load = name.startsWith("ld");
    const size = name.endsWith("b") ? 1 : name.endsWith("h") ? 2 : name === "ldrsw" ? 4 : null;
    const fixedW = ["ldrb", "strb", "ldrh", "strh"].includes(name);
    const unscaled = name === "ldur" || name === "stur";
    const register = name === "ldrsw" ? "Xt" : fixedW ? "Wt" : "Rt";
    return entry(
      name,
      `${load ? "Load from" : "Store to"} memory${size ? ` using ${size} byte${size === 1 ? "" : "s"}` : " using 4 bytes for w registers or 8 bytes for x registers"}.${name === "ldrsb" || name === "ldrsh" || name === "ldrsw" ? " Copy the loaded sign bit into the remaining destination bits." : ""}`,
      [
        `${name} ${register}, [Xn]`,
        `${name} ${register}, [Xn, #offset]`,
        ...(!unscaled
          ? [
              `${name} ${register}, [Xn, #offset]!`,
              `${name} ${register}, [Xn], #offset`,
              `${name} ${register}, [Xn, Xm]`,
            ]
          : []),
      ],
      [
        "The address base is an x register or sp, never xzr. The transferred register may be the zero register, never sp/wsp.",
        ...(fixedW
          ? ["The transferred register must use its w name."]
          : name === "ldrsw"
            ? ["The destination must use its x name."]
            : ["The transferred register may use its w or x name."]),
        unscaled
          ? "offset is a byte offset from −256 to 255. Register offsets and address writeback are not accepted."
          : `A plain byte offset is −256 to 255, or a non-negative multiple of the access size up to 4095 × the access size${size ? ` (${4095 * size})` : ""}. ! updates the base before access; a trailing offset updates it after access. Both updating forms require an offset from −256 to 255.`,
        ...(!unscaled
          ? [
              "A register offset uses Xm, optionally with lsl or sxtx, or Wm with uxtw or sxtw. The optional shift is 0 or log₂(access size): 0 for a byte, 1 for two bytes, 2 for four, 3 for eight. A zero-register index is accepted; sp/wsp are not.",
              "The plain offset form also accepts :lo12:label when the label’s low 12 address bits are a multiple of the access size. Literal loads such as ldr x8, =value are outside this browser subset.",
            ]
          : []),
        "Use a mapped address. Avoid writeback when the transferred register is also the base; some real-processor overlap cases have constrained behaviour.",
      ],
      [`${name} ${fixedW ? "w8" : "x8"}, [x9, #8]`],
    );
  }),
  ...(["ldp", "stp"] as const).map((name) =>
    entry(
      name,
      `${name === "ldp" ? "Load" : "Store"} two adjacent register-sized values.`,
      [
        `${name} Rt, Rt2, [Xn, #offset]`,
        `${name} Rt, Rt2, [Xn, #offset]!`,
        `${name} Rt, Rt2, [Xn], #offset`,
      ],
      [
        "Both transferred registers use the same width and may be zero registers, never sp/wsp. The base is an x register or sp, never xzr.",
        "For w registers, offset is a multiple of 4 from −256 to 252. For x registers, it is a multiple of 8 from −512 to 504. The offset may be omitted in the non-updating form.",
        "! updates the base before access; a trailing offset updates it afterwards. Register offsets and :lo12: are not accepted. Use mapped addresses and avoid transferred-register/base writeback overlaps or duplicate load destinations.",
      ],
      [`${name} x8, x10, [x9, #16]`],
    ),
  ),
  entry(
    "adr",
    "Write the address of a nearby label into a register.",
    ["adr Xd, label"],
    [
      "The destination is an x register or xzr, never sp. The label must be within −1048576 to 1048575 bytes of this instruction.",
    ],
    ["adr x8, .Lnear\n.Lnear:\nnop"],
  ),
  entry(
    "adrp",
    "Write the label’s 4096-byte page address into a register.",
    ["adrp Xd, label"],
    [
      "The destination is an x register or xzr, never sp. Do not prefix the label with #.",
      "Use add Xd, Xd, :lo12:label to add its position within the page. Real A64 limits the page-relative displacement to −4 GiB through +4 GiB − 4096; the browser assembler does not enforce that range.",
    ],
    ["adrp x8, .Lnear\nadd x8, x8, :lo12:.Lnear\n.Lnear:\nnop"],
  ),
  ...(["b", "bl", "b.cond", "cbz", "cbnz", "tbz", "tbnz"] as const).map((name) => {
    const testBit = name === "tbz" || name === "tbnz";
    const compareZero = name === "cbz" || name === "cbnz";
    const forms =
      name === "b.cond"
        ? ["b.cond label"]
        : testBit
          ? [`${name} Rt, #bit, label`]
          : compareZero
            ? [`${name} Rt, label`]
            : [`${name} label`];
    return entry(
      name,
      {
        b: "Continue execution at label.",
        bl: "Save the return address in x30 and continue at label.",
        "b.cond": "Branch if the existing flags satisfy cond.",
        cbz: "Branch if Rt is zero.",
        cbnz: "Branch if Rt is not zero.",
        tbz: "Branch if the selected register bit is zero.",
        tbnz: "Branch if the selected register bit is one.",
      }[name],
      forms,
      [
        "Define label in your program. A branch target must be 4-byte aligned.",
        name === "b" || name === "bl"
          ? "The target displacement is −134217728 to 134217724 bytes from this instruction."
          : testBit
            ? "The target displacement is −32768 to 32764 bytes from this instruction."
            : "The target displacement is −1048576 to 1048572 bytes from this instruction.",
        ...(name === "b.cond"
          ? [
              "Replace cond in the instruction name with a condition: for example, b.ne. Use one of the conditions defined in Reading the syntax.",
            ]
          : []),
        ...(testBit || compareZero
          ? [
              "Rt may be a general or zero register, using its w or x name. sp/wsp are not accepted. These instructions test the register directly without reading or writing flags.",
            ]
          : []),
        ...(testBit ? ["bit is 0–31 with a w name or 0–63 with an x name."] : []),
      ],
      [
        `${name === "b.cond" ? "b.ne" : name}${testBit ? " x8, #9," : compareZero ? " w8," : ""} .Lnext\n.Lnext:\nnop`,
      ],
    );
  }),
  ...(["br", "blr"] as const).map((name) =>
    entry(
      name,
      `${name === "blr" ? "Save the return address in x30, then branch" : "Branch"} to the address held in Xn.`,
      [`${name} Xn`],
      ["Use an x register or xzr, never sp. The address must be an aligned executable address."],
      [`${name} x9`],
    ),
  ),
  entry(
    "ret",
    "Return by branching to a register-held address.",
    ["ret", "ret Xn"],
    [
      "With no operand, ret branches to x30. An explicit operand is an x register or xzr, never sp. It must hold an aligned executable return address.",
    ],
    ["ret", "ret x9"],
  ),
  entry(
    "nop",
    "Advance to the next instruction without changing registers or flags.",
    ["nop"],
    ["No operands."],
    ["nop"],
  ),
].sort((a, b) => a.mnemonic.localeCompare(b.mnemonic));
