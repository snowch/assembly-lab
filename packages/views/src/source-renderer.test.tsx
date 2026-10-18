// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";
import { ListingView } from "./parts";
import { cLinesOf, deleteLine, programLines } from "./listing";
import { TRIP_DISTANCE_AND_FUEL_USED } from "../../../content/lessons/meet-the-machine.listings";
import { RecordedSchema } from "./interactives/props";
import { ListingCompare } from "./interactives/ListingCompare";
import { VIEW_STRINGS as S } from "./strings";

const recorded = {
  c: "unsigned total(unsigned a, unsigned b)\n{\n  a += b;\n  return a;\n}",
  listing: "total:\nadd w0, w0, w1 C3\nret C5",
  sourceLines: [[3], [4]],
};

const texts = (container: HTMLElement, selector: string) =>
  [...container.querySelectorAll(selector)].map((element) => element.textContent);

describe("paired source presentation", () => {
  it("carries associations through the figure schema and highlights the operation, preserving raw references", () => {
    const program = RecordedSchema.parse(recorded);
    const { container } = render(
      <ListingView cLines={cLinesOf(program.c)} lines={programLines(program)} ran={2} litC={5} />,
    );
    expect(container.querySelector(".al-listing")).toHaveAttribute("data-source-layout", "inline");
    expect(container).not.toHaveTextContent(S.listing.multiSourceNote);
    expect(texts(container, ".al-cline .al-src")).toEqual(cLinesOf(recorded.c));
    expect(container.querySelector('.al-cline[data-lit="true"]')).toHaveAttribute("data-line", "4");
    expect(texts(container, ".al-insn .al-text")).toEqual(["add w0, w0, w1", "ret"]);
    const compiler = container.querySelector(".al-compiler-lines");
    expect(compiler).not.toHaveAttribute("open");
    expect(texts(container, ".al-compiler-line .al-ctag")).toEqual(["3", "5"]);
    expect(container.querySelector('.al-insn[data-ran="true"]')).toHaveTextContent("ret");
  });

  it("retains complete source and original order for reordered, combined and unlinked operations", () => {
    const lines = programLines({
      ...recorded,
      listing: "total:\nmov w2, w0 C1\n.Lagain:\nadd w0, w0, w1 C5\nret C5",
      sourceLines: [[], [3, 4], [4]],
    });
    const { container } = render(
      <ListingView
        cLines={cLinesOf(recorded.c)}
        lines={lines}
        ran={3}
        differences={new Set([3])}
      />,
    );
    expect(container.querySelector(".al-listing")).toHaveAttribute(
      "data-source-layout",
      "excerpts",
    );
    expect(container.querySelector(".al-full-source")).toHaveAttribute("open");
    expect(texts(container, ".al-full-source .al-src")).toEqual(cLinesOf(recorded.c));
    expect(
      texts(container, ".al-paired-source .al-label, .al-paired-source .al-insn .al-text"),
    ).toEqual(["total:", "mov w2, w0", ".Lagain:", "add w0, w0, w1", "ret"]);
    expect(container).toHaveTextContent(S.listing.noDirectSource);
    expect(container).toHaveTextContent(S.listing.multiSourceNote);
    expect(texts(container, ".al-full-source .al-cline[data-lit=true] .al-ln")).toEqual(["3", "4"]);
    expect(container.querySelector('.al-insn[data-differs="true"]')).toHaveTextContent(
      S.pair.differs,
    );
  });

  it("keeps the deleted return's source outside the following function box", () => {
    const lines = deleteLine(programLines(TRIP_DISTANCE_AND_FUEL_USED), {
      label: "trip_distance",
      text: "ret",
    });
    const { container } = render(
      <ListingView
        cLines={cLinesOf(TRIP_DISTANCE_AND_FUEL_USED.c)}
        lines={lines}
        grouped
        ran={3}
        next={5}
        crossedAfter={3}
      />,
    );
    expect(texts(container, ".al-full-source .al-src")).toEqual(
      cLinesOf(TRIP_DISTANCE_AND_FUEL_USED.c).map((line) => line || " "),
    );
    const fuel = container.querySelector('[data-function="fuel_used"]')!;
    expect(
      [...fuel.querySelectorAll(".al-cline")].map((row) => row.getAttribute("data-line")),
    ).toEqual(["11"]);
    expect(fuel.querySelector('[data-line="6"], [data-line="7"]')).toBeNull();
    expect(texts(container, ".al-paired-source .al-insn .al-text")).toEqual([
      "add w0, w0, w1",
      "add w0, w0, w2",
      "sub w0, w0, w3",
      "sub w0, w0, w1",
      "ret",
    ]);
    expect(container.querySelector('[data-mark="crossing"]')).not.toBeNull();
    expect(container.querySelector('.al-insn[data-next="true"]')).toHaveTextContent(
      "sub w0, w0, w1",
    );
  });

  it.each([false, true])(
    "scrolls only the stepping region and preserves focus (oversized group: %s)",
    (oversized) => {
      const bounds = (top: number, height: number) => ({
        x: 0,
        y: top,
        top,
        bottom: top + height,
        left: 0,
        right: 400,
        width: 400,
        height,
        toJSON: () => ({}),
      });
      const scrollPage = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
      vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
        this: HTMLElement,
      ) {
        if (this.classList.contains("al-listing")) return bounds(100, 200);
        if (this.classList.contains("al-source-row")) return bounds(400, oversized ? 600 : 120);
        return bounds(450, 32);
      });
      vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(function (
        this: HTMLElement,
      ) {
        return this.classList.contains("al-source-row") ? (oversized ? 600 : 120) : 32;
      });
      vi.spyOn(Element.prototype, "clientHeight", "get").mockReturnValue(200);
      try {
        const lines = programLines(recorded);
        const view = (ran: number | null) => (
          <>
            <button type="button">Keep focus</button>
            <ListingView cLines={cLinesOf(recorded.c)} lines={lines} ran={ran} />
          </>
        );
        const { container, rerender } = render(view(null));
        expect(container.querySelector(".al-listing")).not.toHaveAttribute("tabindex");
        const button = screen.getByRole("button", { name: "Keep focus" });
        button.focus();
        rerender(view(1));
        const listing = screen.getByRole("region", { name: S.listing.sourceConnections });
        expect(listing).toHaveAttribute("tabindex", "0");
        // Fit the complete 120px pair, or only the instruction when its pair cannot fit.
        expect(listing.scrollTop).toBe(oversized ? 182 : 220);
        expect(button).toHaveFocus();
        expect(scrollPage).not.toHaveBeenCalled();
      } finally {
        vi.restoreAllMocks();
      }
    },
  );

  it.each([
    {
      label: "clipped top, fitting pair",
      listingTop: -100,
      listingHeight: 300,
      pairTop: -60,
      pairHeight: 120,
      activeTop: -20,
      expected: 190,
    },
    {
      label: "clipped top, oversized pair",
      listingTop: -100,
      listingHeight: 200,
      pairTop: -70,
      pairHeight: 120,
      activeTop: -10,
      expected: 240,
    },
    {
      label: "clipped bottom",
      listingTop: window.innerHeight - 100,
      listingHeight: 200,
      pairTop: window.innerHeight - 20,
      pairHeight: 120,
      activeTop: window.innerHeight + 20,
      expected: 302,
    },
    {
      label: "fully offscreen",
      listingTop: window.innerHeight + 10,
      listingHeight: 200,
      pairTop: window.innerHeight + 20,
      pairHeight: 120,
      activeTop: window.innerHeight + 30,
      expected: 250,
    },
  ])(
    "uses the visible browser intersection: $label",
    ({ listingTop, listingHeight, pairTop, pairHeight, activeTop, expected }) => {
      const bounds = (top: number, height: number) => ({
        x: 0,
        y: top,
        top,
        bottom: top + height,
        left: 0,
        right: 400,
        width: 400,
        height,
        toJSON: () => ({}),
      });
      const scrollPage = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
      vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
        this: HTMLElement,
      ) {
        if (this.classList.contains("al-listing")) return bounds(listingTop, listingHeight);
        if (this.classList.contains("al-source-row")) return bounds(pairTop, pairHeight);
        return bounds(activeTop, 32);
      });
      vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(function (
        this: HTMLElement,
      ) {
        return this.classList.contains("al-source-row") ? pairHeight : 32;
      });
      vi.spyOn(Element.prototype, "clientHeight", "get").mockReturnValue(listingHeight);
      try {
        const lines = programLines(recorded);
        const view = (ran: number | null) => (
          <>
            <button type="button">Keep focus</button>
            <ListingView cLines={cLinesOf(recorded.c)} lines={lines} ran={ran} />
          </>
        );
        const { container, rerender } = render(view(null));
        const listing = container.querySelector<HTMLElement>(".al-listing")!;
        listing.scrollTop = 250;
        const button = screen.getByRole("button", { name: "Keep focus" });
        button.focus();
        rerender(view(1));
        expect(listing.scrollTop).toBe(expected);
        expect(button).toHaveFocus();
        expect(scrollPage).not.toHaveBeenCalled();
      } finally {
        vi.restoreAllMocks();
      }
    },
  );

  it("keeps assembly-only presentation when the figure explicitly hides source", () => {
    const { container } = render(
      <ListingView cLines={cLinesOf(recorded.c)} lines={programLines(recorded)} showC={false} />,
    );
    expect(container.querySelector(".al-listing")).toHaveAttribute("data-c", "none");
    expect(container.querySelector(".al-cline")).toBeNull();
    expect(container.querySelector(".al-full-source")).toBeNull();
    expect(texts(container, ".al-insn .al-text")).toEqual(["add w0, w0, w1", "ret"]);
  });

  it("reveals aligned comparisons only after the prediction is committed", () => {
    const interactive = Interactive.parse({
      id: "comparison",
      kind: "listing-compare",
      timeModel: "steps",
      caption: "Test comparison",
      props: {
        left: recorded,
        right: recorded,
        question: "Do these match?",
        options: [
          { value: "same", label: "Same" },
          { value: "different", label: "Different" },
        ],
      },
    });
    const { container } = render(
      <ListingCompare
        lesson={{} as Lesson}
        interactive={interactive}
        store={new LessonStore(memoryStorage(), "assembly-lab", "source-test")}
      />,
    );
    expect(container.querySelector(".al-source-connections")).toBeNull();
    expect(container.textContent).not.toContain("add w0, w0, w1");
    fireEvent.click(screen.getByRole("radio", { name: "Same" }));
    expect(container.querySelector(".al-source-connections")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: S.prediction.commit }));
    expect(container.querySelector(".al-source-connections")).not.toHaveAttribute("open");
    expect(container.querySelectorAll(".al-source-connections .al-listing-aligned")).toHaveLength(
      2,
    );
    expect(texts(container, ".al-compare-row .al-cmp-mark")).toEqual([
      S.compare.same,
      S.compare.same,
    ]);
  });
});
