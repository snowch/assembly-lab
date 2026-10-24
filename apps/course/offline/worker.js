// Copyright © 2026 Christopher Snow

// The build replaces this expression with the release's files and their integrity hashes.
const embeddedRelease = __OFFLINE_RELEASE__;
const scope = self.registration.scope;
const cachePrefix = `assembly-lab-offline:${encodeURIComponent(scope)}:`;
const settingsName = `assembly-lab-settings:${encodeURIComponent(scope)}`;
const settingsUrl = new URL("__offline_settings__", scope).href;
const activeUrl = new URL("__active_release__", scope).href;
const legacyUrl = new URL("__legacy_bootstrap__", scope).href;
const clientModeUrl = (id) => new URL(`__client_release__/${encodeURIComponent(id)}`, scope).href;
let legacyBootstrap = false;
async function setClientMode(id, value) {
  if (id)
    await (
      await caches.open(settingsName)
    ).put(clientModeUrl(id), new Response(JSON.stringify(value)));
}
async function clientMode(id) {
  if (!id) return null;
  const response = await (await caches.open(settingsName)).match(clientModeUrl(id));
  return response ? response.json() : null;
}
async function finishBootstrap(target = release, commit) {
  // The selected release and migration-complete bit move in one atomic cache write.
  await writeRelease(activeUrl, {
    version: target.version,
    files: target.files,
    totalBytes: target.totalBytes,
    migrationComplete: true,
    ...(commit ? { commit } : {}),
  });
  release = target;
  legacyBootstrap = false;
  servingCacheName = nameFor(target);
}
const pendingUrl = new URL("__pending_release__", scope).href;
const index = new URL("index.html", scope).href;
const releaseUrl = new URL("release.json", scope).href;
let release = embeddedRelease;
let servingCacheName;
const nameFor = (target) => `${cachePrefix}${target.version}`;
const filesFor = (target) =>
  target.files.map((file) => ({ ...file, url: new URL(file.path, scope).href }));
const validRelease = (target) =>
  target &&
  /^[a-f0-9]{64}$/.test(target.version) &&
  Array.isArray(target.files) &&
  target.files.length &&
  target.files.every(
    (file) =>
      typeof file.path === "string" &&
      /^(?!\/)(?!.*(?:\.\.|[?#\\]))[a-zA-Z0-9_./@-]+$/.test(file.path) &&
      !["release.json", "sw.js"].includes(file.path) &&
      Number.isSafeInteger(file.bytes) &&
      file.bytes >= 0 &&
      /^sha256-[A-Za-z0-9+/]{43}=$/.test(file.integrity),
  ) &&
  target.files.some((file) => file.path === "index.html") &&
  new Set(target.files.map((file) => file.path)).size === target.files.length &&
  Number.isSafeInteger(target.totalBytes) &&
  target.totalBytes === target.files.reduce((sum, file) => sum + file.bytes, 0);
async function readRelease(url) {
  const response = await (await caches.open(settingsName)).match(url);
  if (!response) return null;
  const target = await response.json();
  if (!validRelease(target)) throw new Error("Invalid saved release");
  return target;
}
async function writeRelease(url, target) {
  await (await caches.open(settingsName)).put(url, new Response(JSON.stringify(target)));
}
let initialized;
function initialize(force = false) {
  if (force) initialized = undefined;
  if (!initialized)
    initialized = (async () => {
      const saved = await readRelease(activeUrl);
      if (saved) release = saved;
      else {
        for (const name of await caches.keys()) {
          if (
            name.startsWith(cachePrefix) &&
            name !== nameFor(release) &&
            (await (await caches.open(name)).match(index))
          ) {
            await (await caches.open(settingsName)).put(legacyUrl, new Response("true"));
            break;
          }
        }
        await writeRelease(activeUrl, release);
      }
      const legacy = await (await caches.open(settingsName)).match(legacyUrl);
      legacyBootstrap = !saved?.migrationComplete && legacy?.ok && (await legacy.text()) === "true";
    })().catch((error) => {
      initialized = undefined;
      throw error;
    });
  return initialized;
}
async function servingCache() {
  if (!servingCacheName) {
    if (!legacyBootstrap && (await complete())) servingCacheName = nameFor(release);
    else {
      for (const name of await caches.keys()) {
        if (!name.startsWith(cachePrefix) || name === nameFor(release)) continue;
        if (await (await caches.open(name)).match(index)) {
          servingCacheName = name;
          break;
        }
      }
    }
  }
  return caches.open(servingCacheName || nameFor(release));
}

async function verified(response, file) {
  if (!response?.ok) return false;
  const bytes = await response.clone().arrayBuffer();
  if (bytes.byteLength !== file.bytes) return false;
  const hash = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
  return `sha256-${btoa(String.fromCharCode(...hash))}` === file.integrity;
}

async function inspect(target = release) {
  const files = filesFor(target);
  const cache = await caches.open(nameFor(target));
  let completedBytes = 0;
  let found = 0;
  for (const file of files) {
    if (await verified(await cache.match(file.url), file)) {
      completedBytes += file.bytes;
      found++;
    }
  }
  return { prepared: found === files.length, partial: found > 0, completedBytes };
}
const complete = async (target = release) => (await inspect(target)).prepared;
async function consent() {
  const response = await (await caches.open(settingsName)).match(settingsUrl);
  return response?.ok && (await response.text()) === "true";
}
async function status() {
  await initialize();
  const savedPending = await readRelease(pendingUrl);
  const pending = savedPending?.version === release.version ? null : savedPending;
  const pendingPrepared = pending ? await complete(pending) : false;
  const result = await inspect();
  if (servingCacheName === nameFor(release) && !result.prepared) servingCacheName = undefined;
  const persistent = (await consent()) === true;
  return {
    ...result,
    pendingVersion: pending?.version ?? null,
    pendingPrepared,
    ready: result.prepared && persistent && !legacyBootstrap,
    legacy: legacyBootstrap,
    consent: persistent,
    version: release.version,
    runtimeVersion: embeddedRelease.version,
    totalBytes: release.totalBytes,
  };
}

let downloading;
let removal = false;
async function download(job) {
  await initialize();
  const target = job.target ?? release;
  job.adopt = job.adopt && target.version !== release.version;
  if (job.adopt && !legacyBootstrap && (await complete())) throw new Error("restart-required");
  const files = filesFor(target);
  const cacheName = nameFor(target);
  const cache = await caches.open(cacheName);
  if (job.stage) await writeRelease(pendingUrl, target);
  if (job.persistent) {
    await (await caches.open(settingsName)).put(settingsUrl, new Response("true"));
  }
  let completedBytes = 0;
  const progress = () =>
    job.port.postMessage({
      progress: true,
      completedBytes,
      totalBytes: target.totalBytes,
    });
  const previous = (await caches.keys()).filter(
    (name) => name.startsWith(cachePrefix) && name !== cacheName,
  );
  // Resume verified bytes, including unchanged files saved by an older release.
  const pending = [];
  for (const file of files) {
    if (job.controller.signal.aborted || removal) throw new Error("cancelled");
    let response = await cache.match(file.url);
    if (!(await verified(response, file))) {
      response = undefined;
      for (const name of previous) {
        const candidate = await (await caches.open(name)).match(file.url);
        if (await verified(candidate, file)) {
          response = candidate;
          await cache.put(file.url, candidate.clone());
          break;
        }
      }
    }
    if (response && (await verified(response, file))) completedBytes += file.bytes;
    else pending.push(file);
  }
  progress();
  for (const file of pending) {
    if (job.controller.signal.aborted || removal) throw new Error("cancelled");
    const response = await fetch(
      new Request(file.url, {
        cache: "no-store",
        credentials: "same-origin",
        integrity: file.integrity,
        signal: job.controller.signal,
      }),
    );
    if (!(await verified(response, file))) throw new Error("integrity");
    if (job.controller.signal.aborted || removal) throw new Error("cancelled");
    await cache.put(file.url, response);
    completedBytes += file.bytes;
    progress();
  }
  if (job.controller.signal.aborted || removal || !(await complete(target)))
    throw new Error("incomplete");
  if (!job.stage && !job.retainBootstrap) await finishBootstrap(target);
  return {
    ...(await status()),
    ok: true,
    ready: true,
    prepared: true,
    version: target.version,
    completedBytes: target.totalBytes,
    totalBytes: target.totalBytes,
  };
}

// The worker itself is small. Course assets are saved only by an explicit action.
self.addEventListener("install", () => {});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      await initialize(true);
      // An unprepared worker must leave the previous complete copy intact.
      if (!legacyBootstrap && (await complete())) {
        for (const name of await caches.keys()) {
          if (
            name.startsWith(cachePrefix) &&
            name !== nameFor(release) &&
            name !== nameFor((await readRelease(pendingUrl)) || release)
          )
            await caches.delete(name);
        }
      }
      await self.clients.claim();
      const committed = (await readRelease(activeUrl))?.commit;
      if (committed && typeof committed.id === "string" && Array.isArray(committed.clients)) {
        const recipients = await self.clients.matchAll({
          type: "window",
          includeUncontrolled: true,
        });
        for (const client of recipients) {
          if (!committed.clients.includes(client.id) || !client.url.startsWith(scope)) continue;
          try {
            client.postMessage({ type: "COMMIT_UPDATE", id: committed.id });
          } catch {
            /* A closed window needs no reload. */
          }
        }
      }
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  // Release checks are network-only even when an old cached app is still running.
  if (url.origin === new URL(scope).origin && url.pathname === new URL(releaseUrl).pathname) {
    event.respondWith(fetch(new Request(event.request, { cache: "no-store" })));
    return;
  }
  const navigation =
    event.request.mode === "navigate" &&
    url.origin === new URL(scope).origin &&
    (url.pathname === new URL(scope).pathname || url.pathname === new URL(index).pathname);
  const key = navigation ? index : url.href;
  if (!navigation && !url.href.startsWith(scope)) return;
  event.respondWith(
    (async () => {
      try {
        await initialize();
        if (navigation && legacyBootstrap) {
          // One-time escape from an old UI whose worker naturally activated after
          // every window closed. The saved old copy remains the offline fallback.
          try {
            const response = await fetch(new Request(event.request, { cache: "no-store" }));
            if (!response.ok) throw new Error("Navigation unavailable");
            const html = await response.clone().text();
            const buildId =
              html.match(/name=["']course-build-id["'][^>]*content=["']([a-f0-9]{64})["']/)?.[1] ??
              null;
            await setClientMode(event.resultingClientId || event.clientId, {
              mode: "network",
              buildId,
            });
            return response;
          } catch {
            const cache = await servingCache();
            const response = await cache.match(index);
            if (response) {
              await setClientMode(event.resultingClientId || event.clientId, {
                mode: "legacy",
                cache: servingCacheName,
              });
              return response;
            }
          }
        }
        const mode = !navigation ? await clientMode(event.clientId) : null;
        if (mode?.mode === "network" && mode.buildId !== release.version)
          return fetch(event.request);
        if (mode?.mode === "network" && !(await complete())) return fetch(event.request);
        const cache =
          mode?.mode === "legacy" &&
          typeof mode.cache === "string" &&
          mode.cache.startsWith(cachePrefix)
            ? await caches.open(mode.cache)
            : await servingCache();
        const cached = await cache.match(key);
        if (cached) return cached;
      } catch {
        /* Storage eviction must not prevent online use. */
      }
      return fetch(event.request);
    })(),
  );
});

const appClients = async () =>
  (await self.clients.matchAll({ type: "window", includeUncontrolled: true })).filter((client) =>
    client.url.startsWith(scope),
  );

function prepare(client, id, type = "PREPARE_UPDATE") {
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    const finish = (ready) => {
      clearTimeout(timeout);
      channel.port1.close();
      resolve(ready);
    };
    const timeout = setTimeout(() => finish("tabs"), 5000);
    channel.port1.onmessage = (event) => finish(event.data?.ready === true ? null : "unsaved");
    client.postMessage({ type, id }, [channel.port2]);
  });
}

let activation;
function cancelUpdate(request, error) {
  if (request.committed) return;
  request.cancelled = true;
  request.downloadController?.abort();
  for (const client of request.clients)
    client.postMessage({ type: "CANCEL_UPDATE", id: request.id, error });
}

async function activateUpdate(request) {
  let error = "download";
  let previous;
  let previousLegacy;
  let pointerCommitted = false;
  try {
    await initialize();
    previous = await readRelease(activeUrl);
    previousLegacy = legacyBootstrap;
    let target = await readRelease(pendingUrl);
    // The old installed app knows only ACTIVATE_UPDATE on a waiting worker. Its
    // explicit action can prepare the replacement without stranding that old UI.
    const handoff = request.replaceRuntime ?? !!self.registration.waiting;
    const legacy = !target && handoff;
    if (legacy) {
      target = embeddedRelease;
      request.downloadController = new AbortController();
      await download({
        target,
        persistent: true,
        controller: request.downloadController,
        port: { postMessage() {} },
        stage: false,
        retainBootstrap: true,
        adopt: false,
      });
    }
    if (!target || !(await complete(target))) return { ok: false, error: "download" };
    if (request.cancelled) return { ok: false, error: "tabs" };
    request.clients = await appClients();
    let results = await Promise.all(request.clients.map((client) => prepare(client, request.id)));
    error = results.find(Boolean);
    if (error) return { ok: false, error };
    if (request.cancelled) return { ok: false, error: "tabs" };
    // Recheck only after every tab has paused: a slower tab could have edited
    // shared storage after an earlier tab's first acknowledgement.
    results = await Promise.all(
      request.clients.map((client) => prepare(client, request.id, "VERIFY_UPDATE")),
    );
    error = results.find(Boolean);
    if (error) return { ok: false, error };
    if (request.cancelled) return { ok: false, error: "tabs" };
    // A newly opened tab has not acknowledged. Leave the current release in place.
    if (!(await complete(target))) {
      error = "download";
      return { ok: false, error };
    }
    const ids = new Set(request.clients.map((client) => client.id));
    if ((await appClients()).some((client) => !ids.has(client.id))) {
      error = "tabs";
      return { ok: false, error };
    }
    if (request.cancelled) return { ok: false, error: "tabs" };
    // One atomic pointer write chooses the complete release. Preparation alone never
    // changes it, including after every window closes or the browser updates this worker.
    request.committed = true;
    await finishBootstrap(target, {
      id: request.id,
      clients: request.clients.map((client) => client.id),
    });
    pointerCommitted = true;
    if (handoff) {
      await self.skipWaiting();
    } else {
      for (const client of request.clients) {
        try {
          client.postMessage({ type: "COMMIT_UPDATE", id: request.id });
        } catch {
          /* A closed window needs no reload. */
        }
      }
    }
    return { ok: true };
  } catch {
    if (pointerCommitted && previous) {
      try {
        await writeRelease(activeUrl, previous);
        release = previous;
        legacyBootstrap = previousLegacy;
        servingCacheName = undefined;
      } catch {
        error = "changed";
      }
    }
    request.committed = false;
    error ||= "tabs";
    return { ok: false, error };
  } finally {
    if (error || request.cancelled) cancelUpdate(request, error || "tabs");
  }
}

self.addEventListener("message", (event) => {
  const type = event.data?.type;
  if (
    type === "CANCEL_ACTIVATION" &&
    activation &&
    (event.source?.id === activation.owner ||
      activation.clients.some((client) => client.id === event.source?.id)) &&
    event.data.id === activation.id
  ) {
    cancelUpdate(activation, "tabs");
    return;
  }
  if (type === "ACTIVATE_UPDATE" && event.ports[0]) {
    // Reserve the attempt synchronously, so a cancellation cannot overtake validation.
    const source = event.source;
    if (
      !source?.id ||
      !source.url?.startsWith(scope) ||
      typeof event.data.id !== "string" ||
      activation
    ) {
      event.ports[0].postMessage({ ok: false, error: "tabs" });
      return;
    }
    const request = {
      id: event.data.id,
      owner: source.id,
      replaceRuntime:
        typeof event.data.replaceRuntime === "boolean" ? event.data.replaceRuntime : undefined,
      clients: [],
      cancelled: false,
      committed: false,
    };
    activation = request;
    event.waitUntil(
      (async () => {
        try {
          event.ports[0].postMessage(await activateUpdate(request));
        } finally {
          activation = undefined;
        }
      })(),
    );
    return;
  }
  const port = event.ports?.[0];
  if (type === "CANCEL_DOWNLOAD") {
    if (downloading && event.data.id === downloading.id && event.source?.id === downloading.owner) {
      downloading.controller.abort();
    }
    port?.postMessage({ ok: true });
    return;
  }
  if (!port) return;
  const scoped = event.source?.id && event.source.url?.startsWith(scope);
  if (type !== "OFFLINE_STATUS" && !scoped) {
    port.postMessage({ ok: false, error: "scope" });
    return;
  }
  if (type === "REMOVE_OFFLINE") {
    if (activation) {
      port.postMessage({ ok: false, error: "busy" });
      return;
    }
    servingCacheName = undefined;
    removal = true;
    downloading?.controller.abort();
    event.waitUntil(
      (async () => {
        if (downloading) await downloading.done;
        let ok = true;
        try {
          await initialize();
          // Removal clears saved content and consent, not the release selected by
          // the open document. A newer runtime may still be serving an older app.
          // Preserve that selector atomically before deleting any saved files.
          await writeRelease(activeUrl, {
            version: release.version,
            files: release.files,
            totalBytes: release.totalBytes,
            migrationComplete: true,
          });
          const settings = await caches.open(settingsName);
          for (const request of await settings.keys()) {
            if (request.url !== activeUrl) await settings.delete(request);
          }
          for (const name of await caches.keys()) {
            if (name.startsWith(cachePrefix)) await caches.delete(name);
          }
        } catch {
          ok = false;
        } finally {
          initialized = undefined;
          legacyBootstrap = false;
          servingCacheName = undefined;
          removal = false;
        }
        port.postMessage({ ok });
      })(),
    );
    return;
  }
  if (type === "OFFLINE_STATUS") {
    event.waitUntil(
      (async () => {
        try {
          port.postMessage(await status());
        } catch {
          port.postMessage({
            ready: false,
            partial: false,
            consent: false,
            version: release.version,
            runtimeVersion: embeddedRelease.version,
            totalBytes: release.totalBytes,
            error: "storage",
          });
        }
      })(),
    );
    return;
  }
  if (!["DOWNLOAD_OFFLINE", "OFFLINE_REPAIR", "PREPARE_RELEASE"].includes(type)) return;
  if (downloading || removal) {
    port.postMessage({ ok: false, error: "busy" });
    return;
  }
  let target;
  if (type === "PREPARE_RELEASE" || (type === "DOWNLOAD_OFFLINE" && event.data.release)) {
    const value = event.data.release;
    target =
      value && value.schemaVersion === 1
        ? { version: value.buildId, files: value.assets, totalBytes: value.totalBytes }
        : null;
    if (!validRelease(target)) {
      port.postMessage({ ok: false, error: "release" });
      return;
    }
  }
  const job = {
    target,
    stage: type === "PREPARE_RELEASE",
    adopt: type === "DOWNLOAD_OFFLINE" && !!target,
    id: typeof event.data.id === "string" ? event.data.id : "legacy-repair",
    owner: event.source?.id,
    persistent: type !== "PREPARE_RELEASE" || event.data.persistent === true,
    controller: new AbortController(),
    port,
  };
  downloading = job;
  job.done = (async () => {
    try {
      port.postMessage(await download(job));
    } catch {
      let state = {};
      try {
        state = await status();
      } catch {
        /* No completeness claim when storage fails. */
      }
      port.postMessage({
        ...state,
        ok: false,
        error: job.controller.signal.aborted ? "cancelled" : "download",
      });
    } finally {
      if (downloading === job) downloading = undefined;
    }
  })();
  event.waitUntil(job.done);
});
