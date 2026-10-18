// Copyright © 2026 Christopher Snow

// The build replaces this expression with the release's files and their integrity hashes.
const release = __OFFLINE_RELEASE__;
const scope = self.registration.scope;
const cachePrefix = `assembly-lab-offline:${encodeURIComponent(scope)}:`;
const cacheName = `${cachePrefix}${release.version}`;
const files = release.files.map((file) => ({
  ...file,
  url: new URL(file.path, scope).href,
}));
const assets = new Set(files.map((file) => file.url));
const index = new URL("index.html", scope).href;

async function complete(cache) {
  const responses = await Promise.all(files.map((file) => cache.match(file.url)));
  return responses.every((response) => response?.ok);
}

let repairing;
function repair() {
  if (!repairing) {
    repairing = (async () => {
      const cache = await caches.open(cacheName);
      if (await complete(cache)) return;
      // addAll commits the batch only after every download succeeds. Integrity also
      // rejects files from a different release during a deployment or a stale CDN response.
      // A failed repair leaves any remaining valid entries untouched.
      await cache.addAll(
        files.map(
          (file) =>
            new Request(file.url, {
              cache: "reload",
              credentials: "same-origin",
              integrity: file.integrity,
            }),
        ),
      );
    })().finally(() => {
      repairing = undefined;
    });
  }
  return repairing;
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      try {
        await repair();
      } catch (error) {
        // This cache belongs to this release. A previously active release stays intact.
        await caches.delete(cacheName).catch(() => false);
        throw error;
      }
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((name) => name.startsWith(cachePrefix) && name !== cacheName)
          .map((name) => caches.delete(name)),
      );
      // Updates reach this point only when the old worker no longer has any clients.
      // Claim also lets the first online visit report readiness without a reload.
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  // Query parameters on an app navigation do not change the hash-routed app shell.
  // Everything else must match a known asset exactly, including its query string.
  const navigation =
    event.request.mode === "navigate" &&
    url.origin === new URL(scope).origin &&
    (url.pathname === new URL(scope).pathname || url.pathname === new URL(index).pathname);
  const key = navigation ? index : url.href;
  if (!navigation && !assets.has(key)) return;
  event.respondWith(
    (async () => {
      try {
        const cache = await caches.open(cacheName);
        const cached = await cache.match(key);
        if (cached) return cached;
      } catch {
        // Storage can be unavailable or evicted. The online app still works.
      }
      // Do not add unverified network responses to this immutable release cache.
      return fetch(event.request);
    })(),
  );
});

self.addEventListener("message", (event) => {
  const type = event.data?.type;
  if ((type !== "OFFLINE_STATUS" && type !== "OFFLINE_REPAIR") || !event.ports[0]) return;
  event.waitUntil(
    (async () => {
      let ready = false;
      try {
        if (type === "OFFLINE_REPAIR") await repair();
        ready = await complete(await caches.open(cacheName));
      } catch {
        // A readiness check must not promise availability when storage cannot be read.
      }
      event.ports[0].postMessage({ ready });
    })(),
  );
});
