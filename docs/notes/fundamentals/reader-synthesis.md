# Independent learner review: Putting it together

Copyright © 2026 Christopher Snow

Reviewed only `meet-the-machine`, presented as **Putting it together**, with the front page's
stated C/arithmetic prerequisites and the four earlier Fundamentals lessons. The review used
the actual built site at `http://127.0.0.1:4322/assembly-lab/#/lesson/meet-the-machine` on
23 October 2026. The reviewer did not author its copy or implementation and formed this
assessment before reading the implementation rationale.

## Browser evidence

Checked 375 × 900 and 1280 × 900, each with actual rendered `data-theme="light"` and
`data-theme="dark"`, using separate fresh browser contexts. All four contexts rendered the
ten sections, the new title and all four prerequisite lesson links. None produced a console
error, page error or horizontal document overflow.

In each context checked the initial prediction gate, a committed prediction, the unlocked
stepper after one instruction, reload and Reset. Commitment survived reload; the stepper
restarted at its initial instruction. This is ordinary transient stepping, not a lost saved
exercise. Replayed a step after reload and Reset returned to the stated inputs. Also committed
the failure-experiment prediction and inspected its unlocked initial figure. Did not solve the
two synthesis exercises in this independent reader pass; their correctness is covered by the
separate technical/automated checks, not asserted here.

Screenshots captured at all four combinations, with `initial`, `step` and `failure` suffixes:
`/tmp/synthesis-{375,1280}-{light,dark}-*.png`. Directly viewed the phone/light initial and
stepped, phone/dark stepped and failure, desktop/light initial and desktop/dark stepped
screenshots. Browser evidence and state text are in `/tmp/reader-synthesis-log.json` and
`/tmp/synthesis-{375,1280}-{light,dark}.txt`. These are local review artefacts, not course assets.

## Finding

**Medium: the phone listing conceals the instructions without a local navigation cue.**
The text says “The complete C and its related instructions appear together below”, and asks
learners to use the first instruction. At 375 px the initial static listing and trip stepper
show only C. The instructions pane starts 332 px across a 317 px viewport; the contained piece
has a scroll width of 588 px. No Show instructions control or local swipe direction appears
there, although the previous tiny-function lesson explicitly used such a control.

The assembly is present and reachable: moving the contained scroll exposes it without moving
the document sideways, independently confirmed and viewed in
`/tmp/synthesis-phone-scrolled.png`. This is a discoverability fault, not missing content or a
request to stack C above assembly. Suggested smallest fix: give explicit local directions to
swipe sideways between the paired panes, or provide an equivalent visible navigation control.
Reported to the managing agent; a separately drafted `listingNavigation` string is now present
in source. Its appearance in a final rebuilt page still needs independent confirmation.

## Understanding and assumed knowledge

The bridge now works: addition, reuse, subtraction, a complete one-operation call/return and
state passing have each been demonstrated and practised before this composition. The trip
example adds mapping a C variable onto reused registers. The repair asks learners to apply the
same operand order; the deletion experiment explicitly invites a best prediction about a new
situation. It need not disclose its behaviour before that prediction. The longer tracing
exercise extends the same known arithmetic and provides its literal-operand notation locally.

Required knowledge checked against the front page and earlier lessons: C integer arguments
and return, addition/subtraction, a register and its selected width, destination/input operands,
caller/argument/result, the next-instruction marker and program counter. These have prior
teaching or an explanation here. Memory is explained before the fall-through experiment.
Compiler settings are explained in the optional compiler note and the later generalisation;
no task requires those settings. No additional unexplained required term was confirmed.

The page is still substantial, but its sections now compose previously practised mechanics
rather than introducing every mechanism through this whole function. No further split is
supported by this pass. Distinct core activities are visible in the page; the remaining
prediction and answer gates serve their stated purpose. No additional learner finding.
