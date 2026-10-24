// Copyright © 2026 Christopher Snow

import { useHandoffState } from "../update-handoff";

// One compare, every condition. The learner types two values, or with `choices: "presets"` picks a pair; the model runs `cmp w0, w1` on them and
// one `cset` for each condition, and the figure draws the four flags the compare left and, for each
// condition, its meaning, its rule, the flags it read with their values and whether it holds. Whether
// a condition holds is what the model's own `cset` gave. The figure holds no table of when a condition
// holds: it holds only the names and the rules the lesson's list gives, which are words. A compact
// view shows the six conditions the lesson leans on, and the rest sit behind a closed disclosure.

import { useMemo } from "react";
import { z } from "zod";

import { ConditionItem } from "../ConditionItem";
import { FlagsRow } from "../FlagsRow";
import { compareResult, parseTyped, type Typed } from "../branch";
import { withCode } from "../parts";
import { RegisterRow } from "../parts";
import { conditionRead } from "../select";
import { VIEW_STRINGS as S } from "../strings";
import { BRANCH_STRINGS as B, CONDITION_ROWS } from "../strings.branch";
import { withProps } from "./props";

const Props = z.object({
  /** The two values the figure starts with, as the learner would type them. */
  start: z.tuple([z.string(), z.string()]).default(["8", "8"]),
  /** Pairs of values the lesson has already used, offered as buttons. */
  presets: z.array(z.tuple([z.string(), z.string()])).default([]),
  /**
   * Where the pair comes from: "any" is two boxes the learner types in (and the buttons), "presets"
   * only the buttons. A lesson whose challenge asks about another pair uses the buttons only, so the
   * figure never shows what the challenge asks for.
   */
  choices: z.enum(["any", "presets"]).default("any"),
  /** The conditions the compact view shows; the others are behind "Conditions beyond the first six". */
  primary: z.array(z.string()).default(["eq", "ne", "cs", "cc", "ge", "lt"]),
});

const GROUPS = ["either", "unsigned", "signed", "other"] as const;

function problem(t: Typed): string | null {
  if (t.kind === "empty" || t.kind === "not-a-number") return S.tester.notNumber;
  if (t.kind === "out-of-range") return B.conditions.outOfRange;
  return null;
}

/** A value the learner cannot change: its label, and its two readings. */
function FixedValue({ name, label, typed }: { name: string; label: string; typed: Typed }) {
  return (
    <div className="al-cond-value" data-register={name}>
      <span className="al-cond-label">{withCode(label)}</span>
      {typed.kind === "ok" && (
        <span className="al-cond-readings">
          {withCode(
            B.conditions.readings(typed.pattern, Number(BigInt.asIntN(32, BigInt(typed.pattern)))),
          )}
        </span>
      )}
    </div>
  );
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
      <label htmlFor={id}>{withCode(label)}</label>
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
          {withCode(
            B.conditions.readings(typed.pattern, Number(BigInt.asIntN(32, BigInt(typed.pattern)))),
          )}
        </span>
      ) : (
        <span className="al-cond-readings al-nomatch">{withCode(sentence ?? "")}</span>
      )}
    </div>
  );
}

export const ConditionTable = withProps(Props, function ConditionTable({ data }) {
  const [a, setA] = useHandoffState("ConditionTable.a", data.start[0]);
  const [b, setB] = useHandoffState("ConditionTable.b", data.start[1]);
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
  const reads = useMemo(
    () =>
      result
        ? CONDITION_ROWS.map((c) =>
            conditionRead(c.name, result.flags, result.holds[c.name] === true),
          )
        : [],
    [result],
  );
  /** The groups of some of the conditions, in the order the lesson's list gives them. */
  const groups = (shown: (name: string) => boolean) =>
    GROUPS.map((group) => ({
      group,
      items: reads.filter((r) => r.row?.group === group && shown(r.name)),
    })).filter((g) => g.items.length > 0);
  const primary = new Set(data.primary);
  const list = (shown: (name: string) => boolean, label: string) => (
    <div className="al-cond-list" role="group" aria-label={label}>
      {groups(shown).map(({ group, items }) => (
        <div key={group} className="al-cond-group" data-group={group}>
          <p className="al-cond-group-head">{withCode(B.conditions.groups[group])}</p>
          <ul>
            {items.map((item) => (
              <ConditionItem key={item.name} item={item} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
  return (
    <div className="al-figure al-conditions" data-figure="condition-table">
      <p className="al-cond-heading al-cond-compare">{withCode(B.conditions.compareLine)}</p>
      <div className="al-cond-values" role="group" aria-label={B.conditions.group}>
        {data.choices === "any" ? (
          <>
            <ValueBox name="w0" label={B.conditions.first} text={a} onText={setA} typed={first} />
            <ValueBox name="w1" label={B.conditions.second} text={b} onText={setB} typed={second} />
          </>
        ) : (
          <>
            <FixedValue name="w0" label={B.conditions.first} typed={first} />
            <FixedValue name="w1" label={B.conditions.second} typed={second} />
          </>
        )}
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
              {withCode(B.conditions.preset(x, y))}
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
          {list((name) => primary.has(name), B.conditions.list)}
          <details className="al-cond-more">
            <summary>{B.conditions.all}</summary>
            {list((name) => !primary.has(name), B.conditions.all)}
          </details>
        </>
      )}
    </div>
  );
});
