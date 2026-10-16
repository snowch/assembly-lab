// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

// Module 1's figures, rendered: the register to read, the two listings compared, the predictions the
// assembler and the run answer, the constant tester and the register drawn as two halves. Every
// value on screen is the model's; nothing of a prediction's answer shows before the commit.

import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";

import { ConstantTester } from "./interactives/ConstantTester";
import { ListingCompare, compareListings } from "./interactives/ListingCompare";
import { ModelPrediction } from "./interactives/ModelPrediction";
import { RegisterReader } from "./interactives/RegisterReader";
import { WideStepper } from "./interactives/WideStepper";
import { VIEW_STRINGS as S } from "./strings";

function figure(
  View: typeof RegisterReader,
  id: string,
  kind: string,
  props: Record<string, unknown>,
  store = new LessonStore(memoryStorage(), "assembly-lab", "test"),
) {
  const interactive = Interactive.parse({ id, kind, timeModel: "steps", caption: "c", props });
  const view = render(<View lesson={{} as Lesson} interactive={interactive} store={store} />);
  return { ...view, store };
}

const bit = (n: number) => screen.getByRole("button", { name: S.toggles.bit(n) });
const reading = (container: HTMLElement, name: string) =>
  container.querySelector(`[data-reading="${name}"]`) as HTMLElement;
const value = (container: HTMLElement, name: string) =>
  reading(container, name).querySelector(".al-reading-value")!.textContent;
const sum = (container: HTMLElement, name: string) =>
  reading(container, name).querySelector(".al-sum")!.textContent;

describe("the register to read", () => {
  it("starts with every bit clear: 0x00000000, and 0 both ways", () => {
    const { container } = figure(RegisterReader, "r", "register-reader", { register: "w0" });
    expect(screen.getAllByRole("button")).toHaveLength(32);
    expect(screen.queryAllByRole("button", { pressed: true })).toHaveLength(0);
    expect(reading(container, "hex")).toHaveTextContent("0x00000000");
    expect([value(container, "unsigned"), value(container, "signed")]).toEqual(["0", "0"]);
    expect(sum(container, "unsigned")).toBe("0 = 0");
  });

  it("names the bits 31 to 0, with the top bit first", () => {
    figure(RegisterReader, "r", "register-reader", { register: "w0" });
    expect(screen.getAllByRole("button").map((b) => b.getAttribute("data-bit"))).toEqual(
      Array.from({ length: 32 }, (_, i) => String(31 - i)),
    );
  });

  it("shows the three readings of 0xfffffff4, each with its sum", () => {
    const { container } = figure(RegisterReader, "r", "register-reader", { register: "w0" });
    for (let n = 31; n >= 0; n--) if (n !== 3 && n !== 1 && n !== 0) fireEvent.click(bit(n));
    expect(reading(container, "hex")).toHaveTextContent("0xfffffff4");
    expect(value(container, "unsigned")).toBe("4294967284");
    expect(value(container, "signed")).toBe("\u221212");
    expect(sum(container, "unsigned")).toMatch(
      /^2147483648 \+ 1073741824 \+ .* \+ 4 = 4294967284$/,
    );
    expect(sum(container, "signed")).toMatch(
      /^\u22122147483648 \+ 1073741824 \+ .* \+ 4 = \u221212$/,
    );
    // The digit under each group of four bits.
    expect([...container.querySelectorAll(".al-digit")].map((d) => d.textContent).join("")).toBe(
      "fffffff4",
    );
  });

  it("shows plus and minus 2147483648 for the top bit alone, and an unpressed bit is a 0", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = figure(RegisterReader, "r", "register-reader", { register: "w0" });
    await user.click(bit(31));
    expect(bit(31)).toHaveAttribute("aria-pressed", "true");
    expect(bit(30)).toHaveAttribute("aria-pressed", "false");
    expect(reading(container, "hex")).toHaveTextContent("0x80000000");
    expect(sum(container, "unsigned")).toBe("2147483648 = 2147483648");
    expect(sum(container, "signed")).toBe("\u22122147483648 = \u22122147483648");
    await user.click(bit(31));
    expect(value(container, "unsigned")).toBe("0");
  });
});

describe("the two listings compared", () => {
  const left = {
    c: "int f(int a, int b) { return b - a; }",
    listing: "f:\n  sub w0, w1, w0 C1\n  ret C1",
  };
  const same = {
    c: "unsigned g(unsigned a, unsigned b) { return b - a; }",
    listing: "g:\n  sub w0, w1, w0 C1\n  ret C1",
  };
  const other = {
    c: "int h(int a, int b) { return a - b; }",
    listing: "h:\n  sub w0, w0, w1 C1\n  ret C1",
  };
  const props = (right: typeof same) => ({
    left,
    right,
    question: "**What differs?**",
    options: [
      { value: "same", label: "Nothing." },
      { value: "other", label: "Something." },
    ],
    explain: "They are the same.",
  });

  it("marks a line the same when the model assembles the two to one instruction, and not otherwise", () => {
    expect(compareListings(left, same)).toEqual([
      { left: "sub w0, w1, w0", right: "sub w0, w1, w0", same: true },
      { left: "ret", right: "ret", same: true },
    ]);
    expect(compareListings(left, other).map((r) => r.same)).toEqual([false, true]);
    expect(compareListings(left, { c: "", listing: "k:\n  ret C1" })).toEqual([
      { left: "sub w0, w1, w0", right: "ret", same: false },
      { left: "ret", right: "", same: false },
    ]);
  });

  it("shows the C of both and nothing of the listings or the comparison before the commit", () => {
    const { container } = figure(ListingCompare, "c", "listing-compare", props(same));
    expect(container.querySelectorAll(".al-pane.al-c")).toHaveLength(2);
    expect(container.textContent).not.toContain("sub w0, w1, w0");
    expect(container.querySelector(".al-compare-result")).toBeNull();
    expect(container.querySelector(".al-outcome")).toBeNull();
  });

  it("compares line by line once the prediction is checked, and the model says they match", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = figure(ListingCompare, "c", "listing-compare", props(same));
    await user.click(screen.getByRole("radio", { name: "Nothing." }));
    expect(container.querySelector(".al-compare-result")).toBeNull();
    await user.click(screen.getByRole("button", { name: S.prediction.commit }));
    const rows = [...container.querySelectorAll(".al-compare-row")];
    expect(rows.map((r) => r.getAttribute("data-same"))).toEqual(["true", "true"]);
    expect(within(rows[0] as HTMLElement).getAllByText("sub w0, w1, w0")).toHaveLength(2);
    expect(container.querySelector(".al-match")).toHaveTextContent(S.compare.resultSame);
    expect(container.querySelector(".al-compare-summary")).toHaveTextContent(S.compare.allSame(2));
  });

  it("says a prediction does not match when the listings differ, and marks the line", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = figure(ListingCompare, "c", "listing-compare", props(other));
    await user.click(screen.getByRole("radio", { name: "Nothing." }));
    await user.click(screen.getByRole("button", { name: S.prediction.commit }));
    expect(container.querySelector(".al-nomatch")).toHaveTextContent(S.compare.resultDiffer);
    expect(
      [...container.querySelectorAll(".al-compare-row")].map((r) => r.getAttribute("data-same")),
    ).toEqual(["false", "true"]);
    expect(container.querySelector(".al-compare-summary")).toHaveTextContent(S.compare.notAllSame);
  });
});

describe("the prediction about which constant fits", () => {
  const props = {
    question: "**Which fits?**",
    options: ["65536", "70000", "100000", "1000000"].map((v) => ({ value: v, label: v })),
    explain: "Only one.",
    measure: { kind: "constant-fits" },
  };

  it("asks the assembler only after the commit, and the right option is the one it took", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = figure(ModelPrediction, "p", "model-prediction", props);
    expect(container.querySelector(".al-outcome")).toBeNull();
    await user.click(screen.getByRole("radio", { name: "65536" }));
    expect(container.querySelector(".al-outcome")).toBeNull();
    await user.click(screen.getByRole("button", { name: S.prediction.commit }));
    expect(container.querySelector(".al-match")).toHaveTextContent(
      S.fits.one("65536", 3).replaceAll("`", ""),
    );
  });

  it("does not match a constant the assembler refused, and says which one it took", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = figure(ModelPrediction, "p", "model-prediction", props);
    await user.click(screen.getByRole("radio", { name: "1000000" }));
    await user.click(screen.getByRole("button", { name: S.prediction.commit }));
    expect(container.querySelector(".al-nomatch")).toHaveTextContent(
      S.fits.one("65536", 3).replaceAll("`", ""),
    );
    expect(container.querySelector(".al-chose")).toHaveTextContent("1000000");
  });
});

describe("the prediction about a register of 64 bits", () => {
  const props = {
    question: "**What does x3 hold?**",
    options: [
      { value: "all-set", label: "All 64 bits set." },
      { value: "low-set", label: "The lower half set." },
      { value: "unknown", label: "Unknown." },
      { value: "error", label: "An error." },
    ],
    explain: "Writing w clears the upper half.",
    measure: {
      kind: "register-at-end",
      program: { c: "", listing: "mov x3, -1\nmov w3, -1\nret" },
      register: 3,
    },
  };

  it("runs the program after the commit and finds the lower 32 bits set and the upper 32 cleared", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = figure(ModelPrediction, "p", "model-prediction", props);
    await user.click(screen.getByRole("radio", { name: "The lower half set." }));
    await user.click(screen.getByRole("button", { name: S.prediction.commit }));
    expect(container.querySelector(".al-match")).toHaveTextContent(
      S.wide.endedWith("x3", "0x00000000ffffffff").replaceAll("`", ""),
    );
  });

  it("does not match the answer that the 64 bits stay set", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = figure(ModelPrediction, "p", "model-prediction", props);
    await user.click(screen.getByRole("radio", { name: "All 64 bits set." }));
    await user.click(screen.getByRole("button", { name: S.prediction.commit }));
    expect(container.querySelector(".al-nomatch")).toBeInTheDocument();
  });

  it("with only the first mov, would find all 64 bits set: the program is what decides", async () => {
    const user = userEvent.setup({ delay: null });
    const first = {
      ...props,
      measure: { ...props.measure, program: { c: "", listing: "mov x3, -1\nret" } },
    };
    const { container } = figure(ModelPrediction, "p", "model-prediction", first);
    await user.click(screen.getByRole("radio", { name: "All 64 bits set." }));
    await user.click(screen.getByRole("button", { name: S.prediction.commit }));
    expect(container.querySelector(".al-match")).toHaveTextContent("0xffffffffffffffff");
  });
});

describe("the constant tester", () => {
  const type = async (text: string) => {
    const user = userEvent.setup({ delay: null });
    const box = screen.getByRole("textbox", { name: S.tester.input });
    await user.clear(box);
    if (text !== "") await user.type(box, text);
  };

  it("asks for a number before one is typed", () => {
    const { container } = figure(ConstantTester, "t", "constant-tester", {});
    expect(container.querySelector(".al-tester-result")).toHaveTextContent(
      S.tester.empty.replaceAll("`", ""),
    );
    expect(container.querySelector("[data-register]")).toBeNull();
  });

  it("shows w0 as the model leaves it for a number one mov holds, and the machine's sentence for one it does not", async () => {
    const { container } = figure(ConstantTester, "t", "constant-tester", {});
    await type("65536");
    expect(container.querySelector(".al-match")).toHaveTextContent(
      S.tester.fits("65536").replaceAll("`", ""),
    );
    expect(container.querySelector('[data-register="w0"] .al-reg-value')).toHaveTextContent(
      "65536",
    );
    await type("1000000");
    expect(container.querySelector(".al-nomatch")).toHaveTextContent(
      "No single instruction can put mov w0, 1000000 in a register.",
    );
    expect(container.querySelector("[data-register]")).toBeNull();
  });

  it("shows -1 as the 32 bits all set, and accepts a number in hexadecimal", async () => {
    const { container } = figure(ConstantTester, "t", "constant-tester", {});
    await type("-1");
    expect(container.querySelector('[data-register="w0"] .al-reg-value')).toHaveTextContent(
      "4294967295",
    );
    await type("0x00010001");
    expect(container.querySelector('[data-register="w0"] .al-reg-value')).toHaveTextContent(
      "65537",
    );
  });

  it("does not hand text that is not a number to the assembler", async () => {
    const { container } = figure(ConstantTester, "t", "constant-tester", {});
    await type("w1");
    expect(container.querySelector(".al-tester-result")).toHaveTextContent(S.tester.notNumber);
    expect(container.querySelector("[data-register]")).toBeNull();
  });

  it("stays shut until the prediction it names is checked", () => {
    const { container } = figure(ConstantTester, "t", "constant-tester", { after: "p" });
    expect(container.querySelector(".al-locked")).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).toBeNull();
  });
});

describe("the register drawn as two halves", () => {
  const props = {
    program: { c: "", listing: "mov x3, -1\nmov w3, -1\nret" },
    register: 3,
  };
  const x3 = (container: HTMLElement) => container.querySelector('[data-register="x3"]')!;
  const half = (container: HTMLElement, which: string) =>
    [...x3(container).querySelectorAll(`[data-half="${which}"] .al-bit`)].map((b) => b.textContent);

  it("starts with x3 at 0 and no C pane, since the program has no C", () => {
    const { container } = figure(WideStepper, "w", "wide-stepper", props);
    expect(x3(container).querySelector(".al-reg-value")).toHaveTextContent("0x0000000000000000");
    expect(container.querySelector(".al-pane.al-c")).toBeNull();
    expect(half(container, "upper")).toHaveLength(32);
    expect(half(container, "lower")).toHaveLength(32);
  });

  it("sets all 64 bits with mov x3, -1, then clears the upper 32 with mov w3, -1", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = figure(WideStepper, "w", "wide-stepper", props);
    await user.click(screen.getByRole("button", { name: S.stepper.next }));
    expect(x3(container).querySelector(".al-reg-value")).toHaveTextContent("0xffffffffffffffff");
    expect(half(container, "upper").join("")).toBe("1".repeat(32));
    expect(x3(container)).toHaveAttribute("data-changed", "true");
    await user.click(screen.getByRole("button", { name: S.stepper.next }));
    expect(x3(container).querySelector(".al-reg-value")).toHaveTextContent("0x00000000ffffffff");
    expect(half(container, "upper").join("")).toBe("0".repeat(32));
    expect(half(container, "lower").join("")).toBe("1".repeat(32));
    await user.click(screen.getByRole("button", { name: S.stepper.next }));
    expect(screen.getByRole("status")).toHaveTextContent(S.stepper.ended);
    expect(screen.getByRole("button", { name: S.stepper.next })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: S.stepper.reset }));
    expect(x3(container).querySelector(".al-reg-value")).toHaveTextContent("0x0000000000000000");
  });

  it("names the lower half w3", () => {
    const { container } = figure(WideStepper, "w", "wide-stepper", props);
    expect(container.querySelector('[data-half="lower"] .al-half-name')).toHaveTextContent(
      S.wide.lower("w3"),
    );
  });

  it("stays shut until the prediction it names is checked", async () => {
    const store = new LessonStore(memoryStorage(), "assembly-lab", "test");
    const { container } = figure(WideStepper, "w", "wide-stepper", { ...props, after: "p" }, store);
    expect(container.querySelector(".al-locked")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: S.stepper.next })).toBeNull();
  });
});
