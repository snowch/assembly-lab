// Copyright © 2026 Christopher Snow

// Drafted separately from the compiler implementation and its supported-language brief.
import { COMPILER_LIMITS, type DiagnosticCode } from "./compiler";

export const COMPILER_DIAGNOSTICS: Record<DiagnosticCode, string> = {
  "source-limit": `The source is too long for this compiler. Keep it within ${COMPILER_LIMITS.characters} characters.`,
  "token-limit": `The source contains too many names, numbers and symbols. Simplify it to stay within the compiler’s ${COMPILER_LIMITS.tokens}-token limit.`,
  "unsupported-token":
    "This character or symbol is outside the course compiler’s C subset. Check the supported syntax and remove or replace it.",
  "unclosed-comment":
    "This block comment has no closing */. Close the comment before the end of the source.",
  "expected-token":
    "The syntax does not match the course compiler’s C subset at this position. Check the punctuation and the supported statement forms.",
  "expected-name":
    "Use a name made from letters, digits and underscores, starting with a letter or underscore. A C keyword cannot be a name.",
  "duplicate-name":
    "This name is already declared in the same block. Use the existing variable or choose a different name.",
  "unknown-name":
    "This variable is not available here. Declare it before use, check its spelling, and give a new local variable an initial value that does not refer to itself.",
  "variable-limit": `The function declares too many variables. Use at most ${COMPILER_LIMITS.variables} parameters and local variables in total.`,
  "parameter-limit": `This compiler supports at most ${COMPILER_LIMITS.parameters} function parameters. Reduce the parameter list.`,
  "literal-range":
    "This integer constant is outside the supported 32-bit unsigned range. Use a value from 0 to 4294967295.",
  "literal-type":
    "Use decimal or hexadecimal integer constants. Add u to a decimal constant above 2147483647. Octal constants are not supported, so remove a leading zero from a decimal number.",
  "nesting-limit": `The expressions or statements are nested too deeply for this compiler. Split them into simpler parts; its nesting limit is ${COMPILER_LIMITS.nesting}.`,
  "temporary-limit":
    "This expression needs more temporary registers than the compiler provides. Calculate part of it in a local variable first.",
  "instruction-limit": `The function produces too much assembly. Simplify it to stay within the compiler’s ${COMPILER_LIMITS.instructions}-line limit.`,
  "missing-return":
    "The compiler cannot establish a return on every path. Add an explicit return after the conditional or loop when a path can reach the end.",
  "division-zero": "This run would divide by zero. Check the divisor before using / or %.",
  "signed-overflow":
    "A signed calculation in this run has a result outside its type’s range. Change the calculation or its input checks before running it again.",
  "shift-range":
    "This run uses a shift count outside 0 to 31. Check the count before shifting a 32-bit value.",
  "signed-shift":
    "This compiler does not run a shift of a negative signed value. Check the value or use an appropriate unsigned expression.",
  "step-limit":
    "The run reached the evaluator’s step limit. Check that loops make progress and finish, or try a smaller input.",
  "argument-count": "The number of supplied inputs does not match the function’s parameter list.",
  "argument-range": "Each input must be a whole unsigned 32-bit value from 0 to 4294967295.",
};
