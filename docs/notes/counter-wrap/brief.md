# Counter-wrap bridge: checked facts and implementation brief

Copyright © 2026 Christopher Snow

The learner has already met four-bit unsigned arithmetic and subtraction. This bridge sits after the elapsed prediction has been committed and before the existing 32-bit counter ring. It makes the fixed-width boundary and forward tick count visible without asking the learner to imagine a carry falling out of a physical register.

- `fourBitAddition` runs the existing Arm ADD model and selects its low four result bits and fourth-column carry. The real model still has 32-bit registers.
- Repeatedly add one, selecting the four stored bits each time. Start at 14; take three ticks. No scripted list of output states.
- Show only the most recent completed addition. Its carry is outside the four stored bits. It is not labelled as an Arm C flag.
- The four-bit subtraction model runs SUB and selects its low four bits. It recovers elapsed ticks only for a normally advancing counter with fewer than sixteen ticks between readings. More complete turns cannot be recovered from two readings.
- Actual lesson code is unchanged and uses 32 bits. ADD preserves NZCV; ADDS updates them. The model's fourth-column carry must never be confused with an actual 32-bit C flag.
- Keep the original prediction gate and saved learner work. The bridge uses its own lesson-store slot. No animation, gate logic, machine semantics or platform files change.

The existing prose and ring explain the real counter and borrow. The new bridge adds a short local four-bit mechanism; it does not repeat the full ring's explanation or add a full-adder gate diagram. New learner strings are drafted separately in `copy.md` and their corresponding strings module.
