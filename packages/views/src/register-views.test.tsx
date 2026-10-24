// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { parseRegName } from "@al/machine";
import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";
import { RegisterViews } from "./interactives/RegisterViews";
import { REGISTER_VIEW_STRINGS as S } from "./strings.register-views";

function setup(register?: number) {
  const interactive = Interactive.parse({
    id: "register-names",
    kind: "register-views",
    timeModel: "none",
    caption: "Register names",
    props: register === undefined ? {} : { register },
  });
  return render(
    <RegisterViews
      interactive={interactive}
      lesson={{} as Lesson}
      store={new LessonStore(memoryStorage(), "assembly-lab", "register-views-test")}
    />,
  );
}

describe("one register and its lower-width view", () => {
  it.each([undefined, 30])("contains the narrower name inside the same register (%s)", (n) => {
    const { container } = setup(n);
    const index = n ?? 0;
    const fullName = `x${index}`;
    const lowName = `w${index}`;
    const full = parseRegName(fullName)!;
    const low = parseRegName(lowName)!;
    expect([full.n, low.n]).toEqual([index, index]);
    const diagram = screen.getByRole("img", {
      name: S.description(fullName, full.width, lowName, low.width),
    });
    expect(screen.getAllByRole("img")).toHaveLength(1);
    expect(diagram).toHaveAttribute("data-width", String(full.width));
    const lower = diagram.querySelector(`[data-low-name="${lowName}"]`);
    expect(lower).toHaveAttribute("data-width", String(low.width));
    expect(lower).toHaveTextContent(lowName);
    expect(diagram.querySelector(".al-register-view-heading")).toHaveTextContent(fullName);
    expect(container.querySelectorAll("button, input, .al-insn")).toHaveLength(0);
  });

  it("rejects a nonexistent indexed general-purpose register", () => {
    setup(31);
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByRole("note")).toHaveClass("interactive-problem");
    expect(parseRegName("x31")).toBeNull();
  });
});
