// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";

import { TRIP_REMAINING, TRIP_REMAINING_U } from "../../../../content/lessons/module-1.listings";
import { bitsOf, traceOf, wValue, wValueAsInt } from "../trace";
import { CALL_COMPARISON_STRINGS as C } from "../strings.call-comparison";
import { VIEW_STRINGS as S } from "../strings";
import { ListingCompare } from "./ListingCompare";

function comparison(
  args = [3, 5],
  store = new LessonStore(memoryStorage(), "assembly-lab", "comparison-calls"),
  workedReadings = true,
) {
  const interactive = Interactive.parse({
    id: "typed-subtraction",
    kind: "listing-compare",
    timeModel: "steps",
    caption: "Test comparison",
    props: {
      left: TRIP_REMAINING,
      right: TRIP_REMAINING_U,
      question: "Do the instructions match?",
      options: [
        { value: "same", label: "Same" },
        { value: "different", label: "Different" },
      ],
      callComparison: {
        args,
        leftType: "signed",
        rightType: "unsigned",
        workedReadings,
        tripContext: true,
      },
    },
  });
  return {
    ...render(<ListingCompare lesson={{} as Lesson} interactive={interactive} store={store} />),
    store,
  };
}

function predict() {
  fireEvent.click(screen.getByRole("radio", { name: "Same" }));
  fireEvent.click(screen.getByRole("button", { name: S.prediction.commit }));
}

function callBoth() {
  fireEvent.click(screen.getByRole("button", { name: C.callBoth }));
}

describe("comparing the C return types by calling both listings", () => {
  it("gates instructions on the prediction and gates every returned value on the explicit call", () => {
    const { container } = comparison();
    expect(container.querySelectorAll(".al-pane.al-c")).toHaveLength(2);
    expect(container).toHaveTextContent(C.startingInputs("3, 5"));
    expect(container.querySelector(".al-listing")).toBeNull();
    expect(container).not.toHaveTextContent("sub w0, w0, w1");
    expect(screen.queryByRole("button", { name: C.callBoth })).toBeNull();
    expect(container.querySelector("[data-call-result]")).toBeNull();
    expect(container.querySelector("[data-return-explanation]")).toBeNull();
    fireEvent.click(screen.getByRole("radio", { name: "Same" }));
    expect(container.querySelector(".al-listing")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: S.prediction.commit }));
    const listings = container.querySelectorAll(".al-listing");
    const prediction = container.querySelector('[data-figure="listing-compare-prediction"]')!;
    expect(listings).toHaveLength(2);
    for (const listing of listings) {
      expect(
        listing.compareDocumentPosition(prediction) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
      expect(listing.querySelectorAll(".al-cline")).toHaveLength(4);
      expect(listing.querySelectorAll(".al-insn")).toHaveLength(2);
      expect([...listing.querySelectorAll(".al-ctag")].map((tag) => tag.textContent)).toEqual([
        "3",
        "3",
      ]);
    }
    expect(container.querySelector(".al-source-connections")).toBeNull();
    expect(screen.getByRole("button", { name: C.callBoth })).toBeEnabled();
    expect(container.querySelector("[data-call-result]")).toBeNull();
    expect(container.querySelector("[data-return-explanation]")).toBeNull();
    expect(screen.queryByRole("button", { name: S.stepper.next })).toBeNull();
  });

  it.each([
    [3, 5],
    [8, 2],
  ])("reads each independent model call with its C type for args %j", (...args) => {
    const { container, store } = comparison(args);
    predict();
    callBoth();
    const models = [TRIP_REMAINING, TRIP_REMAINING_U].map(
      (program, i) =>
        traceOf(program, {
          entry: i === 0 ? "trip_remaining" : "trip_remaining_u",
          args,
        }).result,
    );
    for (const [i, result] of models.entries()) {
      expect(result.stop.kind).toBe("returned");
      const side = container.querySelector(`[data-call-result="${i}"]`) as HTMLElement;
      const bits = [...side.querySelectorAll(".al-bit")].map((bit) => bit.textContent).join("");
      expect(bits).toBe(bitsOf(wValue(result.final, 0)));
      expect(side.querySelectorAll(".al-bit-group")).toHaveLength(4);
      const reading = i === 0 ? wValueAsInt(result.final, 0) : wValue(result.final, 0);
      expect(side.querySelector("[data-return-value]")).toHaveAttribute(
        "data-return-value",
        String(reading),
      );
      expect(side).toHaveTextContent(
        C.returnValue(i === 0 ? C.signedType : C.unsignedType, String(reading)),
      );
      expect(side.querySelectorAll("[data-return-reading]")).toHaveLength(1);
    }
    const bridge = container.querySelector("[data-return-explanation]") as HTMLElement;
    const word = wValue(models[0]!.final, 0);
    const lower = word % 2 ** 31;
    const top = Math.floor(word / 2 ** 31);
    expect(bridge).toHaveTextContent(C.noArithmeticError);
    if (args[0]! < args[1]!) {
      expect(bridge).toHaveTextContent(C.tripOverrun(wValueAsInt(models[0]!.final, 0), word));
      expect(bridge).toHaveTextContent(C.unsignedWrap);
    } else {
      expect(bridge.querySelector("[data-trip-overrun]")).toBeNull();
      expect(bridge).not.toHaveTextContent(C.unsignedWrap);
    }
    expect(bridge).toHaveTextContent(
      C.readingEquation(C.signedType, lower, -top * 2 ** 31, wValueAsInt(models[0]!.final, 0)),
    );
    expect(bridge).toHaveTextContent(C.readingEquation(C.unsignedType, lower, top * 2 ** 31, word));
    expect(within(bridge).getByRole("link")).toHaveAttribute(
      "href",
      "#/lesson/same-bits-two-readings",
    );
    expect(
      container.querySelector('[data-call-result="1"]')!.compareDocumentPosition(bridge) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(container.querySelector("[data-same-bits]")).toHaveAttribute("data-same-bits", "true");
    expect(screen.getByRole("button", { name: C.callBoth })).toBeDisabled();
    expect(store.slot("typed-subtraction:calls")).toBe(true);
  });

  it("restores the call action and recomputes results from the current model inputs", () => {
    const storage = memoryStorage();
    const initialStore = new LessonStore(storage, "assembly-lab", "restore-calls");
    const first = comparison([3, 5], initialStore);
    predict();
    callBoth();
    expect(
      first.container.querySelector('[data-call-side="left"] [data-return-value]'),
    ).toHaveAttribute("data-return-value", "-2");
    expect(
      first.container.querySelector('[data-call-side="right"] [data-return-value]'),
    ).toHaveAttribute("data-return-value", "4294967294");
    first.unmount();
    const restoredStore = new LessonStore(storage, "assembly-lab", "restore-calls");
    const restored = comparison([7, 2], restoredStore);
    expect(restored.container.querySelectorAll(".al-listing")).toHaveLength(2);
    for (const result of restored.container.querySelectorAll("[data-return-value]")) {
      expect(result).toHaveAttribute("data-return-value", "5");
    }
    expect(restored.container.querySelector("[data-return-explanation]")).toHaveTextContent(
      "5 + 0 = 5",
    );
    expect(restored.container.querySelector("[data-return-explanation]")).not.toHaveTextContent(
      "2147483646",
    );
    expect(restored.container.querySelector("[data-trip-overrun]")).toBeNull();
    expect(restored.container).not.toHaveTextContent(C.unsignedWrap);
    expect(
      within(screen.getByRole("group", { name: C.resultGroup })).getByText(C.sameBits),
    ).toBeInTheDocument();
  });

  it("keeps the worked reading opt-in for existing call comparisons", () => {
    const { container } = comparison([3, 5], undefined, false);
    predict();
    callBoth();
    expect(container.querySelectorAll("[data-call-result]")).toHaveLength(2);
    expect(container.querySelector("[data-return-explanation]")).toBeNull();
  });

  it("resets calls without losing the prediction, and a lesson reset closes both gates", () => {
    const { container, store } = comparison();
    predict();
    callBoth();
    fireEvent.click(screen.getByRole("button", { name: C.resetCalls }));
    expect(container.querySelector("[data-call-result]")).toBeNull();
    expect(container.querySelector("[data-return-explanation]")).toBeNull();
    expect(container.querySelectorAll(".al-listing")).toHaveLength(2);
    expect(store.slot("typed-subtraction")).toEqual({ choice: "same" });
    expect(store.slot("typed-subtraction:calls")).toBeUndefined();
    callBoth();
    expect(container.querySelectorAll("[data-call-result]")).toHaveLength(2);
    act(() => store.reset());
    expect(container.querySelector(".al-listing")).toBeNull();
    expect(container.querySelector("[data-call-result]")).toBeNull();
    expect(container.querySelector("[data-return-explanation]")).toBeNull();
    expect(screen.queryByRole("button", { name: C.callBoth })).toBeNull();
  });
});
