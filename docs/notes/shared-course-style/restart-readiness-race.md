# Restart readiness during a worker status request

Copyright © 2026 Christopher Snow.

## Observed failure

The full header-label inventory exposed a phone restart race after preparing release B while release A remained open. The fixture deleted B’s saved `native/Makefile`, then clicked Restart to update. A concurrent real inventory refresh cleared the prepared-version ref while the restart handler awaited OFFLINE_STATUS. The handler treated that null ref as a newer release. It displayed the newer-version explanation while Update offline copy remained offered. A stayed open and its complete offline copy remained usable; the unchanged test correctly expected an incomplete-download explanation.

The original trace and interrupted log remain retained separately. The same eviction scenario passed during recovery, which does not invalidate the observed race.

## Checked correction

Capture the requested target before the asynchronous status request. Reject an actual worker/runtime change or a different non-null prepared target as a changed release. A refresh that withdraws readiness for the same target instead reports an incomplete download and stops before ACTIVATE_UPDATE. The handler must not revive a removed or cancelled copy through the worker’s legacy activation fallback. If readiness remains valid, the existing worker still verifies the complete replacement before committing it.

The managing session independently reviewed and approved the exact application patch, including the null-target stop and genuine newer-worker rejection. No worker activation guard or download manifest is weakened. The existing incomplete-download assertion remains intact.

## Readiness during a newer preparation

The first positive run passed eviction and removal, then exposed a second real UI defect during B-to-C recovery. While C was saving, App status still displayed B’s downloaded-ready explanation and an enabled Restart button. The header combined Updating offline copy with downloaded-ready text. Clicking that stale action was safely refused, and C’s recovery marker never appeared.

The independent review confirmed the captured states and approved a small UI correction: restart-ready prose and actions require a prepared target and no active save. The header describes saving before consulting an older pending target. This changes displayed capability while preserving complete A/B caches and the existing transfer protocol.

The replacement regression restores verified B through a real focus/status refresh, removes only a cached C index if present, and delays C’s genuinely changed index response. It waits for a new real HTTP index request before checking progress, the absence of Restart/ready prose and the exact saving description. It retains the existing completion bound and final C marker assertion. Mid-transfer screenshots provide final independent visual evidence.

## Deterministic browser coverage

A MessagePort bridge holds one actual waiting-worker OFFLINE_STATUS response without changing its payload. Other status requests continue to the real workers. While that reply is held, the cases delete a prepared asset, remove the real scoped offline copy, or install a genuinely newer waiting worker. A real focus refresh then updates the page’s native inventory before the original response is released.

Each case checks the appropriate refusal, the unchanged open release and zero activation requests. It then restores the normal message path, prepares the applicable release and completes the actual restart. No readiness flags are fabricated. The removal command represents another window acting while the requesting page is paused. Original newer-release, cancellation, removal, saved-work and corruption scenarios are also rerun.

## Verification

The six held-status regressions fail against the pre-fix bundle, demonstrating incorrect or missing refusals. The first positive run passes eviction/removal but exposes stale prepared readiness during C recovery. After both reviewed corrections, all six pass (41.9 seconds), including exact typed explanations, no activation and actual B/C recovery. The final phone and desktop saving-state screenshots were independently checked: measured byte progress and Cancel remain visible; Restart and downloaded-ready promises are absent.

Final static/types/build and app-course unit checks pass. All new race cases, header cases, corrected theme cases and other offline scenarios pass in the affected set; one direct-worker RPC timeout in that set did not reproduce in three unchanged isolated runs. Original failed and interrupted results remain retained. Detailed full-inventory/recovery/rerun accounting is in the [header-label adoption note](header-labels.md); no successful completion of the interrupted full command is claimed.
