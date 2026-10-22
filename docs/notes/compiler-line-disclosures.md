# Compiler line reference disclosures

The user requested that the optional “Compiler's C line references” disclosure appear on the
first example, and later only when a lesson discusses a mismatch. It had been added to every
C-backed listing by the shared renderer.

`ListingView` now defaults `showCompilerLines` to false. `ListingFigure` forwards an explicit
opt-in. The course enables it in two places:

- Module 0, `trip-listing`, where the compiler and checked source associations are introduced.
- Module 4, `describe-listing`, where the prose explains the different source associations for
  `cmn`, `mov` and `csel`, and points readers to the original references.

The second exception was identified independently during technical review and confirmed by
`branches.prose.ts` and its canonical copy in `docs/notes/module-4/prose.md`. Routine static
listings, steppers, comparisons and local compiler results use the shared default. Original
compiler line metadata and checked source associations remain unchanged; only the optional
raw-reference disclosure is omitted. No learner-facing wording changed, so a separate prose
drafting pass was unnecessary. Authoring guidance now records the explicit opt-in rule.

The component test checks that routine figures keep their checked line tags and highlighting,
and that raw metadata is retained. The existing raw-reference test explicitly opts in. A
course-wide content test pins the two intended opt-ins. A browser regression visits every
lesson route in light/dark on desktop and a 360px phone, checks the number of disclosures,
opens the two exceptions, verifies that checked tags stay unchanged and checks page overflow.

Initial verification: focused component/lesson tests passed, 3 files and 61 tests. The built-site
course-wide regression passed all 4 browser cases. Independent rendered learner and final
technical review, and the full check, are recorded below after completion.

Independent technical review passed, with no blocking findings. It confirmed that the shared
renderer covers routine static, stepping, comparison and compiler figures, and that the original
records are unchanged. It exercised Module 0, Module 1 and Branches at 360/1280px in actual
light/dark: expected counts, closed/open state, raw tags 3/4/7/7 on the introduction, checked tags
and C highlighting on the Module 1 stepper, and no overflow or page errors. This was a source
and browser DOM review, not a screenshot review.

Independent learner review passed at 360, 375 and 1280px in actual light/dark. It exercised the
introduction's closed/open disclosure, routine Module 0/1 figures after stepping, addition
commitment and comparison reveal, Branches' mismatch details, and later loading-widths examples.
It inspected phone/desktop screenshots in both themes and confirmed internal paired-listing
scrolling at 360px, without document overflow or browser errors. No blocking findings remained.
Both reviewers used the parent session's available model/effort, with no model override. The
implementation and engineering documentation were written directly; existing learner strings
were reused unchanged.
