# Addition clarity brief

User findings: the operand-order sentence and instruction to point at inputs/destination are unclear; the figure badge Stepped does not explain an action; the Arm reference links may appear to require payment. Merge is authorised when checks pass.

Checked facts:

- `content/lessons/meet-the-machine.primitives.ts` fixes the first activity to `add w2, w0, w1`, starting w0=12, w1=7, w2=0. `flowAt` derives its two sources and destination from the simulator instruction and trace; these values are not copy constants.
- This instruction reads the values in w0 and w1, adds them and writes w2. Reading does not replace those input registers. The destination is written before the two inputs in assembly text.
- `PrimitiveOperation` already shows a model-derived preview: two input chips, an addition sign and a downward arrow into the pending destination. The sum remains `?` until Run the instruction. Existing labels say Read and Write after running; the prose instead asks the reader to find inputs and destination.
- Remove the unsupported/ambiguous pointing request. Explain this exact instruction through its named registers, define destination where first used, and align the existing computed visual's labels with those words. Preserve the hidden sum and fresh challenge answer gate.
- `VIEW_STRINGS.modelBadge` supplies the label for the course's `steps` time model via `apps/course/src/runtime-strings.ts`. It is shared across lessons. Inspect all time-model uses before choosing a plain replacement; do not imply recorded native output is live hardware. Keep the model note available, without relying on it to define a vague badge.
- First-activity caption currently names the topic and starting/result states without telling the reader what to do. Prefer concrete interaction/result-observation guidance, coordinated with the button's existing name.
- The current optional references link Arm's A64 instruction reference DDI0602 and architecture manual DDI0487. They are outside the offline guarantee. Actual live access requirements are being independently checked; do not assert a fee, universal anonymous access or free-account requirement without evidence.
- Keep lesson copy and `docs/notes/fundamentals/prose.md` synchronised. Follow CLAUDE.md, docs/style.md and docs/visual-language.md. Draft separately, then independently check accuracy and the production page at phone/desktop in both themes.

Scope: focused clarity and reference-access changes, plus affected shared primitive/badge labels. No course restructure, new instruction or change to simulator behaviour.

## Checked Arm access, 24 October 2026

Independent anonymous browser checks followed the existing developer.arm.com links to support.arm.com. Both automatically opened a large Arm ID sign-in drawer, which could obscure public documentation and resemble a gate. Both drawers were dismissed using their visible X control. No authentication or payment was required to read the checked pages.

The public ADD shifted-register entry loaded its full description, 32/64-bit syntax and operand definitions at:
https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/ADD--shifted-register---Add-optionally-shifted-register-

The architecture latest manual loaded as DDI0487 M.d. Actual official Downloads links were tested anonymously without cookies/authentication: architecture PDF `https://documentation-service.arm.com/static/6abbec2a6db85c5e6614a4a1?token=` returned 200 application/pdf with its DDI0487M_d filename and `%PDF-` prefix; the A64 instruction PDF `https://documentation-service.arm.com/static/6abbe4bd6db85c5e66147fc3?token=` did likewise. Only the first five bytes were read before closing; the large PDFs were not downloaded.

Preferred learner path: link directly to the checked official ADD entry for this instruction, retain the architecture-manual link, and explain the free public access and optional dismissible sign-in panel. Do not imply that every unrelated Arm download or entitled product is account-free. No course activity depends on opening the manuals.

Evidence: `/tmp/arm-public-pdf-proof.json`, `/tmp/arm-public-ddi0602-add.png`, `/tmp/arm-public-ddi0487.png`, independently checked by the learner-review session.
