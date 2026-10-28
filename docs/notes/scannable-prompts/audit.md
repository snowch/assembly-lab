# Exercise prompt audit

Copyright © 2026 Christopher Snow

All 34 published lessons were read for exercise, prediction and task setup. The drafting pass
used GPT-6.1 Sol at Medium effort, from the checked brief and the existing lesson text. Both
passes of `docs/style.md` were applied. Changes preserve values, register order, widths,
signedness, timing, preconditions and source contracts. Instructions that run in sequence remain
ordered in prose; independent inputs use Markdown bullets. Questions remain after their inputs.
Canonical prose records were synchronised with every changed string.

| Lesson | Decision |
| --- | --- |
| One addition | List the three starting registers; keep the instruction and result question separate. The worked figure already shows its inputs. |
| Adding a constant | List the two starting registers before the fresh-instruction question. |
| A tiny function | List each fresh argument with its incoming register; retain addition, return and the return-time question. |
| Returning to the caller | List the fresh starting registers; retain the caller/function sequence and both requested moments. |
| Subtraction and reuse | List the two starting registers before the subtraction question. Preserve the requested result-register order. |
| Instructions in sequence | List three starting registers; retain the explicit addition-then-subtraction order and final-state question. |
| Meet the machine | List four incoming argument/register roles. The repair task already lists its inputs; leave it and the compact call-based trace task unchanged. |
| One pattern, three readings | Retain the single starting pattern, compact pattern-selection task and labelled answer fields. No dense parallel register contract. |
| Constants and widths | Retain existing figures and code sequences. The construction has one required value; sequence order is essential to the final prediction. |
| Adding and the flags | List the three `sum_flags` starting registers. The three independent addition cases are already listed. |
| Subtracting and the tick counter | List the prediction readings, function's incoming registers and fresh reflection readings. Separate reflection inputs from the takeaway list with a setup sentence. Keep counter assumptions and wrap qualifications. |
| Masks | List the planning inputs and incoming function arguments. Retain the explicit fresh-start rule for each independent trace instruction. |
| Shifts | List the three separate comparison operations and type-based instruction choices. State that each operation uses its original input; preserve signed decimal answers and rounding guidance. |
| Compare and choose | List incoming arguments and fresh comparison registers in the challenge and reflection. Separate reflection inputs from the takeaway list. Retain compare order and signed/unsigned conditions. |
| Branches | List incoming function arguments. Keep the existing ordered outcome rules and compact single-input branch predictions. |
| Counting up | List the three incoming arguments and three independent final calls. Keep unsigned endpoint rules and executed-instruction counting guidance. |
| Counting down | List incoming arguments in both construction contracts. Keep decrement/branch sequence and zero-count behaviour in prose. |
| Memory and addresses | List store and copy input roles and the failure experiment's memory/register inputs. Keep byte order, widths, neighbouring-byte preservation and return timing. |
| Loading widths | List gradient/correction inputs, failure inputs and four requested output registers. Retain the existing memory-field list and load-order warning. |
| Array addresses | List prediction registers and incoming array/index or array/count roles. Preserve valid-index, zero-count and readable-memory conditions. |
| Zero-terminated strings | List prepared prediction bytes/capacity and incoming array/capacity and label/marker contracts. Preserve terminator, zero-capacity, bounded-read and unchanged-memory requirements. |
| Products and widths | List prediction inputs and three multiply-accumulate input roles. Keep the compact two-register shared-width wide-product contract. |
| Division and remainders | List prediction operands and incoming remainder/consumption roles. Keep divisor restrictions, full-product requirement and zero-distance rule. |
| Calls and returns | List report prediction inputs and final distance/reserve input roles. Retain helper clobbers and preservation requirements beside the contract. The first construction has one incoming argument. |
| Recursive calls | Retain single-input predictions and tasks. The recursive sequence and preservation requirements do not form a dense starting-state list. |
| From C to instructions | List prediction values and assembly input/register roles. Keep the compact named C parameters and calculation sequence in the final task. |
| Compile a loop | List count/rate prediction values and incoming register roles. Retain unsigned loop semantics, zero count and repeated-single-shift requirement. |
| C and overflow | Retain single-input construction, prediction and final task. Comparisons, addition order and signed-limit qualifications remain beside them. |
| Checked arithmetic | List distance, adjustment and result-slot roles. Retain store-before-report order, following-byte preservation and low-result-bit qualification. Other tasks have one input. |
| From function to executable | List four caller-supplied prediction values and final input roles. Keep startup-before-call order and external-tool steps. |
| Debug native instructions | List four breakpoint inputs and revised function roles. Keep low-32-bit scope, one-step prediction, source/build/debug sequence and revised-caller requirements. |
| Raspberry Pi 5 | Retain the existing parts list, wiring figure and ordered preparation commands. No dense arithmetic exercise setup. |
| Raspberry Pi boot | Retain the ordered build/boot/change/restore workflow and existing diagnostic list. Unordered bullets would obscure timing. |
| Same C on A32 | List the final average inputs and four requested final fields; preserve opening the recordings before running the average. Retain the compact prediction pair and recorded-listing identification task, with A32/A64 execution limits. |

This record covers source drafting and canonical synchronisation. Integration tests and independent
learner/technical checks, including browser widths and themes, are recorded separately.
