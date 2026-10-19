// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

// Module 0's additions to the figures, each an optional prop that is off elsewhere: the panel that
// says what the last instruction read and wrote, the registers as decimal numbers with a switch
// that opens the bits, the experiment's listing as two groups with its stopping point and its
// crossing, the closed notes under a listing, the sentence for a wrong choice, and the sentence
// that waits for the end of the run. Every number the panel shows is checked against the model.

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";

import { crossedFrom, flowAt } from "./flow";
import { ListingFigure } from "./interactives/ListingFigure";
import { StepperFigure } from "./interactives/StepperFigure";
import { TracePrediction } from "./interactives/TracePrediction";
import { VIEW_STRINGS as S } from "./strings";
import { MODULE0_STRINGS as M0 } from "./strings.module0";
import { TRIP, TRIP_AND_FUEL, TRIP_CALL } from "./testing";
import { traceOf, viewAt, wValue } from "./trace";

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

const next = () => screen.getByRole("button", { name: S.stepper.next });
const back = () => screen.getByRole("button", { name: S.stepper.back });
const flat = (el: Element | null) => (el?.textContent ?? "").replace(/\s+/g, " ").trim();
const panel = (container: HTMLElement) => container.querySelector(".al-flow") as HTMLElement;
const reg = (container: HTMLElement, name: string) =>
  container.querySelector(`[data-register="${name}"]`) as HTMLElement;
const decimal = (container: HTMLElement, name: string) =>
  reg(container, name).querySelector(".al-dreg-value, .al-reg-value")!.textContent;

const stepper = {
  program: TRIP,
  call: TRIP_CALL,
  registers: [0, 1, 2, 3],
  flow: true,
  decimal: true,
};
const experiment = {
  program: TRIP_AND_FUEL,
  call: TRIP_CALL,
  registers: [0, 1, 2, 3],
  removable: { label: "trip_distance", text: "ret" },
  flow: true,
  decimal: true,
  grouped: true,
};

describe("the data-flow panel", () => {
  it("shows nothing about an instruction before it has run", () => {
    const { container } = figure(StepperFigure, "s", "stepper", stepper);
    expect(panel(container)).toHaveAttribute("data-flow", "none");
    expect(flat(panel(container))).toBe("");
    // Nor does the page say anything of the first instruction's reads and writes.
    expect(container.textContent).not.toMatch(/w0 \(120\)|w0 = 205|was 120/);
  });

  it("says the first add read 120 and 85, wrote 205 to w0, changed w0 and left w1", async () => {
    const user = userEvent.setup();
    const { container } = figure(StepperFigure, "s", "stepper", stepper);
    await user.click(next());
    const text = flat(panel(container));
    expect(text).toContain("What add w0, w0, w1 did");
    expect(text).toContain("Reads w0 (120) + w1 (85) → Writes w0 = 205 (w0 was 120)");
    expect(text).toContain(M0.flow.adds);
    expect(text).toContain("Written: w0");
    expect(text).toContain("Not written: w1, w2, w3");
    // The same numbers as the model's own trace.
    const model = traceOf(TRIP, TRIP_CALL);
    expect([wValue(viewAt(model, 0).state, 0), wValue(viewAt(model, 0).state, 1)]).toEqual([
      120, 85,
    ]);
    expect(wValue(viewAt(model, 1).state, 0)).toBe(205);
  });

  it("marks a source and the destination differently, and names a register that is both in both", async () => {
    const user = userEvent.setup();
    const { container } = figure(StepperFigure, "s", "stepper", stepper);
    await user.click(next());
    const sources = [...container.querySelectorAll('[data-role="source"]')].map((e) => flat(e));
    const destination = [...container.querySelectorAll('[data-role="destination"]')].map((e) =>
      flat(e),
    );
    expect(sources).toEqual(["w0 (120)", "w1 (85)"]);
    expect(destination).toEqual(["w0 = 205"]);
    // Text marks the roles as well as the outline, and w0 is one of each.
    expect(flat(panel(container))).toMatch(/Reads .* Writes /);
  });

  it("updates for the second add, 205 plus 42, and for the sub, 247 minus 15, in that order", async () => {
    const user = userEvent.setup();
    const { container } = figure(StepperFigure, "s", "stepper", stepper);
    await user.click(next());
    await user.click(next());
    expect(flat(panel(container))).toContain(
      "Reads w0 (205) + w2 (42) → Writes w0 = 247 (w0 was 205)",
    );
    expect(flat(panel(container))).toContain("Not written: w1, w2, w3");
    await user.click(next());
    const text = flat(panel(container));
    expect(text).toContain("Reads w0 (247) − w3 (15) → Writes w0 = 232 (w0 was 247)");
    expect(text).toContain(M0.flow.subtracts);
    expect(text).toContain("Written: w0");
    expect(text).toContain("Not written: w1, w2, w3");
  });

  it("lists every drawn register the step did not write as unchanged, each at the value it arrived with", async () => {
    const user = userEvent.setup();
    const { container } = figure(StepperFigure, "s", "stepper", stepper);
    const arrived: Record<string, string> = { w1: "85", w2: "42", w3: "15" };
    for (let k = 0; k < 3; k++) {
      await user.click(next());
      const unchanged = container.querySelector('[data-set="unchanged"]')!.textContent!;
      const names = /Not written: (.*)$/.exec(unchanged)![1]!.split(", ");
      // Every register the figure draws is either changed (w0, here) or listed as unchanged.
      expect(names).toEqual(["w1", "w2", "w3"]);
      let sourcesSeen = 0;
      for (const name of names) {
        expect(decimal(container, name)).toBe(arrived[name]);
        // A source among them shows the same number in the panel.
        const source = [...container.querySelectorAll('[data-role="source"]')]
          .map((e) => flat(e))
          .find((t) => t.startsWith(`${name} `));
        if (source !== undefined) {
          expect(source).toBe(`${name} (${arrived[name]})`);
          sourcesSeen++;
        }
      }
      // Each add or sub here reads one register it does not write.
      expect(sourcesSeen).toBe(1);
    }
  });

  it("says ret does no arithmetic, and that the code that called the function carries on", async () => {
    const user = userEvent.setup();
    const { container } = figure(StepperFigure, "s", "stepper", stepper);
    for (let k = 0; k < 4; k++) await user.click(next());
    expect(panel(container)).toHaveAttribute("data-flow", "ret");
    expect(flat(panel(container))).toContain("`ret` does no arithmetic".replace(/`/g, ""));
    expect(flat(panel(container))).toContain(
      "The function ends, and the code that called it carries on.",
    );
    expect(container.querySelector('[data-role="destination"]')).toBeNull();
  });

  it("goes back to the previous panel and values with Back", async () => {
    const user = userEvent.setup();
    const { container } = figure(StepperFigure, "s", "stepper", stepper);
    await user.click(next());
    const first = flat(panel(container));
    await user.click(next());
    expect(flat(panel(container))).not.toBe(first);
    await user.click(back());
    expect(flat(panel(container))).toBe(first);
    expect(decimal(container, "w0")).toBe("205");
    await user.click(back());
    expect(flat(panel(container))).toBe("");
    expect(decimal(container, "w0")).toBe("120");
  });

  it("is not drawn when the prop is off, as in every other module", async () => {
    const user = userEvent.setup();
    const { container } = figure(StepperFigure, "s", "stepper", {
      program: TRIP,
      call: TRIP_CALL,
      registers: [0, 1],
    });
    await user.click(next());
    expect(container.querySelector(".al-flow, .al-registers-head, .al-dreg, .al-group")).toBeNull();
    expect(container.querySelectorAll(".al-reg")).toHaveLength(2);
    expect(container.querySelector(".al-endnote")).toBeNull();
  });

  it("describes only add, sub and ret, from the trace", () => {
    const trace = traceOf(TRIP, TRIP_CALL);
    expect(flowAt(trace, 0)).toBeNull();
    expect(flowAt(trace, 1)).toMatchObject({
      kind: "arith",
      operation: "add",
      destination: { name: "w0", before: "120", after: "205" },
      changed: ["w0"],
      unchanged: ["w1"],
    });
    expect(flowAt(trace, 4)).toMatchObject({ kind: "ret" });
    expect(flowAt(trace, 5)).toBeNull();
  });
});

describe("the registers as decimal numbers", () => {
  it("draw each register as its name and value, with no bits until the switch is pressed", async () => {
    const user = userEvent.setup();
    const { container } = figure(StepperFigure, "s", "stepper", stepper);
    expect(container.querySelectorAll(".al-bit")).toHaveLength(0);
    expect(["w0", "w1", "w2", "w3"].map((n) => decimal(container, n))).toEqual([
      "120",
      "85",
      "42",
      "15",
    ]);
    const toggle = screen.getByRole("button", { name: M0.registers.showBits });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    const open = screen.getByRole("button", { name: M0.registers.hideBits });
    expect(open).toHaveAttribute("aria-expanded", "true");
    expect(container.querySelectorAll(".al-reg")).toHaveLength(4);
    expect(reg(container, "w0").querySelectorAll(".al-bit")).toHaveLength(32);
    await user.click(open);
    expect(container.querySelectorAll(".al-bit")).toHaveLength(0);
  });

  it("mark a changed register by an outline and by the word Changed, and nothing else", async () => {
    const user = userEvent.setup();
    const { container } = figure(StepperFigure, "s", "stepper", stepper);
    expect(container.querySelector('[data-changed="true"]')).toBeNull();
    expect(container.querySelector(".al-dreg-flag")?.textContent).toBe("");
    await user.click(next());
    const changed = [...container.querySelectorAll('[data-changed="true"]')];
    expect(changed.map((e) => e.getAttribute("data-register"))).toEqual(["w0"]);
    expect(within(changed[0] as HTMLElement).getByText(M0.registers.changed)).toBeTruthy();
    expect(
      container.textContent!.match(new RegExp(`${M0.registers.changed}(?!:)`, "g")),
    ).toHaveLength(1);
  });

  it("show the extra subtraction of the run that goes on into fuel_used", async () => {
    const user = userEvent.setup();
    const { container } = figure(StepperFigure, "s", "stepper", experiment);
    await user.click(screen.getByRole("checkbox"));
    for (let k = 0; k < 4; k++) await user.click(next());
    expect(flat(panel(container))).toContain(
      "Reads w0 (232) − w1 (85) → Writes w0 = 147 (w0 was 232)",
    );
    expect(decimal(container, "w0")).toBe("147");
  });
});

describe("the experiment's listing, in two groups", () => {
  const groups = (container: HTMLElement) =>
    [...container.querySelectorAll(".al-group")].map((g) => ({
      label: g.querySelector(".al-label")?.textContent,
      rows: [...g.querySelectorAll(".al-text")].map((t) => t.textContent),
    }));

  it("shows trip_distance and fuel_used under their labels, with no mark before the run reaches one", () => {
    const { container } = figure(StepperFigure, "s", "stepper", experiment);
    expect(groups(container)).toEqual([
      {
        label: "trip_distance:",
        rows: ["add w0, w0, w1", "add w0, w0, w2", "sub w0, w0, w3", "ret"],
      },
      { label: "fuel_used:", rows: ["sub w0, w0, w1", "ret"] },
    ]);
    expect(container.querySelector(".al-stop, .al-link")).toBeNull();
  });

  it("marks the stopping point after trip_distance's ret once the run has reached it, and draws no connector", async () => {
    const user = userEvent.setup();
    const { container } = figure(StepperFigure, "s", "stepper", experiment);
    for (let k = 0; k < 3; k++) await user.click(next());
    expect(container.querySelector(".al-stop")).toBeNull();
    await user.click(next());
    const stop = container.querySelector(".al-stop")!;
    expect(stop.closest(".al-group")).toHaveAttribute("data-function", "trip_distance");
    expect(flat(stop)).toBe("Stopping point: the run ends at this ret.");
    expect(container.querySelector(".al-link")).toBeNull();
  });

  it("with ret deleted, crosses into fuel_used and ends at its ret with 147; the connector appears only at the crossing", async () => {
    const user = userEvent.setup();
    const { container } = figure(StepperFigure, "s", "stepper", experiment);
    await user.click(screen.getByRole("checkbox"));
    expect(groups(container)[0]!.rows).toEqual([
      "add w0, w0, w1",
      "add w0, w0, w2",
      "sub w0, w0, w3",
    ]);
    const linked: boolean[] = [];
    for (let k = 1; k <= 5; k++) {
      await user.click(next());
      linked.push(container.querySelector(".al-link") !== null);
    }
    // After the third instruction the next one is in fuel_used: the link is drawn from then on.
    expect(linked).toEqual([false, false, true, true, true]);
    const link = container.querySelector(".al-link")!;
    expect(flat(link)).toBe("The run crosses from trip_distance into fuel_used.");
    // It sits between the two groups.
    expect(link.previousElementSibling).toHaveAttribute("data-function", "trip_distance");
    expect(link.nextElementSibling).toHaveAttribute("data-function", "fuel_used");
    expect(flat(panel(container))).toContain("What ret did");
    expect(container.querySelector(".al-stop")?.closest(".al-group")).toHaveAttribute(
      "data-function",
      "fuel_used",
    );
    expect(decimal(container, "w0")).toBe("147");
    // The model: five instructions, the last of them fuel_used's ret.
    const model = traceOf(TRIP_AND_FUEL, TRIP_CALL, experiment.removable);
    expect(model.result.steps.map((s) => s.text).at(-1)).toBe("ret");
    expect(model.result.steps).toHaveLength(5);
    expect(crossedFrom(model, 2)).toBeNull();
    expect(crossedFrom(model, 3)).not.toBeNull();
    // Back takes the connector away again.
    await user.click(back());
    await user.click(back());
    await user.click(back());
    expect(container.querySelector(".al-link")).toBeNull();
  });

  it("says in the panel, after the sub that leaves trip_distance, that the run continues into fuel_used", async () => {
    const user = userEvent.setup();
    const { container } = figure(StepperFigure, "s", "stepper", experiment);
    await user.click(screen.getByRole("checkbox"));
    for (let k = 0; k < 2; k++) await user.click(next());
    expect(container.querySelector(".al-flow-continues")).toBeNull();
    await user.click(next());
    expect(flat(container.querySelector(".al-flow-continues"))).toBe(
      "The next instruction is in fuel_used. The run continues into it.",
    );
  });

  it("shows nothing of the run, and no switch, until the prediction has been checked", () => {
    const { container } = figure(StepperFigure, "s", "stepper", { ...experiment, after: "p" });
    expect(container.querySelector(".al-locked")).toHaveTextContent(S.stepper.locked);
    expect(container.querySelector(".al-group, .al-flow, .al-link, .al-stop, .al-dreg")).toBeNull();
    expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
  });
});

describe("the sentence for the end of the run", () => {
  it("appears once the run has ended and goes when Back steps out of the end", async () => {
    const user = userEvent.setup();
    const endNote = "`ret` ends the function. Its result is whatever `w0` holds at that moment.";
    const { container } = figure(StepperFigure, "s", "stepper", { ...stepper, endNote });
    for (let k = 0; k < 3; k++) await user.click(next());
    expect(container.querySelector(".al-endnote")).toBeNull();
    await user.click(next());
    expect(flat(container.querySelector(".al-endnote"))).toBe(
      "ret ends the function. Its result is whatever w0 holds at that moment.",
    );
    await user.click(back());
    expect(container.querySelector(".al-endnote")).toBeNull();
  });
});

describe("the closed notes under a listing", () => {
  const notes = [
    { summary: "Which compiler?", body: "Made by GCC with `-O1`.\n\nA second paragraph." },
    { summary: "Why line 7?", body: "The closing brace." },
  ];

  it("are two closed details, reached with Tab and opened by their summaries", async () => {
    const user = userEvent.setup();
    const { container } = figure(ListingFigure, "l", "listing", { program: TRIP, notes });
    const details = [
      ...container.querySelectorAll<HTMLDetailsElement>(".al-notes details, .al-compiler-lines"),
    ];
    expect(details.map((d) => d.querySelector("summary")!.textContent)).toEqual([
      S.listing.compilerLinesSummary,
      ...notes.map((n) => n.summary),
    ]);
    expect(details.map((d) => d.open)).toEqual([false, false, false]);
    // Under the listing, not above it.
    const listing = container.querySelector(".al-listing")!;
    expect(
      listing.compareDocumentPosition(details[0]!) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    // The compiler's own references are a third closed details, beside the notes.
    // The summary is a control the keyboard reaches.
    await user.tab();
    await user.tab();
    expect(document.activeElement).toBe(details[1]!.querySelector("summary"));
    await user.click(document.activeElement as HTMLElement);
    expect(details[1]!.open).toBe(true);
    expect(details[2]!.open).toBe(false);
    expect(within(details[1]!).getByText("A second paragraph.")).toBeTruthy();
    expect(details[1]!.querySelector("code")?.textContent).toBe("-O1");
  });

  it("are not drawn without notes", () => {
    const { container } = figure(ListingFigure, "l", "listing", { program: TRIP });
    expect(container.querySelector(".al-notes")).toBeNull();
    expect(container.querySelector(".al-notes details")).toBeNull();
  });
});

describe("the sentence for a wrong choice", () => {
  const options = [
    { value: "w0", label: "In `w0`, in place of `leg1`." },
    { value: "new", label: "In a new place of its own.", feedback: "Look at `add w0, w0, w1`." },
    { value: "none", label: "Nowhere." },
  ];
  const props = {
    question: "**Where?**",
    options,
    program: TRIP,
    call: TRIP_CALL,
    measure: { kind: "first-write" },
  };

  async function choose(label: RegExp) {
    const user = userEvent.setup();
    await user.click(screen.getByRole("radio", { name: label }));
    await user.click(screen.getByRole("button", { name: S.prediction.commit }));
  }

  it("shows nothing before the prediction is checked", () => {
    const { container } = figure(TracePrediction, "p", "trace-prediction", props);
    expect(container.querySelector(".al-feedback, .al-outcome")).toBeNull();
  });

  it("shows the sentence beside the result for a wrong option that has one", async () => {
    const { container } = figure(TracePrediction, "p", "trace-prediction", props);
    await choose(/new place/);
    expect(container.querySelector(".al-nomatch")).not.toBeNull();
    expect(flat(container.querySelector(".al-feedback"))).toBe("Look at add w0, w0, w1.");
    expect(container.querySelector(".al-feedback code")?.textContent).toBe("add w0, w0, w1");
  });

  it("shows none for a wrong option without one, and none when the choice matches", async () => {
    const wrong = figure(TracePrediction, "p", "trace-prediction", props);
    await choose(/Nowhere/);
    expect(wrong.container.querySelector(".al-nomatch")).not.toBeNull();
    expect(wrong.container.querySelector(".al-feedback")).toBeNull();
    wrong.unmount();
    const right = figure(TracePrediction, "q", "trace-prediction", {
      ...props,
      options: options.map((o) => (o.value === "w0" ? { ...o, feedback: "No." } : o)),
    });
    await choose(/In w0/);
    expect(right.container.querySelector(".al-match")).not.toBeNull();
    expect(right.container.querySelector(".al-feedback")).toBeNull();
  });
});
