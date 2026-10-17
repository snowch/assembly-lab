// Copyright © 2026 Christopher Snow

// The panels that sit beside a stepper or a listing and show what a compare, a condition and a
// `csel` did, or what two conditions say about the same flags. Each reads the run's own steps
// (select.ts); nothing here works out a value. A stage shows only once the step that does it has
// run, so a panel never shows a result the learner has not stepped to.

import { useMemo, type ReactNode } from "react";
import { z } from "zod";

import { ConditionItem } from "./ConditionItem";
import { FlagsRow } from "./FlagsRow";
import { withCode } from "./parts";
import {
  patternText,
  readText,
  selectModel,
  twoConditions,
  type ConditionRead,
  type SelectModel,
} from "./select";
import { BRANCH_STRINGS as B } from "./strings.branch";
import type { Trace } from "./trace";

/** The panel a stepper may carry beside its listing; without one, the stepper is as it was. */
export const PanelSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("select"),
    /** What the C calls the arguments in `w0`, `w1` and on. */
    names: z.array(z.string()).default(["a", "b"]),
    /** Other conditions to read off the same flags, beside the one `csel` names. */
    also: z.array(z.string()).default([]),
  }),
  z.object({
    kind: z.literal("two-conditions"),
    /** The conditions to read off the flags the compare left. */
    conditions: z.array(z.string()).min(2),
  }),
]);
export type Panel = z.infer<typeof PanelSchema>;

/** No other conditions: one array, so a panel that asks for none does not redo its model. */
const NONE: readonly string[] = [];

/** A value as the figure writes it: a plain number, or a large pattern with both readings. */
function valueText(value: number): string {
  const signed = Number(BigInt.asIntN(32, BigInt(value)));
  return signed === value
    ? String(value)
    : `${patternText(value)} (${B.conditions.readings(value, signed)})`;
}

function Answer({ read }: { read: ConditionRead }) {
  return (
    <p className="al-stage-answer" data-holds={read.holds}>
      <span className="al-cond-glyph" aria-hidden="true">
        {read.holds ? "✓" : "✗"}
      </span>
      {B.select.answer(read.holds)}
    </p>
  );
}

function ConditionBlock({
  read,
  instruction,
}: {
  read: ConditionRead;
  instruction: string | null;
}) {
  // The meaning with the reading it belongs to, as the lesson words it: "greater than or equal, signed".
  const group = read.row?.group;
  const meaning = `${read.row?.means ?? ""}${group === "signed" || group === "unsigned" ? `, ${group}` : ""}`;
  return (
    <div className="al-stage-condition" data-cond={read.name} data-holds={read.holds}>
      <p>
        {instruction === null ? meaning : withCode(B.select.asks(instruction, read.name, meaning))}
      </p>
      {read.row && <p>{withCode(B.select.rule(read.row.reads))}</p>}
      <p>{B.select.flagsRead(readText(read.read))}</p>
      <Answer read={read} />
    </div>
  );
}

function Stage({
  name,
  title,
  done,
  children,
}: {
  name: string;
  title: string;
  done: boolean;
  children: ReactNode;
}) {
  return (
    <li className="al-stage" data-stage={name} data-done={done}>
      <p className="al-stage-head">{title}</p>
      {done ? children : <p className="al-stage-wait">{B.select.notYet}</p>}
    </li>
  );
}

function CompareBody({ model }: { model: SelectModel }) {
  const c = model.compare;
  if (c === null) return null;
  const word = c.sign === "minus" ? B.select.minus : B.select.plus;
  return (
    <>
      <ul className="al-stage-list">
        {c.inputs.map((i) => (
          <li key={i.register}>
            {withCode(B.select.holds(i.register, i.name, valueText(i.value)))}
          </li>
        ))}
      </ul>
      <p>{withCode(B.select.sum(c.instruction, c.first, word, c.second))}</p>
      <p className="al-stage-label">{B.select.flagsAfter}</p>
      <FlagsRow flags={c.flagsAfter} before={c.flagsBefore} />
      <p className="al-stage-nowrite">
        {c.wrote.length === 0 ? B.select.noRegister : withCode(B.select.wrote(c.wrote.join(", ")))}
      </p>
    </>
  );
}

function SelectBody({ model }: { model: SelectModel }) {
  const s = model.select;
  if (s === null) return null;
  const rows = [
    { key: "yes", text: B.select.ifYes(s.whenYes.register, valueText(s.whenYes.value)) },
    { key: "no", text: B.select.ifNo(s.whenNo.register, valueText(s.whenNo.value)) },
  ] as const;
  return (
    <>
      <p>{withCode(`\`${s.instruction}\``)}</p>
      <ul className="al-stage-list al-sources">
        {rows.map((r) => (
          <li
            key={r.key}
            className="al-source"
            data-source={r.key}
            data-chosen={s.chosen === r.key}
          >
            <span className="al-cond-glyph" aria-hidden="true">
              {s.chosen === r.key ? "●" : "○"}
            </span>
            <span>{withCode(r.text)}</span>
            <span className="al-source-tag">
              {s.chosen === r.key ? B.select.chosen : B.select.notChosen}
            </span>
          </li>
        ))}
      </ul>
      <p className="al-stage-result">
        {withCode(B.select.result(s.destination, valueText(s.after)))}
      </p>
    </>
  );
}

/**
 * Compare, condition, select. `k` is how many instructions have run; a stage shows once its
 * instruction has run (pass a large number to show all three).
 */
export function SelectPanel({
  trace,
  names,
  also = NONE,
  k,
}: {
  trace: Trace;
  names: readonly string[];
  also?: readonly string[];
  k: number;
}) {
  const model = useMemo(() => selectModel(trace, names, also), [trace, names, also]);
  if (model.compare === null && model.condition === null && model.select === null) return null;
  const compareDone = model.compare !== null && k > model.compare.step;
  const selectDone = model.select !== null && k > model.select.step;
  const cond = model.condition;
  return (
    <div className="al-select" role="group" aria-label={B.select.panel} data-figure-part="select">
      <ol className="al-stages">
        <Stage name="compare" title={B.select.compare} done={compareDone}>
          <CompareBody model={model} />
        </Stage>
        <Stage name="condition" title={B.select.condition} done={selectDone}>
          {cond && (
            <>
              <ConditionBlock read={cond.condition} instruction="csel" />
              {cond.also.map((read) => (
                <div key={read.name} className="al-stage-also">
                  <p className="al-stage-label">{withCode(B.select.also(read.name))}</p>
                  <ConditionBlock read={read} instruction={null} />
                </div>
              ))}
            </>
          )}
        </Stage>
        <Stage name="select" title={B.select.select} done={selectDone}>
          <SelectBody model={model} />
        </Stage>
      </ol>
    </div>
  );
}

/** Two conditions read off the flags the first compare left. */
export function TwoConditionsPanel({
  trace,
  conditions,
  k,
}: {
  trace: Trace;
  conditions: readonly string[];
  k: number;
}) {
  const model = useMemo(() => twoConditions(trace, conditions), [trace, conditions]);
  if (model === null) return null;
  const done = k > model.step;
  return (
    <div
      className="al-select al-two"
      role="group"
      aria-label={B.twoConditions.panel}
      data-done={done}
    >
      <p className="al-stage-head">{B.twoConditions.panel}</p>
      {done ? (
        <>
          <p className="al-stage-label">{B.select.flagsAfter}</p>
          <FlagsRow flags={model.flagsAfter} before={model.flagsBefore} />
          <ul className="al-cond-two">
            {model.conditions.map((read) => (
              <ConditionItem
                key={read.name}
                item={read}
                note={
                  model.used !== null && model.used.condition === read.name
                    ? B.twoConditions.usedBy(model.used.instruction)
                    : undefined
                }
              />
            ))}
          </ul>
        </>
      ) : (
        <p className="al-stage-wait">{B.select.notYet}</p>
      )}
    </div>
  );
}

/** The panel a stepper's props ask for, for the instructions run so far. */
export function StepPanel({ panel, trace, k }: { panel: Panel; trace: Trace; k: number }) {
  return panel.kind === "select" ? (
    <SelectPanel trace={trace} names={panel.names} also={panel.also} k={k} />
  ) : (
    <TwoConditionsPanel trace={trace} conditions={panel.conditions} k={k} />
  );
}
