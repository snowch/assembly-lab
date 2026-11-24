# Arm Assembly Lab

Copyright © 2026 Christopher Snow.

An interactive, browser-based course in which you drive a real processor's instruction set one
instruction at a time, with the C that compiled to each instruction beside it.
*Digital Design* (`snowch/digital-design`) builds a computer from gates.
[*Bit Lab*](https://snowch.github.io/bit-lab/) explores how computers represent and process data.
Arm Assembly Lab drives a real processor's instruction set.

**The course is published at <https://snowch.github.io/assembly-lab/>.** The site is deployed
from the `main` branch by `.github/workflows/deploy.yml`.

## Offline use

Use **App status → Save offline copy** while connected. Wait for “Downloaded and ready to use offline” before disconnecting. The save includes the course, local browser tools and example downloads. External documentation and optional Compare with GCC still need internet access; native examples need separate tools or hardware.

Opening or reloading online uses the current published course. Moving between lessons in an open tab keeps its loaded release. **Reload latest course** safely reloads this tab without saving the full course. **Update offline copy** saves and verifies a replacement; **Restart to update** then checks and preserves work across all open course windows.

Browser storage can be cleared or evicted. Check App status before relying on a saved copy. See [offline operation](docs/offline.md) for release, update, preservation and verification details.

**Status.** Checkpoint 1: the plan is proposed and under the author's review, and the scaffold is
live. The front page lists the planned modules; no lesson is written until the plan's decisions
are taken.

## Read first

- [`CLAUDE.md`](CLAUDE.md): the binding project rules, including what breaks the build.
- [`docs/plan.md`](docs/plan.md): the modules in order, the four decisions for checkpoint 1, the
  model, and the checkpoints.
- [`docs/sources.md`](docs/sources.md): what every claim about the instruction set, the compiler
  and C is checked against.
- [`docs/authoring.md`](docs/authoring.md): how a lesson is made.
- [`docs/style.md`](docs/style.md): the style checklist every learner-facing string is edited
  against.
- [`docs/checkpoints.md`](docs/checkpoints.md): the report written for the author at each
  checkpoint.

## Working on it

```sh
npm ci            # once; .npmrc sets legacy-peer-deps, see CLAUDE.md
npm run dev       # the course at http://localhost:5173/assembly-lab/
npm run check     # exactly what CI runs: Prettier, the copyright line, the platform copy, tsc,
                  # Vitest, the build, Playwright
```

The repository is an npm workspace: `apps/course` (the shell and the front page), `content` (the
plan as data, and later the lessons), `platform/` (the learning platform's packages, a checked copy
from `snowch/learning-platform`), and `tests/educational` (Playwright). The assembler, the
simulator and the course's figures arrive as `packages/` at checkpoint 2.
