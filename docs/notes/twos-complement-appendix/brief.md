# Clearer signed readings and Appendix B

31 October 2026. User found the signed-weight passage unclear and requested
consideration of a more detailed appendix. Implement a clearer required
explanation and a directly linked optional appendix, following the standing
merge-after-green instruction. No saved-work migration is required.

Prior knowledge for both pages: binary digits, hexadecimal, 32-bit register
views and simple addition/subtraction. Appendix B is accessible directly from
Module 1; do not assume the intervening course has been read.

Checked facts and sources:

- C23 draft N3096 6.2.6.2p2/p6 defines the negative sign-bit weight and names
  two’s complement. Primary PDF/extraction checked in the previous change,
  `/tmp/twos-n3096.pdf` and `/tmp/twos-n3096.txt`; existing source record is
  `docs/notes/twos-complement/brief.md`.
- A set bit contributes its positional weight; a clear bit contributes zero.
  In an unsigned reading all weights are positive. In two’s complement only
  the highest weight is negative. Changing the reading does not alter bits.
- Four bits are a smaller explanatory pattern, not an Arm register width.
  Right to left positive weights: 1, 2, 4, 8; signed highest weight −8.
  Use initial pattern `1010`: unsigned 10, signed −6. Same lower bits;
  top bit contributes +8 or −8. Four-bit unsigned range 0..15 and signed
  range −8..7, one zero, one more negative than positive value.
- Invert `1010` to `0101`, then add one: `0110`, signed 6. At fixed four-bit
  width, negating zero discards the extra left bit and keeps zero. Negating
  the smallest signed pattern keeps the same bits; positive 8 does not fit
  signed four bits. Show these computed outcomes when explored, not as a
  new challenge whose answer is pre-disclosed.
- Model implementation must derive readings using existing simulator-backed
  `readingsOfPattern`, zero-padding or repeating the input top bit to 32 bits.
  Compute inversion/addition in a model helper; verify every four-bit input
  against actual model negation/subtraction at 32 bits, retaining low bits.
  No four-bit CPU or invented instruction execution should be implied.
- The existing 32-bit figure starts `0xfffffff4`, unsigned 4294967284/signed
  −12. Weights are +2147483648/−2147483648 for bit 31 and identical below.
  Preserve the Make −1 success gate; the appendix may contain worked
  representation examples but must not replace essential visible guidance.

Design: clarify the main text by identifying unsigned place values explicitly,
then changing only the top weight for signed interpretation. Point to the
existing computed diagram and link Appendix B. Avoid another full activity
on the main page. The appendix has four-bit bit/weight cells and computed
signed/unsigned sums, then a separate clearly introduced fixed-width negation
exploration. Finish with the 32-bit connection, ranges and return link. Use
the existing page/figure/theme/accessibility conventions, without a new
dependency or edits to platform/. No extra repetitive closing quiz.

Write learner strings in a separate draft from these facts, under
`docs/style.md` and `docs/visual-language.md`. Root implements; independent
learner (GPT-6.1 sol High) and technical (Extra High) reviewers inspect final
phone/desktop builds in both themes. Tests must cover all four-bit patterns,
limits/zero, controls/reset/restoration, links, plan/offline discovery and
the existing answer gates. Keep canonical prose synchronised.
