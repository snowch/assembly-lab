// Copyright © 2026 Christopher Snow

// The editor for a challenge whose artifact is assembly text, with two modes over the one text.
// Text is for a keyboard: a monospaced box with autocorrect, capitalisation and spellcheck off, and
// a bar that types the characters assembly needs. Tap is for a touch screen: the program as a list
// of lines; a tapped line opens, its instruction is chosen from chips holding only the instructions
// the challenge allows, each operand from chips holding only the registers it offers or from a
// number pad, and lines are added, deleted and moved with buttons. The learner switches at any
// time and loses nothing, because the text is the only state. The assembler runs on the text as it
// changes and each error is shown against its line, in the machine's own sentence.

import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";

import { assemble, type AsmError } from "@al/machine";
import type { ChallengeEditorProps } from "@platform/lesson-runtime";

import { EditorKeysSchema, introducedOf } from "./interactives/props";
import { errorSentence } from "./messages";
import { withCode } from "./parts";
import { VIEW_STRINGS as S } from "./strings";
import {
  CONDITIONS,
  SHIFTS,
  labelNameOf,
  linesOf,
  lineText,
  negated,
  numberOf,
  parseLine,
  replaceLine,
  slotsOf,
  textOf,
  withDigit,
  withInstruction,
  withOperand,
  withoutLastDigit,
  type Line,
} from "./tap";

type Mode = "text" | "tap";

const MODE_KEY = "assembly-lab:v1:editor-mode";

/** The mode last used in this browser, if it can be read; the keyboard's mode otherwise. */
function rememberedMode(): Mode {
  try {
    return localStorage.getItem(MODE_KEY) === "tap" ? "tap" : "text";
  } catch {
    return "text";
  }
}

function remember(mode: Mode): void {
  try {
    localStorage.setItem(MODE_KEY, mode);
  } catch {
    // Blocked storage: the mode lasts for the visit.
  }
}

/** The characters assembly needs that a phone's keyboard hides behind other screens. */
export const SYMBOLS = [",", "[", "]", "#", "!", "w", "x"] as const;

/** A button that does not take focus from the box it types into, so the keyboard stays up. */
const keepFocus = (e: React.MouseEvent) => e.preventDefault();

function Problems({ errors }: { errors: readonly AsmError[] }) {
  if (errors.length === 0) return null;
  return (
    <ul className="asm-problems" aria-label={S.editor.problems}>
      {errors.map((e, i) => (
        <li key={i} data-line={e.line}>
          {withCode(S.editor.lineProblem(e.line, errorSentence(e)))}
        </li>
      ))}
    </ul>
  );
}

function TextMode({
  text,
  setText,
  errors,
  symbols,
}: {
  text: string;
  setText: (text: string) => void;
  errors: readonly AsmError[];
  symbols: readonly string[];
}) {
  const box = useRef<HTMLTextAreaElement>(null);
  const cursor = useRef<number | null>(null);
  // After an insertion the box is redrawn with the new text, which moves its cursor to the end.
  // Put it back just after the inserted character.
  useLayoutEffect(() => {
    const el = box.current;
    if (el && cursor.current !== null) {
      el.focus();
      el.setSelectionRange(cursor.current, cursor.current);
      cursor.current = null;
    }
  });
  const insert = (char: string) => {
    const el = box.current;
    const start = el?.selectionStart ?? text.length;
    const end = el?.selectionEnd ?? start;
    cursor.current = start + char.length;
    setText(text.slice(0, start) + char + text.slice(end));
  };
  return (
    <div className="asm-text-mode">
      <div className="asm-bar" role="group" aria-label={S.editor.symbols}>
        {symbols.map((c) => (
          <button
            key={c}
            type="button"
            className="button secondary asm-key"
            aria-label={S.editor.insert(c)}
            onMouseDown={keepFocus}
            onClick={() => insert(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <textarea
        ref={box}
        className="asm-text"
        aria-label={S.editor.textLabel}
        aria-invalid={errors.length > 0}
        value={text}
        rows={Math.max(4, linesOf(text).length + 1)}
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
        onChange={(e) => setText(e.target.value)}
      />
      <Problems errors={errors} />
    </div>
  );
}

function Chip({
  pressed,
  onClick,
  children,
  label,
}: {
  pressed: boolean;
  onClick: () => void;
  children: ReactNode;
  label?: string;
}) {
  return (
    <button
      type="button"
      className="chip"
      aria-pressed={pressed}
      {...(label ? { "aria-label": label } : {})}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function NumberPad({
  digits,
  onDigits,
  signed = false,
}: {
  digits: string;
  onDigits: (digits: string) => void;
  /** Offers a key that changes the number's sign: for a mask, which may be negative. */
  signed?: boolean;
}) {
  return (
    <div className="numpad" role="group" aria-label={S.editor.numberPad}>
      <output className="numpad-shown">{S.editor.numberShown(digits)}</output>
      <div className="numpad-keys">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
          <button
            key={d}
            type="button"
            className="button secondary"
            onClick={() => onDigits(withDigit(digits, d))}
          >
            {d}
          </button>
        ))}
        <button
          type="button"
          className="button secondary"
          aria-label={S.editor.clearNumber}
          onClick={() => onDigits("")}
        >
          C
        </button>
        <button
          type="button"
          className="button secondary"
          onClick={() => onDigits(withDigit(digits, "0"))}
        >
          0
        </button>
        <button
          type="button"
          className="button secondary"
          aria-label={S.editor.deleteDigit}
          onClick={() => onDigits(withoutLastDigit(digits))}
        >
          ⌫
        </button>
        {signed && (
          <button
            type="button"
            className="button secondary numpad-sign"
            aria-label={S.tap.sign}
            onClick={() => onDigits(negated(digits))}
          >
            +/−
          </button>
        )}
      </div>
    </div>
  );
}

/** The editor for one line: chips for the instruction and for each operand. */
function LineEditor({
  n,
  text,
  instructions,
  registers,
  numberPad,
  labels,
  conditions,
  addresses,
  extensions,
  count,
  onText,
  onAdd,
  onRemove,
  onMove,
  onDone,
}: {
  n: number;
  text: string;
  instructions: readonly string[];
  registers: readonly string[];
  numberPad: boolean;
  /** The labels the editor offers, as a branch writes them; each is also a line that defines it. */
  labels: readonly string[];
  /** The conditions offered for the last item of `csel` and `cset`. */
  conditions: readonly string[];
  addresses: readonly string[];
  extensions: readonly string[];
  count: number;
  onText: (text: string) => void;
  onAdd: () => void;
  onRemove: () => void;
  onMove: (by: -1 | 1) => void;
  onDone: () => void;
}) {
  const line = parseLine(text);
  const slots = instructions.includes(line.mnemonic)
    ? slotsOf(line.mnemonic, extensions.length > 0)
    : undefined;
  const isLabelLine = labelNameOf(text) !== null;
  // The number pad is open for an operand that is a number, or after the learner asks for it.
  const [padFor, setPadFor] = useState<number | null>(null);
  const set = (next: Line) => onText(lineText(next));
  return (
    <div className="asm-line-editor" role="group" aria-label={S.editor.editing(n)}>
      <div className="asm-field" role="group" aria-label={S.editor.instruction}>
        <span className="asm-field-label">{S.editor.instruction}</span>
        <div className="asm-chips">
          {instructions.map((m) => (
            <Chip
              key={m}
              pressed={line.mnemonic === m}
              onClick={() => {
                setPadFor(null);
                set(withInstruction(line, m, extensions.length > 0));
              }}
            >
              {m}
            </Chip>
          ))}
          {labels.map((name) => (
            <Chip
              key={name}
              pressed={line.mnemonic === `${name}:`}
              onClick={() => {
                setPadFor(null);
                set(withInstruction(line, `${name}:`));
              }}
            >
              {`${name}:`}
            </Chip>
          ))}
        </div>
      </div>
      {line.mnemonic !== "" && slots === undefined && !isLabelLine && (
        <p className="asm-note" role="note">
          {S.editor.notEditable}
        </p>
      )}
      {(slots ?? []).map((slot, j) => {
        const operand = line.operands[j] ?? "";
        const digits = numberOf(operand, slot === "registerOrMask");
        const takesNumber = (slot === "registerOrNumber" || slot === "registerOrMask") && numberPad;
        // A number is always open for a slot that can only be a number.
        const open = slot === "number" || (takesNumber && (digits !== null || padFor === j));
        if (["label", "condition", "address", "extension"].includes(slot)) {
          const names =
            slot === "label"
              ? labels
              : slot === "condition"
                ? conditions
                : slot === "address"
                  ? addresses
                  : extensions;
          return (
            <div key={j} className="asm-field" role="group" aria-label={S.editor.operand(j + 1)}>
              <span className="asm-field-label">{S.editor.operand(j + 1)}</span>
              <div className="asm-chips">
                {names.map((name) => (
                  <Chip
                    key={name}
                    pressed={operand === name}
                    onClick={() => set(withOperand(line, j, operand === name ? "" : name))}
                  >
                    {name}
                  </Chip>
                ))}
              </div>
            </div>
          );
        }
        if (slot === "shift") {
          return (
            <div key={j} className="asm-field" role="group" aria-label={S.editor.operand(j + 1)}>
              <span className="asm-field-label">{S.editor.operand(j + 1)}</span>
              <div className="asm-chips">
                {SHIFTS.map((shift) => (
                  <Chip
                    key={shift}
                    pressed={operand.toLowerCase().replace(/\s+/g, " ") === shift}
                    onClick={() => set(withOperand(line, j, operand === shift ? "" : shift))}
                  >
                    {shift}
                  </Chip>
                ))}
              </div>
            </div>
          );
        }
        return (
          <div key={j} className="asm-field" role="group" aria-label={S.editor.operand(j + 1)}>
            <span className="asm-field-label">{S.editor.operand(j + 1)}</span>
            <div className="asm-chips">
              {(slot === "number" ? [] : registers).map((r) => (
                <Chip
                  key={r}
                  pressed={operand.toLowerCase() === r}
                  onClick={() => {
                    setPadFor(null);
                    set(withOperand(line, j, r));
                  }}
                >
                  {r}
                </Chip>
              ))}
              {takesNumber && (
                <Chip
                  pressed={open}
                  onClick={() => {
                    if (open) {
                      setPadFor(null);
                      set(withOperand(line, j, ""));
                    } else setPadFor(j);
                  }}
                >
                  {S.editor.number}
                </Chip>
              )}
            </div>
            {open && (
              <NumberPad
                digits={digits ?? ""}
                signed={slot === "registerOrMask"}
                onDigits={(d) => {
                  // The pad stays open when the last digit goes, so a number can be replaced.
                  setPadFor(j);
                  set(withOperand(line, j, d === "" ? "" : `#${d}`));
                }}
              />
            )}
          </div>
        );
      })}
      <div className="asm-actions">
        <button type="button" className="button secondary" onClick={onAdd}>
          {S.editor.addBelow}
        </button>
        <button
          type="button"
          className="button secondary"
          disabled={n === 1}
          onClick={() => onMove(-1)}
        >
          {S.editor.up}
        </button>
        <button
          type="button"
          className="button secondary"
          disabled={n === count}
          onClick={() => onMove(1)}
        >
          {S.editor.down}
        </button>
        <button type="button" className="button danger" onClick={onRemove}>
          {S.editor.remove}
        </button>
        <button type="button" className="button primary" onClick={onDone}>
          {S.editor.done}
        </button>
      </div>
    </div>
  );
}

function TapMode({
  lines,
  setLines,
  errors,
  instructions,
  registers,
  numberPad,
  labels,
  conditions,
  addresses,
  extensions,
}: {
  lines: readonly string[];
  setLines: (lines: string[]) => void;
  errors: readonly AsmError[];
  instructions: readonly string[];
  registers: readonly string[];
  numberPad: boolean;
  labels: readonly string[];
  conditions: readonly string[];
  addresses: readonly string[];
  extensions: readonly string[];
}) {
  const [open, setOpen] = useState<number | null>(null);
  const replace = (i: number, text: string) => setLines(replaceLine(lines, i, text));
  const insertBelow = (i: number) => {
    const next = [...lines];
    next.splice(i + 1, 0, "");
    setLines(next);
    setOpen(i + 1);
  };
  const remove = (i: number) => {
    setLines(lines.filter((_, k) => k !== i));
    setOpen(null);
  };
  const move = (i: number, by: -1 | 1) => {
    const j = i + by;
    const next = [...lines];
    const a = next[i];
    const b = next[j];
    if (a === undefined || b === undefined) return;
    next[i] = b;
    next[j] = a;
    setLines(next);
    setOpen(j);
  };
  return (
    <div className="asm-tap">
      {lines.length === 0 ? (
        <p className="asm-note">{S.editor.noLines}</p>
      ) : (
        <ol className="asm-lines" aria-label={S.editor.lines}>
          {lines.map((text, i) => {
            const mine = errors.filter((e) => e.line === i + 1);
            return (
              <li key={i} className="asm-line" data-line={i + 1} data-open={open === i}>
                <button
                  type="button"
                  className="asm-line-button"
                  aria-expanded={open === i}
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span className="asm-ln">{i + 1}</span>
                  <code>{text.trim() === "" ? S.editor.emptyLine : text}</code>
                </button>
                {mine.map((e, k) => (
                  <p key={k} className="asm-error">
                    {withCode(errorSentence(e))}
                  </p>
                ))}
                {open === i && (
                  <LineEditor
                    n={i + 1}
                    text={text}
                    instructions={instructions}
                    registers={registers}
                    numberPad={numberPad}
                    labels={labels}
                    conditions={conditions}
                    addresses={addresses}
                    extensions={extensions}
                    count={lines.length}
                    onText={(t) => replace(i, t)}
                    onAdd={() => insertBelow(i)}
                    onRemove={() => remove(i)}
                    onMove={(by) => move(i, by)}
                    onDone={() => setOpen(null)}
                  />
                )}
              </li>
            );
          })}
        </ol>
      )}
      {lines.length === 0 && (
        <button
          type="button"
          className="button secondary"
          onClick={() => {
            setLines([""]);
            setOpen(0);
          }}
        >
          {S.editor.addFirst}
        </button>
      )}
    </div>
  );
}

export const AssemblyEditor: ComponentType<ChallengeEditorProps> = ({
  challenge,
  artifact,
  onChange,
}) => {
  const text = artifact.text ?? challenge.initial.text ?? "";
  // The chips: the instructions the challenge allows, a conditional branch under each condition.
  const allowed = challenge.allowedConstructs;
  // The challenge may choose its keys (`initial.data.editor`); without, the editor offers all.
  const keys = EditorKeysSchema.safeParse(challenge.initial.data?.["editor"]);
  const chosen = keys.success ? keys.data : {};
  const registers = chosen.registers ?? challenge.palette;
  const symbols = chosen.symbols ?? SYMBOLS;
  const numberPad = chosen.numberPad ?? true;
  const labels = chosen.labels ?? [];
  const conditions = chosen.conditions ?? CONDITIONS;
  const addresses = chosen.addresses ?? [];
  const extensions = chosen.extensions ?? [];
  const instructions = allowed.flatMap((m) =>
    m === "b.cond" ? conditions.map((c) => `b.${c}`) : [m],
  );
  const [mode, setMode] = useState<Mode>(rememberedMode);
  const introduced = useMemo(() => introducedOf(challenge), [challenge]);
  const errors = useMemo(
    () => assemble(text, { allowed: new Set(allowed), introduced }).errors,
    [text, allowed, introduced],
  );
  const setText = (next: string) => onChange({ ...artifact, text: next });
  const choose = (next: Mode) => {
    setMode(next);
    remember(next);
  };
  return (
    <div className="asm-editor" data-mode={mode}>
      <div className="asm-mode" role="group" aria-label={S.editor.mode}>
        <span className="asm-mode-label">{S.editor.mode}</span>
        {(["text", "tap"] as const).map((m) => (
          <button
            key={m}
            type="button"
            className="button secondary"
            aria-pressed={mode === m}
            onClick={() => choose(m)}
          >
            {m === "text" ? S.editor.text : S.editor.tap}
          </button>
        ))}
      </div>
      {mode === "text" ? (
        <TextMode text={text} setText={setText} errors={errors} symbols={symbols} />
      ) : (
        <TapMode
          lines={linesOf(text)}
          setLines={(lines) => setText(textOf(lines))}
          errors={errors}
          instructions={instructions}
          registers={registers}
          numberPad={numberPad}
          labels={labels}
          conditions={conditions}
          addresses={addresses}
          extensions={extensions}
        />
      )}
    </div>
  );
};
