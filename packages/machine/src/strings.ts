// Copyright © 2026 Christopher Snow

// Every message the machine can show a learner, by key. The assembler's errors and the simulator's
// faults carry a key and parameters; the sentence is looked up here, so the words go through the
// prose process in one place. Every sentence is a DRAFT until that process has been through it.
// `{name}` is replaced by the parameter of that name; `text` is the line or operand at fault,
// exactly as the learner wrote it.

export const strings = {
  // --- reading a line
  "syntax.expression": "`{text}` is not a number or an address I can read.", // DRAFT
  "syntax.tooBig": "`{text}` is too big for 64 bits.", // DRAFT
  "syntax.divideByZero": "A number in this line is divided by zero.", // DRAFT
  "symbol.undefined": "There is no label called `{name}`.", // DRAFT
  "symbol.notNumber": "`{text}` is an address. Here the machine needs a plain number.", // DRAFT
  "label.duplicate": "The label `{name}` is already defined.", // DRAFT
  notInMachine: "The machine does not have `{text}`.", // DRAFT
  "gate.notYet": "You have not met `{name}` yet, so the machine will not take `{text}`.", // DRAFT
  "instruction.outsideText": "`{text}` is an instruction, so it must be in the text section.", // DRAFT
  "program.textTooBig": "The instructions are more than {limit} bytes. The text section is full.", // DRAFT
  "program.dataTooBig": "The data is more than {limit} bytes. The data sections are full.", // DRAFT

  // --- directives
  "directive.operands": "`{text}` is missing something, or has too much.", // DRAFT
  "directive.string": "`{text}` is not a string in double quotes.", // DRAFT
  "directive.negative": "`{text}` asks for a negative number of bytes.", // DRAFT
  "directive.alignment": "`{text}` is not an alignment the machine can use.", // DRAFT
  "section.bssNonZero": "`{text}` is not zero. The .bss section can only hold zeros.", // DRAFT

  // --- operands
  "operands.few": "`{text}` needs more operands.", // DRAFT
  "operands.many": "`{text}` has too many operands.", // DRAFT
  "operand.register": "`{text}` should be a register here.", // DRAFT
  "operand.noSp": "`{text}` cannot be the stack pointer here.", // DRAFT
  "operand.noZr": "`{text}` cannot be the zero register here.", // DRAFT
  "operand.width": "The registers in `{text}` must all be w registers or all be x registers.", // DRAFT
  "operand.immediate": "`{text}` should be a number here, not a register.", // DRAFT
  "operand.label": "`{text}` should be a label or an address here, not a register.", // DRAFT
  "operand.shift": "`{text}` should be a shift or an extend, such as `lsl 2` or `sxtw`.", // DRAFT
  "operand.condition": "`{text}` is not a condition such as `eq` or `lt`.", // DRAFT
  "operand.conditionAl": "`{text}` cannot be `al` here.", // DRAFT
  "operand.extendMissing":
    "`{text}` is a w register in an x instruction. Say how to extend it, such as `sxtw`.", // DRAFT
  "reloc.notHere": "`{text}` cannot be used here.", // DRAFT

  // --- shifts and extends
  "shift.notAllowed": "`{text}` is not a shift this instruction can take.", // DRAFT
  "shift.amountMissing": "`{text}` needs an amount.", // DRAFT
  "shift.range": "The amount in `{text}` must be from {min} to {max}.", // DRAFT
  "shift.onlyLsl": "`{text}` can only be `lsl` here.", // DRAFT
  "shift.multiple16": "The amount in `{text}` must be a multiple of 16.", // DRAFT
  "shift.zeroOr12": "The amount in `{text}` must be 0 or 12.", // DRAFT
  "shift.extendExpected": "`{text}` should be an extend such as `uxtw` or `sxtx`.", // DRAFT

  // --- immediates
  "immediate.range": "`{text}` must be from {min} to {max}.", // DRAFT
  "immediate.move": "No single instruction can put `{text}` in a register.", // DRAFT
  "immediate.addsub": "`{text}` must be from 0 to 4095, or a multiple of 4096 up to 16773120.", // DRAFT
  "immediate.bitmask": "`{text}` is not a pattern of bits this instruction can hold.", // DRAFT

  // --- memory operands
  "mem.syntax": "`{text}` is not a memory operand. Write it like `[x1, 8]`.", // DRAFT
  "mem.base": "`{text}` should be an x register or `sp`, holding an address.", // DRAFT
  "mem.preNeedsOffset": "`{text}` has `!` but no offset to add.", // DRAFT
  "mem.registerPre": "`{text}` cannot add an offset register and then update the base.", // DRAFT
  "mem.index": "`{text}` cannot be the offset register.", // DRAFT
  "mem.extend": "`{text}` is not an extend a load or store can use.", // DRAFT
  "mem.shiftMissing": "`{text}` needs an amount.", // DRAFT
  "mem.indexWidth":
    "`{text}` does not match: an x offset register takes `lsl` or `sxtx`, a w register takes `uxtw` or `sxtw`.", // DRAFT
  "mem.shiftAmount": "The amount in `{text}` must be 0 or {log}, for {size} bytes.", // DRAFT
  "mem.unscaledForm": "`{text}` cannot use an offset register.", // DRAFT
  "mem.indexMix": "`{text}` cannot have an offset inside the brackets and another after them.", // DRAFT
  "mem.postRegister": "`{text}` must be a number after the brackets, not a register.", // DRAFT
  "mem.unscaledWriteback": "`{text}` cannot also update the base register.", // DRAFT
  "mem.loMisaligned": "`{text}` is not a multiple of {size}.", // DRAFT
  "mem.offsetUnscaled": "`{text}` must be from -256 to 255.", // DRAFT
  "mem.offset": "`{text}` must be from -256 to 255, or a multiple of {size} up to {max}.", // DRAFT
  "mem.pairForm": "`{text}` cannot use an offset register with a pair.", // DRAFT
  "mem.multiple": "`{text}` must be a multiple of {size}.", // DRAFT

  // --- branches
  "branch.range": "`{text}` is too far away for this instruction to reach.", // DRAFT
  "branch.align": "`{text}` is not on an instruction boundary.", // DRAFT

  // --- the run
  "fault.address": "Line {line}, `{text}`, used the address {address}. No memory is there.", // DRAFT
  "fault.readInstruction":
    "Line {line}, `{text}`, read the address {address}, which holds an instruction. The machine does not keep instruction bytes.", // DRAFT
  "fault.storeText":
    "Line {line}, `{text}`, stored to the address {address}. That is in the instructions, which cannot be written.", // DRAFT
  "fault.storeRodata":
    "Line {line}, `{text}`, stored to the address {address}. That is read-only data.", // DRAFT
  "fault.notInstruction":
    "The run went to the address {address}, from line {line}, `{text}`. There is no instruction there.", // DRAFT
  "fault.entry": "The call starts at the address {address}. There is no instruction there.", // DRAFT
  "stop.returned": "The function returned.", // DRAFT
  "stop.limit": "The run stopped after {steps} instructions. It may be a loop that does not end.", // DRAFT
} as const;

export type MessageKey = keyof typeof strings;

/** The sentence for a key, with its parameters filled in. */
export function message(key: MessageKey, params: Record<string, string | number> = {}): string {
  return strings[key].replace(/\{(\w+)\}/g, (whole, name: string) => {
    const v = params[name];
    return v === undefined ? whole : String(v);
  });
}
