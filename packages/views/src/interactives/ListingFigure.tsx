// Copyright © 2026 Christopher Snow

// A C function beside the instructions GCC made from it, each instruction showing the C line GCC
// recorded for it. Static: it draws the recorded listing and runs nothing.

import { z } from "zod";

import { cLinesOf, parseListing } from "../listing";
import { ListingView } from "../parts";
import { RecordedSchema, withProps } from "./props";

const Props = z.object({ program: RecordedSchema });

export const ListingFigure = withProps(Props, function ListingFigure({ data }) {
  return (
    <div className="al-figure" data-figure="listing">
      <ListingView cLines={cLinesOf(data.program.c)} lines={parseListing(data.program.listing)} />
    </div>
  );
});
