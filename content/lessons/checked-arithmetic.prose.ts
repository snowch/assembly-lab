// Copyright © 2026 Christopher Snow

// Kept word for word in docs/notes/module-11/prose.md.
export const PROSE = {
  question:
    "A trip reading can change width before an arithmetic calculation. Each step follows its own rules. **Which checks preserve the value you meant to keep?**\n\nThe two recorded functions convert a 32-bit input to a byte-sized type, then return it in a wider register. One selects `unsigned char`; the other selects `signed char`.",
  questionNoteSummary: "Conversion rules for this compiler",
  questionNote:
    "These records use GCC 16.1 with `-O1 -std=c23` for little-endian AArch64 Linux. Here, `unsigned char` ranges from 0 to 255 and `signed char` from −128 to 127.\n\nUnder the course's cited draft N3096, an out-of-range conversion to a signed integer type follows the implementation's documented choice, or an implementation-defined signal. GCC documents keeping the low destination-width bits and interpreting them in the destination type, without a signal. This is a conversion rule, separate from undefined signed arithmetic overflow.",
  motivation:
    "A cast requests a conversion. Converting to `unsigned char` reduces the value modulo 256. This GCC version keeps the low byte with `and`. For `signed char`, GCC's documented choice also keeps the low byte, then interprets that byte as signed. Its `sxtb` extends that signed byte to the 32-bit result.\n\nNarrowing can change the value without being signed arithmetic overflow. If the application must reject a value that does not fit, check the original value before converting it. A conversion is not itself a range check.",
  prediction:
    "`narrow_gradient` receives the signed value 200 and converts it to `signed char` before returning it as `int`.",
  predictionQuestion: "**What bit pattern does this recorded function return in `w0`?**",
  predictionExplain:
    "It returns `0xffffffc8`, the signed 32-bit representation of −56. GCC's conversion keeps the low byte `c8`; its top bit is one, so sign extension fills the rest of `w0` with ones.\n\nThe write to `w0` still clears the upper 32 bits of `x0`. Read the result as signed 32-bit `w0`, not as a negative 64-bit `x0` value.",
  investigation:
    "A small stored type does not mean arithmetic stays at that width. C first converts many narrow integer values to `int`; this is an **integer promotion**. All values of `signed char` on this target fit in `int`.\n\nIn `promoted_gradient`, the input 127 becomes an `int` before one is added. The result is 128, which fits in `int`. No signed-byte addition takes place, and this calculation does not overflow.\n\nMixed signed and unsigned arithmetic has another conversion rule. For `int` compared with `unsigned int` on this target, the signed operand converts to unsigned. In `mixed_limit`, −1 becomes 4294967295 before comparison with 1, so the less-than result is false. The registers have not acquired types; the compiler has chosen an unsigned comparison.",
  construction:
    "Decide whether fuel fits in one unsigned byte before narrowing it. Use the input's unsigned interpretation when comparing it with the limit.",
  writeTask:
    "Write `fuel_fits`. An unsigned fuel value arrives in `w0`. Return 1 if it is in the range 0 to 255, or 0 otherwise. Check the original value; do not narrow it first.",
  writeHints: [
    "Every input is unsigned, so it is already at least zero.",
    "Do not narrow the value before checking it. That would discard the bits that show whether it exceeds 255.",
    "Input zero fits in a byte, so the check returns 1. The returned value reports whether the input fits; it is not the input itself.",
    "Use the unsigned lower-or-same condition, `ls`, to produce the boolean result.",
    "Write `cmp w0, #255`, `cset w0, ls` and `ret`.",
  ],
  failureExperiment:
    "This course-written assembly attempts to report signed addition overflow. It adds a signed distance and adjustment, stores the low 32 result bits, then uses the carry flag for its report. Its inputs are `INT_MAX` and 1. The result pointer in `x2` identifies a valid four-byte output slot.",
  failureQuestion: "**What overflow flag does this function return in `w0`?**",
  failureExplain:
    "It returns 0, which is the wrong report for these signed inputs. The addition sets `V=1` for signed overflow but leaves `C=0`. `cset w0, cs` asks about unsigned carry, so it misses this signed overflow.\n\nThe stored bytes are `00 00 00 80`, the low result bits in little-endian order. Storing them leaves the arithmetic flags unchanged. The four bytes after the result slot are also unchanged.",
  explanation:
    "C23 provides checked integer arithmetic in `<stdckdint.h>`. `ckd_add(result, a, b)` calculates the mathematical sum and reports whether it fits the type pointed to by `result`. The result pointer comes first.\n\n```c\n#include <stdckdint.h>\n_Bool checked_trip(int distance, int adjustment, int *result)\n{\n    return ckd_add(result, distance, adjustment);\n}\n```\n\nThe return value is a boolean: true, represented by 1, means the sum does not fit; false, represented by 0, means it fits exactly. The `_Bool` type in the recorded function holds such a value. The operation writes a destination-width result even when it reports overflow, so do not use that stored value as a valid mathematical sum without checking the report.\n\nFor the signed 32-bit destination here, GCC can use `adds` to obtain both the low result bits and the overflow flag. A store can save those bits without changing the flags. A following `cset` can then turn the signed-overflow condition into the boolean return value. No external library call is needed in this recorded example.",
  generalisation:
    "Choose the check from the property you need. A bounds check before narrowing protects a required range. Checked arithmetic reports whether a mathematical result fits.\n\nThe next exercise applies checked addition. Keep the stored sum bits separate from the returned overflow report. Formatting and run-time checks are further topics in the reflection detail after the exercise.",
  finalTask:
    "Write `checked_trip`. Signed distance and adjustment arrive in `w0` and `w1`. `x2` holds the address of a four-byte result slot. Store the low 32 bits of their sum there. Return 1 in `w0` if the signed mathematical sum does not fit in 32 bits, or 0 if it does.\n\nLeave the four bytes following the result slot unchanged. Store the sum before replacing `w0` with the overflow report. This assembly exercise implements the checked-add contract; it deliberately preserves the low result bits even when overflow is reported.",
  finalHints: [
    "The result has two parts: stored sum bits and a boolean report.",
    "An ordinary `add` does not update V. Use an addition that sets the flags.",
    "For inputs 1 and 2, store the sum 3 and return zero for no overflow. The stored result and the returned report are different values.",
    "Signed overflow is recorded in V. Use the `vs` condition to turn it into 1 or 0.",
    "Write `adds w0, w0, w1`, `str w0, [x2]`, `cset w0, vs` and `ret`.",
  ],
  reflection:
    "- A conversion and an arithmetic operation follow separate rules.\n- Narrow values can be promoted before arithmetic.\n- Mixed signed and unsigned expressions can select an unsigned comparison.\n- Checked addition reports whether the mathematical sum fits its destination.\n- Test the report before treating stored result bits as a valid sum.\n\nHow do C types affect machine code beyond choosing signed or unsigned instructions?",
  reflectionNoteSummary: "Answer, formatting and run-time checks",
  reflectionNote:
    "Types also determine conversions and which source operations are defined. A compiler can use those rules to transform or remove calculations before it selects instructions. The registers hold bits, but the source-language rules shape the program that reaches them.\n\nThe C function `printf` prints formatted text. Its first argument is a format string: text containing codes that describe how to print the following arguments. The code `%d` expects an `int`, and `%u` expects an `unsigned int`. They are not switches for interpreting an arbitrary argument's bits. Use a deliberate conversion when the argument type needs to change. For example, `printf(\"%u\", (unsigned)gradient)` passes an unsigned value; a negative gradient is converted by the unsigned conversion rule.\n\nA narrow integer is promoted when passed to `printf`. A signed-byte value of −2 becomes `int` −2, so `%u` without a cast is not a defined way to print its byte pattern as 254. To request that byte value, convert first to `unsigned char`, then to `unsigned` for `%u`.\n\nCompiler warnings can identify mistakes such as a mismatch between a format and its argument type. You can inspect the [format example’s C source](https://github.com/snowch/assembly-lab/blob/main/docs/notes/module-11/compiler/format_trip.c) and its [recorded compiler warning](https://github.com/snowch/assembly-lab/blob/main/docs/notes/module-11/compiler/format_trip.response.json). This simulator does not run `printf`.\n\nGCC's `-fsanitize=undefined` adds run-time checks for supported undefined operations. A tool that inserts these checks is called a **sanitizer**. The [signed-add source](https://github.com/snowch/assembly-lab/blob/main/docs/notes/module-11/compiler/sanitize_trip.c) and its [recorded compiler output](https://github.com/snowch/assembly-lab/blob/main/docs/notes/module-11/compiler/sanitize_trip.response.json) show the added overflow check and a call to the sanitizer’s reporting function. The course simulator does not run that external function.\n\nA sanitizer checks only paths that execute. Ordinary unsigned wrapping is defined C, so this option does not report it as signed overflow. GCC normally lets execution continue after many reports. This is called recovery; it does not repair the invalid operation or make its result valid. `-fno-sanitize-recover=undefined` makes a detected problem terminate the run. Warnings, tests and run-time checks provide different evidence, and none proves every possible input safe.",
  modelVsReality:
    "The steppers execute A64 examples and show their registers, flags and memory. The format warning and sanitizer discussion come from separate recorded compiler evidence. The simulator does not run an output library or sanitizer runtime.\n\nThe checked-add exercise is fixed to signed 32-bit inputs and a signed 32-bit destination. C23 checked arithmetic supports other integer types; its full rules are broader than this one implementation.",
  originalityNote: {
    textbookExample: "A list of disconnected integer-conversion and format-string surprises.",
    howThisDiffers:
      "Trip data moves through byte storage, comparisons and a checked adjustment. A wrong carry-based report leaves visible stored result bytes, connecting the required signed check to the actual destination contract.",
  },
} as const;
