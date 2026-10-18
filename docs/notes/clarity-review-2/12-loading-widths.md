# Second clarity review: Loading different widths

Reviewed 18 October 2026 as a fresh reader of `loading-widths`, with only the
front-page prerequisites and earlier lessons assumed. Formed the findings before
consulting the first review. Review only; no learner text changed.

The explanation of extension is clear: it distinguishes bits copied from memory,
bits added to preserve the value, and upper bits cleared by a `w` write. The built
figures make those regions visible. One earlier low-severity issue remains, and
the hints contain additional occurrences of the already retained M6 pattern.
No separate new issue category was found.

## Findings

### C12-1 — Low: the limitations note assumes two untaught concepts

Quotes: “It is not a claim about how every C compiler lays out a structure.” and
“The prepared bytes and addresses let you study loads without also managing memory
allocation or a hardware sensor.”

Location: [loading-widths.prose.ts](../../../content/lessons/loading-widths.prose.ts),
line 77, `modelVsReality`.

The note uses C structures and memory allocation to explain the example's limits,
but neither concept has been introduced. The front-page prerequisite panel
explicitly excludes structs and `malloc`. The explicit sensor byte list explains
this exercise's layout, but does not explain what a C compiler lays out or what
allocation would require.

Direction: state the limit using the supplied bytes and addresses, or briefly
identify these concepts in ordinary language. Teaching structure syntax or an
allocation API is unnecessary. This duplicates retained **L13**, which remains
open.

### C12-2 — Low locally: correct instructions are headed “Common mistake”

Quote beneath “COMMON MISTAKE”: “Choose the byte load that fills the added bits
with copies of the sign bit.”

Location: [loading-widths.prose.ts](../../../content/lessons/loading-widths.prose.ts),
line 34, `writeHints[1]`. The corresponding second hint for the final challenge
at line 64 also describes correct load choices under this heading.

The heading presents the following guidance as a mistake, although the learner
should follow it. The surrounding lesson resolves the intended meaning, so the
local severity is low. The third rungs at lines 35 and 65 likewise provide
guidance for the current task under “SMALLER EXAMPLE”, rather than an example.

Direction: make the hints perform the function their headings promise, preserving
the shared platform copy. These are additional occurrences of retained **M6**,
not additional independent issue categories.

## Prerequisite and whole-lesson coverage

Read [the prose](../../../content/lessons/loading-widths.prose.ts),
[labels](../../../content/lessons/loading-widths.labels.ts),
[lesson wiring](../../../content/lessons/loading-widths.ts), and
[shared memory figure text](../../../packages/views/src/strings.memory.ts).
Covered all ten sections, objectives, captions, prediction options and explanations,
both tasks and test labels, all ten hints, the compiler and cast notes, reflection
answer, and the model-versus-reality note. No challenge answers are reproduced here.

Module 0 explains compiler settings and function/register conventions. Module 1
explains signed readings, hexadecimal and the two register widths. The masks lesson
defines a field. The preceding memory lesson explains bytes, pointers, `const`,
brackets, target type sizes and little-endian order. This lesson defines zero and
sign extension, casts, the signal mentioned in its C note, and byte offsets locally.
Its explicit field list makes the sensor record understandable. The unexplained
assumptions are the two concepts in C12-1; no later lesson was used to excuse them.

After the fresh assessment, compared the [first lesson review](../english-review/12-loading-widths.md)
and [ranked findings](../english-review/README.md). L13 remains applicable, M6 gains
these occurrences, and no rejected earlier suggestion is revived.

## Browser evidence and exact interactions

Used Playwright Chromium against
`http://127.0.0.1:4253/assembly-lab/#/lesson/loading-widths` at **1280 × 900** and
**375 × 900**, each in light and dark themes. In every configuration:

- Opened all details and captured the whole rendered text.
- Submitted each of the four choices for each of the two predictions and read the
  resulting feedback.
- Ran both unchanged starter programs, inspected their failing test feedback,
  and revealed all five hints for each challenge.
- Stepped all eleven steppers to their returned state and captured each state.
- Inspected screenshots of the signed-load figure after its first instruction,
  including the copied, extended and cleared bit regions, in all four configurations.

The page width matched the viewport in all four configurations. No additional
theme- or width-specific English problem was found. No passing challenge
submission or arbitrary edited program was exercised; this is not exhaustive
testing of assembler diagnostics.

Local evidence: `/tmp/clarity2-12.mjs`, `/tmp/clarity2-12-first.mjs`, rendered text
`/tmp/clarity2-12-{1280,375}-{light,dark}.txt`, and screenshots
`/tmp/clarity2-12-{1280,375}-{light,dark}-{first,extension,challenge}.png`.
These temporary captures include revealed answers and are not committed.
