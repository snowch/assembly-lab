// Copyright © 2026 Christopher Snow

// The figures a lesson may name by kind.

import type { ComponentType } from "react";

import type { InteractiveProps } from "@platform/lesson-runtime";

import { AdderFigure } from "./AdderFigure";
import { ArgsFigure } from "./ArgsFigure";
import { OperandRoles } from "./OperandRoles";
import { ChallengeNote } from "./ChallengeNote";
import { CounterRing } from "./CounterRing";
import { ListingFigure } from "./ListingFigure";
import { RunPrediction } from "./RunPrediction";
import { ListingCompare } from "./ListingCompare";
import { ModelPrediction } from "./ModelPrediction";
import { RegisterReader } from "./RegisterReader";
import { BitOpsFigure } from "./BitOpsFigure";
import { ListingPairFigure } from "./ListingPairFigure";
import { ProbePrediction } from "./ProbePrediction";
import { ShiftFigure } from "./ShiftFigure";
import { StepperFigure } from "./StepperFigure";
import { ConstantTester } from "./ConstantTester";
import { TracePrediction } from "./TracePrediction";
import { WideStepper } from "./WideStepper";
import { BranchListing } from "./BranchListing";
import { ConditionTable } from "./ConditionTable";
import { CountPrediction } from "./CountPrediction";
import { ListingChange } from "./ListingChange";
import { ListingDiff } from "./ListingDiff";
import { ListingRuns } from "./ListingRuns";
import { BfiCompare } from "./BfiCompare";
import { ClearCompare } from "./ClearCompare";
import { FieldReadingFigure } from "./FieldReadingFigure";
import { SelectStepper } from "./SelectStepper";
import { SolutionStepper } from "./SolutionStepper";
import { WarningWordFigure } from "./WarningWordFigure";
import { WordStepperFigure } from "./WordStepperFigure";
import { LoopFigure } from "./LoopFigure";
import { LoopPrediction } from "./LoopPrediction";
import { MemoryStepper } from "./MemoryStepper";
import { MemoryPrediction } from "./MemoryPrediction";

import { ProductHalves, DivisionParts } from "./ProductHalves";
import { CompilerPlayground } from "./CompilerPlayground";
import { RecordedPrediction } from "./RecordedPrediction";
import { StackStepper } from "./StackStepper";

export const INTERACTIVES: Readonly<Record<string, ComponentType<InteractiveProps>>> = {
  listing: ListingFigure,
  "listing-compare": ListingCompare,
  "model-prediction": ModelPrediction,
  "register-reader": RegisterReader,
  stepper: StepperFigure,
  "constant-tester": ConstantTester,
  "trace-prediction": TracePrediction,
  adder: AdderFigure,
  "arg-registers": ArgsFigure,
  "operand-roles": OperandRoles,
  "counter-ring": CounterRing,
  "run-prediction": RunPrediction,
  "wide-stepper": WideStepper,
  "listing-runs": ListingRuns,
  "listing-change": ListingChange,
  "listing-diff": ListingDiff,
  "select-stepper": SelectStepper,
  "condition-table": ConditionTable,
  "count-prediction": CountPrediction,
  "branch-listing": BranchListing,
  "warning-word": WarningWordFigure,
  "bit-ops": BitOpsFigure,
  shift: ShiftFigure,
  "probe-prediction": ProbePrediction,
  "word-stepper": WordStepperFigure,
  "challenge-note": ChallengeNote,
  "listing-pair": ListingPairFigure,
  "field-reading": FieldReadingFigure,
  "solution-stepper": SolutionStepper,
  "bfi-compare": BfiCompare,
  "clear-compare": ClearCompare,
  "loop-runs": LoopFigure,
  "loop-prediction": LoopPrediction,
  "memory-stepper": MemoryStepper,
  "memory-prediction": MemoryPrediction,
  "product-halves": ProductHalves,
  "division-parts": DivisionParts,
  "stack-stepper": StackStepper,
  "compiler-playground": CompilerPlayground,
  "recorded-prediction": RecordedPrediction,
};
