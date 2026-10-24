# Remove the obsolete arrival guidance

Independent learner and technical review, 24 October 2026. Reviewer did not author the deletion
or edit product files. Scope: the user's requested paragraph and four-link list in Putting it
together, its two canonical prose records, and the obsolete test assertions that required it.

## Verdict

No remaining finding. The deletion removes migration/arrival guidance, not a technical fact or
prerequisite definition. The retained paragraph, “You have practised addition, a function call
and return, subtraction, and instructions in sequence. Now combine those mechanics”, joins the
preceding Fundamentals lessons to the complete-function activity without redirecting the reader.
No replacement prose or new terminology was introduced.

The four earlier lessons teach the operations and conventions assumed here. The synthesis page
still states the four-argument register mapping and its compiler qualification; the walkthrough,
repair, missing-return experiment and final trace remain unchanged. Source inspection confirms
that both canonical records match the single deleted block and the tests continue to check
course order, course-plan entries and ordinary next-lesson navigation.

Rejected potential finding: removing in-prose links makes the required lessons undiscoverable.
The course plan still contains all five Fundamentals entries and the normal previous-lesson link
leads to Instructions in sequence. The removed block duplicated that navigation. Its removal was
explicitly requested by the user.

## Built-page check

Final build at http://localhost:4330/assembly-lab/#/lesson/meet-the-machine, Chromium at
375 and 1280 CSS pixels, both actual light and dark themes. In all four contexts: retained intro
present; quoted arrival guidance and motivation links absent; complete paired walkthrough visible
and directly usable in its initial state; normal previous/next links present; Back to the course
plan opens the plan with all five Fundamentals entries. No page-level horizontal overflow or
page errors. The removed paragraph carried no new prerequisite term; the technical assumptions
remain those of the preceding four Fundamentals lessons.

Evidence: `/tmp/backlinks-reader.mjs` and `/tmp/backlinks-reader-report.json`. A preliminary reader
script clicked a surrounding container and read plan links without waiting for navigation, producing
an empty-list assertion failure. The final script targets the actual Back link and waits for the
plan; all four contexts passed. No product change or relaxed product assertion was involved.
This narrow review did not rerun challenge grading, model/hardware comparisons or the full suite;
those semantics and interactions were not changed by the deletion.
