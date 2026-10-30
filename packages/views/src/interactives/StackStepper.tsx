// Copyright © 2026 Christopher Snow

import { RegisterStateLabel } from "../RegisterStateLabel";
import { useHandoffState } from "../update-handoff";

import { useMemo } from "react";
import { z } from "zod";
import { Prose, useSlot } from "@platform/lesson-runtime";
import { cLinesOf } from "../listing";
import { hexAddress, hexByte, memoryRegister } from "../memoryFigure";
import { stopSentence } from "../messages";
import { ListingView, RegisterSummary, withCode } from "../parts";
import {
  stackFrames,
  stackDepth,
  stackReturnTarget,
  type StackFrame,
  type StackSlot,
} from "../stack";
import { VIEW_STRINGS as S } from "../strings";
import { STACK_STRINGS as T } from "../strings.stack";
import { traceOf, viewAt } from "../trace";
import { MemoryCallSchema, RecordedSchema, withProps } from "./props";

const Props = z.object({
  title: z.string().optional(),
  intro: z.string().optional(),
  program: RecordedSchema,
  call: MemoryCallSchema,
  registers: z
    .array(z.string().regex(/^[wx](?:[0-9]|[12][0-9]|30)$/))
    .min(1)
    .max(8),
  after: z.string().optional(),
  initialStep: z.number().int().min(0).default(0),
});

/** Each label encloses only the bytes written by its store, with unlabelled gaps kept visible. */
function byteGroups(frame: StackFrame) {
  const groups: { address: number; bytes: readonly number[]; slot?: StackSlot }[] = [];
  let offset = 0;
  while (offset < frame.bytes.length) {
    const address = frame.base + offset;
    const slot = frame.slots.find((saved) => saved.address === address);
    const next = frame.slots.find((saved) => saved.address > address)?.address ?? frame.top;
    const length = slot?.size ?? next - address;
    groups.push({
      address,
      bytes: frame.bytes.slice(offset, offset + length),
      ...(slot ? { slot } : {}),
    });
    offset += length;
  }
  return groups;
}

export const StackStepper = withProps(Props, function StackStepper({ data, store }) {
  const [k, setK] = useHandoffState("StackStepper.k", data.initialStep);
  const [prediction] = useSlot<{ choice: string }>(store, data.after ?? "");
  const unlocked = data.after === undefined || prediction !== undefined;
  const trace = useMemo(
    () =>
      unlocked
        ? traceOf(data.program, { ...data.call, maxSteps: data.call.maxSteps ?? 512 })
        : null,
    [unlocked, data.program, data.call],
  );
  if (trace === null)
    return (
      <p role="note" className="al-locked">
        {S.stepper.locked}
      </p>
    );
  const view = viewAt(trace, k),
    frames = stackFrames(trace, view.k),
    returnTarget = stackReturnTarget(trace, view.k);
  const step = view.k > 0 ? trace.result.steps[view.k - 1] : undefined;
  const next = view.next === null ? undefined : trace.lines[view.next];
  const accessAt = (address: number, size: number) => {
    const intersects = (start: number, length: number) =>
      address < start + length && address + size > start;
    if (step?.stores.some((store) => intersects(store.address, store.after.length)))
      return "stored";
    if (step?.loads.some((load) => intersects(load.address, load.size))) return "loaded";
    return "unchanged";
  };
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
    <div className="al-figure al-stepper al-stack" data-figure="stack-stepper" data-k={view.k}>
      {data.title && <h4>{data.title}</h4>}
      {data.intro && <Prose markdown={data.intro} />}
      <ListingView
        cLines={cLinesOf(data.program.c)}
        lines={trace.lines}
        next={view.next}
        ran={view.ran}
      />
      <RegisterStateLabel trace={trace} view={view} />
      <div className="al-memory-registers" role="group" aria-label={S.stepper.registers}>
        <RegisterSummary
          className="al-memory-register"
          name="sp"
          label={T.sp}
          value={hexAddress(Number(view.state.sp))}
          written={step?.writes.some((w) => w.reg === "sp") ?? false}
        />
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
      <p className="al-stack-return-target" data-return-target={returnTarget.address.toString()}>
        {withCode(
          returnTarget.instruction === null
            ? T.returnOutside(`0x${returnTarget.address.toString(16)}`)
            : T.returnTarget(`0x${returnTarget.address.toString(16)}`, returnTarget.instruction),
        )}
      </p>
      <label className="al-stack-slider">
        {T.position}
        <input
          type="range"
          min={0}
          max={view.total}
          value={view.k}
          onChange={(e) => setK(Number(e.target.value))}
        />
      </label>
      <div role="group" aria-label={T.stack} className="al-stack-memory">
        <p>{T.depth(stackDepth(trace, view.k))}</p>
        <p>{T.lower}</p>
        {frames.length > 0 && <p className="al-stack-offset-key">{T.offsets}</p>}
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
        {frames.length === 0 ? (
          <p>{T.empty}</p>
        ) : (
          <ol className="al-stack-frames">
            {frames.map((frame) => (
              <li
                key={frame.base}
                className="al-stack-frame"
                data-base={hexAddress(frame.base)}
                data-invocation={frame.invocation}
              >
                <p className="al-stack-frame-heading">
                  <strong>{T.invocation(frame.invocation)}</strong> ·{" "}
                  {T.frame(frame.name, frame.top - frame.base)}
                </p>
                <p className="al-stack-frame-range">
                  {T.frameRange(hexAddress(frame.base), hexAddress(frame.top - 1))}
                </p>
                <div className="al-stack-slots" role="group" aria-label={T.savedValues}>
                  {byteGroups(frame).map((group) => (
                    <div
                      key={group.address}
                      className="al-stack-slot"
                      data-saved-register={group.slot?.register}
                      data-slot-address={hexAddress(group.address)}
                      data-access={accessAt(group.address, group.bytes.length)}
                    >
                      <small
                        className="al-stack-slot-offset"
                        title={T.slotRange(
                          hexAddress(group.address),
                          hexAddress(group.address + group.bytes.length - 1),
                        )}
                        aria-label={T.slotRange(
                          hexAddress(group.address),
                          hexAddress(group.address + group.bytes.length - 1),
                        )}
                      >
                        {T.slotRange(
                          `+${group.address - frame.base}`,
                          `+${group.address + group.bytes.length - frame.base - 1}`,
                        )}
                      </small>
                      <span className="al-stack-slot-name">
                        {group.slot ? T.savedRegister(group.slot.register) : T.noSavedValue}
                      </span>
                      {group.slot && <code>{`0x${group.slot.value.toString(16)}`}</code>}
                      {accessAt(group.address, group.bytes.length) !== "unchanged" && (
                        <span className="al-stack-access">
                          {T[accessAt(group.address, group.bytes.length) as "stored" | "loaded"]}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <details className="al-stack-detail">
                  <summary>{T.inspectBytes}</summary>
                  <div className="al-stack-bytes">
                    {byteGroups(frame).map((group) => (
                      <div
                        key={group.address}
                        className="al-stack-byte-group"
                        data-saved-slot={group.slot !== undefined}
                      >
                        {group.slot && (
                          <span className="al-stack-slot-label">
                            <span>{T.savedRegister(group.slot.register)}</span>
                            <code>{`0x${group.slot.value.toString(16)}`}</code>
                          </span>
                        )}
                        {group.bytes.map((byte, i) => {
                          const address = group.address + i;
                          const stored =
                            step?.stores.some(
                              (s) => address >= s.address && address < s.address + s.after.length,
                            ) ?? false;
                          const loaded =
                            step?.loads.some(
                              (l) => address >= l.address && address < l.address + l.size,
                            ) ?? false;
                          return (
                            <span
                              key={address}
                              data-access={stored ? "stored" : loaded ? "loaded" : "unchanged"}
                              aria-label={T.byte(hexAddress(address), hexByte(byte))}
                            >
                              <small>{hexAddress(address)}</small>
                              <code>{hexByte(byte)}</code>
                            </span>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </details>
              </li>
            ))}
          </ol>
        )}
        <p>{T.active}</p>
      </div>
    </div>
  );
});
