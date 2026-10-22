// Copyright © 2026 Christopher Snow
// QEMU virt direct ELF boot: no Linux, C runtime or firmware image.
.section .text.boot, "ax"
.global _start, boot_ready, after_trip, halt
.type _start, %function
_start:
    msr daifset, #0xf      // mask debug, SError, IRQ and FIQ exceptions
    ldr x0, =stack_top     // linker-defined, 16-byte aligned stack limit
    mov sp, x0
    ldr x0, =bss_start
    ldr x1, =bss_end
zero_bss:
    cmp x0, x1
    b.hs boot_ready
    str xzr, [x0], #8
    b zero_bss
boot_ready:
.ifdef CHALLENGE
    adr x19, case_table
    mov w20, #4
check_next_case:
    ldp w0, w1, [x19]
    ldp w2, w3, [x19, #8]
    bl trip_distance
    ldr x4, =result
    str w0, [x4]
    ldr w4, [x19, #16]
    cmp w0, w4
    b.ne check_failed
    add x19, x19, #20
    subs w20, w20, #1
    b.ne check_next_case
    adr x1, cases_passed_message
    b print_report
check_failed:
    adr x1, failed_message
    b print_report
.else
    mov w0, #120
    mov w1, #85
    mov w2, #42
    mov w3, #15
    bl trip_distance

after_trip:
    ldr x4, =result
    str w0, [x4]
    cmp w0, #232
    adr x1, passed_message
    adr x2, failed_message
    csel x1, x1, x2, eq
.endif
print_report:
    bl uart_puts
halt:
    wfi
    b halt
.size _start, .-_start

// x1 points to a zero-terminated string. The stack preserves our return address.
.type uart_puts, %function
uart_puts:
    stp x29, x30, [sp, #-16]!
    mov x29, sp
    mov x0, #0x09000000    // first PL011 UART on QEMU virt
    str wzr, [x0, #0x30] // disable while configuring
    mov w3, #1
    str w3, [x0, #0x24]  // integer baud divisor
    str wzr, [x0, #0x28] // fractional baud divisor
    mov w3, #0x60
    str w3, [x0, #0x2c]  // eight data bits
    mov w3, #0x301
    str w3, [x0, #0x30]  // UART, transmitter and receiver enabled
next_byte:
    ldrb w2, [x1], #1
    cbz w2, uart_done
wait_tx:
    ldr w3, [x0, #0x18]  // UARTFR
    tbnz w3, #5, wait_tx // TX FIFO full: wait
    strb w2, [x0]        // UARTDR
    b next_byte
uart_done:
    ldp x29, x30, [sp], #16
    ret
.size uart_puts, .-uart_puts

.section .rodata, "a"
passed_message:
    .asciz "Assembly Lab: trip check passed\n"
cases_passed_message:
    .asciz "4 cases passed\n"
failed_message:
    .asciz "Assembly Lab: trip check failed\n"

.section .data, "aw"
.global initialized_marker
initialized_marker:
    .word 0x12345678

.section .bss, "aw", %nobits
.balign 8
.global result
result:
    .skip 8
.section .note.GNU-stack,"",%progbits
