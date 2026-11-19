# Independent technical and sceptic review

Copyright © 2026 Christopher Snow

Reviewer: a separate agent, using the inherited available model. I did not draft or implement the change. This record separates source inspection, native execution and actual browser checks; it does not establish novice learning effectiveness.

## Scope and source checks

Read the repository instructions, authoring/style/visual guidance, named technical sources, actual current diff, counter model and arithmetic/representation helpers, state-store implementation, both mounted panes, relevant regression tests, and the current canonical copy records.

The start is 13 and the stopping count is derived from the four-bit range, giving three increments. The existing machine-backed addition helper computes the full sum and low four retained bits; carry is column 3's carry out, rather than the actual 32-bit instruction's architectural flag. The unchanged local width/`add`/`adds` qualification remains correct. The subtraction now obtains its start, finish and timeline from the same counter helper, rather than maintaining a second hand-built path. Its model-derived stages are inversion of 1101 to 0010, adding one to obtain 0011, then adding the later reading's 0000, retaining 0011. That matches three increments through 13 → 14 → 15 → 0 under the unchanged shorter-than-a-turn bound.

The original 32-bit operands, prediction gate, ring and written-function challenge are not modified. Neither the small result nor its three-step trail reveals the larger prediction's answer. The instruction identifies an actual control and visible bit pattern, and the pause is implemented by the final guarded control state. A fourth activation cannot advance the counter. Saved tick counts are read without an automatic write; old progress of two ticks now means one more increment is needed in the new example. No code/prediction reset is added.

The runtime instruction matches both its separate drafting record and the named older canonical counter-copy record. That canonical record now describes three increments and identifies the follow-up. The subtraction's canonical record retains its parameterised strings and records the new model-derived stages. Earlier two-tick review measurements are explicitly historical rather than presented as measurements of this build.

## Native execution

Ran the permanent `module1-four-bit` corpus with GNU tools and QEMU through `AL_TOOLS=/workspace/native-tools`. Result: one program, 18 calls, 54 instruction states compared, zero differences. The four new calls cover the new initial increment and the inversion/add-one/final-add/subtraction values; earlier corpus coverage is retained. The checked sources remain real 32-bit ADD/SUB routines, with the four-place teaching view explicitly selecting the retained low bits. No four-bit Arm processor or hardware-board run is claimed.

## Built-browser verification

Independently drove Chromium against the built lesson on port 4488 at 1280×900 and 375×812, each in actual light/dark themes. Verified the rendered theme token was respectively `#f7faf8` or `#101b1a`; viewed the wrapped-state desktop and phone screenshots.

All four combinations passed:

- Initial reading 1101 with no completed-addition carry; concrete until-zero instruction and automatic-pause statement visible.
- Three keyboard activations produce readings 1110, 1111 and 0000; full sums match each completed increment and carry values are 0, 0 and 1. The control remains enabled for the first two steps, then paused with focus retained. A further activation leaves the wrapped result unchanged.
- Control Y and page scroll remain unchanged across all three steps. At 1280×900, the button stayed at 736.125px (44px high); at 375×812 it stayed at 431.875px (44px high). The focused control remained inside each viewport.
- The following pane shows the exact inversion/add-one/add-later patterns above, retained result three, the same four-reading timeline, the interval bound and explicit 32-bit bridge.
- The larger ring remains gated during all small-counter steps; submitting the original prediction opens its expected summary.
- A real editable function draft and committed prediction survive counter completion, reload and local Reset. Reset returns the small counter to 13 while retaining that draft, selected prediction and ring state.
- Injected previous two-tick progress reloads at 15, leaves its saved count at two on render, and permits the final tick to zero. It then saves three normally; the edited draft remains.
- No page errors or page-level horizontal overflow.

## Findings and limits

No unresolved technical defect or unsupported new prerequisite was established. Earlier binary arithmetic teaches retained bits/inversion and the preceding addition/flags lessons teach the width and `add`/`adds` distinction; the current pane itself defines counter/tick/wrap. The new path defines and demonstrates ordinary increments followed by wrap, while the following model demonstrates elapsed subtraction. The unchanged larger prediction and written function provide independent application. These are opportunities to learn, not observed learner outcomes.

No learner finding had been relayed for sceptic adjudication when this record was written. If later source or layout edits affect these checks, the affected final-build states need independent rechecking. I did not run the full suite, use a screen reader, test other browser engines or run physical hardware; those are not claimed by this review.

Inspection setup note: one `rg` command named a nonexistent optional `helpers*` file glob while also successfully locating the state-key definition in the actual test file. This was an inspection-path mistake, not a native/browser failure. The completed native and four-context browser commands above passed without skipped combinations.
