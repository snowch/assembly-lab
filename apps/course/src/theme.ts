// Copyright © 2026 Christopher Snow

// The theme follows the system unless the learner picks one; the choice is kept in this browser.

import { useEffect, useState } from "react";

export type Theme = "auto" | "light" | "dark";
const KEY = "assembly-lab:v1:theme";
const UPDATE_KEY = "assembly-lab:update:theme";

/** A per-tab handoff preserves different theme choices across a coordinated reload. */
export function saveThemeForUpdate(theme: Theme): boolean {
  try {
    sessionStorage.setItem(UPDATE_KEY, theme);
    return sessionStorage.getItem(UPDATE_KEY) === theme;
  } catch {
    return false;
  }
}

export function clearThemeUpdate() {
  try {
    sessionStorage.removeItem(UPDATE_KEY);
  } catch {
    // An unavailable session store cannot be changed.
  }
}

function read(): Theme {
  try {
    const pending = sessionStorage.getItem(UPDATE_KEY);
    if (pending === "auto" || pending === "light" || pending === "dark") return pending;
  } catch {
    // Ordinary theme loading still works when session storage is unavailable.
  }
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : "auto";
  } catch {
    return "auto";
  }
}

export function useTheme(): [Theme, (t: Theme) => void] {
  const [theme, setTheme] = useState<Theme>(read);
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "auto") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
    clearThemeUpdate();
    try {
      if (theme === "auto") localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, theme);
    } catch {
      // No storage: the choice lasts for the visit.
    }
  }, [theme]);
  return [theme, setTheme];
}
