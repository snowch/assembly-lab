// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";
import { BitOpsFigure } from "./interactives/BitOpsFigure";
import { VIEW_STRINGS as S } from "./strings";
import { REGISTER_OR } from "../../../content/lessons/prerequisite-bridges";
import { WARN_FUEL } from "../../../content/lessons/logic-shifts-masks.listings";

describe("register-source logical preparation", () => {
  it("keeps two input controls and their bit patterns independent of the literal experiment", async () => {
    const store = new LessonStore(memoryStorage(), "assembly-lab", "masks");
    const make = (id: string, second: boolean) =>
      Interactive.parse({
        id,
        kind: "bit-ops",
        timeModel: "steps",
        caption: "Logical input source",
        props: {
          functions: [
            {
              entry: second ? "join_warnings" : "warn_fuel",
              program: second ? REGISTER_OR : WARN_FUEL,
              returns: "word",
              second,
            },
          ],
          word: second ? 5 : 0xf,
          secondValue: 8,
          entries: [{ from: 0, to: 0, label: "fuel low" }],
        },
      });
    const { container } = render(
      <>
        <div data-testid="literal">
          <BitOpsFigure lesson={{} as Lesson} interactive={make("literal", false)} store={store} />
        </div>
        <div data-testid="register">
          <BitOpsFigure lesson={{} as Lesson} interactive={make("register", true)} store={store} />
        </div>
      </>,
    );
    const literal = container.querySelector('[data-testid="literal"]')!;
    const register = container.querySelector('[data-testid="register"]')!;
    expect(register.querySelector('[data-row="detail-second"]')).toHaveAttribute("data-value", "8");
    expect(register.querySelector('[data-row="detail-result"]')).toHaveAttribute(
      "data-value",
      "13",
    );
    expect(register.querySelector('[data-row="detail-mask"]')).toBeNull();
    expect(register.querySelector(".al-code-c")).toBeNull();
    const input = within(register as HTMLElement).getByLabelText(S.bitOps.inputLabel("w1"));
    const user = userEvent.setup();
    await user.clear(input);
    await user.type(input, "0x101");
    expect(register.querySelector('[data-row="detail-second"]')).toHaveAttribute(
      "data-value",
      "257",
    );
    expect(register.querySelector('[data-row="detail-result"]')).toHaveAttribute(
      "data-value",
      "261",
    );
    expect(within(literal as HTMLElement).getByLabelText(S.bitOps.inputLabel("w0"))).toHaveValue(
      "0xf",
    );
    const ids = Array.from(container.querySelectorAll("input"), (input) => input.id);
    expect(new Set(ids).size).toBe(ids.length);
    await user.clear(input);
    await user.type(input, "invalid");
    expect(register.querySelector(".al-problem")).not.toBeNull();
    expect(register.querySelector('[data-row="detail-result"]')).toBeNull();
    expect(literal.querySelector('[data-row="detail-result"]')).not.toBeNull();
  });
});
