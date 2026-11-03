# Independent calculator powers review

Reviewed 3 November 2026 by an agent that did not write the implementation, copy or tests.
The reviewer changed only this note. No commit was made.

Scope: the approved `^` extension to the optional typed-arithmetic calculator, its short inline
guidance and dedicated negative-power feedback. Read `CLAUDE.md`, `docs/style.md`,
`powers-copy.md`, the current implementation and test diff, `Calculator.tsx`, calculator CSS,
the shared answer placement, the lesson prose and prerequisite panel. The existing calculator
review is historical evidence, not verification of this extension.

## Learner and interaction pass

No finding remains. “Write powers as `2^8`, with a non-negative whole number after `^`” puts the
notation beside the input without giving its result. The allowed-character list includes `^`;
the example and operator tokens render as code without visible Markdown. “Use a non-negative
whole number after ^.” gives a recoverable instruction for a negative exponent. The existing
division restriction remains visible. The help still asks for the learner's own calculation;
no expression is prefilled, no exercise answer is exposed, and the result is labelled “Result”.

Both closing style passes were applied separately. The sentence pass found direct, ordinary
wording and no filler or redundant explanation. The idea pass found a local notation example,
a clear restriction and feedback consistent with it. The extra sentence fits the disclosure at
both widths; controls and result remain readable in both actual themes.

Assumed knowledge checked: the prerequisite panel requires “a little C, basic arithmetic and an
understanding of binary numbers”. Decimal arithmetic and ordinary powers fit that stated
arithmetic prerequisite; the unfamiliar calculator spelling `^` is explicitly demonstrated.
Signed and unsigned weights have already been taught on this page. This change introduces no
compiler setting, external tool, assembly convention or unexplained course term. It does not
require the learner to understand parser limits, exponentiation algorithms or BigInt.

## Technical pass

No finding remains. `power` starts with an atom and takes a unary expression to its right;
`unary` delegates to `power` after consuming signs. This gives powers precedence over unary
minus and multiplication, with right association. Parentheses select an explicit grouping.
Independent probes distinguished `-3^2` from `(-3)^2`, and `2^2^3` from `(2^2)^3`.

Arithmetic stays in BigInt until decimal-string output. Negative evaluated exponents return
`negativePower`; fractional division inside an exponent returns `fraction`, and zero division
returns `zeroDivision`. Malformed or incomplete power syntax returns `invalid`. Zero exponents,
including `0^0`, produce one; this is a calculator convention rather than a claim about an Arm
instruction. Limits also apply to bases zero and one when an exponent exceeds the supported cap.

The 200-character source limit bounds tokens, literals and recursive descent. A source literal
cannot approach the magnitude cap within that length. Unary signs and exact division cannot
increase magnitude. Addition, subtraction, multiplication and each required repeated-squaring
multiplication check the 16384-bit magnitude cap; the exponent is checked against 4096 before
iteration. Multiplication can transiently allocate at most roughly twice the bounded operand
bit width, rather than materialising an arbitrary power. Results rejected at an intermediate
step are not later rescued by division or cancellation, as intended by the intermediate bound.

Independent Node probes passed 37 directed cases plus 247 base/exponent pairs checked against
native BigInt powers. Cases cover signs, grouping, arithmetic precedence, exact exponent
division, comma notation, Unicode minus, zero, negative exponents, malformed syntax, the exponent
limit, both signs near the magnitude boundary, and maximum-length signs/parentheses. A repeated
large-power rejection probe completed 1000 calls in about 31 ms on this environment; that is a
sanity check, not a browser performance guarantee. The first probe command exited 1 because its
review oracle incorrectly expected `4^4096` to exceed the magnitude cap. It is 8193 bits and was
correctly accepted. The corrected boundary case `16^4096` is 16385 bits and was rejected. No
application or repository test was changed to accommodate that reviewer error.

The component takes no exercise answer or answer callback. Enter prevents default and stops
propagation; Calculate has `type="button"`. Input changes clear stale results and invalid state.
No component or lesson wiring change is needed for powers. Both mounted uses were inspected.

## Browser evidence

Independently drove the final production build in Chromium at
`http://localhost:4173/assembly-lab/#/lesson/same-bits-two-readings`, with fresh contexts at 375 ×
812 and 1280 × 800, in light and dark themes. Verified `html[data-theme]` and computed foreground
and background colours, rather than relying on the preference alone. Every combination passed:

- Both calculators start closed, and first opening has empty input and no result. Guidance
  matches the source and its seven notation spans render as code.
- Both placements calculate powers beyond Number's exact range, negative-power feedback,
  excessive-power feedback, recovery, unary precedence and right association.
- Enter retains input focus and does not submit the task or run challenge tests. Tab reaches
  Calculate, and keyboard activation computes. Enter and Space toggle the disclosure; closing
  and reopening preserves each calculator's own work.
- Transfer answer fields remain empty, no transfer feedback appears, and a sentinel value in
  the final answer field remains unchanged. Challenge status stays “No tests run yet”.
- Editing clears the stale result immediately. Negative errors set `aria-invalid`; successful
  recovery clears it. A maximum supported power result wraps without panel or page overflow.
- Page scroll width equals its viewport width at 375 and 1280 pixels. Both inputs are 44 pixels
  tall, with visible theme-appropriate focus outlines and readable text. Phone buttons wrap
  below the input; desktop controls share a row. No console or page errors occurred.

Visually inspected twelve screenshots: both placements after recovery in all four combinations,
plus negative-power feedback in the final placement in all four. All show legible input/help,
correct rendered themes, intact panel boundaries and no clipped controls. Executable probes,
sixteen captured screenshots and the browser record are local artifacts under
`/tmp/powers-review/`; the browser record is `browser-records.json`.

## Evidence limits

This review independently ran the directed Node probes and the four-context browser script.
The changed automated tests were read. The managing session separately reports 38 focused unit
and component tests, strict TypeScript, production build and four calculator browser regression
cases passing; those commands were not rerun by this reviewer. Full-suite and CI outcomes belong
in `powers-verification.md` after completion. This pass does not claim a full-course browser
review, screen-reader testing, non-Chromium coverage or a physical phone test.
