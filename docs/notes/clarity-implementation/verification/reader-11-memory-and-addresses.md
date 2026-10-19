# Independent reader/checker: 11 Memory and addresses

Verdict: **accepted fixes pass; no blocking finding or clear introduced regression found in this lesson.** Read-only review, with no authorship of the implementation and no author self-justification consulted.

## Reading and prerequisites

Read the complete current lesson prose, labels, data, both five-rung hint ladders, prediction feedback and model note before consulting the audit summary and verification coverage plan. Read the front-page prerequisite panel and relevant earlier explanations in lessons 00–10, particularly Module 0 compiler settings/registers/simulator, constants-and-widths for the 64-bit register view and C long, and counting-up for trace terminology. This was a targeted prerequisite check, not a fresh rereading of every earlier interactive.

No newly assumed untaught knowledge requiring correction was found. The front page permits basic C functions and arithmetic but does not assume pointers. This page explicitly introduces a pointer/address, dereferencing, const, byte addresses, brackets, little-endian order, load/store and void before their required uses. The relationship between x0 and w0 is restated in the main flow. The model note now explains its storage/type requirement using the declared distance type instead of requiring the specialised C meaning of object. Optional target-size details are not required to infer the four-byte load, which the main explanation states explicitly.

## Accepted corrections checked

- **N12, load guidance location — pass.** “Step through the load. The figure marks the bytes it reads…” is now in the checked prediction explanation, immediately before the unlocked load figure (`content/lessons/memory-and-addresses.prose.ts`, predictionExplain). It is absent while prediction is unchecked. The following Investigation text introduces the store and its actual input registers. Thus the learner is no longer directed to inspect a load beside a store. Confirmed DOM order and the visible phone/desktop layout.
- **L12, storage/type limitation — pass.** The model note says “the pointer must refer to storage for a value of the declared type, such as an unsigned distance. A readable address alone is not enough.” The requirement and relevant example are understandable without the previous unexplained use of “object”. This is a limited statement of a requirement, not a claim that readability/type alone establishes every C precondition.
- **M6, hint-heading alignment — pass.** Both Common mistake rungs identify a plausible wrong action and explain its consequence. Both Smaller example rungs supply a concrete byte/value example. All ten hints were opened in the browser and read against their headings; no challenge solutions are reproduced here.
- **Shared activity roles — pass for this lesson.** Both prediction figures visibly carry Prediction; the two written tasks carry Exercise; the actual memory steppers retain Stepped. The initial listing is Diagram. Prediction checks still gate the associated steppers.

## Browser evidence and actual coverage

Final production preview: `http://localhost:4292/assembly-lab/#/lesson/memory-and-addresses`. Initially checked 4291, then reran the entire same probe on 4292; listed artifacts and evidence were overwritten by the 4292 run.

Real Chromium, fresh context for each 375×900 and 1280×900 configuration in light and dark. Set raw localStorage theme string and asserted `html[data-theme]` for every configuration. All four configurations checked:

- fresh/unchecked prediction and locked load;
- an incorrect prediction, revealed explanation and unlocked initial load;
- first load instruction, Back, Next and Reset;
- first store instruction and visible byte effects;
- both untouched challenge starters and all hint rungs;
- second prediction and first instruction in each narrow/wide store, eight-byte load and eight-byte store;
- final model note and document-level horizontal overflow (none).

Examined screenshots of the checked prediction/load transition, executed load and store, and model-note wording across phone/desktop and both themes. The executed load paired highlight, address-byte display and register-byte display agree with the prose. The phone store's byte cards wrap in ordinary address order, which its visible guidance explains; this is not an array-element grouping regression.

Artifacts: `11-{375,1280}-{light,dark}-{gated,guidance,loaded,stored,limits}.png`, `11-evidence.json`, and reproducible probe `check11.mjs`, alongside this report.

Limits: not every prediction option or arbitrary edited submission was executed. No completed challenge solution was entered, no external compiler service was used, and no full suite/build was run. Technical checking was limited to changed explanatory claims, the recorded lesson fixtures and their displayed simulator effects; this review is not an independent exhaustive Arm/C conformance audit.
