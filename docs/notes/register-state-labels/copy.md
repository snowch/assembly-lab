# Shared state labels

Approved by the user and checked by a separate GPT-6.1 drafting pass at Medium effort.
The shared implementation uses the selected view of the model trace, not an independent counter.

- No completed instruction: Before the first instruction
- After a completed instruction: After `INSTRUCTION`
- After the run returns: Final values

INSTRUCTION is the actual last completed instruction, rendered as code. Faults, step limits and
intentional partial traces retain the After label; the existing execution status explains the stop.
An initial fault retains Before the first instruction because no instruction completed.

Existing contextual labels remain where they describe different data: Before the instruction on a
fixed primitive input bank, and Before the call at the caller walkthrough's local start after hidden
setup. Recorded output retains its recording and stop labels. Static bits and schematics have no
execution moment.
