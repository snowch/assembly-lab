// Copyright © 2026 Christopher Snow

import { useSyncExternalStore } from "react";

import type { updateStorage } from "./update-storage";

type Persistence = ReturnType<typeof updateStorage>;

// A separate key for each reading mark: a stale LessonStore cannot overwrite it, and marking
// one lesson never writes another lesson's mark or exercise work. The version lives in the key.
export const completionKey = (id: string) => `assembly-lab:v1:manual-completion:${id}`;

export function orderLessons<T extends { module: number; order: number }>(
  lessons: readonly T[],
): T[] {
  return [...lessons].sort((a, b) => a.module - b.module || a.order - b.order);
}

export interface LessonCompletion {
  readonly completed: ReadonlySet<string>;
  readonly unsaved: boolean;
}

/** Self-declared reading marks, independent of the runtime's verified challenge results. */
export class LessonCompletionStore {
  private value: LessonCompletion;
  private readonly ids: ReadonlySet<string>;
  private readonly keys: ReadonlyMap<string, string>;
  private readonly pending = new Map<string, string>();
  private readonly memoryOnly = new Set<string>();
  private readonly listeners = new Set<() => void>();

  constructor(
    private readonly persistence: Persistence,
    lessonIds: readonly string[],
  ) {
    this.ids = new Set(lessonIds);
    this.keys = new Map(lessonIds.map((id) => [completionKey(id), id]));
    this.value = {
      completed: new Set(
        lessonIds.filter((id) => persistence.storage.get(completionKey(id)) === "true"),
      ),
      unsaved: false,
    };
  }

  get = (): LessonCompletion => this.value;

  private publish(completed: ReadonlySet<string>) {
    const unsaved = [...this.pending].some(
      ([key, value]) => !this.persistence.persisted(key, value),
    );
    if (
      unsaved === this.value.unsaved &&
      completed.size === this.value.completed.size &&
      [...completed].every((id) => this.value.completed.has(id))
    )
      return;
    this.value = { completed, unsaved };
    for (const listener of this.listeners) listener();
  }

  set(id: string, complete: boolean) {
    if (!this.ids.has(id)) return;
    const key = completionKey(id);
    const value = String(complete);
    this.persistence.storage.set(key, value);
    this.pending.set(key, value);
    if (this.persistence.persisted(key, value)) this.memoryOnly.delete(key);
    else this.memoryOnly.add(key);
    const completed = new Set(this.value.completed);
    if (complete) completed.add(id);
    else completed.delete(id);
    // Use the explicit choice even when an older durable value remains after a failed write.
    this.publish(completed);
  }

  private reconcile = (event?: StorageEvent) => {
    try {
      if (event?.storageArea && event.storageArea !== localStorage) return;
    } catch {
      return;
    }
    const completed = new Set(this.value.completed);
    for (const [key, id] of this.keys) {
      if (event?.key != null && event.key !== key) continue;
      // A fresh subscription closes the read/subscribe gap but preserves memory-only choices.
      if (!event && this.memoryOnly.has(key)) continue;
      let value: string | null;
      try {
        // Storage events can queue up. Read the latest durable value, not an older event value.
        value = localStorage.getItem(key);
      } catch {
        continue;
      }
      if (!this.persistence.acceptExternal(key, value)) continue;
      this.pending.delete(key);
      this.memoryOnly.delete(key);
      if (value === "true") completed.add(id);
      else completed.delete(id);
    }
    this.publish(completed);
  };

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    if (this.listeners.size === 1) {
      window.addEventListener("storage", this.reconcile);
      this.reconcile();
    }
    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0) window.removeEventListener("storage", this.reconcile);
    };
  };
}

export function useLessonCompletion(store: LessonCompletionStore): LessonCompletion {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}
