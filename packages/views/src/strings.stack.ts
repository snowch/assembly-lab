// Copyright © 2026 Christopher Snow

// Separately drafted figure copy; canonical text in docs/notes/module-9/prose.md.
export const STACK_STRINGS = {
  requiredCall: (name: string) =>
    `This run did not call ${name}. Use the supplied call structure so the function calls ${name} during this test.`,
  stack: "The active stack",
  empty: "No stack space is currently allocated by these functions.",
  lower: "The stack grows towards lower addresses.",
  frame: (name: string, bytes: number) => `${name}: ${bytes} bytes`,
  invocation: (number: number) => `Call ${number}`,
  savedRegister: (register: string) => `Saved ${register}`,
  returnTarget: (address: string, instruction: string) =>
    `x30 points to ${address}: ${instruction}`,
  returnOutside: (address: string) => `x30 points to ${address}, outside the instructions shown.`,
  address: (value: string) => `Address ${value}`,
  byte: (address: string, value: string) => `Address ${address}: byte ${value}`,
  position: "Instruction position",
  depth: (bytes: number) => `${bytes} bytes of stack space currently allocated`,
  active:
    "These bytes belong to the current calls. Restoring sp releases the space; it does not erase the stored bytes.",
  sp: "Stack pointer (sp)",
  instructions: "Instructions in this call sequence",
  savedValues: "Saved values in this frame",
  offsets: "Slot offsets count bytes from the first address of each frame.",
  inspectBytes: "Inspect individual bytes",
  noSavedValue: "Other frame space",
  frameRange: (first: string, last: string) => `Addresses ${first} to ${last}`,
  slotRange: (first: string, last: string) => `${first} to ${last}`,
  stored: "Written by this instruction",
  loaded: "Read by this instruction",
} as const;
