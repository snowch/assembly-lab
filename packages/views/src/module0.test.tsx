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
import { ArgsFigure } from "./interactives/ArgsFigure";
import { OperandRoles } from "./interactives/OperandRoles";
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
    expect(container.querySelector(".al-dreg-flag")).toBeNull();
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
    const { container } = figure(ListingFigure, "l", "listing", {
      program: TRIP,
      notes,
      showCompilerLines: true,
    });
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

  it("draws an invitation directly above the question, and its own button label, when given them", () => {
    const { container } = figure(TracePrediction, "p", "trace-prediction", {
      ...props,
      intro: "**This is a new situation.** Make your best prediction.",
      commitLabel: "See what happens",
    });
    const intro = container.querySelector(".al-prediction > .prose");
    const question = container.querySelectorAll(".al-prediction > .prose")[1];
    expect(flat(intro)).toBe("This is a new situation. Make your best prediction.");
    expect(question!.textContent).toContain("Where?");
    expect(
      intro!.compareDocumentPosition(question!) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "See what happens" })).toBeDisabled();
    expect(screen.queryByRole("button", { name: S.prediction.commit })).toBeNull();
  });

  it("keeps the shared button label when the prediction asks for no label of its own", () => {
    figure(TracePrediction, "p", "trace-prediction", props);
    expect(screen.getByRole("button", { name: S.prediction.commit })).toBeDisabled();
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

describe("the arguments figure", () => {
  const props = {
    params: ["leg1", "leg2", "leg3", "detour"],
    program: TRIP,
    call: TRIP_CALL,
    after: "p",
    says: "The first instruction is `add w0, w0, w1`.",
    question:
      "It adds two register values and stores the result. Where will the C variable `total` be kept?",
    reveal: {
      register: 0,
      before: "leg1",
      after: "leg1 + leg2",
      explain:
        "The `add` instruction overwrites ${register} with the sum. The C variable `total` does not need a separate register.",
    },
  };
  it("draws each parameter above the register it arrives in, and says nothing of the result", () => {
    const { container } = figure(ArgsFigure, "a", "arg-registers", props);
    const chips = (side: string) =>
      [...container.querySelectorAll(`.al-arg-${side} code`)].map((c) => c.textContent);
    expect(chips("param")).toEqual(["leg1", "leg2", "leg3", "detour"]);
    expect(chips("register")).toEqual(["w0", "w1", "w2", "w3"]);
    expect(container.querySelectorAll(".al-arg-arrow")).toHaveLength(4);
    expect(container.querySelector(".al-args-map")).toHaveAttribute("aria-label", M0.args.map);
    // The mapping is drawn with the first instruction named, and no result anywhere.
    expect(container.querySelector(".al-args-reveal")).toBeNull();
    expect(flat(container.querySelector(".al-args-says"))).toContain("add w0, w0, w1");
    // No number of the run is on the page either: neither the arguments nor the result.
    expect(container.textContent).not.toContain("120");
    expect(container.textContent).not.toContain("205");
  });
  it("shows the register before and after only once the prediction has been checked", async () => {
    const user = userEvent.setup();
    // One store holds both figures, so the reveal waits on the prediction's own commitment.
    const store = new LessonStore(memoryStorage(), "assembly-lab", "args-test");
    const { container } = figure(ArgsFigure, "a", "arg-registers", props, store);
    expect(container.querySelector(".al-args-reveal")).toBeNull();
    const prediction = render(
      <TracePrediction
        lesson={{} as Lesson}
        interactive={Interactive.parse({
          id: "p",
          kind: "trace-prediction",
          timeModel: "steps",
          caption: "c",
          props: {
            question: "**Where?**",
            options: [
              { value: "w0", label: "In `w0`." },
              { value: "new", label: "In a new place of its own." },
            ],
            program: TRIP,
            call: TRIP_CALL,
            measure: { kind: "first-write" },
          },
        })}
        store={store}
      />,
    );
    await user.click(prediction.getByRole("radio", { name: /In w0/ }));
    await user.click(prediction.getByRole("button", { name: S.prediction.commit }));
    expect(container.querySelector(".al-args-reveal")).not.toBeNull();
    const rows = [...container.querySelectorAll(".al-args-reveal dd")].map((d) => d.textContent);
    expect(rows[0]).toContain("w0 = leg1");
    expect(rows[0]).toContain("(120)");
    expect(rows[1]).toContain("w0 = leg1 + leg2");
    expect(rows[1]).toContain("(205)");
  });
});

describe("the operands figure", () => {
  const props = {
    name: "add",
    operands: ["w0", "w0", "w1"],
    operation: "Add",
    after: "p",
  };
  it("stays shut until the prediction it waits on has been checked", () => {
    const { container } = figure(OperandRoles, "o", "operand-roles", props);
    expect(container.querySelector(".al-locked")).toHaveTextContent(S.stepper.locked);
    expect(container.querySelector(".al-operands-flow")).toBeNull();
  });
  it("draws the instruction, then its flow: what it reads, what it does, what it writes", async () => {
    const user = userEvent.setup();
    const store = new LessonStore(memoryStorage(), "assembly-lab", "operands-test");
    const { container } = figure(OperandRoles, "o", "operand-roles", props, store);
    const prediction = render(
      <TracePrediction
        lesson={{} as Lesson}
        interactive={Interactive.parse({
          id: "p",
          kind: "trace-prediction",
          timeModel: "steps",
          caption: "c",
          props: {
            question: "**Where?**",
            options: [
              { value: "w0", label: "In `w0`." },
              { value: "new", label: "In a new place of its own." },
            ],
            program: TRIP,
            call: TRIP_CALL,
            measure: { kind: "first-write" },
          },
        })}
        store={store}
      />,
    );
    await user.click(prediction.getByRole("radio", { name: /In w0/ }));
    await user.click(prediction.getByRole("button", { name: S.prediction.commit }));
    // The syntax keeps the instruction's own order: destination first.
    expect(flat(container.querySelector(".al-operands-syntax"))).toContain("add w0, w0, w1");
    const reads = [...container.querySelectorAll(".al-op-read code")].map((c) => c.textContent);
    expect(reads).toEqual(["w0", "w1"]);
    expect(flat(container.querySelector(".al-op-do"))).toContain("Add");
    expect(flat(container.querySelector(".al-op-write"))).toContain("Write w0");
    // `w0` is both read and written: one sentence says the two appearances name one register.
    expect(flat(container.querySelector(".al-operands-tie"))).toContain(
      "The two w0 appearances name one register",
    );
    // There is no legend to decode: the roles are on the elements themselves.
    expect(container.querySelector(".al-operands-legend")).toBeNull();
  });
  it("draws no tie when no read register is also the destination", async () => {
    const user = userEvent.setup();
    const store = new LessonStore(memoryStorage(), "assembly-lab", "operands-test-2");
    const { container } = figure(
      OperandRoles,
      "o2",
      "operand-roles",
      { ...props, operands: ["w2", "w0", "w1"] },
      store,
    );
    const prediction = render(
      <TracePrediction
        lesson={{} as Lesson}
        interactive={Interactive.parse({
          id: "p",
          kind: "trace-prediction",
          timeModel: "steps",
          caption: "c",
          props: {
            question: "**Where?**",
            options: [
              { value: "w2", label: "In `w2`." },
              { value: "new", label: "In a new place of its own." },
            ],
            program: TRIP,
            call: TRIP_CALL,
            measure: { kind: "first-write" },
          },
        })}
        store={store}
      />,
    );
    await user.click(prediction.getByRole("radio", { name: /In w2/ }));
    await user.click(prediction.getByRole("button", { name: S.prediction.commit }));
    expect(flat(container.querySelector(".al-op-write"))).toContain("Write w2");
    expect(container.querySelector(".al-operands-tie")).toBeNull();
  });
});

describe("the stepper's ask before a step", () => {
  const props = { ...stepper, expect: true };
  it("asks which register the next instruction will write, and says whether the pick was right", async () => {
    const user = userEvent.setup();
    const { container } = figure(StepperFigure, "s", "stepper", props);
    expect(screen.getByRole("group", { name: S.stepper.expectGroup })).not.toBeNull();
    // The ask names the instruction that runs next.
    expect(flat(container.querySelector(".al-expect-ask"))).toContain("add w0, w0, w1");
    await user.click(screen.getByRole("button", { name: "w1" }));
    await user.click(next());
    // The pick was wrong: the status says so, then what ran.
    expect(flat(container.querySelector(".al-status"))).toContain("It wrote w0");
    expect(flat(container.querySelector(".al-status"))).toContain("Ran add w0, w0, w1");
    await user.click(screen.getByRole("button", { name: "w0" }));
    await user.click(next());
    expect(flat(container.querySelector(".al-status"))).toContain("You were right: it wrote w0");
    // Moving back clears the verdict: the ask is for the instruction that runs next again.
    await user.click(back());
    expect(flat(container.querySelector(".al-status"))).not.toContain("You were right");
  });
  it("draws no ask when the lesson does not ask for one", () => {
    const { container } = figure(StepperFigure, "s", "stepper", stepper);
    expect(container.querySelector(".al-expect")).toBeNull();
  });
});

// The compact opener teaches with one executed example, then asks learners to apply its rule.
describe("the compact first stepper", () => {
  it("explains the first execution automatically and checks later arithmetic destinations", async () => {
    const user = userEvent.setup();
    const { container } = figure(StepperFigure, "s", "stepper", {
      ...stepper,
      expect: true,
      compact: true,
    });
    expect(
      container.querySelector(".al-expect, .al-step-explanation, .al-operands, .al-flow"),
    ).toBeNull();
    await user.click(next());
    expect(flat(container.querySelector(".al-status"))).toBe("w0 ← 120 + 85 = 205");
    const diagram = container.querySelector(".al-operands")!;
    expect(diagram).toBeVisible();
    expect(diagram.closest("details")).toBeNull();
    expect(flat(container.querySelector(".al-op-write"))).toBe("Write w0");
    expect(container.querySelector(".al-first-step")).toHaveTextContent(
      "first operand names the register written",
    );
    expect(flat(container.querySelector(".al-expect-ask"))).toContain("add w0, w0, w2");
    const question = container.querySelector(".al-expect")!;
    expect(
      diagram.compareDocumentPosition(question) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      question.compareDocumentPosition(container.querySelector(".al-controls")!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(container.querySelector("details")!.open).toBe(false);
    await user.click(screen.getByRole("button", { name: "w1" }));
    await user.click(next());
    expect(flat(container.querySelector(".al-status"))).toBe("Not quite. w0 ← 205 + 42 = 247");
    expect(container.querySelector(".al-operands")).toBeNull();
    expect(flat(container.querySelector(".al-expect-ask"))).toContain("sub w0, w0, w3");
    await user.click(screen.getByText(S.stepper.explain));
    expect(container.querySelector("details")!.open).toBe(true);
    await user.click(screen.getByRole("button", { name: "w0" }));
    await user.click(next());
    expect(flat(container.querySelector(".al-status"))).toBe("Correct. w0 ← 247 − 15 = 232");
    expect(container.querySelector("details")!.open).toBe(false);
    expect(container.querySelector(".al-expect")).toBeNull();
    expect(container.querySelector(".al-up-next")).toHaveTextContent("ret");
    await user.click(next());
    expect(flat(container.querySelector(".al-status"))).toBe(S.stepper.ended);
    expect(container.querySelector(".al-expect")).toBeNull();
    expect(next()).toBeDisabled();
    await user.click(back());
    expect(container.querySelector(".al-expect")).toBeNull();
    await user.click(back());
    expect(flat(container.querySelector(".al-status"))).toBe("w0 ← 205 + 42 = 247");
    await user.click(back());
    expect(container.querySelector(".al-operands")).toBeVisible();
    expect(container.querySelector(".al-expect")).not.toBeNull();
    await user.click(back());
    expect(container.querySelector(".al-expect, .al-operands")).toBeNull();
    await user.click(next());
    await user.click(screen.getByRole("button", { name: S.stepper.reset }));
    expect(container.querySelector(".al-expect, .al-step-explanation, .al-operands")).toBeNull();
  });
});
