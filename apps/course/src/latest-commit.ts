// Copyright © 2026 Christopher Snow

import { useCallback, useEffect, useRef, useState } from "react";

export interface ReleaseAsset {
  path: string;
  bytes: number;
  integrity: string;
}
export interface PublishedRelease {
  schemaVersion: 1;
  buildId: string;
  commit: string | null;
  committedAt: string | null;
  assets: ReleaseAsset[];
  totalBytes: number;
  worker: ReleaseAsset;
}
export type VersionState = "checking" | "current" | "available" | "offline" | "error";
const hex = /^[a-f0-9]{64}$/;
const asset = (value: unknown): value is ReleaseAsset => {
  if (!value || typeof value !== "object") return false;
  const a = value as ReleaseAsset;
  return (
    typeof a.path === "string" &&
    /^(?!\/)(?!.*(?:\.\.|[?#\\]))[a-zA-Z0-9_./@-]+$/.test(a.path) &&
    Number.isSafeInteger(a.bytes) &&
    a.bytes >= 0 &&
    typeof a.integrity === "string" &&
    /^sha256-[A-Za-z0-9+/]{43}=$/.test(a.integrity)
  );
};
export function parseRelease(value: unknown): PublishedRelease {
  if (!value || typeof value !== "object") throw new Error("Invalid release");
  const r = value as PublishedRelease;
  if (
    r.schemaVersion !== 1 ||
    !hex.test(r.buildId) ||
    !(r.commit === null || /^[a-f0-9]{40}$/.test(r.commit)) ||
    !(
      r.committedAt === null ||
      (typeof r.committedAt === "string" && Number.isFinite(Date.parse(r.committedAt)))
    ) ||
    !Array.isArray(r.assets) ||
    !r.assets.length ||
    !r.assets.every(asset) ||
    !asset(r.worker) ||
    r.worker.path !== "sw.js" ||
    !r.assets.some((a) => a.path === "index.html") ||
    r.assets.some((a) => ["sw.js", "release.json"].includes(a.path)) ||
    new Set(r.assets.map((a) => a.path)).size !== r.assets.length ||
    !Number.isSafeInteger(r.totalBytes) ||
    r.totalBytes !== r.assets.reduce((sum, a) => sum + a.bytes, 0)
  )
    throw new Error("Invalid release");
  return r;
}
/** Immutable identity from this document, never from a network response. */
export const RUNNING_BUILD =
  typeof document === "undefined"
    ? null
    : (document.querySelector('meta[name="course-build-id"]')?.getAttribute("content") ?? null);

export function usePublishedRelease(running: string | null = RUNNING_BUILD) {
  const [state, setState] = useState<VersionState>(navigator.onLine ? "checking" : "offline");
  const [release, setRelease] = useState<PublishedRelease | null>(null);
  const request = useRef<AbortController | null>(null);
  const last = useRef(0);
  const generation = useRef(0);
  const check = useCallback(
    async (force = false) => {
      if (!navigator.onLine) {
        generation.current++;
        request.current?.abort();
        request.current = null;
        last.current = 0;
        setState("offline");
        return;
      }
      if (request.current || (!force && Date.now() - last.current < 5000)) return;
      const id = ++generation.current;
      const controller = new AbortController();
      request.current = controller;
      last.current = Date.now();
      setState("checking");
      const timeout = setTimeout(() => {
        controller.abort();
        if (id === generation.current) {
          generation.current++;
          request.current = null;
          setState(navigator.onLine ? "error" : "offline");
        }
      }, 5000);
      try {
        const url = new URL("release.json", new URL(import.meta.env.BASE_URL, location.href));
        url.searchParams.set("check", crypto.randomUUID());
        const response = await fetch(url, {
          cache: "no-store",
          credentials: "same-origin",
          signal: controller.signal,
          headers: { "Cache-Control": "no-cache" },
        });
        if (!response.ok || Number(response.headers.get("Age") ?? 0) > 0)
          throw new Error("Release unavailable");
        const next = parseRelease(await response.json());
        if (id !== generation.current || controller.signal.aborted) return;
        setRelease(next);
        setState(running && next.buildId === running ? "current" : "available");
      } catch {
        if (id === generation.current) setState(navigator.onLine ? "error" : "offline");
      } finally {
        clearTimeout(timeout);
        if (request.current === controller) request.current = null;
      }
    },
    [running],
  );
  useEffect(() => {
    void check();
    const refresh = () => {
      if (document.visibilityState === "visible") void check();
    };
    const offline = () => {
      void check(true);
    };
    const interval = setInterval(() => {
      if (document.visibilityState === "visible" && navigator.onLine) void check();
    }, 60000);
    window.addEventListener("online", refresh);
    window.addEventListener("offline", offline);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      generation.current++;
      request.current?.abort();
      request.current = null;
      last.current = 0;
      clearInterval(interval);
      window.removeEventListener("online", refresh);
      window.removeEventListener("offline", offline);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [check]);
  return { state, release, check: () => check(true) };
}
