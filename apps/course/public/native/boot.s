// Copyright © 2026 Christopher Snow
// Optional QEMU virt exercise: direct PL011 UART access, no Linux and no stack.
.text
.global _start
.type _start, %function
_start:
    mov x0, 0x09000000     // virt's first PL011 UART
    str wzr, [x0, 0x30]   // disable while configuring
    mov w3, 1
    str w3, [x0, 0x24]    // integer baud divisor
    str wzr, [x0, 0x28]   // fractional divisor
    mov w3, 0x60
    str w3, [x0, 0x2c]    // eight data bits
    mov w3, 0x301
    str w3, [x0, 0x30]    // UART, transmitter and receiver enabled
    adr x1, message
next_byte:
    ldrb w2, [x1], 1
    cbz w2, halt
wait_tx:
    ldr w3, [x0, 0x18]    // UARTFR
    tbnz w3, 5, wait_tx   // TX FIFO full: wait
    strb w2, [x0]         // UARTDR
    b next_byte
halt:
    wfi
    b halt
message:
    .asciz "Assembly Lab: bare metal\n"
