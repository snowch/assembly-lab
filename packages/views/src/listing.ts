// Copyright © 2026 Christopher Snow

// A compiler's listing as the lessons carry it, and the few things the figures do to one. A listing
// is the text GCC printed, labels and instructions, each instruction line ending with the C line
// GCC recorded for it (`C3`). The lesson shows the C without the recorded file's first line, so its
// numbers are the recorded ones minus one; a test holds the copy to docs/notes/module-0/listings.md.

/** A program as a lesson records it: the C, and the compiler's listing of it. */
export interface RecordedProgram {
  /** The C as the lesson shows it, lines separated by a newline. */
  readonly c: string;
  /** Labels and instructions, one per line; each instruction line ends with `C<n>`. */
  readonly listing: string;
}

export type ListingLine =
  | { readonly kind: "label"; readonly text: string }
  | { readonly kind: "instruction"; readonly text: string; readonly cLine: number | null };

/** The lines of a listing. Blank lines go; the white space inside an instruction becomes one space. */
export function parseListing(listing: string): ListingLine[] {
  const out: ListingLine[] = [];
  for (const raw of listing.split("\n")) {
    const line = raw.trim();
    if (line === "") continue;
    if (/^[A-Za-z_.][\w.$]*:$/.test(line)) {
      out.push({ kind: "label", text: line.slice(0, -1) });
      continue;
    }
    const tagged = /^(.*?)\s+C(\d+)$/.exec(line);
    const text = (tagged ? (tagged[1] as string) : line).replace(/\s+/g, " ");
    out.push({ kind: "instruction", text, cLine: tagged ? Number(tagged[2]) : null });
  }
  return out;
}

/** The label an instruction is under: the nearest label above line `index`, or null if none. */
export function labelOf(lines: readonly ListingLine[], index: number): string | null {
  for (let i = index; i >= 0; i--) {
    const line = lines[i];
    if (line?.kind === "label") return line.text;
  }
  return null;
}

/** The text the assembler reads: one source line for each listing line, in order. */
export function assemblyOf(lines: readonly ListingLine[]): string {
  return lines.map((l) => (l.kind === "label" ? `${l.text}:` : l.text)).join("\n") + "\n";
}

/** Which line to take out of a listing: the first `text` after the label `label`. */
export interface DeleteSpec {
  readonly label: string;
  readonly text: string;
}

export function deleteLine(lines: readonly ListingLine[], spec: DeleteSpec): ListingLine[] {
  const start = lines.findIndex((l) => l.kind === "label" && l.text === spec.label);
  if (start < 0) throw new Error(`The listing has no label ${spec.label}.`);
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i] as ListingLine;
    if (line.kind === "label") break;
    if (line.text === spec.text) return [...lines.slice(0, i), ...lines.slice(i + 1)];
  }
  throw new Error(`${spec.label} has no line ${spec.text}.`);
}

/** The lines of the C, for a figure that numbers them from 1. A program with no C has no lines. */
export function cLinesOf(c: string): string[] {
  return c.trim() === "" ? [] : c.replace(/\n+$/, "").split("\n");
}
