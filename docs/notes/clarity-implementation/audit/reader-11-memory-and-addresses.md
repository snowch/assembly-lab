# Independent learner review: lesson 11, Memory and addresses

Reviewed read-only at `http://localhost:4290/assembly-lab/#/lesson/memory-and-addresses` on 18 October 2026. No prior review notes read. Lens: execution moment, values and storage, source relationships, guidance placement, assumed knowledge.

## Coverage

Read CLAUDE.md, docs/style.md and docs/authoring.md; front-page Before you start; preceding lesson prose in index.ts order (Meet the machine through Counting down). Read all target prose, labels, prediction options/explanations, both challenge tasks/hint ladders, reflection and model-versus-reality notes; memory listings and shared MemoryPrediction/MemoryStepper, PredictionBox and relevant strings.

Actual Chromium at 375×900 and 1280×900, light and dark, with fresh contexts. Examined the initial page, committed a representative prediction, stepped the load and store, and inspected rendered C pairing/register/memory diagrams in all four configurations. No horizontal page overflow in those configurations. In a separate phone run opened the prediction's Stepped note, opened the first construction hint and ran the unchanged starting submission to inspect failed-test feedback. Did not solve the construction or final challenge, exercise every hint in the browser, or exhaust every store variant; all hint text was read from source.

Screenshots: `/tmp/course-clarity-audit/11-{375,1280}-{light,dark}-{load,store}.png`; candidate `/tmp/course-clarity-audit/11-prediction-badge.png`. Rendered text snapshots are in the same directory. Four configuration screenshots were visually inspected (phone load in both themes; desktop store in both themes).

## Findings

### 1. Low: prediction cards still introduce stepping rather than the learner's prediction

- Quote: **“STEPPED”**, expanding to **“Each step runs one instruction in the simulator. Between steps, the simulated processor stays as the last instruction left it.”** directly above **“What hexadecimal value does `ldr w0, [x0]` put in `w0`?”**
- Sources: `content/lessons/memory-and-addresses.ts:81` (`predict-read-distance`, timeModel but no prediction role); second occurrence `predict-wide-fuel-store` in the failure experiment; wording `packages/views/src/strings.ts:11`.
- Setup/state: fresh uncommitted prediction; click its Stepped badge. Confirmed badge in all four configurations and expanded note in phone light. Screenshot `11-prediction-badge.png`.
- Learner effect: the card has answer choices and Check your prediction, but its heading and expandable guidance describe Next/Back-style stepping available in a different figure. This repeats the guidance-placement confusion removed from Module 0.
- Direction: apply the prediction role consistently to these prediction cards; retain stepping guidance with the actual steppers. This is a role/placement correction, not a request to change the prediction or reveal its answer.

### 2. Medium: instructions for using the load figure arrive after that figure, beside a store

- Quote: **“Step through the load. The figure marks the bytes it reads and shows where their bits go in the register.”**
- Source: `content/lessons/memory-and-addresses.prose.ts:24`; mounting order `content/lessons/memory-and-addresses.ts:94` (load stepper in Prediction) and `:109`–`:128` (Investigation prose followed by save_distance store).
- Setup/state: check the first prediction, inspect the revealed read_distance figure, then continue down to **Investigation → Move bits between memory and registers**. Its first paragraph gives this instruction, while its following interactive is **“Step through save_distance and inspect the bytes it writes.”** This order is present at both widths/themes.
- Learner effect: the reader must realise that “the figure” means the one above the section boundary and return to it. A reader following the new section downwards instead reaches a store, whose direction of transfer is the opposite of the instruction to read bytes into a register. The distinction between loads and stores is exactly what this section is teaching.
- Direction: place the load-specific guidance immediately before its load figure, or make the backward reference explicit; keep store guidance beside save_distance. Preserve the prediction gate.

## Assumed knowledge

No additional unsupported prerequisite finding for this lesson's core tasks. The front page explicitly requires small C functions and basic arithmetic, and explicitly does not require pointers. This lesson supplies the missing pointer knowledge: question prose defines bytes, addresses, pointer syntax and `const`; motivation explains square brackets, little-endian order and 64-bit addresses; investigation explains assignment through the pointer and a `void` return; failure feedback and explanation define narrow-store widths and halfword.

Prior-definition evidence: Module 0 compiler note explains GCC, Compiler Explorer, optimisation and `-O1`; its investigation defines registers, operands and stepping. One pattern, three readings defines hexadecimal and signed/unsigned readings in its investigation. Constants and widths failure experiment states that x and w are names for the same register and that writing w clears the upper half. Target motivation repeats that distinction at use. Thus the question's “after load” explanation distinguishes pointer storage from loaded-value storage clearly; it does not reproduce the original ambiguous total question.

No rewrite or challenge solution is supplied here. Findings are candidates for the independent sceptic, not author-approved fixes.
