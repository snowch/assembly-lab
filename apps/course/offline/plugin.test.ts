// Copyright © 2026 Christopher Snow

import { webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { createContext, runInContext } from "node:vm";

import { describe, expect, it, vi } from "vitest";

import { BUILD_MARKER, renderRelease, renderWorker } from "./plugin";

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
  const cachePrefix = `assembly-lab-offline:${encodeURIComponent(scope)}:`;
  const oldCache = `${cachePrefix}old`;
  const unrelated = "assembly-lab-offline:https%3A%2F%2Fexample.test%2Fother%2F:old";
  const saved = new Map<string, Map<string, Response>>([
    [oldCache, new Map()],
    [unrelated, new Map()],
    ["other-app", new Map()],
  ]);
  const currentName = `${cachePrefix}${renderRelease(template, files).metadata.buildId}`;
  saved.set(currentName, entries);
  const put = vi.fn(async (url: string, response: Response) => {
    entries.set(url, new Response(await response.arrayBuffer()));
  });
  const putOther = vi.fn(async (name: string, url: string, response: Response) => {
    saved.get(name)!.set(url, new Response(await response.arrayBuffer()));
  });
  const caches = {
    open: vi.fn(async (name: string) => {
      let map = saved.get(name);
      if (!map) {
        map = name === currentName ? entries : new Map();
        saved.set(name, map);
      }
      return {
        match: async (url: string) => map.get(url)?.clone(),
        keys: async () => [...map.keys()].map((url) => new Request(url)),
        delete: async (request: Request | string) =>
          map.delete(typeof request === "string" ? request : request.url),
        put:
          name === currentName
            ? put
            : async (url: string, response: Response) => putOther(name, url, response),
      };
    }),
    delete: vi.fn(async (name: string) => {
      if (name === currentName) entries.clear();
      return saved.delete(name);
    }),
    keys: vi.fn(async () => [...saved.keys()]),
  };
  const handlers = new Map<string, Handler>();
  const claim = vi.fn(async () => undefined);
  const skipWaiting = vi.fn(async (): Promise<void> => {});
  const clients: { id: string; url: string; postMessage: ReturnType<typeof vi.fn> }[] = [];
  const matchAll = vi.fn(async () => clients);
  let networkFiles = files;
  const fetch = vi.fn(async (request: Request) => {
    const url = new URL(request.url);
    url.search = "";
    url.pathname = url.pathname.replace(/\/releases\/[a-f0-9]{64}\//, "/");
    const file = networkFiles.find(
      (file) =>
        new URL(file.path, scope).href === (url.href === scope ? `${scope}index.html` : url.href),
    );
    return new Response(file ? file.bytes : "network");
  });
  const registration = { scope, waiting: null as object | null };
  const boot = (input = files) =>
    runInContext(
      renderWorker(template, input),
      createContext({
        self: {
          registration,
          clients: { claim, matchAll, get: async (id: string) => clients.find((c) => c.id === id) },
          skipWaiting,
          addEventListener: (name: string, handler: Handler) => handlers.set(name, handler),
        },
        caches,
        crypto: webcrypto,
        btoa,
        Response,
        AbortController,
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
  boot();
  function dispatch(name: string, event: Record<string, unknown> = {}) {
    if (name === "fetch" && !(event.request instanceof Request)) {
      const original = event.request as { url: string; mode: string; method: string };
      const request = new Request(original.url, { method: original.method });
      Object.defineProperty(request, "mode", { value: original.mode });
      event = { ...event, request };
    }
    let result: Promise<unknown> | undefined;
    const waitUntil = (promise: Promise<unknown>) => {
      result = promise;
    };
    handlers.get(name)?.({ waitUntil, respondWith: waitUntil, ...event });
    return result;
  }
  async function status(type = "OFFLINE_STATUS") {
    const postMessage = vi.fn();
    await dispatch("message", {
      data: {
        type,
        ...(type === "PREPARE_RELEASE" ? { release: renderRelease(template, files).metadata } : {}),
      },
      source: { id: "status-client", url: scope },
      ports: [{ postMessage }],
    });
    return postMessage.mock.calls.at(-1)?.[0];
  }
  return {
    scope,
    registration,
    reboot: boot,
    entries,
    caches,
    put,
    putOther,
    saved,
    claim,
    fetch,
    oldCache,
    dispatch,
    status,
    clients,
    matchAll,
    prepare: async () => {
      const saved = await status("DOWNLOAD_OFFLINE");
      return saved?.ok ? status("PREPARE_RELEASE") : saved;
    },
    publish: (next: typeof files) => {
      const built = renderRelease(template, next);
      networkFiles = built.files.map((file) => ({
        path: file.path,
        bytes: Buffer.from(file.bytes).toString("utf8"),
      }));
      return built.metadata;
    },
    request: async (type: string, data: Record<string, unknown> = {}) => {
      const reply = vi.fn();
      await dispatch("message", {
        data: { type, ...data },
        source: { id: "status-client", url: scope },
        ports: [{ postMessage: reply }],
      });
      return reply.mock.calls.map((call) => call[0]);
    },
    skipWaiting,
    client(id: string, ready: boolean | null = true, url = `${scope}#/lesson/test`) {
      const client = {
        id,
        url,
        postMessage: vi.fn((message, ports) => {
          if (
            (message.type === "PREPARE_UPDATE" || message.type === "VERIFY_UPDATE") &&
            ready !== null
          )
            ports[0].postMessage({ ready });
        }),
      };
      clients.push(client);
      return client;
    },
    async update(id: string, replaceRuntime?: boolean) {
      const reply = vi.fn();
      await dispatch("message", {
        data: {
          type: "ACTIVATE_UPDATE",
          id: "request-1",
          ...(replaceRuntime === undefined ? {} : { replaceRuntime }),
        },
        source: clients.find((client) => client.id === id),
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

describe("published release", () => {
  it("pins public fonts inside CSS as well as emitted runtime assets", () => {
    const built = renderRelease(template, [
      ...files,
      {
        path: "assets/course.css",
        bytes:
          '@font-face{src:url(/assembly-lab/fonts/course.woff2)}.image{background:url("/assembly-lab/assets/image-12345678.svg")}',
      },
      { path: "fonts/course.woff2", bytes: "font bytes" },
      { path: "assets/image-12345678.svg", bytes: "<svg/>" },
    ]);
    const css = built.files.find((file) => file.path === "assets/course.css")!.bytes;
    expect(css).toContain(
      `url(/assembly-lab/releases/${built.metadata.buildId}/fonts/course.woff2)`,
    );
    expect(css).toContain(
      `url("/assembly-lab/releases/${built.metadata.buildId}/assets/image-12345678.svg")`,
    );
    expect(css).not.toContain(BUILD_MARKER);
  });

  it("pins HTML runtime entry points while keeping one canonical asset inventory", () => {
    const input = [
      {
        path: "index.html",
        bytes: `<meta name="course-build-id" content="${BUILD_MARKER}"><script src="/assembly-lab/assets/app-12345678.js"></script><link href="/assembly-lab/assets/app-12345678.css" rel="stylesheet">`,
      },
      { path: "assets/app-12345678.js", bytes: "export {};" },
      { path: "assets/app-12345678.css", bytes: "body{}" },
    ];
    const result = renderRelease(template, input);
    const html = result.files.find((file) => file.path === "index.html")!.bytes;
    expect(html).toContain(
      `/assembly-lab/releases/${result.metadata.buildId}/assets/app-12345678.js`,
    );
    expect(html).toContain(
      `/assembly-lab/releases/${result.metadata.buildId}/assets/app-12345678.css`,
    );
    expect(result.metadata.assets.map((file) => file.path)).toEqual([
      "assets/app-12345678.css",
      "assets/app-12345678.js",
      "index.html",
    ]);
    expect(
      renderRelease(
        template,
        input.concat({ path: `releases/${result.metadata.buildId}/index.html`, bytes: "old copy" }),
      ),
    ).toEqual(result);
  });

  it("embeds one deterministic identity while recording exact final HTML and worker bytes", () => {
    const source = { sha: "a".repeat(40), committedAt: "2026-10-24T00:00:00.000Z" };
    const input = [
      { path: "index.html", bytes: `<meta name="course-build-id" content="${BUILD_MARKER}">` },
      ...files.slice(1),
    ];
    const result = renderRelease(template, input, source);
    expect(result.metadata).toMatchObject({
      schemaVersion: 1,
      commit: source.sha,
      committedAt: source.committedAt,
    });
    expect(result.files[0]?.bytes).toBeDefined();
    expect(result.files.find((file) => file.path === "index.html")?.bytes).toContain(
      result.metadata.buildId,
    );
    expect(result.metadata.totalBytes).toBe(
      result.metadata.assets.reduce((sum, file) => sum + file.bytes, 0),
    );
    expect(result.metadata.worker.bytes).toBe(Buffer.byteLength(result.worker));
    expect(result.metadata.worker.integrity).toMatch(/^sha256-/);
    expect(renderRelease(template, [...input].reverse(), source)).toEqual(result);
    expect(renderRelease(template, input, null).metadata.commit).toBeNull();
  });
});

describe("offline worker", () => {
  it("never returns a corrupt saved entry page when the network is unavailable", async () => {
    const w = worker();
    await w.prepare();
    w.entries.set(`${w.scope}index.html`, new Response("corrupt HTML"));
    w.fetch.mockRejectedValue(new Error("offline"));
    await expect(
      w.dispatch("fetch", { request: { url: w.scope, method: "GET", mode: "navigate" } }),
    ).rejects.toThrow("offline");
    expect(await w.status()).toMatchObject({ ready: false, partial: true });
  });

  it("keeps modern unknown-client public requests fresh when client-mode persistence is unavailable", async () => {
    const w = worker();
    await w.prepare();
    w.publish(
      files.map((file) => (file.path === "icon.svg" ? { ...file, bytes: "B icon" } : file)),
    );
    const response = (await w.dispatch("fetch", {
      request: new Request(`${w.scope}icon.svg`),
    })) as Response;
    expect(await response.text()).toBe("B icon");
    expect(await w.status()).toMatchObject({ ready: true });
  });

  it("rejects a competing restart and preparation while a download owns the worker", async () => {
    const w = worker();
    const client = w.client("first");
    const original = w.fetch.getMockImplementation()!;
    let release!: () => void;
    w.fetch.mockImplementationOnce(async (request) => {
      await new Promise<void>((resolve) => {
        release = resolve;
      });
      return original(request);
    });
    const saving = w.request("DOWNLOAD_OFFLINE", { id: "save-A" });
    await vi.waitFor(() => expect(w.fetch).toHaveBeenCalledOnce());
    expect(await w.update(client.id)).toEqual({ ok: false, error: "tabs" });
    expect(
      (await w.request("PREPARE_RELEASE", { release: renderRelease(template, files).metadata })).at(
        -1,
      ),
    ).toEqual({ ok: false, error: "busy" });
    expect(client.postMessage).not.toHaveBeenCalled();
    release();
    expect((await saving).at(-1)).toMatchObject({ ok: true, ready: true });
  });

  it("verifies immutable cached runtime bytes and refuses mismatched replacement bytes", async () => {
    const w = worker();
    await w.prepare();
    const version = (await w.status()).version;
    w.entries.set(`${w.scope}assets/course.js`, new Response("corrupt"));
    const original = w.fetch.getMockImplementation()!;
    w.fetch.mockImplementation(async (request) =>
      request.url.includes("course.js") ? new Response("wrong release") : original(request),
    );
    const response = (await w.dispatch("fetch", {
      request: new Request(`${w.scope}releases/${version}/assets/course.js`),
    })) as Response;
    expect(response.status).toBe(503);
    expect(await w.status()).toMatchObject({ ready: false, partial: true });
    expect(w.caches.delete).not.toHaveBeenCalled();
  });

  it("opens the current published course online while keeping A as a complete offline fallback", async () => {
    const w = worker();
    await w.prepare();
    const savedA = (await w.status()).version;
    const publishedB = w.publish(
      files.map((file) =>
        file.path === "index.html"
          ? { ...file, bytes: `<meta name="course-build-id" content="${BUILD_MARKER}">B` }
          : file,
      ),
    );
    const online = (await w.dispatch("fetch", {
      request: { url: w.scope, method: "GET", mode: "navigate" },
      resultingClientId: "online-B",
    })) as Response;
    expect(await online.text()).toContain(publishedB.buildId);
    expect(await w.status()).toMatchObject({ version: savedA, ready: true, pendingVersion: null });
    w.fetch.mockRejectedValueOnce(new Error("offline"));
    const offline = (await w.dispatch("fetch", {
      request: { url: w.scope, method: "GET", mode: "navigate" },
      resultingClientId: "offline-A",
    })) as Response;
    expect(await offline.text()).toBe("<html>course</html>");
    expect(await w.status()).toMatchObject({ version: savedA, ready: true });
  });

  it("keeps immutable old-tab assets available after a new runtime activates", async () => {
    const w = worker();
    await w.prepare();
    const savedA = (await w.status()).version;
    const revised = files.map((file) =>
      file.path === "assets/course.js" ? { ...file, bytes: "console.log('B')" } : file,
    );
    const publishedB = w.publish(revised);
    await w.request("PREPARE_RELEASE", { id: "stage-B", release: publishedB });
    w.reboot(revised);
    await w.dispatch("activate");
    w.fetch.mockRejectedValue(new Error("offline"));
    const oldAsset = (await w.dispatch("fetch", {
      request: new Request(`${w.scope}releases/${savedA}/assets/course.js`),
      clientId: "old-A",
    })) as Response;
    expect(await oldAsset.text()).toBe("console.log('course')");
    expect(w.saved.has(w.oldCache)).toBe(true);
  });

  it("restarts to prepared B even if the network publishes C before the reload", async () => {
    const w = worker();
    const first = w.client("first");
    await w.prepare();
    const publishedB = w.publish(
      files.map((file) =>
        file.path === "index.html" ? { ...file, bytes: "<html>B</html>" } : file,
      ),
    );
    await w.request("PREPARE_RELEASE", { id: "stage-B", release: publishedB });
    await w.update(first.id);
    w.publish(
      files.map((file) =>
        file.path === "index.html" ? { ...file, bytes: "<html>C</html>" } : file,
      ),
    );
    const before = w.fetch.mock.calls.length;
    const restarted = (await w.dispatch("fetch", {
      request: { url: w.scope, method: "GET", mode: "navigate" },
      replacesClientId: first.id,
      resultingClientId: "after-restart",
    })) as Response;
    expect(await restarted.text()).toBe("<html>B</html>");
    expect(w.fetch).toHaveBeenCalledTimes(before);
    const freshVisit = (await w.dispatch("fetch", {
      request: { url: w.scope, method: "GET", mode: "navigate" },
      resultingClientId: "fresh-C",
    })) as Response;
    expect(await freshVisit.text()).toBe("<html>C</html>");
  });

  it("activates only after all app clients acknowledge, leaving other apps alone", async () => {
    const w = worker();
    const first = w.client("first");
    const second = w.client("second");
    const other = w.client("other", false, "https://example.test/assembly-lab-extra/");
    await w.dispatch("install");
    await w.prepare();
    expect(await w.update(first.id)).toEqual({ ok: true });
    expect(first.postMessage.mock.calls[0]?.[0]).toEqual({
      type: "PREPARE_UPDATE",
      id: "request-1",
    });
    expect(Array.isArray(first.postMessage.mock.calls[0]?.[1])).toBe(true);
    expect(second.postMessage.mock.calls.map((call) => call[0].type)).toEqual([
      "PREPARE_UPDATE",
      "VERIFY_UPDATE",
      "COMMIT_UPDATE",
    ]);
    expect(other.postMessage).not.toHaveBeenCalled();
    expect(w.skipWaiting).not.toHaveBeenCalled();
    expect(first.postMessage.mock.calls.at(-1)?.[0]).toEqual({
      type: "COMMIT_UPDATE",
      id: "request-1",
    });
  });

  it("keeps the old release when any tab cannot confirm saved work", async () => {
    const w = worker();
    const first = w.client("first");
    const second = w.client("second", false);
    await w.dispatch("install");
    await w.prepare();
    expect(await w.update(first.id)).toEqual({ ok: false, error: "unsaved" });
    expect(w.skipWaiting).not.toHaveBeenCalled();
    for (const client of [first, second])
      expect(client.postMessage).toHaveBeenCalledWith({
        type: "CANCEL_UPDATE",
        id: "request-1",
        error: "unsaved",
      });
  });

  it("rechecks work after all tabs pause, catching edits between initial acknowledgements", async () => {
    const w = worker();
    const first = w.client("first");
    const second = w.client("second");
    let firstStillSaved = true;
    first.postMessage.mockImplementation((message, ports) => {
      if (message.type === "PREPARE_UPDATE" || message.type === "VERIFY_UPDATE")
        ports[0].postMessage({ ready: firstStillSaved });
    });
    second.postMessage.mockImplementation((message, ports) => {
      if (message.type === "PREPARE_UPDATE") firstStillSaved = false;
      if (message.type === "PREPARE_UPDATE" || message.type === "VERIFY_UPDATE")
        ports[0].postMessage({ ready: true });
    });
    await w.dispatch("install");
    await w.prepare();
    expect(await w.update(first.id)).toEqual({ ok: false, error: "unsaved" });
    expect(w.skipWaiting).not.toHaveBeenCalled();
  });

  it("does not activate if a tab opens during preparation", async () => {
    const w = worker();
    const first = w.client("first");
    const initial = [...w.clients];
    w.client("new");
    w.matchAll.mockResolvedValueOnce(initial);
    await w.dispatch("install");
    await w.prepare();
    expect(await w.update(first.id)).toEqual({ ok: false, error: "tabs" });
    expect(w.skipWaiting).not.toHaveBeenCalled();
  });

  it("leaves the old release active if the downloaded cache is lost during preparation", async () => {
    const w = worker();
    const first = w.client("first");
    first.postMessage.mockImplementation((message, ports) => {
      if (message.type === "VERIFY_UPDATE") w.entries.clear();
      if (message.type === "PREPARE_UPDATE" || message.type === "VERIFY_UPDATE")
        ports[0].postMessage({ ready: true });
    });
    await w.dispatch("install");
    await w.prepare();
    expect(await w.update(first.id)).toEqual({ ok: false, error: "download" });
    expect(w.skipWaiting).not.toHaveBeenCalled();
  });

  it("refuses incomplete cached updates and out-of-scope activation requests", async () => {
    const w = worker();
    const first = w.client("first");
    const other = w.client("other", true, "https://example.test/other/");
    expect(await w.update(other.id)).toEqual({ ok: false, error: "tabs" });
    expect(await w.update(first.id)).toEqual({ ok: false, error: "download" });
    expect(w.skipWaiting).not.toHaveBeenCalled();
    expect(first.postMessage).not.toHaveBeenCalled();
  });

  it("ignores cancellation from an older request or a non-participating tab", async () => {
    const w = worker();
    const first = w.client("first");
    const second = w.client("second", null);
    const outsider = w.client("other", true, "https://example.test/another-course/");
    second.postMessage.mockImplementation((message, ports) => {
      if (message.type === "VERIFY_UPDATE") ports[0].postMessage({ ready: true });
    });
    await w.dispatch("install");
    await w.prepare();
    const pending = w.update(first.id);
    await vi.waitFor(() => expect(second.postMessage).toHaveBeenCalled());
    await w.dispatch("message", {
      data: { type: "CANCEL_ACTIVATION", id: "older-request" },
      source: { id: first.id },
    });
    await w.dispatch("message", {
      data: { type: "CANCEL_ACTIVATION", id: "request-1" },
      source: { id: outsider.id },
    });
    second.postMessage.mock.calls[0]?.[1][0].postMessage({ ready: true });
    expect(await pending).toEqual({ ok: true });
    expect(w.skipWaiting).not.toHaveBeenCalled();
    expect(first.postMessage.mock.calls.at(-1)?.[0]).toEqual({
      type: "COMMIT_UPDATE",
      id: "request-1",
    });
  });

  it("cannot activate a cancelled preparation after a late acknowledgement", async () => {
    const w = worker();
    const first = w.client("first");
    const second = w.client("second", null);
    second.postMessage.mockImplementation((message, ports) => {
      if (message.type === "VERIFY_UPDATE") ports[0].postMessage({ ready: true });
    });
    await w.dispatch("install");
    await w.prepare();
    const pending = w.update(first.id);
    await vi.waitFor(() => expect(second.postMessage).toHaveBeenCalled());
    await w.dispatch("message", {
      data: { type: "CANCEL_ACTIVATION", id: "request-1" },
      source: { id: second.id },
    });
    second.postMessage.mock.calls[0]?.[1][0].postMessage({ ready: true });
    expect(await pending).toEqual({ ok: false, error: "tabs" });
    expect(w.skipWaiting).not.toHaveBeenCalled();
  });

  it("honours cancellation before asynchronous preparation starts", async () => {
    const w = worker();
    const first = w.client("first");
    await w.dispatch("install");
    await w.prepare();
    const pending = w.update(first.id);
    await w.dispatch("message", {
      data: { type: "CANCEL_ACTIVATION", id: "request-1" },
      source: { id: first.id },
    });
    expect(await pending).toEqual({ ok: false, error: "tabs" });
    expect(w.skipWaiting).not.toHaveBeenCalled();
  });

  it.each(["/", "/assembly-lab/"])(
    "downloads only on request, verifies bytes and serves saved navigation at %s",
    async (base) => {
      const w = worker(base);
      await w.dispatch("install");
      expect(w.fetch).not.toHaveBeenCalled();
      expect(await w.status()).toMatchObject({
        ready: false,
        prepared: false,
        consent: false,
        completedBytes: 0,
      });
      expect(await w.prepare()).toMatchObject({ ok: true, ready: true, consent: true });
      expect(w.fetch).toHaveBeenCalledTimes(files.length);
      expect(
        w.fetch.mock.calls.every(
          ([request]) => request.integrity.startsWith("sha256-") && request.cache === "no-store",
        ),
      ).toBe(true);
      for (const path of ["?source=bookmark", "index.html?source=bookmark"]) {
        w.fetch.mockRejectedValueOnce(new Error("offline"));
        const response = (await w.dispatch("fetch", {
          request: { url: `${w.scope}${path}`, method: "GET", mode: "navigate" },
        })) as Response;
        expect(await response.text()).toBe("<html>course</html>");
      }
      expect(w.fetch).toHaveBeenCalledTimes(files.length + 2);
    },
  );

  it("bypasses cached metadata and does not cache API or unknown network responses", async () => {
    const w = worker();
    await w.dispatch("fetch", { request: new Request(`${w.scope}release.json?check=1`) });
    expect(w.fetch.mock.calls[0]?.[0].cache).toBe("no-store");
    expect(w.put).not.toHaveBeenCalled();
    for (const request of [
      { url: `${w.scope}api`, method: "POST", mode: "cors" },
      { url: "https://godbolt.org/api/compiler", method: "POST", mode: "cors" },
      { url: "https://example.test/other/", method: "GET", mode: "navigate" },
    ])
      expect(w.dispatch("fetch", { request })).toBeUndefined();
  });

  it("bypasses saved metadata at equivalent CDN cache-busting paths", async () => {
    const w = worker();
    const alias = `${w.scope}////%72elease%2Ejson?check=fresh`;
    w.entries.set(alias, new Response("stale metadata"));
    const response = (await w.dispatch("fetch", {
      request: new Request(alias),
    })) as Response;
    expect(await response.text()).toBe("network");
    expect(w.fetch).toHaveBeenCalledTimes(1);
    expect(w.fetch.mock.calls[0]?.[0].cache).toBe("no-store");
    expect(w.caches.open).not.toHaveBeenCalled();
    expect(w.put).not.toHaveBeenCalled();
  });

  it("resumes partial downloads without losing the previous release on failure", async () => {
    const w = worker();
    w.fetch.mockRejectedValueOnce(new Error("network")).mockRejectedValueOnce(new Error("network"));
    expect(await w.prepare()).toMatchObject({ ok: false, ready: false });
    expect(w.caches.delete).not.toHaveBeenCalled();
    expect(await w.prepare()).toMatchObject({ ok: true, ready: true });
    w.entries.delete(`${w.scope}icon.svg`);
    const before = w.fetch.mock.calls.length;
    expect(await w.status()).toMatchObject({ ready: false, partial: true });
    expect(await w.prepare()).toMatchObject({ ready: true });
    expect(w.fetch).toHaveBeenCalledTimes(before + 1);
  });

  it("detects corrupt bodies even when every response is present and ok", async () => {
    const w = worker();
    await w.prepare();
    w.entries.set(`${w.scope}icon.svg`, new Response("bad!!!"));
    expect(await w.status()).toMatchObject({ ready: false, partial: true });
    w.fetch.mockResolvedValueOnce(new Response("bad")).mockResolvedValueOnce(new Response("bad"));
    expect(await w.prepare()).toMatchObject({ ok: false, ready: false });
    expect(w.caches.delete).not.toHaveBeenCalledWith(w.oldCache);
  });

  it("prepares temporary online updates without granting offline consent", async () => {
    const w = worker();
    const reply = await w.status("PREPARE_RELEASE");
    expect(reply).toMatchObject({ ok: true, ready: true, prepared: true, consent: false });
    expect(await w.status()).toMatchObject({ ready: false, prepared: true, consent: false });
  });

  it("retains previous caches when an unprepared worker activates", async () => {
    const w = worker();
    await w.dispatch("activate");
    expect(w.caches.delete).not.toHaveBeenCalled();
    expect(w.claim).toHaveBeenCalledOnce();
    await w.prepare();
    await w.dispatch("activate");
    expect(w.caches.delete).not.toHaveBeenCalled();
    expect(w.saved.has("other-app")).toBe(true);
  });

  it("removes only app caches while leaving sibling caches untouched", async () => {
    const w = worker();
    await w.prepare();
    expect(await w.status("REMOVE_OFFLINE")).toEqual({ ok: true });
    expect([...w.saved.keys()]).toEqual([
      "assembly-lab-offline:https%3A%2F%2Fexample.test%2Fother%2F:old",
      "other-app",
      `assembly-lab-settings:${encodeURIComponent(w.scope)}`,
    ]);
    const metadata = w.saved.get(`assembly-lab-settings:${encodeURIComponent(w.scope)}`)!;
    expect([...metadata.keys()]).toEqual([`${w.scope}__active_release__`]);
    expect(await w.status()).toMatchObject({ ready: false, consent: false });
    expect(await w.prepare()).toMatchObject({ ready: true });
  });
  it("cancels only the matching download and resumes verified partial bytes", async () => {
    const w = worker();
    const original = w.fetch.getMockImplementation()!;
    let resume!: () => void;
    let downloads = 0;
    w.fetch.mockImplementation(async (request) => {
      downloads++;
      if (downloads === 2)
        await new Promise<void>((resolve) => {
          resume = resolve;
        });
      return original(request);
    });
    const pending = w.request("DOWNLOAD_OFFLINE", { id: "save-1" });
    await vi.waitFor(() => expect(downloads).toBe(2));
    await w.dispatch("message", {
      data: { type: "CANCEL_DOWNLOAD", id: "older" },
      source: { id: "status-client", url: w.scope },
    });
    await w.dispatch("message", {
      data: { type: "CANCEL_DOWNLOAD", id: "save-1" },
      source: { id: "outsider", url: w.scope },
    });
    expect(w.entries.size).toBe(1);
    await w.dispatch("message", {
      data: { type: "CANCEL_DOWNLOAD", id: "save-1" },
      source: { id: "status-client", url: w.scope },
    });
    resume();
    expect((await pending).at(-1)).toMatchObject({ ok: false, error: "cancelled", partial: true });
    const before = w.fetch.mock.calls.length;
    expect(await w.prepare()).toMatchObject({ ok: true, ready: true });
    expect(w.fetch).toHaveBeenCalledTimes(before + files.length - 1);
  });

  it("reports verified byte counts, retains complete older copies on storage failure", async () => {
    const w = worker();
    w.saved.get(w.oldCache)!.set(`${w.scope}icon.svg`, new Response("<svg/>"));
    const messages = await w.request("DOWNLOAD_OFFLINE", { id: "progress" });
    const final = messages.at(-1);
    expect(final).toMatchObject({
      ok: true,
      completedBytes: files.reduce((sum, f) => sum + Buffer.byteLength(f.bytes), 0),
    });
    const progress = messages.filter((m) => m.progress);
    expect(progress[0].completedBytes).toBe(Buffer.byteLength("<svg/>"));
    expect(
      progress.every(
        (m, index) => index === 0 || m.completedBytes >= progress[index - 1].completedBytes,
      ),
    ).toBe(true);
    expect(w.fetch).toHaveBeenCalledTimes(files.length - 1);
    w.entries.delete(`${w.scope}icon.svg`);
    w.put.mockRejectedValueOnce(new Error("quota"));
    expect(await w.prepare()).toMatchObject({ ok: false });
    expect(w.saved.get(w.oldCache)?.has(`${w.scope}icon.svg`)).toBe(true);
  });

  it("continues serving legacy saved HTML after an unprepared replacement activates", async () => {
    const w = worker();
    w.saved.get(w.oldCache)!.set(`${w.scope}index.html`, new Response("legacy shell"));
    await w.dispatch("activate");
    w.fetch.mockRejectedValueOnce(new Error("offline"));
    const response = (await w.dispatch("fetch", {
      request: { url: w.scope, method: "GET", mode: "navigate" },
    })) as Response;
    expect(await response.text()).toBe("legacy shell");
    expect(w.fetch).toHaveBeenCalledOnce();
    expect(await w.status()).toMatchObject({ ready: false });
  });
  it("keeps staged updates deferred across all windows closing and a newer worker activation", async () => {
    const w = worker();
    const first = w.client("first");
    await w.prepare();
    const original = (await w.status()).version;
    const revised = files.map((file) =>
      file.path === "index.html" ? { ...file, bytes: "<html>new course</html>" } : file,
    );
    const published = w.publish(revised);
    expect(
      (
        await w.request("PREPARE_RELEASE", { id: "stage-B", release: published, persistent: true })
      ).at(-1),
    ).toMatchObject({ ok: true });
    expect(await w.status()).toMatchObject({
      version: original,
      pendingVersion: published.buildId,
      pendingPrepared: true,
      ready: true,
    });
    w.reboot(revised);
    await w.dispatch("activate");
    expect(await w.status()).toMatchObject({
      version: original,
      pendingVersion: published.buildId,
      pendingPrepared: true,
    });
    w.fetch.mockRejectedValueOnce(new Error("offline"));
    const before = (await w.dispatch("fetch", {
      request: { url: w.scope, method: "GET", mode: "navigate" },
    })) as Response;
    expect(await before.text()).toBe("<html>course</html>");
    expect(await w.update(first.id)).toEqual({ ok: true });
    expect(await w.status()).toMatchObject({
      version: published.buildId,
      pendingVersion: null,
      pendingPrepared: false,
      ready: true,
    });
    expect(first.postMessage.mock.calls.at(-1)?.[0]).toEqual({
      type: "COMMIT_UPDATE",
      id: "request-1",
    });
    w.reboot();
    await w.dispatch("activate");
    expect(await w.status()).toMatchObject({ version: published.buildId, ready: true });
    w.fetch.mockRejectedValueOnce(new Error("offline"));
    const after = (await w.dispatch("fetch", {
      request: { url: w.scope, method: "GET", mode: "navigate" },
    })) as Response;
    expect(await after.text()).toBe("<html>new course</html>");
  });

  it("adopts the already-loaded published release for an explicit fresh offline save", async () => {
    const w = worker();
    await w.status();
    const revised = files.map((file) =>
      file.path === "index.html" ? { ...file, bytes: "<html>loaded B</html>" } : file,
    );
    const published = w.publish(revised);
    expect(
      (await w.request("DOWNLOAD_OFFLINE", { id: "save-B", release: published })).at(-1),
    ).toMatchObject({ ok: true, ready: true });
    expect(await w.status()).toMatchObject({
      version: published.buildId,
      ready: true,
      pendingVersion: null,
    });
    const another = w.publish(files);
    expect(
      (await w.request("DOWNLOAD_OFFLINE", { id: "overwrite-complete", release: another })).at(-1),
    ).toMatchObject({ ok: false });
    expect(await w.status()).toMatchObject({ version: published.buildId, ready: true });
  });

  it("upgrades the legacy waiting-worker action without requiring a new UI first", async () => {
    const w = worker();
    const first = w.client("old-ui");
    w.registration.waiting = {};
    expect(await w.update(first.id)).toEqual({ ok: true });
    expect(w.fetch).toHaveBeenCalledTimes(files.length);
    expect(w.skipWaiting).toHaveBeenCalledOnce();
    expect(first.postMessage.mock.calls.map((call) => call[0].type)).toEqual([
      "PREPARE_UPDATE",
      "VERIFY_UPDATE",
    ]);
    expect(await w.status()).toMatchObject({ ready: true, consent: true });
  });
  it("keeps the old pointer when the atomic restart write fails, then permits retry", async () => {
    const w = worker();
    const first = w.client("first");
    await w.prepare();
    const original = (await w.status()).version;
    const published = w.publish(
      files.map((file) =>
        file.path === "index.html" ? { ...file, bytes: "<html>B</html>" } : file,
      ),
    );
    await w.request("PREPARE_RELEASE", { id: "stage", release: published, persistent: true });
    const originalPut = w.putOther.getMockImplementation()!;
    w.putOther.mockImplementation(async (name, url, response) => {
      if (url.endsWith("__active_release__")) throw new Error("quota");
      return originalPut(name, url, response);
    });
    expect(await w.update(first.id)).toMatchObject({ ok: false });
    expect(await w.status()).toMatchObject({
      version: original,
      ready: true,
      pendingPrepared: true,
    });
    expect(first.postMessage.mock.calls.map((call) => call[0].type)).not.toContain("COMMIT_UPDATE");
    w.putOther.mockImplementation(originalPut);
    expect(await w.update(first.id)).toEqual({ ok: true });
    expect(await w.status()).toMatchObject({ version: published.buildId, ready: true });
  });

  it("ignores late cancellation once the atomic pointer commit is reserved", async () => {
    const w = worker();
    const first = w.client("first");
    await w.prepare();
    const originalPut = w.putOther.getMockImplementation()!;
    let finish!: () => void;
    let committing = false;
    w.putOther.mockImplementation(async (name, url, response) => {
      if (url.endsWith("__active_release__")) {
        committing = true;
        await new Promise<void>((resolve) => {
          finish = resolve;
        });
      }
      return originalPut(name, url, response);
    });
    const pending = w.update(first.id);
    await vi.waitFor(() => expect(committing).toBe(true));
    await w.dispatch("message", {
      data: { type: "CANCEL_ACTIVATION", id: "request-1" },
      source: { id: first.id },
    });
    expect(first.postMessage.mock.calls.map((call) => call[0].type)).not.toContain("CANCEL_UPDATE");
    finish();
    expect(await pending).toEqual({ ok: true });
    expect(first.postMessage.mock.calls.at(-1)?.[0]).toEqual({
      type: "COMMIT_UPDATE",
      id: "request-1",
    });
  });

  it("bootstraps new UI online after a legacy close while retaining per-client offline assets", async () => {
    const w = worker();
    const old = w.saved.get(w.oldCache)!;
    old.set(`${w.scope}index.html`, new Response("legacy shell"));
    old.set(`${w.scope}icon.svg`, new Response("old icon"));
    const revised = files.map((file) =>
      file.path === "index.html"
        ? { ...file, bytes: `<meta name="course-build-id" content="${BUILD_MARKER}">new UI` }
        : file.path === "icon.svg"
          ? { ...file, bytes: "new icon" }
          : file,
    );
    const published = w.publish(revised);
    const navigation = () => {
      const request = new Request(w.scope);
      Object.defineProperty(request, "mode", { value: "navigate" });
      return request;
    };
    await w.dispatch("activate");
    const online = (await w.dispatch("fetch", {
      request: navigation(),
      resultingClientId: "new-ui",
    })) as Response;
    expect(await online.text()).toContain(published.buildId);
    const freshIcon = (await w.dispatch("fetch", {
      request: new Request(`${w.scope}icon.svg`),
      clientId: "new-ui",
    })) as Response;
    expect(await freshIcon.text()).toBe("new icon");
    w.fetch.mockRejectedValueOnce(new Error("offline"));
    const offline = (await w.dispatch("fetch", {
      request: navigation(),
      resultingClientId: "old-ui",
    })) as Response;
    expect(await offline.text()).toBe("legacy shell");
    w.reboot(revised);
    await w.dispatch("activate");
    const oldIcon = (await w.dispatch("fetch", {
      request: new Request(`${w.scope}icon.svg`),
      clientId: "old-ui",
    })) as Response;
    expect(await oldIcon.text()).toBe("old icon");
  });
  it("hands off a prepared runtime only after claim, then commits the participating clients", async () => {
    const w = worker();
    const first = w.client("first");
    await w.prepare();
    w.registration.waiting = {};
    expect(await w.status()).toMatchObject({
      runtimeVersion: renderRelease(template, files).metadata.buildId,
    });
    expect(await w.update(first.id)).toEqual({ ok: true });
    expect(w.skipWaiting).toHaveBeenCalledOnce();
    expect(first.postMessage.mock.calls.map((call) => call[0].type)).not.toContain("COMMIT_UPDATE");
    w.reboot();
    await w.dispatch("activate");
    expect(w.claim).toHaveBeenCalledOnce();
    expect(first.postMessage.mock.calls.at(-1)?.[0]).toEqual({
      type: "COMMIT_UPDATE",
      id: "request-1",
    });
  });

  it("retains legacy offline fallback and online bootstrap after unsaved work blocks migration", async () => {
    const w = worker();
    w.client("old-unsaved", false);
    w.registration.waiting = {};
    w.saved.get(w.oldCache)!.set(`${w.scope}index.html`, new Response("legacy shell"));
    expect(await w.update("old-unsaved")).toMatchObject({ ok: false, error: "unsaved" });
    w.registration.waiting = null;
    await w.dispatch("activate");
    expect(w.saved.has(w.oldCache)).toBe(true);
    expect(await w.status()).toMatchObject({ ready: false, legacy: true });
    const navigation = () => {
      const request = new Request(w.scope);
      Object.defineProperty(request, "mode", { value: "navigate" });
      return request;
    };
    w.fetch.mockRejectedValueOnce(new Error("offline"));
    const offline = (await w.dispatch("fetch", {
      request: navigation(),
      resultingClientId: "old-offline",
    })) as Response;
    expect(await offline.text()).toBe("legacy shell");
    const next = w.publish(
      files.map((file) =>
        file.path === "index.html"
          ? { ...file, bytes: `<meta name="course-build-id" content="${BUILD_MARKER}">new UI` }
          : file,
      ),
    );
    const online = (await w.dispatch("fetch", {
      request: navigation(),
      resultingClientId: "new-online",
    })) as Response;
    expect(await online.text()).toContain(next.buildId);
    expect(
      (await w.request("DOWNLOAD_OFFLINE", { id: "save-new", release: next })).at(-1),
    ).toMatchObject({ ok: true });
    expect(await w.status()).toMatchObject({ version: next.buildId, ready: true, legacy: false });
  });
  it("keeps the legacy migration escape when its atomic commit cannot be stored", async () => {
    const w = worker();
    w.client("old-saved", true);
    w.registration.waiting = {};
    w.saved.get(w.oldCache)!.set(`${w.scope}index.html`, new Response("legacy shell"));
    await w.status();
    const originalPut = w.putOther.getMockImplementation()!;
    w.putOther.mockImplementation(async (name, url, response) => {
      if (url.endsWith("__active_release__")) throw new Error("quota");
      return originalPut(name, url, response);
    });
    expect(await w.update("old-saved")).toMatchObject({ ok: false });
    w.putOther.mockImplementation(originalPut);
    w.registration.waiting = null;
    w.reboot();
    await w.dispatch("activate");
    expect(await w.status()).toMatchObject({ legacy: true, ready: false });
    expect(w.saved.has(w.oldCache)).toBe(true);
  });
  it("rolls the selected pointer back if waiting runtime activation fails, then retries", async () => {
    const w = worker();
    const first = w.client("first");
    await w.prepare();
    const previous = (await w.status()).version;
    const published = w.publish(
      files.map((file) =>
        file.path === "index.html" ? { ...file, bytes: "<html>B</html>" } : file,
      ),
    );
    await w.request("PREPARE_RELEASE", { id: "stage-B", release: published, persistent: true });
    w.registration.waiting = {};
    w.skipWaiting.mockRejectedValueOnce(new Error("activation failed"));
    expect(await w.update(first.id)).toMatchObject({ ok: false });
    expect(await w.status()).toMatchObject({
      version: previous,
      ready: true,
      pendingPrepared: true,
    });
    expect(first.postMessage.mock.calls.map((call) => call[0].type)).not.toContain("COMMIT_UPDATE");
    expect(await w.update(first.id)).toEqual({ ok: true });
    await w.dispatch("activate");
    expect(await w.status()).toMatchObject({ version: published.buildId, ready: true });
  });
  it("commits an active-runtime request directly even when another runtime is waiting", async () => {
    const w = worker();
    const first = w.client("first");
    await w.prepare();
    w.registration.waiting = {};
    expect(await w.update(first.id, false)).toEqual({ ok: true });
    expect(w.skipWaiting).not.toHaveBeenCalled();
    expect(first.postMessage.mock.calls.at(-1)?.[0]).toEqual({
      type: "COMMIT_UPDATE",
      id: "request-1",
    });
  });
  it("retains selected A after removal under runtime B, allowing B to be prepared again", async () => {
    const w = worker();
    const first = w.client("first");
    await w.prepare();
    const selectedA = (await w.status()).version;
    const revised = files.map((file) =>
      file.path === "index.html" ? { ...file, bytes: "<html>B</html>" } : file,
    );
    const publishedB = w.publish(revised);
    await w.request("PREPARE_RELEASE", { id: "stage-B", release: publishedB, persistent: true });
    w.reboot(revised);
    await w.dispatch("activate");
    expect(await w.status()).toMatchObject({
      version: selectedA,
      runtimeVersion: publishedB.buildId,
      pendingVersion: publishedB.buildId,
      pendingPrepared: true,
    });
    expect(await w.status("REMOVE_OFFLINE")).toEqual({ ok: true });
    expect(await w.status()).toMatchObject({
      version: selectedA,
      runtimeVersion: publishedB.buildId,
      ready: false,
      consent: false,
      pendingVersion: null,
      pendingPrepared: false,
    });
    w.reboot(revised);
    await w.dispatch("activate");
    expect(await w.status()).toMatchObject({
      version: selectedA,
      runtimeVersion: publishedB.buildId,
      ready: false,
    });
    expect(
      (
        await w.request("PREPARE_RELEASE", {
          id: "stage-B-again",
          release: publishedB,
          persistent: false,
        })
      ).at(-1),
    ).toMatchObject({ ok: true });
    expect(await w.status()).toMatchObject({
      version: selectedA,
      pendingVersion: publishedB.buildId,
      pendingPrepared: true,
      ready: false,
      consent: false,
    });
    expect(await w.update(first.id, false)).toEqual({ ok: true });
    expect(await w.status()).toMatchObject({
      version: publishedB.buildId,
      pendingVersion: null,
      pendingPrepared: false,
    });
  });
  it("keeps the existing save when removal cannot preserve its selected metadata", async () => {
    const w = worker();
    await w.prepare();
    const selected = (await w.status()).version;
    const originalPut = w.putOther.getMockImplementation()!;
    w.putOther.mockImplementation(async (name, url, response) => {
      if (url.endsWith("__active_release__")) throw new Error("quota");
      return originalPut(name, url, response);
    });
    expect(await w.status("REMOVE_OFFLINE")).toEqual({ ok: false });
    expect(w.caches.delete).not.toHaveBeenCalled();
    expect(await w.status()).toMatchObject({ version: selected, ready: true, consent: true });
  });
});
