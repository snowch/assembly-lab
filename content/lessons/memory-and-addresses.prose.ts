// Copyright © 2026 Christopher Snow

// Module 6, lesson 1. Kept word for word in docs/notes/module-6/prose.md.
export const PROSE = {
  question:
    "The trip computer keeps a distance reading in memory. To use that reading in a calculation, the processor must copy it into a register. **How does an instruction find the right bytes?**\n\n" +
    "Memory holds **bytes**. On this machine, a byte contains 8 bits. Each byte has a numbered location called its **address**. Consecutive addresses identify consecutive bytes.\n\n" +
    "In the C below, `unsigned *distance` declares a **pointer**: `distance` holds the address of an unsigned value. `*distance` reads the value at that address. `const` says this function cannot change the value through this pointer.",
  questionNoteSummary: "The compiler and C sizes",
  questionNote:
    "These listings use GCC 16.1 with `-O1`, as in Module 0. They target AArch64 Linux: the 64-bit Arm instruction set running with the Linux operating system. The target uses little-endian byte order. Here, `char` occupies 8 bits, `short` 16, `int` 32, and `long` and pointers 64. These are this target's choices, not sizes guaranteed by C on every machine.\n\n" +
    "`unsigned` on its own means `unsigned int`. Adding `unsigned` changes the range of an integer type, not its size on this target.",
  motivation:
    "`x0` names all 64 bits of register 0. `w0` names its low 32 bits. They are two views of the same register. Writing `w0` also clears the upper 32 bits of `x0`. The pointer arrives in `x0`, because addresses here use 64 bits.\n\n" +
    "`ldr w0, [x0]` reads four bytes from memory, starting at the address held in `x0`. It places their bits in `w0`. The brackets mean access memory at that address. They do not mean copy the address into `w0`.\n\n" +
    "This course uses **little-endian** byte order: the byte at the lowest address supplies the lowest 8 bits of a multi-byte value. The next byte supplies the next 8 bits. A hexadecimal number is written with its highest bits on the left, so its displayed byte order runs the other way.",
  prediction:
    "The four bytes starting at the address in `x0` are `78 56 34 12`, in increasing address order. Each pair of digits is one hexadecimal byte.",
  predictionQuestion: "**What hexadecimal value does `ldr w0, [x0]` put in `w0`?**",
  predictionExplain:
    "`w0` becomes `0x12345678`. The byte `78` supplies the lowest 8 bits, followed by `56`, `34` and `12`. The load reads memory without changing those bytes.\n\n" +
    "Writing `w0` replaces the low half of `x0` and clears its upper half. After the load, register 0 holds the distance reading. It no longer holds the pointer.\n\nStep through the load. The figure marks the bytes it reads and shows where their bits go in the register. The address identifies the first byte; the destination `w0` makes this `ldr` read four bytes.",
  investigation:
    "A **load** copies bits from memory into a register. A **store** copies bits from a register into memory. `str w1, [x0]` writes the four bytes from `w1`, starting at the address in `x0`. It leaves the source register unchanged.\n\n" +
    "In `save_distance`, `distance` arrives in `x0` and `value` in `w1`. The C assignment `*distance = value` changes the value at the pointer's address. `void` means this function returns no value.",
  construction:
    "Store a new distance reading without changing the bytes that follow it. The address tells you where to start; the instruction's width tells you where to stop.",
  writeTask:
    "Write `save_distance`. `x0` holds the address of a four-byte unsigned distance reading. `w1` holds its replacement value. Write that value into the first four bytes and leave the following four bytes unchanged. Then return.\n\n" +
    "The exercise supplies the memory bytes. Write instructions only; you do not need to declare memory. The function has no return value.",
  writeHints: [
    "You need to change memory, so choose a store.",
    "A load would read memory instead of updating it. A store needs `w1` as its value source and `[x0]` as its memory destination.",
    "For the value `0x12345678`, a four-byte store writes `78 56 34 12` in increasing address order. The address register belongs inside square brackets.",
    "A store from a `w` register writes four bytes. Follow the store with `ret`.",
    "Under `save_distance:`, write `str w1, [x0]` and then `ret`.",
  ] as const,
  failureExperiment:
    "A different field needs only one byte. Its original byte and the three bytes after it are `aa bb cc dd`. `w1` holds `0x12345678`. The program below uses `str w1, [x0]` to update the field.",
  failureQuestion:
    "**Which four bytes will memory contain afterwards, in increasing address order?**",
  failureExplain:
    "Memory contains `78 56 34 12`. `str w1, [x0]` writes all four bytes of `w1`, so it overwrites the three neighbouring bytes as well.\n\n" +
    "`strb w1, [x0]` writes only the low byte, leaving `78 bb cc dd`. `strh w1, [x0]` writes the low two bytes, leaving `78 56 cc dd`. The letters `b` and `h` select a byte and a halfword. A halfword here contains two bytes.",
  explanation:
    "A narrow store takes only the low bits it needs. `strb` takes 8 bits and `strh` takes 16 bits. Neither instruction changes `w1`, and neither writes beyond its selected bytes.\n\n" +
    "For GCC's target, `unsigned char` occupies one byte and `unsigned short` occupies two. The recorded C functions store those types with `strb` and `strh`.\n\n" +
    "The address register and the transferred value can have different widths. `strb w1, [x0]` uses a 64-bit address but writes one byte. `str w1, [x0]` uses a 64-bit address and writes four bytes.\n\n" +
    "Using an `x` register for the value makes ordinary `ldr` or `str` transfer eight bytes. The next figures load and store an eight-byte value. Follow which memory address supplies each part of the register.",
  generalisation:
    "Read a memory instruction in three parts: which register holds the value, which register holds the address, and how many bytes the instruction transfers.\n\n" +
    "The load and store instructions shown here leave their address register unchanged unless it is also the load's destination. In `ldr w0, [x0]`, the destination overlaps the address register. Keep the address elsewhere if you will need it again.",
  finalTask:
    "Copy a four-byte distance reading to a second location. `x0` holds the source address and `x1` holds the destination address. The destination starts immediately after the source's four bytes.\n\n" +
    "Leave the source bytes unchanged. Write the copied value into the destination's four bytes, and return that value in `w0`. The exercise supplies both locations.",
  finalHints: [
    "A copy needs a load followed by a store.",
    "Copying `x0` would copy the address, not the distance stored there. Read the four bytes at that address.",
    "The bytes `78 56 34 12` load as `0x12345678`. Storing that register value at the destination reproduces the same four bytes.",
    "Store the loaded value through `x1`. The value must remain in `w0` for the return.",
    "Under `copy_distance:`, write `ldr w0, [x0]`, `str w0, [x1]` and `ret`.",
  ] as const,
  reflection:
    "- An address identifies a byte in memory.\n- A load reads memory; a store writes it.\n- The transfer width decides how many consecutive bytes are accessed.\n- Little-endian order puts the lowest byte of a value at the lowest address.\n- `w0` and `x0` name parts of the same register.\n\n" +
    "Why does `strb w1, [x0]` need an `x` register even though it writes only one byte?",
  reflectionNoteSummary: "Answer",
  reflectionNote:
    "`x0` holds the address, which uses 64 bits on this target. The `b` in `strb` chooses the transfer width: one byte from the low end of `w1`.",
  modelVsReality:
    "The figures use prepared memory bytes at valid addresses. Only the prepared memory regions are available to these examples. They show ordinary memory, not a sensor's hardware interface. Real programs must also have permission to access memory. For these C functions, the pointer must refer to storage for a value of the declared type, such as an `unsigned` distance. A readable address alone is not enough.\n\n" +
    "The simulator shows little-endian memory and the completed effect of each instruction. It does not model memory access timing or all faults a real processor can report.",
  originalityNote: {
    textbookExample: "Copying an integer between anonymous memory locations.",
    howThisDiffers:
      "The trip computer stores and copies a distance reading. A one-byte update exposes neighbouring-field damage, and computed byte diagrams connect store width to the bytes changed.",
  },
} as const;
