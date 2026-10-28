# Visible caller addresses: independent reviews

Copyright © 2026 Christopher Snow

Reviewed on 28 October 2026 by a separate agent who did not write the address feature
or its prose. Model and effort: GPT-6.1 Sol, High, inherited from the explicit reviewer
configuration. This uses the same capable reviewer for two distinct passes; the
technical pass retains High rather than the Extra High suggestion in `docs/authoring.md`.
The reviewer changed only this note.

## Learner pass

Read the full lesson, its changed figure, the address brief, `docs/style.md`, and the
earlier Fundamentals prerequisites. Checked both closing style passes. The local
sentence “The Address column shows each instruction’s address in this simulator run”
identifies what the numbers mean and limits them to this example. The existing
definition, “An instruction’s address identifies its place in memory”, precedes the
figure. Decimal notation adds no hexadecimal prerequisite. The Address and Instruction
headers keep the two columns distinct. The approved handwritten/GCC distinction remains.

Unexplained assumed knowledge found: none added by this change. One addition supplies
memory, instruction and register concepts; A tiny function supplies GCC, assembly
listings, caller, argument and `ret`. The current lesson defines the return address
and link register before use. The existing small complete call demonstrates `bl`
and `ret` before the fresh-input exercise. Showing its numeric continuation connects
the stated rule to that same example; another preliminary activity is unnecessary.

Inspected actual built figures at 1280 × 800 and 375 × 812 in both light and dark.
The saved value appears beside `x30` after BL and matches the address printed beside
the caller’s addition. Phone wrapping keeps the value and its named target readable.
Initial, BL and returned screenshots were inspected. One minor visual finding follows.

### Finding A1: address badge is narrower than its digits

Severity: low. In the Address column, the final digit of “4194308” and “4194312”
extends outside the code badge’s background. The seven-digit address occupies 63 pixels;
the grid gives the whole padded code element 63 pixels. The text therefore extends
5.406 pixels beyond the element. On desktop the first badge ends at x=243 while its
text ends at x=248.406; the marker begins at x=251. The same measurements relative to
the badge occur on the phone and in both themes. No digit overlaps the marker and the
page does not overflow, but the badge visually fails to contain its value.

Direction: allow the address column to include the digits and code padding, then
recheck the phone instruction width. Reported to the managing agent for the smallest
layout correction.

Accepted and fixed: the managing agent removed the gutter address’s code padding and
background. Plain address text now fits the existing track, preserving the shared
header and row columns and the phone instruction width. The saved x30 value keeps its
badge. Independently verified the rebuilt production page (10.19-second build) at the
same four viewport/theme combinations, in initial and post-BL states. The address text
and its track both measure 63 pixels; their right edges now coincide, with an 8-pixel
gap before the marker. Computed gutter padding is zero and background is transparent.
Inspected final post-BL figure screenshots in all four combinations. No document,
caller, instruction or target overflow appeared; the saved value remains 4194312.
This CSS-only correction leaves the previously checked state logic unchanged.

Final learner verdict: no open findings. A1 is retained here with its correction and
independent built-page verification; no findings were rejected.

## Technical pass

Read the component, CSS, strings, canonical prose and model path independently of the
learner read. `trace.lineAt` derives from assembled instruction addresses; reversing
that map supplies the displayed addresses. The saved value comes directly from
`view.state.x[30]`, with decimal `String` conversion. Neither address is invented in
the component. The canonical Address, Instruction and caller explanation strings match
the source. The paired C/function listing and the program are unchanged.

Ran the executable assembler and simulator directly against
`returning-to-caller.example.ts`, using the example’s actual entry and arguments.
The model places `bl increment_int` at 4194308 and `add w1, w0, w0` at 4194312.
At the initial visible state x30 holds the harness address 4456448. BL writes 4194312;
it remains 4194312 through the function addition, RET and caller addition. RET resumes
at PC 4194312. These observations agree with the lesson’s recorded Arm BL/RET facts
and existing model facts tests. The source inspection also confirms that only the
last instruction’s write set controls the Written marker.

In a separate browser pass on the production preview at port 4401, compared both
caller addresses and every saved numeric value against those independently computed
model values. All four width/theme combinations passed initial, all four forward
steps, reload at every forward position, Back through every position to before BL,
reload before BL, Start again after BL, and reload after reset. The initial, backed-up
and reset states show “Not yet set for this call” with no numeric x30 value. Every
post-BL state shows 4194312; only the immediate post-BL state marks x30 Written.
The caller addresses remain stable throughout.

Actual themes were verified through `html[data-theme]` and computed body backgrounds:
light `rgb(243, 246, 245)` and dark `rgb(16, 22, 21)`. No document overflow, caller-row
overflow, target overflow, console errors or page errors occurred in the checked states.
The paired function listing retains its existing contained horizontal scroll on phones.

No technical finding. The temporary browser harness initially needed corrections to
its model argument object and BigInt JSON output; those attempts did not execute a
complete check. Final browser assertions all passed. No repository tests or product
files were edited by this reviewer. Full CI, challenge submission, external reference
fetching and legacy saved-state migration are outside this address review’s scope.
