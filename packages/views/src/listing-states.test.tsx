// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

// The listing's execution states, kept to one vocabulary: the C line(s) checked for the
// instruction that ran and that instruction's row carry the same `data-lit`/`data-ran` marks (the
// same primary treatment in CSS), the instruction that runs next carries only `data-next`, and
// a static listing carries neither. The states are told apart by more than the attributes: each
// marked row says what it is to a screen reader.

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ListingView } from "./parts";
import { cLinesOf, programLines } from "./listing";
import { RecordedSchema } from "./interactives/props";
import { VIEW_STRINGS as S } from "./strings";

const recorded = {
  c: "int trip_distance(int leg1, int leg2, int leg3, int detour)\n{\n    int total = leg1 + leg2;\n    total = total + leg3;\n    total = total - detour;\n    return total;\n}",
  listing:
    "trip_distance:\n  add w0, w0, w1 C3\n  add w0, w0, w2 C4\n  sub w0, w0, w3 C7\n  ret C7",
  sourceLines: [[3], [4], [5], [6]],
};

const program = RecordedSchema.parse(recorded);
const cLines = cLinesOf(program.c);
// The label is row 0; the instructions are rows 1 to 4.
const lines = programLines(program);

describe("the listing's execution states", () => {
  it("marks the instruction that ran and its checked C line as the same event", () => {
    const { container } = render(<ListingView cLines={cLines} lines={lines} ran={2} next={3} />);
    const ran = container.querySelector('.al-insn[data-ran="true"]');
    const lit = container.querySelector('.al-cline[data-lit="true"]');
    expect(ran?.querySelector(".al-text")).toHaveTextContent("add w0, w0, w2");
    expect(lit).toHaveAttribute("data-line", "4");
    // Both rows say what the mark means, in words, not only by their attributes.
    expect(ran).toHaveTextContent(S.listing.ran);
    expect(ran?.querySelector(".al-ctag")).toHaveAttribute("data-lit", "true");
  });

  it("marks the next instruction without any executed mark on it", () => {
    const { container } = render(<ListingView cLines={cLines} lines={lines} ran={2} next={3} />);
    const next = container.querySelector('.al-insn[data-next="true"]');
    expect(next?.querySelector(".al-text")).toHaveTextContent("sub w0, w0, w3");
    expect(next).toHaveAttribute("data-ran", "false");
    expect(next).toHaveTextContent(S.listing.next);
    expect(next?.querySelector(".al-ctag")).toHaveAttribute("data-lit", "false");
    expect(container.querySelectorAll('.al-cline[data-lit="true"]')).toHaveLength(1);
  });

  it("shows both states on one row when the instruction that ran is the one that runs next", () => {
    const { container } = render(<ListingView cLines={cLines} lines={lines} ran={2} next={2} />);
    const row = container.querySelector('.al-insn[data-ran="true"]');
    expect(row).toHaveAttribute("data-next", "true");
    expect(row).toHaveTextContent(S.listing.ran);
    expect(row).toHaveTextContent(S.listing.next);
  });

  it("marks nothing before the first step, and the last row when the run has ended", () => {
    const fresh = render(<ListingView cLines={cLines} lines={lines} next={1} />);
    expect(fresh.container.querySelector('[data-ran="true"]')).toBeNull();
    expect(fresh.container.querySelector('[data-lit="true"]')).toBeNull();
    expect(fresh.container.querySelector('.al-insn[data-next="true"]')).not.toBeNull();

    const ended = render(<ListingView cLines={cLines} lines={lines} ran={4} />);
    expect(ended.container.querySelector('.al-insn[data-next="true"]')).toBeNull();
    expect(ended.container.querySelector('.al-insn[data-ran="true"] .al-text')).toHaveTextContent(
      "ret",
    );
    expect(ended.container.querySelector('.al-cline[data-lit="true"]')).toHaveAttribute(
      "data-line",
      "6",
    );
  });

  it("keeps a static listing free of execution marks", () => {
    const { container } = render(<ListingView cLines={cLines} lines={lines} />);
    expect(
      container.querySelector('[data-ran="true"], [data-next="true"], [data-lit="true"]'),
    ).toBeNull();
    expect(container.querySelector(".al-listing")).not.toHaveAttribute("data-stepping");
  });

  it("lights no C line for an instruction with no checked source, whatever ran", () => {
    const unmapped = programLines({
      ...recorded,
      listing: "total:\nmov w2, w0 C1\nadd w0, w0, w1 C5\nret C5",
      sourceLines: [[], [3, 4], [4]],
    });
    const { container } = render(<ListingView cLines={cLines} lines={unmapped} ran={1} next={2} />);
    expect(container.querySelector('.al-insn[data-ran="true"] .al-text')).toHaveTextContent(
      "mov w2, w0",
    );
    expect(container.querySelector('.al-cline[data-lit="true"]')).toBeNull();
    // The row that ran carries no lit tag at all: no C statement was checked for it.
    expect(container.querySelector('.al-insn[data-ran="true"] .al-ctag')).toBeNull();
  });
});
