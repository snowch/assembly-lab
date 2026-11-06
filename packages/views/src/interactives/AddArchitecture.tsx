// Copyright © 2026 Christopher Snow

import { useId, useMemo } from "react";
import { z } from "zod";
import { stateAfter } from "@al/machine";
import { Prose, useSlot } from "@platform/lesson-runtime";
import {
  addArchitectureTrace,
  architectureText as text,
  parseWordInput,
  UINT32_MAX,
} from "../add-architecture";
import { columnWork } from "../arith";
import { BitRow, hex } from "../bits";
import { ADD_ARCHITECTURE_STRINGS } from "../strings.add-architecture";
import { wValue } from "../trace";
import { withProps } from "./props";

const S = ADD_ARCHITECTURE_STRINGS.assembly;
const C = ADD_ARCHITECTURE_STRINGS.shared;
const Word = z.number().int().min(0).max(UINT32_MAX);
const State = z.object({
  a: Word,
  b: Word,
  draftA: z.string(),
  draftB: z.string(),
  executed: z.boolean(),
  bit: z.number().int().min(0).max(3),
  invalid: z.boolean(),
});
type State = z.infer<typeof State>;
const initial: State = {
  a: 3,
  b: 3,
  draftA: "3",
  draftB: "3",
  executed: false,
  bit: 1,
  invalid: false,
};

function Flow({
  a,
  b,
  value,
  executed,
}: {
  a: number;
  b: number;
  value: number;
  executed: boolean;
}) {
  const marker = useId();
  const fit = (number: number, width: number) => (String(number).length > 8 ? width : undefined);
  return (
    <svg
      className="al-add-flow"
      viewBox="0 0 340 390"
      role="img"
      aria-label={`${S.flowRead} → ${S.flowAlu} → ${S.flowWrite}`}
    >
      <defs>
        <marker
          id={marker}
          viewBox="0 0 8 8"
          refX="8"
          refY="4"
          markerWidth="8"
          markerHeight="8"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M0 0 L8 4 L0 8 Z" />
        </marker>
      </defs>
      {["M84 104 V138 H130 V165", "M256 104 V138 H210 V165", "M170 235 V292"].map((d) => (
        <path key={d} className="al-add-flow-wire" d={d} markerEnd={`url(#${marker})`} />
      ))}
      <text className="al-add-flow-label" x="170" y="18" textAnchor="middle">
        {S.flowRead}
      </text>
      {([a, b] as const).map((number, index) => {
        const x = index ? 192 : 20;
        return (
          <g key={index}>
            <rect className="al-add-source" x={x} y="34" width="128" height="70" rx="5" />
            <text className="al-add-flow-name" x={x + 64} y="58" textAnchor="middle">
              w{index}
            </text>
            <text
              className="al-add-flow-value"
              x={x + 64}
              y="87"
              textAnchor="middle"
              textLength={fit(number, 110)}
              lengthAdjust="spacingAndGlyphs"
            >
              {number}
            </text>
          </g>
        );
      })}
      <rect className="al-add-alu" x="80" y="165" width="180" height="70" rx="6" />
      <text className="al-add-flow-name" x="170" y="192" textAnchor="middle">
        {S.flowAlu}
      </text>
      <text
        className="al-add-flow-value"
        x="170"
        y="219"
        textAnchor="middle"
        textLength={executed ? fit(value, 145) : undefined}
        lengthAdjust="spacingAndGlyphs"
      >
        {executed ? value : "?"}
      </text>
      <text className="al-add-flow-label" x="158" y="276" textAnchor="end">
        {S.flowWrite}
      </text>
      <rect
        className="al-add-destination"
        data-written={executed}
        x="80"
        y="292"
        width="180"
        height="70"
        rx="5"
      />
      <text className="al-add-flow-name" x="170" y="318" textAnchor="middle">
        w2
      </text>
      <text
        className="al-add-flow-value"
        x="170"
        y="349"
        textAnchor="middle"
        textLength={fit(value, 145)}
        lengthAdjust="spacingAndGlyphs"
      >
        {value}
      </text>
      <text className="al-add-flow-label" x="170" y="384" textAnchor="middle">
        {executed ? S.written : S.writePending}
      </text>
    </svg>
  );
}

export const AddArchitecture = withProps(
  z.object({}),
  function AddArchitecture({ interactive, store }) {
    const [saved, save] = useSlot<unknown>(store, interactive.id);
    const parsed = State.safeParse(saved);
    const state = parsed.success ? parsed.data : initial;
    const update = (patch: Partial<State>) => save({ ...state, ...patch });
    const trace = useMemo(() => addArchitectureTrace(state.a, state.b), [state.a, state.b]);
    const step = trace.steps[0]!;
    if (!step.addition) throw new Error("The ADD did not produce arithmetic.");
    const current = stateAfter(trace, state.executed ? 0 : -1);
    const result = wValue(current, 2);
    const column = columnWork(step.addition, state.bit);
    const equation = text(C.equation, {
      a: column.a,
      b: column.b,
      carryIn: column.carryIn,
      total: column.total,
      binaryTotal: column.total.toString(2).padStart(2, "0"),
    });
    const long = [0, 1, 2].some((reg) => String(wValue(current, reg)).length > 7);
    const guide = text(S.inputGuide, { min: 0, max: UINT32_MAX });
    return (
      <div
        className="al-figure al-add-architecture"
        data-figure="add-architecture"
        data-executed={state.executed}
        role="group"
        aria-label={S.title}
      >
        <section className="al-add-panel">
          <h3>{S.inputHeading}</h3>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const a = parseWordInput(state.draftA),
                b = parseWordInput(state.draftB);
              if (a === null || b === null) {
                update({ invalid: true });
                return;
              }
              update({ a, b, executed: false, invalid: false });
            }}
          >
            <div className="al-add-inputs">
              {(["draftA", "draftB"] as const).map((field, index) => (
                <label key={field} htmlFor={`${interactive.id}-${field}`}>
                  w{index}
                  <input
                    id={`${interactive.id}-${field}`}
                    type="text"
                    autoComplete="off"
                    spellCheck={false}
                    value={state[field]}
                    aria-describedby={`${interactive.id}-guide`}
                    aria-invalid={state.invalid && parseWordInput(state[field]) === null}
                    onChange={(event) => update({ [field]: event.target.value, invalid: false })}
                  />
                </label>
              ))}
            </div>
            <p className="al-add-help" id={`${interactive.id}-guide`}>
              {guide}
            </p>
            <button type="submit" className="button secondary">
              {S.useInputs}
            </button>
            <p className="al-add-error" role="alert">
              {state.invalid ? text(S.rangeError, { min: 0, max: UINT32_MAX }) : ""}
            </p>
          </form>
        </section>
        <div className="al-add-layout">
          <section className="al-add-panel">
            <div className="al-add-instruction" data-ran={state.executed}>
              <code>{step.text}</code>
              <span>{S.instruction}</span>
            </div>
            <div className="al-controls">
              <button
                type="button"
                className="button primary"
                aria-disabled={state.executed}
                onClick={() => {
                  if (!state.executed) update({ executed: true });
                }}
              >
                {S.runAdd}
              </button>
              <button
                type="button"
                className="button secondary"
                aria-disabled={!state.executed}
                onClick={() => {
                  if (state.executed) update({ executed: false });
                }}
              >
                {S.back}
              </button>
              <button type="button" className="button secondary" onClick={() => save(initial)}>
                {S.reset}
              </button>
            </div>
            <p role="status" className="al-add-status">
              {state.executed
                ? text(S.ran, { instruction: step.text, value: result, destination: "w2" })
                : S.ready}
            </p>
            <p className="al-add-help">{S.resetNote}</p>
          </section>
          <section className="al-add-panel">
            <h3>{state.executed ? S.registersNow : S.registersBefore}</h3>
            <div className="al-add-registers" data-long={long}>
              {[0, 1, 2].map((reg) => (
                <div key={reg} data-written={state.executed && reg === 2}>
                  <code>w{reg}</code>
                  <strong data-register={`w${reg}`}>{wValue(current, reg)}</strong>
                  <span>
                    {reg === 2
                      ? state.executed
                        ? S.written
                        : S.writePending
                      : state.executed
                        ? S.readUnchanged
                        : ""}
                  </span>
                </div>
              ))}
            </div>
            <Flow
              a={wValue(current, 0)}
              b={wValue(current, 1)}
              value={result}
              executed={state.executed}
            />
            <div className="al-add-full-word">
              <BitRow
                name="w2"
                value={result}
                text={hex(result)}
                row="add-architecture-result"
                written={state.executed}
              />
            </div>
          </section>
        </div>
        <section className="al-add-detail">
          <h3>{state.executed ? text(S.detailHeading, { bit: state.bit }) : S.lowBitsLabel}</h3>
          {state.executed ? (
            <>
              <p>{S.detailNote}</p>
              <div className="al-add-panel">
                <p className="al-add-help">{S.lowBitsLabel}</p>
                <div className="al-controls" role="group" aria-label={C.selectedColumn}>
                  {[3, 2, 1, 0].map((bit) => (
                    <button
                      key={bit}
                      type="button"
                      className="button secondary"
                      aria-pressed={state.bit === bit}
                      onClick={() => update({ bit })}
                    >
                      {text(C.bit, { bit })}
                    </button>
                  ))}
                </div>
                <div className="al-add-triple">
                  {[
                    [C.inputA, column.a],
                    [C.adderB, column.b],
                    [C.carryIn, column.carryIn],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>
                <p className="al-add-equation" role="img" aria-label={equation}>
                  {column.a} + {column.b} + {column.carryIn} ={" "}
                  <span data-binary-total>{column.total.toString(2).padStart(2, "0")}</span>
                  <sub aria-hidden="true">2</sub>
                </p>
                <div className="al-add-outputs">
                  {[
                    [C.carryOut, column.carryOut, "carry"],
                    [C.kept, column.kept, "sum"],
                  ].map(([label, value, key]) => (
                    <div key={key}>
                      <span>{label}</span>
                      <strong data-output={key}>{value}</strong>
                    </div>
                  ))}
                </div>
                <p className="al-add-help">
                  {state.bit === 0
                    ? C.initialCarry
                    : text(C.carryFrom, { previousBit: state.bit - 1 })}
                  : <code>{column.carryIn}</code>
                  <br />
                  {text(C.carryTo, { nextBit: state.bit + 1 })}: <code>{column.carryOut}</code>
                </p>
              </div>
            </>
          ) : (
            <div className="al-add-locked">{S.detailLocked}</div>
          )}
        </section>
        <div className="al-add-scope">
          <Prose markdown={S.flagsNote} />
          <Prose markdown={S.scope} />
        </div>
        <p>
          <a href={S.lessonLinkHref}>{S.lessonLinkLabel}</a>
        </p>
      </div>
    );
  },
);
