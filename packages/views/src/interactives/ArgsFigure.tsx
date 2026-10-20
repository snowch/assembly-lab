// Copyright © 2026 Christopher Snow
// The four arguments of the C function beside the registers they arrive in: one column each, the
// parameter above the register it lands in, a short arrow between them. The mapping is the whole
// figure; the Investigation's simulator below shows what each instruction then does. Nothing of
// the first instruction's result is drawn until the prediction named by `after` has been checked:
// the reveal then shows `w0` before and after, both as the C names the values and as the number
// the model computed, so the words are backed by a run and not by a claim in the lesson.
import { useMemo } from "react";
import { z } from "zod";
import { Prose, useSlot } from "@platform/lesson-runtime";
import { traceOf, viewAt, wValue } from "../trace";
import { MODULE0_STRINGS as M0 } from "../strings.module0";
import { CallSchema, RecordedSchema, withProps } from "./props";

const Props = z.object({
  /** The C parameter names, in the order the C declares them: each arrives in the next `w` register. */
  params: z.array(z.string().min(1)).min(1).max(8),
  /** The program and call the first instruction belongs to; the model computes the reveal. */
  program: RecordedSchema,
  call: CallSchema,
  /** The id of a prediction in this lesson. The reveal waits until it has been checked. */
  after: z.string().optional(),
  /** Markdown: the sentence that introduces the first instruction, naming it in backticks. */
  says: z.string(),
  /** Markdown: the sentence between the instruction and the prediction's own question. */
  question: z.string(),
  /** The register the first instruction writes, how the C names its value before and after, and
   * Markdown: the sentence that explains the change once the prediction has been checked. */
  reveal: z.object({
    register: z.number().int().min(0),
    before: z.string(),
    after: z.string(),
    explain: z.string(),
  }),
});

export const ArgsFigure = withProps(Props, function ArgsFigure({ data, store }) {
  const [prediction] = useSlot<{ choice: string }>(store, data.after ?? "");
  // The numbers come from a run of the model, made only once a prediction has been checked: the
  // figure computes nothing for a learner who has not yet answered.
  const shown = useMemo(() => {
    if (data.after === undefined || prediction === undefined) return undefined;
    const trace = traceOf(data.program, data.call);
    const r = data.reveal.register;
    return {
      name: `w${r}`,
      beforeNumber: wValue(viewAt(trace, 0).state, r),
      afterNumber: wValue(viewAt(trace, 1).state, r),
    };
  }, [data, prediction]);
  return (
    <div className="al-figure al-args" data-figure="arg-registers">
      <ol className="al-args-map" aria-label={M0.args.map}>
        {data.params.map((param, i) => (
          <li className="al-arg" key={param} data-index={i + 1}>
            <div className="al-arg-chip al-arg-param">
              <code>{param}</code>
            </div>
            <span className="al-arg-arrow" aria-hidden="true" />
            <div className="al-arg-chip al-arg-register">
              <code>w{i}</code>
            </div>
          </li>
        ))}
      </ol>
      <p className="al-args-caption">{M0.args.caption(data.params.length)}</p>
      <div className="al-args-instruction">
        <Prose markdown={data.says} className="al-args-says" />
        <Prose markdown={data.question} />
      </div>
      {shown !== undefined && (
        <div className="al-args-reveal" role="note">
          <dl>
            <div>
              <dt>{M0.args.before}</dt>
              <dd>
                <code>
                  {shown.name} = {data.reveal.before}
                </code>{" "}
                <span className="al-arg-number">({shown.beforeNumber})</span>
              </dd>
            </div>
            <div>
              <dt>{M0.args.after}</dt>
              <dd>
                <code>
                  {shown.name} = {data.reveal.after}
                </code>{" "}
                <span className="al-arg-number">({shown.afterNumber})</span>
              </dd>
            </div>
          </dl>
          <Prose markdown={data.reveal.explain.replace("${register}", shown.name)} />
        </div>
      )}
    </div>
  );
});
