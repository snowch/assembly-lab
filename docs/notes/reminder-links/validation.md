# Validation

Copyright © 2026 Christopher Snow

- Audit-coverage test reconciles every published lesson exactly once across the three review tables: 75 routes. Internal-reference test checks that linked lesson routes are published. Independent review also checked new reminder destinations precede their applications and teach the stated rule.
- Focused content/component run: seven files, 58 tests passed. This includes provenance, term gates, canonical copy, all-route coverage, link integrity and model-derived reading equations. Drafting agents separately ran the affected pacing, fundamentals and synthesis checks; their records distinguish intermediate failures from final passes.
- TypeScript check passed. Production build passed. Focused educational browser regression: ten tests passed across desktop and phone, including explanation gating, returned equations, reset and restored results. No new program is introduced; the recorded subtraction programs retain their existing GNU/QEMU corpus coverage.
- Independent built-page checks and their limits are recorded in independent-review.md and technical-review.md. Actual light/dark themes and phone/desktop states were checked. The inherited disabled-call-button focus behaviour remains documented as a nonblocking pre-existing issue; no new control behaviour is introduced here.
- The exact npm run check was started against the implementation. Full-suite and CI results remain separate from the focused passes above and must be green before merge. No novice study or physical assistive-technology test is claimed.

The first exact full-check run passed 182 unit files (3189 tests) and failed one strict configuration assertion: it still omitted the newly enabled `workedReadings` property. The assertion was updated to explicitly require `workedReadings: true`, retaining strict equality, and independently reviewed. Its focused rerun passed all ten tests. This does not change the original full-run failure; a new exact check and CI run follow the correction.
