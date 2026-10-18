# Independent compiler review

Reviewer: the Module 8 implementation agent, which did not author the compiler, its diagnostics,
its tests or its evidence records. Review performed from the actual files before reading the
compiler author's explanations. The inherited Codex model and effort were used.

Scope: `packages/compiler/src/compiler.ts`, its independently drafted diagnostics, the compiler
and evidence tests, and `docs/notes/checkpoint-5.md`. This is a source and execution review;
it does not replace the separate learner review of the editor in a browser.

## Findings

1. **High: physical-line comment skipping disagreed with C line splicing.** The original
   `lex()` skipped `//` comments through the next physical newline without performing or
   rejecting translation-phase line splicing. Reproducer, where the comment ends with a
   backslash immediately before its newline:

   ```c
   unsigned f(void) { // comment\
     return 5;
     return 7;
   }
   ```

   The course compiler and AST evaluator returned 5. C23 draft N3096 section 5.1.1.2 phase 2
   removes the backslash/newline before phase 3 handles comments, so the return of 5 is part
   of the comment. Local GCC 14.2.0 at `-O1` emitted a return of 7. The Compiler Explorer
   confirmation attempt timed out; no claim is made about a new remote result.

   Smallest correction: reject line splicing as outside the declared subset before comments
   are skipped. This preserves the original source mapping. Reported to the compiler author;
   the author added early rejection and tests for LF, CRLF and CR, including comments and
   token continuation. Independent regression verification is recorded below.

2. **Medium: JavaScript whitespace accepted a non-C separator.** The original `/^\s+/`
   recognises non-breaking spaces. `unsigned\u00a0f(void) { return 1; }`, with an actual U+00A0,
   compiled in the course but GCC 14.2.0 rejected it as a stray source character. The declared
   C subset should reject unsupported characters rather than assign them a different lexical
   meaning. Suggested correction: limit whitespace to space, tab, carriage return, newline,
   vertical tab and form feed, with a regression test. Reported to the compiler author.

## Checks and rejected concerns

- Read integer token typing and conversion paths. Unsuffixed decimal values above INT_MAX
  are rejected; hex and `u` constants select unsigned as required for this 32-bit subset.
  Variables are unsigned, comparisons and logical-not produce int, and shifts use the promoted
  left operand's type. Mixed signed/unsigned arithmetic and comparisons convert consistently.
- Signed intermediate overflow, divide/remainder by zero, MIN/-1, and invalid shifts are
  refused when executed. A branch can avoid the invalid expression. A source that compiles is
  not claimed to be defined for every input. Negative signed right shift is deliberately
  excluded, rather than incorrectly described as always undefined by C.
- Read scope, shadowing and initialization paths. Parameters share the outer function block;
  nested blocks and for loops have their own scopes. Locals always have initializers and a
  local cannot read itself there. Slots are unique and never reused, matching the documented
  eight-slot limit. No path-dependent uninitialized local read was found in this syntax.
- Checked left associativity, precedence, dangling else, loop updates and early return.
  Return analysis is deliberately conservative. It may reject an always-returning loop,
  which the diagnostic accurately describes as failure to establish a return.
- Read register allocation and nested expressions. Variables use w0–w7, temporaries w8–w16,
  and w17 holds only a remainder quotient used immediately by msub. Nested remainder
  expressions do not preserve a live value in w17, so no scratch-register collision was found.
- Source, token, parser nesting, temporary pressure, output-line and AST-step limits are real
  checks. Every loop evaluates a condition and therefore advances the step budget. A stopped
  trace is not described as proof of nontermination.
- The error messages explain the unsupported construct or failed preflight condition without
  pretending the compiler accepts all C. They identify line and column through structured codes.
- Ran the existing compiler and recorded-evidence suites independently: **77 tests passed**
  before the review fixes. Evidence compares source, mappings, emitted instructions and
  model return values with stored actual GCC responses. QEMU coverage is documented in the
  checkpoint; this review does not claim a second independent QEMU run.

## Fix verification

Both fixes independently verified after the compiler author implemented them. The lexer now
rejects escaped physical newlines before comment recognition and accepts only C whitespace.
It counts CR, LF and CRLF physical line endings correctly, including line-comment endings.
The original splice reproducer now reports `unsupported-token` at line 1, column 30.
The regression suite rejects U+00A0, U+2003 and U+FEFF as separators.

Reran the compiler and evidence suites independently: **80 tests passed**. No unresolved
compiler correctness finding remains from this review. The learner editor and its preflight
integration still require their separate browser review.
