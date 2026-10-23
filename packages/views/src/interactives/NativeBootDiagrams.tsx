// Copyright © 2026 Christopher Snow
import { useId, useState } from "react";
import { z } from "zod";
import { Prose } from "@platform/lesson-runtime";

const node = z.object({ id: z.string(), title: z.string(), actor: z.string(), detail: z.string() });
export const NativeDiagramProps = z.object({
  kind: z.enum(["flow", "memory"]),
  evidence: z.object({
    entry: z.number(),
    ramStart: z.number(),
    ramEnd: z.number(),
    regions: z.array(z.object({ kind: z.string(), start: z.number(), end: z.number() })),
    flow: z.object({
      entry: z.number(),
      ready: z.number(),
      trip: z.number(),
      returned: z.number(),
      output: z.number(),
      halted: z.number(),
    }),
    stackFrame: z.object({ beforeSp: z.number(), frameSp: z.number(), frameSize: z.number() }),
    image: z.object({
      sections: z.array(
        z.object({
          name: z.string(),
          address: z.number(),
          size: z.number(),
          fileOffset: z.number(),
          fileSize: z.number(),
        }),
      ),
      segments: z.array(
        z.object({
          offset: z.number(),
          address: z.number(),
          fileSize: z.number(),
          memorySize: z.number(),
        }),
      ),
    }),
  }),
  labels: z.object({
    flow: z.object({
      title: z.string(),
      note: z.string(),
      qemuTitle: z.string(),
      boardTitle: z.string(),
      boardNote: z.string(),
      controlArrow: z.string(),
      loadArrow: z.string(),
      entry: z.string(),
      host: z.string(),
      guest: z.string(),
      nodes: z.array(node).readonly(),
      boardNodes: z.array(node).readonly(),
    }),
    memory: z.object({
      title: z.string(),
      note: z.string(),
      file: z.string(),
      ram: z.string(),
      fileOffset: z.string(),
      loadAddress: z.string(),
      bytes: z.string(),
      notStored: z.string(),
      load: z.string(),
      reserve: z.string(),
      bss: z.string(),
      stack: z.string(),
      uart: z.string(),
      select: z.string(),
      rangeNote: z.string(),
      sectionDetails: z.record(z.string(), z.string()),
      entry: z.string(),
      stackTop: z.string(),
      stackBefore: z.string(),
      stackAfter: z.string(),
      stackGrowth: z.string(),
      uartNote: z.string(),
      segmentNote: z.string(),
      segments: z.string(),
      segmentFile: z.string(),
      segmentMemory: z.string(),
      stackSave: z.string(),
    }),
  }),
});
type Props = z.infer<typeof NativeDiagramProps>;
const hex = (n: number) => `0x${n.toString(16)}`;
const range = (address: number, size: number) => `${hex(address)}–${hex(address + size)}`;

export function NativeBootDiagrams({ kind, evidence, labels }: Props) {
  const id = useId();
  const [stage, setStage] = useState("loader");
  const [sectionName, setSectionName] = useState(".text");
  const f = labels.flow;
  const m = labels.memory;
  const pcs: Record<string, number> = {
    entry: evidence.flow.entry,
    startup: evidence.flow.ready,
    trip: evidence.flow.trip,
    result: evidence.flow.returned,
    uart: evidence.flow.output,
    halt: evidence.flow.halted,
  };
  const uart = evidence.regions.find((r) => r.kind === "uart");
  if (kind === "flow")
    return (
      <div className="al-boot-diagram" data-native-diagram="flow">
        <h3>{f.title}</h3>
        <Prose markdown={f.note} />
        <div className="al-boot-legend">
          <span>↓ {f.controlArrow}</span>
          <span>→ {f.loadArrow}</span>
        </div>
        <div className="al-boot-paths">
          <div>
            <h4>{f.qemuTitle}</h4>
            <ol className="al-boot-path" aria-label={f.qemuTitle}>
              {f.nodes.map((n, i) => (
                <li key={n.id}>
                  <button
                    type="button"
                    className="al-boot-node"
                    data-flow-stage={n.id}
                    aria-pressed={stage === n.id}
                    aria-expanded={stage === n.id}
                    aria-controls={`${id}-stage-${n.id}`}
                    onClick={() => setStage(n.id)}
                  >
                    <span>{n.actor}</span>
                    <strong>{n.title}</strong>
                    {pcs[n.id] !== undefined && <code>{hex(pcs[n.id]!)}</code>}
                  </button>
                  <div
                    id={`${id}-stage-${n.id}`}
                    className="al-boot-detail"
                    role="status"
                    hidden={stage !== n.id}
                  >
                    <strong>{n.title}</strong>
                    <Prose markdown={n.detail} />
                  </div>
                  {n.id === "loader" && (
                    <div className="al-boot-load" aria-label={f.loadArrow}>
                      <span>{m.file}</span>
                      <span>
                        <span aria-hidden="true">→ </span>
                        {f.loadArrow}
                      </span>
                      <span>{m.ram}</span>
                    </div>
                  )}
                  {i < f.nodes.length - 1 && (
                    <span className="al-boot-control" aria-hidden="true">
                      ↓
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>
          <div className="al-board-example">
            <h4>{f.boardTitle}</h4>
            <Prose markdown={f.boardNote} />
            <ol className="al-boot-path" aria-label={f.boardTitle}>
              {f.boardNodes.map((n, i) => (
                <li key={n.id}>
                  <div className="al-boot-node">
                    <span>{n.actor}</span>
                    <strong>{n.title}</strong>
                    <p>{n.detail}</p>
                  </div>
                  {i < f.boardNodes.length - 1 && (
                    <span className="al-boot-control" aria-hidden="true">
                      ↓
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    );
  return (
    <div className="al-boot-diagram" data-native-diagram="memory">
      <h3>{m.title}</h3>
      <Prose markdown={m.note} />
      <p>{m.rangeNote}</p>
      <div className="al-boot-legend">
        <span>→ {m.load}</span>
        <span>┄ {m.reserve}</span>
      </div>
      <div className="al-elf-heading" aria-hidden="true">
        <strong>{m.file}</strong>
        <span />
        <strong>{m.ram}</strong>
      </div>
      <div className="al-elf-rows" role="group" aria-label={m.title}>
        {[...evidence.image.sections]
          .sort((a, b) => a.address - b.address)
          .map((s) => (
            <div key={s.name}>
              <button
                type="button"
                className="al-elf-row"
                data-elf-section={s.name}
                data-file-backed={s.fileSize > 0}
                aria-label={`${m.select} ${s.name}. ${s.fileSize > 0 ? `${m.fileOffset}: ${range(s.fileOffset, s.fileSize)}, ${s.fileSize} ${m.bytes}` : m.notStored}. ${m.loadAddress}: ${range(s.address, s.size)}, ${s.size} ${m.bytes}`}
                aria-pressed={sectionName === s.name}
                aria-expanded={sectionName === s.name}
                aria-controls={`${id}-section-${s.name}`}
                onClick={() => setSectionName(s.name)}
              >
                <span className="al-elf-source">
                  <strong>{s.name}</strong>
                  {s.fileSize > 0 ? (
                    <>
                      <span>{m.fileOffset}</span>
                      <code>{range(s.fileOffset, s.fileSize)}</code>
                      <span>
                        {s.fileSize} {m.bytes}
                      </span>
                    </>
                  ) : (
                    <span>{m.notStored}</span>
                  )}
                </span>
                <span className="al-elf-transfer" data-load={s.fileSize > 0}>
                  <span aria-hidden="true">{s.fileSize > 0 ? "→" : "┄"}</span>
                  <span>{s.fileSize > 0 ? m.load : m.reserve}</span>
                </span>
                <span className="al-elf-target">
                  <strong>{s.name}</strong>
                  <span>{m.loadAddress}</span>
                  <code>{range(s.address, s.size)}</code>
                  <span>
                    {s.size} {m.bytes}
                  </span>
                </span>
              </button>
              <div
                id={`${id}-section-${s.name}`}
                className="al-boot-detail"
                role="status"
                data-section-detail
                hidden={sectionName !== s.name}
              >
                <strong>{s.name}</strong>
                <Prose markdown={m.sectionDetails[s.name] ?? ""} />
              </div>
            </div>
          ))}
      </div>
      <div className="al-boot-memory-notes">
        <p>
          {m.entry}: <code>{hex(evidence.entry)}</code>
        </p>
        <p>
          {m.ram}: <code>{range(evidence.ramStart, evidence.ramEnd - evidence.ramStart)}</code>
        </p>
      </div>
      <h4>{m.segments}</h4>
      <Prose markdown={m.segmentNote} />
      <div className="al-elf-segments">
        {evidence.image.segments.map((s) => (
          <div key={s.offset} data-load-segment>
            <p>
              {m.segmentFile}: <code>{range(s.offset, s.fileSize)}</code> ({s.fileSize} {m.bytes})
            </p>
            <p>
              {m.segmentMemory}: <code>{range(s.address, s.memorySize)}</code> ({s.memorySize}{" "}
              {m.bytes})
            </p>
          </div>
        ))}
      </div>
      <h4>{m.stackSave}</h4>
      <p>{m.stackGrowth}</p>
      <div className="al-boot-stack" data-native-stack>
        <div>
          <span>{m.stackBefore}</span>
          <code>{hex(evidence.stackFrame.beforeSp)}</code>
        </div>
        <div className="al-boot-frame">
          <span aria-hidden="true">↓</span>
          <strong>
            −{evidence.stackFrame.frameSize} {m.bytes}
          </strong>
        </div>
        <div>
          <span>{m.stackAfter}</span>
          <code>{hex(evidence.stackFrame.frameSp)}</code>
        </div>
      </div>
      {uart && (
        <div className="al-boot-device" data-native-device>
          <h4>{m.uart}</h4>
          <p>{m.uartNote}</p>
          <code>{range(uart.start, uart.end - uart.start)}</code>
        </div>
      )}
    </div>
  );
}
