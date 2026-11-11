# NZCV order and the readings used with Z and C

11 November 2026. The author asked why the flag names were not grouped by signedness, approved
an explanation of conventional NZCV order, and asked whether Z and C apply to both readings.
The motivation now names Arm's conventional order. The existing Z bullet explicitly covers
both signed and unsigned readings. The C bullet describes checking an addition's unsigned
range without implying that ordinary `add` refreshes flags. N/V qualifications and the later
visible bit rules are retained. No calculation, exercise, gate or figure is changed.

The outcome is to explain the display order and distinguish the flag's bit computation from
the numeric reading used to interpret it. Earlier signed/unsigned reading practice is the
prerequisite. This is a wording clarification, with no new mechanism or activity. The existing
fresh flags exercise remains the independent application; no novice observation is claimed.

Sources checked: the official Arm DDI0601 NZCV register definition orders N/Z/C/V at bits
31/30/29/28. DDI0602 AddWithCarry sets Z from all-zero result bits, C from unsigned carry and V
from signed overflow. The browser model's `addWithCarry` in `packages/machine/src/run.ts`
agrees and updates flags only for flag-setting operations. C is computed from bits regardless
of the program's reading; its unsigned range-checking use after addition differs from V's
signed use. `subs` assigns C the no-borrow interpretation, as already taught in the published
“Measuring elapsed ticks” and “Subtraction flags and negation” lessons. The introduction stays
scoped to addition so it does not teach an unexplained subtraction instruction first.

A Sol Medium drafting agent worked from checked facts. Its first C sentence described C after
addition too broadly; the editing pass requested a shorter role statement that did not imply
that every addition sets C. The revised sentence was accepted. A separate Sol High learner
review and Sol Extra High technical review assessed the actual built lesson, source and
primary references. Their findings and built-page checks are recorded in the pull request.
The canonical motivation matches exactly.

Focused validation passed 97 tests in three files. The root built-page probe passed six
viewport/theme cases: 360, 375 and 1280 pixels, light and dark. It checked the convention and
four mnemonic bullets, definition-before-list order, add/adds wording, initial prediction
and challenge gates, committed result flags, restoration after reload, and absence of page
overflow or browser errors. Full check, exact-tree CI, merge and public verification are
recorded separately in the pull request. Screen-reader and novice testing were not performed.

The author also asked about one-flag-at-a-time four-bit examples. The separate recommendation
is to keep the earlier carry/width primer focused and use short worked examples in the flags
lesson, emphasising the C/V distinction after brief N/Z reminders. The existing four-bit view
runs a real 32-bit `add`; any miniature flags must be computed for four places from the result
and carries and labelled as teaching values, never presented as that Arm instruction's flags.
A one-flag focus must not imply that the other flags are zero; all displayed values must
remain model-correct. This discussion adds no miniature flags activity in this wording-only
change.
