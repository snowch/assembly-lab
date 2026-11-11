# Carry recap and optional hardware links

11 November 2026. This small follow-up adds two references to the existing M2, L1
explanation. The carry reminder links to the published “Arithmetic with four bits” lesson;
the runtime supplies its current M1, L3 label. The optional Bit Lab reference follows the
complete flag explanation, after the calculation, and describes a four-bit teaching model.
No extra paragraph is inserted before the figure. Arithmetic, exercises, controls, grading,
saved values and gates are unchanged.

The destinations were checked in source and in fresh public browser contexts. Both return
200 and render their intended lessons. Bit Lab’s ALU combines arithmetic and logic paths in
a four-bit teaching model, with explicit limits; the link does not present it as the circuit
of an Arm processor. The internal lesson contains the earlier carry practice. No Bit Lab
files or author browser state were changed.

A separate GPT-6.1 Sol Medium agent drafted the two prose changes and exact canonical record.
Independent Sol High learner and Sol Extra High technical reviewers inspected the published
composition, actual numbering and link purposes. Browser checks covered 375×812 and 1280×800
in rendered light and dark themes: keyboard access, both destinations, return navigation,
committed prediction restoration, gates and calculation step/reset. The reminder-to-caption
spacing remains 24 px; no page overflow or console/page errors were found. The optional
reference follows all essential flag rules, before the existing optional GCC example.

The learner review observed that an uncommitted radio selection resets on navigation and
return. This is the existing transient-selection contract: only commitment is saved by the
prediction component. Committed choices and their unlocked gate were verified after return
and reload. Expanding selection persistence is outside this link-only correction.

Initial focused checks passed: three files, 97 tests, including canonical fidelity,
numerical facts, vocabulary and rendering. The first full check then failed one test
with 3,452 passing: its reminder validator searched every occurrence of a lesson fragment
and mistook the external Bit Lab route for an Assembly Lab destination. The check now
parses complete Markdown destinations and checks only local fragment URLs, while retaining
standalone href props and the existing published-route assertion. One regression fixture
keeps a missing local destination visible to that assertion and excludes external fragments;
there is no ALU exception, skipped check or new dependency. The independent technical
reviewer verified this correction and typechecking. The final focused rerun passed four
files and 100 tests. The original full-check failure remains recorded separately.

No new UI tests were added for the reversible copy change. The independent technical
browser harness initially used a nonmatching theme
label and the unsplit source title/section assumptions; its corrected built-page checks
are recorded separately from those tooling failures. Full checks, exact-tree CI and public
release verification are recorded in the pull request. Browser/agent review is not a novice
study or screen-reader validation, and no full audit of the linked course is claimed.
