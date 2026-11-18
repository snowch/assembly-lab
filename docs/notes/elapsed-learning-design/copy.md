# Elapsed-counter copy draft

Copyright © 2026 Christopher Snow

Separate drafting pass from the checked facts in `brief.md` and the independent learning-design review. The user’s transition concern is observed author feedback. This draft and agent reviews are not evidence of a novice learning unaided.

## Outcome and scope

Given earlier and later readings of a normally advancing fixed-width counter, use the same-width subtraction in the right operand order. Explain why its retained result is the forward interval while fewer than one full turn has passed.

Earlier lessons practise `sub`, operand order, unsigned readings and retained-width wrapping. The worked example now keeps the original 32-bit operands, width and ring throughout. The addition miniature belongs with addition, not on this elapsed route. Borrow and the meanings of subtraction’s flags are deferred to the following named lesson.

## Checked facts supplied to drafting

- The recorded `elapsed` function subtracts the earlier reading from the later reading and returns the retained 32-bit result. Its existing prediction and ring share a call.
- The ring model supplies `now`, `then`, the retained `elapsed` value and the two forward stretches. `COUNTER_VALUES` supplies the full-turn size; the code’s register width supplies the width. Every worked number in the new view strings is an argument from that model.
- When `now` is below `then`, the forward interval across zero is the full-turn size minus `then`, plus `now`. This differs from `now - then` by one full turn, a multiple of the retained-width range. Adding that full turn does not change the retained low bits, so the subtraction gives the same forward value.
- Actual elapsed time equals this forward distance only when the counter advances normally and fewer than one full turn passes. Two readings do not reveal additional full turns.
- The construction keeps its existing four graded calls, input registers, returned register, five allowed instructions, starter and saved drafts. `subs` produces the same result bits as `sub` and additionally updates flags. These tests require only the returned elapsed result, not particular flags.
- The existing fresh reflection pair is retained. Its answer was checked against the same-width model before drafting. The combined flag reflection remains with the following flags lesson.

## Rendering and gate contract

Use `investigationTitle` and `investigation` to introduce the same-input ring without giving the worked answer. Render `ELAPSED_COUNTER_STRINGS.summary` and `rule` inside the existing prediction gate. No exact worked result belongs in unconditional prose or an interactive-after paragraph.

`summary(now, then, elapsed, width)` uses the same model values as the ring. Render backtick spans as code. `rule(range, width)` explains the wrapped path, its equality to the low-width subtraction and the two elapsed-time assumptions. Its full-turn number and width also come from the model.

The task preserves the original call contract and allowed-instruction list verbatim. The construction prose immediately before it briefly defines the offered `subs` form, where the presentation linker adds its primary instruction reference. It does not require a flag calculation. The reflection asks for a new elapsed result, forward-path reasoning and the full-turn limit. Its answer remains behind the existing answer disclosure.

## Canonical view strings

### `summary(now, then, elapsed, width)`

Keeping the low {width} bits of `{now} - {then}` gives `{elapsed}` ticks: the same forward distance shown on the ring.

### `rule(range, width)`

When `now` is less than `then`, the forward distance is `({range} - then) + now` ticks. This is `now - then` plus one full turn, which does not change the low {width} bits. The subtraction therefore keeps that same forward distance. This measures elapsed ticks only when the counter advances normally and fewer than {range} ticks, one full turn, pass between readings.

## Canonical page copy

The exact `COPY.subtraction` additions and reflection replacements are recorded in `docs/notes/course-pacing-implementation/copy.md`, under its `pacing-1-4.copy.ts` JSON record. The added `originality` statement describes the published same-input elapsed route; its existing textbook-example attribution remains intact. Existing keys outside this change remain unchanged. The old combined C reflection remains in the original canonical source for its placement in the following lesson.

## Verification and evidence boundary

This pass checked the supplied model facts, existing construction contract and exact canonical wording. The parent owns model execution, built-page keyboard/theme/width checks, independent learner and technical review, and full functional validation. Those checks cannot establish measured learning effectiveness. A novice formative session remains an explicit evidence gap.
