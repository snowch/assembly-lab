# Shared interface checked facts

Objective: distinguish execution time, register writes, visible memory element boundaries and interaction units without changing simulator semantics or revealing predictions.
Prior knowledge: Module 0 introduces named registers and instruction stepping; later input figures need visible before/after context. Array lesson establishes four-byte elements and byte addresses. Apply docs/style.md plain British English, direct instructions and control names.

- trace.ts viewAt.written records register-write events even when bits remain equal. RegisterRow, DecimalRegister and StepperFigure use this set for outline/status. Keep writes visible; label them written. FlagsRow compares values and keeps change wording.
- RunPrediction inputs always come from data.call.args, even after checking. Existing aria label names these as registers before the run but the page lacks that visible label.
- BitRow uses long time-specific row names and two mobile columns, the second auto width. Put label and value on their own lines on narrow screens to avoid fragmenting words; retain bit diagram and temporal qualifiers.
- ConstantTester currently accepts uninterrupted decimal or hex strings. Lesson constants group hexadecimal digits with spaces. Validate grouped hex digits, remove grouping before passing the instruction to the assembler; reject split decimal and malformed prefix.
- CompilerPlayground status receives backtick-bearing stepper.ran text but renders it raw. Existing withCode helper renders these spans consistently elsewhere.
- Tap editor unknown-line message refers to chips although mode is named Tap. Use the visible mode name.
- MemoryStepper lays byte cards out with unconstrained wrapping. For explicitly declared arrays only, group contiguous byte cards by an optional elementBytes count from memory.address, index from optional firstElement. Keep address/access/transfer display computed from original trace. Validate group length and do not infer types for arbitrary memory.
