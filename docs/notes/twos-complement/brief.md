# Two’s complement teaching brief

User request: name and explain two’s complement in the existing signed/unsigned lesson,
use the existing model-computed bit diagram, explain that the top bit contributes a
negative weight, and connect inversion plus one to negation later. Merge after checks.

Prior knowledge: Module 0 arithmetic and registers, then hexadecimal and bit patterns.
No new lesson, instruction, visual component or challenge is required.

Checked facts:

- C23 draft N3096, 6.2.6.2 paragraphs 2 and 6 (note 2), specifies the negative
  power-of-two weight of the sign bit and names this representation two’s complement.
  Downloaded 30 October 2026 from https://www.open-std.org/jtc1/sc22/wg14/www/docs/n3096.pdf;
  extracted locally as `/tmp/twos-n3096.txt`.
- The course’s 32-bit readings use top weight −2147483648 signed, +2147483648
  unsigned, other bits unchanged. `packages/views/src/readings.ts`, `topBitTable`,
  computes the diagram from simulator states. Existing facts tests cover every bit
  weight, top-bit toggling, both limits, −12 and all bits set.
- Initial diagram pattern `0xfffffff4` reads −12 or 4294967284. Its existing
  top/other decomposition is sufficient as the initial worked example.
- All bits set: top signed −2147483648 plus other bits 2147483647 gives −1;
  unsigned 4294967295. Explain this only in the existing success-only
  `constructionSolved` note, after `make-minus-one` passes.
- At 32 bits, inverting every bit and adding one, keeping the low 32 bits,
  produces the same bits as zero minus the original. Zero remains zero;
  the smallest signed value produces its original bits and cannot have a
  representable positive signed counterpart. The existing Module 2 negation
  experiment demonstrates the latter and sets V. Keep that qualification.
- Add the inversion rule beside `neg`/`negs`, not to the first signed-readings
  explanation. Module 1 arithmetic already teaches retaining the low 32 bits.

Draft/review scope: follow `docs/style.md`, `docs/visual-language.md` and
`docs/authoring.md`. Draft wording separately; obtain independent learner
(GPT-6.1 sol High) and technical (GPT-6.1 sol Extra High) reviews of the built
phone/desktop page in both themes. Canonical records must stay synchronised.
Preserve prediction/answer gates. Do not expose −1 before its exercise.

Historical module briefs withheld this term; this request deliberately introduces
it at its mechanism in Module 1. Update the live term home and related assertions.
Historical briefs remain a record of earlier decisions.
