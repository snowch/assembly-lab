// Copyright © 2026 Christopher Snow

import type { FlagsModel } from "./model";

export const INPUT_FORMATS = ["hex", "unsigned", "signed"] as const;
export type InputFormat = (typeof INPUT_FORMATS)[number];

/** Format the supplied inputs only, without displaying the answer or changing their bits. */
export function inputExpression(inputs: Pick<FlagsModel, "a" | "b">, format: InputFormat): string {
  if (format === "hex") return `${inputs.a.hex} + ${inputs.b.hex}`;
  const decimal = (value: string) => BigInt(value).toLocaleString("en-GB").replace(/^-/, "−");
  const first = decimal(inputs.a[format]);
  const second = decimal(inputs.b[format]);
  return `${first} + ${BigInt(inputs.b[format]) < 0n ? `(${second})` : second}`;
}
