// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { afterEach, expect, it, vi } from "vitest";
import { updateStorage } from "./update-storage";

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

it("confirms edited and removed work is durable without overwriting other tabs", () => {
  const current = updateStorage();
  current.storage.set("assembly-lab:v1:lesson", "my edits");
  expect(current.saved()).toBe(true);
  localStorage.setItem("assembly-lab:v1:lesson", "another tab's edits");
  expect(current.saved()).toBe(false);
  expect(localStorage.getItem("assembly-lab:v1:lesson")).toBe("another tab's edits");
  current.storage.remove("assembly-lab:v1:lesson");
  expect(current.saved()).toBe(true);
});

it("keeps memory-only edits readable but refuses to reload them away", () => {
  const current = updateStorage();
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("quota");
  });
  current.storage.set("assembly-lab:v1:lesson", "unsaved edits");
  expect(current.storage.get("assembly-lab:v1:lesson")).toBe("unsaved edits");
  expect(current.saved()).toBe(false);
});
