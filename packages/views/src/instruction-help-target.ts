// Copyright © 2026 Christopher Snow

import { parseLine } from "./tap";

/** A public form identifier, never the learner's source or a challenge solution. */
export function instructionHelpForm(mnemonic: string, sourceLine: string): string {
  const text = sourceLine.replace(/^\s*[.\w$]+:\s*/, "").split("//")[0] ?? "";
  const line = parseLine(text);
  if (/^(ldr|str|ldur|stur|ldp|stp)/.test(mnemonic)) {
    if (/\]\s*!/.test(text)) return "pre-index";
    if (/\]\s*,/.test(text)) return "post-index";
    if (/\[[^,\]]+,\s*[wx](?:\d+|zr)/i.test(text)) return "register-offset";
    return /\[[^\]]*,/.test(text) ? "immediate-offset" : "base";
  }
  if (mnemonic === "adr" || mnemonic === "adrp") return "label";
  if (/^(ubfx|sbfx|ubfiz|sbfiz|bfi|bfxil)$/.test(mnemonic)) return "field";
  if (mnemonic === "sxtw") return "x-result";
  if (/^(sxtb|sxth|uxtb|uxth)$/.test(mnemonic)) {
    const xDestination = /^x/i.test(line.operands[0] ?? "");
    return xDestination ? (mnemonic.startsWith("s") ? "x-result" : "x-spelling") : "w-result";
  }
  if (mnemonic === "ret") return line.operands.length ? "register" : "default";
  if (line.operands.some((operand) => /^(?:uxt[bhwx]|sxt[bhwx])\b/i.test(operand)))
    return "extended-register";
  if (mnemonic === "b.cond") return "label-condition";
  if (mnemonic === "b" || mnemonic === "bl") return "label";
  if (mnemonic === "cbz" || mnemonic === "cbnz") return "register-label";
  if (mnemonic === "tbz" || mnemonic === "tbnz") return "register-bit-label";
  if (/^(csel|csinc|csinv|csneg|cset|csetm|cinc|cneg)$/.test(mnemonic)) return "register-condition";
  if (/^(smull|umull|smaddl|umaddl)$/.test(mnemonic)) return "widening-register";
  if (/^(movz|movn|movk)$/.test(mnemonic)) {
    return line.operands.length > 2 ? "shifted-immediate" : "immediate";
  }
  if (/\b(?:lsl|lsr|asr|ror)\s+#?[-+\d]/i.test(line.operands.at(-1) ?? "")) {
    const input = line.operands.at(-2) ?? "";
    return /^#?[-+]?(?:\d|0x)/i.test(input) ? "immediate" : "shifted-register";
  }
  if (/^(lsl|lsr|asr|ror)$/.test(mnemonic)) {
    return /^#?[-+]?(?:\d|0x)/i.test(line.operands.at(-1) ?? "") ? "immediate" : "register";
  }
  if (line.operands.some((operand) => /^#?[-+]?(?:\d|0x)/i.test(operand))) return "immediate";
  return "register";
}
