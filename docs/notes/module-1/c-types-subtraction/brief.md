# C types and one subtraction

Copyright © 2026 Christopher Snow

## Checked facts and scope

- Outcome: compare two recorded C functions and explain why identical subtraction instructions and returned bits can represent different C results.
- Earlier preparation: Module 0 teaches operand order, argument/result registers, calls and return; the preceding Module 1 lessons teach unsigned/signed bit weights, two's complement, four-place arithmetic and the worked subtraction 3 − 5.
- Avoid repeating inversion, addition columns, a full function stepper or the old added-12 prediction. This is an application to C types.
- Compiler Explorer compiler `carm64g1610`, ARM64 GCC 16.1.0, options `-O1 -g`, returned both recordings on 5 November 2026. Requests and unmodified JSON responses are adjacent. Both functions compile to `sub w0, w0, w1` and `ret`.
- Compiler debug references associate both instructions with source line 4. Checked teaching associations use the return statement on line 3; preserve the original references in the recordings.
- Both argument and result types are 32-bit on this target. The `int` call with arguments 3 and 5 returns a representable negative number. It does not overflow.
- Unsigned C arithmetic wraps into its type's range. C23 draft N3096 §6.2.5p11 specifies arithmetic modulo 2^N and says unsigned computations cannot produce overflow. Avoid describing unsigned wrap as C undefined behaviour.
- C23 N3096 §6.5p5 makes an arithmetic expression whose result is outside its type's representable range undefined, unless a specific rule defines it (as for unsigned). Signed `int` addition, subtraction and multiplication outside range are not guaranteed to wrap or raise an error. No running signed undefined case may be presented as a C guarantee.
- Later `c-and-overflow` is the place for compiler optimisation consequences, not this short page. A local qualification must still precede generalising the shared instruction to all C arithmetic.
- Native differential corpus `module1-c-types` runs both recorded programs with the page's arguments. Recording/facts tests tie the displayed C, instructions and computed return readings to these sources.

## Interaction and evidence

- Show the two complete C functions before a prediction about whether GCC uses different instructions.
- After submission, show each complete numbered C beside its recorded instructions through the shared renderer.
- One explicit action runs both independent calls. Read their returned `w0` bits from the simulator and select the decimal reading according to the C result type.
- Comparison exposes the shared bit pattern and the two C results without replaying the prerequisite arithmetic method.
- Follow with concise local C wrap/overflow rules and a link to the later lesson. Do not add a compulsory exercise merely to repeat earlier assessments.
- Independent review must check gates, sources, C guarantees, phone/desktop light/dark, reset and restore. Agent review is not evidence from a novice study.

## Sources

- <https://www.open-std.org/jtc1/sc22/wg14/www/docs/n3096.pdf>, §§6.2.5p11 and 6.5p5, downloaded and read locally on 5 November 2026.
- <https://godbolt.org/api/compiler/carm64g1610/compile>, adjacent requests/responses.
- Repository `docs/sources.md`, `docs/style.md`, `docs/authoring.md`, `docs/visual-language.md` and `.agents/skills/learning-design/SKILL.md`.
