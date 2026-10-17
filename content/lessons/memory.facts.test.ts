// Copyright © 2026 Christopher Snow

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { assemble, run } from "@al/machine";
import * as memory from "./memory.listings";

const compiled = [
  "read_distance",
  "save_distance",
  "read_fuel",
  "read_gradient",
  "read_pulse",
  "read_offset",
  "read_offset_long",
  "read_gradient_long",
  "read_long",
  "save_fuel",
  "save_pulse",
  "save_long",
  "signed_byte",
  "unsigned_byte",
  "signed_long",
  "add_adjustment",
] as const;
const plain = (s: string) => s.replace(/ C\d+$/gm, "");
const normal = (s: string) =>
  plain(s)
    .split("\n")
    .map((s) => s.trim().replace(/\s+/g, " "))
    .filter((s) => s && !s.startsWith("//"))
    .join("\n");
const rootFile = (name: string) => readFileSync(new URL(`../../${name}`, import.meta.url), "utf8");
const names = memory as unknown as Record<string, { c: string; listing: string }>;
function execute(
  listing: string,
  args: readonly (number | bigint)[],
  bytes: readonly number[] = [],
) {
  const source =
    plain(listing) + (bytes.length ? `\n.data\nsensor:\n.byte ${bytes.join(",")}` : "");
  const a = assemble(source);
  if (!a.program) throw Error(JSON.stringify(a.errors));
  return run(a.program, {
    entry: 0x400000,
    args: args.map((value) => ({ value: BigInt(value), width: 64 })),
    maxSteps: 30,
  });
}

it.each(compiled)("%s matches its actual GCC request, response and source mapping", (name) => {
  const shown = names[name.toUpperCase()]!;
  const base = `docs/notes/module-6/compiler/${name}`;
  const source = rootFile(base + ".c");
  const request = JSON.parse(rootFile(base + ".request.json"));
  const response = JSON.parse(rootFile(base + ".response.json")) as {
    code: number;
    asm: { text: string; source?: { line: number } | null }[];
  };
  expect(request.source).toBe(source);
  expect(request.options.userArguments).toBe("-O1");
  expect(source.split("\n").slice(1).join("\n").trimEnd()).toBe(shown.c);
  expect(response.code).toBe(0);
  expect(
    shown.listing
      .split("\n")
      .map((s) => s.trim())
      .join("\n"),
  ).toBe(
    response.asm
      .map(
        (row) =>
          row.text.trim().replace(/\s+/g, " ") + (row.source ? ` C${row.source.line - 1}` : ""),
      )
      .join("\n"),
  );
  const corpus = rootFile(`scripts/real-tools/corpus/module6-${name.replaceAll("_", "-")}.s`);
  expect(normal(corpus.split(".data")[0]!)).toBe(normal(shown.listing));
  const notes = rootFile("docs/notes/module-6/listings.md");
  expect(notes).toContain(shown.c);
  expect(notes).toContain(shown.listing);
});

it("keeps the course-authored UXTB separate from the compiled AND", () => {
  expect(memory.UNSIGNED_BYTE.listing).toContain("and w0, w0, 255");
  expect(memory.UNSIGNED_BYTE_EXPLICIT.c).toBe("");
  expect(normal(rootFile("scripts/real-tools/corpus/module6-unsigned-byte-explicit.s"))).toBe(
    normal(memory.UNSIGNED_BYTE_EXPLICIT.listing),
  );
});

describe("memory and addresses", () => {
  it("loads the four little-endian bytes, leaves memory alone and overwrites the pointer register", () => {
    const r = execute(memory.READ_DISTANCE.listing, [memory.SENSOR_ADDRESS], memory.SAMPLE_BYTES);
    expect(r.stop.kind).toBe("returned");
    expect(r.final.x[0]).toBe(0x12345678n);
    expect(r.read(memory.SENSOR_ADDRESS, 8)).toEqual(Uint8Array.from(memory.SAMPLE_BYTES));
    expect(r.steps[0]?.loads).toEqual([{ address: memory.SENSOR_ADDRESS, size: 4 }]);
    expect(r.steps).toHaveLength(2);
  });
  it.each([
    [memory.SAVE_FUEL, 1, [0xef, 0x56, 0x34, 0x12, 0xfe, 0x80, 0x34, 0xf2]],
    [memory.SAVE_PULSE, 2, [0xef, 0xcd, 0x34, 0x12, 0xfe, 0x80, 0x34, 0xf2]],
    [memory.SAVE_DISTANCE, 4, [0xef, 0xcd, 0xab, 0x89, 0xfe, 0x80, 0x34, 0xf2]],
  ] as const)(
    "stores only the selected %s width and preserves neighbours",
    (shown, size, expected) => {
      const r = execute(shown.listing, [memory.SENSOR_ADDRESS, 0x89abcdef], memory.SAMPLE_BYTES);
      expect(r.stop.kind).toBe("returned");
      expect(r.final.x[0]).toBe(BigInt(memory.SENSOR_ADDRESS));
      expect(r.final.x[1]).toBe(0x89abcdefn);
      expect(r.read(memory.SENSOR_ADDRESS, 8)).toEqual(Uint8Array.from(expected));
      expect(r.steps[0]?.stores[0]?.after).toHaveLength(size);
    },
  );
  it("loads and stores all eight bytes for an x register", () => {
    const r = execute(memory.READ_LONG.listing, [memory.SENSOR_ADDRESS], memory.SAMPLE_BYTES);
    expect(r.final.x[0]).toBe(0xf23480fe12345678n);
    const s = execute(
      memory.SAVE_LONG.listing,
      [memory.SENSOR_ADDRESS, 0x8877665544332211n],
      memory.SAMPLE_BYTES,
    );
    expect(s.read(memory.SENSOR_ADDRESS, 8)).toEqual(
      Uint8Array.of(0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88),
    );
  });
});

describe("the instruction chooses the width and extension", () => {
  it.each([0, 127, 128, 254, 255])("reads byte %i as unsigned, signed32 and signed64", (byte) => {
    const bytes = [byte, 0xaa, 0xbb, 0xcc];
    const u = execute(memory.READ_FUEL.listing, [memory.SENSOR_ADDRESS], bytes);
    const s = execute(memory.READ_GRADIENT.listing, [memory.SENSOR_ADDRESS], bytes);
    const x = execute(memory.READ_GRADIENT_LONG.listing, [memory.SENSOR_ADDRESS], bytes);
    const signed = BigInt.asIntN(8, BigInt(byte));
    expect(u.final.x[0]).toBe(BigInt(byte));
    expect(s.final.x[0]).toBe(BigInt.asUintN(32, signed));
    expect(x.final.x[0]).toBe(BigInt.asUintN(64, signed));
    expect(u.read(memory.SENSOR_ADDRESS, 4)).toEqual(Uint8Array.from(bytes));
    for (const r of [u, s, x])
      expect(r.steps[0]?.loads).toEqual([{ address: memory.SENSOR_ADDRESS, size: 1 }]);
  });
  it.each([0, 32767, 32768, 65535])(
    "reads halfword %i and preserves its sign when requested",
    (value) => {
      const bytes = [value & 255, value >>> 8, 0x55, 0xaa];
      expect(execute(memory.READ_PULSE.listing, [memory.SENSOR_ADDRESS], bytes).final.x[0]).toBe(
        BigInt(value),
      );
      expect(execute(memory.READ_OFFSET.listing, [memory.SENSOR_ADDRESS], bytes).final.x[0]).toBe(
        BigInt.asUintN(32, BigInt.asIntN(16, BigInt(value))),
      );
    },
  );
  it.each([0, 2147483647, 2147483648, 4294967295])(
    "sign-extends word %i to all 64 register bits",
    (value) => {
      const bytes = [value & 255, (value >>> 8) & 255, (value >>> 16) & 255, value >>> 24];
      expect(
        execute(memory.READ_OFFSET_LONG.listing, [memory.SENSOR_ADDRESS], bytes).final.x[0],
      ).toBe(BigInt.asUintN(64, BigInt.asIntN(32, BigInt(value))));
    },
  );
  it.each([0, 127, 128, 254, 255, 256, 0x123456fe, 0xffffffff])(
    "register extensions keep the selected low bits for %i",
    (value) => {
      const signed = execute(memory.SIGNED_BYTE.listing, [value]);
      const unsigned = execute(memory.UNSIGNED_BYTE.listing, [value]);
      const explicit = execute(memory.UNSIGNED_BYTE_EXPLICIT.listing, [value]);
      expect(signed.final.x[0]).toBe(BigInt.asUintN(32, BigInt.asIntN(8, BigInt(value))));
      expect(unsigned.final.x[0]).toBe(BigInt(value & 255));
      expect(explicit.final.x[0]).toBe(unsigned.final.x[0]);
      expect(execute(memory.SIGNED_LONG.listing, [value]).final.x[0]).toBe(
        BigInt.asUintN(64, BigInt.asIntN(32, BigInt(value))),
      );
    },
  );
  it("extends the signed second operand before 64-bit addition", () => {
    const r = execute(memory.ADD_ADJUSTMENT.listing, [0x100000000n, 0xfffffffe]);
    expect(r.final.x[0]).toBe(0xfffffffen);
    expect(r.final.x[1]).toBe(0xfffffffen);
  });
});

describe("the lessons' displayed examples and course-authored programs", () => {
  const fixture = [0xf9, 0xff, 0xff, 0xff, 0xaa, 0xbb, 0xcc, 0xdd];
  it.each([
    [memory.READ_FUEL, 249n],
    [memory.READ_GRADIENT, 0xfffffff9n],
    [memory.READ_GRADIENT_LONG, 0xfffffffffffffff9n],
    [memory.READ_PULSE, 65529n],
    [memory.READ_OFFSET, 0xfffffff9n],
    [memory.READ_OFFSET_LONG, 0xfffffffffffffff9n],
  ] as const)("pins the same starting bytes in %s", (shown, expected) => {
    const r = execute(shown.listing, [memory.SENSOR_ADDRESS], fixture);
    expect(r.final.x[0]).toBe(expected);
    expect(r.read(memory.SENSOR_ADDRESS, fixture.length)).toEqual(Uint8Array.from(fixture));
  });
  it("pins -7 as both a signed byte and a signed word", () => {
    expect(execute(memory.SIGNED_BYTE.listing, [0xf9]).final.x[0]).toBe(0xfffffff9n);
    expect(execute(memory.UNSIGNED_BYTE_EXPLICIT.listing, [0xf9]).final.x[0]).toBe(249n);
    expect(execute(memory.SIGNED_LONG.listing, [0xfffffff9]).final.x[0]).toBe(0xfffffffffffffff9n);
    expect(execute(memory.ADD_ADJUSTMENT.listing, [100, 0xfffffff9]).final.x[0]).toBe(93n);
  });
  it("shows how the wrong byte load changes the adjusted reading", () => {
    expect(
      execute(memory.ADJUST_GRADIENT.listing, [memory.SENSOR_ADDRESS, 100], fixture).final.x[0],
    ).toBe(93n);
    expect(
      execute(memory.ADJUST_GRADIENT_WRONG.listing, [memory.SENSOR_ADDRESS, 100], fixture).final
        .x[0],
    ).toBe(349n);
  });
  it("pins the store-width comparison's changed and unchanged bytes", () => {
    for (const [shown, expected] of [
      [memory.SAVE_FUEL, [0x78, 0xbb, 0xcc, 0xdd]],
      [memory.SAVE_PULSE, [0x78, 0x56, 0xcc, 0xdd]],
      [memory.STORE_WIDE, [0x78, 0x56, 0x34, 0x12]],
    ] as const) {
      const r = execute(
        shown.listing,
        [memory.SENSOR_ADDRESS, 0x12345678],
        [0xaa, 0xbb, 0xcc, 0xdd],
      );
      expect(r.read(memory.SENSOR_ADDRESS, 4)).toEqual(Uint8Array.from(expected));
    }
  });
  it("pins the eight-byte displayed total and its full store", () => {
    const bytes = [0x78, 0x56, 0x34, 0x12, 0xef, 0xcd, 0xab, 0x90];
    expect(execute(memory.READ_LONG.listing, [memory.SENSOR_ADDRESS], bytes).final.x[0]).toBe(
      0x90abcdef12345678n,
    );
    expect(
      execute(
        memory.SAVE_LONG.listing,
        [memory.SENSOR_ADDRESS, 0x90abcdef12345678n],
        Array(8).fill(0),
      ).read(memory.SENSOR_ADDRESS, 8),
    ).toEqual(Uint8Array.from(bytes));
  });
  it.each([
    ["store-wide", memory.STORE_WIDE.listing],
    ["save-distance-reference", "save_distance_reference:\n" + memory.SAVE_DISTANCE_TEXT],
    ["copy-distance-reference", "copy_distance_reference:\n" + memory.COPY_DISTANCE_TEXT],
    ["adjust-gradient", memory.ADJUST_GRADIENT.listing],
    ["adjust-gradient-wrong", memory.ADJUST_GRADIENT_WRONG.listing],
    ["read-sensors-reference", "read_sensors_reference:\n" + memory.READ_SENSORS_TEXT],
  ])("keeps %s identical to its GNU as/QEMU corpus program", (name, listing) => {
    const source = rootFile(`scripts/real-tools/corpus/module6-${name}.s`);
    expect(normal(source.split(".data")[0]!)).toBe(normal(listing!));
  });
  it("covers all identical challenge starting points", () => {
    const start = rootFile("scripts/real-tools/corpus/module6-memory-start.s");
    for (const listing of [
      memory.SAVE_DISTANCE_STARTING_TEXT,
      memory.COPY_DISTANCE_STARTING_TEXT,
      memory.ADJUST_GRADIENT_STARTING_TEXT,
      memory.READ_SENSORS_STARTING_TEXT,
    ]) {
      expect(normal(start.split(".data")[0]!)).toBe(normal("memory_start:\n" + listing));
    }
  });
});

// The failure prediction uses correction 10; the extended-add example uses 100.
it("pins the failure prediction's correction separately", () => {
  const fixture = [0xf9, 0xff, 0xff, 0xff, 0xaa, 0xbb, 0xcc, 0xdd];
  expect(
    execute(memory.ADJUST_GRADIENT.listing, [memory.SENSOR_ADDRESS, 10], fixture).final.x[0],
  ).toBe(3n);
  expect(
    execute(memory.ADJUST_GRADIENT_WRONG.listing, [memory.SENSOR_ADDRESS, 10], fixture).final.x[0],
  ).toBe(259n);
});
