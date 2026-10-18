// Copyright © 2026 Christopher Snow

/** No DOM, network, eval, or generated JavaScript. Parsing, code generation and execution are bounded. */
export const COMPILER_LIMITS = {
  characters: 12000,
  tokens: 2000,
  nesting: 32,
  variables: 8,
  parameters: 4,
  instructions: 2000,
  steps: 10000,
} as const;
export type DiagnosticCode =
  | "source-limit"
  | "token-limit"
  | "unsupported-token"
  | "unclosed-comment"
  | "expected-token"
  | "expected-name"
  | "duplicate-name"
  | "unknown-name"
  | "variable-limit"
  | "parameter-limit"
  | "literal-range"
  | "literal-type"
  | "nesting-limit"
  | "temporary-limit"
  | "instruction-limit"
  | "missing-return"
  | "division-zero"
  | "signed-overflow"
  | "shift-range"
  | "signed-shift"
  | "step-limit"
  | "argument-count"
  | "argument-range";
export interface Diagnostic {
  line: number;
  column: number;
  code: DiagnosticCode;
}
interface Token {
  text: string;
  line: number;
  column: number;
}
type CType = "int" | "unsigned";
type Expr = (
  | { kind: "literal"; value: number }
  | { kind: "variable"; slot: number }
  | { kind: "unary"; op: string; child: Expr }
  | { kind: "binary"; op: string; left: Expr; right: Expr }
) & { token: Token; type: CType };
type Statement = (
  | { kind: "block"; statements: Statement[] }
  | { kind: "assign"; slot: number; value: Expr }
  | { kind: "return"; value: Expr }
  | { kind: "if"; condition: Expr; yes: Statement; no?: Statement }
  | { kind: "while"; condition: Expr; body: Statement }
  | { kind: "for"; init: Statement; condition: Expr; increment: Statement; body: Statement }
) & { token: Token };
export interface CompiledC {
  ok: true;
  name: string;
  parameters: string[];
  listing: string;
  lineMap: { assemblyLine: number; cLine: number }[];
  ast: Statement;
}
export type CompileResult = CompiledC | { ok: false; errors: Diagnostic[] };
export type Evaluation =
  { ok: true; value: number; steps: number } | { ok: false; error: Diagnostic; steps: number };
class Failure extends Error {
  readonly diagnostic: Diagnostic;
  constructor(diagnostic: Diagnostic) {
    super(diagnostic.code);
    this.diagnostic = diagnostic;
  }
}
function fail(token: Token, code: DiagnosticCode): never {
  throw new Failure({ line: token.line, column: token.column, code });
}
const origin = { text: "", line: 1, column: 1 };
const keywords = new Set(
  "auto break case char const continue default do double else enum extern float for goto if inline int long register restrict return short signed sizeof static struct switch typedef union unsigned void volatile while _Alignas _Alignof _Atomic _Bool _Complex _Generic _Imaginary _Noreturn _Static_assert _Thread_local alignas alignof bool constexpr false nullptr static_assert thread_local true typeof typeof_unqual _BitInt".split(
    " ",
  ),
);
function lex(source: string): Token[] {
  if (source.length > COMPILER_LIMITS.characters) fail(origin, "source-limit");
  // C removes escaped newlines before recognising comments or tokens. This subset
  // rejects splicing, even inside comments, rather than changing C's token stream.
  const splice = /\\(?:\r\n|\n|\r)/.exec(source);
  if (splice) {
    const before = source.slice(0, splice.index).split(/\r\n|\r|\n/);
    fail(
      { text: "\\", line: before.length, column: before.at(-1)!.length + 1 },
      "unsupported-token",
    );
  }
  const tokens: Token[] = [];
  let offset = 0,
    line = 1,
    column = 1;
  const advance = (text: string) => {
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (c === "\n" || (c === "\r" && text[i + 1] !== "\n")) {
        line++;
        column = 1;
      } else column++;
    }
    offset += text.length;
  };
  while (offset < source.length) {
    const rest = source.slice(offset),
      token = { text: "", line, column };
    const space = /^[ \t\r\n\v\f]+/.exec(rest);
    if (space) {
      advance(space[0]);
      continue;
    }
    if (rest.startsWith("//")) {
      advance(rest.split(/[\r\n]/)[0]!);
      continue;
    }
    if (rest.startsWith("/*")) {
      const end = rest.indexOf("*/", 2);
      if (end < 0) fail(token, "unclosed-comment");
      advance(rest.slice(0, end + 2));
      continue;
    }
    const match =
      /^(?:[a-zA-Z_][a-zA-Z_0-9]*|0[xX][0-9a-fA-F]+[uU]?|[0-9]+[uU]?|==|!=|<=|>=|\+\+|--|<<|>>|[{}();,+\-*\/%&|^~!<>=])/.exec(
        rest,
      );
    if (!match) fail(token, "unsupported-token");
    token.text = match[0];
    tokens.push(token);
    advance(token.text);
    if (tokens.length > COMPILER_LIMITS.tokens) fail(token, "token-limit");
  }
  tokens.push({ text: "", line, column });
  return tokens;
}
const precedence: Record<string, number> = {
  "|": 1,
  "^": 2,
  "&": 3,
  "==": 4,
  "!=": 4,
  "<": 5,
  "<=": 5,
  ">": 5,
  ">=": 5,
  "<<": 6,
  ">>": 6,
  "+": 7,
  "-": 7,
  "*": 8,
  "/": 8,
  "%": 8,
};
const comparison = new Set(["==", "!=", "<", "<=", ">", ">="]);
class Parser {
  private pos = 0;
  private depth = 0;
  private slots = 0;
  private scopes = [new Map<string, number>()];
  private tokens: Token[];
  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }
  private get current(): Token {
    return this.tokens[this.pos]!;
  }
  private take(text: string): Token {
    const token = this.current;
    if (token.text !== text) fail(token, "expected-token");
    this.pos++;
    return token;
  }
  private accept(text: string): boolean {
    if (this.current.text !== text) return false;
    this.pos++;
    return true;
  }
  private name(): Token {
    const token = this.current;
    if (!/^[a-zA-Z_][a-zA-Z_0-9]*$/.test(token.text) || keywords.has(token.text))
      fail(token, "expected-name");
    this.pos++;
    return token;
  }
  private bind(token: Token): number {
    const scope = this.scopes.at(-1)!;
    if (scope.has(token.text)) fail(token, "duplicate-name");
    if (this.slots >= COMPILER_LIMITS.variables) fail(token, "variable-limit");
    const slot = this.slots++;
    scope.set(token.text, slot);
    return slot;
  }
  private lookup(token: Token): number {
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      const slot = this.scopes[i]!.get(token.text);
      if (slot !== undefined) return slot;
    }
    return fail(token, "unknown-name");
  }
  private nested<T>(fn: () => T): T {
    if (++this.depth > COMPILER_LIMITS.nesting) fail(this.current, "nesting-limit");
    try {
      return fn();
    } finally {
      this.depth--;
    }
  }
  private unsigned(): void {
    this.take("unsigned");
    this.accept("int");
  }
  parse(): { name: string; parameters: string[]; ast: Statement } {
    this.unsigned();
    const name = this.name().text;
    this.take("(");
    const parameters: string[] = [];
    if (!this.accept("void") && this.current.text !== ")") {
      do {
        this.unsigned();
        const param = this.name();
        if (parameters.length >= COMPILER_LIMITS.parameters) fail(param, "parameter-limit");
        this.bind(param);
        parameters.push(param.text);
      } while (this.accept(","));
    }
    this.take(")");
    const ast = this.block(false);
    this.take("");
    if (!returns(ast)) fail(ast.token, "missing-return");
    return { name, parameters, ast };
  }
  private block(newScope = true): Statement {
    const token = this.take("{");
    if (newScope) this.scopes.push(new Map());
    const statements: Statement[] = [];
    while (this.current.text !== "}") {
      if (this.current.text === "") fail(this.current, "expected-token");
      statements.push(this.statement(true));
    }
    this.take("}");
    if (newScope) this.scopes.pop();
    return { kind: "block", statements, token };
  }
  private assignment(declaration: boolean, increment = false): Statement {
    const token = this.current;
    if (declaration) this.unsigned();
    const name = this.name();
    // A declaration's name is in scope in its initializer. Reject reads of that
    // not-yet-initialised object, including an attempted reference to a shadowed name.
    let slot: number;
    let value: Expr;
    if (declaration) {
      slot = this.bind(name);
      this.take("=");
      value = this.expression();
      if (uses(value, slot)) fail(name, "unknown-name");
    } else {
      slot = this.lookup(name);
      if (increment && (this.current.text === "++" || this.current.text === "--")) {
        const op = this.current.text === "++" ? "+" : "-";
        this.pos++;
        value = {
          kind: "binary",
          op,
          left: { kind: "variable", slot, type: "unsigned", token: name },
          right: { kind: "literal", value: 1, type: "int", token },
          type: "unsigned",
          token,
        };
      } else {
        this.take("=");
        value = this.expression();
      }
    }
    return { kind: "assign", slot, value, token };
  }
  private statement(inBlock = false): Statement {
    return this.nested(() => {
      const token = this.current;
      if (token.text === "{") return this.block();
      if (this.accept("return")) {
        const value = this.expression();
        this.take(";");
        return { kind: "return", value, token };
      }
      if (this.accept("if")) {
        this.take("(");
        const condition = this.expression();
        this.take(")");
        const yes = this.statement();
        const no = this.accept("else") ? this.statement() : undefined;
        return { kind: "if", condition, yes, no, token };
      }
      if (this.accept("while")) {
        this.take("(");
        const condition = this.expression();
        this.take(")");
        return { kind: "while", condition, body: this.statement(), token };
      }
      if (this.accept("for")) {
        this.scopes.push(new Map());
        this.take("(");
        const init = this.assignment(this.current.text === "unsigned");
        this.take(";");
        const condition = this.expression();
        this.take(";");
        const increment = this.assignment(false, true);
        this.take(")");
        const body = this.statement();
        this.scopes.pop();
        return { kind: "for", init, condition, increment, body, token };
      }
      const declaration = token.text === "unsigned";
      if (declaration && !inBlock) fail(token, "expected-token");
      const statement = this.assignment(declaration, true);
      this.take(";");
      return statement;
    });
  }
  private expression(min = 1): Expr {
    return this.nested(() => {
      let left = this.primary();
      while ((precedence[this.current.text] ?? 0) >= min) {
        const token = this.current;
        this.pos++;
        const right = this.expression(precedence[token.text]! + 1);
        const type = comparison.has(token.text)
          ? "int"
          : token.text === "<<" || token.text === ">>"
            ? left.type
            : left.type === "unsigned" || right.type === "unsigned"
              ? "unsigned"
              : "int";
        left = { kind: "binary", op: token.text, left, right, type, token };
      }
      return left;
    });
  }
  private primary(): Expr {
    const token = this.current;
    if (this.accept("(")) {
      const value = this.expression();
      this.take(")");
      return value;
    }
    if (token.text === "!" || token.text === "~") {
      this.pos++;
      const child = this.nested(() => this.primary());
      return {
        kind: "unary",
        op: token.text,
        child,
        type: token.text === "!" ? "int" : child.type,
        token,
      };
    }
    if (/^[0-9]/.test(token.text)) {
      this.pos++;
      const unsigned = /u$/i.test(token.text);
      const raw = token.text.replace(/u$/i, "");
      if (/^0[0-9]/.test(raw)) fail(token, "literal-type"); // Octal is deliberately outside this subset.
      const value = Number(raw);
      if (!Number.isSafeInteger(value) || value > 0xffffffff) fail(token, "literal-range");
      if (!unsigned && value > 0x7fffffff && !/^0x/i.test(raw)) fail(token, "literal-type");
      return {
        kind: "literal",
        value,
        type: unsigned || value > 0x7fffffff ? "unsigned" : "int",
        token,
      };
    }
    const name = this.name();
    return { kind: "variable", slot: this.lookup(name), type: "unsigned", token };
  }
}
function uses(expr: Expr, slot: number): boolean {
  return expr.kind === "variable"
    ? expr.slot === slot
    : expr.kind === "unary"
      ? uses(expr.child, slot)
      : expr.kind === "binary"
        ? uses(expr.left, slot) || uses(expr.right, slot)
        : false;
}
function returns(stmt: Statement): boolean {
  return (
    stmt.kind === "return" ||
    (stmt.kind === "block" && stmt.statements.some(returns)) ||
    (stmt.kind === "if" && returns(stmt.yes) && stmt.no !== undefined && returns(stmt.no))
  );
}

class Generator {
  private lines: string[] = [];
  private map: { assemblyLine: number; cLine: number }[] = [];
  private labels = 0;
  private emit(text: string, token: Token): void {
    if (this.lines.length >= COMPILER_LIMITS.instructions) fail(token, "instruction-limit");
    this.lines.push(text);
    this.map.push({ assemblyLine: this.lines.length, cLine: token.line });
  }
  private label(): string {
    return `.Lcourse${this.labels++}`;
  }
  private expression(expr: Expr, register = 8): void {
    if (register > 16) fail(expr.token, "temporary-limit");
    const dest = `w${register}`,
      next = `w${register + 1}`;
    const emit = (text: string) => this.emit(`    ${text}`, expr.token);
    if (expr.kind === "literal") {
      emit(`movz ${dest}, #${expr.value & 0xffff}`);
      const high = expr.value >>> 16;
      if (high) emit(`movk ${dest}, #${high}, lsl #16`);
      return;
    }
    if (expr.kind === "variable") {
      emit(`mov ${dest}, w${expr.slot}`);
      return;
    }
    if (expr.kind === "unary") {
      this.expression(expr.child, register);
      if (expr.op === "~") emit(`mvn ${dest}, ${dest}`);
      else {
        emit(`cmp ${dest}, #0`);
        emit(`cset ${dest}, eq`);
      }
      return;
    }
    this.expression(expr.left, register);
    this.expression(expr.right, register + 1);
    const simple: Record<string, string> = {
      "+": "add",
      "-": "sub",
      "*": "mul",
      "&": "and",
      "|": "orr",
      "^": "eor",
      "<<": "lsl",
      ">>": expr.left.type === "unsigned" ? "lsr" : "asr",
    };
    if (simple[expr.op]) {
      emit(`${simple[expr.op]} ${dest}, ${dest}, ${next}`);
      return;
    }
    const unsigned = expr.left.type === "unsigned" || expr.right.type === "unsigned";
    if (expr.op === "/") {
      emit(`${unsigned ? "udiv" : "sdiv"} ${dest}, ${dest}, ${next}`);
      return;
    }
    if (expr.op === "%") {
      emit(`${unsigned ? "udiv" : "sdiv"} w17, ${dest}, ${next}`);
      emit(`msub ${dest}, w17, ${next}, ${dest}`);
      return;
    }
    const conditions: Record<string, string> = {
      "==": "eq",
      "!=": "ne",
      "<": unsigned ? "cc" : "lt",
      "<=": unsigned ? "ls" : "le",
      ">": unsigned ? "hi" : "gt",
      ">=": unsigned ? "cs" : "ge",
    };
    emit(`cmp ${dest}, ${next}`);
    emit(`cset ${dest}, ${conditions[expr.op]}`);
  }
  private statement(stmt: Statement): void {
    const emit = (text: string) => this.emit(text, stmt.token);
    if (stmt.kind === "block") {
      for (const item of stmt.statements) this.statement(item);
      return;
    }
    if (stmt.kind === "assign" || stmt.kind === "return") {
      this.expression(stmt.value);
      emit(`    mov w${stmt.kind === "assign" ? stmt.slot : 0}, w8`);
      if (stmt.kind === "return") emit("    ret");
      return;
    }
    if (stmt.kind === "if") {
      const otherwise = this.label(),
        end = this.label();
      this.expression(stmt.condition);
      emit(`    cbz w8, ${otherwise}`);
      this.statement(stmt.yes);
      emit(`    b ${end}`);
      emit(`${otherwise}:`);
      if (stmt.no) this.statement(stmt.no);
      emit(`${end}:`);
      return;
    }
    const start = this.label(),
      end = this.label();
    if (stmt.kind === "for") this.statement(stmt.init);
    emit(`${start}:`);
    this.expression(stmt.condition);
    emit(`    cbz w8, ${end}`);
    this.statement(stmt.body);
    if (stmt.kind === "for") this.statement(stmt.increment);
    emit(`    b ${start}`);
    emit(`${end}:`);
  }
  generate(
    name: string,
    ast: Statement,
  ): { listing: string; lineMap: { assemblyLine: number; cLine: number }[] } {
    this.emit(`${name}:`, ast.token);
    this.statement(ast);
    return { listing: this.lines.join("\n"), lineMap: this.map };
  }
}
export function compileC(source: string): CompileResult {
  try {
    const parsed = new Parser(lex(source)).parse();
    return { ok: true, ...parsed, ...new Generator().generate(parsed.name, parsed.ast) };
  } catch (error) {
    if (error instanceof Failure) return { ok: false, errors: [error.diagnostic] };
    throw error;
  }
}

/** A direct AST evaluator, independent of instruction generation and machine execution. */
export function interpretC(
  compiled: CompiledC,
  args: readonly number[],
  options: { maxSteps?: number } = {},
): Evaluation {
  let steps = 0;
  const budget = Math.max(
    1,
    Math.min(COMPILER_LIMITS.steps, Math.floor(options.maxSteps ?? COMPILER_LIMITS.steps)),
  );
  const tick = (token: Token) => {
    if (++steps > budget || !Number.isFinite(budget)) fail(token, "step-limit");
  };
  try {
    if (args.length !== compiled.parameters.length) fail(origin, "argument-count");
    if (args.some((a) => !Number.isInteger(a) || a < 0 || a > 0xffffffff))
      fail(origin, "argument-range");
    const values = [...args];
    const evaluate = (expr: Expr): number => {
      tick(expr.token);
      if (expr.kind === "literal") return expr.value;
      if (expr.kind === "variable") return values[expr.slot]!;
      if (expr.kind === "unary") {
        const value = evaluate(expr.child);
        return expr.op === "!" ? +!value : expr.type === "unsigned" ? ~value >>> 0 : ~value;
      }
      const unsigned = expr.left.type === "unsigned" || expr.right.type === "unsigned";
      const first = evaluate(expr.left),
        second = evaluate(expr.right);
      const a = unsigned ? first >>> 0 : first | 0,
        b = unsigned ? second >>> 0 : second | 0;
      if ((expr.op === "/" || expr.op === "%") && b === 0) fail(expr.token, "division-zero");
      if ((expr.op === "/" || expr.op === "%") && !unsigned && a === -2147483648 && b === -1)
        fail(expr.token, "signed-overflow");
      let value: number;
      switch (expr.op) {
        case "+":
          value = a + b;
          break;
        case "-":
          value = a - b;
          break;
        case "*": {
          const exact = BigInt(a) * BigInt(b);
          if (unsigned) return Number(BigInt.asUintN(32, exact));
          if (exact < -2147483648n || exact > 2147483647n) fail(expr.token, "signed-overflow");
          return Number(exact);
        }
        case "/":
          value = Math.trunc(a / b);
          break;
        case "%":
          value = a % b;
          break;
        case "&":
          value = a & b;
          break;
        case "|":
          value = a | b;
          break;
        case "^":
          value = a ^ b;
          break;
        case "==":
          return +(a === b);
        case "!=":
          return +(a !== b);
        case "<":
          return +(a < b);
        case "<=":
          return +(a <= b);
        case ">":
          return +(a > b);
        case ">=":
          return +(a >= b);
        case "<<":
        case ">>": {
          if (second < 0 || second > 31) fail(expr.token, "shift-range");
          if (expr.left.type === "int" && first < 0) fail(expr.token, "signed-shift");
          if (expr.op === ">>")
            return expr.left.type === "unsigned" ? first >>> second : first >> second;
          const exact = BigInt(first) << BigInt(second);
          if (expr.left.type === "int" && exact > 2147483647n) fail(expr.token, "signed-overflow");
          return Number(BigInt.asUintN(32, exact));
        }
        default:
          throw new Error("Invalid compiler AST operator");
      }
      if (expr.type === "unsigned") return value >>> 0;
      if (value < -2147483648 || value > 2147483647) fail(expr.token, "signed-overflow");
      return value | 0;
    };
    const execute = (stmt: Statement): number | undefined => {
      tick(stmt.token);
      if (stmt.kind === "block") {
        for (const child of stmt.statements) {
          const result = execute(child);
          if (result !== undefined) return result;
        }
        return;
      }
      if (stmt.kind === "assign") {
        values[stmt.slot] = evaluate(stmt.value) >>> 0;
        return;
      }
      if (stmt.kind === "return") return evaluate(stmt.value) >>> 0;
      if (stmt.kind === "if")
        return evaluate(stmt.condition)
          ? execute(stmt.yes)
          : stmt.no
            ? execute(stmt.no)
            : undefined;
      if (stmt.kind === "for") execute(stmt.init);
      while (evaluate(stmt.condition)) {
        const result = execute(stmt.body);
        if (result !== undefined) return result;
        if (stmt.kind === "for") execute(stmt.increment);
      }
      return;
    };
    const value = execute(compiled.ast);
    if (value === undefined) fail(compiled.ast.token, "missing-return");
    return { ok: true, value, steps };
  } catch (error) {
    if (error instanceof Failure) return { ok: false, error: error.diagnostic, steps };
    throw error;
  }
}
