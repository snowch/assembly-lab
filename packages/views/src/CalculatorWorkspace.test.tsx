// Copyright © 2026 Christopher Snow
// @vitest-environment jsdom

import { cleanup, fireEvent, render, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { CalculatorWorkspace } from "./CalculatorWorkspace";
import { CALCULATOR_WORKSPACE as C } from "./strings.calculator-workspace";
import { PROGRAMMER_CALCULATOR as S } from "./strings.programmer-calculator";

afterEach(() => {
  cleanup();
  sessionStorage.clear();
  vi.restoreAllMocks();
});
const setup = () => render(<CalculatorWorkspace handoffKey="test" />);
function apply(view: ReturnType<typeof setup>, value: string) {
  fireEvent.change(view.getByLabelText(S.entry), { target: { value } });
  fireEvent.click(view.getByRole("button", { name: S.apply }));
}
function valueA(view: ReturnType<typeof setup>) {
  return within(view.getByRole("group", { name: C.currentA }))
    .getByText(/0x/)
    .getAttribute("data-pattern");
}

it("preserves both operands, shows unknown output until Calculate, and explicitly chains a result", () => {
  const view = setup();
  expect(view.getByRole("tab", { name: C.calculateView })).toHaveAttribute("aria-selected", "true");
  expect(view.getAllByRole("tabpanel")).toHaveLength(1);
  expect(view.getByRole("img", { name: `${C.result}: ${C.unknownResult}` })).toBeInTheDocument();
  apply(view, "4294967295");
  fireEvent.click(view.getByRole("button", { name: S.calculate }));
  expect(valueA(view)).toBe("4294967295");
  expect(
    view.getByRole("img", { name: C.resultDescription("A", 32, "1".repeat(32)) }),
  ).toBeInTheDocument();
  expect(
    view.getByRole("img", { name: C.resultDescription("Result", 32, "0".repeat(32)) }),
  ).toBeInTheDocument();
  expect(view.container.querySelector(".workspace-exact")).toHaveTextContent("4,294,967,296");
  const result = view.getByRole("group", { name: C.retainedResult });
  expect(result.querySelector("[data-pattern]")).toHaveAttribute("data-pattern", "0");
  fireEvent.click(view.getByRole("button", { name: C.useResult }));
  expect(valueA(view)).toBe("0");
  expect(view.getByRole("img", { name: `${C.result}: ${C.unknownResult}` })).toBeInTheDocument();
});

it("invalidates a computed output when B changes, while pending A entry remains separate", () => {
  const view = setup();
  apply(view, "7");
  fireEvent.click(view.getByRole("button", { name: S.calculate }));
  fireEvent.change(view.getByLabelText(S.entry), { target: { value: "unfinished" } });
  expect(valueA(view)).toBe("7");
  expect(view.getByRole("group", { name: C.retainedResult })).toHaveTextContent("8");
  fireEvent.change(view.getByLabelText(S.second), { target: { value: "2" } });
  expect(view.queryByRole("group", { name: C.retainedResult })).toBeNull();
  fireEvent.click(view.getByRole("button", { name: S.calculate }));
  expect(
    view.getByRole("group", { name: C.retainedResult }).querySelector("[data-pattern]"),
  ).toHaveAttribute("data-pattern", "9");
  expect(view.getByLabelText(S.entry)).toHaveValue("unfinished");
});

it("keeps readings as interpretations and widens with zeros at full 64-bit precision", () => {
  const view = setup();
  apply(view, "4294967295");
  fireEvent.click(view.getByRole("button", { name: S.signed }));
  expect(valueA(view)).toBe("4294967295");
  expect(view.getByRole("group", { name: C.currentA })).toHaveTextContent(S.signedHelp);
  expect(view.getByRole("group", { name: C.currentA })).toHaveTextContent(S.hexHelp);
  expect(view.getByRole("group", { name: C.currentA })).toHaveTextContent("-1");
  fireEvent.click(view.getByRole("button", { name: "64 bits" }));
  expect(view.getByRole("group", { name: C.currentA })).toHaveTextContent("4,294,967,295");
  fireEvent.click(view.getByRole("button", { name: S.unsigned }));
  expect(view.getByRole("group", { name: C.currentA })).toHaveTextContent(S.unsignedHelp);
  apply(view, "18,446,744,073,709,551,615");
  fireEvent.click(view.getByRole("button", { name: S.calculate }));
  expect(valueA(view)).toBe("18446744073709551615");
  expect(view.container.querySelector(".workspace-exact")).toHaveTextContent(
    "18,446,744,073,709,551,616",
  );
  expect(
    view.getByRole("group", { name: C.retainedResult }).querySelector("[data-pattern]"),
  ).toHaveAttribute("data-pattern", "0");
});

it("uses one scroll region and gives shift a count instead of pretending B is another word", () => {
  const view = setup();
  expect(view.getAllByRole("region", { name: C.snapshotHeading })).toHaveLength(1);
  expect(view.container.querySelectorAll(".workspace-bitrow[data-row]")).toHaveLength(3);
  fireEvent.change(view.getByLabelText(S.operation), { target: { value: "shift-left" } });
  expect(view.queryByLabelText(S.second)).toBeNull();
  expect(view.container.querySelector('[data-row="b"]')).toBeNull();
  apply(view, "1");
  fireEvent.change(view.getByLabelText(C.shiftAmountDecimal), { target: { value: "31" } });
  fireEvent.keyDown(view.getByLabelText(C.shiftAmountDecimal), { key: "Enter" });
  expect(
    view.getByRole("group", { name: C.retainedResult }).querySelector("[data-pattern]"),
  ).toHaveAttribute("data-pattern", "2147483648");
  expect(valueA(view)).toBe("1");
  expect(view.container.querySelector(".workspace-exact")).toHaveTextContent(C.fullShiftResult);
});

it("moves bit editing and half replacement out of the calculation and retains their exact behaviour", () => {
  const view = setup();
  expect(view.queryByRole("button", { name: S.bit(0) })).toBeNull();
  fireEvent.click(view.getByRole("tab", { name: C.editView }));
  const editor = view.getByRole("group", { name: S.pattern });
  const bit = within(editor).getByRole("button", { name: S.bit(0) });
  bit.focus();
  fireEvent.keyDown(bit, { key: "ArrowLeft" });
  expect(within(editor).getByRole("button", { name: S.bit(1) })).toHaveFocus();
  fireEvent.click(bit);
  expect(valueA(view)).toBe("1");
  const halves = view.container.querySelector<HTMLDetailsElement>(".workspace-halves")!;
  expect(halves).not.toHaveAttribute("open");
  halves.open = true;
  fireEvent(halves, new Event("toggle", { bubbles: true }));
  fireEvent.change(view.getByLabelText(S.halfValue), { target: { value: "15" } });
  fireEvent.click(view.getByRole("button", { name: S.applyHalf }));
  expect(valueA(view)).toBe("983041");
  fireEvent.click(view.getByRole("button", { name: "64 bits" }));
  expect(view.queryByLabelText(S.halfValue)).toBeNull();
  fireEvent.click(view.getByRole("button", { name: S.reset }));
  expect(valueA(view)).toBe("0");
  expect(view.getByRole("tab", { name: C.calculateView })).toHaveAttribute("aria-selected", "true");
});

it("does not silently truncate input or compute invalid operands, and associates errors locally", () => {
  const view = setup();
  apply(view, "4294967296");
  const entry = view.getByLabelText(S.entry);
  expect(entry).toHaveAttribute("aria-invalid", "true");
  expect(document.getElementById(entry.getAttribute("aria-errormessage")!)).toHaveTextContent(
    S.errors.range,
  );
  expect(valueA(view)).toBe("0");
  fireEvent.change(view.getByLabelText(S.second), { target: { value: "-1" } });
  fireEvent.click(view.getByRole("button", { name: S.calculate }));
  expect(view.getByLabelText(S.second)).toHaveAttribute("aria-invalid", "true");
  expect(view.queryByRole("group", { name: C.retainedResult })).toBeNull();
});

it("unmounts all closed controls while retaining the view, exact value and pending input", () => {
  const renderTool = (active: boolean) => (
    <CalculatorWorkspace handoffKey="close" active={active} />
  );
  const view = render(renderTool(true));
  apply(view, "123");
  fireEvent.change(view.getByLabelText(S.entry), { target: { value: "456" } });
  fireEvent.click(view.getByRole("tab", { name: C.editView }));
  view.rerender(renderTool(false));
  expect(view.container).toBeEmptyDOMElement();
  view.rerender(renderTool(true));
  expect(valueA(view)).toBe("123");
  expect(view.getByLabelText(S.entry)).toHaveValue("456");
  expect(view.getByRole("tab", { name: C.editView })).toHaveAttribute("aria-selected", "true");
});

it("migrates pending work from the former header calculator during a coordinated update", async () => {
  vi.resetModules();
  const handoff = await import("./update-handoff");
  const { ProgrammerCalculator } = await import("./ProgrammerCalculator");
  const old = render(
    <handoff.ViewHandoffScope id="header-calculator">
      <ProgrammerCalculator preset="widths" handoffKey="global" presentation="tool" />
    </handoff.ViewHandoffScope>,
  );
  fireEvent.change(old.getByLabelText(S.entry), { target: { value: "4294967295" } });
  fireEvent.click(old.getByRole("button", { name: S.apply }));
  fireEvent.change(old.getByLabelText(S.entry), { target: { value: "pending A" } });
  fireEvent.change(old.getByLabelText(S.second), { target: { value: "17" } });
  expect(handoff.prepareViewHandoff()).toBe(true);
  old.unmount();
  vi.resetModules();
  const nextHandoff = await import("./update-handoff");
  const { CalculatorWorkspace: Restored } = await import("./CalculatorWorkspace");
  const next = render(
    <nextHandoff.ViewHandoffScope id="header-calculator">
      <Restored handoffKey="global" />
    </nextHandoff.ViewHandoffScope>,
  );
  expect(valueA(next)).toBe("4294967295");
  expect(next.getByLabelText(S.entry)).toHaveValue("pending A");
  expect(next.getByLabelText(S.second)).toHaveValue("17");
  expect(sessionStorage.getItem("assembly-lab:update:views:v1")).toBeNull();
  fireEvent.click(next.getByRole("button", { name: S.calculate }));
  expect(next.container.querySelector(".workspace-exact")).toHaveTextContent("4,294,967,312");
  expect(nextHandoff.prepareViewHandoff()).toBe(true);
  next.unmount();
  vi.resetModules();
  const thirdHandoff = await import("./update-handoff");
  const { CalculatorWorkspace: Third } = await import("./CalculatorWorkspace");
  const third = render(
    <thirdHandoff.ViewHandoffScope id="header-calculator">
      <Third handoffKey="global" />
    </thirdHandoff.ViewHandoffScope>,
  );
  expect(valueA(third)).toBe("4294967295");
  expect(third.getByLabelText(S.entry)).toHaveValue("pending A");
  expect(third.container.querySelector(".workspace-exact")).toHaveTextContent("4,294,967,312");
  expect(
    third.getByRole("group", { name: C.retainedResult }).querySelector("[data-pattern]"),
  ).toHaveAttribute("data-pattern", "16");
});
