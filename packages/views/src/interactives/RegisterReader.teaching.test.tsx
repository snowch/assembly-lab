// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { fireEvent, render } from "@testing-library/react";
import { expect, it } from "vitest";
import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";
import { RegisterReader } from "./RegisterReader";
import { readingsOfPattern, patternOf, shown } from "../readings";
import { READER_STRINGS as R } from "../strings.reader";
import { MODULE1_STRINGS as M1 } from "../strings.module1";

const start = {
  program: { c: "", listing: "read_bits:\n ret" },
  call: { entry: "read_bits", args: [1] },
};
const decimal = (n: number) => shown(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
function figure(props: Record<string, unknown> = {}) {
  return render(
    <RegisterReader
      lesson={{} as Lesson}
      store={new LessonStore(memoryStorage(), "assembly-lab", "teaching-test")}
      interactive={Interactive.parse({
        id: "reader",
        kind: "register-reader",
        timeModel: "steps",
        caption: "Bits",
        props: { register: "w0", teachingReadings: true, start, ...props },
      })}
    />,
  );
}

it("starts with bit 0, an unsigned total and visible numbered bit controls", () => {
  const view = figure();
  expect(view.getByRole("button", { name: R.views.unsigned })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(view.getByRole("button", { name: R.views.signed })).toBeVisible();
  expect(view.getByRole("button", { name: R.views.compare })).toBeVisible();
  expect(view.getByRole("button", { name: R.predictEntry })).toBeVisible();
  expect(view.container.querySelectorAll('.al-toggle[aria-pressed="true"]')).toHaveLength(1);
  expect(view.container.querySelector('.al-toggle[data-bit="0"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect([...view.container.querySelectorAll(".al-toggle-n")].map((n) => n.textContent)).toEqual(
    Array.from({ length: 32 }, (_, i) => String(31 - i)),
  );
  expect(view.container.querySelector('[data-reading="signed"]')).toBeNull();
  expect(view.container.querySelector('[data-reading="unsigned"]')).toHaveTextContent("1");
  expect(view.container.querySelector(".al-weight-strip")).toBeNull();
  expect(view.container.querySelector(".al-digit")).toBeNull();
  expect(view.container.querySelector('.al-toggle[data-bit="31"]')).toHaveAttribute(
    "data-top",
    "true",
  );
  expect(view.getByText(M1.toggles.topBit)).toBeVisible();
  expect(
    view.container.querySelector('[data-metric="weight"] [data-cell="unsigned"]'),
  ).toHaveTextContent("+1");
  expect(view.container.querySelector("details.al-calc")).not.toHaveAttribute("open");
});

it("offers a named top-bit preset, preserves bits on reading changes and distinguishes clear contribution from weight", () => {
  const view = figure();
  fireEvent.click(view.getByRole("button", { name: R.presetTop }));
  expect(view.getByRole("button", { name: R.views.unsigned })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(view.container.querySelectorAll('.al-toggle[aria-pressed="true"]')).toHaveLength(1);
  expect(view.container.querySelector('[data-reading="unsigned"]')).toHaveTextContent(
    "2,147,483,648",
  );
  expect(view.container.querySelector(".al-selected-bit")).toHaveTextContent("Choose Signed");
  fireEvent.click(view.getByRole("button", { name: R.views.signed }));
  expect(view.container.querySelector('.al-toggle[data-bit="31"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(view.container.querySelector('[data-reading="signed"]')).toHaveTextContent(
    "−2,147,483,648",
  );
  fireEvent.click(view.container.querySelector('.al-toggle[data-bit="31"]')!);
  expect(view.container.querySelector(".al-selected-bit")).toHaveAttribute(
    "data-selected-bit",
    "31",
  );
  expect(
    view.container.querySelector('[data-metric="weight"] [data-cell="signed"]'),
  ).toHaveTextContent("−2,147,483,648");
  expect(
    view.container.querySelector('[data-metric="contribution"] [data-cell="signed"]'),
  ).toHaveTextContent("0");
  expect(view.container.querySelector('[data-row="top"] [data-cell="signed"]')).toHaveTextContent(
    "0",
  );
  expect(view.container.querySelector(".al-selected-bit-note")).toHaveTextContent(R.clear);
  fireEvent.click(view.getByRole("button", { name: R.views.compare }));
  fireEvent.click(view.getByRole("button", { name: M1.reader.clearBits }));
  expect(view.getByRole("button", { name: R.views.compare })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  fireEvent.click(view.getByRole("button", { name: R.reset }));
  expect(view.getByRole("button", { name: R.views.unsigned })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(view.container.querySelector(".al-selected-bit")).toHaveAttribute(
    "data-selected-bit",
    "0",
  );
  expect(view.container.querySelectorAll('.al-toggle[aria-pressed="true"]')).toHaveLength(1);
  expect(view.container.querySelector('[data-reading="unsigned"]')).toHaveTextContent("1");
});

it("leaves hexadecimal-only and legacy scratch readers outside the teaching modes", () => {
  const hex = figure({ hexOnly: true });
  expect(hex.queryByRole("button", { name: R.views.unsigned })).toBeNull();
  expect(hex.container.querySelector(".al-digit")).not.toBeNull();
  hex.unmount();
  const scratch = figure({ teachingReadings: false, topBit: true, disclosure: "Scratch" });
  expect(scratch.queryByRole("button", { name: R.views.unsigned })).toBeNull();
  expect(scratch.container.querySelector(".al-reader-scratch")).not.toHaveAttribute("open");
  expect(scratch.container.querySelectorAll(".al-top-table [data-reading]")).toHaveLength(2);
});

it("teaches and expands only the selected reading while keeping bits unchanged", () => {
  const view = figure();
  const guidance = () => view.container.querySelector(".al-reader-guidance")!;
  const sums = () =>
    [...view.container.querySelectorAll("[data-sum]")].map((sum) => sum.getAttribute("data-sum"));
  expect(guidance()).not.toHaveTextContent(/two’s complement|negative/);
  expect(view.queryByRole("link", { name: R.appendix })).toBeNull();
  expect(sums()).toEqual(["unsigned"]);
  fireEvent.click(view.getByRole("button", { name: R.presetTop }));
  fireEvent.click(view.getByRole("button", { name: R.views.signed }));
  expect(guidance()).toHaveTextContent("two’s complement");
  expect(view.getByRole("link", { name: R.appendix })).toBeVisible();
  expect(sums()).toEqual(["signed"]);
  expect(view.container.querySelectorAll('.al-toggle[aria-pressed="true"]')).toHaveLength(1);
  fireEvent.click(view.getByRole("button", { name: R.views.compare }));
  expect(guidance()).toHaveTextContent("Both readings use the same bits");
  expect(sums()).toEqual(["unsigned", "signed"]);
  fireEvent.click(view.getByRole("button", { name: R.reset }));
  expect(sums()).toEqual(["unsigned"]);
  expect(guidance()).not.toHaveTextContent("two’s complement");
});

it("freezes the fixed prediction baseline and removes all result paths until a choice", () => {
  const view = figure();
  fireEvent.click(view.getByRole("button", { name: R.views.compare }));
  fireEvent.click(view.container.querySelector('.al-toggle[data-bit="4"]')!);
  fireEvent.click(view.getByRole("button", { name: R.predictEntry }));
  expect(view.container.querySelector(".al-teaching-reader")).toHaveAttribute(
    "data-prediction",
    "pending",
  );
  expect(view.getByText(R.prediction.starting)).toBeVisible();
  expect(view.container.querySelectorAll('.al-toggle[aria-pressed="true"]')).toHaveLength(1);
  expect(view.container.querySelector('.al-toggle[data-bit="31"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(view.container.querySelector('.al-toggle[data-bit="0"]')).toBeDisabled();
  for (const selector of [
    "[data-reading]",
    "[data-sum]",
    ".al-reader-guidance",
    ".al-selected-bit",
    ".al-prediction-results",
    ".al-prediction-feedback",
  ]) {
    expect(view.container.querySelector(selector)).toBeNull();
  }
  expect(view.queryByRole("button", { name: R.presetTop })).toBeNull();
  expect(view.queryByRole("button", { name: M1.reader.clearBits })).toBeNull();
  fireEvent.click(view.getByRole("button", { name: R.views.signed }));
  expect(view.container.querySelector(".al-teaching-reader")).not.toHaveAttribute(
    "data-prediction",
  );
  expect(view.container.querySelector('.al-toggle[data-bit="0"]')).not.toBeDisabled();
  expect(view.container.querySelector('[data-reading="signed"]')).toHaveTextContent(
    "−2,147,483,648",
  );
  expect(view.container.querySelector(".al-prediction-feedback")).toBeNull();
});

it.each(["unsigned", "signed", "both"] as const)(
  "computes prediction feedback and before/after results for %s, then explores the result",
  (choice) => {
    const view = figure();
    const before = readingsOfPattern(patternOf(1n << 31n));
    const after = readingsOfPattern(patternOf((1n << 31n) | 1n));
    const changedUnsigned = before.unsigned !== after.unsigned;
    const changedSigned = before.signed !== after.signed;
    const correct =
      choice === "both"
        ? changedUnsigned && changedSigned
        : choice === "unsigned"
          ? changedUnsigned && !changedSigned
          : changedSigned && !changedUnsigned;
    fireEvent.click(view.getByRole("button", { name: R.predictEntry }));
    fireEvent.click(view.getByRole("button", { name: R.prediction.choices[choice] }));
    expect(view.getByRole("status")).toHaveTextContent(
      correct ? R.prediction.correct : R.prediction.incorrect,
    );
    for (const [phase, model] of [
      ["before", before],
      ["after", after],
    ] as const) {
      for (const reading of ["unsigned", "signed"] as const)
        expect(
          view.container.querySelector(`[data-phase="${phase}"] [data-cell="${reading}"]`),
        ).toHaveTextContent(decimal(model[reading]));
    }
    expect(view.container.querySelector(".al-prediction-phase")).toHaveTextContent(
      R.prediction.after,
    );
    expect(view.container.querySelector('.al-toggle[data-bit="0"]')).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    fireEvent.click(view.getByRole("button", { name: R.prediction.explore }));
    expect(view.getByRole("button", { name: R.views.compare })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(view.container.querySelector('[data-reading="signed"]')).toHaveTextContent(
      decimal(after.signed),
    );
    fireEvent.click(view.getByRole("button", { name: M1.reader.clearBits }));
    expect(view.container.querySelector(".al-prediction-feedback")).toBeNull();
    fireEvent.click(view.getByRole("button", { name: R.predictEntry }));
    fireEvent.click(view.getByRole("button", { name: R.prediction.cancel }));
    expect(view.container.querySelectorAll('.al-toggle[aria-pressed="true"]')).toHaveLength(1);
    fireEvent.click(view.getByRole("button", { name: R.predictEntry }));
    fireEvent.click(view.getByRole("button", { name: R.reset }));
    expect(view.container.querySelector('[data-reading="unsigned"]')).toHaveTextContent("1");
    expect(view.container.querySelector(".al-prediction-feedback")).toBeNull();
  },
);

it.each(["signed", "compare"] as const)(
  "presets preserve the %s reading while replacing the bits",
  (reading) => {
    const view = figure();
    fireEvent.click(view.getByRole("button", { name: R.views[reading] }));
    for (const [preset, bit] of [
      [R.presetTop, 31],
      [R.presetBit0, 0],
    ] as const) {
      fireEvent.click(view.getByRole("button", { name: preset }));
      expect(view.getByRole("button", { name: R.views[reading] })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      expect(view.container.querySelectorAll('.al-toggle[aria-pressed="true"]')).toHaveLength(1);
      expect(view.container.querySelector(`.al-toggle[data-bit="${bit}"]`)).toHaveAttribute(
        "aria-pressed",
        "true",
      );
    }
  },
);
