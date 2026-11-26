<!-- Copyright © 2026 Christopher Snow -->

# Inputs and the four-bit limit

The reader asked the minimum/maximum for a and b, how width limits them, and what happens beyond the limit. They confirmed that 100 meant decimal and identified this as a teaching gap. The current four-example pane says unsigned four-bit teaching views without explicitly giving the representable range. Clarify that range locally. The user subsequently authorised the earlier decimal-truncation section and targeted course experimentation; that broader scope is recorded in ../limits-and-experiments/brief.md. This note describes only the local clarification.

Both unsigned inputs have four places and sixteen patterns, from0000 to1111, representing0 through15. These are representable bounds, not just the selected examples. The page prepares independent examples with b8 and a6/7/8/9; it offers no numeric input controls. The helper deliberately rejects values exceeding15 to avoid silently changing its supplied inputs. Only result-bit retention is described as wrapping. The actual instruction still uses32 bits and can represent16 or100 normally.

Use the model view's explicit unsigned minimum zero and computed width mask as maximum. Its existing range and bit formatting provide the pattern count/endpoints. Pin the exposed bounds in the existing four-/32-bit model fact test. No arithmetic, programme, native corpus, gate, control, storage key or CSS changes are needed. Keep the four workings and bold carry comparison rules intact. The prior binary place-value and fixed-width lessons supply prerequisites; no new learner action or assessment is added here.

Separate drafting supplied the replacement setup. Read the joined setup, workings, carry reasoning and real-width bridge in the sentence/idea passes. Independent learner and technical reviews check width scope, wording, wrapping, absence of implied input controls and saved-work preservation in both themes on phone/desktop. Focused and full verification, then exact live revision, are recorded separately from any evidence of novice learning effectiveness. No novice study is claimed.
