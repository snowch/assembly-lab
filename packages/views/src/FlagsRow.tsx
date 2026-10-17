// Copyright © 2026 Christopher Snow

// The four flags, N, Z, C and V, each as its letter over its value. `flags` is null while a figure
// has not worked them out. A flag the last instruction changed is outlined, as a register is.
// A figure may also ask for the word "changed" under the flag it outlines, and for a few words under
// every flag that say what it records; without those the row is as it always was.

import type { Flags } from "@al/machine";

import { flagDigits } from "./arith";
import { ARITH_STRINGS as A } from "./strings.arith";

const NAMES = ["N", "Z", "C", "V"] as const;

/** What C records depends on the instruction that set it: an addition's carry out, or a subtraction's borrow. */
export type FlagsExplained = "addition" | "subtraction";

/** The few words under one flag: what it records, after the kind of instruction that set it. */
function explanation(i: number, value: number | undefined, kind: FlagsExplained): string {
  switch (i) {
    case 0:
      return A.flags.explain.n;
    case 1:
      return A.flags.explain.z;
    case 2:
      if (kind === "addition") return A.flags.explain.cOut;
      return value === 0 ? A.flags.explain.cBorrow : A.flags.explain.cNoBorrow;
    default:
      return A.flags.explain.v;
  }
}

export function FlagsRow({
  flags,
  before = null,
  explain,
  tagChanged = false,
}: {
  flags: Flags | null;
  /** The flags before the last instruction; a flag that differs is outlined. */
  before?: Flags | null;
  /** Say under each flag what it records; for C, as an addition's carry out or a subtraction's borrow. */
  explain?: FlagsExplained;
  /** Write "changed" under a flag that is outlined, so the change does not rest on an outline. */
  tagChanged?: boolean;
}) {
  const now = flags ? flagDigits(flags) : null;
  const was = before ? flagDigits(before) : null;
  return (
    <div
      className="al-flags"
      role="group"
      aria-label={A.flags.group}
      data-known={now !== null}
      data-explained={explain !== undefined}
    >
      {NAMES.map((name, i) => {
        const value = now?.[i];
        const changed = value !== undefined && was !== null && was[i] !== value;
        const words = explain === undefined ? null : explanation(i, value, explain);
        const tag = tagChanged && changed;
        return (
          <div
            key={name}
            className="al-flag"
            data-flag={name.toLowerCase()}
            data-value={value ?? "unknown"}
            data-changed={changed}
            role="group"
            aria-label={
              value === undefined
                ? `${name}: ${A.flags.pending}`
                : `${A.flags.one(name, value)}${words === null ? "" : `, ${words}`}${tag ? `, ${A.flags.changedTag}` : ""}`
            }
            title={changed ? A.flags.changed : undefined}
          >
            <span className="al-flag-name" aria-hidden="true">
              {name}
            </span>
            <span className="al-flag-value" aria-hidden="true">
              {value === undefined ? "–" : value}
            </span>
            {words !== null && (
              <span className="al-flag-explain" aria-hidden="true">
                {words}
              </span>
            )}
            {tag && (
              <span className="al-flag-tag" aria-hidden="true">
                {A.flags.changedTag}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
