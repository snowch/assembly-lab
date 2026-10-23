# Independent built-site check: Loading different widths

Reviewer scope: one lesson, Module 6, `loading-widths`. No application edits or builds. Read AGENTS/CLAUDE, the actual ten-section lesson and disclosures, preceding memory lesson, relevant earlier width/hexadecimal prerequisites, recorded listings/facts, view and simulator code before reading the implementation record. Checked the production endpoint `http://127.0.0.1:4322/assembly-lab/#/lesson/loading-widths`.

## Verdict

The same-position comparison closes the previous medium finding about travelling between independent signed/unsigned figures. The original medium source-disclosure regression below was independently rechecked and is now closed on the replacement final production build. No semantic, prerequisite or layout blocker remains within this check’s scope.

## Original confirmed finding (now closed)

**Medium: opening the comparison source disclosure overflows the phone page.** Exact control: “Inspect C and instructions”. In fresh 375×900 contexts in both actual themes, commit the first prediction, open this disclosure in “Compare the width and the extension”. Document scroll width becomes 632px for a 375px viewport: 257px overflow. Closed comparison states have zero document overflow. The outer interactive remains 343px, but `.al-memory-source-details` and its `.al-listing` become 603px wide; the disclosure has automatic minimum width and visible overflow. Desktop 1280px has no overflow. Direction: constrain the disclosure to its figure and preserve the shared listing's internal horizontal scroll. Do not stack or omit its complete paired C. Evidence: `/tmp/check12-more.json`, `/tmp/check12-disclosure-overflow.png`, `/tmp/check12-overflow.cjs`.

## Behaviour and meaning verified

Fresh browser contexts covered 375×900 and 1280×900 with light and dark system preferences. Computed body backgrounds were respectively `rgb(243, 246, 245)` and `rgb(16, 22, 21)`; all four comparison screenshots were visually inspected.

All ten sections render. Seven dependent views are initially locked, remain locked when a prediction option is merely selected, and six unlock only after committing it. The failure walkthrough remains independently locked until its own prediction is committed. The first signed-load instruction produces the copied source byte, sign-extension region and upper-half-cleared region, with explicit low-to-high ordering.

At the comparison's first executed instruction, switched all six cases at the same `k=1`: unsigned/signed byte, unsigned/signed halfword, signed word to x0, signed byte to x0. Each uses the same prepared memory and address. Independently checked each displayed destination byte against the actual traced destination and each role against decoded source/destination widths: copied bytes, zero/sign fill and upper-half clearing are exact. Source addresses increase with destination bit positions. The visible “Address used”, “x0 Before” and “x0 After” distinguish the pointer consumed from the register value written. No result is invented from the label.

“Show byte bits” exposes all eight binary byte strings and retains the labelled regions. Back returns to the initial pointer state and removes transfer results; Reset does likewise after a new step. The selector retains its selected instruction. Closed comparison and full-bit states have no document or region overflow and no page exceptions in all four contexts. The independently gated wrong-load walkthrough also exposes its actual transfer after commitment.

The comparison's source-byte address is repeated beside the copied register byte, so the learner can compare extension regions locally. The selector, controls, operation status, register values and pointer summary precede that evidence. The complete paired C remains available in the disclosure. The earlier problem of repeatedly moving between separately stepped figures is therefore closed despite the remaining disclosure containment fault.

## Prior knowledge, unchanged issues and limits

Required signed/unsigned interpretation, hexadecimal, w/x aliasing, upper-half clearing and addition were introduced earlier. Immediately preceding memory-and-addresses teaches byte addresses, brackets, pointers, little-endian order, transfer widths and the risk of replacing an address register. This lesson defines zero/sign extension and casts before use; offsets are explained before the final exercise. No confirmed new assumed-knowledge gap.

The final record exercise still gives field layout in prose rather than a grouped record strip. Its previous low-severity visual-support recommendation remains outside the matched-load comparison closure. The initial construction and final challenge were inspected in source and browser; no challenge solution was entered or disclosed, and no answer is reproduced here. Challenge grading, hint progression, saved work/restoration, tap editing, keyboard/screen-reader behaviour, external GCC and native/QEMU execution were not rerun. No full-suite result is claimed.

Artifacts: `/tmp/check12.cjs`, `/tmp/check12.json`, `/tmp/check12-more.cjs`, `/tmp/check12-more.json`, and `/tmp/check12-{375,1280}-{light,dark}.png`. Source semantics were cross-checked against `memoryFigure.ts`, `MemoryStepper.tsx`, machine `execLdst`, the recorded Module 6 facts and listings; native differential evidence was read, not independently executed.

## Final production recheck: disclosure containment closed

Rechecked only the affected source disclosure on the replacement 4322 production build (root identified assets `index-DCRONSzr.js` / `index-l0iwkmlu.css`). Fresh 375×900 light/dark contexts plus 1280×900 light/dark desktop sanity covered every one of the six selected instructions both initially and after the first load: 48 states. The disclosure remained open throughout case changes and stepping. Every state had zero document horizontal overflow.

At 375px the disclosure is now 317px wide. The complete paired listing scrolls internally by 271px, with its C and instructions remaining one horizontally contained piece; it can pan to the instructions and return to the C. At 1280px the 942px disclosure needs no horizontal pan. All visible summary, select and button targets measured at least 44×44px in every checked state. Actual computed light/dark backgrounds again matched the previous measurements; the two new phone screenshots were visually inspected. Initial pointer and post-load evidence remain readable.

The original failure and measurements above are retained as historical evidence. No blocker remains from this follow-up. Artifacts: `/tmp/check12-recheck.cjs`, `/tmp/check12-recheck.json`, `/tmp/check12-recheck-{375,1280}-{light,dark}.png`. No app edits, builds or challenge attempts were made.
