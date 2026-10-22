// Copyright © 2026 Christopher Snow

import { useMemo, useState, type CSSProperties } from "react";
import { z } from "zod";

import { useSlot } from "@platform/lesson-runtime";

import { cLinesOf } from "../listing";
import { hexAddress, hexByte, memoryRegister, memoryTransferAt } from "../memoryFigure";
import { stopSentence } from "../messages";
import { FlagsRow } from "../FlagsRow";
import { ListingView, RegisterSummary, withCode } from "../parts";
import { VIEW_STRINGS as S } from "../strings";
import { MEMORY_STRINGS as M } from "../strings.memory";
import { memoryAt, traceOf, viewAt } from "../trace";
import { MemoryCallSchema, RecordedSchema, withProps } from "./props";

const Props = z.object({
  program: RecordedSchema,
  call: MemoryCallSchema,
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

export const MemoryStepper = withProps(Props, function MemoryStepper({ data, store }) {
  const [k, setK] = useState(0);
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
  const status =
    view.k === 0
      ? S.stepper.start
      : [
          step && S.stepper.ran(step.text),
          view.stop !== null
            ? (stopSentence(view.stop) ?? S.stepper.ended)
            : next && S.stepper.upNext(next.text),
        ]
          .filter(Boolean)
          .join(" ");
  return (
    <div className="al-figure al-stepper al-memory" data-figure="memory-stepper" data-k={view.k}>
      <ListingView
        cLines={cLinesOf(data.program.c)}
        lines={trace.lines}
        next={view.next}
        ran={view.ran}
      />
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
      {data.flags && (
        <FlagsRow
          flags={view.state.flags}
          before={view.k > 0 ? viewAt(trace, view.k - 1).state.flags : null}
        />
      )}
      {memory !== undefined && (
        <div role="group" aria-label={M.memory}>
          <p className="al-memory-heading">{M.memory}</p>
          <p className="al-memory-order">
            {memory.elementBytes === undefined ? M.addresses : M.elementAddresses}
          </p>
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
                            aria-label={M.byte(
                              hexAddress(address),
                              value === undefined ? "?" : hexByte(value),
                            )}
                          >
                            <code className="al-memory-address">{hexAddress(address)}</code>
                            <code className="al-memory-value">
                              {value === undefined ? "?" : hexByte(value)}
                            </code>
                            <span className="al-memory-access">{M[access]}</span>
                            {mapped && (
                              <span className="al-memory-range">
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
      {transfer && (
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
          <div className="al-memory-register-bytes">
            {transfer.bytes
              .filter((byte) => (data.extension && transfer.load) || byte.address !== null)
              .map((byte) => (
                <div
                  key={byte.index}
                  className="al-memory-register-byte"
                  data-byte={byte.index}
                  data-role={byte.role}
                >
                  <span className="al-memory-range">
                    {M.sourceBits(byte.index * 8, byte.index * 8 + 7)}
                  </span>
                  <code className="al-memory-value">{hexByte(byte.value)}</code>
                  {data.extension && <code className="al-memory-bits">{byte.bits}</code>}
                  <span className="al-memory-role">
                    {byte.role === "source"
                      ? M.storeSource
                      : byte.role === "loaded"
                        ? M.loadedBits
                        : M[byte.role]}
                  </span>
                  {byte.address !== null && (
                    <code className="al-memory-address">{hexAddress(byte.address)}</code>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
});
