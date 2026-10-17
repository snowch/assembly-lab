// Copyright © 2026 Christopher Snow

// An addition drawn column by column, as on paper: the carry into each column above the two
// numbers, the answer below, and the four flags beside it. It is stepped a column at a time from the
// right. Every bit is read from the `addition` record the simulator keeps for the instruction (the
// two numbers, the carry into every bit, the carry out of the top and the answer), and the flags
// are the ones the instruction left. Nothing is added up in the figure but the three bits of one
// column, shown beside the grid as a small calculation, and a test holds that sum to the record.
//
// A lesson may ask for more, through optional props whose defaults leave the figure as it was:
// `detail` adds a step by group of four columns, the column just worked as a calculation, the labels
// of the top bit and the lowest bit, and, once the top bit is worked, a panel of the two carries at
// bit 31 with the lines for C and V; `summary` adds the result to that panel; `opensAtEnd` opens
// the figure with every column worked. A subtraction's record also draws the second number as it was
// given, above the same number with every bit changed.

import { useMemo, useState } from "react";
import { z } from "zod";

import type { Addition, Step } from "@al/machine";
import { useSlot, useStored } from "@platform/lesson-runtime";

import {
  additionSteps,
  bitAt,
  columnWork,
  endOfGroup,
  hex32,
  secondAsGiven,
  topCarries,
} from "../arith";
import { FlagsRow } from "../FlagsRow";
import { withCode } from "../parts";
import { ARITH_STRINGS as A } from "../strings.arith";
import { VIEW_STRINGS as S } from "../strings";
import { traceOf, type Trace } from "../trace";
import { passedChallenge } from "./gate";
import { CallSchema, RecordedSchema, withProps } from "./props";

const Props = z.object({
  program: RecordedSchema,
  call: CallSchema,
  /** Which addition or subtraction of the run to draw: 0 is the first. */
  which: z.number().int().min(0).default(0),
  /** The id of a prediction in this lesson. The figure stays shut until it has been checked. */
  after: z.string().optional(),
  /**
   * The id of a challenge in this lesson. The figure stays shut until the learner's saved work for
   * it passes its tests (graded afresh, never read as a mark).
   */
  afterChallenge: z.string().optional(),
  /**
   * A step by group of four columns, the column just worked as a calculation, labels over the top
   * and lowest bits, and the panel of carries at bit 31 with the lines for C and V.
   */
  detail: z.boolean().default(false),
  /** With `detail`: the result, as the first line of the panel at bit 31. */
  summary: z.boolean().default(false),
  /** Open with every column worked, the final state; Back and Reset step from there. */
  opensAtEnd: z.boolean().default(false),
  /** Words under the figure, shown once it is open (so a note after a challenge waits for the pass). */
  note: z.string().optional(),
});

/** The columns, left to right: the 33rd place for the carry out, then the groups the figure draws. */
function groupsOf(size: 4 | 8): readonly (readonly number[])[] {
  const groups: number[][] = [[32]];
  for (let top = 31; top >= 0; top -= size)
    groups.push(Array.from({ length: size }, (_, i) => top - i));
  return groups;
}

interface Cell {
  readonly column: number;
  /** "0", "1", or "" while the column has not been worked out. */
  readonly text: string;
  readonly shown: boolean;
}

function Cells({
  row,
  cells,
  justDone,
  carry = false,
  size,
  topBit = false,
}: {
  row: string;
  cells: readonly Cell[];
  justDone: number | null;
  carry?: boolean;
  size: 4 | 8;
  /** Frame the top bit's column, so it is set apart by a shape as well as by its label. */
  topBit?: boolean;
}) {
  const at = (column: number) => cells.find((c) => c.column === column);
  return (
    <span className="al-adder-cells" data-size={size} aria-hidden="true">
      {groupsOf(size).map((group, g) => (
        <span className="al-adder-group" data-single={group.length === 1} key={g}>
          {group.map((column) => {
            const cell = at(column);
            const top = carry && (column === 31 || column === 32);
            return (
              <span
                key={column}
                className={carry ? "al-adder-cell al-adder-carry" : "al-adder-cell al-bit"}
                data-row={row}
                data-col={column}
                data-shown={cell?.shown ?? false}
                data-value={cell?.shown ? cell.text : undefined}
                data-on={cell?.shown === true && cell.text === "1"}
                data-current={justDone === column}
                data-top={top ? (column === 32 ? "out" : "in") : undefined}
                data-top-bit={topBit && column === 31 ? "true" : undefined}
                title={
                  top ? (column === 32 ? A.adder.carryOutOfTop : A.adder.carryIntoTop) : undefined
                }
              >
                {cell?.shown ? cell.text : " "}
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}

/** The row of labels over the grid: the top bit's column and the lowest bit's, each with a marker shape. */
function Marks({ size }: { size: 4 | 8 }) {
  return (
    <span className="al-adder-cells" data-size={size} aria-hidden="true">
      {groupsOf(size).map((group, g) => (
        <span className="al-adder-group" data-single={group.length === 1} key={g}>
          {group.map((column) => (
            <span key={column} className="al-adder-cell" data-col={column}>
              {(column === 31 || column === 0) && (
                <span className="al-adder-mark" data-mark={column === 31 ? "top" : "low"}>
                  {A.adder.bitLabel(column)}
                </span>
              )}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

function Head({ name, detail }: { name: string; detail?: string | undefined }) {
  return (
    <span className="al-adder-head">
      <span className="al-adder-name">{withCode(name)}</span>
      {detail !== undefined && <span className="al-adder-value">{detail}</span>}
    </span>
  );
}

/** The names the instruction gives its operands: where the answer goes, and the two it adds. */
function namesOf(trace: Trace, step: Step) {
  const ins = trace.program.instructions.find((i) => i.address === step.address);
  const ops = ins?.operands.map((o) => o.text) ?? [];
  return ops.length === 3 ? { answer: ops[0]!, a: ops[1]!, b: ops[2]! } : null;
}

/** The column just worked, as a small calculation: its three bits, their total, and the two things it passes on. */
function Calc({
  record,
  done,
  names,
}: {
  record: Addition;
  done: number;
  names: { a: string; b: string } | null;
}) {
  const work = done > 0 ? columnWork(record, done - 1) : null;
  const rows: [string, string, string][] = [
    ["carry-in", A.adder.calc.carryIn, work ? String(work.carryIn) : "–"],
    ["a", A.adder.calc.bitOf(names?.a ?? "a"), work ? String(work.a) : "–"],
    [
      "b",
      record.subtraction
        ? A.adder.calc.bitOfChanged(names?.b ?? "b")
        : A.adder.calc.bitOf(names?.b ?? "b"),
      work ? String(work.b) : "–",
    ],
    [
      "total",
      A.adder.calc.total,
      work ? `${work.carryIn} + ${work.a} + ${work.b} = ${work.total}` : "–",
    ],
    ["kept", A.adder.calc.kept, work ? String(work.kept) : "–"],
    ["carry-out", A.adder.calc.carryOut, work ? String(work.carryOut) : "–"],
  ];
  return (
    <div
      className="al-adder-calc"
      role="group"
      aria-label={A.adder.calc.group}
      data-column={work ? work.bit : "none"}
    >
      <p className="al-adder-calc-head">
        {work ? A.adder.calc.heading(work.bit) : A.adder.calc.none}
      </p>
      <dl>
        {rows.map(([key, label, value]) => (
          <div key={key} data-calc={key}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** The two carries at bit 31, and the lines for C and V that they give; the result first, if asked. */
function Final({
  record,
  c,
  v,
  result,
}: {
  record: Addition;
  c: 0 | 1;
  v: 0 | 1;
  result: boolean;
}) {
  const { into, out } = topCarries(record);
  const lines: [string, string][] = [
    ...(result
      ? ([["result", A.adder.summary.result(hex32(record.result), Number(record.result))]] as [
          string,
          string,
        ][])
      : []),
    ["into", A.adder.final.carryInto(into)],
    ["out", A.adder.final.carryOutOf(out)],
    ["c", record.subtraction ? A.adder.final.cSub(c) : A.adder.final.c(c)],
    ["v", A.adder.final.v(v, into, out)],
  ];
  return (
    <ul className="al-adder-final" aria-label={A.adder.final.group}>
      {lines.map(([key, text]) => (
        <li key={key} data-line={key}>
          {text}
        </li>
      ))}
    </ul>
  );
}

export const AdderFigure = withProps(Props, function AdderFigure({ data, store, lesson }) {
  const [done, setDone] = useState(data.opensAtEnd ? 32 : 0);
  // The columns a group move just worked, until the next move of any other kind.
  const [moved, setMoved] = useState<{ from: number; to: number } | null>(null);
  const [prediction] = useSlot<{ choice: string }>(store, data.after ?? "");
  const stored = useStored(store);
  const trace = useMemo(() => traceOf(data.program, data.call), [data.program, data.call]);
  if (data.after !== undefined && prediction === undefined) {
    return (
      <p role="note" className="al-locked">
        {S.stepper.locked}
      </p>
    );
  }
  if (data.afterChallenge !== undefined && !passedChallenge(lesson, stored, data.afterChallenge)) {
    return (
      <p role="note" className="al-locked">
        {A.adder.lockedUntilPassed}
      </p>
    );
  }
  const step = additionSteps(trace)[data.which];
  const record = step?.addition;
  if (!step || !record) throw new Error(A.adder.noAddition);
  const names = namesOf(trace, step);

  const go = (to: number) => {
    setMoved(null);
    setDone(to);
  };
  const detail = data.detail;
  const size = detail ? 4 : 8;

  const columns = [...Array(33).keys()];
  // The carry into column i is known once column i - 1 is added; the carry out of the top is the
  // carry into the 33rd place.
  const carryCells: Cell[] = columns.map((column) => ({
    column,
    shown: column <= done,
    text: String(column === 32 ? record.carryOut : bitAt(record.carries, column)),
  }));
  const bitCells = (value: bigint, upTo: number): Cell[] =>
    columns.map((column) => ({
      column,
      shown: column < upTo && column < 32,
      text: String(bitAt(value, column)),
    }));
  const justDone = done > 0 ? done - 1 : null;
  const finished = done >= 32;
  const flagsBefore = step.flagsBefore;
  const flagsAfter = step.flagsAfter;

  const j = done - 1;
  // A figure with `detail` names a column as a bit, from 0; without it, as it always did, from 1.
  const describe = (column: number) =>
    A.adder.column(
      detail ? column : column + 1,
      bitAt(record.a, column),
      bitAt(record.b, column),
      bitAt(record.carries, column),
      bitAt(record.result, column),
      column === 31 ? record.carryOut : bitAt(record.carries, column + 1),
    );
  const status =
    done === 0
      ? A.adder.start
      : finished
        ? `${describe(31)} ${A.adder.done}${detail ? "" : ` ${A.adder.topBit}`}`
        : describe(j);
  const worked = moved ? `${A.adder.groupWorked(moved.from, moved.to)} ` : "";

  // The carries at bit 31 and what they give: under the flags, or for a figure that gives the
  // result too (`summary`), first, so that the final state is what the figure opens with.
  const final =
    detail && finished ? (
      <Final
        record={record}
        c={flagsAfter.c ? 1 : 0}
        v={flagsAfter.v ? 1 : 0}
        result={data.summary}
      />
    ) : null;
  const flagsRow = (
    <FlagsRow flags={finished ? flagsAfter : null} before={finished ? flagsBefore : null} />
  );

  return (
    <div
      className="al-figure al-adder"
      data-figure="adder"
      data-done={done}
      data-detail={detail}
      role="group"
      aria-label={A.adder.rows}
    >
      {data.summary && final}
      <div className="al-adder-main">
        <div className="al-adder-rows">
          {detail && (
            <div className="al-adder-row" data-row="marks">
              <span className="al-adder-head" aria-hidden="true" />
              <Marks size={size} />
            </div>
          )}
          <div className="al-adder-row" data-row="carry">
            <Head
              name={A.adder.carryRow}
              detail={detail ? `${A.adder.calc.carryIn}: ${record.carryIn}` : undefined}
            />
            <Cells
              row="carry"
              cells={carryCells}
              justDone={justDone}
              carry
              size={size}
              topBit={detail}
            />
            <p className="al-adder-key">{A.adder.topKey}</p>
          </div>
          <div className="al-adder-row" data-row="a">
            <Head name={names?.a ?? "a"} detail={hex32(record.a)} />
            <Cells
              row="a"
              cells={bitCells(record.a, 33)}
              justDone={justDone}
              size={size}
              topBit={detail}
            />
          </div>
          {detail && record.subtraction && (
            <div className="al-adder-row" data-row="b-given">
              <Head name={names?.b ?? "b"} detail={hex32(secondAsGiven(record))} />
              <Cells
                row="b-given"
                cells={bitCells(secondAsGiven(record), 33)}
                justDone={justDone}
                size={size}
                topBit
              />
            </div>
          )}
          <div className="al-adder-row" data-row="b">
            <Head
              name={record.subtraction ? A.adder.turnedOver(names?.b ?? "b") : (names?.b ?? "b")}
              detail={hex32(record.b)}
            />
            <Cells
              row="b"
              cells={bitCells(record.b, 33)}
              justDone={justDone}
              size={size}
              topBit={detail}
            />
          </div>
          <div className="al-adder-row" data-row="sum">
            <Head
              name={`${A.adder.answerRow}${names ? `, ${names.answer}` : ""}`}
              detail={finished ? hex32(record.result) : undefined}
            />
            <Cells
              row="sum"
              cells={bitCells(record.result, done)}
              justDone={justDone}
              size={size}
              topBit={detail}
            />
          </div>
        </div>
        {detail && <Calc record={record} done={done} names={names} />}
      </div>
      {detail ? (
        <div className="al-adder-lower">
          {flagsRow}
          {!data.summary && final}
        </div>
      ) : (
        flagsRow
      )}
      <div className="al-controls" role="group" aria-label={A.adder.controls}>
        <button
          type="button"
          className="button primary"
          disabled={finished}
          onClick={() => go(done + 1)}
        >
          {A.adder.next}
        </button>
        {detail && (
          <button
            type="button"
            className="button primary"
            disabled={finished}
            onClick={() => {
              const to = endOfGroup(done);
              setMoved({ from: done, to: to - 1 });
              setDone(to);
            }}
          >
            {A.adder.nextGroup}
          </button>
        )}
        <button
          type="button"
          className="button secondary"
          disabled={done === 0}
          onClick={() => go(Math.max(0, done - 1))}
        >
          {A.adder.back}
        </button>
        <button
          type="button"
          className="button secondary"
          disabled={finished}
          onClick={() => go(32)}
        >
          {A.adder.all}
        </button>
        <button
          type="button"
          className="button secondary"
          disabled={done === 0}
          onClick={() => go(0)}
        >
          {A.adder.reset}
        </button>
      </div>
      <p className="al-status" role="status">
        {worked}
        {status}
      </p>
      {data.note !== undefined && <p className="al-adder-note">{withCode(data.note)}</p>}
    </div>
  );
});
