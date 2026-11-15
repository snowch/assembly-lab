// Copyright © 2026 Christopher Snow

import {
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";
import {
  calculatorAdditionCarries,
  calculatorHalves,
  calculatorParseEntry,
  calculatorPattern,
} from "@al/machine";
import type { Workspace } from "./calculator-workspace";
import { workspaceOperand } from "./calculator-workspace";
import { CALCULATOR_WORKSPACE as C } from "./strings.calculator-workspace";
import { COMPACT_CALCULATOR as D } from "./strings.compact-calculator";
import { CALCULATOR_CARRIES as F } from "./strings.calculator-carries";
import { PROGRAMMER_CALCULATOR as S } from "./strings.programmer-calculator";
import { programmerNumber } from "./programmer-format";

const bits = (value: string, width: number) => BigInt(value).toString(2).padStart(width, "0");
type Props = {
  id: string;
  work: Workspace;
  onChange: (value: Partial<Workspace>) => void;
  onReplaceA: (pattern: string, message?: string) => void;
  onHalfDraft: (value: string) => void;
  onApplyHalf: () => void;
  halfRef: RefObject<HTMLInputElement | null>;
  halfInvalid: { "aria-invalid": boolean | undefined; "aria-errormessage": string | undefined };
  halfError: ReactNode;
};

/** Editable A retains the same columns as B and the result in one scrolling word. */
export function CalculatorInspection({
  id,
  work,
  onChange,
  onReplaceA,
  onHalfDraft,
  onApplyHalf,
  halfRef,
  halfInvalid,
  halfError,
}: Props) {
  const scroller = useRef<HTMLDivElement>(null),
    editor = useRef<HTMLDivElement>(null);
  const latest = useRef(work);
  latest.current = work;
  const [range, setRange] = useState<[number, number]>([work.width - 1, 0]);
  const a = calculatorParseEntry(work.entry, work.width, work.reading),
    operand = workspaceOperand(work);
  const editing = work.view === "edit",
    showCarries = work.operation === "add" && work.showCarries;
  const carries =
    work.trace?.operation === "add"
      ? calculatorAdditionCarries(work.trace.a, work.trace.b, work.trace.width)
      : null;
  const updateRange = () => {
    const node = scroller.current;
    if (!node || !work.bitsOpen) return;
    const box = node.getBoundingClientRect();
    const label =
      node.querySelector(".workspace-row-label")?.getBoundingClientRect().right ?? box.left;
    const visible = [...node.querySelectorAll<HTMLElement>(".workspace-index[data-bit]")].filter(
      (cell) => {
        const rect = cell.getBoundingClientRect(),
          centre = rect.left + rect.width / 2;
        return centre >= label && centre <= box.right;
      },
    );
    const high = Number(visible[0]?.dataset.bit),
      low = Number(visible.at(-1)?.dataset.bit);
    if (Number.isFinite(high) && Number.isFinite(low))
      setRange((before) => (before[0] === high && before[1] === low ? before : [high, low]));
  };
  useLayoutEffect(() => {
    const node = scroller.current;
    if (!node || !work.bitsOpen) return;
    const align = () => {
      if (!node.clientWidth) return;
      const position = latest.current.scrollLeft;
      node.scrollLeft = position < 0 ? node.scrollWidth : position;
      updateRange();
    };
    align();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(align) : null;
    observer?.observe(node);
    return () => observer?.disconnect();
  }, [work.bitsOpen, work.width, editing]);
  const jump = (end: boolean) => {
    const node = scroller.current;
    if (!node) return;
    node.scrollLeft = end ? node.scrollWidth : 0;
    onChange({ scrollLeft: node.scrollLeft });
    updateRange();
  };
  const editorKey = (event: KeyboardEvent<HTMLButtonElement>, position: number) => {
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
                ? position + 4
                : event.key === "ArrowDown"
                  ? position - 4
                  : null;
    if (next === null) return;
    event.preventDefault();
    const selected = Math.max(0, Math.min(work.width - 1, next));
    onChange({ selected });
    editor.current?.querySelector<HTMLButtonElement>(`[data-bit="${selected}"]`)?.focus();
  };
  const stripRow = (label: string, pattern: string | null, kind: string) => {
    const shown = pattern === null ? "?".repeat(work.width) : bits(pattern, work.width);
    const editable = kind === "a" && editing && a.ok;
    return (
      <div
        className={`workspace-bitrow workspace-bitrow-${kind}${editable ? " workspace-editor" : ""}`}
        ref={editable ? editor : undefined}
        role={editable ? "group" : "img"}
        aria-label={
          editable
            ? S.pattern
            : pattern === null
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
        <span className="workspace-groups" aria-hidden={editable ? undefined : true}>
          {shown.match(/.{4}/g)!.map((group, index) => (
            <span className="workspace-nibble" key={index}>
              {[...group].map((value, offset) => {
                const position = work.width - 1 - index * 4 - offset;
                const attributes = {
                  "data-value": value,
                  "data-sign-bit": position === work.width - 1,
                  "data-bit": position,
                };
                return editable ? (
                  <button
                    type="button"
                    key={offset}
                    className="workspace-cell workspace-edit-bit"
                    {...attributes}
                    aria-label={S.bit(position)}
                    aria-pressed={value === "1"}
                    tabIndex={work.selected === position ? 0 : -1}
                    onFocus={() => onChange({ selected: position })}
                    onKeyDown={(event) => editorKey(event, position)}
                    onClick={() =>
                      onReplaceA(
                        calculatorPattern(
                          BigInt(a.pattern) ^ (1n << BigInt(position)),
                          work.width,
                        ).toString(),
                      )
                    }
                  >
                    {value}
                  </button>
                ) : (
                  <span className="workspace-cell" key={offset} {...attributes}>
                    {value}
                  </span>
                );
              })}
            </span>
          ))}
        </span>
      </div>
    );
  };
  const halves = a.ok && work.width === 32 ? calculatorHalves(a.pattern) : null;
  const selectedValue = a.ok
    ? (Number((BigInt(a.pattern) >> BigInt(work.selected)) & 1n) as 0 | 1)
    : 0;
  const weight =
    (work.reading === "signed" && work.selected === work.width - 1 ? -1n : 1n) *
    (1n << BigInt(work.selected));
  return (
    <details
      className="workspace-inspection"
      open={work.bitsOpen}
      onToggle={(event) => {
        if (event.currentTarget.open !== work.bitsOpen)
          onChange({ bitsOpen: event.currentTarget.open });
      }}
    >
      <summary>{D.inspection}</summary>
      <div className="workspace-bit-tools">
        <strong>{S.bitRange(work.width)}</strong>
        <div>
          <button type="button" onClick={() => jump(false)}>
            {C.highBits}
          </button>
          <button type="button" onClick={() => jump(true)}>
            {C.lowBits}
          </button>
          {work.operation === "add" && (
            <button
              type="button"
              aria-pressed={work.showCarries}
              aria-controls={`${id}-comparison`}
              onClick={() =>
                onChange({
                  showCarries: !work.showCarries,
                  ...(work.showCarries ? {} : { showFlags: true }),
                })
              }
            >
              {F.showCarries}
            </button>
          )}
          <button
            type="button"
            aria-pressed={editing}
            onClick={() => onChange({ view: editing ? "calculate" : "edit" })}
          >
            {editing ? D.finishEditing : D.editBits}
          </button>
        </div>
      </div>
      <p className="workspace-field-help" id={`${id}-scroll-help`}>
        {D.visibleBits(range[0], range[1], work.width)}. {C.sharedScrollHint}
      </p>
      <div
        id={`${id}-comparison`}
        className="workspace-scroll"
        ref={scroller}
        role="region"
        aria-label={C.snapshotHeading}
        aria-describedby={`${id}-scroll-help ${id}-sign-help`}
        tabIndex={0}
        data-editing={editing || undefined}
        onScroll={(event) => {
          const scrollLeft = event.currentTarget.scrollLeft;
          if (scrollLeft !== work.scrollLeft) onChange({ scrollLeft });
          updateRange();
        }}
      >
        <div className="workspace-track">
          <div className="workspace-bitrow workspace-index-row" aria-hidden="true">
            <span className="workspace-row-label">{C.bitIndices}</span>
            <span className="workspace-groups">
              {Array.from({ length: work.width / 4 }, (_, group) => (
                <span className="workspace-nibble" key={group}>
                  {Array.from({ length: 4 }, (_, offset) => (
                    <span
                      className="workspace-index"
                      data-bit={work.width - 1 - group * 4 - offset}
                      key={offset}
                    >
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
      <p className="workspace-field-help" id={`${id}-sign-help`}>
        {D.signBit(work.width)}
      </p>
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
              <p className="workspace-field-help">
                <span>{F.help}</span> <span>{F.overflowHelp}</span> <span>{F.xorHelp}</span>
              </p>
              <p>{F.cEquation(carries.c)}</p>
              <p>{F.vEquation(carries.intoSign, carries.out, carries.v)}</p>
              <p>
                <strong>{carries.v === 1 ? F.different : F.matching}</strong>
              </p>
            </>
          ) : (
            <p className="workspace-field-help">{F.unknown}</p>
          )}
        </div>
      )}
      {editing && (
        <div className="workspace-edit-help">
          <p className="workspace-field-help">{a.ok ? D.inspectorEditHelp : C.editUnavailable}</p>
          {a.ok && (
            <p className="al-programmer-inspector">
              {S.inspector(
                work.selected,
                selectedValue,
                programmerNumber(weight * BigInt(selectedValue)),
                programmerNumber(weight),
              )}
            </p>
          )}
          <button type="button" onClick={() => onReplaceA("0", S.messages.cleared)}>
            {S.clear}
          </button>
        </div>
      )}
      {halves && (
        <details
          className="workspace-halves"
          open={work.halfOpen}
          onToggle={(event) => {
            if (event.currentTarget.open !== work.halfOpen)
              onChange({ halfOpen: event.currentTarget.open });
          }}
        >
          <summary>{D.halfDisclosure}</summary>
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
                onChange={(event) => onChange({ half: event.target.value as "upper" | "lower" })}
              >
                <option value="upper">{S.upper}</option>
                <option value="lower">{S.lower}</option>
              </select>
            </label>
            <div className="workspace-half-field">
              <label htmlFor={`${id}-half`}>{S.halfValue}</label>
              <input
                id={`${id}-half`}
                ref={halfRef}
                value={work.halfValue}
                inputMode="numeric"
                {...halfInvalid}
                aria-describedby={halfInvalid["aria-errormessage"]}
                onChange={(event) => onHalfDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    onApplyHalf();
                  }
                }}
              />
              {halfError}
            </div>
            <button type="button" onClick={onApplyHalf}>
              {S.applyHalf}
            </button>
          </div>
        </details>
      )}
    </details>
  );
}
