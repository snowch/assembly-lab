# Independent reader and technical review: From C to instructions

Reviewed 18 October 2026 at `http://localhost:4204/assembly-lab/#/lesson/from-c-to-instructions`, snapshot build 3. Independent reviewer used the inherited model and effort; no model override. Read the lesson and implementation before author notes. No production files or build outputs changed.

## Findings

1. **Medium: statement mode does not explain that applying a statement replaces the selected source line.** The interface says “Statement to add” and “Apply this statement”. Selecting the existing line `unsigned charge = distance * rate;` leaves the controls at “Return a value”, “distance” and “Use one value”. Selection does not populate the controls from that line. The learner is asked to “Try changing the fixed charge”, but this mode provides no explanation of its replacement behaviour or preview of the new statement. `CEditor.tsx` confirms that Apply removes the selected line and inserts the newly constructed statement. This is particularly confusing after using the assembly tap editor. Direction: make the replacement contract clear before applying, and either populate supported statements from the selected line or clearly distinguish the selected source from the new statement being built. Evidence: `/tmp/reader-c-compile/playground-desktop.png` and `playground-phone-dark.png`.

2. **Low: wrong module reference for `movk`.** The motivation says “`movk`, introduced in Module 2”. It is introduced in Module 1, `constants-and-widths`: “With a `w` name, `movk` replaces one 16-bit half of the 32 bits and keeps the other half.” The Module 2 masks lesson itself refers to “`movk`, from Module 1”. Direction: correct the module number or name the earlier lesson.

3. **Low: unexplained assembly terminology interrupts the new explanation.** The motivation says “The printed `mov` forms in earlier listings can be aliases for particular encodings”. Earlier learner prose does not define “alias” or instruction “encoding”. The statement follows a useful concrete account of `movz` and `movk`, but asks the learner to understand a second distinction that this example does not demonstrate. Direction: explain the relationship in ordinary words if it is needed here, or remove this detail from the main explanation. This is an assumed-knowledge finding, not a challenge to the technical fact.

No high-severity or blocking correctness defect found in this lesson's examples, exercise grading or generated trace.

## Browser checks

- Captured the complete page at 1280 × 800 and 375 × 812 in light and dark themes. Inspected the editor, listing and register layout at both widths. Phone document width was 375 pixels, with no horizontal page overflow; all visible controls measured at least 40 pixels high. No browser page errors.
- Both predictions initially gate their corresponding playgrounds. Checking an incorrect prediction opens the figure and gives feedback. No later unconditional paragraph discloses the prediction result.
- Compiled and ran the initial source, stepped through every instruction, and checked source-line highlighting and the final evaluator/simulator agreement. The changed-source failure example also compiles and runs through its own playground.
- Both challenge starting points fail. Both working solutions pass all five cases; saved successful work and verdicts survive reload. Opened all five hints for each challenge. Tested an executed C division by zero: each failing case reports its source position and explains the invalid divisor.
- Optional GCC disclosure, privacy link and attribution appear before its request button. There were zero external requests before the explicit button. A mocked disconnected request produced the advertised failure message, while local execution remained available. A separate mocked successful response was cached: two presses made one request. Decoding the Compiler Explorer link confirmed it contains exactly the requested source. After disabling the browser context's network, editing and running locally still worked. No learner code was sent to the real external service.
- The source-to-register explanation matches the displayed generated instructions. The cap task explicitly states that the unsigned product wraps before the comparison. The lesson distinguishes its fixed-pattern compiler from GCC and limits the safety claim to the executed path.

Artifacts and scripts are in `/tmp/reader-c-compile/`. Files containing exercise work are review evidence, not learner-facing material.

## Prerequisite audit

C parameters, return, if/else, unsigned arithmetic and loops are covered by the front-page prerequisites or earlier lessons. Local variables already appear in the front-page check and earlier examples. Multiplication, branches, register widths and return values have been taught. GCC settings `-O0` and `-O1` are explained in Module 0. The new `movz` behaviour is explained next to its first use, and intermediate working values are defined in ordinary language. The evaluator's job is described where it first becomes relevant; its separate implementation is not required knowledge for the task. The unintroduced terms found are the alias/encoding pair in finding 3.

The core compiler implementation has a separate technical review. This review checked the lesson-facing source, generated examples, execution interface and exercise behaviour rather than duplicating a complete parser/compiler audit.
