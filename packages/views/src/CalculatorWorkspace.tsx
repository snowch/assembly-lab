// Copyright © 2026 Christopher Snow

import { useId, useLayoutEffect, useRef, type KeyboardEvent } from "react";
import {
  calculatorHalves,
  calculatorAdditionCarries,
  calculatorParse,
  calculatorParseEntry,
  calculatorEntryFormat,
  calculatorPattern,
  calculatorReading,
  calculatorSetHalf,
  type CalculatorOperation,
  type CalculatorReading,
} from "@al/machine";
import { useHandoffState } from "./update-handoff";
import { PROGRAMMER_CALCULATOR as S } from "./strings.programmer-calculator";
import { CALCULATOR_CARRIES as F } from "./strings.calculator-carries";
import { CALCULATOR_ENTRY as E } from "./strings.calculator-entry";
import { CALCULATOR_WORKSPACE as C } from "./strings.calculator-workspace";
import { ProgrammerDecimal, programmerHex, programmerNumber } from "./programmer-format";
import {
  initialWorkspace,
  workspaceCalculation,
  workspaceCodec,
  workspaceOperand,
  workspaceEntryForSettings,
  type Workspace,
  type WorkspaceField,
  type WorkspaceWidth,
} from "./calculator-workspace";

const bits = (value: string, width: number) => BigInt(value).toString(2).padStart(width, "0");
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
  const a = calculatorParseEntry(work.entry, work.width, work.reading);
  const operand = workspaceOperand(work);
  const showCarries = work.operation === "add" && work.showCarries;
  const carries =
    work.trace?.operation === "add"
      ? calculatorAdditionCarries(work.trace.a, work.trace.b, work.trace.width)
      : null;
  const minimum = work.reading === "signed" ? -(1n << BigInt(work.width - 1)) : 0n;
  const maximum =
    work.reading === "signed"
      ? (1n << BigInt(work.width - 1)) - 1n
      : (1n << BigInt(work.width)) - 1n;
  const enter = (run: () => void) => (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    event.stopPropagation();
    run();
  };
  const editA = (entry: string) => {
    const parsed = calculatorParseEntry(entry, work.width, work.reading);
    draft("entry", { entry, ...(parsed.ok ? { pattern: parsed.pattern } : {}) }, true);
  };
  const replaceA = (pattern: string, message = "") =>
    act(
      { pattern, entry: calculatorReading(BigInt(pattern), work.width, work.reading).toString() },
      message,
    );
  const calculate = () => {
    const calculated = workspaceCalculation(work);
    if (!calculated.ok)
      return patch({ error: { field: calculated.field, code: calculated.code }, message: "" });
    patch({
      pattern: calculated.trace.a,
      trace: calculated.trace,
      full: calculated.trace.full,
      error: null,
      message: S.messages.calculated,
    });
  };
  const settings = (width: WorkspaceWidth, reading: CalculatorReading) => {
    if (width === work.width && reading === work.reading) return;
    const entry = workspaceEntryForSettings(work.entry, work.width, work.reading, width, reading);
    const parsed = calculatorParseEntry(entry, width, reading);
    act(
      {
        width,
        reading,
        pattern: parsed.ok
          ? parsed.pattern
          : calculatorPattern(BigInt(work.pattern), width).toString(),
        entry,
        operand: workspaceEntryForSettings(work.operand, work.width, work.reading, width, reading),
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
  const applyHalf = () => {
    const parsed = calculatorParse(work.halfValue, "decimal", 32, "unsigned");
    if (!parsed.ok || BigInt(parsed.pattern) > 65535n)
      return patch({ error: { field: "half", code: "half" }, message: "" });
    replaceA(
      calculatorSetHalf(a.ok ? a.pattern : "0", work.half, parsed.pattern),
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
  const errorMessage = (field: WorkspaceField) => {
    const code = work.error!.code;
    if (code === "binary") return E.binaryError;
    if (field === "entry" || field === "operand") {
      if (code === "decimal" || code === "hex") return E.notationError;
      if (code === "range")
        return calculatorEntryFormat(field === "entry" ? work.entry : work.operand) === "decimal"
          ? E.decimalRangeError(programmerNumber(minimum), programmerNumber(maximum))
          : E.patternRangeError(work.width);
    }
    return S.errors[code];
  };
  const error = (field: WorkspaceField) =>
    work.error?.field === field ? (
      <p className="al-programmer-error" id={`${id}-${field}-error`} role="status">
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
  const stripRow = (label: string, pattern: string | null, kind: string) => {
    const shown = pattern === null ? "?".repeat(work.width) : bits(pattern, work.width);
    return (
      <div
        className={`workspace-bitrow workspace-bitrow-${kind}`}
        role="img"
        aria-label={
          pattern === null
            ? `${label}: ${kind === "a" || kind === "b" ? C.unknownPreview : C.unknownResult}`
            : kind === "carry"
              ? F.rowDescription(shown, work.width)
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
                  data-sign-bit={work.width - 1 - index * 4 - offset === work.width - 1}
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
  const editablePattern = a.ok ? a.pattern : "0";
  const selectedValue = Number((BigInt(editablePattern) >> BigInt(work.selected)) & 1n) as 0 | 1;
  const weight =
    (work.reading === "signed" && work.selected === work.width - 1 ? -1n : 1n) *
    (1n << BigInt(work.selected));
  const halves = a.ok && work.width === 32 ? calculatorHalves(a.pattern) : null;

  if (!active) return null;
  return (
    <div
      className="al-programmer-panel calculator-workspace"
      data-show-carries={showCarries || undefined}
    >
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
      <p className="workspace-field-help">
        {work.reading === "signed" ? S.signedHelp : S.unsignedHelp} {S.hexHelp}
      </p>
      <p className="workspace-width-help">{E.widthHelp}</p>
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
      <div className="workspace-value">
        <label htmlFor={`${id}-entry`}>{C.currentA}</label>
        <input
          id={`${id}-entry`}
          value={work.entry}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          {...invalid("entry")}
          aria-describedby={`${id}-${work.view === "edit" ? "edit-notation" : "notation"}-help`}
          onChange={(e) => editA(e.target.value)}
          onKeyDown={work.view === "calculate" ? enter(calculate) : undefined}
        />
        {readouts(a.ok ? a.pattern : null, C.currentA, "a")}
        {error("entry")}
      </div>
      <section
        id={`${id}-calculate-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-calculate-tab`}
        hidden={work.view !== "calculate"}
      >
        <div className="workspace-value">
          <label htmlFor={`${id}-operand`}>
            {work.operation === "shift-left" ? C.shiftAmountDecimal : C.currentB}
          </label>
          <input
            id={`${id}-operand`}
            value={work.operation === "shift-left" ? work.shift : work.operand}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            {...invalid(work.operation === "shift-left" ? "shift" : "operand")}
            aria-describedby={
              work.operation === "shift-left" ? `${id}-shift-help` : `${id}-notation-help`
            }
            onChange={(e) =>
              work.operation === "shift-left"
                ? draft("shift", { shift: e.target.value }, true)
                : draft("operand", { operand: e.target.value }, true)
            }
            onKeyDown={enter(calculate)}
          />
          {work.operation !== "shift-left" &&
            readouts(operand.ok ? operand.pattern : null, C.currentB, "b")}
          {work.operation === "shift-left" && (
            <p className="workspace-field-help" id={`${id}-shift-help`}>
              {S.errors.shift}
            </p>
          )}
          {error(work.operation === "shift-left" ? "shift" : "operand")}
        </div>
        <p className="workspace-field-help" id={`${id}-notation-help`}>
          {E.notationHint}
        </p>
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
          <button type="button" className="workspace-calculate" onClick={calculate}>
            {S.calculate}
          </button>
        </div>
        <div className="workspace-bit-tools">
          <strong>{S.bitRange(work.width)}</strong>
          <div>
            {work.operation === "add" && (
              <button
                type="button"
                aria-pressed={work.showCarries}
                aria-controls={`${id}-comparison`}
                onClick={() => patch({ showCarries: !work.showCarries })}
              >
                {F.showCarries}
              </button>
            )}
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
        {showCarries && (
          <p className="workspace-field-help" id={`${id}-carry-help`}>
            {F.help} {F.signBit(work.width)}
          </p>
        )}
        <div
          id={`${id}-comparison`}
          className="workspace-scroll"
          ref={scroller}
          role="region"
          aria-label={C.snapshotHeading}
          aria-describedby={`${id}-scroll-help${showCarries ? ` ${id}-carry-help` : ""}`}
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
            {showCarries && stripRow(F.carryIn, carries?.carries ?? null, "carry")}
            {stripRow(C.a, a.ok ? a.pattern : null, "a")}
            {work.operation !== "shift-left" &&
              stripRow(
                `${work.operation === "subtract" ? "−" : "+"} ${C.b}`,
                operand.ok ? operand.pattern : null,
                "b",
              )}
            {stripRow(C.result, work.trace?.pattern ?? null, "result")}
          </div>
        </div>
        {showCarries && (
          <div className="workspace-carry-details" aria-live="polite">
            {carries ? (
              <>
                <dl className="workspace-carry-ports">
                  <div>
                    <dt>{F.intoSign(work.width - 1)}</dt>
                    <dd data-carry-into-sign>{carries.intoSign}</dd>
                  </div>
                  <div>
                    <dt>{F.carryOut}</dt>
                    <dd data-carry-out>{carries.out}</dd>
                  </div>
                </dl>
                <p className="workspace-field-help">{F.overflowHelp}</p>
                <p className="workspace-field-help">{F.xorHelp}</p>
                <dl className="workspace-carry-flags">
                  <div>
                    <dt>{F.cLabel}</dt>
                    <dd data-flag="c" data-value={carries.c}>
                      {F.cEquation(carries.c)}
                    </dd>
                  </div>
                  <div>
                    <dt>{F.vLabel}</dt>
                    <dd data-flag="v" data-value={carries.v}>
                      {F.vEquation(carries.intoSign, carries.out, carries.v)}
                    </dd>
                  </div>
                </dl>
                <p className="workspace-field-help">
                  <strong>{carries.v === 1 ? F.different : F.matching}</strong>
                </p>
              </>
            ) : (
              <p className="workspace-field-help">{F.unknown}</p>
            )}
          </div>
        )}
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
              onClick={() => replaceA(work.trace!.pattern, C.messages.resultUsed)}
            >
              {C.useResult}
            </button>
          </div>
        ) : !showCarries ? (
          <p className="workspace-field-help">{C.calculateHint}</p>
        ) : null}
      </section>
      <section
        id={`${id}-edit-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-edit-tab`}
        hidden={work.view !== "edit"}
      >
        <p id={`${id}-edit-notation-help`} className="workspace-field-help">
          {E.notationHint}
        </p>
        <h3>{C.editingA}</h3>
        {!a.ok && <p className="workspace-field-help">{C.editUnavailable}</p>}
        <fieldset className="workspace-editor-controls" disabled={!a.ok} hidden={!a.ok}>
          <div
            ref={editor}
            className="al-programmer-bits workspace-editor"
            role="group"
            aria-label={S.pattern}
          >
            {Array.from({ length: work.width }, (_, index) => work.width - 1 - index).map(
              (position) => {
                const value = Number((BigInt(editablePattern) >> BigInt(position)) & 1n);
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
                    onClick={() => {
                      patch({ selected: position });
                      replaceA(
                        calculatorPattern(
                          BigInt(editablePattern) ^ (1n << BigInt(position)),
                          work.width,
                        ).toString(),
                      );
                    }}
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
        </fieldset>
        <button type="button" onClick={() => replaceA("0", S.messages.cleared)}>
          {S.clear}
        </button>
        {a.ok && halves && (
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
