# Snippet alignment reader: Constants and widths

Reviewed 18 October 2026, independently, against the immutable production preview at `http://127.0.0.1:4263/assembly-lab/#/lesson/constants-and-widths`.

## Result

No new lesson-specific finding or material regression. The two appearances of `service_interval` retain its complete, single-line C function and pair it with its two instructions. At desktop width the source and instructions share a row; at phone width the source is immediately above its instructions. Wrapping the function onto two visual lines on the phone keeps the original C line number. The function label remains separate and the return-control sentence is clear.

The initial caption, “service_interval in C and the instructions GCC produces for it”, remains accurate in both layouts. The shared “Compiler's C line references” disclosure is initially closed. Opening it shows the original two references to C line 1 and explains what those records mean. There is no loss of source or instruction text. After Next, the source and the instruction just executed are highlighted, while the arrow identifies the next instruction. The status sentence gives the same distinction in words.

The assembly-only construction, width experiment and answer editor remain assembly-only. They acquire no invented C correspondence. Both prediction gates were submitted through their visible controls; their initially gated figures then appeared. No challenge solution was seeded or revealed for this review.

## Checks and evidence

Read `CLAUDE.md`, both closing passes in `docs/style.md`, the alignment brief, the rendered lesson and its current prose, and the prior [lesson review](../clarity-review-2/02-constants-and-widths.md). Inspected browser screenshots at **1280 × 900** and **375 × 900**, in **light and dark** themes. Stepped available figures through their return instruction, then separately inspected the first-step source/instruction highlights. Opened the original compiler-reference disclosure in all four configurations. Measured no document horizontal overflow in any configuration. No browser page errors were observed in the first interaction pass.

Temporary evidence:

- `/tmp/snippet-reader02.mjs` and `/tmp/snippet-reader02-detail.mjs`: browser scripts.
- `/tmp/snippet02-{1280,375}-{light,dark}-initial.png`: initial listing and closed compiler disclosure.
- `/tmp/snippet02-{1280,375}-{light,dark}-pair{0,1}.png`: both C-backed appearances, including the final stepped state.
- `/tmp/snippet02-{1280,375}-{light,dark}-raw.png`: open original compiler references.
- `/tmp/snippet02-{1280,375}-{light,dark}-highlight.png`: first-step highlights and next marker.
- `/tmp/snippet02-checks.json`: original tags, retained source count and overflow checks.
- `/tmp/snippet02-{1280,375}-{light,dark}.txt`: rendered lesson after prediction commitments.

The diagnostic script's `litInstructions` query used a nonexistent `data-just` attribute and therefore yielded empty arrays. Instruction highlighting was checked in the screenshots, not inferred from those arrays. This is a focused learner review, not an exhaustive regression or accessibility test. The successful challenge solution state was not opened; its assembly-only nature was checked in the lesson configuration.

## Prerequisites and existing findings

Assumed only “Before you start” and lessons 00–01. Checked Module 0's explanations of GCC, `-O1`, registers, operands, instruction stepping, memory and the compiler-reference distinction. Checked the preceding lesson's hexadecimal, `0x`, bit patterns and signed/unsigned readings. This lesson explains its newly required `void`, constants, register halves, assembler, remainder, `movk`, `lsl 16`, optional `#`, `long`, unsigned suffix and the two register names before relying on them. The new shared snippet wording adds no unexplained prerequisite.

The existing shared **low-severity L4** remains: “An instruction can read or change registers, flags or memory” uses “flags” before that term is taught. It is already recorded in the previous review and is not an alignment regression or a new finding. Direction remains to identify flags briefly when first mentioned or use vocabulary already introduced. The prior rejection of E02-1 is not reopened; the full motivation qualifies the sufficient constant-loading rule before the shorter hint.
