// Copyright © 2026 Christopher Snow

import { useId, useLayoutEffect, useRef, type KeyboardEvent } from "react";
import {
  calculatorHalves,
  calculatorParse,
  calculatorPattern,
  calculatorReading,
  calculatorSetHalf,
  type CalculatorFormat,
  type CalculatorOperation,
  type CalculatorReading,
} from "@al/machine";
import { useHandoffState } from "./update-handoff";
import { PROGRAMMER_CALCULATOR as S } from "./strings.programmer-calculator";
import { CALCULATOR_WORKSPACE as C } from "./strings.calculator-workspace";
import { ProgrammerDecimal, programmerHex, programmerNumber } from "./programmer-format";
import {
  initialWorkspace,
  workspaceCalculation,
  workspaceCodec,
  workspaceOperand,
  type Workspace,
  type WorkspaceField,
  type WorkspaceWidth,
} from "./calculator-workspace";

const bits = (value: string, width: number) => BigInt(value).toString(2).padStart(width, "0");
const entryText = (
  pattern: string,
  format: CalculatorFormat,
  width: WorkspaceWidth,
  reading: CalculatorReading,
) =>
  format === "hex"
    ? programmerHex(pattern, width)
    : calculatorReading(BigInt(pattern), width, reading).toString();

/** A global scratch workspace. No lesson answer or simulator state is accepted here. */
export function CalculatorWorkspace({
  handoffKey = "global",
  active = true,
}: {
  handoffKey?: string;
  active?: boolean;
}) {
  const id = useId();
  // Keep the former header calculator's key so coordinated updates preserve pending work.
  const [work, setWork] = useHandoffState(
    `ProgrammerCalculator.${handoffKey}.widths`,
    initialWorkspace,
    workspaceCodec,
  );
  const scroller = useRef<HTMLDivElement>(null);
  const editor = useRef<HTMLDivElement>(null);
  const patch = (value: Partial<Workspace>) => setWork((before) => ({ ...before, ...value }));
  const act = (value: Partial<Workspace>, message = "") =>
    patch({ trace: null, full: null, error: null, message, ...value });
  const draft = (field: WorkspaceField, value: Partial<Workspace>, invalidate = false) =>
    setWork((before) => ({
      ...before,
      ...value,
      ...(invalidate ? { trace: null, full: null } : {}),
      error: before.error?.field === field ? null : before.error,
      message: "",
    }));
  const operand = workspaceOperand(work);
  const minimum = work.reading === "signed" ? -(1n << BigInt(work.width - 1)) : 0n;
  const maximum =
    work.reading === "signed"
      ? (1n << BigInt(work.width - 1)) - 1n
      : (1n << BigInt(work.width)) - 1n;
  const range = (format: CalculatorFormat) =>
    format === "hex"
      ? S.patternRange(work.width)
      : S.decimalRange(programmerNumber(minimum), programmerNumber(maximum));
  const enter = (run: () => void) => (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    event.stopPropagation();
    run();
  };
  const apply = () => {
    const parsed = calculatorParse(work.entry, work.format, work.width, work.reading);
    if (!parsed.ok) return patch({ error: { field: "entry", code: parsed.error }, message: "" });
    act({ pattern: parsed.pattern }, S.messages.applied);
  };
  const calculate = () => {
    const calculated = workspaceCalculation(work);
    if (!calculated.ok)
      return patch({ error: { field: calculated.field, code: calculated.code }, message: "" });
    patch({
      trace: calculated.trace,
      full: calculated.trace.full,
      error: null,
      message: S.messages.calculated,
    });
  };
  const settings = (width: WorkspaceWidth, reading: CalculatorReading) => {
    if (width === work.width && reading === work.reading) return;
    const parsedEntry = calculatorParse(work.entry, work.format, work.width, work.reading);
    const parsedOperand = calculatorParse(
      work.operand,
      work.operandFormat,
      work.width,
      work.reading,
    );
    act(
      {
        width,
        reading,
        pattern: calculatorPattern(BigInt(work.pattern), width).toString(),
        ...(parsedEntry.ok
          ? {
              entry: entryText(
                calculatorPattern(BigInt(parsedEntry.pattern), width).toString(),
                work.format,
                width,
                reading,
              ),
            }
          : {}),
        ...(parsedOperand.ok
          ? {
              operand: entryText(
                calculatorPattern(BigInt(parsedOperand.pattern), width).toString(),
                work.operandFormat,
                width,
                reading,
              ),
            }
          : {}),
        selected: Math.min(work.selected, width - 1),
        scrollLeft: width !== work.width ? -1 : work.scrollLeft,
      },
      width === work.width
        ? S.messages.reading
        : width < work.width
          ? S.messages.resizeNarrow
          : S.messages.resizeWide,
    );
  };
  const changeFormat = (field: "entry" | "operand", format: CalculatorFormat) => {
    const oldFormat = field === "entry" ? work.format : work.operandFormat;
    const value = field === "entry" ? work.entry : work.operand;
    const parsed = calculatorParse(value, oldFormat, work.width, work.reading);
    draft(field, {
      [field === "entry" ? "format" : "operandFormat"]: format,
      ...(parsed.ok
        ? { [field]: entryText(parsed.pattern, format, work.width, work.reading) }
        : {}),
    });
  };
  const applyHalf = () => {
    const parsed = calculatorParse(work.halfValue, "decimal", 32, "unsigned");
    if (!parsed.ok || BigInt(parsed.pattern) > 65535n)
      return patch({ error: { field: "half", code: "half" }, message: "" });
    act(
      { pattern: calculatorSetHalf(work.pattern, work.half, parsed.pattern) },
      S.messages.halfApplied,
    );
  };
  useLayoutEffect(() => {
    const node = scroller.current;
    if (!node || !active || work.view !== "calculate") return;
    // The dialog opens in its parent effect, after this child first measures it.
    // Wait for its visible size before restoring the shared scroll position.
    let observer: ResizeObserver | undefined;
    const align = () => {
      if (node.clientWidth === 0) return;
      node.scrollLeft = work.scrollLeft < 0 ? node.scrollWidth : work.scrollLeft;
      observer?.disconnect();
    };
    if (node.clientWidth > 0) align();
    else if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(align);
      observer.observe(node);
    }
    return () => observer?.disconnect();
  }, [active, work.view, work.width]);

  const invalid = (field: WorkspaceField) => ({
    "aria-invalid": work.error?.field === field || undefined,
    "aria-errormessage": work.error?.field === field ? `${id}-${field}-error` : undefined,
  });
  const error = (field: WorkspaceField) =>
    work.error?.field === field ? (
      <p className="al-programmer-error" id={`${id}-${field}-error`} role="status">
        {S.errors[work.error.code]}
      </p>
    ) : null;
  const readouts = (pattern: string, label: string, prefix: string, help = false) => (
    <div className="workspace-readouts" role="group" aria-label={label}>
      <div>
        <span id={`${id}-${prefix}-decimal`}>{S.decimalReading(S[work.reading])}</span>
        <output aria-labelledby={`${id}-${prefix}-decimal`} data-reading={work.reading}>
          <ProgrammerDecimal value={calculatorReading(BigInt(pattern), work.width, work.reading)} />
        </output>
        {help && (
          <p className="workspace-readout-help">
            {work.reading === "signed" ? S.signedHelp : S.unsignedHelp}
          </p>
        )}
      </div>
      <div>
        <span id={`${id}-${prefix}-hex`}>{S.hex}</span>
        <output aria-labelledby={`${id}-${prefix}-hex`} data-pattern={pattern}>
          {programmerHex(pattern, work.width)}
        </output>
        {help && <p className="workspace-readout-help">{S.hexHelp}</p>}
      </div>
    </div>
  );
  const stripRow = (label: string, pattern: string | null, kind: string) => {
    const shown = pattern === null ? "?".repeat(work.width) : bits(pattern, work.width);
    return (
      <div
        className={`workspace-bitrow workspace-bitrow-${kind}`}
        role="img"
        aria-label={
          pattern === null
            ? `${label}: ${C.unknownResult}`
            : C.resultDescription(label, work.width, shown)
        }
        data-row={kind}
      >
        <span className="workspace-row-label" aria-hidden="true">
          {label}
        </span>
        <span className="workspace-groups" aria-hidden="true">
          {shown.match(/.{4}/g)!.map((group, index) => (
            <span className="workspace-nibble" key={index}>
              {[...group].map((value, offset) => (
                <span
                  className="workspace-cell"
                  data-value={value}
                  data-bit={work.width - 1 - index * 4 - offset}
                  key={offset}
                >
                  {value}
                </span>
              ))}
            </span>
          ))}
        </span>
      </div>
    );
  };
  const jump = (end: boolean) => {
    const node = scroller.current;
    if (!node) return;
    node.scrollLeft = end ? node.scrollWidth : 0;
    patch({ scrollLeft: node.scrollLeft });
  };
  const editorKey = (event: KeyboardEvent<HTMLButtonElement>, position: number) => {
    const nodes = [...editor.current!.querySelectorAll<HTMLButtonElement>("button[data-bit]")];
    const firstTop = nodes[0]!.getBoundingClientRect().top;
    const columns = nodes.filter(
      (node) => Math.abs(node.getBoundingClientRect().top - firstTop) < 1,
    ).length;
    const next =
      event.key === "Home"
        ? work.width - 1
        : event.key === "End"
          ? 0
          : event.key === "ArrowLeft"
            ? position + 1
            : event.key === "ArrowRight"
              ? position - 1
              : event.key === "ArrowUp"
                ? position + columns
                : event.key === "ArrowDown"
                  ? position - columns
                  : null;
    if (next === null) return;
    event.preventDefault();
    const selected = Math.max(0, Math.min(work.width - 1, next));
    patch({ selected });
    editor.current!.querySelector<HTMLButtonElement>(`[data-bit="${selected}"]`)!.focus();
  };
  const selectView = (view: Workspace["view"]) => patch({ view });
  const viewKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const view =
      event.key === "Home"
        ? "calculate"
        : event.key === "End"
          ? "edit"
          : work.view === "calculate"
            ? "edit"
            : "calculate";
    selectView(view);
    document.getElementById(`${id}-${view}-tab`)!.focus();
  };
  const selectedValue = Number((BigInt(work.pattern) >> BigInt(work.selected)) & 1n) as 0 | 1;
  const weight =
    (work.reading === "signed" && work.selected === work.width - 1 ? -1n : 1n) *
    (1n << BigInt(work.selected));
  const halves = work.width === 32 ? calculatorHalves(work.pattern) : null;

  if (!active) return null;
  return (
    <div className="al-programmer-panel calculator-workspace">
      <p className="workspace-help">{C.modeHelp}</p>
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
        <div role="group" aria-label={S.reading}>
          <span>{S.reading}</span>
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
      <p className="workspace-width-help">{C.widthHelp}</p>
      <h3 className="workspace-value-heading">{C.currentA}</h3>
      {readouts(work.pattern, C.currentA, "a", true)}
      <div className="workspace-load">
        <label htmlFor={`${id}-entry`}>{S.entry}</label>
        <div className="workspace-load-controls">
          <select
            aria-label={S.format}
            value={work.format}
            onChange={(e) => changeFormat("entry", e.target.value as CalculatorFormat)}
          >
            <option value="decimal">{S.decimal}</option>
            <option value="hex">{S.hex}</option>
          </select>
          <input
            id={`${id}-entry`}
            value={work.entry}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            {...invalid("entry")}
            aria-describedby={`${id}-entry-help`}
            onChange={(e) => draft("entry", { entry: e.target.value })}
            onKeyDown={enter(apply)}
          />
          <button type="button" onClick={apply}>
            {S.apply}
          </button>
        </div>
        <p id={`${id}-entry-help`} className="workspace-field-help">
          {range(work.format)}
        </p>
        {error("entry")}
      </div>
      <div className="workspace-tabs" role="tablist" aria-label={C.viewLabel}>
        {(["calculate", "edit"] as const).map((view) => (
          <button
            id={`${id}-${view}-tab`}
            key={view}
            type="button"
            role="tab"
            aria-selected={work.view === view}
            aria-controls={`${id}-${view}-panel`}
            tabIndex={work.view === view ? 0 : -1}
            onClick={() => selectView(view)}
            onKeyDown={viewKey}
          >
            {view === "calculate" ? C.calculateView : C.editView}
          </button>
        ))}
      </div>
      <section
        id={`${id}-calculate-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-calculate-tab`}
        hidden={work.view !== "calculate"}
      >
        <div className="workspace-operation">
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
          <label htmlFor={`${id}-operand`}>
            {work.operation === "shift-left" ? C.shiftAmountDecimal : S.second}
            <input
              id={`${id}-operand`}
              value={work.operation === "shift-left" ? work.shift : work.operand}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              {...invalid(work.operation === "shift-left" ? "shift" : "operand")}
              aria-describedby={`${id}-operand-help`}
              onChange={(e) =>
                work.operation === "shift-left"
                  ? draft("shift", { shift: e.target.value }, true)
                  : draft("operand", { operand: e.target.value }, true)
              }
              onKeyDown={enter(calculate)}
            />
          </label>
          {work.operation !== "shift-left" && (
            <label>
              {C.operandFormat}
              <select
                value={work.operandFormat}
                onChange={(e) => changeFormat("operand", e.target.value as CalculatorFormat)}
              >
                <option value="decimal">{S.decimal}</option>
                <option value="hex">{S.hex}</option>
              </select>
            </label>
          )}
          <button type="button" onClick={calculate}>
            {S.calculate}
          </button>
        </div>
        <p className="workspace-field-help" id={`${id}-operand-help`}>
          {work.operation === "shift-left" ? S.errors.shift : range(work.operandFormat)}
        </p>
        {error(work.operation === "shift-left" ? "shift" : "operand")}
        <div className="workspace-bit-tools">
          <strong>{S.bitRange(work.width)}</strong>
          <div>
            <button type="button" onClick={() => jump(false)}>
              {C.highBits}
            </button>
            <button type="button" onClick={() => jump(true)}>
              {C.lowBits}
            </button>
          </div>
        </div>
        <p className="workspace-field-help" id={`${id}-scroll-help`}>
          {C.sharedScrollHint}
        </p>
        <div
          className="workspace-scroll"
          ref={scroller}
          role="region"
          aria-label={C.snapshotHeading}
          aria-describedby={`${id}-scroll-help`}
          tabIndex={0}
          onScroll={(event) => {
            if (!active || work.view !== "calculate") return;
            const scrollLeft = event.currentTarget.scrollLeft;
            setWork((before) =>
              before.scrollLeft === scrollLeft ? before : { ...before, scrollLeft },
            );
          }}
        >
          <div className="workspace-track">
            <div className="workspace-bitrow workspace-index-row" aria-hidden="true">
              <span className="workspace-row-label">{C.bitIndices}</span>
              <span className="workspace-groups">
                {Array.from({ length: work.width / 4 }, (_, group) => (
                  <span className="workspace-nibble" key={group}>
                    {Array.from({ length: 4 }, (_, offset) => (
                      <span className="workspace-index" key={offset}>
                        {work.width - 1 - group * 4 - offset}
                      </span>
                    ))}
                  </span>
                ))}
              </span>
            </div>
            {stripRow(C.a, work.pattern, "a")}
            {work.operation !== "shift-left" &&
              stripRow(
                `${work.operation === "subtract" ? "−" : "+"} ${C.b}`,
                operand.ok ? operand.pattern : null,
                "b",
              )}
            {stripRow(C.result, work.trace?.pattern ?? null, "result")}
          </div>
        </div>
        {work.trace ? (
          <div className="workspace-result" aria-live="polite">
            <h3>{C.retainedResult}</h3>
            {readouts(work.trace.pattern, C.retainedResult, "result")}
            <p className="workspace-exact">
              {work.operation === "shift-left" ? C.fullShiftResult : C.exactResult}:{" "}
              <strong>
                <ProgrammerDecimal value={BigInt(work.trace.full)} />
              </strong>
            </p>
            <button
              type="button"
              onClick={() =>
                act({ pattern: work.trace!.pattern, entry: "" }, C.messages.resultUsed)
              }
            >
              {C.useResult}
            </button>
          </div>
        ) : (
          <p className="workspace-field-help">{C.calculateHint}</p>
        )}
        {!work.trace && work.full !== null && (
          <p className="workspace-exact">
            {C.previousExactResult}: <ProgrammerDecimal value={BigInt(work.full)} />
          </p>
        )}
      </section>
      <section
        id={`${id}-edit-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-edit-tab`}
        hidden={work.view !== "edit"}
      >
        <h3>{C.editingA}</h3>
        <div
          ref={editor}
          className="al-programmer-bits workspace-editor"
          role="group"
          aria-label={S.pattern}
        >
          {Array.from({ length: work.width }, (_, index) => work.width - 1 - index).map(
            (position) => {
              const value = Number((BigInt(work.pattern) >> BigInt(position)) & 1n);
              return (
                <button
                  type="button"
                  className="al-programmer-bit"
                  data-bit={position}
                  key={position}
                  aria-label={S.bit(position)}
                  aria-pressed={value === 1}
                  tabIndex={work.selected === position ? 0 : -1}
                  onFocus={() => patch({ selected: position })}
                  onKeyDown={(e) => editorKey(e, position)}
                  onClick={() =>
                    act(
                      {
                        pattern: calculatorPattern(
                          BigInt(work.pattern) ^ (1n << BigInt(position)),
                          work.width,
                        ).toString(),
                        selected: position,
                      },
                      "",
                    )
                  }
                >
                  <small aria-hidden="true">{position}</small>
                  <b aria-hidden="true">{value}</b>
                </button>
              );
            },
          )}
        </div>
        <p className="al-programmer-inspector">
          {S.inspector(
            work.selected,
            selectedValue,
            programmerNumber(weight * BigInt(selectedValue)),
            programmerNumber(weight),
          )}
        </p>
        <button type="button" onClick={() => act({ pattern: "0" }, S.messages.cleared)}>
          {S.clear}
        </button>
        {halves && (
          <details
            className="workspace-halves"
            open={work.halfOpen}
            onToggle={(e) => {
              if (e.currentTarget.open !== work.halfOpen) patch({ halfOpen: e.currentTarget.open });
            }}
          >
            <summary>{C.halfDisclosure}</summary>
            <div className="workspace-readouts">
              <div>
                <span>{S.upper}</span>
                <strong>{programmerNumber(halves.upper)}</strong>
              </div>
              <div>
                <span>{S.lower}</span>
                <strong>{programmerNumber(halves.lower)}</strong>
              </div>
            </div>
            <div className="workspace-operation">
              <label>
                {S.replaceHalf}
                <select
                  value={work.half}
                  onChange={(e) => patch({ half: e.target.value as "upper" | "lower" })}
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
                  onChange={(e) => draft("half", { halfValue: e.target.value })}
                  onKeyDown={enter(applyHalf)}
                />
              </label>
              <button type="button" onClick={applyHalf}>
                {S.applyHalf}
              </button>
            </div>
            {error("half")}
          </details>
        )}
      </section>
      <p className="al-programmer-message" role="status">
        {work.message}
      </p>
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
