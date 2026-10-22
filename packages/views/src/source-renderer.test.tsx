// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";
import { ListingView } from "./parts";
import { cLinesOf, programLines } from "./listing";
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

describe("the C beside its instructions", () => {
  it("tags each instruction with its checked C line, in the numbering the C pane shows", () => {
    const program = RecordedSchema.parse(recorded);
    const { container } = render(
      <ListingView cLines={cLinesOf(program.c)} lines={programLines(program)} ran={1} />,
    );
    expect(container.querySelector(".al-listing")).toHaveAttribute("data-c", "shown");
    expect(texts(container, ".al-cline .al-src")).toEqual(cLinesOf(recorded.c));
    // The instruction that ran lights its checked C line in both panes.
    expect(container.querySelector('.al-cline[data-lit="true"]')).toHaveAttribute("data-line", "3");
    expect(texts(container, ".al-insn .al-text")).toEqual(["add w0, w0, w1", "ret"]);
    expect(texts(container, ".al-insn .al-ctag")).toEqual(["3", "4"]);
    expect(container.querySelector('.al-insn[data-ran="true"]')).toHaveTextContent(
      "add w0, w0, w1",
    );
    expect(container.querySelector('.al-insn[data-ran="true"] .al-ctag')).toHaveAttribute(
      "data-lit",
      "true",
    );
  });

  it("omits routine compiler details while preserving the original references and checked links", () => {
    const lines = programLines(recorded);
    const { container } = render(
      <ListingView cLines={cLinesOf(recorded.c)} lines={lines} ran={1} />,
    );
    expect(container.querySelector(".al-compiler-lines")).toBeNull();
    expect(texts(container, ".al-insn .al-ctag")).toEqual(["3", "4"]);
    expect(container.querySelector('.al-cline[data-lit="true"]')).toHaveAttribute("data-line", "3");
    expect(lines.filter((line) => line.kind === "instruction").map((line) => line.cLine)).toEqual([
      3, 5,
    ]);
  });

  it("shows several checked C lines as one tag, and no tag where none is checked", () => {
    const lines = programLines({
      ...recorded,
      listing: "total:\nmov w2, w0 C1\nadd w0, w0, w1 C5\nret C5",
      sourceLines: [[], [3, 4], [4]],
    });
    const { container } = render(
      <ListingView cLines={cLinesOf(recorded.c)} lines={lines} ran={2} />,
    );
    expect(texts(container, ".al-insn .al-ctag")).toEqual(["3, 4", "4"]);
    // The combined operation lights both C lines; the unlinked instruction lights none.
    expect(texts(container, '.al-cline[data-lit="true"] .al-ln')).toEqual(["3", "4"]);
    expect(
      [...container.querySelectorAll(".al-ctag")].find((tag) => tag.textContent === "3, 4"),
    ).toHaveAttribute("title", S.listing.sourceLines([3, 4]));
  });

  it("shows original compiler references only when the caller opts in", () => {
    const program = RecordedSchema.parse(recorded);
    const { container } = render(
      <ListingView cLines={cLinesOf(program.c)} lines={programLines(program)} showCompilerLines />,
    );
    const details = container.querySelector(".al-compiler-lines");
    expect(details).not.toHaveAttribute("open");
    expect(texts(container, ".al-compiler-line .al-ctag")).toEqual(["3", "5"]);
  });

  it("keeps function groups and crossing markers while showing the complete C once", () => {
    const lines = programLines(TRIP_DISTANCE_AND_FUEL_USED);
    const { container } = render(
      <ListingView
        cLines={cLinesOf(TRIP_DISTANCE_AND_FUEL_USED.c)}
        lines={lines}
        grouped
        ran={3}
        next={6}
        crossedAfter={3}
      />,
    );
    expect(texts(container, ".al-cline .al-src")).toEqual(
      cLinesOf(TRIP_DISTANCE_AND_FUEL_USED.c).map((line) => line || " "),
    );
    const fuel = container.querySelector('[data-function="fuel_used"]')!;
    expect(fuel).not.toBeNull();
    expect(texts(container, ".al-insn .al-text")).toEqual([
      "add w0, w0, w1",
      "add w0, w0, w2",
      "sub w0, w0, w3",
      "ret",
      "sub w0, w0, w1",
      "ret",
    ]);
    expect(container.querySelector('[data-mark="crossing"]')).not.toBeNull();
    expect(container.querySelector('.al-insn[data-next="true"]')).toHaveTextContent(
      "sub w0, w0, w1",
    );
  });

  it.each([false, true])(
    "scrolls only the stepping region and preserves focus (oversized row: %s)",
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
        if (this.classList.contains("al-insn")) return bounds(400, oversized ? 600 : 120);
        return bounds(450, 32);
      });
      vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(function (
        this: HTMLElement,
      ) {
        return this.classList.contains("al-insn") ? (oversized ? 600 : 120) : 32;
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
        expect(listing.scrollTop).toBe(oversized ? 700 : 220);
        expect(button).toHaveFocus();
        expect(scrollPage).not.toHaveBeenCalled();
      } finally {
        vi.restoreAllMocks();
      }
    },
  );

  it.each([
    {
      label: "clipped top",
      listingTop: -100,
      listingHeight: 300,
      activeTop: -20,
      expected: 230,
    },
    {
      label: "clipped bottom",
      listingTop: window.innerHeight - 100,
      listingHeight: 200,
      activeTop: window.innerHeight + 20,
      expected: 302,
    },
    {
      label: "fully offscreen",
      listingTop: window.innerHeight + 10,
      listingHeight: 200,
      activeTop: window.innerHeight + 30,
      expected: 250,
    },
  ])(
    "uses the visible browser intersection: $label",
    ({ listingTop, listingHeight, activeTop, expected }) => {
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
        return bounds(activeTop, 32);
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
    expect(texts(container, ".al-insn .al-text")).toEqual(["add w0, w0, w1", "ret"]);
  });

  it("reveals the listings only after the prediction is committed", () => {
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
    expect(container.querySelectorAll(".al-source-connections .al-listing")).toHaveLength(2);
    expect(texts(container, ".al-compare-row .al-cmp-mark")).toEqual([
      S.compare.same,
      S.compare.same,
    ]);
  });
});
