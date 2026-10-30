# Function context before parameter explanations

User request: introduce km_to_service with its C signature before explaining the parameters,
then use bullets for each input. Keep the example call and tracing task afterwards.

Checked facts from content/lessons/meet-the-machine.listings.ts (KM_TO_SERVICE):
- int result; int parameters service_at, odometer, trip_so_far, planned, in that order.
- The result subtracts the initial odometer reading, current-trip distance, planned-trip distance
  and 50 km reserve from the service threshold.
- The initial odometer reading is before the current trip; it excludes trip_so_far.
- Existing lesson mapping is w0 through w3 in parameter order, result in w0.
- The compiled listing has four subtractions and ret. Keep the exercise and answers unchanged.

Scope: rendered challenge introduction and canonical docs/notes/module-0/prose.md only.
No new API or simulator feature. Check the built introduction, exercise and phone wrapping in
both themes. Existing prose synchronisation and lesson tests cover the content contract.

Separate passes: GPT-6.1 Medium drafting, High learner review, Extra High technical review,
as recommended by docs/authoring.md. Reviewers must not edit the implementation.
