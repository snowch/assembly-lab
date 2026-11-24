# Shared course style and offline status brief

Copyright © 2026 Christopher Snow.

The learner knows the front page's stated C and binary prerequisites. This change concerns course navigation and browser files; it does not introduce an instruction or alter a teaching example, prediction, model or challenge.

Checked facts:

- The course runs a synchronous JavaScript assembler/simulator and small local C compiler. There is no prepared WASM runtime to start or release, so no Code runner control is needed.
- Calculator and Reference are existing header tools with independent dialogs; their controls, content, focus handling and saved values must remain.
- `useOffline` already checks SHA-256 and byte counts, provides explicit downloads, and coordinates PREPARE/VERIFY/COMMIT/CANCEL with every open course tab. It guards unsaved/conflicting artifacts, composition and theme/view handoff. Preserve these protections.
- The existing status disclosure separates version and offline headings, repeats primary actions, and calls a complete download Available offline. The preferred interface has one Course status section in a persistent native modal, one primary action, measured progress and optional version/download details.
- The worker currently serves a saved release before the network, including when a newer course is online. Online page visits should use current published HTML; verified earlier complete releases remain offline fallbacks and old loaded documents retain their own executable assets.
- The shared design guide prefers restrained headings, 17 px reading text, approximately 16 px code, local fonts, a combined course/menu/progress/location row, optional resource disclosures, explicit completion and clear named next/previous cards. The course already provides completion and resource rows; preserve their meaning.
- The homepage already has a model-derived live figure. Keep it, rather than invent a decorative architecture image or scripted execution. On wide screens it sits beside a compact introduction; narrow screens must reach course choices without an oversized introduction.

Implementation boundaries: no platform copy changes; no lesson model/content changes; no external runtime/font assets; no clearing learner storage. Copy is separately drafted in `strings.status.ts` and `strings.layout.ts`. Engineering code and review records remain in the course shell.

Verification must cover the header tools, one modal and keyboard focus, current/saved/partial/older/update/restart states, actual offline lessons and simulator execution, old loaded tabs after publication, restart vetoes, saved predictions/edits/results/completion, and phone/desktop themes. Automated functional checks and independent reviews are reported separately from learning-effectiveness evidence.
