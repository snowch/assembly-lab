# Advance through logger pages

This vehicle logger groups its data into pages of 4096 bytes. On this target, a **byte** contains 8 bits. An **address** identifies a byte's location in memory.

`x0` starts with 65536, the address of a page's first byte. Find the start of the page three pages later, keeping the original address in `x0`.

Here, `#3` is the page count. `lsl #12` shifts that constant left by 12 bits, multiplying it by 4096. The resulting 12288 is the distance in bytes. `add` adds that distance to the address in `x0` and writes the new address to `x2`.

`add x2, x0, #12288` encodes the same single instruction. Writing `#3, lsl #12` keeps the page count visible; it is no faster.

Press **Run** to follow the calculation. This instruction calculates an address without reading or writing memory.

*One add instruction finds the address three logger pages later.*

## Closed note: Constant range and shift limits

ADD's immediate form holds a 12-bit constant, from 0 to 4095. When you write an explicit `lsl`, the constant before it must fit that range. The only shift amounts are 0 and 12. These options differ from those of `mov` and `movk`.

Without an explicit `lsl`, the assembler can choose the shifted form for a larger plain constant, as it does for `#12288`. The plain constant must still fit one of ADD's two forms.

See [Arm’s ADD (immediate) reference](https://developer.arm.com/documentation/ddi0602/2025-12/Base-Instructions/ADD--immediate---Add-immediate-value-).

## Prerequisite and sequencing notes

- Read only in source; no browser review or independent learner validation performed by this drafting pass.
- M1 L6 building-constants defines logical shift left through movk half placement. It demonstrates bit 16 and groups of 65536, but does not teach a general multiplying-by-powers-of-two rule. The visible logger prose supplies the local bridge from shift by 12 to multiplication by 4096.
- M1 L7 register-widths begins with the x/w prediction and its explanation, then this example. x names are locally prepared. Keep this order; the logger example must not precede those definitions.
- The source lesson constants-and-widths and published split register-widths both currently list no byte/address introductions at this point. Update both term introductions as required by the brief, because the new visible prose defines those terms here. Module 6 may repeat and develop the definitions.
- Page means this hypothetical logger's chosen data group, with a stated size. No OS, physical device, allocation, pointer, alignment or access-permission knowledge is required by the prose.
- No numeric destination result appears before Run. 12288 is the formed operand, already visible in the pending flow, and supports the required plain/explicit equivalence. The existing two-register challenge uses different instructions and values.
- Ordinary ADD and destination/input roles were prepared in M0. This example explains the new unit conversion and spelling choice without reteaching ordinary ADD.
- The caption, section title and stage title should be kept in sync with canonical module prose. Existing caption/title duplicates reflect existing structure, not a request for another section or activity.

## Style passes

**Sentences:** Complete: checked sentence length, direct claims, nearby nouns, active voice, term definitions, numerical provenance from the supplied checked-fact brief, and local limits. No intensifiers, decorative idioms or forward references in visible prose. One longer input sentence is retained to keep the starting address and its role together.

**Idea:** Complete: read the full M1 L7 source sequence and draft in order. The logger's goal precedes the shift, byte/address definitions precede use, shift-to-distance and distance-to-address are explicit, and the equivalent plain spelling explains the readability purpose. The computed flow supplies the result; main prose does not state it. Optional limits do not contain required logger meaning. This is drafting self-check, not independent review.


## Separate follow-up for the accepted address-unit bridge

Adding 1 to an address gives the next byte's address.
