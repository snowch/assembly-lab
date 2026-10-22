// Copyright © 2026 Christopher Snow
// AArch64 Linux: no C caller, no libc. These instructions run in native QEMU, not the browser model.
.text
.global _start
.type _start, %function
_start:
    mov x0, 1              // standard output
    adr x1, message        // address of the bytes below
    mov x2, message_end - message
    mov x8, 64             // Linux write
    svc #0
    mov x0, 0              // successful exit status
    mov x8, 93             // Linux exit
    svc #0
.section .rodata
message:
    .ascii "Assembly Lab: native ARM64\n"
message_end:
.section .note.GNU-stack,"",%progbits
