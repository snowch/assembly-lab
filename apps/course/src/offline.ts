// Copyright © 2026 Christopher Snow

import { useEffect, useState } from "react";

export type OfflineState = "preparing" | "ready" | "unavailable" | "unsupported";
export interface OfflineStatus {
  state: OfflineState;
  updateWaiting: boolean;
}

/** Ask the controlling release, not a waiting update, whether its files are saved. */
function saved(worker: ServiceWorker): Promise<boolean> {
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    const finish = (ready: boolean) => {
      clearTimeout(timeout);
      channel.port1.close();
      resolve(ready);
    };
    const timeout = window.setTimeout(() => finish(false), 30_000);
    channel.port1.onmessage = (event: MessageEvent<{ ready?: boolean }>) =>
      finish(event.data?.ready === true);
    try {
      worker.postMessage({ type: navigator.onLine ? "OFFLINE_REPAIR" : "OFFLINE_STATUS" }, [
        channel.port2,
      ]);
    } catch {
      finish(false);
    }
  });
}

/** Production only: development files must never be held by an offline worker. */
export function useOffline(): OfflineStatus | null {
  const [status, setStatus] = useState<OfflineStatus | null>(
    import.meta.env.PROD ? { state: "preparing", updateWaiting: false } : null,
  );
  useEffect(() => {
    if (!import.meta.env.PROD) return;
    if (!navigator.serviceWorker || !window.isSecureContext) {
      setStatus({ state: "unsupported", updateWaiting: false });
      return;
    }
    let disposed = false;
    let generation = 0;
    let registration: ServiceWorkerRegistration | undefined;
    const cleanups: (() => void)[] = [];
    const listen = (target: EventTarget, event: string, fn: () => void) => {
      target.addEventListener(event, fn);
      cleanups.push(() => target.removeEventListener(event, fn));
    };
    const refresh = async () => {
      const current = ++generation;
      const controller = navigator.serviceWorker.controller;
      const ready = controller ? await saved(controller) : false;
      if (disposed || current !== generation) return;
      setStatus({
        state: ready ? "ready" : registration?.installing ? "preparing" : "unavailable",
        updateWaiting: registration?.waiting != null,
      });
    };
    const watchInstall = () => {
      const worker = registration?.installing;
      if (worker) listen(worker, "statechange", () => void refresh());
      void refresh();
    };
    const register = async () => {
      try {
        const base = new URL(import.meta.env.BASE_URL, location.href);
        registration = await navigator.serviceWorker.register(new URL("sw.js", base), {
          scope: base.pathname,
          updateViaCache: "none",
        });
        if (disposed) return;
        listen(registration, "updatefound", watchInstall);
        watchInstall();
      } catch {
        // An offline update check can fail while the installed release still works.
        void refresh();
      }
    };
    listen(navigator.serviceWorker, "controllerchange", () => void refresh());
    listen(window, "online", () => {
      if (!registration) void register();
      else void refresh();
    });
    listen(window, "offline", () => void refresh());
    listen(document, "visibilitychange", () => {
      if (document.visibilityState === "visible") void refresh();
    });
    void register();
    return () => {
      disposed = true;
      for (const cleanup of cleanups) cleanup();
    };
  }, []);
  return status;
}
