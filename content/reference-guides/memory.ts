// Copyright © 2026 Christopher Snow

import type {
  ExplainedReferenceExample,
  InstructionFormGuide,
  ReferenceGuideFamily,
  ReferenceWatch,
} from "./types";

const memoryNames = [
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
] as const;
type MemoryName = (typeof memoryNames)[number];

function properties(name: MemoryName) {
  const load = name.startsWith("ld");
  const fixedW = ["ldrb", "strb", "ldrh", "strh"].includes(name);
  const signed = ["ldrsb", "ldrsh", "ldrsw"].includes(name);
  const bytes = name.endsWith("b") ? 1 : name.endsWith("h") ? 2 : name === "ldrsw" ? 4 : 8;
  return {
    load,
    fixedW,
    signed,
    bytes,
    unscaled: name === "ldur" || name === "stur",
    register: fixedW ? "w8" : "x8",
    placeholder: name === "ldrsw" ? "Xt" : fixedW ? "Wt" : "Rt",
  };
}

function sampleData(signed = false): string {
  return `.data
.balign 16
.Ldata:
.quad ${signed ? "-11" : "45"}
.Lvalue:
.quad ${signed ? "-19" : "67"}
.Lend:
.quad ${signed ? "-39" : "89"}
.quad 103, 125, 147`;
}

function memoryExample(
  name: MemoryName,
  id: string,
  address: string,
  prepareAddress: string,
  explanation: string,
  extraWatch: readonly ReferenceWatch[] = [],
  register?: string,
): ExplainedReferenceExample {
  const p = properties(name);
  const rt = register ?? p.register;
  const accessBytes =
    ["ldr", "str", "ldur", "stur"].includes(name) && rt.startsWith("w") ? 4 : p.bytes;
  return {
    id: `${name}-${id}`,
    setup: `${prepareAddress}\n${p.load ? `mov ${rt}, #0` : name === "strb" ? `mov ${rt}, #309` : name === "strh" ? `movz ${rt}, #1, lsl #16\nmovk ${rt}, #53` : `mov ${rt}, #53`}`,
    instruction: `${name} ${rt}, ${address}`,
    data: sampleData(p.signed),
    watch: [
      { kind: "register", name: "x9", reading: "hex" },
      ...extraWatch,
      { kind: "register", name: rt, reading: p.signed ? "signed" : "unsigned" },
      {
        kind: "memory",
        symbol: ".Lvalue",
        bytes: accessBytes,
        reading: p.signed ? "signed" : "unsigned",
      },
    ],
    explanation,
  };
}

function transferredRule(name: MemoryName): string {
  const p = properties(name);
  if (p.fixedW) {
    return `${p.load ? "The destination" : "The stored input"} uses a w name. The instruction transfers only ${p.bytes === 1 ? "one byte" : "two bytes"}.`;
  }
  if (name === "ldrsw") {
    return "The destination uses an x name. The instruction reads four bytes, then copies their sign bit into the remaining destination bits.";
  }
  if (p.signed) {
    return `The destination may use a w or x name. The instruction reads ${p.bytes === 1 ? "one byte" : "two bytes"}, then copies the loaded sign bit into the remaining destination bits.`;
  }
  return "A w name transfers four bytes; an x name transfers eight bytes. The address is still held in an x register.";
}

function memoryGuides(name: MemoryName): readonly InstructionFormGuide[] {
  const p = properties(name);
  const transfer = `${name} ${p.placeholder}`;
  const noBaseWriteback = p.load
    ? "This form does not write an adjusted address back to the base. If the load also names that register as its destination, the loaded value replaces its contents."
    : "This form does not write an adjusted address back to the base. The store leaves the base register unchanged.";
  const baseRules = [
    "Xn holds the memory address. Use an x register or sp as the base, not a w register or xzr.",
    transferredRule(name),
    noBaseWriteback,
    p.load
      ? "The load writes its destination. It leaves the stored bytes unchanged."
      : "The store reads its input and writes memory. It leaves the input register unchanged.",
  ];
  const advancedRules = [
    "The transferred register may be the zero register, but not sp or wsp. A zero-register load discards the loaded value; a zero-register store writes zero bits.",
    "The address must name memory available to this program. An encodable address expression does not guarantee that the address is mapped.",
  ];
  const effect = p.load
    ? p.signed
      ? "The load copies the stored value into the wider destination, extending the loaded sign bit. In this example, x9 and the stored bytes stay unchanged."
      : "The load reads at the base address and writes the destination. In this example, x9 is not the destination and stays unchanged."
    : "The store writes the input's low bits to memory at the base address. The input and base registers stay unchanged.";
  const forms: InstructionFormGuide[] = [
    {
      id: "base",
      title: "Memory at the base address",
      syntax: [`${transfer}, [Xn]`],
      rules: baseRules,
      advancedRules,
      examples: [
        memoryExample(name, "base", "[x9]", "adr x9, .Lvalue", effect),
        ...(["ldr", "str", "ldur", "stur", "ldrsb", "ldrsh"].includes(name)
          ? [
              memoryExample(
                name,
                "base-w",
                "[x9]",
                "adr x9, .Lvalue",
                p.load
                  ? "The w destination selects a 32-bit register write. The instruction's load size still follows its mnemonic."
                  : "The w input makes this store transfer four bytes. The rest of memory stays unchanged.",
                [],
                "w8",
              ),
            ]
          : []),
      ],
      mistakes: [
        {
          source: `${name} ${p.register}, [w9]`,
          errorKey: "mem.base",
          explanation:
            "A w name selects a 32-bit register value. A memory base needs the full address in an x register, even when the transferred data uses a w name.",
        },
      ],
    },
    {
      id: "immediate-offset",
      title: p.unscaled ? "Add a signed byte offset" : "Add a fixed byte offset",
      syntax: [`${transfer}, [Xn, #offset]`],
      rules: [
        "Add offset to the base to find the address. The offset counts bytes.",
        noBaseWriteback,
        transferredRule(name),
        p.unscaled
          ? "offset is from −256 to 255. This instruction always uses that signed byte range."
          : `offset may be from −256 to 255. Larger non-negative offsets must be a multiple of the access size, at most 4095 times that size. For this example's ${p.bytes}-byte transfer, that larger range ends at ${4095 * p.bytes}.`,
      ],
      advancedRules: [
        ...advancedRules,
        ...(!p.unscaled
          ? [
              "A :lo12:label offset uses the label's low address bits. They must be a multiple of the access size. This relocation is an assembler calculation, not a value loaded from memory.",
            ]
          : []),
      ],
      examples: [
        memoryExample(
          name,
          "offset-positive",
          "[x9, #8]",
          "adr x9, .Ldata",
          p.load
            ? "The load reads after adding the byte offset to x9. Here, x8 receives the loaded value and x9 stays unchanged."
            : "The store writes after adding the byte offset to x9. It leaves x9 and its input register unchanged.",
        ),
        memoryExample(
          name,
          "offset-negative",
          "[x9, #-8]",
          "adr x9, .Lend",
          "A negative byte offset selects memory before the base address. In this example, the transfer does not write x9.",
        ),
      ],
      mistakes: [
        {
          source: `${name} ${p.register}, [x9, #${p.unscaled ? "256" : String(4096 * p.bytes)}]`,
          errorKey: p.unscaled ? "mem.offsetUnscaled" : "mem.offset",
          explanation: p.unscaled
            ? "This byte offset is above the signed range. A larger register width does not enlarge the offset field."
            : "This offset is one access-size step beyond the largest scaled offset. The base register may hold a larger address, but the instruction cannot encode this offset.",
        },
      ],
    },
  ];
  if (p.unscaled) return forms;
  forms.push(
    {
      id: "pre-index",
      title: "Update the base before access",
      syntax: [`${transfer}, [Xn, #offset]!`],
      advanced: true,
      rules: [
        "The ! means write the adjusted address back to Xn. Add the offset first, then access memory at that new address.",
        "offset is a byte count from −256 to 255. Include the offset even when it is zero.",
        transferredRule(name),
      ],
      advancedRules: [
        ...advancedRules,
        "Use different registers for the base and transferred value. Some real-processor writeback overlaps have constrained behaviour.",
      ],
      examples: [
        memoryExample(
          name,
          "pre-index",
          "[x9, #8]!",
          "adr x9, .Ldata",
          "The base changes to the address of .Lvalue before the memory access. The transfer uses that updated address.",
        ),
      ],
      mistakes: [
        {
          source: `${name} ${p.register}, [x9, #256]!`,
          errorKey: "mem.offsetUnscaled",
          explanation:
            "An updating form uses the signed byte-offset range. It cannot use the larger scaled range of a non-updating form.",
        },
      ],
    },
    {
      id: "post-index",
      title: "Update the base after access",
      syntax: [`${transfer}, [Xn], #offset`],
      advanced: true,
      rules: [
        "Access memory at the original base address first. Then add the trailing offset and write the new address back to Xn.",
        "offset is a byte count from −256 to 255. Put it after the closing bracket.",
        transferredRule(name),
      ],
      advancedRules: [
        ...advancedRules,
        "Use different registers for the base and transferred value. Do not put another offset inside the brackets.",
      ],
      examples: [
        memoryExample(
          name,
          "post-index",
          "[x9], #8",
          "adr x9, .Lvalue",
          "The transfer uses the original address of .Lvalue. Only after the access does x9 advance to the following location.",
        ),
      ],
      mistakes: [
        {
          source: `${name} ${p.register}, [x9, #8], #8`,
          errorKey: "mem.indexMix",
          explanation:
            "Choose one address form. A post-indexed instruction places its offset after the brackets and has no offset inside them.",
        },
      ],
    },
    {
      id: "register-offset",
      title: "Add an offset held in a register",
      syntax: [
        `${transfer}, [Xn, Xm]`,
        `${transfer}, [Xn, Xm, lsl #amount]`,
        `${transfer}, [Xn, Wm, uxtw #amount]`,
        `${transfer}, [Xn, Wm, sxtw #amount]`,
      ],
      advanced: true,
      rules: [
        "Add the offset register to the base to find the address. The address calculation does not write either input register.",
        ...(p.load
          ? [
              "If the base or offset register is also the load's destination, that register receives the loaded value.",
            ]
          : []),
        "An x offset uses lsl or sxtx. A w offset needs uxtw to extend with zeros, or sxtw to extend its sign bit, before the address calculation.",
        p.bytes === 1
          ? "A byte access accepts only shift amount 0. The register offset already counts individual bytes."
          : `The optional shift multiplies the offset by a power of two. Use amount 0 or ${Math.log2(p.bytes)} for this example's ${p.bytes}-byte access.`,
        "For other access sizes, the non-zero shift is 1 for two bytes, 2 for four bytes or 3 for eight bytes.",
        transferredRule(name),
      ],
      advancedRules,
      examples: [
        memoryExample(
          name,
          "register-offset",
          "[x9, x10]",
          "adr x9, .Ldata\nmov x10, #8",
          "The offset in x10 counts bytes. In this example, add it to x9 for the access; neither address input is written.",
          [{ kind: "register", name: "x10" }],
        ),
        memoryExample(
          name,
          "register-scaled",
          `[x9, x10, lsl #${Math.log2(p.bytes)}]`,
          `adr x9, .Ldata\nmov x10, #${8 / p.bytes}`,
          "Shift the index before adding it to the base. This lets an index count transferred elements while the address calculation still counts bytes.",
          [{ kind: "register", name: "x10" }],
        ),
        memoryExample(
          name,
          "register-zero-extended",
          `[x9, w10, uxtw #${Math.log2(p.bytes)}]`,
          `adr x9, .Ldata\nmov w10, #${8 / p.bytes}`,
          "Extend the w index with zeros, then scale it for the access size. The w spelling selects the index's low 32 bits, not the base width.",
          [{ kind: "register", name: "w10" }],
        ),
        memoryExample(
          name,
          "register-sign-extended",
          `[x9, w10, sxtw #${Math.log2(p.bytes)}]`,
          `adr x9, .Lvalue\nadd x9, x9, #${p.bytes}\nmov w10, #-1`,
          "Sign-extension preserves the negative index. After scaling, it selects memory before the base address; this example does not write x9.",
          [{ kind: "register", name: "w10", reading: "signed" }],
        ),
      ],
      mistakes: [
        {
          source: `${name} ${p.register}, [x9, w10]`,
          errorKey: "mem.indexWidth",
          explanation:
            "A w offset must say how to extend its bits to the address width. Write uxtw or sxtw after that register.",
        },
      ],
    },
  );
  return forms;
}

function pairGuides(name: "ldp" | "stp"): readonly InstructionFormGuide[] {
  const load = name === "ldp";
  const common = [
    "The transferred registers use matching w or x names. A pair of w registers transfers two four-byte values; a pair of x registers transfers two eight-byte values.",
    "Xn is an x register or sp. Pair offsets count bytes and must be a multiple of the size of one transferred register.",
    "For w registers, offsets are −256 to 252 in steps of 4. For x registers, offsets are −512 to 504 in steps of 8.",
  ];
  const noBaseWriteback = load
    ? "This form does not write an adjusted address back to the base. If the base register is also a load destination, it receives the loaded value."
    : "This form does not update the base register.";
  const advancedRules = [
    "Transferred registers may be zero registers, but not sp or wsp. A zero-register load discards that value; a zero-register store writes zero bits.",
    "Use memory mapped to this program. Avoid base/transferred-register writeback overlaps and duplicate destinations in a load pair.",
    "Pair instructions do not accept register offsets or :lo12: offsets.",
  ];
  const example = (
    id: string,
    operand: string,
    base: string,
    explanation: string,
  ): ExplainedReferenceExample => ({
    id: `${name}-${id}`,
    setup: `adr x9, ${base}\nmov x8, #${load ? "0" : "53"}\nmov x10, #${load ? "0" : "79"}`,
    instruction: `${name} x8, x10, ${operand}`,
    data: sampleData(),
    watch: [
      { kind: "register", name: "x9", reading: "hex" },
      { kind: "register", name: "x8" },
      { kind: "register", name: "x10" },
      { kind: "memory", symbol: ".Lvalue", bytes: 8 },
      { kind: "memory", symbol: ".Lend", bytes: 8 },
    ],
    explanation,
  });
  return [
    {
      id: "base",
      title: "Two values at the base address",
      syntax: [`${name} Rt, Rt2, [Xn]`],
      rules: [
        ...common,
        "With no offset, transfer the first value at Xn and the second immediately after it.",
        noBaseWriteback,
      ],
      advancedRules,
      examples: [
        example(
          "base",
          "[x9]",
          ".Lvalue",
          load
            ? "The first adjacent value goes to x8 and the next to x10. In this example, x9 is not a destination and stays unchanged."
            : "The first input goes to .Lvalue and the second to the adjacent .Lend location. The base and input registers do not change.",
        ),
        {
          id: `${name}-base-w`,
          setup: `adr x9, .Lvalue\nmov w8, #${load ? "0" : "53"}\nmov w10, #${load ? "0" : "79"}`,
          instruction: `${name} w8, w10, [x9]`,
          data: ".data\n.balign 16\n.Lvalue:\n.word 67\n.Lend:\n.word 89\n.word 103, 125",
          watch: [
            { kind: "register", name: "x9", reading: "hex" },
            { kind: "register", name: "w8" },
            { kind: "register", name: "w10" },
            { kind: "memory", symbol: ".Lvalue", bytes: 4 },
            { kind: "memory", symbol: ".Lend", bytes: 4 },
          ],
          explanation:
            "The w names make each adjacent value four bytes wide. In this example, x9 still holds the address and is not written.",
        },
      ],
      mistakes: [
        {
          source: `${name} x8, w10, [x9]`,
          errorKey: "operand.width",
          explanation:
            "Both transferred registers need the same width. Mixing an x name and a w name does not describe one pair size.",
        },
      ],
    },
    {
      id: "immediate-offset",
      title: "Two values after a fixed offset",
      syntax: [`${name} Rt, Rt2, [Xn, #offset]`],
      rules: [
        ...common,
        "Add the byte offset to Xn for the first access. Transfer the second value immediately after the first.",
        noBaseWriteback,
      ],
      advancedRules,
      examples: [
        example(
          "immediate-offset",
          "[x9, #8]",
          ".Ldata",
          "The offset selects the first value of the pair. The second access follows it by one register-sized value, not by another copy of the offset.",
        ),
      ],
      mistakes: [
        {
          source: `${name} x8, x10, [x9, #4]`,
          errorKey: "mem.multiple",
          explanation:
            "An x pair transfers eight-byte values, so its encoded offset must be a multiple of eight. This rule applies even when the numerical address would be mapped.",
        },
      ],
    },
    {
      id: "pre-index",
      title: "Update the base before the pair",
      syntax: [`${name} Rt, Rt2, [Xn, #offset]!`],
      advanced: true,
      rules: [
        ...common,
        "Add the offset and write the new base first. Transfer the two adjacent values starting at that updated address.",
      ],
      advancedRules,
      examples: [
        example(
          "pre-index",
          "[x9, #8]!",
          ".Ldata",
          "x9 first moves to .Lvalue. Both transfers use the pair beginning at that new address.",
        ),
      ],
      mistakes: [
        {
          source: `${name} x8, x10, [x9, #512]!`,
          errorKey: "immediate.range",
          explanation:
            "This x-pair offset is beyond the largest encodable positive offset. Pair writeback uses the pair's scaled range, not the single-register signed byte range.",
        },
      ],
    },
    {
      id: "post-index",
      title: "Update the base after the pair",
      syntax: [`${name} Rt, Rt2, [Xn], #offset`],
      advanced: true,
      rules: [
        ...common,
        "Transfer the pair at the original base first. Then add the trailing byte offset and write the new base.",
      ],
      advancedRules,
      examples: [
        example(
          "post-index",
          "[x9], #16",
          ".Lvalue",
          "Both accesses happen before x9 moves. The trailing offset then advances the base past this pair of x-register values.",
        ),
      ],
      mistakes: [
        {
          source: `${name} x8, x10, [x9, #8], #16`,
          errorKey: "mem.indexMix",
          explanation:
            "A post-indexed pair has its offset after the brackets. It cannot also contain an offset inside them.",
        },
      ],
    },
  ];
}

export const MEMORY_GUIDES: ReferenceGuideFamily = {
  ...Object.fromEntries(memoryNames.map((name) => [name, memoryGuides(name)])),
  ldp: pairGuides("ldp"),
  stp: pairGuides("stp"),
  adr: [
    {
      id: "label",
      title: "Address of a nearby label",
      syntax: ["adr Xd, label"],
      rules: [
        "The instruction writes the label's address, not the bytes stored there. Use an x destination, not a w name or sp.",
        "The label must be from −1048576 to 1048575 bytes away from this instruction. The browser and the native examples use the same fixed program layout.",
      ],
      advancedRules: ["xzr is an accepted destination, but discards the address."],
      examples: [
        {
          id: "adr-label",
          setup: "mov x8, #0",
          instruction: "adr x8, .Lvalue",
          data: sampleData(),
          watch: [
            { kind: "register", name: "x8", reading: "hex" },
            { kind: "address", symbol: ".Lvalue" },
          ],
          explanation:
            "The destination becomes the address named by .Lvalue. No load occurs; the memory contents are not copied into x8.",
        },
      ],
      mistakes: [
        {
          source: "adr w8, 0",
          errorKey: "operand.width",
          explanation:
            "An address needs an x-register destination. This instruction has no w-destination form.",
        },
      ],
    },
  ],
  adrp: [
    {
      id: "label",
      title: "Page containing a label",
      syntax: ["adrp Xd, label"],
      rules: [
        "The instruction writes the start address of the label's 4096-byte page. It clears the low 12 address bits; it does not load memory.",
        "Use an x destination, not a w name or sp. Write the label without a # prefix.",
      ],
      advancedRules: [
        "xzr is an accepted destination, but discards the page address.",
        "An add with :lo12:label can supply the label's position within that page. ADRP alone does not supply those low bits.",
        "Real A64 limits the page-relative displacement to −4 GiB through +4 GiB −4096 bytes. The browser assembler does not enforce that range.",
      ],
      examples: [
        {
          id: "adrp-label",
          setup: "mov x8, #0",
          instruction: "adrp x8, .Lvalue",
          data: sampleData(),
          watch: [
            { kind: "register", name: "x8", reading: "hex" },
            { kind: "address", symbol: ".Lvalue" },
          ],
          explanation:
            "The destination holds the page start. Compare it with the full label address: ADRP leaves out the label's position within that page.",
        },
      ],
      mistakes: [
        {
          source: "adrp w8, 0",
          errorKey: "operand.width",
          explanation:
            "A page address still uses an x register. Changing the destination spelling to w does not shorten the ADRP form.",
        },
      ],
    },
  ],
};
