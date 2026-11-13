# Compact result copy draft

Separate drafting pass from `brief.md`, checked against the flags model, current authored strings, `CLAUDE.md` and `docs/style.md`. Suggested S additions/changes are in `/workspace/scratch/flags-compact-result-copy.ts`. No product files changed.

The two prediction responses retain the existing match/difference judgement and remove invitations to an explorer that is being removed. Reuse “Exact sum”, “Result written to w0”, “Unsigned reading” and “Signed reading” rather than adding new labels. The two decimal readings remain together under the one model-produced hex result. Each gets a short note saying whether it matches the exact sum. The final explanation distinguishes overflow of the exact signed sum from validity of the stored negative reading; it does not call the stored negative value out of range. All numeric values stay in model output rather than in authored labels.

Sentence pass: ordinary words, one idea per sentence, no numeric answers, no reference to removed controls, no new terminology. Idea pass: the visible result values carry the concrete comparison; the local explanation states why the valid negative reading still does not represent the exact signed sum. Avoid repeating the same mismatch in a long paragraph and in the row note. The earlier carry/circuit explanation and next practice section retain their distinct roles.

## Canonical and sibling joins

The current authored page's section06 feedback strings are in `packages/views/src/flags-lesson/strings.ts`; those exact S strings have no separate canonical prose copy. Remove unused explorer/column-control strings only after checking other references. The user-visible question's “before inspecting the result” still makes sense when the result appears directly after checking; changing it is optional, not needed to support removal.

`content/lessons/adding-and-the-flags.prose.ts` and `docs/notes/module-2/prose.md` remain synchronised records for the older generic lesson renderer. Their `bridge32`, `investigation` and `investigationControls` still describe that generic renderer's own 32-column figure. They are not word-for-word sources for the authored S feedback being changed here. Do not silently rewrite that independent renderer or its still-present figures during this local section06 removal. If the managing session chooses to retire the older renderer in a separate change, update both records and their prose/figure tests together.

This is a copy draft and source-reading pass only. Independent review and actual built-page verification remain required.
