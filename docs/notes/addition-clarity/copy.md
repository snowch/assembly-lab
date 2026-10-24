# Addition clarity: separate copy draft

Drafted from `brief.md` and `docs/style.md` in the addition worktree. No new arithmetic value, instruction or simulator behaviour is introduced.

The first operand explanation now begins with this exact instruction's named registers. It defines inputs as the values read from w0/w1 and destination as the register receiving the result, w2. The operand order follows that concrete description. The pointing request is removed.

The computed primitive preview and result use the same nouns: Input, Destination, Destination written. The pending destination still shows `?`; the result remains trace-derived and appears only after execution. The first caption names the existing Run the instruction control and the destination to observe. The nearby figure prose says what its diagram contains.

## Shared badge audit

Inspected every literal `timeModel: "steps"` declaration under `content/lessons/`, including helper-generated figures, and the platform's badge-role selection. The uses include model steppers, memory/stack steppers, prediction gates, challenges, compiler playgrounds and Module 12's recorded native-tools views. Explicit role badges override this generic label for predictions/exercises/diagrams. The remaining generic badge is now `Step by step`, which describes sequence without claiming live native execution or prescribing one control across unlike figures. The existing note remains available. No platform source was edited.

## Style passes

Sentence pass: named registers replace abstract second/third references at first encounter; no vague pointing task; no invented sum or native execution claim. Idea pass: before operating, the reader can locate what is read and what will receive the sum using the same labels in the visual. Later register reuse continues to use the same roles without implying that the destination is always a separate register.

The change reuses the existing model-derived flow diagram, rather than adding another figure or hand-maintained arithmetic labels. Independent browser checking should cover initial/run/reset at phone/desktop in both themes, the subtraction/sequence siblings, and the Module 12 recorded-output badge. Reference links are unchanged pending separately checked access evidence.

## Reference access follow-up

Drafted from the independent anonymous access evidence appended to `brief.md`. The first link now goes directly to the checked official ADD entry. The architecture manual link remains. The access explanation is scoped to these two references: they are free to read without an account, and a sign-in panel can be closed. It makes no claim about unrelated Arm downloads or products. Canonical prose and the meaningful browser href assertion are synchronised.

Focused checks after the reference change: the first two-file command returned 16 passed / 1 failed because the numeric prose scanner treated the document issue date in the checked URL as an arithmetic claim. The scanner now excludes URL targets, whose exact destinations retain browser href assertions; visible prose and link-label numbers remain checked. The corrected rerun is reported separately.

Corrected focused rerun: `npx vitest run content/lessons/fundamentals.test.ts packages/views/src/primitive.test.tsx` passed 2 files / 17 tests. `git diff --check` passed. This does not change the preceding failed command's result. No production build or independent browser verdict is claimed by this drafting pass.
