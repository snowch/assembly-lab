# Array addresses and moving pointers: independent learner review

Reviewed 18 October 2026 by a separate reader agent that did not draft or implement this lesson. The agent inherited the session's model and effort; a separate model identifier was not exposed to the reviewer. This is the learner pass, not a technical verdict or a fix check.

## Scope and evidence

Read the built lesson at `http://localhost:4200/assembly-lab/#/lesson/array-addresses`, with only the front page prerequisites and Modules 0–6 assumed. Checked the source of earlier explanations when assessing assumed knowledge. Applied `CLAUDE.md`, `docs/style.md` and `docs/authoring.md`.

Used Chromium through Playwright at 1280 × 800 and 375 × 812, in both light and dark themes. Read the rendered prose, predictions, explanations, exercise feedback and both complete hint ladders. Inspected screenshots of the page top, memory transfers, offset/pre-index/post-index loads, the compiled loop and exercise cards. Evidence is in `/tmp/reader-arrays/`; `results.json` records the four runs, and `review.mjs` records their browser actions. No production files were edited and no build was run.

All six steppers were initially gated and became available after the predictions were committed. Each could be stepped to return. Starter programs failed visibly in both exercises. The indexed-load exercise could be completed with the phone tap editor; the loop exercise accepted a separately entered solution. Completion persisted after reload. No page error or document/figure horizontal overflow occurred in the four runs. The phone diagrams are tall, but the byte addresses, access highlighting and register transfer remain readable. These observations support usability; they do not replace the technical review.

## Findings for the sceptic

### R1 — Medium: the compiled loop introduces an unexplained C operator

**Quote and location:** `total += *trips++;` in the C beside “Follow the compiled sum_trips through the trip log.”

**Effect:** The explanation introduces what `*trips++` does, but never explains `+=`. A learner who can read the prerequisite `if`, `for`, `while`, arrays and simple arithmetic assignments still has to infer the operation that updates the total. The expression also combines the new pointer operation with this unexplained operator.

**Evidence:** The front page lists `int`/`unsigned` arguments, `return`, `if`/`else`, loops and array indexing. Its sample uses ordinary assignment. Searching preceding lesson prose and listings found no explanation of `+=`; the array listing is its first occurrence in the lesson listing files. In contrast, `counting-up.prose.ts` explicitly explains `tick++`, and `counting-down.prose.ts` explicitly explains `ticks--`. Screenshots: `1280-dark-step-sum-trips.png` and `375-light-step-sum-trips.png`.

**Direction:** Explain the total-update operator before this listing, alongside the explanation of the pointer expression. Preserve the recorded compiler source rather than silently changing the evidence.

### R2 — Low: “memory value” obscures a useful distinction

**Quote and location:** “Neither the index nor the shifted offset is a memory value.” In “Scale the index by the element size”.

**Effect:** “Memory value” is not an established category in the course. The preceding sentences already identify the index, the scaled offset and the bytes read. This last sentence asks the learner to infer whether it means a value stored in memory, a loaded value, or an address. It can therefore blur the distinction it intends to reinforce.

**Evidence:** The surrounding paragraph explains the address calculation concretely, while this sentence introduces no named register, access or result. Module 6 uses the concrete distinction between the address in a pointer and the value read through it. The built page reproduces the sentence exactly.

**Direction:** State explicitly which quantities calculate the address and which value is obtained by the load, or remove the redundant sentence if the surrounding explanation is sufficient. Do not introduce another category of values.

## Assumed-knowledge audit

The following were checked rather than treated as new unexplained knowledge:

- **GCC and `-O1`:** Module 0 calls GCC “a C compiler” and says `-O1` “asks the compiler to make the code shorter and faster”.
- **AArch64 Linux, target sizes and byte order:** `memory-and-addresses` explains “the 64-bit Arm instruction set running with the Linux operating system” and states the target's type sizes and little-endian order. `loading-widths` repeats those sizes.
- **Pointer declaration, dereference and `const`:** Module 6 says that `unsigned *distance` declares a pointer, `*distance` reads the value at its address, and `const` prevents changes through that pointer.
- **Register width, replacing `x0` through `w0`, hexadecimal and byte transfers:** These are covered by Modules 1 and 6. The new lesson's register and byte views are consistent with those earlier explanations at the learner level.
- **Left shift and scale:** `shifts` explains that a one-place left shift doubles an unsigned value when no bit is lost. This lesson explicitly connects its shift to element size before the prediction.
- **Labels and spelling differences in assembly:** `branches` explains label naming, `.L`, `bgt` versus `b.gt`, and the optional `#` in GCC output.
- **Increment and decrement:** `counting-up` explains `tick++`; `counting-down` explains `ticks--`. This lesson separately explains pointer advancement in `*trips++` before the loop listing.
- **Modulo:** `subtracting-and-the-tick-counter` explicitly defines modulo 2³² as the remainder after dividing by 4294967296.
- **Zero extension and `uxtw`:** Module 6 defines zero extension. This lesson explains `uxtw` and the whole extended-register address calculation before displaying the loop.
- **Array/element/index and pre-index/post-index:** Defined in this lesson before being used in its exercises.
- **C array limits:** The current page explains that the one-past position can be a stopping point but cannot be read. “Array object” is formal wording, but the surrounding statements give the relevant practical rule. I do not raise a separate finding for it.

**Untaught knowledge requiring a correction:** `+=` (R1).

No other missing prerequisite was established. The exercises can otherwise be attempted using the explanations on this page and the earlier lessons. The review does not reproduce prediction results or challenge solutions.
