// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

// The figures, rendered. The stepper's values after each Next are the values of the run; its marker
// is the program counter drawn as a marker only; the changed register is outlined and the C line of
// the instruction that ran is lit. A prediction shows nothing of the run until it is checked, and a
// stepper that waits for a prediction stays shut until the prediction is.

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";

import { ListingFigure } from "./interactives/ListingFigure";
import { StepperFigure } from "./interactives/StepperFigure";
import { TracePrediction } from "./interactives/TracePrediction";
import { VIEW_STRINGS as S } from "./strings";
import { TRIP, TRIP_AND_FUEL, TRIP_CALL } from "./testing";

function figure(
  View: typeof StepperFigure,
  id: string,
  kind: string,
  props: Record<string, unknown>,
  store = new LessonStore(memoryStorage(), "assembly-lab", "test"),
) {
  const interactive = Interactive.parse({ id, kind, timeModel: "steps", caption: "c", props });
  const view = render(<View lesson={{} as Lesson} interactive={interactive} store={store} />);
  return { ...view, store };
}

const reg = (container: HTMLElement, name: string) =>
  container.querySelector(`[data-register="${name}"]`) as HTMLElement;
const value = (container: HTMLElement, name: string) =>
  reg(container, name).querySelector(".al-reg-value")!.textContent;
const next = () => screen.getByRole("button", { name: S.stepper.next });
const back = () => screen.getByRole("button", { name: S.stepper.back });
const reset = () => screen.getByRole("button", { name: S.stepper.reset });
const litC = (container: HTMLElement) =>
  [...container.querySelectorAll('.al-cline[data-lit="true"]')].map((e) =>
    e.getAttribute("data-line"),
  );
const marker = (container: HTMLElement) =>
  [...container.querySelectorAll(".al-insn")].findIndex(
    (e) => e.getAttribute("data-next") === "true",
  );

describe("the listing figure", () => {
  it("draws the C with its line numbers and each instruction with the C line recorded for it", () => {
    const { container } = figure(ListingFigure, "l", "listing", { program: TRIP });
    expect(container.querySelectorAll(".al-cline")).toHaveLength(7);
    expect(container.querySelector('.al-cline[data-line="3"] .al-src')).toHaveTextContent(
      "int total = leg1 + leg2;",
    );
    expect([...container.querySelectorAll(".al-ctag")].map((t) => t.textContent)).toEqual([
      "3",
      "4",
      "7",
      "7",
    ]);
    expect(container.querySelector(".al-label")).toHaveTextContent("trip_distance:");
    // Static: no controls, no marker, nothing lit.
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(container.querySelector('[data-next="true"], [data-lit="true"]')).toBeNull();
  });

  it("says what is wrong with props that do not fit, where the figure would be", () => {
    const { container } = figure(ListingFigure, "l", "listing", { program: { c: 1 } });
    expect(container.querySelector(".interactive-problem")).toHaveTextContent(
      /listing \(l\): program/,
    );
  });
});

describe("the stepper", () => {
  const props = { program: TRIP, call: TRIP_CALL, registers: [0, 1, 2, 3] };

  it("starts at the first instruction with the arguments in w0 to w3", () => {
    const { container } = figure(StepperFigure, "s", "stepper", props);
    expect(["w0", "w1", "w2", "w3"].map((n) => value(container, n))).toEqual([
      "120",
      "85",
      "42",
      "15",
    ]);
    expect(marker(container)).toBe(0);
    expect(back()).toBeDisabled();
    expect(reset()).toBeDisabled();
    expect(litC(container)).toEqual([]);
    expect(container.querySelector('[data-changed="true"]')).toBeNull();
    expect(screen.getByRole("status")).toHaveTextContent(S.stepper.start);
  });

  it("shows 205, 247 and 232 in w0 after each Next, and w1 to w3 never change", async () => {
    const user = userEvent.setup();
    const { container } = figure(StepperFigure, "s", "stepper", props);
    const seen: string[][] = [];
    for (let k = 1; k <= 3; k++) {
      await user.click(next());
      seen.push(["w0", "w1", "w2", "w3"].map((n) => value(container, n)!));
    }
    expect(seen).toEqual([
      ["205", "85", "42", "15"],
      ["247", "85", "42", "15"],
      ["232", "85", "42", "15"],
    ]);
  });

  it("moves the marker, outlines the register just written and lights the C line recorded for the instruction that ran", async () => {
    const user = userEvent.setup();
    const { container } = figure(StepperFigure, "s", "stepper", props);
    await user.click(next());
    expect(marker(container)).toBe(1);
    expect(reg(container, "w0")).toHaveAttribute("data-changed", "true");
    expect(reg(container, "w1")).toHaveAttribute("data-changed", "false");
    expect(litC(container)).toEqual(["3"]);
    expect(container.querySelector('.al-ctag[data-lit="true"]')).toHaveTextContent("3");
    await user.click(next());
    expect(litC(container)).toEqual(["4"]);
    await user.click(next());
    // The last subtraction is recorded against the closing brace.
    expect(litC(container)).toEqual(["7"]);
    expect(container.querySelector('.al-cline[data-line="7"] .al-src')).toHaveTextContent("}");
    expect(screen.getByRole("status")).toHaveTextContent("Ran sub w0, w0, w3. Next: ret.");
  });

  it("draws w0 as 32 bits in four groups of eight, a 1 filled", async () => {
    const user = userEvent.setup();
    const { container } = figure(StepperFigure, "s", "stepper", props);
    for (let k = 0; k < 3; k++) await user.click(next());
    const groups = [...reg(container, "w0").querySelectorAll(".al-bit-group")];
    expect(groups.map((g) => [...g.children].map((b) => b.textContent).join(""))).toEqual([
      "00000000",
      "00000000",
      "00000000",
      "11101000",
    ]);
    expect(reg(container, "w0").querySelectorAll('.al-bit[data-on="true"]')).toHaveLength(4);
  });

  it("draws no program counter as a number", async () => {
    const user = userEvent.setup();
    const { container } = figure(StepperFigure, "s", "stepper", props);
    for (let k = 0; k < 4; k++) await user.click(next());
    expect(container.textContent).not.toMatch(/0x|400000|pc\b/i);
  });

  it("ends with ret: no marker, the function returned, Next used up", async () => {
    const user = userEvent.setup();
    const { container } = figure(StepperFigure, "s", "stepper", props);
    for (let k = 0; k < 4; k++) await user.click(next());
    expect(marker(container)).toBe(-1);
    expect(next()).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent(`Ran ret. ${S.stepper.ended}`);
    expect(value(container, "w0")).toBe("232");
  });

  it("goes back a step, and Reset starts again", async () => {
    const user = userEvent.setup();
    const { container } = figure(StepperFigure, "s", "stepper", props);
    for (let k = 0; k < 3; k++) await user.click(next());
    await user.click(back());
    expect(value(container, "w0")).toBe("247");
    expect(marker(container)).toBe(2);
    await user.click(reset());
    expect(value(container, "w0")).toBe("120");
    expect(marker(container)).toBe(0);
    expect(litC(container)).toEqual([]);
  });

  it("draws only the registers it is given", () => {
    const { container } = figure(StepperFigure, "s", "stepper", { ...props, registers: [0] });
    expect(container.querySelectorAll(".al-reg")).toHaveLength(1);
  });

  it("deletes the named line on a switch and runs again: five instructions, 147", async () => {
    const user = userEvent.setup();
    const { container } = figure(StepperFigure, "s", "stepper", {
      program: TRIP_AND_FUEL,
      call: TRIP_CALL,
      registers: [0, 1],
      removable: { label: "trip_distance", text: "ret" },
    });
    expect(container.querySelectorAll(".al-insn")).toHaveLength(6);
    for (let k = 0; k < 3; k++) await user.click(next());
    await user.click(screen.getByRole("checkbox", { name: /Delete the ret line/ }));
    expect(container.querySelectorAll(".al-insn")).toHaveLength(5);
    // The switch started the run again.
    expect(value(container, "w0")).toBe("120");
    for (let k = 0; k < 3; k++) await user.click(next());
    expect(value(container, "w0")).toBe("232");
    expect(container.querySelectorAll(".al-insn")[3]).toHaveAttribute("data-next", "true");
    await user.click(next());
    expect(value(container, "w0")).toBe("147");
    await user.click(next());
    expect(next()).toBeDisabled();
    expect(value(container, "w0")).toBe("147");
    expect(screen.getByRole("status")).toHaveTextContent(S.stepper.ended);
    await user.click(screen.getByRole("checkbox"));
    expect(container.querySelectorAll(".al-insn")).toHaveLength(6);
    expect(value(container, "w0")).toBe("120");
  });

  it("stays shut until the prediction it follows has been checked", () => {
    const store = new LessonStore(memoryStorage(), "assembly-lab", "test");
    const { container } = figure(StepperFigure, "s", "stepper", { ...props, after: "p" }, store);
    expect(container.querySelector(".al-locked")).toHaveTextContent(S.stepper.locked);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(container.querySelector(".al-reg")).toBeNull();
  });
});

describe("the stepper that waits for a prediction", () => {
  it("opens when the prediction is committed, and not before", async () => {
    const user = userEvent.setup();
    const store = new LessonStore(memoryStorage(), "assembly-lab", "test");
    const options = [
      { value: "w0", label: "In `w0`, in place of `leg1`." },
      { value: "other", label: "Somewhere else." },
    ];
    const prediction = figure(
      TracePrediction,
      "p",
      "trace-prediction",
      {
        question: "**Where?**",
        options,
        program: TRIP,
        call: TRIP_CALL,
        measure: { kind: "first-write" },
      },
      store,
    );
    const stepper = figure(
      StepperFigure,
      "s",
      "stepper",
      {
        program: TRIP,
        call: TRIP_CALL,
        registers: [0],
        after: "p",
      },
      store,
    );
    expect(stepper.container.querySelector(".al-locked")).not.toBeNull();
    await user.click(within(prediction.container).getByRole("radio", { name: /Somewhere else/ }));
    await user.click(
      within(prediction.container).getByRole("button", { name: S.prediction.commit }),
    );
    expect(stepper.container.querySelector(".al-locked")).toBeNull();
    expect(within(stepper.container).getByRole("button", { name: S.stepper.next })).toBeEnabled();
  });
});

describe("the prediction about the first instruction", () => {
  const options = [
    { value: "w0", label: "In `w0`, in place of `leg1`." },
    { value: "new-place", label: "In a new place of its own." },
    { value: "w3", label: "In `w3`, in place of `detour`." },
  ];
  const props = {
    question: "**Where does the processor keep `total`?**",
    options,
    explain: "The first instruction writes `w0`.",
    program: TRIP,
    call: TRIP_CALL,
    measure: { kind: "first-write" },
  };

  it("shows the question and the options and nothing of the run, until the learner checks", () => {
    const { container } = figure(TracePrediction, "p", "trace-prediction", props);
    expect(screen.getAllByRole("radio")).toHaveLength(3);
    expect(container.querySelector(".al-outcome")).toBeNull();
    expect(container.textContent).not.toContain("The simulator ran");
    expect(container.textContent).not.toContain("The first instruction writes");
    // Nothing to check until an option is chosen.
    expect(screen.getByRole("button", { name: S.prediction.commit })).toBeDisabled();
  });

  it("says what the simulator did, and that it matches, when the right option is checked", async () => {
    const user = userEvent.setup();
    const { container } = figure(TracePrediction, "p", "trace-prediction", props);
    await user.click(screen.getByRole("radio", { name: /In w0/ }));
    expect(container.querySelector(".al-outcome")).toBeNull();
    await user.click(screen.getByRole("button", { name: S.prediction.commit }));
    const outcome = container.querySelector(".al-outcome")!;
    expect(outcome.querySelector(".al-match")).toHaveTextContent(
      "The simulator ran the first instruction. It wrote w0. That matches your prediction.",
    );
    expect(outcome).toHaveTextContent("The first instruction writes w0.");
  });

  it("says that a wrong option does not match, and lets the learner choose again", async () => {
    const user = userEvent.setup();
    const { container } = figure(TracePrediction, "p", "trace-prediction", props);
    await user.click(screen.getByRole("radio", { name: /In w3/ }));
    await user.click(screen.getByRole("button", { name: S.prediction.commit }));
    expect(container.querySelector(".al-nomatch")).toHaveTextContent(S.prediction.noMatch);
    expect(container.querySelector(".al-nomatch")).toHaveTextContent(
      "You chose: In w3, in place of detour.",
    );
    await user.click(screen.getByRole("radio", { name: /In w0/ }));
    await user.click(screen.getByRole("button", { name: S.prediction.commit }));
    expect(container.querySelector(".al-match")).not.toBeNull();
    expect(container.querySelector(".al-nomatch")).toBeNull();
  });

  it("keeps the commitment in the lesson's stored state, so it survives a reload", async () => {
    const user = userEvent.setup();
    const store = new LessonStore(memoryStorage(), "assembly-lab", "test");
    const first = figure(TracePrediction, "p", "trace-prediction", props, store);
    await user.click(screen.getByRole("radio", { name: /In w0/ }));
    await user.click(screen.getByRole("button", { name: S.prediction.commit }));
    first.unmount();
    const again = figure(TracePrediction, "p", "trace-prediction", props, store);
    expect(again.container.querySelector(".al-match")).not.toBeNull();
  });
});

describe("the prediction about a register at the end of a run", () => {
  const options = [
    { value: "232", label: "232" },
    { value: "147", label: "147" },
    { value: "error", label: "The run stops with an error" },
  ];
  const props = {
    question: "**What does `w0` hold?**",
    options,
    program: TRIP_AND_FUEL,
    call: TRIP_CALL,
    measure: {
      kind: "register-at-end",
      register: 0,
      without: { label: "trip_distance", text: "ret" },
    },
  };

  it("takes its right option from the run with the line taken out: 147", async () => {
    const user = userEvent.setup();
    const { container } = figure(TracePrediction, "p", "trace-prediction", props);
    await user.click(screen.getByRole("radio", { name: "147" }));
    await user.click(screen.getByRole("button", { name: S.prediction.commit }));
    expect(container.querySelector(".al-match")).toHaveTextContent(
      "The simulator ran it. w0 held 147 when the run ended.",
    );
  });

  it("says no match for 232, and names the run's result without the explanation if there is none", async () => {
    const user = userEvent.setup();
    const { container } = figure(TracePrediction, "p", "trace-prediction", props);
    await user.click(screen.getByRole("radio", { name: "232" }));
    await user.click(screen.getByRole("button", { name: S.prediction.commit }));
    expect(container.querySelector(".al-nomatch")).toHaveTextContent("w0 held 147");
  });

  it("calls a run that does not return an error: here a listing that falls off its end", async () => {
    const user = userEvent.setup();
    const { container } = figure(TracePrediction, "p", "trace-prediction", {
      ...props,
      program: TRIP,
    });
    await user.click(screen.getByRole("radio", { name: "The run stops with an error" }));
    await user.click(screen.getByRole("button", { name: S.prediction.commit }));
    expect(container.querySelector(".al-match")).toHaveTextContent(S.prediction.endedWithError);
  });
});
