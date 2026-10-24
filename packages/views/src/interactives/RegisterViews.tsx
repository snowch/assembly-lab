// Copyright © 2026 Christopher Snow

// A register's architectural names, queried from the assembler's register parser. This is a
// width schematic, not an execution result: one enclosing register contains its narrower view.
import { z } from "zod";
import { parseRegName } from "@al/machine";
import { REGISTER_VIEW_STRINGS as S } from "../strings.register-views";
import { withProps } from "./props";

const Props = z.object({ register: z.number().int().min(0).max(30).default(0) });

export const RegisterViews = withProps(Props, function RegisterViews({ data }) {
  const fullName = `x${data.register}`;
  const lowName = `w${data.register}`;
  const full = parseRegName(fullName);
  const low = parseRegName(lowName);
  if (full === null || low === null) return null;
  const upperWidth = full.width - low.width;
  return (
    <div className="al-figure al-register-views" data-figure="register-views">
      <div
        className="al-register-view"
        role="img"
        aria-label={S.description(fullName, full.width, lowName, low.width)}
        data-full-name={fullName}
        data-width={full.width}
      >
        <div className="al-register-view-heading" aria-hidden="true">
          <code>{fullName}</code>
          <span>{S.width(full.width)}</span>
        </div>
        <div
          className="al-register-view-halves"
          style={{ gridTemplateColumns: `${upperWidth}fr ${low.width}fr` }}
          aria-hidden="true"
        >
          <div className="al-register-view-upper" data-width={upperWidth}>
            <span>{S.upper(upperWidth)}</span>
          </div>
          <div className="al-register-view-lower" data-low-name={lowName} data-width={low.width}>
            <code>{lowName}</code>
            <span>{S.lower(low.width)}</span>
          </div>
        </div>
      </div>
    </div>
  );
});
