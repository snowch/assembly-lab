// Copyright © 2026 Christopher Snow

// The compiler listings Module 0 shows, copied from docs/notes/module-0/listings.md (ARM64 GCC
// 16.1.0, -O1, fetched from Compiler Explorer on 16 October 2026). The lesson shows the C without
// the recorded file's first line (its copyright comment), so every C line number here is the
// recorded one minus one; meet-the-machine.facts.test.ts holds this copy to the recorded file.
// The white space of a recorded line is not kept.

/** m0b.c, the first function: three statements. */
export const TRIP_DISTANCE = {
  c: [
    "int trip_distance(int leg1, int leg2, int leg3, int detour)",
    "{",
    "    int total = leg1 + leg2;",
    "    total = total + leg3;",
    "    total = total - detour;",
    "    return total;",
    "}",
  ].join("\n"),
  listing: [
    "trip_distance:",
    "  add w0, w0, w1 C3",
    "  add w0, w0, w2 C4",
    "  sub w0, w0, w3 C7",
    "  ret C7",
  ].join("\n"),
  sourceLines: [[3], [4], [5], [6]],
} as const;

/** m0b.c whole: `fuel_used` comes straight after `trip_distance`, in the listing and in memory. */
export const TRIP_DISTANCE_AND_FUEL_USED = {
  c: [
    TRIP_DISTANCE.c,
    "",
    "int fuel_used(int at_start, int at_end)",
    "{",
    "    return at_start - at_end;",
    "}",
  ].join("\n"),
  listing: [TRIP_DISTANCE.listing, "fuel_used:", "  sub w0, w0, w1 C12", "  ret C12"].join("\n"),
  sourceLines: [...TRIP_DISTANCE.sourceLines, [11], [11]],
} as const;

/** m0c.c, the first function: four subtractions. */
export const KM_TO_SERVICE = {
  c: [
    "int km_to_service(int service_at, int odometer, int trip_so_far, int planned)",
    "{",
    "    int left = service_at - odometer;",
    "    left = left - trip_so_far;",
    "    left = left - planned;",
    "    return left - 50;",
    "}",
  ].join("\n"),
  listing: [
    "km_to_service:",
    "  sub w0, w0, w1 C3",
    "  sub w0, w0, w2 C4",
    "  sub w0, w0, w3 C5",
    "  sub w0, w0, #50 C7",
    "  ret C7",
  ].join("\n"),
  sourceLines: [[3], [4], [5], [6], [6]],
} as const;

/** m0c.c's second function, which is the mistaken `fuel_used` the construction challenge starts from. */
export const FUEL_USED_MISTAKEN_TEXT = ["sub w0, w1, w0", "ret"].join("\n");

/** The corrected `fuel_used`: the challenge's reference. */
export const FUEL_USED_FIXED_TEXT = ["sub w0, w0, w1", "ret"].join("\n");
