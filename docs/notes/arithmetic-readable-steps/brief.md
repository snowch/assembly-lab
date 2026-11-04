# Arithmetic facts and procedures: reading structure

The user approved bullets for four-bit weights/range, ordered addition steps and separate
carry examples, and requested similar improvements. Preserve the teaching sequence and
all answers, numbers, widths and qualifications. Improve scanning, not the amount taught.

Checked facts: `four-bit-arithmetic.prose.ts`, its facts tests and
`packages/views/src/four-bit-arithmetic.test.ts` pin weights, signed range, column arithmetic,
negation and width rules. `twos-complement.prose.ts` and the appendix facts/model tests pin
four/32-bit ranges, fixed-width negation and the signed-limit qualification. Existing
figures show those calculations; no interaction or numerical changes are needed.

Drafting scope: four-bit arithmetic plus nearby arithmetic/representation prose. Inspect
Module 1 and Appendix B for comparable dense parallel facts or ordered procedures. Make
small targeted changes where a list improves reading; leave causal explanations in prose.
In particular inspect subtraction construction and the multi-part practice prompt, and
Appendix B's paired readings/ranges and negation steps. Preserve terms before first use,
independent-example resets, and the difference between a column reveal and an instruction.
Do not put list markup in captions or strings rendered as plain text.

Prerequisites: binary/hexadecimal patterns and signed versus unsigned readings precede the
four-bit lesson; Appendix B supplies its own four-bit setup. No new concepts or UI controls.
Use docs/style.md's sentence and idea passes; docs/authoring.md governs canonical copies.

Independent learner and technical review must inspect the changed built pages at phone and
desktop widths in light/dark themes. Check real lists, sequential meaning, answer gates and
no extra headings. This is an editorial review, not evidence from a novice study.

Draft: GPT-6.1 Sol Medium. Independent reviews: GPT-6.1 Sol High and Extra High.
