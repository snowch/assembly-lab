# Module 7: Arrays, strings and pointers (lesson text)

Drafted in a separate Codex session from the checked facts, compiler records and simulator results. Sources are recorded in the module brief and listings. Independent review and validation are recorded separately.

This file contains learner-facing prose, hints and labels word for word. Passage headings are editorial markers.

# Lesson 1: Array addresses and moving pointers

## 0. Objectives

- translate an array index into a byte address;
- distinguish offset, pre-index and post-index loads;
- walk a trip log without reading beyond its entries.

## 1. How does a load choose an array element?

The trip computer keeps its completed journeys in a log. Each journey occupies the same amount of memory. **How can a load find one journey from its position in the log?**

An **array** stores values of one type in consecutive memory locations. Each value is an **element**. Its position is its **index**, counted from zero. In C, `trips[index]` reads the element at that index.

*Closed note: The compiler and valid array accesses*

These listings use GCC 16.1 with `-O1` for little-endian AArch64 Linux. An `unsigned` element occupies four bytes on this target. The examples supply valid array indices. In C, an address being readable does not by itself make an array access valid: the access must stay within the array object.

*End of closed note.*

## 2. Scale the index by the element size

The log contains the unsigned values `12, 25, 7, 40`. Index zero selects the first value. Each element occupies four bytes, so each increase in the index moves the address forward by four bytes.

In `ldr w0, [x0, x1, lsl #2]`, `x0` holds the array's starting address and `x1` holds the index. The load shifts the index left by two places, which multiplies it by four, then adds it to the starting address. It reads four bytes from that address.

The shift is part of calculating the address. It does not change `x1`. The load replaces register 0 with the value it reads, so `x0` no longer holds the array's starting address afterwards.

## 3. Read the third journey

The log still contains `12, 25, 7, 40`. `x0` points to its first element, and `x1` holds index 2.

**What does `read_trip` return in `w0`?**

*After committing the prediction:*

It returns `0x00000007`, or 7. Index 2 selects the third element. The scaled index is eight bytes, so the load starts eight bytes after the beginning of the array.

## 4. Compare three ways to address memory

Press Next in the comparison, then choose another addressing form. The view keeps the same instruction step so you can compare the address used and `x0` before and after. The three loads use different rules for updating the pointer.

`[x0, #4]` accesses memory four bytes after `x0` and leaves `x0` unchanged. `[x0, #4]!` first adds four to `x0`, then accesses memory at the updated address. This is **pre-index** addressing.

`[x0], #4` accesses memory at the old address, then adds four to `x0`. This is **post-index** addressing. The number after the brackets is still a byte count.

All three examples load into `w2`, keeping the loaded value separate from the pointer. Compare both registers, not just the value loaded.

## 5. Write an indexed load

Choose an element by scaling its index to a byte offset. The element's size decides the scale.

### Write read_trip

Write `read_trip`. `x0` holds the starting address of an array of four-byte unsigned values. `x1` holds a valid index into that array. Return the selected value in `w0`, leaving memory unchanged.

*Hints, in order:*

- An index counts elements. A memory address counts bytes.
- Using the index without scaling treats an element count as a byte count. Each element here occupies four bytes.
- For index zero, the byte offset is zero and the load reads the first value, 12. Scale other indices by the element size.
- Use the scaled index inside the load's brackets, alongside `x0`.
- Use `ldr w0, [x0, x1, lsl #2]`, then `ret`.

## 6. An index used as a byte offset

The changed assembly leaves out `lsl #2`. It uses `ldr w0, [x0, x1]` with the same log and index 2. The instruction now treats the index as a byte offset.

This is an assembly experiment within the prepared memory region. It is not an example of a valid C access to the third element.

**Which value does the changed load put in `w0`?**

*After committing the prediction:*

It loads `0x00190000`, or 1638400. The access begins two bytes after the array's start, halfway through its first element. The four bytes there are `00 00 19 00`. Little-endian order combines them into `0x00190000`.

The load still reads four bytes. Removing the scale changed where those bytes came from.

## 7. Move through the array

Keep two decisions separate: the address used by the load, and whether the instruction updates the pointer. Scaling an index chooses an element. Pre-index and post-index forms can also move the pointer for the next access.

C pointer arithmetic uses the pointed-to type. For an `unsigned *` here, `trips + 1` points to the next four-byte element. It does not mean one byte later. `*trips++` reads through the old pointer and then advances the pointer by one element.

In the C loop, `total += *trips++` adds the value read to `total`. For an ordinary variable, `total += value` means `total = total + value`.

The recorded `sum_trips` uses a post-index load to advance by four bytes after each read. Its end address comes from `add x3, x0, w1, uxtw 2`: zero-extend the count in `w1`, shift it left by two, then add the starting address. `uxtw` selects zero extension from 32 to 64 bits.

After calculating the end address, this listing no longer needs the count in `w1`. The load reuses `w1` for each array element. GCC has replaced the C loop's decreasing count with a comparison of the moving pointer in `x2` against the end address in `x3`. There is no separate instruction for `count--` in this listing.

## 8. Choose the stopping point

A loop over an array needs a position and a stopping rule. You can count down the remaining elements, or compare the moving pointer with an end address. Check the empty case before the first load.

C allows a pointer to reach the position immediately after an array. That position is useful as a stopping point, but you must not read an element there. The element count must describe memory the function is allowed to read.

The sum in this example is unsigned. Like the additions in earlier modules, it wraps modulo 2³² if the total exceeds the range of `unsigned` on this target.

## 9. Add the trip distances

### Write sum_trips

Write `sum_trips`. `x0` holds the start of an array of four-byte unsigned distances, and `w1` holds the number of elements to add. Return their unsigned 32-bit sum in `w0`. Leave memory unchanged.

A zero count must return zero without reading memory. For a nonzero count, the exercise supplies at least that many elements. The tests include a sum that wraps.

*Hints, in order:*

- Keep the pointer in another register before using `w0` for the total.
- Do not read the first element when the count is zero. Return the initial total of zero.
- With a count of one, read only the first distance, 12. Add it to the zero total, then stop.
- Add the loaded value to the total. Decrease the count, and repeat while it is nonzero.
- One complete solution is:

```asm
mov x2, x0
mov w0, #0
cbz w1, done
loop:
ldr w3, [x2], #4
add w0, w0, w3
subs w1, w1, #1
b.ne loop
done:
ret
```

## 10. What you now know

- An array index counts elements, starting at zero.
- Scale the index by the element's size to obtain a byte offset.
- An offset can select an address without changing the pointer.
- Pre-index updates the pointer before an access; post-index updates it afterwards.
- A loop must stop before it reads beyond the array.

Why does `p + 1` move by four bytes when `p` points to an `unsigned` on this target?

*Closed note: Answer*

C pointer arithmetic advances by elements of the pointed-to type. An `unsigned` occupies four bytes on this target, so moving to the next element adds four to the byte address.

*End of closed note.*

## Model and reality

The byte diagrams come from the simulator's memory accesses. The simulator checks whether an address lies in its prepared memory, but it does not track C array objects or enforce C pointer rules. A simulated load succeeding is not proof that the corresponding C expression is valid.

The examples use ordinary memory and omit caches, access timing and operating-system permissions.

## Figure captions and labels

read_trip in C and the instructions GCC made from it.

Predict which array element the scaled load reads.

Follow the selected bytes into w0.

Use an offset without changing x0.

Update x0 before the load.

Load from x0, then update it.

Write and test an indexed load.

Predict the value loaded without the index scale.

Inspect the bytes read by the unscaled load.

Follow the compiled sum_trips through the trip log.

Write a loop that adds the requested entries.

0x00000019

0x00000007

0x00000028

0x00190000

0x00000007

0x00000019

Read index zero

Read index two

Read index three

Read an element with every bit set

Read a zero element

Add no entries

Add the first entry

Add the first three entries

Add all four entries

Add values whose sum wraps

## Originality record

Summing an anonymous integer array with an index.

A trip log connects element size to its byte layout. Three computed loads separate address selection from pointer movement, and a missing scale exposes bytes spanning neighbouring distances.

## Figure captions and labels

[x0, #4]: offset

[x0, #4]!: pre-index

[x0], #4: post-index

Compare the address used and x0 before and after each load.

# Lesson 2: Strings and the zero byte

## 0. Objectives

- follow a byte scan to its terminator;
- bound a scan by the number of readable bytes;
- count matching bytes without counting beyond the string.

## 1. Where does a label end?

The trip computer also stores short labels. A label can use fewer bytes than its storage allows. **How can a program find where its text ends?**

In the C loop, `break` exits the nearest enclosing loop.

A C **string** is a sequence of characters stored in bytes, ending with a zero byte. That final byte is the **terminator**. The terminator marks the end and is not counted in the string's length.

These examples use ASCII, a character encoding that assigns byte values to letters, digits and punctuation. The label `A-B-C` uses the bytes `65, 45, 66, 45, 67`, followed by zero.

*Closed note: The C loop and its boundary*

The recorded listing uses GCC 16.1 with `-O1` for little-endian AArch64 Linux. `label_length` accepts a pointer to bytes and a capacity: the maximum number of bytes it may read.

The function returns the number of bytes before the first zero, or the capacity if it finds no zero within that limit. A byte array without a zero in the readable region is not a complete C string.

*End of closed note.*

## 2. Read one byte and test it

Each element here occupies one byte, so its index is already a byte offset. `ldrb w2, [x3, x0]` reads the byte whose index is in `x0`, starting from the address in `x3`. No scaling shift is needed.

After a load, `cbz` can test whether the byte is zero. The loop counts a byte only if it is nonzero. It must also stop at the capacity, even if no terminator has appeared.

The code that calls `label_length` must supply a capacity no larger than the readable byte array. A bound protects the scan only when that bound is valid.

## 3. Find the first zero

The prepared bytes are `65, 45, 66, 45, 67, 0, 88, 0`. The capacity is 8. The bytes hold the label `A-B-C`, its zero terminator and more bytes after it.

**What length does `label_length` return in `x0`?**

*After committing the prediction:*

It returns `0x0000000000000005`, or 5. The loop counts the five bytes before the first zero. It excludes the zero itself and does not count the later byte `88`.

## 4. Follow the scan through memory

Step through the scan and watch which byte each load highlights. The recorded function uses an index. The course-written version below uses a moving pointer with `ldrb w3, [x2], #1`. It reads one byte, then advances the pointer by one byte.

The moving-pointer version assumes a terminator exists in readable memory. Compare it with the bounded version, which also has a capacity test.

For an empty string, the first byte is already zero. The scan must return zero without counting that byte.

## 5. Write a bounded length function

Write a scan that stops at either the first zero or the supplied capacity. Both stopping rules matter.

### Write label_length

Write `label_length`. `x0` holds the starting address of a byte array, and `x1` holds its capacity. Return the number of bytes before the first zero in `x0`. If every byte within the capacity is nonzero, return the capacity.

A zero capacity must return zero without reading memory. The supplied capacity never exceeds the readable array. Leave memory unchanged.

*Hints, in order:*

- Keep the starting address in another register before using `x0` for the length.
- A zero capacity permits no read, even to check for a terminator. Test the capacity before loading.
- For bytes `65, 0, 66, 67` and capacity 4, count the first byte, then stop at zero. The length is 1.
- Return if the loaded byte is zero. Otherwise increase the length, and repeat only while it is below the capacity.
- One complete solution is:

```asm
mov x3, x0
mov x0, #0
cbz x1, done
loop:
ldrb w2, [x3, x0]
cbz w2, done
add x0, x0, #1
cmp x0, x1
b.ne loop
done:
ret
```

## 6. Counting the terminator

The changed moving-pointer loop increases the length before checking whether the loaded byte is zero. It reads the same prepared `A-B-C` label.

**What value does this changed loop return in `w0`?**

*After committing the prediction:*

It returns `0x00000006`, or 6. The loop increases the count for each of the five text bytes, then increases it again for the terminator. An empty string would also be counted incorrectly: its zero byte would add one.

## 7. Count only the bytes that belong to the label

The zero test must control whether a byte contributes to the length. In the working loop, a zero byte takes the exit before the count increases. In the changed loop, the count has already increased when that exit happens.

The ASCII character `0` is different from a zero byte. Its byte value is 48, so it is part of the text and does not end the string.

These examples count bytes. Each ASCII character used here occupies one byte. Other text encodings can use several bytes for one character, so counting nonzero bytes does not generally count displayed characters.

## 8. Use the right stopping rule

A scan needs a stopping rule that matches the data. A valid terminated string ends at its zero byte. A bounded scan must also stop before its next read would reach the capacity.

If a bounded scan reaches the capacity, its return value tells you that no zero occurred within that region. It does not establish where a terminator might occur later.

You can inspect each nonzero byte for another purpose, such as counting separators. Keep the end-of-string test separate from the test for the byte you want to count.

## 9. Count a marker in the label

### Write count_marker

Write `count_marker`. `x0` points to a valid zero-terminated ASCII label. `w1` holds a nonzero ASCII byte to count. Return its number of occurrences before the first zero in `w0`. Leave memory unchanged.

The exercise supplies a terminator within readable memory. Do not count any matching byte after that terminator. The tests include an empty label and the ASCII character `0`.

*Hints, in order:*

- Keep a pointer to the current byte and a separate count of matches.
- Do not compare or count bytes after the zero terminator, even if they match the marker.
- For bytes `0, 45` and marker 45, return zero matches. The first byte ends the string, so the later 45 must not count.
- Increase the count only when the byte equals `w1`, then continue to the next byte.
- One complete solution is:

```asm
mov x2, x0
mov w0, #0
loop:
ldrb w3, [x2], #1
cbz w3, done
cmp w3, w1
b.ne next
add w0, w0, #1
next:
b loop
done:
ret
```

## 10. What you now know

- A zero byte ends a C string and is excluded from its length.
- A byte array can contain more data after that terminator.
- ASCII `0` is a text character, not a terminator.
- A bounded scan checks its capacity before reading another byte.
- A byte count need not equal a displayed-character count.

Why is the capacity still necessary when a byte array is expected to contain text?

*Closed note: Answer*

The readable region might not contain a zero byte. A valid capacity gives the loop a stopping point even when the expected terminator is missing.

*End of closed note.*

## Model and reality

The figures show prepared ASCII bytes in ordinary memory. The bounded function relies on a valid capacity; the moving-pointer examples rely on a valid terminator. The simulator checks whether each memory access stays within its prepared memory. It does not check that the supplied capacity or terminator meets the function’s requirements.

The course does not decode multi-byte text encodings or model the time needed to read memory.

## Figure captions and labels

label_length in C and the instructions GCC made from it.

Predict the length before the first zero byte.

Follow the bounded scan through the label.

Inspect a scan whose first byte is zero.

Write and test a bounded byte scan.

Predict the result when the count increases before the zero test.

Follow the loop that counts the terminator.

Inspect a bounded scan with no zero byte within its capacity.

Follow a pointer that advances one byte after each load.

Count matching bytes before the first zero.

0x0000000000000008

0x0000000000000006

0x0000000000000005

0x00000006

0x00000005

0x00000008

Scan A-B-C within its capacity

Scan an empty label

Read no bytes with zero capacity

Reach the capacity without finding zero

Stop at a zero before the capacity

Count separators in A-B-C

Count within an empty label

Ignore a marker after the terminator

Count repeated markers

Count the ASCII character 0

## Originality record

An unbounded strlen implementation over a greeting.

A trip label contains separators and trailing bytes. Bounded scanning, an empty label and a terminator counted too early make the stopping rule observable before the learner writes a marker counter.

# Figure interface
