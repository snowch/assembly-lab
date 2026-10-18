# Checkpoint 5: the small C compiler

The author asked to finish the remaining lessons on 17 October 2026. This implements the
plan's recommended small compiler as part of that work. It is a teaching compiler for a
declared subset, not an implementation of all C.

## Accepted language

One function returns `unsigned` or `unsigned int`, with zero to four parameters of that type.
An empty parameter list and `(void)` both denote a function without parameters in this subset.
Parameters and initialized local declarations together occupy at most eight distinct slots.
Nested blocks may shadow names. The compiler preserves block and `for` scopes; it rejects a
read of a local in its own initializer and any use outside the declaration's scope. No local
may be declared without an initializer.

Statements are assignment, return, blocks, `if` with an optional `else`, `while`, and `for`.
A `for` header has a declaration or assignment initializer, a condition, and an assignment
increment. Postfix `++` and `--` are also supported as complete statements or increments.
The syntax excludes omitted header parts, calls, pointers, arrays, structures, signed
declarations, floating point, `break`, `continue`, and increment within an expression.

Expressions support parentheses, `+`, `-`, `*`, `/`, `%`, `&`, `|`, `^`, `<<`, `>>`, the six
comparisons, unary `!`, and unary `~`. Precedence, left associativity and C's usual arithmetic
conversions apply. This is not an expression language that silently treats every constant as
unsigned. Unsuffixed decimal constants up to `INT_MAX` have type `int`. Hexadecimal constants
above that limit and constants with a `u` or `U` suffix have type `unsigned`. An unsuffixed
decimal constant above `INT_MAX` would need a wider C type, so it is rejected with a diagnostic.
The maximum literal is `UINT_MAX`; octal constants are outside the subset.
Backslash-newline splicing is rejected before comment recognition, because C would remove it
before tokenisation. Whitespace is restricted to C's ASCII whitespace characters; Unicode
spaces accepted by JavaScript are rejected. LF, CRLF and CR physical line endings are handled.

The direct AST interpreter is a preflight check for the page's run button. It refuses executed
division or remainder by zero, signed intermediate overflow, a shift count outside 0 through
31, and negative signed shifts. The latter restriction avoids dependence on a language
version's signed right-shift rules. A branch which avoids an undefined expression may run.
Compilation alone does not claim that a program has defined behaviour for every possible input.
The generated A64 must not be used as a substitute for this C check.

## Register allocation and code patterns

The first parameters occupy `w0` onwards. Every declared local gets the next unused register,
through `w7`; slots are not reused after scope exit. Expressions use `w8` through `w16` and
`w17` as remainder scratch. All these registers are caller-clobbered under AAPCS64. The compiler
emits leaf functions, so it does not touch the stack, `x19` through `x29`, or the link register.
A return expression is completed before its value is copied to `w0`.

The generator deliberately keeps fixed patterns: load a constant or copy a variable to a
temporary, evaluate operands, perform the operation, and copy to the destination. Large
constants use `movz` and `movk`. Comparisons use `cmp` and `cset`. Remainders use divide followed
by `msub`. Conditions use `cbz`; loops add a backward branch. Nested expressions are limited
by the available temporaries. No optimiser rewrites the learner's structure.

Each output line has a separate one-based C line mapping. The listing itself remains valid
GNU assembly. The output is deterministic for a given source and compiler implementation.

## Bounds and diagnostics

The compiler accepts at most 12,000 source characters, 2,000 tokens, 32 levels of parser
nesting, and 2,000 output lines. It reports line, column and a diagnostic code. Execution
permits at most 10,000 AST evaluation steps; the caller may lower that limit. The machine's
instruction budget is separate. A budget stop is not a claim that a program never terminates.
These limits keep editing and execution local and responsive. There is no `eval`, generated
JavaScript, network dependency, or runtime package dependency.

## Evidence

`packages/compiler/src/compiler.test.ts` checks precedence, scope, limits, undefined inputs,
boundary arithmetic, and generated operands against independently executed A64.
`packages/compiler/src/evidence.test.ts` compares the AST evaluator, emitted A64, and actual
GCC 16.1.0 A64 `-O1` listings on the recorded inputs. The records live in
`docs/notes/module-10/compiler/`: the exact C, Compiler Explorer requests and responses,
and course output with source mappings and evaluated calls.

Both compiler outputs are included in `scripts/real-tools/corpus/module10-*`. The existing
GNU assembler/QEMU comparison checks every instruction's architectural state, not merely a
claimed final result. `scripts/compiler-evidence.mjs` regenerates only the course compiler
records and corpus from the recorded C and GCC responses; it does not fabricate GCC output
or fetch new results.

The learner-facing editor must offer the plan's text and statement-template modes over the
same C source, explain this subset, report the diagnostic text, run the C preflight, and use
the actual emitted listing in the machine. Its independent review is recorded with Module 10.

Initial compiler validation on 17 October 2026: 77 tests passed. The 36 generated and GCC
corpus programs completed 924 calls under GNU as and QEMU, with 17,433 instruction states
compared and no differences. This is implementation evidence; it does not replace the
independent source and learner reviews.
