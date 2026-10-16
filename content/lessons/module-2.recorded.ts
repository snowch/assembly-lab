// Copyright © 2026 Christopher Snow

// docs/notes/module-2/listings.md read as data, for the two lessons' facts tests: the recorded C, the
// recorded listing, and each function as the lessons show it. The lessons show a function's own line
// as the C, so the line GCC records for each of its instructions, counted from the function's line,
// is line 1; `shownFunction` makes that change and no other.

import { parseListing, type ListingLine } from "@al/views";

import { recorded } from "./module-2.runs";

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

/** A function as the lesson shows it: its own line of C, and its instructions numbered from 1. */
export function shownFunction(name: string): { c: string; listing: ListingLine[] } {
  const line = RECORDED_C.findIndex((l) => new RegExp(`\\b${name}\\(`).test(l));
  if (line < 0) throw new Error(`the recorded C has no ${name}`);
  const start = RECORDED_LISTING.findIndex((l) => l.kind === "label" && l.text === name);
  if (start < 0) throw new Error(`the recorded listing has no ${name}`);
  const listing: ListingLine[] = [RECORDED_LISTING[start] as ListingLine];
  for (const l of RECORDED_LISTING.slice(start + 1)) {
    if (l.kind === "label") break;
    listing.push(l.cLine === null ? l : { ...l, cLine: l.cLine - line });
  }
  return { c: RECORDED_C[line] as string, listing };
}
