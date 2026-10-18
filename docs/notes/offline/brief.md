# Offline support brief

User request: support using Assembly Lab offline.

Checked starting facts: lessons and recorded listings are bundled through `book.tsx`;
the assembler, simulator, exercise graders and small C compiler run locally. Fonts
are imported from local packages. The optional GCC comparison in
`packages/views/src/compilerExplorer.ts` makes an explicit POST to Compiler Explorer.
The app uses hash routes and is deployed under `/assembly-lab/`, sharing its origin
with other courses. The manifest already supports installation. Theme and lesson
work use local storage. Existing uncommitted Module 0 prose and English review notes
are outside this task.

Required behaviour:

- After a successful online visit, cache the complete production app, including
  lessons not yet visited, fonts and icons. Reopening a lesson URL offline works.
- Show a concise footer status only when offline readiness is established. Report
  preparation and failure plainly; explain that external links and optional GCC
  comparison require internet. No technical prerequisite is assumed for this text.
- Failed downloads cannot replace a working cached release. Updates wait until all
  tabs using the old release close. Never force reload or discard exercise work.
- Scope registration, requests and cache cleanup to this app. Do not cache API POSTs,
  external sites, arbitrary requests, source maps or the worker itself.
- Production only; support both the Pages base path and a root base path. Browsers
  without service workers retain the online app. HTTPS or localhost is required.
- Browser storage may be cleared or evicted; do not promise permanent availability.

Follow `CLAUDE.md` and `docs/style.md`. New learner text needs a separate draft.
Every implementation and documentation change needs independent review. Verify
actual offline reload, unvisited lessons, editing/grading and local compilation;
also verify upgrade lifecycle, partial install failure and isolation from other apps.
