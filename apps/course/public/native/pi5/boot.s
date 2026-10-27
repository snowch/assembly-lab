// Copyright © 2026 Christopher Snow
// Raspberry Pi 5 only. Native source, not browser simulator instructions.
// Physical boot/serial output has not yet been verified on a board.
// Firmware must enter privileged EL1/EL2, with MMU off and little-endian data.
.section .text.boot, "ax"
.global _start, boot_ready, after_trip, halt
.type _start, %function
_start:
    msr daifset, #0xf
    mrs x0, mpidr_el1
    and x0, x0, #0xffffff
    cbnz x0, halt             // one stack and one report: primary core only
    mrs x21, CurrentEL
    cmp x21, #8
    b.eq entry_el2
    cmp x21, #4
    b.ne halt                // this privileged firmware profile accepts EL1 or EL2, not EL3
    mrs x0, sctlr_el1
    b check_entry
entry_el2:
    mrs x0, sctlr_el2
check_entry:
    tbnz x0, #0, halt         // requires firmware handoff with MMU disabled
    tbnz x0, #25, halt        // requires little-endian data accesses
    msr spsel, #1
    ldr x0, =stack_top
    mov sp, x0
    ldr x0, =bss_start
    ldr x1, =bss_end
zero_bss:
    cmp x0, x1
    b.hs boot_ready
    str xzr, [x0], #8
    b zero_bss
boot_ready:
    ldr x4, =entry_el
    lsr x21, x21, #2
    str w21, [x4]
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
    csel x19, x1, x2, eq
    bl uart_init
    adr x1, entry_message
    bl uart_puts
    add w2, w21, #'0'
    bl uart_putc
    adr x1, newline
    bl uart_puts
    mov x1, x19
    bl uart_puts
halt:
    wfe
    b halt
.size _start, .-_start

// Dedicated BCM2712 UART10, not RP1 GPIO UART0 and not Pi 4 UART0.
// Official BCM2712 DT declares UARTCLK = 9,216,000 Hz.
// 9,216,000 / (16 * 115,200) = 5, exactly; fractional divisor = 0.
.type uart_init, %function
uart_init:
    ldr x0, =0x107d001000
wait_idle:
    ldr w3, [x0, #0x18]
    tbnz w3, #3, wait_idle    // finish any firmware transmission first
    str wzr, [x0, #0x30]     // CR: disable UART before changing divisors
    str wzr, [x0, #0x38]     // IMSC: polling, no UART interrupts
    mov w3, #0x7ff
    str w3, [x0, #0x44]      // ICR: clear pending UART interrupts
    mov w3, #5
    str w3, [x0, #0x24]      // IBRD
    str wzr, [x0, #0x28]     // FBRD
    mov w3, #0x70
    str w3, [x0, #0x2c]      // LCR_H: 8 data bits, FIFO, no parity, 1 stop
    mov w3, #0x101
    str w3, [x0, #0x30]      // CR: UART enabled, transmitter enabled
    dsb sy
    ret
.size uart_init, .-uart_init

// w2 is a byte; x0 remains the UART address. Word accesses match mmio32.
.type uart_putc, %function
uart_putc:
wait_tx:
    ldr w3, [x0, #0x18]
    tbnz w3, #5, wait_tx
    str w2, [x0]
    ret
.size uart_putc, .-uart_putc

// x1 points to a zero-terminated string.
.type uart_puts, %function
uart_puts:
    stp x29, x30, [sp, #-16]!
    mov x29, sp
next_byte:
    ldrb w2, [x1], #1
    cbz w2, uart_done
    bl uart_putc
    b next_byte
uart_done:
    ldp x29, x30, [sp], #16
    ret
.size uart_puts, .-uart_puts

.section .rodata, "a"
entry_message:
    .asciz "Assembly Lab Pi 5: entry EL"
newline:
    .asciz "\r\n"
passed_message:
    .asciz "Assembly Lab Pi 5: trip check passed\r\n"
failed_message:
    .asciz "Assembly Lab Pi 5: trip check failed\r\n"
.section .data, "aw"
.global initialized_marker
initialized_marker:
    .word 0x12345678
.section .bss, "aw", %nobits
.balign 8
.global result, entry_el
result:
    .skip 8
entry_el:
    .skip 8
.section .note.GNU-stack,"",%progbits
