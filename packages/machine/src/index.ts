// Copyright © 2026 Christopher Snow

// @al/machine: the course's assembler and simulator for a subset of A64.

export { assemble } from "./assemble.ts";
export { run, stateAfter } from "./run.ts";
export { message, strings } from "./strings.ts";
export type { MessageKey } from "./strings.ts";
export { parseRegName } from "./regs.ts";
export { subsetMnemonics } from "./forms.ts";
export {
  DATA_BASE,
  DEFAULT_STEP_LIMIT,
  RETURN_ADDRESS,
  STACK_BASE,
  STACK_TOP,
  TEXT_BASE,
} from "./layout.ts";
export type * from "./types.ts";
