// Copyright © 2026 Christopher Snow

import { z } from "zod";
import { ProgrammerCalculator } from "../ProgrammerCalculator";
import { withProps } from "./props";

const Props = z.object({
  preset: z.enum(["hexadecimal", "readings", "arithmetic", "halves", "widths"]),
});

/** Optional numeric scratch work, deliberately independent of the lesson artifact/store. */
export const ProgrammerCalculatorFigure = withProps(
  Props,
  function ProgrammerCalculatorFigure({ data, interactive }) {
    return <ProgrammerCalculator preset={data.preset} handoffKey={interactive.id} />;
  },
);
