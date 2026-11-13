# Independent lesson-footer design recommendation and copy draft

## Evidence and scope

Read the written brief, the current `App.tsx` footer structure, `LessonCompletionButton.tsx`, the completion strings and the course visual-language/review guidance. This is a design recommendation from the supplied current screenshot and source, not a verdict on a built revision. No product or test was edited. The later learner check should use only `register-widths`; shared first/final and title-length cases belong to technical verification.

The screenshot's problem is hierarchy and alignment. Previous occupies one row while completion and Next occupy another. The prominent completion button looks like a third navigation choice. The repeated bottom padding also leaves the conclusion detached from its controls. The project guidance favours simple containers, spacing and existing theme tokens rather than extra nested cards.

## Recommended structure

Use one quiet completion row, followed by the paired navigation row:

1. An unboxed completion control, aligned to the lesson column's left edge. Keep its circle/check symbol and a generous invisible hit area. Use normal text weight and the existing accent for the selected state. A visible focus ring and a restrained hover treatment remain necessary.
2. Keep the existing browser-local saving note immediately beside or beneath this control, at secondary reading size. It describes the mark, so it belongs with completion rather than after navigation. Preserve the full storage-failure message and its live announcement.
3. A modest divider and two balanced Previous/Next cards, equal grid columns at tablet/desktop widths, with Previous left and Next right. Keep the current M/L references. At narrow widths, let the pair stack in a predictable order if long titles need the room. Do not squeeze titles or reduce text sizes to preserve columns.

The completion control should be outside the navigation landmark. Marking must remain a separate explicit action, without moving to another lesson or treating exercise grades as completion. Keep the same button DOM node and keyboard focus through marking and undoing. A status-with-action label can improve the completed state without changing the store or adding a second independently focusable control.

Remove the overlapping spacing responsibilities at the end of the last section, lesson wrapper and footer. Aim for one deliberate gap after the last visible learning content rather than several accumulated padding blocks. Check actual rendered distances: shortening a single outer margin is insufficient if the last section and wrapper still contribute their large paddings. Preserve the normal spacing between teaching sections.

## Copy draft

Incomplete button: **Mark lesson complete** (retain the existing text).

Completed button: a primary status **Lesson complete**, followed by a smaller underlined **Undo** inside the same button. A visible separator may distinguish the two parts. Its complete accessible name must include both visible phrases, for example **Lesson complete · Undo**. The action is then explicit, the state reads naturally, and the button keeps focus through the toggle.

Retain the current full saving and saving-failure sentences. Their exact browser/device scope is useful; shortening the normal note to “Saved on this device” would lose the fact that storage belongs to this browser.

If the implementation must avoid new copy, the existing pair of action labels is accurate and can be restyled. However, **Mark lesson incomplete** describes the reverse action while visually occupying the place of a completed status. The status-plus-Undo treatment is the stronger choice for this design request.

Do not show a separate static “Lesson complete” badge beside the old reverse-action button: that duplicates the state and adds another box. Do not replace the button with a different element on completion unless focus is explicitly managed; keeping one button avoids that complication.

## Built-review criteria

At 375, 834 and 1280px in actual light/dark themes, inspect incomplete, completed and restored marks. Confirm the completion row reads as a quieter local action, the navigation pair has stable alignment, the gap above it is proportionate, and long text wraps without overflow. Exercise keyboard Enter/Space and visible focus, check 44px-or-greater hit area, and preserve storage-failure readability. Completion must not silently navigate, clear exercise work or imply that grading has changed.

No arithmetic, architecture or new prerequisite knowledge is introduced by this footer change. This recommendation does not certify a final build; the parent must provide the built revision for independent learner/technical closure.
