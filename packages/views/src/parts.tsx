// Copyright © 2026 Christopher Snow

// The parts the figures share: a sentence with code in it, a register as a row of bits, and the C
// beside its instructions.

import { Fragment, useLayoutEffect, useRef, type ReactNode } from "react";

import type { ListingLine } from "./listing";
import { sourceLayout, type SourceRow } from "./source-layout";
import { VIEW_STRINGS as S } from "./strings";
import { MODULE0_STRINGS as M0 } from "./strings.module0";
import { MODULE1_STRINGS as M1 } from "./strings.module1";
import { bitsOf } from "./trace";

/** A sentence with `code` between backticks, the code drawn as code. */
export function withCode(text: string): ReactNode[] {
  return text.split(/`([^`]*)`/).map((piece, i) => (i % 2 ? <code key={i}>{piece}</code> : piece));
}

/**
 * A `w` register: its name, its 32 bits in four groups of eight (a 1 filled), and its value as a
 * decimal number. A register that the last step wrote is outlined. With `halves`, the two 16-bit
 * halves are drawn apart and each is labelled, because a constant's bits fall in one half or the
 * other.
 */
export function RegisterRow({
  name,
  value,
  changed,
  halves = false,
  tag,
}: {
  name: string;
  value: number;
  changed: boolean;
  halves?: boolean;
  /**
   * A word beside the name of a register that changed, so the change does not rest on an outline.
   * A figure that gives one gives it to every register, "" for those that did not change.
   */
  tag?: string;
}) {
  const bits = bitsOf(value);
  const groups = [0, 8, 16, 24].map((from) => bits.slice(from, from + 8));
  const group = (g: number) => (
    <span className="al-bit-group" key={g}>
      {[...(groups[g] ?? "")].map((bit, i) => (
        <span className="al-bit" data-on={bit === "1"} key={i}>
          {bit}
        </span>
      ))}
    </span>
  );
  return (
    <div
      className="al-reg"
      role="group"
      aria-label={S.register.group(name)}
      data-register={name}
      data-changed={changed}
      data-tagged={tag !== undefined ? true : undefined}
    >
      <span className="al-reg-name">
        {name}
        {tag !== undefined && tag !== "" && <span className="al-reg-tag"> {tag}</span>}
      </span>
      <span className="al-reg-value" title={changed ? S.register.changed : undefined}>
        {value}
      </span>
      {halves ? (
        <span className="al-bits" data-halves="true" aria-hidden="true">
          {[
            { label: M1.register.upperHalf, from: 0 },
            { label: M1.register.lowerHalf, from: 2 },
          ].map(({ label, from }) => (
            <span className="al-half16" key={from}>
              <span className="al-half16-name">{label}</span>
              <span className="al-half16-groups">{[from, from + 1].map(group)}</span>
            </span>
          ))}
        </span>
      ) : (
        <span className="al-bits" aria-hidden="true">
          {groups.map((_, g) => group(g))}
        </span>
      )}
    </div>
  );
}

/**
 * A `w` register drawn as its name and its value as a large decimal number, with no bits (the
 * stepper's switch shows the bits as `RegisterRow`s instead). A register that the last step wrote
 * is outlined and says so in words, so the mark does not rest on the outline alone.
 */
export function DecimalRegister({
  name,
  value,
  changed,
}: {
  name: string;
  value: number;
  changed: boolean;
}) {
  return (
    <div
      className="al-dreg"
      role="group"
      aria-label={S.register.group(name)}
      data-register={name}
      data-changed={changed}
    >
      <span className="al-dreg-name">{name}</span>
      <span className="al-dreg-value">{value}</span>
      <span className="al-dreg-flag">{changed ? M0.registers.changed : null}</span>
    </div>
  );
}

/** Pair checked C operations with instructions without changing the recorded assembly order. */
export function ListingView({
  cLines,
  lines,
  next = null,
  litC = null,
  ran = null,
  showC = true,
  grouped = false,
  stopAfter = null,
  crossedAfter = null,
  differences,
}: {
  cLines: readonly string[];
  lines: readonly ListingLine[];
  /** The index into `lines` of the instruction that runs next, marked with an arrow. */
  next?: number | null;
  /** The C line to light. */
  litC?: number | null;
  /** The index into `lines` of the instruction that ran last, whose C line tag is lit with it. */
  ran?: number | null;
  /** False for instructions that no compiler made from any C: only the instructions are drawn. */
  showC?: boolean;
  /**
   * Draw the instructions as one group for each label, so that a run which goes on from one
   * function into the next is seen to cross from one box into the other. Off, the labels are
   * rows in one list.
   */
  grouped?: boolean;
  /** Grouped: the index of the `ret` the run ended at, which gets a mark that the run stops there. */
  stopAfter?: number | null;
  /** Grouped: the index of the instruction the run left its function from; a link is drawn after its group. */
  crossedAfter?: number | null;
  /** Original listing indexes that differ from a comparison listing. */
  differences?: ReadonlySet<number>;
}) {
  // Assembly the lesson wrote itself has no C beside it: the listing is then the instructions alone.
  // `showC` false asks for the same: the instructions alone, with no C pane.
  const hasC = showC && cLines.some((text) => text.trim() !== "");
  const aligned =
    hasC &&
    lines.some((line) => line.kind === "instruction") &&
    lines.every((line) => line.kind === "label" || line.sourceLines !== undefined);
  const listingRef = useRef<HTMLDivElement>(null);
  const stepping = next !== null || ran !== null;
  useLayoutEffect(() => {
    const listing = listingRef.current;
    if (!aligned || !stepping || !listing) return;
    const active = listing.querySelector<HTMLElement>(
      ran === null ? '.al-insn[data-next="true"]' : '.al-insn[data-ran="true"]',
    );
    if (!active) return;
    const pair = active.closest<HTMLElement>(".al-source-row");
    const viewport = listing.getBoundingClientRect();
    // The controls may leave part of the listing above the browser viewport. Reveal against
    // the visible intersection, not merely the listing's own scroll bounds.
    const visibleTop = Math.max(viewport.top, 0);
    const visibleBottom = Math.min(viewport.top + listing.clientHeight, window.innerHeight);
    const visibleHeight = visibleBottom - visibleTop;
    if (visibleHeight <= 0) return;
    const target = pair && pair.offsetHeight <= visibleHeight ? pair : active;
    const box = target.getBoundingClientRect();
    if (box.top < visibleTop) listing.scrollTop += box.top - visibleTop;
    else if (box.bottom > visibleBottom) listing.scrollTop += box.bottom - visibleBottom;
    // Scroll this listing only: stepping must not move the page or steal keyboard focus.
  }, [aligned, stepping, ran, next, lines]);
  // One instruction's row: the marker, the text and the C line GCC recorded for it.
  const row = (i: number) => {
    const line = lines[i];
    if (!line || line.kind !== "instruction") return null;
    return (
      <div
        className={`al-insn${differences === undefined ? "" : " al-pair-insn"}`}
        key={i}
        data-next={next === i}
        data-ran={ran === i}
        data-differs={differences === undefined ? undefined : differences.has(i)}
      >
        <span className="al-mark" aria-hidden="true" />
        {next === i && <span className="visually-hidden">{S.listing.next}</span>}
        <code className="al-text">{line.text}</code>
        {differences?.has(i) && <span className="visually-hidden">{S.pair.differs}</span>}
        {!aligned && line.cLine !== null && (
          <span
            className="al-ctag"
            data-lit={litC === line.cLine && ran === i}
            title={S.listing.recordedAgainst(line.cLine)}
          >
            {line.cLine}
          </span>
        )}
      </div>
    );
  };
  if (aligned) {
    const layout = sourceLayout(lines, cLines.length);
    const last = ran === null ? undefined : lines[ran];
    const litLines = new Set(last?.kind === "instruction" ? last.sourceLines : []);
    const source = (numbers: readonly number[]) =>
      numbers.map((number) => (
        <div className="al-cline" key={number} data-line={number} data-lit={litLines.has(number)}>
          <span className="al-ln">{number}</span>
          <code className="al-src">{cLines[number - 1] || " "}</code>
        </div>
      ));
    const pairedRow = (pair: SourceRow, key: number) => {
      const hasInstruction = pair.listingIndexes.some((i) => lines[i]?.kind === "instruction");
      return (
        <div className="al-source-row" key={key}>
          <div
            className="al-source-cell al-c"
            data-empty={pair.sourceLines.length === 0}
            role={pair.sourceLines.length > 0 ? "group" : undefined}
            aria-label={
              pair.sourceLines.length > 0 ? S.listing.sourceLines(pair.sourceLines) : undefined
            }
          >
            {pair.sourceLines.length > 0 ? (
              <>
                <div className="al-pair-source-label">
                  {S.listing.sourceLines(pair.sourceLines)}
                </div>
                {source(pair.sourceLines)}
              </>
            ) : hasInstruction ? (
              <p className="al-source-note">{S.listing.noDirectSource}</p>
            ) : null}
          </div>
          <div
            className="al-source-cell al-asm"
            data-empty={pair.listingIndexes.length === 0}
            role={hasInstruction ? "group" : undefined}
            aria-label={hasInstruction ? S.listing.instructionsPane : undefined}
          >
            {hasInstruction && (
              <div className="al-pair-source-label">{S.listing.instructionsHeading}</div>
            )}
            {pair.listingIndexes.map((i) => {
              const line = lines[i];
              if (!line) return null;
              if (line.kind === "label")
                return (
                  <div className="al-label" key={i}>
                    {line.text}:
                  </div>
                );
              return (
                <Fragment key={i}>
                  {row(i)}
                  {/^(?:ret(?:\s|$)|bx\s+lr$|pop\s+\{[^}]*\bpc\b[^}]*\}$)/i.test(line.text) && (
                    <p className="al-source-note al-return-note">{S.listing.returnControl}</p>
                  )}
                  {grouped && stopAfter === i && (
                    <div className="al-stop" role="note" data-mark="stop">
                      {withCode(M0.listing.stop)}
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>
        </div>
      );
    };
    return (
      <div
        ref={listingRef}
        className="al-listing al-listing-aligned"
        data-stepping={stepping || undefined}
        tabIndex={stepping ? 0 : undefined}
        role={stepping ? "region" : undefined}
        aria-label={stepping ? S.listing.sourceConnections : undefined}
        data-c="shown"
        data-source-layout={layout.inlineSource ? "inline" : "excerpts"}
      >
        {!layout.inlineSource && (
          <>
            <details className="al-full-source" open>
              <summary>{S.listing.fullSource}</summary>
              <div className="al-pane al-c" role="group" aria-label={S.listing.cPane}>
                {source(cLines.map((_, i) => i + 1))}
              </div>
            </details>
            <p className="al-source-explanation">{S.listing.repeatedSourceNote}</p>
          </>
        )}
        {lines.some(
          (line) => line.kind === "instruction" && (line.sourceLines?.length ?? 0) > 1,
        ) && <p className="al-source-explanation">{S.listing.multiSourceNote}</p>}
        <div className="al-pane al-paired-source">
          <div className="al-source-row al-source-head" aria-hidden="true">
            <div className="al-pane-head">{S.listing.sourceHeading}</div>
            <div className="al-pane-head">{S.listing.instructionsHeading}</div>
          </div>
          {grouped
            ? sourceGroups(layout.rows, lines).map((group, g, all) => {
                const following = all[g + 1];
                return (
                  <Fragment key={g}>
                    <div className="al-group" data-function={group.label ?? undefined}>
                      {group.rows.map(pairedRow)}
                    </div>
                    {crossedAfter !== null &&
                      group.rows.some((pair) => pair.listingIndexes.includes(crossedAfter)) &&
                      following?.label != null &&
                      group.label !== null && (
                        <div className="al-link" role="note" data-mark="crossing">
                          <span className="al-link-line" aria-hidden="true" />
                          <span>{withCode(M0.listing.crossing(group.label, following.label))}</span>
                        </div>
                      )}
                  </Fragment>
                );
              })
            : layout.rows.map(pairedRow)}
        </div>
        {lines.some((line) => line.kind === "instruction" && line.cLine !== null) && (
          <details className="al-compiler-lines">
            <summary>{S.listing.compilerLinesSummary}</summary>
            <p>{S.listing.compilerLinesExplanation}</p>
            <div className="al-pane">
              <div className="al-pane-head">
                <span>{S.listing.instructionsHeading}</span>
                <span>{S.listing.cLineHeading}</span>
              </div>
              {lines.map((line, i) =>
                line.kind === "label" ? (
                  <div className="al-label" key={i}>
                    {line.text}:
                  </div>
                ) : (
                  <div className="al-compiler-line" key={i}>
                    <code className="al-text">{line.text}</code>
                    {line.cLine !== null && (
                      <span className="al-ctag" title={S.listing.recordedAgainst(line.cLine)}>
                        {line.cLine}
                      </span>
                    )}
                  </div>
                ),
              )}
            </div>
          </details>
        )}
      </div>
    );
  }
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
        {grouped
          ? groupsOf(lines).map((group, g, all) => {
              const following = all[g + 1];
              return (
                <Fragment key={g}>
                  <div className="al-group" data-function={group.label ?? undefined}>
                    {group.label !== null && <div className="al-label">{group.label}:</div>}
                    {group.rows.map((i) => (
                      <Fragment key={i}>
                        {row(i)}
                        {stopAfter === i && (
                          <div className="al-stop" role="note" data-mark="stop">
                            {withCode(M0.listing.stop)}
                          </div>
                        )}
                      </Fragment>
                    ))}
                  </div>
                  {crossedAfter !== null &&
                    group.rows.includes(crossedAfter) &&
                    following?.label != null &&
                    group.label !== null && (
                      <div className="al-link" role="note" data-mark="crossing">
                        <span className="al-link-line" aria-hidden="true" />
                        <span>{withCode(M0.listing.crossing(group.label, following.label))}</span>
                      </div>
                    )}
                </Fragment>
              );
            })
          : lines.map((line, i) =>
              line.kind === "label" ? (
                <div className="al-label" key={i}>
                  {line.text}:
                </div>
              ) : (
                row(i)
              ),
            )}
      </div>
    </div>
  );
}

/** Keep the existing function boxes and crossing markers around aligned rows. */
function sourceGroups(rows: readonly SourceRow[], lines: readonly ListingLine[]) {
  const groups: { label: string | null; rows: SourceRow[] }[] = [];
  for (const row of rows) {
    const line = lines[row.listingIndexes[0] ?? -1];
    if (line?.kind === "label") groups.push({ label: line.text, rows: [] });
    if (groups.length === 0) groups.push({ label: null, rows: [] });
    groups.at(-1)?.rows.push(row);
  }
  return groups;
}

/** The instructions of a listing under their labels: the indexes of each label's instructions. */
function groupsOf(lines: readonly ListingLine[]): { label: string | null; rows: number[] }[] {
  const groups: { label: string | null; rows: number[] }[] = [];
  lines.forEach((line, i) => {
    if (line.kind === "label") groups.push({ label: line.text, rows: [] });
    else {
      if (groups.length === 0) groups.push({ label: null, rows: [] });
      groups[groups.length - 1]?.rows.push(i);
    }
  });
  return groups;
}
