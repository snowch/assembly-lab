// Copyright © 2026 Christopher Snow
// One instruction's operands as a flow the learner can read without a legend: the registers it
// reads, the operation it performs, and the register it writes, each labelled in place. The
// instruction's own order stays at the top, so the destination-first convention is still
// explicit. When a register is both read and written, one sentence says the two appearances name
// one register at two moments. Nothing runs here; the Investigation's simulator below is where
// the same instruction executes, and the figure stays shut until the lesson's prediction has
// been checked, so it cannot spoil the answer the prediction asks for.
import { z } from "zod";
import { useSlot } from "@platform/lesson-runtime";
import { withCode } from "../parts";
import { VIEW_STRINGS as S } from "../strings";
import { withProps } from "./props";

const Props = z.object({
  /** The instruction's name, such as `add`, and its operands: the destination first, then the values it reads. */
  name: z.string().min(1),
  operands: z.array(z.string().min(1)).min(2).max(5),
  /** The word for the operation itself, drawn on the flow: `Add` for `add`, `Subtract` for `sub`. */
  operation: z.string().min(1),
  /** The id of a prediction in this lesson. The figure stays shut until it has been checked. */
  after: z.string().optional(),
});

export const OperandRoles = withProps(Props, function OperandRoles({ data, store }) {
  const [first, ...rest] = data.operands;
  const [prediction] = useSlot<{ choice: string }>(store, data.after ?? "");
  if (first === undefined || rest.length === 0) return null;
  if (data.after !== undefined && prediction === undefined)
    return (
      <p role="note" className="al-locked">
        {S.stepper.locked}
      </p>
    );
  return <OperandDiagram data={data} />;
});

/** Shared schematic; callers control when its worked instruction is revealed. */
export function OperandDiagram({ data }: { data: z.infer<typeof Props> }) {
  const [destination, ...inputs] = data.operands;
  if (destination === undefined || inputs.length === 0) return null;
  // A register can be both read and written, as `w0` is here: the flow says so, rather than
  // implying two registers.
  const tied = inputs.includes(destination);
  return (
    <div className="al-figure al-operands" data-figure="operand-roles">
      <p className="al-operands-syntax" aria-label={S.operands.instruction(data.name)}>
        <code>{[data.name, data.operands.join(", ")].join(" ")}</code>
      </p>
      {/*
        One shared coordinate system for the nodes and the connectors: the flow is a grid with
        a column per input, every chip centred in its column, and the connector drawn on the
        same columns. The join's viewBox has one unit per column, so its leg x positions are the
        column centres in the same grid the chips live in, and the whole flow is bounded so the
        connectors cannot span the card away from the nodes. Both reads feed one operation: the
        legs merge into a single arrowhead on the operation, then one connector runs from the
        operation to the register it writes.
      */}
      <ol
        className="al-operands-flow"
        aria-label={S.operands.flow}
        style={{ gridTemplateColumns: `repeat(${inputs.length}, minmax(0, 1fr))` }}
      >
        {inputs.map((operand, i) => (
          <li className="al-op-cell" key={i}>
            <span className="al-op al-op-read">
              <span className="al-op-role">{S.operands.read}</span> <code>{operand}</code>
            </span>
          </li>
        ))}
        <li className="al-op-join" aria-hidden="true">
          <svg
            className="al-op-join-svg"
            viewBox={`0 0 ${inputs.length * 24} 24`}
            preserveAspectRatio="none"
          >
            {inputs.map((_, i) => {
              const x = i * 24 + 12;
              const mid = (inputs.length * 24) / 2;
              return <path key={i} className="al-op-line" d={`M ${x} 0 V 8 H ${mid} V 19`} />;
            })}
            <path
              className="al-op-head"
              d={`M ${(inputs.length * 24) / 2} 24 L ${(inputs.length * 24) / 2 - 3} 19 H ${(inputs.length * 24) / 2 + 3} Z`}
            />
          </svg>
        </li>
        <li className="al-op-cell al-op-cell-span">
          <span className="al-op al-op-do">
            <span className="al-op-role">{data.operation}</span>
          </span>
        </li>
        <li className="al-op-step" aria-hidden="true">
          <svg
            className="al-op-join-svg"
            viewBox={`0 0 ${inputs.length * 24} 24`}
            preserveAspectRatio="none"
          >
            <path className="al-op-line" d={`M ${(inputs.length * 24) / 2} 0 V 19`} />
            <path
              className="al-op-head"
              d={`M ${(inputs.length * 24) / 2} 24 L ${(inputs.length * 24) / 2 - 3} 19 H ${(inputs.length * 24) / 2 + 3} Z`}
            />
          </svg>
        </li>
        <li className="al-op-cell al-op-cell-span">
          <span className="al-op al-op-write">
            <span className="al-op-role">{S.operands.write}</span> <code>{destination}</code>
          </span>
        </li>
      </ol>
      {tied && <p className="al-operands-tie">{withCode(S.operands.sameRegister(destination))}</p>}
    </div>
  );
}
