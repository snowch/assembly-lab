// Copyright © 2026 Christopher Snow
// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import { PLUS } from "../../../../content/lessons/adding-and-the-flags.listings";
import { flagsModel } from "./model";
import { flagsLogicMarkup } from "./logic";
import { LOGIC_COPY } from "./strings.logic";

describe("optional four-bit flag logic", () => {
  it("connects every visible column, carry and flag to the model for every input pattern", () => {
    const seenTopCarries = new Set<string>();
    const host = document.createElement("div");
    for (let a = 0; a < 16; a++) {
      for (let b = 0; b < 16; b++) {
        const model = flagsModel(PLUS, 4, a, b);
        host.innerHTML = flagsLogicMarkup(model);
        const svg = host.querySelector("svg")!;
        expect(svg.querySelectorAll('[data-gate="FA"]')).toHaveLength(4);
        expect(svg.querySelectorAll('[data-gate="XOR"], [data-gate="NOR"]')).toHaveLength(2);
        for (const column of model.columns) {
          const shown = svg.querySelector(`[data-logic-column="${column.bit}"]`)!;
          expect([
            shown.getAttribute("data-a"),
            shown.getAttribute("data-b"),
            shown.getAttribute("data-in"),
            shown.getAttribute("data-out"),
            shown.getAttribute("data-result"),
          ]).toEqual(
            [column.a, column.b, column.carryIn, column.carryOut, column.kept].map(String),
          );
          for (const [row, value] of [
            ["a", column.a],
            ["b", column.b],
            ["result", column.kept],
          ] as const) {
            expect(
              svg.querySelector(`[data-row="${row}"][data-bit="${column.bit}"] text`)!.textContent,
            ).toBe(String(value));
          }
          expect(svg.querySelector(`[data-logic-carry="${column.bit + 1}"]`)!.textContent).toBe(
            String(column.carryOut),
          );
        }
        expect(svg.querySelector('[data-logic-carry="0"]')!.textContent).toBe("0");
        const signedA = a < 8 ? a : a - 16;
        const signedB = b < 8 ? b : b - 16;
        const signedSum = signedA + signedB;
        const expected = {
          n: Number(((a + b) & 8) !== 0),
          z: Number(((a + b) & 15) === 0),
          c: Number(a + b >= 16),
          v: Number(signedSum < -8 || signedSum > 7),
        };
        for (const flag of ["n", "z", "c", "v"] as const) {
          expect(svg.querySelector(`[data-logic-output="${flag}"]`)!.textContent).toBe(
            `${flag.toUpperCase()}=${expected[flag]}`,
          );
          expect(host.querySelector(`[data-logic-flag="${flag}"]`)!.textContent).toBe(
            String(expected[flag]),
          );
        }
        // Independently check the intuition against signed-range arithmetic, including zero.
        const sameInputSign = a >= 8 === b >= 8;
        const changedResultSign = ((a + b) & 8) !== (a & 8);
        expect(expected.v).toBe(Number(sameInputSign && changedResultSign));
        expect(expected.v).toBe(Number(model.carryIn !== model.carryOut));
        seenTopCarries.add(`${model.carryIn}${model.carryOut}`);
        expect(host.querySelector(".flags-logic-equation")!.textContent).toBe(
          `${model.carryIn} XOR ${model.carryOut} = ${expected.v}`,
        );
        expect(svg.querySelector("desc")!.textContent).not.toMatch(/\{[a-zA-Z]+\}/);
      }
    }
    expect(seenTopCarries).toEqual(new Set(["00", "01", "10", "11"]));
  });

  it("keeps the miniature qualification and the reason for XOR beside the diagram", () => {
    const model = flagsModel(PLUS, 4, 7, 1);
    const host = document.createElement("div");
    host.innerHTML = flagsLogicMarkup(model);
    expect(host.textContent).toContain(LOGIC_COPY.limitation);
    expect(host.querySelector(".flags-logic-why")!.textContent).toContain(LOGIC_COPY.xorWhy);
    expect(host.querySelector(".flags-logic-why")!.textContent).toContain(
      LOGIC_COPY.xorWhyNegative,
    );
    expect(host.querySelector(".flags-logic-why")!.textContent).toContain(
      LOGIC_COPY.xorWhyPositive,
    );
    expect(host.querySelectorAll("button, input, iframe, script")).toHaveLength(0);
  });

  it("rejects a real-width model rather than mislabelling it as four-bit circuitry", () => {
    expect(() => flagsLogicMarkup(flagsModel(PLUS, 32, 7, 1))).toThrow(/four-bit/);
  });
});
