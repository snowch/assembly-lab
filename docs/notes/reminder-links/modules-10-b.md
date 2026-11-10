# Reminder links: Modules 10 to Appendix C

Source review covers every published route in the exported lesson order, not just the unsplit source lessons. Guidance: `CLAUDE.md`, `docs/style.md`, `docs/authoring.md`, and the learning-design skill. These are retrieval aids for previously practised mechanisms; essential explanations remain visible. No interface or teaching sequence changes are proposed. Independent learner and technical review, and final browser verification, remain separate.

Outcome: learners can retrieve the earlier machine rule needed to trace generated instructions, implement a contract or interpret native evidence. Possible confusion between unsigned carry and signed overflow is a hypothesis addressed by a reminder without revealing the prediction’s result. No novice study was performed.

| Published route | Decision and retrieval point |
| --- | --- |
| `from-c-to-instructions` | Accepted: the motivation names `movk` but points only to “Module 1”. Add the keeping/replacing rule and exact `building-constants` route beside this use. |
| `equivalent-trip-charge` | Accepted: retrieve the low-32-bit product rule from `products-and-widths` before the assembly exercise. |
| `change-c-calculation` | No useful change: the immediately preceding read/write activities establish the calculation; the page explains recompilation and source highlighting locally. |
| `cap-charge-in-c` | Accepted: retrieve unsigned comparison conditions from `compare-and-choose`; retain the local explanation that wrapping precedes the cap. |
| `compile-a-loop` | No useful change: condition/body/update are explicitly explained and traced here; a generic loop prerequisite would duplicate that preparation. |
| `write-assembly-loop` | Accepted: retrieve the zero-iteration reason for testing before the body from `testing-before-and-after`. |
| `change-loop-boundary` | No useful change: the preceding compiled loop supplies the exact comparison; the page teaches equality and maximum-count wrapping locally. |
| `repeated-shifts-in-c` | Accepted: retrieve unsigned right-shift zero fill from `shifts`; retain the local explanation of repeated valid shifts and invalid single large shift. |
| `c-and-overflow` | Accepted: before the direct-assembly prediction, retrieve the V/carry distinction from `flags-and-overflow`. Keep the C undefined-behaviour explanation visible. |
| `checked-arithmetic` | Accepted: retrieve sign extension from `extending-register-values` before the narrowing prediction. C conversions and promotions remain explained here. |
| `checked-addition` | Accepted: retrieve unsigned carry versus signed overflow from `flags-and-overflow` before diagnosing the wrong report. The prediction result is not disclosed. |
| `from-function-to-executable` | Accepted: retrieve argument registers and return-address behaviour from `calls-and-returns` before the native caller is used. |
| `loading-and-startup` | Accepted navigation: turn the required working executable’s provenance into an exact `from-function-to-executable` link. ELF definitions remain local. |
| `runtime-startup` | Accepted: retrieve `sp` and saved stack values from `preserving-values-across-calls` before tracing startup stack preparation. |
| `debug-native-instructions` | Accepted navigation: link the named source-directory/build prerequisite to `from-function-to-executable`; connection and storage-marker commands stay local. |
| `stepping-native-function` | Accepted navigation: link the named working-build prerequisite to `from-function-to-executable`; session and stepping instructions stay local. |
| `diagnosing-native-failure` | Accepted navigation: link the named working-build prerequisite to `from-function-to-executable`; rebuild and diagnostic steps stay local. |
| `raspberry-pi-5` | Accepted navigation: link the claimed previous QEMU run to `from-function-to-executable`. Board-specific startup and pending verification remain explicit. |
| `raspberry-pi-boot` | No useful change: raw-image, firmware and startup differences are explained locally; the immediately preceding physical-connection lesson needs no extra prerequisite sentence. |
| `capture-pi-boot` | Accepted navigation: replace “preceding page” with exact `raspberry-pi-boot` build/staging link. Physical procedure remains local. |
| `restore-pi-boot` | Accepted navigation: link baseline capture to `capture-pi-boot`; rebuild/replace/capture steps stay local. |
| `same-c-on-a32` | No useful change: the page explicitly re-establishes A64/A32 argument and return conventions before the recorded leaf-function exercise. |
| `a32-conditions` | Accepted: retrieve A64 `csel` and comparison flags from `compare-and-choose` before contrasting A32’s conditional move. A32’s new rule remains explained here. |
| `a32-constants` | Accepted: retrieve A64 `movk`’s partial replacement rule from `building-constants` before comparing A32 `movw`/`movt`. |
| `a32-division-helper` | Accepted: retrieve whole-number unsigned quotient behaviour from `division-and-remainders` before the fresh average calculation. Helper calls are explained locally. |
| `twos-complement` | Existing: its bridge already links exact `same-bits-two-readings` and `subtraction-flags-and-negation` routes with their conceptual purpose. The appendix defines weights/negation locally; no additional reminder needed. |
| `c-integer-types` | Added in the register-width relocation review: the optional reference identifies `register-widths` as its preparation and return route, and links `same-bits-two-readings` for the previously practised bit-reading rule. Target widths, suffix spelling and each recorded compiler example are explained locally; no later C conversion or overflow knowledge is required. |
| `floating-point-bits` | New optional D preparation links the practised binary weights/readings and register-width routes. Binary fractions, normalisation and floating fields are taught locally. |
| `floating-point-rounding` | Immediately follows D1; its input/format explanations retrieve the field and fraction rule locally before introducing nearest-even rounding and spacing. |
| `floating-point-arm` | Immediately follows D2; register bank/target formats/calling conventions are defined before the checked recorded cases. Numeric rounding preparation is repeated beside the examples. |
| `floating-point-conversions` | Immediately follows D3; cast syntax, finite/range conditions and byte-copy arguments are explained locally. The recorded-case guide retrieves arithmetic precision without assuming integer bit-copy means numeric conversion. |

## Implementation and checks

Changed strings live in `pacing-10-a.copy.ts`, synchronised with its JSON block in `docs/notes/course-pacing-implementation/copy.md`. The split lesson builder attaches three reminders where the rendered page inherits its opening text. The appendix source needs no change. Browser and independent-review results are recorded by the managing session.

Focused source checks: every reminder target exists in the published export and is earlier than its retrieval use (the pre-existing conditional-assembly forward reference is unchanged). `npx vitest run content/lessons/pacing-10-a.test.tsx` passed, 28 tests. These source/tests checks do not establish phone/desktop rendering or novice learning.
