# Final built-page check: introduction and Modules 7–9

Copyright © 2026 Christopher Snow

Independent checker pass on 18 October 2026. This agent did not draft the lessons,
implement their fixes or write their browser tests. It read `CLAUDE.md`, `docs/style.md`,
the individual reader reports and Modules 7 and 9 technical reviews. This is the fix
checker stage, not another original learner review or a substitute for the full course
check.

## Scope and method

Checked the immutable production build at `http://localhost:4205/assembly-lab/` in
Chromium through Playwright. Opened Meet the machine and both lessons in each of
Modules 7, 8 and 9 at 1280 × 800 and 375 × 812, in light and dark themes: 28 page
configurations. Read actual rendered text, opened explanatory notes and all five hints
for every new exercise, and inspected screenshots. Captured every instruction position
of the principal call and recursion steppers in all four display modes.

The first pass found two incompletely corrected minor findings: “mapped memory regions”
in the strings model note and “process”, “stack growth” and “guard pages” in the recursion
model note. Both were returned to the separate prose writer. Checked their replacements,
and the introductory paragraph again, in the rebuilt immutable snapshot at
`http://localhost:4206/assembly-lab/` in all four modes. The follow-up passed.

## Results

- **Introduction: pass.** The motivation now states “The compiler translates C into
  instructions that the processor runs.” It then explains what following those
  instructions reveals. The unclear claim about what a program's C “does not seem to
  say” is absent. The paragraph directly connects the compiler, processor and displayed
  calculation; it reads clearly on the phone as well as the desktop.
- **Array addresses: pass.** `+=` is explained as adding to the existing total before the
  compiled loop uses it. The unclear “memory value” sentence is gone. The recorded C
  remains visible and unchanged.
- **Strings: pass.** The prediction supplies bytes and capacity without stating the
  result in prose. “The code that calls label_length” replaces the premature formal
  use of “caller”. Both third hints now contain small, concrete byte examples. The final
  model note describes prepared memory and the capacity/terminator requirements without
  the flagged mapping or contract terminology.
- **Products: pass.** The first warning about undefined behaviour now immediately says
  “C places no requirements on what the program does in that case.” This is available
  before the following division lesson relies on the distinction.
- **Division: pass.** The diagram explanation names the unsigned size drawn and the
  signed quotient/remainder displayed underneath. The timing note uses ordinary
  language. Through the actual phone browser grader, a candidate omitting divisor
  zero-extension now passes only six of seven cases. The recorded reference and a
  separately varied correct implementation each pass all seven. This closes the
  reported coverage gap without accepting only one instruction sequence.
- **Calls: pass.** The failure figure's pre-answer caption asks the learner to inspect
  return addresses without disclosing where the incorrect return goes. The model note
  no longer assumes ABI or guard-page terminology. The stepper resolves the current
  `x30` address to the corresponding instruction, and distinguishes the prepared return
  address outside the displayed listing.
- **Recursion: pass.** The prose distinguishes incoming `x19` saved in this frame from
  the brightness that the next callee saves. The built diagram labels distinct calls
  and groups stored bytes beneath their saved register names and values. The final
  model note describes a fixed prepared stack and the unmodelled consequences of
  exhausting stack space in plain language.

## Stack interaction evidence

At the initial position no frame is shown. After the pair store, saved `x29` and `x30`
appear but `x19` is not labelled saved until its separate store executes. This holds
again as deeper recursive frames appear. The four simultaneous recursive frames carry
separate call identifiers. In the second call, the saved `x19` corresponds to its incoming
value from the earlier call; the first frame retains its original incoming state.
The diagram does not present unexecuted stores as saved values.

The return annotation changes when `bl` replaces `x30`, names the instruction following
the call, and changes back to the external prepared address when it is restored. Frames
are removed as stack space is released during return. At completion none remain. Raw
bytes, addresses, unused space and access highlights remain visible beside the saved
register groups. Phone frames are tall, but their labels and group boundaries make each
stored value identifiable; the light and dark screenshots are legible.

No browser exception or page horizontal overflow occurred in the 28 initial page
configurations or the 12 follow-up prose configurations. The focused divisor browser
checks passed as described above. These observations do not claim a fresh execution of
every course exercise; the individual reader reports and full automated suite cover
those broader paths.

## Evidence and verdict

Session artifacts are in `/tmp/final-check-7-9/`: browser scripts `check.mjs`, `extra.mjs`
and `prose.mjs`; rendered initial/hint text; `results.json`, `extra-results.json` and
`final-prose-results.json`; and screenshots by page, width, theme and instruction
position. Representative captures include `phone-light-recursive-call-2.png`,
`phone-dark-recursive-call-4.png`, `phone-light-calls-and-returns-return-8.png`,
`division-missing-zero-extension.png`, and the `final-*` prose captures. The artifacts
contain revealed practice material and are not lesson content.

**Verdict: all accepted findings in this checker's scope are resolved in the built
pages.** The two minor remnants found during checking were corrected and verified in
the follow-up build. No further blocking finding was identified.

## Static listing badge follow-up

Checked the final metadata-only adjustment in the immutable production snapshot at
`http://localhost:4207/assembly-lab/`. In all six Module 7–9 lessons, at both viewport
sizes and in both themes (24 configurations), static listing figures have no STEPPED
badge and report no time model. Their C and instruction panels remain visible. After
committing a prediction on each page, the actual memory or stack stepper retains its
STEPPED badge, and pressing Next advances the instruction position by one. Screenshots
and observations are in `/tmp/final-check-7-9/badge-*.png` and `badge-results.json`;
`badges.mjs` records the browser actions. This follow-up passes and does not change the
verdict above.
