// Copyright © 2026 Christopher Snow
import { spawnSync } from "node:child_process";
import { cpSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const result = spawnSync("npm", ["run", "build", "-w", "@al/course"], {
  cwd: root,
  env: { ...process.env, BASE_PATH: "/", VITE_STYLE_PREVIEW: "1" },
  stdio: "inherit",
});
if (result.status !== 0) process.exit(result.status ?? 1);
const output = new URL("../.style-preview-build/", import.meta.url);
rmSync(output, { recursive: true, force: true });
cpSync(new URL("../apps/course/dist/", import.meta.url), output, { recursive: true });
