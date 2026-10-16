// Copyright © 2026 Christopher Snow

// The four flags, N, Z, C and V, each as its letter over its value. `flags` is null while a figure
// has not worked them out. A flag the last instruction changed is outlined, as a register is.

import type { Flags } from "@al/machine";

import { flagDigits } from "./arith";
import { ARITH_STRINGS as A } from "./strings.arith";

const NAMES = ["N", "Z", "C", "V"] as const;

export function FlagsRow({
  flags,
  before = null,
}: {
  flags: Flags | null;
  /** The flags before the last instruction; a flag that differs is outlined. */
  before?: Flags | null;
}) {
  const now = flags ? flagDigits(flags) : null;
  const was = before ? flagDigits(before) : null;
  return (
    <div className="al-flags" role="group" aria-label={A.flags.group} data-known={now !== null}>
      {NAMES.map((name, i) => {
        const value = now?.[i];
        const changed = value !== undefined && was !== null && was[i] !== value;
        return (
          <div
            key={name}
            className="al-flag"
            data-flag={name.toLowerCase()}
            data-value={value ?? "unknown"}
            data-changed={changed}
            role="group"
            aria-label={
              value === undefined ? `${name}: ${A.flags.pending}` : A.flags.one(name, value)
            }
            title={changed ? A.flags.changed : undefined}
          >
            <span className="al-flag-name" aria-hidden="true">
              {name}
            </span>
            <span className="al-flag-value" aria-hidden="true">
              {value === undefined ? "–" : value}
            </span>
          </div>
        );
      })}
    </div>
  );
}
