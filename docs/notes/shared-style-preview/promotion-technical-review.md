# Independent technical review: production promotion

Reviewed 12 November 2026 under `CLAUDE.md` and the production promotion brief. The reviewer did not author product or test changes. Verdict: no technical blocker found in the reviewed candidate. Merge still requires the managing session's full check on stable committed source, the independent learner review and the requested deployment verification.

## Candidate identity

The real browser target was `http://localhost:4462/assembly-lab/`, the ordinary production base path. Its footer and release metadata report `26a742d932e64bb864c1c927c13cec8c658dc596`, the preceding commit. The reviewed candidate also contains the uncommitted promotion, including the v4 status-panel and note fixes; the footer alone does not identify all reviewed source.

Its release build ID was `a35d10f08ff1a276938aba9c3901249bcb16f8a0b80c10f2546c73a05b64a32a`. The served `release.json` and `apps/course/dist/release.json` both had SHA-256 `6324eac8c45467b7502f9bfb6d1f3fd7dbee85926afd600f480bcfe61220c264`, checked before and after focused tests. This also ties the isolated deployment fixtures, which read course `dist`, to the candidate under review.

Source fingerprints at review completion:

| File | SHA-256 |
| --- | --- |
| `LessonLayout.tsx` | `a0fd22f6fdfca19cb3aac350c4227224cc3dbff1f1cea62976ac9d35d3b2599d` |
| `course-layout.css` | `1375ba285f4d28935652bee2fe96b0b287d79887fc172d0e348269462ac18c29` |
| `App.tsx` | `c6d103cab4aa5fff6fc818f645a7ddebeab40bcbd3b47d35784cea32c0d6a70d` |
| `static-page.ts` | `b6c765562f4e354e2c8212fa4bd1c296abeb586218d998c4d54c8861fe1ae929` |

## Source assessment

Read the promotion brief and validation record; reviewed the current production diff, complete layout component and stylesheet, App/static shell integration, theme implementation and affected tests. No platform, teaching data, model, grader, storage or update implementation changes are present in this promotion diff.

- `LessonLayout` is unconditional for real lesson routes. It derives entries from lesson sections and the seven exported flags records. It retains heading focus, prevented hash replacement, mobile closure, reduced-motion handling, current-section tracking and the independently verified bottom-clamping correction. There is no appearance switch that could remount lesson work.
- Preview components, build flag, style preference reader/writer, toolbar, hosting identity and comparison-only scripts/workflow are removed. Old preview query/storage values are ignored. Historical review records remain. Production tests deliberately seed the old preference and URL to guard this migration.
- Shared compact header rules now live in `course-layout.css`, imported after the teaching styles. The static header uses the same brand and compact status disclosure. Removed flags CSS consists of former shell/body rules; flags teaching layout, control and semantic colour rules remain. The shared canonical palette is the approved New palette, including System dark mode.
- Removed-strip offsets agree: target margins 156→96px, outline top 172→112px, observer threshold 180→120px and outline viewport allowance 200→140px. Header top is zero. Root scroll padding is not introduced. The heading border/padding correction remains, leaving one section divider.
- The status-panel fix sets its contents to 1rem independently of the compact status button. The completion-note fix bounds its measure to 65ch. Neither changes a minimum-size or reading-measure test threshold. Browser measurements below confirm the fixes act on the rendered content.
- The calculator test retains the original explicit 4/8/16 column checks. It additionally requires 16 columns in the actual 760px reading column, then widens only the test host to exercise the existing 32-column breakpoint with the same mounted calculator and real CSS sizing. It does not force the calculator grid, change model behaviour or weaken the no-overflow assertion. The phone skip retains its original fine-pointer rationale; touch targets remain covered by phone preset checks. This is a justified correction of the former wide-host assumption.
- Flags navigation assertions now address the visible shared outline, retaining route and current-entry checks and adding mobile-disclosure closure. The expected body colour changes to the canonical course colour while the flags semantic ink checks remain. These changes test the intended production design rather than suppressing a teaching-state regression.
- The new production layout tests retain the prior meaningful assertions: real outline IDs/titles, theme rendering, absent preview controls/state, first/final keyboard navigation, focus/header clearance, mobile closure, no horizontal scroll, page errors, bottom selection and restored work. DOM-anchor queries correctly inspect `aria-current` after mobile disclosure closure. They do not mistake navigation for completion.

## Fresh browser evidence

An independent custom script completed 48 route/width/theme states: front page, where-next page, register widths, one addition, memory and flags; 320/375/834/1280px; light/dark. Desktop used a 1200px-tall viewport to retain the original bottom-clamp case. The script checked actual canonical body colours, no preview state/controls despite an old Current URL/preference, no horizontal overflow, header y=0 and compact height, a contained status popup, keyboard skip focus and unchanged hashes. Status content computed to 16px and its rendered descendant text stayed at least 11px. Lesson completion-note measures stayed below the unchanged 85-character estimate.

First/final outline entries were activated with keyboard Enter on every lesson state. Focus remained on the correct h2 below the sticky header, hashes stayed on their lesson, final entries retained `aria-current`, mobile disclosures closed, and returning to top restored the first highlight. Flags showed seven shared entries and hid its duplicate original sidebar. Standard sections retained one divider. System light→dark followed the media change; explicit Light overrode dark System and selecting System restored it.

Screenshots were visually inspected for 320px/light register widths and 1280px/dark memory: header, outline, typography, dividers and content were contained and legible. A separate eight-state memory check confirmed the complete numbered C and instruction panes remain beside each other at all four widths in both themes, with source-line tags and contained scrolling. It checked eight rendered paired listings, with no page overflow.

The standalone no-JavaScript check found one compact brand/header, usable native status disclosure, 18 static module records and no phone page overflow. The normal embedded/static status tests below also passed.

Independent focused Playwright commands used an external temporary config to serve the existing immutable candidate, with original desktop and phone viewport/touch settings, one worker and zero retries. They did not overwrite course `dist` or the preview candidate:

| Focused command scope | Result |
| --- | --- |
| Complete flags browser tests plus calculator column breakpoint test | Exit 0: 27 passed, 1 intentional phone skip |
| Production layout work/grade/hint/note persistence, bottom navigation and compact-header skip tests | Exit 0: 8 passed |
| Embedded/static status, offline compilation/grading/restored source inputs, and multi-tab detect/download/defer/restart update flow | Exit 0: 8 passed |

An additional four-state browser check explicitly exercised the remaining result/overflow tabs, both positive/negative controls, both bit readings, optional carries explanation, nested full-bits disclosure and its saved restoration, and enabled next/previous practice navigation after grading. It passed at 375/1280px in light/dark, without errors or overflow.

The flags run exercises both themes on desktop/phone: result/overflow/example controls; miniature grading, intent, restore/reset; prediction commitment and gate; signed/unsigned readings; every real arithmetic column, group/all/back/reset controls; practice grades/hints/aggregate gate/edit invalidation; migration of existing work; and rejection of presentation-only or malformed stored completion. Keyboard radio/theme/course navigation and shared hints also pass. The production persistence tests preserve input DOM identity across outline navigation, scratch calculation across navigation, grades/hints/notes across reload and answer state after leaving/returning. Ordinary reload still resets independent calculator scratch as before.

The offline/update run exercises actual compiled source inputs and grading without network; saved source/answers and per-tab theme survive coordinated offline restart, only one reload occurs per app tab, sibling data remains intact, and App status stays usable in embedded, hydrated and no-JavaScript states. Offline/model implementation was unchanged by the promotion.

## Accounting and limits

The managing session's preliminary command remains a failed result: 27 failed, 59 passed, 2 intentional skips, exit status recorded in the promotion validation note. Its smaller status text, overly wide completion note and old 32-column host assumption were assessed independently above. The later passing focused runs do not change that command's outcome.

The independent custom 48-state browser script reached its final no-JavaScript assertion, then exited 1 because the reviewer queried the app-only `.plan-module` class in the static cover. The static cover uses generated list markup. A corrected standalone DOM check passed with 18 module records. The prior route assertions and System checks had completed before that harness-only failure; it is not represented as a successful command or a product defect. The additional flags-control harness first reloaded immediately after opening the nested bits disclosure, racing its native `toggle` save callback. A diagnostic run confirmed the saved open state and successful restoration after the callback; the corrected harness waited for the saved state before reloading and passed all four width/theme states. These two custom-script failures remain failed attempts, distinct from the three passing Playwright commands.

This review does not claim a completed full repository check, a final committed-source check, all 80 routes in every state, every offline failure/recovery permutation, physical-board/native tool validation or public deployment verification. Those remain the managing session's recorded checks. Only this independent report was written by the reviewer; no product or test source was edited.
