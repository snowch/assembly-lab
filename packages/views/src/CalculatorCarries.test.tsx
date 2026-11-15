// Copyright © 2026 Christopher Snow
// @vitest-environment jsdom

import { cleanup, fireEvent, render, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { CalculatorWorkspace } from "./CalculatorWorkspace";
import { CALCULATOR_CARRIES as F } from "./strings.calculator-carries";
import { CALCULATOR_WORKSPACE as C } from "./strings.calculator-workspace";
import { PROGRAMMER_CALCULATOR as S } from "./strings.programmer-calculator";
import { COMPACT_CALCULATOR as D } from "./strings.compact-calculator";

afterEach(() => {
  cleanup();
  sessionStorage.clear();
  vi.restoreAllMocks();
});
function openInspection(view: ReturnType<typeof render>) {
  const details = view.container.querySelector<HTMLDetailsElement>(".workspace-inspection")!;
  details.open = true;
  fireEvent(details, new Event("toggle", { bubbles: true }));
}
const setup = () => {
  const view = render(<CalculatorWorkspace handoffKey="carries" />);
  openInspection(view);
  return view;
};
function calculate(view: ReturnType<typeof setup>, a: string, b: string) {
  fireEvent.change(view.getByRole("textbox", { name: C.currentA }), { target: { value: a } });
  fireEvent.change(view.getByRole("textbox", { name: C.currentB }), { target: { value: b } });
  fireEvent.click(view.getByRole("button", { name: S.calculate }));
}

it("starts off, points to the real comparison, and shows unknown carries until Calculate", () => {
  const view = setup();
  const toggle = view.getByRole("button", { name: F.showCarries });
  expect(toggle).toHaveAttribute("aria-pressed", "false");
  expect(document.getElementById(toggle.getAttribute("aria-controls")!)).toHaveAttribute(
    "role",
    "region",
  );
  expect(view.container.querySelector('[data-row="carry"]')).toBeNull();
  fireEvent.click(toggle);
  expect(toggle).toHaveAttribute("aria-pressed", "true");
  expect(view.getByText(F.unknown)).toBeVisible();
  expect(view.getByText(D.emptyResult)).toBeVisible();
  expect(view.container.querySelectorAll("[data-flag]")).toHaveLength(0);
  expect(view.getByRole("img", { name: `${F.carryIn}: ${C.unknownResult}` })).toBeVisible();
  fireEvent.click(view.getByRole("button", { name: S.calculate }));
  expect(view.getByRole("img", { name: F.rowDescription("0".repeat(32), 32) })).toBeVisible();
  expect(view.getByText(F.vEquation(0, 0, 0))).toBeVisible();
});

it("shows the user's actual carry columns, sign-bit ports and distinct C/V results", () => {
  const view = setup();
  calculate(view, "0x7ffffffe", "0x2");
  fireEvent.click(view.getByRole("button", { name: F.showCarries }));
  expect(
    view.getByRole("img", { name: F.rowDescription("1".repeat(30) + "00", 32) }),
  ).toBeVisible();
  expect(view.container.querySelector('[data-row="carry"] [data-bit="31"]')).toHaveTextContent("1");
  expect(view.container.querySelector('[data-row="carry"] [data-bit="0"]')).toHaveTextContent("0");
  expect(view.container.querySelector("[data-carry-into-sign]")).toHaveTextContent("1");
  expect(view.container.querySelector("[data-carry-out]")).toHaveTextContent("0");
  expect(view.getByText(F.cEquation(0))).toBeVisible();
  expect(view.getByText(F.vEquation(1, 0, 1))).toBeVisible();
  expect(view.getByText(F.different)).toBeVisible();
  expect(view.getAllByText(F.xorHelp)).toHaveLength(1);
  expect(view.getByText(D.flagsHelp)).toBeVisible();
  expect(view.getByText(D.vLabel)).toBeVisible();
  const detail = view.container.querySelector<HTMLElement>(".workspace-carry-details")!;
  expect(within(detail).getByText(F.overflowHelp)).toBeVisible();
  expect(detail.textContent!.indexOf(F.overflowHelp)).toBeLessThan(
    detail.textContent!.indexOf(F.vEquation(1, 0, 1)),
  );
  expect(detail.textContent!.indexOf(F.xorHelp)).toBeLessThan(
    detail.textContent!.indexOf(F.vEquation(1, 0, 1)),
  );
  fireEvent.click(view.getByRole("button", { name: F.showCarries }));
  expect(view.container.querySelector('[data-row="carry"]')).toBeNull();
  expect(
    view.getByRole("group", { name: C.retainedResult }).querySelector("[data-pattern]"),
  ).toHaveAttribute("data-pattern", "2147483648");
});

it("clears stale carry values as soon as either current input changes", () => {
  const view = setup();
  fireEvent.click(view.getByRole("button", { name: F.showCarries }));
  calculate(view, "0x7ffffffe", "2");
  fireEvent.change(view.getByRole("textbox", { name: C.currentA }), { target: { value: "0x1" } });
  expect(view.container.querySelector("[data-flag]")).toBeNull();
  fireEvent.change(view.getByRole("textbox", { name: C.currentB }), { target: { value: "1" } });
  expect(view.container.querySelector("[data-flag]")).toBeNull();
  expect(view.getByText(F.unknown)).toBeVisible();
  fireEvent.click(view.getByRole("button", { name: S.calculate }));
  expect(view.getByText(F.vEquation(0, 0, 0))).toBeVisible();
  fireEvent.change(view.getByRole("textbox", { name: C.currentA }), {
    target: { value: "invalid" },
  });
  expect(view.container.querySelector("[data-flag]")).toBeNull();
  expect(view.getByText(F.unknown)).toBeVisible();
});

it("covers every top carry pair at both widths, independent of selected reading", () => {
  const view = setup();
  fireEvent.click(view.getByRole("button", { name: F.showCarries }));
  for (const width of [32, 64] as const) {
    fireEvent.click(view.getByRole("button", { name: S.widthValue(width) }));
    const high = 1n << BigInt(width - 1);
    const mask = 2n ** BigInt(width) - 1n;
    for (const [a, b, into, out, c, v] of [
      [0n, 1n, 0, 0, 0, 0],
      [high, high, 0, 1, 1, 1],
      [high - 2n, 2n, 1, 0, 0, 1],
      [mask, 1n, 1, 1, 1, 0],
    ] as const) {
      for (const reading of [S.unsigned, S.signed]) {
        fireEvent.click(view.getByRole("button", { name: reading }));
        calculate(view, "0x" + a.toString(16), "0x" + b.toString(16));
        expect(view.container.querySelector("[data-carry-into-sign]")).toHaveTextContent(
          String(into),
        );
        expect(view.container.querySelector("[data-carry-out]")).toHaveTextContent(String(out));
        expect(view.container.querySelector('[data-flag="c"]')).toHaveAttribute(
          "data-value",
          String(c),
        );
        expect(view.container.querySelector('[data-flag="v"]')).toHaveAttribute(
          "data-value",
          String(v),
        );
        expect(view.getByText(F.vEquation(into, out, v))).toBeVisible();
      }
    }
  }
});

it("keeps carry columns exclusive to Add, gives Subtract arithmetic flags and resets preferences", () => {
  const view = setup();
  fireEvent.click(view.getByRole("button", { name: F.showCarries }));
  calculate(view, "0xFFFFFFFF", "1");
  for (const operation of ["subtract", "shift-left"]) {
    fireEvent.change(view.getByRole("combobox", { name: S.operation }), {
      target: { value: operation },
    });
    expect(view.queryByRole("button", { name: F.showCarries })).toBeNull();
    expect(view.container.querySelector('[data-row="carry"]')).toBeNull();
    expect(view.container.querySelector("[data-flag]")).toBeNull();
    fireEvent.click(view.getByRole("button", { name: S.calculate }));
    if (operation === "subtract") {
      expect(view.container.querySelectorAll("[data-flag]")).toHaveLength(4);
      expect(view.container.querySelector('[data-flag="c"]')).toHaveAttribute("data-value", "1");
      expect(view.container.querySelector('[data-flag="v"]')).toHaveAttribute("data-value", "0");
      expect(view.getByText(D.cSubLabel)).toBeVisible();
      expect(view.container.querySelector(".workspace-carry-details")).toBeNull();
    } else expect(view.container.querySelector("[data-flag]")).toBeNull();
  }
  fireEvent.change(view.getByRole("combobox", { name: S.operation }), { target: { value: "add" } });
  expect(view.getByRole("button", { name: F.showCarries })).toHaveAttribute("aria-pressed", "true");
  expect(view.getByText(F.unknown)).toBeVisible();
  fireEvent.click(view.getByRole("button", { name: S.reset }));
  expect(view.container.querySelector(".workspace-inspection")).not.toHaveAttribute("open");
  openInspection(view);
  expect(view.getByRole("button", { name: F.showCarries })).toHaveAttribute(
    "aria-pressed",
    "false",
  );
  expect(view.container.querySelector('[data-row="carry"]')).toBeNull();
});

it("preserves carry visibility and recomputes its values through a coordinated update", async () => {
  vi.resetModules();
  const handoff = await import("./update-handoff");
  const { CalculatorWorkspace: Original } = await import("./CalculatorWorkspace");
  const view = render(
    <handoff.ViewHandoffScope id="header-calculator">
      <Original handoffKey="global" />
    </handoff.ViewHandoffScope>,
  );
  openInspection(view);
  calculate(view, "0x7ffffffe", "2");
  fireEvent.click(view.getByRole("button", { name: F.showCarries }));
  expect(handoff.prepareViewHandoff()).toBe(true);
  view.unmount();
  vi.resetModules();
  const nextHandoff = await import("./update-handoff");
  const { CalculatorWorkspace: Restored } = await import("./CalculatorWorkspace");
  const next = render(
    <nextHandoff.ViewHandoffScope id="header-calculator">
      <Restored handoffKey="global" />
    </nextHandoff.ViewHandoffScope>,
  );
  expect(next.container.querySelector(".workspace-inspection")).toHaveAttribute("open");
  expect(next.getByRole("button", { name: F.showCarries })).toHaveAttribute("aria-pressed", "true");
  expect(next.getByText(F.vEquation(1, 0, 1))).toBeVisible();
  expect(next.container.querySelector("[data-carry-into-sign]")).toHaveTextContent("1");
  expect(next.container.querySelector("[data-carry-out]")).toHaveTextContent("0");
  expect(sessionStorage.getItem("assembly-lab:update:views:v1")).toBeNull();
});
