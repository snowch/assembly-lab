# Calls and recursion: technical review

The managing session reviewed these lesson structures, recorded programs and stack
mechanisms independently of their authors. Separate reader reports cover each lesson's
browser presentation. The inherited Codex model and effort were used.

The review checked Arm AAPCS64 at its 2025Q4 release: the general-purpose register
rules, stack constraints, frame-pointer policy and subroutine calls. The standard
requires preservation of all 64 bits of r19–r29 and SP. It requires 16-byte SP alignment
at the stated stack accesses and public interfaces. BL records the following instruction's
address in LR. The lessons distinguish these requirements from the layout chosen by the
recorded GCC functions.

The retained GCC listings and executable traces support the call, return, unsigned
brightness sum and bounded failure demonstrations. The reference challenges restore
the link, saved registers and SP; nonzero caller seeds check preservation of the upper
register bits. A dynamically executed call to the required helper or recursive entry
is checked, so an unreachable call instruction is insufficient. QEMU coverage includes
caller wrappers that initialise nonzero x19 and x29 values.

The recursion reader found an important explanatory distinction. A function stores
its incoming x19 in its own frame, then uses w19 for its current brightness. The next
callee saves that brightness as its incoming x19. The corrective prose now states this
sequence. The improved diagram derives call identifiers and saved-register annotations
from actual calls and stores; it does not assign brightness to a fixed, assumed frame
slot. Separate helper tests cover changed layouts, repeated calls and partial overwrites.

The call reader also requested a visible connection from x30 to its destination.
The diagram now resolves the actual register value to an instruction in the assembled
listing, or identifies an address outside the shown instructions. The independent final
code review checks these shared view changes; the final browser checker verifies their
rendered form.

The full GNU/QEMU comparison and final course check are recorded in the course-wide
validation notes. This review makes no timing, unwinding or operating-system stack
growth claim.
