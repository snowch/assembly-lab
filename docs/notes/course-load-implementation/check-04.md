# Independent check: Subtracting, and the tick counter

23 October 2026. Checked the supplied final production build at `http://localhost:4322/assembly-lab/#/lesson/subtracting-and-the-tick-counter`. No application edits or rebuilds.

## Outcome

No blocking, medium or new low-severity finding confirmed in the changed treatment. The accepted phone comparison problem is addressed by “Enlarge the selected group”. Its labelled rows retain the original `w1`, “w1 with each bit changed”, `w0`, “Carry into each column” and “Answer” together. The complete 32-bit overview remains visible. Direction: retain the optional enlargement and its shared reveal boundary.

The two subtraction figures intentionally open completed, matching the local introduction “The two figures below show the final states of two subtractions”. This is a worked example after prediction commitment. Reset returns the first figure to zero columns, removes the enlargement and hides every result cell. Next column exposes one result cell; the enlarged four-bit group uses dots for its other three result cells and for carries not yet calculated. Next group of four completes that group. The original and complemented operand bits remain available for comparison throughout. No result or carry appeared ahead of the column calculation in the partial enlargement.

## Browser evidence

Four fresh Playwright contexts: 375×900 and 1280×900, each with light and dark system preferences. Verified actual body backgrounds `rgb(243, 246, 245)` and `rgb(16, 22, 21)` respectively. Document horizontal overflow was zero initially, after grouping, after reset and after the task/negation activity in all four contexts. Evidence and reproducible script are `/tmp/check04/run.cjs`, `/tmp/check04/log.txt` and the width/theme-prefixed PNGs in `/tmp/check04/`.

In all four contexts checked: initial unchecked prediction with both subtraction adders absent; an incorrect prediction commitment unlocking the ring and both completed adders; first adder complete, enlarged complete, Reset, Next column, enlarged partial, Next group of four, Show all and second Reset. The enlargement identifies its selected bit range and highlights the same current column as the overview and column calculation. Controls remain readable and usable. Direct image inspection covered phone-light partial, phone-dark complete and desktop-dark grouped states; the other contexts were captured and checked through rendered text/state and geometry. The phone overview stays dense, but the enlargement gives the compared four-bit rows readable cells without page overflow.

In all four contexts ran the unchanged construction starter and opened only its first hint. Feedback distinguishes labelled inputs, actual and expected results, and the subsequent calculation stays gated on passing. This is a meaningful failed attempt using the familiar editor and test workflow; no challenge solution was entered. Also committed the negation prediction and advanced its stepper once in all four contexts. No external compiler call.

## Reading, mechanism and prerequisites

Read all ten lesson sections, captions, tasks, hints and disclosures in the lesson source and rendered main-path text. Read AGENTS/CLAUDE guidance, relevant style and visual-language guidance, the four earlier lessons' prose, this lesson's recorded listings, the prior reader finding, `AdderFigure.tsx` and the model's `addWithCarry` mechanism. The enlargement uses the same arithmetic record and reveal functions as the overview; the original subtracted operand is recovered separately from its complemented input. Carry-in, retained result and flag interpretation follow the model's recorded subtraction. No independent Arm/QEMU run or full test suite is claimed.

Assumed knowledge is supplied by the opening and preceding lessons: small C functions and arguments; `sub` operand order, `ret`, argument/result registers, stepping and editing; signed/unsigned readings and ranges, hexadecimal and top-bit numbering; low bits and `w`/`x` widths; binary addition, carries, N/Z/C/V and signed overflow. GCC and optimisation notation were explained earlier. This lesson defines tick, wrap, borrow, `subs`, `neg`/`negs`, changed operand bits and modulo locally. No unexplained required prerequisite confirmed. The first prediction applies familiar subtraction to the newly explained counter wrap; the later mechanism reuses the previous adder before construction.

## Limits

Bounded representative verification, not a novice-learning measurement. The second subtraction adder was checked in its completed unlocked state, but its individual column controls were not separately exercised. Did not pass either challenge, unlock the successful-construction follow-up, exhaust hints, open the reflection answer in the browser, test every column/input, reload restoration, keyboard/screen-reader interaction or live GCC. Later hints and reflection disclosure were source-only. No build or suite result is asserted.
