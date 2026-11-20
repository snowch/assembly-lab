# Explained instruction forms

Copyright © 2026 Christopher Snow

## Outcome and learner preparation

A programmer can choose the relevant instruction form, predict its local effect from a prepared example and diagnose a rejected operand. Prerequisites are the front page and the lessons before the current exercise. Optional advanced reference material does not become required exercise knowledge. Follow docs/style.md, CLAUDE.md and the local learning-design workflow.

## Checked facts

- The existing browser reference covers83 mnemonics and100 parser/GNU/QEMU-checked snippets, but many distinct syntax forms share dense rules and no initial/result values.
- ADD immediate magnitude is0–4095 or a multipleof4096 through16773120; explicit lsl#12 takes the12-bit value. 4096 encodes,4097 does not;4294966296 fits32 unsigned bits but cannot be encoded by this form.
- Machine run traces expose per-instruction register writes, flags, memory and next PC. stateAfter reconstructs state through an inclusive step index; the before state uses the preceding index.
- Existing catalog rules and official links remain the authority for supported syntax. Exercise allow-lists, learner artifacts, predictions, hints and solutions must stay independent of reference examples.
- Advanced SP/extension forms need local definitions but should not obscure plain register or immediate forms.

## Route and misconception checks

Reference entry → named form and syntax → essential operand rule → prepared before state → one actual instruction → computed after state → explanation → common rejected operand. Each example starts independently. Show flags and memory only where relevant. State the prepared nature of inputs, distinguish register capacity from immediate encoding and never suggest an instruction disallowed by the exercise as its solution.

## Verification

Every displayed valid instruction must have a runnable model scenario and GNU/QEMU corpus coverage. Every rejection must be checked against assembler diagnostics and GNU where supported. Cover every declared form, not only every mnemonic. Check phone/desktop, actual light/dark, keyboard/focus, saved source, form-targeted error help and absence of answer leakage. Separate drafting and independent learner/technical review are mandatory. Record initial failures separately; automated checks do not establish learning effectiveness.
