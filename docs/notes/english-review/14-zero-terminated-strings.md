<!-- Copyright © 2026 Christopher Snow -->

# English review: Strings and the zero byte

Scope: Module 7, lesson 2 (`zero-terminated-strings`). Review only; no course text changed. Read as a learner who has completed the preceding lessons and knows only the front-page prerequisites beyond them.

## Findings

No actionable English-clarity findings. The page explains its new terms, distinguishes zero bytes from the ASCII digit, and states the different stopping assumptions for the bounded and moving-pointer loops. The exercises specify their inputs, outputs, readable-memory guarantees and empty cases. No severity or replacement wording is proposed merely to meet a quota.

## Prerequisite verification

Read `CLAUDE.md`, `docs/style.md`, the prerequisite panel in `apps/course/src/strings.ts:24`, the lesson order in `content/lessons/index.ts`, and preceding lesson prose relevant to the terms and syntax used here. The panel assumes small C functions using integer arguments/returns, conditions, loops and array indexing; it expressly does not assume pointers or assembly.

Checked the following against earlier teaching rather than treating reviewer familiarity as learner knowledge:

- GCC, listings and `-O1`: introduced in `meet-the-machine.prose.ts:10` and its compiler note (`:16`).
- Hexadecimal and its `0x` notation: `one-pattern-three-readings.prose.ts:24` onwards. Memory's two-digit hexadecimal bytes are explained in `memory-and-addresses.prose.ts:20`; decimal bytes in the present prose therefore do not introduce an unannounced number convention.
- Full registers, their `w` views and 64-bit `long`: `constants-and-widths.prose.ts`, with the shared-register rule repeated explicitly in `memory-and-addresses.prose.ts:14`.
- Branch labels, colon syntax, conditional branches, `cbz` and `cbnz`: `branches.prose.ts`, including the explicit zero/nonzero distinction at `:91`. `bne` and `b.ne` have already been used in the counting lessons.
- C `++`: `counting-up.prose.ts:13`. C `break` is explained locally in the opened C-loop note, rather than silently relying on the prerequisites.
- Bytes, addresses, pointers, dereferencing, `const`, `unsigned char` and target type sizes: `memory-and-addresses.prose.ts:6–12,48`; `loading-widths.prose.ts:7–15` explains byte loads and zero extension.
- Arrays, elements, zero-based indices, scaled byte offsets, post-index addressing and C pointer increments: the immediately preceding `array-addresses.prose.ts:6–18,37`. This supports the present comparison between index-based and moving-pointer scans.
- String, terminator, ASCII and capacity are explained on this page before their exercise use. “Scan” is grounded by the instruction to read a byte, test it, and repeat. “Marker” denotes the byte to count in the final task, rather than requiring an external technical definition.

No additional untaught prerequisite was identified. No later lesson was used to dismiss an assumed-knowledge concern.

## Coverage and browser evidence

Read the complete learner-facing content in `zero-terminated-strings.prose.ts`, `zero-terminated-strings.labels.ts` and its lesson configuration, plus the displayed C and assembly in `arrays.listings.ts`. Covered all ten sections, both details notes, both prediction questions/options/explanations, both exercise tasks, all five hints for each exercise, test labels, reflection and simulator-versus-hardware note. Also checked shared hint headings in `platform/lesson-runtime/src/strings.ts`, memory diagram strings in `packages/views/src/strings.memory.ts` and memory-specific exercise feedback in `packages/views/src/strings.memory-runtime.ts`.

Used Chromium on the existing built page at `http://localhost:4220/assembly-lab/#/lesson/zero-terminated-strings`, at **1280 × 900** and **375 × 900**, each in **light and dark** themes. Opened all details, checked both predictions (one incorrect and one correct), revealed all ten hints, ran the initial unsuccessful code and successful exercise submissions, and advanced the memory figures. Read the rendered initial, failed and completed text in all four configurations; inspected top-of-page screenshots in all four. The full-page captures preserve the expanded notes and hints. No wording issue depended on the width or theme.

Temporary evidence, not committed: `/tmp/english14.mjs`, `/tmp/english14-visual.mjs`; `/tmp/english14-initial-{width}-{theme}.txt`, `/tmp/english14-failed-{width}-{theme}.txt`, `/tmp/english14-{width}-{theme}.txt`; full-page screenshots `/tmp/english14-{width}-{theme}.png` and inspected viewport screenshots `/tmp/english14-top-{width}-{theme}.png`. Widths are `1280` and `375`; themes are `light` and `dark`. No build or full test suite was run. Challenge answers are not reproduced in this review.
