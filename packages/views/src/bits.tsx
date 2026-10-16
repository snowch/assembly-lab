// Copyright © 2026 Christopher Snow

// What Module 3's figures share: a 32-bit word drawn as a row of bits with marks on chosen columns,
// the ruler above such rows, the key that says what a labelled bit or field means, and the few
// functions that read a number the learner typed and write a value as hexadecimal. A row shows a
// value the model produced; the marks say which columns to draw differently, and the figures work
// them out from the model's own before and after.

import type { ReactNode } from "react";

import { VIEW_STRINGS as S } from "./strings";
import { bitsOf } from "./trace";

/** The columns of a row to draw differently, by bit number (0 is the lowest). */
export interface Marks {
  /** Bits whose value the instruction changed. */
  readonly changed?: ReadonlySet<number>;
  /** Bits of the field an instruction reads or writes. */
  readonly field?: ReadonlySet<number>;
  /** Bits a shift pushed off the end. */
  readonly lost?: ReadonlySet<number>;
  /** Bits a shift filled in. */
  readonly fill?: ReadonlySet<number>;
}

/** A word typed by the learner: decimal (a minus sign allowed) or `0x` hexadecimal, as 32 bits. */
export function parseWord(text: string): number | null {
  const t = text.trim().toLowerCase();
  if (/^0x[0-9a-f]{1,8}$/.test(t)) return parseInt(t.slice(2), 16);
  if (/^-?\d{1,10}$/.test(t)) {
    const n = Number(t);
    if (n >= -2147483648 && n <= 4294967295) return n >>> 0;
  }
  return null;
}

/** A word as the lessons write it: `0x` and the digits, with no leading zeros. */
export const hex = (value: number): string => `0x${(value >>> 0).toString(16)}`;

/** A word read as an unsigned number and as a signed one. */
export const unsignedOf = (value: number): number => value >>> 0;
export const signedOf = (value: number): number => value | 0;

/** The value of bit `n` of a word. */
export const bitOf = (value: number, n: number): number => (value >>> n) & 1;

/** The set of bit numbers `from` to `to`, both included. */
export function range(from: number, to: number): Set<number> {
  const out = new Set<number>();
  for (let n = Math.min(from, to); n <= Math.max(from, to); n++) out.add(n);
  return out;
}

/** The bits at which two words differ. */
export function differing(a: number, b: number): Set<number> {
  const out = new Set<number>();
  for (let n = 0; n < 32; n++) if (bitOf(a, n) !== bitOf(b, n)) out.add(n);
  return out;
}

/** Bit numbers as a phrase: `2`, `2 and 3`, `0, 2 and 3`. */
export function bitList(bits: Iterable<number>): string {
  const list = [...bits].sort((a, b) => a - b).map(String);
  if (list.length <= 1) return list.join("");
  return `${list.slice(0, -1).join(", ")} ${S.bits.and} ${list[list.length - 1]}`;
}

/** The values of some bits of a word, highest first, as a string of 0 and 1. */
export function bitString(value: number, bits: Iterable<number>): string {
  return [...bits]
    .sort((a, b) => b - a)
    .map((n) => String(bitOf(value, n)))
    .join("");
}

const BOTTOMS = [24, 16, 8, 0] as const;

/** The numbers above a row's four groups of eight, so a bit can be counted to. */
export function Ruler() {
  return (
    <div className="al-reg al-bitrow al-ruler" aria-hidden="true">
      <span />
      <span />
      <span className="al-bits">
        {BOTTOMS.map((low) => (
          <span className="al-bit-group al-ruler-group" key={low}>
            <span>{low + 7}</span>
            <span>{low}</span>
          </span>
        ))}
      </span>
    </div>
  );
}

/**
 * A word as a row: its name, its value as text, and its 32 bits in four groups of eight, a 1
 * filled. `marks` draws chosen columns differently. `written` outlines the whole row, as the
 * stepper does for a register the last instruction wrote.
 */
export function BitRow({
  name,
  value,
  text,
  marks = {},
  row,
  written = false,
}: {
  name: string;
  value: number;
  /** The value as the row's caption says it. */
  text: ReactNode;
  marks?: Marks;
  /** A name for tests and the page's own use: `word`, `mask`, `result`. */
  row: string;
  written?: boolean;
}) {
  const bits = bitsOf(value);
  const groups = [0, 8, 16, 24].map((from) => bits.slice(from, from + 8));
  const has = (set: ReadonlySet<number> | undefined, n: number) => (set?.has(n) ? "true" : "false");
  return (
    <div
      className="al-reg al-bitrow"
      role="group"
      aria-label={S.bits.rowGroup(name, hex(value))}
      data-row={row}
      data-register={row}
      data-changed={written}
      data-value={value >>> 0}
    >
      <span className="al-reg-name">{name}</span>
      <span className="al-reg-value">{text}</span>
      <span className="al-bits" aria-hidden="true">
        {groups.map((group, g) => (
          <span className="al-bit-group" key={g}>
            {[...group].map((bit, i) => {
              const n = 31 - (g * 8 + i);
              return (
                <span
                  className="al-bit"
                  data-on={bit === "1"}
                  data-bit={n}
                  data-changed={has(marks.changed, n)}
                  data-field={has(marks.field, n)}
                  data-lost={has(marks.lost, n)}
                  data-fill={has(marks.fill, n)}
                  key={i}
                >
                  {bit}
                </span>
              );
            })}
          </span>
        ))}
      </span>
    </div>
  );
}

/** A bit or a field of the warning word, and what it means. */
export interface KeyEntry {
  /** The lowest bit, and the highest (the same for a single bit). */
  readonly from: number;
  readonly to: number;
  readonly label: string;
}

/** The number held by bits `from` to `to` of a word. */
export function fieldOf(value: number, from: number, to: number): number {
  const width = to - from + 1;
  return ((value >>> from) & (width >= 32 ? 0xffffffff : (1 << width) - 1)) >>> 0;
}

/**
 * What the labelled bits of a word say: one row for each bit or field, with its value in the word
 * before and, when a second word is given, after. A table beside the row of bits; it indexes the
 * drawing and does not replace it.
 */
export function BitKey({
  entries,
  before,
  after,
}: {
  entries: readonly KeyEntry[];
  before: number;
  after?: number;
}) {
  return (
    <table className="al-key">
      <caption>{S.bits.keyHeading}</caption>
      <thead>
        <tr>
          <th scope="col">{S.bits.keyBits}</th>
          <th scope="col">{S.bits.keyMeaning}</th>
          <th scope="col">{after === undefined ? S.bits.keyValue : S.bits.keyBefore}</th>
          {after !== undefined && <th scope="col">{S.bits.keyAfter}</th>}
        </tr>
      </thead>
      <tbody>
        {entries.map((e) => (
          <tr key={e.from} data-key={`${e.from}-${e.to}`}>
            <th scope="row">
              {e.from === e.to ? S.bits.bit(e.from) : S.bits.bitRange(e.from, e.to)}
            </th>
            <td>{e.label}</td>
            <td className="al-key-before">{fieldOf(before, e.from, e.to)}</td>
            {after !== undefined && (
              <td
                className="al-key-after"
                data-changed={fieldOf(before, e.from, e.to) !== fieldOf(after, e.from, e.to)}
              >
                {fieldOf(after, e.from, e.to)}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
