# Manual lesson completion copy

Drafted from `brief.md`, the current shell and front-page strings, and `docs/style.md`.
These are interface labels and local status sentences, not new page headings.

| Use | Proposed string |
| --- | --- |
| Mark an unfinished lesson | `Mark lesson complete` |
| Reverse a completed mark | `Mark lesson incomplete` |
| Accessible text beside a plan tick | `Marked complete` |
| Return action when any lesson is unfinished | `Continue learning` |
| First-visit action, with no marks | Keep `Start with Module 0` |
| All currently available lessons marked | `You have marked all current lessons complete.` |
| Normal storage note | `Lesson marks are saved in this browser on this device.` |
| Storage failure or memory-only state | `Lesson marks could not be saved. Changes will be lost when you reload or close this tab.` |

Keep the target lesson title on a separate line within the Continue learning link,
using the existing lesson-navigation pattern. Both the action and title belong to the
same link so its accessible name includes the destination.

Use the same button for marking and undoing. Change its label to the opposite action
after a press, and retain keyboard focus. `Marked complete` describes a learner's
choice without implying an exercise result or a qualification.

Show the storage note near the completion action and the front-page progress action.
Replace the normal note with the failure note whenever current changes are only in
memory. Do not show a successful-saving claim beside an unsaved mark. If a later
successful save persists the current marks, the normal note can return.

When all current lessons are marked, replace Continue learning with the all-marked
sentence. Keep the plan's lesson links available. The word `current` allows new lessons
to appear unfinished later without implying that the learner previously finished them.

The two style passes found no unexplained terms or implied exercise requirements.
The only storage claims depend on the implementation's actual persistence state;
review them against that state before shipping.
