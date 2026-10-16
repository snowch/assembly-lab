// Copyright © 2026 Christopher Snow

// docs/notes/module-4/listings.md read as data, for the two lessons' facts tests: the recorded C, the
// recorded listing, and each function as the lessons show it. The lessons show a function's own
// lines of C, so the line GCC records for each of its instructions, counted from the function's first
// line, is line 1; `shownFunction` makes that change and no other.

import { parseListing, type ListingLine } from "@al/views";

import { recorded } from "./module-4.runs";

const blocks = [...recorded.matchAll(/```(\w*)\n([\s\S]*?)```/g)].map((m) => [
  m[1] as string,
  m[2] as string,
]) as [string, string][];

/** The recorded C, one string for each line of the file (the first is the copyright line). */
export const RECORDED_C: readonly string[] = blocks
  .find(([lang]) => lang === "c")![1]
  .replace(/\n+$/, "")
  .split("\n");

/** The recorded listing, labels and instructions, each instruction with its recorded C line. */
export const RECORDED_LISTING: readonly ListingLine[] = parseListing(
  blocks.find(([lang]) => lang === "")![1],
);

/** The 1-based line of the recorded C that starts the function `name`. */
export function lineOf(name: string): number {
  const at = RECORDED_C.findIndex((l) => new RegExp(`\\b${name}\\(`).test(l));
  if (at < 0) throw new Error(`the recorded C has no ${name}`);
  return at + 1;
}

/** The recorded instructions of a function, from its label to the next function's. */
export function listingOf(name: string): ListingLine[] {
  const start = RECORDED_LISTING.findIndex((l) => l.kind === "label" && l.text === name);
  if (start < 0) throw new Error(`the recorded listing has no ${name}`);
  const out: ListingLine[] = [RECORDED_LISTING[start] as ListingLine];
  for (const l of RECORDED_LISTING.slice(start + 1)) {
    // A local label (`.L7:`) belongs to the function; the next ordinary label starts another.
    if (l.kind === "label" && !l.text.startsWith(".")) break;
    out.push(l);
  }
  return out;
}

/**
 * A function as the lesson shows it: its lines of C (from the line that starts it, for `lines` lines)
 * and its instructions, each C line counted from the function's first line, which is line 1.
 */
export function shownFunction(
  name: string,
  lines = 1,
): { c: string; listing: ListingLine[]; first: number } {
  const first = lineOf(name);
  const listing = listingOf(name).map((l) =>
    l.kind === "instruction" && l.cLine !== null ? { ...l, cLine: l.cLine - (first - 1) } : l,
  );
  return {
    c: RECORDED_C.slice(first - 1, first - 1 + lines).join("\n"),
    listing,
    first,
  };
}
