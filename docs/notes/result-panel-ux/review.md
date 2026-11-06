# Returned-result panel independent review

Status: independent final prototype review passed, 6 November 2026.

This reviewer did not draft the replacement copy or implement the panel. This is an
agent learning-design and technical review, not a novice study or evidence that a
learner can transfer the mechanism.

## Scope and evidence

Read `AGENTS.md`, `CLAUDE.md`, `docs/authoring.md`, `docs/style.md`,
`docs/visual-language.md` and `.agents/skills/learning-design/SKILL.md`.
Inspected the supplied `1-4567.png` baseline screenshot. Read the baseline
`ListingCompare.tsx`, call-comparison strings, focused call tests, recorded
`TRIP_REMAINING`/`TRIP_REMAINING_U` listings and the published lesson assembly in
`pacing-1-4.ts`. Source reading and screenshot inspection do not substitute for
checks of the final built prototype.

## Outcome and preparation

The learner should explain why two independent calls return identical 32-bit
`w0` contents but yield different C values, and distinguish a valid unsigned
wrapped result from a result that expresses the trip's intended meaning.

Earlier reading work introduces hexadecimal, bit weights, the top bit and signed
and unsigned readings, then asks for a fresh reading and a constructed negative
pattern. The current activity composes that preparation with C arithmetic rules
and independent function calls. It must keep the starting arguments, final return
moment and C types explicit. Signed overflow, undefined behaviour and unsigned
wrapping are introduced in this lesson; they cannot be assumed from bit-reading
practice alone. General C conversions, overflow detection and a full C type
system are outside this panel's job.

## Baseline findings

1. **Medium, unnecessary comparison:** the screenshot repeats “Final w0 bits
   when … returns” with two identical 32-bit rows and identical hexadecimal.
   The learner must compare 64 cells to discover a relation the model already
   knows. Show one computed word when, and only when, both independent calls
   returned that word; retain the two function/type/value associations.
2. **Medium, separated cause and effect:** “The top bit is 1. Its weight is …”
   arrives after the result values and several paragraphs. The reader must hold
   both long decimal readings while finding the cause. Keep the shared lower-bit
   contribution and the two top-bit contributions visibly beside their readings.
3. **Medium, repeated explanation:** the return values, “Both calls returned the
   same bits in w0”, the reading introduction and two equations overlap. A compact
   computed comparison can carry the mechanism once. Keep local qualifications
   that it cannot express: this signed result fits, unsigned wrapping is defined,
   neither instruction reports the trip overrun, and registers have no type tag.

These are review hypotheses about attention and memory load, supported by the
representation and repetition, not observed novice mistakes.

## Misconceptions the replacement must distinguish

| Plausible wrong rule | Required visible evidence |
| --- | --- |
| A register knows whether it contains signed data. | One shared computed word, two explicitly labelled C readings; no type tag in the register. |
| The top bit is just a minus sign. | Shared lower 31-bit contribution plus the top bit's negative or positive weight, yielding both values. |
| Any negative signed result is overflow. | The returned signed result expresses the overrun and fits the signed range. |
| The large unsigned value is a C error or an invalid number. | Wrapping is defined and the value is valid unsigned data; it does not express this trip's overrun. |
| A wrapped result contains a warning. | The same word can be an ordinary unsigned value; these listings do not check the trip bounds. |
| The return type alone selects subtraction rules. | Operand/parameter types determine the arithmetic here; return type determines the caller's returned reading. |
| The second call continues the first. | Each independent call uses the labelled starting arguments. |

The essential route must show the complete worked reading without opening a
disclosure. A prior-lesson link is useful support, not a replacement for that
mechanism. Reset/restoration must preserve the prediction/call distinction.

## Technical review conditions

The recorded listings execute `sub w0, w0, w1` and `ret`. For arguments 3 and 5,
the resulting word is `0xfffffffe`: lower 31 bits contribute 2147483646 and the
set top bit contributes −2147483648 or +2147483648. The readings are −2 and
4294967294. These values must remain computed from the trace and bit helpers.
The shared-word layout must require two successful equal returns; different
returns or faults must retain truthful per-call results. A different input with
top bit zero must not retain overrun or wrapping claims from this example.

## Findings challenged during implementation

- Accepted: an intermediate shared-word layout omitted the function names from
  the value cards. The final cards name their functions and retain their C types.
- Accepted: an intermediate layout attached trip-overrun meanings from the input
  ordering alone. The final source requires successful equal returned words and
  agreement with the signed mathematical subtraction of two nonnegative,
  signed-range arguments before attaching that meaning.
- Resolved by inspection: the proposed fixed-width numeric table could have split
  decimal groups on phones. The final table keeps each number intact, uses one
  shared lower-bit value and one shared top-bit value, then the two contributions
  and totals. Browser measurements and screenshots below establish the result.

## Final built-prototype checks

Reviewed the production build at `http://localhost:4371/assembly-lab/`, at 375 ×
812 and 1280 × 800 in actual light and dark themes. Each fresh browser context
used an independent prediction/call state and blocked service workers. Inspected
all four captured result-panel screenshots, not just DOM width assertions.

- Before prediction, no instructions, returned bits or call button are exposed.
  A checked incorrect prediction reveals the paired listings and explicit call
  action, with no returned result before that action.
- Keyboard calling produces one 32-bit word in four byte groups, hexadecimal
  `0xfffffffe`, and function-associated values −2 and 4,294,967,294. Their
  trip meaning, signed-range qualification and unsigned validity qualification
  are adjacent. Both cards use neutral styling in both themes.
- The essential route visibly contains the common lower contribution
  2,147,483,646, top bit 1, signed/unsigned contributions −2,147,483,648 and
  +2,147,483,648, and the two totals. The preceding sentence says to add the
  contributions. No disclosure hides the arithmetic.
- Phone numeric cells measure 120 px per reading at 12 px monospace; desktop
  cells measure 358 px at 15 px. The complete signed contribution and large
  unsigned total stay on one line. No decimal digits or comma groups split.
  Phone row labels wrap between words. Page and figure horizontal overflow
  measured zero in all four configurations.
- Reload restores returned state. Reset removes the computed result and leaves
  the committed prediction and listings; calling again recreates the result.
- Reset and prerequisite-link keyboard focus have visible 3 px theme outlines.
  Calling disables that button and the active element becomes `body`; a separate
  sequential keyboard check confirmed the next Tab reaches “Reset calls”, so
  navigation continues at the operation rather than restarting at the page top.
- The link reads “Module 1, lesson 2: Signed and unsigned readings” and keyboard
  activation reaches that numbered lesson. No browser page errors occurred.

Reproduction script: `/tmp/result-panel-independent-review.mjs`; observations:
`/tmp/result-panel-independent-review.json`; screenshots:
`/tmp/result-panel-review-{375,1280}-{light,dark}.png`. The separate sequential
focus check is `/tmp/result-panel-focus-check.mjs`. These are session artifacts,
not committed test coverage. Focused automated test results and full-suite
results are recorded by the implementation/checking session separately.

## Decision and limits

Keep the replacement. It removes the duplicated returned word and makes the
shared representation, two C values and bit contributions legible together. The
final visible route preserves the factual qualifications needed to distinguish
valid C wrapping from the trip's intended meaning. No blocking finding remains
for the reviewed result panel.

Different-return/fault and top-bit-zero cases were reviewed in source rather than
through this published trip example in the browser. Screen-reader testing and a
prerequisite-matched person's fresh explanation/application remain evidence
gaps. A useful formative check would ask a new learner to explain both readings
of a fresh negative result and whether the unsigned value itself proves a wrap.
No novice-learning validation is claimed.
