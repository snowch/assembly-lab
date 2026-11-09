# Upper-half doubling explanation

The user approved the proposed wording and arrows in the conversation and requested implementation and merge. Replace the opening explanation under Find the two halves in Building a constant; retain the worked 2/3 decomposition, calculator procedure and exercise gate. Use worth instead of weight locally, show the repeated-doubling sequence, and identify the value of the upper half rather than an arbitrary set bit in it. Label the arrows double each time. No new interactive or bit picker is requested.

Outcome: explain why an upper-half value contributes groups of 65536 before using the existing decomposition procedure. Earlier binary place-value and two-half preparation remains the prerequisite. The full worked example and independent Build 1000000 exercise remain the supported and fresh application; do not expose its solution.

Checked model probe: starting with mov w0,1 and repeatedly adding w0 to itself produces 1,2,4 at bit positions 0,1,2; 16384,32768,65536,131072 at positions 14,15,16,17. The existing worked MOVK listing produces 131075 from upper 2/lower 3. The existing facts guard must pin the newly displayed numbers via those model states rather than merely permitting unsupported literals. Arrows mean doubling, not a single machine step; the ellipsis omits intermediate doublings. No ISA claim or machine instruction changes.

Apply docs/style.md and local learning-design. Obtain a separate minimal copy pass, then independent whole-lesson reader and technical checks. Inspect actual phone/desktop, light/dark, line wrapping and arrow readability, and preserve the calculator and answer gate. Record source/model vs browser evidence and limits; agent reviews are not a novice study. Run appropriate existing canonical, numeric, term and instruction checks; required CI and exact merge/deployment/public verification complete the task.

## User refinement during CI

The user asked whether 65536 is the common factor of the upper-bit values, then asked to explain that to readers. Add the causal connection in plain language: each upper-half bit contributes a multiple of 65536; that half counts whole groups of 65536. The lower half contributes less than one group. Dividing a non-negative whole value by 65536 and keeping the whole-number part therefore finds the upper-half value; the amount left over belongs in the lower half. Keep the approved worth/arrows text and avoid a new GCD/LCD vocabulary detour. Existing calculator procedure already teaches this whole-number division; connect the reason to that procedure without duplicating all steps.

Extend the independent model check through all 32 unsigned bit positions if needed to pin the general multiple-of-65536 claim. Bit values in the learner text and the worked example stay unchanged. Recheck the final revision independently; superseded-head CI is not final evidence.
