// Copyright © 2026 Christopher Snow

// A register's 32 bits that the learner sets, one button to a bit. The bits are in four groups of
// eight, and each group of eight is two groups of four, so a group of four is one hexadecimal digit
// of the register's value. A button's target is a full 44 pixels tall on a phone, which is why a
// phone draws one group of eight to a row; a desk draws two. When the figure knows the digits (it
// takes them from the model), each is written under its four bits.
//
// Two optional marks, off unless a figure asks: `topBit` marks bit 31 by a double border and the
// words "top bit" as well as by what it is worth, and `groupOutline` outlines a group of four bits
// and underlines its digit when any button in the group has the keyboard's focus or the pointer
// over it, so the eye can pair the bits with the digit.

import { useState, type FocusEvent } from "react";

import { VIEW_STRINGS as S } from "./strings";
import { MODULE1_STRINGS as M1 } from "./strings.module1";

export function BitToggles({
  bits,
  onChange,
  label,
  digits,
  topBit = false,
  groupOutline = false,
}: {
  /** 32 characters, each a 0 or a 1, the most significant first. */
  bits: string;
  onChange: (bits: string) => void;
  /** What a screen reader hears for the row of bits. */
  label: string;
  /** Eight hexadecimal digits, the most significant first, written under their bits. */
  digits?: string;
  /** Mark bit 31 as the top bit, in shape and in words. */
  topBit?: boolean;
  /** Outline a group of four bits and its digit together while one of its buttons is in use. */
  groupOutline?: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const [focus, setFocus] = useState<number | null>(null);
  const flip = (index: number) => {
    const next = bits[index] === "1" ? "0" : "1";
    onChange(bits.slice(0, index) + next + bits.slice(index + 1));
  };
  return (
    <div
      className="al-toggles"
      role="group"
      aria-label={label}
      data-top-bit={topBit ? "marked" : undefined}
      data-groups={groupOutline ? "outlined" : undefined}
    >
      {[0, 1, 2, 3].map((byte) => (
        <div className="al-byte" key={byte}>
          {[0, 1].map((half) => {
            const nibble = byte * 2 + half;
            const groupProps = groupOutline
              ? {
                  onMouseEnter: () => setHover(nibble),
                  onMouseLeave: () => setHover((h) => (h === nibble ? null : h)),
                  onFocus: () => setFocus(nibble),
                  onBlur: (e: FocusEvent<HTMLDivElement>) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node | null))
                      setFocus((f) => (f === nibble ? null : f));
                  },
                }
              : {};
            return (
              <div
                className="al-nibble"
                key={half}
                data-lit={groupOutline ? hover === nibble || focus === nibble : undefined}
                {...groupProps}
              >
                {topBit && nibble === 0 && (
                  <span className="al-top-flag" aria-hidden="true">
                    {M1.toggles.topBit}
                  </span>
                )}
                <div className="al-nibble-bits">
                  {[0, 1, 2, 3].map((k) => {
                    const index = nibble * 4 + k;
                    const n = 31 - index;
                    const on = bits[index] === "1";
                    return (
                      <button
                        key={n}
                        type="button"
                        className="al-toggle"
                        aria-pressed={on}
                        aria-label={S.toggles.bit(n)}
                        data-bit={n}
                        data-on={on}
                        data-top={topBit && n === 31 ? "true" : undefined}
                        onClick={() => flip(index)}
                      >
                        <span className="al-toggle-n" aria-hidden="true">
                          {n}
                        </span>
                        <span className="al-toggle-v" aria-hidden="true">
                          {bits[index]}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {digits !== undefined && digits[nibble] !== undefined && (
                  <span
                    className="al-digit"
                    role="img"
                    aria-label={S.toggles.digit(digits[nibble] as string)}
                    data-digit={nibble}
                  >
                    {digits[nibble]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
