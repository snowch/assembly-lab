// Copyright © 2026 Christopher Snow

import { useHandoffState } from "./update-handoff";
import { useEffect } from "react";
import { compileC } from "@al/compiler";
import type { ChallengeEditorProps } from "@platform/lesson-runtime";
import { COMPILER_DIAGNOSTICS } from "../../compiler/src/strings";
import { COMPILER_STRINGS as C } from "./strings.compiler";
const KINDS = [
  "function",
  "declaration",
  "assignment",
  "return",
  "if",
  "else",
  "while",
  "for",
  "end",
] as const;
type Kind = (typeof KINDS)[number];
export interface CEditorConfig {
  signature: string;
  names: readonly string[];
}
export function statementText(
  kind: Kind,
  target: string,
  left: string,
  operator: string,
  right: string,
  signature: string,
): string {
  const expression = operator ? `${left} ${operator} ${right}` : left;
  switch (kind) {
    case "function":
      return `${signature}\n{`;
    case "declaration":
      return `    unsigned ${target} = ${expression};`;
    case "assignment":
      return `    ${target} = ${expression};`;
    case "return":
      return `    return ${expression};`;
    case "if":
      return `    if (${expression}) {`;
    case "else":
      return "    } else {";
    case "while":
      return `    while (${expression}) {`;
    case "for":
      return `    for (unsigned ${target} = 0; ${target} < ${right}; ${target}++) {`;
    case "end":
      return "}";
  }
}
export interface CStatement {
  kind: Kind;
  target?: string;
  left?: string;
  operator?: string;
  right?: string;
  number?: string;
}
/** Only load statements whose full text is represented by the available controls. */
export function parseCStatement(line: string, config: CEditorConfig): CStatement | null {
  const text = line.trim();
  if (text === config.signature) return { kind: "function" };
  if (text === "}") return { kind: "end" };
  if (/^}\s*else\s*{$/.test(text)) return { kind: "else" };
  const loop = /^for\s*\(unsigned\s+(\w+)\s*=\s*0;\s*\1\s*<\s*(\w+);\s*\1\+\+\)\s*{$/.exec(text);
  if (loop && config.names.includes(loop[1]!)) {
    const right = loop[2]!;
    if (config.names.includes(right)) return { kind: "for", target: loop[1], right };
    if (/^\d+$/.test(right))
      return { kind: "for", target: loop[1], right: "$number", number: right };
    return null;
  }
  let kind: Kind, target: string | undefined, expression: string;
  const declaration = /^unsigned\s+(\w+)\s*=\s*(.*);$/.exec(text);
  const assignment = /^(\w+)\s*=\s*(.*);$/.exec(text);
  const returned = /^return\s+(.*);$/.exec(text);
  const control = /^(if|while)\s*\((.*)\)\s*{$/.exec(text);
  if (declaration) {
    kind = "declaration";
    target = declaration[1];
    expression = declaration[2]!;
  } else if (assignment) {
    kind = "assignment";
    target = assignment[1];
    expression = assignment[2]!;
  } else if (returned) {
    kind = "return";
    expression = returned[1]!;
  } else if (control) {
    kind = control[1] as "if" | "while";
    expression = control[2]!;
  } else return null;
  if (target !== undefined && !config.names.includes(target)) return null;
  const expr = /^(\w+)(?:\s*(<<|>>|<=|>=|==|!=|[+\-*/%&|^<>])\s*(\w+))?$/.exec(expression.trim());
  if (!expr) return null;
  let number: string | undefined;
  const operand = (value: string | undefined): string | undefined => {
    if (value === undefined) return "$number";
    if (config.names.includes(value)) return value;
    if (!/^\d+$/.test(value) || (number !== undefined && number !== value)) return undefined;
    number = value;
    return "$number";
  };
  const left = operand(expr[1]),
    right = operand(expr[3]);
  if (left === undefined || right === undefined) return null;
  return { kind, target, left, right, operator: expr[2] ?? "", number };
}
export function CSourceEditor({
  source,
  onChange,
  config,
}: {
  source: string;
  onChange: (s: string) => void;
  config: CEditorConfig;
}) {
  const [mode, setMode] = useHandoffState<"text" | "templates">("CEditor.mode", "text"),
    [selected, setSelected] = useHandoffState("CEditor.selected", 0),
    [kind, setKind] = useHandoffState<Kind>("CEditor.kind", "return"),
    [target, setTarget] = useHandoffState("CEditor.target", config.names[0] ?? "value"),
    [left, setLeft] = useHandoffState("CEditor.left", config.names[0] ?? "value"),
    [right, setRight] = useHandoffState("CEditor.right", "$number"),
    [operator, setOperator] = useHandoffState("CEditor.operator", ""),
    [number, setNumber] = useHandoffState("CEditor.number", "0"),
    [canReplace, setCanReplace] = useHandoffState("CEditor.canReplace", true);
  const lines = source === "" ? [] : source.split("\n"),
    at = Math.min(selected, Math.max(0, lines.length - 1));
  const update = (next: string[]) => onChange(next.join("\n"));
  const options = [...new Set(config.names)];
  const operand = (value: string) => (value === "$number" ? number || "0" : value);
  const preview = statementText(
    kind,
    target,
    operand(left),
    operator,
    operand(right),
    config.signature,
  );
  const selectLine = (index: number) => {
    setSelected(index);
    if (!lines[index]?.trim()) {
      setCanReplace(true);
      return;
    }
    const statement = parseCStatement(lines[index]!, config);
    setCanReplace(statement !== null);
    if (!statement) return;
    setKind(statement.kind);
    if (statement.target !== undefined) setTarget(statement.target);
    if (statement.left !== undefined) setLeft(statement.left);
    if (statement.right !== undefined) setRight(statement.right);
    if (statement.operator !== undefined) setOperator(statement.operator);
    if (statement.number !== undefined) setNumber(statement.number);
  };
  useEffect(() => {
    if (mode === "templates") selectLine(at);
  }, [source, selected, mode]);
  const parsed = compileC(source);
  return (
    <div className="al-c-editor">
      <div className="al-controls" role="group" aria-label={C.editor.source}>
        <button
          type="button"
          className="button secondary"
          aria-pressed={mode === "text"}
          onClick={() => setMode("text")}
        >
          {C.editor.text}
        </button>
        <button
          type="button"
          className="button secondary"
          aria-pressed={mode === "templates"}
          onClick={() => {
            setMode("templates");
            const current = lines[at];
            const firstStatement = lines.findIndex((line) => {
              const parsed = parseCStatement(line, config);
              return (
                parsed !== null &&
                parsed.kind !== "function" &&
                parsed.kind !== "end" &&
                parsed.kind !== "else"
              );
            });
            const currentStatement = current ? parseCStatement(current, config) : null;
            selectLine(
              currentStatement !== null &&
                !["function", "end", "else"].includes(currentStatement.kind)
                ? at
                : Math.max(0, firstStatement),
            );
          }}
        >
          {C.editor.templates}
        </button>
      </div>
      {mode === "text" ? (
        <textarea
          className="asm-text"
          rows={Math.min(18, Math.max(5, lines.length + 1))}
          aria-label={C.editor.source}
          value={source}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <div>
          <ol className="al-c-lines" aria-label={C.editor.lines}>
            {lines.map((line, i) => (
              <li key={i}>
                <button
                  type="button"
                  className="button secondary"
                  aria-pressed={at === i}
                  aria-label={C.editor.line(i + 1, line)}
                  onClick={() => selectLine(i)}
                >
                  <code>{line || " "}</code>
                </button>
              </li>
            ))}
          </ol>
          {lines.length === 0 && <p>{C.editor.empty}</p>}
          <p>{C.editor.statementHelp}</p>
          {!canReplace && <p role="note">{C.editor.unsupportedLine}</p>}
          <div className="al-c-fields">
            <label>
              {C.editor.statement}
              <select
                aria-label={C.editor.statement}
                value={canReplace ? kind : ""}
                onChange={(e) => {
                  setKind(e.target.value as Kind);
                  setCanReplace(true);
                }}
              >
                {!canReplace && (
                  <option value="" disabled>
                    {C.editor.statement}
                  </option>
                )}
                {KINDS.map((k) => (
                  <option key={k} value={k}>
                    {C.editor.kinds[k]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {C.editor.target}
              <select
                aria-label={C.editor.target}
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              >
                {options.map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </label>
            {[
              { label: C.editor.left, value: left, set: setLeft },
              { label: C.editor.right, value: right, set: setRight },
            ].map((field) => (
              <label key={field.label}>
                {field.label}
                <select
                  aria-label={field.label}
                  value={field.value}
                  onChange={(e) => field.set(e.target.value)}
                >
                  {options.map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                  <option value="$number">{C.editor.useNumber}</option>
                </select>
              </label>
            ))}
            <label>
              {C.editor.operator}
              <select
                aria-label={C.editor.operator}
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
              >
                <option value="">{C.editor.noOperator}</option>
                {[
                  "+",
                  "-",
                  "*",
                  "/",
                  "%",
                  "&",
                  "|",
                  "^",
                  "<<",
                  ">>",
                  "==",
                  "!=",
                  "<",
                  "<=",
                  ">",
                  ">=",
                ].map((op) => (
                  <option key={op}>{op}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="al-controls" role="group" aria-label={C.editor.number}>
            <output>{number}</output>
            {["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => (
              <button
                type="button"
                className="button secondary"
                key={n}
                onClick={() => setNumber((v) => (v + n).replace(/^0+(?=\d)/, ""))}
              >
                {n}
              </button>
            ))}
            <button type="button" className="button secondary" onClick={() => setNumber("")}>
              {C.editor.clearNumber}
            </button>
          </div>
          {canReplace && (
            <div className="al-c-preview">
              <p>{C.editor.preview}</p>
              <pre>
                <code>{preview}</code>
              </pre>
            </div>
          )}
          <div className="al-controls">
            <button
              type="button"
              className="button primary"
              disabled={!canReplace}
              onClick={() => {
                const text = statementText(
                  kind,
                  target,
                  operand(left),
                  operator,
                  operand(right),
                  config.signature,
                );
                if (lines.length === 0) update(text.split("\n"));
                else {
                  const replaced =
                    kind === "function" &&
                    lines[at]!.trim() === config.signature &&
                    lines[at + 1]?.trim() === "{"
                      ? 2
                      : 1;
                  update([
                    ...lines.slice(0, at),
                    ...text.split("\n"),
                    ...lines.slice(at + replaced),
                  ]);
                }
              }}
            >
              {lines.length === 0 ? C.editor.applyEmpty : C.editor.apply}
            </button>
            <button
              type="button"
              className="button secondary"
              onClick={() => {
                const next =
                  lines.length === 0
                    ? [""]
                    : [...lines.slice(0, at + 1), "", ...lines.slice(at + 1)];
                setSelected(lines.length === 0 ? 0 : at + 1);
                setCanReplace(true);
                update(next);
              }}
            >
              {C.editor.addLine}
            </button>
            <button
              type="button"
              className="button secondary"
              disabled={lines.length === 0}
              onClick={() => {
                update(lines.filter((_, i) => i !== at));
                setSelected(Math.max(0, at - 1));
              }}
            >
              {C.editor.removeLine}
            </button>
            <button
              type="button"
              className="button secondary"
              disabled={at === 0 || lines.length === 0}
              onClick={() => {
                const next = [...lines];
                [next[at - 1], next[at]] = [next[at]!, next[at - 1]!];
                update(next);
                setSelected(at - 1);
              }}
            >
              {C.editor.up}
            </button>
            <button
              type="button"
              className="button secondary"
              disabled={at >= lines.length - 1}
              onClick={() => {
                const next = [...lines];
                [next[at + 1], next[at]] = [next[at]!, next[at + 1]!];
                update(next);
                setSelected(at + 1);
              }}
            >
              {C.editor.down}
            </button>
          </div>
        </div>
      )}
      {!parsed.ok && (
        <ul role="status" aria-label={C.playground.diagnostics}>
          {parsed.errors.map((d, i) => (
            <li key={i}>
              {C.playground.diagnostic(d.line, d.column, COMPILER_DIAGNOSTICS[d.code])}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export function CEditor({ challenge, artifact, onChange }: ChallengeEditorProps) {
  const raw = challenge.initial.data?.["cEditor"] as CEditorConfig | undefined;
  const config = raw ?? {
    signature: "unsigned result(unsigned value)",
    names: ["value", "total", "i"],
  };
  return (
    <CSourceEditor
      source={artifact.text ?? challenge.initial.text ?? ""}
      onChange={(text) => onChange({ ...artifact, text })}
      config={config}
    />
  );
}
