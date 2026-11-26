// Copyright © 2026 Christopher Snow

import { useEffect, useState } from "react";
import { MaterialSymbol } from "./MaterialSymbol";
import { STRINGS } from "./strings";
import type { Theme } from "./theme";

/** Follow the rendered system theme until the learner makes an explicit choice. */
export function ThemeButton({
  theme,
  onChange,
}: {
  theme: Theme;
  onChange: (theme: Theme) => void;
}) {
  const [systemDark, setSystemDark] = useState(
    () => typeof matchMedia !== "undefined" && matchMedia("(prefers-color-scheme: dark)").matches,
  );
  useEffect(() => {
    if (typeof matchMedia === "undefined") return;
    const media = matchMedia("(prefers-color-scheme: dark)");
    const changed = () => setSystemDark(media.matches);
    changed();
    media.addEventListener("change", changed);
    return () => media.removeEventListener("change", changed);
  }, []);
  const dark = theme === "dark" || (theme === "auto" && systemDark);
  const label = dark ? STRINGS.themeSwitchLight : STRINGS.themeSwitchDark;
  return (
    <button
      id="theme-toggle"
      className="theme-toggle header-icon-control"
      type="button"
      title={label}
      aria-label={label}
      onClick={() => onChange(dark ? "light" : "dark")}
    >
      <MaterialSymbol name={dark ? "light_mode" : "dark_mode"} />
    </button>
  );
}
