# Independent learner review: Instructions in sequence

Reviewed 24 October 2026 by a separate reviewer who did not write the implementation or
copy. Read CLAUDE.md and the sentence/idea closing passes in docs/style.md. Prerequisites:
the front-page prerequisites and the preceding three Fundamentals lessons only.

## Built-page checks

Used the production build at http://localhost:4324/assembly-lab/#/lesson/instructions-in-sequence.
Exercised 375, 768 and 1280 CSS-pixel widths, each in light and dark. Checked the actual
html data-theme value, not just the preference. Each combination passed:

- Initial state displays the starting register values, next-instruction marker, and a
  read-to-pending-write path. The destination remains `?` before execution.
- First step writes the model's intermediate value and moves the next marker to the
  subtraction. Reload preserves that paused state and marker.
- Second step consumes the intermediate value, completes the shown sequence, and removes
  the next marker. Reload preserves the completed state.
- Start again restores the initial registers and first-instruction marker.
- The separate challenge has two blank fields and gives its own starting inputs. Its
  answer is not supplied by the worked-example diagram or submitted in advance.
- No page-level horizontal overflow and no page errors.

Read the complete rendered lesson text in all six contexts. Inspected full-page screenshots
at phone/light and tablet/dark directly. Artifacts: /tmp/sequence-reader/; reproducible
browser script: /tmp/sequence-reader.mjs. This is a focused review, not a full-suite result
or hardware verification.

## Learner findings

No blocking finding remains in the reviewed build.

The page says “The next example adds into w2, then subtracts from that result.” The nearby
figure demonstrates precisely that dependency with one register group, two instructions,
execution markers and the read/write path. The visual replaces the need to hold the
initial addition's operand roles in memory. The stopped first-step state provides a small
bridge before the learner traces the separate fresh-input challenge.

The remaining visible lesson breaks distinguish the investigation, challenge and reflection.
The four short supporting paragraphs after the figure read as one explanation, without the
previous repeated chapter-style headings. There is still sufficient separation between
those paragraphs; the compact presentation does not turn them into a dense wall.

Considered and rejected: the pending read/write diagram might reveal the challenge answer.
It exposes only worked-example source values and an unknown destination before execution;
the challenge explicitly supplies different inputs. The concern is not supported by the page.

## Assumed knowledge and preparation

The page assumes register names, add/sub operand order, reading before writing a reused
register, the meaning of ret and caller, and the simulator's relation to a processor. These
are taught in the preceding three lessons. The only new named mechanism, program counter,
is defined locally by “a special register” that tracks the next position, beside the marker
that demonstrates it. No later call machinery, memory addressing, compiler flags or C
feature is needed to complete this lesson.

A smaller complete arithmetic example would repeat a prerequisite: the first lesson already
isolates one addition, and the third isolates subtraction/reuse. Two instructions are the
smallest example that can demonstrate carrying a written value into a later instruction.
The figure defines, demonstrates and then offers separate practice for that dependency.

## Verdict

Ready from this independent learner and built-page review. Recheck this lesson if later
component, copy or scoped presentation edits change the reviewed states.

## Final copy recheck

After the original review, the sequence challenge's direction changed to:
“Trace the sequence with fresh inputs. Use the first result when running the second
instruction.” This avoids a word reserved by the course's term gate while preserving
the state dependency. Checked the source and canonical record, then checked the final
rebuilt page at 375 and 1280 pixels in both actual light and dark themes. All four show
the revised sentence exactly; no further finding. Browser script:
/tmp/sequence-final-copy.mjs. Earlier interactive-state coverage remains applicable:
this was the only later rendered change to this lesson.
