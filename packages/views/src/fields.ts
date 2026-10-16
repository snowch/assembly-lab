// Copyright © 2026 Christopher Snow

// The field names a grader puts in a sentence ("“w0 …” and “w1 …” each need a whole number
// first"), shared by every grader so the sentence reads the same in every lesson.

import { VIEW_STRINGS as S } from "./strings";

/** Field names for a sentence: each in curly quotes, joined with commas and a final "and". */
export function fieldList(names: readonly string[]): string {
  const quoted = names.map((n) => `\u201c${n}\u201d`);
  const last = quoted.pop() as string;
  return quoted.length === 0 ? last : `${quoted.join(", ")} ${S.grader.and} ${last}`;
}
