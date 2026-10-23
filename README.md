# Assembly Lab

Copyright © 2026 Christopher Snow.

An interactive, browser-based course in which you drive a real processor's instruction set one
instruction at a time, with the C that compiled to each instruction beside it. It is the third of
the author's works on one machine: *Digital Design* (`snowch/digital-design`) builds a computer
from gates, the notes *From gates to a compiled if* (`snowch/programmer-calculator`, `docs/`) read
what its bits mean, and this course drives a real one.

**The course is published at <https://snowch.github.io/assembly-lab/>.** The site is deployed
from the `main` branch by `.github/workflows/deploy.yml`.

## Offline use

Open the course with an internet connection and wait until the status near the top says
“Ready to use offline in this browser.” You can then reopen the course and use its
lessons and exercises without a connection. Links to other websites and the optional
“Compare with GCC” feature need an internet connection.

When a downloaded update is ready, **Update now** checks saved changes and reloads
the course's open tabs and app windows. If changes cannot be preserved, it leaves
the current app open and explains how to back up work before reopening.

Clearing this site's browser data removes the saved course. Your browser may also
remove it to free space. See [offline operation](docs/offline.md) for build, update
and testing details.

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
