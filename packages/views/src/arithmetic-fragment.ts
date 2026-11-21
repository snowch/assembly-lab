// Copyright © 2026 Christopher Snow

import { z } from "zod";
import type { Challenge } from "@platform/lesson-schema";

const Fragment = z.object({
  kind: z.literal("arithmetic-fragment"),
  inputs: z.array(z.object({ register: z.string().regex(/^w[0-7]$/), name: z.string() })).min(1),
});

/** Application-owned exercise metadata; saved learner text is never rewritten. */
export function arithmeticFragment(challenge: Challenge) {
  const parsed = Fragment.safeParse(challenge.initial.data?.["exercise"]);
  return parsed.success ? parsed.data : null;
}

/** Append supplied termination after the learner's lines, preserving diagnostic line numbers.
 * Existing saved programs containing ret remain valid and unchanged in the editor.
 */
export function writtenProgram(challenge: Challenge, text: string): string {
  return arithmeticFragment(challenge) ? `${text}\nret` : text;
}
