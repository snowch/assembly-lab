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
export {
  calculatorMask,
  calculatorPattern,
  calculatorReading,
  calculatorParse,
  calculatorParseEntry,
  calculatorEntryFormat,
  calculatorCompute,
  calculatorAdditionCarries,
  calculatorHalves,
  calculatorSetHalf,
} from "./programmer-calculator.ts";
export type {
  CalculatorWidth,
  CalculatorReading,
  CalculatorFormat,
  CalculatorEntryFormat,
  CalculatorEntryParseResult,
  CalculatorOperation,
  CalculatorParseResult,
} from "./programmer-calculator.ts";
export {
  FP_INPUT_LIMIT,
  fpDecode,
  fpParse,
  fpNext,
  fpOperate,
  fpFromInt32,
  fpToInt32,
} from "./floating-point.ts";
export type {
  FpWidth,
  FpKind,
  FpOperation,
  FpDirection,
  FpParseResult,
  FpInt32Result,
  FpDecoded,
} from "./floating-point.ts";
