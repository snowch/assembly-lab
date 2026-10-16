// Copyright © 2026 Christopher Snow

// Every message the machine can show a learner, by key. The assembler's errors and the simulator's
// faults carry a key and parameters; the sentence is looked up here, so the words go through the
// prose process in one place. Every sentence was redrafted by Haiku from the engineer's draft
// and checked for meaning (16 October 2026); a new one is marked DRAFT until it has been through
// the same process.
// `{name}` is replaced by the parameter of that name; `text` is the line or operand at fault,
// exactly as the learner wrote it.

export const strings = {
  // --- reading a line
  "syntax.expression": "`{text}` is not a number or a name the course's assembler can read.",
  "syntax.tooBig": "`{text}` is too big for 64 bits.",
  "syntax.missingComma":
    "`{text}` needs a comma after `{after}`. Operands are separated by commas.",
  "syntax.divideByZero": "This line divides a number by zero.",
  "symbol.undefined": "There is no label called `{name}`.",
  "symbol.notNumber":
    "`{text}` is a label, which names a place in memory, but here the course's assembler needs a plain number.",
  "label.duplicate": "The label `{name}` is already defined.",
  notInMachine: "The course's simulator does not have `{text}`.",
  "gate.notYet": "You have not met `{name}` yet, so the course's assembler will not take `{text}`.",
  // DRAFT: `{allowed}` is the instructions the program may use, from `nameList`.
  "gate.notAllowedHere": "This challenge allows only {allowed}.",
  "instruction.outsideText": "`{text}` is an instruction, so it must be in the text section.",
  "program.textTooBig": "The instructions are more than {limit} bytes. The text section is full.",
  "program.dataTooBig": "The data is more than {limit} bytes. The data sections are full.",

  // --- directives
  "directive.operands": "`{text}` is missing something, or has too much.",
  "directive.string": "`{text}` is not a string in double quotes.",
  "directive.negative": "`{text}` asks for a negative number of bytes.",
  "directive.alignment": "`{text}` is not an alignment the machine can use.",
  "section.bssNonZero": "`{text}` is not zero. The .bss section can hold only zeros.",

  // --- operands
  "operands.few": "`{text}` needs more operands.",
  "operands.many": "`{text}` has too many operands.",
  "operand.register": "`{text}` should be a register here.",
  "operand.noSp": "`{text}` cannot be the stack pointer here.",
  "operand.noZr": "`{text}` cannot be the zero register here.",
  "operand.width": "The registers in `{text}` must all be w registers or all be x registers.",
  "operand.immediate": "`{text}` should be a number here, not a register.",
  "operand.label": "`{text}` should be a label or an address here, not a register.",
  "operand.shift": "`{text}` should be a shift or an extend, such as `lsl 2` or `sxtw`.",
  "operand.condition": "`{text}` is not a condition such as `eq` or `lt`.",
  "operand.conditionAl": "`{text}` cannot be `al` here.",
  "operand.extendMissing":
    "`{text}` is a w register in an x instruction. Say how to extend it, such as `sxtw`.",
  "reloc.notHere": "`{text}` cannot be used here.",

  // --- shifts and extends
  "shift.notAllowed": "`{text}` is not a shift this instruction can take.",
  "shift.amountMissing": "`{text}` needs an amount.",
  "shift.range": "The amount in `{text}` must be from {min} to {max}.",
  "shift.onlyLsl": "`{text}` can only be `lsl` here.",
  "shift.multiple16": "The amount in `{text}` must be a multiple of 16.",
  "shift.zeroOr12": "The amount in `{text}` must be 0 or 12.",
  "shift.extendExpected": "`{text}` should be an extend such as `uxtw` or `sxtx`.",

  // --- immediates
  "immediate.range": "`{text}` must be from {min} to {max}.",
  "immediate.move": "No single instruction can put `{text}` in a register.",
  "immediate.addsub": "`{text}` must be from 0 to 4095, or a multiple of 4096 up to 16773120.",
  "immediate.bitmask": "`{text}` is not a pattern of bits this instruction can hold.",

  // --- memory operands
  "mem.syntax": "`{text}` is not a memory operand. Write it like `[x1, 8]`.",
  "mem.base": "`{text}` should be an x register or `sp`. The register must hold an address.",
  "mem.preNeedsOffset": "`{text}` has `!` but no offset to add.",
  "mem.registerPre": "`{text}` cannot add an offset register and then update the base.",
  "mem.index": "`{text}` cannot be the offset register.",
  "mem.extend": "`{text}` is not an extend a load or store can use.",
  "mem.shiftMissing": "`{text}` needs an amount.",
  "mem.indexWidth":
    "`{text}` does not match. An x offset register takes `lsl` or `sxtx`, and a w register takes `uxtw` or `sxtw`.",
  "mem.shiftAmount": "The amount in `{text}` must be 0 or {log}, for {size} bytes.",
  "mem.unscaledForm": "`{text}` cannot use an offset register.",
  "mem.indexMix": "`{text}` cannot have an offset inside the brackets and another after them.",
  "mem.postRegister": "`{text}` must be a number after the brackets, not a register.",
  "mem.unscaledWriteback": "`{text}` cannot also update the base register.",
  "mem.loMisaligned": "`{text}` is not a multiple of {size}.",
  "mem.offsetUnscaled": "`{text}` must be from -256 to 255.",
  "mem.offset": "`{text}` must be from -256 to 255, or a multiple of {size} up to {max}.",
  "mem.pairForm": "`{text}` cannot use an offset register in a pair instruction.",
  "mem.multiple": "`{text}` must be a multiple of {size}.",

  // --- branches
  "branch.range": "`{text}` is too far away for this instruction to reach.",
  "branch.align": "`{text}` is not on an instruction boundary.",

  // --- the run
  "fault.address":
    "Line {line}, `{text}`, used the address {address}. No memory is at that address.",
  "fault.readInstruction":
    "Line {line}, `{text}`, read the address {address}, which holds an instruction. The machine does not keep instruction bytes.",
  "fault.storeText":
    "Line {line}, `{text}`, stored to the address {address}. The address is in the instructions, which cannot be written.",
  "fault.storeRodata":
    "Line {line}, `{text}`, stored to the address {address}. That address is in read-only data.",
  "fault.notInstruction":
    "An address is the number that names a place in memory. The run went to the address {address}, from line {line}, `{text}`. No instruction is at that address.",
  "fault.ranOffEnd":
    "The run went past the end of the instructions without running a `ret`. The last instruction it ran was line {line}, `{text}`.",
  "fault.entry": "The call starts at the address {address}. No instruction is at that address.",
  "stop.returned": "The function returned.",
  "stop.limit": "The run stopped after {steps} instructions. It may be a loop that does not end.",
} as const;

export type MessageKey = keyof typeof strings;

/** DRAFT: the word that joins the last two names of a list in a sentence. */
const AND = "and";

/** Names as code in a sentence: "`mov`", "`mov` and `ret`", "`mov`, `movk` and `ret`". */
export function nameList(names: readonly string[]): string {
  const coded = names.map((n) => `\`${n}\``);
  const last = coded.pop() ?? "";
  return coded.length === 0 ? last : `${coded.join(", ")} ${AND} ${last}`;
}

/** The sentence for a key, with its parameters filled in. */
export function message(key: MessageKey, params: Record<string, string | number> = {}): string {
  return strings[key].replace(/\{(\w+)\}/g, (whole, name: string) => {
    const v = params[name];
    return v === undefined ? whole : String(v);
  });
}
