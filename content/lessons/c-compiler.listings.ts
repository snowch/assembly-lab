// Copyright © 2026 Christopher Snow
import { compileC } from "@al/compiler";
import { recordedC } from "../../packages/views/src/compilerRun";
import trip from "../../docs/notes/module-10/compiler/trip_charge.course.json" with { type: "json" };
import cap from "../../docs/notes/module-10/compiler/cap_charge.course.json" with { type: "json" };
import accumulated from "../../docs/notes/module-10/compiler/accumulated_charge.course.json" with { type: "json" };
import dim from "../../docs/notes/module-10/compiler/course_while.course.json" with { type: "json" };
export const TRIP_SOURCE = trip.source;
export const CAP_SOURCE = cap.source;
export const ACCUMULATED_SOURCE = accumulated.source;
export const DIM_SOURCE = dim.source;
export const WRONG_TRIP_SOURCE = TRIP_SOURCE.replace("return charge + 7;", "return charge;");
export const WRONG_ACCUMULATED_SOURCE = ACCUMULATED_SOURCE.replace("i < count", "i <= count");
export function compiledProgram(source: string) {
  const compiled = compileC(source);
  if (!compiled.ok) throw Error(JSON.stringify(compiled.errors));
  return recordedC(source, compiled);
}
export const TRIP = compiledProgram(TRIP_SOURCE),
  ACCUMULATED = compiledProgram(ACCUMULATED_SOURCE),
  WRONG_TRIP = compiledProgram(WRONG_TRIP_SOURCE),
  WRONG_ACCUMULATED = compiledProgram(WRONG_ACCUMULATED_SOURCE);
export const TRIP_ASSEMBLY = "mul w0, w0, w1\nadd w0, w0, #7\nret";
export const ACCUMULATED_ASSEMBLY =
  "mov w2, w0\nmov w0, #0\ncbz w2, done\nloop:\nadd w0, w0, w1\nsubs w2, w2, #1\nb.ne loop\ndone:\nret";
export const CAP_START =
  "unsigned cap_charge(unsigned distance, unsigned rate, unsigned limit)\n{\n    return 0;\n}";
export const DIM_START =
  "unsigned course_while(unsigned value, unsigned count)\n{\n    return value;\n}";
