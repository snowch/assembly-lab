# Validation

Production build passed in 12.24 seconds. Source changes after that build are tests/review notes
only; no later product edits invalidate its browser evidence.

- Scoped prose, hexadecimal facts and completion store/component tests: 54 passed in four files
  (55.92 seconds), exit 0.
- Complete completion browser specification, including the new compact-height/centring and
  rendered digit markup regression checks: 18 passed (1.2 minutes), exit 0.
- Formatting, strict types, copyright, platform-copy and whitespace checks passed.
- Separate learner and technical review reports record their actual built states, widths,
  themes and checks. Enlarged-text figure overflow predates this change and is outside its
  scope; the completion control grows legibly with the learner's text size.

Full check and CI/deployment evidence follow separately. No platform/model/storage change was
made. Unrelated Pi notes are preserved.
