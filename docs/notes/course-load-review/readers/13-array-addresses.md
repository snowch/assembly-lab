# Array addresses and moving pointers

Module 7, assigned review order 13 (zero-based registry position 13; fourteenth lesson). Independent learning-load review of the built preview, 23 October 2026. No application changes.

## Prior knowledge and novelty

The entry panel already requires indexed arrays and small C loops. Earlier lessons practise register aliasing, zero extension, shifts, additions, comparisons, branching, empty-loop checks, wraparound, byte addresses, little-endian transfers and pointer dereferencing. `loading-widths` explicitly introduces an immediate byte offset and extension within an `add`. Thus the first prediction applies one new address composition (base plus scaled index) using familiar operations; it does not require learning loads, hexadecimal and shifts together.

New here: scaled register offsets, pre-index/post-index pointer updates, C pointer arithmetic and `*trips++`, the local explanation of `+=`, pointer/end-address loop termination, one-past-end restrictions, and the unsigned extended/shifted operand in end-address construction. The array/element/index definitions refresh stated entry knowledge. I found no confirmed required prerequisite gap: essential new notation is explained before the relevant attempt. The compiler note's target terminology is optional context, and earlier lessons already introduce GCC and optimisation settings.

## Confirmed finding

**Medium: the memory comparison makes the learner retain the very relationship the figures should externalise, especially on a phone.** The instruction is “Follow the highlighted bytes and the address register in each figure” and “Compare both registers, not just the value loaded” (`content/lessons/array-addresses.prose.ts:18`). The three independently stepped figures are captioned “Use an offset without changing x0”, “Update x0 before the load”, and “Load from x0, then update it”.

Reproduce at 375×900 in either theme: commit the first prediction, execute the load in each investigation figure, and inspect its pointer register, selected byte group and transfer. Each comparison figure is approximately 2,267px high after the load. In the offset figure the registers occupy y=561–634, while its memory block occupies y=650–2119 and transfer y=2135–2522 with the controls at y=427–471. Consequently neither all elements nor the transfer fit beside the pointer. Moving between comparison cases requires crossing a complete repeated memory diagram. The repeated per-byte “Not accessed by this instruction” labels occupy much of this space. Desktop improves the internal byte layout, but the three cases still occupy separate large vertically stacked panels.

This is avoidable UI tracking rather than excessive conceptual novelty: offset versus pointer movement is a useful coherent comparison. Smallest direction: give these three cases a compact shared comparison of address used and pointer before/after, keeping the full byte transfer available as detail. On phones, reduce repeated unchanged-byte labels and bring selected bytes beside the two relevant register states; retain explicit addresses and element boundaries. Do not remove the comparison or split every addressing form into a lesson.

Evidence: `/tmp/course-load-review/array-addresses-375-detail.png`; four `array-addresses-{375,1280}-{light,dark}-compare.png` screenshots; measurements in `array-addresses-states.log`. Source explains the ordering: `MemoryStepper.tsx:117` renders registers before the whole memory map, followed by the transfer; `memory.css:94` groups elements and its phone rule wraps each four-byte element into two columns.

## Design recommendation, not a confirmed blocker

The final worked listing is the lesson's largest novelty cluster. “Its end address comes from `add x3, x0, w1, uxtw 2`” is followed by count-register reuse and the explanation that GCC replaced the decreasing count with pointer comparison (`array-addresses.prose.ts:36`). The learner must reconcile `*trips++`, the end address, extension plus scaling, register reuse and a compiler-transformed loop while stepping a full paired listing.

A smaller first traversal using the already familiar count-down stopping rule would make pointer advancement easier to isolate, with the compiler's end-pointer transformation afterwards. However, severity is not established as high: every mechanism is explained locally, post-index was just practised, loops and extended arithmetic are prerequisites, and the writing challenge permits familiar count-down logic. Treat staging the end-pointer record as a medium-priority design recommendation for reducing first-reading effort, not evidence that the final synthesis is inappropriate or impossible.

## Keep

- The initial motivation states element size, shift, addition and pointer aliasing before the first prediction. Its first learner attempt has a sensible scope.
- Separate destination `w2` in the three addressing examples isolates pointer movement from loaded data. Keep that experimental control.
- Element boundaries, full byte addresses and explicit read/write wording make the wrong-scale experiment inspectable. It changes one address mechanism while keeping transfer width fixed; familiar little-endian work is appropriate synthesis.
- Prediction feedback and walkthrough are gated. Committing even an incorrect choice opens the investigation, so progress does not require guessing correctly. The taught general rule is not a spoiler.
- The final task states empty-count behaviour, memory preservation and wrapping explicitly. Its feedback belongs to a distinct exercise, rather than competing with a next-instruction question inside the memory figure.

## Coverage and limits

Read all ten sections, compiler and reflection disclosures, model/reality note, recorded programs, challenge tasks/editor metadata, `MemoryStepper`, `MemoryPrediction`, memory transfer implementation and CSS. Earlier-lesson prerequisite claims checked against parsed registry and the front-page entry panel, not later content or historical reviews.

Fresh Playwright contexts covered 375×900 and 1280×900 in light and dark. Actual body backgrounds were rgb(243,246,245) and rgb(16,22,21); no initial page-level horizontal overflow. Captured initial locked page; committed first prediction and feedback; first load in scaled, offset, pre-index and post-index steppers; committed wrong-scale prediction and its load; final sum stepper through its first post-index load (five instructions), then Reset; ordinary disclosures open. Separately ran each exercise's untouched starter and switched each editor to Tap in all four contexts. Captures/scripts/logs all use the `array-addresses-` prefix under `/tmp/course-load-review/`.

Screenshots and DOM geometry substantiate the phone tracking finding; the desktop dark full-page capture also shows the separation between cases. This is not a timed learner study. Successful challenge submissions, every loop iteration, all hints, restored persistence, keyboard-only use and external GCC were not exercised. Later code and feedback paths were source-only. No challenge answers are recorded here, no external compiler calls were made, and no rebuild was performed.
