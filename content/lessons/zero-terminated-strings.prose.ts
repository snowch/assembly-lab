// Copyright © 2026 Christopher Snow

// Kept word for word in docs/notes/module-7/prose.md.
export const PROSE = {
  question:
    "The trip computer also stores short labels. A label can use fewer bytes than its storage allows. **How can a program find where its text ends?**\n\nIn the C loop, `break` exits the nearest enclosing loop.\n\nA C **string** is a sequence of characters stored in bytes, ending with a zero byte. That final byte is the **terminator**. The terminator marks the end and is not counted in the string's length.\n\nThese examples use ASCII, a character encoding that assigns byte values to letters, digits and punctuation. The label `A-B-C` uses the bytes `65, 45, 66, 45, 67`, followed by zero.",
  questionNoteSummary: "The C loop and its boundary",
  questionNote:
    "The recorded listing uses GCC 16.1 with `-O1` for little-endian AArch64 Linux. `label_length` accepts a pointer to bytes and a capacity: the maximum number of bytes it may read.\n\nThe function returns the number of bytes before the first zero, or the capacity if it finds no zero within that limit. A byte array without a zero in the readable region is not a complete C string.",
  motivation:
    "Each element here occupies one byte, so its index is already a byte offset. `ldrb w2, [x3, x0]` reads the byte whose index is in `x0`, starting from the address in `x3`. No scaling shift is needed.\n\nAfter a load, `cbz` can test whether the byte is zero. The loop counts a byte only if it is nonzero. It must also stop at the capacity, even if no terminator has appeared.\n\nThe code that calls `label_length` must supply a capacity no larger than the readable byte array. A bound protects the scan only when that bound is valid.\n\nThe simulator checks access to its prepared memory. It does not check that the supplied capacity matches the array or that a terminator exists.",
  prediction:
    "The prepared bytes are `65, 45, 66, 45, 67, 0, 88, 0`. The capacity is 8. The bytes hold the label `A-B-C`, its zero terminator and more bytes after it.",
  predictionQuestion: "**What length does `label_length` return in `x0`?**",
  predictionExplain:
    "It returns `0x0000000000000005`, or 5. The loop counts the five bytes before the first zero. It excludes the zero itself and does not count the later byte `88`.",
  investigation:
    "Step through the scan and watch which byte each load highlights. The recorded function uses an index. The course-written version below uses a moving pointer with `ldrb w3, [x2], #1`. It reads one byte, then advances the pointer by one byte.\n\nThe moving-pointer version assumes a terminator exists in readable memory. Compare it with the bounded version, which also has a capacity test.\n\nFor an empty string, the first byte is already zero. The scan must return zero without counting that byte.",
  construction:
    "Write a scan that stops at either the first zero or the supplied capacity. Both stopping rules matter.",
  writeTask:
    "Write `label_length`. `x0` holds the starting address of a byte array, and `x1` holds its capacity. Return the number of bytes before the first zero in `x0`. If every byte within the capacity is nonzero, return the capacity.\n\nA zero capacity must return zero without reading memory. The supplied capacity never exceeds the readable array. Leave memory unchanged.",
  writeHints: [
    "Keep the starting address in another register before using `x0` for the length.",
    "A zero capacity permits no read, even to check for a terminator. Test the capacity before loading.",
    "For bytes `65, 0, 66, 67` and capacity 4, count the first byte, then stop at zero. The length is 1.",
    "Return if the loaded byte is zero. Otherwise increase the length, and repeat only while it is below the capacity.",
    "One complete solution is:\n\n```asm\nmov x3, x0\nmov x0, #0\ncbz x1, done\nloop:\nldrb w2, [x3, x0]\ncbz w2, done\nadd x0, x0, #1\ncmp x0, x1\nb.ne loop\ndone:\nret\n```",
  ],
  failureExperiment:
    "The changed moving-pointer loop increases the length before checking whether the loaded byte is zero. It reads the same prepared `A-B-C` label.",
  failureQuestion: "**What value does this changed loop return in `w0`?**",
  failureExplain:
    "It returns `0x00000006`, or 6. The loop increases the count for each of the five text bytes, then increases it again for the terminator. An empty string would also be counted incorrectly: its zero byte would add one.",
  explanation:
    "The zero test must control whether a byte contributes to the length. In the working loop, a zero byte takes the exit before the count increases. In the changed loop, the count has already increased when that exit happens.\n\nThe ASCII character `0` is different from a zero byte. Its byte value is 48, so it is part of the text and does not end the string.\n\nThese examples count bytes. Each ASCII character used here occupies one byte. Other text encodings can use several bytes for one character, so counting nonzero bytes does not generally count displayed characters.",
  generalisation:
    "A scan needs a stopping rule that matches the data. A valid terminated string ends at its zero byte. A bounded scan must also stop before its next read would reach the capacity.\n\nIf a bounded scan reaches the capacity, its return value tells you that no zero occurred within that region. It does not establish where a terminator might occur later.\n\nYou can inspect each nonzero byte for another purpose, such as counting separators. Keep the end-of-string test separate from the test for the byte you want to count.",
  finalTask:
    "Write `count_marker`. `x0` points to a valid zero-terminated ASCII label. `w1` holds a nonzero ASCII byte to count. Return its number of occurrences before the first zero in `w0`. Leave memory unchanged.\n\nThe exercise supplies a terminator within readable memory. Do not count any matching byte after that terminator. The tests include an empty label and the ASCII character `0`.",
  finalHints: [
    "Keep a pointer to the current byte and a separate count of matches.",
    "Do not compare or count bytes after the zero terminator, even if they match the marker.",
    "For bytes `0, 45` and marker 45, return zero matches. The first byte ends the string, so the later 45 must not count.",
    "Increase the count only when the byte equals `w1`, then continue to the next byte.",
    "One complete solution is:\n\n```asm\nmov x2, x0\nmov w0, #0\nloop:\nldrb w3, [x2], #1\ncbz w3, done\ncmp w3, w1\nb.ne next\nadd w0, w0, #1\nnext:\nb loop\ndone:\nret\n```",
  ],
  reflection:
    "- A zero byte ends a C string and is excluded from its length.\n- A byte array can contain more data after that terminator.\n- ASCII `0` is a text character, not a terminator.\n- A bounded scan checks its capacity before reading another byte.\n- A byte count need not equal a displayed-character count.\n\nWhy is the capacity still necessary when a byte array is expected to contain text?",
  reflectionNoteSummary: "Answer",
  reflectionNote:
    "The readable region might not contain a zero byte. A valid capacity gives the loop a stopping point even when the expected terminator is missing.",
  modelVsReality: "",
  originalityNote: {
    textbookExample: "An unbounded strlen implementation over a greeting.",
    howThisDiffers:
      "A trip label contains separators and trailing bytes. Bounded scanning, an empty label and a terminator counted too early make the stopping rule observable before the learner writes a marker counter.",
  },
} as const;
