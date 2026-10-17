// Copyright © 2026 Christopher Snow

// Unit and integration tests, under Vitest.
//
// The engine, the domain model, the HDL subset and the lesson schema run under Node with no DOM:
// that is a design rule (docs/simulator.md), and running them here is what enforces it. Tests of
// React components opt into a DOM with a `// @vitest-environment jsdom` comment at the top of
// the file. The educational tests (every exercise completable, rejects wrong answers,
// deterministic, resets, cannot be bypassed) drive the built site in a browser and live under
// tests/educational, run by Playwright, not here. The learning platform's own tests run here too,
// against this course's dependencies, so the copy in platform/ is proved to work in this
// repository.
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: [
      "packages/**/*.test.ts",
      "packages/**/*.test.tsx",
      "platform/**/*.test.ts",
      "platform/**/*.test.tsx",
      "content/**/*.test.ts",
      "content/**/*.test.tsx",
      "apps/**/*.test.ts",
      "apps/**/*.test.tsx",
    ],
    environment: "node",
    // Vitest's own default, 5 seconds, unless AL_TEST_TIMEOUT (milliseconds) says otherwise. A few
    // tests drive a figure through dozens of presses and take 3 to 4 seconds when several checks
    // share one machine; the variable lets such a machine run `npm run check` without changing what
    // any test asserts.
    testTimeout: Number(process.env["AL_TEST_TIMEOUT"] ?? 5000),
    setupFiles: ["./tests/vitest.setup.ts"],
    passWithNoTests: false,
  },
});
