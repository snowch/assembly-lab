<!-- Copyright © 2026 Christopher Snow -->

# Second clarity review: Memory and addresses

Independent reader review, 18 October 2026. Read the chapter and formed findings before consulting the first English review. Assumed the front-page prerequisites and lessons through `counting-down`, with no later material. No new issue category found. Both previously retained findings remain open.

## Findings

### C11-1 — Medium: correct instructions appear under a heading that calls them mistakes

Rendered pairing: **“COMMON MISTAKE” / “Use the value in w1 as the source and the address in x0 as the destination.”** Source: [lesson prose](../../../content/lessons/memory-and-addresses.prose.ts), line 34; headings: [runtime strings](../../../platform/lesson-runtime/src/strings.ts), line 122.

The hint instructs the learner to do the correct thing, while its heading identifies a mistake. Someone using the hint to resolve uncertainty has to decide whether the instruction is recommended or prohibited. The second challenge has the same problem: **“COMMON MISTAKE” / “Load four bytes from the address in x0.”** (line 59). The next heading, **“SMALLER EXAMPLE”**, introduces the general syntax instruction **“Put the address register inside square brackets.”** (line 35), rather than an example.

Direction: make the affected lesson hints perform the function their headings promise. Preserve the shared platform copy. This confirms retained **M6**; these are its already recorded occurrences, not additional issues.

### C11-2 — Low: the reality note names C restrictions without explaining their meaning

Quote: **“Real programs must also have permission to access memory, and C requires a valid object of a suitable type.”** Source: [lesson prose](../../../content/lessons/memory-and-addresses.prose.ts), line 71.

“Object” has a specialised meaning in C. Neither the prerequisites nor the earlier lessons establish it. “Valid” and “suitable” leave the learner without a concrete connection between that requirement and the pointer accesses just introduced. The surrounding sentences explain the simulator's prepared memory but do not explain the C requirement.

Direction: explain the relevant storage/type requirement in ordinary language at the level needed for these accesses. A full account of C memory rules is unnecessary. This confirms retained **L12**.

## Knowledge assumed and checked

The outstanding unexplained assumption is C's specialised meaning of “object” and the associated validity/type requirement in C11-2.

Checked without raising further findings:

- Module 0 introduces GCC, the compiler setting `-O1`, instructions, listings, argument/result registers and memory. The expanded compiler note also gives the full command.
- `one-pattern-three-readings` explains hexadecimal, `0x`, bit positions and signed/unsigned readings. `constants-and-widths` explains the two register views, clearing the upper half on a `w` write, and the `long` integer type.
- The branches chapter explains labels and their colons. The front page assumes small C functions, conditions, loops and array indexing, and expressly says prior pointer knowledge is unnecessary.
- This chapter supplies the missing pointer knowledge locally: bytes, addresses, pointer declaration and dereference, `const`, brackets, load/store, little-endian order and halfword are explained before the learner must use them. The `w0`/`x0` overlap is reinforced explicitly.
- The optional compiler note identifies the target and integer sizes; the main explanation describes the different instruction widths. These distinctions are concrete and do not need stylistic rewriting.

After forming the findings, compared the [earlier chapter review](../english-review/11-memory-and-addresses.md) and [ranked review](../english-review/README.md). Both findings match retained issues. No previously rejected suggestion was revived.

## Scope and browser evidence

Read all ten sections, objectives, labels, captions, prediction choices and explanations, both tasks, all ten hints, test labels, reflection answer and model-versus-reality note. Inspected lesson wiring, the displayed entries in `memory.listings.ts`, memory figure strings in `packages/views/src/strings.memory.ts`, memory-specific feedback in `strings.memory-runtime.ts`, and the runtime hint headings.

Used Chromium on the immutable preview at `http://127.0.0.1:4253/assembly-lab/#/lesson/memory-and-addresses`, at **1280 × 900 and 375 × 900**, each in light and dark themes. In each configuration:

- Opened all details, including the compiler note and reflection answer.
- Submitted all four choices for each of the two predictions, reading the resulting feedback.
- Ran the unchanged starting code for both exercises and revealed all five hints on each.
- Stepped all seven memory figures through their available instructions, reading initial, transfer and returned states.

Inspected the captured wide-load figures and challenge hints across the four width/theme configurations. The document width matched the viewport in each. This review did not submit passing exercise programs, inject malformed assembly, test every editor mode, or exercise arbitrary memory inputs. Those untriggered states are not claimed as browser coverage. No build or test suite was run by this reviewer.

Temporary evidence, not committed:

- Script: `/tmp/clarity2-11.mjs`.
- Rendered text: `/tmp/clarity2-11-{1280,375}-{light,dark}.txt`.
- Screenshots: `/tmp/clarity2-11-{1280,375}-{light,dark}-{initial,write-save-distance,write-copy-distance,wide}.png`.

The captures contain exercise hints; this report does not reproduce complete challenge answers. Only this review file was changed.
