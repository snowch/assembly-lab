# Independent learner and UX review

Reviewed 8 November 2026 in `/workspace/assembly-lab-return-values`, relative to
reviewed base `e7c24d4`. Read the local repository instructions, `docs/style.md`
and actual implementation diff before the design brief. Then inspected the
supplied `4592.jpg`, the lesson and its earlier prerequisites. I did not draft or
edit the implementation. The original worktree and PR102 were not modified.

## Verdict

No learner or UX finding in this change. No correction requested.

“Why the same bits mean different numbers” describes the question the current
returned values raise. “The lower 31 bits have the same positive weights in both
readings” and the next sentence about bit 31 identify precisely which weights
stay the same and which differ. This does not ask the learner to treat the top
bit as a separate minus sign. The callout connects the current shared hexadecimal
word to its C readings. “Bit 31 is set, so its contribution equals its weight in
each reading” locally explains why this example uses the full top-bit weights.

The table and sums have distinguishable jobs. “Contributions to each C value”
compares the lower contributions, highest-bit contributions and returned values
across the two types. The separate sums put each addition in vertical arithmetic
form, with aligned digits and a rule before its result. Their visible signs and
type labels carry the distinction without relying on colour. The two-column
comparison and larger arithmetic remain readable when the sum cards stack on a
phone. This follows the supplied mock's structure without adding another bit grid.

The repeated totals are useful here: the earlier cards answer what each function
returned, the table compares its contributions, and the sums show their addition.
The shared-word callout also removes the need to retain the earlier bit display
while reading the calculation. I found no excessive repetition that obscured the
mechanism. The existing type-rule and no-warning qualifications remain local.

The new section remains absent before prediction commitment and before Run
comparison. Reset removes it; reload restores either the completed comparison or
its reset state consistently. No new early numerical answer or closing-question
answer was introduced.

## Prerequisites and assumed knowledge

The learner needs the front page's C prerequisites and the earlier lessons only.
`tiny-function` defines compiler, listing, caller and argument and connects a return
to w0. The preceding signed/unsigned reading lesson explicitly teaches that a set
bit contributes its positional weight, a clear bit contributes zero, and lower
weights stay positive. Its 32-bit bridge identifies bit 31. The preceding four-bit
arithmetic applies these rules to subtraction and rejects a separate minus-sign
interpretation.

The current page locally identifies `unsigned` with `unsigned int`, its width and
its return reading. “Weight”, “contribution”, “clear” and “set” are therefore
available here. I found no additional unexplained assumed knowledge introduced by
the revised section. The return-zero reflection remains a fresh application.

## Built browser checks

Used Chromium/Playwright at `http://localhost:4520/assembly-lab/`, after confirming
the final build log completed and the revised heading, callout, table and sums
were actually rendered. Checked all six combinations of 375, 640 and 1280 pixels
wide, 900 pixels high, in light and dark. Confirmed actual `data-theme` and body
background colours, then visually inspected explanation screenshots in every
combination.

For the real `arithmetic-on-register-bits` lesson, checked initial, committed,
returned, reloaded returned, reset and reloaded reset states. Checked the computed
table contributions and totals, two sum cards, one shared-word callout and the
heading. Tab reached the reminder link from the comparison controls; Enter opened
`same-bits-two-readings`, and browser Back restored the returned comparison.

No page or console errors were captured. Page scroll width matched each viewport
in the checked states. The explanation's own scroll width matched its available
width: 343, 608 and 992 pixels respectively. Its tables measured 317, 558 and
942 pixels, fitting their panels. Both sum cards fitted their available widths.
These geometry measurements supplement the screenshot inspection.

Scratch browser script and evidence: `/tmp/return-values-learner-review.mjs` and
`/tmp/return-values-review/`. They are session evidence, not course artifacts.

## Source/component checks and limits

Independently ran:

```text
npm test -- packages/views/src/interactives/ListingCompare.calls.test.tsx
```

Exit 0: one file, 11 tests passed, no skipped tests. This focused suite covers
negative and positive differences, the clear top bit, matching equal types,
restoration, reset, differing words and a failed call. Read the corresponding
source branches: equal values use “How the bits give the returned values”; a clear
top bit gets zero contributions; matching equal types omit the sign-difference
claim; differing words and faults do not get a shared explanation. These alternate
cases were source/component checks, not invented browser states in the published
lesson. The equal-type fixture uses a clear top bit; a set top bit with equal types
was inspected in the formula and conditional prose only.

This is a clarity review, not a beginner learning study. I did not run the full
repository suite, GNU/QEMU checks, screen-reader software or unrelated lessons.
The focused result above does not imply those checks passed.
