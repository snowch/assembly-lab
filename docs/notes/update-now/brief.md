# Explicit offline updates

Copyright © 2026 Christopher Snow

The user requested an **Update now** button instead of closing all app windows.
This authorises an explicit reload of the course's open tabs after preparation.
The earlier offline brief records the original automatic waiting behaviour;
its close-all-tabs requirement is superseded for this explicit action.

Checked starting facts:

- The worker installs a complete, integrity-checked release before waiting. The
  active worker serves an immutable cached copy. Its scope isolates this course.
- ChallengeRunner and LessonStore write artifacts and interactive slots synchronously
  when the learner changes them. Browser storage can silently fall back to memory.
- Storage is one JSON value per lesson. Tabs can overwrite the same lesson key;
  update preparation must not overwrite another tab's newer value to force a save.
- Service-worker activation can claim open clients. A controller change can reload
  those clients without trying to close browser tabs or changing their lesson URLs.

Required behaviour:

- Offer the action only for a downloaded waiting update. Explain that all open
  Assembly Lab tabs reload. Keep preparation status accessible while controls lock.
- Require each in-scope tab to confirm that its changed exercise keys match durable
  storage. If any tab cannot confirm, or does not respond, leave the release and
  current edits open. Refuse unknown older clients rather than forcing a reload.
- Coordinate requests so failed or superseded attempts cannot unlock another update.
  Keep the ordinary close-all-tabs activation fallback and avoid first-install loops.
- Preserve edited challenge text/answers, saved work, URL and theme. Do not promise
  to persist transient selections that the course does not ordinarily save.
- A complete downloaded update can activate offline. Failed or incomplete downloads
  must preserve the old release. Other apps and their caches must remain untouched.
- An existing cached version without this button still needs a one-time close and
  reopen to load the release that introduces it. Never bypass its lack of readiness
  acknowledgement by discarding an old tab's work.

Use CLAUDE.md and docs/style.md. Separate wording draft and independent source and
built-browser reviews are required. Browser checks must use real worker installation,
waiting and activation, not only mocked ready/update labels.
