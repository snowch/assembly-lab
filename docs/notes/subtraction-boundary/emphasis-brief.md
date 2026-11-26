<!-- Copyright © 2026 Christopher Snow -->

# Explicit unsigned carry boundary

The reader reported that the general `a >= b` rule had disappeared during the four-working redesign. Source review confirms that the following32-bit pane still states it, while the comparison pane says only “At equality and above”. Accept the local clarity finding: readers should be able to generalise the four calculations directly to both unsigned input relationships.

Keep the existing teaching route and four complete workings. Replace only the concluding takeaway with two bold bullets: unsigned `a >= b` gives carry out1 and no borrow; `a < b` gives carry out0 and borrow. State equality separately because the kept zero result does not imply carry out0. Keep the actual32-bit `subs` carry flag C and plain `sub` preservation qualification local. No new pane, control, exercise, term or stored state is needed. Earlier inversion/carry preparation and the later independent negation assessment are unchanged.

Checked facts: subtraction uses `a + NOT(b) + 1` at the chosen width. Its full sum is `a + 2^width − b`, so it reaches the outside place exactly when unsigned `a >= b`. Existing exhaustive model tests cover all256 small input pairs at4/32 widths, including zero and equality. The miniature remains a teaching projection; actual `subs` updates C at its real instruction width. Plain `sub` preserves C. The same authored programmes and native corpus already cover the displayed cases.

A separate drafting agent supplies the replacement; the canonical draft and strings remain synchronised. Apply the sentence and idea passes to the local rule and its join to the next pane. Independently check numerical scope and learner clarity, then inspect bold/list markup and wrapping at phone/desktop widths in both themes. Run existing focused checks and full CI before merging, then verify the exact deployed revision. Record functional evidence separately from learning effectiveness; no novice study is claimed.

## Verification record

The separately drafted takeaway is integrated unchanged, using the existing model placeholders for both outgoing bits. Existing model/figure/facts checks passed51 tests in4 files; all4 focused browser tests passed. Formatting, strict types, build, copyright and platform-copy checks passed. The parent checked eight built contexts at320/390/768/1440px in both actual themes: both bold comparison rules, equality text, preserved calculations, alignment, saved answers/reload, gates and no horizontal overflow. Independent technical review checked the general rule, final built scope/markup and state preservation with no open findings. Full CI and deployment identity are recorded in the PR. These checks are functional/content evidence, not a novice learning study.
