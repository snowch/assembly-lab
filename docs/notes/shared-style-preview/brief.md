# Shared style preview

The user approved a separately hosted preview of the real course with Current/New controls, generated lesson outlines, screenshot comparisons and regression checks. This is a draft branch, not approval to replace the published course.

Checked facts and contracts:
- Normal builds must not expose the comparison controls or apply the new skin, including when a URL or saved preference requests it.
- Preview enablement is the exact build-time setting `VITE_STYLE_PREVIEW=1`; root hosting uses `BASE_PATH=/`.
- The same lesson and interactive components stay mounted while switching. Hash routes, model execution, graders, hints and saved work keep their established behaviour.
- Standard headings have `section-${kind}` IDs. The flags lesson uses its own seven real section IDs.
- Desktop outlines and collapsed mobile outlines come from those sections. Selection preserves routing, focuses the heading and closes the mobile disclosure.
- The shared appearance borrows the approved flags page's header, typography, surfaces, spacing and card treatment. Diagram roles retain their existing semantics.
- A separate private Site origin isolates browser progress and service-worker caches. Its identity is saved in `.openai/hosting.json`; do not create another Site.
- The 60px preview toolbar reserves space above the app. Section margins account for that strip and the sticky header; root scroll padding must not double the offset.
- Required explanations and challenges remain available. Navigation is not a completion mark.
- Browser checks cover all 80 published lessons plus the course front/next pages, at375/834/1280 in light/dark, both styles. Deep checks cover grade gates, calculator scratch across style changes, persisted answers, keyboard/focus and offline reload.

The eight interface strings were drafted by the separate preview_copy agent before workspace replacement. The earlier implementation and review files were lost with that workspace. Recovered code requires fresh independent browser review and complete checks; previous observations are historical evidence only.
