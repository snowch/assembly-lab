// Copyright © 2026 Christopher Snow

// What a prediction about a function's behaviour is checked against: the model, run on the call the
// figure names and on a few more words chosen to tell the choices apart. The answer is never in the
// lesson's words. A choice says what a function does ("it fills the top bit with a copy of the old
// top bit"); the model decides by running the function, and the measure turns what it saw into the
// name of the one choice that fits.

import { bitList, bitOf, differing, hex, unsignedOf } from "./bits";
import type { RecordedProgram } from "./listing";
import { VIEW_STRINGS as S } from "./strings";
import { traceOf, viewAt, wValue, type Trace, type TraceCall } from "./trace";

export type Measure =
  /** Which bits come out 0 when the function runs on a word with every bit set. */
  | { kind: "cleared-bits" }
  /** What a register holds when the run ends, written in hexadecimal. */
  | { kind: "register-hex"; register: number }
  /** What fills the top bit of a right shift. */
  | { kind: "fill-rule" }
  /** What the first instruction adds to w0. */
  | { kind: "first-add" };

export interface Outcome {
  /** The value of the option that matches what the model did. */
  readonly value: string;
  /** What the model did, in a sentence. */
  readonly said: string;
  /** The words before and after the main call, for the figure to draw. */
  readonly rows?: { readonly before: number; readonly after: number };
}

const firstText = (trace: Trace): string => trace.result.steps[0]?.text ?? "";

/** The call with its first argument replaced. */
const withWord = (call: TraceCall, word: number): TraceCall => ({
  entry: call.entry,
  args: [word, ...call.args.slice(1)],
});

const returned = (trace: Trace): boolean => trace.result.stop.kind === "returned";

/** The amount the first instruction shifts by, from its last operand; 1 when it has none. */
function amountOf(trace: Trace): number {
  const text = firstText(trace);
  const last = text.split(",").pop()?.trim() ?? "";
  const n = Number(last.replace(/^#/, ""));
  return Number.isInteger(n) && n > 0 ? n : 1;
}

export function measure(
  m: Measure,
  program: Pick<RecordedProgram, "listing">,
  call: TraceCall,
): Outcome {
  const trace = traceOf(program, call);
  if (!returned(trace)) return { value: "error", said: S.prediction.endedWithError };
  const before = wValue(viewAt(trace, 0).state, 0);
  const after = wValue(trace.result.final, 0);
  switch (m.kind) {
    case "register-hex": {
      const held = wValue(trace.result.final, m.register);
      return { value: String(held), said: S.probe.endedWithHex(`w${m.register}`, hex(held)) };
    }
    case "cleared-bits": {
      const cleared = [...differing(before, after)].filter((n) => bitOf(before, n) === 1);
      const key = `cleared:${cleared.sort((a, b) => a - b).join(",")}`;
      if (cleared.length === 0)
        return { value: key, said: S.probe.noneCleared, rows: { before, after } };
      const label =
        cleared.length === 1 ? S.bits.bit(cleared[0] ?? 0) : S.bits.bitsList(bitList(cleared));
      return { value: key, said: S.probe.clearedBits(label), rows: { before, after } };
    }
    case "fill-rule": {
      const instruction = firstText(trace);
      const fell = amountOf(trace) - 1;
      const probes = [unsignedOf(call.args[0] ?? 0), 0x80000001, 0x80000000, 0x00000001];
      const seen = probes.map((word) => {
        const run = traceOf(program, withWord(call, word));
        const result = wValue(run.result.final, 0);
        return { top: bitOf(word, 31), now: bitOf(result, 31), fell: bitOf(word, fell) };
      });
      const rule = seen.every((s) => s.now === s.top)
        ? "copy"
        : seen.every((s) => s.now === 0)
          ? "zero"
          : seen.every((s) => s.now === s.fell)
            ? "fell-off"
            : "other";
      const how =
        rule === "copy"
          ? S.probe.fillCopy
          : rule === "zero"
            ? S.probe.fillZero
            : rule === "fell-off"
              ? S.probe.fillFell
              : S.probe.fillOther;
      return { value: rule, said: S.probe.filled(instruction, how), rows: { before, after } };
    }
    case "first-add": {
      const instruction = firstText(trace);
      const words = [
        unsignedOf(call.args[0] ?? 0),
        -7,
        7,
        0,
        -1,
        100,
        -100,
        2147483647,
        -2147483648,
      ].map(unsignedOf);
      const seen = words.map((word) => {
        const run = traceOf(program, withWord(call, word));
        const added = (wValue(viewAt(run, 1).state, 0) - word) >>> 0;
        return { word, negative: bitOf(word, 31) === 1, added };
      });
      const all = (fit: (s: (typeof seen)[number]) => boolean) => seen.every(fit);
      // Half of a word: rounded towards zero, or rounded down.
      const half = (word: number) => [Math.trunc((word | 0) / 2) >>> 0, ((word | 0) >> 1) >>> 0];
      const rule = all((s) => s.added === (s.negative ? 1 : 0))
        ? "sign"
        : all((s) => s.added === 1)
          ? "one"
          : all((s) => s.added === 31)
            ? "thirty-one"
            : all((s) => half(s.word).includes(s.added))
              ? "half"
              : "other";
      const amounts = (negative: boolean) => [
        ...new Set(seen.filter((s) => s.negative === negative).map((s) => s.added)),
      ];
      const [n, o] = [amounts(true), amounts(false)];
      const said =
        n.length === 1 && o.length === 1
          ? S.probe.firstAdds(instruction, String(n[0]), String(o[0]))
          : S.probe.firstAddsVaries(instruction);
      return { value: rule, said };
    }
  }
}
