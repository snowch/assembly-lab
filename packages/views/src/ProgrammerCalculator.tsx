// Copyright © 2026 Christopher Snow

import { Fragment, useId, useRef, type KeyboardEvent } from "react";
import {
  calculatorCompute,
  calculatorHalves,
  calculatorMask,
  calculatorParse,
  calculatorPattern,
  calculatorReading,
  calculatorSetHalf,
  type CalculatorFormat,
  type CalculatorOperation,
  type CalculatorReading,
  type CalculatorWidth,
} from "@al/machine";
import {
  checkProgrammerGuide,
  programmerPresets,
  type ProgrammerPreset,
} from "./programmer-presets";
import { PROGRAMMER_CALCULATOR as S } from "./strings.programmer-calculator";
import { useHandoffState } from "./update-handoff";

export type { ProgrammerPreset } from "./programmer-presets";

type Field = "entry" | "operand" | "half" | "shift";
type Work = {
  open: boolean;
  guideOpen: boolean;
  width: CalculatorWidth;
  reading: CalculatorReading;
  pattern: string;
  entry: string;
  format: CalculatorFormat;
  operand: string;
  operation: Exclude<CalculatorOperation, "shift-left">;
  half: "upper" | "lower";
  halfValue: string;
  shift: string;
  selected: number;
  full: string | null;
  message: string;
  error: { field: Field; code: keyof typeof S.errors } | null;
  answers: string[];
  guideChecked: boolean;
  guideFeedback: string;
  loadedFeedback: string;
};

const number = (value: bigint | string) => BigInt(value).toLocaleString("en-GB");
const hexadecimal = (pattern: string, width: CalculatorWidth) =>
  `0x${BigInt(pattern)
    .toString(16)
    .toUpperCase()
    .padStart(width / 4, "0")
    .match(/.{1,4}/g)!
    .join(" ")}`;

/** Keep decimal digit groups intact when a long 64-bit value needs another line. */
function DecimalValue({ value }: { value: bigint }) {
  const groups = number(value).split(",");
  return groups.map((group, index) => (
    <Fragment key={index}>
      {index > 0 && <wbr />}
      <span className="al-programmer-number-group">
        {group}
        {index < groups.length - 1 ? "," : ""}
      </span>
    </Fragment>
  ));
}

function initial(preset: ProgrammerPreset): Work {
  const config = programmerPresets[preset];
  return {
    open: false,
    guideOpen: false,
    width: config.width,
    reading: "unsigned",
    pattern: config.initial,
    entry: "",
    format: "decimal",
    operand: "1",
    operation: "add",
    half: "upper",
    halfValue: "0",
    shift: "1",
    selected: preset === "readings" ? config.width - 1 : 0,
    full: null,
    message: "",
    error: null,
    answers: S.presets[preset].labels.map(() => ""),
    guideChecked: false,
    guideFeedback: "",
    loadedFeedback: "",
  };
}

/** Optional scratch work. No lesson artifacts or graded-answer callbacks enter this view. */
export function ProgrammerCalculator({
  preset,
  handoffKey,
}: {
  preset: ProgrammerPreset;
  handoffKey: string;
}) {
  const id = useId();
  const entryRef = useRef<HTMLInputElement>(null);
  const config = programmerPresets[preset];
  const copy = S.presets[preset];
  const [work, setWork] = useHandoffState<Work>(
    `ProgrammerCalculator.${handoffKey}.${preset}`,
    () => initial(preset),
  );
  const change = (patch: Partial<Work>) => setWork((before) => ({ ...before, ...patch }));
  const act = (patch: Partial<Work>, message: string) =>
    change({ full: null, error: null, message, ...patch });
  const edit = (field: Field, patch: Partial<Work>) =>
    change({ ...patch, ...(work.error?.field === field ? { error: null } : {}) });
  const fail = (field: Field, code: keyof typeof S.errors) =>
    change({ error: { field, code }, message: "" });
  const decimal = calculatorReading(BigInt(work.pattern), work.width, work.reading);
  const minimum = work.reading === "signed" ? -(1n << BigInt(work.width - 1)) : 0n;
  const maximum =
    work.reading === "signed" ? (1n << BigInt(work.width - 1)) - 1n : calculatorMask(work.width);
  const range =
    work.format === "hex"
      ? S.patternRange(work.width)
      : S.decimalRange(number(minimum), number(maximum));
  const selectedValue = Number((BigInt(work.pattern) >> BigInt(work.selected)) & 1n) as 0 | 1;
  const weight =
    (work.reading === "signed" && work.selected === work.width - 1 ? -1n : 1n) *
    (1n << BigInt(work.selected));
  const inspector = S.inspector(
    work.selected,
    selectedValue,
    number(weight * BigInt(selectedValue)),
    number(weight),
  );
  const checks = checkProgrammerGuide(preset, work.answers);
  const apply = () => {
    const result = calculatorParse(work.entry, work.format, work.width, work.reading);
    if (!result.ok) return fail("entry", result.error);
    act({ pattern: result.pattern }, S.messages.applied);
  };
  const calculate = () => {
    const operand = calculatorParse(work.operand, "decimal", work.width, work.reading);
    if (!operand.ok) return fail("operand", operand.error);
    const result = calculatorCompute(
      work.pattern,
      work.operation,
      operand.pattern,
      work.width,
      work.reading,
    );
    act({ pattern: result.pattern, full: result.full }, S.messages.calculated);
  };
  const applyHalf = () => {
    const parsed = calculatorParse(work.halfValue, "decimal", 32, "unsigned");
    if (!parsed.ok || BigInt(parsed.pattern) > 65535n) return fail("half", "half");
    act(
      { pattern: calculatorSetHalf(work.pattern, work.half, parsed.pattern) },
      S.messages.halfApplied,
    );
  };
  const shift = () => {
    const parsed = calculatorParse(work.shift, "decimal", 32, "unsigned");
    if (!parsed.ok || BigInt(parsed.pattern) >= BigInt(work.width)) return fail("shift", "shift");
    const result = calculatorCompute(
      work.pattern,
      "shift-left",
      parsed.pattern,
      work.width,
      work.reading,
    );
    act({ pattern: result.pattern }, S.messages.shifted);
  };
  const check = () =>
    change({
      guideChecked: true,
      guideFeedback: checks.every(Boolean) ? copy.success : copy.retry,
    });
  const enter = (run: () => void) => (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      run();
    }
  };
  const error = (field: Field) =>
    work.error?.field === field ? (
      <p className="al-programmer-error" id={`${id}-${field}-error`} role="status">
        {S.errors[work.error.code]}
      </p>
    ) : null;
  const invalid = (field: Field) => ({
    "aria-invalid": work.error?.field === field ? (true as const) : undefined,
    "aria-errormessage": work.error?.field === field ? `${id}-${field}-error` : undefined,
  });
  const widths = config.resize ? ([32, 64] as const) : [];
  const halves = config.halves ? calculatorHalves(work.pattern) : null;

  return (
    <details
      className="al-programmer-calculator"
      data-preset={preset}
      open={work.open}
      onToggle={(event) => {
        if (event.target === event.currentTarget && event.currentTarget.open !== work.open)
          change({ open: event.currentTarget.open });
      }}
    >
      <summary>{S.title}</summary>
      {work.open && (
        <div className="al-programmer-panel">
          <p>{S.help}</p>
          <p>{copy.intro}</p>
          <p className="al-programmer-qualifier">{copy.qualifier}</p>
          <div className="al-programmer-switches">
            {config.resize && (
              <div role="group" aria-label={S.width}>
                <span>{S.width}</span>
                {widths.map((width) => (
                  <button
                    type="button"
                    key={width}
                    aria-pressed={work.width === width}
                    onClick={() => {
                      if (width !== work.width)
                        act(
                          {
                            width,
                            pattern: calculatorPattern(BigInt(work.pattern), width).toString(),
                            selected: 0,
                          },
                          width < work.width ? S.messages.resizeNarrow : S.messages.resizeWide,
                        );
                    }}
                  >
                    {S.widthValue(width)}
                  </button>
                ))}
              </div>
            )}
            {config.reading && (
              <div role="group" aria-label={S.reading}>
                <span>{S.reading}</span>
                {(["unsigned", "signed"] as const).map((reading) => (
                  <button
                    type="button"
                    key={reading}
                    aria-pressed={work.reading === reading}
                    onClick={() => act({ reading }, S.messages.reading)}
                  >
                    {S[reading]}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="al-programmer-readouts">
            <div>
              <span id={`${id}-decimal`}>
                {config.reading || config.arithmetic
                  ? S.decimalReading(S[work.reading])
                  : S.decimal}
              </span>
              <output
                aria-labelledby={`${id}-decimal`}
                data-reading={work.reading}
                data-long={number(decimal).length > 20 ? true : undefined}
              >
                <DecimalValue value={decimal} />
              </output>
            </div>
            <div>
              <span id={`${id}-hex`}>{S.hex}</span>
              <output aria-labelledby={`${id}-hex`} data-pattern={work.pattern}>
                {hexadecimal(work.pattern, work.width)}
              </output>
            </div>
          </div>
          <div className="al-programmer-entry">
            <label htmlFor={`${id}-entry`}>{S.entry}</label>
            <div className="al-programmer-controls">
              <select
                aria-label={S.format}
                value={work.format}
                onChange={(event) =>
                  edit("entry", { format: event.target.value as CalculatorFormat })
                }
                onKeyDown={enter(apply)}
              >
                <option value="decimal">{S.decimal}</option>
                <option value="hex">{S.hex}</option>
              </select>
              <input
                ref={entryRef}
                id={`${id}-entry`}
                value={work.entry}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-describedby={`${id}-range${work.error?.field === "entry" ? ` ${id}-entry-error` : ""}`}
                {...invalid("entry")}
                onChange={(event) => edit("entry", { entry: event.target.value })}
                onKeyDown={enter(apply)}
              />
              <button type="button" onClick={apply}>
                {S.apply}
              </button>
            </div>
            <p className="al-programmer-help" id={`${id}-range`}>
              {range}
            </p>
            {error("entry")}
          </div>
          <div className="al-programmer-bit-heading">
            <strong>{S.bitRange(work.width)}</strong>
            <span>{S.widthValue(work.width)}</span>
          </div>
          <div
            className={`al-programmer-bits${work.width === 4 ? " al-programmer-four" : ""}`}
            role="group"
            aria-label={S.pattern}
          >
            {Array.from({ length: work.width }, (_, j) => work.width - 1 - j).map((position) => {
              const value = Number((BigInt(work.pattern) >> BigInt(position)) & 1n);
              return (
                <button
                  type="button"
                  className="al-programmer-bit"
                  key={position}
                  data-bit={position}
                  aria-label={S.bit(position)}
                  aria-pressed={value === 1}
                  onClick={() => {
                    const pattern = calculatorPattern(
                      BigInt(work.pattern) ^ (1n << BigInt(position)),
                      work.width,
                    ).toString();
                    act({ pattern, selected: position }, "");
                  }}
                >
                  <small aria-hidden="true">{position}</small>
                  <b aria-hidden="true">{value}</b>
                </button>
              );
            })}
          </div>
          <p className="al-programmer-inspector">{inspector}</p>
          <div className="al-programmer-controls">
            <button type="button" onClick={() => act({ pattern: "0" }, S.messages.cleared)}>
              {S.clear}
            </button>
            <button
              type="button"
              onClick={() => {
                const reset = initial(preset);
                change({
                  ...reset,
                  open: true,
                  guideOpen: work.guideOpen,
                  answers: work.answers,
                  guideChecked: work.guideChecked,
                  guideFeedback: work.guideFeedback,
                  loadedFeedback: work.loadedFeedback,
                  message: S.messages.reset,
                });
              }}
            >
              {S.reset}
            </button>
          </div>
          {halves && (
            <section className="al-programmer-section" aria-label={S.halfTitle}>
              <h4>{S.halfTitle}</h4>
              <div className="al-programmer-readouts">
                <div>
                  <span>{S.upper}</span>
                  <strong>{number(halves.upper)}</strong>
                </div>
                <div>
                  <span>{S.lower}</span>
                  <strong>{number(halves.lower)}</strong>
                </div>
              </div>
              <p className="al-programmer-help">
                {S.halfSum(number(halves.upper), number(halves.lower), number(work.pattern))}
              </p>
              <div className="al-programmer-controls">
                <label>
                  {S.replaceHalf}
                  <select
                    value={work.half}
                    onChange={(event) => change({ half: event.target.value as "upper" | "lower" })}
                    onKeyDown={enter(applyHalf)}
                  >
                    <option value="upper">{S.upper}</option>
                    <option value="lower">{S.lower}</option>
                  </select>
                </label>
                <label htmlFor={`${id}-half`}>
                  {S.halfValue}
                  <input
                    id={`${id}-half`}
                    value={work.halfValue}
                    inputMode="numeric"
                    {...invalid("half")}
                    aria-describedby={work.error?.field === "half" ? `${id}-half-error` : undefined}
                    onChange={(event) => edit("half", { halfValue: event.target.value })}
                    onKeyDown={enter(applyHalf)}
                  />
                </label>
                <button type="button" onClick={applyHalf}>
                  {S.applyHalf}
                </button>
              </div>
              {error("half")}
              <div className="al-programmer-controls al-programmer-shift">
                <label htmlFor={`${id}-shift`}>
                  {S.shiftAmount}
                  <input
                    id={`${id}-shift`}
                    value={work.shift}
                    inputMode="numeric"
                    {...invalid("shift")}
                    aria-describedby={
                      work.error?.field === "shift" ? `${id}-shift-error` : undefined
                    }
                    onChange={(event) => edit("shift", { shift: event.target.value })}
                    onKeyDown={enter(shift)}
                  />
                </label>
                <button type="button" onClick={shift}>
                  {S.shiftLeft}
                </button>
              </div>
              {error("shift")}
            </section>
          )}
          {config.arithmetic && (
            <section className="al-programmer-section" aria-label={S.calculate}>
              <div className="al-programmer-controls">
                <label>
                  {S.operation}
                  <select
                    value={work.operation}
                    onChange={(event) =>
                      change({ operation: event.target.value as Work["operation"] })
                    }
                    onKeyDown={enter(calculate)}
                  >
                    <option value="add">{S.add}</option>
                    <option value="subtract">{S.subtract}</option>
                  </select>
                </label>
                <label htmlFor={`${id}-operand`}>
                  {S.second}
                  <input
                    id={`${id}-operand`}
                    value={work.operand}
                    aria-describedby={`${id}-operand-range${work.error?.field === "operand" ? ` ${id}-operand-error` : ""}`}
                    {...invalid("operand")}
                    onChange={(event) => edit("operand", { operand: event.target.value })}
                    onKeyDown={enter(calculate)}
                  />
                </label>
                <button type="button" onClick={calculate}>
                  {S.calculate}
                </button>
              </div>
              <p className="al-programmer-help" id={`${id}-operand-range`}>
                {S.decimalRange(number(minimum), number(maximum))}
              </p>
              {error("operand")}
            </section>
          )}
          {work.full !== null && (
            <div className="al-programmer-result">
              <p>
                {S.fullResult}:{" "}
                <code>
                  <DecimalValue value={BigInt(work.full)} />
                </code>
              </p>
              <p>
                {S.retained} ({S.widthValue(work.width)}):{" "}
                <code>
                  {BigInt(work.pattern)
                    .toString(2)
                    .padStart(work.width, "0")
                    .match(/.{1,4}/g)!
                    .join(" ")}
                </code>{" "}
                ·{" "}
                <code>
                  <DecimalValue value={decimal} />
                </code>
              </p>
            </div>
          )}
          <p className="al-programmer-message" role="status">
            {work.message}
          </p>
          <details
            className="al-programmer-guide"
            open={work.guideOpen}
            onToggle={(event) => {
              if (event.currentTarget.open !== work.guideOpen)
                change({ guideOpen: event.currentTarget.open });
            }}
          >
            <summary>{S.guideTitle}</summary>
            <div className="al-programmer-worked">
              <strong>{S.worked}</strong>
              <p>{copy.worked}</p>
            </div>
            <strong>{S.turn}</strong>
            <p>{copy.task}</p>
            <button
              type="button"
              onClick={() => {
                act(
                  {
                    pattern: config.task,
                    width: config.width,
                    reading: "unsigned",
                    selected: 0,
                    ...(preset === "arithmetic" ? { operation: "add" as const, operand: "3" } : {}),
                    loadedFeedback: S.messages.taskLoaded,
                  },
                  "",
                );
              }}
            >
              {S.loadTask}
            </button>
            <p className="al-programmer-help" role="status">
              {work.loadedFeedback}
            </p>
            <button
              className="al-programmer-return"
              type="button"
              onClick={() => entryRef.current?.focus()}
            >
              {S.returnToCalculator}
            </button>
            <div className="al-programmer-guide-answers">
              {copy.labels.map((label, index) => (
                <label key={label} htmlFor={`${id}-answer-${index}`}>
                  {label}
                  <input
                    id={`${id}-answer-${index}`}
                    value={work.answers[index]}
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    aria-invalid={work.guideChecked && !checks[index] ? true : undefined}
                    aria-describedby={work.guideChecked ? `${id}-guide-feedback` : undefined}
                    onChange={(event) =>
                      change({
                        answers: work.answers.map((answer, i) =>
                          i === index ? event.target.value : answer,
                        ),
                        guideChecked: false,
                        guideFeedback: "",
                      })
                    }
                    onKeyDown={enter(check)}
                  />
                </label>
              ))}
            </div>
            <div className="al-programmer-controls">
              <button type="button" onClick={check}>
                {S.check}
              </button>
              <button
                type="button"
                onClick={() =>
                  change({
                    answers: work.answers.map(() => ""),
                    guideChecked: false,
                    guideFeedback: S.messages.guideReset,
                    loadedFeedback: "",
                  })
                }
              >
                {S.resetGuide}
              </button>
            </div>
            <p id={`${id}-guide-feedback`} role="status">
              {work.guideFeedback}
            </p>
          </details>
          <p className="al-programmer-full">
            <a
              href="https://snowch.github.io/programmer-calculator/"
              target="_blank"
              rel="noopener noreferrer"
              aria-describedby={`${id}-new-tab`}
            >
              {S.full}
            </a>{" "}
            <span id={`${id}-new-tab`}>{S.newTab}</span>
          </p>
        </div>
      )}
    </details>
  );
}
