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
  return {
    storage: tracked,
    saved() {
      try {
        return [...edits].every(([key, value]) => localStorage.getItem(key) === value);
      } catch {
        return false;
      }
    },
  };
}
