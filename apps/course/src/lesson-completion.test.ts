// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { afterEach, expect, it, vi } from "vitest";
import { LessonStore } from "@platform/lesson-runtime";

import { completionKey, LessonCompletionStore, orderLessons } from "./lesson-completion";
import { updateStorage } from "./update-storage";

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

function external(key: string | null, value: string | null = null) {
  if (key === null) localStorage.clear();
  else if (value === null) localStorage.removeItem(key);
  else localStorage.setItem(key, value);
  window.dispatchEvent(
    new StorageEvent("storage", { key, newValue: value, storageArea: localStorage }),
  );
}

it("reads only versioned explicit marks for known lessons without writing during a visit", () => {
  localStorage.setItem(completionKey("a"), "true");
  localStorage.setItem(completionKey("b"), '{"complete":true}');
  localStorage.setItem(completionKey("c"), "{broken");
  localStorage.setItem(completionKey("unknown"), "true");
  localStorage.setItem("assembly-lab:v2:manual-completion:d", "true");
  const before = { ...localStorage };
  const store = new LessonCompletionStore(updateStorage(), ["a", "b", "c", "d", "new-lesson"]);
  expect([...store.get().completed]).toEqual(["a"]);
  store.set("unknown", false);
  expect({ ...localStorage }).toEqual(before);
  expect(store.get().unsaved).toBe(false);
});

it("sorts by module then lesson order regardless of source order", () => {
  const lessons = [
    { id: "last", module: 2, order: 1 },
    { id: "second", module: 1, order: 2 },
    { id: "first", module: 1, order: 1 },
  ];
  expect(orderLessons(lessons).map((lesson) => lesson.id)).toEqual(["first", "second", "last"]);
  expect(lessons[0]?.id).toBe("last");
});

it("keeps marks independent of a live lesson's answers, resets and later stale-blob writes", () => {
  const persistence = updateStorage();
  const work = new LessonStore(persistence.storage, "assembly-lab", "a");
  work.setSlot("prediction", { answer: "saved answer" });
  const original = localStorage.getItem("assembly-lab:v1:a");
  const store = new LessonCompletionStore(persistence, ["a", "b"]);
  store.set("a", true);
  store.set("b", true);
  expect(localStorage.getItem("assembly-lab:v1:a")).toBe(original);
  work.setSlot("another", "later work");
  expect(localStorage.getItem(completionKey("a"))).toBe("true");
  store.set("a", false);
  expect(work.slot("prediction")).toEqual({ answer: "saved answer" });
  expect(localStorage.getItem(completionKey("b"))).toBe("true");
  work.reset();
  expect([...store.get().completed]).toEqual(["b"]);
  expect(new LessonCompletionStore(updateStorage(), ["a", "b"]).get().completed).toEqual(
    new Set(["b"]),
  );
  expect(persistence.saved()).toBe(true);
});

it("reconciles external mark, undo, removal and clear without blocking an update on an accepted mark", () => {
  const persistence = updateStorage();
  const store = new LessonCompletionStore(persistence, ["a", "b"]);
  const changed = vi.fn();
  const unsubscribe = store.subscribe(changed);
  store.set("a", true);
  external(completionKey("a"), "false");
  expect(store.get().completed.has("a")).toBe(false);
  expect(persistence.saved()).toBe(true);
  external(completionKey("b"), "true");
  expect([...store.get().completed]).toEqual(["b"]);
  external(completionKey("b"));
  expect(store.get().completed.size).toBe(0);
  store.set("a", true);
  store.set("b", true);
  external(null);
  expect(store.get().completed.size).toBe(0);
  expect(persistence.saved()).toBe(true);
  expect(changed).toHaveBeenCalled();
  unsubscribe();
});

it("accepts only current durable event values and leaves exercise conflicts guarded", () => {
  const persistence = updateStorage();
  const store = new LessonCompletionStore(persistence, ["a"]);
  const unsubscribe = store.subscribe(() => {});
  store.set("a", true);
  persistence.storage.set("assembly-lab:v1:a", "my exercise work");
  external("assembly-lab:v1:a", "another tab's exercise work");
  external(completionKey("a"), "false");
  expect(store.get().completed.has("a")).toBe(false);
  expect(persistence.saved()).toBe(false);
  // An older queued mark must not replace the latest undo in durable storage.
  window.dispatchEvent(new StorageEvent("storage", { key: completionKey("a"), newValue: "true" }));
  expect(store.get().completed.has("a")).toBe(false);
  external(completionKey("unknown"), "true");
  expect(store.get().completed.size).toBe(0);
  unsubscribe();
});

it("keeps independent marks from two tabs and makes undo visible to both", () => {
  const first = new LessonCompletionStore(updateStorage(), ["a", "b"]);
  const second = new LessonCompletionStore(updateStorage(), ["a", "b"]);
  const stopFirst = first.subscribe(() => {});
  const stopSecond = second.subscribe(() => {});
  first.set("a", true);
  second.set("b", true);
  external(completionKey("a"), "true");
  external(completionKey("b"), "true");
  expect(first.get().completed).toEqual(new Set(["a", "b"]));
  expect(second.get().completed).toEqual(new Set(["a", "b"]));
  second.set("a", false);
  external(completionKey("a"), "false");
  expect(first.get().completed).toEqual(new Set(["b"]));
  stopFirst();
  stopSecond();
});

it("keeps a failed mark and undo truthful in memory even with an older durable value", () => {
  const persistence = updateStorage();
  const store = new LessonCompletionStore(persistence, ["a"]);
  const stop = store.subscribe(() => {});
  store.set("a", true);
  const write = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("quota");
  });
  store.set("a", false);
  expect(store.get()).toEqual({ completed: new Set(), unsaved: true });
  expect(persistence.saved()).toBe(false);
  expect(localStorage.getItem(completionKey("a"))).toBe("true");
  write.mockRestore();
  // A reload would see the old value, while this tab retains the explicit undo until saved.
  expect(new LessonCompletionStore(updateStorage(), ["a"]).get().completed.has("a")).toBe(true);
  expect(store.get().completed.size).toBe(0);
  store.set("a", false);
  expect(store.get().unsaved).toBe(false);
  expect(persistence.saved()).toBe(true);
  stop();
});

it("supports a wholly unavailable browser store and blocks reload of memory-only marks", () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  const persistence = updateStorage();
  const store = new LessonCompletionStore(persistence, ["reading-only"]);
  const stop = store.subscribe(() => {});
  store.set("reading-only", true);
  expect(store.get()).toEqual({ completed: new Set(["reading-only"]), unsaved: true });
  expect(persistence.saved()).toBe(false);
  store.set("reading-only", false);
  expect(store.get()).toEqual({ completed: new Set(), unsaved: true });
  stop();
});
