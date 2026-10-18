# Independent review of the prerequisites disclosure

Verdict: pass for the technical change and learner-facing wording. No blocking
or advisory findings in this change.

Reviewed the brief, wording note, `CLAUDE.md` and `docs/style.md`, then inspected
the changes to `FrontPage.tsx`, `strings.ts`, `styles/app.css` and the existing
further-reading browser test. The reviewer did not write those changes.

## Built-page checks

Used the immutable production preview at
`http://127.0.0.1:4251/assembly-lab/` in Chromium. Checked all four combinations
of 1280 × 900 and 375 × 900 viewports with light and dark themes. Visually read
eight section screenshots, covering the open and closed states in each
configuration. The browser script and measurements are retained locally at
`/tmp/prereqs-independent-review.mjs` and
`/tmp/prereqs-independent-review.json`; screenshots use
`/tmp/prereqs-{width}-{theme}-{open|closed}.png`.

- Initially, “Before you start” and both introductory sentences remain visible.
  The C list, arithmetic guidance, example and further reading are hidden.
- The disclosure label reads “Check what you need to know”. The standard triangle
  is visible, pointing right when closed and down when open.
- Tab navigation reaches the summary. Enter opens it; Space closes and reopens
  it. Keyboard focus has a visible 3-pixel outline in both themes.
- The summary measures 47.89 pixels tall at both widths, exceeding the required
  40-pixel phone target.
- Expanding the panel reveals all existing guidance. Source inspection confirms
  every original content field remains rendered and the lead was only moved
  outside the disclosure. The further-reading test now opens the panel before
  checking its links.
- “Show the answer” remains independently closed when the outer panel opens.
  Opening that inner disclosure shows its answer normally.
- Expanded content uses two columns on desktop and one on the phone. The phone
  code wraps within its box. The text, links and controls remain readable in both
  themes. Neither the page nor the section overflows horizontally.
- No page errors occurred during the four browser checks.

## Learner review

The visible lead states the subjects the learner needs and makes clear that
assembly experience is unnecessary. “Check what you need to know” plainly offers
the detailed requirements. Its meaning does not depend on knowing a technical
term. Opening it presents the prerequisites before the quick check and reading
links. The separate answer control preserves the learner's opportunity to try
that check first.

Both closing style passes found no problem in the new label or the rearranged
section. The change introduces no new assumed knowledge or technical claim.
Existing prerequisite content remains available in full.
