// Copyright © 2026 Christopher Snow

import { browserStorage, type Storage } from "@platform/lesson-runtime";

/** The runtime can fall back to memory. Do not reload away edits held only there. */
export function updateStorage() {
  const storage = browserStorage();
  const edits = new Map<string, string | null>();
  const tracked: Storage = {
    ...storage,
    set(key, value) {
      storage.set(key, value);
      edits.set(key, value);
    },
    remove(key) {
      storage.remove(key);
      edits.set(key, null);
    },
  };
  const persisted = (key: string, value: string | null) => {
    try {
      return localStorage.getItem(key) === value;
    } catch {
      return false;
    }
  };
  return {
    storage: tracked,
    persisted,
    /** A live view accepted another tab's value. Do not keep guarding its older edit. */
    acceptExternal(key: string, value: string | null) {
      if (!persisted(key, value)) return false;
      edits.delete(key);
      return true;
    },
    saved() {
      return [...edits].every(([key, value]) => persisted(key, value));
    },
  };
}
