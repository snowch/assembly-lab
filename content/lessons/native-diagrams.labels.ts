// Copyright © 2026 Christopher Snow

// Drafted from the checked boot sources and native figure evidence.
export const LABELS = {
  flow: {
    title: "From image loading to serial output",
    note: "This control-flow schematic uses selected recorded instruction addresses. Select a stage to inspect its role; selecting does not execute instructions.",
    qemuTitle: "This QEMU command: direct ELF boot",
    boardTitle: "Physical board: one possible boot chain",
    boardNote:
      "This board-dependent example groups firmware stages described by Trusted Firmware-A. The board defines its handoff convention and accepted image formats. These firmware stages do not run in our QEMU experiment.",
    controlArrow: "Transfers control",
    loadArrow: "Loads file bytes into RAM",
    entry: "ELF entry point",
    host: "Host: QEMU loading",
    guest: "Guest: our instructions",
    nodes: [
      {
        id: "loader",
        title: "QEMU loads boot.elf",
        actor: "Host: QEMU loading",
        detail:
          "The host reads the ELF load segments, places their contents in emulated RAM and sets the processor’s first instruction address to the ELF entry.",
      },
      {
        id: "entry",
        title: "_start",
        actor: "Guest: our startup",
        detail:
          "The processor begins our code at the linked entry point. No guest BIOS, UEFI or boot stub runs before it in this direct ELF path.",
      },
      {
        id: "startup",
        title: "boot_ready",
        actor: "Guest: our startup",
        detail:
          "Startup has set the stack pointer and cleared .bss. The caller supplies the trip inputs before calling the function.",
      },
      {
        id: "trip",
        title: "trip_distance",
        actor: "Guest: our function",
        detail:
          "bl supplies a return address. The function calculates in registers, then ret transfers control back to after_trip.",
      },
      {
        id: "result",
        title: "after_trip",
        actor: "Guest: our caller",
        detail:
          "The caller stores the returned value in result, compares it with the expected answer and selects the report’s message.",
      },
      {
        id: "uart",
        title: "uart_puts",
        actor: "Guest: our output routine",
        detail:
          "The routine saves its return address on the stack, writes message bytes to the UART device and returns to its caller.",
      },
      {
        id: "halt",
        title: "halt",
        actor: "Guest: our waiting loop",
        detail:
          "Execution remains in the wfi and branch loop. Leaving QEMU is a host action; our program does not request a Linux process exit.",
      },
    ],
    boardNodes: [
      {
        id: "rom",
        title: "ROM and platform firmware",
        actor: "Board startup software",
        detail:
          "Reset reaches the board’s first code. Firmware stages prepare hardware and arrange the handoff to later boot software.",
      },
      {
        id: "loader",
        title: "Later loader, for example UEFI",
        actor: "Firmware or bootloader",
        detail:
          "A loader places the selected next program in memory and transfers control according to that system’s handoff convention.",
      },
      {
        id: "program",
        title: "Selected next program",
        actor: "Program instructions",
        detail:
          "The program begins with the memory and processor state promised by that board’s handoff. It must use an image format the loader accepts.",
      },
    ],
  },
  memory: {
    title: "From ELF file contents to memory",
    note: "Select a section to follow the same contents from the file to the machine’s address space. The addresses and byte counts come from the checked boot.elf build. The figure shows selected regions, not every byte of the file or all of RAM.",
    file: "File: boot.elf",
    segments: "ELF load segments",
    segmentFile: "Stored file bytes",
    segmentMemory: "Memory bytes",
    stackSave: "Recorded UART stack frame",
    ram: "RAM on QEMU virt",
    fileOffset: "Offset in the file",
    loadAddress: "Address in memory",
    bytes: "bytes",
    notStored: "No section bytes stored in the file",
    load: "Load these bytes",
    reserve: "Reserve memory; no section bytes to copy",
    bss: "Startup explicitly clears .bss",
    stack: "Stack storage is reserved for calls",
    uart: "UART device",
    select: "Select a section",
    rangeNote:
      "Addresses increase down the rows. Each range’s end is exclusive. Rows are not drawn to scale: row height does not show byte count. Address gaps and file padding are omitted between the selected rows. Stack growth is shown separately.",
    sectionDetails: {
      ".text": "Machine instructions stored in the image and loaded into RAM.",
      ".rodata": "Fixed message bytes stored in the image and loaded into RAM.",
      ".data": "Initialised writable bytes stored in the image and loaded into RAM.",
      ".bss":
        "Result storage occupies memory without section bytes in the file. Our startup clears this region before use.",
      ".stack":
        "Reserved stack space occupies memory without section bytes in the file. Startup sets sp to its aligned upper boundary.",
    },
    entry: "Entry address: _start",
    stackTop: "Initial stack pointer: stack_top",
    stackBefore: "SP before the UART save",
    stackAfter: "SP after the UART save",
    stackGrowth:
      "The UART routine’s first save moves sp towards lower addresses and stores the frame pointer and return address in that stack frame. The displayed addresses come from the recorded run.",
    uartNote:
      "The UART’s device registers are outside RAM. No ELF section is loaded there. The running program sends bytes by storing to the device’s mapped addresses.",
    segmentNote:
      "The loader follows ELF LOAD segments, not the section names. The writable segment’s memory size exceeds its file size, so its extra memory is zero-filled when loaded. Our startup also explicitly clears .bss. Memory-only sections have no stored section bytes; a displayed ELF file-offset field does not give them file contents.",
  },
} as const;
