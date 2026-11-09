// Copyright © 2026 Christopher Snow

import { useId, useState } from "react";
import { calculate, type Calculation, type DivisionMode } from "./calculator";
import { withCode } from "./parts";
import { CALCULATOR as S } from "./strings.calculator";
import { useHandoffState } from "./update-handoff";

/** Optional scratch work: deliberately accepts no bits, answers or answer callback. */
export function Calculator({
  handoffKey,
  division = "exact",
}: {
  handoffKey: string;
  division?: DivisionMode;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [work, setWork] = useHandoffState<{ text: string; result: Calculation | null }>(
    division === "exact" ? `Calculator.${handoffKey}` : `Calculator.${handoffKey}.whole`,
    { text: "", result: null },
  );
  const run = () => setWork({ ...work, result: calculate(work.text, { division }) });
  const error = work.result && "error" in work.result ? S.errors[work.result.error] : null;
  return (
    <details className="al-calculator" open={open} onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary>{S.title}</summary>
      {open && (
        <div className="al-calculator-panel">
          <p>{division === "whole" ? S.halvesHelp : S.help}</p>
          <label htmlFor={id}>{S.calculation}</label>
          <div className="al-calculator-entry">
            <input
              id={id}
              type="text"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              value={work.text}
              aria-invalid={error ? true : undefined}
              aria-describedby={`${id}-format ${id}-result`}
              onChange={(e) => setWork({ text: e.target.value, result: null })}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  run();
                }
              }}
            />
            <button type="button" className="button secondary" onClick={run}>
              {S.calculate}
            </button>
          </div>
          <p className="al-calculator-format" id={`${id}-format`}>
            {withCode(division === "whole" ? S.halvesFormat : S.format)}
          </p>
          <div id={`${id}-result`} role="status" aria-live="polite">
            {error ? (
              <p>{error}</p>
            ) : work.result && "value" in work.result ? (
              <p>
                {S.result}:{" "}
                <code>
                  {division === "whole"
                    ? work.result.value
                    : BigInt(work.result.value).toLocaleString("en-GB")}
                </code>
              </p>
            ) : null}
          </div>
        </div>
      )}
    </details>
  );
}
