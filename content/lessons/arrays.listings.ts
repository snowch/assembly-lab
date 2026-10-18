// Copyright © 2026 Christopher Snow

// GCC 16.1.0, carm64g1610, -O1. Exact requests and responses: docs/notes/module-7/compiler/.
export const READ_TRIP = {
  c: "unsigned read_trip(const unsigned *trips, unsigned long index)\n{\n    return trips[index];\n}",
  listing: "read_trip:\nldr w0, [x0, x1, lsl 2] C4\nret C4",
  sourceLines: [[3], [3]],
} as const;
export const SUM_TRIPS = {
  c: "unsigned sum_trips(const unsigned *trips, unsigned count)\n{\n    unsigned total = 0;\n    while (count != 0) {\n        total += *trips++;\n        count--;\n    }\n    return total;\n}",
  listing:
    "sum_trips:\nmov x2, x0 C2\ncbz w1, .L4 C4\nadd x3, x0, w1, uxtw 2 C4\nmov w0, 0 C3\n.L3:\nldr w1, [x2], 4 C5\nadd w0, w0, w1 C5\ncmp x2, x3 C4\nbne .L3 C4\n.L1:\nret C9\n.L4:\nmov w0, w1 C3\nb .L1 C8",
  sourceLines: [[], [4], [4], [3], [5], [5], [4], [4], [8], [3], [8]],
} as const;
export const LABEL_LENGTH = {
  c: "unsigned long label_length(const unsigned char *label, unsigned long capacity)\n{\n    unsigned long length = 0;\n    while (length < capacity) {\n        if (label[length] == 0) break;\n        length++;\n    }\n    return length;\n}",
  listing:
    "label_length:\nmov x3, x0 C2\ncbz x1, .L2 C4\nmov x0, 0 C3\n.L4:\nldrb w2, [x3, x0] C5\ncbz w2, .L1 C5\nadd x0, x0, 1 C6\ncmp x1, x0 C4\nbne .L4 C4\n.L2:\nmov x0, x1 C3\n.L1:\nret C9",
  sourceLines: [[], [4], [3], [5], [5], [6], [4], [4], [3, 8], [8]],
} as const;

export const LOG_ADDRESS = 0x410000;
export const TRIP_VALUES = [12, 25, 7, 40] as const;
export const tripBytes = (values: readonly number[]) =>
  values.flatMap((v) => [v & 255, (v >>> 8) & 255, (v >>> 16) & 255, v >>> 24]);
export const TRIP_BYTES = tripBytes(TRIP_VALUES);
export const LABEL_BYTES = [65, 45, 66, 45, 67, 0, 88, 0] as const;
// The following are course-authored assembly, with no claimed compiler source.
export const READ_TRIP_TEXT = "ldr w0, [x0, x1, lsl #2]\nret";
export const SUM_TRIPS_TEXT =
  "mov x2, x0\nmov w0, #0\ncbz w1, done\nloop:\nldr w3, [x2], #4\nadd w0, w0, w3\nsubs w1, w1, #1\nb.ne loop\ndone:\nret";
export const LENGTH_TEXT =
  "mov x3, x0\nmov x0, #0\ncbz x1, done\nloop:\nldrb w2, [x3, x0]\ncbz w2, done\nadd x0, x0, #1\ncmp x0, x1\nb.ne loop\ndone:\nret";
export const COUNT_MARKER_TEXT =
  "mov x2, x0\nmov w0, #0\nloop:\nldrb w3, [x2], #1\ncbz w3, done\ncmp w3, w1\nb.ne next\nadd w0, w0, #1\nnext:\nb loop\ndone:\nret";
export const OFFSET = { c: "", listing: "offset:\nldr w2, [x0, #4]\nret" } as const;
export const PRE_INDEX = { c: "", listing: "pre_index:\nldr w2, [x0, #4]!\nret" } as const;
export const POST_INDEX = { c: "", listing: "post_index:\nldr w2, [x0], #4\nret" } as const;
export const WRONG_SCALE = { c: "", listing: "wrong_scale:\nldr w0, [x0, x1]\nret" } as const;
export const WALK_LABEL = {
  c: "",
  listing:
    "walk_label:\nmov x2, x0\nmov w0, #0\nloop:\nldrb w3, [x2], #1\ncbz w3, done\nadd w0, w0, #1\nb loop\ndone:\nret",
} as const;
export const WRONG_TERMINATOR = {
  c: "",
  listing:
    "wrong_terminator:\nmov x2, x0\nmov w0, #0\nloop:\nldrb w3, [x2], #1\nadd w0, w0, #1\ncbnz w3, loop\nret",
} as const;
