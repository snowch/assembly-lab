# Conversions and checked arithmetic: independent reader review

Reviewed 18 October 2026 by an independent agent using the inherited session model and effort, with no model override. The reviewer did not draft this lesson. This review covers the built `checked-arithmetic` page at `http://localhost:4200/assembly-lab/`, the front-page prerequisites, and preceding lessons through `c-and-overflow`.

## Findings for the sceptic

### CA-R1 — Low: the first use of printf assumes a library convention

Quote: “In `printf`, `%d` expects an `int` and `%u` expects an `unsigned int`.” The following example is a call with a quoted first argument and a value argument.

Effect: the learner has explicitly been told that standard-library knowledge is unnecessary. The paragraph gives the type requirements, but never directly introduces what `printf` does or says that its first argument is a format string containing instructions for printing the later arguments. A learner can infer this from “output function” and the surrounding discussion, but must make that inference while learning the separate promotion rules.

Evidence: `apps/course/src/strings.ts` explicitly excludes standard-library knowledge from the prerequisites. A search of earlier lesson prose finds no earlier explanation of `printf`. The built page's generalisation section is its first use.

Direction: introduce the function's purpose and the role of its first argument briefly at this first use. Keep the scope to the two conversion specifications actually discussed.

### CA-R2 — Low: references to recorded diagnostics have no learner-accessible target

Quotes: “The recorded format example includes such a warning” and “The recorded signed-add example includes an overflow check and a call to the sanitizer's reporting function.”

Effect: these phrases point to examples that are absent from the page. The learner cannot inspect the warning or the compiler evidence being described, even after opening the details section.

Evidence: neither the built page's “Warnings and run-time checks” detail nor the model note displays or links to those records. The records exist in `docs/notes/module-11/compiler/format_trip.*` and `sanitize_trip.*`. Their descriptions agree with the retained responses; this is an access and explanation issue, not an unsupported compiler claim.

Direction: make the cited records reachable, or include a short relevant diagnostic excerpt with attribution. Preserve the explanation that the simulator does not execute the external runtime.

## Assumed knowledge audit

The two findings above are the remaining assumed-knowledge/access gaps. No additional untaught instruction or substantive C prerequisite was found.

- Byte-sized signed/unsigned types, casts, sign extension, out-of-range signed conversion, and the meaning of an implementation-defined signal appear in `loading-widths`.
- The modulo vocabulary is explained in `subtracting-and-the-tick-counter`.
- Signed and unsigned register readings are distinguished in `one-pattern-three-readings`.
- Pointers, four-byte stores, little-endian memory, and `w`/`x` width behaviour are covered by Module 6.
- GCC, optimisation settings, C23 selection, `INT_MAX`, and `#include` appear before this lesson; `c-and-overflow` introduces the latter C23/limits context directly.
- Integer promotion is introduced in this lesson before its arithmetic example. `_Bool`, the checked-add result pointer, true/false status, and sanitizer instrumentation are explained locally.
- The independent unsigned default of the bit figure is already covered by the register-reading prerequisite. Its decimal display is not itself a technical error.

## Technical review

The source-language claims were checked against `/tmp/course-n3096.txt`: integer promotions (§6.3.1.1), unsigned and signed conversions (§6.3.1.3), usual arithmetic conversions (§6.3.1.8), formatted-output requirements (§7.23.6.1), and checked arithmetic (§7.20.1). The signed conversion discussion correctly states the particular N3096 rule and separates GCC's documented choice from undefined signed arithmetic overflow. The checked operation's stored result and status are separate, and the exercise's fixed destination width matches its stated contract.

The retained Module 11 compiler requests and responses support the shown narrowing, promotion and mixed-comparison instructions. Source-line annotations were checked against the retained responses with the removed copyright line accounted for; GCC sometimes associates an instruction with the function's closing brace. That is retained compiler mapping, not an off-by-one error introduced by this lesson.

`npx vitest run content/lessons/c-boundaries.facts.test.ts`: 34 tests passed. No additional technical blocker was found. This review did not rerun the separate QEMU differential suite.

## Browser checks

Playwright exercised Chromium at 1280 × 800 and 375 × 812, in both light and dark themes. Saved initial and unlocked screenshots, figure screenshots, body text and result logs are in `/tmp/reader-checked/`.

- Both predictions accepted submissions and revealed their feedback. All four dependent figures were locked initially and unlocked afterwards.
- All four steppers advanced to return. Their register, bit, flag and memory views were inspected, including phone and desktop screenshots.
- Both starting exercises failed their tests. All five hints opened for each exercise. The third-hint revision is already assigned separately and is not duplicated as a finding here.
- On the phone, reference submissions passed all 8 and all 7 tests respectively. Text/Tap switching preserved each artifact, and reload retained the work.
- No page exception or horizontal overflow occurred in any viewport/theme combination. The inspected phone and desktop figure/editor screenshots were readable.

No production files were changed by this review. The two low-severity findings should receive the required sceptic decision before editing; fixes then need a check in a rebuilt page.
