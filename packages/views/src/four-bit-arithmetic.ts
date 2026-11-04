// Copyright © 2026 Christopher Snow

// Mathematical four-place views of real ADD/SUB runs. The machine retains its
// actual register width; only this view selects the low four columns and bits.
import { assemble, run, type Program } from "@al/machine";
import { columnWork } from "./arith";
import { fourBitNegation, fourBitReadings } from "./complement";
import { patternOf } from "./readings";

export const FOUR_BIT_EXAMPLES = {
  addition: { a: 3, b: 1 },
  width: { a: 15, b: 1 },
  subtraction: { a: 3, b: 5 },
} as const;

function programFor(operation: "add" | "sub"): Program {
  const { program } = assemble(`calculate:\n${operation} w0, w0, w1\nret`);
  if (program === null) throw new Error("The four-bit view's arithmetic did not assemble.");
  return program;
}

const ADD = programFor("add");
const SUB = programFor("sub");

function input(value: number): void {
  if (!Number.isInteger(value) || value < 0 || value > 15) {
    throw new Error("A four-bit input must be an integer from 0 to 15.");
  }
}

// There are only sixteen readings; avoid rerunning their representation model
// for the same pattern whenever a column is revealed or another pair is checked.
const readings = new Map<number, ReturnType<typeof fourBitReadings>>();
function reading(value: number): ReturnType<typeof fourBitReadings> {
  let result = readings.get(value);
  if (!result) {
    result = fourBitReadings(patternOf(value).slice(-4));
    readings.set(value, result);
  }
  return result;
}

function calculate(program: Program, a: number, b: number) {
  return run(program, {
    entry: "calculate",
    args: [a, b].map((value) => ({ value: BigInt(value), width: 32 as const })),
  });
}

export function fourBitAddition(a: number, b: number) {
  input(a);
  input(b);
  const state = calculate(ADD, a, b);
  const record = state.steps[0]?.addition;
  if (state.stop.kind !== "returned" || !record) {
    throw new Error("The arithmetic model did not return an addition record.");
  }
  const columns = Array.from({ length: 4 }, (_, bit) => columnWork(record, bit));
  const fullSum = Number(state.final.x[0]!);
  return {
    a: reading(a),
    b: reading(b),
    columns,
    fullSum,
    fullPattern: fullSum.toString(2).padStart(4, "0"),
    result: reading(Number(state.final.x[0]! & 15n)),
    carryOut: columns[3]!.carryOut,
  };
}

export function fourBitSubtraction(a: number, b: number) {
  input(a);
  input(b);
  const state = calculate(SUB, a, b);
  if (state.stop.kind !== "returned") throw new Error("The subtraction model did not return.");
  const negation = fourBitNegation(reading(b).pattern);
  return {
    a: reading(a),
    b: reading(b),
    negation,
    addition: fourBitAddition(a, negation.after.unsigned),
    result: reading(Number(state.final.x[0]! & 15n)),
  };
}
