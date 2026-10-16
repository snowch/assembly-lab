// Copyright © 2026 Christopher Snow

// The parts the figures share: a sentence with code in it, a register as a row of bits, and the C
// beside its instructions.

import type { ReactNode } from "react";

import type { ListingLine } from "./listing";
import { VIEW_STRINGS as S } from "./strings";
import { bitsOf } from "./trace";

/** A sentence with `code` between backticks, the code drawn as code. */
export function withCode(text: string): ReactNode[] {
  return text.split(/`([^`]*)`/).map((piece, i) => (i % 2 ? <code key={i}>{piece}</code> : piece));
}

/**
 * A `w` register: its name, its 32 bits in four groups of eight (a 1 filled), and its value as a
 * decimal number. A register that the last step wrote is outlined.
 */
export function RegisterRow({
  name,
  value,
  changed,
}: {
  name: string;
  value: number;
  changed: boolean;
}) {
  const bits = bitsOf(value);
  const groups = [0, 8, 16, 24].map((from) => bits.slice(from, from + 8));
  return (
    <div
      className="al-reg"
      role="group"
      aria-label={S.register.group(name)}
      data-register={name}
      data-changed={changed}
    >
      <span className="al-reg-name">{name}</span>
      <span className="al-reg-value" title={changed ? S.register.changed : undefined}>
        {value}
      </span>
      <span className="al-bits" aria-hidden="true">
        {groups.map((group, g) => (
          <span className="al-bit-group" key={g}>
            {[...group].map((bit, i) => (
              <span className="al-bit" data-on={bit === "1"} key={i}>
                {bit}
              </span>
            ))}
          </span>
        ))}
      </span>
    </div>
  );
}

/** The C with its line numbers, beside (on a phone, above) the instructions. */
export function ListingView({
  cLines,
  lines,
  next = null,
  litC = null,
  ran = null,
}: {
  cLines: readonly string[];
  lines: readonly ListingLine[];
  /** The index into `lines` of the instruction that runs next, marked with an arrow. */
  next?: number | null;
  /** The C line to light. */
  litC?: number | null;
  /** The index into `lines` of the instruction that ran last, whose C line tag is lit with it. */
  ran?: number | null;
}) {
  // Assembly the lesson wrote itself has no C beside it: the listing is then the instructions alone.
  const hasC = cLines.some((text) => text.trim() !== "");
  return (
    <div className="al-listing" data-c={hasC ? "shown" : "none"}>
      {hasC && (
        <div className="al-pane al-c" role="group" aria-label={S.listing.cPane}>
          <div className="al-pane-head">{S.listing.cHeading}</div>
          {cLines.map((text, i) => (
            <div className="al-cline" key={i} data-line={i + 1} data-lit={litC === i + 1}>
              <span className="al-ln">{i + 1}</span>
              <code className="al-src">{text === "" ? " " : text}</code>
            </div>
          ))}
        </div>
      )}
      <div className="al-pane al-asm" role="group" aria-label={S.listing.instructionsPane}>
        <div className="al-pane-head">
          <span>{S.listing.instructionsHeading}</span>
          {hasC && <span>{S.listing.cLineHeading}</span>}
        </div>
        {lines.map((line, i) =>
          line.kind === "label" ? (
            <div className="al-label" key={i}>
              {line.text}:
            </div>
          ) : (
            <div className="al-insn" key={i} data-next={next === i} data-ran={ran === i}>
              <span className="al-mark" aria-hidden="true" />
              {next === i && <span className="visually-hidden">{S.listing.next}</span>}
              <code className="al-text">{line.text}</code>
              {line.cLine !== null && (
                <span
                  className="al-ctag"
                  data-lit={litC === line.cLine && ran === i}
                  title={S.listing.recordedAgainst(line.cLine)}
                >
                  {line.cLine}
                </span>
              )}
            </div>
          ),
        )}
      </div>
    </div>
  );
}
