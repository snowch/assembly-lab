// Copyright © 2026 Christopher Snow

import { useMemo, useState, type CSSProperties } from "react";
import { z } from "zod";

import { useSlot } from "@platform/lesson-runtime";

import { cLinesOf } from "../listing";
import {
  hexAddress,
  hexByte,
  memoryRegister,
  memoryTransferAt,
  type TransferByte,
} from "../memoryFigure";
import { stopSentence } from "../messages";
import { FlagsRow } from "../FlagsRow";
import { ListingView, RegisterSummary, withCode } from "../parts";
import { VIEW_STRINGS as S } from "../strings";
import { MEMORY_STRINGS as M } from "../strings.memory";
import { memoryAt, traceOf, viewAt } from "../trace";
import { MemoryCallSchema, RecordedSchema, withProps } from "./props";

const ComparisonCase = z.object({
  label: z.string(),
  program: RecordedSchema,
  call: MemoryCallSchema,
  registers: z
    .array(z.string().regex(/^[wx](?:[0-9]|[12][0-9]|30)$/))
    .min(1)
    .max(8),
});

const Props = z.object({
  program: RecordedSchema,
  call: MemoryCallSchema,
  cases: z.array(ComparisonCase).min(2).optional(),
  addressRegister: z
    .string()
    .regex(/^x(?:[0-9]|[12][0-9]|30)$/)
    .default("x0"),
  registers: z
    .array(z.string().regex(/^[wx](?:[0-9]|[12][0-9]|30)$/))
    .min(1)
    .max(8),
  memory: z
    .object({
      address: z
        .number()
        .int()
        .nonnegative()
        .max(Number.MAX_SAFE_INTEGER - 32),
      length: z.number().int().min(1).max(32),
      /** Group declared array elements without inferring a type from byte contents. */
      elementBytes: z.number().int().min(1).max(32).optional(),
      firstElement: z.number().int().nonnegative().default(0),
    })
    .refine(
      (memory) => memory.elementBytes === undefined || memory.length % memory.elementBytes === 0,
    )
    .optional(),
  after: z.string().optional(),
  /** Show the loaded bytes and the bits added by extension in the full physical register. */
  extension: z.boolean().default(false),
  /** Optional for memory operations whose surrounding arithmetic tests NZCV. */
  flags: z.boolean().default(false),
});

export const MemoryStepper = withProps(Props, function MemoryStepper({ data: supplied, store }) {
  const [selectedCase, setSelectedCase] = useState(0);
  const data = supplied.cases?.[selectedCase]
    ? { ...supplied, ...supplied.cases[selectedCase]! }
    : supplied;
  const [k, setK] = useState(0);
  const [showBits, setShowBits] = useState(false);
  const [prediction] = useSlot<{ choice: string }>(store, data.after ?? "");
  const unlocked = data.after === undefined || prediction !== undefined;
  const trace = useMemo(
    () => (unlocked ? traceOf(data.program, data.call) : null),
    [unlocked, data.program, data.call],
  );
  if (trace === null)
    return (
      <p role="note" className="al-locked">
        {S.stepper.locked}
      </p>
    );
  const view = viewAt(trace, k);
  const memory = data.memory;
  const bytes =
    memory === undefined ? undefined : memoryAt(trace, view.k, memory.address, memory.length);
  const step = view.k > 0 ? trace.result.steps[view.k - 1] : undefined;
  const transfer = memoryTransferAt(trace, view.k);
  const next = view.next === null ? undefined : trace.lines[view.next];
  // Address order and increasing register-bit order agree for a little-endian transfer.
  // Group only adjacent bytes with the same model-derived role, never inferred values.
  const regions: TransferByte[][] = [];
  for (const byte of [...(transfer?.bytes ?? [])]
    .filter((byte) => (data.extension && transfer?.load) || byte.address !== null)
    .sort((a, b) => a.index - b.index)) {
    const previous = regions.at(-1);
    if (previous?.[0]?.role === byte.role) previous.push(byte);
    else regions.push([byte]);
  }
  const status =
    view.k === 0
      ? [S.stepper.start, next && S.stepper.upNext(next.text)].filter(Boolean).join(" ")
      : [
          step && S.stepper.ran(step.text),
          view.stop !== null
            ? (stopSentence(view.stop) ?? S.stepper.ended)
            : next && S.stepper.upNext(next.text),
        ]
          .filter(Boolean)
          .join(" ");
  const transferView = transfer && (
    <div
      className="al-memory-transfer"
      role="group"
      aria-label={M.transfer}
      data-transfer={transfer.kind}
    >
      <p>
        {withCode(
          transfer.kind === "extend"
            ? M.extensionTransfer(
                transfer.instruction,
                transfer.sourceRegister ?? "",
                transfer.register,
              )
            : (transfer.load ? M.loadTransfer : M.storeTransfer)(
                transfer.instruction,
                hexAddress(transfer.address!),
                transfer.size,
                transfer.register,
              ),
        )}
      </p>
      <p className="al-memory-heading">
        <code>
          {data.extension && transfer.load ? transfer.physicalRegister : transfer.register}
        </code>
      </p>
      <p className="al-memory-order">{M.registerOrder}</p>
      <div className="al-memory-register-bytes">
        {regions.map((region) => {
          const first = region[0]!;
          const last = region[region.length - 1]!;
          const role =
            first.role === "source"
              ? M.storeSource
              : first.role === "loaded"
                ? M.loadedBits
                : M[first.role];
          return (
            <div className="al-memory-region" key={first.index}>
              <p className="al-memory-region-label">
                <span>{M.sourceBits(first.index * 8, last.index * 8 + 7)}</span>
                <span>{role}</span>
              </p>
              <div className="al-memory-region-bytes">
                {region.map((byte) => (
                  <div
                    key={byte.index}
                    className="al-memory-register-byte"
                    data-byte={byte.index}
                    data-role={byte.role}
                    aria-label={`${M.sourceBits(byte.index * 8, byte.index * 8 + 7)}: ${hexByte(byte.value)}. ${role}`}
                  >
                    {byte.address !== null && (
                      <code className="al-memory-address">{hexAddress(byte.address)}</code>
                    )}
                    <code className="al-memory-value">{hexByte(byte.value)}</code>
                    <span className="al-memory-range">
                      {M.sourceBits(byte.index * 8, byte.index * 8 + 7)}
                    </span>
                    {showBits && <code className="al-memory-bits">{byte.bits}</code>}
                    <span className="al-memory-role visually-hidden">{role}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {data.extension && (
        <button
          type="button"
          className="button secondary al-memory-bit-toggle"
          aria-expanded={showBits}
          onClick={() => setShowBits(!showBits)}
        >
          {showBits ? M.hideBits : M.showBits}
        </button>
      )}
    </div>
  );
  return (
    <div className="al-figure al-stepper al-memory" data-figure="memory-stepper" data-k={view.k}>
      {supplied.cases && (
        <label className="al-memory-case">
          {M.comparison}
          <select
            value={selectedCase}
            onChange={(event) => setSelectedCase(Number(event.target.value))}
          >
            {supplied.cases.map((item, index) => (
              <option key={index} value={index}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      )}
      {supplied.cases ? (
        <details className="al-memory-source-details">
          <summary>{M.inspectSource}</summary>
          <ListingView
            cLines={cLinesOf(data.program.c)}
            lines={trace.lines}
            next={view.next}
            ran={view.ran}
          />
        </details>
      ) : (
        <ListingView
          cLines={cLinesOf(data.program.c)}
          lines={trace.lines}
          next={view.next}
          ran={view.ran}
        />
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
          disabled={view.k >= view.total}
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
      <p className="al-status" role="status">
        {withCode(status)}
      </p>
      <div className="al-memory-registers" role="group" aria-label={S.stepper.registers}>
        {data.registers.map((name) => (
          <RegisterSummary
            key={name}
            className="al-memory-register"
            name={name}
            value={memoryRegister(trace, view.k, name)}
            written={view.written.has(Number(name.slice(1)))}
          />
        ))}
      </div>
      {supplied.cases && transfer?.address !== null && transfer?.address !== undefined && (
        <div className="al-memory-case-summary">
          <span>
            {M.addressUsed} <code>{hexAddress(transfer.address)}</code>
          </span>
          <span>
            <code>{data.addressRegister}</code> {M.before}{" "}
            <code>{memoryRegister(trace, Math.max(0, view.k - 1), data.addressRegister)}</code>
          </span>
          <span>
            <code>{data.addressRegister}</code> {M.after}{" "}
            <code>{memoryRegister(trace, view.k, data.addressRegister)}</code>
          </span>
        </div>
      )}
      {data.flags && (
        <FlagsRow
          flags={view.state.flags}
          before={view.k > 0 ? viewAt(trace, view.k - 1).state.flags : null}
        />
      )}
      {supplied.cases && transferView}
      {memory !== undefined && (
        <div role="group" aria-label={M.memory}>
          <p className="al-memory-heading">{M.memory}</p>
          <p className="al-memory-order">
            {memory.elementBytes === undefined ? M.addresses : M.elementAddresses}
          </p>
          {step && (step.loads.length > 0 || step.stores.length > 0) && (
            <p className="al-memory-legend">
              <span data-access={step.loads.length > 0 ? "loaded" : "stored"}>
                {step.loads.length > 0 ? M.loaded : M.stored}
              </span>
              <span>{M.untouchedLegend}</span>
            </p>
          )}
          <div className={memory.elementBytes === undefined ? undefined : "al-memory-elements"}>
            {Array.from(
              { length: memory.length / (memory.elementBytes ?? memory.length) },
              (_, element) => (
                <div
                  key={element}
                  className={memory.elementBytes === undefined ? undefined : "al-memory-element"}
                  data-element={
                    memory.elementBytes === undefined ? undefined : memory.firstElement + element
                  }
                  role={memory.elementBytes === undefined ? undefined : "group"}
                  aria-label={
                    memory.elementBytes === undefined
                      ? undefined
                      : M.element(memory.firstElement + element)
                  }
                >
                  {memory.elementBytes !== undefined && (
                    <p className="al-memory-heading">{M.element(memory.firstElement + element)}</p>
                  )}
                  <ol
                    className="al-memory-cells"
                    style={
                      memory.elementBytes === undefined
                        ? undefined
                        : ({
                            "--array-byte-columns": Math.min(memory.elementBytes, 4),
                          } as CSSProperties)
                    }
                  >
                    {Array.from(
                      { length: memory.elementBytes ?? memory.length },
                      (_, withinElement) => {
                        const index =
                          element * (memory.elementBytes ?? memory.length) + withinElement;
                        const address = memory.address + index;
                        const loaded =
                          step?.loads.some(
                            (a) => address >= a.address && address < a.address + a.size,
                          ) ?? false;
                        const stored =
                          step?.stores.some(
                            (a) => address >= a.address && address < a.address + a.after.length,
                          ) ?? false;
                        const value = bytes?.[index];
                        const mapped = transfer?.bytes.find((b) => b.address === address);
                        const access = loaded ? "loaded" : stored ? "stored" : "unchanged";
                        return (
                          <li
                            key={address}
                            data-address={hexAddress(address)}
                            data-access={access}
                            aria-label={
                              M.byte(
                                hexAddress(address),
                                value === undefined ? "?" : hexByte(value),
                              ) + `. ${M[access]}`
                            }
                          >
                            <code className="al-memory-address">{hexAddress(address)}</code>
                            <code className="al-memory-value">
                              {value === undefined ? "?" : hexByte(value)}
                            </code>
                            <span className="al-memory-access visually-hidden">{M[access]}</span>
                            {mapped && (
                              <span className="al-memory-range visually-hidden">
                                {M.sourceBits(mapped.index * 8, mapped.index * 8 + 7)}
                              </span>
                            )}
                          </li>
                        );
                      },
                    )}
                  </ol>
                </div>
              ),
            )}
          </div>
        </div>
      )}
      {!supplied.cases && transferView}
    </div>
  );
});
