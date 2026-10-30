// Copyright © 2026 Christopher Snow

import { withCode } from "./parts";
import { VIEW_STRINGS as S } from "./strings";
import type { StepView, Trace } from "./trace";

/** Name the state the bank actually draws, including preset and restored positions. */
export function registerStateText(trace: Trace, view: StepView): string {
  if (view.k === 0) return S.registerState.before;
  if (view.stop?.kind === "returned") return S.registerState.final;
  // A limit or fault ends the recording without completing the function. Its last successful
  // instruction still identifies the displayed state; the existing status explains the stop.
  const instruction = trace.result.steps[view.k - 1]!.text;
  return S.registerState.after(instruction);
}

/** One visible temporal label per bank; the existing execution status supplies live updates. */
export function RegisterStateLabel({ trace, view }: { trace: Trace; view: StepView }) {
  const state = view.k === 0 ? "before" : view.stop?.kind === "returned" ? "final" : "after";
  return (
    <p className="al-register-state" data-state={state}>
      {withCode(registerStateText(trace, view))}
    </p>
  );
}
