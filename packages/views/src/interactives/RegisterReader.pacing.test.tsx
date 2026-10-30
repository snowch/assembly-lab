// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { fireEvent, render } from "@testing-library/react";
import { expect, it } from "vitest";
import { RegisterReader } from "./RegisterReader";
import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";
import { MODULE1_STRINGS as M1 } from "../strings.module1";

it("lets the hexadecimal activity edit and clear a pattern before showing numerical readings", () => {
  const view = render(
    <RegisterReader
      lesson={{} as Lesson}
      store={new LessonStore(memoryStorage(), "assembly-lab", "hex-test")}
      interactive={Interactive.parse({
        id: "hex",
        kind: "register-reader",
        timeModel: "steps",
        caption: "Hexadecimal",
        props: { register: "w0", hexOnly: true },
      })}
    />,
  );
  expect(
    view.container.querySelectorAll('[data-reading="signed"], [data-reading="unsigned"]'),
  ).toHaveLength(0);
  const hex = () => view.container.querySelector('[data-reading="hex"] code')!.textContent;
  expect(hex()).toBe("0x00000000");
  fireEvent.click(view.container.querySelector('[data-bit="0"]')!);
  expect(hex()).toBe("0x00000001");
  fireEvent.change(view.getByRole("textbox", { name: M1.hexEntry.label }), {
    target: { value: "0xf4" },
  });
  expect(hex()).toBe("0x000000f4");
  expect(view.container.querySelectorAll('.al-toggle[aria-pressed="true"]')).toHaveLength(5);
  fireEvent.click(view.getByRole("button", { name: M1.reader.clearBits }));
  expect(hex()).toBe("0x00000000");
});
