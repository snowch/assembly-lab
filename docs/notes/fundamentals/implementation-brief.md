# Visible Fundamentals lessons

Copyright © 2026 Christopher Snow

The user could see the latest deployed commit but could not find `increment_int`, because it
was the second activity behind a sequential pager. Required activities must be discoverable
from the course plan without completing an earlier example.

Module 0 becomes Fundamentals, with four small lessons before the existing, stable
`meet-the-machine` address: one addition; a tiny function; subtraction and reuse; instructions
in sequence; putting it together. Keep the existing trip exercises and their challenge IDs.
Each lesson uses the existing ten-section schema without changing the platform copy. Local
Run, Reset, instruction stepping and prediction gates remain; changing lesson is normal course
navigation. Two related worked examples on the subtraction page are both visible.

## Checked facts supplied to drafting

- Existing `meet-the-machine.primitives.ts` defines five arithmetic snippets and one recorded
  compiled function. The arithmetic figures expose only their arithmetic prefix; an undisplayed
  trailing `ret` is the simulator execution wrapper.
- Addition: `add w2, w0, w1`, starting 12, 7, 0, writes 19 to w2. Transfer challenge:
  `add w1, w0, w2`, starting 14, 0, 5, writes 19 to w1 and leaves w0 unchanged.
- `increment_int` is recorded GCC 16.1 output at `-O1`, with complete C and checked source
  associations. `add w0, w0, 1` writes the incremented value. `ret` returns to the caller and
  writes no ordinary register. Worked call 7 returns 8; fresh challenge 0 returns 1.
- Reuse: `add w0, w0, w1`, starting 9, 4, writes 13 to w0. Subtraction:
  `sub w1, w0, w1`, starting 20, 6, writes 14 to w1. Fresh challenge starts 18, 5;
  w1 becomes 13 and w0 remains 18.
- Sequence: `add w2, w0, w1` then `sub w2, w2, w1`, starting 8, 3, 0, writes 11
  then 8 to w2. Fresh challenge starts 10, 4, 0; w2 ends at 10 and w1 remains 4.
- The next-instruction marker represents the position tracked by the program counter. The
  tiny-function lesson does not need `bl`, the link register, a stack or a numeric PC.
- First addition introduces instruction, register, assembly language and operand. The tiny
  function adds listing, caller and argument. Sequence introduces program counter.

The source of these claims is the existing simulator/facts tests, compiler record under
`docs/notes/module-0/increment/`, and GNU/QEMU corpus. On 23 October 2026 the exact commands
`AL_TOOLS=/tmp/al-real-tools/root npm run check:real-tools -- --only module0-primitives --corpus`
and the equivalent `module0-increment` command compared 7 calls / 23 instruction states and
5 calls / 15 states respectively, with zero differences. The first exploratory `--only module0-`
command matched no programs and provides no verification; it was corrected to exact names.

Separate drafting owns all new learner copy. Independent review must check the small complete
example, the bridge into the fresh challenge, phone/desktop light/dark initial/stepped/reset/
restored states, and the older bookmarked synthesis route. The later-course audit is recorded
separately in `later-activity-audit.md` with its browser and source-only limits.

## Separate passes

Copy, implementation, synthesis integration, technical review, five individual learner reviews,
and final built-page checking used separate agents with inherited session model/settings; no
explicit model override was selected. The review records identify the material and actual
browser states each pass checked. A later independent verification reviewer checks resumable
batch coverage and reported outcomes after the environment interruption.
