// Copyright © 2026 Christopher Snow

import { Fragment } from "react";

export const programmerNumber = (value: bigint | string) => BigInt(value).toLocaleString("en-GB");
export const programmerHex = (pattern: string, width: number) =>
  `0x${BigInt(pattern)
    .toString(16)
    .toUpperCase()
    .padStart(width / 4, "0")
    .match(/.{1,4}/g)!
    .join(" ")}`;

/** Keep decimal digit groups intact when an exact wide value needs another line. */
export function ProgrammerDecimal({ value }: { value: bigint }) {
  const groups = programmerNumber(value).split(",");
  return groups.map((group, index) => (
    <Fragment key={index}>
      {index > 0 && <wbr />}
      <span className="al-programmer-number-group">
        {group}
        {index < groups.length - 1 ? "," : ""}
      </span>
    </Fragment>
  ));
}
