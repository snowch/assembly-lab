# Course pacing implementation: new copy

Drafted separately from checked facts supplied by the three implementation agents. Existing canonical paragraphs remain in their original records. These exact strings are additions or replacements for page boundaries and local activities. Instruction values and answers reuse the existing model/compiler records; no new computed answer is introduced.

Sentence and idea passes: one goal per title/objective; instructions name the local action; no answer appears in an initial task. Native checkpoints distinguish file inspection from physical execution. Independent reviews remain pending.

## pacing-1-4.copy.ts

```json
{
  "hexadecimal": {
    "title": "Reading hexadecimal",
    "objectives": [
      "read a register’s bits in hexadecimal."
    ],
    "intro": "Hexadecimal groups the bits into a shorter form. Use the register reader to match each hexadecimal digit to its bits.",
    "activity": "Change a bit and follow its hexadecimal digit. Then type a hexadecimal pattern and check which bits it sets. Both controls edit the same pattern.",
    "caption": "The same register pattern as bits and hexadecimal digits."
  },
  "readings": {
    "title": "Signed and unsigned readings",
    "objectives": [
      "read the same register bits as signed or unsigned numbers."
    ],
    "intro": "The **signed reading** allows negative numbers and is the reading C’s `int` uses here. The **unsigned reading** counts every bit as a positive amount. The simulator shows register numbers in unsigned decimal.\n\nNothing in the register changes when we change how we read its bits.",
    "investigation": "Each bit is worth twice the bit to its right: 1, 2, 4, 8 and so on. The leftmost bit, bit 31, is the **top bit**. It is worth 2147483648.\n\nThe **unsigned reading** adds the values of the bits that are 1. The **signed reading** does the same, except the top bit counts as minus 2147483648.\n\nThis way of reading signed bits is called **two’s complement**. The top bit contributes a negative value; it is not a separate minus sign for the other bits.\n\nThe other 31 bits count the same in both readings. So when the top bit is 0, the two readings agree.\n\nThe figure starts with `0xfffffff4`, the initial pattern in `w0`. It shows the top bit’s value and the other 31 bits’ total in each reading. Open Show calculation to see how those parts add up."
  },
  "loadConstant": {
    "title": "Loading a constant",
    "objectives": [
      "test whether a constant fits one mov instruction."
    ]
  },
  "buildConstant": {
    "title": "Building a constant",
    "objectives": [
      "combine mov and movk to construct a constant."
    ],
    "intro": "A constant that does not fit one instruction can be built in parts. Use movk to replace a part while keeping the other bits."
  },
  "registerWidths": {
    "title": "Writing w and x registers",
    "objectives": [
      "predict how a write through a w name affects its x register."
    ],
    "intro": "The w and x names refer to the same register at different widths. Predict what remains after each write."
  },
  "masks": {
    "title": "Changing one warning",
    "objectives": [
      "set, clear and flip a warning bit without changing the other bits."
    ],
    "traceTitle": "Trace two mask operations",
    "traceCaption": "Two separate mask operations on the same starting warning word.",
    "traceTask": "The warning word is `0x2a`. Give two results in hexadecimal:\n\n- the word after `orr w0, w0, 1`;\n- the word after `and w0, w0, -9`.\n\nStart with `0x2a` separately for each instruction.",
    "traceHints": [
      "OR sets the mask’s bits. AND keeps bits where the mask has a one.",
      "Start each instruction with the original word, not the previous result.",
      "`0x2a` is `0010 1010`: bits 1, 3 and 5 are set.",
      "−9 is `0xfffffff7`, every bit except bit 3.",
      "The OR result is `0x2b`; the AND result is `0x22`."
    ],
    "investigationTitle": "Three rules for masks"
  },
  "fields": {
    "title": "Reading and writing a field",
    "objectives": [
      "replace a field while keeping every bit outside it."
    ],
    "intro": "The warning word also holds the selected gear. Read the gear’s field, then replace it without changing the warnings.",
    "traceTitle": "Read the gear",
    "traceCaption": "Extract the gear field from the original warning word.",
    "traceTask": "The warning word is `0x2a`. What gear does `ubfx x0, x0, 4, 3` return? Enter the result in hexadecimal.",
    "traceHints": [
      "Find the gear field in the original word.",
      "The field starts at bit 4; the low warning bits are outside it.",
      "`0x2a` is `0010 1010`.",
      "Move bits 4 to 6 down to the lowest three places.",
      "The gear is `0x2`."
    ],
    "readTitle": "Reading the gear field"
  },
  "compare": {
    "title": "Choosing a signed or unsigned result",
    "objectives": [
      "choose a condition that matches the signed or unsigned order."
    ],
    "coreConditions": "After `cmp a, b`, `cs` means higher or same, unsigned: C is 1. Its opposite, `cc`, means lower: C is 0. For signed order, `ge` means greater than or equal: N equals V. Its opposite, `lt`, means less than: N differs from V."
  },
  "conditions": {
    "title": "Conditions and Boolean results",
    "objectives": [
      "read condition rules and turn a condition into a Boolean result."
    ],
    "intro": "A compare leaves flags that several conditions can read. Use the condition explorer to compare their rules, then follow how cset produces a Boolean result.",
    "extensionsSummary": "Other compiler forms and bit tests"
  },
  "addition": {
    "explanation": "The same result bits have signed and unsigned readings. After addition, C reports whether the unsigned sum is too large. V reports signed **overflow**: the mathematical signed sum is outside the signed range. These are separate tests.",
    "title": "Addition and its flags",
    "objectives": [
      "calculate result bits and flags for an addition."
    ]
  },
  "subtraction": {
    "drilldownTitle": "How an adder subtracts",
    "explanation": "N and Z describe the result bits. V reports whether the signed difference is outside the signed range. After `subs`, C is 1 when no unsigned borrow was needed. The counter result gives the forward distance only while fewer than a full turn has passed and the counter advances normally.",
    "title": "Measuring elapsed ticks",
    "objectives": [
      "use subtraction to measure elapsed ticks across a counter wrap."
    ],
    "reflection": "A subtraction gives the forward distance between counter readings when the counter advances normally and fewer than a full turn has passed. The readings alone cannot show how many full turns passed.\n\nUse this pair of counter readings:\n\n- `then` is 4294967000.\n- `now` is 296.\n\n**Question:** What does `elapsed(now, then)` return, and what does `subs` set C to?",
    "reflectionAnswer": "592, and C is 0. 296 ticks reach the wrap, 296 more reach 296, and a borrow was needed."
  },
  "arithmeticBits": {
    "title": "Arithmetic on register bits",
    "objectives": [
      "follow how addition and subtraction act on the same bits under signed and unsigned readings."
    ]
  },
  "branches": {
    "title": "Following a branch",
    "objectives": [
      "trace how a conditional branch chooses the next instruction."
    ]
  },
  "zeroAndThresholdBranch": {
    "title": "Zero and threshold branches",
    "objectives": [
      "write a function that distinguishes zero from values on either side of a threshold."
    ]
  },
  "registerBitBranches": {
    "title": "Testing registers and bits",
    "objectives": [
      "follow branches that test a register or one bit without reading the flags."
    ],
    "caption": "The course-written service function, stepped with warning word 0x2a."
  },
  "shifts": {
    "title": "Choosing a shift",
    "objectives": [
      "choose how a shift fills the places left by moved bits."
    ]
  },
  "staleFlags": {
    "title": "Flags and overflow",
    "objectives": [
      "distinguish preserved flags from flags written by the latest arithmetic operation."
    ],
    "intro": "An instruction that leaves the flags unchanged can leave an earlier operation’s flags beside a new result. Follow the two additions to identify which operation the flags describe."
  },
  "subtractionArithmetic": {
    "title": "Subtraction flags and negation",
    "objectives": [
      "relate subtraction’s flags to its arithmetic and test negation at the signed limit."
    ],
    "exampleCaption": "A counter subtraction, showing its result bits and flags."
  },
  "shiftDivision": {
    "title": "Shifts and signed division",
    "objectives": [
      "compare a shift with signed division and follow the compiler’s correction."
    ]
  }
}
```

## pacing-5-9.copy.ts

```json
{
  "counting-up": {
    "title": "Following a loop",
    "objectives": [
      "follow repeated passes through a loop and distinguish an iteration from an instruction."
    ]
  },
  "writing-an-upward-loop": {
    "title": "Writing an upward loop",
    "objectives": [
      "write a loop that repeats until its counter reaches the limit."
    ],
    "intro": "Use the `dim_up` calculation you have just traced. Write its loop, then check how the backward branch decides whether to repeat."
  },
  "counting-down": {
    "title": "Counting down with flags",
    "objectives": [
      "use subtraction flags to repeat a countdown loop."
    ]
  },
  "testing-before-and-after": {
    "title": "Testing before or after the body",
    "objectives": [
      "choose whether a loop must test before its first pass."
    ],
    "intro": "A test after the body runs that body before deciding whether to repeat. Follow the zero-count run to see why the first test matters. Then inspect whether the unsigned stopping condition can ever become false."
  },
  "stopping-when-work-ends": {
    "title": "Stopping when useful work ends",
    "objectives": [
      "stop a countdown loop when either the count or the remaining work reaches zero."
    ],
    "intro": "The `dim_down` loop has no useful shifting left once brightness reaches zero. Write a version that stops when either the ticks or the brightness run out. Follow the exercise’s input and return contract."
  },
  "loading-widths": {
    "title": "Loading stored values",
    "objectives": [
      "choose a load that preserves the intended signed or unsigned value."
    ]
  },
  "extending-register-values": {
    "title": "Extending values in registers",
    "objectives": [
      "extend a value already held in a register before using it at a wider width."
    ],
    "intro": "A wider calculation may need a value extended without reading memory again. Compare the register-only extensions with the casts that request them.",
    "activity": "Compare the input bits with each extended result. Identify whether the added bits are zeros or copies of the original top bit. Then follow the wider calculation that uses the value."
  },
  "array-addresses": {
    "title": "Selecting an array element",
    "objectives": [
      "scale an index to select the intended array element."
    ]
  },
  "traversing-arrays": {
    "title": "Walking an array",
    "objectives": [
      "follow and write an array traversal with a moving pointer."
    ],
    "intro": "Use the same array as before, with its starting address in `x0`. Compare the three addressing forms, then follow how the pointer moves while the loop sums the elements."
  },
  "products-and-widths": {
    "title": "Multiplication and addition",
    "objectives": [
      "use a low-width product and combine multiplication with addition."
    ]
  },
  "reading-product-halves": {
    "title": "Reading both halves of a product",
    "objectives": [
      "compare the low and high halves of signed and unsigned products."
    ],
    "intro": "The same register bits can produce different high halves under signed and unsigned multiplication. The low half alone does not show that difference.",
    "activity": "Run the two multiplications with the same inputs. Compare their low halves, then their high halves. Use each input’s signed or unsigned reading to explain the difference."
  },
  "division-and-remainders": {
    "title": "Division and remainders",
    "objectives": [
      "use a quotient and remainder while preserving the required input values."
    ]
  },
  "dividing-by-a-constant": {
    "title": "How GCC divides by a constant",
    "objectives": [
      "follow a recorded multiplication-and-shift implementation of unsigned division."
    ],
    "intro": "A constant divisor can let a compiler choose a different instruction sequence. This record shows GCC’s choice for `groups_of_ten`.",
    "activity": "Step through the multiply and shift. Compare the returned value with unsigned division of the same input by ten. Identify which instructions produce the quotient; keep this compiler choice separate from the rule for division."
  },
  "calls-and-returns": {
    "title": "Saving a return address",
    "objectives": [
      "save and restore the return address when one function calls another."
    ],
    "question": "A helper call writes a new return address. How can the calling function keep the address it needs to return to its own caller?\n\nThe function making a call is the **caller**; the function receiving it is the **callee**. Follow `relay_distance`, then build the call and return sequence."
  },
  "preserving-values-across-calls": {
    "title": "Preserving values across a call",
    "objectives": [
      "preserve a value that a caller still needs after a helper returns."
    ],
    "intro": "Saving the return address lets a function return. It may also need to keep data across the call. Follow `trip_report` to identify what must survive, then preserve those values in your own function."
  },
  "widening-products": {
    "title": "Widening before multiplication",
    "objectives": [
      "preserve a full product by widening the operands before multiplication."
    ],
    "intro": "A wider destination cannot recover product bits already discarded. Compare the two recorded calculations to find where the widening must happen."
  },
  "consumption-calculation": {
    "title": "Calculating fuel consumption",
    "objectives": [
      "combine multiplication and division while preserving the required intermediate values."
    ]
  },
  "transfer-widths": {
    "title": "Choosing a transfer width",
    "objectives": [
      "choose a memory-transfer width that preserves neighbouring stored values."
    ],
    "intro": "An address identifies where a transfer starts; its width determines how many bytes it touches. Compare the stores, then copy the required value without overwriting its neighbour."
  },
  "recursive-calls": {
    "title": "Following recursive calls",
    "objectives": [
      "follow how recursive calls save their values and resume after the base case returns."
    ]
  },
  "making-recursive-progress": {
    "title": "Making recursive progress",
    "objectives": [
      "make each recursive call approach the base case and use the returned result."
    ],
    "intro": "A base case cannot finish a calculation that never reaches it. Test the unchanged-argument version of `fade_sum`, then complete `lit_count` so each call advances towards zero and counts its own level."
  },
  "memory-and-addresses": {
    "title": "Memory and addresses",
    "objectives": [
      "use an address to load and store a value in memory."
    ]
  }
}
```

## pacing-10-a.copy.ts

```json
{
  "tripRead": {
    "title": "Reading generated instructions",
    "objectives": [
      "follow how the compiler carries a C calculation through registers."
    ]
  },
  "tripAssembly": {
    "title": "Writing equivalent assembly",
    "objectives": [
      "write assembly that preserves the C calculation’s result."
    ],
    "intro": "Use the C calculation you have traced as the contract. Write an instruction sequence that returns the same result."
  },
  "tripEdit": {
    "title": "Changing a C calculation",
    "objectives": [
      "change the source and trace how the generated calculation changes."
    ],
    "intro": "Change the fixed charge in the C source. Compile it again and trace how that change reaches the returned value."
  },
  "tripCap": {
    "title": "Capping a result in C",
    "objectives": [
      "write a C condition that limits the calculated charge."
    ],
    "intro": "Add a limit to the charge calculation. Use the C condition to choose between the calculated charge and the cap."
  },
  "loopRead": {
    "title": "Reading a compiled loop",
    "objectives": [
      "follow the repeated body and stopping condition in a compiled C loop."
    ]
  },
  "loopAssembly": {
    "title": "Writing an equivalent loop",
    "objectives": [
      "write assembly that repeats the calculation required by the C loop."
    ],
    "intro": "Use the repeated calculation and stopping condition from the compiled loop. Write an assembly loop that preserves both."
  },
  "loopBoundary": {
    "title": "Changing a loop boundary",
    "objectives": [
      "trace how a changed comparison affects the loop’s final pass."
    ],
    "intro": "Change the loop comparison and follow a complete run. Check which values reach the body and where the loop stops."
  },
  "loopShifts": {
    "title": "Writing repeated shifts in C",
    "objectives": [
      "construct a C loop that shifts a value repeatedly."
    ],
    "intro": "Express repeated shifts as a C loop. Keep the changing value and the stopping condition visible in the source."
  },
  "conversions": {
    "title": "Conversions and comparisons",
    "objectives": [
      "check a value’s range before conversion and identify the comparison rule C selects."
    ],
    "motivation": "Narrowing can change a value even when no arithmetic overflows. If the application must reject values outside a required range, check the original value before converting it. The recorded conversions show why keeping the low byte is not a range check."
  },
  "checkedAdd": {
    "title": "Checked addition",
    "objectives": [
      "store the sum bits and return a separate report of signed overflow."
    ],
    "intro": "Checked addition has two outputs: stored result bits and a report of whether the mathematical sum fits. Keep them separate. The following experiment stores the sum but tests the wrong flag for its report."
  },
  "nativeBoot": {
    "title": "Building and booting an executable",
    "objectives": [
      "assemble and link the trip function, then boot and check its report in QEMU."
    ],
    "repairTitle": "Repair and rebuild the calculation",
    "finalTask": "Repair `trip_distance`. Four signed 32-bit values arrive in registers:\n\n- The first distance in `w0`.\n- The second distance in `w1`.\n- The third distance in `w2`.\n- The correction in `w3`.\n\nReturn the sum of the distances minus the correction in `w0`, then return to the assembly caller. The supplied tests stay within the signed 32-bit range.\n\nThe browser tests check several input sets and accept any permitted instruction sequence with the required behaviour. Copy your function body into `trip_distance.s`, keeping the function label and the supplied lines beginning with a dot. Assemble it again, link `boot.elf` again and boot it. The native caller checks the original trip inputs and chooses a serial message. The following pages trace the executable’s loading and startup."
  },
  "nativeLayout": {
    "title": "Loading the executable image",
    "objectives": [
      "connect the executable’s sections and loading information to its memory layout."
    ],
    "intro": "The executable has already booted. Inspect how the linker script and ELF loading information describe the image’s contents and their positions in memory.",
    "checkpoint": "Record the entry point selected by the linker script. Identify the LOAD segments and distinguish bytes stored in the ELF file from space reserved in memory.",
    "conditionalAssembly": "In `boot.s`, `.ifdef CHALLENGE`, `.else` and `.endif` choose which source block the assembler includes. With the ordinary build, `CHALLENGE` is not defined, so it includes the single-call block after `.else`. These directives do not create a runtime choice. [Finding and repairing a native error](#/lesson/diagnosing-native-failure) selects the other block for its test caller."
  },
  "piConnect": {
    "title": "Preparing and connecting the Pi",
    "objectives": [
      "prepare the Pi and probe for a serial-output test."
    ],
    "checkpoint": "Keep the board and EEPROM details with your test record, or mark them unknown. Check the dedicated UART connection with the Pi and probe disconnected from power. Leave the Pi powered off.",
    "investigation": "With the Pi and probe disconnected from power, connect the supplied three-pin cable between the probe’s **U** socket and the Pi 5 connector labelled **UART**. This dedicated connector is separate from the large GPIO header. The probe’s **D** socket is for a different debugging connection.\n\nMatch the keyed plugs to their sockets and do not force them. Use the [official probe picture and cable guide](https://www.raspberrypi.com/documentation/microcontrollers/debug-probe.html#about-the-debug-probe) to identify them. The schematic shows the connection and output direction; it is not a pin-orientation drawing or a recording of a Pi run. Leave the Pi powered off until the serial terminal is ready for the first boot.",
    "intro": "The trip calculation already runs on QEMU. Move that same assembly function onto a Raspberry Pi 5. The work changes around it: firmware loads the image, startup prepares the processor, and a physical serial connection carries the report.\n\n**Hardware verification is pending.** The build checks inspect the image’s files and layout. They do not establish that the Pi boots it or sends readable serial output. Prepare the connection here, then build and stage the image before the physical boot test.\n\nThe Pi stores its bootloader in **EEPROM**, rewritable storage that keeps its contents without power."
  },
  "piBuild": {
    "title": "Building and staging the Pi image",
    "objectives": [
      "build the raw image and stage the files the Pi firmware will load."
    ],
    "intro": "The Pi firmware needs a raw image and matching configuration. Build and stage those files before preparing the card. The build checks do not establish that the image boots on hardware. Hardware verification remains pending.",
    "checkpoint": "Keep the staged files and their checksum record together. Copy the source revision from the course footer into your test record. Run `sha256sum assembly-lab-pi5.img` in the source directory for the image’s fingerprint.",
    "bootExplanation": "The diagram follows this example’s normal microSD boot path. The Pi stores its bootloader in **EEPROM**, rewritable storage that keeps its contents without power. Pi 5’s bootloader includes firmware work that older Pi boards load from separate `start.elf` files. The firmware’s Arm startup code, called its **Arm stub**, runs before handing control to our image’s `_start`.\n\nThe supplied raw image contains instruction and data bytes without ELF loading information. The firmware configuration and linker script must agree about where those bytes go. Our startup then prepares its own stack and clears `.bss`, as it did in QEMU.\n\nThe Pi’s firmware and devices belong to this board. Reusing QEMU’s UART address or assuming its initial processor state would not port the program.",
    "comparison": "Open the two `trip_distance.s` files, from Module 12 and the downloaded Pi bundle. The arithmetic instructions stay the same. Identify the files that instead choose the load address, prepare startup and send the report. Those are the parts to inspect when moving this function to another board."
  },
  "piCapture": {
    "title": "Capturing the first Pi boot",
    "objectives": [
      "boot the staged image and save the actual serial output."
    ],
    "intro": "Use the staged build from the preceding page. Prepare the spare card and open the serial terminal before powering the Pi. Hardware verification remains pending until you record what your board sends.",
    "checkpoint": "Save the actual serial capture and mark any unobserved stage as unverified. Record the terminal settings and the image checksum. Close the terminal and remove Pi power before changing the card or cable. Run `sha256sum assembly-lab-pi5.img` in the source directory for the image’s fingerprint.",
    "troubleshooting": "Use the earliest evidence you have:\n\n- **No probe device:** check its USB data connection and host access before investigating the Pi’s code.\n- **Firmware messages but no Assembly Lab line:** inspect the card’s filenames, load address and new image. Startup accepts entry at EL1 or EL2, two exception levels, with address translation disabled. Address translation maps a program’s addresses to other memory addresses. Other entry conditions stop this image without output. Firmware output alone does not establish that our startup ran.\n- **Unreadable characters:** check the terminal’s speed and line settings against the supplied UART setup. A successful assembly does not test the physical serial clock.\n- **A trip-check failure:** our caller reached its comparison and chose the failing report. Inspect the arithmetic and make sure the card contains the intended build.\n- **No bytes at all:** a missing report does not locate the fault. Recheck the dedicated connector, cable, power, card and terminal before concluding that the arithmetic failed.\n\nHardware verification remains pending. The [Pi 5 sources and hardware-test record](native/pi5/HARDWARE-TEST.md) distinguish the checked file layout from the still-unverified firmware handoff and serial path. Do not use Module 12’s QEMU `virt` run as evidence that this board-specific image boots."
  },
  "piRestore": {
    "title": "Breaking and restoring the Pi calculation",
    "objectives": [
      "capture a deliberate failure and a restored boot, then diagnose from the earliest evidence."
    ],
    "intro": "Keep the first capture as your baseline. Change the calculation, rebuild and replace the card’s image, then capture the new boot. Restore the source and repeat the full build and boot sequence. Hardware verification remains pending; expected messages are source-selected expectations, not recorded Pi output.",
    "checkpoint": "Record your Pi model, EEPROM version, source revision, image checksum, terminal settings and actual serial capture. Use the optional Raspberry Pi OS commands from the preparation page for board and EEPROM details, or record unknown. Copy the commit shown in the course footer as the source revision. Run `sha256sum assembly-lab-pi5.img` in the source directory for the image’s fingerprint. Keep the working, broken and restored runs separate. Repeat the restored image from a fresh power-on.\n\nWhich observation shows that our code ran? Which shows that the arithmetic check rejected the deliberate error? If a stage is still unobserved, record it as unverified. Your hardware test completes the evidence that a build alone cannot provide."
  },
  "a32Orientation": {
    "title": "A32 registers and returns",
    "objectives": [
      "identify the A32 argument, result and return conventions in a recorded leaf function."
    ],
    "task": "Find the return instruction in the recorded A32 `limit_trip`. Enter its mnemonic only, without its register operand.",
    "challengeTitle": "Identify the return instruction",
    "hints": [
      "Read the A32 side of the paired listing.",
      "The answer is an instruction name, not a register name.",
      "A64 uses `ret` for this role. Find the A32 line that returns to the saved address.",
      "Enter the instruction name before `lr`.",
      "Enter `bx`."
    ]
  },
  "a32Conditions": {
    "title": "A32 conditional moves and syntax",
    "objectives": [
      "identify a recorded A32 conditional move and check its syntax against the course A64 assembler."
    ],
    "task": "Find the conditional move in the recorded A32 `limit_trip`. Enter the complete mnemonic, including its condition suffix, without register operands.",
    "challengeTitle": "Identify the conditional move",
    "hints": [
      "Read the move line on the A32 side.",
      "Keep the condition suffix attached to the instruction name.",
      "The move copies the limit only when its condition holds.",
      "The suffix is `cs`, for carry set.",
      "Enter `movcs`."
    ],
    "intro": "The recorded limit function uses an A32 conditional move. Compare its role with A64’s select, then test the recorded line against the course assembler."
  },
  "a32Constants": {
    "title": "A32 constant instructions",
    "objectives": [
      "distinguish an A32 constant instruction from an A64 register-width name."
    ],
    "task": "Open the recorded service-marker pair. Enter the A32 instruction used to load the marker constant. Give only its mnemonic.",
    "challengeTitle": "Identify the constant instruction",
    "hints": [
      "Read the A32 side of the service-marker pair.",
      "The `w` in this instruction’s name is not an A64 register prefix.",
      "In the A64 line `mov w0, 1001`, the instruction name is `mov`. Identify the corresponding token on the A32 side.",
      "The requested name comes before `r0`.",
      "Enter `movw`."
    ],
    "intro": "Read the service-marker pair to compare how each target loads its constant. Check which letters belong to the instruction name."
  },
  "a32Division": {
    "title": "A32 division helpers",
    "objectives": [
      "distinguish a recorded helper call from an A64 division instruction."
    ],
    "task": "Open the recorded average pair, then run the A64 average with distance 95 and trip count 4. Enter the A32 division helper’s name, the A64 division mnemonic and the A64 result. For the helper, give the name after the call instruction.",
    "challengeTitle": "Compare the division paths",
    "hints": [
      "Use the average pair for the names and the A64 stepper for the result.",
      "The call instruction and the helper name are separate tokens.",
      "The helper field asks for the name after `bl`, not `bl` itself.",
      "Unsigned integer division keeps the whole-number quotient and discards the fractional part.",
      "Enter `__aeabi_uidiv` for the helper, `udiv` for the A64 instruction and 23 for the result."
    ],
    "intro": "Read the unsigned-average pair. Follow the A64 run and identify the helper call chosen for the recorded A32 target."
  },
  "nativeRuntime": {
    "title": "Preparing the runtime state",
    "objectives": [
      "follow startup as it prepares the stack and storage before calling the trip function."
    ],
    "intro": "Loading places the image in memory. Startup must then prepare the stack and working storage that the called function needs. Follow those steps before the calculation and output.",
    "checkpoint": "Find the instructions that prepare the stack and clear working storage. Identify where startup supplies the arguments, calls the trip function and sends its selected report. Compare those source operations with the recorded stops.",
    "loading": "The supplied QEMU command that boots `boot.elf` uses QEMU’s ELF loader before our instructions run. The control-flow schematic separates host loading from guest execution and compares it with a possible physical-board boot chain.\n\nOn a physical board, reset begins at an address determined by that processor and system. Many Arm systems first execute **boot ROM**, startup code stored in read-only memory. **Firmware** is the board’s early startup software; a **bootloader** loads the next program and transfers control to it. Their stages and handoff conditions depend on the board.\n\n**BIOS** usually names the legacy PC firmware interface. Some Arm machines use **UEFI**, a modern firmware interface also used on PCs. Neither runs in this QEMU direct-ELF path. Our image is bootable on the chosen QEMU machine; it is not a universal disk or USB boot image."
  },
  "debugConnect": {
    "title": "Connecting GDB and checking startup",
    "objectives": [
      "connect GDB to paused QEMU and verify that startup clears the marked storage."
    ],
    "intro": "Use the source directory and working `boot.elf` from Building and booting an executable. Restore the subtraction and rebuild if you left the deliberate error in place. Start a paused QEMU session, connect GDB and test storage clearing with the marker before proceeding to the function.",
    "checkpoint": "Close this session before starting another. In GDB, enter `detach`, then `quit`. In the QEMU terminal, press Ctrl-A, release it, then press X. If GDB is still running when you need to stop, press Ctrl-C there before the detach commands."
  },
  "debugStep": {
    "title": "Stepping the native function",
    "objectives": [
      "follow every instruction of the native trip function and inspect the saved result."
    ],
    "intro": "Use the source directory and working `boot.elf` from Building and booting an executable. Restore the subtraction and rebuild if needed. Start fresh QEMU and GDB sessions. Connect to the paused machine, then stop at `trip_distance` to check its inputs. Use `continue` to resume the remote machine; do not use GDB’s `run` command.",
    "checkpoint": "Record the function’s returned value and the value saved by its caller. Check where the program counter points before and after `ret`. Close both sessions before starting another run."
  },
  "debugRepair": {
    "title": "Finding and repairing a native error",
    "objectives": [
      "locate the first incorrect write and test a revised function in a bootable image."
    ],
    "intro": "Use the source directory and working `boot.elf` from Building and booting an executable. Close the old GDB and QEMU sessions before editing or rebuilding. In `trip_distance.s`, change the third arithmetic instruction to `add w0, w0, w3`. Rebuild with the commands below, then start fresh QEMU and GDB sessions and stop at `trip_distance`.",
    "originalCaption": "The original trip function at the recorded GDB stops, with the matching browser-model state.",
    "modifiedCaption": "The modified trip function at the same named GDB stops, with the matching browser-model state. Compare it with the original recording."
  }
}
```
