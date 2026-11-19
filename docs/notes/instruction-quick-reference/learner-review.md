# Independent learner and UI review

Copyright © 2026 Christopher Snow

## Scope and preparation

Reviewer did not draft or implement these changes. Read the checked brief, CLAUDE.md, authoring and style guidance, the front-page prerequisites, the current reference UI and the tick-counter exercise. The learner is a programmer who can read small C functions, use basic arithmetic and read small binary numbers. Earlier lessons teach assembly operand order, register widths, hexadecimal, two's complement, arithmetic and flags before the tick-counter exercise.

Reviewed the built local course with Chromium through Playwright. Actual light and dark themes were set and root data-theme checked at desktop 1280×900 and touch phone 375×900. Keyboard/focus tests also used phone 375×812. Latest checked build ID: `8ecd8201680d30a8f68c698192618dfcfd71a68aabc89ff1a2f7bf40dbed3714`, JS asset `assets/index-ByqOzY6V.js`, build commit metadata `6dc60f615e583d97274d66e319133f78a18b3508` (uncommitted working-tree changes included).

## Findings and independent corrections

1. **Medium: conditional branch names were not searchable as written in code.** Search's placeholder promised “Instruction name or operation”, but `b.eq` returned “No instructions match your search in this list.” The catalog instead uses the family name `b.cond`. A learner has no reason to guess that internal spelling. Direction: recognise valid conditional branch spellings and resolve the family entry. Accepted and corrected. Independently rechecked `b.eq` at both sizes and both actual themes: exactly the `b.cond` entry appears. This lookup does not change which instructions an exercise permits.

2. **Medium: phone modal close lost the return focus.** After opening Reference from the header, focusing Close, pressing Shift+Tab and Escape, the dialog disappeared but Reference was inactive. This was an actual awaited `toBeFocused` failure, not inferred from source. Direction: close the native modal before returning focus to its invoker. Accepted and corrected. Independently rechecked latest built version: Escape after Shift+Tab returns focus at all four size/theme combinations; phone Close button also returns focus in both actual themes. Phone modal focus stays inside the dialog when tabbing past Close.

3. **Low: retain neutral exercise context in the broader list.** “Allowed in: Write elapsed” was easy to read as a claim about the visible All browser instructions list. The technical review separately identified this wording. The rebuilt UI now uses “Exercise: Write elapsed”. The per-instruction “Not allowed in this exercise.” warning remains visible for an unavailable instruction (`nop`). Independently observed in the final four-way workflow.

## Built interaction checks

- Opened the tick-counter assembly exercise and entered the screenshot's invalid add immediate. Syntax for add opened the reference with ADD first and expanded, search focused and Allowed here selected.
- Clearing the search displayed exactly the exercise's five allowed instruction names. Switching to All browser instructions permitted a `nop` lookup, with the unavailable-in-exercise warning.
- Read the syntax notation disclosure and ADD operand rules. The immediate limits are present; examples use unrelated registers rather than an exercise solution. The tool neither inserts source nor reveals test answers or hints.
- Escape returned focus to Syntax for add without changing the source. After Run tests, exactly one copy of the immediate diagnostic remained; the textarea stayed invalid. Reload preserved the edited source.
- Inspected phone/light and desktop/dark screenshots, then repeated the functional flow in the other two combinations. Page and dialog had no horizontal overflow; no JavaScript page errors were recorded.
- Used the compact native theme picker with keyboard Home, ArrowDown and Enter: actual theme became light and a visible focus outline remained. Latest phone select hit target measured 44×44 CSS pixels in both themes.
- Read the reference's public instruction information and UI source. No code path in this tool reads reference solutions, expected answers or hidden tests.

## Assumptions and remaining evidence gaps

The optional broad reference includes later concepts such as stack-pointer forms, shifts, extensions and conditions. These are advanced lookup material rather than prerequisites added to the current exercise. Register placeholders, immediates, labels, memory brackets and conditions are explained in “Reading the syntax”. The main exercise route remains usable without opening the reference. Do not describe this drawer as teaching or practising all those mechanisms.

ADD's complete operand rules are long on a phone. For the reported immediate error, the relevant limit requires scrolling below the syntax forms and first register rule. This is a future information-ordering opportunity, not a blocker: the error itself already gives the immediate bound, the reference shows the rule accurately, and the user requested allowed parameter forms. A future form-specific lookup could prioritise the failing operand while retaining the complete reference.

No human novice study, screen-reader session, physical mobile device test or exhaustive all-instruction reading was performed in this learner review. Parser/native correctness belongs to the separate technical checks. These browser checks establish the observed interaction behaviour, not learning effectiveness.

## Original attempts and reruns

- The initially supplied port4173 URL returned404 because the preview command had positional arguments instead of Vite options. Started a correctly scoped preview on4320. This was a review-tool setup failure, not a product finding.
- An initial follow-up used the source lesson's superseded title in a heading assertion. The current rendered heading is “Following a branch”; corrected the review selector without changing production text.
- The original phone focus failure remains recorded above. The subsequent successful four-way rerun does not change that original failure's status.
- No full test suite was run by this reviewer. Focused scripts and screenshots are local evidence under `/tmp/reference-learner/`; the managing session records complete-suite and publication results separately.
