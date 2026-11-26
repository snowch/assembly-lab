// Copyright © 2026 Christopher Snow

// A deliberately small storage-width view of real 32-bit masking operations.
// Neither selected width is presented as an Arm register or an instruction width.
import { assemble, run } from "@al/machine";

export const RETAINED_BITS_DEFAULT = { value: 100, width: 4 } as const;
export const RETAINED_BITS_INPUT_MAX = 255;
export const RETAINED_BITS_CASES = [0, 14, 15, 16, 19, 100, 255] as const;
export type RetainedWidth = 4 | 8;
export const RETAINED_BITS_PROGRAM = [
  "keep_four:",
  "  and w0, w0, #15",
  "  ret",
  "keep_eight:",
  "  and w0, w0, #255",
  "  ret",
].join("\n");
const { program } = assemble(RETAINED_BITS_PROGRAM);
if (!program) throw new Error("The retained-bit model did not assemble.");
const PROGRAM = program;

export function retainedBits(value: number, width: RetainedWidth) {
  if (!Number.isInteger(value) || value < 0 || value > RETAINED_BITS_INPUT_MAX)
    throw new Error("The storage view needs a whole input from 0 to 255.");
  if (width !== 4 && width !== 8) throw new Error("The storage view keeps four or eight bits.");
  const state = run(PROGRAM, {
    entry: width === 4 ? "keep_four" : "keep_eight",
    args: [{ value: BigInt(value), width: 32 }],
  });
  if (state.stop.kind !== "returned") throw new Error("The retained-bit model did not return.");
  const kept = Number(state.final.x[0]!);
  const range = 2 ** width;
  const fullPattern = value.toString(2).padStart(width, "0");
  const places = [...fullPattern].map((bit, index) => ({
    bit: fullPattern.length - index - 1,
    weight: 2 ** (fullPattern.length - index - 1),
    value: Number(bit),
  }));
  return {
    input: value,
    width,
    minimum: 0,
    maximum: range - 1,
    range,
    fullPattern,
    kept,
    keptPattern: kept.toString(2).padStart(width, "0"),
    keptPlaces: places.filter((place) => place.bit < width),
    removed: value - kept,
    removedGroups: (value - kept) / range,
    removedPattern: fullPattern.slice(0, -width),
    removedPlaces: places.filter((place) => place.bit >= width),
    fits: value < range,
  };
}

export function storageInput(text: string): number | null {
  if (!/^\d+$/.test(text.trim())) return null;
  const value = Number(text.trim());
  return Number.isInteger(value) && value >= 0 && value <= RETAINED_BITS_INPUT_MAX ? value : null;
}
