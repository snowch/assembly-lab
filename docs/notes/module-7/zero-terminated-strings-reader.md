# Independent learner review: Strings and the zero byte

Reviewed 18 October 2026 by a separate Codex reader agent using the inherited model and effort settings. The reviewer did not draft or implement the lesson. Scope: the front-page prerequisites and lessons through “Array addresses”, with no assumed knowledge from later modules.

The review used the built snapshot at `http://localhost:4200/assembly-lab/#/lesson/zero-terminated-strings`, Chromium through Playwright, at 1280 × 800 and 375 × 812, in light and dark themes. Screenshots and interaction records are in `/tmp/reader-strings/`. No production files or build output were changed.

## Findings

The bounded scan, moving pointer, empty string and marker-counting tasks form a clear progression. The prose explains the difference between a zero byte and the character `0`, and distinguishes byte counts from displayed-character counts. No new blocking learner issue was found beyond the prediction disclosure already reported separately. That disclosure was still present in the reviewed snapshot; its answer is not repeated here.

1. **Minor: the third hint does not provide its promised smaller example.** In the first exercise, the heading “SMALLER EXAMPLE” introduces “Load a byte using the starting address plus the current length as its byte offset.” In the second it introduces “Test for the zero terminator before comparing the byte with the marker.” Both are useful instructions, but neither supplies an example. A learner who has asked for the third level of help receives another abstract step instead of a concrete case to follow. Evidence: both exercises, all five hints opened in every viewport/theme combination; see the `*-text.txt` records. Direction: give the third hint a small illustrative case that supports the next step without disclosing the exercise's complete solution, or reconcile the hint's role with its displayed heading.

2. **Minor: the model note introduces unexplained jargon.** Quote: “The simulator knows its mapped memory regions, but it does not infer these C data contracts for you.” The previous sentence identifies the two requirements, but “infer” and “data contracts” make the consequence unnecessarily abstract. Neither the front-page prerequisites nor earlier lesson prose explains a C “data contract”. “Mapped” also adds terminology beyond Module 6's “prepared memory regions”. Direction: name the capacity and terminator requirements directly and state what the simulator does not check automatically. The engineering detail about mapping is unnecessary to that point.

A snapshot-only terminology issue was also observed: “The caller must supply a capacity no larger than the readable byte array.” The formal caller/callee distinction is introduced later, in Module 9. The working source already replaces “caller” with “The code that calls `label_length`”, so this does not require another source change; confirm that wording in the rebuilt page.

## Assumed knowledge audit

The following dependencies were checked against prerequisites or earlier lessons:

- Small C functions, `return`, `if`, loops and array indexing are listed in “Before you start”.
- GCC and `-O1` are explained in “Meet the machine”: “GCC, a C compiler” and “It asks the compiler to make the code shorter and faster.”
- Hexadecimal byte and register displays are introduced before this module.
- Pointers, dereferencing and `const` are explained in “Memory and addresses”: “`distance` holds the address of an unsigned value” and “`const` says this function cannot change the value through this pointer.” That lesson also gives the target's `char` and `long` widths.
- The byte-load instructions and signed/unsigned load distinction are covered by Module 6.
- `cbz` and `cbnz` are explained in “Branches”: “`cbz` goes when the register is 0” and “`cbnz` goes when the register is not 0.”
- Indexing by byte offset and post-index pointer updates are explained in the immediately preceding “Array addresses” lesson.
- ASCII, string and terminator are explained on this page before the exercises. `break` is explained in the opening expandable note: “`break` exits the nearest enclosing loop.” Capacity is also defined there and repeatedly applied in the main explanation.
- Unexplained assumptions found: “data contracts” and “mapped” in the model note, plus the snapshot-only use of “caller” described above. No additional instruction or C-language prerequisite gap was found.

## Browser and exercise evidence

- Read the page from opening question through reflection; opened the C-loop note and inspected the figure text and memory/register layout.
- Inspected screenshots from all four viewport/theme combinations. No page-level horizontal overflow or browser exception occurred. The phone layout stacks the register displays and remains readable.
- Both prediction panels initially gated their dependent figures. Checking a deliberately wrong choice revealed feedback and opened the associated figures; all five initial gates were gone after both predictions were checked.
- Advanced the bounded scan through its load and loop-control instructions. The next-instruction indicator, C-line highlight and register display changed together.
- Ran both unchanged exercise starters: each reported that none of its five tests passed, with input/actual/expected feedback. All five hints for each exercise were reachable in every viewport/theme combination.
- On the phone viewport, submitted the existing reference artifact to each exercise to check the UI and grader connection. Each reported “All 5 tests passed” and “COMPLETE”. No reference artifact or challenge answer is reproduced in this note.
- Switched both completed artifacts to Tap, opened their byte-load instruction rows, and switched back to Text. The artifacts were preserved exactly, including the indexed and post-index address forms. Screenshots: `phone-editor-0.png` and `phone-editor-1.png`.

These observations cover learner comprehension and the exercised browser paths. They are not a substitute for the independent technical review or differential machine checks. The accepted fixes still need a checker pass against a rebuilt page.
