<!-- Copyright © 2026 Christopher Snow -->

# Reader: From C to instructions

Independent learner review, 18 October 2026. Read `CLAUDE.md`, `docs/style.md` and the snippet-alignment brief. Assumed only Before you start and lessons 00–18. Primary browser review used the immutable production preview at `http://127.0.0.1:4266/assembly-lab/#/lesson/from-c-to-instructions`, with Chromium at 1280 × 900 and 375 × 900 in both light and dark themes. No new independent alignment finding.

## Findings and existing duplicates

### Existing R08 coverage — Low viewport limitation, no new material finding

Quote: “The highlighted C line is the line associated with the current generated instruction.” After opening and closing the compiler references, running the edited source and using Next, the first highlighted source/instruction pair can be partly above the browser viewport. The listing's own scrolling keeps the pair within its scroll area, but the top of that area can itself be outside the viewport. This occurs in the local compiler playground as well as the already reported shared-listing case. The current instruction/source card below the listing remains visible and preserves a way to follow the run.

Direction: retain this as coverage of the existing R08 viewport category, not an additional issue or mapping defect. The compact card already keeps the next instruction and its C source together beside the controls; full-row visibility is a stricter condition than the learner needs to inspect that relation. No additional fix is requested from this observation. Evidence includes `/tmp/snippet19-4266-1280-light-step1-viewport.png` and the corresponding phone/theme captures. A focused 4267 follow-up is recorded below.

### Prior clarity findings, kept separate

The prior [lesson 19 clarity review](../clarity-review-2/19-from-c-to-instructions.md) already records the unexplained noun “immediate” in “`movz` places a 16-bit immediate…” (C19-1/L17, low), and the existing “Common mistake” hint-label occurrence (C19-2/M6, low). Those are not new snippet-alignment findings. This pass did not reveal exercise hints or submit challenge solutions.

## What the learner has to know

- Before you start includes reading C functions, unsigned arguments, return, conditionals and loops; its readiness example also contains a local declaration and assignment.
- Module 0 explains GCC, Compiler Explorer and `-O1`, and distinguishes compiler line references from operation associations. This lesson's compiler note explains the smaller local compiler and its fixed patterns.
- Earlier lessons establish registers, constants, unsigned wrapping, multiplication, parameters, return values and control returning to the caller. The new return-control annotation uses that established vocabulary.
- “Intermediate working values” is explained in the motivation. The investigation explains why one C expression remains highlighted across several instructions.
- No new unexplained prerequisite introduced by the paired rows or compiler-reference disclosure was retained. The existing “immediate” issue remains separate.

## Actual checks

In all four configurations, inspected the initial paired listing and opened “Compiler's C line references”. The complete source is retained inline, including comment, signature, braces and original line numbers; this monotonic listing does not need a separate Complete C source disclosure. On desktop, the declaration and return each occupy a shared row with their generated instructions. On phone, each source operation remains immediately above its instruction group. The signature and declaration wrap without separating the association or creating horizontal document overflow. Actual document widths were 1280 and 375 respectively. Screenshots were inspected in both themes.

For each of the two playgrounds, first observed the locked message “Check your prediction above first. The figure opens once you have checked it.” Unlocked through the prediction radio and Check your prediction controls, with no stored-state injection. Compiled locally, inserted one harmless blank line after the opening brace through the text editor, and compiled again. Editing immediately removed the old listing. The regenerated listing preserved the instructions while moving the two operation references from displayed lines 4/5 to 5/6. The raw compiler-reference disclosure moved with those actual emitted references. The blank source line remained present in the complete inline source.

Ran both edited sources with their existing inputs and stepped each to completion. The declaration remained highlighted across the generated moves and multiplication. The highlight then moved to the return expression and remained there through the return sequence. The first playground completed nine instruction steps and the changed-return playground seven. Those counts were observed, not inferred from prose. At every recorded step the highlighted displayed C line matched the regenerated source association. Return-control notes appeared alongside `ret`. No browser page errors occurred.

The local compiler's associations come from its emitted source map, rather than an inferred nearest statement; inspected the `recordedC` conversion as a supporting implementation check. Read the raw online GCC rendering path: it uses a plain preformatted response, not the paired source renderer. No public Compiler Explorer compile request was sent, and no claim is made that a remote response was exercised. Challenges and their answers were outside this focused pass. No code, test or build files were edited, and no broad test suite was run.

## Evidence

- Browser driver: `/tmp/snippet-reader19.mjs`.
- Four detailed observation logs: `/tmp/snippet19-4266-{1280,375}-{light,dark}.json`.
- Actual screenshot families under the same stems: `-initial.png`, `-references.png`, `-edited.png`, `-edited-references.png`, `-step1-viewport.png`, `-step5-viewport.png`, and `-completed.png`; the second playground adds `-wrong` before the suffix.
- Evidence captures include revealed predictions and local playground runs, not completed challenge solutions.

## Focused 4267 follow-up

Repeated the harmless source edit, local compilation, compiler-reference disclosure, run, five Next presses, Reset and another Next for both playgrounds at all four width/theme combinations against `http://127.0.0.1:4267/assembly-lab/#/lesson/from-c-to-instructions`. The source card remained beside the controls with the appropriate next instruction and source statement. Actual Reset and Next screenshots were inspected in all four configurations. On phone, the full declaration pair was visible after Reset in this workflow. On desktop, the top of the first pair remained above the viewport, while the compact instruction/source card stayed fully visible. This is the limited whole-row observation above, not a remaining loss of the inspectable C/instruction relation. No mismatch or missing source card was observed.

Follow-up driver: `/tmp/snippet-reader19-4267.mjs`; geometry log: `/tmp/snippet19-4267.json`; screenshots: `/tmp/snippet19-4267-{1280,375}-{light,dark}[-wrong]-{reset,next}.png`. This was a focused viewport check, not a repeat of the full initial review.
