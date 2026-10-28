# Module 11: Where C and the machine disagree (lesson text)

Drafted in a separate Codex session from the checked facts, compiler records and simulator results. Sources are recorded in the module brief and listings. Independent review and validation are recorded separately.

This file contains learner-facing prose, hints and labels word for word. Passage headings are editorial markers.

# Lesson 1: C overflow and machine results

## 0. Objectives

- distinguish a defined instruction result from undefined C behaviour;
- explain why a compiler can remove a signed-overflow test;
- check a signed bound before performing arithmetic.

## 1. Why did the compiler remove the addition?

The trip computer wants to know whether a signed distance can increase. The C expression `distance + 1 > distance` appears to ask whether adding one made it larger. **Why does the recorded compiler output return true without performing an addition?**

*Closed note: The compiler and the C rules*

These records use GCC 16.1 for little-endian AArch64 Linux. Unless a figure says otherwise, the settings are `-O1 -std=c23`: the same optimisation level used earlier, with C23 language rules selected.

The course cites the public C draft N3096. A recorded instruction sequence shows what this compiler produced. The C rules determine which source-program behaviours an implementation must support.

*End of closed note.*

## 2. C does not promise signed wrapping

On this target, a signed `int` ranges from −2147483648 to 2147483647. C's `<limits.h>` header provides the names `INT_MIN` and `INT_MAX` for these bounds. `#include <limits.h>` makes those names available to the source.

Adding one to `INT_MAX` overflows signed `int`. C describes this as **undefined behaviour**: the language places no requirements on what the program does in that case. It does not promise a wrapped value, a random value or an error message.

Whenever this signed addition is defined, adding one makes the value larger. GCC can therefore replace the comparison with true. It has no obligation to preserve a particular result for the overflowing input. The processor executes the resulting instructions; it does not know that a C expression was signed.

Module 10’s small compiler checks its own supported language. It is not a general detector of undefined C behaviour.

## 3. Add at the signed limit in A64

Now run a separate assembly experiment: `adds w0, w0, #1` with `w0` initially holding 2147483647. This executes A64 directly. It is not an execution of the original C expression.

**What bit pattern does the addition leave in `w0`?**

*After committing the prediction:*

It leaves `0x80000000`, whose signed 32-bit reading is −2147483648. The flags are `N=1, Z=0, C=0, V=1`: the top result bit is set, the result is nonzero, there is no unsigned carry, and signed overflow occurred.

A64 defines those bits and flags. C does not require a compiler to implement an overflowing signed C expression with this instruction sequence.

## 4. Compare two compiler contracts

Compare the two recorded compilations of `can_increment`. The second adds GCC's `-fwrapv` setting, which promises wrapping signed addition, subtraction and multiplication. This is an extra compiler guarantee, not the standard C rule.

With wrapping required, the compiler must account for the input at the top of the signed range. It can compare the original input with the limit instead of literally adding one. A compiler setting changes the behaviour that must be preserved; it does not necessarily require one particular instruction.

`-fwrapv` does not define every otherwise undefined operation. It does not, for example, make C division by zero valid.

## 5. Test the limit first

Test the input against its limit before calculating a value that might overflow. First write the limit test on its own.

### Write increment_limit

Write `increment_limit`. A signed distance arrives in `w0`. Return 1 if it equals `INT_MAX`, or 0 otherwise. You may use `w1` as a temporary register. Do not add one to the distance to perform this test.

*Hints, in order:*

- Compare the original distance with the maximum signed value.
- Do not increment the distance before testing it. Test the original input against 2147483647.
- For input zero, the answer is zero: it does not equal the maximum signed value. The check reports equality, not the incremented distance.
- The result must be one only when the inputs are equal, so use `cset` with the equality condition.
- Write `mov w1, #2147483647`, `cmp w0, w1`, `cset w0, eq` and `ret`.

## 6. Require signed wrapping with a compiler option

Run the original `can_increment` source compiled with `-fwrapv`, using `INT_MAX` as the distance. The compiler must now preserve the wrapping rule for the signed addition.

**Does this compiled function return 0 or 1?**

*After committing the prediction:*

It returns 0. Under `-fwrapv`, adding one to the maximum signed value wraps to the minimum signed value, so the comparison is false.

The recorded instructions obtain that answer by comparing the original input with `INT_MAX`. They do not need an overflowing addition. This is the result of this GCC setting and source, not a promise about every compiler configuration.

## 7. Check the operands before adding

For ordinary signed C, check the operands before an addition that might overflow. Testing `a + b` after calculating it is too late if that calculation already has undefined behaviour.

For a positive `b`, the sum is too large when `a > INT_MAX - b`. For a negative `b`, the sum is too small when `a < INT_MIN - b`. Evaluate each bound subtraction only in its corresponding branch. Those subtractions stay within range there.

The one-step increment needs only the upper-bound check. If the input equals `INT_MAX`, keep it unchanged. Otherwise, adding one is representable, including for every negative input.

## 8. Stop at the maximum

`safe_increment` follows that rule: return the maximum unchanged, otherwise add one. Its result stops increasing at the maximum, a behaviour called **saturation**. Every signed input has a defined result.

After you complete the exercise, you can inspect a recorded branch listing made with `-O1 -std=c23 -fno-if-conversion -fno-if-conversion2`. The extra settings keep this conditional as a branch so you can inspect it. Ordinary `-O1` uses a different instruction outside the course's taught subset.

Use the same order elsewhere: decide whether the operation is allowed, then perform it. Module 5's unsigned loops and Module 8's division examples show other places where a machine result and a source-language rule must be distinguished.

*Closed note: The minimum value and text input*

The signed range is asymmetric: its minimum has no matching positive `int` value on this target. Negating `INT_MIN` in signed `int` overflows.

A text parser converts written digits into an integer. One approach starts at zero and reads the digits in order. For each digit, it multiplies the current value by ten and adds the digit’s value. If the text begins with a minus sign, it negates the result.

That approach fails for `-2147483648` when the accumulated value is an `int`. Building positive 2147483648 already exceeds the range, before the final negation. Use a wider type with checks, or check each step while accumulating a negative value. The sign at the end cannot repair earlier undefined arithmetic.

*End of closed note.*

## 9. Write a safe increment

### Write safe_increment

Write `safe_increment`. A signed distance arrives in `w0`. If it is `INT_MAX`, return it unchanged. Otherwise, return the distance plus one in `w0`.

Use a comparison before the addition to follow the C-safe approach shown above. The tests check the returned values, including both signed limits. They do not prove the safety of an arbitrary C program.

*Hints, in order:*

- There are two paths: return the maximum unchanged, or add one.
- Adding before checking can already overflow. Compare the input with 2147483647 first.
- For input zero, the limit check allows the addition and the function returns 1. Only the maximum value must skip that addition.
- On the other path, add one to `w0`, then return.
- Write `mov w1, #2147483647`, `cmp w0, w1`, `b.eq done` and `add w0, w0, #1`. Put `ret` under `done:`.

## 10. What you now know

- A64 defines instruction results that signed C overflow does not promise.
- Undefined behaviour gives no required result for the affected C case.
- A compiler can use the rules for defined inputs to remove a calculation.
- A documented option such as `-fwrapv` changes some of those rules.
- Check signed arithmetic bounds before performing the operation.


## Figure captions and labels

can_increment in C and GCC’s ordinary recorded output.

Predict the bits from a direct A64 addition.

Inspect the A64 result and all four flags.

Compare the recorded ordinary and -fwrapv compilations.

Test the original input against the signed limit.

Predict the result required when signed wrapping is enabled.

Follow the comparison emitted with -fwrapv.

Inspect safe_increment with the conditional kept as a branch.

Guard the increment at the signed upper limit.

Ordinary GCC settings

With GCC -fwrapv

0x7fffffff

0x80000000

0x00000000

0

1

Test zero

Test one

Test the value below the maximum

Test the maximum signed value

Test the minimum signed value

Test minus one

Increment zero

Increment one

Reach the maximum

Keep the maximum unchanged

Increment the minimum

Increment minus one

## Originality record

A signed-overflow puzzle presented as surprising compiler behaviour.

A trip-distance increment separates a direct A64 experiment from two recorded compiler contracts. The learner first writes a boundary test, then reuses that test to make a defined saturating increment.

# Lesson 2: Conversions and checked arithmetic

## 0. Objectives

- separate narrowing, promotion and arithmetic rules;
- check whether an input fits before converting it;
- store an addition result and report signed overflow.

## 1. Which check preserves the intended value?

A trip reading can change width before an arithmetic calculation. Each step follows its own rules. **Which checks preserve the value you meant to keep?**

The two recorded functions convert a 32-bit input to a byte-sized type, then return it in a wider register. One selects `unsigned char`; the other selects `signed char`.

*Closed note: Conversion rules for this compiler*

These records use GCC 16.1 with `-O1 -std=c23` for little-endian AArch64 Linux. Here, `unsigned char` ranges from 0 to 255 and `signed char` from −128 to 127.

Under the course's cited draft N3096, an out-of-range conversion to a signed integer type follows the implementation's documented choice, or an implementation-defined signal. GCC documents keeping the low destination-width bits and interpreting them in the destination type, without a signal. This is a conversion rule, separate from undefined signed arithmetic overflow.

*End of closed note.*

## 2. A conversion is not a range check

A cast requests a conversion. Converting to `unsigned char` reduces the value modulo 256. This GCC version keeps the low byte with `and`. For `signed char`, GCC's documented choice also keeps the low byte, then interprets that byte as signed. Its `sxtb` extends that signed byte to the 32-bit result.

Narrowing can change the value without being signed arithmetic overflow. If the application must reject a value that does not fit, check the original value before converting it. A conversion is not itself a range check.

## 3. Narrow a signed gradient

`narrow_gradient` receives the signed value 200 and converts it to `signed char` before returning it as `int`.

**What bit pattern does this recorded function return in `w0`?**

*After committing the prediction:*

It returns `0xffffffc8`, the signed 32-bit representation of −56. GCC's conversion keeps the low byte `c8`; its top bit is one, so sign extension fills the rest of `w0` with ones.

The write to `w0` still clears the upper 32 bits of `x0`. Read the result as signed 32-bit `w0`, not as a negative 64-bit `x0` value.

## 4. Follow the conversions before arithmetic

A small stored type does not mean arithmetic stays at that width. C first converts many narrow integer values to `int`; this is an **integer promotion**. All values of `signed char` on this target fit in `int`.

In `promoted_gradient`, the input 127 becomes an `int` before one is added. The result is 128, which fits in `int`. No signed-byte addition takes place, and this calculation does not overflow.

Mixed signed and unsigned arithmetic has another conversion rule. For `int` compared with `unsigned int` on this target, the signed operand converts to unsigned. In `mixed_limit`, −1 becomes 4294967295 before comparison with 1, so the less-than result is false. The registers have not acquired types; the compiler has chosen an unsigned comparison.

## 5. Check whether fuel fits in a byte

Decide whether fuel fits in one unsigned byte before narrowing it. Use the input's unsigned interpretation when comparing it with the limit.

### Write fuel_fits

Write `fuel_fits`. An unsigned fuel value arrives in `w0`. Return 1 if it is in the range 0 to 255, or 0 otherwise. Check the original value; do not narrow it first.

*Hints, in order:*

- Every input is unsigned, so it is already at least zero.
- Do not narrow the value before checking it. That would discard the bits that show whether it exceeds 255.
- Input zero fits in a byte, so the check returns 1. The returned value reports whether the input fits; it is not the input itself.
- Use the unsigned lower-or-same condition, `ls`, to produce the boolean result.
- Write `cmp w0, #255`, `cset w0, ls` and `ret`.

## 6. Using carry to report signed overflow

This course-written assembly attempts to report signed addition overflow. It adds a signed distance and adjustment, stores the low 32 result bits, then uses the carry flag for its report. Its inputs are `INT_MAX` and 1. The result pointer in `x2` identifies a valid four-byte output slot.

**What overflow flag does this function return in `w0`?**

*After committing the prediction:*

It returns 0, which is the wrong report for these signed inputs. The addition sets `V=1` for signed overflow but leaves `C=0`. `cset w0, cs` asks about unsigned carry, so it misses this signed overflow.

The stored bytes are `00 00 00 80`, the low result bits in little-endian order. Storing them leaves the arithmetic flags unchanged. The four bytes after the result slot are also unchanged.

## 7. Return a checked-add result and its status

C23 provides checked integer arithmetic in `<stdckdint.h>`. `ckd_add(result, a, b)` calculates the mathematical sum and reports whether it fits the type pointed to by `result`. The result pointer comes first.

```c
#include <stdckdint.h>
_Bool checked_trip(int distance, int adjustment, int *result)
{
    return ckd_add(result, distance, adjustment);
}
```

The return value is a boolean: true, represented by 1, means the sum does not fit; false, represented by 0, means it fits exactly. The `_Bool` type in the recorded function holds such a value. The operation writes a destination-width result even when it reports overflow, so do not use that stored value as a valid mathematical sum without checking the report.

For the signed 32-bit destination here, GCC can use `adds` to obtain both the low result bits and the overflow flag. A store can save those bits without changing the flags. A following `cset` can then turn the signed-overflow condition into the boolean return value. No external library call is needed in this recorded example.

## 8. Choose checks for the required property

Choose the check from the property you need. A bounds check before narrowing protects a required range. Checked arithmetic reports whether a mathematical result fits.

The next exercise applies checked addition to signed 32-bit inputs and a signed 32-bit destination. C23 checked arithmetic also supports other integer types; this exercise covers one case. Keep the stored sum bits separate from the returned overflow report. Formatting and run-time checks are further topics in the reflection detail after the exercise.


## 9. Write a checked trip adjustment

### Write checked_trip

Write `checked_trip`.

- The signed distance arrives in `w0`.
- The signed adjustment arrives in `w1`.
- `x2` holds the address of a four-byte result slot.

 Store the low 32 bits of the sum of distance and adjustment in the result slot. Return 1 in `w0` if the signed mathematical sum does not fit in 32 bits, or 0 if it does.

Leave the four bytes following the result slot unchanged. Store the sum before replacing `w0` with the overflow report. This assembly exercise implements the checked-add contract; it deliberately preserves the low result bits even when overflow is reported.

*Hints, in order:*

- The result has two parts: stored sum bits and a boolean report.
- An ordinary `add` does not update V. Use an addition that sets the flags.
- For inputs 1 and 2, store the sum 3 and return zero for no overflow. The stored result and the returned report are different values.
- Signed overflow is recorded in V. Use the `vs` condition to turn it into 1 or 0.
- Write `adds w0, w0, w1`, `str w0, [x2]`, `cset w0, vs` and `ret`.

## 10. What you now know

- A conversion and an arithmetic operation follow separate rules.
- Narrow values can be promoted before arithmetic.
- Mixed signed and unsigned expressions can select an unsigned comparison.
- Checked addition reports whether the mathematical sum fits its destination.
- Test the report before treating stored result bits as a valid sum.

*Closed note: Formatting and run-time checks*

The C function `printf` prints formatted text. Its first argument is a format string: text containing codes that describe how to print the following arguments. The code `%d` expects an `int`, and `%u` expects an `unsigned int`. They are not switches for interpreting an arbitrary argument's bits. Use a deliberate conversion when the argument type needs to change. For example, `printf("%u", (unsigned)gradient)` passes an unsigned value; a negative gradient is converted by the unsigned conversion rule.

A narrow integer is promoted when passed to `printf`. A signed-byte value of −2 becomes `int` −2, so `%u` without a cast is not a defined way to print its byte pattern as 254. To request that byte value, convert first to `unsigned char`, then to `unsigned` for `%u`.

Compiler warnings can identify mistakes such as a mismatch between a format and its argument type. You can inspect the [format example’s C source](https://github.com/snowch/assembly-lab/blob/main/docs/notes/module-11/compiler/format_trip.c) and its [recorded compiler warning](https://github.com/snowch/assembly-lab/blob/main/docs/notes/module-11/compiler/format_trip.response.json). This simulator does not run `printf`.

GCC's `-fsanitize=undefined` adds run-time checks for supported undefined operations. A tool that inserts these checks is called a **sanitizer**. The [signed-add source](https://github.com/snowch/assembly-lab/blob/main/docs/notes/module-11/compiler/sanitize_trip.c) and its [recorded compiler output](https://github.com/snowch/assembly-lab/blob/main/docs/notes/module-11/compiler/sanitize_trip.response.json) show the added overflow check and a call to the sanitizer’s reporting function. The course simulator does not run that external function.

A sanitizer checks only paths that execute. Ordinary unsigned wrapping is defined C, so this option does not report it as signed overflow. GCC normally lets execution continue after many reports. This is called recovery; it does not repair the invalid operation or make its result valid. `-fno-sanitize-recover=undefined` makes a detected problem terminate the run. Warnings, tests and run-time checks provide different evidence, and none proves every possible input safe.

*End of closed note.*


## Figure captions and labels

Compare the recorded signed-byte and unsigned-byte conversions.

Predict the returned bits after narrowing the gradient.

Follow byte selection and sign extension.

Compare the two narrowing conversions.

Check an unsigned value before narrowing it.

Predict the overflow report from the wrong flag.

Inspect the stored sum, unchanged neighbouring bytes and returned flag.

Inspect the recorded checked-add function.

Follow the promoted signed-byte input through an int addition.

Follow the comparison after conversion to unsigned.

Store the sum bits and return the signed-overflow report.

Convert to unsigned char

Convert to signed char

0x000000c8

0xffffffc8

0xffffff38

0

1

Accept zero

Accept 127

Accept 128

Accept the maximum unsigned byte

Reject 256

Reject 257

Reject an input with the top bit set

Reject the maximum unsigned input

Add two positive values that fit

Report overflow above the signed maximum

Report overflow below the signed minimum

Add values that cancel

Add two zeros

Keep the signed maximum

Keep the signed minimum

## Originality record

A list of disconnected integer-conversion and format-string surprises.

Trip data moves through byte storage, comparisons and a checked adjustment. A wrong carry-based report leaves visible stored result bytes, connecting the required signed check to the actual destination contract.
