// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { StrictMode } from "react";
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { clearThemeUpdate, saveThemeForUpdate, useTheme } from "./theme";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  localStorage.clear();
  sessionStorage.clear();
});

it("restores a per-tab theme through Strict Mode without consuming the initializer twice", () => {
  localStorage.setItem("assembly-lab:v1:theme", "light");
  expect(saveThemeForUpdate("dark")).toBe(true);
  const { result } = renderHook(useTheme, { wrapper: StrictMode });
  expect(result.current[0]).toBe("dark");
  expect(sessionStorage.getItem("assembly-lab:update:theme")).toBeNull();
  expect(localStorage.getItem("assembly-lab:v1:theme")).toBe("dark");
  act(() => result.current[1]("light"));
  expect(result.current[0]).toBe("light");
});

it("removes a cancelled handoff so a later ordinary refresh follows the saved preference", () => {
  localStorage.setItem("assembly-lab:v1:theme", "light");
  expect(saveThemeForUpdate("dark")).toBe(true);
  clearThemeUpdate();
  const { result } = renderHook(useTheme);
  expect(result.current[0]).toBe("light");
});

it("refuses to promise theme preservation if the tab cannot save its handoff", () => {
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("Storage blocked");
  });
  expect(saveThemeForUpdate("dark")).toBe(false);
});
