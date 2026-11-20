# UI copy drafting pass

Copyright © 2026 Christopher Snow

## Facts and preparation

Drafted separately from the implementation using the checked brief, the existing reference labels, the shared guide types and docs/style.md. The learner is a programmer with the course's stated prerequisites and earlier lessons.

- Every valid worked example starts from its own supplied state. The model runs preparation before the displayed instruction.
- Before and after values describe that one displayed instruction, not a cumulative sequence of reference examples.
- Reference examples do not edit the learner's code or read exercise solutions.
- The reference can open because of an assembler diagnostic. It identifies a relevant rule without changing the diagnostic's words.
- A register's storage capacity and an instruction's immediate encoding are separate restrictions. ADD cannot encode every value that fits in32bits.
- Form-specific instruction rules, examples and common mistakes are drafted in the family guide files. These labels do not substitute for those explanations.

## Wording decisions

“Before”, “Instruction” and “After this instruction” name the observation moments. “Worked example” distinguishes supplied demonstration from the learner's exercise. The prepared-values note states automatic preparation and source isolation in two sentences.

“Accepted” and “Rejected” label assembler acceptance. They do not claim that arbitrary operands, addresses or calling contexts are valid. The model-backed scenario supplies the context needed for valid examples.

“Advanced forms” and “Additional operand rules” identify optional material. Essential rules and the relevant error explanation must remain visible in the selected form.

“Help for the assembler error” explains why the drawer opens. The diagnostic wrapper accepts the machine's complete message without rewriting it or adding a guessed operand limit. It must be rendered with the existing code-aware text treatment when the supplied sentence contains code formatting.

The capacity note defines immediate locally and names the actual instruction supplied by the renderer, in uppercase. It applies to add, adds, sub and subs without implying that their register width is always32bits. It includes no exercise solution, workaround or result value.

“Signed decimal”, “Unsigned decimal” and “Hexadecimal” identify how each snapshot value is read. “Contents at [symbol] ([count] bytes)” names the stored memory range; “Address of [symbol]” names its location. Both receive their symbol and byte count from the model-backed scenario. The byte label handles singular and plural counts. No numeric result is embedded in the UI strings.

“More worked examples” names an optional group of additional independent examples, following the visible first worked example.

The optional “Complete example program” disclosure provides the supplied preparation, the highlighted instruction and the finishing code. Its note connects that highlighted instruction to the short example above. It describes what the program contains without implying that opening the disclosure executes it or edits the learner's code.

“Branch taken” and “Branch not taken” label the actual model observation. The adjacent computed program-counter row identifies the location reached; the optional complete program defines branch labels used by the short instruction.

## Verification scope

Prettier checks these strings. Independent technical review must check the claims against the model and sources; independent learner review must inspect the built reference and its information order. No browser or learner-effectiveness evidence is claimed by this drafting pass.
