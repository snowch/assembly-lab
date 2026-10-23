# Loading different widths

Independent reader review. Registry index 12 (zero-based), Module 6, lesson order 1. Snapshot f1fdf35. Scope: learning load, not implementation changes.

## Prior knowledge and novelty

The learner has completed lessons 0–11 only. Earlier lessons supply signed/unsigned readings, hexadecimal, masks, arithmetic shifts, w/x aliasing and upper-half clearing, addition, stepping and writing assembly. Immediately preceding `memory-and-addresses` teaches addresses, brackets, little-endian byte order, narrow transfers, C pointer dereferences and retaining an address while accessing memory. Thus this lesson's first task does not introduce memory addressing and signed representation simultaneously.

New mechanisms are zero/sign extension, separating source width from destination width, signed loads, register-only extension, a C cast, and an arithmetic operand extended before addition. The offset notation `[x0, #4]` is explained locally before the final task. The sensor record combines familiar address retention with newly practised load selection. I found no confirmed prerequisite gap; casts and the optional note's signal terminology receive local definitions. The compiler settings and C target types recur from the preceding lesson rather than representing new required operating knowledge.

## Overall assessment

No high-severity learning-load finding. The first prediction asks only for a 32-bit register pattern after one signed-byte load; the rule is given beforehand and w/x clearing is already familiar. The subsequent construction combines that rule with familiar addition. The later register extensions broaden the mechanism without being prerequisites for that construction or the final record task. The concern is avoidable cross-view tracking, especially at phone width, rather than the number of opcodes itself.

## Confirmed findings

### Medium: the requested comparison separates the evidence by several phone screens

Exact direction: “Compare the two loads of the same byte in the figures” and “Use the figures to separate three regions: the bits read from memory, the bits added by extension, and any upper bits cleared by a write through a `w` register name.” Source: investigation in `content/lessons/loading-widths.ts`; rendering in `packages/views/src/interactives/MemoryStepper.tsx`.

Reproduction: fresh 375px context, commit the first prediction, press Next once in the signed gradient and unsigned fuel steppers. Each independently contains a paired listing, controls/status, register summaries, all eight addressed memory bytes, then the full physical-register extension view. The first signed-load figure measured 1763.56px tall at 375px. The unsigned comparison is below that figure and the investigation prose. Within the signed view, the copied low byte is at the bottom of the extension grid, while its original memory cell is much farther above. The unchanged seven source bytes each repeat “Not accessed by this instruction.” The learner must remember a source byte, the w/x values and the partition while moving between views. This is substantial tracking specifically for the page's explicit comparison task; the byte and bit labels themselves are readable.

Direction: preserve the full inspection view, but give the signed/unsigned comparison a compact common source and adjacent extension-region result, or a same-position switch retaining the source. The smallest useful first step is to reduce repeated untouched-byte detail in this comparison while keeping it available. Do not remove the three-region distinction: it is the teaching point.

Evidence: `/tmp/course-load-review/loading-widths-375-transfer.png` and the four `loading-widths-*-stepped.png` captures. Desktop has more compact grids, so severity is driven by the phone interaction.

### Low: the final record layout must be reconstructed from prose when planning load order

Exact task: “Bytes 0 to 3: an unsigned 32-bit distance”, followed by separate bullets for byte 4, byte 5 and bytes 6 to 7; later, “Plan the order of your loads so that the starting address remains available until the last memory access.” Source: `loading-widths.prose.ts` finalTask and final challenge definition in `loading-widths.ts`.

The initial final exercise supplies the layout as bullets and requests four output registers. It has no grouped byte-layout diagram alongside the editor. The learner must map field boundaries to byte offsets and keep that mapping while also planning address preservation. This is an appropriate synthesis, but the spatial layout can carry part of that bookkeeping. This is not evidence that four fields are intrinsically excessive.

Direction: add a compact, address-relative eight-byte record strip with field boundaries, signedness and destination labels; keep the load-order choice for the learner. Do not add solved assembly or prescribe an answer order.

## Design recommendations, not confirmed blockers

The explanation/generalisation adds casts, register-only extension and extended-add syntax before returning to a load-focused record challenge. A visibly optional deeper comparison, or a short explicitly focused experiment before the extended-add example, could clarify which knowledge is required next. However, the course has already taught arithmetic shifts and combined-operation syntax, and these examples each use short programs. I do not claim this breadth alone overloads the learner.

The extended-add step shows a numerical register result but no `memory-transfer`/extension-region display after that instruction. In contrast, sxtb/sxtw and loads show region diagrams. Source confirms transfer rendering depends on `memoryTransferAt`; browser stepping confirms no such display for this add. A temporary extended-operand visual would help explain the unmodified w1 versus the arithmetic input. This is a visual-support recommendation, not a missing prerequisite or evidence of an impossible first attempt.

## Keep

- The motivation explicitly separates sign-extending into w0 from clearing the physical register's upper half. It avoids conflating two effects at exactly the point a learner could do so.
- The first signed-byte prediction is committed before its walkthrough and comparisons unlock. Teaching the extension rule before asking the learner to apply it is appropriate, not a spoiler.
- The construction asks for one new load choice plus familiar addition; the later failure experiment isolates the load change while keeping addition unchanged.
- Byte-role labels distinguish copied data, sign fill and cleared upper bits. Light and dark renderings preserve those distinctions, and each source address remains explicit.
- The final task warns that its four-register result is an exercise convention and only w0 is the ordinary C return register. Its model note separates the exercise's layout from a compiler's record layout.

## Coverage and limits

Read all ten sections, local disclosures, challenge tasks, recorded listings and lesson configuration. Read both memory view implementations and memory styling. Checked earlier lesson definitions/prose in the parsed registry to establish prerequisites. Did not rely on historical reader notes.

Browser: fresh Playwright contexts for 375×900 and 1280×900, each with light and dark system preference. Actual body backgrounds were rgb(243,246,245) for light and rgb(16,22,21) for dark; no page horizontal overflow in those contexts. Inspected full initial, first-prediction committed and stepped states and normal details disclosures. Committed the first prediction with an intentionally selected option; stepped every then-unlocked memory stepper once, covering loads, sxtb/uxtb, sxtw and extended addition. In separate fresh contexts at all four combinations committed both predictions, stepped the failure walkthrough through its addition, used Back and Reset, and ran the unchanged first construction's tests. No challenge solution was entered or disclosed. Final challenge was inspected initially only; did not test a learner-authored final program, all hints, persistence/restoration, tap-editor editing or external GCC. No app edits, rebuilds or external compiler calls.

Artifacts: `/tmp/course-load-review/loading-widths-browser.cjs`, `loading-widths-browser.log`, `loading-widths-post.cjs`, `loading-widths-detail.cjs`, and lesson-prefixed PNG files. Screenshots are evidence artifacts, not course changes.
