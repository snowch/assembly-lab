# Modules 2–4: pacing review

Copyright © 2026 Christopher Snow

Reviewed 30 October 2026. Review only; no lesson or component changes.

The clearest candidates for shorter pages are **Masks and fields** and **Compare, and the signed or unsigned condition**. They change learning goal before the learner reaches the closing check. Subtraction also mixes separable work, but reordering its signed-negation detour and identifying its arithmetic drill-down is a smaller first change. Addition, shifts and the main branch trace earn much of their length through connected practice. They do not all need splitting.

The useful comparison with revised Module 0 is a completed learning goal followed by a stopping point, not equal word counts. `one-addition` teaches one operand rule, lets you run it, then checks fresh inputs. The Module 0 synthesis deliberately combines already practised mechanics. Later lessons can likewise keep a substantial integrated investigation when the constituent mechanics are established.

## Ranked findings

### 1. High: Masks and fields introduces a second goal inside its investigation

**Page/section:** `masks`, “Masks, fields and the three rules”, then “Writing a field”. Source: `content/lessons/masks.prose.ts:24–58`; activity order: `content/lessons/masks.ts:104–213`.

The first goal is changing one warning with independent bit operations. The transition “**A run of bits that together hold one number is called a field**” then introduces a different representation and its operations. The same investigation now requires left shifting, `ubfx`, the C expression that extracts a field, and the `x0`/`w0` qualification. Construction adds preserving surrounding bits, limiting an oversized input, positioning it, merging it, and comparing the learner's code with `bfi`. These are related, but one-bit manipulation is a usable skill before field replacement begins.

In the built page the investigation contains the mask experiment, a separate register-OR experiment, and field reading before the field-writing activity. Committing predictions makes this substantial sequence larger, not merely more explanatory prose. On the phone the learner crosses several distinct figures before reaching a fresh checkpoint. The first prediction also previews C operators that will only become useful later on this same long page.

**Smallest useful structural correction:** split immediately before `read-gear` / the field definition. First page: warning word, negative mask, AND/OR/exclusive OR, including register-source OR. Second page: reading and replacing fields. Keep the field-plan prediction, writing exercise, own-code stepping, GCC comparison and missing-clear experiment together; these form one strong construction-and-debugging sequence. Redistribute the existing closing checks to their relevant goals without exposing their answers. Move the generic no-carry explanation beside the single-bit operations it explains. Preserve the bit diagram and the register-OR guidance, including the immediate-mask restriction.

### 2. High: Compare and choose finishes its core goal, then starts two more before checking it

**Page/sections:** `compare-and-choose`, “What each condition reads” and “What GCC does for a yes or no answer”. Source: `content/lessons/compare-and-choose.prose.ts:82–117`; activities: `content/lessons/compare-and-choose.ts:207–263`.

After comparing signed and unsigned selection, writing `less_fuel`, and testing the wrong signed condition, the lesson broadens: “**After that compare, the core conditions come in groups**”; then “**hi and gt exclude equality**”; then “**bool is a C type that holds 0 or 1**”. It introduces condition families and aliases, reverses the compare's operand order for the condition explorer, explains `cset`, compares two compiler forms of a Boolean result, and shows a sign-bit implementation without a compare. The closing graded task returns to four basic conditions from the earlier goal. The additional compiler cases do not advance that check.

The rendered condition explorer already hides conditions beyond the first six. The preceding visible prose still explains them. Its generalisation is a separate stretch of code and reading with no interactive task, between the explorer and the basic condition check. This is a stronger pacing problem than the page simply being long.

**Smallest correction:** put the four-condition check directly after the matching condition exploration and move the Boolean/compiler alternatives to a separately identified follow-on. For a Module 0-style page split, end the first page after the core select exercise and wrong-condition experiment; begin the next with condition families, using `cset` as a concrete use of those conditions. Keep the exact conditions needed by each page available before its exercise. Introduce strict versus inclusive conditions before the subsequent branch lesson needs them. Keep `downhill` and the `tst`/`ands` note as optional extensions rather than additional required goals. Do not split the compare → flags → condition → select diagram: it carries the mechanism the learner needs.

### 3. Medium: The counter application pauses for a full mechanism derivation, then signed negation interrupts its conclusion

**Page/sections:** `subtracting-and-the-tick-counter`, “Subtraction as addition, and borrows”, “Negating 0x80000000”, then “Why the low bits are enough”. Source: `content/lessons/subtracting-and-the-tick-counter.prose.ts:26–87`; activities: `content/lessons/subtracting-and-the-tick-counter.ts:80–200`.

“**Subtraction can be worked out as addition**” changes from a counter's forward distance to bit complementation, carry-in, a four-bit worked calculation, its 32-bit algebra, and two full adder views. After the learner writes the elapsed-time function, “**neg w0, w0 sets a value to its negative**” starts a signed edge case. Only afterwards does the page return to the counter proof, full-turn limit and counter check. The learner must retain the unsigned application while switching twice to distinct arithmetic questions.

In the revealed investigation the ring and enlarged strip explain the application well. The two adders open at their completed column state and offer further stepping; their detail is valuable, but both sit on the required route to writing the function. This is not a recommendation to remove either the ring or the carry/borrow mechanism.

**Smallest correction:** finish the elapsed-time chain and its checks before the signed-negation experiment. Identify the detailed subtraction calculation as a drill-down, retaining the visible carry/no-borrow rule needed by the counter task. Consolidate the repeated algebra between the investigation and explanation. If shorter pages are desired, the defensible boundary is between **how subtraction produces its bits/flags** and **using subtraction for elapsed time across wrap**. In that version teach the subtraction mechanics first, then keep ring, assumptions, construction and boundary check together on the application page. Do not make “the first adder” and “the second adder” separate pages. Keep negation with subtraction's signed-overflow work or as an optional extension.

### 4. Medium: Branch construction bundles a new branch form with first-time program organisation

**Page/section:** `branches`, “Three outcomes from two tests”. Source: `content/lessons/branches.prose.ts:38–47`; activity: `content/lessons/branches.ts:151–164`.

The worked trace uses flag-based and unconditional branches. The first writing task then adds “**cbz w0, label goes to the label when w0 is 0**”, label naming and placement, three outcome paths, and precedence between two tests. The local directions do explain the new instruction and syntax; this is concentration of decisions, not missing definitions. Choosing tests, placing labels, preventing fall-through and preserving the input are all new writing decisions at once.

**Smallest correction:** demonstrate or let the learner run a tiny `cbz` path immediately before construction, then keep this exercise as the synthesis. Keep its boundary experiment and the `describe` count check with the main branch trace. The later `cbnz`/`tbz`/`tbnz` catalogue and `maybe_beep` comparison can be explicitly optional transfer material. A separate page is not warranted merely for the eight-instruction `describe` trace: the path view, skipped instructions and return belong together.

### 5. Low: Shifts inserts a second context before asking why division differs

**Page/sections:** `shifts`, “Left and right shifts”, then “Division and shifting” and “How GCC divides by 2”. Source: `content/lessons/shifts.ts:93–142`; `content/lessons/shifts.prose.ts:34–46,61–79`.

“**Shift an input before adding**” inserts a separate shifted-register addition between the basic shift experiment and “**C's / divides, and a shift can seem to do the same job**”. Later the division section explains shifted-operand syntax again. The extra example is useful prerequisite support, but arrives before the discrepancy that gives it a purpose.

**Smallest correction:** place the primitive shifted-add demonstration immediately before the compiler's division sequence, then consolidate the repeated operand explanation. Keep the positive/negative comparison beside the corrected compiler sequence; splitting those loses the reason for the correction. No mandatory page split. If the author wants an additional stopping point, place it after the basic shift experiment and instruction-by-type check, with a follow-on on division's rounding rule. Keep the C qualifications local to the examples they constrain.

### 6. Low: Addition repeats its four-flag definitions without changing the question

**Page/sections:** `adding-and-the-flags`, “Carries and the four flags”, “Three additions to predict”, “Unsigned carry and signed overflow”. Source: `content/lessons/adding-and-the-flags.prose.ts:23–24,36–45,67–75`.

“**Earlier, you predicted one addition. Now you predict three**” repeats the full N/Z/C/V list already given with the adder; the explanation returns to the same rules again. A compact rule reminder beside the multi-case exercise is useful. Repeating the whole explanation is less useful.

**Smallest correction:** retain the local exercise reminder, trim the later repetition and use the explanation to connect C/V to the two readings. Keep the distinction between `add` and `adds`: its stale-flags experiment teaches a different and necessary consequence. Do not split N/Z from C/V into separate pages merely to match Module 0's size. The one addition, its carries, both readings and flags explain each other.

## Module dispositions and retained material

| Module | Disposition | Retain together |
| --- | --- | --- |
| 2: Adding, subtracting and the flags | Keep addition as one coherent lesson. Reorder subtraction before considering a mechanics/application split. | Addition's prediction, carry diagram and flag practice; counter ring, valid assumptions, function construction and wrap-boundary check. |
| 3: Logic, shifts and masks | Split Masks and fields at the change from single-bit warnings to fields. Keep Shifts with local sequencing improvements. | Field-writing plan, own solution, GCC comparison and missing-clear failure; shifts versus division and the compiler correction. |
| 4: Compare and branch | Separate Compare and choose's core selection goal from the condition/Boolean expansion, or first reduce and relocate that expansion. Keep Branches' main trace integrated. | Signed/unsigned selection comparison; branch paths and counts; boundary-condition experiment; branch-writing exercise as synthesis after a small `cbz` preparation. |

## Evidence and limits

Read `CLAUDE.md`, `docs/style.md`, this review's brief, Module 0's fundamentals/synthesis/return prose and its ordering, Module 1's readings prose and prerequisite declarations, the plan's ordering, and all six assigned lessons' complete `.ts`, `.prose.ts`, `.labels.ts` and relevant listing records. Reviewed challenge structure, allowed instructions, gates, hints and feedback in source. Did not reproduce exercise solutions or audit ISA accuracy independently.

Used the existing production build served at `http://localhost:4411/assembly-lab/`, build id `58255c71e62a30a21bf25412baf6ecc4d08345f808455accc670c2e4b00b0257`. No new build or test suite was run for this review-only document.

For **all six assigned pages**, plus Module 0 `one-addition` as a reference, browser automation captured initial full-page renders and heading/section positions at **375 × 900 and 1280 × 900**, each in **light and dark**. Actual rendered themes were checked through `html[data-theme]` and distinct computed body backgrounds, not only the preference control. The page had no document-level horizontal overflow in those captured states. These measurements describe initial layout, not reading time or total completed-lesson size.

For **all six assigned pages at all four combinations**, committed every prediction to open its dependent figures and captured revealed representative sections: addition's carry view, subtraction's ring and adders, Masks' complete investigation, Shifts' division experiment, Compare's condition explorer and Boolean section, and Branches' path investigation. Read rendered text and visually inspected selected screenshot sections, with Masks and Compare as the main structural examples. This exposed the difference between an initially locked figure and the fuller activity route. Closed optional notes, challenge hints/feedback, passed-challenge comparisons, and learner-solution figures were read in source only. No writing or answer challenge was submitted. An attempted additional control pass stopped on the initially disabled Reset button of the addition adder; it supplies no completed step/reset coverage. No persistence/completion, restored-work, keyboard/accessibility or external compiler-service checks were performed. Source-only later states cannot be assigned a measured completed-page height from these captures.

Browser evidence is in `/tmp/pacing-*.json`, `/tmp/pacing-*.txt`, `/tmp/pacing-*.png` and `/tmp/pacing-active-*.{txt,png}` for this session. These are review captures, not committed course artifacts. The unrelated Pi source brief was untouched.
