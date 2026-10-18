# English review: Loading different widths

Reviewed Module 6, lesson 2 (`loading-widths`) against `CLAUDE.md` and both passes in `docs/style.md`. Review only; no course changes. Severity: **low** means a local comprehension obstacle that does not block the exercise; **medium** would obstruct an explanation or task; **high** would prevent reliable progress.

## Finding

**1. Low: the hardware comparison assumes two untaught C concepts.**

- Exact quotes: “It is not a claim about how every C compiler lays out a structure.” and “The prepared bytes and addresses let you study loads without also managing memory allocation or a hardware sensor.”
- Location: `content/lessons/loading-widths.prose.ts:77`, model-versus-reality note.
- Effect: the novice cannot tell what a C “structure” is, what its compiler-selected layout means, or what “memory allocation” involves. Those are the concepts used to explain the example's limits, rather than merely names of later topics. The front panel explicitly says structs and `malloc` are unnecessary; no earlier lesson defines either concept. “Layout” can be understood from this exercise's explicit byte positions, but that does not explain a C structure or allocation.
- Direction: explain the two concepts briefly in ordinary language where they occur, or express the limitation using the prepared bytes and addresses already introduced. This does not require teaching C structure syntax or allocation APIs.

## Prerequisite check

The front panel (`apps/course/src/strings.ts:26`) assumes small C functions with `int`/`unsigned`, returns, conditionals, loops and indexed arrays, plus binary/decimal arithmetic. It explicitly excludes required knowledge of pointers, structs, `malloc` and the standard library.

Earlier-lesson checks: Module 0 supplies compiler/listing/argument/return conventions and the compiler setting; Module 1 supplies hexadecimal, signed readings, `long`, shared `w`/`x` views and upper-bit clearing; Modules 2–5 supply arithmetic, masks, shifts and control flow. `masks.prose.ts:44` defines a field as bits holding a number. The immediately previous `memory-and-addresses.prose.ts:7–12` explains bytes, addresses, pointers, dereference, `const`, target sizes and `unsigned` shorthand; its motivation explains brackets and little-endian order. Its failure explanation supplies halfword width. This lesson itself explains zero/sign extension, the source sign bit, casts, the signal mentioned in the C note, and byte-offset syntax before the final exercise. The explicit record field list makes the record understandable without prior record terminology. No other untaught knowledge requiring a finding was identified.

## Coverage and browser evidence

Read the complete lesson definition, prose and labels: all ten sections, objectives, listing captions and C/assembly, prediction choices and explanations, both tasks and test names, both five-hint ladders, the three expandable notes and the model-versus-reality note. Also read the shared memory-figure strings and the runtime challenge/prediction wording used here. No challenge answers are reproduced in this report.

Used the existing build at `http://localhost:4220/assembly-lab/#/lesson/loading-widths`, without rebuilding or running the full suite. Chromium checks covered 1280-pixel desktop and 375-pixel phone widths in light and dark themes. Opened details, checked both predictions using an incorrect choice, unlocked and stepped the memory figures, revealed all five hints for each challenge, and ran the initial challenge programs to inspect failing feedback. The resulting English matched the source. No additional width/theme-specific English issue was found.

Evidence is under `/tmp`: scripts `english12.cjs` and `english12-figures.cjs`; four `english12-expanded-{width}-{theme}.txt` and `.png` captures include revealed hints and feedback; `english12-figures-{width}-{theme}.txt` and `english12-figure-{width}-{theme}.png` capture the figures after their first instruction. The initial-state captures use `english12-{width}-{theme}`. These are review artifacts, not course edits.
