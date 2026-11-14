// Copyright © 2026 Christopher Snow
// @vitest-environment jsdom

import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { CalculatorWorkspace } from "./CalculatorWorkspace";
import { CALCULATOR_CARRIES as F } from "./strings.calculator-carries";
import { CALCULATOR_WORKSPACE as C } from "./strings.calculator-workspace";
import { PROGRAMMER_CALCULATOR as S } from "./strings.programmer-calculator";

afterEach(() => {
  cleanup();
  sessionStorage.clear();
  vi.restoreAllMocks();
});
const setup = () => render(<CalculatorWorkspace handoffKey="carries" />);
function calculate(view: ReturnType<typeof setup>, a: string, b: string) {
  fireEvent.change(view.getByLabelText(S.entry), { target: { value: a } });
  fireEvent.click(view.getByRole("button", { name: S.apply }));
  fireEvent.change(view.getByLabelText(S.second), { target: { value: b } });
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
  expect(view.queryByText(C.calculateHint)).toBeNull();
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
  expect(view.getByText(F.overflowHelp)).toBeVisible();
  expect(view.container.textContent!.indexOf(F.overflowHelp)).toBeLessThan(
    view.container.textContent!.indexOf(F.vLabel),
  );
  expect(view.container.textContent!.indexOf(F.xorHelp)).toBeLessThan(
    view.container.textContent!.indexOf(F.vEquation(1, 0, 1)),
  );
  fireEvent.click(view.getByRole("button", { name: F.showCarries }));
  expect(view.container.querySelector('[data-row="carry"]')).toBeNull();
  expect(
    view.getByRole("group", { name: C.retainedResult }).querySelector("[data-pattern]"),
  ).toHaveAttribute("data-pattern", "2147483648");
});

it("clears stale carry values when applied inputs change but keeps an unapplied A draft separate", () => {
  const view = setup();
  fireEvent.click(view.getByRole("button", { name: F.showCarries }));
  calculate(view, "0x7ffffffe", "2");
  fireEvent.change(view.getByLabelText(S.entry), { target: { value: "0x1" } });
  expect(view.getByText(F.vEquation(1, 0, 1))).toBeVisible();
  fireEvent.change(view.getByLabelText(S.second), { target: { value: "1" } });
  expect(view.container.querySelector("[data-flag]")).toBeNull();
  expect(view.getByText(F.unknown)).toBeVisible();
  fireEvent.click(view.getByRole("button", { name: S.calculate }));
  expect(view.getByText(F.vEquation(0, 0, 0))).toBeVisible();
  fireEvent.click(view.getByRole("button", { name: S.apply }));
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

it("keeps carries exclusive to Add and resets the preference with the workspace", () => {
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
    expect(view.container.querySelector("[data-flag]")).toBeNull();
  }
  fireEvent.change(view.getByRole("combobox", { name: S.operation }), { target: { value: "add" } });
  expect(view.getByRole("button", { name: F.showCarries })).toHaveAttribute("aria-pressed", "true");
  expect(view.getByText(F.unknown)).toBeVisible();
  fireEvent.click(view.getByRole("button", { name: S.reset }));
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
  expect(next.getByRole("button", { name: F.showCarries })).toHaveAttribute("aria-pressed", "true");
  expect(next.getByText(F.vEquation(1, 0, 1))).toBeVisible();
  expect(next.container.querySelector("[data-carry-into-sign]")).toHaveTextContent("1");
  expect(next.container.querySelector("[data-carry-out]")).toHaveTextContent("0");
  expect(sessionStorage.getItem("assembly-lab:update:views:v1")).toBeNull();
});
