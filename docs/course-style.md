# Shared course style in Arm Assembly Lab

Copyright © 2026 Christopher Snow.

Follow the [shared course design guide](https://github.com/snowch/cuda-python-lab/blob/main/docs/course-design-guide.md). This adapter preserves the course's stated C and binary prerequisites, instructional gates, real simulator-derived figures and existing lesson URLs and storage keys.

The header keeps Calculator, Reference, App status and the theme selector. The assembler, simulator and small local C compiler are JavaScript model code. There is no prepared WASM runtime to start, hold or release, so there is no Code runner header control. The optional Compare with GCC remains an explicitly requested external comparison.

Typography uses locally bundled IBM Plex Sans and Plex Mono with their OFL licences. Reading text is 17 px, ordinary code 16 px, headings restrained and controls at least 44 px. Theme roles supply surfaces and contrast. The existing live homepage model stays beside the introduction on wide screens and follows course choices on narrow screens; it is not a decorative or scripted substitute for execution.

A combined Course lessons row shows explicit reading progress and current module/lesson. The inline outline preserves ordinary lesson links and closes with Escape. The separate On this page disclosure still reaches real sections and moves focus to their heading. Neither menu remounts the lesson model or clears entered work. Resource references stay optional; explicit, reversible completion remains separate from challenge grading. Previous/next cards name their actual lesson.

App status is a persistent native modal with a dimmed backdrop, one Course status section and one prominent applicable action. Measured progress and recovery stay visible; version/source identity, manual checks and removal stay in optional details. Escape dismisses the top modal, returns focus to its trigger and preserves an underlying desktop Calculator or Reference lookup. See [offline operation](offline.md) for loaded, published and saved release identities.

Verification records, separate copy drafting and independent technical/learner findings are in [shared-course-style notes](notes/shared-course-style/). Browser checks verify functional behaviour and presentation; they do not establish learning effectiveness.
