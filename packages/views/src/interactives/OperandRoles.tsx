// Copyright © 2026 Christopher Snow
// One instruction's operands, each with its role: the destination the result is written to and
// the two inputs the instruction reads. The instruction is drawn, not described: each operand is
// a chip in its own place, the role names are text, and the order is the instruction's own order.
// Nothing runs here; the Investigation's simulator below is where the same instruction executes.
import { z } from "zod";
import { withCode } from "../parts";
import { VIEW_STRINGS as S } from "../strings";
import { withProps } from "./props";

const Props = z.object({
  /** The instruction's name, such as `add`. */
  name: z.string().min(1),
  /** The operands after the name, in order: the destination first, then the inputs. */
  operands: z.array(z.string().min(1)).min(2).max(5),
  /** Markdown: the one-line explanation under the legend. */
  explain: z.string(),
});

export const OperandRoles = withProps(Props, function OperandRoles({ data }) {
  const [first, ...rest] = data.operands;
  if (first === undefined || rest.length === 0) return null;
  const destination = first;
  const inputs = rest;
  // A register can be both an input and the destination, as `w0` is here: the two chips name
  // one register at two moments, so the legend says so and the marks tie them together.
  const tied = inputs.includes(destination);
  return (
    <div className="al-figure al-operands" data-figure="operand-roles">
      <p className="al-operands-instruction" aria-label={S.operands.instruction(data.name)}>
        <code className="al-operands-name">{data.name}</code>
        {[destination, ...inputs].map((operand, i) => (
          <span
            className="al-operands-operand"
            key={i}
            data-role={i === 0 ? "destination" : "input"}
            data-tied={tied && operand === destination ? "true" : undefined}
          >
            <code>{operand}</code>
            <span className="al-operands-mark" aria-hidden="true">
              {i === 0 ? S.operands.destinationMark : S.operands.inputMark(i)}
            </span>
            <span className="visually-hidden">
              {i === 0 ? S.operands.destination : S.operands.input(i)}
            </span>
          </span>
        ))}
      </p>
      <ul className="al-operands-legend">
        <li>
          <span className="al-operands-mark" aria-hidden="true">
            {S.operands.destinationMark}
          </span>
          {withCode(S.operands.destination)}
        </li>
        {inputs.map((_, i) => (
          <li key={i}>
            <span className="al-operands-mark" aria-hidden="true">
              {S.operands.inputMark(i)}
            </span>
            {withCode(S.operands.input(i + 1))}
          </li>
        ))}
      </ul>
      {tied && <p className="al-operands-tie">{withCode(S.operands.sameRegister(destination))}</p>}
      <p className="al-operands-explain">{withCode(data.explain)}</p>
    </div>
  );
});
