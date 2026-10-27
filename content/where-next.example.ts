// Copyright © 2026 Christopher Snow

// Course-written plain-assembly caller for the existing trip function. This is not
// compiler output. The GNU/QEMU corpus and a live external-playground run check it.
const instructions = [
  "main:",
  "    stp x29, x30, [sp, #-16]!",
  "    mov x29, sp",
  "    mov w0, #120",
  "    mov w1, #85",
  "    mov w2, #42",
  "    mov w3, #15",
  "    bl trip_distance",
  "    ldp x29, x30, [sp], #16",
  "    ret",
  "",
  "trip_distance:",
  "    add w0, w0, w1",
  "    add w0, w0, w2",
  "    sub w0, w0, w3",
  "    ret",
] as const;

export const PLAYGROUND_STARTER = [
  "// Copyright © 2026 Christopher Snow",
  ".text",
  ".global main",
  ...instructions,
  "",
].join("\n");

export const PLAYGROUND_PROGRAM = { c: "", listing: instructions.join("\n") } as const;
export const PLAYGROUND_CALL = { entry: "main", args: [] } as const;
