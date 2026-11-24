# Shared lesson-ending style completion

The user's published Arm screenshot shows a References row without its standard Material icon or a topic subtitle. The completion icon is a hand-drawn circle/check, while the shared guide requires official Material Symbols Rounded. The site footer repeats companion-course descriptions, several links and build identity on every lesson. This is a shared-shell correction; lesson programs, facts, predictions, source links, storage keys and the platform remain unchanged.

Checked implementation facts:

- `LessonSourceReferences` receives the existing `LessonSources` selected per lesson; instruction references have an exact label, URL and mnemonic. Other references have an exact label and URL. Some references use already authored Markdown.
- Primary references and forms are checked in `content/lesson-source-references.ts`, `content/instruction-reference-catalog.ts` and `content/extended-reference-catalog.ts`; previous authored reference prose must remain intact.
- The shared guide uses `menu_book` at 24px, compact `chevron_right` at 20px, official outlined Rounded geometry/weight400/grade0, inherited secondary colour, decorative hidden icons and a full summary target. Its topic subtitle names the existing reference scope; do not add new technical teaching.
- `LessonCompletionButton` is already a reversible persistent local button. Its accessible mark/undo labels and storage logic remain; visual state can use official assets while adding explicit pressed state.
- Completion is the learner's own marker. Next lesson remains available regardless of completion. First/final navigation should include the course overview rather than an empty card position.
- `AppStatus` already exposes running commit/build and published identity in an optional version/download disclosure. The no-script initial header exposes running version too. Build identity can leave the footer without losing access.
- The optional `#/where-next` page, homepage discovery, after-calls link and no-script `#where-next` section must remain. Companion-course descriptions already exist in `STRINGS.companions` and can move intact to the optional Where next page. Footer source and copyright stay; standard licences and report links can use repository files/issues.
- The prior footer has six links in both JS and no-JS tests. Tests need to follow the intended quiet footer and the preserved companion links in their new optional location; do not remove keyboard/link/persistence/model checks.

Drafting brief: use only these implementation facts and existing labels/prose to recommend the smallest strings/scope presentation for the References subtitle and quiet footer. The learner has the course's stated prerequisites and the actual lesson so far, not architecture knowledge beyond the lesson. Do not write new explanations, invent topics, expose answers or change a technical claim. Read `docs/style.md` and the canonical shared guide first. Independent review must inspect built phone/desktop, light/dark, keyboard, initial/open/closed/completed/restored states.

## Separate drafting pass

The `draft_style_labels` session read the actual source and shared guide without editing. It recommended ordered unique uppercase instruction mnemonics as the short reference scope; when no instruction source exists, reuse the already approved lesson title verbatim. Complete instruction form labels, links and authored notes remain expanded. It recommended the standard labels Where next?, Source, Sources and licences, Report a problem; companion descriptions move unchanged to the optional page. Existing completion labels stay, with explicit pressed state. No new architecture explanation or number was drafted.

## Implementation scope

The original implementation had no official Material Symbols bundle in the Arm shell. The fix bundles ten exact official Rounded SVGs at the guide's revision, with the licence and provenance. Resource/outline chevrons, header tools/theme and completion all use the common component. Subject-specific module marks and computed diagrams remain unchanged. Icons are decorative and have no learner HTML input.

Source, Where next and the companion-course destinations are retained in the app and no-script page. The quiet footer adds the repository sources/licences record and issue tracker as explicit links. Source/date/build identity remains optional in App status rather than in the footer. First/final boundary navigation points to the course overview; all adjacent lesson titles retain the checked numbered formatter.

The review records below close the initial implementation. Original failures or infrastructure interruptions remain recorded separately from focused reruns.

## Independent review corrections

The learner and technical reviewers independently accepted the reference body/form/URL retention and unchanged models, platform and saved-work logic. Their accepted findings were:

- Replacing an outline tick with a decorative SVG alone left a generic labelled span without reliable status text. It now includes real visually hidden Marked complete text, matching the existing homepage pattern.
- Automatic uppercasing obscured the catalogue's `B.cond` placeholder notation. Dotted instruction names now retain the existing source label.
- The original phone styles still hid the brand and Calculator/Reference labels, while reserving icon-only widths. The shared shell now restores their visible names and natural widths. The native Theme choice has a visible label and remains a native select.
- A licence in source alone was not packaged for offline use. Exact Apache text and pinned provenance now live in public/fonts and appear in the built release manifest.
- Both reviewers found duplicate separators before References. Removing only the outer lesson-ending border leaves the reference row's own divider. The final 375px light and1280 px dark screenshots were independently inspected after rebuilding.

Learner verification: four states at 375/1280 px in light/dark, plus the exact negation row and final course boundary in all four states, passed. It covered real model-step retention through reference/completion controls, keyboard opening/closing and focus, mark/reload/undo, optional companion access, scoped references and App status identity. An initial reviewer harness failed because its exact App status matcher omitted the visible status subtitle; that command's failure remains recorded separately. The corrected four-state run passed. Evidence: `/tmp/arm-style-learner-review/`, `/tmp/arm-style-learner-boundaries.log` and `/tmp/arm-style-learner-final-divider.log`. This is functional/style review, not evidence of learning or a physical Android test.

Technical verification:18 width/theme header states at 320/375/414/430/600/760/768/834/1280 px in both themes passed with visible names, 44 px targets and no overlap or page overflow. Measured heights are 233.55 px at 320,181.55 px at 375–430,129.55 px at 600,140.5 px at 760–834 and 92.5 px at 1280. The existing compact-header check now uses measured bounds with 2.5–3.5px headroom and explicitly requires visible brand/tool names, Theme label and a visible native select; its original keyboard, focus, control bounds and coordination assertions remain. The technical reviewer independently accepted that contract change.

The actual scope/footer contrast is 4.528:1 on the effective light background and 9.399:1 in dark; source token declarations alone were not used as proof. Asset/no-script tail verification confirmed HTTP 200, manifest byte counts and SHA-256 for Apache text and provenance, plus the four quiet footer links, preserved companion section and commit/date in App status. Two enclosing reviewer commands had harness-only name/file matching errors after their functional matrices; their exit 1 results remain recorded. The corrected unfinished tail passed exit 0. Evidence: `/tmp/arm-style-technical-review/` and `/tmp/arm-style-technical-tail.log`.

No independent review finding remains open. The complete `npm run check` command is the final acceptance gate. Its unit and browser outcomes are recorded separately in the pull request and CI; the focused reviews above do not substitute for a full run.

The final engineering-note review narrowed the 44 px target claim to shared shell controls (unchanged instructional views retain their earlier geometry) and distinguished retained Source/Where next/companion destinations from the two newly surfaced licence/report targets. Both clarifications are documentation-only.

## Final acceptance findings

The first local `npm run check` attempt passed formatting, copyright, platform integrity, types, all 224 unit files / 4,041 unit tests and the build. Its browser run was interrupted after two timeouts: 710 passed, 13 skipped, two failed and two interrupted; 833 were not run. The original traces were retained. Both exact failed cases passed unchanged in an isolated single-worker rerun. This is an incomplete full local check, not a full acceptance pass.

The two initial complete CI runs on `bcb2e79` each passed 1,537 browser cases, skipped 18 and failed the same five assertions. Two found a real readability defect: the companion paragraph moved to Where next had an unrestricted 140-character measure. Its width is now limited to 70ch; the original design assertion remains unchanged. Three asserted the old 132px icon-only phone header height. They now use the independently measured 184px bound for the named-tool header at 375 px, retain the 96px desktop bound and explicitly require visible tool/Theme labels. Original flags, keyboard and navigation assertions remain.

An additional independent native-pointer probe found that the fixed desktop tool-panel top overlapped Theme when the header wrapped at 768 px. The shell now measures the actual header height with a cleaned-up ResizeObserver and uses that value only to position the nonmodal desktop panels. No model state or storage changes are involved. The independent recheck passed six desktop states (768/834/1280px, both themes) and four phone states (760/375px, both themes): actual native Theme clicks, whole-control visibility, Calculator/Reference switching, Calculator 42 and model step k1 retention, live resizing, phone native-modal bounds and Escape focus return. Four corrected 768 px screenshots were inspected. An initial combined reviewer harness assumed fresh state for the second theme; its failure remains recorded separately from the corrected fresh-context commands, which both passed. Evidence: `/tmp/arm-panel-placement-final-light/` and `/tmp/arm-panel-placement-final-dark/`.

Final-head required CI and publication remain the acceptance gates; initial failures and focused checks must not be described as a full pass or as proof of learning effectiveness.

The final local full-check attempt again passed formatting, copyright, platform integrity, types, all 224 unit files / 4,041 tests and production build. Its browser run was stopped after two timeouts during a recorded host stall: 199 passed, 1 skipped, 2 failed, 2 interrupted, 1,360 not run (exit 130). Exact failed scenarios were the dark outline for lessons 1–16 and the light registered-flags reload case. Original evidence is `/workspace/arm-style-final-interrupted-evidence/` and `/workspace/arm-style-final-complete-check.log`. This attempted repository check remains incomplete; unchanged isolated reproductions and the exact final-head remote full check are reported separately. No test timeouts or retry counts were increased for these interrupted runs.

Both exact failed scenarios passed unchanged in a single-worker desktop rerun: dark outline lessons 1–16 in 22.3 s, light registered-flags reload in 6.3 s; 2/2 passed in 36.9 s. The full local attempt is still incomplete. The 16-case affected browser suite passed separately, including all original CI assertion failures and the desktop tool-panel regression. Exact final-head full CI remains the merge gate.
