// Copyright © 2026 Christopher Snow

// Exact GCC 16.1.0 records, flags and source maps: docs/notes/module-11/compiler/.
export const CAN_INCREMENT = {
  sourceLines: [[3], [3]],
  c: "int can_increment(int distance)\n{\n    return distance + 1 > distance;\n}",
  listing: "can_increment:\nmov w0, 1 C4\nret C4",
} as const;

export const CAN_INCREMENT_WRAP = {
  sourceLines: [[3], [3], [3], [3]],
  c: "int can_increment(int distance)\n{\n    return distance + 1 > distance;\n}",
  listing: "can_increment:\nmov w1, 2147483647 C3\ncmp w0, w1 C3\ncset w0, ne C4\nret C4",
} as const;

export const INCREMENT_LIMIT = {
  sourceLines: [[4], [4], [4], [4]],
  c: "#include <limits.h>\nint increment_limit(int distance)\n{\n    return distance == INT_MAX;\n}",
  listing: "increment_limit:\nmov w1, 2147483647 C4\ncmp w0, w1 C4\ncset w0, eq C5\nret C5",
} as const;

export const SAFE_INCREMENT_BRANCH = {
  sourceLines: [[4], [4], [4], [6], [5, 6]],
  c: "#include <limits.h>\nint safe_increment(int distance)\n{\n    if (distance == INT_MAX)\n        return distance;\n    return distance + 1;\n}",
  listing:
    "safe_increment:\nmov w1, 2147483647 C4\ncmp w0, w1 C4\nbeq .L1 C4\nadd w0, w0, 1 C6\n.L1:\nret C7",
} as const;

export const NARROW_FUEL = {
  sourceLines: [[3], [3]],
  c: "unsigned narrow_fuel(unsigned fuel)\n{\n    return (unsigned char)fuel;\n}",
  listing: "narrow_fuel:\nand w0, w0, 255 C4\nret C4",
} as const;

export const NARROW_GRADIENT = {
  sourceLines: [[3], [3]],
  c: "int narrow_gradient(int gradient)\n{\n    return (signed char)gradient;\n}",
  listing: "narrow_gradient:\nsxtb w0, w0 C4\nret C4",
} as const;

export const FUEL_FITS = {
  sourceLines: [[3], [3], [3]],
  c: "unsigned fuel_fits(unsigned fuel)\n{\n    return fuel <= 255;\n}",
  listing: "fuel_fits:\ncmp w0, 255 C3\ncset w0, ls C4\nret C4",
} as const;

export const CHECKED_TRIP = {
  sourceLines: [[4], [4], [4], [4]],
  c: "#include <stdckdint.h>\n_Bool checked_trip(int distance, int adjustment, int *result)\n{\n    return ckd_add(result, distance, adjustment);\n}",
  listing: "checked_trip:\nadds w0, w0, w1 C4\nstr w0, [x2] C4\ncset w0, vs C5\nret C5",
} as const;

export const NEGATE_GRADIENT = {
  sourceLines: [[3], [3]],
  c: "int negate_gradient(int gradient)\n{\n    return -gradient;\n}",
  listing: "negate_gradient:\nneg w0, w0 C4\nret C4",
} as const;

export const UNSIGNED_SUM_OVERFLOW = {
  sourceLines: [[3], [3], [3], [3]],
  c: "unsigned unsigned_sum_overflow(unsigned distance, unsigned leg)\n{\n    return distance + leg < distance;\n}",
  listing: "unsigned_sum_overflow:\nadd w1, w0, w1 C3\ncmp w1, w0 C3\ncset w0, cc C4\nret C4",
} as const;

export const UNSIGNED_SUB_WRAP = {
  sourceLines: [[3], [3], [3]],
  c: "unsigned unsigned_sub_wrap(unsigned now, unsigned then)\n{\n    return now - then > now;\n}",
  listing: "unsigned_sub_wrap:\ncmp w1, w0 C3\ncset w0, hi C4\nret C4",
} as const;

export const PROMOTED_GRADIENT = {
  sourceLines: [[1], [3], [3]],
  c: "int promoted_gradient(signed char gradient)\n{\n    return gradient + 1;\n}",
  listing: "promoted_gradient:\nsxtb w0, w0 C2\nadd w0, w0, 1 C4\nret C4",
} as const;

export const MIXED_LIMIT = {
  sourceLines: [[3], [3], [3]],
  c: "int mixed_limit(int gradient, unsigned limit)\n{\n    return gradient < limit;\n}",
  listing: "mixed_limit:\ncmp w0, w1 C3\ncset w0, cc C4\nret C4",
} as const;

// Course-authored assembly. These are not claimed to be compiler output.
export const MACHINE_INCREMENT = {
  c: "",
  listing: "machine_increment:\nadds w0, w0, #1\nret",
} as const;

export const INCREMENT_LIMIT_TEXT = "mov w1, #2147483647\ncmp w0, w1\ncset w0, eq\nret" as const;

export const SAFE_INCREMENT_TEXT =
  "mov w1, #2147483647\ncmp w0, w1\nb.eq done\nadd w0, w0, #1\ndone:\nret" as const;

export const FUEL_FITS_TEXT = "cmp w0, #255\ncset w0, ls\nret" as const;

export const CHECKED_TRIP_TEXT = "adds w0, w0, w1\nstr w0, [x2]\ncset w0, vs\nret" as const;

export const CHECKED_TRIP_WRONG = {
  c: "",
  listing: "checked_trip_wrong:\nadds w0, w0, w1\nstr w0, [x2]\ncset w0, cs\nret",
} as const;

export const STARTING_TEXT = "ret" as const;

export const CHECKED_RESULT_ADDRESS = 0x410000;
