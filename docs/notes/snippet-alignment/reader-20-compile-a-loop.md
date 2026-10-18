# Independent learner review: lesson 20, Compile a loop and follow its branches

Copyright © 2026 Christopher Snow

Reviewed 18 October 2026 against the snippet-alignment brief, `CLAUDE.md` and
`docs/style.md`. The learner knows Before you start and lessons 00–19 only.
This is a review; no implementation, tests or challenge solutions were changed.

## Result

No new actionable snippet-alignment finding. The generated loop makes the
one-to-many source relationship understandable. The page says “A single `for`
line can correspond to several parts of the listing” and the listing supplies
three separate excerpts of that line: initialisation, condition and update.
The instruction order and the backward branch remain inspectable.

The distinction between excerpts and the whole function is explicit:
“Complete C source” precedes all nine original source lines, and the explanation
says “The instructions stay in their original order. A C line appears again when
later instructions also relate to it.” At phone width the wrapped `for` line stays
with its instruction group. Desktop columns retain shared row boundaries.

“Compiler's C line references” opens the original references separately, with the
qualification “These are the compiler's original line references. They may point
to a brace instead of the C operation an instruction carries out.” This lesson's
listing comes from the local compiler; the generic wording does not attribute it
to GCC. The full source, labels and 21 original instructions remain available.

## Observed viewport limitation, not an open blocker

**Low severity; same family as R08, not a new issue category.** The investigation
asks: “Step over the backward branch to see which comparison runs next.” On the
4267 build at 375 × 900 in both themes, pressing Next immediately after executing
`b .Lcourse0` scrolls the newly executed `mov w8, w3` into the visible portion of
the bounded listing. Its duplicated paired `for` excerpt is then above the browser
viewport. Measured excerpt bounds were −83.98 to −40.52 pixels; the visible portion
of the listing was 0 to 251.27 pixels. At the branch itself both source and executed
instruction were visible.

The compact card immediately above the controls still correctly displays
“Next: `mov w9, w0`, in `.Lcourse0`”, “Recorded against C line 5”, and the complete
wrapped `for` statement. The executed instruction and this next instruction both
belong to that line. The learner can therefore still inspect the relevant
source/instruction relationship. This is a limitation of seeing every duplicate
excerpt, not a missing or incorrect current source relationship. Direction: keep
the compact source card available; no additional fix is requested on this evidence.
The focused Reset check on 4267 showed the initial source and instruction together.

Evidence: `/tmp/snippet-reader20-375-{light,dark}-after-loopback-viewport.png`,
`/tmp/snippet-reader20-viewport.log`, and the matching `-loopback-viewport.png`
captures. The main geometry log's strict whole-box test marks some instructions
as outside the listing by less than 0.4 pixels; visual inspection shows their
text intact. Those fractional borders are not a separate finding.

## Prior findings and assumed knowledge

The earlier [clarity review](../clarity-review-2/20-compile-a-loop.md) reports the
“Common mistake” hint-heading occurrence under existing M6. That is separate from
this alignment review and is not counted again. No challenge hints were opened or
challenge solutions submitted in this browser pass.

No newly unexplained prerequisite was confirmed:

- Before you start provides the unsigned C parameters, returns, conditions and
  `for`/`while` syntax used here.
- Counting up and Counting down provide loop initialisation, testing, updating,
  the empty case, backwards branches and unsigned wrapping.
- Branches already uses `.L` labels, `cbz`, comparisons and unsigned `cc`; it states
  “`cset` writes 0 or 1.” The generated loop uses those established mechanisms.
- From C to instructions explains the local compiler and its working registers,
  explicitly introduces its `movz` spelling, and says “One C expression can produce
  several instructions, so the highlight can stay on the same source line as
  different registers change.” It also explains evaluation before assembly and
  recompilation after an edit.
- This lesson explains the execution budget and distinguishes a tool limit from
  evidence that a loop cannot terminate. Repeated excerpts and compiler references
  receive their explanation alongside the figure.

## Actual browser checks and evidence

Initial reading and a legitimate prediction unlock/run used immutable preview
`http://127.0.0.1:4266/assembly-lab/#/lesson/compile-a-loop`.
All four-mode captures and the detailed interaction checks below used the
coordinator's later immutable preview at port **4267**, whose changed geometry was
available before these captures. Neither preview was rebuilt by this reader.

Playwright drove fresh contexts at 1280 × 900 and 375 × 900, light and dark:

- Read the rendered lesson and inspected the static listing, repeated source,
  complete source and expanded original compiler-reference detail.
- Confirmed both playgrounds show “Check your prediction above first” and contain
  no runnable listing until their own prediction has been checked. Unlocked each
  through its radio option and Check button, without storage injection.
- Ran both original playgrounds locally. Pressed Next 22 times in each, through
  initialisation, condition, body, update, backward branch and the next iteration.
  Checked source highlights and labels. The browser scroll position did not move
  during those Next presses; the listing scrolls internally.
- Captured the real browser viewport with Next visible, including the backward
  branch. Did not infer visibility from a full-page or element-only screenshot.
- Inserted one blank line before the initialisation in the first playground,
  pressed Compile C and ran again. The linked initialisation moved from displayed
  line 4 to 5; all three `for` excerpts moved from 5 to 6. After Next, both the full
  source and paired excerpt highlighted the new initialisation line 5. This checks
  recomputation from edited source rather than a prepared listing.
- Checked phone wrapping, both themes, console page errors and document width.
  Document width equalled the viewport in all four contexts, with no page errors.
- A separate phone pass in both themes captured first Next, the instruction after
  loopback, and Reset, recording the actual browser/listing intersection.

No remote compiler request, challenge completion, whole-suite run or exhaustive
compiler-diagnostic check was performed. This pass did not step either loop all
the way to return or try the maximum-count run.

Temporary evidence:

- `/tmp/reader20-check.mjs` and `/tmp/snippet-reader20-results.json`.
- `/tmp/reader20-viewport.mjs` and `/tmp/snippet-reader20-viewport.log`.
- `/tmp/snippet-reader20-{1280,375}-{light,dark}-listing.png`.
- Matching `-references.png`, `-initial-viewport.png`, `-loopback-viewport.png`
  and `-edited.png` captures.
- `/tmp/snippet-reader20-375-{light,dark}-{first-next,after-loopback,reset}-viewport.png`.

Visually inspected static listings and loopback viewport captures in all four
configurations, plus the phone compiler references, edited source, first Next,
after-loopback and Reset captures described above. Evidence remains temporary;
the report contains no challenge solution.
