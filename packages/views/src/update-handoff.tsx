// Copyright © 2026 Christopher Snow

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

const storageKey = "assembly-lab:update:views:v1";
const Scope = createContext<string | null>(null);
const mounted = new Map<string, () => unknown>();
let restored: Map<string, unknown> | undefined;

// The simulator's records are data: preserve its exact integer and collection types.
function encode(value: unknown): string {
  return JSON.stringify(value, (_key, item: unknown) => {
    if (typeof item === "bigint") return { $viewState: "bigint", value: String(item) };
    if (item instanceof Map) return { $viewState: "map", value: [...item] };
    if (item instanceof Set) return { $viewState: "set", value: [...item] };
    if (item instanceof Uint8Array) return { $viewState: "bytes", value: [...item] };
    if (typeof item === "function" || typeof item === "symbol")
      throw new Error("State is not serialisable");
    return item;
  });
}
function decode(text: string): unknown {
  return JSON.parse(text, (_key, item: unknown) => {
    if (!item || typeof item !== "object" || !("$viewState" in item) || !("value" in item))
      return item;
    if (item.$viewState === "bigint" && typeof item.value === "string") return BigInt(item.value);
    if (item.$viewState === "map" && Array.isArray(item.value)) return new Map(item.value);
    if (item.$viewState === "set" && Array.isArray(item.value)) return new Set(item.value);
    if (item.$viewState === "bytes" && Array.isArray(item.value)) return new Uint8Array(item.value);
    return item;
  });
}
function previous() {
  if (restored) return restored;
  restored = new Map();
  try {
    const text = sessionStorage.getItem(storageKey);
    sessionStorage.removeItem(storageKey);
    if (text) {
      const value = decode(text);
      if (
        value &&
        typeof value === "object" &&
        "route" in value &&
        value.route === location.href &&
        "values" in value &&
        value.values instanceof Map
      )
        restored = value.values;
    }
  } catch {
    /* An ordinary page load needs no handoff storage. */
  }
  return restored;
}

/** Only called during the coordinated restart while interaction is locked. */
export function prepareViewHandoff(): boolean {
  try {
    const text = encode({
      route: location.href,
      values: new Map([...mounted].map(([key, read]) => [key, read()])),
    });
    sessionStorage.setItem(storageKey, text);
    return sessionStorage.getItem(storageKey) === text;
  } catch {
    return false;
  }
}
export function clearViewHandoff(): void {
  try {
    sessionStorage.removeItem(storageKey);
  } catch {
    /* No reload follows a cancelled handoff. */
  }
}

export function ViewHandoffScope({
  id,
  signature = "",
  children,
}: {
  id: string;
  signature?: string;
  children: ReactNode;
}) {
  return <Scope.Provider value={`${id}:${signature}`}>{children}</Scope.Provider>;
}

/** A per-tab, one-shot snapshot; ordinary refresh and navigation still reset transient figures. */
export function useHandoffState<T>(
  field: string,
  initial: T | (() => T),
  codec?: { encode: (value: T) => unknown; decode: (value: unknown) => T },
): [T, Dispatch<SetStateAction<T>>] {
  const scope = useContext(Scope);
  const key = scope === null ? null : `${scope}:${field}`;
  const [value, setValue] = useState<T>(() => {
    const saved = key === null ? undefined : previous();
    return saved?.has(key!)
      ? codec
        ? codec.decode(saved.get(key!))
        : (saved.get(key!) as T)
      : typeof initial === "function"
        ? (initial as () => T)()
        : initial;
  });
  useLayoutEffect(() => {
    if (key === null) return;
    const read = () => (codec ? codec.encode(value) : value);
    mounted.set(key, read);
    return () => {
      if (mounted.get(key) === read) mounted.delete(key);
    };
  }, [key, value, codec]);
  useEffect(() => {
    if (key !== null) previous().delete(key);
  }, [key]);
  return [value, setValue];
}
