# Independent learner review

Reviewed the final production build on 2 November 2026 as a learner who has completed Module 0 and Reading hexadecimal. Separate reviewer agent; did not draft or edit the implementation. Read `CLAUDE.md`, `docs/style.md`, `docs/authoring.md` and this change's fact brief before the page. Did not read the author's draft, rationale or implementation account. Used the inherited agent configuration; no model substitution was requested.

Verdict: pass. No open learner findings or correction requests. Both style closing passes passed. The original major sequencing problem is resolved in the rendered page, including its prose.

## Findings and evidence

| Item | Severity and status | Quoted page evidence | Learner effect and direction |
| --- | --- | --- | --- |
| Initial explanation mixed mechanisms | Major, resolved | “The unsigned reading adds the positive amounts represented by the bits.” “A bit with value 1 contributes its weight. A bit with value 0 contributes zero.” | The introduction and initial rules teach the unsigned mechanism alone. Signed weights, the C connection and two’s complement do not appear in those paragraphs. Preserve this separation. |
| Required definitions could be hidden by staging | No finding | Signed: “The signed reading gives the top bit weight −2,147,483,648. Every other weight stays positive.” “This representation is called two’s complement.” | Both statements are visible immediately after selecting Signed, above its bits. The optional appendix supports a smaller example; it does not carry the required definition. No correction needed. |
| Sequence could require an undiscovered activity | No finding | Unsigned: “Then select Signed.” Signed: “Then select Compare.” Compare: “Both columns read the same bits.” | All three named buttons are visible from the initial state. The directions describe a usable order without a gate or an additional activity. No correction needed. |
| Short sentences could still leave an overloaded paragraph | No finding | Signed separates its weight rule, the representation's name, the interaction and the appendix link into four paragraphs. | Read at 375 pixels as well as desktop. Signed takes more vertical space, but each paragraph answers one question. The explanation can be understood on one reading; it does not make the learner hold both mechanisms in the initial prose. No correction needed. |

## Definition, demonstration and practice

Unsigned reading is defined before the reader. The weight rule starts at the rightmost bit, explains doubling, identifies the top bit and then explains which contributions are summed. The all-ones example supplies a complete computed demonstration: the diagram gives selected positions and weights, and the summary separates the top contribution from the other bits. Editable bits provide immediate practice in the same figure.

Signed adds one change to that preparation: the top weight becomes negative. The visible explanation says that lower weights remain positive and that the top bit is not a separate minus sign. Its diagram and computed summary demonstrate those claims before the construction task. Compare then makes the two readings explicit and explains why clearing the top bit makes them agree. The definition, computed example and practice are distinct and present.

A smaller complete unsigned candidate would be Clear bits followed by setting one low bit. A signed candidate could contain only the top bit. The current reader already supports both experiments without another stage. The top/other decomposition also isolates the one new signed contribution, so an additional compulsory example or bridge is unnecessary. The four-bit appendix remains useful optional support.

## Term and prerequisite assumptions

No newly unexplained prerequisite found in the changed content.

- Binary digits and small-number place values are explicitly required by the front page. The unsigned explanation develops these into the 32-bit weight rule rather than assuming negative representation.
- Register names and the simulator are taught in Module 0. `int`, `unsigned`, arguments and return are in the stated C prerequisite.
- Hexadecimal, `0x`, and set/clear are taught by the preceding Reading hexadecimal lesson.
- “Unsigned reading”, “weight” and “top bit” are introduced before the initial figure uses them.
- “Signed reading” and “two’s complement” are defined visibly in Signed. Its C `int` connection appears there, after the signed mechanism.
- Compare reuses those definitions and explains top-bit-clear agreement locally. “Representation” is ordinary wording for the rule just described, not an additional unexplained mechanism.

## Browser checks and limits

Started an independent production preview on port 4182 only after the managing session reported the final build ready. Did not build or change lesson/component source. Chromium checks covered 375 × 812 and 1280 × 800 in both themes. Verified actual `html[data-theme]` and body colours: light `rgb(243, 246, 245)`, dark `rgb(16, 22, 21)`. Inspected screenshots of the unsigned rules, initial introduction and all three view layouts, including the phone comparison scroller.

Checked in all four width/theme combinations:

- Unsigned is initially selected; all three view buttons are visible. Introductory prose and initial guidance omit the signed mechanism and appendix link.
- Signed and Compare show their required guidance without opening details. Their appendix links have the expected `#/lesson/twos-complement` destination.
- Open calculation shows only unsigned, only signed, or both according to the selected view. It remains readable within the page at phone width.
- Editing a bit changes the pattern; switching views preserves that edited pattern. Clearing the top bit in Compare makes the displayed totals agree.
- Clear bits produces zero in both comparison columns. Reset to all ones restores the starting pattern and Unsigned view.
- Scratch starts independently at zero. Edits there do not alter the main figure, and main-figure edits do not alter scratch. Ordinary refresh restores the main initial pattern and Unsigned view.
- Document width equals viewport width; horizontal figure content stays in its scrollers. No browser console or page errors.

Evidence: `/tmp/reading-sequence-learner-browser-evidence.json`, `/tmp/reading-sequence-{375,1280}-{light,dark}-{intro,unsigned-rules,unsigned,signed,compare}.png`, and phone `compare-right` screenshots. The first browser harness attempt stopped on an ambiguous nested-summary selector; the corrected harness completed. A second harness correction ensured calculation assertions tested visibility as well as DOM presence, and the final run passed.

Coordinated update handoff was read in source, not triggered in this browser review. No challenge answers were submitted or revealed in the browser; grading, full-suite execution and technical accuracy remain with the separate technical review and managing checks. No recommendation depends on completing a challenge.
