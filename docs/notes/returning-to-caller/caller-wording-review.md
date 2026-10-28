# Caller assembly wording

Copyright © 2026 Christopher Snow

## Brief and checked facts

The user approved the replacement wording distinguishing handwritten caller assembly from
GCC-generated function instructions. Apply that wording to the lesson and its figure, keeping
the canonical prose synchronised. The learning objective and existing interaction are unchanged.

The caller is authored assembly in `content/lessons/returning-to-caller.example.ts`.
The `increment_int` body comes from `INCREMENT_INT` in `meet-the-machine.listings.ts`, with
the recorded C and compiler response in `docs/notes/module-0/increment/`.
The existing `returning-to-caller.facts.test.ts` checks that body against the recorded listing.
The preceding A tiny function lesson introduces GCC, listings and the caller.

The wording was supplied and approved in the conversation; no new prose draft is needed.
Review the full lesson and changed figure caption against `docs/style.md` in distinct learner
and technical passes. Check the built page at phone and desktop widths in actual light/dark
themes. Keep the scope to this provenance clarification and record any findings below.

## Independent reviews

Reviewed on 28 October 2026 by a separate reviewer who did not draft or edit the
learner-facing change. The learner and technical passes below were distinct reads.
The reviewer changed only this review record.

### Learner pass

No findings within the provenance clarification. Read the complete lesson in source
and in the built page, using the preceding lessons as the prerequisite boundary.
Ran both closing passes in `docs/style.md`: the changed sentences are direct,
their subjects are clear, and the distinction is concrete beside the displayed code.

“The caller’s assembly was written by hand. GCC generated `increment_int`’s
instructions from the C shown beside them.” distinguishes the two sources before
the figure. The figure repeats “The caller’s assembly was written by hand.” directly
under Caller. The C and function instructions appear together under `increment_int`.
The prose and figure therefore give the same account of the displayed code.

Assumed knowledge checked: registers, assembly instructions and operands come from
One addition; constants come from Adding a constant. A tiny function explicitly says
“GCC, a compiler, translated the C below into an assembly **listing**, a written
sequence of instructions” and “Code that calls a function is its **caller**.” It also
explains the argument and result in `w0`, `ret`, the function label and the compiler
setting. The changed wording introduces no additional unexplained prerequisite.
The reviewed lesson supplies its new branch, return-address and calling-convention
definitions locally.

Browser evidence: production preview at
`http://localhost:4401/assembly-lab/#/lesson/returning-to-caller`, Chromium, fresh
contexts at 1280 × 800 and 375 × 812, each in light and dark. Inspected full-page and
figure screenshots in all four combinations. Both changed strings render as prose;
the caller caption wraps cleanly on the phone. Verified actual `html[data-theme]`
values and body backgrounds: light `rgb(243, 246, 245)`, dark `rgb(16, 22, 21)`.
The document width equals the viewport in every combination. On the phone, the
paired listing scrolls within its own 317-pixel viewport over 588 pixels of content;
inspected the instructions after scrolling in both themes.

### Technical pass

No findings within the provenance clarification. Checked the statement against
`returning-to-caller.example.ts`: the caller is authored assembly, with no caller C.
Checked the lesson's `functionProgram: INCREMENT_INT` against
`meet-the-machine.listings.ts` and the retained `increment_int.c`, `request.json`
and `response.json` in `docs/notes/module-0/increment/`. The C shown beside the
function is the recorded C with its copyright comment omitted. The successful
recorded response contains `add w0, w0, 1` followed by `ret`; those instructions
match the function body in the caller example. The request records `-O1`. This
supports the specific claim about this displayed function without claiming that GCC
generated the caller or that every compiler must choose these instructions.

The canonical prose record matches both changed source strings. Read the existing
facts test that pins the function body; the reviewer did not change or rerun tests.

In a separate browser pass over the same four viewport/theme combinations, ran all
four visible instructions and Start again. Each fresh figure starts at `bl`, with
`w0` holding 7 and `w1` holding 0. The current-instruction display follows the call,
function addition, return and caller addition. The worked result remains in `w0`
through the return; the caller then writes `w1`. Run the instruction disables at the
documented endpoint, and Start again restores the initial state. The handwritten
caller caption remains present through each step. No browser console or page errors
were observed.

Scope: source review and built initial rendering, basic stepping and reset only.
Challenge submission, hint states, persistence migration, external reference fetching
and a broad regression pass were not part of this independent review. No accepted
or rejected findings require a follow-up change.

## Validation

- Existing canonical-prose and model-fact suites: 2 files, 9 tests passed (0.94 seconds).
- Production build passed (9.94 seconds); existing bundle-size advisory remains.
- Formatting of both edited TypeScript files and `git diff --check` passed.
- Existing lesson browser suite: all 6 tests passed on phone/desktop, including light/dark
  stepping and restored progress (20.2 seconds).
- Full CI and merge/deployment results will be recorded in the pull request when complete.
