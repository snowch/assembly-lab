// Copyright © 2026 Christopher Snow
import { TRIP_DISTANCE } from "./meet-the-machine.listings";

export const NATIVE_CALL = { entry: "trip_distance", args: [120, 85, 42, 15] };
// Explicit experimental edits, not a claim about compiler output.
export const BROKEN_TRIP = {
  c: "",
  listing: TRIP_DISTANCE.listing
    .replace("sub w0, w0, w3 C7", "add w0, w0, w3")
    .replace(/ C\d+/g, ""),
};
export const TRIP_TEXT = "add w0, w0, w1\nadd w0, w0, w2\nsub w0, w0, w3\nret";
export const BROKEN_TEXT = TRIP_TEXT.replace("sub w0, w0, w3", "add w0, w0, w3");
export const TWICE_TEXT = TRIP_TEXT.replace("sub w0, w0, w3", "sub w0, w0, w3\nsub w0, w0, w3");
export const NATIVE_CASES = [
  [120, 85, 42, 15],
  [7, 9, 4, 2],
  [0, 0, 0, 0],
  [0, 0, 0, 1],
] as const;
