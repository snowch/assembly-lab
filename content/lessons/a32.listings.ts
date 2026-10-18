// Copyright © 2026 Christopher Snow

// Exact recorded GCC output; A32 is comparison-only.
export const LIMIT_TRIP_A32 = {
  c: "unsigned limit_trip(unsigned distance, unsigned limit)\n{\n    return distance > limit ? limit : distance;\n}",
  listing: "limit_trip:\ncmp r0, r1 C4\nmovcs r0, r1 C4\nbx lr C4",
} as const;

export const LIMIT_TRIP_A64 = {
  c: "unsigned limit_trip(unsigned distance, unsigned limit)\n{\n    return distance > limit ? limit : distance;\n}",
  listing: "limit_trip:\ncmp w0, w1 C3\ncsel w0, w0, w1, ls C4\nret C4",
} as const;

export const SERVICE_MARKER_A32 = {
  c: "unsigned service_marker(void)\n{\n    return 1001;\n}",
  listing: "service_marker:\nmovw r0, #1001 C4\nbx lr C4",
} as const;

export const SERVICE_MARKER_A64 = {
  c: "unsigned service_marker(void)\n{\n    return 1001;\n}",
  listing: "service_marker:\nmov w0, 1001 C4\nret C4",
} as const;

export const AVERAGE_TRIP_A32 = {
  c: "unsigned average_trip(unsigned distance, unsigned trips)\n{\n    return distance / trips;\n}",
  listing: "average_trip:\npush {r4, lr} C2\nbl __aeabi_uidiv C3\npop {r4, pc} C4",
} as const;

export const AVERAGE_TRIP_A64 = {
  c: "unsigned average_trip(unsigned distance, unsigned trips)\n{\n    return distance / trips;\n}",
  listing: "average_trip:\nudiv w0, w0, w1 C4\nret C4",
} as const;
