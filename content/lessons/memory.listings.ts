// Copyright © 2026 Christopher Snow

// GCC 16.1.0, carm64g1610, -O1. Raw requests, responses and source in
// docs/notes/module-6/compiler/. C tags omit the submitted copyright line.

export const READ_DISTANCE = {
  c: "unsigned read_distance(const unsigned *distance)\n{\n    return *distance;\n}",
  listing: "read_distance:\n  ldr w0, [x0] C4\n  ret C4",
} as const;

export const SAVE_DISTANCE = {
  c: "void save_distance(unsigned *distance, unsigned value)\n{\n    *distance = value;\n}",
  listing: "save_distance:\n  str w1, [x0] C3\n  ret C4",
} as const;

export const READ_FUEL = {
  c: "unsigned read_fuel(const unsigned char *fuel)\n{\n    return *fuel;\n}",
  listing: "read_fuel:\n  ldrb w0, [x0] C4\n  ret C4",
} as const;

export const READ_GRADIENT = {
  c: "int read_gradient(const signed char *gradient)\n{\n    return *gradient;\n}",
  listing: "read_gradient:\n  ldrsb w0, [x0] C4\n  ret C4",
} as const;

export const READ_PULSE = {
  c: "unsigned read_pulse(const unsigned short *pulse)\n{\n    return *pulse;\n}",
  listing: "read_pulse:\n  ldrh w0, [x0] C4\n  ret C4",
} as const;

export const READ_OFFSET = {
  c: "int read_offset(const short *offset)\n{\n    return *offset;\n}",
  listing: "read_offset:\n  ldrsh w0, [x0] C4\n  ret C4",
} as const;

export const READ_OFFSET_LONG = {
  c: "long read_offset_long(const int *offset)\n{\n    return *offset;\n}",
  listing: "read_offset_long:\n  ldrsw x0, [x0] C4\n  ret C4",
} as const;

export const READ_GRADIENT_LONG = {
  c: "long read_gradient_long(const signed char *gradient)\n{\n    return *gradient;\n}",
  listing: "read_gradient_long:\n  ldrsb x0, [x0] C4\n  ret C4",
} as const;

export const READ_LONG = {
  c: "unsigned long read_long(const unsigned long *total)\n{\n    return *total;\n}",
  listing: "read_long:\n  ldr x0, [x0] C4\n  ret C4",
} as const;

export const SAVE_FUEL = {
  c: "void save_fuel(unsigned char *fuel, unsigned value)\n{\n    *fuel = value;\n}",
  listing: "save_fuel:\n  strb w1, [x0] C3\n  ret C4",
} as const;

export const SAVE_PULSE = {
  c: "void save_pulse(unsigned short *pulse, unsigned value)\n{\n    *pulse = value;\n}",
  listing: "save_pulse:\n  strh w1, [x0] C3\n  ret C4",
} as const;

export const SAVE_LONG = {
  c: "void save_long(unsigned long *total, unsigned long value)\n{\n    *total = value;\n}",
  listing: "save_long:\n  str x1, [x0] C3\n  ret C4",
} as const;

export const SIGNED_BYTE = {
  c: "int signed_byte(unsigned value)\n{\n    return (signed char)value;\n}",
  listing: "signed_byte:\n  sxtb w0, w0 C4\n  ret C4",
} as const;

export const UNSIGNED_BYTE = {
  c: "unsigned unsigned_byte(unsigned value)\n{\n    return (unsigned char)value;\n}",
  listing: "unsigned_byte:\n  and w0, w0, 255 C4\n  ret C4",
} as const;

export const SIGNED_LONG = {
  c: "long signed_long(int value)\n{\n    return value;\n}",
  listing: "signed_long:\n  sxtw x0, w0 C4\n  ret C4",
} as const;

export const ADD_ADJUSTMENT = {
  c: "long add_adjustment(long total, int adjustment)\n{\n    return total + adjustment;\n}",
  listing: "add_adjustment:\n  add x0, x0, w1, sxtw C4\n  ret C4",
} as const;

// Controlled memory fixtures are appended by the figure/runtime; they are not compiler code.
export const SENSOR_ADDRESS = 0x410000;
export const SAMPLE_BYTES = [0x78, 0x56, 0x34, 0x12, 0xfe, 0x80, 0x34, 0xf2] as const;

// Course-authored assembly. GCC's unsigned-byte cast above uses AND instead.
export const UNSIGNED_BYTE_EXPLICIT = {
  c: "",
  listing: "unsigned_byte_explicit:\n  uxtb w0, w0\n  ret",
} as const;

// Course-authored examples and challenge solutions.
export const STORE_WIDE = {
  c: "",
  listing: "store_wide:\n  str w1, [x0]\n  ret",
} as const;
export const SAVE_DISTANCE_STARTING_TEXT = "ret";
export const SAVE_DISTANCE_TEXT = "str w1, [x0]\nret";
export const COPY_DISTANCE_STARTING_TEXT = "ret";
export const COPY_DISTANCE_TEXT = "ldr w0, [x0]\nstr w0, [x1]\nret";
export const ADJUST_GRADIENT_STARTING_TEXT = "ret";
export const ADJUST_GRADIENT_TEXT = "ldrsb w2, [x0]\nadd w0, w2, w1\nret";
export const ADJUST_GRADIENT = {
  c: "",
  listing: `adjust_gradient:\n${ADJUST_GRADIENT_TEXT}`,
} as const;
export const ADJUST_GRADIENT_WRONG = {
  c: "",
  listing: "adjust_gradient_wrong:\nldrb w2, [x0]\nadd w0, w2, w1\nret",
} as const;
export const READ_SENSORS_STARTING_TEXT = "ret";
export const READ_SENSORS_TEXT =
  "ldrsb w1, [x0, #4]\nldrb w2, [x0, #5]\nldrh w3, [x0, #6]\nldr w0, [x0]\nret";
