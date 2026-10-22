/* Copyright © 2026 Christopher Snow */
ENTRY(_start)
SECTIONS {
    . = 0x40080000;
    .text : { *(.text*) *(.rodata*) }
    /DISCARD/ : { *(.comment) *(.note*) }
}
