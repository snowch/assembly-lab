// Copyright © 2026 Christopher Snow

import { useId, useLayoutEffect, useRef, type KeyboardEvent } from "react";
import {
  calculatorArithmeticFlags,
  calculatorParse,
  calculatorParseEntry,
  calculatorEntryFormat,
  calculatorReading,
  calculatorSetHalf,
  type CalculatorOperation,
  type CalculatorReading,
} from "@al/machine";
import { useHandoffState } from "./update-handoff";
import { PROGRAMMER_CALCULATOR as S } from "./strings.programmer-calculator";
import { CALCULATOR_ENTRY as E } from "./strings.calculator-entry";
import { CALCULATOR_WORKSPACE as C } from "./strings.calculator-workspace";
import { COMPACT_CALCULATOR as D } from "./strings.compact-calculator";
import { ProgrammerDecimal, programmerHex, programmerNumber } from "./programmer-format";
import { CalculatorInspection } from "./CalculatorInspection";
import {
  initialWorkspace,
  workspaceCalculation,
  workspaceCodec,
  workspaceOperand,
  workspaceSettings,
  type Workspace,
  type WorkspaceField,
  type WorkspaceWidth,
} from "./calculator-workspace";

/** Global scratch arithmetic, independent of lesson answers and processor state. */
export function CalculatorWorkspace({
  handoffKey = "global",
  active = true,
}: {
  handoffKey?: string;
  active?: boolean;
}) {
  const id = useId();
  const [work, setWork] = useHandoffState(
    `ProgrammerCalculator.${handoffKey}.widths`,
    initialWorkspace,
    workspaceCodec,
  );
  const entryRef = useRef<HTMLInputElement>(null);
  const operandRef = useRef<HTMLInputElement>(null);
  const halfRef = useRef<HTMLInputElement>(null);
  const reveal = useRef<WorkspaceField | null>(null);
  const patch = (value: Partial<Workspace>) => setWork((before) => ({ ...before, ...value }));
  const act = (value: Partial<Workspace>, message = "") =>
    patch({ trace: null, full: null, error: null, dirty: true, message, ...value });
  const draft = (field: WorkspaceField, value: Partial<Workspace>, invalidate = false) =>
    setWork((before) => ({
      ...before,
      ...value,
      ...(invalidate ? { trace: null, full: null, dirty: true } : {}),
      error: before.error?.field === field ? null : before.error,
      message: "",
    }));
  const a = calculatorParseEntry(work.entry, work.width, work.reading);
  const operand = workspaceOperand(work);
  const flags =
    work.trace && work.trace.operation !== "shift-left"
      ? calculatorArithmeticFlags(
          work.trace.a,
          work.trace.operation,
          work.trace.b,
          work.trace.width,
        )
      : null;
  const minimum = work.reading === "signed" ? -(1n << BigInt(work.width - 1)) : 0n;
  const maximum = (1n << BigInt(work.width - (work.reading === "signed" ? 1 : 0))) - 1n;

  // Reveal local validation only on explicit submission, accounting for the sticky heading.
  useLayoutEffect(() => {
    const field = reveal.current;
    if (!active || !field || work.error?.field !== field) return;
    reveal.current = null;
    const input =
      field === "entry"
        ? entryRef.current
        : field === "half"
          ? halfRef.current
          : operandRef.current;
    if (!input) return;
    input.focus({ preventScroll: true });
    const group = input.closest<HTMLElement>(".workspace-value, .workspace-half-field") ?? input;
    const panel = input.closest<HTMLElement>(".header-calculator-dialog");
    if (!panel) {
      group.scrollIntoView?.({ block: "nearest" });
      return;
    }
    const heading = panel.querySelector<HTMLElement>(".header-calculator-heading");
    const top = (heading?.getBoundingClientRect().bottom ?? panel.getBoundingClientRect().top) + 8;
    const bottom = panel.getBoundingClientRect().bottom - 12;
    const rect = group.getBoundingClientRect();
    if (rect.top < top) panel.scrollTop += rect.top - top;
    else if (rect.bottom > bottom) panel.scrollTop += rect.bottom - bottom;
  }, [active, work.error]);

  const fail = (field: WorkspaceField, code: NonNullable<Workspace["error"]>["code"]) => {
    reveal.current = field;
    patch({ error: { field, code }, message: "" });
  };
  const enter = (run: () => void) => (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    event.stopPropagation();
    run();
  };
  const replaceA = (pattern: string, message = "") =>
    act(
      {
        pattern,
        entry: calculatorReading(BigInt(pattern), work.width, work.reading).toString(),
      },
      message,
    );
  const calculate = () => {
    const calculated = workspaceCalculation(work);
    if (!calculated.ok) return fail(calculated.field, calculated.code);
    patch({
      pattern: calculated.trace.a,
      trace: calculated.trace,
      full: calculated.trace.full,
      dirty: false,
      error: null,
      message: "",
    });
  };
  const settings = (width: WorkspaceWidth, reading: CalculatorReading) => {
    if (width === work.width && reading === work.reading) return;
    const hadInvalid = !a.ok || !calculatorParseEntry(work.operand, work.width, work.reading).ok;
    const next = workspaceSettings(work, width, reading);
    next.message =
      width === work.width
        ? D.readingChanged
        : D.widthChanged(width, width < work.width, hadInvalid);
    setWork(next);
  };
  const applyHalf = () => {
    if (!a.ok) return fail("entry", a.error);
    const parsed = calculatorParse(work.halfValue, "decimal", 32, "unsigned");
    if (!parsed.ok || BigInt(parsed.pattern) > 65535n) return fail("half", "half");
    replaceA(calculatorSetHalf(a.pattern, work.half, parsed.pattern), S.messages.halfApplied);
  };
  const invalid = (field: WorkspaceField) => ({
    "aria-invalid": work.error?.field === field || undefined,
    "aria-errormessage": work.error?.field === field ? `${id}-${field}-error` : undefined,
  });
  const errorMessage = (field: WorkspaceField) => {
    const code = work.error!.code;
    if (code === "binary") return E.binaryError;
    if (field === "entry" || field === "operand") {
      if (code === "decimal" || code === "hex") return E.notationError;
      if (code === "range")
        return calculatorEntryFormat(work[field]) === "decimal"
          ? E.decimalRangeError(programmerNumber(minimum), programmerNumber(maximum))
          : E.patternRangeError(work.width);
    }
    return S.errors[code];
  };
  const error = (field: WorkspaceField) =>
    work.error?.field === field ? (
      <p className="al-programmer-error" id={`${id}-${field}-error`} role="alert">
        {errorMessage(field)}
      </p>
    ) : null;
  const readouts = (pattern: string | null, label: string, prefix: string) => (
    <div className="workspace-readouts" role="group" aria-label={label}>
      <div>
        <span id={`${id}-${prefix}-decimal`}>{S.decimalReading(S[work.reading])}</span>
        <output aria-labelledby={`${id}-${prefix}-decimal`} data-reading={work.reading}>
          {pattern === null ? (
            C.unknownPreview
          ) : (
            <ProgrammerDecimal
              value={calculatorReading(BigInt(pattern), work.width, work.reading)}
            />
          )}
        </output>
      </div>
      <div>
        <span id={`${id}-${prefix}-hex`}>{S.hex}</span>
        <output aria-labelledby={`${id}-${prefix}-hex`} data-pattern={pattern}>
          {pattern === null ? C.unknownPreview : programmerHex(pattern, work.width)}
        </output>
      </div>
    </div>
  );

  if (!active) return null;
  return (
    <div
      className="al-programmer-panel calculator-workspace"
      data-show-carries={(work.operation === "add" && work.showCarries) || undefined}
    >
      <div className="workspace-settings">
        <div role="group" aria-label={S.width}>
          <span>{S.width}</span>
          {([32, 64] as const).map((width) => (
            <button
              type="button"
              key={width}
              aria-pressed={work.width === width}
              onClick={() => settings(width, work.reading)}
            >
              {S.widthValue(width)}
            </button>
          ))}
        </div>
        <div role="group" aria-label={D.reading}>
          <span>{D.reading}</span>
          {(["unsigned", "signed"] as const).map((reading) => (
            <button
              type="button"
              key={reading}
              aria-pressed={work.reading === reading}
              onClick={() => settings(work.width, reading)}
            >
              {S[reading]}
            </button>
          ))}
        </div>
      </div>
      <p className="workspace-field-help workspace-notation" id={`${id}-notation-help`}>
        {D.notationHint}
      </p>
      <form
        className="workspace-form"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          calculate();
        }}
      >
        <div className="workspace-operands">
          <div className="workspace-value">
            <label htmlFor={`${id}-entry`}>{C.currentA}</label>
            <input
              id={`${id}-entry`}
              ref={entryRef}
              value={work.entry}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              {...invalid("entry")}
              aria-describedby={`${id}-notation-help${work.error?.field === "entry" ? ` ${id}-entry-error` : ""}`}
              onChange={(e) => {
                const entry = e.target.value,
                  parsed = calculatorParseEntry(entry, work.width, work.reading);
                draft("entry", { entry, ...(parsed.ok ? { pattern: parsed.pattern } : {}) }, true);
              }}
              onKeyDown={enter(calculate)}
            />
            {readouts(a.ok ? a.pattern : null, C.currentA, "a")}
            {error("entry")}
          </div>
          <div className="workspace-value">
            <label htmlFor={`${id}-operand`}>
              {work.operation === "shift-left" ? C.shiftAmountDecimal : C.currentB}
            </label>
            <input
              id={`${id}-operand`}
              ref={operandRef}
              value={work.operation === "shift-left" ? work.shift : work.operand}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              {...invalid(work.operation === "shift-left" ? "shift" : "operand")}
              aria-describedby={
                work.operation === "shift-left"
                  ? `${id}-shift-help`
                  : `${id}-notation-help${work.error?.field === "operand" ? ` ${id}-operand-error` : ""}`
              }
              onChange={(e) =>
                work.operation === "shift-left"
                  ? draft("shift", { shift: e.target.value }, true)
                  : draft("operand", { operand: e.target.value }, true)
              }
              onKeyDown={enter(calculate)}
            />
            {work.operation === "shift-left" ? (
              <p className="workspace-field-help" id={`${id}-shift-help`}>
                {S.errors.shift}
              </p>
            ) : (
              readouts(operand.ok ? operand.pattern : null, C.currentB, "b")
            )}
            {error(work.operation === "shift-left" ? "shift" : "operand")}
          </div>
        </div>
        <div className="workspace-operation workspace-calculation-action">
          <label>
            {S.operation}
            <select
              value={work.operation}
              onChange={(e) => act({ operation: e.target.value as CalculatorOperation })}
              onKeyDown={enter(calculate)}
            >
              <option value="add">{S.add}</option>
              <option value="subtract">{S.subtract}</option>
              <option value="shift-left">{S.shiftLeft}</option>
            </select>
          </label>
          <button type="submit" className="workspace-calculate">
            {S.calculate}
          </button>
        </div>
      </form>
      <p className="al-programmer-message workspace-feedback" role="status">
        {work.message}
      </p>
      {work.trace ? (
        <section className="workspace-result" aria-live="polite">
          <div className="workspace-result-heading">
            <h3>{C.retainedResult}</h3>
            <span>{D.resultContext(work.width, work.reading)}</span>
          </div>
          {readouts(work.trace.pattern, C.retainedResult, "result")}
          <p className="workspace-exact">
            {D.exactLabel(work.operation, work.reading)}:{" "}
            <strong>
              <ProgrammerDecimal value={BigInt(work.trace.full)} />
            </strong>
          </p>
          <p className="workspace-range">
            {D.rangeStatus({
              width: work.width,
              reading: work.reading,
              exact: work.trace.full,
              operation: work.operation,
            })}
          </p>
          <div className="workspace-result-actions">
            <button type="button" onClick={() => replaceA(work.trace!.pattern, D.retainedUsed)}>
              {C.useResult}
            </button>
            {flags && (
              <label className="workspace-flags-toggle">
                <input
                  type="checkbox"
                  checked={work.showFlags}
                  onChange={(e) => patch({ showFlags: e.target.checked })}
                />
                {D.showFlags}
              </label>
            )}
          </div>
          {flags && work.showFlags && (
            <div className="workspace-flags-summary">
              <dl>
                {(
                  [
                    ["n", D.nLabel],
                    ["z", D.zLabel],
                    ["c", work.operation === "add" ? D.cAddLabel : D.cSubLabel],
                    ["v", D.vLabel],
                  ] as const
                ).map(([flag, label]) => (
                  <div key={flag}>
                    <dt>{label}</dt>
                    <dd data-flag={flag} data-value={flags[flag]}>
                      {flags[flag]}
                    </dd>
                  </div>
                ))}
              </dl>
              <p>
                {D.flagsHelp}
                {work.operation === "subtract" ? ` ${D.subtractionHelp}` : ""}
              </p>
            </div>
          )}
        </section>
      ) : (
        <p className="workspace-pending">{work.dirty ? D.inputChanged : D.emptyResult}</p>
      )}
      <CalculatorInspection
        id={id}
        work={work}
        onChange={patch}
        onReplaceA={replaceA}
        onHalfDraft={(value) => draft("half", { halfValue: value })}
        onApplyHalf={applyHalf}
        halfRef={halfRef}
        halfInvalid={invalid("half")}
        halfError={error("half")}
      />
      <details
        className="workspace-help-details"
        open={work.helpOpen}
        onToggle={(event) => {
          if (event.currentTarget.open !== work.helpOpen)
            patch({ helpOpen: event.currentTarget.open });
        }}
      >
        <summary>{D.help}</summary>
        <div className="workspace-help-copy">
          <p>{D.helpIntro}</p>
          <p>
            {S.unsignedHelp} {S.signedHelp} {S.hexHelp}
          </p>
          <p>{E.notationHint}</p>
          <p>{D.widthHelp}</p>
          <p>{D.readingHelp}</p>
        </div>
      </details>
      <div className="workspace-footer">
        <button
          type="button"
          onClick={() => setWork({ ...initialWorkspace(), message: S.messages.reset })}
        >
          {S.reset}
        </button>
      </div>
    </div>
  );
}
