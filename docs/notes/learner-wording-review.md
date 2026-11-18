# Learner wording and interface review

## Opening review

Baseline `6b20175`. The scope was the published course plan, all 80 lesson routes, and Where next. The course plan describes the actual prerequisites as reading short C functions with integer arguments, conditionals, loops and array subscripts, plus basic arithmetic and binary place values. The first lesson supplies register and instruction vocabulary. Earlier published lessons establish each later lesson’s terminology and examples. Three independent reading passes covered 27 early, 22 middle and 31 late lesson routes. The separate drafting pass used checked facts, the course’s learning-design skill and the original style guide. The available Codex model filled the separate roles. Learner and technical conclusions were checked against executable states, recorded listings and source.

The opening Chromium inventory loaded all 82 routes at 375 CSS pixels with dark preference and 1280 with light preference. It recorded 284 mounted figure identifiers and 57 challenge sections with no document-wide overflow. Reviewers read the displayed text, optional material, challenge hints and feedback and checked controls against their actual state. The middle walk additionally tried 20 prediction checks, 47 first steps and 20 starter checks. The late walk checked the four compiler runs, floating-point examples, supplied A64 division and archive contents. The physical Pi and learner understanding were outside the evidence collected.

The observable objective is to explain and apply the difference between source code, chosen instructions and values at a specified execution point. The reading pass looked for prerequisites before that task, a complete small example, independent application, prepared input and named next action. The interface pass looked for usable keyboard controls, enough room for code and output, and separate signals for rendering, execution, test feedback and lost storage. It kept the author-approved prerequisite disclosure with a more specific visible summary and kept prediction, hint and answer gates where they support an exercise.

## Findings and corrections

| Area | Evidence and decision |
| --- | --- |
| Course plan and first run | The plan’s visible lead described only “a little C”. It now names conditions, loops and arrays, arithmetic and binary place value. The approved detailed prerequisite disclosure and optional answer remain. The first addition names **Run the instruction**, the registers to compare and what the browser simulator shows. The tiny function uses the same control name and locates compiler options beside the optional metadata. Timing overlap remains background for an instruction-effects exercise. |
| Calls and arithmetic inputs | The trip experiment now names **See what happens**, **Delete the ret line** and **Next**. The elapsed-ticks question calls the values the first and later readings, with the wrap between them. The shift lesson states the defined scope of the recorded GCC behavior before the comparison. |
| Fixed presets and diagnostics | The condition figure offers fixed choices. The text now sends learners to **8 and 8** and **0xffffffff and 1**, then asks them to compare `cs` and `ge`. The assembled `mov` field names both exact inputs, and the diagnostic identifies the unsupported encoding for that specific form. The bit-test lesson separates the stepped `0x2a` run from the worked `0x28` comparison. Mask and field headings name the exercises shown. |
| Register, memory and product observations | Extension, multiplication and division prompts appear beside the appropriate steppers. The product comparison names `x2`, `x3` and `x4` after their respective instructions. The GCC quotient uses `umull` to keep the full product, then `lsr` in `x0`. The C division conditions are visible before use. An assembly-only listing’s disclosure names instructions. Recursive runs identify the fresh call and independently preset deepest stack. |
| Two prepared compiler changes | The edited trip and loop pages already contain `return charge;` and `i <= count`. Each now identifies the prepared text, prediction, **Run with these inputs**, **Next** through return, and exactly one edit in **Edit C text**. Learners compare returned `w0` and the instructions or final loop iteration. **Compile C** is the optional listing inspection route. **GCC response** leaves the explicit live-service and cached-state descriptions in the optional panel. |
| Saved learner work | A failed write for the lesson key preserved the latest edit in the mounted editor, but revisiting the route read the older durable record. The course-level storage wrapper retains pending edits and deletions in the current tab and displays when work is held there. It leaves the durable record available and the restart guard active. The compiler’s restore action now retains a swap-back copy of the exact previous source and input values under the same lesson slot. |
| A32 and floating point | The A32 syntax check names its prepared line and result explanation, and the essential recorded comparison stays visible. The average example uses its already-loaded inputs and readout. Floating-point edits name exact bits and readouts. The rounding page displays the exact stored value beside its short decimal display. The check accepts the Unicode minus used by the lesson. Recorded floating-point case directions name the real controls and both cast signs. |

The optional compiler records and model references remain for activities that do not use them. A confirmed earlier user decision keeps the detailed prerequisite list behind its own descriptive control. The optional explanations, gated answers, C-to-instruction associations and recorded output continue to support their respective exercises. Existing late-module shell procedures and pinned platform code were kept, with their evidence source inspected locally. The transfer-width and A64 division edge examples keep the existing prediction gates from the pacing review. Each gate opened when a prediction was submitted.

## Published route ledger

The counts below come from the opening page inventory. Figures can include a prediction-gated or collapsible view. Each lesson was read in published order and loaded in the opening browser sweep. The closing walkthroughs group shared interactions by control and model.

| Module | Routes | Figures | Challenges |
| --- | --- | ---: | ---: |
| meet-the-machine | `one-addition`, `adding-a-constant`, `tiny-function`, `returning-to-caller`, `subtraction-and-reuse`, `instructions-in-sequence`, `meet-the-machine` | 20 | 7 |
| registers-and-readings | `one-pattern-three-readings`, `same-bits-two-readings`, `four-bit-arithmetic`, `arithmetic-on-register-bits`, `constants-and-widths`, `building-constants`, `register-widths` | 27 | 4 |
| adding-and-the-flags | `adding-and-the-flags`, `flags-and-overflow`, `subtracting-and-the-tick-counter`, `subtraction-flags-and-negation` | 14 | 3 |
| logic-shifts-masks | `masks`, `reading-and-writing-fields`, `shifts`, `shifts-and-signed-division` | 22 | 5 |
| compare-and-branch | `compare-and-choose`, `conditions-and-boolean-results`, `branches`, `zero-and-threshold-branches`, `register-and-bit-branches` | 18 | 4 |
| loops | `counting-up`, `writing-an-upward-loop`, `counting-down`, `testing-before-and-after`, `stopping-when-work-ends` | 18 | 4 |
| loads-stores-widths | `memory-and-addresses`, `transfer-widths`, `loading-widths`, `extending-register-values` | 25 | 4 |
| arrays-strings-pointers | `array-addresses`, `traversing-arrays`, `zero-terminated-strings` | 19 | 4 |
| multiply-and-divide | `products-and-widths`, `widening-products`, `reading-product-halves`, `division-and-remainders`, `consumption-calculation`, `dividing-by-a-constant` | 27 | 4 |
| calls-and-the-stack | `calls-and-returns`, `preserving-values-across-calls`, `recursive-calls`, `making-recursive-progress` | 16 | 4 |
| from-c-to-assembly | `from-c-to-instructions`, `equivalent-trip-charge`, `change-c-calculation`, `cap-charge-in-c`, `compile-a-loop`, `write-assembly-loop`, `change-loop-boundary`, `repeated-shifts-in-c` | 14 | 4 |
| where-c-and-the-machine-disagree | `c-and-overflow`, `checked-arithmetic`, `checked-addition` | 18 | 4 |
| running-arm64-outside-assembly-lab | `from-function-to-executable`, `loading-and-startup`, `runtime-startup`, `debug-native-instructions`, `stepping-native-function`, `diagnosing-native-failure` | 17 | 2 |
| running-on-raspberry-pi-5 | `raspberry-pi-5`, `raspberry-pi-boot`, `capture-pi-boot`, `restore-pi-boot` | 3 | 0 |
| the-same-programs-on-32-bit-arm | `same-c-on-a32`, `a32-conditions`, `a32-constants`, `a32-division-helper` | 13 | 4 |
| twos-complement | `twos-complement` | 2 | 0 |
| c-integer-types | `c-integer-types` | 3 | 0 |
| floating-point | `floating-point-bits`, `floating-point-rounding`, `floating-point-arm`, `floating-point-conversions` | 8 | 0 |

## Closing verification

The closing inventory rendered the course plan, all 80 lesson routes and Where next at 320, 375, 820 and 1280 CSS pixels. The narrow runs used the dark theme and the wide runs used the light theme. The assembled lesson tree contains 283 figures and the same 57 challenges. The removed figure was the duplicate average-function listing. The sweep checked document width, route titles, headings and actual controls. It found no document overflow.

Independent keyboard walkthroughs examined these states in the built site:

- The first addition writes `w2 = 19` and keeps its inputs. Tiny functions run their addition and return on separate presses. In the trip experiment, the original function stops with `w0 = 232`. Removing `ret` reaches the following function and ends with `w0 = 147`.
- The two named comparison presets agree and disagree on `cs` and `ge` as described. The tick example’s wrap comparison uses its prepared readings. The code and instructions stay paired on the phone.
- The extension steppers expose the signed and unsigned readings of `0xf9`. The three product instructions write the low, unsigned high and signed high halves to `x2`, `x3` and `x4`. The division edge cases write `w2` for `sdiv` and `w3` for `udiv` and leave their input in `w0`. The constant-division stepper yields quotient `0x4d2`. Array instruction inspection, recursive stack steps and the independent deepest-stack preset also worked.
- The original C examples returned 31 and 12. The prepared changed examples returned 24 and 16. Their exact reverse edits returned 31 and 12. The original calculation’s independent fixed-charge edit returned 33, and the original loop’s inclusive endpoint returned 16. **Run with these inputs** opened the trace and **Next** reached the final verdict. Restoring and swapping preserved both source and input changes across reload. The walkthroughs ran the local compiler only.
- A failed target-key write left the new lesson answer usable across navigation in the same tab and kept the earlier durable value. A visible notice alerted the learner. A later successful write cleared the notice and survived reload. Unit checks also covered a failed removal and accepted external completion state.
- The visible A32 limit pair precedes the check. That check reports the assembler’s acceptance result with an explanation. The single average pair and separate A64 run show `w0 = 23` after the prepared 95/4 call returns. The floating-point bit changes preserve their distinct numeric and hexadecimal evidence, the lesson’s `−2` input is accepted, and the rounding midpoint and recorded selections match the checked results.

The first workspace-wide command mixed baseline modules with two newly added storage tests and failed those two tests. The exact candidate checks below use the synchronized source. After synchronizing the changed diagnostic assertions and prose records, the final focused run passed all 69 checks across six files. Separate focused A32 and disclosure checks passed all 31 checks across two files. The rebuilt site passed 152 targeted browser checks, 16 floating-point checks and both specific prerequisite checks across the phone and desktop projects. The repository’s full `npm run check`, GNU/QEMU differential, and native worksheet gates remain separately tracked in release CI. The browser walkthroughs used recorded native and Pi evidence. The hosted native check runs the emulators and verifies the Pi image layout.

The evidence establishes usable controls, reproducible results and retained work. Learner understanding and transfer to an unfamiliar problem remain unmeasured.
