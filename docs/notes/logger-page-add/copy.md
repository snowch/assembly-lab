# Edited logger page example

Drafted separately; edited for the exact control name and shorter visible explanation.

{
  "title": "Advance through logger pages",
  "caption": "One add instruction finds the address three logger pages later.",
  "prose": "This vehicle logger groups its data into pages of 4096 bytes. A **byte** contains 8 bits; an **address** identifies a byte's location in memory. Adding 1 to an address gives the next byte's address.\n\n`x0` holds 65536, the address at the start of a page. Find the address **three pages ahead**, keeping the starting address in `x0`.\n\n`#3` is the page count. `lsl #12` multiplies it by 4096, giving 12288 bytes. `add` adds that distance to `x0` and writes the new address to `x2`.\n\n`add x2, x0, #12288` encodes the same single instruction. The explicit `#3, lsl #12` keeps the page count visible.\n\nPress **Run the instruction** to follow the calculation. It computes an address without reading or writing stored data.",
  "optionalNote": {
    "summary": "Constant range and shift limits",
    "body": "ADD's immediate form holds a 12-bit constant, from 0 to 4095. When you write an explicit `lsl`, the constant before it must fit that range. The only shift amounts are 0 and 12. These options differ from those of `mov` and `movk`.\n\nWithout an explicit `lsl`, the assembler can choose the shifted form for a larger plain constant, as it does for `#12288`. The plain constant must still fit one of ADD's two forms.\n\nSee [Arm’s ADD (immediate) reference](https://developer.arm.com/documentation/ddi0602/2025-12/Base-Instructions/ADD--immediate---Add-immediate-value-)."
  }
}
