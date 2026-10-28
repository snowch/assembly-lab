# Independent learner review: section flow

Reviewer: a separate Codex agent, same inherited model and effort as the managing session.
The reviewer did not draft or edit product content and did not read the author's audit or
rationale before forming these findings. Read `CLAUDE.md`, `docs/style.md`,
`docs/authoring.md`, the front page's “Before you start”, and the course in
`content/lessons/index.ts` order.

## Scope and source checks

Source audit: all 34 published lesson pages, including selected sections, figure captions,
and figure `lead`/`after` prose. The first snapshot was taken while the separate drafting
pass was in progress; final-source confirmation and browser results are recorded separately
below. This is a section-flow review, not a new verification of every technical claim or
challenge answer. No challenge answers are reproduced here.

The learner starts with the front-page prerequisites: small C functions with `int`,
`unsigned`, `return`, conditions, loops and indexed arrays, plus binary arithmetic.
Assembly, hexadecimal, pointers, tooling and later C forms require local explanation or
an earlier lesson.

| Course pages read | Section-flow assessment |
| --- | --- |
| One addition; Adding a constant; A tiny function; Returning to the caller; Subtraction and reuse; Instructions in sequence; Putting it together | The first snapshot exposed unnecessary one-sentence setup/result sections in One addition, Subtraction and reuse and Instructions in sequence. Distinct worked examples, return exploration and fresh exercises still require visible names. The synthesis has a useful four-mechanism bridge from the earlier pages. |
| Same bits, two readings; Constants and widths | Preserve names for genuinely different predictions, bit manipulation, assembly experiments and exercises. Merge only short setup/result fragments. Check the Constants in halves heading against the shifted-constant activity it contains. |
| Adding, and the four flags; Subtracting, and the tick counter | The figures require the carry/borrow mechanism and interaction guidance before use. Substantial explanation/reference sections and distinct arithmetic exercises deserve headings. |
| Masks and fields; Shifts, and the type that picks one | Separate bit operations, field writing, shift comparison and compiler experiments are different tasks. Short setup can join the relevant figure; keep explanations of register-source inputs and operand shifts local. |
| Compare, and the signed or unsigned condition; Branches, and the run that skips | Headings identify substantial mechanisms, comparisons and independent exercises. The condition reference and register-testing branch explanation remain useful destinations. |
| Counting up, and the branch backwards; Counting down, and knowing when to stop | The two control-flow mechanisms have distinct initial tests, body/update explanations and boundary experiments. Short fresh exercises retain useful headings. |
| Memory and addresses; Loading different widths | Address, load/store width, byte order and extension definitions precede the activities that need them. The later record exercise is distinct and discoverable. |
| Array addresses and moving pointers; Strings and the zero byte | Indexed loads, pointer updates, bounded scans and separator counting require different activities. Preserve those navigational boundaries. |
| Products and their widths; Division and remainders | Narrow/wide products, high halves, signed division, remainder reconstruction and guarded practical calculations each have meaningful sections. |
| Calls, returns and the stack; Recursive calls and separate frames | The small complete saved-return example bridges to the larger stack-frame example. Recursive calls build on the prior call mechanism and add a distinct frame investigation. |
| From C to instructions; Compile a loop and follow its branches | Local compiler interaction, hand-written assembly and changed-source experiments are distinct tasks. They keep visible entries before any completion. |
| C overflow and machine results; Conversions and checked arithmetic | C guarantees, direct instruction experiments, compiler settings and checked calculations require separate explanations. Tiny challenge introductions name substantial exercises below them. |
| Build and boot an assembly program; Follow startup and debug the boot image | Long practical procedures and tool commands benefit from their headings; the debugger's local subheadings are useful procedural steps. |
| From QEMU to Raspberry Pi 5; Boot and test your Pi | Parts, cable connection, boot explanation, image building, card preparation and hardware-test records are distinct procedures. |
| The same C on 32-bit Arm | Target-specific syntax comparisons, record-reading exercises and instruction-set rejection are distinct activities. |

Mechanism preparation: the first full composition, Putting it together, comes after complete
small examples of register addition, constants and reuse, function arguments/results,
call/return, ordered subtraction and state carried through a sequence. A smaller candidate
would combine only an addition and return, which A tiny function already demonstrates and
practises. Another introductory bridge is unnecessary for the synthesis: its visible objectives, the
ordered earlier lessons and the concrete trip walkthrough identify the composition. The
redundant overview sentences may be removed without removing required preparation. Later joins must preserve each definition
before the figure that needs it. No additional unexplained assumed knowledge caused by a
section join was found in this source pass.

## Findings formed independently

- L1, medium, initial source: One addition has “One operation” above a single opening
  question, “Inputs and result” above “Reading preserves the inputs. Only the destination
  is written.”, then “A different destination” above one sentence preparing the next
  challenge. Subtraction and reuse and Instructions in sequence repeat the pattern.
  Effect: headings interrupt a connected explanation without announcing new activities.
  Direction: join setup with the activity it prepares and short result explanation after its
  figure; retain a visible name for the fresh exercise. Final source reread: resolved by real section joins, with definitions before use and
  short results after their figures. Browser confirmed in both widths and actual themes.
- L2, low, source: Constants and widths places “Constants in halves” above “A constant that
  does not fit in one `mov` is built half by half, with `mov` then `movk`.” and the
  `add-shifted-immediate` figure, whose own title is “Multiply the constant before adding”.
  Effect: the visible section outline describes a recap of an earlier activity rather than
  the distinct activity contained here. Direction: identify the shifted-constant addition
  in the retained heading and place the small recap with the earlier build explanation.
  Final source reread: the heading now says “Multiply a constant before adding”, and
  the recap is attached to the earlier build figure. Browser confirmed in both widths and actual themes.

## Final source confirmation

Re-read the final selected-section outlines and joins after the separate drafting pass.
Also checked the added opening joins in Calls, returns and the stack and both Module 12
pages. Definitions, tool setup and interaction directions remain before the first activity
that needs them. The later modules' distinct short activities retain visible headings.
No further section-flow or newly assumed-knowledge finding remained.

## Browser checks

Checked the frozen production build at `http://localhost:4399/assembly-lab/` on
28 October 2026, using headless Chromium 141.0.7390.37. All 34 pages were loaded afresh at
1280 × 800 desktop and 375 × 812 phone widths, in both actual light and dark themes:
136 page/width/theme states. The rendered `html[data-theme]` and body backgrounds agreed:
light `rgb(243, 246, 245)`, dark `rgb(16, 22, 21)`.

- Visually inspected all nine overview screenshot sheets, containing every page in each
  width and theme, in course order. Retained headings are visible and readable, with no
  decorative teaching-stage prefix and no overlapping or clipped heading layout.
- Inspected detailed joined-boundary screenshots in all four width/theme combinations for
  One addition, Subtraction and reuse, Instructions in sequence, Putting it together,
  Same bits, two readings, Masks and fields, Shifts, Adding and the four flags, and
  Constants and widths. Setup/result text stays beside the intended figure; fresh
  exercises keep their own visible entry. Both L1 and L2 are resolved in the built page.
- Checked every rendered section heading's geometry: 1,084 heading instances across the
  136 states. None was hidden, clipped to a tiny box or absolutely positioned. No page
  scrolled horizontally at either width in either theme.
- Ran the relevant worked examples to completion and reset them on all four width/theme
  combinations: One addition, A tiny function, Returning to the caller, Subtraction and
  reuse, Instructions in sequence, Putting it together, the shifted-immediate addition in
  Constants and widths, and the small saved-return example in Calls and returns. Each
  changed its displayed state when stepped and returned to its initial displayed state
  when reset.
- Inspected the Removing ret prediction before and after committing in all four
  combinations. Its follow-up figure stays gated initially and becomes available after
  the prediction is committed. No challenge answer is recorded here.

Browser evidence collected independently in `/tmp/section-flow-reader-browser/`:
`evidence.json`, `states.json`, `overview-1.png` through `overview-9.png`,
`boundaries-1.png` through `boundaries-3.png`, and the original page/state screenshots.
The collection and state scripts both completed successfully. These were focused browser
checks, not a claim that the full educational suite ran; the managing session records its
suite results separately.

Limits: the source audit covers all 34 pages; the browser overview covers all 34 initial
layouts in both widths/themes; detailed state exploration covers the examples listed above.
This review did not submit every later exercise, run external GNU/QEMU/GDB commands, or
perform a physical Pi test. Full-page screenshots were collected, but a pixel-by-pixel
visual audit of every diagram at every scroll position is not claimed.

Verdict: no unresolved learner section-flow finding on the frozen build.
