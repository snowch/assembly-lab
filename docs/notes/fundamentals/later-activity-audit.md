# Later-lesson hidden-activity audit

2026-10-23. Independent source review of all 25 registered lessons beyond Module 0. Question: does another core activity disappear behind an unadvertised sequential activity pager, after which prose assumes it was completed?

## Result and limits

No further instance of that specific defect confirmed. In baseline commit `4177a75`, the changing `PrimitiveOperation` activity sequence was unique to Module 0: `stageIndex`, `data.stages[stageIndex]`, and the completion-dependent next-activity control lived in `packages/views/src/interactives/PrimitiveOperation.tsx`. These historical pager references describe the baseline under audit; the Fundamentals implementation removes that pager. Later incrementing controls advance an instruction, arithmetic column or recorded machine stop, rather than silently introducing a new curriculum task.

This is a source and lesson-definition audit, not a novice study or a claim that the whole course is optimally paced. Inventory loaded the complete registered lesson objects through Vite SSR; reviewed later interactive props, component selection/state code, section prose, optional section details and prerequisite references. No application changes, rebuild, full test run or commit performed. The baseline built preview became available at `http://127.0.0.1:4322/assembly-lab/` before the Fundamentals rebuild. Representative browser checks below cover the actual named selectors at 375/1280 in explicit light/dark themes. Other later lessons remain source-reviewed, not fully browser-tested. Older course-load screenshots are not substituted for current evidence.

## Representative baseline browser checks

Fresh browser contexts at 375 × 900 and 1280 × 900, each explicitly selecting Light or Dark in the real Theme control; `html[data-theme]` confirmed the requested theme. Used normal prediction radio/check controls to unlock the experiment. No stored-state injection or challenge solutions supplied.

- **Masks:** all three named chips appear together; they wrap to two rows on the phone. Selected each of `warn_fuel`, `clear_door`, `toggle_lights`; its `aria-pressed` became true and the associated instruction/rule changed. No completion-dependent Next activity prerequisite.
- **Loading widths:** visible “Instruction to compare” label, select chevron, “Inspect C and instructions” disclosure and separately labelled Next instruction status. Enumerated and selected all six options after one instruction; each kept `data-k=1` and status named the newly selected load followed by `ret`. This is an aligned comparison, not a secret next lesson.
- **Array addresses:** same visible comparison affordance; selected offset/pre-index/post-index after one instruction. All three retained `data-k=1`; status identified the chosen addressing instruction. Phone memory elements stack vertically, while desktop displays two columns.

Captured screenshots under `/tmp/hidden-activity-audit/` (three experiments × four size/theme contexts, plus four selector-focused mask screenshots), with DOM/control logs `/tmp/hidden-activity-audit-browser.log` and `/tmp/hidden-switch.log`. Inspected representative screenshots directly, including phone dark load comparison, phone light array comparison, phone dark mask controls and desktop light/dark examples. The default select exposes its other options on opening, as expected; it does not show every option simultaneously. No equivalent hidden sequential core activity was found. Counting-down and native lesson routes also loaded at these sizes/themes, but were not exhaustively unlocked or operated; their keep decisions above rely on source evidence.

## Challenged findings / keep-reject ledger

| Candidate | Evidence and decision | Direction |
| --- | --- | --- |
| Masks hides two other operations | Rejected as equivalent defect. `BitOpsFigure.tsx` maps all `data.functions` into visible named chips. `masks.ts`, `mask-bits` names `warn_fuel`, `clear_door`, `toggle_lights`; `masks.prose.ts` investigation separately defines AND, OR and Exclusive OR before requesting instruction choice: “The figure combines a word and a mask with the instruction you choose.” | Keep named experiment; no new chapter justified by hiding. Browser confirmed all three chips visible at 375/1280, light/dark. |
| Six load operations replace each other | Rejected as silent curriculum progression. `MemoryStepper.tsx:202` labels the select “Instruction to compare”; options are `ldrb w0: unsigned byte`, `ldrsb w0: signed byte`, `ldrh w0: unsigned halfword`, `ldrsh w0: signed halfword`, `ldrsw x0: signed word`, `ldrsb x0: signed byte`. `loading-widths.prose.ts` says “Choose a load in the comparison, then press Next. Switch between `ldrb w0` and `ldrsb w0` to compare the same byte at the same step.” All remaining register extensions have their own later figures. | Keep one comparison; browser confirmed labelled select and all six selectable options at 375/1280, light/dark. |
| Three pointer-update mechanisms replace each other | Rejected as silent progression. `array-addresses.ts:158` supplies offset/pre-index/post-index names. Prose explicitly says “Press Next in the comparison, then choose another addressing form. The view keeps the same instruction step” and defines all three forms visibly. | Keep explicit comparison. |
| C and instructions hidden under optional source detail | Rejected as missing core activity. Only comparison-mode MemoryStepper uses “Inspect C and instructions”; the chosen comparison, next instruction, address/register/memory effects remain outside that detail. It changes information density within a named experiment, not the available learning tasks. | Keep source inspection; don't generalise this into permission to hide whole lessons. |
| Loops hide other calls/programs behind Next | Rejected. `LoopFigure.tsx:75` renders every named run as a button and all run bars together. `counting-up.ts` has three labelled `dim_up` inputs. `counting-down.ts` separately embeds `dim_down`, `dim_do`, and `dim_down_wrong` figures with their own section prose. | Keep instruction Next and explicit fixed-call selectors. |
| Signed division rounds differently in another hidden task | Rejected. `shifts.ts:155` supplies visible `div2(-7)` and `div2(7)` call buttons; WordStepper maps both labels. Same function, different inputs. | Keep comparison. |
| Learner's solution / test-case selectors hide required instruction teaching | Rejected. SolutionStepper and SelectStepper inspect the learner's actual prior challenge artifact and render named calls/cases. Success/attempt gates deliberately withhold feedback, not an independent prerequisite lesson. | Keep answer gates. |
| Compiler Playground hides a second curriculum mode | Rejected. Local source editing, compile/run and instruction stepping are the core visible task. Optional GCC comparison is explicitly introduced as a comparison with Compiler Explorer, not required to run local exercises (`from-c-to-instructions.prose.ts`). | Keep explicit optional comparison. |
| Native startup stages are another activity pager | Rejected. NativeFigure renders pipeline stages as an ordered list; startup stops as named buttons; diagrams render named selectable nodes. Native prose explicitly requests “Select each stop to compare the program counter, stack pointer and stored result.” GDB Next steps a labelled recording. | Keep recorded machine inspection. |
| Later lesson assumes optional Module 2 `cmn` was seen | No required prerequisite defect: `compare-and-choose.prose.ts:23` says “Module 2's `add_overflows` used it,” but first repeats the complete rule: “`cmn w0, w1` sets the flags as `adds` would … with no result.” `vs` is likewise defined in its condition reference rather than only referred back. | Optional editorial improvement: replace recollection wording with a neutral cross-reference. Not grounds for splitting a lesson. |
| Optional native UART detail hides a required implementation task | Rejected. Core boot prose explicitly says to keep supplied device setup unchanged and treat `uart_puts` as output on the first pass; optional note explains device/exception details. Learners are asked to repair arithmetic, not invent a UART driver. | Keep supplied boundary explicit. |
| Optional A32 saved-register note is needed for final exercise | Rejected. Final task reads marker mnemonic/helper name and runs A64 average; the visible generalisation introduces `bl __aeabi_uidiv`. It does not require constructing an A32 frame. | Keep optional convention comparison. |

No confirmed additional hidden-prerequisite composition defect emerged in this bounded pass. That does not establish that every multi-instruction challenge is easy: those require separate first-use learner checks if evidence warrants them.

## Complete later-lesson coverage

All entries inspected through registered section objects and relevant shared component source. “Separate” means separately embedded figures/tasks in visible sections, not necessarily all expanded simultaneously after prediction.

| Lesson | Activity exposure / disposition |
| --- | --- |
| one-pattern-three-readings | Separate steppers, register readers, challenges; paired listing comparison and answer gate. Keep. |
| constants-and-widths | Separate wide-register activities and constant tester; challenge solution gated for feedback. Keep. |
| adding-and-the-flags | Separate adder/flag figures; column stepping is one operation. Keep. |
| subtracting-and-the-tick-counter | Separate ring, wrapped/nonwrapped adder and negation experiments. Keep. |
| masks | Three explicit function chips; field extraction, writing and failure have separate figures. Keep. |
| shifts | Explicit operator/amount chips and two named inputs to one division function. Keep. |
| compare-and-choose | Visible signed/unsigned runs, paired/diff listings, own-solution inspection, conditions. Keep. |
| branches | Separate baseline, branch-arrow experiment and changed-branch stepper. Keep. |
| counting-up | Visible fixed-call buttons and bars; changed condition separate. Keep. |
| counting-down | Named calls; do-while and wrong loop separately embedded. Keep. |
| memory-and-addresses | Read/write and different store widths each separate. Keep. |
| loading-widths | Explicit six-load comparison select; register extensions separate. Keep; representative browser check passed. |
| array-addresses | Explicit three-form comparison select; scale failure and sum loop separate. Keep; representative browser check passed. |
| zero-terminated-strings | Indexed, moving pointer, empty, wrong terminator and bounded figures separate. Keep. |
| products-and-widths | Narrow/wide/signed/subtract/halves figures separate. Keep. |
| division-and-remainders | Quotient, remainder, unsigned, zero, overflow and constant division separate. Keep. |
| calls-and-returns | Working/failure stack steppers separate; instruction stepping. Keep. |
| recursive-calls | Execution, stack inspection and failure separately embedded. Keep. |
| from-c-to-instructions | Visible editable source task; failure separate; external compiler explicitly optional. Keep. |
| compile-a-loop | Baseline and off-by-one editor tasks separate; instruction Next. Keep. |
| c-and-overflow | Standard and wrap-option listings/runs separate; safe construction separate. Keep. |
| checked-arithmetic | Narrowing, promotion, mixed conversion and overflow failure separate. Keep. |
| from-function-to-executable | Pipeline, ELF layout, output, startup and boot path separate; named inspection controls. Keep. |
| debug-native-instructions | Startup, working stops and arithmetic divergence separate; recorded instruction stepping. Keep. |
| same-c-on-a32 | Static paired functions separately presented and repeated at relevant tasks; A64 execution explicit. Keep. |

## Regression criterion

When adding a new core task with a different objective or function, expose its title and destination in the visible course/lesson structure. A “Next” control may step the current machine or reveal requested feedback; it must not be the sole route to a prerequisite activity later prose assumes was seen. Named input/function selectors remain appropriate for an explicitly stated comparison within one learning task.
