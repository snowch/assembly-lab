# Independent learner review: Arithmetic with four bits

Date: 4 November 2026. Reviewer: a separate Codex agent that did not draft or implement the
lesson. Model configuration reported by the managing session: `gpt-6.1-sol`, high effort,
following `docs/authoring.md`. This is an agent review and browser usability check, not a novice
study or evidence that a beginner has learned the material.

## Assessment

No material learner finding in the initial or final built page. No correction is requested
from this pass. The lesson supplies the steps needed to attempt its fresh subtraction without opening
an appendix or reading ahead. This judgement concerns the explanation and interaction; the
separate technical review checks the arithmetic implementation and sources.

The reviewer first read the actual built Reading hexadecimal and Signed and unsigned readings
pages, then the new page, and formed the initial assessment before reading the author's
`brief.md`. The front-page prerequisite details and all seven Fundamentals pages were also
checked in the browser. The learner assumed here knows those prerequisites and no later lesson.
Repository guidance read: `AGENTS.md`, `CLAUDE.md`, `docs/authoring.md`, `docs/style.md` and the
relevant visual-language rules.

## Mechanism, preparation and application

- **Addition is defined and demonstrated.** “Add both bits and the incoming carry, a bit passed
  left from the previous column” supplies the new term. The two binary sums explain what is
  kept and passed left. The four-column example then shows the incoming carry, input bits,
  retained bit and a concrete explanation after each reveal. It includes a carry passing
  through another column and stopping.
- **Keeping the available places is demonstrated separately.** “The boundary separates the
  four result bits from the extra carry” matches the visible boundary. The complete unsigned
  example shows why a fifth place can exist in the full sum while remaining outside the result.
  The instruction to discard it is adjacent to this figure.
- **Subtraction is defined and demonstrated before composition is requested.** “Invert every
  bit: change 0 to 1 and 1 to 0. Then add one” defines inversion locally. The original,
  inverted and opposite patterns remain visible together; the cancellation paragraph explains
  the added one. The addition below uses that same opposite as its second input, and its signed
  reading uses the positional weights already practised in the preceding lesson.
- **The fresh task practises the composition.** It asks for the opposite of the second input,
  then the retained result, and separately asks about the extra carry. The task specifies four
  binary digits. Its answers are not prefilled or shown by the earlier worked example. Wrong
  feedback directs the learner back to the relevant stage without supplying the requested
  patterns. The staged hints remain optional.

A smaller complete candidate for the first addition would be one column containing two set
bits. The prose already gives that case. The chosen four-column example earns its extra size
by making the passed carry visible as an input to the next column. A further preparatory
activity is unnecessary for this page's fresh task: the later figure explicitly connects
inversion, adding one and adding the resulting pattern to the first input. The cancellation
explanation makes the bridge causal rather than merely naming a procedure.

The three figures reduce distinct bookkeeping: carries across aligned columns, the boundary
of a fixed-width result, and the inversion-to-addition sequence. They keep the mechanism
visible on a phone. The amount of prose is proportionate; none of the required arithmetic
preparation is hidden behind an optional disclosure.

## First-use knowledge and discovery

No unexplained assumed knowledge was found beyond the published prerequisites and earlier
lessons. Binary digits and positional place values are in “Before you start”; hexadecimal,
set/clear and signed weights are in the two preceding pages. Carry and invert receive local
explanations. “Opposite” is immediately connected to adding a pattern that cancels the original.
The figures are explicitly “four-bit miniatures” rather than Arm registers.

The course plan visibly lists Arithmetic with four bits between Signed and unsigned readings
and Arithmetic on register bits, before either lesson is completed. Previous/next navigation
agrees with that order.

## Instruction and column distinction; next-page bridge

“Press Next column to reveal each calculation. Revealing a column does not execute another
instruction” accurately describes the interaction. The button remains Next column throughout,
and is disabled after the fourth reveal. Reset returns the hidden result and carries to the
initial state.

The new page ends “The next page applies this rule with 32 places. Its sub instruction
performs the subtraction as one instruction.” The actual Arithmetic on register bits page
begins “The same rule now uses 32 places. The sub instruction performs the subtraction as one
instruction.” Its figure starts before that subtraction with the inputs labelled. This is an
adequate bridge from a calculation revealed by column to one instruction operating on a
32-bit register. The reviewer did not infer separate instruction executions from the column
controls.

## Browser coverage and limits

Initial built site: `http://localhost:4173/assembly-lab/#/lesson/four-bit-arithmetic`, Chromium
through local Playwright, 375×900 and 1280×900. Both Light and Dark were selected explicitly;
computed body backgrounds were respectively `rgb(243, 246, 245)` and `rgb(16, 22, 21)`.
Document width equalled viewport width in all four combinations. Screenshots and rendered
text were inspected, including phone figures and the completed addition. No clipping or
unreadable bit alignment was found.

At all four viewport/theme combinations:

- Initial addition, every individual column reveal, completed addition and Reset were checked.
- Initial blank exercise, empty submission, incorrect submission and successful submission were
  checked. A successful submission passed all three checks.
- Clear work and its confirmation were used; blank inputs, no radio choice and the initial
  hint control returned.
- All five hint controls were exercised in order; the hint control disappeared after the fifth
  and returned to the first after Clear work. The fresh answer is intentionally omitted from
  this review.

The named prerequisites and next-page bridge were read from rendered pages. The next page's
complete activities were not re-audited in every viewport/theme. No repository build, automated
suite or implementation changes were run by this reviewer. One temporary browser harness failed
because it used an exact accessible name for Clear work despite the challenge title being
included; the corrected harness passed. A later persistence harness initially used a nonexistent
Playwright helper and was corrected; that failure is not evidence of a product defect.

## Final-build verification

After the manager reported the final build complete, a new Chromium context for each of
375×900/1280×900 × Light/Dark loaded the built page at the same URL. All four combinations
again had the expected actual body background and no document overflow. This final pass found
no material learner issue.

- The phone subtraction flow shows two downward connector arrows, with “Add one” horizontal
  and readable. Screenshot inspection in both themes confirms the flow from original to
  inverted to opposite. Computed arrow-glyph font size is 16px and its phone transform is a
  quarter turn; the parent remains unrotated. At desktop the glyphs are unrotated, point right,
  and the label remains readable in both themes. The correction does not conceal text at zero
  font size.
- The exercise now visibly says “Use four binary digits in each box.” It starts independently,
  with empty text inputs and no selected carry answer.
- All four column reveals, the disabled completed control and Reset were exercised again in
  every combination. The initial unknown state returned.
- A fresh independently calculated submission passed all three checks in every combination.
  Reload retained both four-digit inputs and the selected choice, and running the checks again
  still passed. Clear work → Cancel preserved the inputs. Clear work → Discard work removed
  both inputs and the selection, including after reload. These checks supersede the interrupted
  initial persistence attempt, which overlapped the rebuild and timed out waiting for the page.
- The internal width mode rename has no learner-facing term to inspect. Its final rendered
  width-boundary figure remains correct and readable in the reviewed screenshots; no claim
  about implementation semantics is made by this learner pass.

The full repository suite remains the manager's responsibility. No implementation files were
changed by this reviewer. Later source edits would require rechecking their affected states.
