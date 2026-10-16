// Copyright © 2026 Christopher Snow

// The educational tests: the built course, driven in a browser.
//
// They hold every lesson to the prompt's "educational level": every exercise is completable with
// its reference solution, rejects a wrong answer, is deterministic, resets cleanly, and cannot be
// bypassed (no UI path skips a test, and a stored completion is re-run on load before it is
// believed). They run against the production build served under the course's base path, as
// GitHub Pages serves it, on a desktop viewport and on a phone.
import { defineConfig } from "@playwright/test";

// The port the built site is served on. scripts/check.sh picks a free one and passes it in
// AL_PORT, so two checks running at once (two agents' worktrees, say) never share a server; run
// on its own, Playwright uses 4173.
const port = Number(process.env.AL_PORT ?? 4173);
const base = "/assembly-lab/";

export default defineConfig({
  testDir: "tests/educational",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${port}${base}`,
    trace: "retain-on-failure",
  },
  webServer: {
    command: `npm run preview -w @al/course -- --port ${port} --strictPort`,
    url: `http://localhost:${port}${base}`,
    // Never test a server this run did not start: one left on the port by another checkout would
    // be a different build, and its results would be about that build. A busy port fails loudly.
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    {
      name: "desktop",
      use: { browserName: "chromium", viewport: { width: 1280, height: 800 } },
    },
    {
      name: "phone",
      use: {
        browserName: "chromium",
        viewport: { width: 375, height: 812 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
});
