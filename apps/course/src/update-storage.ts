// Copyright © 2026 Christopher Snow

import { browserStorage, type Storage } from "@platform/lesson-runtime";

/** The runtime can fall back to memory. Do not reload away edits held only there. */
export function updateStorage() {
  const storage = browserStorage();
  const edits = new Map<string, string | null>();
  const pending = new Map<string, string | null>();
  const listeners = new Set<() => void>();
  // Reading marks already have their own visible save status.
  const hasUnsavedWork = () =>
    [...pending.keys()].some((key) => !key.startsWith("assembly-lab:v1:manual-completion:"));
  const notify = (before: boolean) => {
    if (hasUnsavedWork() !== before) for (const listener of listeners) listener();
  };
  const persisted = (key: string, value: string | null) => {
    try {
      return localStorage.getItem(key) === value;
    } catch {
      return false;
    }
  };
  const remember = (key: string, value: string | null) => {
    const before = hasUnsavedWork();
    edits.set(key, value);
    if (persisted(key, value)) pending.delete(key);
    else pending.set(key, value);
    notify(before);
  };
  const tracked: Storage = {
    get(key) {
      return pending.has(key) ? (pending.get(key) ?? null) : storage.get(key);
    },
    set(key, value) {
      storage.set(key, value);
      remember(key, value);
    },
    remove(key) {
      storage.remove(key);
      remember(key, null);
    },
    keys: () =>
      [...new Set([...storage.keys(), ...pending.keys()])].filter(
        (key) => pending.get(key) !== null,
      ),
  };
  return {
    storage: tracked,
    persisted,
    hasUnsavedWork,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    /** A live view accepted another tab's value. Do not keep guarding its older edit. */
    acceptExternal(key: string, value: string | null) {
      if (!persisted(key, value)) return false;
      const before = hasUnsavedWork();
      edits.delete(key);
      pending.delete(key);
      notify(before);
      return true;
    },
    saved() {
      return [...edits].every(([key, value]) => persisted(key, value));
    },
  };
}
