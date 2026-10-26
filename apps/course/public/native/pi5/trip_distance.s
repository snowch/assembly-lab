// Copyright © 2026 Christopher Snow
// Handwritten copy of the four instructions taught in Module 0.
.text
.global trip_distance
.type trip_distance, %function
.p2align 2
trip_distance:
    add w0, w0, w1
    add w0, w0, w2
    sub w0, w0, w3
    ret
.size trip_distance, .-trip_distance
.section .note.GNU-stack,"",%progbits
