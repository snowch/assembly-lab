# Collapsible prerequisites

The user accepted the proposal to keep the “Before you start” heading and its two
introductory sentences visible, collapse the remaining guidance by default, and
push the change. The proposed disclosure label is “Check what you need to know”.

Checked facts: `BeforeYouStart` in `apps/course/src/pages/FrontPage.tsx` renders
`STRINGS.prereqs`. The lead contains the two requested sentences. The remaining
content is the C list, arithmetic prerequisites, an example and its separately
collapsed answer, and links to further reading. Existing styling lays out the
expanded content in two columns on desktop and one on phones.

Use a native details/summary disclosure so keyboard and touch users can open it.
Keep the lead outside it, the answer closed independently, and all existing content.
Store the summary label in `strings.ts`. Give the summary a phone-sized touch
target, visible focus and the standard disclosure marker. Check open and closed
states on desktop and phone in both themes. Follow `CLAUDE.md` and `docs/style.md`.
