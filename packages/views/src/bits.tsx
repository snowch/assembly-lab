// Copyright © 2026 Christopher Snow

// What Module 3's figures share: a 32-bit word drawn as a row of bits with marks on chosen columns,
// the ruler above such rows, the key that says what a labelled bit or field means, and the few
// functions that read a number the learner typed and write a value as hexadecimal. A row shows a
// value the model produced; the marks say which columns to draw differently, and the figures work
// them out from the model's own before and after.

import type { KeyboardEvent, ReactNode } from "react";

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
  /** Bits this example does not use: drawn plainer, with a dotted edge. */
  readonly unused?: ReadonlySet<number>;
  /** The columns the learner is reading: marked with a dotted frame, in every row. */
  readonly picked?: ReadonlySet<number>;
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

/** Why a typed word cannot be read: it is empty or unfinished, it does not fit 32 bits, or it is not a number. */
export type WordProblem = "incomplete" | "range" | "format";

/**
 * What is wrong with a typed word that `parseWord` refused, or null if it is fine. Empty text and
 * `0x` with no digits are unfinished; a number with more than 32 bits, or a negative one below
 * −2147483648, is out of range; anything else is not a number.
 */
export function wordProblem(text: string): WordProblem | null {
  if (parseWord(text) !== null) return null;
  const t = text.trim().toLowerCase();
  if (t === "" || t === "0x" || t === "-") return "incomplete";
  if (/^0x[0-9a-f]+$/.test(t) || /^-?\d+$/.test(t)) return "range";
  return "format";
}

/** A word as the lessons write it: `0x` and the digits, with no leading zeros. */
export const hex = (value: number): string => `0x${(value >>> 0).toString(16)}`;

/**
 * A call as the lessons write it: `set_gear(0x35, 5)`. A value below 10 is written in decimal (it
 * is the same number in either), and any other in hexadecimal.
 */
export const callText = (entry: string, args: readonly number[]): string =>
  `${entry}(${args.map((a) => (a >= 0 && a < 10 ? String(a) : hex(a))).join(", ")})`;

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
  pick,
}: {
  name: string;
  value: number;
  /** The value as the row's caption says it. */
  text: ReactNode;
  marks?: Marks;
  /** A name for tests and the page's own use: `word`, `mask`, `result`. */
  row: string;
  written?: boolean;
  /**
   * Makes the columns of the row pickable: a press or a focus on a bit calls `onPick` with its
   * number. With `keyboard`, the row is also a place the keyboard can reach (one stop, and the
   * arrow keys move along the bits); without it the row stays a picture for a screen reader, which
   * has the figure's own buttons.
   */
  pick?: {
    readonly onPick: (bit: number) => void;
    readonly keyboard?: boolean;
    readonly at?: number;
  };
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
      <span className="al-bits" aria-hidden={pick?.keyboard ? undefined : "true"}>
        {groups.map((group, g) => (
          <span className="al-bit-group" key={g}>
            {[...group].map((bit, i) => {
              const n = 31 - (g * 8 + i);
              const keys = pick?.keyboard
                ? {
                    role: "button",
                    "aria-label": S.bits.bit(n),
                    "aria-pressed": pick.at === n,
                    tabIndex: n === (pick.at ?? 0) ? 0 : -1,
                    onKeyDown: (e: KeyboardEvent<HTMLSpanElement>) => {
                      // Left is towards the top of the word, as the bits are drawn.
                      const to = e.key === "ArrowLeft" ? n + 1 : e.key === "ArrowRight" ? n - 1 : n;
                      if (to === n || to < 0 || to > 31) return;
                      e.preventDefault();
                      pick.onPick(to);
                      const rowEl = e.currentTarget.closest("[data-row]");
                      requestAnimationFrame(() =>
                        rowEl?.querySelector<HTMLElement>(`[data-bit="${to}"]`)?.focus(),
                      );
                    },
                  }
                : {};
              return (
                <span
                  className="al-bit"
                  data-on={bit === "1"}
                  data-bit={n}
                  data-changed={has(marks.changed, n)}
                  data-field={has(marks.field, n)}
                  data-lost={has(marks.lost, n)}
                  data-fill={has(marks.fill, n)}
                  data-unused={has(marks.unused, n)}
                  data-picked={has(marks.picked, n)}
                  key={i}
                  {...(pick
                    ? { onClick: () => pick.onPick(n), onFocus: () => pick.onPick(n) }
                    : {})}
                  {...keys}
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
  picked,
  onPick,
}: {
  entries: readonly KeyEntry[];
  before: number;
  after?: number;
  /** The entry (by its lowest bit) whose bits the figure is marking. */
  picked?: number | null;
  /** Makes each row's name a button; a press or a focus on it picks the entry. */
  onPick?: (entry: KeyEntry | null) => void;
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
          <tr key={e.from} data-key={`${e.from}-${e.to}`} data-picked={picked === e.from}>
            <th scope="row">
              {onPick ? (
                <button
                  type="button"
                  className="al-key-pick"
                  aria-pressed={picked === e.from}
                  onClick={() => onPick(picked === e.from ? null : e)}
                  onFocus={() => onPick(e)}
                >
                  {e.from === e.to ? S.bits.bit(e.from) : S.bits.bitRange(e.from, e.to)}
                </button>
              ) : e.from === e.to ? (
                S.bits.bit(e.from)
              ) : (
                S.bits.bitRange(e.from, e.to)
              )}
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

// ---------------------------------------------------------------------------------------------
// Big cells: a few bits of a word drawn large enough to read and to press, with the bit number
// above each and a glyph below it, so a mark is told apart by its text as well as its shape.

/** What the glyph under a big cell says about the bit. */
export type CellTag =
  "changed" | "cleared" | "moved" | "combined" | "kept" | "survives" | "lost" | "fill" | "differs";

export const CELL_GLYPHS: Readonly<Record<CellTag, string>> = {
  changed: "▲",
  cleared: "↓",
  moved: "«",
  combined: "+",
  kept: "=",
  survives: "◆",
  lost: "×",
  fill: "+",
  differs: "≠",
};

/** The low eight bits, highest first: bits 7 to 0. */
export const LOW_BYTE: readonly number[] = [7, 6, 5, 4, 3, 2, 1, 0];

/** The bits `from` to `to`, highest first. */
export const bitsFrom = (from: number, to: number): number[] =>
  Array.from({ length: Math.abs(to - from) + 1 }, (_, i) => Math.max(from, to) - i);

/** One big cell: a bit's number, its value, and the glyph of its mark. */
export function BitCell({
  n,
  on,
  marks = {},
  tag,
  numbers = false,
  glyphs = true,
  label,
}: {
  n: number;
  on: boolean;
  marks?: Marks;
  tag?: CellTag | undefined;
  /** Draw the bit's number above it. */
  numbers?: boolean;
  /** Leave room for a glyph below the bit (a row of cells keeps one height). */
  glyphs?: boolean;
  /** Words under the cell: what the bit means. */
  label?: string | undefined;
}) {
  const has = (set: ReadonlySet<number> | undefined) => (set?.has(n) ? "true" : "false");
  const shown: CellTag | undefined =
    tag ??
    (marks.changed?.has(n)
      ? "changed"
      : marks.lost?.has(n)
        ? "lost"
        : marks.fill?.has(n)
          ? "fill"
          : undefined);
  return (
    <span
      className="al-cell"
      data-bit={n}
      data-on={on}
      data-changed={has(marks.changed)}
      data-field={has(marks.field)}
      data-lost={has(marks.lost)}
      data-fill={has(marks.fill)}
      data-unused={has(marks.unused)}
      data-picked={has(marks.picked)}
      data-tag={shown}
    >
      {numbers && (
        <span className="al-cell-n" aria-hidden="true">
          {n}
        </span>
      )}
      <span className="al-cell-bit">{on ? "1" : "0"}</span>
      {glyphs && (
        <span className="al-cell-g" aria-hidden="true">
          {shown ? CELL_GLYPHS[shown] : ""}
        </span>
      )}
      {shown && <span className="visually-hidden">{S.cells.tag[shown]}</span>}
      {label !== undefined && <span className="al-cell-label">{label}</span>}
    </span>
  );
}

/**
 * A few bits of a word as big cells, with the row's name and value above them. `tags` gives a
 * glyph to chosen columns; `marks` is the same set of marks a row of 32 bits takes. The bit
 * numbers are drawn above the cells of one row of a group (`numbers`), and the rows of a group
 * share one layout, so a number stays over its bit in every row.
 */
export function BitCells({
  name,
  value,
  text,
  row,
  bits = LOW_BYTE,
  marks = {},
  tags,
  numbers = false,
  written = false,
}: {
  name: string;
  value: number;
  text: ReactNode;
  row: string;
  bits?: readonly number[];
  marks?: Marks;
  tags?: ReadonlyMap<number, CellTag>;
  numbers?: boolean;
  written?: boolean;
}) {
  return (
    <div
      className="al-cellrow"
      role="group"
      aria-label={S.bits.rowGroup(name, hex(value))}
      data-row={row}
      data-value={value >>> 0}
      data-changed={written}
    >
      <span className="al-cellrow-name">{name}</span>
      <span className="al-cellrow-value">{text}</span>
      <span className="al-cells">
        {bits.map((n) => (
          <BitCell
            key={n}
            n={n}
            on={bitOf(value, n) === 1}
            marks={marks}
            tag={tags?.get(n)}
            numbers={numbers}
          />
        ))}
      </span>
    </div>
  );
}

/** What the glyphs of a figure's cells mean: one line, for the tags the figure uses. */
export function CellLegend({ tags }: { tags: readonly CellTag[] }) {
  return (
    <p className="al-legend al-cell-legend">
      {tags.map((tag, i) => (
        <span key={tag} data-tag={tag}>
          {i > 0 ? " " : ""}
          <span className="al-cell-glyph" aria-hidden="true">
            {CELL_GLYPHS[tag]}
          </span>{" "}
          {S.cells.tag[tag]}
          {i < tags.length - 1 ? ";" : "."}
        </span>
      ))}
    </p>
  );
}

/**
 * A row of glyphs under the 32 bits of a row, one text mark in each marked column, in the same
 * layout as the bits so a glyph sits under its bit. It is for the eye: the figure's own sentence
 * says the same in words.
 */
export function MarkRow({
  name,
  row,
  glyphs,
}: {
  name: string;
  row: string;
  /** The glyph to draw in each marked column, by bit number. */
  glyphs: ReadonlyMap<number, string>;
}) {
  return (
    <div className="al-reg al-bitrow al-markrow" aria-hidden="true" data-row={row}>
      <span className="al-reg-name">{name}</span>
      <span className="al-reg-value" />
      <span className="al-bits">
        {[31, 23, 15, 7].map((top) => (
          <span className="al-bit-group" key={top}>
            {Array.from({ length: 8 }, (_, i) => top - i).map((n) => (
              <span className="al-mark" data-bit={n} key={n}>
                {glyphs.get(n) ?? ""}
              </span>
            ))}
          </span>
        ))}
      </span>
    </div>
  );
}
