// Copyright © 2026 Christopher Snow

import menuBook from "./icons/material/menu_book.svg?raw";
import chevronRight from "./icons/material/chevron_right.svg?raw";
import expandMore from "./icons/material/expand_more.svg?raw";
import check from "./icons/material/check.svg?raw";
import checkBox from "./icons/material/check_box.svg?raw";
import blankBox from "./icons/material/check_box_outline_blank.svg?raw";
import calculate from "./icons/material/calculate.svg?raw";
import darkMode from "./icons/material/dark_mode.svg?raw";
import lightMode from "./icons/material/light_mode.svg?raw";
import contrast from "./icons/material/contrast.svg?raw";

const symbols = {
  menu_book: menuBook,
  chevron_right: chevronRight,
  expand_more: expandMore,
  check,
  check_box: checkBox,
  check_box_outline_blank: blankBox,
  calculate,
  dark_mode: darkMode,
  light_mode: lightMode,
  contrast,
} as const;

/** Only checked, bundled official SVGs enter this component; never learner HTML. */
export function MaterialSymbol({
  name,
  className = "",
}: {
  name: keyof typeof symbols;
  className?: string;
}) {
  const compact = ["chevron_right", "expand_more", "check"].includes(name);
  const source = symbols[name];
  return (
    <svg
      className={`material-symbol ${compact ? "material-symbol-compact" : ""} ${className}`}
      data-symbol={name}
      width={compact ? 20 : 24}
      height={compact ? 20 : 24}
      viewBox="0 -960 960 960"
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{
        __html: source.slice(source.indexOf(">") + 1, source.lastIndexOf("</svg>")),
      }}
    />
  );
}
