// Copyright © 2026 Christopher Snow

// The front page's pictures: a small line mark for each module, and the cover's live figure.
//
// The marks are the course's own, drawn on a 24-unit grid as digital-design's stage marks are, so
// the two courses' lists look like one family; none is copied from it.

import { useMemo, useState, type ReactNode } from "react";

import { COVER_CALL, COVER_PROGRAM } from "@al/content";
import { VIEW_STRINGS, bitsOf, traceOf, viewAt, wValue } from "@al/views";

import { STRINGS } from "../strings";

/** One mark per module, by the module's id in content/plan/plan.ts. */
export const MODULE_ICONS: Readonly<Record<string, ReactNode>> = {
  // A listing, with the marker at the line that runs next.
  "meet-the-machine": <path d="M10 6h10M10 12h10M10 18h10M3.5 9l3.5 3-3.5 3" />,
  // A register: one row of cells.
  "registers-and-readings": <path d="M3 8h18v8H3zM7.5 8v8M12 8v8M16.5 8v8" />,
  // A plus sign beside a raised flag.
  "adding-and-the-flags": <path d="M6.5 9v8M2.5 13h8M14 21V4l6.5 3-6.5 3" />,
  // A word of cells, and an arrow moving its bits along.
  "logic-shifts-masks": <path d="M3 5h18v6H3zM9 5v6M15 5v6M4 18h15M15.5 15l3.5 3-3.5 3" />,
  // One path that forks into two.
  "compare-and-branch": (
    <path d="M12 21v-8M12 13L6.5 5M12 13l5.5-8M4 7.5L6.5 5 9 6M15 6l2.5-1 2.5 2.5" />
  ),
  // An arrow that comes back round to where it started.
  loops: <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 4.5v4h-4" />,
  // A narrow value below, widened into a whole register above.
  "loads-stores-widths": <path d="M3 4h18v6H3zM15 14h6v6h-6zM18 14v-4M14 7h.01" />,
  // A row of cells, and a pointer under one of them.
  "arrays-strings-pointers": (
    <path d="M3 5h18v6H3zM7.5 5v6M12 5v6M16.5 5v6M14.25 21v-6.5M11.75 17l2.5-2.5 2.5 2.5" />
  ),
  // A product that needs a row twice as long.
  "multiply-and-divide": <path d="M5 4l6 6M11 4l-6 6M3 15h18v5H3zM12 15v5" />,
  // Three plates on a stack, and one more arriving.
  "calls-and-the-stack": <path d="M5 20h14M5 16h14M5 12h14M12 3v5.5M9.5 6l2.5 2.5L14.5 6" />,
  // A brace of C, and lines of instructions.
  "from-c-to-assembly": (
    <path d="M7.5 4c-2 0-2 1.5-2 3.5S5 11 3.5 12c1.5 1 2 2.5 2 4.5S5.5 20 7.5 20M12 8h9M12 12h9M12 16h9" />
  ),
  // A warning.
  "where-c-and-the-machine-disagree": <path d="M12 3.5l9 16H3zM12 10v4M12 16.8v.2" />,
  // The same line run two ways, side by side.
  "running-arm64-outside-assembly-lab": <path d="M3 5h18v14H3zM6 9l3 3-3 3M12 15h5" />,
  "running-on-raspberry-pi-5": (
    <path d="M5 5h14v14H5zM9 9h6v6H9zM2 8h3M2 16h3M19 8h3M19 16h3M8 2v3M16 2v3M8 19v3M16 19v3" />
  ),
  "the-same-programs-on-32-bit-arm": <path d="M4 12h16M8 8l-4 4 4 4M16 8l4 4-4 4" />,
  // One row of bits, with positive and negative weights.
  "twos-complement": <path d="M3 10h18v8H3zM7.5 10v8M12 10v8M16.5 10v8M3 5h5M14 3v4M12 5h4" />,
};

/**
 * The cover's figure, live: `fuel_on_board`'s three instructions with a marker at the one that runs
 * next, and `w0` as 32 cells and a number. Next runs one instruction and Reset starts again. Every
 * value comes from the course's simulator (packages/views, the same run Module 0's stepper
 * draws), as digital-design's cover runs its live circuit.
 */
export function CoverFigure() {
  const trace = useMemo(() => traceOf(COVER_PROGRAM, COVER_CALL), []);
  const [k, setK] = useState(0);
  const view = viewAt(trace, k);
  const value = wValue(view.state, 0);
  const instructions = trace.lines.flatMap((line, index) =>
    line.kind === "instruction" ? [{ index, text: line.text }] : [],
  );
  const cell = 8;
  const pitch = 9;
  const byteGap = 6;
  const x0 = 44;
  const bits = bitsOf(value);
  const cells: ReactNode[] = [];
  for (let i = 0; i < 32; i++) {
    const x = x0 + i * pitch + Math.floor(i / 8) * byteGap;
    cells.push(
      <rect
        key={i}
        x={x}
        y={136}
        width={cell}
        height={16}
        rx={1.5}
        className={bits[i] === "1" ? "cover-bit on" : "cover-bit"}
      />,
    );
  }
  const atEnd = view.k >= view.total;
  const next = instructions.findIndex((ins) => ins.index === view.next);
  return (
    <div className="cover-stepper" role="group" aria-label={STRINGS.cover.figure}>
      <svg className="cover-figure" viewBox="-14 -6 388 206" aria-hidden="true" focusable="false">
        <rect x={-14} y={-6} width={388} height={206} rx={10} className="cover-panel" />
        {instructions.map((ins, i) => (
          <text
            key={ins.index}
            x={44}
            y={30 + i * 25}
            className="cover-code"
            data-next={i === next}
          >
            {ins.text}
          </text>
        ))}
        {next >= 0 && <path d={`M26 ${17 + next * 25}l9 6-9 6z`} className="cover-marker" />}
        <text x={0} y={149} className="cover-reg">
          w0
        </text>
        {view.written.has(0) && (
          <rect x={x0 - 4} y={132} width={313} height={24} rx={3} className="cover-changed" />
        )}
        {cells}
        <text x={44} y={180} className="cover-value">
          = {value}
        </text>
      </svg>
      <div className="cover-controls">
        <button type="button" className="cover-button" disabled={atEnd} onClick={() => setK(k + 1)}>
          {VIEW_STRINGS.stepper.next}
        </button>
        <button
          type="button"
          className="cover-button quiet"
          disabled={view.k === 0}
          onClick={() => setK(0)}
        >
          {VIEW_STRINGS.stepper.reset}
        </button>
      </div>
      <p className="cover-help">{STRINGS.cover.help}</p>
      <p className="visually-hidden" role="status">
        {STRINGS.cover.register(value)} {atEnd ? VIEW_STRINGS.stepper.ended : ""}
      </p>
    </div>
  );
}
