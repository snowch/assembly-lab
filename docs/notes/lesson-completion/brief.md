# Learner-controlled lesson completion

User accepted: a Mark lesson complete control beside the next-lesson link, a tick on completed
lessons in the course plan, Continue learning to the first unfinished lesson, and undo. Save in
this browser on this device and preserve through updates. No exercise requirements, automatic
completion, percentages or account sync. Reading-only lessons count too.

## Checked context and implementation boundaries

- App.tsx owns navigation and uses updateStorage() for lesson work and reload safety.
- FrontPage.tsx lists every lesson using PLAN/LESSONS, including modules with a single lesson.
- App navigation sorts by module then lesson order. Use the same order for first unfinished.
- platform/lesson-runtime LessonStore stores challenge and interactive state in a per-lesson JSON
  blob. Its verified exercise completion is separate from the requested self-declared reading mark.
  Do not modify platform/, change grading, set challenge passed, or overwrite a live LessonStore.
- Use the existing storage adapter and update safety. Version and namespace manual progress;
  avoid a shared read-modify-write array that can lose marks made in another tab. Keep existing work
  intact. Handle corrupt stored data, unknown lesson IDs, unavailable/quota storage, reload,
  offline use and coordinated service-worker restarts.
- Manual completion is independent of question checks, reading, scrolling or Next navigation.
  It must be reversible without clearing answers. A keyboard user keeps focus after toggling.
- Plan ticks need an accessible text equivalent. Keep all lesson links usable and avoid adding
  heading clutter. The course-plan and lesson-footer views should update after a change in another
  tab. First visit retains a sensible start action; all marked complete has a truthful end state;
  newly added lessons become unfinished without clearing older marks.
- Persist only an explicit user mark. The optional related-projects directory is not a lesson.

## Ownership and verification

Separate GPT-6.1 Medium drafting; High implementation; High learner review and Extra High technical
review per docs/authoring.md. Root owns educational tests, integration, CI and merge. Implementation
agent owns apps/course source and unit tests. Preserve unrelated module-12/pi-sources-brief.md.

Check completed/undo/first-unfinished/all-done, reading-only lesson, exercise independence,
refresh/offline/update preservation, two tabs, malformed state, persistence failure and phone/desktop
light/dark layouts. Record actual results separately from failures and review limitations.
