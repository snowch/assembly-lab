# C first: supporting copy draft

Copyright © 2026 Christopher Snow

Separate drafting pass from `brief.md`, the current counter strings and `docs/style.md`. This pass changes no implementation. The selected result sentence and C-rule bullets are the user's approved wording; supporting text must not alter them.

## User-selected explanation

> Subtracting one from zero goes below the unsigned range. Keeping only four result bits gives 1111 (15 unsigned).

> This four-bit model follows the Arm subs rule:

- C=0, Borrow needed, unsigned subtraction went below zero.
- C=1, No borrow needed, unsigned subtraction stayed at or above zero.

The implementation should supply width, result pattern and unsigned reading from the model. Format instruction names, flag values and bit patterns as code while preserving the selected words. Show the below-zero sentence only for the boundary case, and keep the two rule bullets together below the current-state sentence.

## Supporting draft

| Purpose | Draft |
| --- | --- |
| Result label | C after subs |
| Optional title | Optional: subtract one and inspect C |
| Optional instruction | Press −1 once from zero. Inspect C after subs and the stored reading. Keep pressing to count down through further wraps. Reset starts this counter at zero. |
| Normal decrement, with model parameters | Subtracting one stays within the unsigned range. Keeping only {width} result bits gives `{pattern}` ({stored} unsigned). |
| Model and architecture note | C is calculated for this four-bit model. Real `subs` uses 32- or 64-bit registers; plain `sub` preserves the processor’s flags. |
| Fresh/Reset note, retained | The dash means no subtraction is shown yet. |
| Step status | Subtracted one. Stored reading: {stored}. C after subs: {c}. |
| Initial status, if separately needed | Stored reading: {stored}. C after subs: not yet shown. |

The normal-decrement sentence follows the selected boundary sentence's structure but describes a result that remains within the unsigned range. It must receive the currently computed pattern and reading, rather than reuse the boundary result. The rule bullets explain C's interpretation; the sentence does not repeat an additional inverse borrow indicator.

## Closing passes

Sentence pass: the control names match the interface; the displayed and announced quantity is C directly; the dash identifies the absence of a shown operation. The architecture note distinguishes calculated four-bit teaching output from real instruction-width flag updates and plain `sub`'s preserved flags.

Idea pass: the zero boundary explains retained result bits without a physical loan, while ordinary decrements get a separate accurate sentence. The two fixed C-rule bullets describe the unsigned comparison consistently. Optionality, independent state and the elapsed-time lesson's required route remain unchanged.

This is a wording draft based on the checked facts supplied in the brief. The current display mapping, browser layout, status consistency and all sixteen decrement cases still require implementation verification and independent reviews. No new functional checks or novice learning study were performed in this drafting pass.

## Implementation alignment

The selected sentence and C-rule bullets are kept verbatim in rendered form, substituting width, bits and unsigned result from the model. The optional introduction now names subs alongside its ALU subtraction explanation so that its instruction matches the primary flag label; the architecture note explicitly distinguishes plain sub. Normal decrement feedback has the same computed pattern/reading structure as the wrap feedback, keeping both explanation and layout consistent. No physical extra position or lending source is claimed.

## Control placement

The optional action row sits directly below the bits/trace and above the result interpretation. The selected sentence, model qualifier and bullets remain together below that row. This keeps controls below the display, adjacent to the quantity they change, and stationary without reserving a large empty feedback block. The main forward layout is unchanged. Final browser checks must verify this decision rather than relying on this rationale.
