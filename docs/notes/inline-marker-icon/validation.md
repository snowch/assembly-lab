# Inline marker validation

Added the text-presentation solid right-pointing triangle immediately after the first word “marker” in the program-counter paragraph. A separate drafting pass first recommended U+25B6 followed by U+FE0E. Independent screenshots showed that the actual font fallback still rendered an orange boxed play emoji at all four viewport/theme combinations. This medium visual finding was accepted. The drafting pass then recommended U+25B8 (BLACK RIGHT-POINTING SMALL TRIANGLE), a text-only symbol without emoji mapping. The final implementation uses that glyph. The existing sentence and its definition remain otherwise unchanged. The canonical Module 0 prose record matches the lesson source.

- Existing prose consistency suite: 12 passed, exit 0 (`/tmp/inline-marker-unit.log`).
- Production build: passed, exit 0 (`/tmp/inline-marker-build.log`).
- Changed-source Prettier and `git diff --check`: passed.
- Independent technical review checked the existing CSS triangle, next/executed distinction and preserved accessible listing labels; independently repeated all 12 prose tests successfully.

The change adds no tests, model behaviour, controls, platform code or CSS. The complete local suite was not rerun for this visual text clarification. Independent built-site review is recorded separately; full CI gates the merge.

The initial prose tests and build passed, but the initial visual result failed. Their passing result does not certify the original glyph rendering; the recheck below verifies the replacement.

Final replacement verification:

- Existing prose suite rerun: **12 passed**, exit 0 (`/tmp/inline-marker-unit-final.log`).
- Final production build: passed, exit 0 (`/tmp/inline-marker-build-final.log`).
- Node Unicode-property diagnostic confirmed U+25B8 and `Emoji: false`.
- Independent actual-browser recheck passed at 375px/1280px in both themes: plain foreground triangle, no emoji or missing glyph, no overflow or page errors. The medium finding is resolved; see `review.md` for screenshots, initial failure and final recheck evidence.
