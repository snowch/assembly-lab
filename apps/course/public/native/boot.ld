/* Copyright © 2026 Christopher Snow */
ENTRY(_start)
MEMORY {
    ram (rwx) : ORIGIN = 0x40080000, LENGTH = 0x100000
}
PHDRS {
    code PT_LOAD FLAGS(5); /* read and execute */
    data PT_LOAD FLAGS(6); /* read and write */
}
SECTIONS {
    .text : { text_start = .; KEEP(*(.text.boot)) *(.text*) text_end = .; } > ram :code
    .rodata : { *(.rodata*) } > ram :code
    .data ALIGN(4096) : { *(.data*) } > ram :data
    .bss (NOLOAD) : {
        . = ALIGN(8);
        bss_start = .;
        *(.bss*) *(COMMON)
        . = ALIGN(8);
        bss_end = .;
    } > ram :data
    .stack (NOLOAD) : {
        . = ALIGN(16);
        stack_bottom = .;
        . += 4096;
        stack_top = .;
    } > ram :data
    /DISCARD/ : { *(.comment) *(.note*) }
}
