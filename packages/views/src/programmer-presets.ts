// Copyright © 2026 Christopher Snow

import {
  calculatorCompute,
  calculatorHalves,
  calculatorParse,
  calculatorPattern,
  calculatorReading,
  type CalculatorWidth,
} from "@al/machine";

export type ProgrammerPreset = "hexadecimal" | "readings" | "arithmetic" | "halves" | "widths";

export const programmerPresets = {
  hexadecimal: {
    width: 32,
    initial: "13",
    task: "21",
    reading: false,
    arithmetic: false,
    halves: false,
    resize: false,
  },
  readings: {
    width: 32,
    initial: "4294967295",
    task: "4294967294",
    reading: true,
    arithmetic: false,
    halves: false,
    resize: false,
  },
  arithmetic: {
    width: 4,
    initial: "3",
    task: "6",
    reading: false,
    arithmetic: true,
    halves: false,
    resize: false,
  },
  halves: {
    width: 32,
    initial: "131075",
    task: "262153",
    reading: false,
    arithmetic: false,
    halves: true,
    resize: false,
  },
  widths: {
    width: 64,
    initial: "4294967307",
    task: "8589934601",
    reading: true,
    arithmetic: true,
    halves: false,
    resize: true,
  },
} as const satisfies Record<
  ProgrammerPreset,
  {
    width: CalculatorWidth;
    initial: string;
    task: string;
    reading: boolean;
    arithmetic: boolean;
    halves: boolean;
    resize: boolean;
  }
>;

/** Guide answers are checked against the calculator model, independently of its working. */
export function checkProgrammerGuide(
  preset: ProgrammerPreset,
  answers: readonly string[],
): boolean[] {
  const config = programmerPresets[preset];
  const equal = (
    text: string,
    expected: string,
    format: "hex" | "decimal",
    reading: "signed" | "unsigned" = "unsigned",
    width: CalculatorWidth = config.width,
  ) => {
    const parsed = calculatorParse(text, format, width, reading);
    return parsed.ok && parsed.pattern === expected;
  };
  switch (preset) {
    case "hexadecimal":
      return [equal(answers[0] ?? "", config.task, "hex")];
    case "readings":
      return [
        equal(answers[0] ?? "", config.task, "decimal"),
        equal(
          answers[1] ?? "",
          calculatorPattern(
            calculatorReading(BigInt(config.task), config.width, "signed"),
            config.width,
          ).toString(),
          "decimal",
          "signed",
        ),
      ];
    case "arithmetic": {
      const expected = calculatorCompute(config.task, "add", "3", config.width, "unsigned").pattern;
      const binary = (answers[0] ?? "").trim().replace(/[ ,_]/g, "");
      return [/^[01]{4}$/.test(binary) && BigInt(`0b${binary}`).toString() === expected];
    }
    case "halves": {
      const halves = calculatorHalves(config.task);
      return [
        equal(answers[0] ?? "", halves.upper, "decimal"),
        equal(answers[1] ?? "", halves.lower, "decimal"),
      ];
    }
    case "widths": {
      const expected = calculatorPattern(calculatorPattern(BigInt(config.task), 32), 64).toString();
      return [equal(answers[0] ?? "", expected, "hex")];
    }
  }
}
