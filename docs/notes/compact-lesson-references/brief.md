# Compact lesson references

The user approved `M1, L2: Title` for previous/next cards and cross-lesson links, retaining `L2: Title` within each named module on the plan. The full current-position line above the page title remains context for those abbreviations.

Checked facts: `createLessonReferences` derives positions from published module labels and sorted lesson order. The shared formatter supplies Markdown links, JSX `LessonLink`, prerequisite titles and adjacent-lesson cards. Module A/B labels must remain consistent. Recognise both legacy and compact prefixes so formatting is idempotent. Preserve titles, destinations, code examples, external links, lesson identity and saved work. No model, grading, platform or CSS change is needed.

The existing reference tests retain their ordering, routes, author-data identity, gates, restoration and layout checks. A separate GPT-6.1 Sol drafting pass at Medium effort supplied the compact format; independent learner/UX and technical passes will review the final source. The executor became unavailable before a new build could be inspected. Full exact-head CI, including real browser checks in both themes and device projects, is the executable validation; manual preview is not claimed.

Independent technical review found that an unrestricted compact module token could consume a closing Markdown label and its href when following text contained `, L2:`. Restrict recognised prefixes to the course's published numeric/A/B module labels and cover ordinary, compact-looking and expanded-looking link titles in the existing Markdown regression test. Initial CI stopped at Prettier on the chained test-oracle replacements; their layout is corrected without changing the oracle or any assertion.
