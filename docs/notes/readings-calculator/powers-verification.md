# Calculator powers

The scratch calculator accepts `^` for exact whole-number powers. Powers bind above unary signs
and multiplication, and associate to the right; parentheses choose another grouping. As with
BigInt exponentiation, a zero exponent produces one, including zero raised to zero. Negative
exponents receive dedicated feedback. Existing exact division and decimal-input rules remain.

The parser retains its 200-character input bound. Exponents are capped at 4096 and intermediate
magnitudes at 16384 bits. Repeated squaring checks each multiplication before proceeding, so it
does not first allocate an unbounded power. Addition and multiplication also check the magnitude
limit; division and unary signs cannot increase it. These bounds are scratch-calculator resource
limits, not Arm register limits. The calculator still reads no bit pattern and writes no answer.

Copy was drafted separately by GPT-6.1 Sol at Medium effort (`powers-copy.md`). Independent learner
and technical review used GPT-6.1 Sol at High effort (`powers-review.md`).

Focused validation passed: 38 parser/component tests, strict TypeScript and the production build.
The four calculator browser cases passed at desktop/phone widths in both themes. They exercise
powers through both calculator placements, exact 64-bit results, negative-power feedback and
recovery, formatted guidance, keyboard entry, answer isolation, contrast and touch targets.

Independent review found no remaining issues. It separately checked 37 directed parser cases,
247 native-BigInt comparisons and both calculator placements at phone/desktop widths in both
actual themes, including keyboard operation, errors, recovery and answer isolation.

The full local `npm run check` passed formatting, copyright, platform integrity, TypeScript,
all 3156 unit/integration tests across 176 files and the production build. The workspace restart
interrupted its browser phase after 1397 passes and 20 skips, with no failures and 19 tests left.
No final exit status was recovered, so this is not recorded as a completed full-check pass.
A separate unchanged phone run of `shifts`, `two-argument-function`, `twos-complement` and
`where-next` passed all 37 cases, covering all 19 remaining cases and repeating 18. Together,
the local browser runs exercised every non-skipped case without a failure.

GitHub CI results will be recorded in the pull request after completion.
