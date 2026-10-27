# Tiny function: independent two-argument technical review

Copyright © 2026 Christopher Snow

Reviewed by a separate technical/sceptic agent using the inherited session model/settings,
27 October 2026. This reviewer did not write the lesson, renderer, compiler record or tests.
No product files were edited by this review.

## Independent source checks

- Read the actual `add_ints.c`, compile request, response and compiler identity under
  `docs/notes/module-0/two-arguments/`. The response succeeds without diagnostics, timeout or
  truncation. ARM64 GCC 16.1.0 with the recorded flags emits the two displayed instructions
  in the shown order. Neither emitted assembly nor original debug references was invented.
- The submitted copyright line explains the one-line offset in displayed C. Original debug
  references name the closing brace, displayed line 4. Checked teaching associations name
  the return expression at line 3 for both the arithmetic and return. Complete numbered C
  remains paired with the listing; the second example does not repeat optional compiler
  debug-reference details from the first introductory function.
- Freshly fetched Arm AAPCS64 2025Q4 independently. Parameter passing Stage A initialises
  NGRN; Stage C.9 allocates these small integral arguments in order to the low bits of x0
  and x1, selected here by w0/w1. Result Return uses the same allocation as a first argument
  of that result type. The C mapping defines signed int as a signed word. These are calling
  conventions; they do not make RET copy a result or require every callee to preserve w1.
- The actual worked function writes only its first argument/result register. Its second
  input remains unchanged because neither instruction writes it. The source prose scopes
  these incoming/result rules to integer arguments and this example; no general claim of
  callee preservation is made.

The independently fetched ABI copy is `/tmp/twoargs-tech-aapcs64.rst`:
<https://raw.githubusercontent.com/ARM-software/abi-aa/2025Q4/aapcs64/aapcs64.rst>.

## Independent executed checks

- Focused recorded-listing/model facts: 10 tests passed, 1 file, 4.61 seconds.
  `/tmp/twoargs-tech-facts.log`.
- Independent repeat compilation through the recorded Compiler Explorer endpoint succeeded;
  its instruction text and original source references exactly match the saved response.
  `/tmp/twoargs-tech-compile.json`.
- Own GNU/QEMU differential run: 1 program, 8 calls, 24 instruction states, zero differences,
  0.2 seconds. `/tmp/twoargs-tech-native.log`. It includes zero, negative and safe signed
  boundary cases; none relies on signed C overflow.

The existing first function, its stable figure/challenge identity and reference remain. The
new primitive is appended rather than shifting the existing indexed snippets. Both function
activities are mounted unconditionally and use separate interactive storage slots.

## Shared renderer and sibling uses

The caller's displayed arguments are derived from the trace's initial state, so updating w0
cannot rewrite the call label. The two-argument view labels each register separately: result
state belongs to w0; the other register retains its input label. RET's lack of ordinary
register writes comes from the model trace, as does the caller's resumed state.

Inspected every `primitive-operation` use. The other lesson uses in Constants and widths and
Shifts are operation activities, outside the function-only visual branch. Existing one-argument
strings and status text are retained. The shared layout gains only a wrapping row for the
function's register cards; independent built review must check the original function too.

## Final built browser checks

Independently ran `/tmp/twoargs-tech-browser.mjs` against the final current production preview
at `http://localhost:4398/assembly-lab/`. Complete run exited 0 in four contexts: 375px and
1280px, each with actual rendered light and dark themes. Log: `/tmp/twoargs-tech-browser.log`.

- Both activities are initially mounted with separate zero-step states and independent controls.
- Caller inputs stay fixed while the first destination changes. The second tile retains its
  own input label/value instead of appearing under a group-wide result label.
- Only arithmetic marks the first register as written. The caller remains waiting until the
  return step; RET removes the ordinary-register write marker and resumes the caller.
- Reload after arithmetic and return restores the same state. Stepping/resetting either figure
  leaves the other figure untouched. Both original and new functions ran through their return.
- Complete numbered C and both instructions remain side by side. Both checked source tags name
  the return-expression line, which highlights with each corresponding instruction. Original
  compiler-detail disclosure stays on the first example; the second has none.
- At 375px, the new paired listing has a 302px viewport and 588px content width. Its panes have
  identical top coordinates. Sideways scroll and keyboard ArrowLeft operate inside that listing;
  there is no page-level horizontal overflow or console/page error.
- Register labels render at 15px. Arrows use a solid 2px foreground border with the expected
  dark/light foreground colours, plus the existing return direction and waiting-state styling.

New-example screenshots cover every initial/result-ready/returned state in all four contexts:
`/tmp/twoargs-tech-{375,1280}-{light,dark}-{initial,added,returned}.png`. Visually inspected
representative states in every width/theme. The original single-argument view was additionally
captured in all four contexts before/after return by `/tmp/twoargs-tech-old-visual.mjs` (exit 0),
and representative phone/desktop/light/dark frames were visually inspected. No shared-layout
regression appeared.

## Sceptic and closing passes

The independent learner report found no blocking issue. Its prerequisite and progression
assessment survives checking against the actual earlier prose: One addition already demonstrates
register-source ADD, and Adding a constant already demonstrates reading the old destination.
The new example composes those known operand mechanics with only the second incoming argument.
No new calling instruction, stack concept or register-preservation guarantee is assumed.

The learner's decision not to require another quiz is sound for this bounded worked extension.
It is visible before either activity runs and demonstrates the new incoming map; the original
practice remains explicitly attached to the original function. Requiring a third parameter or
another arithmetic operation would not establish a missing prerequisite here. No learner finding
was rejected, waived or converted into an unrecorded product edit.

Read the root's `two-arguments-brief.md`: its objective, evidence boundaries, stable IDs, separate
persisted state and omission of redundant compiler details match the implementation. Reviewed the
new model/view/browser tests and primitive-corpus coverage update. Assertions retain prior cases
and add the new call; they do not weaken old expectations. The new canonical-label test's
`flatMap` selects exactly the string-valued labels, avoiding the invalid literal-union predicate
without relaxing any prose comparison.

Sentence pass: local short definitions and precise integer scope; no hidden new prerequisites
or contradictory caller/result claims. Idea pass: the computed caller/argument/result diagram,
paired source and separate ADD/RET states demonstrate the intended mechanism. No challenge
answers are exposed by this review or the new worked example.

**Independent technical verdict:** approved for the reviewed final production build, source
record and executable checks. Whole-suite/CI outcomes are reported separately by the managing
session; this review does not claim physical processor execution.

No challenge answers are recorded in this review. This is not physical-hardware evidence.
