// Copyright © 2026 Christopher Snow

import { useHandoffState } from "../update-handoff";
import { useRef, useState } from "react";
import { z } from "zod";
import { compileC } from "@al/compiler";
import { Prose, useSlot } from "@platform/lesson-runtime";
import { COMPILER_DIAGNOSTICS } from "../../../compiler/src/strings";
import { CSourceEditor } from "../CEditor";
import { compareGcc, gccLink } from "../compilerExplorer";
import { stopSentence } from "../messages";
import { recordedC, runC, type CRun } from "../compilerRun";
import { cLinesOf, labelOf, programLines, type RecordedProgram } from "../listing";
import { ListingView, DecimalRegister, withCode } from "../parts";
import { COMPILER_STRINGS as C } from "../strings.compiler";
import { VIEW_STRINGS as S } from "../strings";
import { viewAt, wValue } from "../trace";
import { withProps } from "./props";
const Props = z.object({
  source: z.string(),
  args: z.array(z.number().int().min(0).max(0xffffffff)),
  names: z.array(z.string()).min(1),
  signature: z.string(),
  after: z.string().optional(),
});
interface Stored {
  source: string;
  args: string[];
}
export const CompilerPlayground = withProps(
  Props,
  function CompilerPlayground({ data, interactive, store }) {
    const [saved, setSaved] = useSlot<Stored>(store, `${interactive.id}:source`),
      [prediction] = useSlot<{ choice: string }>(store, data.after ?? "");
    const source = saved?.source ?? data.source,
      args = saved?.args ?? data.args.map(String);
    const sourceRef = useRef(source);
    sourceRef.current = source;
    const [program, setProgram] = useHandoffState<RecordedProgram | null>(
        "CompilerPlayground.program",
        null,
      ),
      [result, setResult] = useHandoffState<CRun | null>("CompilerPlayground.result", null, {
        encode: (value) => (value === null ? null : { source, args: args.map(Number) }),
        decode: (value) => {
          if (value === null) return null;
          const call = value as { source: string; args: number[] };
          return runC(call.source, call.args);
        },
      }),
      [diagnostic, setDiagnostic] = useHandoffState("CompilerPlayground.diagnostic", ""),
      [k, setK] = useHandoffState("CompilerPlayground.k", 0),
      [gcc, setGcc] = useHandoffState<{ listing: string; cached: boolean } | null>(
        "CompilerPlayground.gcc",
        null,
      ),
      [loading, setLoading] = useState(false),
      [gccError, setGccError] = useHandoffState("CompilerPlayground.gccError", false);
    const unlocked = data.after === undefined || prediction !== undefined;
    if (!unlocked)
      return (
        <p role="note" className="al-locked">
          {S.stepper.locked}
        </p>
      );
    const edit = (nextSource: string, nextArgs = args) => {
      setSaved({ source: nextSource, args: nextArgs });
      setProgram(null);
      setResult(null);
      setDiagnostic("");
      setK(0);
      setGcc(null);
      setGccError(false);
    };
    const compile = () => {
      const compiled = compileC(source);
      setResult(null);
      setK(0);
      if (compiled.ok) {
        setProgram(recordedC(source, compiled));
        setDiagnostic("");
      } else {
        setProgram(null);
        setDiagnostic(
          compiled.errors
            .map((d) => C.playground.diagnostic(d.line, d.column, COMPILER_DIAGNOSTICS[d.code]))
            .join("\n"),
        );
      }
    };
    const run = () => {
      const inputs = parameters.map((_, i) => args[i] ?? "0");
      if (inputs.some((a) => !/^\d+$/.test(a.trim()))) {
        setResult(null);
        setDiagnostic(C.playground.argumentsInvalid);
        return;
      }
      const run = runC(source, inputs.map(Number));
      setResult(run);
      setK(0);
      if (run.ok) {
        setProgram(run.program);
        setDiagnostic("");
      } else {
        setProgram(null);
        setDiagnostic(
          run.diagnostics
            .map((d) => C.playground.diagnostic(d.line, d.column, COMPILER_DIAGNOSTICS[d.code]))
            .join("\n") ||
            (run.stage === "machine"
              ? (stopSentence(run.stop) ?? C.playground.machineFailed)
              : C.playground.machineFailed),
        );
      }
    };
    const compiled = compileC(source),
      parameters = compiled.ok ? compiled.parameters : data.args.map((_, i) => `w${i}`);
    const view = result?.ok ? viewAt(result.trace, k) : null;
    const nextLine =
      result?.ok && view?.next !== null && view?.next !== undefined
        ? result.trace.lines[view.next]
        : undefined;
    const nextLabel =
      result?.ok && view?.next !== null && view?.next !== undefined
        ? labelOf(result.trace.lines, view.next)
        : null;
    const loopPhase =
      result?.ok && view?.next !== null && view?.next !== undefined
        ? result.compiled.lineMap.find((association) => association.assemblyLine === view.next! + 1)
            ?.loopPhase
        : undefined;
    return (
      <div className="al-figure al-compiler" data-figure="compiler-playground">
        <details>
          <summary>{C.playground.subsetSummary}</summary>
          <Prose markdown={C.playground.subset} />
        </details>
        <CSourceEditor
          source={source}
          onChange={edit}
          config={{ signature: data.signature, names: data.names }}
        />
        <div className="al-c-fields" role="group" aria-label={C.playground.inputs}>
          {parameters.map((name, i) => (
            <label key={i}>
              {C.playground.input(name)}
              <input
                inputMode="numeric"
                value={args[i] ?? "0"}
                onChange={(e) => {
                  const next = parameters.map((_, j) => args[j] ?? "0");
                  next[i] = e.target.value;
                  edit(source, next);
                }}
              />
            </label>
          ))}
        </div>
        <div className="al-controls">
          <button type="button" className="button secondary" onClick={compile}>
            {C.playground.compile}
          </button>
          <button type="button" className="button primary" onClick={run}>
            {C.playground.run}
          </button>
          <button
            type="button"
            className="button secondary"
            onClick={() => edit(data.source, data.args.map(String))}
          >
            {C.playground.reset}
          </button>
        </div>
        {diagnostic && <p role="alert">{diagnostic}</p>}
        {program && (
          <>
            <p>{C.playground.courseTitle}</p>
            <ListingView
              cLines={cLinesOf(program.c)}
              lines={result?.ok ? result.trace.lines : programLines(program)}
              next={view?.next ?? null}
              ran={view?.ran ?? null}
            />
          </>
        )}
        {result?.ok && view && (
          <div data-compiler-step={view.k}>
            {nextLine?.kind === "instruction" && (
              <div
                className="al-compiler-current"
                data-next-source-line={nextLine.cLine ?? undefined}
              >
                <Prose
                  markdown={
                    nextLabel === null
                      ? S.stepper.upNext(nextLine.text)
                      : S.stepper.upNextIn(nextLine.text, nextLabel)
                  }
                />
                {loopPhase && (
                  <p className="al-compiler-phase">{C.playground.loopPhase[loopPhase]}</p>
                )}
                {nextLine.cLine !== null && (
                  <div>
                    <span>{S.listing.recordedAgainst(nextLine.cLine)}</span>
                    <code>{cLinesOf(result.program.c)[nextLine.cLine - 1]}</code>
                  </div>
                )}
              </div>
            )}
            <div className="al-controls" role="group" aria-label={S.stepper.controls}>
              <button
                type="button"
                className="button secondary"
                disabled={view.k === 0}
                onClick={() => setK(view.k - 1)}
              >
                {S.stepper.back}
              </button>
              <button
                type="button"
                className="button primary"
                disabled={view.k === view.total}
                onClick={() => setK(view.k + 1)}
              >
                {S.stepper.next}
              </button>
              <button
                type="button"
                className="button secondary"
                disabled={view.k === 0}
                onClick={() => setK(0)}
              >
                {S.stepper.reset}
              </button>
            </div>
            <p role="status">
              {withCode(
                view.k === view.total
                  ? C.playground.checked(result.value)
                  : view.k === 0
                    ? S.stepper.start
                    : S.stepper.ran(result.trace.result.steps[view.k - 1]!.text),
              )}
            </p>
            <div className="al-c-registers">
              {[
                ...new Set(
                  result.trace.lines.flatMap((line) =>
                    line.kind === "instruction" ? (line.text.match(/\bw\d+\b/g) ?? []) : [],
                  ),
                ),
              ]
                .map((name) => Number(name.slice(1)))
                .sort((a, b) => a - b)
                .map((n) => (
                  <DecimalRegister
                    key={n}
                    name={`w${n}`}
                    value={wValue(view.state, n)}
                    changed={view.written.has(n)}
                  />
                ))}
            </div>
          </div>
        )}
        <details aria-busy={loading}>
          <summary>{C.playground.compare}</summary>
          <p>
            {C.playground.privacy}{" "}
            <a href="https://godbolt.org/privacy" target="_blank" rel="noreferrer">
              {C.playground.privacyLink}
            </a>
          </p>
          <p>{C.playground.attribution}</p>
          <a href={gccLink(source)} target="_blank" rel="noreferrer">
            {C.playground.openGcc}
          </a>
          <div className="al-controls">
            <button
              type="button"
              className="button secondary"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                setGccError(false);
                try {
                  const response = await compareGcc(source);
                  if (sourceRef.current === source) setGcc(response);
                } catch {
                  if (sourceRef.current === source) setGccError(true);
                } finally {
                  setLoading(false);
                }
              }}
            >
              {loading ? C.playground.loading : C.playground.compare}
            </button>
          </div>
          {gccError && <p role="status">{C.playground.failed}</p>}
          {gcc && (
            <>
              <h4>{C.playground.gccTitle}</h4>
              {gcc.cached && <p>{C.playground.cached}</p>}
              <pre className="al-c-output">
                <code>{gcc.listing}</code>
              </pre>
            </>
          )}
        </details>
      </div>
    );
  },
);
