# Course pacing implementation: new copy

Drafted separately from checked facts supplied by the three implementation agents. Existing canonical paragraphs remain in their original records. These exact strings are additions or replacements for page boundaries and local activities. The arithmetic comparison revision adds fresh compiler records and model-backed return values, described in its checked-facts brief below.

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
    "intro": "The **unsigned reading** adds the positive amounts represented by the bits. The simulator shows register numbers in unsigned decimal. Use the figure to follow how the bits contribute to that number.",
    "investigation": "Each bit has a **weight**. Bit 0, on the right, has weight 1. Each position to the left doubles the weight. The leftmost bit, bit 31, is the **top bit**.\n\nA set bit contributes its weight. A clear bit contributes zero. Add the contributions to get the unsigned reading.\n\nThe figure starts with only bit 0 set. Press a bit to set or clear it and inspect its weight."
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
    "intro": "A constant that does not fit one instruction can be built in parts. Use movk to replace a part while keeping the other bits.",
    "reminder": "`mov` replaces the whole destination value. [Loading a constant](#/lesson/constants-and-widths) shows which constants fit one instruction."
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
    "investigationTitle": "Three rules for masks",
    "reminder": "A negative printed constant still names a bit pattern. [Signed and unsigned readings](#/lesson/same-bits-two-readings) shows how the same bits can have either reading."
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
    "readTitle": "Reading the gear field",
    "reminder": "AND clears bits where its mask has zeros; OR sets bits where its mask has ones. [Changing one warning](#/lesson/masks) lets you try both rules."
  },
  "compare": {
    "title": "Choosing a signed or unsigned result",
    "objectives": [
      "choose a condition that matches the signed or unsigned order."
    ],
    "coreConditions": "After `cmp a, b`, choose the condition for the reading you need:\n\n- `cs` means higher or same, unsigned: C is 1.\n- Its opposite, `cc`, means lower, unsigned: C is 0.\n- `ge` means greater than or equal, signed: N equals V.\n- Its opposite, `lt`, means less than, signed: N differs from V.",
    "reminder": "After subtraction, C records whether no unsigned borrow was needed, while V records signed overflow. [Subtraction flags and negation](#/lesson/subtraction-flags-and-negation) explains these separate tests."
  },
  "conditions": {
    "title": "Conditions and Boolean results",
    "objectives": [
      "read condition rules and turn a condition into a Boolean result."
    ],
    "intro": "A compare leaves flags that several conditions can read. Use the condition explorer to compare their rules, then follow how cset produces a Boolean result.",
    "extensionsSummary": "Other compiler forms and bit tests",
    "reminder": "A condition reads flags using a signed or unsigned rule. [Choosing a signed or unsigned result](#/lesson/compare-and-choose) follows the compare and selection together."
  },
  "addition": {
    "explanation": "The same result bits have signed and unsigned readings. After addition:\n\n- C reports whether the unsigned sum is too large.\n- V reports signed **overflow**: the mathematical signed sum is outside the signed range.\n\nThese are separate tests.",
    "title": "Addition and its flags",
    "objectives": [
      "calculate result bits and flags for an addition."
    ],
    "reminder": "The same bits can represent different signed and unsigned numbers. [Signed and unsigned readings](#/lesson/same-bits-two-readings) shows how to calculate each reading."
  },
  "subtraction": {
    "drilldownTitle": "How an adder subtracts",
    "explanation": "After `subs`:\n\n- N and Z describe the result bits.\n- V reports whether the signed difference is outside the signed range.\n- C is 1 when no unsigned borrow was needed.\n\nThe counter result gives the forward distance only while fewer than a full turn has passed and the counter advances normally.",
    "title": "Measuring elapsed ticks",
    "objectives": [
      "use subtraction to measure elapsed ticks across a counter wrap."
    ],
    "reflection": "A subtraction gives the forward distance between counter readings when the counter advances normally and fewer than a full turn has passed. The readings alone cannot show how many full turns passed.\n\nUse this pair of counter readings:\n\n- `then` is 4294967000.\n- `now` is 296.\n\n**Question:** What does `elapsed(now, then)` return, and what does `subs` set C to?",
    "reflectionAnswer": "592, and C is 0. 296 ticks reach the wrap, 296 more reach 296, and a borrow was needed."
  },
  "arithmeticBits": {
    "title": "Arithmetic on register bits",
    "comparisonTitle": "A trip beyond its planned distance",
    "objectives": [
      "choose C types and checks that match what a trip’s returned distance should mean."
    ],
    "intro": "The trip computer should show how much distance remains and how far you have gone beyond the plan. You planned 3 km and travelled 5 km. Can the returned distance express that you are beyond the plan?\n\nCompare two C functions that subtract the distance travelled from the planned distance. Their parameter and return types differ. You have already calculated this subtraction with four bits.\n\nOn this AArch64 target, both types use 32 bits:\n\n- `int` uses the signed reading.\n- `unsigned int` uses the unsigned reading.\n\nIn C, `unsigned` on its own means `unsigned int`.",
    "caption": "Two independent calls with planned = 3 km and travelled = 5 km. Predict the instructions, then press Run comparison to compare their returned bits and C values.",
    "question": "Does changing these C types from `int` to `unsigned` change the instructions in the recorded GCC output?",
    "options": [
      {
        "value": "same",
        "label": "The instructions are identical."
      },
      {
        "value": "different",
        "label": "The instructions differ."
      }
    ],
    "explain": "Both listings use `sub w0, w0, w1` followed by `ret`. The subtraction keeps the low 32 result bits. It needs no separate signed or unsigned form.",
    "callIntro": "After checking your prediction, press **Run comparison**. The simulator runs each function independently from the same starting arguments. Their matching returned bits appear with a separate C reading for each return type.",
    "contract": "Decide what the function should return when the trip exceeds its plan: a negative distance, zero, or a separate error report. That choice determines the C types and any checks the function needs. Changing the types alone does not add a check.",
    "reflectionTitle": "Return zero beyond the plan",
    "reflection": "If the function must return zero once the planned distance is exceeded, what check must it make before subtracting?",
    "reflectionSummary": "Check your reasoning",
    "reflectionAnswer": "Check whether `travelled > planned`. If so, return zero; otherwise subtract `travelled` from `planned`. Make this check before subtracting so the unsigned subtraction cannot wrap below zero.",
    "compilerSummary": "Which compiler?",
    "compiler": "These are recorded GCC 16.1.0 listings for AArch64 Linux, compiled with `-O1 -g`. `-O1` enables compiler optimisations; `-g` records source-line information. Other compiler settings may choose different instructions. The unsigned arithmetic rule follows draft N3096, section 6.2.5 paragraph 11.",
    "originality": {
      "textbookExample": "A signed-versus-unsigned puzzle that changes the source, the arithmetic and the displayed interpretation at once.",
      "howThisDiffers": "Continues the earlier four-bit 3 minus 5 subtraction with two recorded 32-bit trip functions. The learner predicts whether their instructions differ, then compares model-derived returns against the trip’s purpose and chooses a check for a different return rule."
    }
  },
  "branches": {
    "title": "Following a branch",
    "objectives": [
      "trace how a conditional branch chooses the next instruction."
    ],
    "reminder": "A condition asks a yes-or-no question about the flags. [Conditions and Boolean results](#/lesson/conditions-and-boolean-results) lists the rules each condition uses."
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
    "caption": "The course-written service function, stepped with warning word 0x2a.",
    "reminder": "Each warning occupies its own bit in the warning word. [Changing one warning](#/lesson/masks) gives the warning positions and shows how to change one bit independently."
  },
  "shifts": {
    "title": "Choosing a shift",
    "objectives": [
      "choose how a shift fills the places left by moved bits."
    ],
    "reminder": "A set top bit makes the signed reading negative, while the unsigned reading stays non-negative. [Signed and unsigned readings](#/lesson/same-bits-two-readings) explains the two readings."
  },
  "staleFlags": {
    "title": "Flags and overflow",
    "objectives": [
      "distinguish preserved flags from flags written by the latest arithmetic operation."
    ],
    "intro": "An instruction that leaves the flags unchanged can leave an earlier operation’s flags beside a new result. Follow the two additions to identify which operation the flags describe.",
    "reminder": "`add` leaves the flags unchanged; `adds` writes them. [Addition and its flags](#/lesson/adding-and-the-flags) explains what N, Z, C and V record."
  },
  "subtractionArithmetic": {
    "title": "Subtraction flags and negation",
    "objectives": [
      "relate subtraction’s flags to its arithmetic and test negation at the signed limit."
    ],
    "exampleCaption": "A counter subtraction, showing its result bits and flags.",
    "reminder": "Each addition column passes its carry to the next column on the left. [Addition and its flags](#/lesson/adding-and-the-flags) follows those carries and the flags they produce."
  },
  "shiftDivision": {
    "title": "Shifts and signed division",
    "objectives": [
      "compare a shift with signed division and follow the compiler’s correction."
    ],
    "reminder": "`asr` fills from the old top bit; `lsr` fills with zeros. [Choosing a shift](#/lesson/shifts) shows how that changes the signed and unsigned readings."
  }
}
```

## pacing-5-9.copy.ts

```json
{
  "counting-up": {
    "reminder": "The condition after `cmp` chooses the unsigned comparison, as in [Zero and threshold branches](#/lesson/zero-and-threshold-branches).",
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
    "widthLink": "[Writing w and x registers](#/lesson/register-widths)",
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
    "activity": "1. Compare the input bits with each extended result.\n2. Identify whether the added bits are zeros or copies of the original top bit.\n3. Follow the wider calculation that uses the value."
  },
  "array-addresses": {
    "reminder": "A left shift multiplies by a power of two and discards bits that leave the register, as in [Choosing a shift](#/lesson/shifts).",
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
    "activity": "1. Run the two multiplications with the same inputs.\n2. Compare their low halves, then their high halves.\n3. Use each input’s signed or unsigned reading to explain the difference."
  },
  "division-and-remainders": {
    "title": "Division and remainders",
    "objectives": [
      "use a quotient and remainder while preserving the required input values."
    ]
  },
  "dividing-by-a-constant": {
    "reminder": "The high half contains the product bits above the low register width, as in [Reading both halves of a product](#/lesson/reading-product-halves).",
    "title": "How GCC divides by a constant",
    "objectives": [
      "follow a recorded multiplication-and-shift implementation of unsigned division."
    ],
    "intro": "A constant divisor can let a compiler choose a different instruction sequence. This record shows GCC’s choice for `groups_of_ten`.",
    "activity": "1. Step through the multiply and shift.\n2. Compare the returned value with unsigned division of the same input by ten.\n3. Identify which instructions produce the quotient.\n\nKeep this compiler choice separate from the rule for division."
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
    "reminder": "Widen the operands before multiplying to preserve the full product, as in [Widening before multiplication](#/lesson/widening-products).",
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
    "reminder": "The original brightness must survive the recursive call; [Preserving values across a call](#/lesson/preserving-values-across-calls) shows how a saved register keeps such a value available.",
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
    ],
    "reminder": "`movk` replaces one part of a register while preserving the other bits; [Building a constant](#/lesson/building-constants) shows how it combines with `movz`."
  },
  "tripAssembly": {
    "title": "Writing equivalent assembly",
    "objectives": [
      "write assembly that preserves the C calculation’s result."
    ],
    "intro": "A 32-bit `mul` keeps the low 32 product bits, as in [Multiplication and addition](#/lesson/products-and-widths). Use the C calculation you have traced as the contract. Write an instruction sequence that returns the same result."
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
    "intro": "Unsigned comparisons use different conditions from signed comparisons; [Choosing a signed or unsigned result](#/lesson/compare-and-choose) shows how the instruction selects the reading. Add a limit to the charge calculation. Use the C condition to choose between the calculated charge and the cap."
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
    "intro": "Check the count before entering the body so zero means no iterations, as in [Testing before and after](#/lesson/testing-before-and-after). Use the repeated calculation and stopping condition from the compiled loop. Write an assembly loop that preserves both."
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
    "intro": "An unsigned right shift fills the vacated positions with zero, as in [Choosing a shift](#/lesson/shifts). Express repeated shifts as a C loop. Keep the changing value and the stopping condition visible in the source."
  },
  "conversions": {
    "title": "Conversions and comparisons",
    "objectives": [
      "check a value’s range before conversion and identify the comparison rule C selects."
    ],
    "motivation": "Narrowing can change a value even when no arithmetic overflows. If the application must reject values outside a required range, check the original value before converting it. The recorded conversions show why keeping the low byte is not a range check. Sign extension repeats the narrow value’s top bit; [Extending values in registers](#/lesson/extending-register-values) traces that rule."
  },
  "overflowReminder": "A64’s V flag reports signed overflow; [Flags and overflow](#/lesson/flags-and-overflow) separates that report from unsigned carry. The next experiment executes an instruction directly, so its rules differ from those of the C expression.",
  "checkedAdd": {
    "title": "Checked addition",
    "objectives": [
      "store the sum bits and return a separate report of signed overflow."
    ],
    "intro": "Checked addition has two outputs: stored result bits and a report of whether the mathematical sum fits. Keep them separate. [Flags and overflow](#/lesson/flags-and-overflow) distinguishes unsigned carry from signed overflow. The following experiment stores the sum but tests the wrong flag for its report."
  },
  "nativeBoot": {
    "title": "Building and booting an executable",
    "objectives": [
      "assemble and link the trip function, then boot and check its report in QEMU."
    ],
    "repairTitle": "Repair and rebuild the calculation",
    "reminder": "A caller supplies arguments in registers and `ret` returns to its saved address, as in [Saving a return address](#/lesson/calls-and-returns). The native startup below supplies that caller.",
    "finalTask": "Repair `trip_distance`. Four signed 32-bit values arrive in registers:\n\n- The first distance in `w0`.\n- The second distance in `w1`.\n- The third distance in `w2`.\n- The correction in `w3`.\n\nReturn the sum of the distances minus the correction in `w0`, then return to the assembly caller. The supplied tests stay within the signed 32-bit range.\n\nThe browser tests check several input sets and accept any permitted instruction sequence with the required behaviour. Copy your function body into `trip_distance.s`, keeping the function label and the supplied lines beginning with a dot. Assemble it again, link `boot.elf` again and boot it. The native caller checks the original trip inputs and chooses a serial message. The following pages trace the executable’s loading and startup."
  },
  "nativeLayout": {
    "title": "Loading the executable image",
    "objectives": [
      "connect the executable’s sections and loading information to its memory layout."
    ],
    "intro": "[Building and booting an executable](#/lesson/from-function-to-executable) supplies the working `boot.elf` used here. The executable has already booted. Inspect how the linker script and ELF loading information describe the image’s contents and their positions in memory.",
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
    "intro": "The trip calculation already runs on QEMU in [Building and booting an executable](#/lesson/from-function-to-executable). Move that same assembly function onto a Raspberry Pi 5. The work changes around it: firmware loads the image, startup prepares the processor, and a physical serial connection carries the report.\n\n**Hardware verification is pending.** The build checks inspect the image’s files and layout. They do not establish that the Pi boots it or sends readable serial output. Prepare the connection here, then build and stage the image before the physical boot test.\n\nThe Pi stores its bootloader in **EEPROM**, rewritable storage that keeps its contents without power."
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
    "intro": "Use the staged build from [Building and staging the Pi image](#/lesson/raspberry-pi-boot). Prepare the spare card and open the serial terminal before powering the Pi. Hardware verification remains pending until you record what your board sends.",
    "checkpoint": "Save the actual serial capture and mark any unobserved stage as unverified. Record the terminal settings and the image checksum. Close the terminal and remove Pi power before changing the card or cable. Run `sha256sum assembly-lab-pi5.img` in the source directory for the image’s fingerprint.",
    "troubleshooting": "Use the earliest evidence you have:\n\n- **No probe device:** check its USB data connection and host access before investigating the Pi’s code.\n- **Firmware messages but no Assembly Lab line:** inspect the card’s filenames, load address and new image. Startup accepts entry at EL1 or EL2, two exception levels, with address translation disabled. Address translation maps a program’s addresses to other memory addresses. Other entry conditions stop this image without output. Firmware output alone does not establish that our startup ran.\n- **Unreadable characters:** check the terminal’s speed and line settings against the supplied UART setup. A successful assembly does not test the physical serial clock.\n- **A trip-check failure:** our caller reached its comparison and chose the failing report. Inspect the arithmetic and make sure the card contains the intended build.\n- **No bytes at all:** a missing report does not locate the fault. Recheck the dedicated connector, cable, power, card and terminal before concluding that the arithmetic failed.\n\nHardware verification remains pending. The [Pi 5 sources and hardware-test record](native/pi5/HARDWARE-TEST.md) distinguish the checked file layout from the still-unverified firmware handoff and serial path. Do not use Module 12’s QEMU `virt` run as evidence that this board-specific image boots."
  },
  "piRestore": {
    "title": "Breaking and restoring the Pi calculation",
    "objectives": [
      "capture a deliberate failure and a restored boot, then diagnose from the earliest evidence."
    ],
    "intro": "Keep the first capture from [Capturing the first Pi boot](#/lesson/capture-pi-boot) as your baseline. Change the calculation, rebuild and replace the card’s image, then capture the new boot. Restore the source and repeat the full build and boot sequence. Hardware verification remains pending; expected messages are source-selected expectations, not recorded Pi output.",
    "checkpoint": "Keep a test record with:\n\n- Your Pi model and EEPROM version.\n- The source revision and image checksum.\n- The terminal settings and actual serial capture.\n\nUse the optional Raspberry Pi OS commands from the preparation page for board and EEPROM details, or record unknown. Copy the commit shown in the course footer as the source revision. Run `sha256sum assembly-lab-pi5.img` in the source directory for the image’s fingerprint. Keep the working, broken and restored runs separate. Repeat the restored image from a fresh power-on.\n\nWhich observation shows that our code ran? Which shows that the arithmetic check rejected the deliberate error? If a stage is still unobserved, record it as unverified. Your hardware test completes the evidence that a build alone cannot provide."
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
    "intro": "A64 `csel` chooses a value using the flags from a comparison, as in [Choosing a signed or unsigned result](#/lesson/compare-and-choose). The recorded limit function uses an A32 conditional move. Compare its role with A64’s select, then test the recorded line against the course assembler."
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
    "intro": "A64 `movk` keeps the bits outside its selected part, as in [Building a constant](#/lesson/building-constants). Read the service-marker pair to compare how each target loads its constant. Check which letters belong to the instruction name."
  },
  "a32Division": {
    "title": "A32 division helpers",
    "objectives": [
      "distinguish a recorded helper call from an A64 division instruction."
    ],
    "task": "Open the recorded average pair, then run the A64 average with distance 95 and trip count 4. Enter:\n\n- The A32 division helper’s name, given after the call instruction.\n- The A64 division mnemonic.\n- The A64 result.",
    "challengeTitle": "Compare the division paths",
    "hints": [
      "Use the average pair for the names and the A64 stepper for the result.",
      "The call instruction and the helper name are separate tokens.",
      "The helper field asks for the name after `bl`, not `bl` itself.",
      "Unsigned integer division keeps the whole-number quotient and discards the fractional part.",
      "Enter `__aeabi_uidiv` for the helper, `udiv` for the A64 instruction and 23 for the result."
    ],
    "intro": "Unsigned division keeps the whole-number quotient, as in [Division and remainders](#/lesson/division-and-remainders). Read the unsigned-average pair. Follow the A64 run and identify the helper call chosen for the recorded A32 target."
  },
  "nativeRuntime": {
    "title": "Preparing the runtime state",
    "objectives": [
      "follow startup as it prepares the stack and storage before calling the trip function."
    ],
    "intro": "The stack uses `sp` to locate saved values, as in [Preserving values across calls](#/lesson/preserving-values-across-calls). Loading places the image in memory. Startup must then prepare the stack and working storage that the called function needs. Follow those steps before the calculation and output.",
    "checkpoint": "Find the instructions that prepare the stack and clear working storage. Identify where startup supplies the arguments, calls the trip function and sends its selected report. Compare those source operations with the recorded stops.",
    "loading": "The supplied QEMU command that boots `boot.elf` uses QEMU’s ELF loader before our instructions run. The control-flow schematic separates host loading from guest execution and compares it with a possible physical-board boot chain.\n\nOn a physical board, reset begins at an address determined by that processor and system. Many Arm systems first execute **boot ROM**, startup code stored in read-only memory. **Firmware** is the board’s early startup software; a **bootloader** loads the next program and transfers control to it. Their stages and handoff conditions depend on the board.\n\n**BIOS** usually names the legacy PC firmware interface. Some Arm machines use **UEFI**, a modern firmware interface also used on PCs. Neither runs in this QEMU direct-ELF path. Our image is bootable on the chosen QEMU machine; it is not a universal disk or USB boot image."
  },
  "debugConnect": {
    "title": "Connecting GDB and checking startup",
    "objectives": [
      "connect GDB to paused QEMU and verify that startup clears the marked storage."
    ],
    "intro": "Use the source directory and working `boot.elf` from [Building and booting an executable](#/lesson/from-function-to-executable). Restore the subtraction and rebuild if you left the deliberate error in place. Start a paused QEMU session, connect GDB and test storage clearing with the marker before proceeding to the function.",
    "checkpoint": "Close this session before starting another. In GDB, enter `detach`, then `quit`. In the QEMU terminal, press Ctrl-A, release it, then press X. If GDB is still running when you need to stop, press Ctrl-C there before the detach commands."
  },
  "debugStep": {
    "title": "Stepping the native function",
    "objectives": [
      "follow every instruction of the native trip function and inspect the saved result."
    ],
    "intro": "Use the source directory and working `boot.elf` from [Building and booting an executable](#/lesson/from-function-to-executable). Restore the subtraction and rebuild if needed. Start fresh QEMU and GDB sessions. Connect to the paused machine, then stop at `trip_distance` to check its inputs. Use `continue` to resume the remote machine; do not use GDB’s `run` command.",
    "checkpoint": "Record the function’s returned value and the value saved by its caller. Check where the program counter points before and after `ret`. Close both sessions before starting another run."
  },
  "debugRepair": {
    "title": "Finding and repairing a native error",
    "objectives": [
      "locate the first incorrect write and test a revised function in a bootable image."
    ],
    "intro": "Use the source directory and working `boot.elf` from [Building and booting an executable](#/lesson/from-function-to-executable). Close the old GDB and QEMU sessions before editing or rebuilding. In `trip_distance.s`, change the third arithmetic instruction to `add w0, w0, w3`. Rebuild with the commands below, then start fresh QEMU and GDB sessions and stop at `trip_distance`.",
    "originalCaption": "The original trip function at the recorded GDB stops, with the matching browser-model state.",
    "modifiedCaption": "The modified trip function at the same named GDB stops, with the matching browser-model state. Compare it with the original recording."
  }
}
```

## Arithmetic comparison revision: checked-facts brief

- Outcome: choose types and checks from the meaning the trip function promises to return. The planned 3 km and travelled 5 km should be able to express a 2 km overrun; the model supplies every displayed return value.
- Preparation: signed and unsigned readings already establish bit weights and both 32-bit ranges. Four-bit arithmetic already demonstrates retained result bits, inversion plus one, and 3 minus 5 equals minus 2. This page applies those mechanisms to recorded 32-bit functions.
- Recorded evidence: `TRIP_REMAINING` and `TRIP_REMAINING_U`, GCC 16.1.0 for AArch64 Linux at `-O1 -g`, both contain `sub w0, w0, w1` and `ret`. Calls with arguments 3 and 5 return `0xfffffffe`; the model reads those bits as signed −2 and unsigned 4294967294.
- C source: N3096 section 6.2.5 paragraph 11 defines unsigned arithmetic modulo the type range. Section 6.5 paragraph 5 gives undefined behaviour when an expression result is outside its type’s representable range. Minus 2 fits signed `int` here.
- Proposed misconception checks: the instruction prediction distinguishes a belief in separate signed subtraction instructions. The visible returned bits and typed values distinguish arithmetic from interpretation. The result cards explain that the negative value is valid and define unsigned wrapping locally. The closing application asks which check matches a different returned-distance rule. These are design hypotheses, not observed learner findings.
- Scope: one comparison, two independent calls, and a short application asking what to check before subtraction when the function must return zero beyond the plan. No assembly branches are introduced. General C arithmetic limits and undefined-behaviour rules, flags, overflow-checking code, mixed-type conversions and compiler optimisation examples remain later.
- State: prediction reveals listings, then Run comparison runs both independently. The result’s practical meaning, unsigned-wrap explanation, lack of an error report and bit-weight calculations appear only after the call. Reset comparison removes these results and retains the checked prediction; restored calls recompute from current inputs.
- Technical scope: the recorded `sub` and `ret` leave condition flags unchanged, pinned with both initial flag patterns in the facts test. The page says in plain language that neither instruction reports an arithmetic error, avoiding an early flags lesson. The returned unsigned number has no automatic wrap indicator; the same value can be legitimate elsewhere. Parameter types determine the subtraction in these two functions, while the return type determines the caller’s reading. A return type alone does not generally determine an expression’s arithmetic type.
- Terms: the published page introduces wrap. Published addition introduces overflow where its existing explanation defines it; the published products page introduces undefined behaviour where its existing motivation defines it. Legacy source lessons retain their original metadata.
- Inspection: source and recorded listings checked. Current integration and independent review outcomes are recorded in the arithmetic-lesson-focus notes. No beginner observation has taken place.

UI labels were drafted in a separate drafting agent from the engineer’s checked-facts brief and are held in `packages/views/src/strings.call-comparison.ts`.

### Exact call-comparison UI strings

```ts
// Copyright © 2026 Christopher Snow

// Drafted separately from the interaction implementation from its checked-facts brief.
export const CALL_COMPARISON_STRINGS = {
  sourceHeading: "Inspect the functions",
  predictionHeading: "Predict the instructions",
  callHeading: "Run and compare",
  startingInputs: (argsText: string) =>
    `Starting arguments for each independent call: ${argsText}.`,
  callBoth: "Run comparison",
  resetCalls: "Reset comparison",
  sharedReturnedBits: "Returned w0 bits shared by both calls",
  returnedBits: (functionName: string) => `Final w0 bits when ${functionName} returns`,
  sameBits: "Both calls returned the same bits in w0.",
  differentBits: "The calls returned different bits in w0.",
  subtraction: {
    heading: "Subtraction in bits",
    oppositeHeading: "Construct the opposite pattern",
    sumHeading: "Add the opposite pattern",
    calculationNote: (width: number) =>
      `These rows break down a single \`sub\` instruction with ${width} places. Keep the lowest ${width} bits after each addition.`,
    second: (value: string) => `Second input: ${value}`,
    inverted: "Invert every bit",
    plusOne: (value: string) => `Add ${value}`,
    opposite: "Opposite pattern",
    first: (value: string) => `First input: ${value}`,
    result: "Result",
    widthNote: (highBit: number, lowBit: number) =>
      `Bits run from ${highBit} on the left to ${lowBit} on the right.`,
    reminder: "For the smaller example, revisit",
    link: "Arithmetic with four bits",
  },
  readingsHeading: "C return values",
  weightsHeading: "Why the same bits mean different numbers",
  sameWeightsHeading: "How the bits give the returned values",
  contributionHeading: "Contributions to each C value",
  sumsHeading: "Add the contributions",
  returnedReferenceCaption: "The same returned w0 bits, shown again.",
  returnedReferenceTop: "Bit 31 (highest bit)",
  returnedReferenceLower: "Bits 30–0 (lower 31 bits)",
  topBitState: (top: number) =>
    top === 0
      ? "Bit 31 is clear, so its contribution is zero in both readings."
      : "Bit 31 is set, so its contribution equals its weight in each reading.",
  signedType: "int (signed)",
  unsignedType: "unsigned int",
  distanceValue: (value: string) => `${value} km`,
  signedMeaning: (overrun: string) => `${overrun} km beyond the plan.`,
  signedRange: "This negative result fits int.",
  unsignedMeaning:
    "The unsigned subtraction wraps: it keeps the low result bits and reads them as an unsigned value. C defines this behaviour. This value does not express the trip overrun. It can be valid in another calculation.",
  lowerBits: "Lower 31 bits",
  topBitContribution: "Highest bit (bit 31)",
  total: "Returned value",
  bitWeights: "The lower 31 bits have the same positive weights in both readings.",
  topWeightDiffers:
    "Bit 31 has a negative weight for int (signed) and a positive weight for unsigned int.",
  readingGroup: "How the returned bits give these values",
  noArithmeticError:
    "These functions return the bits without checking for a trip overrun. There is no automatic overrun warning.",
  readingTypes:
    "The register has no type tag. Here, C parameter types set the subtraction rules; the return type sets the returned value’s reading.",
  readingLink: "Signed and unsigned readings",
  resultGroup: "Returned bits and C values",
} as const;
```
