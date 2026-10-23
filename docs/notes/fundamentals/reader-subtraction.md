# Learner review: Subtraction and reuse

Copyright © 2026 Christopher Snow

Independent reader, 23 October 2026. Prerequisites: the front page's C basics, One addition and
A tiny function; no later lessons. Read the built lesson before the implementation rationale.
No application edits made.

## Evidence

Browsed `http://127.0.0.1:4322/assembly-lab/#/lesson/subtraction-and-reuse` at 375×900 and
1280×900, in light and dark. In every context the actual `html[data-theme]` matched the
requested theme and the document had no horizontal overflow.

Both figures are present on the page immediately. Each labels its starting inputs and one
instruction. Running the reuse figure leaves the subtraction figure at its initial position.
Running the subtraction, reloading and resetting restored positions 1 and 0 respectively in
all four contexts. Viewed phone screenshots in both themes and desktop screenshots, including
initial and executed figures. The old input values remain explicitly labelled “Before the
instruction”, while the computed read/write flow labels the result. The arrows are readable.

Exercise checks: wrong entries are rejected without giving away their replacement values;
the reference entries pass; entries and completion survive reload. All five hints were opened
in each context. Directly viewed the phone hint and restored-completion screenshots. First
ad-hoc script timed out locating Clear work after reload; a diagnostic rerun showed the button
and the correctly restored completed form. This was a harness limitation: the accessible name includes the challenge title. A corrected
locator plus the required Discard work confirmation verified cleared fields in all four contexts.
Do not count the first failed script as a successful clear-work check. The initial
script also searched for “1 of 1” on success, while actual wording is “All 1 tests passed”;
the latter wording was independently observed.

Artifacts are local `/tmp/sub-{375,1280}-{light,dark}-*.png` and matching text captures;
`/tmp/sub-clear.png` shows restored completion. These are review artifacts, not repository assets.

## Learning assessment

The page defines register reuse before asking for a prediction, demonstrates it with one
addition, then introduces subtraction in a separate worked example. The second example's
inputs are explicitly independent. The fresh exercise keeps the same instruction and changes
the inputs, so the bridge is application of the demonstrated operand order and read-before-write
rule, rather than learning another mechanism at the same time. Both examples are directly
available; no required activity is behind a pager or optional disclosure.

The two examples belong together: the addition isolates reuse without introducing subtraction,
then subtraction adds operand order. A smaller single-subtraction-only lesson would leave the
reader to discover read-before-write and subtraction order simultaneously. No missing essential
prerequisite or answer leak was found. Several short sections repeat the operand rule, but their
short reminders do not recreate the previous crowded simultaneous-program view.

## Findings for sceptic

- **Low, hint specificity.** Hint 3 is labelled “SMALLER EXAMPLE” but says “The worked subtraction
  above also reads `w1` before replacing its value.” This recalls a mechanism, without giving
  a concrete smaller case. The worked subtraction also uses larger inputs than the fresh exercise.
  Direction: use a checked small case that demonstrates read-before-write, or justify why this
  hint category should be a reference to the earlier worked example. This does not prevent the
  learner attempting or solving the exercise.

## Assumed knowledge not taught

No additional technical prerequisite found. Destination, operand, instruction, register and
`add` were taught in One addition; `sub` and its operand order are defined before the subtraction
figure. “Old value” and “new value” use ordinary language backed by the before/read/write labels.
The caller/return machinery from A tiny function is not required by either arithmetic figure.

No native hardware execution, screen-reader pass or later lesson was reviewed here. This is a
learner review, not a replacement for technical and automated checks.
