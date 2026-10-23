# Whole-course review of learning load

User request: review the whole course for places where learners must handle too much at once. The user supplied a phone screenshot with a paired whole-function listing, result, register state, open read/write explanation, next-instruction question and choices. Assess the instructional sequence as well as the interface. This is a review and recommendations task; do not change course content, simulator, tests or production UI.

Review snapshot: main commit f1fdf35eeee46f16edcf92e7738fe3dc77cf5583, 26 lessons in course order (Modules 0–12 and optional A). Use the actual registry and parsed data, not historical review conclusions. Prior English/clarity reviews address different questions and are background, not evidence that the learning sequence is appropriately sized.

For each lesson, assess independently:

1. What does the learner already know from the stated entry requirements and earlier lessons? Which mechanisms are genuinely new here?
2. What is the first task asking the learner to do? Does it require several unpractised mechanisms simultaneously, or combine already practised skills appropriately?
3. Do several visible representations, controls or tasks compete for attention? Separate interface density, prerequisite gaps, duplicated explanation, and excessive novelty. Figure count or page length alone is not proof of overload.
4. Are worked example, learner attempt, feedback and next task clearly separated? Is the answer disclosed before a meaningful attempt? Do not treat a taught rule being applied to different inputs as a spoiler.
5. Would a smaller first example, staged reveal, simpler initial state, delayed secondary representation, or later synthesis help? Give the smallest effective direction. Do not recommend one opcode per lesson universally: compare/select, loads/addresses and calls/stack often need related mechanisms together once their parts are familiar.
6. Identify at least one treatment worth keeping where justified. A long advanced capstone is not automatically overloaded.

Each independent reader reviews ONE assigned lesson as a learner with all earlier lessons and none later, reads its ten sections and relevant view implementation/recorded programs, and checks the built page at phone (375px) and desktop (1280px), actual light and dark themes. Inspect initial and representative meaningful post-interaction states, normal disclosures and prediction gates; list precisely which states were exercised and which were source-only. Use fresh browser contexts and do not send code to external compiler services. Review instructions for prose/style/visual-language apply; do not rewrite learner prose or reveal challenge answers in notes.

Record per lesson: title/module/order, prerequisites, newly introduced mechanisms, findings with severity, exact quoted label or source location, the learner's competing tasks, reproducible state and evidence, recommended teaching sequence or smallest interface change, keep strengths, and limits. Severity: high blocks a reasonable first attempt or requires several new mechanisms before practice; medium creates substantial avoidable tracking/switching; low is a local presentational obstacle. Explicitly separate confirmed findings from design recommendations and unsupported suspicions.

The managing review will inventory all lessons, combine recurring patterns, obtain an independent sceptic/technical challenge of findings against prerequisites and actual views, and retain rejected findings with reasons. Produce a course-wide coverage map and ranked redesign recommendations. No implementation or merge is authorised by this review request.

Shared built preview: http://localhost:4210/assembly-lab/#/lesson/<id> (available after build). Parsed data: /tmp/course-load-review/lessons.json; structural inventory: /tmp/course-load-review/inventory.json. Own context/script/screenshot filenames must include assigned lesson id. Do not rebuild or edit shared app files. Write only the assigned reader note.
