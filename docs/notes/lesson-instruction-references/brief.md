# Instruction references at the end of lessons

## Checked facts and agreed design

The published course has a few authored Arm links, including ADD register/immediate, BL/RET and ORR immediate, but no systematic instruction-reference catalogue. The course already records first-taught browser instructions in content/lessons/introduced.ts. Instruction forms and aliases need separate entries: a mnemonic alone does not identify the relevant manual page. Optional/native/A32 topics require distinct primary references.

The user approved a collapsed References row at the bottom of relevant lessons, above completion/navigation, direct links for exact instruction forms and relevant architecture/calling-convention sources, linked mnemonics at their first introduction, and moving the large introductory manuals boxes out of the worked-example flow.

Keep all required operand/range/flag rules in the explanation. References supplement teaching; opening them must not be required to answer an exercise. Do not change prediction gates, source listings, graded data, saved work, instruction sequencing or platform/.

Use a course-owned structured catalogue and per-lesson mapping; ensure every TAUGHT instruction has a mapped reference, and new forms have explicit overrides. Verify destinations against official source titles/content, distinguishing reachability from correctness. Preserve precise alias and architecture distinctions. Optional chapter sources must not imply browser support or hardware validation.

For rendering, use native disclosure semantics and meaningful link labels. One References row per relevant lesson, initially collapsed; keyboard operation, phone/desktop light/dark, no overflowing long labels, and no repeated manuals box. Source Markdown/program data should remain intact where rendering can provide links safely. Avoid linking assembly/C code blocks or introducing answer links into quiz options.

## Learning and evidence

The outcome is finding the exact instruction/form specification after learning its core behaviour. Prior knowledge is supplied by the current lesson, with reference vocabulary explained by labels. The worked example/exercise sequence stays unchanged. The UI consolidation is an attention/discoverability hypothesis, not a novice-learning result. Inspect actual final pages independently before author rationale, then review source accuracy and behaviour. Separate drafting and independent learner/technical passes follow CLAUDE.md and docs/style.md.

Initial inspection: source and the user's screenshots. Implementation will receive browser review before merge. Full repository/CI checks and final deployment verification remain required.

## Drafting and implementation

The separate copy pass selected References, Instructions and Other primary sources, with no repeated description sentence. Early register forms use the separately drafted display pattern “ADD (register inputs)” (and SUB/ADDS/SUBS) so an official title does not require learning shifts early. The exact official form remains in the catalogue and target.

The two original reference notes retain their explanatory wording in the new footer. The stale BL target and the returning-to-caller canonical record were corrected to the verified current entry. Main prose, instruction/source listings, quiz options, graders and saved work remain independent of references.

Source positions from the existing Markdown parser identify explanatory inline code. Fenced/indented source and existing links are preserved, as are protected program/grading objects. Precise new addressing-form links use operand-pattern constraints and follow the actual split lesson that teaches each form. The custom flags presentation uses an explicit introduction slot. Native disclosure state is local to a lesson and resets for a new route, while theme changes preserve current work.

## Verification and review dispositions

- Initial focused units had 2 failures and 5 passes: a concept lesson lacked its language source, and CMN's existing explanatory note was not traversed for the introduction link. Both were corrected. Subsequent focused source/link/canonical tests passed (22 in the broader run; 10 after the form/link corrections).
- Initial focused browser run had 4 failures and 2 passes because an expected BL slug used old capitalization; the fresh official catalogue's current URL was correct. The expected path was corrected from the verified index. A separate independent source check found the old authored footer BL URL really returned 404; its source and canonical record were corrected.
- The independent technical review found two addressing forms assigned to pre-split locations. ADD extended is now on Traversing arrays and LDRB register offset on Zero-terminated strings, with operand-sensitive introduction links. Their exact output is pinned by source tests.
- The learner review found generated phone links only 22px tall. The corrected generated-link style provides 44px targets and preserves the authored inline prose flow. Independent final verification measured 192 generated links across 44 combinations.
- The corrected focused reference browser suite passed all 6 cases in both projects/themes. The opening-lesson integration rerun passed all 4 cases. Typecheck/build passed. Independent technical browser verification passed 40 representative visits; the learner review records 60 initial and 44 final layout/interaction checks and separate state checks.
- Reviews and primary-source evidence are in this directory. Their setup/harness failures and limits remain distinct from product findings. There was no novice or assistive-technology user study. Full repository/CI and deployment results will be recorded on the pull request.
