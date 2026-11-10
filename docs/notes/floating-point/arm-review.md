# Arm floating-point registers and arithmetic: independent learner review

Reviewed 10 November 2026 by the independent learner-review agent (inherited Codex model and effort; no model substitution requested). This reviewer did not author or edit the lesson and did not read its author rationale. No implementation changes were made.

## Scope and evidence

Read `AGENTS.md`, `CLAUDE.md`, `docs/authoring.md`, `docs/style.md` and `.agents/skills/learning-design/SKILL.md`. Applied the learning-design review workflow. Inspected only the built lesson at `http://localhost:4258/assembly-lab/#/lesson/floating-point-arm`, whose footer identified commit `fc7b2a8`. The learner is assumed to have completed the preceding course and Module D's bits and rounding lessons, with no later Module D lesson.

Used real headless Chromium through Playwright at 375 × 900 and 1280 × 900, explicitly selected Light and Dark, and confirmed the rendered `data-theme` and body background colours. Also checked the initial phone at 375 × 812. Read the essential route with optional disclosures closed; the lesson itself has no optional disclosure. Inspected all four recording choices in each viewport/theme, hidden and revealed, hide after reveal, and changing the case after revealing. Checked the fresh question before submission, empty submission, feedback after submission and feedback clearing after a changed selection. Exercised native select keyboard operation, Tab, Enter, focus visibility and keyboard scrolling of the paired listing. No browser page errors were observed.

Browser artifacts are in `/tmp/arm-learner-*.png`; the initial phone and dark-state examples are `/tmp/arm-learner-phone-initial.png`, `/tmp/arm-learner-375-Dark-2.png` and `/tmp/arm-learner-1280-Dark-3.png`. These screenshots show recording results, not the assessment answer. State observations are in `/tmp/arm-learner-states.log`; the review deliberately does not reproduce assessment answers.

This is an agent review, not an observed beginner study. Screen-reader speech, touch gestures on a physical phone, forced colours and browser engines other than Chromium were not tested. Technical truth of native recordings remains the separate technical review's job.

## Original findings for sceptic review

### ARM-L1: Dark-theme action text is effectively unreadable

**Severity: high.** Quotes: “Show recorded result”, “Hide recorded result”, “Check answer”. All three appear as near-white text on pale native button faces in the actual Dark theme, at both widths. The controls remain enabled and work, so their appearance also suggests the wrong state.

Computed foreground is `rgb(232, 238, 237)` and background is `rgb(239, 239, 239)`, opacity 1, disabled false. Their contrast is approximately 1.02:1. The native select controls and course completion control remain legible. The phone reveal/check controls are 40 pixels high, so target size is not the problem.

**Direction:** give the lesson action buttons an explicit theme-appropriate foreground and background, then independently recheck their initial, focus and revealed states in both themes. Inspect the same floating-point control pattern in sibling lessons. Root and the technical reviewer were notified immediately.

### ARM-L2: The phone hides every instruction without a local scrolling cue

**Severity: medium.** Quote locating the affected figure: “Recorded GCC instructions and QEMU results for the selected arithmetic case.” At the initial 375-pixel width, the listing shows the complete C pane while the “Instructions” heading and every instruction are wholly to its right. The visible C panel has a clean right border; there is no visible instruction-pane edge, persistent scrollbar or local text explaining where to find the instructions. This matters in a lesson whose second objective is “Read recorded fadd and fmul operands and explain which format they select.” A learner can reach the result button having seen no assembly in the figure.

Measured listing viewport 317 pixels, content 588 pixels. Scrolling right reveals the paired instructions and checked C-line tags, and the document stays 375 pixels wide. The implementation meets the contained-horizontal-layout requirement; this finding concerns discovery, not reflow. Tab reaches the scroller in Chromium and ArrowRight moves it, so keyboard access works once discovered.

**Direction:** retain the paired, contained horizontal listing, but make the instruction pane to the right discoverable beside the figure. Recheck the first view without having scrolled it already, in both themes. This is a candidate for sceptic review because earlier lessons may have trained the shared listing gesture; that training was supplied as a prerequisite assumption, not re-inspected here.

### ARM-L3: The register-bank objective is defined but has no independent evidence of application

**Severity: low.** Quote: “Distinguish the s/d views of a floating-point register from the w/x views of a general register.” The first paragraph clearly explains the distinction: “They are not views of w0 or x0” and “The number 0 selects an entry within each bank; it does not join the banks.” The recordings demonstrate the new floating-point names. The only fresh question, however, asks which numeric format preserves a sum. Someone still treating equal register numbers in different banks as one entry could pass that question.

**Direction:** consider a brief fresh bank/view distinction that rules out that misconception, integrated with the existing task rather than adding another full activity. This is an assessment-coverage gap, not evidence that the present definition is confusing or wrong.

## Learning route and prerequisites

The main observable outcome is to read unfamiliar floating-point arithmetic operand names, identify the selected format and bank, and use the known precision rule to predict a fresh result. FP control/exception machinery, conversions and bit-copy instructions are deferred.

- **Defined:** the s/d views and v entry, separation from w/x, float/double target formats, argument/result locations, fadd/fmul arithmetic and destination ordering. The register-bank paragraph is direct and understandable with the earlier w/x view model.
- **Demonstrated:** a complete four-line addition function, its two mapped instructions and fixed starting inputs. The default case is a small complete first example; reducing it further would remove the binary operation or C/assembly link. Revealing its result is explicitly a reveal of recorded evidence, not an execution step.
- **Supported action:** choosing the named rounding comparison, corresponding double case or multiplication case, then revealing the recorded result. Case changes clear the result rather than leaving a previous case's result visible. Multiplication is announced in the prose before its selector, so it is discoverable without completing another stage.
- **Practised:** a new addition at a different magnitude and increment from the recording comparison. The preceding rounding lesson is the preparation for spacing and nearest-even reasoning; this page supplies the bridge from numeric format to s/d operand spelling. Feedback follows submission and clears on a changed answer. No answer or calculation for that fresh assessment is visible before submission. Bank separation itself is not practised, as ARM-L3 records.

No essential new C feature is assumed: the complete examples use already familiar function parameters, return and arithmetic. The supplied earlier-course prerequisites cover C/assembly pairing, operand/destination conventions, w/x, hexadecimal patterns, GCC and instruction returns; Module D bits/rounding cover binary32/binary64, nearest-even, spacing and subnormal values. New QEMU terminology is explained locally as a program that emulates an Arm processor, and `-O1` is locally called an optimisation setting. The control-register sentence gives its relevant effects before the recordings are used. The later exclusion of “exception registers” does not support any required action here; their operation is not assumed for solving this lesson. No additional essential unexplained prerequisite was found under the supplied prior-course assumption. This review did not independently re-audit earlier lessons for those definitions.

## Checks that passed

The visible route consistently calls the evidence recorded GCC/QEMU output and says the browser integer simulator does not execute these instructions. “Starting inputs for this independent call”, “Recorded return value” and “Returned pattern” distinguish inputs, independent calls and revealed results. There is no pretend stepping control or editable native execution input.

All four cases retain complete numbered C beside the instructions, including the double and multiplication variants. The instruction tags use the displayed C numbering. At phone width one container scrolls the paired listing; assembly does not drop below C, and the page does not scroll sideways. At desktop width both panes fit.

Native selects have accessible names in the browser accessibility tree. Recording/result controls are named consistently with the directions. Enter reveals without moving focus away from the button. Question feedback uses a status region, keyboard focus is visible, and reveal/check controls meet the repository's 40-pixel phone height rule. Colour is not the only indication of the recording or its return pattern. These checks do not resolve ARM-L1 or establish full assistive-technology accessibility.

The prose has a coherent short sequence and a manageable number of controls. The recording provenance and rounding qualifications repeat around the card, but each first-use qualification remains visible with optional material closed. I found no need for an extra miniature arithmetic example before the first complete C function.

## Decision and later verification

The original decision was to keep the simple complete recording and fresh precision application, correct ARM-L1, and adjudicate the two other candidates. The completed independent fix check and final dispositions follow. No full test suite was run for this review-only task.


## Independent fix check of build 4

The same independent reviewer returned after `/tmp/fp-build4.log` reported `built in 10.21s`. This reviewer made no implementation edits. Rechecked the rebuilt site at the same URL in new Chromium pages at 375 × 900 and 1280 × 900, in explicitly selected and verified Light and Dark themes. Build output names were `index-gnDPMCBC.css` and `index-1sw7V71Q.js`; the footer still identifies the committed base `fc7b2a8`, so the footer alone is not a distinct identifier for these uncommitted corrections.

**ARM-L1 accepted, corrected and independently verified closed.** The reveal, hide and check buttons now have explicit legible colours. Dark uses foreground `rgb(232, 238, 237)` over `rgb(23, 30, 29)`, approximately 14.42:1; Light uses `rgb(16, 26, 24)` over white, approximately 17.75:1. All four recording cases were checked in initial, revealed and hidden states in each viewport/theme. The labels remain readable after reveal, and focus outlines remain visible. The reveal and check targets measure approximately 45.89 pixels high. Keyboard Enter still reveals and focus remains on the button.

**ARM-L2 accepted, corrected and independently verified closed.** The fresh phone view now says “Scroll the paired listing sideways to see the instructions beside the C.” directly above the listing, before the learner reaches the result controls. The cue is readable in both themes; the paired listing remains a contained horizontal scroller, and the document width stays 375 pixels. Chromium keyboard Tab still reaches that scroller and ArrowRight scrolls it. At 1280 both panes fit and the phone-only cue is not visually displayed. The correction preserves complete, numbered C, assembly beside it, and C-line tags for all four cases.

**ARM-L3 retained as a low-priority evidence gap and deferred; rejected as a release blocker.** The review still distinguishes an explicit register-bank definition from fresh precision practice. The page says that s/d access the floating-point entry and “They are not views of w0 or x0”, then illustrates s/d operands in complete recorded functions. The fresh task applies the format/spacing rule, not an unexplained bank mechanism. A separate bank assessment could strengthen evidence of the first objective, but its absence does not make the present essential arithmetic route depend on untaught knowledge. No additional practice was required for this correction pass, and no claim of beginner-validated bank understanding is made.

The essential route still exposes all preparation with optional material closed, clearly labels the QEMU/GCC recordings, states that the browser integer simulator does not execute them, distinguishes fixed starting inputs from revealed returns, and presents a fresh precision question without its answer before submission. All four cases retain complete C and paired instructions at both widths. Reveal/hide, changing a revealed case, keyboard select/reveal, empty question submission and closed optional status disclosure were checked again; no page errors or new blockers were observed.

Fix-check observations: `/tmp/arm-learner-fixcheck.log`. Fresh-state and revealed screenshots: `/tmp/arm-learner-fix-375-Light-initial.png`, `/tmp/arm-learner-fix-375-Dark-initial.png`, `/tmp/arm-learner-fix-1280-Light-initial.png`, `/tmp/arm-learner-fix-1280-Dark-initial.png`, and the corresponding case-index screenshots. Final decision: no remaining ARM learner-review release blocker within this checked scope. The novice-observation and assistive-technology evidence limits above still apply.
