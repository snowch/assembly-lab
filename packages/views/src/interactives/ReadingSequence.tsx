// Copyright © 2026 Christopher Snow

import { useEffect, useState, type ReactNode } from "react";
import { z } from "zod";
import { useSlot, type LessonStore } from "@platform/lesson-runtime";
import { fourBitReadings } from "../complement";
import { bitWeightsOfPattern } from "../readings";
import { useHandoffState } from "../update-handoff";
import {
  READING_EXAMPLES as E,
  readingAttempt,
  validReadingAttempt,
  correctReadings,
  groupedReading as fmt,
  smallReadingSum,
} from "../reading-sequence";
import { READING_SEQUENCE as S } from "../strings.reading-sequence";
import { withProps } from "./props";
import { Calculator } from "../Calculator";

const Props = z.object({
  stage: z.enum(["unsigned", "signed", "practice", "bridge", "transfer", "explore"]),
});
type Small = ReturnType<typeof fourBitReadings>;
function Row({
  label,
  values,
  kind = "weight",
  negative = false,
}: {
  label: string;
  values: number[];
  kind?: "weight" | "digit" | "position";
  negative?: boolean;
}) {
  return (
    <div className="al-reading-row" role="row">
      <span role="rowheader">{label}</span>
      {values.map((value, i) => (
        <span
          key={i}
          role="cell"
          className={`al-reading-${kind}`}
          data-set={kind === "digit" && value === 1 ? "true" : undefined}
          data-negative={negative && i === 0 ? "true" : undefined}
        >
          {fmt(value)}
        </span>
      ))}
    </div>
  );
}
function Matrix({ children }: { children: ReactNode }) {
  return (
    <div className="al-reading-matrix" role="table" aria-label={S.matrixLabel}>
      <Row label={S.bitPosition} kind="position" values={E.before.places.map((p) => p.index)} />
      {children}
    </div>
  );
}
const values = (r: Small) => r.places.map((p) => Number(p.set));
const weights = (r: Small, way: "unsigned" | "signed") => r.places.map((p) => p[`${way}Weight`]);
function Sum({
  readings,
  way,
  label,
}: {
  readings: Small;
  way: "unsigned" | "signed";
  label?: string;
}) {
  return (
    <div className="al-reading-sum">
      <span>{label ?? S[`${way}Label`]}</span>
      <code data-sum={way}>{smallReadingSum(readings, way)}</code>
    </div>
  );
}
function Pattern32({ pattern }: { pattern: string }) {
  const cells = [
    { label: S.bit31, value: pattern[0] },
    { label: S.bits30to2, value: S.allZero },
    { label: S.bit1, value: pattern[30] },
    { label: S.bit0, value: pattern[31] },
  ];
  return (
    <div className="al-reading-wide" data-pattern={pattern}>
      {cells.map(({ label, value }) => (
        <div key={label}>
          <span>{label}</span>
          <code data-set={value === "1" ? "true" : undefined}>{value}</code>
        </div>
      ))}
    </div>
  );
}
function WideWeights({ lower = false }: { lower?: boolean }) {
  const u = bitWeightsOfPattern(E.bridge.pattern, "unsigned"),
    s = bitWeightsOfPattern(E.bridge.pattern, "signed");
  return (
    <>
      <div className="al-reading-weights-wide">
        <div>
          <span>{S.topUnsigned}</span>
          <code>+{fmt(u[0]!.weight)}</code>
        </div>
        <div>
          <span>{S.topSigned}</span>
          <code>{fmt(s[0]!.weight)}</code>
        </div>
      </div>
      {lower && (
        <p className="al-reading-lower">
          {S.lowerWeight} <code>+{fmt(u[30]!.weight)}</code>
        </p>
      )}
    </>
  );
}
function Task({ stage, store }: { stage: "practice" | "transfer"; store: LessonStore }) {
  const [raw, set] = useSlot<unknown>(store, `reading-${stage}`);
  const a = readingAttempt(raw);
  const [invalid, setInvalid] = useState(false);
  const ready = a.submitted && validReadingAttempt(a, stage);
  const change = (field: "unsigned" | "signed" | "reason" | "cleared", value: string) => {
    set({ ...a, [field]: value, submitted: false });
    setInvalid(false);
  };
  return (
    <div data-reading-task={stage}>
      {stage === "practice" ? (
        <Matrix>
          <Row label={S.freshBits} values={values(E.practice)} kind="digit" />
          <Row label={S.unsignedWeight} values={weights(E.practice, "unsigned")} />
          <Row label={S.signedWeight} values={weights(E.practice, "signed")} negative />
        </Matrix>
      ) : (
        <>
          <Pattern32 pattern={E.transfer.pattern} />
          <WideWeights lower />
        </>
      )}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!validReadingAttempt(a, stage)) {
            setInvalid(true);
            return;
          }
          set({ ...a, submitted: true });
          setInvalid(false);
        }}
        onReset={() => {
          set(undefined);
          setInvalid(false);
        }}
      >
        <div className="al-reading-fields">
          {(["unsigned", "signed"] as const).map((way) => (
            <label key={way}>
              {S[`${way}Label`]}
              <input
                name={way}
                type="text"
                autoComplete="off"
                value={a[way]}
                required
                onChange={(e) => change(way, e.target.value)}
              />
            </label>
          ))}
        </div>
        {stage === "transfer" && <Calculator handoffKey="transfer" />}
        <label>
          {stage === "practice" ? S.practiceReason : S.unchangedPrompt}
          <textarea
            name="reason"
            value={a.reason}
            required
            onChange={(e) => change("reason", e.target.value)}
          />
        </label>
        {stage === "transfer" && (
          <label>
            {S.clearPrompt}
            <textarea
              name="cleared"
              value={a.cleared}
              required
              onChange={(e) => change("cleared", e.target.value)}
            />
          </label>
        )}
        <div className="al-controls">
          <button type="submit" className="button primary">
            {S.checkLabel}
          </button>
          <button type="reset" className="button secondary">
            {S.retryLabel}
          </button>
        </div>
      </form>
      <div role="status" aria-live="polite">
        {invalid && <p>{S.invalid}</p>}
        {ready && (
          <div className="al-reading-feedback" data-feedback>
            <p>
              <strong>{correctReadings(a, stage) ? S.numericCorrect : S.numericIncorrect}</strong>
            </p>
            {stage === "practice" ? (
              <>
                <Sum readings={E.practice} way="unsigned" />
                <Sum readings={E.practice} way="signed" />
              </>
            ) : (
              <>
                <p>
                  {S.unsignedLabel}:{" "}
                  <code>
                    {fmt(E.bridge.unsigned)} + {fmt(E.cleared.unsigned)} ={" "}
                    {fmt(E.transfer.unsigned)}
                  </code>
                </p>
                <p>
                  {S.signedLabel}:{" "}
                  <code>
                    {fmt(E.bridge.signed)} + {fmt(E.cleared.signed)} = {fmt(E.transfer.signed)}
                  </code>
                </p>
                <p>
                  {S.afterClear} <code>{fmt(E.cleared.unsigned)}</code>
                </p>
              </>
            )}
            <p>{S.reasoningReview}</p>
            <p>{stage === "practice" ? S.practiceFeedback : S.challengeFeedback}</p>
          </div>
        )}
      </div>
      <p className="al-reading-note">{S.saved}</p>
    </div>
  );
}
function Exploration({ store }: { store: LessonStore }) {
  const [raw] = useSlot<unknown>(store, "reading-practice");
  const a = readingAttempt(raw);
  const unlocked = a.submitted && validReadingAttempt(a, "practice");
  const [bits, setBits] = useHandoffState("ReadingSequence.bits", E.before.pattern);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!unlocked) setOpen(false);
  }, [unlocked]);
  const r = fourBitReadings(/^[01]{4}$/.test(bits) ? bits : E.before.pattern);
  return (
    <details className="lesson-details" open={open} onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary>{S.exploreLabel}</summary>
      {!unlocked ? (
        <p>{S.gate}</p>
      ) : (
        <>
          <p>{S.exploreIntro}</p>
          <div className="al-reading-explore">
            {r.places.map((p, i) => (
              <button
                key={p.index}
                type="button"
                className="al-toggle"
                aria-label={`${S.bitPosition} ${p.index}`}
                data-bit={p.index}
                aria-pressed={p.set}
                onClick={() =>
                  setBits(r.pattern.slice(0, i) + (p.set ? "0" : "1") + r.pattern.slice(i + 1))
                }
              >
                <span>{p.index}</span>
                <strong>{Number(p.set)}</strong>
              </button>
            ))}
          </div>
          <div role="status">
            <Sum readings={r} way="unsigned" />
            <Sum readings={r} way="signed" />
          </div>
          <button
            type="button"
            className="button secondary"
            onClick={() => setBits(E.before.pattern)}
          >
            {S.resetLabel}
          </button>
        </>
      )}
    </details>
  );
}
export const ReadingSequence = withProps(Props, function ReadingSequence({ data, store }) {
  let body: ReactNode;
  switch (data.stage) {
    case "unsigned":
      body = (
        <>
          <Matrix>
            <Row label={S.weight} values={weights(E.before, "unsigned")} />
            <Row label={S.before} values={values(E.before)} kind="digit" />
            <Row label={S.bit3Set} values={values(E.set)} kind="digit" />
          </Matrix>
          <Sum label={S.before} readings={E.before} way="unsigned" />
          <Sum label={S.highestSet} readings={E.set} way="unsigned" />
        </>
      );
      break;
    case "signed":
      body = (
        <>
          <Matrix>
            <Row label={S.sameBits} values={values(E.set)} kind="digit" />
            <Row label={S.unsignedWeight} values={weights(E.set, "unsigned")} />
            <Row label={S.signedWeight} values={weights(E.set, "signed")} negative />
          </Matrix>
          <Sum readings={E.set} way="unsigned" />
          <Sum readings={E.set} way="signed" />
          <p>
            {S.clearExample} <code>{E.before.pattern}</code>:{" "}
            <code>{smallReadingSum(E.before, "signed")}</code>
          </p>
        </>
      );
      break;
    case "bridge":
      body = (
        <>
          <Pattern32 pattern={E.bridge.pattern} />
          <WideWeights />
          <p>
            {S.unsignedLabel}:{" "}
            <code>
              {fmt(E.bridge.unsigned)} + 0 = {fmt(E.bridge.unsigned)}
            </code>
          </p>
          <p>
            {S.signedLabel}:{" "}
            <code>
              {fmt(E.bridge.signed)} + 0 = {fmt(E.bridge.signed)}
            </code>
          </p>
        </>
      );
      break;
    case "practice":
    case "transfer":
      body = <Task stage={data.stage} store={store} />;
      break;
    case "explore":
      body = <Exploration store={store} />;
  }
  return (
    <div className="al-figure al-reading-sequence" data-stage={data.stage}>
      {body}
    </div>
  );
});
