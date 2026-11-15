// Copyright © 2026 Christopher Snow

// Primary sources for optional A32/floating-point lessons and native-only work.
// Bibliographic and instruction-form checks are recorded in
// docs/notes/lesson-instruction-references/extended-sources.md.
// These references do not extend the browser instruction set.

export const EXTENDED_REFERENCES = {
  "native-adr": {
    mnemonic: "adr",
    label: "ADR",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/ADR--Form-PC-relative-address-?lang=en",
  },
  "native-msr-immediate": {
    mnemonic: "msr",
    label: "MSR (immediate, DAIFSet)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/MSR--immediate---Move-immediate-value-to-special-register-?lang=en",
  },
  "native-str-postindex": {
    mnemonic: "str",
    label: "STR (immediate, post-index)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/STR--immediate---Store-register--immediate--?lang=en",
  },
  "native-svc": {
    mnemonic: "svc",
    label: "SVC",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/SVC--Supervisor-call-?lang=en",
  },
  "native-wfi": {
    mnemonic: "wfi",
    label: "WFI",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/WFI--Wait-for-interrupt-?lang=en",
  },
  "fp-fadd": {
    mnemonic: "fadd",
    label: "FADD (scalar)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/SIMD-FP-Instructions/FADD--scalar---Floating-point-add--scalar--?lang=en",
  },
  "fp-fcvt": {
    mnemonic: "fcvt",
    label: "FCVT (scalar precision conversion)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/SIMD-FP-Instructions/FCVT--Floating-point-convert-precision--scalar--?lang=en",
  },
  "fp-fcvtzs": {
    mnemonic: "fcvtzs",
    label: "FCVTZS (scalar, integer)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/SIMD-FP-Instructions/FCVTZS--scalar--integer---Floating-point-convert-to-signed-integer--rounding-toward-zero--scalar--?lang=en",
  },
  "fp-fmov": {
    mnemonic: "fmov",
    label: "FMOV (general)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/SIMD-FP-Instructions/FMOV--general---Floating-point-move-to-or-from-general-purpose-register-without-conversion-?lang=en",
  },
  "fp-fmul": {
    mnemonic: "fmul",
    label: "FMUL (scalar)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/SIMD-FP-Instructions/FMUL--scalar---Floating-point-multiply--scalar--?lang=en",
  },
  "fp-scvtf": {
    mnemonic: "scvtf",
    label: "SCVTF (scalar, integer)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/SIMD-FP-Instructions/SCVTF--scalar--integer---Signed-integer-convert-to-floating-point--scalar--?lang=en",
  },
  "fp-pseudocode": {
    label: "Arm shared floating-point pseudocode (DDI0602 2026-09)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Shared-Pseudocode/shared-functions-float?lang=en",
  },
  "a32-bl": {
    mnemonic: "bl",
    label: "A32 BL, BLX (immediate)",
    url: "https://support.arm.com/documentation/ddi0597/2026-09/Base-Instructions/BL--BLX--immediate---Branch-with-Link-and-optional-Exchange--immediate--?lang=en",
  },
  "a32-bx": {
    mnemonic: "bx",
    label: "A32 BX",
    url: "https://support.arm.com/documentation/ddi0597/2026-09/Base-Instructions/BX--Branch-and-Exchange-?lang=en",
  },
  "a32-movw": {
    mnemonic: "movw",
    label: "A32 MOV, MOVS (immediate, including MOVW)",
    url: "https://support.arm.com/documentation/ddi0597/2026-09/Base-Instructions/MOV--MOVS--immediate---Move--immediate--?lang=en",
  },
  "a32-mov-register": {
    mnemonic: "movcs",
    label: "A32 MOV, MOVS (register, including MOVCS)",
    url: "https://support.arm.com/documentation/ddi0597/2026-09/Base-Instructions/MOV--MOVS--register---Move--register--?lang=en",
  },
  "a32-movt": {
    mnemonic: "movt",
    label: "A32 MOVT",
    url: "https://support.arm.com/documentation/ddi0597/2026-09/Base-Instructions/MOVT--Move-Top-?lang=en",
  },
  "a32-pop": {
    mnemonic: "pop",
    label: "A32 POP (multiple registers)",
    url: "https://support.arm.com/documentation/ddi0597/2026-09/Base-Instructions/POP--multiple-registers---Pop-Multiple-Registers-from-Stack--an-alias-of-LDM--LDMIA--LDMFD-?lang=en",
  },
  "a32-push": {
    mnemonic: "push",
    label: "A32 PUSH (multiple registers)",
    url: "https://support.arm.com/documentation/ddi0597/2026-09/Base-Instructions/PUSH--multiple-registers---Push-multiple-registers-to-Stack--an-alias-of-STMDB--STMFD-?lang=en",
  },
  aapcs64: {
    label: "Procedure Call Standard for the Arm 64-bit Architecture (AAPCS64, 2025Q4)",
    url: "https://github.com/ARM-software/abi-aa/blob/2025Q4/aapcs64/aapcs64.rst",
  },
  aapcs32: {
    label: "Procedure Call Standard for the Arm Architecture (AAPCS32, 2025Q4)",
    url: "https://github.com/ARM-software/abi-aa/blob/2025Q4/aapcs32/aapcs32.rst",
  },
  rtabi32: {
    label: "Run-time ABI for the Arm Architecture (2025Q4)",
    url: "https://github.com/ARM-software/abi-aa/blob/2025Q4/rtabi32/rtabi32.rst",
  },
  "gnu-aarch64": {
    label: "GNU as: AArch64 Opcodes, LDR =",
    url: "https://sourceware.org/binutils/docs/as/AArch64-Opcodes.html",
  },
  "gnu-as-directives": {
    label: "GNU as: Assembler Directives",
    url: "https://sourceware.org/binutils/docs/as/Pseudo-Ops.html",
  },
  "gnu-ld": {
    label: "GNU ld: Linker Scripts",
    url: "https://sourceware.org/binutils/docs/ld/Scripts.html",
  },
  "gnu-readelf": {
    label: "GNU Binary Utilities: readelf",
    url: "https://sourceware.org/binutils/docs/binutils/readelf.html",
  },
  "gnu-objdump": {
    label: "GNU Binary Utilities: objdump",
    url: "https://sourceware.org/binutils/docs/binutils/objdump.html",
  },
  "gnu-objcopy": {
    label: "GNU Binary Utilities: objcopy",
    url: "https://sourceware.org/binutils/docs/binutils/objcopy.html",
  },
  "gdb-remote": {
    label: "GDB: Connecting to a Remote Target",
    url: "https://sourceware.org/gdb/current/onlinedocs/gdb.html/Connecting.html",
  },
  "gdb-stepping": {
    label: "GDB: Continuing and Stepping",
    url: "https://sourceware.org/gdb/current/onlinedocs/gdb.html/Continuing-and-Stepping.html",
  },
  "gdb-memory": {
    label: "GDB: Examining Memory",
    url: "https://sourceware.org/gdb/current/onlinedocs/gdb.html/Memory.html",
  },
  "gcc-arm-options": {
    label: "GCC: ARM Options",
    url: "https://gcc.gnu.org/onlinedocs/gcc/ARM-Options.html",
  },
  "qemu-virt": {
    label: "QEMU: virt generic virtual platform",
    url: "https://www.qemu.org/docs/master/system/arm/virt.html",
  },
  "qemu-gdb": {
    label: "QEMU: GDB usage",
    url: "https://www.qemu.org/docs/master/system/gdb.html",
  },
  "qemu-elf-source": {
    label: "QEMU 8.2.2: Arm ELF loading and processor startup",
    url: "https://github.com/qemu/qemu/blob/v8.2.2/hw/arm/boot.c",
  },
  "qemu-pl011-source": {
    label: "QEMU 8.2.2: PL011 device implementation",
    url: "https://github.com/qemu/qemu/blob/v8.2.2/hw/char/pl011.c",
  },
  pl011: {
    label: "Arm PrimeCell UART (PL011) Technical Reference Manual (DDI0183G)",
    url: "https://support.arm.com/documentation/ddi0183/g",
  },
  "pi-bootflow-source": {
    label: "Raspberry Pi: EEPROM boot flow",
    url: "https://github.com/raspberrypi/documentation/blob/41e24fbd459d47e7db979cd084676c790b60a3de/documentation/asciidoc/computers/raspberry-pi/bootflow-eeprom.adoc",
  },
  "pi-bootconfig-source": {
    label: "Raspberry Pi: Boot Options",
    url: "https://github.com/raspberrypi/documentation/blob/41e24fbd459d47e7db979cd084676c790b60a3de/documentation/asciidoc/computers/config_txt/boot.adoc",
  },
  "pi-loadaddress-source": {
    label: "Raspberry Pi: Legacy boot options, kernel_address",
    url: "https://github.com/raspberrypi/documentation/blob/41e24fbd459d47e7db979cd084676c790b60a3de/documentation/asciidoc/computers/legacy_config_txt/boot.adoc",
  },
  "pi-uart-source": {
    label: "Raspberry Pi: UART interfaces",
    url: "https://github.com/raspberrypi/documentation/blob/41e24fbd459d47e7db979cd084676c790b60a3de/documentation/asciidoc/computers/configuration/interfaces.adoc",
  },
  "pi-device-tree-source": {
    label: "Raspberry Pi: Device Trees, overlays, and parameters",
    url: "https://github.com/raspberrypi/documentation/blob/41e24fbd459d47e7db979cd084676c790b60a3de/documentation/asciidoc/computers/configuration/reference.adoc",
  },
  "pi-probe-source": {
    label: "Raspberry Pi: About the Debug Probe",
    url: "https://github.com/raspberrypi/documentation/blob/41e24fbd459d47e7db979cd084676c790b60a3de/documentation/asciidoc/microcontrollers/debug-probe/introduction.adoc",
  },
  "pi-firmware-source": {
    label: "Raspberry Pi: Firmware",
    url: "https://github.com/raspberrypi/documentation/blob/41e24fbd459d47e7db979cd084676c790b60a3de/documentation/asciidoc/computers/configuration/firmware.adoc",
  },
  "pi-clock-source": {
    label: "Raspberry Pi Linux: BCM2712 UART10 and its clock",
    url: "https://github.com/raspberrypi/linux/blob/5bd564aaa8dc4b1b8ed11733c19ec8ece63a72cc/arch/arm64/boot/dts/broadcom/bcm2712.dtsi",
  },
  "linux-syscall-man": {
    label: "Linux manual: syscall(2)",
    url: "https://man7.org/linux/man-pages/man2/syscall.2.html",
  },
  c23: {
    label: "C23 public draft N3096: floating-point conversions (6.3.1.4 and 6.3.1.5)",
    url: "https://www.open-std.org/jtc1/sc22/wg14/www/docs/n3096.pdf",
  },
} as const satisfies Record<
  string,
  { readonly mnemonic?: string; readonly label: string; readonly url: string }
>;

// This is source relevance, not a list of newly introduced browser mnemonics.
export const EXTENDED_LESSON_REFERENCE_KEYS = {
  "from-function-to-executable": [
    "native-wfi",
    "native-msr-immediate",
    "native-adr",
    "native-str-postindex",
    "gnu-aarch64",
    "gnu-as-directives",
    "gnu-ld",
    "gnu-readelf",
    "gnu-objdump",
    "aapcs64",
    "qemu-virt",
    "qemu-elf-source",
    "pl011",
    "qemu-pl011-source",
  ],
  "debug-native-instructions": [
    "gdb-remote",
    "gdb-stepping",
    "gdb-memory",
    "qemu-gdb",
    "native-svc",
    "linux-syscall-man",
  ],
  "raspberry-pi-5": [
    "pi-probe-source",
    "pi-uart-source",
    "pi-firmware-source",
    "pi-bootflow-source",
    "pi-bootconfig-source",
  ],
  "raspberry-pi-boot": [
    "gnu-objcopy",
    "pi-bootflow-source",
    "pi-bootconfig-source",
    "pi-loadaddress-source",
    "pi-device-tree-source",
    "pi-uart-source",
    "pi-clock-source",
    "pl011",
  ],
  "same-c-on-a32": [
    "a32-bx",
    "a32-mov-register",
    "a32-movw",
    "a32-movt",
    "a32-bl",
    "a32-push",
    "a32-pop",
    "aapcs32",
    "rtabi32",
    "gcc-arm-options",
  ],
  "floating-point-bits": ["fp-pseudocode", "aapcs64"],
  "floating-point-rounding": ["fp-pseudocode"],
  "floating-point-arm": ["fp-fadd", "fp-fmul", "aapcs64"],
  "floating-point-conversions": ["fp-fcvtzs", "fp-scvtf", "fp-fcvt", "fp-fmov", "c23"],
} as const satisfies Record<string, readonly (keyof typeof EXTENDED_REFERENCES)[]>;
