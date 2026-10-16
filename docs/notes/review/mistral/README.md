# Mistral review of the lessons

Model: `mistral-large-latest` (temperature 0.3), via `https://api.mistral.ai/v1/chat/completions`. Date: 2026-10-16.
Script: `run.py` (reads the key from the environment only). Replies are verbatim.

Each lesson is one conversation: the system message in `run.py` (the front page's "Before you start" text, without the self-check function), then the lesson text and:

1. `Review. Is the content clear and easy to follow?`
2. `Some of the text seems more complex than it should be`

Module 0's `prose.md` has no `# Lesson` line, so its text was taken from `## 0. Objectives` to the end (the drafting notes above it were left out). Its file title is a placeholder.

Files:

- module-0-lesson-1.md
- module-1-lesson-1.md
- module-1-lesson-2.md
- module-2-lesson-1.md
- module-2-lesson-2.md
- module-3-lesson-1.md
- module-3-lesson-2.md
- module-4-lesson-1.md
- module-4-lesson-2.md
