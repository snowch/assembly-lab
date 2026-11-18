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

it("keeps the latest edit over an older saved copy when only the lesson write fails", () => {
  const key = "assembly-lab:v1:lesson";
  localStorage.setItem(key, "saved code");
  const current = updateStorage();
  const changed = vi.fn();
  const stop = current.subscribe(changed);
  const set = Storage.prototype.setItem;
  const writes = vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (
    this: Storage,
    name,
    value,
  ) {
    if (name === key) throw new Error("quota");
    set.call(this, name, value);
  });
  current.storage.set(key, "new code");
  expect(localStorage.getItem(key)).toBe("saved code");
  expect(current.storage.get(key)).toBe("new code");
  expect(current.hasUnsavedWork()).toBe(true);
  expect(current.saved()).toBe(false);
  expect(changed).toHaveBeenCalledTimes(1);

  writes.mockRestore();
  current.storage.set(key, "newer code");
  expect(current.storage.get(key)).toBe("newer code");
  expect(current.hasUnsavedWork()).toBe(false);
  expect(current.saved()).toBe(true);
  expect(changed).toHaveBeenCalledTimes(2);
  stop();
});

it("keeps a failed removal out of the current tab while protecting the durable copy", () => {
  const key = "assembly-lab:v1:lesson";
  localStorage.setItem(key, "saved code");
  const current = updateStorage();
  const remove = Storage.prototype.removeItem;
  vi.spyOn(Storage.prototype, "removeItem").mockImplementation(function (this: Storage, name) {
    if (name === key) throw new Error("blocked");
    remove.call(this, name);
  });
  current.storage.remove(key);
  expect(current.storage.get(key)).toBeNull();
  expect(current.storage.keys()).not.toContain(key);
  expect(localStorage.getItem(key)).toBe("saved code");
  expect(current.hasUnsavedWork()).toBe(true);
});
