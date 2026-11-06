# Compact plan links: validation

Copyright © 2026 Christopher Snow

Only module-scoped plan links use `L` plus their existing catalogue ordinal and title.
Cover continuation, current position, previous/next navigation and lesson prose retain full
module/lesson references. Routes, completion keys and marks are unchanged.

Passed 12 focused unit tests and 34 focused browser tests (16 numbered-reference checks,
14 plan-entry/prerequisite flows and 4 Module 2/4 backlink checks). Existing assertions were
updated only where they address course-plan links; full references elsewhere remain covered.
The independent review checked all 75 labels/ordinals/hrefs and representative navigation,
completion, reload and themes at phone and desktop widths. Its notes distinguish its corrected
probe assumptions from product findings. No product defect was found.

An early exact check was stopped during its opening stages after source inspection found stale
sibling plan assertions. No complete result is claimed for that superseded invocation. A fresh
exact check and final-head CI are run for the completed change; their results are separate from
the focused passes above.
