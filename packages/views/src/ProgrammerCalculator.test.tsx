// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { cleanup, fireEvent, render, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { ProgrammerCalculator } from "./ProgrammerCalculator";
import {
  checkProgrammerGuide,
  programmerPresets,
  type ProgrammerPreset,
} from "./programmer-presets";
import { PROGRAMMER_CALCULATOR as S } from "./strings.programmer-calculator";

afterEach(() => {
  cleanup();
  sessionStorage.clear();
  vi.restoreAllMocks();
});

function toggle(details: HTMLDetailsElement, open = true) {
  details.open = open;
  fireEvent(details, new Event("toggle", { bubbles: true }));
}
function setup(preset: ProgrammerPreset) {
  const view = render(<ProgrammerCalculator preset={preset} handoffKey="test" />);
  toggle(view.container.querySelector("details")!);
  return view;
}
function guide(container: HTMLElement) {
  toggle(container.querySelector<HTMLDetailsElement>(".al-programmer-guide")!);
}
function pattern(container: HTMLElement) {
  return container.querySelector("[data-pattern]")!.getAttribute("data-pattern");
}

it("starts closed, has only the current preset's controls and gives each instance unique input IDs", () => {
  for (const preset of Object.keys(programmerPresets) as ProgrammerPreset[]) {
    const view = render(<ProgrammerCalculator preset={preset} handoffKey={preset} />);
    expect(view.container.querySelector("details")).not.toHaveAttribute("open");
    expect(view.queryByRole("textbox")).toBeNull();
    toggle(view.container.querySelector("details")!);
    expect(view.getByLabelText(S.entry)).toHaveValue("");
    expect(view.container.querySelectorAll("[data-bit]")).toHaveLength(
      programmerPresets[preset].width,
    );
    expect(!!view.queryByRole("group", { name: S.reading })).toBe(
      programmerPresets[preset].reading,
    );
    expect(!!view.queryByRole("group", { name: S.width })).toBe(programmerPresets[preset].resize);
    expect(!!view.queryByLabelText(S.second)).toBe(programmerPresets[preset].arithmetic);
    expect(!!view.queryByLabelText(S.halfValue)).toBe(programmerPresets[preset].halves);
    expect(view.getByRole("link", { name: S.full })).toHaveAttribute("rel", "noopener noreferrer");
    expect(view.getByRole("link", { name: S.full })).toHaveAccessibleDescription(S.newTab);
    view.unmount();
  }
  const view = render(
    <>
      <ProgrammerCalculator preset="readings" handoffKey="one" />
      <ProgrammerCalculator preset="readings" handoffKey="two" />
    </>,
  );
  view.container
    .querySelectorAll<HTMLDetailsElement>(".al-programmer-calculator")
    .forEach((details) => toggle(details));
  const entries = view.getAllByLabelText(S.entry);
  expect(entries[0]!.id).not.toBe(entries[1]!.id);
  fireEvent.click(
    within(view.container.querySelectorAll(".al-programmer-panel")[0] as HTMLElement).getByRole(
      "button",
      { name: S.clear },
    ),
  );
  expect(view.container.querySelectorAll("[data-pattern]")[1]).toHaveAttribute(
    "data-pattern",
    "4294967295",
  );
});

it("keeps exact 64-bit decimal and hex linked, and changes reading without changing bits", () => {
  const view = setup("widths");
  const entry = view.getByLabelText(S.entry);
  fireEvent.change(entry, { target: { value: "18,446,744,073,709,551,615" } });
  fireEvent.click(view.getByRole("button", { name: S.apply }));
  expect(pattern(view.container)).toBe("18446744073709551615");
  expect(view.container.querySelector("[data-reading]")).toHaveTextContent(
    "18,446,744,073,709,551,615",
  );
  expect(view.container.querySelector("[data-pattern]")).toHaveTextContent("0xFFFF FFFF FFFF FFFF");
  fireEvent.click(view.getByRole("button", { name: S.signed }));
  expect(pattern(view.container)).toBe("18446744073709551615");
  expect(view.container.querySelector("[data-reading]")).toHaveTextContent("-1");
  fireEvent.change(entry, { target: { value: "-9_223_372_036_854_775_808" } });
  fireEvent.keyDown(entry, { key: "Enter" });
  expect(pattern(view.container)).toBe("9223372036854775808");
  fireEvent.click(view.getByRole("button", { name: S.bit(0) }));
  expect(pattern(view.container)).toBe("9223372036854775809");
  expect(view.container.querySelector(".al-programmer-inspector")).toHaveTextContent(
    S.inspector(0, 1, "1", "1"),
  );
  fireEvent.change(view.getByLabelText(S.format), { target: { value: "hex" } });
  fireEvent.change(entry, { target: { value: "0xFFFF FFFF FFFF FFFF" } });
  fireEvent.click(view.getByRole("button", { name: S.apply }));
  expect(pattern(view.container)).toBe("18446744073709551615");
});

it("associates errors with the field that failed and never silently truncates entry", () => {
  const view = setup("arithmetic");
  const entry = view.getByLabelText(S.entry);
  const operand = view.getByLabelText(S.second);
  fireEvent.change(entry, { target: { value: "16" } });
  fireEvent.click(view.getByRole("button", { name: S.apply }));
  expect(pattern(view.container)).toBe("3");
  expect(entry).toHaveAttribute("aria-invalid", "true");
  expect(operand).not.toHaveAttribute("aria-invalid");
  expect(document.getElementById(entry.getAttribute("aria-errormessage")!)).toHaveTextContent(
    S.errors.range,
  );
  fireEvent.change(entry, { target: { value: "14" } });
  expect(entry).not.toHaveAttribute("aria-invalid");
  fireEvent.click(view.getByRole("button", { name: S.apply }));
  fireEvent.change(operand, { target: { value: "-1" } });
  fireEvent.click(view.getByRole("button", { name: S.calculate }));
  expect(operand).toHaveAttribute("aria-invalid", "true");
  expect(entry).not.toHaveAttribute("aria-invalid");
  expect(document.getElementById(operand.getAttribute("aria-errormessage")!)).toHaveTextContent(
    S.errors.range,
  );
  expect(pattern(view.container)).toBe("14");
});

it("retains four low bits of arithmetic and keeps every Enter inside a containing graded form", () => {
  const submit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
  const parentKey = vi.fn();
  const view = render(
    <form onSubmit={submit} onKeyDown={parentKey}>
      <ProgrammerCalculator preset="arithmetic" handoffKey="form" />
    </form>,
  );
  toggle(view.container.querySelector("details")!);
  expect(view.container.querySelectorAll("form")).toHaveLength(1);
  fireEvent.change(view.getByLabelText(S.entry), { target: { value: "14" } });
  fireEvent.keyDown(view.getByLabelText(S.entry), { key: "Enter" });
  fireEvent.change(view.getByLabelText(S.second), { target: { value: "5" } });
  fireEvent.keyDown(view.getByLabelText(S.second), { key: "Enter" });
  expect(pattern(view.container)).toBe("3");
  expect(view.getByText(S.fullResult + ":", { exact: false })).toHaveTextContent("19");
  expect(
    within(view.container.querySelector(".al-programmer-result") as HTMLElement).getByText(
      S.retained,
      { exact: false },
    ),
  ).toHaveTextContent("0011");
  fireEvent.change(view.getByLabelText(S.operation), { target: { value: "subtract" } });
  fireEvent.keyDown(view.getByLabelText(S.operation), { key: "Enter" });
  expect(pattern(view.container)).toBe("14");
  expect(view.getByText(S.fullResult + ":", { exact: false })).toHaveTextContent("-2");
  guide(view.container);
  fireEvent.change(view.getByLabelText(S.presets.arithmetic.labels[0]), {
    target: { value: "1001" },
  });
  fireEvent.keyDown(view.getByLabelText(S.presets.arithmetic.labels[0]), { key: "Enter" });
  expect(view.getByText(S.presets.arithmetic.success)).toBeVisible();
  expect(submit).not.toHaveBeenCalled();
  expect(parentKey).not.toHaveBeenCalled();
  expect(
    [...view.container.querySelectorAll("button")].every((button) => button.type === "button"),
  ).toBe(true);
});

it("edits only the chosen half, validates half/shift ranges, and shifts the calculator pattern", () => {
  const view = setup("halves");
  const half = view.getByLabelText(S.halfValue);
  const shift = view.getByLabelText(S.shiftAmount);
  fireEvent.change(half, { target: { value: "4" } });
  fireEvent.keyDown(half, { key: "Enter" });
  expect(pattern(view.container)).toBe("262147");
  fireEvent.change(view.getByLabelText(S.replaceHalf), { target: { value: "lower" } });
  fireEvent.change(half, { target: { value: "9" } });
  fireEvent.click(view.getByRole("button", { name: S.applyHalf }));
  expect(pattern(view.container)).toBe("262153");
  fireEvent.change(half, { target: { value: "65536" } });
  fireEvent.click(view.getByRole("button", { name: S.applyHalf }));
  expect(half).toHaveAttribute("aria-invalid", "true");
  expect(shift).not.toHaveAttribute("aria-invalid");
  expect(pattern(view.container)).toBe("262153");
  fireEvent.change(shift, { target: { value: "32" } });
  fireEvent.keyDown(shift, { key: "Enter" });
  expect(shift).toHaveAttribute("aria-invalid", "true");
  expect(half).not.toHaveAttribute("aria-invalid");
  fireEvent.change(shift, { target: { value: "1" } });
  fireEvent.keyDown(shift, { key: "Enter" });
  expect(pattern(view.container)).toBe("524306");
});

it("discards upper bits when narrowing and zero-fills when widening, including signed patterns", () => {
  const view = setup("widths");
  guide(view.container);
  fireEvent.click(view.getByRole("button", { name: S.loadTask }));
  expect(pattern(view.container)).toBe("8589934601");
  fireEvent.click(view.getByRole("button", { name: S.widthValue(32) }));
  expect(pattern(view.container)).toBe("9");
  fireEvent.click(view.getByRole("button", { name: S.widthValue(64) }));
  expect(pattern(view.container)).toBe("9");
  fireEvent.click(view.getByRole("button", { name: S.widthValue(32) }));
  fireEvent.click(view.getByRole("button", { name: S.signed }));
  fireEvent.change(view.getByLabelText(S.entry), { target: { value: "-1" } });
  fireEvent.click(view.getByRole("button", { name: S.apply }));
  expect(pattern(view.container)).toBe("4294967295");
  fireEvent.click(view.getByRole("button", { name: S.widthValue(64) }));
  expect(pattern(view.container)).toBe("4294967295");
  expect(view.container.querySelector("[data-reading]")).toHaveTextContent("4,294,967,295");
});

it("loads tasks explicitly, keeps blank typed answers independent, and preserves focus and working through reset/close", () => {
  const view = setup("hexadecimal");
  guide(view.container);
  const answer = view.getByLabelText(S.presets.hexadecimal.labels[0]);
  expect(answer).toHaveValue("");
  const load = view.getByRole("button", { name: S.loadTask });
  load.focus();
  fireEvent.click(load);
  expect(load).toHaveFocus();
  expect(pattern(view.container)).toBe("21");
  expect(answer).toHaveValue("");
  expect(load.nextElementSibling).toHaveTextContent(S.messages.taskLoaded);
  fireEvent.click(view.getByRole("button", { name: S.returnToCalculator }));
  expect(view.getByLabelText(S.entry)).toHaveFocus();
  fireEvent.change(answer, { target: { value: "0x15" } });
  fireEvent.click(view.getByRole("button", { name: S.check }));
  expect(view.getByText(S.presets.hexadecimal.success)).toBeVisible();
  const reset = view.getByRole("button", { name: S.reset });
  reset.focus();
  fireEvent.click(reset);
  expect(reset).toHaveFocus();
  expect(answer).toHaveValue("0x15");
  expect(pattern(view.container)).toBe("13");
  fireEvent.click(view.getByRole("button", { name: S.clear }));
  fireEvent.click(view.getByRole("button", { name: S.resetGuide }));
  expect(pattern(view.container)).toBe("0");
  expect(answer).toHaveValue("");
  fireEvent.change(view.getByLabelText(S.entry), { target: { value: "unfinished" } });
  toggle(view.container.querySelector("details")!, false);
  expect(view.queryByRole("textbox")).toBeNull();
  toggle(view.container.querySelector("details")!);
  expect(view.getByLabelText(S.entry)).toHaveValue("unfinished");
  expect(pattern(view.container)).toBe("0");
  expect(view.container.querySelector(".al-programmer-guide")).toHaveAttribute("open");
});

it("checks each preset semantically against the model and identifies only the wrong guide fields", () => {
  const answers: Record<ProgrammerPreset, string[]> = {
    hexadecimal: ["0x0015"],
    readings: ["4,294,967,294", "-2"],
    arithmetic: ["10 01"],
    halves: ["4", "9"],
    widths: ["0x0000 0000 0000 0009"],
  };
  for (const preset of Object.keys(answers) as ProgrammerPreset[]) {
    expect(checkProgrammerGuide(preset, answers[preset]).every(Boolean)).toBe(true);
    expect(
      checkProgrammerGuide(
        preset,
        answers[preset].map(() => ""),
      ).some(Boolean),
    ).toBe(false);
    expect(
      checkProgrammerGuide(
        preset,
        answers[preset].map(() => "99999999999999999999999"),
      ).some(Boolean),
    ).toBe(false);
  }
  expect(checkProgrammerGuide("arithmetic", ["01001"])).toEqual([false]);
  const view = setup("readings");
  guide(view.container);
  const unsigned = view.getByLabelText(S.presets.readings.labels[0]);
  const signed = view.getByLabelText(S.presets.readings.labels[1]);
  fireEvent.change(unsigned, { target: { value: "4294967294" } });
  fireEvent.change(signed, { target: { value: "2" } });
  fireEvent.click(view.getByRole("button", { name: S.check }));
  expect(unsigned).not.toHaveAttribute("aria-invalid");
  expect(signed).toHaveAttribute("aria-invalid", "true");
  expect(document.getElementById(signed.getAttribute("aria-describedby")!)).toHaveTextContent(
    S.presets.readings.retry,
  );
});

it("restores open state, numeric working, pending entry and guide answers once through coordinated update handoff", async () => {
  vi.resetModules();
  const handoff = await import("./update-handoff");
  const { ProgrammerCalculator: Original } = await import("./ProgrammerCalculator");
  const view = render(
    <handoff.ViewHandoffScope id="calculator">
      <Original preset="widths" handoffKey="restart" />
    </handoff.ViewHandoffScope>,
  );
  toggle(view.container.querySelector("details")!);
  guide(view.container);
  fireEvent.click(view.getByRole("button", { name: S.loadTask }));
  fireEvent.click(view.getByRole("button", { name: S.widthValue(32) }));
  fireEvent.click(view.getByRole("button", { name: S.calculate }));
  fireEvent.change(view.getByLabelText(S.entry), { target: { value: "pending" } });
  fireEvent.change(view.getByLabelText(S.presets.widths.labels[0]), { target: { value: "009" } });
  expect(handoff.prepareViewHandoff()).toBe(true);
  view.unmount();
  vi.resetModules();
  const nextHandoff = await import("./update-handoff");
  const { ProgrammerCalculator: Restored } = await import("./ProgrammerCalculator");
  const next = render(
    <nextHandoff.ViewHandoffScope id="calculator">
      <Restored preset="widths" handoffKey="restart" />
    </nextHandoff.ViewHandoffScope>,
  );
  expect(next.container.querySelector("details")).toHaveAttribute("open");
  expect(next.container.querySelector(".al-programmer-guide")).toHaveAttribute("open");
  expect(next.getByRole("button", { name: S.widthValue(32) })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(pattern(next.container)).toBe("10");
  expect(next.getByLabelText(S.entry)).toHaveValue("pending");
  expect(next.getByLabelText(S.presets.widths.labels[0])).toHaveValue("009");
  expect(next.getByText(S.fullResult + ":", { exact: false })).toHaveTextContent("10");
  expect(sessionStorage.getItem("assembly-lab:update:views:v1")).toBeNull();
  next.unmount();
  const fresh = render(
    <nextHandoff.ViewHandoffScope id="calculator">
      <Restored preset="widths" handoffKey="restart" />
    </nextHandoff.ViewHandoffScope>,
  );
  expect(fresh.container.querySelector("details")).not.toHaveAttribute("open");
});

it("tool presentation has no exercises and limits half editing to 32 bits", () => {
  const view = render(
    <ProgrammerCalculator preset="widths" handoffKey="global" presentation="tool" />,
  );
  expect(view.queryByText(S.guideTitle)).toBeNull();
  expect(view.queryByRole("link")).toBeNull();
  expect(pattern(view.container)).toBe("0");
  fireEvent.change(view.getByLabelText(S.halfValue), { target: { value: "15" } });
  fireEvent.click(view.getByRole("button", { name: S.applyHalf }));
  expect(pattern(view.container)).toBe("983040");
  fireEvent.click(view.getByRole("button", { name: S.widthValue(64) }));
  expect(view.queryByLabelText(S.halfValue)).toBeNull();
  fireEvent.change(view.getByLabelText(S.shiftAmount), { target: { value: "32" } });
  fireEvent.click(view.getByRole("button", { name: S.shiftLeft }));
  expect(pattern(view.container)).toBe("4222124650659840");
  fireEvent.click(view.getByRole("button", { name: S.widthValue(32) }));
  expect(pattern(view.container)).toBe("0");
  expect(view.getByLabelText(S.halfValue)).toBeInTheDocument();
});

it("unmounts closed tool controls while retaining pending work and its exact pattern", () => {
  const tool = (active: boolean) => (
    <ProgrammerCalculator preset="widths" handoffKey="global" presentation="tool" active={active} />
  );
  const view = render(tool(true));
  fireEvent.change(view.getByLabelText(S.entry), { target: { value: "123" } });
  fireEvent.click(view.getByRole("button", { name: S.apply }));
  fireEvent.change(view.getByLabelText(S.entry), { target: { value: "456" } });
  view.rerender(tool(false));
  expect(view.container).toBeEmptyDOMElement();
  view.rerender(tool(true));
  expect(pattern(view.container)).toBe("123");
  expect(view.getByLabelText(S.entry)).toHaveValue("456");
});
