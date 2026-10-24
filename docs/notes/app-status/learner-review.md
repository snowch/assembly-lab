# App status: independent learner review

Reviewer did not draft or implement the UI. Scope: app-level status in issue #35, not lesson content. Read AGENTS/CLAUDE, the issue, the checked brief, and both style closing passes.

## Browser evidence

Initial review used production build `de5a7f959ee8a56129538ccb0289ac964a8cd31d81062d297d43842d7261e736`. The final built checker repeated the UI/lifecycle matrix against `6f7f767345c8b88433c4749d1e088d1da88c0acdc03fb0fa30f397413a0039e5`, embedded source `ffe0f81`, using Chromium and a separate local HTTP fixture. The fixture serves real production files; the next release changes HTML and a native example download, then uses the production release generator to create coherent hashes, worker and metadata. No worker, arithmetic result or percentage was simulated.

`node --experimental-strip-types /tmp/status-learner-review.mts` and the final rerun `/tmp/status-learner-review-final.mts` completed successfully at 375 and 1280 pixels, each in actual rendered light/dark themes. The phone contexts enabled touch; all contexts requested reduced motion. Checked:

- App status on front page, a lesson deep link and an unknown route, including fresh offline navigations after a save.
- Current release, explicit whole-course save, Available offline, published update detection, explicit preparation, Update ready, Later, and explicit restart. The running source identity and displayed Build hash stayed with the loaded release until restart; saved sentinel content and per-tab theme survived it. The changed asset bytes have a distinct displayed Build hash even when the source commit is the same.
- Version and Offline access are separate. While disconnected, the panel showed Cannot check for updates and Available offline together, without implying freshness from readiness.
- Closed summary retained Update ready. The final build exposed the polite closed-state status “App status: Update ready. Available offline” in the accessibility tree. Escape and Later closed the panel and returned keyboard focus to the summary. Enter opened the summary. Removal confirmation focused Keep offline copy; keeping it returned focus to Remove offline copy.
- Initial buttons measured 44 pixels high with 18-pixel text. No document overflow or page errors occurred. The panel's own scrolling kept its content within the screen.
- JavaScript-disabled static cover retained the running identity, App status disclosure, and the explanation that checks/downloads need JavaScript. With service workers unavailable, the online page retained App status and explained Offline access unavailable.

A separate progress/storage probe (`/tmp/status-learner-progress.mts`) completed successfully, and repeated successfully against the final `6f7f767…` build (`/tmp/status-learner-progress-five.log`). It held an actual asset response, observed offline progress at 220,533 / 2,388,139 bytes and update progress at 2,387,021 / 2,388,212 bytes, cancelled and resumed an incomplete save, and made CacheStorage unavailable in the real worker. The UI then showed Offline access unavailable and retained the online-use explanation. On the final build, observed real offline progress at 95,965 / 2,392,817 bytes and update progress at 2,391,699 / 2,392,890 bytes. Its accessibility snapshot exposed named Version and Offline access regions, status roles and labelled progress bars. This checks browser accessibility structure, not spoken output from a screen-reader application.

Evidence: `/tmp/status-learner-review.json`, `/tmp/status-learner-review.log`, `/tmp/status-learner-review-final.json`, `/tmp/status-learner-review-final-five.log`, `/tmp/status-learner-corrections.json`, `/tmp/status-learner-corrections-five.log`, `/tmp/status-learner-progress.json`, `/tmp/status-learner-progress.log`. Before screenshots from public `ffe0f81`: `/tmp/status-before-375-light.png`, `/tmp/status-before-1280-dark.png`. After screenshots: `/tmp/status-after-{375,1280}-{light,dark}-open.png`, corresponding `-closed-ready.png`, `/tmp/status-after-375-dark-saving.png`, and JavaScript/service-worker fallback images. Inspected phone light/open, desktop dark/open and phone dark/closed-ready directly.

The earlier preliminary probe `/tmp/status-learner-initial.mts` failed waiting for Later in the first evolving build. It is not a passing result. It predates the coherent active-worker staging build reviewed above; no claim is made that this probe isolated its failure's cause.

The intermediate four-context rerun on `72a79b3e…` exited 1 waiting for the replacement HTML marker in its third context. It ran while worker revisions were being coordinated, so it does not isolate a cause. This failed command remains separate from the final four-context pass.

## Findings

1. **Medium, keyboard focus after successful removal, corrected and verified.** After confirming **Remove offline copy**, the panel says **“The offline copy has been removed. Your work is kept.”** The active element becomes BODY when the confirmation button disappears. Reproduced with `/tmp/status-learner-remove.mts`; output `/tmp/status-learner-remove.log`. Return focus to the new Download for offline use control or the App status summary after success, then verify keyboard navigation at that point. The first microtask-based correction still failed in build `72a79b3e…` (`/tmp/status-learner-corrections.log`). The final implementation focuses after React commits the new control. `/tmp/status-learner-corrections.mts` passed at 375/light and 1280/dark on `6f7f767…`: the visible active element is the Download for offline use button.
2. **Low, cancellation wording, corrected and verified.** Cancelling while connected shows **“Reconnect to the internet, then resume the download.”** The existing Resume download control works. The reconnection instruction is unnecessary for a connected user who deliberately cancelled. Direction: make that instruction conditional or remove it from the connected cancellation state. The final copy says “Some files are not saved yet. Resume the download when you are connected to the internet.” The final correction script checked this rendered text in both contexts while cancellation/resume still worked. No outstanding change is requested.

Preliminary source concerns about Later/Escape focus, the confirmation's initial focus, Keep focus and small unstyled controls did not survive the built checks: the final observed controls and focus outcomes were correct. They are not outstanding findings.

## Assumed knowledge and clarity

The UI assumes ordinary browser concepts: tabs/windows, an internet connection, downloading files and saved answers. It does not require a service-worker, cache or release-manifest explanation. The optional source commit link need not be understood to save or update the course. Native tools are clearly outside browser offline access. No new assembly prerequisites were introduced.

The two section headings and state labels make the distinction understandable. The idle panel is longer on a phone, but its limited-width scroll area and concise paragraphs preserve readable controls; no extra expansion or speculative lesson redesign is recommended.

## Limits and status

This review did not verify all-tab unsaved/busy protection, full course compiler execution, legacy migration or every network/storage fault; the technical reviewer and real-worker browser suite cover those separately. No source-only reading is claimed as browser evidence. Both findings are corrected and independently verified in the final built UI. No learner-facing blocker remains in the reviewed React UI scope. The subsequent static/pre-hydration header placement change passed a narrow final built checker, recorded below. A later build that changes these UI states must be rechecked.


## Final static/header follow-up

The final HTML/idle-state candidate was `b8cfaed0e1761e1e03248127eead65a3dfeaef9e5fad8f1dd7cdc1c2e1cbaa1b` (2,392,657 app-asset bytes). Ran `node --experimental-strip-types /tmp/status-learner-static.mts` successfully in eight contexts: 375/1280 × light/dark × JavaScript-disabled/held-bundle. The header and native App status disclosure were present inside `#root` before React ran. Each showed the accurate source identity and explained that checks/downloads need JavaScript. There was one status control, no page overflow and no page errors. Before JavaScript, computed dark colours were rgb(16,22,21)/rgb(232,238,237), and light colours rgb(243,246,245)/rgb(16,26,24). After releasing the real bundle, React replaced the temporary header, rendered the requested deep-linked lesson, retained exactly one status control, and showed the chosen actual theme with functioning keyboard-open status and current-release check.

Evidence: `/tmp/status-learner-static-six.log`, `/tmp/status-learner-static.json`, `/tmp/status-static-{375,1280}-{light,dark}-{no-js,held-bundle}.png`. Directly inspected phone/dark/no-JS and desktop/light/held-bundle images.

Also ran `/tmp/status-learner-online-only.mts` successfully against this final build, using a real changed release. **Not saved for offline use** remained the state before preparation, while Update ready was available, and after explicit restart onto the new Build hash. Temporary update bytes did not create a misleading Offline download incomplete or Available offline claim. Evidence: `/tmp/status-learner-online-only-six.log`, `/tmp/status-learner-online-only.json`.

The unchanged React UI/lifecycle matrix and corrections retain their four-context `6f7f767…` evidence; the final `b8cfaed…` follow-up covers the changed static placement and online-only idle wording. No outstanding learner UI finding remains. All reviewer fixtures and browser processes were closed after completion. Product files were not edited by this reviewer.

## Source-link target follow-up

A focused acceptance check subsequently reported that the source-commit link was only 25 pixels high on a phone, despite the buttons meeting the target. The correction gives links in the status panel a 44-pixel minimum height.

Independently ran `node --experimental-strip-types /tmp/status-learner-links.mts` against candidate `b67ec5ff50d8d96ef0bd71f1f78d4addbf89d027ba9f8e4ee45d1b10b5321646` (2,392,732 app-asset bytes). All twelve contexts passed: 375/1280 × actual light/dark × React/JavaScript-disabled/held-bundle. The source link measured **44 × 51 pixels** in every context. Keyboard Enter opened the status control and Tab focused the source link, with a visible solid focus outline. Escape from the React panel returned focus to its summary. Computed static light/dark colours remained correct; there was no horizontal overflow or page error.

Updated React screenshots at `/tmp/status-after-{375,1280}-{light,dark}-open.png` show the correction; directly inspected phone/light and desktop/dark images. Exact results: `/tmp/status-learner-links.log`, `/tmp/status-learner-links.json`. This was a targeted check of the changed link styling and focus, not another full lifecycle run. The earlier lifecycle evidence is unchanged. No outstanding learner UI finding remains.
