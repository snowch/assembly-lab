// Copyright © 2026 Christopher Snow

// Kept word for word in docs/notes/module-7/prose.md.
export const PROSE = {
  question:
    "The trip computer keeps its completed journeys in a log. Each journey occupies the same amount of memory. **How can a load find one journey from its position in the log?**\n\nAn **array** stores values of one type in consecutive memory locations. Each value is an **element**. Its position is its **index**, counted from zero. In C, `trips[index]` reads the element at that index.",
  questionNoteSummary: "The compiler and valid array accesses",
  questionNote:
    "These listings use GCC 16.1 with `-O1` for little-endian AArch64 Linux. An `unsigned` element occupies four bytes on this target. The examples supply valid array indices. In C, an address being readable does not by itself make an array access valid: the access must stay within the array object.",
  motivation:
    "The log contains the unsigned values `12, 25, 7, 40`. Index zero selects the first value. Each element occupies four bytes, so each increase in the index moves the address forward by four bytes.\n\nIn `ldr w0, [x0, x1, lsl #2]`, `x0` holds the array's starting address and `x1` holds the index. The load shifts the index left by two places, which multiplies it by four, then adds it to the starting address. It reads four bytes from that address.\n\nThe shift is part of calculating the address. It does not change `x1`. The load replaces register 0 with the value it reads, so `x0` no longer holds the array's starting address afterwards.",
  prediction:
    "The log still contains `12, 25, 7, 40`. `x0` points to its first element, and `x1` holds index 2.",
  predictionQuestion: "**What does `read_trip` return in `w0`?**",
  predictionExplain:
    "It returns `0x00000007`, or 7. Index 2 selects the third element. The scaled index is eight bytes, so the load starts eight bytes after the beginning of the array.",
  investigation:
    "Press Next in the comparison, then choose another addressing form. The view keeps the same instruction step so you can compare the address used and `x0` before and after. The three loads use different rules for updating the pointer.\n\n`[x0, #4]` accesses memory four bytes after `x0` and leaves `x0` unchanged. `[x0, #4]!` first adds four to `x0`, then accesses memory at the updated address. This is **pre-index** addressing.\n\n`[x0], #4` accesses memory at the old address, then adds four to `x0`. This is **post-index** addressing. The number after the brackets is still a byte count.\n\nAll three examples load into `w2`, keeping the loaded value separate from the pointer. Compare both registers, not just the value loaded.",
  construction:
    "Choose an element by scaling its index to a byte offset. The element's size decides the scale.",
  writeTask:
    "Write `read_trip`. `x0` holds the starting address of an array of four-byte unsigned values. `x1` holds a valid index into that array. Return the selected value in `w0`, leaving memory unchanged.",
  writeHints: [
    "An index counts elements. A memory address counts bytes.",
    "Using the index without scaling treats an element count as a byte count. Each element here occupies four bytes.",
    "For index zero, the byte offset is zero and the load reads the first value, 12. Scale other indices by the element size.",
    "Use the scaled index inside the load's brackets, alongside `x0`.",
    "Use `ldr w0, [x0, x1, lsl #2]`, then `ret`.",
  ],
  failureExperiment:
    "The changed assembly leaves out `lsl #2`. It uses `ldr w0, [x0, x1]` with the same log and index 2. The instruction now treats the index as a byte offset.\n\nThis is an assembly experiment within the prepared memory region. It is not an example of a valid C access to the third element.",
  failureQuestion: "**Which value does the changed load put in `w0`?**",
  failureExplain:
    "It loads `0x00190000`, or 1638400. The access begins two bytes after the array's start, halfway through its first element. The four bytes there are `00 00 19 00`. Little-endian order combines them into `0x00190000`.\n\nThe load still reads four bytes. Removing the scale changed where those bytes came from.",
  explanation:
    "Keep two decisions separate: the address used by the load, and whether the instruction updates the pointer. Scaling an index chooses an element. Pre-index and post-index forms can also move the pointer for the next access.\n\nC pointer arithmetic uses the pointed-to type. For an `unsigned *` here, `trips + 1` points to the next four-byte element. It does not mean one byte later. `*trips++` reads through the old pointer and then advances the pointer by one element.\n\nIn the C loop, `total += *trips++` adds the value read to `total`. For an ordinary variable, `total += value` means `total = total + value`.\n\nThe recorded `sum_trips` uses a post-index load to advance by four bytes after each read. Its end address comes from `add x3, x0, w1, uxtw 2`: zero-extend the count in `w1`, shift it left by two, then add the starting address. `uxtw` selects zero extension from 32 to 64 bits.\n\nAfter calculating the end address, this listing no longer needs the count in `w1`. The load reuses `w1` for each array element. GCC has replaced the C loop's decreasing count with a comparison of the moving pointer in `x2` against the end address in `x3`. There is no separate instruction for `count--` in this listing.",
  generalisation:
    "A loop over an array needs a position and a stopping rule. You can count down the remaining elements, or compare the moving pointer with an end address. Check the empty case before the first load.\n\nC allows a pointer to reach the position immediately after an array. That position is useful as a stopping point, but you must not read an element there. The element count must describe memory the function is allowed to read.\n\nThe sum in this example is unsigned. Like the additions in earlier modules, it wraps modulo 2³² if the total exceeds the range of `unsigned` on this target.",
  finalTask:
    "Write `sum_trips`. `x0` holds the start of an array of four-byte unsigned distances, and `w1` holds the number of elements to add. Return their unsigned 32-bit sum in `w0`. Leave memory unchanged.\n\nA zero count must return zero without reading memory. For a nonzero count, the exercise supplies at least that many elements. The tests include a sum that wraps.",
  finalHints: [
    "Keep the pointer in another register before using `w0` for the total.",
    "Do not read the first element when the count is zero. Return the initial total of zero.",
    "With a count of one, read only the first distance, 12. Add it to the zero total, then stop.",
    "Add the loaded value to the total. Decrease the count, and repeat while it is nonzero.",
    "One complete solution is:\n\n```asm\nmov x2, x0\nmov w0, #0\ncbz w1, done\nloop:\nldr w3, [x2], #4\nadd w0, w0, w3\nsubs w1, w1, #1\nb.ne loop\ndone:\nret\n```",
  ],
  reflection:
    "- An array index counts elements, starting at zero.\n- Scale the index by the element's size to obtain a byte offset.\n- An offset can select an address without changing the pointer.\n- Pre-index updates the pointer before an access; post-index updates it afterwards.\n- A loop must stop before it reads beyond the array.\n\nWhy does `p + 1` move by four bytes when `p` points to an `unsigned` on this target?",
  reflectionNoteSummary: "Answer",
  reflectionNote:
    "C pointer arithmetic advances by elements of the pointed-to type. An `unsigned` occupies four bytes on this target, so moving to the next element adds four to the byte address.",
  modelVsReality:
    "The byte diagrams come from the simulator's memory accesses. The simulator checks whether an address lies in its prepared memory, but it does not track C array objects or enforce C pointer rules. A simulated load succeeding is not proof that the corresponding C expression is valid.\n\nThe examples use ordinary memory and omit caches, access timing and operating-system permissions.",
  originalityNote: {
    textbookExample: "Summing an anonymous integer array with an index.",
    howThisDiffers:
      "A trip log connects element size to its byte layout. Three computed loads separate address selection from pointer movement, and a missing scale exposes bytes spanning neighbouring distances.",
  },
} as const;
