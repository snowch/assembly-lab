# Carry simplification: separate drafting pass

Copyright © 2026 Christopher Snow.

## Scope and drafting choice

This separate drafting agent worked from `simplification-brief.md`, the local learning-design skill, `CLAUDE.md`, `docs/authoring.md` and `docs/style.md`. Drafting used GPT-6.1 (`gpt-6.1-sol`) at Medium effort, confirmed by the managing session against the agent configuration. No separate UX skill was applied.

Keep the existing 3 + 3 column route and four-place boundary, subtraction procedure and fresh 6 − 3 exercise. Remove the closing register/ALU prose and its objective, then restore the short transition to the next page's 32-place subtraction. No new activity, quiz, section, display or label is needed. A final tightening pass uses a short bit-1 setup and two parallel bullets, one per output, without repeating their roles afterwards.

## Inspected evidence

Source inspection only in this drafting pass:

- `packages/views/src/four-bit-arithmetic.ts` computes the miniature from actual ADD/SUB runs and selects the low four columns; its addition inputs are 3 and 3.
- `packages/views/src/four-bit-arithmetic.test.ts` pins `0110` and the bit-1 inputs A = 1, B = 1, carry in = 1, with kept = 1 and carry out = 1.
- The supplied checked brief records bit 0's incoming zero, kept zero and outgoing one. Ordinary binary addition independently confirms both column calculations.
- The existing figure strings label A, B and Carry in separately, and Carry and Kept separately. Existing labels suffice; no string keys changed.
- `content/lessons/fundamentals.ts` defines `one-addition` as the first Module 0 lesson. `fundamentals.labels.ts` names it One addition, and `fundamentals.prose.ts` directs the learner to run `add w2, w0, w1` with inputs and destination shown.
- Read Bit Lab's `AGENTS.md`, `README.md`, curriculum plan and sources. Its ALU explanation promised the removed 32-bit view. Corrected only that paragraph and its exact canonical copy to point to One addition. All activities, questions and model data are preserved. Technical review also identified the unused `bitLab.lessonLinkLabel` and `lessonLinkHref` prototype strings, which still targeted the removed view. A repository search found no component references; removed both fields and their canonical source snapshot rather than retaining a stale promise.
- Read the visual language and inspected the visual audit. Retaining the existing figure preserves the distinct calculation-reveal interaction; the prose still says that revealing a column does not execute another instruction.

## Copy and style passes

The rightmost-column calculation now leads directly to bit 1. The next paragraph explicitly adds both input bits and the third, incoming carry. It explains binary `11` as two outputs with distinct destinations: kept 1 in this column and carry 1 one place left, whose place has twice the weight. This addresses the possible carry-replaces-an-input and equal-weight misconceptions without adding gate terminology.

Completed the sentence pass: plain British English, explicit referents, no new jargon, no em dashes, short instructions using the existing control name. Completed the idea pass by reading the whole prose source: the small example supports the mechanism, the calculation role stays explicit, width and subtraction remain intact, and the next-page bridge no longer introduces the removed activity. Canonical lesson copy is synchronised with the changed source.

A source comparison confirmed that every Assembly prose string occurs in the canonical draft and that the changed Bit Lab paragraph matches its canonical source exactly. The first focused Prettier check found whitespace in the canonical Assembly draft; formatting corrected it and the focused rerun passed. No build, browser, keyboard, screen-reader or novice-learning checks were performed by this drafting agent. Independent learner/UX and technical reviews, final built-page verification and repository checks remain with the managing session. Demonstrating the mechanism does not establish transfer.
