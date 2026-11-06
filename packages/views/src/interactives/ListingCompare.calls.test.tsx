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
  right: {
    c: string;
    listing: string;
    sourceLines: readonly (readonly number[])[];
  } = TRIP_REMAINING_U,
  rightType: "signed" | "unsigned" = "unsigned",
) {
  const interactive = Interactive.parse({
    id: "typed-subtraction",
    kind: "listing-compare",
    timeModel: "steps",
    caption: "Test comparison",
    props: {
      left: TRIP_REMAINING,
      right,
      question: "Do the instructions match?",
      options: [
        { value: "same", label: "Same" },
        { value: "different", label: "Different" },
      ],
      callComparison: {
        args,
        leftType: "signed",
        rightType,
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
    const { container, store } = comparison();
    const stages = [C.sourceHeading, C.predictionHeading, C.callHeading].map((name) =>
      screen.getByRole("group", { name }),
    );
    for (let i = 1; i < stages.length; i++) {
      expect(
        stages[i - 1]!.compareDocumentPosition(stages[i]!) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    }
    expect(container.querySelectorAll(".al-pane.al-c")).toHaveLength(2);
    expect(container).toHaveTextContent(C.startingInputs("3, 5"));
    expect(container.querySelector(".al-listing")).toBeNull();
    expect(container).not.toHaveTextContent("sub w0, w0, w1");
    expect(screen.getByRole("button", { name: C.callBoth })).toBeDisabled();
    callBoth();
    expect(store.slot("typed-subtraction:calls")).toBeUndefined();
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
    expect(stages[0]).toContainElement(listings[0] as HTMLElement);
    expect(stages[1]).toContainElement(prediction as HTMLElement);
    expect(stages[2]).toContainElement(screen.getByRole("button", { name: C.callBoth }));
    expect(stages[1]).toHaveTextContent(S.compare.allSame(2));
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
      const shared = container.querySelector('[data-return-bits="shared"]')!;
      const bits = [...shared.querySelectorAll(".al-bit")].map((bit) => bit.textContent).join("");
      expect(bits).toBe(bitsOf(wValue(result.final, 0)));
      expect(shared.querySelectorAll(".al-bit-group")).toHaveLength(4);
      expect(side.querySelectorAll(".al-bit")).toHaveLength(0);
      expect(side).toHaveTextContent(i === 0 ? "trip_remaining" : "trip_remaining_u");
      expect(side).toHaveTextContent(i === 0 ? C.signedType : C.unsignedType);
      const reading = i === 0 ? wValueAsInt(result.final, 0) : wValue(result.final, 0);
      expect(side.querySelector("[data-return-value]")).toHaveAttribute(
        "data-return-value",
        String(reading),
      );
      expect(side.querySelector("[data-return-value]")).toHaveTextContent(
        C.distanceValue(reading.toLocaleString("en-GB").replace("-", "−")),
      );
      expect(side.querySelectorAll("[data-return-reading]")).toHaveLength(1);
    }
    const bridge = container.querySelector("[data-return-explanation]") as HTMLElement;
    const word = wValue(models[0]!.final, 0);
    const lower = word % 2 ** 31;
    const top = Math.floor(word / 2 ** 31);
    expect(container.querySelectorAll("[data-return-bits]")).toHaveLength(1);
    expect(container.querySelectorAll(".al-bit")).toHaveLength(32);
    expect(bridge).toHaveTextContent(C.noArithmeticError);
    expect(bridge).toHaveTextContent(C.readingTypes);
    expect(bridge).toHaveTextContent(C.topWeightDiffers);
    const decimal = (n: number) => n.toLocaleString("en-GB").replace("-", "−");
    const cells = (row: string) =>
      [...bridge.querySelectorAll(`[data-weight-row="${row}"] td`)].map((cell) => cell.textContent);
    expect(cells("lower")).toEqual([decimal(lower)]);
    expect(cells("top-bit")).toEqual([String(top)]);
    expect(cells("top-contribution")).toEqual(
      top ? [decimal(-(2 ** 31)), `+${decimal(2 ** 31)}`] : ["0", "0"],
    );
    expect(cells("total")).toEqual([decimal(wValueAsInt(models[0]!.final, 0)), decimal(word)]);
    if (args[0]! < args[1]!) {
      expect(container.querySelector('[data-call-side="left"]')).toHaveTextContent(
        C.signedMeaning(decimal(Math.abs(wValueAsInt(models[0]!.final, 0)))),
      );
      expect(container.querySelector('[data-call-side="left"]')).toHaveTextContent(C.signedRange);
      expect(container.querySelector('[data-call-side="right"]')).toHaveTextContent(
        C.unsignedMeaning,
      );
      expect(cells("top-weight")).toHaveLength(0);
    } else {
      expect(container.querySelector("[data-trip-overrun]")).toBeNull();
      expect(container).not.toHaveTextContent(C.unsignedMeaning);
      expect(cells("top-weight")).toEqual([decimal(-(2 ** 31)), `+${decimal(2 ** 31)}`]);
    }
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
    expect(
      [...restored.container.querySelectorAll('[data-weight-row="total"] td')].map(
        (cell) => cell.textContent,
      ),
    ).toEqual(["5", "5"]);
    expect(
      [...restored.container.querySelectorAll('[data-weight-row="top-contribution"] td')].map(
        (cell) => cell.textContent,
      ),
    ).toEqual(["0", "0"]);
    expect(restored.container.querySelector("[data-return-explanation]")).not.toHaveTextContent(
      "2147483646",
    );
    expect(restored.container.querySelector("[data-trip-overrun]")).toBeNull();
    expect(restored.container).not.toHaveTextContent(C.unsignedMeaning);
    expect(
      within(screen.getByRole("group", { name: C.resultGroup })).getByText(C.sameBits),
    ).toBeInTheDocument();
  });

  it("keeps each function's signed value without claiming a change of weight sign for equal types", () => {
    const right = {
      ...TRIP_REMAINING,
      c: TRIP_REMAINING.c.replace("trip_remaining", "trip_remaining_copy"),
      listing: TRIP_REMAINING.listing.replace("trip_remaining:", "trip_remaining_copy:"),
    };
    const { container } = comparison([8, 2], undefined, true, right, "signed");
    predict();
    callBoth();
    expect(container.querySelectorAll("[data-return-bits]")).toHaveLength(1);
    for (const [i, program] of [TRIP_REMAINING, right].entries()) {
      const name = i === 0 ? "trip_remaining" : "trip_remaining_copy";
      const model = traceOf(program, { entry: name, args: [8, 2] }).result;
      const card = container.querySelector(`[data-call-result="${i}"]`)!;
      expect(card).toHaveTextContent(name);
      expect(card).toHaveTextContent(C.signedType);
      expect(card.querySelector('[data-return-reading="signed"]')).toHaveAttribute(
        "data-return-value",
        String(wValueAsInt(model.final, 0)),
      );
      expect(card).toHaveTextContent(
        C.distanceValue(wValueAsInt(model.final, 0).toLocaleString("en-GB")),
      );
    }
    const explanation = container.querySelector("[data-return-explanation]")!;
    expect(explanation).toHaveTextContent(C.bitWeights);
    expect(explanation).not.toHaveTextContent(C.topWeightDiffers);
    expect(
      [...explanation.querySelectorAll('[data-weight-row="total"] td')].map(
        (cell) => cell.textContent,
      ),
    ).toEqual(["6", "6"]);
  });

  it("shows two independently computed bit words when the model results differ", () => {
    const right = {
      ...TRIP_REMAINING_U,
      listing: "trip_remaining_u:\n  add w0, w0, w1 C3\n  ret C3",
    };
    const { container } = comparison([3, 5], undefined, true, right);
    predict();
    callBoth();
    expect(container.querySelector('[data-return-bits="shared"]')).toBeNull();
    expect(container.querySelectorAll("[data-return-bits]")).toHaveLength(2);
    for (const [i, program] of [TRIP_REMAINING, right].entries()) {
      const result = traceOf(program, {
        entry: i === 0 ? "trip_remaining" : "trip_remaining_u",
        args: [3, 5],
      }).result;
      const side = container.querySelector(`[data-call-result="${i}"]`)!;
      expect([...side.querySelectorAll(".al-bit")].map((bit) => bit.textContent).join("")).toBe(
        bitsOf(wValue(result.final, 0)),
      );
    }
    expect(container.querySelector('[data-same-bits="false"]')).toHaveTextContent(C.differentBits);
    expect(container.querySelector("[data-return-explanation]")).toBeNull();
    expect(container.querySelector("[data-trip-overrun]")).toBeNull();
    expect(container).not.toHaveTextContent(C.unsignedMeaning);
  });

  it("retains a separate fault result instead of sharing a successful call's bits", () => {
    const right = {
      ...TRIP_REMAINING_U,
      listing: "trip_remaining_u:\n  sub w0, w0, w1 C3",
      sourceLines: [[3]],
    };
    const { container } = comparison([3, 5], undefined, true, right);
    predict();
    callBoth();
    expect(container.querySelectorAll("[data-call-result]")).toHaveLength(2);
    expect(container.querySelector('[data-return-bits="shared"]')).toBeNull();
    expect(container.querySelectorAll("[data-return-bits]")).toHaveLength(1);
    expect(container.querySelector('[data-call-side="right"]')).toHaveTextContent(
      S.prediction.endedWithError,
    );
    expect(container.querySelector('[data-call-side="right"] [data-return-value]')).toBeNull();
    expect(container.querySelector("[data-same-bits]")).toBeNull();
    expect(container.querySelector("[data-return-explanation]")).toBeNull();
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
    expect(screen.getByRole("button", { name: C.callBoth })).toBeDisabled();
  });
});
