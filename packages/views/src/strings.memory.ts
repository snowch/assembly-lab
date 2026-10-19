// Copyright © 2026 Christopher Snow

// Module 6 memory figures. The matching prose is in docs/notes/module-6/prose.md.
export const MEMORY_STRINGS = {
  memory: "Memory bytes",
  element: (index: number) => `Element ${index}`,
  elementAddresses: "Each element groups its bytes in address order.",
  addresses: "Addresses increase from left to right, then continue on the next row.",
  byte: (addressHex: string, valueHex: string) => `Address ${addressHex}: byte ${valueHex}`,
  loaded: "Read by this instruction",
  stored: "Written by this instruction",
  storeSource: "Copied to memory",
  unchanged: "Not accessed by this instruction",
  registers: "Registers",
  transfer: "Where the instruction copies bits",
  sourceBits: (from: number, to: number) => `Bits ${from} to ${to}`,
  loadedBits: "Copied from memory",
  copiedBits: "Copied from the source register",
  zeroFill: "Filled with zeros",
  signFill: "Filled with copies of the sign bit",
  clearedUpper: "Cleared by writing a w register",
  register: (name: string) => `Register ${name}`,
  noTransfer: "This instruction does not load or store memory.",
  loadTransfer: (instruction: string, addressHex: string, count: number, registerName: string) =>
    `${instruction} reads ${count} ${count === 1 ? "byte" : "bytes"} starting at ${addressHex} into ${registerName}.`,
  storeTransfer: (instruction: string, addressHex: string, count: number, registerName: string) =>
    `${instruction} writes ${count} ${count === 1 ? "byte" : "bytes"} from ${registerName}, starting at ${addressHex}.`,
  memoryOutcome: (addressHex: string, bytesHex: string) =>
    `Memory starting at ${addressHex} contains ${bytesHex}.`,
  registerOutcome: (name: string, valueHex: string) => `${name} holds ${valueHex}.`,
  extensionTransfer: (instruction: string, sourceRegister: string, destinationRegister: string) =>
    `${instruction} copies low bits from ${sourceRegister} and extends them into ${destinationRegister}.`,
} as const;
