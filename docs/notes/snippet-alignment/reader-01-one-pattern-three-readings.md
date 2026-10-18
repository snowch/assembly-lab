# Reader 01: Same bits, two readings

Independent one-lesson review, 18 October 2026. Read `CLAUDE.md`, `docs/style.md` and the snippet-alignment brief, then inspected the immutable production preview at `http://127.0.0.1:4263/assembly-lab/#/lesson/one-pattern-three-readings`. No app or test changes.

## Finding

**R01-1, low, new shared UI regression — short comparison disclosure touch target.**

- Page quote: “How the instructions relate to C”.
- Location: the new disclosure after the committed prediction in “The unsigned version”, `.al-source-connections > summary`.
- Observed: its bounding box is 317 × 27.890625 pixels at a 375-pixel viewport. The repository requires phone controls to be at least 40 pixels tall. It is visibly less padded than the nearby compiler-reference disclosure.
- Learner effect: opening the new C/instruction associations requires a small tap target.
- Direction: give this shared disclosure sufficient vertical padding or minimum height, then check the built phone view. No wording change is needed.
- Follow-up: the coordinator reports that a later source change already adds padding to this selector. This finding describes preview 4263; the correction still needs a rebuilt-browser check and was not independently verified here.

## Checks that passed

Used Playwright Chromium at 1280 × 900 and 375 × 900, each in light and dark themes. Visually inspected the first paired listing, its stepped state, the inserted-instruction listing and the revealed comparison. Read surrounding chapter prose and the new shared labels.

- The complete one-line C function remains legible when it wraps. At desktop width it shares a row with its related instructions; on the phone the C/instruction pair stays together.
- After the first instruction runs, the C line and that instruction are highlighted together. The next-instruction arrow remains distinct.
- The extra-instruction stepper remains locked before its prediction is committed. Submitted an ordinary incorrect choice to reveal it; no stored-state seed was used.
- The extra instruction is explicitly shown with “No C statement is linked to this instruction.” The complete source is retained above the repeated excerpts, and the note explains why C lines repeat. The instruction order is preserved.
- The comparison hides instruction results until its prediction is committed. An ordinary incorrect choice reveals the result and the new source-connection disclosure. Both functions remain distinguishable, and the comparison markings remain visible.
- Original compiler references are in their own closed disclosure by default, and opening them shows the recorded references. They are visually separate from teaching associations.
- Return-control text is understandable with Module 0 knowledge.
- Document width equals viewport width in all four configurations. The code wraps without clipping in the inspected figures.

## Prerequisite audit and prior findings

The learner knows the front-page C/arithmetic prerequisites and Module 0 only. Module 0 supplies compiler/listing vocabulary, registers, argument order, instruction operands, return behaviour and the compiler setting used here. This chapter supplies hexadecimal, signed/unsigned readings and set/clear terminology. The new source-link, repetition and return labels introduce no unexplained prerequisite.

The shared simulator note still says “An instruction can read or change registers, flags or memory.” “Flags” remains unexplained at this point. This is the existing low finding L4, already recorded in `docs/notes/clarity-review-2/01-one-pattern-three-readings.md`, not a new snippet-alignment finding. No other missing prerequisite was found in the changed figures or surrounding text.

## Evidence and limits

- Browser scripts: `/tmp/snippet-reader01.cjs`, `/tmp/snippet-reader01-measure.cjs`.
- Captures: `/tmp/snippet-reader01-{1280,375}-{light,dark}-{first,step,extra,compare}.png`.
- Page text: `/tmp/snippet-reader01-{1280,375}-{light,dark}-{initial,revealed}.txt`.
- Run log: `/tmp/snippet-reader01.log`.

All four configurations were exercised, and representative captures of each figure across both widths and themes were visually inspected. Native disclosures were opened programmatically after their availability/default state was observed. This is a focused learner review of changed snippets, not exhaustive simulator or challenge testing. Challenge solutions were not submitted, and this report contains no challenge answers.

## Final-build checker follow-up

Independently checked the correction against preview **4264** on 18 October 2026, at 375 × 900 and 1280 × 900 in light and dark themes. **R01-1 is fixed:** “How the instructions relate to C” measures **44 pixels tall** in all four configurations. Focusing its summary and pressing Enter opens and closes the disclosure; the keyboard focus outline is visible.

The disclosure remains absent before the prediction is committed. Committing an ordinary incorrect choice reveals it. Inspected new screenshots of the comparison, first paired listing and extra-instruction listing: complete source and paired excerpts remain readable, wrapping stays inside the figure, and original compiler references remain closed by default. No horizontal page overflow occurs in any configuration. No new regression found in this focused follow-up.

Evidence: `/tmp/snippet-reader01-final.cjs`, `/tmp/snippet-reader01-final.json`, and `/tmp/snippet-reader01-final-{375,1280}-{light,dark}-{compare,first,extra}.png`. The script's `sourceViews` field used a class absent from the renderer and is not a coverage assertion; visual captures confirm the source views. No app/test edits or challenge submissions were made.
