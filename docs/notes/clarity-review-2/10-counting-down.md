# Counting down: second clarity review

Copyright © 2026 Christopher Snow

Fresh learner review of lesson 10, after `counting-up`, against `CLAUDE.md`, `docs/style.md` and [the review brief](brief.md). I formed the assessment from source and the built page before consulting the first review. This report changes no course text.

## Findings and reconciliation

### M6 retained, medium: hint headings reverse the meaning of advice

Rendered quotation: “COMMON MISTAKE” followed by “Put a label before the shift so a branch can repeat it.” Source: `content/lessons/counting-down.prose.ts:31`; the fixed heading is `platform/lesson-runtime/src/strings.ts:122`.

A learner asking for help after a failed submission can read the recommended action as the mistake to avoid. The heading and its content disagree. Make the affected hint perform the function promised by its heading, preserving the platform copy.

Additional occurrence to merge into M6: `counting-down.prose.ts:69` places “Check the tick count before the first shift. A zero count must return the original brightness.” under the same “COMMON MISTAKE” heading in the final challenge. The third hints at lines 32 and 70 likewise supply another instruction for the current program under “SMALLER EXAMPLE”; they do not supply an example. These are further locations of the existing heading/content issue, not separate findings.

### L11 retained, low: the optional compiler permission remains abstract

Quotation: “lets a compiler assume termination for such a loop if it performs none of the specified observable operations” and “Another compiler need not preserve a never-ending run of this C loop.” Source: `content/lessons/counting-down.prose.ts:60–61`, expanded “What the C standard permits”.

“Assume termination” and “need not preserve” tell the reader a permission exists but leave its effect on the generated instructions implicit. This matters because the main text has just distinguished the displayed GCC output from what other compilers may emit. Explain the practical consequence in ordinary language and relate the local-variable changes to this function. Preserve the standard's conditions and the specific GCC qualification; do not claim another compiler must choose particular output. This optional detail does not prevent completing the main exercise, supporting the master review's low severity.

### L10 retained elsewhere; merge the continued use here

Quotation: “The simulator will stop this trace after 20 instructions if the function has not returned.” Source: `content/lessons/counting-down.prose.ts:38` (also lines 40, 44, 52, 83–84 and loop captions).

The preceding lesson uses the technical noun “trace” without defining it, and this lesson continues to assume it. The repeated references to its instruction limit explain why a run stops, but do not directly identify a trace as the recorded sequence of execution. Resolve L10 at its first occurrence in `counting-up`; do not add a duplicate explanation or a second issue here.

No new independent clarity issue survived this pass. No rejected earlier finding is being reopened.

## Assumed knowledge and clean results

The front page requires reading small C functions, `for`/`while`, arguments, returns, arithmetic and binary conversion. Earlier lessons establish register widths and argument/result placement, unsigned wrapping, subtraction flags, logical right shifts, conditions, branches and labels. `counting-up` introduces this dimming rule, compound shift assignment, loop/body/iteration and the first-entry check. The present lesson explains both `ticks--` and `do` before requiring them. The compiler version and `-O1` have their Module 0 explanation. These are not missing prerequisites.

The optional note assumes familiarity with compiler termination assumptions and observable operations; its brief input/output gloss does not yet explain the effect on generated code (L11). The inherited trace terminology is L10. I found no additional unprovided prerequisite.

The main progression clearly distinguishes a long finite run from a non-terminating assembly loop. It states what each flag/branch reads, explains the zero-count case, and separates the count of instructions from elapsed processor time. I found no reason to rewrite that explanation or the task's explicit argument/result mapping.

## Coverage and evidence

Read the complete `counting-down.prose.ts`, `counting-down.labels.ts`, and `counting-down.ts` wiring; checked preceding `counting-up` explanations and earlier prose for the terms above. Included both tasks, ten hints, prediction choices and explanations, all captions, three lesson disclosures, reflection answer and model-versus-reality wording. `finalFeedback` was read in source; it is not wired into these challenges and was not claimed as browser-visible.

Built page: `http://127.0.0.1:4253/assembly-lab/#/lesson/counting-down`. Chromium at 1280×900 and 375×900, light and dark. In all four configurations I opened lesson disclosures, submitted the first option of both predictions to inspect mismatch explanations, ran both unchanged starter programs, opened all ten hints, and advanced each of the three steppers five instructions. Read the initial/default loop summaries and their unlocked views. Did not change the loop-run selections, submit completed challenge solutions, or exercise arbitrary invalid input. Reviewed captured rendered text and screenshots. Document width equalled viewport width in all four configurations.

Evidence: [browser script](/tmp/clarity2-10.mjs), [four-configuration record](/tmp/clarity2-10-browser.json), rendered initial/revealed text `/tmp/clarity2-10-{1280,375}-{light,dark}-{initial,revealed}.txt`, and hint/note screenshots `/tmp/clarity2-10-{1280,375}-{light,dark}-{hints,note}.png`. Representative evidence: [phone light hints](/tmp/clarity2-10-375-light-hints.png), [desktop dark note](/tmp/clarity2-10-1280-dark-note.png), [desktop light hints](/tmp/clarity2-10-1280-light-hints.png), [phone dark note](/tmp/clarity2-10-375-dark-note.png). Artifacts contain revealed exercise material and remain outside this report.

Earlier reconciliation sources: [reader 10](../english-review/10-counting-down.md) and [ranked master review](../english-review/README.md), specifically M6, L10 and L11. No build, app edit or commit was made.
