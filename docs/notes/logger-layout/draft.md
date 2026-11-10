# Suggested section copy

Placement: section prose outside the interactive card, below the single existing heading.

This vehicle logger groups its data into pages of 4,096 bytes. A **byte** contains 8 bits. An **address** identifies a byte's location in memory. Adding 1 to an address gives the next byte's address.

Find the address **three pages ahead**, keeping the starting address in `x0`.

- `x0` holds 65,536, the address at the start of a page.
- `#3, lsl #12` forms the byte distance: `#3` counts the pages, and `lsl #12` multiplies that count by 4,096, giving 12,288 bytes.
- `x2` receives the new address when `add` adds the byte distance to the starting address in `x0`.

Placement: visible inside the card, beside or immediately after the displayed instruction `add x2, x0, #3, lsl #12`.

`add x2, x0, #12288` encodes the same single instruction. Writing `#3, lsl #12` keeps the page count visible.

Placement: beside the calculation and Run control, before the optional limits note.

Press **Run the instruction** to follow the calculation. It computes an address without reading or writing stored data.
