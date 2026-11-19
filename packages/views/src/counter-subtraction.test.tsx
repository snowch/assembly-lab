// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { render } from "@testing-library/react";
import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";
import { expect, it } from "vitest";
import { CounterSubtraction, counterSubtractionWork } from "./interactives/CounterSubtraction";
import { fourBitSubtraction } from "./four-bit-arithmetic";

it("connects the worked wrapped difference to inversion, addition and the forward path", () => {
  const work = counterSubtractionWork();
  expect(work.width).toBe(4);
  expect(work.subtraction.b.pattern).toBe("1110");
  expect(work.subtraction.negation.inverted.pattern).toBe("0001");
  expect(work.subtraction.negation.after.pattern).toBe("0010");
  expect(work.subtraction.result.pattern).toBe("0010");
  expect(work.timeline).toEqual([14, 15, 0]);
  expect(work.timeline.length - 1).toBe(work.subtraction.result.unsigned);
  // The reminder's rule applies to unfamiliar values too, including negating zero.
  for (const [now, then] of [
    [1, 15],
    [9, 4],
    [0, 0],
  ]) {
    const result = fourBitSubtraction(now!, then!);
    expect(result.result.unsigned).toBe((now! - then! + 16) % 16);
    expect(result.addition.result.pattern).toBe(result.result.pattern);
  }
});

it("shows a worked calculation with an explicit width bridge and no processor-step controls", () => {
  const { container } = render(
    <CounterSubtraction
      lesson={{} as Lesson}
      store={new LessonStore(memoryStorage(), "assembly-lab", "counter-reminder")}
      interactive={Interactive.parse({
        id: "reminder",
        kind: "counter-subtraction",
        caption: "Counter subtraction",
        timeModel: "none",
        props: {},
      })}
    />,
  );
  expect(container.querySelector('[data-stage="invert"]')).toHaveTextContent("1110 → 0001");
  expect(container.querySelector('[data-stage="add-one"]')).toHaveTextContent("0001 + 1 = 0010");
  expect(container.querySelector('[data-stage="add-later"]')).toHaveTextContent(
    "0000 + 0010 = 0010",
  );
  expect(container).toHaveTextContent("fewer than 16 ticks");
  expect(container).toHaveTextContent("one sub instruction");
  expect(container).toHaveTextContent("keeping 32 result bits instead of 4");
  expect(container.querySelectorAll("button")).toHaveLength(0);
});
