// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";
import { CompilerPlayground } from "./interactives/CompilerPlayground";
import { COMPILER_STRINGS as C } from "./strings.compiler";
import { VIEW_STRINGS as S } from "./strings";
it("shows registers used by instructions without treating a C function name as a register", () => {
  const source =
    "unsigned w999(unsigned value) { unsigned a=value; unsigned b=a; unsigned c=b; unsigned d=c; return d+7; }";
  const { container } = render(
    <CompilerPlayground
      lesson={{} as Lesson}
      interactive={Interactive.parse({
        id: "compiler",
        kind: "compiler-playground",
        timeModel: "steps",
        caption: "test",
        props: {
          source,
          args: [6],
          signature: "unsigned w999(unsigned value)",
          names: ["value", "a", "b", "c", "d"],
        },
      })}
      store={new LessonStore(memoryStorage(), "assembly-lab", "test")}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: C.playground.run }));
  expect(container.querySelector('[data-compiler-step="0"]')).not.toBeNull();
  expect(container.querySelector('[data-register="w4"]')).not.toBeNull();
  expect(container.querySelector('[data-register="w999"]')).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: S.stepper.next }));
  const status = screen.getByRole("status");
  expect(status.textContent).toMatch(/^Ran /);
  expect(status.textContent).not.toContain("`");
  expect(status.querySelector("code")).not.toBeNull();
});

it("reports the machine instruction limit rather than a returned-value disagreement", () => {
  const source =
    "unsigned f(unsigned count) { unsigned total=0; for(unsigned i=0;i<count;i++){total=total+1;} return total; }";
  const { container } = render(
    <CompilerPlayground
      lesson={{} as Lesson}
      interactive={Interactive.parse({
        id: "budget",
        kind: "compiler-playground",
        timeModel: "steps",
        caption: "test",
        props: {
          source,
          args: [800],
          signature: "unsigned f(unsigned count)",
          names: ["count", "total", "i"],
        },
      })}
      store={new LessonStore(memoryStorage(), "assembly-lab", "budget")}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: C.playground.run }));
  expect(screen.getByRole("alert")).toHaveTextContent("10000");
  expect(screen.getByRole("alert")).not.toHaveTextContent(C.playground.machineFailed);
  expect(container.querySelector("[data-compiler-step]")).toBeNull();
});

it("names the loop phase beside the next instruction while the C highlight remains on the for header", () => {
  const source =
    "unsigned f(unsigned count) { unsigned total=0; for(unsigned i=0;i<count;i++){total=total+1;} return total; }";
  const { container } = render(
    <CompilerPlayground
      lesson={{} as Lesson}
      interactive={Interactive.parse({
        id: "phase",
        kind: "compiler-playground",
        timeModel: "steps",
        caption: "test",
        props: {
          source,
          args: [2],
          signature: "unsigned f(unsigned count)",
          names: ["count", "total", "i"],
        },
      })}
      store={new LessonStore(memoryStorage(), "assembly-lab", "phase")}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: C.playground.run }));
  const observed = new Set<string>();
  for (let step = 0; step < 40; step++) {
    const phase = container.querySelector(".al-compiler-phase")?.textContent;
    if (phase) observed.add(phase);
    const next = screen.getByRole("button", { name: S.stepper.next });
    if (next.hasAttribute("disabled")) break;
    fireEvent.click(next);
  }
  expect(observed).toEqual(new Set(Object.values(C.playground.loopPhase)));
});
