// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

// The stepper that marks what changed, and the flags that say what they record. After each step the
// registers and flags that changed are marked by an outline and by a word; a flag that did not change
// is not marked. After an `add` that left the flags alone the status says so, read from the
// instruction's kind and not from the flags, so an `adds` that happens to leave them as they were is
// not described that way. Without the new props the stepper is as it always was.

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";

import { FlagsRow } from "./FlagsRow";
import { StepperFigure } from "./interactives/StepperFigure";
import { ARITH_STRINGS as A } from "./strings.arith";
import { VIEW_STRINGS as S } from "./strings";

const SUM_FLAGS = {
  c: "",
  listing: "sum_flags:\n  adds w3, w2, w2\n  add w0, w0, w1\n  ret",
};
const CALL = { entry: "sum_flags", args: [0x7fffffff, 1, 0xffffffff] };

function stepper(props: Record<string, unknown>) {
  const interactive = Interactive.parse({
    id: "s",
    kind: "stepper",
    timeModel: "steps",
    caption: "c",
    props,
  });
  return render(
    <StepperFigure
      lesson={{} as Lesson}
      interactive={interactive}
      store={new LessonStore(memoryStorage(), "assembly-lab", "test")}
    />,
  );
}

const next = () => screen.getByRole("button", { name: S.stepper.next });
const changedFlags = (c: HTMLElement) =>
  [...c.querySelectorAll(".al-flag[data-changed='true']")].map((e) => e.getAttribute("data-flag"));
const taggedFlags = (c: HTMLElement) =>
  [...c.querySelectorAll(".al-flag .al-flag-tag")].map((e) =>
    e.closest(".al-flag")?.getAttribute("data-flag"),
  );
const changedRegisters = (c: HTMLElement) =>
  [...c.querySelectorAll(".al-reg[data-changed='true']")].map((e) =>
    e.getAttribute("data-register"),
  );
const taggedRegisters = (c: HTMLElement) =>
  [...c.querySelectorAll(".al-reg .al-reg-tag")].map((e) =>
    e.closest(".al-reg")?.getAttribute("data-register"),
  );
const NOT_UPDATED = "N, Z, C and V were not updated by";

// Rendering a whole lesson and pressing its buttons takes a while on a busy machine.
vi.setConfig({ testTimeout: 30_000 });

describe("the stepper that marks what changed", () => {
  const props = {
    program: SUM_FLAGS,
    call: CALL,
    registers: [0, 1, 2, 3],
    flags: true,
    showChanges: true,
    explainFlags: true,
  };

  it("marks the register and the flags the adds changed, by an outline and by the word changed", async () => {
    const user = userEvent.setup();
    const { container } = stepper(props);
    // Before the first step nothing has changed and nothing is marked.
    expect(changedRegisters(container)).toEqual([]);
    expect(taggedRegisters(container)).toEqual([]);
    expect(changedFlags(container)).toEqual([]);
    await user.click(next());
    // adds w3, w2, w2 wrote w3, and set N and C (0 to 1) and left Z and V at 0.
    expect(changedRegisters(container)).toEqual(["w3"]);
    expect(taggedRegisters(container)).toEqual(["w3"]);
    expect(changedFlags(container)).toEqual(["n", "c"]);
    expect(taggedFlags(container)).toEqual(["n", "c"]);
    expect(container.querySelector(".al-reg-tag")).toHaveTextContent(A.stepper.registerChanged);
    expect(container.querySelector(".al-flag-tag")).toHaveTextContent(A.flags.changedTag);
  });

  it("marks only w0 after the add, and no flag: they did not change, so none is outlined or tagged", async () => {
    const user = userEvent.setup();
    const { container } = stepper(props);
    await user.click(next());
    await user.click(next());
    expect(changedRegisters(container)).toEqual(["w0"]);
    expect(taggedRegisters(container)).toEqual(["w0"]);
    expect(changedFlags(container)).toEqual([]);
    expect(taggedFlags(container)).toEqual([]);
    // The flags the adds left are still N 1, Z 0, C 1, V 0.
    expect(
      ["n", "z", "c", "v"].map(
        (f) => (container.querySelector(`[data-flag="${f}"]`) as HTMLElement).dataset["value"],
      ),
    ).toEqual(["1", "0", "1", "0"]);
  });

  it("says after the add that w0 changed and the flags were not updated by add", async () => {
    const user = userEvent.setup();
    stepper(props);
    await user.click(next());
    expect(screen.getByRole("status").textContent).not.toContain(NOT_UPDATED);
    await user.click(next());
    expect(screen.getByRole("status")).toHaveTextContent(
      "w0 changed. N, Z, C and V were not updated by add.",
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      A.stepper.notUpdated("w0", "add").replace(/`/g, ""),
    );
    await user.click(next());
    expect(screen.getByRole("status").textContent).not.toContain(NOT_UPDATED);
  });

  it("does not describe an adds that left the flags as they were as an add", async () => {
    const user = userEvent.setup();
    // The second adds computes what the first did, so the flags before it equal the flags after it.
    const twice = {
      c: "",
      listing: "twice:\n  adds w2, w0, w1\n  adds w3, w0, w1\n  ret",
    };
    const { container } = stepper({
      program: twice,
      call: { entry: "twice", args: [3, 4] },
      registers: [2, 3],
      flags: true,
      showChanges: true,
    });
    await user.click(next());
    await user.click(next());
    expect(changedFlags(container)).toEqual([]);
    expect(screen.getByRole("status").textContent).not.toContain(NOT_UPDATED);
    expect(changedRegisters(container)).toEqual(["w3"]);
  });

  it("describes a sub that leaves the flags alone in the same words, naming sub", async () => {
    const user = userEvent.setup();
    stepper({
      program: { c: "", listing: "f:\n  sub w0, w0, w1\n  ret" },
      call: { entry: "f", args: [5, 3] },
      registers: [0],
      flags: true,
      showChanges: true,
    });
    await user.click(next());
    expect(screen.getByRole("status")).toHaveTextContent(
      "w0 changed. N, Z, C and V were not updated by sub.",
    );
  });

  it("says under each flag what it records: top bit, result is zero, carry out, signed overflow", () => {
    const { container } = stepper(props);
    const words = [...container.querySelectorAll(".al-flag-explain")].map((e) => e.textContent);
    expect(words).toEqual(["top bit", "result is zero", "carry out", "signed overflow"]);
  });

  it("is as it always was without the new props: no tag, no explanation, no extra status", async () => {
    const user = userEvent.setup();
    const { container } = stepper({
      program: SUM_FLAGS,
      call: CALL,
      registers: [0, 3],
      flags: true,
    });
    await user.click(next());
    await user.click(next());
    expect(container.querySelector(".al-reg-tag")).toBeNull();
    expect(container.querySelector(".al-flag-tag")).toBeNull();
    expect(container.querySelector(".al-flag-explain")).toBeNull();
    expect(container.querySelector(".al-reg[data-tagged]")).toBeNull();
    expect(screen.getByRole("status").textContent).not.toContain(NOT_UPDATED);
  });
});

describe("the flags row that says what the flags record", () => {
  const was = { n: false, z: false, c: false, v: false };
  const set = { n: true, z: false, c: true, v: false };
  const words = (c: HTMLElement) =>
    [...c.querySelectorAll(".al-flag-explain")].map((e) => e.textContent);

  it("says C is the carry out for an addition", () => {
    const { container } = render(<FlagsRow flags={set} explain="addition" />);
    expect(words(container)[2]).toBe("carry out");
  });

  it("says C is no borrow when C is 1 after a subtraction, and borrow when it is 0", () => {
    const one = render(<FlagsRow flags={set} explain="subtraction" />);
    expect(words(one.container)[2]).toBe("no borrow");
    one.unmount();
    const zero = render(<FlagsRow flags={was} explain="subtraction" />);
    expect(words(zero.container)[2]).toBe("borrow");
  });

  it("gives no words and no tag by default", () => {
    const { container } = render(<FlagsRow flags={set} before={was} />);
    expect(words(container)).toEqual([]);
    expect(container.querySelector(".al-flag-tag")).toBeNull();
    // The outline is the same as it always was.
    expect([...container.querySelectorAll("[data-changed='true']")]).toHaveLength(2);
  });

  it("tags only the flags that changed, and a screen reader hears the word as well", () => {
    const { container } = render(
      <FlagsRow flags={set} before={was} explain="addition" tagChanged />,
    );
    expect(taggedFlags(container)).toEqual(["n", "c"]);
    expect(container.querySelector('[data-flag="n"]')?.getAttribute("aria-label")).toBe(
      "Flag N is 1, top bit, changed",
    );
    expect(container.querySelector('[data-flag="z"]')?.getAttribute("aria-label")).toBe(
      "Flag Z is 0, result is zero",
    );
  });
});
