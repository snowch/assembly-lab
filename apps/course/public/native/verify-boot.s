// Copyright © 2026 Christopher Snow
// Test the revised sum-minus-twice-correction contract. No C runtime.
.set CHALLENGE, 1
.include "boot.s"
.section .rodata, "a"
.balign 4
case_table:
    .word 120, 85, 42, 15, 217
    .word 7, 9, 4, 2, 16
    .word 0, 0, 0, 0, 0
    .word 0, 0, 0, 1, -2
