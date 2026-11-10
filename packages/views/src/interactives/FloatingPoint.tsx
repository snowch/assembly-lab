// Copyright © 2026 Christopher Snow

import { useId } from "react";
import { z } from "zod";
import { fpDecode, fpParse, fpNext, fpOperate, fpToInt32, type FpWidth } from "@al/machine";
import { FP_NATIVE_CASES } from "../../../../content/lessons/floating-point.native";
import { ListingView } from "../parts";
import { cLinesOf, programLines } from "../listing";
import { FP_COPY as S } from "../strings.floating-point";
import { useHandoffState } from "../update-handoff";
import { withProps } from "./props";

const Mode = z.enum(["bits", "rounding", "arm", "conversions"]);
const Props = z.object({ mode: Mode });
const Task = z.enum(["fields", "rounding", "arithmetic", "conversion"]);
const CheckProps = z.object({ task: Task });
type Work = {
  width: FpWidth;
  bits: bigint;
  entry: string;
  error: boolean;
  message: string;
  sum: { exact: string; rounded: string } | null;
};
const initial = (rounding: boolean): Work => ({
  width: 32,
  bits: parsed(rounding ? "12.35" : "9.5", 32),
  entry: rounding ? "12.35" : "9.5",
  error: false,
  message: "",
  sum: null,
});
function parsed(value: string, width: FpWidth) {
  const result = fpParse(value, width);
  if (!result.ok) throw new Error("Invalid floating-point example");
  return result.bits;
}

function Explorer({ rounding }: { rounding: boolean }) {
  const [work, set] = useHandoffState<Work>("explorer", () => initial(rounding));
  const id = useId();
  const value = fpDecode(work.bits, work.width);
  const fractionBits = work.width === 32 ? 23 : 52;
  const exponentBits = work.width === 32 ? 8 : 11;
  function apply() {
    const result = fpParse(work.entry, work.width);
    if (!result.ok) {
      set({ ...work, error: true, message: "", sum: null });
      return;
    }
    set({ ...work, bits: result.bits, error: false, message: S.changed, sum: null });
  }
  function changeWidth(width: FpWidth) {
    const result = fpParse(value.exact, width);
    if (result.ok)
      set({ ...work, width, bits: result.bits, sum: null, error: false, message: S.changed });
  }
  function addOne() {
    // Widening binary32 to binary64 is exact for these finite inputs; the display is a
    // separate exact rational sum so a rounded binary32 result is never its own oracle.
    const one = parsed("1", work.width);
    const result = fpOperate("add", work.bits, one, work.width);
    const exact = exactPlusOne(value.exact);
    set({
      ...work,
      bits: result,
      sum: { exact, rounded: fpDecode(result, work.width).exact },
      message: S.changed,
    });
  }
  return (
    <div className="al-fp-explorer" data-figure="floating-point">
      <p>{S.widthNote}</p>
      <div className="al-fp-inputs">
        <label htmlFor={`${id}-width`}>{S.width}</label>
        <select
          id={`${id}-width`}
          value={work.width}
          onChange={(event) => changeWidth(Number(event.target.value) as FpWidth)}
        >
          <option value={32}>{S.width32}</option>
          <option value={64}>{S.width64}</option>
        </select>
        <label htmlFor={`${id}-entry`}>{S.input}</label>
        <input
          id={`${id}-entry`}
          value={work.entry}
          maxLength={4096}
          aria-invalid={work.error}
          aria-describedby={work.error ? `${id}-error` : undefined}
          onChange={(event) => set({ ...work, entry: event.target.value, error: false })}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              event.stopPropagation();
              apply();
            }
          }}
        />
        <button type="button" onClick={apply}>
          {S.apply}
        </button>
      </div>
      {work.error && (
        <p role="alert" id={`${id}-error`}>
          {S.error}
        </p>
      )}
      <dl className="al-fp-values">
        <div>
          <dt>{S.value}</dt>
          <dd>{value.display}</dd>
        </div>
        <div>
          <dt>{S.hex}</dt>
          <dd>{value.hex}</dd>
        </div>
      </dl>
      {rounding && (
        <div className="al-fp-rounding">
          <p>{S.rounding.note}</p>
          {value.kind === "nan" ? (
            <p>{S.rounding.unordered}</p>
          ) : (
            <dl className="al-fp-values">
              <div>
                <dt>{S.rounding.below}</dt>
                <dd>
                  {value.kind === "infinity" && value.negative
                    ? S.rounding.noSmaller
                    : fpDecode(fpNext(work.bits, work.width, "down"), work.width).display}
                </dd>
              </div>
              <div>
                <dt>{S.rounding.above}</dt>
                <dd>
                  {value.kind === "infinity" && !value.negative
                    ? S.rounding.noLarger
                    : fpDecode(fpNext(work.bits, work.width, "up"), work.width).display}
                </dd>
              </div>
            </dl>
          )}
          <div className="al-controls">
            <button
              type="button"
              disabled={value.kind === "nan" || (value.kind === "infinity" && value.negative)}
              onClick={() =>
                set({
                  ...work,
                  bits: fpNext(work.bits, work.width, "down"),
                  sum: null,
                  message: S.changed,
                })
              }
            >
              {S.rounding.previous}
            </button>
            <button
              type="button"
              disabled={value.kind === "nan" || (value.kind === "infinity" && !value.negative)}
              onClick={() =>
                set({
                  ...work,
                  bits: fpNext(work.bits, work.width, "up"),
                  sum: null,
                  message: S.changed,
                })
              }
            >
              {S.rounding.next}
            </button>
            <button
              type="button"
              onClick={addOne}
              disabled={value.kind === "nan" || value.kind === "infinity"}
            >
              {S.rounding.addOne}
            </button>
          </div>
          <p>{S.rounding.operation}</p>
          {work.sum && (
            <dl className="al-fp-values">
              <div>
                <dt>{S.rounding.exactSum}</dt>
                <dd className="al-fp-long">{work.sum.exact}</dd>
              </div>
              <div>
                <dt>{S.rounding.roundedSum}</dt>
                <dd className="al-fp-long">{work.sum.rounded}</dd>
              </div>
            </dl>
          )}
        </div>
      )}
      <h4>{S.bits}</h4>
      <div className="al-fp-bit-grid" role="group" aria-label={S.bits}>
        {Array.from({ length: work.width }, (_, index) => {
          const bit = work.width - 1 - index;
          const digit = Number((work.bits >> BigInt(bit)) & 1n);
          const field =
            bit === work.width - 1 ? "sign" : bit >= fractionBits ? "exponent" : "fraction";
          return (
            <button
              key={bit}
              type="button"
              className={`al-fp-bit al-fp-${field}`}
              aria-label={S.bitLabel(bit, digit, S.fieldNames[field])}
              aria-pressed={digit === 1}
              onClick={() =>
                set({
                  ...work,
                  bits: work.bits ^ (1n << BigInt(bit)),
                  sum: null,
                  message: S.changed,
                })
              }
            >
              <small>{bit}</small>
              <span>{digit}</span>
            </button>
          );
        })}
      </div>
      <dl className="al-fp-fields">
        <div className="al-fp-sign">
          <dt>{S.fieldNames.sign}</dt>
          <dd>{Number(value.negative)}</dd>
          <dd>{S.fieldHelp.sign}</dd>
        </div>
        <div className="al-fp-exponent">
          <dt>{S.fieldNames.exponent}</dt>
          <dd>{value.exponentField.toString(2).padStart(exponentBits, "0")}</dd>
          <dd>{S.fieldHelp.exponent}</dd>
        </div>
        <div className="al-fp-fraction">
          <dt>{S.fieldNames.fraction}</dt>
          <dd className="al-fp-long">
            {value.fractionField.toString(2).padStart(fractionBits, "0")}
          </dd>
          <dd>{S.fieldHelp.fraction}</dd>
        </div>
      </dl>
      <p>
        <strong>
          {S.classification}: {S.kinds[value.kind]}
        </strong>
      </p>
      <p>{S.explanations[value.kind]}</p>
      {(value.kind === "normal" || value.kind === "subnormal") && (
        <div className="al-fp-calculation">
          <h4>{S.calculation}</h4>
          <dl>
            <div>
              <dt>{S.encodedExponent}</dt>
              <dd>{value.exponentField}</dd>
            </div>
            <div>
              <dt>{S.bias}</dt>
              <dd>{value.bias}</dd>
            </div>
            <div>
              <dt>{S.actualExponent}</dt>
              <dd>{value.exponent}</dd>
            </div>
          </dl>
          <p className="al-fp-formula">
            {value.negative ? "−1" : "+1"} × ({value.kind === "normal" ? "1" : "0"} +{" "}
            {value.fractionField.toString()} / 2<sup>{fractionBits}</sup>) × 2
            <sup>{value.exponent}</sup>
          </p>
        </div>
      )}
      <details className="lesson-details">
        <summary>{S.exact}</summary>
        <p className="al-fp-long">{value.exact}</p>
      </details>
      <button type="button" onClick={() => set(initial(rounding))}>
        {S.reset}
      </button>
      <p className="al-status" role="status">
        {work.message}
      </p>
    </div>
  );
}

/** Exact decimal addition for a displayed finite binary value, with no Number round-trip. */
export function exactPlusOne(decimal: string): string {
  if (!/^-?\d+(?:\.\d+)?$/.test(decimal)) return decimal;
  const negative = decimal.startsWith("-");
  const [whole = "0", fraction = ""] = decimal.replace(/^-/, "").split(".");
  const scale = 10n ** BigInt(fraction.length);
  const numerator = BigInt(whole + fraction) * (negative ? -1n : 1n) + scale;
  const digits = (numerator < 0n ? -numerator : numerator)
    .toString()
    .padStart(fraction.length + 1, "0");
  const body = fraction.length
    ? `${digits.slice(0, -fraction.length)}.${digits.slice(-fraction.length)}`
        .replace(/0+$/, "")
        .replace(/\.$/, "")
    : digits;
  return `${numerator < 0n ? "-" : ""}${body}`;
}

function Native({ conversions }: { conversions: boolean }) {
  const records = FP_NATIVE_CASES.filter((record) =>
    conversions
      ? !["add", "multiply"].includes(record.operation)
      : ["add", "multiply"].includes(record.operation),
  );
  const [work, set] = useHandoffState<{ id: string; shown: boolean }>("native", {
    id: conversions ? "float-to-int-positive" : records[0]!.id,
    shown: false,
  });
  const record = records.find((candidate) => candidate.id === work.id) ?? records[0]!;
  const id = useId();
  const resultBits = BigInt(record.result.hex);
  const result =
    record.resultType === "float"
      ? fpDecode(resultBits, record.result.width).display
      : record.resultType === "int"
        ? BigInt.asIntN(32, resultBits).toString()
        : resultBits.toString();
  return (
    <div className="al-fp-native" data-figure="floating-point-native">
      <p>
        <strong>{S.native.label}</strong>
      </p>
      <p>{S.native.evidence}</p>
      <label htmlFor={id}>{S.native.choose}</label>
      <select
        id={id}
        value={record.id}
        onChange={(event) => set({ id: event.target.value, shown: false })}
      >
        {records.map((candidate) => (
          <option key={candidate.id} value={candidate.id}>
            {S.native.examples[candidate.id as keyof typeof S.native.examples]}
          </option>
        ))}
      </select>
      <p className="al-fp-scroll-hint">{S.native.scrollHint}</p>
      <ListingView cLines={cLinesOf(record.program.c)} lines={programLines(record.program)} />
      <h4>{S.native.inputs}</h4>
      <dl className="al-fp-values">
        {record.inputs.map((input, index) => (
          <div key={index}>
            <dt>{input.name}</dt>
            <dd>
              {record.operation === "int-to-float"
                ? BigInt.asIntN(32, BigInt(input.hex)).toString()
                : fpDecode(BigInt(input.hex), input.width).display}
            </dd>
            <dd>
              <code>{input.hex}</code>
            </dd>
          </div>
        ))}
      </dl>
      <button type="button" onClick={() => set({ ...work, shown: !work.shown })}>
        {work.shown ? S.native.reset : S.native.reveal}
      </button>
      {work.shown && (
        <div className="al-fp-recorded-result" role="status">
          <dl>
            <div>
              <dt>{S.native.result}</dt>
              <dd>{result}</dd>
            </div>
            <div>
              <dt>{S.native.pattern}</dt>
              <dd>
                <code>{record.result.hex}</code>
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}

export const FloatingPoint = withProps(Props, function FloatingPoint({ data }) {
  return data.mode === "arm" || data.mode === "conversions" ? (
    <Native conversions={data.mode === "conversions"} />
  ) : (
    <Explorer rounding={data.mode === "rounding"} />
  );
});

/** Independent practice: the answer is derived from the numeric model after submission. */
export function floatingAnswer(task: z.infer<typeof Task>): string {
  if (task === "fields") {
    // Convert the exact terminating decimal through the model, then reconstruct its
    // finite binary significand rather than storing the answer in lesson copy.
    const value = fpDecode(parsed("5.25", 32), 32);
    const significand = (1n << 23n) + value.fractionField;
    const shift = 23 - value.exponent!;
    const digits = significand.toString(2).padStart(shift + 1, "0");
    return `${digits.slice(0, -shift)}.${digits.slice(-shift)}`.replace(/0+$/, "");
  }
  if (task === "rounding") return fpDecode(parsed("16777219", 32), 32).exact;
  if (task === "conversion") {
    const result = fpToInt32(parsed("-6.75", 32), 32);
    if (!result.ok) throw new Error("Invalid conversion example");
    return String(result.value);
  }
  const float = fpDecode(fpOperate("add", parsed("33554432", 32), parsed("2", 32), 32), 32);
  const double = fpDecode(fpOperate("add", parsed("33554432", 64), parsed("2", 64), 64), 64);
  return float.exact === double.exact ? "both" : "double";
}

export const FloatingPointCheck = withProps(CheckProps, function FloatingPointCheck({ data }) {
  const [work, set] = useHandoffState("practice", {
    answer: "",
    fieldValue: "",
    fieldKind: "",
    copy: "",
    checked: false,
  });
  const id = useId();
  const expected = work.checked ? floatingAnswer(data.task) : "";
  const answer = work.answer.trim().replace(/\s/g, "").replace(/−/g, "-");
  const correct =
    data.task === "fields"
      ? answer.replace(/^0+(?=\d)/, "").replace(/0+$/, "") === expected
      : data.task === "arithmetic"
        ? answer === expected
        : answer !== "" && Number(answer) === Number(expected);
  const extraReady =
    data.task === "fields"
      ? Boolean(work.fieldValue.trim() && work.fieldKind)
      : data.task === "conversion"
        ? Boolean(work.copy)
        : true;
  const ready = Boolean(answer) && extraReady;
  const fieldValue = fpDecode((1n << 31n) | (128n << 23n), 32).exact;
  const fieldKind = fpDecode(1n, 32).kind;
  const originalCopy = parsed("-6.75", 32);
  const numericConversion = fpToInt32(originalCopy, 32);
  const numericPattern = numericConversion.ok
    ? `0x${BigInt.asUintN(32, BigInt(numericConversion.value)).toString(16).padStart(8, "0")}`
    : "";
  const extraCorrect =
    data.task === "fields"
      ? Number(work.fieldValue) === Number(fieldValue) && work.fieldKind === fieldKind
      : data.task === "conversion"
        ? work.copy === "fmov"
        : true;
  return (
    <div className="al-fp-check" data-figure="floating-point-check">
      <label htmlFor={id}>{S.check.prompts[data.task]}</label>
      {data.task === "arithmetic" ? (
        <select
          id={id}
          value={work.answer}
          onChange={(event) => set({ ...work, answer: event.target.value, checked: false })}
        >
          <option value="">{S.check.unanswered}</option>
          {Object.entries(S.check.answers).map(([key, text]) => (
            <option key={key} value={key}>
              {text}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          value={work.answer}
          onChange={(event) => set({ ...work, answer: event.target.value, checked: false })}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              event.stopPropagation();
              set({ ...work, checked: true });
            }
          }}
        />
      )}
      {data.task === "fields" && (
        <>
          <label htmlFor={`${id}-value`}>{S.check.fieldValuePrompt}</label>
          <input
            id={`${id}-value`}
            value={work.fieldValue}
            onChange={(event) => set({ ...work, fieldValue: event.target.value, checked: false })}
          />
          <label htmlFor={`${id}-kind`}>{S.check.fieldKindPrompt}</label>
          <select
            id={`${id}-kind`}
            value={work.fieldKind}
            onChange={(event) => set({ ...work, fieldKind: event.target.value, checked: false })}
          >
            <option value="">{S.check.unanswered}</option>
            {Object.entries(S.kinds).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </>
      )}
      {data.task === "conversion" && (
        <>
          <label htmlFor={`${id}-copy`}>{S.check.conversionCopyPrompt}</label>
          <select
            id={`${id}-copy`}
            value={work.copy}
            onChange={(event) => set({ ...work, copy: event.target.value, checked: false })}
          >
            <option value="">{S.check.unanswered}</option>
            <option value="fcvtzs">fcvtzs</option>
            <option value="fmov">fmov</option>
          </select>
        </>
      )}
      <button type="button" onClick={() => set({ ...work, checked: true })}>
        {S.check.action}
      </button>
      {work.checked && (
        <div role="status">
          <p>
            <strong>
              {!ready
                ? S.check.unanswered
                : correct && extraCorrect
                  ? S.check.correct
                  : S.check.retry}
            </strong>
          </p>
          {ready && (
            <>
              <p>{S.check.explanations[data.task]}</p>
              <output>
                {data.task === "arithmetic"
                  ? S.check.answers[expected as keyof typeof S.check.answers]
                  : expected}
              </output>
              {data.task === "fields" && (
                <dl>
                  <dt>{S.check.fieldValuePrompt}</dt>
                  <dd>{fieldValue}</dd>
                  <dt>{S.check.fieldKindPrompt}</dt>
                  <dd>{S.kinds[fieldKind]}</dd>
                </dl>
              )}
              {data.task === "conversion" && (
                <dl>
                  <dt>{S.check.conversionCopyPrompt}</dt>
                  <dd>
                    <code>fmov</code>
                  </dd>
                  <dt>{S.check.convertedPattern}</dt>
                  <dd>
                    <code>{numericPattern}</code>
                  </dd>
                  <dt>{S.check.copiedPattern}</dt>
                  <dd>
                    <code>{fpDecode(originalCopy, 32).hex}</code>
                  </dd>
                </dl>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
});
