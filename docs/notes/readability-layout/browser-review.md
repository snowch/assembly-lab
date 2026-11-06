# Independent browser and learning-layout review

Copyright © 2026 Christopher Snow

The reviewer did not draft or edit product prose. This review applies `CLAUDE.md`,
`docs/authoring.md`, `docs/style.md`, the local learning-design skill and
`docs/visual-language.md`. The outcome is to make parallel facts and comparisons
findable and procedures traceable, while retaining explanations and local
qualifications beside the activities that need them.

## Scope and result

**Keep the final layout. No unresolved browser or learning-layout finding was
identified in this review.** The inspected lists have a common purpose, retain
complete clauses and keep cause-and-effect prose outside the list when it explains
the mechanism. Procedures use numbered steps; independent alternatives remain
bullets. Existing section boundaries remain visible without additional small
headings. No new prerequisite or answer-leakage concern arose from the formatting
changes inspected here. This is a layout judgement, not evidence of learning.

The final stable production build was served at
`http://localhost:4291/assembly-lab/` after the managing session froze author edits.
The baseline and final exports each contain 75 published lessons. The browser audit
visited all 75 lesson routes, the front page and Where next at 375 × 812 and
1280 × 800 pixels, in light and dark themes: **308 rendered route states passed**.
Representative interaction checks also passed in all four viewport/theme
combinations. Screenshot captures used 1280 × 900 for a taller desktop view.

This is an audit of rendered pages plus sampled interactions. It is not an
interactive completion of every activity on all 77 pages. The independent source
and technical comparison and full repository suite are recorded separately.

## Accepted finding and correction

**Medium, intermediate export:** `from-function-to-executable` ended its
investigation with “Their options here are:” while the option bullets began the
next published route. `loading-and-startup` also contained “The script groups
related content into sections:” without its following list. Reformatting source
paragraphs had moved the boundaries used by the pacing transformation.

Correction direction: keep each introduction and its complete list within the
same published lesson, then inspect the generated pages. The author updated the
pacing boundaries. The final browser confirms that the build commands, options
introduction and all three options remain together on
`from-function-to-executable`; `loading-and-startup` begins with its own setup and
shows all five section roles beside their introduction. The final page also has
one conditional-assembly explanation and its numbered diagnosing-lesson link.
The restore/rebuild procedure remains on the earlier page. The later stepping and
diagnosing routes retain both terminal roles and “Keep both open while stepping.”
The diagnosing route retains the complete three-command rebuild block. These
checks close the browser side of the related findings in
[independent-review.md](independent-review.md).

No findings were rejected or deferred by this browser review.

## Rendered checks

`node /workspace/scratch/readability-layout/browser-audit.mjs` exited 0 with
308 route states, zero problem states and zero issues. It checks:

- Correct page titles and published lesson-section counts.
- Generated lesson positions and lesson-reference prefixes against baseline module
  and sibling order, including Modules A and B.
- The actual rendered theme token as well as the saved theme preference. The tokens
  were `#f3f6f5` in light and `#101615` in dark throughout.
- The repository's shared `designProblems` checks: no text below 11 px, phone
  controls at least 40 px tall, prose measure, page-level horizontal overflow and
  contained register/editor/listing layouts.
- Visible Markdown punctuation, one-item prose lists, list grouping and browser
  console/runtime errors. No such issue appeared. The captured prose-list font
  size was 18 px; list widths stayed within the available prose column.

`node /workspace/scratch/readability-layout/browser-interactions.mjs` exited 0.
For each viewport and theme, it exercised:

- The front page's prerequisite disclosure and self-check answer using keyboard
  focus and Enter, including closing the answer again.
- The opening addition's initial state, execution, reload persistence, local reset
  and reset persistence after reload.
- The caller example through call, function execution, return and resumed caller,
  including reload after return, Back and reset.
- The missing-return prediction: no outcome or experiment controls before
  commitment, selecting an option still leaves the outcome hidden, explicit
  commitment reveals it, and the committed state survives reload.

The sampled post-interaction states also passed the shared design checks without
console or runtime errors. The prediction review and final-source comparison found
no movement of a gated answer into the new visible lists. The browser sample
confirms the gate still operates; it does not independently exercise every gate.

The focused primary-page check, `browser-primary.mjs`, additionally verifies the
exact lead “On this AArch64 target, both types use 32 bits:” immediately before
the two type-reading bullets, followed immediately by the `unsigned`/`unsigned int`
alias sentence, in all four viewport/theme combinations.

## Visual inspection

The reviewer visually inspected 48 screenshots through 12 four-view contact
sheets, covering both widths and both themes for each page:

| Page | Inspected layout |
| --- | --- |
| `arithmetic-on-register-bits` | Shared 32-bit target qualification immediately above the signed/unsigned type bullets, with the C alias sentence immediately below |
| `tiny-function` | Parallel incoming arguments, separate-call setup and nearby figure |
| `meet-the-machine` | Register-role list, execution-mark list and retained stepping directions |
| `counting-down` | Starting registers, numbered instruction sequence and locked experiment |
| `array-addresses` | Register roles, address-calculation steps and adjacent pointer/C limits |
| `runtime-startup` | Three grouped startup mechanisms with their local qualifications |
| `from-function-to-executable` | Build/options group and retained prediction locks |
| `loading-and-startup` | Complete section-role and directive lists, without a split introduction |
| `stepping-native-function` | Terminal roles, keep-open instruction and command explanations |
| `diagnosing-native-failure` | Rebuild/options group, terminal roles and connection instructions |
| `capture-pi-boot` | Ordered card preparation, complete filenames and nearby caution |
| `where-next` | Four ordered starter-check steps and surrounding extension guidance |

Bullets and numbers remain aligned, readable and distinct from code. Wrapped
clauses retain their meaning on the phone; punctuation renders normally. No
isolated fragment was made into a new visual object. Dense procedural material
remains grouped, and the small comparisons do not replace explanatory mechanisms.
The long code blocks keep their existing contained horizontal scrolling.

Artifacts are outside the checkout under
`/workspace/scratch/readability-layout/`: `browser-results.json`,
`browser-interactions.json`, the three harnesses, `screenshots/` and
`contact-sheets/`. Harness preflight against the earlier build had selector and
text-normalisation failures; these were harness errors corrected before the final
runs above, not product failures. The final runs had no failures or skips.

## Limits

No novice participated. Agent reading and browser checks can identify layout and
instruction defects; they do not demonstrate improved learning. No screen reader
or other assistive technology was used. Native procedures were inspected as
rendered instructions; this pass did not execute external tools, the remote
playground or physical Raspberry Pi steps. Optional disclosure contents and every
challenge's complete state space were not exhaustively operated in this browser
pass. The browser evidence supplements the independent source review and full
suite rather than replacing them.
