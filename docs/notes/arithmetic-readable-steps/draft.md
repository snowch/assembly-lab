# Arithmetic reading structure: draft record

Separate drafting pass from the checked brief, with the repository authoring and style
instructions read before editing. The drafting agent used GPT-6.1 Sol with Medium effort;
independent reviews remain with the managing session.

## Changed locations

- `four-bit-arithmetic.prose.ts`, `addition.before`: separate the weights and signed range
  into factual bullets. Put the column procedure in numbered steps, with the initial zero
  carry, incoming carry definition and repeated move to the left explicit. Put the two
  existing binary carry cases in their own bullets. Keep the column-reveal qualification
  beside the control guidance.
- `four-bit-arithmetic.prose.ts`, `subtraction.before`: number inversion, adding one and
  adding the opposite to the first input. Preserve the following cancellation explanation
  as causal prose.
- `four-bit-arithmetic.prose.ts`, `practice.task`: number the three requested responses.
  Keep four-digit formatting and the fresh inputs before the list; add no answer.
- `constants-and-widths.prose.ts`, `prediction`: give each of the three hexadecimal
  representations a bullet. Preserve the fourth number's context and the prediction gate.
- `constants-and-widths.prose.ts`, `construction`: number the divide, upper-half and
  remainder steps. Keep the non-negative 32-bit qualification before the procedure and the
  existing numerical example immediately afterwards.
- `twos-complement.prose.ts`, `reading.before` and `reading.after`: put the paired readings
  of `1010` and the paired four-bit ranges in bullets. Preserve unchanged-bit reasoning
  and the explanation of the asymmetric signed range as prose.
- `twos-complement.prose.ts`, `negation.before`: number the existing separate example's
  inversion, addition and retention. Keep the original-width and signed-fit qualifications,
  the independent starting pattern and the figure's calculation-role explanation visible.
- `twos-complement.prose.ts`, `bridge.prose`: give the paired 32-bit ranges bullets. Keep
  the relation between width, weights and limits in prose.

Synchronised the canonical copies in `docs/notes/four-bit-arithmetic/draft.md`,
`docs/notes/module-1/prose.md` and `docs/notes/twos-complement-appendix/prose.md`.

## Candidates left as prose

- Module 1's hexadecimal conversion paragraph develops a concrete example, rather than
  giving independent facts. The unsigned-weight paragraph defines a doubling rule and its
  consequence. Neither needs another list.
- Module 1's addition/wrap explanation and type comparison explain why the resulting bits
  behave as they do; bulleting them would separate causes from consequences.
- Module 1's 32-bit range sentence is already a short paired fact. The Appendix B range
  lists are more useful beside its interactive reading comparison.
- Appendix B's unsigned/signed weight explanation and the 32-bit top-weight paragraph
  develop a rule. Its negation proof explains cancellation and fixed width. These stay
  connected prose.
- Captions, hints, feedback, post-grade answers and the controls remain unchanged. They
  are short or gated; the surrounding structure now carries the reading improvement.

## Draft checks

Read both closing style passes and the changed teaching sequence. No new examples,
numerical claims, headings, controls or prediction answers were introduced. Checked
`pacing-1-4.ts`: the changed constants prediction and construction are included as whole
sections, so their additional paragraph breaks need no structure-index adjustment. Left
all other files, including `docs/notes/module-12/pi-sources-brief.md`, untouched.

Ran Prettier on the three changed TypeScript prose files. This drafting pass did not run
lesson tests or inspect the browser; independent technical and learner reviews follow.
