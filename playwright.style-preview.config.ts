// Copyright © 2026 Christopher Snow
import { defineConfig } from "@playwright/test";
const port = Number(process.env["AL_STYLE_PORT"] ?? 4441);
export default defineConfig({
  testDir: "tests/style-preview",
  fullyParallel: true,
  workers: 2,
  retries: 0,
  timeout: 300_000,
  reporter: [["list"]],
  outputDir: "style-preview-results",
  use: { baseURL: `http://localhost:${port}/`, trace: "retain-on-failure" },
  webServer: {
    command: `BASE_PATH=/ npm run preview -w @al/course -- --outDir ../../.style-preview-build --host 0.0.0.0 --port ${port} --strictPort`,
    url: `http://localhost:${port}/`,
    reuseExistingServer: false,
  },
});
