// Copyright © 2026 Christopher Snow

import { readFileSync } from "node:fs";
import { createContext, runInContext } from "node:vm";

import { describe, expect, it, vi } from "vitest";

import { renderWorker } from "./plugin";

const template = readFileSync(new URL("./worker.js", import.meta.url), "utf8");
const files = [
  { path: "index.html", bytes: "<html>course</html>" },
  { path: "assets/course.js", bytes: "console.log('course')" },
  { path: "icon.svg", bytes: "<svg/>" },
];

type Handler = (event: Record<string, unknown>) => void;

function worker(base = "/assembly-lab/") {
  const scope = `https://example.test${base}`;
  const entries = new Map<string, Response>();
  const addAll = vi.fn(async (requests: Request[]) => {
    for (const request of requests) entries.set(request.url, new Response("saved"));
  });
  const cache = {
    match: vi.fn(async (url: string) => entries.get(url)?.clone()),
    addAll,
  };
  const cachePrefix = `assembly-lab-offline:${encodeURIComponent(scope)}:`;
  const oldCache = `${cachePrefix}old`;
  const unrelated = "assembly-lab-offline:https%3A%2F%2Fexample.test%2Fother%2F:old";
  const caches = {
    open: vi.fn(async (_name: string) => cache),
    delete: vi.fn(async (_name: string) => true),
    keys: vi.fn(async () => [oldCache, unrelated, "other-app"]),
  };
  const handlers = new Map<string, Handler>();
  const claim = vi.fn(async () => undefined);
  const skipWaiting = vi.fn(async () => undefined);
  const clients: { id: string; url: string; postMessage: ReturnType<typeof vi.fn> }[] = [];
  const matchAll = vi.fn(async () => clients);
  const fetch = vi.fn(async () => new Response("network"));
  runInContext(
    renderWorker(template, files),
    createContext({
      self: {
        registration: { scope },
        clients: { claim, matchAll, get: async (id: string) => clients.find((c) => c.id === id) },
        skipWaiting,
        addEventListener: (name: string, handler: Handler) => handlers.set(name, handler),
      },
      caches,
      fetch,
      URL,
      Request,
      setTimeout,
      clearTimeout,
      MessageChannel: class {
        port1 = {
          onmessage: undefined as undefined | ((event: { data: unknown }) => void),
          close() {},
        };
        port2 = { postMessage: (data: unknown) => this.port1.onmessage?.({ data }) };
      },
    }),
  );
  function dispatch(name: string, event: Record<string, unknown> = {}) {
    let result: Promise<unknown> | undefined;
    const waitUntil = (promise: Promise<unknown>) => {
      result = promise;
    };
    handlers.get(name)?.({ waitUntil, respondWith: waitUntil, ...event });
    return result;
  }
  async function status(type = "OFFLINE_STATUS") {
    const postMessage = vi.fn();
    await dispatch("message", { data: { type }, ports: [{ postMessage }] });
    return postMessage.mock.calls[0]?.[0];
  }
  return {
    scope,
    entries,
    caches,
    addAll,
    claim,
    fetch,
    oldCache,
    dispatch,
    status,
    clients,
    matchAll,
    skipWaiting,
    client(id: string, ready: boolean | null = true, url = `${scope}#/lesson/test`) {
      const client = {
        id,
        url,
        postMessage: vi.fn((message, ports) => {
          if (message.type === "PREPARE_UPDATE" && ready !== null) ports[0].postMessage({ ready });
        }),
      };
      clients.push(client);
      return client;
    },
    async update(id: string) {
      const reply = vi.fn();
      await dispatch("message", {
        data: { type: "ACTIVATE_UPDATE", id: "request-1" },
        source: { id },
        ports: [{ postMessage: reply }],
      });
      return reply.mock.calls[0]?.[0];
    },
  };
}

describe("offline release", () => {
  it("changes when any public or emitted byte or worker behaviour changes", () => {
    const original = renderWorker(template, files);
    for (let changed = 0; changed < files.length; changed++) {
      const revised = files.map((file, index) =>
        index === changed ? { ...file, bytes: `${file.bytes}new` } : file,
      );
      expect(renderWorker(template, revised)).not.toEqual(original);
    }
    // A worker-only correction needs a fresh cache identity as well.
    const revised = renderWorker(`${template}\n// revised`, files);
    expect(revised.match(/"version":"([^"]+)"/)?.[1]).not.toEqual(
      original.match(/"version":"([^"]+)"/)?.[1],
    );
  });

  it("is stable across output order and excludes source maps and the worker", () => {
    expect(
      renderWorker(template, [
        ...[...files].reverse(),
        { path: "sw.js", bytes: "old worker" },
        { path: "assets/course.js.map", bytes: "source" },
      ]),
    ).toEqual(renderWorker(template, files));
  });

  it("cannot silently produce an offline app without its entry page", () => {
    expect(() => renderWorker(template, files.slice(1))).toThrow("index.html");
  });
});

describe("offline worker", () => {
  it("activates only after all app clients acknowledge, leaving other apps alone", async () => {
    const w = worker();
    const first = w.client("first");
    const second = w.client("second");
    const other = w.client("other", false, "https://example.test/assembly-lab-extra/");
    await w.dispatch("install");
    expect(await w.update(first.id)).toEqual({ ok: true });
    expect(first.postMessage.mock.calls[0]?.[0]).toEqual({
      type: "PREPARE_UPDATE",
      id: "request-1",
    });
    expect(Array.isArray(first.postMessage.mock.calls[0]?.[1])).toBe(true);
    expect(second.postMessage).toHaveBeenCalledOnce();
    expect(other.postMessage).not.toHaveBeenCalled();
    expect(w.skipWaiting).toHaveBeenCalledOnce();
  });

  it("keeps the old release when any tab cannot confirm saved work", async () => {
    const w = worker();
    const first = w.client("first");
    const second = w.client("second", false);
    await w.dispatch("install");
    expect(await w.update(first.id)).toEqual({ ok: false, error: "unsaved" });
    expect(w.skipWaiting).not.toHaveBeenCalled();
    for (const client of [first, second])
      expect(client.postMessage).toHaveBeenCalledWith({
        type: "CANCEL_UPDATE",
        id: "request-1",
        error: "unsaved",
      });
  });

  it("does not activate if a tab opens during preparation", async () => {
    const w = worker();
    const first = w.client("first");
    const initial = [...w.clients];
    w.client("new");
    w.matchAll.mockResolvedValueOnce(initial);
    await w.dispatch("install");
    expect(await w.update(first.id)).toEqual({ ok: false, error: "tabs" });
    expect(w.skipWaiting).not.toHaveBeenCalled();
  });

  it("refuses incomplete cached updates and out-of-scope activation requests", async () => {
    const w = worker();
    const first = w.client("first");
    const other = w.client("other", true, "https://example.test/other/");
    expect(await w.update(other.id)).toEqual({ ok: false, error: "tabs" });
    w.addAll.mockRejectedValueOnce(new Error("download failed"));
    expect(await w.update(first.id)).toEqual({ ok: false, error: "download" });
    expect(w.skipWaiting).not.toHaveBeenCalled();
    expect(first.postMessage).not.toHaveBeenCalled();
  });

  it("ignores cancellation from an older request or a different tab", async () => {
    const w = worker();
    const first = w.client("first");
    const second = w.client("second", null);
    await w.dispatch("install");
    const pending = w.update(first.id);
    await vi.waitFor(() => expect(second.postMessage).toHaveBeenCalled());
    await w.dispatch("message", {
      data: { type: "CANCEL_ACTIVATION", id: "older-request" },
      source: { id: first.id },
    });
    await w.dispatch("message", {
      data: { type: "CANCEL_ACTIVATION", id: "request-1" },
      source: { id: second.id },
    });
    second.postMessage.mock.calls[0]?.[1][0].postMessage({ ready: true });
    expect(await pending).toEqual({ ok: true });
    expect(w.skipWaiting).toHaveBeenCalledOnce();
  });

  it("cannot activate a cancelled preparation after a late acknowledgement", async () => {
    const w = worker();
    const first = w.client("first");
    const second = w.client("second", null);
    await w.dispatch("install");
    const pending = w.update(first.id);
    await vi.waitFor(() => expect(second.postMessage).toHaveBeenCalled());
    await w.dispatch("message", {
      data: { type: "CANCEL_ACTIVATION", id: "request-1" },
      source: { id: first.id },
    });
    second.postMessage.mock.calls[0]?.[1][0].postMessage({ ready: true });
    expect(await pending).toEqual({ ok: false, error: "tabs" });
    expect(w.skipWaiting).not.toHaveBeenCalled();
  });
  it.each(["/", "/assembly-lab/"])(
    "installs every file with integrity and serves app navigations at %s",
    async (base) => {
      const w = worker(base);
      expect(await w.status()).toEqual({ ready: false });
      await w.dispatch("install");
      expect(await w.status()).toEqual({ ready: true });
      const requests = w.addAll.mock.calls[0]?.[0];
      expect(requests).toHaveLength(files.length);
      expect(requests?.every((request) => request.integrity.startsWith("sha256-"))).toBe(true);
      expect(requests?.every((request) => request.cache === "reload")).toBe(true);
      for (const path of ["?source=bookmark", "index.html?source=bookmark"]) {
        const response = (await w.dispatch("fetch", {
          request: { url: `${w.scope}${path}`, method: "GET", mode: "navigate" },
        })) as Response;
        expect(await response.text()).toBe("saved");
      }
      expect(w.fetch).not.toHaveBeenCalled();
    },
  );

  it("leaves unknown URLs, other scopes, API requests and asset queries alone", () => {
    const w = worker();
    for (const request of [
      { url: `${w.scope}api`, method: "POST", mode: "cors" },
      { url: "https://godbolt.org/api/compiler", method: "POST", mode: "cors" },
      { url: "https://example.test/other/", method: "GET", mode: "navigate" },
      { url: `${w.scope}unknown`, method: "GET", mode: "navigate" },
      { url: `${w.scope}assets/course.js?other`, method: "GET", mode: "cors" },
      { url: `${w.scope}sw.js`, method: "GET", mode: "cors" },
      { url: `${w.scope}assets/course.js.map`, method: "GET", mode: "cors" },
    ]) {
      expect(w.dispatch("fetch", { request })).toBeUndefined();
    }
  });

  it("removes only the failed release after an unsuccessful install", async () => {
    const w = worker();
    w.addAll.mockRejectedValueOnce(new Error("download failed"));
    await expect(w.dispatch("install")).rejects.toThrow("download failed");
    expect(w.caches.delete).toHaveBeenCalledExactlyOnceWith(w.caches.open.mock.calls[0]?.[0]);
    expect(w.caches.delete).not.toHaveBeenCalledWith(w.oldCache);
    expect(w.claim).not.toHaveBeenCalled();
  });

  it("activation cleans only older caches in its own scope and claims clients", async () => {
    const w = worker();
    await w.dispatch("activate");
    expect(w.caches.delete).toHaveBeenCalledExactlyOnceWith(w.oldCache);
    expect(w.claim).toHaveBeenCalledOnce();
  });

  it("reports eviction and repairs it, preserving valid entries after a failed repair", async () => {
    const w = worker();
    await w.dispatch("install");
    w.entries.delete(`${w.scope}icon.svg`);
    expect(await w.status()).toEqual({ ready: false });
    w.addAll.mockRejectedValueOnce(new Error("offline"));
    expect(await w.status("OFFLINE_REPAIR")).toEqual({ ready: false });
    expect(w.entries.has(`${w.scope}index.html`)).toBe(true);
    expect(w.caches.delete).not.toHaveBeenCalled();
    expect(await w.status("OFFLINE_REPAIR")).toEqual({ ready: true });
  });

  it("uses the network for a missing cached file without silently changing the release", async () => {
    const w = worker();
    await w.dispatch("fetch", {
      request: { url: `${w.scope}icon.svg`, method: "GET", mode: "cors" },
    });
    expect(w.fetch).toHaveBeenCalledOnce();
    expect(w.addAll).not.toHaveBeenCalled();
  });
});
