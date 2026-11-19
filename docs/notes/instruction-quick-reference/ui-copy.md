# UI drafting pass

Copyright © 2026 Christopher Snow

## Input

Drafted separately from implementation using the checked brief, `docs/style.md` and
`CLAUDE.md`. The reader is a programmer with the course's stated prerequisites and the
lessons before their current exercise.

## Decisions

- Header label: “Reference”. The opened heading names it “Instruction reference”.
- The scope labels distinguish the selected exercise's instruction allow-list from the
  larger browser-supported list. The visible qualification says that browsing the larger
  list does not change an exercise's limits.
- Search names both instruction names and operations. The empty result reports the selected
  list so a filtered search is not mistaken for absence from the instruction set.
- “Reading the syntax” identifies notation help. Instruction parameter facts and notation
  definitions belong to the separately checked catalog.
- The no-exercise message describes state without asking the reader to use a control which
  may not exist on the current page.
- The theme title names the selected preference. The native selector retains its ordinary
  accessible label and the existing System, Light and Dark option labels.

## Limits

This pass drafts labels and scope explanations only. It does not verify the implemented
interaction, catalog completeness or instruction claims. Those require the independent
learner and technical reviews and browser checks in the brief. No functional check proves
learning effectiveness.

After independent technical review, changed the context prefix from “Allowed in” to “Exercise”. This remains accurate in both the allowed list and the broader browser list.
