// Copyright © 2026 Christopher Snow

import { ARITHMETIC_GUIDES } from "./arithmetic";
import { LOGIC_GUIDES } from "./logic";
import { CONTROL_GUIDES } from "./control";
import { MEMORY_GUIDES } from "./memory";
import type { ReferenceGuideFamily } from "./types";

export const INSTRUCTION_FORM_GUIDES: ReferenceGuideFamily = {
  ...ARITHMETIC_GUIDES,
  ...LOGIC_GUIDES,
  ...CONTROL_GUIDES,
  ...MEMORY_GUIDES,
};
export { buildReferenceExample, computeReferenceExample } from "./model";
export type { InstructionFormGuide, ExplainedReferenceExample, ReferenceMistake } from "./types";
