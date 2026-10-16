// Copyright © 2026 Christopher Snow

// The machine's sentences, read through one function. The assembler's errors and the simulator's
// faults carry a message key; the words are packages/machine/src/strings.ts's, so a later change
// of wording there needs no edit in the views.

import { message, type AsmError, type MessageKey, type StopReason } from "@al/machine";

export function sentence(key: MessageKey, params: Record<string, string | number> = {}): string {
  return message(key, params);
}

export function errorSentence(error: AsmError): string {
  return sentence(error.key, error.params);
}

/** The sentence for a run that did not return, or null for one that did. */
export function stopSentence(stop: StopReason): string | null {
  switch (stop.kind) {
    case "returned":
      return null;
    case "limit":
      return sentence("stop.limit", { steps: stop.steps });
    case "fault":
      return sentence(stop.key, stop.params);
  }
}
