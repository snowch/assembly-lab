// Copyright © 2026 Christopher Snow

// An addition drawn column by column, as on paper: the carry into each column above the two
// numbers, the answer below, and the four flags beside it. It is stepped a column at a time from the
// right. Every bit is read from the `addition` record the simulator keeps for the instruction (the
// two numbers, the carry into every bit, the carry out of the top and the answer), and the flags
// are the ones the instruction left. Nothing is added up in the figure.

import { useMemo, useState } from "react";
import { z } from "zod";

import type { Step } from "@al/machine";
import { useSlot, useStored, type StoredLesson } from "@platform/lesson-runtime";
import type { Lesson } from "@platform/lesson-schema";

import { additionSteps, bitAt, hex32 } from "../arith";
import { FlagsRow } from "../FlagsRow";
import { grade } from "../grader";
import { withCode } from "../parts";
import { ARITH_STRINGS as A } from "../strings.arith";
import { VIEW_STRINGS as S } from "../strings";
import { traceOf, type Trace } from "../trace";
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
});

/** The columns, left to right: the 33rd place for the carry out, then four groups of eight. */
const GROUPS: readonly (readonly number[])[] = [
  [32],
  [31, 30, 29, 28, 27, 26, 25, 24],
  [23, 22, 21, 20, 19, 18, 17, 16],
  [15, 14, 13, 12, 11, 10, 9, 8],
  [7, 6, 5, 4, 3, 2, 1, 0],
];

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
}: {
  row: string;
  cells: readonly Cell[];
  justDone: number | null;
  carry?: boolean;
}) {
  const at = (column: number) => cells.find((c) => c.column === column);
  return (
    <span className="al-adder-cells" aria-hidden="true">
      {GROUPS.map((group, g) => (
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
                title={
                  top ? (column === 32 ? A.adder.carryOutOfTop : A.adder.carryIntoTop) : undefined
                }
              >
                {cell?.shown ? cell.text : " "}
              </span>
            );
          })}
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

/** Whether the learner's saved work for a challenge passes its tests now. */
function passed(lesson: Lesson, stored: StoredLesson, id: string): boolean {
  const challenge = lesson.challenges?.find((c) => c.id === id);
  const saved = stored.challenges[id];
  if (!challenge || !saved) return false;
  try {
    return grade(challenge, saved.artifact).passed;
  } catch {
    return false;
  }
}

export const AdderFigure = withProps(Props, function AdderFigure({ data, store, lesson }) {
  const [done, setDone] = useState(0);
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
  if (data.afterChallenge !== undefined && !passed(lesson, stored, data.afterChallenge)) {
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
  const status =
    done === 0
      ? A.adder.start
      : finished
        ? `${A.adder.column(
            32,
            bitAt(record.a, 31),
            bitAt(record.b, 31),
            bitAt(record.carries, 31),
            bitAt(record.result, 31),
            record.carryOut,
          )} ${A.adder.done} ${A.adder.topBit}`
        : A.adder.column(
            done,
            bitAt(record.a, j),
            bitAt(record.b, j),
            bitAt(record.carries, j),
            bitAt(record.result, j),
            bitAt(record.carries, j + 1),
          );

  return (
    <div
      className="al-figure al-adder"
      data-figure="adder"
      data-done={done}
      role="group"
      aria-label={A.adder.rows}
    >
      <div className="al-adder-rows">
        <div className="al-adder-row" data-row="carry">
          <Head name={A.adder.carryRow} />
          <Cells row="carry" cells={carryCells} justDone={justDone} carry />
          <p className="al-adder-key">{A.adder.topKey}</p>
        </div>
        <div className="al-adder-row" data-row="a">
          <Head name={names?.a ?? "a"} detail={hex32(record.a)} />
          <Cells row="a" cells={bitCells(record.a, 33)} justDone={justDone} />
        </div>
        <div className="al-adder-row" data-row="b">
          <Head
            name={record.subtraction ? A.adder.turnedOver(names?.b ?? "b") : (names?.b ?? "b")}
            detail={hex32(record.b)}
          />
          <Cells row="b" cells={bitCells(record.b, 33)} justDone={justDone} />
        </div>
        <div className="al-adder-row" data-row="sum">
          <Head
            name={`${A.adder.answerRow}${names ? `, ${names.answer}` : ""}`}
            detail={finished ? hex32(record.result) : undefined}
          />
          <Cells row="sum" cells={bitCells(record.result, done)} justDone={justDone} />
        </div>
      </div>
      <FlagsRow flags={finished ? flagsAfter : null} before={finished ? flagsBefore : null} />
      <div className="al-controls" role="group" aria-label={A.adder.controls}>
        <button
          type="button"
          className="button primary"
          disabled={finished}
          onClick={() => setDone(done + 1)}
        >
          {A.adder.next}
        </button>
        <button
          type="button"
          className="button secondary"
          disabled={done === 0}
          onClick={() => setDone(Math.max(0, done - 1))}
        >
          {A.adder.back}
        </button>
        <button
          type="button"
          className="button secondary"
          disabled={finished}
          onClick={() => setDone(32)}
        >
          {A.adder.all}
        </button>
        <button
          type="button"
          className="button secondary"
          disabled={done === 0}
          onClick={() => setDone(0)}
        >
          {A.adder.reset}
        </button>
      </div>
      <p className="al-status" role="status">
        {status}
      </p>
    </div>
  );
});
