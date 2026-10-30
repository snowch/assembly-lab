// Copyright © 2026 Christopher Snow

import { RegisterStateLabel } from "../RegisterStateLabel";
import { useHandoffState } from "../update-handoff";

// The learner's own instructions for a written challenge, stepped on one of the challenge's test
// calls, once the challenge has been run (their work is saved and has been graded once). After each
// instruction the figure draws the register it wrote: its low byte large and its 32 bits one press
// away, with the bits that instruction cleared, moved or combined marked, and, for a register
// that holds the word the call started with, the bits outside the field marked unchanged when they
// are. Any solution that assembles can be stepped, in any order and with any registers; the marks
// follow from the register's value before and after each instruction and the instruction's own
// operands as the assembler parsed them, never from a solution the lesson knows.
//
// The stepper's pieces are the word stepper's: its controls and its status line.

import { useMemo } from "react";
import { z } from "zod";

import type { Instruction, MachineState, ParsedOperand, Step } from "@al/machine";
import { Prose, useStored } from "@platform/lesson-runtime";

import {
  BitCells,
  BitRow,
  CELL_GLYPHS,
  CellLegend,
  MarkRow,
  Ruler,
  bitOf,
  differing,
  hex,
  range,
  unsignedOf,
  type CellTag,
} from "../bits";
import { callsOf, challengeOf, ranText } from "../challengeState";
import { ListingView, withCode } from "../parts";
import { VIEW_STRINGS as S } from "../strings";
import { traceText } from "../traceText";
import { viewAt, wValue, type Trace } from "../trace";
import { StepControls, statusOf } from "./WordStepperFigure";
import { withProps } from "./props";

const Props = z.object({
  /** The id of the written challenge whose saved work is stepped; the figure is shut until it has been run. */
  afterRun: z.string(),
  /** Markdown shown above the figure once it is open. */
  intro: z.string(),
  /** The field the challenge writes: its bits are underlined, and the bits outside are the word's own. */
  field: z.object({ from: z.number().int().min(0).max(31), to: z.number().int().min(0).max(31) }),
});

/** The text of an assembly editor without its comments and blank lines. */
export const withoutComments = (text: string): string =>
  text
    .split("\n")
    .map((l) =>
      l
        .replace(/\/\*.*?\*\//g, "")
        .replace(/\/\/.*$/, "")
        .trim(),
    )
    .filter((l) => l !== "")
    .join("\n");

const insAt = (trace: Trace, step: Step): Instruction | undefined =>
  trace.program.instructions.find((i) => i.address === step.address);

const regOf = (o: ParsedOperand | undefined): number | null =>
  o?.kind === "reg" && o.role === "general" ? o.n : null;

/**
 * For every point of the run, the registers that hold something made from the word the call
 * started with (`w0`): a register an instruction writes holds such a thing when the instruction
 * reads one. `sets[i]` is the set after `i` instructions.
 */
export function derivedFrom(trace: Trace): ReadonlySet<number>[] {
  const sets: ReadonlySet<number>[] = [new Set([0])];
  for (const step of trace.result.steps) {
    const prev = sets[sets.length - 1] as ReadonlySet<number>;
    const next = new Set(prev);
    const ins = insAt(trace, step);
    const rd = regOf(ins?.operands[0]);
    if (ins && rd !== null && step.writes.some((w) => w.reg === rd)) {
      const reads = ins.operands.slice(1).flatMap((o) => {
        const r = regOf(o);
        return r === null ? [] : [r];
      });
      if (reads.some((r) => prev.has(r))) next.add(rd);
      else next.delete(rd);
    }
    sets.push(next);
  }
  return sets;
}

/**
 * What one instruction did to the bits of the register it wrote, by bit number: `and` clears the
 * bits it turned from 1 to 0; `lsl` moves the bits that landed where a 1 came from; `orr` combines
 * in the bits it turned from 0 to 1; any other instruction changes the bits that differ. A bit
 * outside the field that holds what the word held when the call started is `kept`.
 */
export function tagsOf(
  ins: Pick<Instruction, "mnemonic" | "operands">,
  before: MachineState,
  after: MachineState,
  rd: number,
  derived: boolean,
  original: number,
  field: ReadonlySet<number>,
): Map<number, CellTag> {
  const src = (i: number) => {
    const r = regOf(ins.operands[i]);
    return r === null ? 0 : wValue(before, r);
  };
  const third = ins.operands[2];
  const amount = third?.kind === "imm" ? Number(third.value) : 0;
  const was = wValue(before, rd);
  const now = wValue(after, rd);
  const out = new Map<number, CellTag>();
  for (let n = 0; n < 32; n++) {
    const a = bitOf(now, n);
    if (ins.mnemonic === "and") {
      if (bitOf(src(1), n) === 1 && a === 0) out.set(n, "cleared");
    } else if (ins.mnemonic === "lsl") {
      if (a === 1 && n - amount >= 0 && bitOf(src(1), n - amount) === 1) out.set(n, "moved");
    } else if (ins.mnemonic === "orr") {
      if (a === 1 && bitOf(src(1), n) === 0) out.set(n, "combined");
    } else if (a !== bitOf(was, n)) out.set(n, "changed");
    if (!out.has(n) && derived && !field.has(n) && a === bitOf(original, n)) out.set(n, "kept");
  }
  return out;
}

type Made = { readonly trace: Trace } | { readonly error: true };

const text = (v: number) => `${hex(v)} (${unsignedOf(v)})`;

export const SolutionStepper = withProps(Props, function SolutionStepper({ data, store, lesson }) {
  const [k, setK] = useHandoffState("SolutionStepper.k", 0);
  const [which, setWhich] = useHandoffState("SolutionStepper.which", 0);
  const stored = useStored(store);
  const challenge = challengeOf(lesson, data.afterRun);
  const saved = ranText(stored, data.afterRun);
  const calls = useMemo(() => callsOf(challenge), [challenge]);
  const call = calls[Math.min(which, calls.length - 1)];
  const allowed = useMemo(
    () => (challenge ? new Set(challenge.allowedConstructs) : undefined),
    [challenge],
  );
  const made = useMemo<Made | null>(() => {
    if (saved === null || call === undefined) return null;
    try {
      return { trace: traceText(withoutComments(saved), call.args, allowed) };
    } catch {
      return { error: true };
    }
  }, [saved, call, allowed]);
  const trace = made !== null && "trace" in made ? made.trace : null;
  const derived = useMemo(() => (trace ? derivedFrom(trace) : []), [trace]);
  if (saved === null || call === undefined || made === null) {
    return (
      <p role="note" className="al-locked">
        {S.solution.locked}
      </p>
    );
  }
  if (trace === null) {
    return (
      <p role="note" className="al-locked">
        {S.solution.noRun}
      </p>
    );
  }
  const view = viewAt(trace, k);
  const step = trace.result.steps[view.k - 1];
  const ins = step ? insAt(trace, step) : undefined;
  const field = range(data.field.from, data.field.to);
  const original = wValue(viewAt(trace, 0).state, 0);
  const before = viewAt(trace, Math.max(0, view.k - 1)).state;
  const wrote = step?.writes.flatMap((w) => (typeof w.reg === "number" ? [w.reg] : [])) ?? [];
  // Before the first instruction: the arguments. After one: the register it wrote, or, for the
  // `ret`, the register the result is in.
  const shown: { n: number; kind: "start" | "wrote" | "returns" }[] =
    view.k === 0
      ? call.args.map((_, n) => ({ n, kind: "start" as const }))
      : wrote.length > 0
        ? wrote.map((n) => ({ n, kind: "wrote" as const }))
        : [{ n: 0, kind: "returns" as const }];
  const used = new Set<CellTag>();
  const rows = shown.map(({ n, kind }, i) => {
    const now = wValue(view.state, n);
    if (kind === "start")
      return (
        <BitCells
          key={`${n}-s`}
          row={`w${n}`}
          name={S.bits.onEntry(`w${n}`)}
          value={now}
          text={text(now)}
          marks={{ field }}
          numbers={i === 0}
        />
      );
    const tags =
      ins === undefined
        ? new Map<number, CellTag>()
        : tagsOf(
            ins,
            before,
            view.state,
            n,
            (derived[view.k] as ReadonlySet<number>).has(n),
            original,
            field,
          );
    for (const tag of tags.values()) used.add(tag);
    const was = wValue(before, n);
    return (
      <div className="al-cellgroup" key={`${n}-${kind}`} data-register={`w${n}`} data-kind={kind}>
        {kind === "wrote" && (
          <BitCells
            row={`w${n}-before`}
            name={S.bitOps.rowBefore(`w${n}`)}
            value={was}
            text={text(was)}
            marks={{ field }}
            numbers
          />
        )}
        <BitCells
          row={`w${n}`}
          name={kind === "returns" ? S.solution.returns(`w${n}`) : S.bitOps.rowAfter(`w${n}`)}
          value={now}
          text={text(now)}
          marks={{ field }}
          tags={tags}
          numbers={kind === "returns"}
          written={kind === "wrote"}
        />
      </div>
    );
  });
  const last = shown[shown.length - 1];
  const lastTags =
    last && last.kind !== "start" && ins
      ? tagsOf(
          ins,
          before,
          view.state,
          last.n,
          (derived[view.k] as ReadonlySet<number>).has(last.n),
          original,
          field,
        )
      : new Map<number, CellTag>();
  return (
    <div
      className="al-figure al-solution"
      data-figure="solution-stepper"
      data-k={view.k}
      data-call={call.label}
    >
      <Prose markdown={data.intro} />
      <div className="asm-field" role="group" aria-label={S.calls.group}>
        <span className="asm-field-label">{S.calls.group}</span>
        <div className="asm-chips">
          {calls.map((c, i) => (
            <button
              key={c.label}
              type="button"
              className="chip"
              aria-pressed={i === Math.min(which, calls.length - 1)}
              onClick={() => {
                setWhich(i);
                setK(0);
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
      <ListingView cLines={[]} lines={trace.lines} next={view.next} ran={view.ran} showC={false} />
      <StepControls view={view} setK={setK} />
      <p className="al-status" role="status">
        {withCode(statusOf(trace, view))}
      </p>
      <RegisterStateLabel trace={trace} view={view} />
      <div className="al-cellrows" role="group" aria-label={S.stepper.registers}>
        {rows}
      </div>
      {used.size > 0 && <CellLegend tags={[...used]} />}
      {last && last.kind !== "start" && (
        <details className="al-all32">
          <summary>{S.solution.all}</summary>
          <div className="al-bitrows">
            <Ruler />
            {last.kind === "wrote" && (
              <BitRow
                row="full-before"
                name={S.bitOps.rowBefore(`w${last.n}`)}
                value={wValue(before, last.n)}
                text={text(wValue(before, last.n))}
                marks={{ field }}
              />
            )}
            <BitRow
              row="full-after"
              name={S.bitOps.rowAfter(`w${last.n}`)}
              value={wValue(view.state, last.n)}
              text={text(wValue(view.state, last.n))}
              marks={{
                field,
                changed: differing(wValue(before, last.n), wValue(view.state, last.n)),
              }}
            />
            <MarkRow
              row="full-marks"
              name={S.solution.marks}
              glyphs={new Map([...lastTags].map(([n, tag]) => [n, CELL_GLYPHS[tag]]))}
            />
          </div>
        </details>
      )}
    </div>
  );
});
