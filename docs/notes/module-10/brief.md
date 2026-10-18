# Module 10 checked lesson brief

## Prerequisites and implementation

The learner has completed Modules 0–9: unsigned arithmetic, multiplication, branches, loops,
arrays and calls. The optional A32 comparison is not a prerequisite. The compiler's accepted
subset and limits are defined in `docs/notes/checkpoint-5.md`.

The examples are in `content/lessons/c-compiler.listings.ts`. Exact course-compiler listings,
source maps and GCC 16.1 `-O1` requests and responses are retained under `compiler/`. Generated
source maps drive the highlights. The course compiler uses fixed instruction patterns and
makes no optimisation claim. Local execution checks C operations before running A64.

## From C to instructions

Objective: follow a C expression through variables, temporary registers and the return value.

- `trip_charge(distance, rate)` calculates an unsigned product in `charge`, then returns
  `charge + 7`. Parameters use w0 and w1, the local uses w2, and expressions use w8 and w9.
- The compiler uses `movz` to build a constant. Introduce its 16-bit immediate and clearing
  behaviour here. `movk` was introduced in Module 2.
- The first prediction uses distance 6 and rate 4. The result is 31. Keep the result in
  committed feedback until the learner predicts.
- The gated playground edits the actual source, compiles locally, accepts inputs, checks C
  operations, runs the simulator, compares results and steps through the generated instructions.
- The assembly construction exercise implements `distance * rate + 7` modulo 2^32. Cases:
  (6, 4) → 31; (0, 9) → 7; (1, 1) → 8; (4294967295, 1) → 6; (65536, 65536) → 7.
- The failure source removes `+ 7`. The same inputs return 24. A second prediction gates the
  editable failure example.
- The final C exercise calculates a wrapped unsigned product, then caps that stored product
  at `limit`. Cases: (6, 4, 20) → 20; (6, 4, 30) → 24; (0, 99, 10) → 0;
  (4294967295, 2, 100) → 100; (2147483648, 2, 100) → 0. Explain that wrapping precedes the cap.
- Optional comparison sends the source to Compiler Explorer only on a button press, after
  disclosure. It identifies the service, links the privacy policy and same source, caches
  successful responses and leaves all local work available when the network fails.
- GCC may emit instructions outside the simulator's subset. Inspecting its response does not
  imply that every response can run in this simulator.

## Compile a loop

Objective: locate a C loop's initialisation, condition, body, update and backward branch.

- `accumulated_charge(count, rate)` starts an unsigned total and counter at zero, adds the
  rate while `i < count`, then returns the total. Count and rate use w0 and w1; total and
  counter use w2 and w3. Source-line highlighting need not have a one-to-one relationship
  with executed instructions.
- The first prediction uses count 3 and rate 4, producing 12. The playground allows edits
  and input changes only after the prediction has been committed.
- The assembly exercise sums the rate count times, returning the low 32 bits. Cases:
  (0, 7) → 0; (1, 9) → 9; (3, 4) → 12; (5, 4294967295) → 4294967291; (4, 0) → 0.
- Changing `<` to `<=` produces 16 for count 3 and rate 4. Count zero then incorrectly
  executes one iteration. With count UINT_MAX, the comparison is always true for the unsigned
  counter and its increment wraps. A step-budget diagnostic alone is not proof of an infinite
  loop; the condition and wrap explain why this specific loop does not terminate.
- The final C exercise repeats `value = value >> 1` while decreasing a nonzero count.
  Cases: (128, 3) → 16; (128, 0) → 128; (0, 5) → 0; (4294967295, 32) → 0;
  (2147483648, 1) → 1073741824. Distinguish 32 valid single-place shifts from one invalid
  32-bit shift by 32.

## Drafting and review requirements

Each lesson uses the ten standard sections, two mounted exercises and five hints in the
platform's ladder order. Prose, labels and interface copy are separately drafted. Keep
prediction and challenge answers out of unconditional captions and later prose.

Explain the bounded subset and temporary registers where first used. The compiler permits
one unsigned function and at most eight declared variables in total, including parameters.
It imposes source, nesting and execution limits. Invalid executed operations stop before
machine execution. A successful selected run does not prove that every input is defined.

The statement editor and text editor must change the same source. The figures must show
compiler and simulator results, not substituted animations. Independent learner and technical
reviews inspect the built page, including its phone controls, diagnostics and offline behaviour.
