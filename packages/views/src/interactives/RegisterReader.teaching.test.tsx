// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { fireEvent, render } from "@testing-library/react";
import { expect, it } from "vitest";
import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";
import { RegisterReader } from "./RegisterReader";
import { READER_STRINGS as R } from "../strings.reader";
import { MODULE1_STRINGS as M1 } from "../strings.module1";

const start = {
  program: { c: "", listing: "read_bits:\n ret" },
  call: { entry: "read_bits", args: [-1] },
};
function figure(props: Record<string, unknown> = {}) {
  return render(
    <RegisterReader
      lesson={{} as Lesson}
      store={new LessonStore(memoryStorage(), "assembly-lab", "teaching-test")}
      interactive={Interactive.parse({
        id: "reader",
        kind: "register-reader",
        timeModel: "steps",
        caption: "Bits",
        props: { register: "w0", teachingReadings: true, start, ...props },
      })}
    />,
  );
}

it("starts unsigned, names all views and pairs selected positions with their model weights", () => {
  const view = figure();
  expect(view.getByRole("button", { name: R.views.unsigned })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(view.getByRole("button", { name: R.views.signed })).toBeVisible();
  expect(view.getByRole("button", { name: R.views.compare })).toBeVisible();
  expect(view.container.querySelectorAll('.al-toggle[aria-pressed="true"]')).toHaveLength(32);
  expect(view.container.querySelector('[data-reading="signed"]')).toBeNull();
  expect(view.container.querySelector('[data-reading="unsigned"]')).toHaveTextContent(
    "4,294,967,295",
  );
  const strip = view.container.querySelector(".al-weight-strip")!;
  expect(
    [...strip.querySelectorAll("thead [data-weight-bit]")].map((cell) => cell.textContent),
  ).toEqual(["31", "30", "3", "2", "1", "0"]);
  expect(
    strip.querySelector('[data-weight-row="unsigned"] [data-weight-bit="31"]'),
  ).toHaveTextContent("2,147,483,648");
  expect(strip.textContent).not.toContain("·");
  expect(view.container.querySelector("details.al-calc")).not.toHaveAttribute("open");
});

it("changes readings without changing bits, keeps a cleared bit's weight and resets to the example", () => {
  const view = figure();
  fireEvent.click(view.getByRole("button", { name: R.views.signed }));
  expect(view.container.querySelector('[data-reading="signed"]')).toHaveTextContent("−1");
  fireEvent.click(view.container.querySelector('.al-toggle[data-bit="31"]')!);
  expect(view.container.querySelector('[data-reading="hex"]')).toHaveTextContent("0x7fffffff");
  expect(
    view.container.querySelector('[data-weight-row="value"] [data-weight-bit="31"]'),
  ).toHaveTextContent("0");
  expect(
    view.container.querySelector('[data-weight-row="signed"] [data-weight-bit="31"]'),
  ).toHaveTextContent("−2,147,483,648");
  expect(view.container.querySelector('[data-row="top"] [data-cell="signed"]')).toHaveTextContent(
    "0",
  );
  fireEvent.click(view.getByRole("button", { name: R.views.compare }));
  expect(view.container.querySelector('[data-reading="unsigned"]')).toHaveTextContent(
    "2,147,483,647",
  );
  expect(view.container.querySelector('[data-reading="signed"]')).toHaveTextContent(
    "2,147,483,647",
  );
  fireEvent.click(view.getByRole("button", { name: M1.reader.clearBits }));
  expect(view.getByRole("button", { name: R.views.compare })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(view.container.querySelectorAll('.al-toggle[aria-pressed="true"]')).toHaveLength(0);
  fireEvent.click(view.getByRole("button", { name: R.reset }));
  expect(view.getByRole("button", { name: R.views.unsigned })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(view.container.querySelectorAll('.al-toggle[aria-pressed="true"]')).toHaveLength(32);
});

it("leaves hexadecimal-only and legacy scratch readers outside the teaching modes", () => {
  const hex = figure({ hexOnly: true });
  expect(hex.queryByRole("button", { name: R.views.unsigned })).toBeNull();
  expect(hex.container.querySelector(".al-weight-strip")).toBeNull();
  hex.unmount();
  const scratch = figure({ teachingReadings: false, topBit: true, disclosure: "Scratch" });
  expect(scratch.queryByRole("button", { name: R.views.unsigned })).toBeNull();
  expect(scratch.container.querySelector(".al-reader-scratch")).not.toHaveAttribute("open");
  expect(scratch.container.querySelectorAll(".al-top-table [data-reading]")).toHaveLength(2);
});
