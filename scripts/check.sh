#!/usr/bin/env bash
# Copyright © 2026 Christopher Snow

# Exactly what CI runs. Run it before pushing: `npm run check`.
#
# CI invokes this same script, so a laptop and CI cannot drift. Each stage says what it protects,
# because a check nobody understands is a check somebody eventually deletes.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "== formatting =="
# One formatter, pinned, so a diff is never a reformat. Markdown is ignored: prose files keep
# their own line breaks.
npx prettier --check .

echo "== copyright =="
# Every source file carries its author's copyright line; a new file without it fails here.
# `node scripts/copyright.mjs` adds the line.
node scripts/copyright.mjs --check

echo "== the platform copy is unedited =="
# platform/ is the learning platform's packages at the commit platform/SOURCE.json records. A fix
# to the platform is made in snowch/learning-platform and synced here, never made here.
node scripts/sync-platform.mjs --check

echo "== types =="
# Strict TypeScript over every package, the content and the tests, with no emit: the build below
# bundles only what the course imports, so this is the only stage that typechecks everything.
npx tsc --noEmit -p tsconfig.json

echo "== unit and integration tests =="
# The plan's data, the course's words, the page for a browser with no scripts, the colour tokens
# and the icons, and the platform's own tests against this course's dependencies, which proves the
# copy in platform/ works in this repository.
npx vitest run

echo "== the course builds =="
# The production bundle, under the base path GitHub Pages serves it from.
npm run build -w @al/course

echo "== browser tests =="
# The built site, driven in a browser on a desktop and on a phone: no console errors, the theme
# control, legible text, reachable controls, no sideways scroll, working links. Needs Playwright's
# Chromium; CI installs it.
# Served on a port nothing else holds, picked now, so two checks at once (two worktrees) never test
# each other's builds.
AL_PORT="$(node -e 'const s=require("net").createServer();s.listen(0,()=>{console.log(s.address().port);s.close()})')"
export AL_PORT
npx playwright test

echo
echo "All checks passed."
