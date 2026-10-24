// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { StrictMode } from "react";
import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { parseRelease, usePublishedRelease } from "./latest-commit";

const buildId = "a".repeat(64);
const entry = { path: "index.html", bytes: 12, integrity: `sha256-${"A".repeat(43)}=` };
const release = {
  schemaVersion: 1,
  buildId,
  commit: "b".repeat(40),
  committedAt: "2026-10-24T00:00:00Z",
  assets: [entry],
  totalBytes: 12,
  worker: { ...entry, path: "sw.js" },
};
const response = (value: unknown = release) => ({
  ok: true,
  headers: new Headers(),
  json: async () => value,
});
beforeEach(() =>
  Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" }),
);
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});
it("compares deployed build identity rather than main and bypasses caches", async () => {
  const fetcher = vi.fn().mockResolvedValue(response());
  vi.stubGlobal("fetch", fetcher);
  const { result } = renderHook(() => usePublishedRelease(buildId), { wrapper: StrictMode });
  await waitFor(() => expect(result.current.state).toBe("current"));
  const [url, options] = fetcher.mock.calls.at(-1)!;
  expect(String(url)).toMatch(/release\.json\?check=/);
  expect(String(url)).not.toContain("github");
  expect(options).toMatchObject({
    cache: "no-store",
    credentials: "same-origin",
    headers: { "Cache-Control": "no-cache" },
  });
  fetcher.mockResolvedValue(response({ ...release, buildId: "c".repeat(64) }));
  await act(() => result.current.check());
  expect(result.current.state).toBe("available");
});
it.each([
  {},
  null,
  { ...release, assets: [{ ...entry, path: "../sibling" }] },
  { ...release, totalBytes: 1 },
  { ...release, buildId: "short" },
  { ...release, assets: [entry, entry], totalBytes: 24 },
  { ...release, commit: "no" },
])("rejects invalid release metadata %j", (value) => {
  expect(() => parseRelease(value)).toThrow();
});
it("separates offline, cached and failed checks from verified currency", async () => {
  const fetcher = vi.fn().mockResolvedValue(response());
  vi.stubGlobal("fetch", fetcher);
  const { result } = renderHook(() => usePublishedRelease(buildId));
  await waitFor(() => expect(result.current.state).toBe("current"));
  vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
  act(() => window.dispatchEvent(new Event("offline")));
  expect(result.current.state).toBe("offline");
  vi.spyOn(navigator, "onLine", "get").mockReturnValue(true);
  fetcher.mockResolvedValue({ ...response(), headers: new Headers({ Age: "30" }) });
  act(() => window.dispatchEvent(new Event("online")));
  await waitFor(() => expect(result.current.state).toBe("error"));
  fetcher.mockRejectedValue(new Error("network"));
  await act(() => result.current.check());
  expect(result.current.state).toBe("error");
});
it("times out, allows retry and ignores late responses and aborted offline requests", async () => {
  vi.useFakeTimers();
  let finish!: (value: unknown) => void;
  const fetcher = vi.fn().mockReturnValue(
    new Promise((resolve) => {
      finish = resolve;
    }),
  );
  vi.stubGlobal("fetch", fetcher);
  const { result } = renderHook(() => usePublishedRelease(buildId));
  const signal = fetcher.mock.calls[0]![1].signal as AbortSignal;
  await act(async () => {
    vi.advanceTimersByTime(5000);
  });
  expect(signal.aborted).toBe(true);
  expect(result.current.state).toBe("error");
  fetcher.mockResolvedValue(response({ ...release, buildId: "c".repeat(64) }));
  await act(() => result.current.check());
  expect(result.current.state).toBe("available");
  await act(async () => finish(response()));
  expect(result.current.state).toBe("available");
});
it("throttles focus events and polls only while visible and connected", async () => {
  vi.useFakeTimers();
  const fetcher = vi.fn().mockResolvedValue(response());
  vi.stubGlobal("fetch", fetcher);
  const { result } = renderHook(() => usePublishedRelease(buildId));
  await act(async () => {});
  expect(result.current.state).toBe("current");
  act(() => {
    window.dispatchEvent(new Event("focus"));
    window.dispatchEvent(new Event("focus"));
  });
  expect(fetcher).toHaveBeenCalledTimes(1);
  Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" });
  await act(async () => {
    vi.advanceTimersByTime(60000);
  });
  expect(fetcher).toHaveBeenCalledTimes(1);
  Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" });
  act(() => document.dispatchEvent(new Event("visibilitychange")));
  await act(async () => {});
  expect(fetcher).toHaveBeenCalledTimes(2);
});
