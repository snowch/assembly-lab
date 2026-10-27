# Where next: independent technical review

Copyright © 2026 Christopher Snow

## Scope

Independent review of the optional `#/where-next` page, its course-written assembly starter,
source/download/corpus correspondence, actual external playground behaviour and discovery
links. The reviewer did not author product code or learner prose. This pass follows CLAUDE.md,
docs/authoring.md and both closing style passes in docs/style.md.

## Sources and executable checks

Read the playground's current published README through its official repository:
https://github.com/Abdalla-Eldoumani/aarch64-playground/blob/main/README.md . Its stated boundaries
support the page: a browser interpreter; emulated library calls; the terminal's `gcc` only
assembles; system-register/board execution is outside its user-program environment; instruction
counts are not chip timings. Its checks are temporary rather than persistent saved program data.

The supplied `main` preserves the incoming frame pointer and link register in an aligned frame,
sets the known argument registers, calls the unchanged trip function, then restores its frame
before returning. Module 9's Calls and returns already explains precisely this prologue, the
link-register overwrite by BL, pair loads/stores and stack alignment. The page neither invents
compiler output nor implies the wrapper was compiled from C.

Independent commands:

- `npx vitest run content/where-next.facts.test.ts`: **3 passed**, 3.77 seconds;
  `/tmp/where-next-technical-facts.log`.
- GNU/QEMU differential on `where-next-trip`: **1 program, 1 call, 14 instruction states,
  zero differences**, 0.1 seconds; `/tmp/where-next-technical-native.log`.

The differential count includes the initial state. The model executes thirteen instructions;
the external runtime also executes its own exit trampoline. No learner claim assumes their
step counts are identical. This is emulation evidence, not physical hardware execution.

## Actual external-playground verification

An independent Playwright session at the real external URL imported the exact public starter
file through the normal import chooser, accepted replacement, assembled, selected decimal
register display, stepped into and through the known calculation, then let `main` return.
Assertions checked the incoming arguments, prepared return value, preserved other argument
registers, final halted state and the expected worked-example exit status. The source required
neither m4 macros nor a C compiler. The result is not printed by the starter.

Script and evidence: `/tmp/where-next-technical-external.mjs`,
`/tmp/where-next-technical-external.log`, and entry/result/exit screenshots with the same prefix.
The independent external command passed on its first execution. This check establishes this
starter on the observed site, not every external instruction or a future website version.

## Sceptic assessment of learner findings

1. **Assembler section wording:** upheld. Prior material through Module 9 has not taught
   ELF/source section terminology. The corrected local text defines directives as tool
   instructions and explains `.text` as beginning a group of processor instructions.
2. **Entry convention:** upheld. Merely naming a caller `main` would not tell a learner why
   this environment starts there. The corrected text explicitly says the playground starts
   at `main` with a prepared stack and return destination before the source is shown.
3. **Premature UART term:** upheld. Hardware-specific output belongs to the native path;
   the local limitation now describes board startup and direct hardware access in plain words.

The explicit exit-status note is accurate: this starter deliberately returns its calculation,
so that worked example's nonzero status is expected. It makes no general claim that nonzero
statuses signify success. Preserving the verified minimal caller avoids adding unintroduced
printing code or obscuring the arithmetic result with an extra overwrite.

The extension now distinguishes fixed MOV inputs from input-driven programs before asking for
checks with several inputs. Supplying stdin to the fixed-input starter would not change its
loaded values. The project reference is linked before the learner needs new I/O conventions.

## Further findings and fixes

The learner's fixed-input/check-field and exit-status concerns were upheld and resolved in the
built page. The same applies to phone-specific navigation: the top menu holds import/export,
while registers, code and more/checks are bottom controls. The text also handles the external
follow-changes setting scrolling the register list away from X0. The starter agent independently
checked phone and desktop import, stepping, final return and the one fixed check; this review's
separate actual-site execution is described above.

Two integration findings were upheld. An internal course link did not belong in the Companion
courses landmark; the final app and static fallback retain exactly three external companion
links, with a separate internal link and a 44-pixel target. Without JavaScript, the new footer
link also needed an actual destination. Its static #where-next target now contains the shared
title and lead, an external-playground link and an actual starter download; the hydrated app
continues to use #/where-next.

The README says exports do not carry checks and a new program clears them. Step 1 now tells
readers to record existing checks before importing, in addition to exporting their program.
That is distinct from the existing warning about temporary checks on leaving/reloading.

The root's initial focused browser run reported two desktop action-row prose-measure failures.
Changing the control container from paragraph to div accurately represents two controls, without
relaxing the prose guard. The homepage's real paragraph also receives the normal prose measure.
The final build contains both fixes; its controls still have their full labels and 44-pixel
minimum targets. These are accepted repairs, not test exclusions.

Read the final engineering brief and docs/sources.md entry. Their scope and validation claims
match the evidence, including the separate external offline mechanism and pending physical
Pi verification. No new numbered lesson or changed ordinary lesson sequence was found.

## Built page and final verdict

Independent first-final-build checks passed at 375 and 1280 pixels in both actual light and
dark themes, plus a fresh-cache offline visit. Their log remains separate:
/tmp/where-next-technical-browser.log. Those results predate the final check-preservation phrase,
semantic action-container change and functional no-JavaScript summary.

The release candidate built in /tmp/where-next-build-release-candidate.log was then independently
checked again using /tmp/where-next-technical-release.mjs. All four contexts and the separate
fresh-cache offline case passed; evidence is /tmp/where-next-technical-release.log. Assertions
cover the final accepted wording, three content headings, theme persistence, home and Module 9
discovery, reload, document title, source and downloaded-file byte equality, real external link,
semantic action container, control size, separate footer landmark and absence of page overflow,
problem/locked figures or JavaScript errors. Viewed all four release screenshots with prefix
/tmp/where-next-technical-release-; text, controls and code are legible in both themes.

At 375/1280 the code fits without horizontal scrolling. A supplemental 320-pixel dark case
verified focused-code ArrowRight scrolling and contained overflow, with no document overflow:
/tmp/where-next-technical-narrow-release.log. The offline check saved the whole course from the
home page, disabled the network, opened the previously unvisited ancillary route through the
service worker and fetched the starter with identical bytes. This verifies Assembly Lab's
save, not the external website's offline availability.

The final no-JavaScript summary passed independently at both 375 and 1280 pixels: footer
anchor navigation, visible summary, external new-tab link, real starter response with matching
bytes, 44-pixel targets, three separate companion links and no page overflow.
/tmp/where-next-technical-noscript-release-final.log records that pass. Two preceding harness
attempts are retained: the first incorrectly expected a relative href when the product correctly
used /assembly-lab/examples/trip-playground.s; the second sent that relative path to an API
request context without a base URL. Resolving the actual href against the page URL fixed the
review harness; neither failure required a product change. The earlier no-JS footer-only pass
was narrower and did not establish a working destination; the final checks do.

After the starter facts suite gained its unchanged-trip-body assertion, the independent rerun
passed **4 tests**, 3.46 seconds; /tmp/where-next-technical-facts-final.log. This is recorded
separately from the earlier three-test result, rather than changing the earlier count.

**Approved for this optional page and checked starter.** No unresolved technical or learner
blocker remains in this review. No physical board test, arbitrary external-program correctness,
future external UI compatibility or CPU-performance equivalence is claimed.
