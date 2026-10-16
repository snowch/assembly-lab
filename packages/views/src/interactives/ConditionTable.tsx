// Copyright © 2026 Christopher Snow

// One compare, every condition. The learner types two values; the model runs `cmp w0, w1` on them and
// one `cset` for each condition, and the figure draws the four flags the compare left and, for each
// condition, its meaning, the flags it reads and whether it holds. Whether a condition holds is what
// the model's own `cset` gave. The figure holds no table of when a condition holds: it holds only the
// names and the rules the lesson's list gives, which are words.

import { useMemo, useState } from "react";
import { z } from "zod";

import { FlagsRow } from "../FlagsRow";
import { compareResult, parseTyped, type Typed } from "../branch";
import { withCode } from "../parts";
import { RegisterRow } from "../parts";
import { VIEW_STRINGS as S } from "../strings";
import { BRANCH_STRINGS as B, CONDITION_ROWS } from "../strings.branch";
import { withProps } from "./props";

const Props = z.object({
  /** The two values the figure starts with, as the learner would type them. */
  start: z.tuple([z.string(), z.string()]).default(["8", "8"]),
  /** Pairs of values the lesson has already used, offered as buttons. */
  presets: z.array(z.tuple([z.string(), z.string()])).default([]),
});

const GROUPS = ["either", "unsigned", "signed", "other"] as const;

function problem(t: Typed): string | null {
  if (t.kind === "empty" || t.kind === "not-a-number") return S.tester.notNumber;
  if (t.kind === "out-of-range") return B.conditions.outOfRange;
  return null;
}

function ValueBox({
  name,
  label,
  text,
  onText,
  typed,
}: {
  name: string;
  label: string;
  text: string;
  onText: (text: string) => void;
  typed: Typed;
}) {
  const sentence = problem(typed);
  const id = `al-cond-${name}`;
  return (
    <div className="al-cond-value" data-register={name}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        className="al-tester-input"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        aria-invalid={sentence !== null}
        value={text}
        onChange={(e) => onText(e.target.value)}
      />
      {typed.kind === "ok" ? (
        <span className="al-cond-readings">
          {B.conditions.readings(typed.pattern, Number(BigInt.asIntN(32, BigInt(typed.pattern))))}
        </span>
      ) : (
        <span className="al-cond-readings al-nomatch">{sentence}</span>
      )}
    </div>
  );
}

export const ConditionTable = withProps(Props, function ConditionTable({ data }) {
  const [a, setA] = useState(data.start[0]);
  const [b, setB] = useState(data.start[1]);
  const first = parseTyped(a);
  const second = parseTyped(b);
  const result = useMemo(() => {
    const x = parseTyped(a);
    const y = parseTyped(b);
    return x.kind === "ok" && y.kind === "ok"
      ? compareResult(
          x.pattern,
          y.pattern,
          CONDITION_ROWS.map((c) => c.name),
        )
      : null;
  }, [a, b]);
  return (
    <div className="al-figure al-conditions" data-figure="condition-table">
      <div className="al-cond-values" role="group" aria-label={B.conditions.group}>
        <ValueBox name="w0" label={B.conditions.first} text={a} onText={setA} typed={first} />
        <ValueBox name="w1" label={B.conditions.second} text={b} onText={setB} typed={second} />
      </div>
      {data.presets.length > 0 && (
        <div className="al-cond-presets" role="group" aria-label={B.conditions.presets}>
          {data.presets.map(([x, y]) => (
            <button
              key={`${x} ${y}`}
              type="button"
              className="button secondary"
              aria-pressed={a === x && b === y}
              onClick={() => {
                setA(x);
                setB(y);
              }}
            >
              {B.conditions.preset(x, y)}
            </button>
          ))}
        </div>
      )}
      {first.kind === "ok" && second.kind === "ok" && (
        <div className="al-registers" role="group" aria-label={S.stepper.registers}>
          <RegisterRow name="w0" value={first.pattern} changed={false} />
          <RegisterRow name="w1" value={second.pattern} changed={false} />
        </div>
      )}
      {result && (
        <>
          <p className="al-cond-heading">{withCode(B.conditions.flagsHeading)}</p>
          <FlagsRow flags={result.flags} />
          <div className="al-cond-list" role="group" aria-label={B.conditions.list}>
            {GROUPS.map((group) => (
              <div key={group} className="al-cond-group" data-group={group}>
                <p className="al-cond-group-head">{B.conditions.groups[group]}</p>
                <ul>
                  {CONDITION_ROWS.filter((c) => c.group === group).map((c) => {
                    const yes = result.holds[c.name] === true;
                    return (
                      <li key={c.name} className="al-cond" data-cond={c.name} data-holds={yes}>
                        <code className="al-cond-name">{c.name}</code>
                        <span className="al-cond-means">{c.means}</span>
                        <span className="al-cond-reads">{c.reads}</span>
                        <span className="al-cond-verdict">
                          {yes ? B.conditions.yes : B.conditions.no}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
});
