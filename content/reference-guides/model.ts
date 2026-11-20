// Copyright © 2026 Christopher Snow

import { assemble, parseRegName, run, stateAfter } from "@al/machine";
import type { MachineState, Program, RunResult, Step } from "@al/machine";
import type { ExplainedReferenceExample, ReferenceWatch } from "./types";

export interface BuiltReferenceExample {
  readonly source: string;
  readonly entry: string;
  readonly focusLabel: string;
  readonly focusEndLabel: string;
  /** Namespaced label to original local name, for the observed PC and memory labels. */
  readonly labelNames: ReadonlyMap<string, string>;
}
export interface ReferenceExampleRow {
  readonly kind: ReferenceWatch["kind"];
  readonly label: string;
  readonly before: string;
  readonly after: string;
  readonly reading?: "signed" | "unsigned" | "hex";
  readonly symbol?: string;
  readonly bytes?: number;
}
export interface ComputedReferenceExample {
  readonly instruction: string;
  readonly rows: readonly ReferenceExampleRow[];
  readonly branch?: { readonly taken: boolean; readonly target: string };
}

/** Each example owns its setup, data and branch labels; it never reads lesson artifacts. */
export function buildReferenceExample(
  example: ExplainedReferenceExample,
  prefix = "reference_example",
): BuiltReferenceExample {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(prefix))
    throw new Error(`Invalid reference prefix: ${prefix}`);
  const body = [example.setup, example.instruction, example.continuation, example.data]
    .filter((part): part is string => part !== undefined)
    .join("\n");
  if (/\b[wx]28\b/i.test(body.replace(/\/\/[^\n]*/g, ""))) {
    throw new Error(`${example.id}: x28 is reserved for the supplied return address`);
  }
  const labelNames = new Map<string, string>();
  const namespace = (source: string) =>
    source.replace(/\.L[A-Za-z0-9_.$]*/g, (label) => {
      const renamed = `.L${prefix}_${label.slice(2)}`;
      labelNames.set(renamed, label);
      return renamed;
    });
  const source = namespace(
    [
      ".text",
      `.global ${prefix}`,
      `${prefix}:`,
      "mov x28, x30",
      example.setup ?? "",
      ".Lfocus:",
      example.instruction,
      ".Lfocus_end:",
      example.continuation ?? "",
      ".Lafter:",
      "mov x30, x28",
      "ret",
      example.data ?? "",
      "",
    ].join("\n"),
  );
  return {
    source,
    entry: prefix,
    focusLabel: `.L${prefix}_focus`,
    focusEndLabel: `.L${prefix}_focus_end`,
    labelNames,
  };
}

function valueText(value: bigint, bits: number, reading: "signed" | "unsigned" | "hex"): string {
  if (reading === "hex") return `0x${BigInt.asUintN(bits, value).toString(16).toUpperCase()}`;
  return (
    reading === "signed" ? BigInt.asIntN(bits, value) : BigInt.asUintN(bits, value)
  ).toString();
}

function flagText(state: MachineState): string {
  return `N=${Number(state.flags.n)} Z=${Number(state.flags.z)} C=${Number(state.flags.c)} V=${Number(state.flags.v)}`;
}

function addressText(address: number, program: Program, built: BuiltReferenceExample): string {
  const symbol = Object.values(program.symbols).find(
    (item) => item.address === address && !built.labelNames.get(item.name)?.startsWith(".Lfocus"),
  );
  const local = symbol ? built.labelNames.get(symbol.name) : undefined;
  const hex = `0x${address.toString(16).toUpperCase()}`;
  return local ? `${local} (${hex})` : hex;
}

/** Read the selected mapped bytes as they were at this trace moment, not at final cleanup. */
function memoryAt(
  program: Program,
  result: RunResult,
  address: number,
  bytes: number,
  inclusiveStep: number,
): bigint {
  if (!Number.isInteger(bytes) || bytes < 1 || bytes > 16) {
    throw new Error(`Reference memory watches need 1 to 16 bytes, got ${bytes}`);
  }
  const selected = new Uint8Array(bytes);
  for (let offset = 0; offset < bytes; offset++) {
    const absolute = address + offset;
    const section = program.sections.find(
      (candidate) => absolute >= candidate.base && absolute < candidate.base + candidate.size,
    );
    if (!section || section.kind === "text") {
      throw new Error(`Reference memory watch is outside mapped data at ${absolute}`);
    }
    selected[offset] = section.bytes[absolute - section.base] ?? 0;
  }
  for (const step of result.steps.slice(0, inclusiveStep + 1)) {
    for (const store of step.stores) {
      for (let offset = 0; offset < store.after.length; offset++) {
        const watchedOffset = store.address + offset - address;
        if (watchedOffset >= 0 && watchedOffset < bytes) {
          selected[watchedOffset] = store.after[offset]!;
        }
      }
    }
  }
  let value = 0n;
  for (let offset = bytes - 1; offset >= 0; offset--)
    value = (value << 8n) | BigInt(selected[offset]!);
  return value;
}

function rowFor(
  watch: ReferenceWatch,
  before: MachineState,
  after: MachineState,
  result: RunResult,
  program: Program,
  built: BuiltReferenceExample,
  focusIndex: number,
): ReferenceExampleRow {
  if (watch.kind === "flags") {
    return { kind: watch.kind, label: "N Z C V", before: flagText(before), after: flagText(after) };
  }
  if (watch.kind === "pc") {
    return {
      kind: watch.kind,
      label: "PC",
      before: addressText(before.pc, program, built),
      after: addressText(after.pc, program, built),
    };
  }
  if (watch.kind === "address") {
    const symbol = Object.entries(program.symbols).find(
      ([name]) => built.labelNames.get(name) === watch.symbol,
    )?.[1];
    if (!symbol) throw new Error(`Unknown reference address symbol: ${watch.symbol}`);
    const value = `0x${symbol.address.toString(16).toUpperCase()}`;
    return {
      kind: watch.kind,
      label: watch.symbol,
      symbol: watch.symbol,
      before: value,
      after: value,
    };
  }
  const reading = watch.reading ?? "unsigned";
  if (watch.kind === "register") {
    const register = parseRegName(watch.name);
    if (!register) throw new Error(`Unknown reference register: ${watch.name}`);
    const read = (state: MachineState) =>
      register.role === "zero" ? 0n : register.role === "sp" ? state.sp : state.x[register.n]!;
    return {
      kind: watch.kind,
      label: watch.name,
      before: valueText(read(before), register.width, reading),
      after: valueText(read(after), register.width, reading),
      reading,
    };
  }
  const symbol = Object.entries(program.symbols).find(
    ([name]) => built.labelNames.get(name) === watch.symbol,
  )?.[1];
  if (!symbol) throw new Error(`Unknown reference memory symbol: ${watch.symbol}`);
  return {
    kind: watch.kind,
    label: watch.symbol,
    symbol: watch.symbol,
    bytes: watch.bytes,
    before: valueText(
      memoryAt(program, result, symbol.address, watch.bytes, focusIndex - 1),
      watch.bytes * 8,
      reading,
    ),
    after: valueText(
      memoryAt(program, result, symbol.address, watch.bytes, focusIndex),
      watch.bytes * 8,
      reading,
    ),
    reading,
  };
}

const computed = new WeakMap<ExplainedReferenceExample, ComputedReferenceExample>();

/** Both snapshots belong to the one displayed instruction in its independently prepared run. */
export function computeReferenceExample(
  example: ExplainedReferenceExample,
): ComputedReferenceExample {
  const cached = computed.get(example);
  if (cached) return cached;
  const built = buildReferenceExample(example);
  const assembled = assemble(built.source);
  if (!assembled.program) {
    throw new Error(
      `${example.id}: reference example does not assemble: ${JSON.stringify(assembled.errors)}`,
    );
  }
  const program = assembled.program;
  const focus = program.symbols[built.focusLabel];
  const end = program.symbols[built.focusEndLabel];
  if (!focus || !end || end.address - focus.address !== 4) {
    throw new Error(`${example.id}: a reference example must display exactly one instruction`);
  }
  const result = run(program, { entry: built.entry, maxSteps: 100 });
  if (result.stop.kind !== "returned") {
    throw new Error(`${example.id}: reference example stopped with ${JSON.stringify(result.stop)}`);
  }
  const focusSteps = result.steps
    .map((step, index) => ({ step, index }))
    .filter(({ step }) => step.address === focus.address);
  if (focusSteps.length !== 1)
    throw new Error(`${example.id}: displayed instruction must execute exactly once`);
  const focusIndex = focusSteps[0]!.index;
  const step: Step = focusSteps[0]!.step;
  const before = stateAfter(result, focusIndex - 1);
  const after = stateAfter(result, focusIndex);
  const value: ComputedReferenceExample = {
    instruction: example.instruction,
    rows: example.watch.map((watch) =>
      rowFor(watch, before, after, result, program, built, focusIndex),
    ),
    ...(step.branch
      ? {
          branch: {
            taken: step.branch.taken,
            target: addressText(step.branch.target, program, built),
          },
        }
      : {}),
  };
  computed.set(example, value);
  return value;
}
