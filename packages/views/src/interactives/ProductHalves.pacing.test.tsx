// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { act, render } from "@testing-library/react";
import { expect, it } from "vitest";
import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";
import { PRODUCT_HALVES } from "../../../../content/lessons/products.listings";
import { ProductHalves } from "./ProductHalves";

const props = {
  program: PRODUCT_HALVES,
  call: {
    entry: "product_halves",
    args: [
      { value: "18446744073709551615", width: 64 },
      { value: "2", width: 64 },
    ],
  },
};
const interactive = (after?: string) =>
  Interactive.parse({
    id: "halves",
    kind: "product-halves",
    timeModel: "steps",
    caption: "Product halves",
    props: { ...props, ...(after === undefined ? {} : { after }) },
  });

it("shows a standalone worked comparison from the actual product registers", () => {
  const { container } = render(
    <ProductHalves
      lesson={{} as Lesson}
      store={new LessonStore(memoryStorage(), "assembly-lab", "halves")}
      interactive={interactive()}
    />,
  );
  expect(container.querySelector(".interactive-problem")).toBeNull();
  expect(container.querySelectorAll(".al-product-half code")).toHaveLength(4);
  expect(
    [...container.querySelectorAll(".al-product-half code")].map((node) => node.textContent),
  ).toEqual([
    "0x0000000000000001",
    "0xfffffffffffffffe",
    "0xffffffffffffffff",
    "0xfffffffffffffffe",
  ]);
});

it("still hides an explicitly gated comparison until its local prediction is committed", () => {
  const store = new LessonStore(memoryStorage(), "assembly-lab", "gated-halves");
  const { container } = render(
    <ProductHalves
      lesson={{} as Lesson}
      store={store}
      interactive={interactive("predict-halves")}
    />,
  );
  expect(container.querySelector(".al-locked")).not.toBeNull();
  expect(container.querySelector('[data-figure="product-halves"]')).toBeNull();
  act(() => store.setSlot("predict-halves", { choice: "any committed answer" }));
  expect(container.querySelector(".al-locked")).toBeNull();
  expect(container.querySelector('[data-figure="product-halves"]')).not.toBeNull();
});
