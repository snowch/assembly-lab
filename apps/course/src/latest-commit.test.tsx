// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { LATEST_COMMIT_URL, useLatestCommit } from "./latest-commit";

const sha = "a".repeat(40);
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

it("ticks only after verifying the full main SHA without cached or credentialled requests", async () => {
  const fetcher = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ sha }) });
  vi.stubGlobal("fetch", fetcher);
  const { result } = renderHook(() => useLatestCommit(sha, true));
  expect(result.current).toBe(false);
  await waitFor(() => expect(result.current).toBe(true));
  expect(fetcher).toHaveBeenCalledWith(
    LATEST_COMMIT_URL,
    expect.objectContaining({
      cache: "no-store",
      credentials: "omit",
      referrerPolicy: "no-referrer",
    }),
  );
});

it.each([{ sha: "b".repeat(40) }, { sha: sha.slice(0, 7) }, { sha: 123 }, {}, null])(
  "does not tick an unverified or different response: %j",
  async (commit) => {
    const json = vi.fn().mockResolvedValue(commit);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json }));
    const { result } = renderHook(() => useLatestCommit(sha, true));
    await waitFor(() => expect(json).toHaveBeenCalled());
    expect(result.current).toBe(false);
  },
);

it("removes a verified tick when offline and rechecks after reconnecting and focusing", async () => {
  const fetcher = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ sha }) });
  vi.stubGlobal("fetch", fetcher);
  const { result } = renderHook(() => useLatestCommit(sha, true));
  await waitFor(() => expect(result.current).toBe(true));
  vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
  act(() => window.dispatchEvent(new Event("offline")));
  expect(result.current).toBe(false);
  act(() => window.dispatchEvent(new Event("focus")));
  expect(fetcher).toHaveBeenCalledTimes(1);
  vi.spyOn(navigator, "onLine", "get").mockReturnValue(true);
  act(() => window.dispatchEvent(new Event("online")));
  await waitFor(() => expect(result.current).toBe(true));
  fetcher.mockResolvedValue({ ok: true, json: async () => ({ sha: "b".repeat(40) }) });
  act(() => window.dispatchEvent(new Event("focus")));
  await waitFor(() => expect(fetcher).toHaveBeenCalledTimes(3));
  expect(result.current).toBe(false);
});

it("keeps the tick off after an HTTP error, bad JSON or rejected request", async () => {
  const fetcher = vi.fn().mockResolvedValue({ ok: false });
  vi.stubGlobal("fetch", fetcher);
  const { result } = renderHook(() => useLatestCommit(sha, true));
  await waitFor(() => expect(fetcher).toHaveBeenCalledTimes(1));
  expect(result.current).toBe(false);
  fetcher.mockResolvedValue({
    ok: true,
    json: async () => {
      throw new Error("bad JSON");
    },
  });
  act(() => window.dispatchEvent(new Event("focus")));
  await waitFor(() => expect(fetcher).toHaveBeenCalledTimes(2));
  expect(result.current).toBe(false);
  fetcher.mockRejectedValue(new Error("offline"));
  act(() => window.dispatchEvent(new Event("focus")));
  await waitFor(() => expect(fetcher).toHaveBeenCalledTimes(3));
  expect(result.current).toBe(false);
});

it("does not request GitHub from a disabled preview, without a version or while offline", () => {
  const fetcher = vi.fn();
  vi.stubGlobal("fetch", fetcher);
  renderHook(() => useLatestCommit(sha, false));
  renderHook(() => useLatestCommit(null, true));
  vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
  renderHook(() => useLatestCommit(sha, true));
  expect(fetcher).not.toHaveBeenCalled();
});

it("aborts a slow check and ignores its eventual response", async () => {
  vi.useFakeTimers();
  let resolve!: (response: unknown) => void;
  const fetcher = vi.fn().mockReturnValue(
    new Promise((r) => {
      resolve = r;
    }),
  );
  vi.stubGlobal("fetch", fetcher);
  const { result } = renderHook(() => useLatestCommit(sha, true));
  const signal = fetcher.mock.calls[0]![1].signal as AbortSignal;
  await act(async () => {
    vi.advanceTimersByTime(5000);
  });
  expect(signal.aborted).toBe(true);
  await act(async () => {
    resolve({ ok: true, json: async () => ({ sha }) });
  });
  expect(result.current).toBe(false);
});
