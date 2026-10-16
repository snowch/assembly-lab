// Copyright © 2026 Christopher Snow

// The figures a lesson may name by kind.

import type { ComponentType } from "react";

import type { InteractiveProps } from "@platform/lesson-runtime";

import { AdderFigure } from "./AdderFigure";
import { CounterRing } from "./CounterRing";
import { ListingFigure } from "./ListingFigure";
import { RunPrediction } from "./RunPrediction";
import { StepperFigure } from "./StepperFigure";
import { TracePrediction } from "./TracePrediction";

export const INTERACTIVES: Readonly<Record<string, ComponentType<InteractiveProps>>> = {
  listing: ListingFigure,
  stepper: StepperFigure,
  "trace-prediction": TracePrediction,
  adder: AdderFigure,
  "counter-ring": CounterRing,
  "run-prediction": RunPrediction,
};
