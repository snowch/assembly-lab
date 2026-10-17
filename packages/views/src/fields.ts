// Copyright © 2026 Christopher Snow

// The field names a grader puts in a sentence ("“w0 …” and “w1 …” each need a whole number
// first"), shared by every grader so the sentence reads the same in every lesson.

import { VIEW_STRINGS as S } from "./strings";

/**
 * The detail of a failed answers test: the case's own sentence for each wrong field (`feedback.<field>`
 * in its `given`), and for a field with none the default sentence, which names the field and never
 * the right value. A failure with no detail makes the platform's card print empty labels.
 */
export function failureDetail(
  wrong: readonly string[],
  given: Readonly<Record<string, unknown>>,
  fieldName: (id: string) => string,
  format: (text: string) => string,
): string {
  return wrong
    .map((field) => {
      const own = format(String(given[`feedback.${field}`] ?? ""));
      return own !== "" ? own : S.grader.fieldNotRight(fieldName(field));
    })
    .join(" ");
}

/** Field names for a sentence: each in curly quotes, joined with commas and a final "and". */
export function fieldList(names: readonly string[]): string {
  const quoted = names.map((n) => `\u201c${n}\u201d`);
  const last = quoted.pop() as string;
  return quoted.length === 0 ? last : `${quoted.join(", ")} ${S.grader.and} ${last}`;
}
