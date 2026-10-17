// Copyright © 2026 Christopher Snow

// One condition as the figures that read conditions off flags draw it: its name, what it means, its
// rule, the flags it read with their values, and whether it holds. A condition that holds and one
// that does not differ by their words and by a mark (a tick and a cross) as well as by colour.

import { withCode } from "./parts";
import { readText, type ConditionRead } from "./select";
import { BRANCH_STRINGS as B } from "./strings.branch";

export function ConditionItem({ item, note }: { item: ConditionRead; note?: string | undefined }) {
  return (
    <li className="al-cond" data-cond={item.name} data-holds={item.holds}>
      <code className="al-cond-name">{item.name}</code>
      <span className="al-cond-means">{withCode(item.row?.means ?? "")}</span>
      <span className="al-cond-reads">{withCode(item.row?.reads ?? "")}</span>
      <span className="al-cond-read">{B.conditions.read(readText(item.read))}</span>
      <span className="al-cond-verdict">
        <span className="al-cond-glyph" aria-hidden="true">
          {item.holds ? "✓" : "✗"}
        </span>
        {item.holds ? B.conditions.yes : B.conditions.no}
      </span>
      {note !== undefined && <span className="al-cond-note">{withCode(note)}</span>}
    </li>
  );
}
