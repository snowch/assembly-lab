# Independent learner review: Debug instructions

Reviewed on 22 October 2026 by a separate reader who did not draft or implement the lesson.
Read the lesson's structure, prose and labels, the preceding native-build lesson and the prior
course's explanations of register views, program counters, arithmetic, calls and returns.
The learner can already use the earlier assembly instructions and the previous lesson's Linux
terminal, downloaded bundle and GNU/QEMU build commands. No later optional A32 material is assumed.

## Rendered scope

Used the production preview at `http://localhost:4182/assembly-lab/#/lesson/debug-native-instructions`.
Checked 360px/light, 375px/dark, 1280px/light and 1280px/dark, verifying the actual rendered theme.
Inspected selected screenshots, not only DOM assertions.

- Both prediction comparisons remain locked initially and after merely selecting an answer.
  Keyboard Space/Enter commits a prediction and opens its comparison.
- The recorded and browser columns are clearly distinguished. The note identifies the native
  column as the low 32 bits of recorded x registers, and the browser column as independently
  modelled. The page does not claim to start a native process.
- Stepped the original comparison from its breakpoint through its return. The two columns match
  at every stop. The return keeps the result and changes the PC description to the caller.
  Back, Reset and the final disabled Next state work. Reset returns to the breakpoint.
- The rebuilt figure identifies the next instruction at the breakpoint and distinguishes the
  instruction just executed from the next instruction after stepping. This resolves the earlier
  need to reconstruct instruction order from prose.
- Opened and stepped the modified comparison after committing its own prediction. Its corrected
  caption identifies recorded/modelled stops of the modified function and directs comparison
  with the earlier original figure.
- Opened the optional Linux-free experiment with the keyboard. Its optional status, QEMU-machine
  scope, serial output, absence of Linux process exit and host escape are visible locally.
- Ran the unchanged closing starter and observed rejection, then submitted an alternative valid
  sequence using taught instructions. All behavioural tests passed; after reload the work was
  restored and regraded. Prediction commitments also remained restored. No solution is recorded
  in this review. The four linked native source downloads returned source content successfully;
  no link resolved to an HTML fallback.
- No console/page errors or document horizontal overflow occurred. Visible phone controls were
  at least 40px high. Long command lines scroll within their code blocks rather than the page.

Selected screenshots:

- [360px/light GDB setup](review-images/debug-native-360-light-setup.png)
- [1280px/dark recorded/model comparison](review-images/debug-native-1280-dark-comparison.png)
- [375px/dark optional system-mode experiment](review-images/debug-native-375-dark-optional.png)

## Findings and verification

1. **Medium, corrected: identify what the modified comparison compares.**
   The earlier caption said “Compare the correct and modified instruction traces”, while its
   columns were the modified recording and modified browser run. That wording suggested the
   two displayed columns were the original and modified functions. Direction: name the two
   actual columns and direct the learner to the earlier original figure. The rebuilt caption
   does this; verified in the rendered modified comparison at all four configurations.

2. **Medium, corrected: order the closing debugging attempt before successful repair.**
   The rebuilt task first says “Pass the browser tests, then copy your function body…” but later
   says “After your first attempt, debug a native failure before repairing it.” Following the
   first instruction can produce an already repaired native function, leaving no failing
   attempt to inspect. Direction: explicitly debug the unchanged starter before replacing it,
   or put the first native build/debug attempt before the instruction to pass the browser tests.
   The final task now explicitly builds and debugs the known failing starter before asking for
   browser repair and native rerun. Verified this order in the rendered task at 375px/dark and
   1280px/light; register observation and an explanation remain part of the independent task.

3. **Low, corrected: optional vocabulary.** “RAM”, “firmware and reset sequence”, “baud rates” and
   “console multiplexer” appear without local plain-English explanations. These are not taught
   by the prior core lessons. They do not prevent the learner from running the supplied QEMU
   command or using its explicitly described escape, so they are not a core completion blocker.
   Direction: explain or avoid these terms where they qualify the optional physical-board scope.
   The final page now defines working memory and the QEMU control interface, and uses plain
   language for startup software, serial transmission speed and terminal sharing. Verified the
   rendered correction at 375px/dark and 1280px/light and refreshed the optional screenshot.

## Assumed knowledge and explanation checks

The core GDB workflow does not require prior knowledge of GDB command syntax. It defines a debugger,
a breakpoint and a port; separates the two terminals and the GDB prompt; explains the waiting
QEMU process, `target remote`, `continue`, `info registers`, `$pc`, `x/i` and `stepi`; and warns
against the inappropriate remote `run` command. The earlier lesson supplies the terminal,
installation, working-directory, build, static-link, ELF, exit-status and rebuild concepts.

The current lesson explicitly distinguishes x/w views and incoming upper-bit guarantees, function
return and process exit, and native-only operations from the browser model. The revised native
sections explain kernel, standard output and output buffer at their relevant use. UART and TXFF
receive operational explanations. The optional vocabulary findings listed above are resolved in the final page.

The first review-script attempt stopped on an incorrect harness expectation for the success
message; the actual grader uses “All 4 tests passed”. Corrected that review expectation, then
reran the four configurations successfully on the rebuilt lesson. This was a harness error,
not a product failure. Full repository suites and live terminal GNU/QEMU/GDB commands were not
rerun by this learner reviewer. External command execution evidence belongs to the separate
native/technical verification; this review checked the learner-facing instructions and browser.

## Final verification

All findings above are resolved. On the final stable production build, independently rechecked
the closing task's failing-original/debug/explain/repair/rerun order and the optional terminology
at 375px/dark and 1280px/light. The native download links still returned source content. Viewed
the refreshed optional screenshot and a comparison screenshot showing the just-executed
instruction beside the next instruction. No implementation was edited by this reviewer.
