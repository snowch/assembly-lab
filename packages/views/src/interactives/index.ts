// Copyright © 2026 Christopher Snow

// The figures a lesson may name by kind.

import type { ComponentType } from "react";

import type { InteractiveProps } from "@platform/lesson-runtime";

import { ListingFigure } from "./ListingFigure";
import { ListingCompare } from "./ListingCompare";
import { ModelPrediction } from "./ModelPrediction";
import { RegisterReader } from "./RegisterReader";
import { StepperFigure } from "./StepperFigure";
import { ConstantTester } from "./ConstantTester";
import { TracePrediction } from "./TracePrediction";
import { WideStepper } from "./WideStepper";

export const INTERACTIVES: Readonly<Record<string, ComponentType<InteractiveProps>>> = {
  listing: ListingFigure,
  "listing-compare": ListingCompare,
  "model-prediction": ModelPrediction,
  "register-reader": RegisterReader,
  stepper: StepperFigure,
  "constant-tester": ConstantTester,
  "trace-prediction": TracePrediction,
  "wide-stepper": WideStepper,
};
