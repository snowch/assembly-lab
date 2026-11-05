# Independent review: C types and one subtraction

Copyright © 2026 Christopher Snow

Reviewer: independent agent/session; did not author the lesson or component. This combines
separate learner and technical passes. It is a review of the page and executable evidence,
not a novice study or evidence of learning effectiveness.

## Preparation inspected in source

- `AGENTS.md`, `CLAUDE.md`, `docs/authoring.md`, `docs/style.md`, and
  `.agents/skills/learning-design/SKILL.md`.
- The front page's actual `Before you start` strings, Module 0's published fundamentals
  prose, compiler notes and synthesis prose; the published Module 1 sequence in
  `pacing-1-4.ts`, the reading-sequence strings, and `four-bit-arithmetic.prose.ts`.
- The two recorded Compiler Explorer requests/responses in this directory, and C23 draft
  N3096 §§6.2.5p11 and 6.5p5 in the downloaded standard text.

## Prerequisite and teaching-sequence review

The observable outcome is to relate a C result type to a returned reading while recognising
that the recorded subtraction instructions can be shared. Deferred topics are compiler
optimisation consequences of undefined behaviour, overflow detection, and selecting
signed/unsigned comparison or division instructions.

The front page requires reading small functions with `int`, `unsigned` arguments and
`return`. Module 0 defines and demonstrates argument order, destination-first subtraction,
`w0` as result, `ret`, GCC and the `-O1` setting; its synthesis asks the learner to trace
several writes. The preceding Module 1 reading sequence defines signed/unsigned weights,
demonstrates a four-bit pattern and its two readings, bridges to 32 bits, and supplies fresh
reading/application tasks. The immediately preceding arithmetic lesson demonstrates the
small subtraction mechanism and provides a fresh subtraction.

Therefore a single subtraction with two named arguments is a smaller complete application
than the old erroneous-fuel subtraction plus subsequent added constant. It does not require
another column-by-column walkthrough. The bridge that remains necessary is from a register's
two possible readings to the C function's one specified result type.

Pre-implementation risks sent to the author for local explanation and final checking:

- The preceding bit-reading work does not teach C's unsigned arithmetic guarantee or signed
  out-of-range rules. They must appear visibly on this page before a general claim about C
  arithmetic. Negative signed results must not be conflated with overflow.
- The call comparison must label independent starting calls and returned results. Moving
  between comparison cards must not look like one computation feeding another.
- A prediction about instruction choice must not show the compiler listings, a sentence
  giving that choice, or the worked result before commitment.
- The target-specific width of both types needs a local qualification. `unsigned` as a
  source declaration is an allowed prerequisite; a target width and wrapping guarantee are
  not implied by that prerequisite.

Misconception hypotheses, not observed learner difficulties: a negative mathematical
answer must be an error; changing a C type must change the stored bits; choosing a signed
reading executes another calculation; and one shared `sub` promises signed wrap for every
C input. The comparison and local C-rule explanation should distinguish these.

## Technical source pass

Both unmodified compiler responses report success and `GCC: (GNU) 16.1.0`; their requests
use `-O1 -g`. Both contain the same subtraction and return instructions. The source
subtraction is planned minus travelled in both versions. Both debug references point to the
closing brace, line 4; a teaching association to the return expression on line 3 describes
the operation while retaining those original records.

N3096 §6.2.5p11 explicitly defines arithmetic for an unsigned type modulo its width and says
it cannot produce overflow. Section 6.5p5 leaves an exceptional expression result outside
its representable range undefined. The chosen signed subtraction is representable, so its
negative result is defined. A model/native run can check the recorded machine sequence; it
cannot establish the language's guarantee for an undefined signed C expression.

## Final built-page review

First build reviewed at `http://localhost:4321/assembly-lab/#/lesson/arithmetic-on-register-bits`
on 5 November 2026. Playwright drove Chromium at 375×900 and 1280×900, each in light and dark.
All four combinations covered initial, committed prediction, returned, reload-restored,
reset calls and reset-restored. Both prediction choices were exercised. The script, state
measurements and screenshots are in `/workspace/scratch/c-types-subtraction/reviewer-browser.*`
and `review-*.png`.

- The actual body background/foreground were light `rgb(243,246,245)` / `rgb(16,26,24)`
  and dark `rgb(16,22,21)` / `rgb(232,238,237)`, including restored states. Theme selection
  persisted through reload.
- Document scroll width equalled 375 or 1280 in every checked state. On the phone, each paired
  listing contained 588 pixels of content in a 317-pixel scrolling region; manually scrolling
  the first listing showed its instructions beside the numbered C and the checked line tags.
  Desktop paired listings fit the available width. The returned bit rows and C result labels
  stayed inside the page. Computed font sizes in the bit rows were at least 11 pixels.
- Initial state rendered both complete C functions, with no compiler-instruction pane or
  comparison result. Commitment revealed the paired listings and explanation. Returned rows
  stayed absent until `Call both functions`; `Reset calls` removed them, retained the
  committed prediction/listings, and restored that ready state correctly after reload.
- The wording “Starting arguments for each independent call” and “Final w0 bits when …
  returns” distinguishes inputs, independent calls and returned values. The rendered results
  agree with the separate machine run. No page exceptions were recorded.
- The `C overflow and machine results` link reached `#/lesson/c-and-overflow` and the matching
  visible heading in all four combinations.

Potential answer-leak concern rejected: the later C-rules explanation includes worked numeric
arithmetic before the calls run, but the prediction asks only whether the compiler instructions
change. There is no return-value assessment here. It does not reveal that instruction
comparison before commitment. Repeating a calculation already practised in the prerequisite
would not supply a fresh assessment.

Final-build recheck completed after the revised bounds explanation and source-position fix.
The source/paired listing stays before the prediction on commitment. At both phone themes,
clicking `Check your prediction` kept `scrollY` at 1154; at both desktop themes it remained
654. The source area's added content naturally increased the button's position by about
114 pixels on phones and 238 pixels on desktop; the page did not scroll to a different place.
The paired instruction view remains available by its contained horizontal scroll on phones.
The separate sceptic also checked keyboard commitment, call, reset and reload in the final
phone build.

The final three bullets distinguish valid negative signed arithmetic, unsigned wrap below
zero or above its maximum, and the absence of a C guarantee for signed out-of-range
addition/subtraction/multiplication. The unsigned qualification and signed boundary example
agree with the cited clauses. Both target widths and type readings remain visible before
the interaction; the compiler qualification remains available without revealing the prediction.
Final screenshots and measurements are in `/workspace/scratch/c-types-subtraction/final-*.png`
and `final-review.json`. All four width/theme combinations were rechecked for commitment,
the revised bounds, returned-state reload, reset and reset-state reload. Actual rendered
theme colours and page widths stayed as recorded above.

No unresolved learner or technical finding was identified in this reviewed scope. The
implementation corrects the pre-implementation risks through the visible type explanation,
local arithmetic rules, explicit independent-call labels and prediction/call gates. This
judgement concerns material written by other agents; it is not a verdict on this reviewer's
own product changes.

## Executable verification and limits

An independent machine invocation assembled and ran both recorded functions with the page's
arguments; both returned after two instructions, with the expected identical low 32 bits and
the expected type-selected readings. The native differential command
`AL_TOOLS=/workspace/scratch/arm-tools node --experimental-strip-types --disable-warning=ExperimentalWarning scripts/real-tools/check.mjs --only module1-c-types --corpus`
passed: one program, two calls, six instruction states compared, zero differences. Two earlier
attempts exited 2 because the assembler was not yet installed (once on PATH, once in the
then-incomplete tools directory); the successful rerun does not change those exit statuses.

Prerequisites were read in source rather than replayed in this browser pass. No new unexplained
required C feature was found: `unsigned` arguments are an explicit front-page prerequisite;
the page explains the equivalent `unsigned int` spelling, target widths, return readings,
unsigned wrapping and signed undefined behaviour locally. `AArch64` is defined in the Module 0
fundamentals prose. GCC and its optimisation setting are also introduced there; extra flags
are explained in the optional compiler note.

This reviewer did not run the full suite. Full-suite results belong in the implementation's
validation record, separate from these focused checks. No screen-reader session, physical
touch device, offline-cache scenario or novice study was performed. The page demonstrates
the bridge from bits to C types; success at this interaction alone does not establish that a
learner can explain it independently or transfer it to an unfamiliar C case.
