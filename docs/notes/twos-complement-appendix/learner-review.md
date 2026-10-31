# Independent learner review

Reviewer: GPT-6.1 Sol (`gpt-6.1-sol`), High effort. Date: 31 October 2026.

Scope: the changed signed-weight explanation in **Signed and unsigned readings**, the new
**Two’s complement** appendix, its discoverability and return path, and the top-bit markers.
I formed this assessment from the actual diff, lesson/component source and built pages before
reading any author brief or drafting rationale. I did not write or edit the teaching material.

The learner knows the front-page prerequisites, Module 0 and **Reading hexadecimal**. Appendix
B’s position after the other optional material does not grant knowledge of the intervening
modules. Read: `AGENTS.md`, `CLAUDE.md`, `docs/style.md`, `docs/authoring.md` and
`docs/visual-language.md`. I applied both closing style passes.

## Verdict and findings

No blocking, medium or minor learner findings in the reviewed change. The main lesson provides
the essential reading rule visibly before the figure. Appendix B supplies an accessible smaller
example and a qualified explanation of negation. Its controls and computed results support the
prose at phone and desktop widths in both themes.

The following suspected problems were checked and rejected, rather than left as open findings:

- **Clear bit confused with its weight.** The main lesson says, “A set bit, 1, contributes its
  weight to the total. A clear bit, 0, contributes zero.” It then changes only the top bit’s
  *weight* for the signed reading. Clearing bit 31 visibly makes its contribution zero in both
  table columns. The appendix deliberately keeps the weight rows while showing zero for clear
  bits in the sums. These are consistent distinctions.
- **Essential guidance hidden in optional detail.** Definitions, the contribution rule, the
  signed top weight and the agreement when the top bit is clear are visible. “Show calculation”
  contains the expanded arithmetic; it is not needed to discover the rule. The appendix link
  offers a smaller example without making the main lesson’s rule depend on opening it.
- **Four bits mistaken for an Arm register.** Before the first appendix figure: “These are small
  examples, not Arm register widths.” Width is defined immediately afterwards. The second
  figure also says that it computes a calculation and “does not execute Arm instructions”.
- **Second figure inherits a changed first figure.** The prose says, “This separate figure
  starts again with `1010`.” Changing the first figure left the second at its own starting
  pattern in the browser. Each has its own reset.
- **Negation presented as unconditional.** “When that value fits at the original width” is
  stated before the operation. The minimum preset retains the original negative reading and
  explicitly explains that the opposite positive value is outside the signed range. Zero shows
  the extra left bit, the retained four bits and the absence of a separate negative-zero pattern.
- **Marker labels describe a group rather than the actual top bit.** Screenshot inspection and
  browser geometry agree: the arrow is centred on bit 31 in the main and scratch readers, and
  on bit 3 in both appendix figures. The measured horizontal error was 0 px in every primary
  viewport/theme combination; each arrow was above its target button.

No fixes were made by this review. These rejected concerns do not need a learner-facing change.

## Preparation, demonstration and practice

**Defined:** The main page defines positive unsigned weights, the contribution of a set or clear
bit, and the changed signed top weight before asking the learner to use them. The appendix
locally defines width, four-bit weights, inversion and the low four bits. Its explanation of
the range comes before the minimum-value exploration.

**Demonstrated:** The first appendix figure shows every position of `1010`, the two weight rows
and both complete sums. This is small enough to follow without reconstructing a 32-bit sum.
The second figure starts from the same named example and shows inversion, addition and retention
as separate labelled rows. It gives the original and resulting signed readings, so the learner
can connect the operation to its purpose before exploring exceptions.

**Practised:** The learner can change any bit and compare the sums immediately. The second
figure permits another original pattern and provides zero and minimum presets with specific
feedback. I verified Space and Enter activation, maintained focus after a bit change, both
resets and the independence of the figures. This is exploratory practice, not a graded exercise;
the page describes it accordingly. The first figure’s reading rule prepares the signed-value
comparison in the second, and the final section explicitly bridges back to 32 bits.

A smaller complete candidate would be a three-bit pattern such as `110`: fewer positions would
still demonstrate a negative top contribution and a positive lower contribution. Four bits add
little bookkeeping, fit the already taught hexadecimal grouping, and provide both set and clear
positions in `1010`. The complete sums visibly account for all four positions. A further smaller
bridge or additional mandatory exercise is unnecessary for this optional explanation.

## Prerequisite audit

The front page already requires basic arithmetic and binary/decimal conversion. Module 0
provides registers, `w`/`x` names, instructions, C `int`, the simulator and execution controls;
the preceding hexadecimal lesson provides four-bit digit grouping and `0x` notation.

No unexplained prerequisite gap found for this learner. Signed and unsigned readings and two’s
complement are introduced on the main page. The appendix explains weight contributions, width,
inversion and retaining low bits locally. The algebra introduces `x` explicitly as the unsigned
value and explains the missing contribution from `1111` before using `15 − x`. Understanding
carry flags, C overflow rules, negation instructions, modular-arithmetic terminology or A32 is
not required. The Module 2 link identifies a later continuation rather than supplying a missing
definition needed here.

## Browser evidence and limits

Used the existing production build with a dedicated Vite preview on port **4471**; did not
rebuild. Independent Playwright inspection scripts, captured text, measurements and screenshots
are in `/tmp/al-appendix-learner-review/`, separate from product tests and their output.

Primary checks: Chromium, **375 × 900** and **1280 × 900**, light and dark. Selected each theme
through the UI and checked the rendered `html[data-theme]`, not just the preference. Read the
rendered lesson text and inspected full-page/figure screenshots, including the main reader,
scratch reader, first appendix figure and zero/minimum states. No page-level horizontal overflow
on the appendix at either primary width, and no browser page errors were observed.

Additional spot checks: **320 × 900** and **600 × 900**, both themes, plus repeat navigation at
375 px. Inspected the small-example screenshots, the narrow main-reader reset state and the
optional-plan entry. Main and appendix page scroll widths equalled their viewport widths.

Confirmed in the built browser:

- Appendix B is a visible, independently clickable course-plan entry under the optional paths;
  it can be entered before completing earlier activities.
- The main lesson’s named appendix link opens the appendix.
- The explicit return link opens **Signed and unsigned readings**. A first inspection read the
  old heading immediately after clicking; waiting for the destination heading confirmed normal
  client-side navigation. This was an inspection timing issue, not a defect.
- Both appendix starting states match their prose. Space toggles the first figure’s top bit;
  Enter toggles a bit in the negation figure. The first figure’s update does not alter the second.
- Resets restore each starting pattern. Zero and minimum presets produce the specifically
  labelled feedback and displayed stages described above.
- Main-reader keyboard toggling and Clear bits update the top-bit contribution consistently.
- Main/scratch bit-31 and appendix bit-3 arrows align in all primary width/theme combinations.

Source-only checks: the plan/lesson registration, main-page shared prose, source definitions of
the two independent figure states, calculation helper and exact link destinations. Read the
Module 2 link’s destination registration; did not review that lesson in the browser. Did not
rebuild, run the product test suite, inspect hardware behaviour, perform an exhaustive
screen-reader audit or independently certify Arm/C semantics. This is a learner review, not a
replacement for the separate technical review. No challenge answers were opened or recorded.

## Final caption recheck

After the final build, restarted the dedicated 4471 preview and checked the main reader at
375 × 900 in the actual light theme. Its rendered caption is now: “One 32-bit pattern, read two
ways. Only the top bit's weight differs.” The wording agrees with the visible rule and table;
it wraps readably, and the top-bit marker remains aligned with bit 31. Inspected
`/tmp/al-appendix-learner-review/final-caption-375-light.png`; page-level horizontal overflow
remained zero. No new learner finding. This was a narrow recheck of the caption-only change,
not a rerun of the earlier matrix. No rebuild or product tests were run by this reviewer.
