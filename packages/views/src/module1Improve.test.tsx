// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

// The figures Module 1's improvement pass adds, rendered: the register to read with the top bit's
// table (and its start, its "Clear bits" button and its closed calculation), the outline that pairs
// four bits with their digit, the hexadecimal box beside a field of bits, a `w` register as two
// halves of 16 bits (for a recorded program and for the learner's own saved work), `x3` as one
// box with `w3` inside it, and the note that waits for a challenge. Every value on screen is the
// model's, and nothing of a solution shows before the challenge has been passed.

import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Challenge, Interactive, type Artifact, type Lesson } from "@platform/lesson-schema";

import { AnswerEditor } from "./AnswerEditor";
import { grade } from "./grader";
import { ChallengeNote } from "./interactives/ChallengeNote";
import { RegisterReader } from "./interactives/RegisterReader";
import { WideStepper } from "./interactives/WideStepper";
import { BIT_READINGS, readingsOfPattern } from "./index";
import { VIEW_STRINGS as S } from "./strings";
import { ARITH_STRINGS as A } from "./strings.arith";
import { MODULE1_STRINGS as M1 } from "./strings.module1";

function figure(
  View: typeof RegisterReader,
  id: string,
  kind: string,
  props: Record<string, unknown>,
  options: { store?: LessonStore; lesson?: Lesson } = {},
) {
  const store = options.store ?? new LessonStore(memoryStorage(), "assembly-lab", "test");
  const interactive = Interactive.parse({ id, kind, timeModel: "steps", caption: "c", props });
  const view = render(
    <View lesson={options.lesson ?? ({} as Lesson)} interactive={interactive} store={store} />,
  );
  return { ...view, store };
}

const bit = (n: number) => screen.getByRole("button", { name: S.toggles.bit(n) });
const FUEL = { c: "", listing: "fuel_used_wrong:\n  sub w0, w1, w0\n  ret" };
const FUEL_START = { program: FUEL, call: { entry: "fuel_used_wrong", args: [50, 38] } };
const MINUS = "\u2212";

describe("the register to read, with the top bit's table", () => {
  const props = { register: "w0", start: FUEL_START, topBit: true };
  const cells = (container: HTMLElement, row: string) =>
    [...container.querySelectorAll(`tr[data-row="${row}"] td`)].map((c) => c.textContent);
  const pattern = (container: HTMLElement) =>
    container.querySelector('[data-reading="hex"] .al-reading-value')?.textContent;

  it("starts at the pattern the model leaves in w0 after fuel_used_wrong(50, 38): 0xfffffff4", () => {
    const { container } = figure(RegisterReader, "r", "register-reader", props);
    expect(pattern(container)).toBe("0xfffffff4");
    // 28 ones in fffffff, then the one in 0100.
    expect(screen.getAllByRole("button", { pressed: true })).toHaveLength(29);
    expect(bit(31)).toHaveAttribute("aria-pressed", "true");
    expect(bit(2)).toHaveAttribute("aria-pressed", "true");
    expect(bit(3)).toHaveAttribute("aria-pressed", "false");
  });

  it("gives 4294967284 and −12 in the table's result row, from the top bit's part and the other 31 bits", () => {
    const { container } = figure(RegisterReader, "r", "register-reader", props);
    expect(cells(container, "top")).toEqual(["+2147483648", `${MINUS}2147483648`]);
    expect(cells(container, "other")).toEqual(["+2147483636", "+2147483636"]);
    expect(cells(container, "result")).toEqual(["4294967284", `${MINUS}12`]);
    expect(
      container.querySelector('[data-reading="unsigned"] .al-reading-value'),
    ).toHaveTextContent("4294967284");
    expect(container.querySelector('[data-reading="signed"] .al-reading-value')).toHaveTextContent(
      `${MINUS}12`,
    );
  });

  it("has the columns Unsigned reading and Signed reading, and the rows Top bit (bit 31), Other 31 bits and Result", () => {
    const { container } = figure(RegisterReader, "r", "register-reader", props);
    expect([...container.querySelectorAll("thead th")].map((c) => c.textContent)).toEqual([
      S.reader.unsigned,
      S.reader.signed,
    ]);
    expect([...container.querySelectorAll("tbody th")].map((c) => c.textContent)).toEqual([
      M1.reader.topBitRow,
      M1.reader.otherRow,
      M1.reader.resultRow,
    ]);
    expect(M1.reader.topBitRow).toBe("Top bit (bit 31)");
    expect(M1.reader.otherRow).toBe("Other 31 bits");
  });

  it("updates both readings when bit 31 is toggled, and they agree once it is 0", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = figure(RegisterReader, "r", "register-reader", props);
    await user.click(bit(31));
    expect(pattern(container)).toBe("0x7ffffff4");
    expect(cells(container, "top")).toEqual(["0", "0"]);
    expect(cells(container, "other")).toEqual(["+2147483636", "+2147483636"]);
    expect(cells(container, "result")).toEqual(["2147483636", "2147483636"]);
    await user.click(bit(31));
    expect(cells(container, "result")).toEqual(["4294967284", `${MINUS}12`]);
  });

  it("has the two readings agree for every pattern whose top bit is 0", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = figure(RegisterReader, "r", "register-reader", props);
    await user.click(bit(31));
    for (const n of [30, 7, 0, 12]) {
      await user.click(bit(n));
      const [u, s] = cells(container, "result");
      expect(u).toBe(s);
    }
  });

  it("writes each digit under its four bits, as the model holds them", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = figure(RegisterReader, "r", "register-reader", props);
    await user.click(bit(31));
    await user.click(bit(20));
    await user.click(bit(5));
    const buttons = [...container.querySelectorAll(".al-toggle")];
    const digits = [...container.querySelectorAll(".al-digit")].map((d) => d.textContent);
    expect(digits).toHaveLength(8);
    digits.forEach((digit, i) => {
      const four = buttons
        .slice(i * 4, i * 4 + 4)
        .map((b) => (b.getAttribute("aria-pressed") === "true" ? "1" : "0"))
        .join("");
      expect(parseInt(four, 2).toString(16), `digit ${i}`).toBe(digit);
    });
  });

  it("clears all 32 bits with Clear bits, and the readings are 0", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = figure(RegisterReader, "r", "register-reader", props);
    await user.click(screen.getByRole("button", { name: M1.reader.clearBits }));
    expect(screen.queryAllByRole("button", { pressed: true })).toHaveLength(0);
    expect(pattern(container)).toBe("0x00000000");
    expect(cells(container, "result")).toEqual(["0", "0"]);
    // And the button leaves the figure usable: set a bit again.
    await user.click(bit(0));
    expect(cells(container, "result")).toEqual(["1", "1"]);
  });

  it("labels the pattern as the pattern, outside the table of readings", () => {
    const { container } = figure(RegisterReader, "r", "register-reader", props);
    const line = container.querySelector('[data-reading="hex"]')!;
    expect(line.querySelector(".al-reading-name")).toHaveTextContent(M1.reader.pattern);
    expect(container.querySelector("table")!.contains(line)).toBe(false);
    expect(container.querySelector("table")).toHaveAccessibleName(M1.reader.table);
  });

  it("holds the full sums of every bit in a closed Show calculation, with the table outside it", () => {
    const { container } = figure(RegisterReader, "r", "register-reader", props);
    const calc = container.querySelector("details.al-calc") as HTMLDetailsElement;
    expect(calc.open).toBe(false);
    expect(calc.querySelector("summary")).toHaveTextContent("Show calculation");
    expect(calc.contains(container.querySelector("table"))).toBe(false);
    const sums = [...calc.querySelectorAll(".al-sum")].map((s) => s.textContent);
    expect(sums[0]).toMatch(/^2147483648 \+ 1073741824 \+ .* \+ 4 = 4294967284$/);
    expect(sums[1]).toMatch(
      new RegExp(`^${MINUS}2147483648 \\+ 1073741824 \\+ .* \\+ 4 = ${MINUS}12$`),
    );
    // The table's own cells hold no sum.
    expect(container.querySelector("table .al-sum")).toBeNull();
  });

  it("opens the calculation with the keyboard, and the table does not move", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = figure(RegisterReader, "r", "register-reader", props);
    const table = container.querySelector("table")!;
    const calc = container.querySelector("details.al-calc") as HTMLDetailsElement;
    // The table comes before the calculation in the page, so opening it moves nothing above it.
    expect(table.compareDocumentPosition(calc) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    const summary = calc.querySelector("summary") as HTMLElement;
    summary.focus();
    await user.keyboard("{Enter}");
    // jsdom does not toggle on Enter; the control is the native one, which a browser toggles.
    expect(summary.tagName).toBe("SUMMARY");
    expect(summary).toHaveFocus();
  });

  it("marks bit 31 as the top bit, in shape and in words", () => {
    const { container } = figure(RegisterReader, "r", "register-reader", props);
    expect(container.querySelectorAll('.al-toggle[data-top="true"]')).toHaveLength(1);
    expect(bit(31)).toHaveAttribute("data-top", "true");
    expect(container.querySelector(".al-top-flag")).toHaveTextContent(M1.toggles.topBit);
    expect(container.querySelector(".al-toggles")).toHaveAttribute("data-top-bit", "marked");
  });

  it("outlines the four bits and the digit together while one of the bits has the pointer or the focus", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = figure(RegisterReader, "r", "register-reader", props);
    const lit = () =>
      [...container.querySelectorAll('.al-nibble[data-lit="true"]')].map((n) =>
        [...container.querySelectorAll(".al-nibble")].indexOf(n),
      );
    expect(lit()).toEqual([]);
    await user.hover(bit(21));
    expect(lit()).toEqual([2]);
    // The lit group holds the group's four buttons and its digit.
    const group = container.querySelector('.al-nibble[data-lit="true"]')!;
    expect(
      [...group.querySelectorAll(".al-toggle")].map((b) => b.getAttribute("data-bit")),
    ).toEqual(["23", "22", "21", "20"]);
    expect(group.querySelector(".al-digit")).toHaveAttribute("data-digit", "2");
    await user.unhover(bit(21));
    expect(lit()).toEqual([]);
    act(() => bit(9).focus());
    expect(lit()).toEqual([5]);
    act(() => bit(9).blur());
    expect(lit()).toEqual([]);
    fireEvent.focus(bit(0));
    expect(lit()).toEqual([7]);
  });

  it("is the register every other lesson has when it is given neither the start nor the table", () => {
    const { container } = figure(RegisterReader, "r", "register-reader", { register: "w0" });
    expect(container.querySelector("table")).toBeNull();
    expect(container.querySelector("details")).toBeNull();
    expect(screen.queryByRole("button", { name: M1.reader.clearBits })).toBeNull();
    expect(container.querySelector(".al-top-flag")).toBeNull();
    expect(container.querySelector("[data-top-bit], [data-groups]")).toBeNull();
    expect(container.querySelector(".al-nibble[data-lit]")).toBeNull();
    expect(container.querySelector('[data-reading="hex"] .al-reading-name')).toHaveTextContent(
      S.reader.hex,
    );
    expect(screen.queryAllByRole("button", { pressed: true })).toHaveLength(0);
  });
});

describe("the hexadecimal box beside a field of bits", () => {
  const MAKE = Challenge.parse({
    id: "make",
    title: "Make",
    task: "Set the bits.",
    gradedDirection: "answer",
    fields: [
      { id: "bits", label: "the bits of `w0`", kind: "bits", width: 32, weights: "signed" },
      { id: "unsigned", label: "its unsigned reading", kind: "number" },
    ],
    initial: { data: { hexEntry: ["bits"] } },
    tests: {
      kind: "answers",
      grader: BIT_READINGS,
      cases: [
        { label: "the bits of w0", given: { reading: "signed" }, expect: { bits: -1 } },
        {
          label: "its unsigned reading",
          given: { reading: "unsigned" },
          expect: { unsigned: "bits" },
        },
      ],
    },
    hints: ["a", "b", "c", "d", "e"],
    reference: { answers: { bits: "1".repeat(32), unsigned: "4294967295" } },
  });
  const PLAIN = Challenge.parse({ ...MAKE, id: "plain", initial: {} });
  const lesson = {} as Lesson;

  /** The editor with its artifact kept, as the runtime keeps it. */
  function Harness({ challenge, seen }: { challenge: typeof MAKE; seen: { artifact: Artifact } }) {
    const [artifact, setArtifact] = useState<Artifact>(challenge.initial);
    seen.artifact = artifact;
    return (
      <AnswerEditor
        lesson={lesson}
        challenge={challenge}
        artifact={artifact}
        onChange={setArtifact}
      />
    );
  }
  const mount = (challenge = MAKE) => {
    const seen = { artifact: {} as Artifact };
    const view = render(<Harness challenge={challenge} seen={seen} />);
    const box = () => screen.getByRole("textbox", { name: M1.hexEntry.label }) as HTMLInputElement;
    return { ...view, seen, box };
  };
  const type = async (box: HTMLInputElement, text: string) => {
    const user = userEvent.setup({ delay: null });
    await user.clear(box);
    if (text !== "") await user.type(box, text);
  };

  it("is there for a field that names it, and not for a challenge that does not", () => {
    mount();
    expect(screen.getByRole("textbox", { name: M1.hexEntry.label })).toBeInTheDocument();
  });

  it("is absent for a challenge whose data does not name the field", () => {
    mount(PLAIN);
    expect(screen.queryByRole("textbox", { name: M1.hexEntry.label })).toBeNull();
    expect(screen.getAllByRole("button")).toHaveLength(32);
  });

  it("starts as the bits are, 0x00000000, and fills in nothing", () => {
    const { box, seen } = mount();
    expect(box().value).toBe("0x00000000");
    expect(seen.artifact.answers).toBeUndefined();
  });

  it("sets the bits when ffffffff or 0xffffffff is typed, and keeps the stored answer as 32 characters", async () => {
    for (const text of ["ffffffff", "0xffffffff"]) {
      const { box, seen, unmount } = mount();
      await type(box(), text);
      expect(screen.getAllByRole("button", { pressed: true }), text).toHaveLength(32);
      expect(seen.artifact.answers?.["bits"], text).toBe("1".repeat(32));
      unmount();
    }
  });

  it("sets the low bits for fewer digits, and leaves the other bits clear", async () => {
    const { box, seen } = mount();
    await type(box(), "a5");
    expect(seen.artifact.answers?.["bits"]).toBe("0".repeat(24) + "10100101");
  });

  it("updates the text when a bit is toggled", async () => {
    const user = userEvent.setup({ delay: null });
    const { box } = mount();
    await user.click(bit(31));
    expect(box().value).toBe("0x80000000");
    await user.click(bit(0));
    expect(box().value).toBe("0x80000001");
  });

  it("follows the buttons after text has been typed, and then the text again", async () => {
    const user = userEvent.setup({ delay: null });
    const { box } = mount();
    await type(box(), "ff");
    expect(box().value).toBe("ff");
    await user.click(bit(8));
    expect(box().value).toBe("0x000001ff");
  });

  it("changes no bit for text that is not hexadecimal or has more than eight digits, and says so", async () => {
    const user = userEvent.setup({ delay: null });
    const { box, seen } = mount();
    await user.click(bit(4));
    const before = seen.artifact.answers?.["bits"];
    // Each is put in the box whole, as a paste puts it. (Typed one key at a time, the first eight
    // digits of nine are text that is valid, and set the bits before the ninth makes it invalid.)
    for (const text of ["xyz", "fffffffff", "0xg1", "12 34"]) {
      fireEvent.change(box(), { target: { value: text } });
      expect(seen.artifact.answers?.["bits"], text).toBe(before);
      expect(screen.getByRole("status")).toHaveTextContent(M1.hexEntry.invalid);
      expect(box()).toHaveAttribute("aria-invalid", "true");
    }
    // Typing something valid again clears the message and sets the bits.
    await type(box(), "10");
    expect(screen.getByRole("status")).toHaveTextContent("");
    expect(seen.artifact.answers?.["bits"]).toBe("0".repeat(27) + "10000");
  });

  it("does not say the text is invalid while it is empty, or only 0x", async () => {
    const { box } = mount();
    await type(box(), "");
    expect(screen.getByRole("status")).toHaveTextContent("");
    await type(box(), "0x");
    expect(screen.getByRole("status")).toHaveTextContent("");
    expect(box()).not.toHaveAttribute("aria-invalid");
  });

  it("grades the bits and the unsigned answer as before, whichever way the bits were set", async () => {
    const { box, seen } = mount();
    await type(box(), "ffffffff");
    const unsigned = screen.getByRole("textbox", { name: /unsigned reading/ });
    await userEvent.setup({ delay: null }).type(unsigned, "4294967295");
    expect(grade(MAKE, seen.artifact).passed).toBe(true);
    expect(
      grade(MAKE, { answers: { bits: "1".repeat(31) + "0", unsigned: "4294967295" } }).passed,
    ).toBe(false);
    expect(readingsOfPattern("1".repeat(32)).signed).toBe(-1);
  });
});

describe("a w register as two halves of 16 bits", () => {
  const SERVICE = {
    c: "int f(void) { return 30000; }",
    listing: "f:\n  mov w0, 30000 C1\n  ret C1",
  };
  const WORKED = { c: "", listing: "mov w0, 3\nmovk w0, 2, lsl 16\nret" };
  const halves = (container: HTMLElement) =>
    ["upper", "lower"].map((which) => {
      const h = container.querySelector(`.al-h16[data-half="${which}"]`)!;
      return {
        digits: [...h.querySelectorAll(".al-h16-digit")].map((d) => d.textContent).join(""),
        bits: [...h.querySelectorAll(".al-bit")].map((b) => b.textContent).join(""),
        tag: h.querySelector(".al-h16-tag")?.textContent?.trim(),
        dataTag: h.getAttribute("data-tag"),
      };
    });
  const next = (user: ReturnType<typeof userEvent.setup>) =>
    user.click(screen.getByRole("button", { name: S.stepper.next }));

  it("starts with both halves 0000 and no tag, before any instruction has run", () => {
    const { container } = figure(WideStepper, "w", "wide-stepper", {
      program: WORKED,
      register: 0,
      mode: "w16",
    });
    expect(halves(container)).toEqual([
      { digits: "0000", bits: "0".repeat(16), tag: "", dataTag: "none" },
      { digits: "0000", bits: "0".repeat(16), tag: "", dataTag: "none" },
    ]);
    expect(container.querySelector('[data-register="w0"] .al-reg-value')).toHaveTextContent("0");
  });

  it("shows 0000 and 7530 for mov w0, 30000, with the 16 bits of each half and the whole value", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = figure(WideStepper, "w", "wide-stepper", {
      program: SERVICE,
      register: 0,
      mode: "w16",
    });
    await next(user);
    const [upper, lower] = halves(container);
    expect([upper?.digits, lower?.digits]).toEqual(["0000", "7530"]);
    // 0x7530 is 0111 0101 0011 0000.
    expect(lower?.bits).toBe("0111010100110000");
    expect(upper?.bits).toBe("0".repeat(16));
    expect(container.querySelector(".al-reg-hex")).toHaveTextContent("0x00007530");
    expect(container.querySelector('[data-register="w0"] .al-reg-value')).toHaveTextContent(
      "30000",
    );
    expect(screen.getByRole("status")).toHaveTextContent("Ran mov w0, 30000.");
  });

  it("writes each digit over its four bits", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = figure(WideStepper, "w", "wide-stepper", {
      program: SERVICE,
      register: 0,
      mode: "w16",
    });
    await next(user);
    const groups = [...container.querySelectorAll(".al-h16[data-half='lower'] .al-h16-group")];
    expect(groups).toHaveLength(4);
    groups.forEach((g) => {
      const digit = g.querySelector(".al-h16-digit")!.textContent!;
      const four = [...g.querySelectorAll(".al-bit")].map((b) => b.textContent).join("");
      expect(parseInt(four, 2).toString(16)).toBe(digit);
    });
  });

  it("tags both halves new after a mov, which writes the whole register, and says so in words", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = figure(WideStepper, "w", "wide-stepper", {
      program: WORKED,
      register: 0,
      mode: "w16",
    });
    await next(user);
    expect(halves(container).map((h) => [h.digits, h.tag])).toEqual([
      ["0000", "new"],
      ["0003", "new"],
    ]);
  });

  it("then tags the upper half new and the lower half kept after movk w0, 2, lsl 16: 0002 0003, 131075", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = figure(WideStepper, "w", "wide-stepper", {
      program: WORKED,
      register: 0,
      mode: "w16",
    });
    await next(user);
    await next(user);
    expect(halves(container).map((h) => [h.digits, h.tag, h.dataTag])).toEqual([
      ["0002", "new", "new"],
      ["0003", "kept", "kept"],
    ]);
    expect(container.querySelector(".al-reg-hex")).toHaveTextContent("0x00020003");
    expect(container.querySelector('[data-register="w0"] .al-reg-value')).toHaveTextContent(
      "131075",
    );
    // The instruction just run, and the one that runs next, are in the status line.
    expect(screen.getByRole("status")).toHaveTextContent("Ran movk w0, 2, lsl 16.");
    expect(screen.getByRole("status")).toHaveTextContent("Next: ret.");
  });

  it("goes back a step to the earlier halves, and Reset to the start", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = figure(WideStepper, "w", "wide-stepper", {
      program: WORKED,
      register: 0,
      mode: "w16",
    });
    await next(user);
    await next(user);
    await user.click(screen.getByRole("button", { name: S.stepper.back }));
    expect(halves(container).map((h) => h.digits)).toEqual(["0000", "0003"]);
    await user.click(screen.getByRole("button", { name: S.stepper.reset }));
    expect(halves(container).map((h) => h.tag)).toEqual(["", ""]);
  });

  it("names the halves Upper half and Lower half, the upper first, with the boundary between them", () => {
    const { container } = figure(WideStepper, "w", "wide-stepper", {
      program: WORKED,
      register: 0,
      mode: "w16",
    });
    expect(
      [...container.querySelectorAll(".al-h16 .al-half-name")].map((n) => n.textContent),
    ).toEqual([M1.register.upperHalf, M1.register.lowerHalf]);
    expect(container.querySelector('[data-register="w0"]')).toHaveAccessibleName(
      M1.halves.group("w0"),
    );
  });

  it("stays shut until the prediction it names is checked", () => {
    const { container } = figure(WideStepper, "w", "wide-stepper", {
      program: WORKED,
      register: 0,
      mode: "w16",
      after: "p",
    });
    expect(container.querySelector(".al-locked")).toHaveTextContent(S.stepper.locked);
    expect(container.querySelector(".al-h16")).toBeNull();
  });

  it("refuses a props record with neither a program nor a challenge", () => {
    const { container } = figure(WideStepper, "w", "wide-stepper", { register: 0, mode: "w16" });
    expect(container.querySelector(".interactive-problem")).toBeInTheDocument();
  });
});

describe("a w register in halves, from the learner's own saved work", () => {
  const BUILD = Challenge.parse({
    id: "build",
    title: "Build",
    task: "Put 1000000 in w0.",
    gradedDirection: "write",
    allowedConstructs: ["mov", "movk", "ret"],
    palette: ["w0"],
    initial: { text: "mov w0, 1000000\nret" },
    tests: {
      kind: "answers",
      grader: "run-registers",
      cases: [{ label: "odometer_limit()", given: {}, expect: { w0: 1000000 } }],
    },
    hints: ["a", "b", "c", "d", "e"],
    reference: { text: "mov w0, 16960\nmovk w0, 0xf, lsl 16\nret" },
  });
  const lesson = { challenges: [BUILD] } as unknown as Lesson;
  const props = { register: 0, mode: "w16", fromChallenge: "build" };
  const save = (store: LessonStore, text: string) =>
    act(() => store.setChallenge("build", (c) => ({ ...c, artifact: { text } })));
  const digits = (container: HTMLElement) =>
    ["upper", "lower"].map((which) =>
      [...container.querySelectorAll(`.al-h16[data-half="${which}"] .al-h16-digit`)]
        .map((d) => d.textContent)
        .join(""),
    );
  const tags = (container: HTMLElement) =>
    ["upper", "lower"].map((which) =>
      container.querySelector(`.al-h16[data-half="${which}"] .al-h16-tag`)!.textContent!.trim(),
    );
  const mount = (store = new LessonStore(memoryStorage(), "assembly-lab", "test")) =>
    figure(WideStepper, "s", "wide-stepper", props, { store, lesson });
  const stepAll = async (n: number) => {
    const user = userEvent.setup({ delay: null });
    for (let i = 0; i < n; i++)
      await user.click(screen.getByRole("button", { name: S.stepper.next }));
  };

  it("shows the lock and nothing of a solution while there is no saved work", () => {
    const { container } = mount();
    expect(container.querySelector(".al-locked")).toHaveTextContent(A.adder.lockedUntilPassed);
    expect(container.querySelector(".al-h16")).toBeNull();
    expect(container.querySelector(".al-listing")).toBeNull();
    expect(screen.queryByRole("button", { name: S.stepper.next })).toBeNull();
  });

  it("stays locked for work that does not pass, even work that only differs by the ret", () => {
    const { store, container } = mount();
    for (const text of [
      "mov w0, 1000000\nret",
      "mov w0, 16960\nret",
      "mov w0, 16960\nmovk w0, 15, lsl 16",
      "mov w0, 16960\nmov w0, 15\nret",
      "mov w0, 16960\nadd w0, w0, 1\nret",
    ]) {
      save(store, text);
      expect(container.querySelector(".al-locked"), text).not.toBeNull();
      expect(container.querySelector(".al-h16"), text).toBeNull();
    }
  });

  it("opens once the saved work passes, steps it a line at a time, and shuts again if the work stops passing", () => {
    const { store, container } = mount();
    save(store, "mov w0, 16960\nmovk w0, 15, lsl 16\nret");
    expect(container.querySelector(".al-locked")).toBeNull();
    expect(container.querySelectorAll(".al-h16")).toHaveLength(2);
    expect([...container.querySelectorAll(".al-insn .al-text")].map((t) => t.textContent)).toEqual([
      "mov w0, 16960",
      "movk w0, 15, lsl 16",
      "ret",
    ]);
    save(store, "mov w0, 16960\nret");
    expect(container.querySelector(".al-locked")).not.toBeNull();
    expect(container.querySelector(".al-h16")).toBeNull();
  });

  it("steps the usual solution: 000f 4240 with the upper half new and the lower kept after movk", async () => {
    const { store, container } = mount();
    save(store, "mov w0, 16960\nmovk w0, 15, lsl 16\nret");
    await stepAll(1);
    expect([digits(container), tags(container)]).toEqual([
      ["0000", "4240"],
      ["new", "new"],
    ]);
    await stepAll(1);
    expect([digits(container), tags(container)]).toEqual([
      ["000f", "4240"],
      ["new", "kept"],
    ]);
    expect(container.querySelector('[data-register="w0"] .al-reg-value')).toHaveTextContent(
      "1000000",
    );
  });

  it("steps a different solution, mov then movk then movk, with each step's tags", async () => {
    const { store, container } = mount();
    save(store, "mov w0, 1\nmovk w0, 15, lsl 16\nmovk w0, 16960\nret");
    const seen: string[] = [];
    for (let i = 0; i < 3; i++) {
      await stepAll(1);
      seen.push([...digits(container), ...tags(container)].join(" "));
    }
    expect(seen).toEqual(["0000 0001 new new", "000f 0001 new kept", "000f 4240 kept new"]);
  });

  it("steps a solution that writes the lower half with movk from the start", async () => {
    const { store, container } = mount();
    save(store, "movk w0, #16960\nmovk w0, #15, lsl 16\nret");
    await stepAll(1);
    expect([digits(container), tags(container)]).toEqual([
      ["0000", "4240"],
      ["kept", "new"],
    ]);
    await stepAll(1);
    expect([digits(container), tags(container)]).toEqual([
      ["000f", "4240"],
      ["new", "kept"],
    ]);
  });

  it("starts again from the first step when the solution changes", async () => {
    const { store, container } = mount();
    save(store, "mov w0, 16960\nmovk w0, 15, lsl 16\nret");
    await stepAll(2);
    expect(digits(container)).toEqual(["000f", "4240"]);
    save(store, "mov w0, 15\nmovk w0, 16960\nmovk w0, 15, lsl 16\nret");
    expect(digits(container)).toEqual(["0000", "0000"]);
  });
});

describe("x3 as one box with w3 inside it", () => {
  const WIDTHS = { c: "", listing: "mov x3, -1\nmov w3, -1\nret" };
  const props = { program: WIDTHS, register: 3, mode: "x64-named" };
  const half = (container: HTMLElement, which: string) =>
    container.querySelector(`[data-register="x3"] [data-half="${which}"]`)!;
  const next = (user: ReturnType<typeof userEvent.setup>) =>
    user.click(screen.getByRole("button", { name: S.stepper.next }));

  it("has the heading x3: 64 bits, and the halves Upper 32 bits and Lower 32 bits with w3 in the lower", () => {
    const { container } = figure(WideStepper, "w", "wide-stepper", props);
    expect(container.querySelector(".al-wide-named .al-reg-name")).toHaveTextContent("x3: 64 bits");
    expect(half(container, "upper").querySelector(".al-half-name")).toHaveTextContent(
      "Upper 32 bits",
    );
    expect(half(container, "lower").querySelector(".al-half-name")).toHaveTextContent(
      "Lower 32 bits",
    );
    expect(half(container, "lower").querySelector(".al-half-alias")).toHaveTextContent("w3");
    expect(half(container, "upper").querySelector(".al-half-alias")).toBeNull();
    // Both halves are inside the one box that is x3.
    const box = container.querySelector('[data-register="x3"]')!;
    expect(box.contains(half(container, "upper")) && box.contains(half(container, "lower"))).toBe(
      true,
    );
    expect(container.querySelectorAll("[data-register]")).toHaveLength(1);
  });

  it("says nothing about a write before any instruction has run", () => {
    const { container } = figure(WideStepper, "w", "wide-stepper", props);
    expect(
      container.querySelector(".al-half-tag[data-tag='written'], [data-tag='cleared']"),
    ).toBeNull();
    expect(container.querySelector(".al-wide-note")).toHaveTextContent("");
  });

  it("tags both halves written by mov x3, -1, with no note", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = figure(WideStepper, "w", "wide-stepper", props);
    await next(user);
    expect(half(container, "upper").querySelector(".al-half-tag")).toHaveTextContent("written");
    expect(half(container, "lower").querySelector(".al-half-tag")).toHaveTextContent("written");
    expect(container.querySelector(".al-wide-note")).toHaveTextContent("");
  });

  it("shows the upper half cleared and the lower written after mov w3, -1, with the note that writing w3 cleared the upper 32 bits of x3", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = figure(WideStepper, "w", "wide-stepper", props);
    await next(user);
    await next(user);
    expect(half(container, "upper").querySelector(".al-half-tag")).toHaveTextContent("cleared");
    expect(half(container, "lower").querySelector(".al-half-tag")).toHaveTextContent("written");
    expect(
      [...half(container, "upper").querySelectorAll(".al-bit")].map((b) => b.textContent).join(""),
    ).toBe("0".repeat(32));
    expect(container.querySelector(".al-reg-value")).toHaveTextContent("0x00000000ffffffff");
    expect(container.querySelector(".al-wide-note")).toHaveTextContent(
      "Writing w3 cleared the upper 32 bits of x3.",
    );
    // At the ret, nothing is written, and the note goes.
    await next(user);
    expect(container.querySelector(".al-wide-note")).toHaveTextContent("");
  });

  it("keeps the gate on the prediction", () => {
    const { container } = figure(WideStepper, "w", "wide-stepper", { ...props, after: "p" });
    expect(container.querySelector(".al-locked")).toBeInTheDocument();
    expect(container.querySelector(".al-wide-named")).toBeNull();
  });
});

describe("the note that waits for a challenge", () => {
  const GATE = Challenge.parse({
    id: "gate",
    title: "Gate",
    task: "Pick.",
    gradedDirection: "answer",
    fields: [
      {
        id: "n",
        label: "N",
        kind: "choice",
        options: [
          { value: "0", label: "0" },
          { value: "1", label: "1" },
        ],
      },
    ],
    initial: { data: { program: { c: "", listing: "plus:\n  add w0, w0, w1\n  ret" } } },
    tests: {
      kind: "answers",
      grader: "registers-at-return",
      cases: [{ label: "5 plus 3", given: { entry: "plus", w0: 5, w1: 3 }, expect: { n: "w0" } }],
    },
    hints: ["a", "b", "c", "d", "e"],
    reference: { answers: { n: "8" } },
  });

  it("draws nothing until the saved work passes the challenge, then the lesson's words, then nothing again", () => {
    const store = new LessonStore(memoryStorage(), "assembly-lab", "test");
    const lesson = { challenges: [GATE] } as unknown as Lesson;
    const interactive = Interactive.parse({
      id: "n",
      kind: "challenge-note",
      timeModel: "none",
      caption: "c",
      props: { afterChallenge: "gate", text: "That is **right**." },
    });
    const { container } = render(
      <ChallengeNote lesson={lesson} interactive={interactive} store={store} />,
    );
    expect(container).toBeEmptyDOMElement();
    act(() => store.setChallenge("gate", (c) => ({ ...c, artifact: { answers: { n: "1" } } })));
    expect(container).toBeEmptyDOMElement();
    act(() => store.setChallenge("gate", (c) => ({ ...c, artifact: { answers: { n: "8" } } })));
    expect(container).toHaveTextContent("That is right.");
    act(() => store.setChallenge("gate", (c) => ({ ...c, artifact: { answers: { n: "2" } } })));
    expect(container).toBeEmptyDOMElement();
  });
});
