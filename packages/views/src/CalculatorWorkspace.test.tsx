// Copyright © 2026 Christopher Snow
// @vitest-environment jsdom

import { cleanup, fireEvent, render, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { CalculatorWorkspace } from "./CalculatorWorkspace";
import { COMPACT_CALCULATOR as D } from "./strings.compact-calculator";
import { CALCULATOR_ENTRY as E } from "./strings.calculator-entry";
import { CALCULATOR_WORKSPACE as C } from "./strings.calculator-workspace";
import { PROGRAMMER_CALCULATOR as S } from "./strings.programmer-calculator";

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
  const view = render(<CalculatorWorkspace handoffKey="test" />);
  openInspection(view);
  return view;
};
function enterA(view: ReturnType<typeof setup>, value: string) {
  fireEvent.change(view.getByRole("textbox", { name: C.currentA }), { target: { value } });
}
function valueA(view: ReturnType<typeof setup>) {
  return (
    view
      .getByRole("group", { name: C.currentA })
      .querySelector("[data-pattern]")
      ?.getAttribute("data-pattern") ?? null
  );
}

it("preserves both operands, shows unknown output until Calculate, and explicitly chains a result", () => {
  const view = setup();
  expect(view.queryByRole("tab")).toBeNull();
  expect(view.getAllByRole("button", { name: S.calculate })).toHaveLength(1);
  expect(view.getByRole("img", { name: `${C.result}: ${C.unknownResult}` })).toBeInTheDocument();
  enterA(view, "4294967295");
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

it("previews both operands live, invalidates output on either edit, and calculates only valid drafts", () => {
  const view = setup();
  expect(view.queryByRole("button", { name: S.apply })).toBeNull();
  enterA(view, "7");
  expect(valueA(view)).toBe("7");
  fireEvent.click(view.getByRole("button", { name: S.calculate }));
  fireEvent.change(view.getByRole("textbox", { name: C.currentA }), {
    target: { value: "unfinished" },
  });
  expect(valueA(view)).toBeNull();
  expect(view.queryByRole("group", { name: C.retainedResult })).toBeNull();
  fireEvent.change(view.getByRole("textbox", { name: C.currentB }), { target: { value: "2" } });
  expect(
    view.getByRole("group", { name: C.currentB }).querySelector("[data-pattern]"),
  ).toHaveAttribute("data-pattern", "2");
  fireEvent.click(view.getByRole("button", { name: S.calculate }));
  expect(view.getByRole("textbox", { name: C.currentA })).toHaveAttribute("aria-invalid", "true");
  expect(view.queryByRole("group", { name: C.retainedResult })).toBeNull();
  enterA(view, "7");
  fireEvent.keyDown(view.getByRole("textbox", { name: C.currentA }), { key: "Enter" });
  expect(
    view.getByRole("group", { name: C.retainedResult }).querySelector("[data-pattern]"),
  ).toHaveAttribute("data-pattern", "9");
  fireEvent.change(view.getByRole("textbox", { name: C.currentB }), { target: { value: "" } });
  expect(view.getByRole("group", { name: C.currentB })).toHaveTextContent(C.unknownPreview);
  expect(view.queryByRole("group", { name: C.retainedResult })).toBeNull();
});

it("keeps readings as interpretations and widens with zeros at full 64-bit precision", () => {
  const view = setup();
  enterA(view, "4294967295");
  fireEvent.click(view.getByRole("button", { name: S.signed }));
  expect(valueA(view)).toBe("4294967295");
  expect(view.getByRole("group", { name: C.currentA })).toHaveTextContent("-1");
  fireEvent.click(view.getByRole("button", { name: "64 bits" }));
  expect(view.getByRole("group", { name: C.currentA })).toHaveTextContent("4,294,967,295");
  fireEvent.click(view.getByRole("button", { name: S.unsigned }));
  enterA(view, "18,446,744,073,709,551,615");
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
  enterA(view, "1");
  fireEvent.change(view.getByLabelText(C.shiftAmountDecimal), { target: { value: "31" } });
  fireEvent.keyDown(view.getByLabelText(C.shiftAmountDecimal), { key: "Enter" });
  expect(
    view.getByRole("group", { name: C.retainedResult }).querySelector("[data-pattern]"),
  ).toHaveAttribute("data-pattern", "2147483648");
  expect(valueA(view)).toBe("1");
  expect(view.container.querySelector(".workspace-exact")).toHaveTextContent(
    D.exactLabel("shift-left", "unsigned"),
  );
});

it("moves bit editing and half replacement out of the calculation and retains their exact behaviour", () => {
  const view = setup();
  expect(view.queryByRole("button", { name: S.bit(0) })).toBeNull();
  openInspection(view);
  fireEvent.click(view.getByRole("button", { name: D.editBits }));
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
  expect(view.container.querySelector(".workspace-inspection")).not.toHaveAttribute("open");
});

it("does not silently truncate input or compute invalid operands, and associates errors locally", () => {
  const view = setup();
  enterA(view, "4294967296");
  fireEvent.click(view.getByRole("button", { name: S.calculate }));
  const entry = view.getByRole("textbox", { name: C.currentA });
  expect(entry).toHaveAttribute("aria-invalid", "true");
  expect(document.getElementById(entry.getAttribute("aria-errormessage")!)).toHaveTextContent(
    E.decimalRangeError("0", "4,294,967,295"),
  );
  expect(valueA(view)).toBeNull();
  enterA(view, "0");
  fireEvent.change(view.getByRole("textbox", { name: C.currentB }), { target: { value: "-1" } });
  fireEvent.click(view.getByRole("button", { name: S.calculate }));
  expect(view.getByRole("textbox", { name: C.currentB })).toHaveAttribute("aria-invalid", "true");
  expect(view.queryByRole("group", { name: C.retainedResult })).toBeNull();
});

it("unmounts all closed controls while retaining the view, exact value and pending input", () => {
  const renderTool = (active: boolean) => (
    <CalculatorWorkspace handoffKey="close" active={active} />
  );
  const view = render(renderTool(true));
  enterA(view, "123");
  fireEvent.change(view.getByRole("textbox", { name: C.currentA }), { target: { value: "456" } });
  openInspection(view);
  fireEvent.click(view.getByRole("button", { name: D.editBits }));
  view.rerender(renderTool(false));
  expect(view.container).toBeEmptyDOMElement();
  view.rerender(renderTool(true));
  expect(valueA(view)).toBe("456");
  expect(view.getByRole("textbox", { name: C.currentA })).toHaveValue("456");
  expect(view.getByRole("button", { name: D.finishEditing })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
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
  expect(valueA(next)).toBeNull();
  expect(next.getByRole("textbox", { name: C.currentA })).toHaveValue("pending A");
  expect(next.getByRole("textbox", { name: C.currentB })).toHaveValue("17");
  expect(sessionStorage.getItem("assembly-lab:update:views:v1")).toBeNull();
  fireEvent.click(next.getByRole("button", { name: S.calculate }));
  expect(next.queryByRole("group", { name: C.retainedResult })).toBeNull();
  enterA(next, "4294967295");
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
  expect(third.getByRole("textbox", { name: C.currentA })).toHaveValue("4294967295");
  expect(third.container.querySelector(".workspace-exact")).toHaveTextContent("4,294,967,312");
  expect(
    third.getByRole("group", { name: C.retainedResult }).querySelector("[data-pattern]"),
  ).toHaveAttribute("data-pattern", "16");
});

it("uses prefixes for both operands and keeps width stable when a paste does not fit", () => {
  const view = setup();
  expect(view.queryByLabelText(S.format)).toBeNull();
  expect(view.queryByLabelText(C.operandFormat)).toBeNull();
  enterA(view, "0x7ffffffe");
  expect(valueA(view)).toBe("2147483646");
  fireEvent.change(view.getByRole("textbox", { name: C.currentB }), { target: { value: "0b10" } });
  fireEvent.click(view.getByRole("button", { name: S.calculate }));
  expect(
    view.getByRole("group", { name: C.retainedResult }).querySelector("[data-pattern]"),
  ).toHaveAttribute("data-pattern", "2147483648");
  enterA(view, "0xFFFFFFFFFFFFFFFF");
  fireEvent.click(view.getByRole("button", { name: S.calculate }));
  expect(valueA(view)).toBeNull();
  expect(view.getByRole("button", { name: S.widthValue(32) })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(view.getByText(E.patternRangeError(32))).toBeVisible();
  fireEvent.click(view.getByRole("button", { name: S.widthValue(64) }));
  expect(view.getByRole("textbox", { name: C.currentA })).toHaveValue("0xFFFFFFFFFFFFFFFF");
  expect(valueA(view)).toBe("18446744073709551615");
  fireEvent.click(view.getByRole("button", { name: S.widthValue(32) }));
  expect(valueA(view)).toBe("4294967295");
  expect(view.getByRole("textbox", { name: C.currentA })).toHaveValue("0xffffffff");
  enterA(view, "0x00000000FFFFFFFF");
  expect(valueA(view)).toBe("4294967295");
});

it("zero-fills short signed patterns, retains binary text, and reports malformed notation locally", () => {
  const view = setup();
  fireEvent.click(view.getByRole("button", { name: S.widthValue(64) }));
  fireEvent.click(view.getByRole("button", { name: S.signed }));
  enterA(view, "0b" + "1".repeat(32));
  expect(valueA(view)).toBe("4294967295");
  expect(view.getByRole("group", { name: C.currentA })).toHaveTextContent("4,294,967,295");
  enterA(view, "-1");
  expect(valueA(view)).toBe("18446744073709551615");
  enterA(view, "0b102");
  fireEvent.click(view.getByRole("button", { name: S.calculate }));
  expect(view.getByText(E.binaryError)).toBeVisible();
  enterA(view, "FFFF");
  fireEvent.click(view.getByRole("button", { name: S.calculate }));
  expect(view.getByText(E.notationError)).toBeVisible();
  enterA(view, "1010");
  expect(valueA(view)).toBe("1010");
});

it("edits the current A after a width or reading change makes an invalid draft valid", () => {
  const view = setup();
  enterA(view, "0x100000000");
  expect(valueA(view)).toBeNull();
  openInspection(view);
  fireEvent.click(view.getByRole("button", { name: D.editBits }));
  expect(view.queryByRole("button", { name: S.bit(0) })).toBeNull();
  expect(view.getByText(C.editUnavailable)).toBeVisible();
  fireEvent.click(view.getByRole("button", { name: S.widthValue(64) }));
  expect(view.getByRole("button", { name: S.bit(32) })).toHaveAttribute("aria-pressed", "true");
  fireEvent.click(view.getByRole("button", { name: S.bit(0) }));
  expect(valueA(view)).toBe("4294967297");
  expect(view.getByRole("textbox", { name: C.currentA })).toHaveValue("4294967297");
  enterA(view, "-1");
  expect(valueA(view)).toBeNull();
  fireEvent.click(view.getByRole("button", { name: S.signed }));
  expect(view.getByRole("button", { name: S.bit(63) })).toHaveAttribute("aria-pressed", "true");
  fireEvent.click(view.getByRole("button", { name: S.bit(0) }));
  expect(view.getByRole("textbox", { name: C.currentA })).toHaveValue("-2");
});
