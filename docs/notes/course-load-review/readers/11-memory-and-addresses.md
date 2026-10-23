# Memory and addresses

Module 6, lesson 1; registry index 11 (twelfth lesson). Review snapshot: f1fdf35. Independent learner/load review, not an accuracy audit or an implementation proposal.

## Prior knowledge and new work

Entry requirements (`apps/course/src/strings.ts:33–46`) require small C functions, integer arguments/returns, conditions, loops, array indexing and binary/decimal conversion. They explicitly say: “You do not need to know about pointers”. Only the eleven preceding registry lessons were used as prior teaching. Module 0 establishes registers, arguments, returns, paired listings, stepping and the existence of memory. “Same bits, two readings” teaches hex and bit significance. “Constants and widths” explicitly teaches that w/x are views of one register and that a w write clears the upper bits. Masks, shifts, comparisons, branches and both loop lessons add substantial practice reading and editing instructions. Neither pointers nor byte-addressed data movement has been practised.

Genuinely new here: bytes and addresses; C pointer declaration/dereference and const; bracketed memory operands; load/store direction; little-endian assembly of bytes; address width versus transfer width; source/address overlap on a load; narrow stores and neighbouring-byte preservation. `void` as a return type is explained locally (earlier `void` meant no arguments). Halfword and short/char store sizes arrive later. No confirmed untaught prerequisite blocks the required tasks. The optional compiler-size note contains a larger type catalogue, but the first load's four-byte width and address width are explained in required prose.

The first attempt is a multiple-choice endian load prediction. It asks learners to combine three new, related ideas: an address locates consecutive bytes, a w destination selects four bytes, and byte significance reverses the displayed hex order. Hex and register width are retrieval, not further new mechanisms. C pointer syntax provides context but learners need not write C or calculate an address. This is a reasonable connected task; no high-severity novelty finding. Nevertheless its first worked mapping comes *after* the prediction, so learners who understand each definition separately receive no smaller mapping rehearsal before combining them.

## Confirmed finding

**Medium — phone byte mapping adds avoidable spatial tracking to the first new mechanism.** Reproduce at 375×900, either actual theme: commit the first prediction and press **Next** once in “Follow the bytes from memory into w0.” The memory caption says “Addresses increase from left to right, then continue on the next row.” Four addressed memory cells wrap as three plus one. The destination mapping then uses a different two-by-two grid, ordered from high bits to low bits. Each cell repeats an address, a bit range and a role sentence, while two register summaries above both say “Written”. The learner must match address, byte and bit range across unequal wrapping patterns while also understanding the address-register replacement.

Evidence: `memory-and-addresses-375-light-load.png` and `memory-and-addresses-375-light-transfer.png` under `/tmp/course-load-review/`; same behaviour inspected in dark. Measured post-load figure height was about 1253px; memory cells occupy 330px and destination cells 280px, with their tops about 454px apart. This does not make the mapping impossible to view together, but raises the scanning cost of the lesson's central operation. Desktop has four-column byte mappings and less wrapping. Source: `MemoryStepper.tsx:134–260`; `memory.css:18–24,53–56,83–86`.

Smallest direction: keep both memory and register byte representations, but make the initial four-byte mapping compact and preserve an intentional correspondence between their groups on phones. Reduce repeated per-byte role text or put its common meaning once beside the group. Retain exact addresses, bit ranges and explicit opposing ordering. Do not remove the transfer picture or replace it with a register table.

## Design recommendations, not confirmed failures

- Before the first prediction, consider a tiny worked byte-to-significance mapping using different inputs, then leave this four-byte prediction intact. This would separate learning the notation from applying the endian rule. The existing prose may be enough for many learners; there is no observed evidence warranting a separate lesson or a blanket one-opcode sequence.
- Consider distinguishing register 0's two views visually within one physical register group. The page correctly says “They are two views of the same register”, and prior teaching already covers it, so two separately bordered “Written” summaries are reinforcement friction rather than a new prerequisite gap.

## Keep

The two-instruction complete function is proportionate. The complete paired C/assembly listing provides necessary context, and the contained horizontal listing on the phone avoids expanding the page width. Its presence alone is not overload.

Prediction commitment gates the corresponding computed walkthrough; feedback then explains the same bytes and register reuse before asking the learner to step. The first save investigation reuses the four-byte rule before the writing exercise. Its eight-byte fixture makes preserved neighbours observable. The later “A store that writes too many bytes” prediction applies a practised four-byte store to a narrower field; the byte/halfword alternatives appear after commitment. The subsequent narrow-store and eight-byte figures are meaningful comparisons, not unrelated concurrent questions. No answer disclosure before a meaningful attempt was found. The final copy exercise is appropriate synthesis of a load, store and familiar return rather than a new addressing mode.

## Coverage and limits

Read all ten sections, both challenge tasks and hint sequences, labels, mounted lesson data, the relevant recorded READ_DISTANCE/SAVE_DISTANCE/STORE_WIDE/SAVE_FUEL/SAVE_PULSE/READ_LONG/SAVE_LONG programs, MemoryPrediction, PredictionBox, MemoryStepper, memoryFigure and memory CSS. Read entry requirements and preceding lesson prose from the parsed registry; no later lesson was credited as prior knowledge.

Browser: fresh contexts at 375 and 1280, light and dark; actual body colours confirmed light `rgb(243,246,245)` and dark `rgb(16,22,21)`. In all four contexts inspected initial locked states, opened “The compiler and C sizes”, committed an intentionally incorrect first prediction, stepped the load, stepped the save investigation, committed the later store prediction, and stepped each four-/one-/two-/eight-byte load/store figure once. Ran the untouched first exercise to inspect failure feedback and opened its first hint; opened reflection “Answer”. No page horizontal overflow in these states. Separate 375 light run exercised load return, Back and Reset. Screenshots and scripts have the `memory-and-addresses-` prefix in `/tmp/course-load-review/`.

Exercise solutions were not entered; successful exercise feedback, later hint gates, reload persistence, keyboard-only operation and exhaustive numerical inputs were not browser-tested. Remaining hints and final challenge were source-reviewed. No external compiler request, rebuild or app change was made. This review establishes interface/sequence evidence, not measured novice completion times.
