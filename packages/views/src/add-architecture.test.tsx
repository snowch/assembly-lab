// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { readFileSync } from "node:fs";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { stateAfter } from "@al/machine";
import { Interactive, type Lesson } from "@platform/lesson-schema";
import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import {
  ADD_ARCHITECTURE_ASSEMBLY,
  addArchitectureTrace,
  parseWordInput,
} from "./add-architecture";
import { AddArchitecture } from "./interactives/AddArchitecture";
import { ADD_ARCHITECTURE_STRINGS as COPY } from "./strings.add-architecture";

const S = COPY.assembly;
function mount(store = new LessonStore(memoryStorage(), "assembly-lab", "architecture-test")) {
  return {
    ...render(
      <AddArchitecture
        lesson={{} as Lesson}
        store={store}
        interactive={Interactive.parse({
          id: "architecture",
          kind: "add-architecture",
          timeModel: "steps",
          caption: "A model ADD",
          props: {},
        })}
      />,
    ),
    store,
  };
}
function inputs(a: string, b: string) {
  fireEvent.change(screen.getByRole("textbox", { name: "w0" }), { target: { value: a } });
  fireEvent.change(screen.getByRole("textbox", { name: "w1" }), { target: { value: b } });
  fireEvent.click(screen.getByRole("button", { name: S.useInputs }));
}
const execute = () => fireEvent.click(screen.getByRole("button", { name: S.runAdd }));

describe("ADD architecture model and word inputs", () => {
  it.each([
    [3, 3],
    [15, 1],
    [0xffffffff, 1],
    [0, 0],
    [0x7fffffff, 1],
    [0xffffffff, 0xffffffff],
  ])("retains the actual low 32 bits for %i + %i, with one write and untouched flags", (a, b) => {
    const model = addArchitectureTrace(a, b),
      step = model.steps[0]!;
    const result = Number((BigInt(a) + BigInt(b)) & 0xffffffffn);
    expect(model.stop.kind).toBe("returned");
    expect(model.steps).toHaveLength(2);
    expect(step.text).toBe("add w2, w0, w1");
    expect(step.writes).toMatchObject([{ reg: 2, before: 0n, after: BigInt(result) }]);
    expect(step.writes).toHaveLength(1);
    expect(step.flagsAfter).toEqual(step.flagsBefore);
    expect(stateAfter(model, -1).x.slice(0, 3)).toEqual([BigInt(a), BigInt(b), 0n]);
    expect(stateAfter(model, 0).x.slice(0, 3)).toEqual([BigInt(a), BigInt(b), BigInt(result)]);
  });

  it("keeps the exact supported prefix and boundary inputs in the GNU/QEMU corpus", () => {
    expect(readFileSync("scripts/real-tools/corpus/module0-primitives.s", "utf8")).toContain(
      ADD_ARCHITECTURE_ASSEMBLY,
    );
    const corpus = JSON.parse(
      readFileSync("scripts/real-tools/corpus/module0-primitives.json", "utf8"),
    ) as { calls: { entry: string; args: [string, number][] }[] };
    for (const [a, b] of [
      [3, 3],
      [15, 1],
      [0xffffffff, 1],
      [0, 0],
      [0x7fffffff, 1],
      [0xffffffff, 0xffffffff],
    ])
      expect(corpus.calls).toContainEqual({
        entry: "primitive_add",
        args: [
          [String(a), 32],
          [String(b), 32],
          ["0", 32],
        ],
      });
  });

  it("accepts taught decimal/hexadecimal word notation and rejects malformed or out-of-range inputs", () => {
    expect(["0", "3", " 0XfF ", "4294967295", "0xffffffff"].map(parseWordInput)).toEqual([
      0, 3, 255, 0xffffffff, 0xffffffff,
    ]);
    for (const text of ["", "-1", "1.5", "1,000", "1e3", "0x", "4294967296", "0x100000000"])
      expect(parseWordInput(text)).toBeNull();
  });
});

describe("ADD architecture instruction and inspection states", () => {
  it("runs one ADD before exposing its column, then inspects without another write", () => {
    const { container, store } = mount();
    expect(container.querySelector("[data-output]")).toBeNull();
    expect(container.querySelector('[data-register="w2"]')).toHaveTextContent("0");
    const run = screen.getByRole("button", { name: S.runAdd });
    run.focus();
    execute();
    expect(document.activeElement).toBe(run);
    expect(run).toHaveAttribute("aria-disabled", "true");
    expect(container.querySelector('[data-register="w2"]')).toHaveTextContent("6");
    expect(container.querySelector('[data-output="sum"]')).toHaveTextContent("1");
    expect(container.querySelector('[data-output="carry"]')).toHaveTextContent("1");
    expect(container.querySelectorAll(".al-bit")).toHaveLength(32);
    fireEvent.click(screen.getByRole("button", { name: "Bit 0" }));
    expect(container.querySelector('[data-output="sum"]')).toHaveTextContent("0");
    expect(container.querySelector('[data-register="w2"]')).toHaveTextContent("6");
    execute(); // aria-disabled control must not execute the harness's ret.
    expect(store.slot("architecture")).toMatchObject({ executed: true, bit: 0 });
    fireEvent.click(screen.getByRole("button", { name: S.back }));
    expect(container.querySelector("[data-output]")).toBeNull();
    expect(container.querySelector('[data-register="w2"]')).toHaveTextContent("0");
  });

  it("exposes all eight real column input combinations, keeping both computed outputs", () => {
    const { container } = mount();
    for (let a = 0; a < 2; a++)
      for (let b = 0; b < 2; b++)
        for (let carry = 0; carry < 2; carry++) {
          inputs(String(2 * a + carry), String(2 * b + carry));
          execute();
          const total = a + b + carry;
          expect(container.querySelector('[data-output="sum"]')).toHaveTextContent(
            String(total % 2),
          );
          expect(container.querySelector('[data-output="carry"]')).toHaveTextContent(
            String(Math.floor(total / 2)),
          );
        }
  });

  it("keeps the low-four-bit detail as a crop of the 32-bit result", () => {
    const { container } = mount();
    inputs("15", "1");
    execute();
    fireEvent.click(screen.getByRole("button", { name: "Bit 3" }));
    expect(container.querySelector('[data-register="w2"]')).toHaveTextContent("16");
    expect(
      [...container.querySelectorAll(".al-bit")].map((cell) => cell.textContent).join(""),
    ).toBe("0".repeat(27) + "10000");
    expect(container.querySelector('[data-output="carry"]')).toHaveTextContent("1");
    expect(container).toHaveTextContent("Carry out to bit 4");
    expect(container).not.toHaveTextContent("beyond the four-bit word");
  });

  it("restores executed state and a pending invalid draft without corrupting the loaded model", () => {
    const storage = memoryStorage();
    const first = mount(new LessonStore(storage, "assembly-lab", "restore-architecture"));
    inputs("0xffffffff", "0");
    execute();
    fireEvent.change(screen.getByRole("textbox", { name: "w0" }), { target: { value: "oops" } });
    fireEvent.click(screen.getByRole("button", { name: S.useInputs }));
    expect(first.container.querySelector('[data-register="w2"]')).toHaveTextContent("4294967295");
    first.unmount();
    const restored = mount(new LessonStore(storage, "assembly-lab", "restore-architecture"));
    expect(screen.getByRole("textbox", { name: "w0" })).toHaveValue("oops");
    expect(screen.getByRole("alert")).not.toBeEmptyDOMElement();
    expect(restored.container.querySelector('[data-register="w2"]')).toHaveTextContent(
      "4294967295",
    );
    fireEvent.click(screen.getByRole("button", { name: S.reset }));
    expect(screen.getByRole("textbox", { name: "w0" })).toHaveValue("3");
    expect(restored.container.querySelector("[data-output]")).toBeNull();
    act(() => restored.store.reset());
    expect(restored.container.querySelector('[data-register="w2"]')).toHaveTextContent("0");
  });

  it("uses the separately drafted UI source record", () => {
    const source = readFileSync("packages/views/src/strings.add-architecture.ts", "utf8");
    expect(readFileSync("docs/notes/four-bit-arithmetic/architecture-copy.md", "utf8")).toContain(
      source.trim(),
    );
    mount();
    expect(within(screen.getByRole("group", { name: S.title })).getByRole("link")).toHaveAttribute(
      "href",
      S.lessonLinkHref,
    );
  });
});
