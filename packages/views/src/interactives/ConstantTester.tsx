// Copyright © 2026 Christopher Snow

// `mov w0, ` followed by a number the learner types. Each time the number changes, the course's
// assembler is asked to assemble the line. If it does, the line is run and `w0` is drawn as the
// model left it; if it does not, the page says what the assembler said. Nothing here decides which
// numbers fit: the assembler does. A figure that names a prediction stays shut until it is checked.

import { useMemo, useState } from "react";
import { z } from "zod";

import { TEXT_BASE, assemble, run } from "@al/machine";
import { useSlot } from "@platform/lesson-runtime";

import { errorSentence } from "../messages";
import { RegisterRow, withCode } from "../parts";
import { VIEW_STRINGS as S } from "../strings";
import { wValue } from "../trace";
import { withProps } from "./props";

const Props = z.object({
  /** The id of a prediction in this lesson. The figure stays shut until it has been checked. */
  after: z.string().optional(),
});

/** What the typed text is, before the assembler is asked: a whole number in decimal or hexadecimal. */
const NUMBER = /^[+-]?(0x[0-9a-f]+|\d+)$/i;

type Result =
  | { readonly kind: "empty" }
  | { readonly kind: "not-a-number" }
  | { readonly kind: "refused"; readonly sentence: string }
  | { readonly kind: "one"; readonly w0: number };

/** Assemble `mov w0, <text>` and, if it assembles, run it. */
export function tryMov(text: string): Result {
  const typed = text.trim();
  if (typed === "") return { kind: "empty" };
  if (!NUMBER.test(typed)) return { kind: "not-a-number" };
  const { program, errors } = assemble(`mov w0, ${typed}\nret\n`);
  if (program === null) {
    const first = errors[0];
    return { kind: "refused", sentence: first ? errorSentence(first) : "" };
  }
  const result = run(program, { entry: TEXT_BASE });
  return { kind: "one", w0: wValue(result.final, 0) };
}

export const ConstantTester = withProps(Props, function ConstantTester({ data, store }) {
  const [text, setText] = useState("");
  const [prediction] = useSlot<{ choice: string }>(store, data.after ?? "");
  const result = useMemo(() => tryMov(text), [text]);
  if (data.after !== undefined && prediction === undefined) {
    return (
      <p role="note" className="al-locked">
        {S.stepper.locked}
      </p>
    );
  }
  return (
    <div className="al-figure al-tester" data-figure="constant-tester" data-result={result.kind}>
      <label className="al-tester-line">
        <code className="al-tester-code">mov w0,</code>
        <input
          type="text"
          className="al-tester-input"
          aria-label={S.tester.input}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </label>
      <div className="al-tester-result" role="status">
        {result.kind === "empty" && <p>{withCode(S.tester.empty)}</p>}
        {result.kind === "not-a-number" && <p>{S.tester.notNumber}</p>}
        {result.kind === "refused" && <p className="al-nomatch">{withCode(result.sentence)}</p>}
        {result.kind === "one" && (
          <p className="al-match">{withCode(S.tester.fits(text.trim()))}</p>
        )}
      </div>
      {result.kind === "one" && <RegisterRow name="w0" value={result.w0} changed />}
    </div>
  );
});
