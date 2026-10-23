// Copyright © 2026 Christopher Snow

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

export type OfflineState = "preparing" | "ready" | "unavailable" | "unsupported";
export interface OfflineStatus {
  state: OfflineState;
  updateWaiting: boolean;
}
type UpdateError = "unsaved" | "tabs" | "download";

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
export function useOffline(canReload: () => boolean) {
  const [status, setStatus] = useState<OfflineStatus | null>(
    import.meta.env.PROD ? { state: "preparing", updateWaiting: false } : null,
  );
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<UpdateError | null>(null);
  const update = useRef(() => {});
  useEffect(() => {
    if (!import.meta.env.PROD) return;
    if (!navigator.serviceWorker || !window.isSecureContext) {
      setStatus({ state: "unsupported", updateWaiting: false });
      return;
    }
    let disposed = false;
    let generation = 0;
    let registration: ServiceWorkerRegistration | undefined;
    let preparedWorker: ServiceWorker | null = null;
    let preparedId: string | null = null;
    let controlled = !!navigator.serviceWorker.controller;
    let reloading = false;
    let updateChannel: MessageChannel | undefined;
    let updateTimeout: ReturnType<typeof setTimeout> | undefined;
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
    const fail = (error: UpdateError, id: string) => {
      if (preparedId && preparedId !== id) return;
      preparedWorker = null;
      preparedId = null;
      setUpdating(false);
      setUpdateError(error);
      clearTimeout(updateTimeout);
      updateChannel?.port1.close();
    };
    const message = (event: MessageEvent) => {
      if (
        event.data?.type === "PREPARE_UPDATE" &&
        event.source === registration?.waiting &&
        typeof event.data.id === "string"
      ) {
        preparedWorker = event.source as ServiceWorker;
        preparedId = event.data.id;
        // Commit the interaction lock before acknowledging readiness to the waiting worker.
        flushSync(() => {
          setUpdating(true);
          setUpdateError(null);
        });
        event.ports[0]?.postMessage({ ready: canReload() });
        event.ports[0]?.close();
      } else if (
        event.data?.type === "CANCEL_UPDATE" &&
        event.source === preparedWorker &&
        event.data.id === preparedId
      ) {
        fail(
          event.data.error === "unsaved" || event.data.error === "download"
            ? event.data.error
            : "tabs",
          event.data.id,
        );
      }
    };
    navigator.serviceWorker.addEventListener("message", message);
    cleanups.push(() => navigator.serviceWorker.removeEventListener("message", message));
    update.current = () => {
      const worker = registration?.waiting;
      if (!worker || preparedWorker) return;
      setUpdating(true);
      setUpdateError(null);
      const id = crypto.randomUUID();
      const channel = new MessageChannel();
      updateChannel = channel;
      updateTimeout = setTimeout(() => {
        try {
          worker.postMessage({ type: "CANCEL_ACTIVATION", id });
        } finally {
          fail("tabs", id);
        }
      }, 15000);
      channel.port1.onmessage = (event: MessageEvent<{ ok: boolean; error?: UpdateError }>) => {
        if (updateChannel !== channel) return;
        clearTimeout(updateTimeout);
        channel.port1.close();
        if (!event.data.ok) {
          fail(event.data.error ?? "tabs", id);
          void registration?.update().catch(() => {});
        }
      };
      try {
        worker.postMessage({ type: "ACTIVATE_UPDATE", id }, [channel.port2]);
      } catch {
        fail("tabs", id);
      }
    };
    listen(navigator.serviceWorker, "controllerchange", () => {
      if (controlled && !reloading) {
        reloading = true;
        location.reload();
      } else {
        controlled = !!navigator.serviceWorker.controller;
        void refresh();
      }
    });
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
      update.current = () => {};
      clearTimeout(updateTimeout);
      updateChannel?.port1.close();
      for (const cleanup of cleanups) cleanup();
    };
  }, [canReload]);
  return status && { ...status, updating, updateError, updateNow: () => update.current() };
}
