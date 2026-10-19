# Reader/checker 20: Compile a loop and follow its branches

## Verdict

Accepted shared corrections are present and clear. No new blocking, medium or low finding identified in this lesson within the coverage below. This is an independent read/check; no application or content files were edited.

## Read and prerequisites

Read CLAUDE.md, docs/style.md and docs/authoring.md; the complete current lesson prose, labels, structure, questions, options, explanations, both hint ladders and model note before consulting the audit summary and verification coverage plan. Relevant prerequisite checks included the front-page C panel, Module 0 compiler-settings explanation, counting-up definitions of loop/body/iteration and trace, shifts, and the preceding local-compiler lesson. No author's implementation explanation was used.

No unsupported prerequisite identified. The front page explicitly includes for/while, unsigned arguments and return. Earlier lessons teach the arithmetic, conditional branches, wrapping and shifts used here. The immediately preceding lesson establishes the local compiler, fixed register assignments, working registers and C evaluator. This page explains its repeated-shift distinction before the closing exercise. Source highlighting's many-instructions relationship is explicit locally.

## Fix reconciliation

- **S1 activity roles:** both prediction cards visibly say Prediction, with no instruction-step disclosure. Both manual exercises use Exercise. The actual compiler playground retains Stepped. Initial prediction questions identify their inputs and the desired returned value. Source roles agree with the built page.
- **M6 hint roles:** both five-rung ladders were revealed in the browser in all four configurations and read against their headings. Common mistake describes a concrete incorrect action; Smaller example supplies concrete small inputs or the zero-count case. Partial and complete help remain behind the hint controls. No challenge answer is reproduced here.
- **S2 written/change:** after two steps in the investigation playground, the zero-valued destination is labelled Written, correctly indicating a write even though the numeric value stays zero. It does not claim that zero changed.
- **S4 status formatting:** the status renders “Ran” followed by a code-styled instruction, without literal Markdown backticks. Phone and desktop screenshots show this clearly.
- Source pairing, current-operation highlight and next-operation controls remain usable in the sampled step state. Phone C wraps within the listing; no page-wide horizontal overflow was observed.

## Actual browser coverage

Final production page: `http://localhost:4292/assembly-lab/#/lesson/compile-a-loop` (confirmed by the recorded probe).

Fresh Chromium contexts at 375×900 and 1280×900, both light and dark. Used raw localStorage `assembly-lab:v1:theme` strings and asserted html data-theme for each. Read initial page text; inspected prediction screenshots; checked both prediction cards and thereby unlocked both playgrounds; ran the first playground and advanced two instructions; revealed all ten hints; saved after-state page text. No pageerror events or horizontal overflow in these runs. The initial compiler playground count was zero, consistent with its prediction gate; the first became available after commitment.

Artifacts: `check20.cjs`, `20-evidence.json`, and `20-{375,1280}-{light,dark}-{initial,step}.png`; initial and after text files in this directory. Independently viewed representative phone light initial, phone dark step, desktop light step and desktop dark initial screenshots. Every configuration's DOM/state was checked.

Limits: did not submit or solve the two challenges, exhaustively exercise diagnostics, run the loop to completion instruction by instruction, alter the C, invoke external GCC, or test saved-state/reload scenarios. Full automated regression and technical source certification remain separate coordinator/root checks. This verdict addresses accepted clarity fixes and obvious regressions, not every possible program or browser state.
