# Bidirectional counter copy

Copyright © 2026 Christopher Snow

Separate drafting pass from the checked facts and learning outcome in `brief.md`, the existing counter and subtraction panes, the repository style guide and learning-design skill. This pass owns wording only; model/layout work and independent reviews are separate.

## Main route

Keep the compact initial display and unsigned decimal reading below its bits. Explain that real counter ticks add one, while the controls let you explore addition and subtraction. The learner first presses +1 until the reading wraps to zero, then presses −1. This gives a complete upward carry and downward borrow example in four presses from the prepared start. After that, both controls keep cycling rather than stopping or replaying a stored forward trace.

The direction-specific label identifies the last operation: Carry out after addition, Borrow needed after subtraction. The initial Carry / borrow label has a dash, with an explicit explanation that no addition or subtraction is shown. Recent stored readings describe actual actions, not a fixed counting order or elapsed-time claim.

The wrap-down explanation introduces the needed borrowed group at the moment the figure demonstrates it: subtraction must borrow one group from the next position; taking one leaves the largest retained reading in the stored width. The model supplies the width and range. Arm's wording derives the remaining reading from that range, while RISC-V uses the model's `stored` placeholder. The visible decimal below the retained bits supplies the same result. No large equation row or unrelated signed interpretation is added.

Carry and borrow are distinct markers. The Arm note states the instruction-width qualification and C's no-borrow meaning for `subs`; it also states that plain `add` and `sub` preserve flags. RISC-V's note states that these markers belong to the miniature and that the architecture has no carry or signed-overflow flag.

## Joining the fixed worked subtraction

The next pane now says it uses its own supplied earlier and later readings. It no longer claims to use the explorer's current state. Its arithmetic, inputs and assessment gates are unchanged. The obsolete end-of-demo `next` copy is removed because a continuously running explorer has no final state.

## Strings and closing passes

Canonical source strings are in `packages/views/src/strings.counter-wrap.ts`, the introduction in `packages/views/src/strings.counter-subtraction.ts`, and RISC-V's `content/guides/counter-wrap.json`. The new API follows the checked brief. Accessible labels name real addition/subtraction, and status messages identify the stored reading and last marker. RISC-V's status template accepts a signed direction or its canonical control label; the displayed direction should not lose its plus/minus sign.

Sentence pass: concrete controls and fields; automatic state and requested action distinguished; no paused/end labels or rewind claim; no large arithmetic equations; no unsupported native execution claim. Idea pass: guided +1-to-zero followed by −1 provides both boundary mechanisms; the displayed decimal remains beside its bits; the borrow explanation supplies the missing group-of-range step.

Functional verification remains with the model/native tests and built browser review. This drafting pass has not checked final touch positions, theme rendering, state restoration or assistive technology. No human novice study has been conducted; clearer wording and passing tests do not prove learning effectiveness.

## Parent feedback correction

The downward feedback now names borrowing explicitly and identifies the next position's group value, rather than saying only that a group is needed beyond the bits. Its final sentence states the remaining reading and retained width. RISC-V's accessible status uses the canonical direction-specific marker label, so a listener hears Carry out or Borrow needed instead of a generic combined label.

## Borrow scope correction

The normal subtraction feedback now qualifies the marker as a borrow from beyond the stored bits. A subtraction can borrow between internal columns while this marker remains zero. The feedback therefore avoids claiming that no binary borrowing occurred at all. The change affects wording only; the marker and stored result still come from the existing model.
