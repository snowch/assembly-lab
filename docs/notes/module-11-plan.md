# Module 11 plan: C contracts and machine execution

Two lessons complete the main course: `c-and-overflow` and `checked-arithmetic`. They reuse the
trip computer's distance, gradient and fuel records. No new instructions are needed. The first
separates a deleted signed check from a machine wrap, then constructs a guard and saturating
increment. The second distinguishes conversion from arithmetic, checks byte input ranges, and
constructs C23 checked addition with an output pointer and an overflow result.

The checked drafting brief, compiler evidence, companion-scenario crosswalk and eventual review
record are under `docs/notes/module-11/`. Every displayed A64 program has a real-tools fixture.
Compiler output that calls a sanitizer or printf runtime is evidence of compiler diagnostics,
not an executable simulator listing. The memory stepper gains an optional NZCV row so the
signed-versus-unsigned overflow failure can be inspected beside its stored result.

Originality: the module does not copy the companion's ten-scenario order. It develops two
practical contracts for trip data, distinguishes their C rules, and reuses earlier course results
for countdown, division and wider arithmetic. Integer promotion and format-argument typing are
checked explicitly rather than treating illustrative eight-bit behaviour as actual C.
