// Copyright © 2026 Christopher Snow

// A box for typing a field of 32 bits in hexadecimal, beside the 32 buttons that set the same bits.
// The two stay in step: typing `ffffffff` or `0xffffffff` sets the bits, and pressing a bit puts
// the register's digits (from the model) in the box. Text that is not one to eight hexadecimal
// digits changes no bit, and the box says so in a sentence. The field's stored answer is still the
// 32 characters of bits, so a grader reads the same answer whichever way the learner set it. The
// box never fills in an answer: it starts as the bits are, and changes only as the learner acts.

import { useId, useState } from "react";

import { parseHexEntry, readingsOfPattern } from "./readings";
import { MODULE1_STRINGS as M1 } from "./strings.module1";

export function HexEntry({
  bits,
  onBits,
}: {
  /** The 32 bits the buttons hold now. */
  bits: string;
  /** Called with 32 characters when the typed digits are valid. */
  onBits: (bits: string) => void;
}) {
  const id = useId();
  const [typed, setTyped] = useState<string | null>(null);
  const entry = typed === null ? null : parseHexEntry(typed);
  // What the learner typed stays in the box while it is not yet digits or is not valid, or while it
  // names the bits that are set. Once a button changes the bits, the box shows the bits' own digits.
  const keepTyped =
    typed !== null && entry !== null && (entry.kind !== "ok" || entry.pattern === bits);
  const text = keepTyped ? typed : `0x${readingsOfPattern(bits).digits}`;
  const invalid = keepTyped && entry?.kind === "invalid";
  return (
    <div className="answer-hex" data-hex-entry="true">
      <label htmlFor={id} className="answer-hex-label">
        {M1.hexEntry.label}
      </label>
      <input
        id={id}
        type="text"
        className="answer-hex-input"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        value={text}
        aria-invalid={invalid ? true : undefined}
        aria-describedby={`${id}-problem`}
        onChange={(e) => {
          const next = e.target.value;
          setTyped(next);
          const read = parseHexEntry(next);
          if (read.kind === "ok") onBits(read.pattern);
        }}
      />
      <p id={`${id}-problem`} className="answer-hex-problem" role="status">
        {invalid ? M1.hexEntry.invalid : ""}
      </p>
    </div>
  );
}
