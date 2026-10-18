// Copyright © 2026 Christopher Snow

import type { RecordedProgram } from "@al/views";

export const REPORT: RecordedProgram = {
  c: "unsigned half_distance(unsigned distance)\n{\n    return distance >> 1;\n}\nunsigned trip_report(unsigned distance, unsigned reserve)\n{\n    return half_distance(distance) + reserve;\n}",
  listing:
    "half_distance:\nlsr     w0, w0, 1 C4\nret C4\ntrip_report:\nstp     x29, x30, [sp, -32]! C6\nmov     x29, sp C6\nstr     x19, [sp, 16] C6\nmov     w19, w1 C6\nbl      half_distance C7\nadd     w0, w0, w19 C8\nldr     x19, [sp, 16] C8\nldp     x29, x30, [sp], 32 C8\nret C8",
};
export const FADE_SUM: RecordedProgram = {
  c: "unsigned fade_sum(unsigned brightness)\n{\n    if (brightness == 0)\n        return 0;\n    return brightness + fade_sum(brightness >> 1);\n}",
  listing:
    "fade_sum:\nstp     x29, x30, [sp, -32]! C2\nmov     x29, sp C2\nstr     x19, [sp, 16] C2\nmov     w19, w0 C2\ncbnz    w0, .L4 C3\n.L2:\nmov     w0, w19 C6\nldr     x19, [sp, 16] C6\nldp     x29, x30, [sp], 32 C6\nret C6\n.L4:\nlsr     w0, w0, 1 C5\nbl      fade_sum C5\nadd     w19, w19, w0 C5\nb       .L2 C5",
};
export const CALL_TEXT =
  "report_once:\n stp x29, x30, [sp, #-16]!\n mov x29, sp\n bl half_distance\n add w0, w0, #1\n ldp x29, x30, [sp], #16\n ret\nhalf_distance:\n lsr w0, w0, #1\n ret";
export const CALL_STARTING_TEXT =
  "report_once:\n bl half_distance\n add w0, w0, #1\n ret\nhalf_distance:\n lsr w0, w0, #1\n ret";
export const RESERVE_TEXT =
  "trip_report:\n stp x29, x30, [sp, #-32]!\n mov x29, sp\n str x19, [sp, #16]\n mov w19, w1\n bl half_distance\n add w0, w0, w19\n ldr x19, [sp, #16]\n ldp x29, x30, [sp], #32\n ret\nhalf_distance:\n lsr w0, w0, #1\n mov w1, #0\n ret";
export const RESERVE_STARTING_TEXT =
  "trip_report:\n stp x29, x30, [sp, #-16]!\n mov x29, sp\n bl half_distance\n add w0, w0, w1\n ldp x29, x30, [sp], #16\n ret\nhalf_distance:\n lsr w0, w0, #1\n mov w1, #0\n ret";
export const COUNT_TEXT =
  "lit_count:\n cbz w0, .Ldone\n stp x29, x30, [sp, #-16]!\n mov x29, sp\n lsr w0, w0, #1\n bl lit_count\n add w0, w0, #1\n ldp x29, x30, [sp], #16\n.Ldone:\n ret";
export const COUNT_STARTING_TEXT =
  "lit_count:\n cbz w0, .Ldone\n stp x29, x30, [sp, #-16]!\n mov x29, sp\n lsr w0, w0, #1\n bl lit_count\n ldp x29, x30, [sp], #16\n.Ldone:\n ret";
export const WRONG_LINK: RecordedProgram = { c: "", listing: CALL_STARTING_TEXT };
export const WRONG_RESERVE: RecordedProgram = { c: "", listing: RESERVE_STARTING_TEXT };
export const FADE_TEXT = FADE_SUM.listing.replace(/ C\d+/g, "");
export const FADE_STARTING_TEXT = FADE_TEXT.replace("cbnz", "cbz");
export const WRONG_FADE: RecordedProgram = {
  c: "",
  listing: FADE_TEXT.replace("lsr     w0, w0, 1", "mov w0, w0"),
};
