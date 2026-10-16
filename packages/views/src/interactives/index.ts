// Copyright © 2026 Christopher Snow

// The figures a lesson may name by kind.

import type { ComponentType } from "react";

import type { InteractiveProps } from "@platform/lesson-runtime";

import { BitOpsFigure } from "./BitOpsFigure";
import { ListingCompareFigure } from "./ListingCompareFigure";
import { ListingFigure } from "./ListingFigure";
import { ProbePrediction } from "./ProbePrediction";
import { ShiftFigure } from "./ShiftFigure";
import { StepperFigure } from "./StepperFigure";
import { TracePrediction } from "./TracePrediction";
import { WarningWordFigure } from "./WarningWordFigure";
import { WordStepperFigure } from "./WordStepperFigure";

export const INTERACTIVES: Readonly<Record<string, ComponentType<InteractiveProps>>> = {
  listing: ListingFigure,
  stepper: StepperFigure,
  "trace-prediction": TracePrediction,
  "warning-word": WarningWordFigure,
  "bit-ops": BitOpsFigure,
  shift: ShiftFigure,
  "probe-prediction": ProbePrediction,
  "word-stepper": WordStepperFigure,
  "listing-compare": ListingCompareFigure,
};
