# Independent technical review: Update now

Copyright © 2026 Christopher Snow

Reviewer: separate `boot_technical` agent. Read the written brief, worker and React
changes, storage wrapper and tests, existing runtime storage/ChallengeRunner/theme
behaviour, offline cache implementation and real-worker lifecycle fixture. The reviewer
does not edit application code or tests. Earlier focused test results supplied by the
author are supporting context, not this reviewer's independent execution evidence.

## Findings

1. **High, corrected: verification before all tabs lock permits a cross-tab overwrite race.**
   The initial one-pass `PREPARE_UPDATE` locked and checked each tab separately.
   Tab A could confirm its latest lesson value, then tab B could change that same
   durable lesson key before receiving its own preparation message. Both could
   acknowledge even though A's previously confirmed value no longer matched storage.
   This violates the changed-key durability requirement and risks losing A's work
   on reload. Direction: lock every client first, then verify durability in another
   round while all remain locked, retaining worker/request identity checks.
   The author accepted this finding and added `VERIFY_UPDATE`; final verification
   of that correction is recorded below when complete.

2. **High, corrected after independent reproduction: a superseded waiting worker strands passive
   tabs in the interaction lock.** Only the initiating tab has the 15-second update
   watchdog. A second participating app tab locks on preparation without its own
   recovery when the waiting worker becomes redundant. If a newer downloaded worker
   replaces that waiting worker during preparation, its cancellation messages may
   never arrive. The initiator eventually unlocks, but the passive tab remains inert.

   Independent real-worker reproduction used a temporary copy of the existing HTTP
   deployment fixture, with no application or test changes:

   - Opened two controlled app tabs plus one in-scope legacy document without an
     update-message handler.
   - Published waiting release B and selected **Update now** in the first app tab.
   - Waited until the second app tab's main became inert.
   - Published release C and called the real registration update from the second
     tab; C installed and superseded B while B awaited the legacy acknowledgement.
   - After 17 seconds the first tab was unlocked and displayed the tab-response
     error. The second tab was still inert, had no error and still displayed the
     preparation status. The probe returned exit status 0 and captured this state.

   Direction: recover participating clients when their exact prepared worker can no
   longer activate, and keep request/worker identity checks so stale recovery cannot
   unlock preparation for a different update. A timeout must not simply unlock a tab
   while an uncancelled worker can still activate and reload it.

3. **Medium, corrected: the readiness check omits a theme held only for the current visit.**
   The brief includes theme preservation, but `updateStorage.saved()` tracks lesson
   keys only. `useTheme` catches storage failures and deliberately retains a theme
   only for the visit. If theme persistence fails and no exercise key changed, the
   empty lesson-edit map reports readiness and the update reload can reset that
   theme. Direction: include current-theme durability in readiness or explicitly
   narrow the promise; this does not replace the exercise-data safety requirement.

## Final source assessment and correction checks

The final candidate uses two distinct rounds: every client first locks its controls
before acknowledging preparation; all clients then verify durable work while those
locks remain in place. The worker checks its complete cache again and rescans clients
before committing activation. This closes the accepted between-acknowledgements race.
The storage wrapper compares the actual last-written values without forcing writes
over another tab's values; failed durable writes and cross-tab conflicts veto reload.

Each participant now watches its exact prepared worker for the terminal `redundant`
state, cancels its staged handoff and unlocks only the matching request. Participant
and initiating timeouts request cancellation; they do not blindly release the lock.
Cancellation is accepted only from the owner or a participating client with the exact
request ID. The worker reserves the request synchronously, so cancellation cannot
overtake an asynchronous validation step, and ignores cancellation once activation
is committed. Tests retain rejection of stale IDs and nonparticipants and add early
and late cancellation cases. These changes address supersession without permitting
a late cancellation to unlock a different or committed update.

Theme preservation uses a per-tab session handoff. Its initial read is repeatable
through Strict Mode, and its committed effect consumes the handoff. Failed/cancelled
updates clear staged handoffs so ordinary later reloads cannot restore stale choices.
When session storage cannot confirm the handoff, readiness conservatively vetoes the
update, even if ordinary theme persistence might work. That is a safe limit rather
than a promise to use a local-storage fallback. The recovery label now says “Some
changes” rather than falsely attributing every readiness failure to exercise edits.
The hook's layout-updated callback references retain the current theme without
restarting the worker protocol. In-progress input-method composition also vetoes it.

The cache still installs a complete integrity-checked release before waiting, and
cleanup remains scoped to this course. First-install claim does not trigger a reload;
subsequent controller changes reload once. Older unknown tabs cannot acknowledge and
therefore block explicit activation. The normal close-all-tabs fallback is retained.
Transient UI selections that the course does not save are not promised preservation.

### Independent verification

On the final candidate, independently ran the affected worker and storage files:

```sh
npx vitest run apps/course/offline/plugin.test.ts apps/course/src/update-storage.test.ts
npx vitest run apps/course/src/theme-update.test.tsx
```

The first command returned exit status 0 with 22 tests across two files; the second
returned exit status 0 with three tests. Read the test assertions as well as the output:
they cover both durability rounds, superseded/cancelled requests, the commit boundary,
cache disappearance, fallback storage and Strict Mode/cancelled theme handoffs. No
existing assertions or timeouts were weakened to obtain these results.

Repeated the earlier three-worker real-browser reproduction with the final production
build. Both participating app tabs now unlocked and showed the newer-update notice
when C superseded B. After closing the unresponsive legacy document, retrying activated
C in both tabs. This directly verifies the formerly stranded passive participant.

An independent offline-update probe edited unsubmitted assembly-course C source in one
lesson and an answer in another, selected dark and light themes in the two tabs, downloaded
a waiting release, then disabled the network before activation. Both tabs loaded the new
release, retained their distinct themes, artifacts and exact lesson URLs, and each
navigated exactly once. The corrected probe returned exit status 0. The initial combined
probe had already verified supersession and retry but then exited 1 because its theme
selector used an overly strict accessible-label match; correcting that probe's selector
required no application change. This failed attempt is not recorded as a full pass.

Read the final engineering changes to `docs/offline.md`, `README.md` and the current
validation history. Their activation, safety, preservation and one-time old-client
rollout explanations match the code. The history separately records interrupted and
failed authoring checks and leaves the full check pending. Full-suite and final CI
results are the managing session's responsibility; this reviewer ran only the affected
checks above and the described real-worker probes. No remaining technical blocker.

## Final full-check record confirmation

Independently read `/tmp/update-now-check-final.log`: all 141 unit files / 2799 tests
passed, followed by 1075 browser tests passing with 23 skipped in 41.7 minutes and
the final “All checks passed.” marker. The managing session observed command exit 0.
The earlier `/tmp/update-now-check.log` stops after entering the unit stage, without
a completed unit or browser summary; its interrupted exit 130 remains separately
recorded rather than being replaced by the later passing result.

The final validation note accurately distinguishes this complete local check from
the interrupted first run, focused reruns and future GitHub CI. Current HEAD is
`8e6adfc21787dcd993c09dd11658e982945b9dec`; the pending changes are README/offline
documentation and review records, with no pending application or test changes.
No remote CI success is claimed. This confirmation edited only this review note
and ran no additional tests.
