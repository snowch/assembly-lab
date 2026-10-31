// Copyright © 2026 Christopher Snow

// The course's words: none empty, the placeholders as the brief gave them, and the footer's links
// where they should go.

import { describe, expect, it } from "vitest";

import { COMPANION_LINKS, STRINGS } from "./strings";

/** Every string in `value`, with where it was found; a function's result for a sample argument. */
function strings(value: unknown, path = "STRINGS"): [string, string][] {
  if (typeof value === "string") return [[path, value]];
  if (typeof value === "function")
    return strings((value as (a: string) => unknown)("x"), `${path}()`);
  if (value && typeof value === "object")
    return Object.entries(value).flatMap(([k, v]) => strings(v, `${path}.${k}`));
  return [];
}

describe("the course's words", () => {
  it("are none of them empty", () => {
    const all = strings(STRINGS);
    expect(all.length).toBeGreaterThan(20);
    expect(all.filter(([, s]) => s.trim() === "").map(([p]) => p)).toEqual([]);
  });

  it("have no em dash", () => {
    expect(
      strings(STRINGS)
        .filter(([, s]) => s.includes("—"))
        .map(([p]) => p),
    ).toEqual([]);
  });

  it("give the title, the subtitle and the status as the plan's author wrote them", () => {
    expect(STRINGS.title).toBe("Assembly Lab");
    expect(STRINGS.subtitle).toBe("From a line of C to the bits in a register");
    expect(STRINGS.status.planned).toBe("Planned");
  });

  it("keep the description within what a search result shows", () => {
    expect(STRINGS.description.length).toBeLessThanOrEqual(155);
  });

  it("keep the copyright line the pages carry", () => {
    expect(STRINGS.copyright).toBe("© 2026 Christopher Snow");
  });

  it("keep the footer's sentence word for word, with the two titles marked as titles", () => {
    const parts = STRINGS.companions.intro;
    const joined = parts.map((p) => (typeof p === "string" ? p : p.title)).join("");
    expect(joined).toBe(
      "Digital Design builds a computer from gates. Bit Lab explores how computers represent and process data. Assembly Lab teaches Arm assembly through a browser simulator.",
    );
    const titles = parts.flatMap((p) => (typeof p === "string" ? [] : [p.title]));
    expect(titles).toEqual([STRINGS.companions.digitalDesign, STRINGS.companions.bitLab]);
  });

  it("send the footer's links to the companion courses", () => {
    expect(COMPANION_LINKS).toEqual({
      digitalDesign: "https://snowch.github.io/digital-design/",
      bitLab: "https://snowch.github.io/bit-lab/",
      hub: "https://snowch.github.io/",
    });
  });
});
