# Assembly Lab

Copyright © 2026 Christopher Snow.

An interactive, browser-based course in which you drive a real processor's instruction set one
instruction at a time, with the C that compiled to each instruction beside it. It is the third of
the author's works on one machine: *Digital Design* (`snowch/digital-design`) builds a computer
from gates, the notes *From gates to a compiled if* (`snowch/programmer-calculator`, `docs/`) read
what its bits mean, and this course drives a real one.

**The course is published at <https://snowch.github.io/assembly-lab/>.** The site is deployed
from the `main` branch by `.github/workflows/deploy.yml`.

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
