# Constants and widths: independent learner and built-page review

Reviewer: register_width_reader, separate from the copy/component authors. Reviewed the built
lesson on 24 October 2026 at http://localhost:4340/assembly-lab/#/lesson/constants-and-widths.
Prerequisites were the front-page entry requirements, all earlier Fundamentals lessons and
Same bits, two readings. No later lesson was used as prerequisite knowledge.

## Verdict and explanation pass

No blocking learner or layout finding.

The revised sentence, “The w names in the earlier arithmetic examples selected 32 bits”, is
accurate after the new opening overview. It describes those arithmetic examples rather than
claiming that every earlier illustration displayed only that width. The following explanation
uses a specific matching pair of register names and explicitly states that they are one register.

The early overview defines the relationship between names and widths. It does not state the
upper-half effect of writing through the narrower name. The prediction in this lesson therefore
still poses a new question about an instruction's effect. Its detailed demonstration remains
useful: a complete two-instruction example distinguishes knowing which bits a name selects from
knowing what a write does. The reveal/stepper remains gated until a prediction is checked.
Neither the worked sequence nor the fresh final trace requires the learner to know a later lesson.

The whole rendered lesson was read, including objectives, initial compiled example, constant
rules, construction instructions, width experiment, generalisation, challenge and reflection.
The sentence pass found no new undefined term or broken join in the changed paragraph. The
explanation pass found a suitable progression from the early naming overview to the later
write-effect experiment and independent trace.

## Prior-knowledge audit

- The lesson assumes operands, destination, instruction execution, registers and the x/w naming
  relationship. Earlier Fundamentals now supplies that relationship explicitly.
- Hexadecimal and the two readings of 32-bit patterns come from the preceding lesson.
- mov and constant are defined before the first prediction; movk and its operand suffix are
  explained with a small worked construction before they are needed in the editor.
- void, long and the unsigned literal suffix are explained locally. The compiler/version note
  refers to the already introduced GCC setting.
- No new assumption about memory-transfer instructions, special registers or native tools is
  needed by the changed width paragraph.

Potential wording concern considered, not raised as a required correction: “Split a register's
32 bits into two halves” uses shorthand earlier in this lesson. It follows mov w0 examples and
a 32-bit constant discussion, and the figure labels the selected view w0. The later construction
also qualifies its rule “With a w name”. Within this local context it does not claim that the
underlying full register has only that width.

## Built-page checks

Real Chromium at 375 and 1280 CSS pixels, light and dark: four fresh contexts. Verified actual
html[data-theme] in every context. The affected section and initial prediction are readable;
visually inspected phone-dark stepped and desktop-light initial screenshots. No document-level
horizontal overflow or page errors occurred.

In each context checked the initial prediction, the locked width stepper, a committed prediction,
the unlocked initial state, both instructions one at a time and Reset. The instruction marker,
full/narrow labels, two halves and write-versus-cleared treatments followed the actual run.
Reset restored the initial display. The exercise fields remained a separate fresh trace; this
reader did not submit challenge solutions or claim a full-suite or independent hardware test.

Evidence outside the repository: /tmp/width-reader.mjs, /tmp/width-reader-results.json and
/tmp/width-reader-{375,1280}-{light,dark}-{initial,stepped}.png.
