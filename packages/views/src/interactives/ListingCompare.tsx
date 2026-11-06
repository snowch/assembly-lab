// Copyright © 2026 Christopher Snow

// Two C functions and the instructions GCC made from them, compared line by line. The C of both is
// there from the start. Their listings, and the page's comparison of them, wait for the learner's
// prediction: the course's assembler turns each listing into instructions, and a line is marked
// the same when the two assembled instructions are the same, so the mark is what the model found,
// not a claim in the lesson's words.

import { useCallback, useMemo } from "react";
import { z } from "zod";

import { assemble, type Instruction } from "@al/machine";
import { useSlot } from "@platform/lesson-runtime";

import { assemblyOf, cLinesOf, parseListing, programLines } from "../listing";
import { ListingView } from "../parts";
import { LessonLink } from "../lesson-references";
import { VIEW_STRINGS as S } from "../strings";
import { CALL_COMPARISON_STRINGS as C } from "../strings.call-comparison";
import { BitRow, hex, signedOf, unsignedOf } from "../bits";
import { traceOf, wValue } from "../trace";
import { PredictionBox, type Outcome } from "./PredictionBox";
import { RecordedSchema, withProps } from "./props";

const Props = z.object({
  left: RecordedSchema,
  right: RecordedSchema,
  /** Markdown: the question. */
  question: z.string(),
  options: z.array(z.object({ value: z.string(), label: z.string() })).min(2),
  /** Markdown, shown once the prediction is checked. */
  explain: z.string().default(""),
  /** Call both listings independently after the prediction, then read their returned w0 bits. */
  callComparison: z
    .object({
      args: z.array(z.number().int()).max(8),
      leftType: z.enum(["signed", "unsigned"]),
      rightType: z.enum(["signed", "unsigned"]),
      workedReadings: z.boolean().default(false),
      tripContext: z.boolean().default(false),
    })
    .optional(),
});

type Recorded = z.infer<typeof RecordedSchema>;

/** The assembled instructions of a listing, with the text each was written as. */
function instructionsOf(recorded: Recorded): Instruction[] {
  const { program, errors } = assemble(assemblyOf(parseListing(recorded.listing)));
  if (program === null) throw new Error(`The listing does not assemble: ${errors[0]?.key ?? ""}`);
  return program.instructions;
}

/** What an instruction does, as a string: two instructions with the same string do the same. */
const doing = (i: Instruction | undefined): string =>
  i === undefined ? "" : JSON.stringify(i.op, (_key, v) => (typeof v === "bigint" ? `${v}n` : v));

/** The label that opens a listing: the function's name. */
const nameOf = (recorded: Recorded): string => {
  const first = parseListing(recorded.listing)[0];
  return first?.kind === "label" ? first.text : "";
};

export interface Row {
  readonly left: string;
  readonly right: string;
  readonly same: boolean;
}

/** The two listings paired line by line, each pair marked by whether the model gives it one result. */
export function compareListings(left: Recorded, right: Recorded): Row[] {
  const a = instructionsOf(left);
  const b = instructionsOf(right);
  return Array.from({ length: Math.max(a.length, b.length) }, (_, i) => ({
    left: a[i]?.text ?? "",
    right: b[i]?.text ?? "",
    same: a[i] !== undefined && b[i] !== undefined && doing(a[i]) === doing(b[i]),
  }));
}

function CPane({ recorded }: { recorded: Recorded }) {
  const name = nameOf(recorded);
  return (
    <div className="al-pane al-c" role="group" aria-label={S.compare.cPane(name)}>
      <div className="al-pane-head">{name}</div>
      {cLinesOf(recorded.c).map((text, i) => (
        <div className="al-cline" key={i}>
          <span className="al-ln">{i + 1}</span>
          <code className="al-src">{text}</code>
        </div>
      ))}
    </div>
  );
}

type CallResult = {
  name: string;
  value: number | null;
  type: "signed" | "unsigned";
};

const decimal = (value: number): string => value.toLocaleString("en-GB").replace("-", "−");
const read = (call: CallResult): number =>
  call.type === "signed" ? signedOf(call.value ?? 0) : unsignedOf(call.value ?? 0);
const typeLabel = (type: CallResult["type"]): string =>
  type === "signed" ? C.signedType : C.unsignedType;

function ReturnedWord({ value, row }: { value: number; row: string }) {
  return (
    <div data-return-bits={row}>
      <BitRow
        name="w0"
        value={value}
        text={<span data-return-hex>{hex(value)}</span>}
        row={`return-${row}`}
      />
    </div>
  );
}

/** One computed word, with the two C readings and their bit weights kept beside it. */
function CallResults({
  calls,
  workedReadings,
  tripContext,
  tripDifference,
}: {
  calls: CallResult[];
  workedReadings: boolean;
  tripContext: boolean;
  tripDifference: number | null;
}) {
  const first = calls[0];
  const word =
    first?.value !== null &&
    first?.value !== undefined &&
    calls.every((call) => call.value === first.value)
      ? first.value
      : undefined;
  const shared = word !== undefined;
  const weight = 2 ** 31;
  const lower = word === undefined ? 0 : unsignedOf(word) % weight;
  const top = word === undefined ? 0 : Math.floor(unsignedOf(word) / weight);
  const overrun =
    workedReadings &&
    tripContext &&
    word !== undefined &&
    tripDifference !== null &&
    tripDifference < 0 &&
    signedOf(word) === tripDifference;
  return (
    <div className="al-compare-call-results" role="group" aria-label={C.resultGroup}>
      {word !== undefined && (
        <div className="al-compare-shared-word">
          <p>{C.sharedReturnedBits}</p>
          <ReturnedWord value={word} row="shared" />
        </div>
      )}
      <div className="al-compare-readings">
        {calls.map((call, i) => (
          <div
            className="al-compare-reading"
            role="group"
            aria-label={`${call.name}: ${typeLabel(call.type)}`}
            key={i}
            data-call-result={i}
            data-call-side={i === 0 ? "left" : "right"}
          >
            {shared ? (
              <p className="al-compare-reading-function">
                <code>{call.name}</code>
              </p>
            ) : (
              <p>{C.returnedBits(call.name)}</p>
            )}
            {call.value === null ? (
              <p role="status">{S.prediction.endedWithError}</p>
            ) : (
              <>
                {!shared && <ReturnedWord value={call.value} row={String(i)} />}
                <p className="al-compare-reading-type">{typeLabel(call.type)}</p>
                <p
                  className="al-compare-reading-value"
                  data-return-reading={call.type}
                  data-return-value={read(call)}
                >
                  {tripContext ? C.distanceValue(decimal(read(call))) : decimal(read(call))}
                </p>
                {overrun && call.type === "signed" && read(call) < 0 && (
                  <p className="al-compare-reading-meaning" data-trip-overrun>
                    {C.signedMeaning(decimal(Math.abs(read(call))))}
                  </p>
                )}
                {overrun && call.type === "unsigned" && (
                  <p className="al-compare-reading-meaning">{C.unsignedMeaning}</p>
                )}
                {overrun && call.type === "signed" && read(call) < 0 && (
                  <p className="al-compare-reading-range">{C.signedRange}</p>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      {calls.every((call) => call.value !== null) && (
        <p role="status" className="al-compare-summary" data-same-bits={shared}>
          {shared ? C.sameBits : C.differentBits}
        </p>
      )}
      {workedReadings && word !== undefined && (
        <div
          className="al-compare-weights"
          data-return-explanation
          role="group"
          aria-label={C.readingGroup}
        >
          <p>
            {C.bitWeights}
            {calls[0]?.type !== calls[1]?.type && <> {C.topWeightDiffers}</>}
          </p>
          <table className="al-compare-weight-table">
            <thead>
              <tr>
                <td />
                {calls.map((call, i) => (
                  <th key={i} scope="col">
                    {typeLabel(call.type)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr data-weight-row="lower">
                <th scope="row">{C.lowerBits}</th>
                <td colSpan={calls.length}>{decimal(lower)}</td>
              </tr>
              <tr data-weight-row="top-bit">
                <th scope="row">{C.topBitValue}</th>
                <td colSpan={calls.length}>{top}</td>
              </tr>
              {top === 0 && (
                <tr data-weight-row="top-weight">
                  <th scope="row">{C.topBitWeight}</th>
                  {calls.map((call, i) => (
                    <td key={i}>
                      <span>
                        {call.type === "signed" ? "−" : "+"}
                        {decimal(weight)}
                      </span>
                    </td>
                  ))}
                </tr>
              )}
              <tr data-weight-row="top-contribution">
                <th scope="row">{C.topBitContribution}</th>
                {calls.map((call, i) => (
                  <td key={i}>
                    <span>
                      {top !== 0 ? (call.type === "signed" ? "−" : "+") : ""}
                      {decimal(top * weight)}
                    </span>
                  </td>
                ))}
              </tr>
              <tr data-weight-row="total">
                <th scope="row">{C.total}</th>
                {calls.map((call, i) => (
                  <td key={i}>
                    <span>{decimal(read(call))}</span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          <p className="al-compare-types">{C.readingTypes}</p>
          {tripContext && <p>{C.noArithmeticError}</p>}
          <p>
            <LessonLink href="#/lesson/same-bits-two-readings">{C.readingLink}</LessonLink>
          </p>
        </div>
      )}
    </div>
  );
}

export const ListingCompare = withProps(
  Props,
  function ListingCompare({ data, interactive, store }) {
    const [committed] = useSlot<{ choice: string }>(store, interactive.id);
    const [called, setCalled] = useSlot<boolean>(store, `${interactive.id}:calls`);
    const rows = useMemo(
      () => (committed ? compareListings(data.left, data.right) : []),
      [committed, data.left, data.right],
    );
    const measure = useCallback((): Outcome => {
      const all = compareListings(data.left, data.right);
      const same = all.length > 0 && all.every((r) => r.same);
      return {
        value: same ? "same" : "different",
        said: same ? S.compare.resultSame : S.compare.resultDiffer,
      };
    }, [data.left, data.right]);
    const names = [nameOf(data.left), nameOf(data.right)];
    const calls = useMemo(() => {
      const comparison = data.callComparison;
      if (!committed || !called || !comparison) return undefined;
      return [data.left, data.right].map((recorded, i) => {
        const name = nameOf(recorded);
        const trace = traceOf(recorded, { entry: name, args: comparison.args });
        const value = trace.result.stop.kind === "returned" ? wValue(trace.result.final, 0) : null;
        return {
          name,
          value,
          type: i === 0 ? comparison.leftType : comparison.rightType,
        };
      });
    }, [committed, called, data.callComparison, data.left, data.right]);
    return (
      <div
        className="al-figure al-compare"
        data-figure="listing-compare"
        data-call-state={
          data.callComparison
            ? !committed
              ? "unpredicted"
              : called
                ? "returned"
                : "ready"
            : undefined
        }
      >
        <div className={data.callComparison && committed ? "al-pair-sides" : "al-compare-c"}>
          {data.callComparison && committed ? (
            [data.left, data.right].map((recorded, i) => (
              <div key={i}>
                <p>
                  <code>{names[i]}</code>
                </p>
                <ListingView cLines={cLinesOf(recorded.c)} lines={programLines(recorded)} />
              </div>
            ))
          ) : (
            <>
              <CPane recorded={data.left} />
              <CPane recorded={data.right} />
            </>
          )}
        </div>
        {data.callComparison && (
          <p className="al-compare-inputs">
            {C.startingInputs(data.callComparison.args.join(", "))}
          </p>
        )}
        <PredictionBox
          id={interactive.id}
          store={store}
          question={data.question}
          options={data.options}
          explain={data.explain}
          measure={measure}
          kind="listing-compare-prediction"
        />
        {committed && (
          <div className="al-compare-result">
            {!data.callComparison && (
              <ol className="al-compare-rows" aria-label={S.compare.table}>
                {rows.map((r, i) => (
                  <li key={i} className="al-compare-row" data-same={r.same}>
                    <span className="al-cmp-n">{i + 1}</span>
                    <span className="al-cmp-side" data-side="left">
                      <span className="al-cmp-name">{names[0]}</span>
                      <code>{r.left}</code>
                    </span>
                    <span className="al-cmp-side" data-side="right">
                      <span className="al-cmp-name">{names[1]}</span>
                      <code>{r.right}</code>
                    </span>
                    <span className="al-cmp-mark">
                      {r.same ? S.compare.same : S.compare.differs}
                    </span>
                  </li>
                ))}
              </ol>
            )}
            <p role="status" className="al-compare-summary">
              {rows.every((r) => r.same) ? S.compare.allSame(rows.length) : S.compare.notAllSame}
            </p>
            {!data.callComparison && (
              <details className="al-source-connections">
                <summary>{S.listing.sourceConnections}</summary>
                <div className="al-pair-sides">
                  {[data.left, data.right].map((recorded, i) => (
                    <div key={i}>
                      <p>{names[i]}</p>
                      <ListingView cLines={cLinesOf(recorded.c)} lines={programLines(recorded)} />
                    </div>
                  ))}
                </div>
              </details>
            )}
            {data.callComparison && (
              <div className="al-compare-calls">
                <div className="al-compare-call-controls">
                  <button
                    type="button"
                    className="button primary"
                    disabled={called === true}
                    onClick={() => setCalled(true)}
                  >
                    {C.callBoth}
                  </button>
                  {called && (
                    <button
                      type="button"
                      className="button secondary"
                      onClick={() => setCalled(undefined)}
                    >
                      {C.resetCalls}
                    </button>
                  )}
                </div>
                {calls && (
                  <CallResults
                    calls={calls}
                    workedReadings={data.callComparison.workedReadings}
                    tripContext={data.callComparison.tripContext}
                    tripDifference={
                      data.callComparison.args.length === 2 &&
                      data.callComparison.args.every((arg) => arg >= 0 && arg < 2 ** 31)
                        ? data.callComparison.args[0]! - data.callComparison.args[1]!
                        : null
                    }
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);
