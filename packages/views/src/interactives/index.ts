// Copyright © 2026 Christopher Snow

// The figures a lesson may name by kind.

import type { ComponentType } from "react";

import type { InteractiveProps } from "@platform/lesson-runtime";

import { AdderFigure } from "./AdderFigure";
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
import { WarningWordFigure } from "./WarningWordFigure";
import { WordStepperFigure } from "./WordStepperFigure";

export const INTERACTIVES: Readonly<Record<string, ComponentType<InteractiveProps>>> = {
  listing: ListingFigure,
  "listing-compare": ListingCompare,
  "model-prediction": ModelPrediction,
  "register-reader": RegisterReader,
  stepper: StepperFigure,
  "constant-tester": ConstantTester,
  "trace-prediction": TracePrediction,
  adder: AdderFigure,
  "counter-ring": CounterRing,
  "run-prediction": RunPrediction,
  "wide-stepper": WideStepper,
  "listing-runs": ListingRuns,
  "listing-change": ListingChange,
  "listing-diff": ListingDiff,
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
};
