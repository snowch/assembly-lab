# Assembly boot revision: first-lesson learner review

Reviewer: independent learner agent, same inherited model as the managing session.
Scope: `from-function-to-executable`, rendered title **Build and boot an assembly program**.
Read as a learner who has completed Modules 0–11 and no later lesson. Review date: 2026-10-22.

## Evidence and scope

Read the repository instructions, authoring and style guides, visual-language guide,
front-page prerequisites, and earlier memory/call/stack explanations. Read the rendered
lesson's ten sections at `http://localhost:4182/assembly-lab/`, not just its source.
Used fresh Chromium contexts at 375 × 900 and 1280 × 900 in both light and dark themes;
confirmed the actual `data-theme` attribute. Screenshots of the first lesson's startup
and arithmetic figures are in `boot-review-images/first-*.png`. The reviewer visually
inspected phone dark startup, desktop light startup, phone light arithmetic and desktop
dark arithmetic captures. All four layouts' text and interaction results were inspected.

No native toolchain command or physical-board test was run by this reviewer. The native
sources and checked records were read; executable correctness is the independent native
and technical reviewers' remit. No full test suite was run by this reviewer.

## Findings sent to the managing session

1. **High: revealed boot command overflows the phone page.** In the construction figure,
   the paragraph beginning “Boot the linked program” is inside an inner `.prose` whose
   intrinsic width expands to 666 px, reaching x = 695 on a 375 px viewport. This happens
   after committing the first prediction, in both themes. Document `scrollWidth` is
   695 against `clientWidth` 375. The long system-QEMU command expands the grid item;
   surrounding paragraphs also expand. Desktop width remains 1280/1280. Direction:
   constrain the native figure's grid item and preserve contained code scrolling.

2. **Medium: the startup snapshot lacks a visible current-state label.** The three
   controls beginning “At _start”, “At boot_ready” and “At halt” update recorded values
   and `aria-pressed`, but selected and unselected buttons have identical computed
   background, foreground and border colours after hover/focus moves away. In light
   theme, all backgrounds are white, foregrounds rgb(16,26,24), borders rgb(116,130,127).
   The screenshot's hover treatment is not a persistent selected-state indication.
   Direction: expose the current snapshot visibly and distinguish the selected control
   beyond transient focus or hover. A visible state label also makes the values' moment
   clear without remembering the most recent click.

3. **Low: GDB is named before its role is explained.** The recorded startup note says
   “These states were recorded with GNU tools, QEMU and GDB” and mentions writing a test
   marker “with GDB”. The first lesson has not defined GDB. The later lesson does, but
   that is outside this reader's knowledge. Direction: identify GDB as the debugger in
   this note; no extra tour is needed.

4. **Low: unexplained baud-rate terminology.** The UART paragraph names “integer and
   fractional baud-rate divisors” and gives their register values without saying what
   they control. Earlier lessons teach arithmetic division, not serial signalling.
   Direction: give the local clock/transmission-rate meaning, preserving the explicit
   qualification that the emulated output does not establish a physical serial speed.

The managing session accepted these findings. This record does not imply that its fixes
have been checked until the final verification below is completed.

## Learner assumptions and explanation checks

The course previously teaches instruction/register meanings, hexadecimal addresses,
loads/stores, zero-terminated strings, conditional branches, calls and return addresses,
stack frames, and the calling convention. It does not assume a terminal, assembler,
linker, ELF loader, firmware, BIOS/UEFI, UART, MMIO, interrupts, or debugger experience.

The revision explicitly introduces source/object/executable distinctions; names each
required tool and flag near the commands; explains host versus emulated machine; explains
sections and assembler directives; distinguishes the ELF entry from a universal reset
address; connects stack preparation to the output routine's saved frame; explains
interrupt handlers, masking and polling; explains storage clearing and pointer advance;
defines UART and memory-mapped I/O; explains the host exit escape; and separates QEMU's
direct ELF load from board-specific firmware and BIOS/UEFI. The two remaining vocabulary
omissions are findings 3 and 4 above. The chapter's arithmetic needs no invented C source.

The main explanation is coherent: source becomes objects, linking chooses addresses,
loading supplies bytes and entry, startup prepares memory and stack, the assembly caller
executes the function and reports its check through a device. The recorded nonzero test
marker is explicitly an injected verification condition, not a claim that QEMU leaves
arbitrary storage. The map labels its selected address regions and exclusive ends and
says it is not to scale. The serial report is correctly distinguished from printing the
result's decimal digits. The scope is a chosen QEMU machine, not a universal disk image.

## Initial interaction results

All four width/theme combinations hid the recorded startup figure before commitment.
After commitment, each startup control showed its matching checked PC, stack pointer
and stored-memory value, and selecting the first stop restored its original snapshot.
The stored result is labelled as memory, not as an architectural register. Keyboard
activation retained focus. No page errors or console errors were observed. The initial
phone overflow and missing persistent selected-state treatment remain failures of that
initial build; later verification does not rewrite those measurements.

## Final verification

Independently reloaded the stable final build on port 4182 after the managing session's
20:28 rebuild, with fresh contexts in all four width/theme combinations. Confirmed actual
themes again. Findings 1–4 are corrected in the rendered page:

- At 375 px, the page now measures `scrollWidth = clientWidth = 375` in both themes
  after the native command is revealed and after challenge restoration. At 1280 px,
  both remain 1280. The long command stays contained inside its figure.
- Selecting the middle startup stop leaves a persistent accent fill and inset underline
  after moving the pointer away. The adjacent visible status repeats that stop's label.
  Light selected background is rgb(7,90,79), dark selected background rgb(95,211,192);
  unselected controls retain their normal theme background. Actual matching values
  remain visible, and the stored result remains labelled as memory.
- The note now introduces GDB as “a debugger that inspects a running machine and
  controls when it stops”. This supplies the missing role before the recorded marker
  explanation. The startup screenshot confirms that wording in context.
- The UART paragraph now says “A divisor sets the serial bit rate from the device’s
  clock” and immediately retains the limit about physical clock settings and timing.

The arithmetic figure executes its first instruction and Reset restores the starting
value. The challenge's initial artifact fails the complete contract; a permitted correct
artifact passes all four cases and that passing state is rechecked and restored after
reload. These checks passed in all four layouts. No page errors were observed. This
review does not reproduce the challenge answer.

Final startup screenshots have the `-startup-final.png` suffix. The reviewer visually
inspected the final 375 px dark-theme capture and confirmed clear selection, visible
state label and readable full address/stack/memory values. An exploratory interaction
probe overlapped an intermediate rebuild and timed out waiting for the prediction;
it supplied no verification result. The stable-build rerun above is separate evidence.

No open learner-review blocker remains for this first lesson. Native execution and
technical claims remain covered by the separate reviewers and verifier, not by this
browser review.
