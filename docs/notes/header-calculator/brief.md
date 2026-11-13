# Header calculator brief

User authorises a calculator in the shared header without the standalone calculator's exercises.
Closing it must preserve scratch work. Existing lesson tutorials remain in their sections.

Checked against `ProgrammerCalculator.tsx`, `programmer-presets.ts`, machine calculator functions,
and `update-handoff.tsx`:

- The existing calculator uses exact BigInt model functions for patterns, readings, arithmetic,
  shifts and editing a 16-bit half. Reuse those functions, controls and reviewed copy.
- Tool presentation starts with unsigned zero at 32 bits, supports 32/64-bit widths and both
  readings. Half editing is available only at 32 bits; shifting uses the current width.
- Widening fills upper bits with zeros. Narrowing discards upper bits. Resizing does not run
  instructions or sign-extend. State that qualification beside the controls.
- The header workspace is mounted separately from lesson artifacts and grading callbacks.
  It survives closing and client-side route changes within the tab. Ordinary refresh resets it.
- A unique ViewHandoffScope includes its work in the existing coordinated app-update snapshot.
- There are no guide answers, tasks or exercise checks in tool presentation. Lesson presentation
  retains its existing preset controls and guides.
- A native dialog is modal on phones and a nonmodal side panel on desktop. It needs a visible
  close action, Escape support, focus restoration and contained scrolling.

Objective: let a learner inspect their own numbers while keeping the current lesson and work.
Prior knowledge varies by lesson; reuse existing plain control labels, keep technical limitations
local, and retain the separate progressive lesson guides. Apply `docs/style.md` in both passes.
Independent learner and technical reviewers inspect the built app in phone/desktop and both themes.
