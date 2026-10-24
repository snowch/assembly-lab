# One addition: independent learner and built-page review

Reviewed 24 October 2026 by a separate reader who did not draft or implement this change.
Prerequisites: front page's basic C, arithmetic and binary conversion only; no later lesson.
Built site: http://localhost:4324/assembly-lab/#/lesson/one-addition.

## Verdict

No blocking learner finding. The shorter page reads continuously from register/instruction
vocabulary to the operand rule, then the worked operation and fresh practice. Three substantive
section headings remain visible, rather than ten chapter breaks. All ten underlying headings
remain named and available for assistive navigation.

The initial diagram makes the relevant relationship visible: two labelled Read values, the
addition sign, a downward arrow and a dashed pending destination. “Write after running” and
`?` distinguish a future write from the current register contents. The number calculated by the
worked operation is absent until Run. The distinct fresh challenge has blank fields and no
worked-answer disclosure in its initial state. The existing whole function is unnecessary here:
one arithmetic instruction is a complete example for this lesson's objective; the next lesson
introduces the caller and return separately.

## Checked states and evidence

Real Chromium, 375, 768 and 1280 CSS pixels, light and dark: six contexts. Actual rendered
`html[data-theme]` checked in every context. Read the whole rendered lesson and inspected all
six full-page screenshots. Page scroll width equals viewport width in all contexts; no cropped
registers, source expressions or pending destination. Diagram arrows and text readable in both
themes. Screenshots: `/tmp/addition-{width}-{theme}-initial.png`.

In each context: initial state, Run, reload of the executed state, Start again and restored input
values. The visible result/status survives reload and reset restores the pending destination.
No page errors. Script and raw observations: `/tmp/addition-reader.mjs`,
`/tmp/addition-reader-report.json`. A separate browser observation confirmed both practice
inputs start empty. Challenge grading was not exercised in this reader pass; the parent
educational suite owns that check.

## Assumed knowledge and wording pass

- “Register”, “instruction”, “operands”, “simulator” and “model” are defined before the next
  action needs them.
- “Destination” is used in the objectives before its concrete identification; the sentence
  “the first operand names the register written” establishes its meaning before the learner
  is asked to identify it. This is ordinary directional vocabulary, not a blocking term gap.
- “32 bits” rests on the front page's binary-conversion prerequisite; interpretation and the
  wider register are explicitly deferred to Module 1. No new compiler setting, tool,
  addressing syntax, calling convention or C feature appears here.
- The unexplained marker is not needed to operate this one-instruction figure; the instruction
  and Run control are unambiguous. Its role is taught in the later sequence lesson.

The sentence pass found direct wording and no missing technical qualification needed for this
particular distinct-destination addition. The explanation pass found an adequate bridge from
operands to the independent fresh trace. “Reading preserves the inputs. Only the destination is
written.” is supported by the shown figure, without claiming the destination can never also be
an input in another instruction.

## Non-blocking presentation observation

Low severity: “Trace a new addition without running it” appears in prose immediately above the
caption “A new addition to trace without running it.” The repetition is brief and does not
impede comprehension; further polishing could retain that instruction in one location only.
No product edits made by this reviewer.
