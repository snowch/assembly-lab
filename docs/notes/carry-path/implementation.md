# Visible carry path implementation

The user approved the refined standalone mock and requested the visual only once or twice. The production lesson therefore uses the full carry walkthrough only for its first addition. The width boundary and subtraction construction remain compact computed examples.

## Scope and learning design

The observable outcome is to trace a column's kept bit into its result cell and its carry into the next incoming-carry cell. The existing lesson defines carry, binary addition and the four-bit miniature before the figure. Its fresh subtraction exercise remains the independent application. Flags, processor timing and signed overflow remain outside this change.

This follows `.agents/skills/learning-design/SKILL.md`, `docs/visual-language.md`, `docs/style.md` and `docs/authoring.md`. The user approved the prototype interaction; that approval and agent/browser reviews do not establish learning effectiveness. No beginner study or screen-reader session was performed.

## Changes

- Addition displays the real `fourBitAddition` column inputs and the padded binary total as two labelled output places, Carry and Kept. Starting patterns are explicitly labelled A/B to match the equation and grid.
- One reveal exposes a whole column, preserving previous results. The newest kept result and next incoming carry remain labelled destinations until the next reveal. Zero carries receive the same treatment as ones.
- The persistent SVG starts at the carry output's bottom edge and ends at the destination's top edge. Its arrowhead tip uses `refX=8`. The empty 80px routing corridor leaves a full 24px descent to the final Carry out destination.
- Column groups distinguish Revealed and Next using solid/dashed boundaries and visible words. Bit labels below the grid keep the connector away from text and cells.
- All result bits and future carries begin unknown except the initial zero carry. Reset restores that state. Existing handoff state is retained. Next column uses aria-disabled at completion so it retains keyboard focus; an extra press has no effect.
- Width shows the computed addition, carry outside the boundary, retained pattern and unsigned reading. Subtraction retains its inversion/add-one construction and shows one compact model-derived addition/result plus the signed reading. Neither repeats the column grid or carry connector.
- Shared theme tokens supply every colour and font. No model, ISA, assessment or unrelated Pi material changed.
- All new labels live in `strings.four-bit-arithmetic.ts`; the canonical draft's figure-label section records their exact definitions and templates.

## Builder verification

- Focused Vitest: `packages/views/src/four-bit-arithmetic.test.tsx` and `content/lessons/four-bit-arithmetic.test.tsx`: 2 files, 8 tests passed. Assertions retain model inputs/results, initial gates, four reveals and Reset; add both destinations, zero/final carry, focus/completion and exact endpoint/resize regression checks. Compact width/subtraction tests retain their arithmetic assertions and require no repeated grid.
- TypeScript check passed both before and after the focused-test additions.
- Root's preliminary browser run: phone passed, desktop reported oversized prose measures on current/status paragraphs. Their widths were then constrained to 60ch without changing arrow geometry or semantics. The initial failure remains separate from subsequent verification.
- Independent learner/technical review and production build/browser/full-suite checks are managed separately. Their findings and results are not replaced by these builder checks.
