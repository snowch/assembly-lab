// Copyright © 2026 Christopher Snow

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

export type OfflineState = "preparing" | "ready" | "unavailable" | "unsupported";
export interface OfflineStatus {
  state: OfflineState;
  updateWaiting: boolean;
}
type UpdateError = "unsaved" | "tabs" | "download" | "changed";

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
export function useOffline(canReload: () => boolean, onCancel: () => void) {
  const [status, setStatus] = useState<OfflineStatus | null>(
    import.meta.env.PROD ? { state: "preparing", updateWaiting: false } : null,
  );
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<UpdateError | null>(null);
  const update = useRef(() => {});
  const readiness = useRef(canReload);
  const cancel = useRef(onCancel);
  useLayoutEffect(() => {
    readiness.current = canReload;
    cancel.current = onCancel;
  }, [canReload, onCancel]);
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
    let composing = false;
    let updateChannel: MessageChannel | undefined;
    let updateTimeout: ReturnType<typeof setTimeout> | undefined;
    let participantTimeout: ReturnType<typeof setTimeout> | undefined;
    let unwatchPrepared: (() => void) | undefined;
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
      cancel.current();
      unwatchPrepared?.();
      clearTimeout(participantTimeout);
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
        const worker = preparedWorker;
        const id: string = event.data.id;
        const redundant = () => {
          if (worker.state === "redundant" && preparedWorker === worker && preparedId === id)
            fail("changed", id);
        };
        unwatchPrepared?.();
        worker.addEventListener("statechange", redundant);
        unwatchPrepared = () => worker.removeEventListener("statechange", redundant);
        clearTimeout(participantTimeout);
        participantTimeout = setTimeout(() => {
          // Unlock only after the worker confirms cancellation or becomes redundant.
          try {
            worker.postMessage({ type: "CANCEL_ACTIVATION", id });
          } catch {
            /* Redundant workers cannot accept messages. */
          }
          redundant();
        }, 15000);
        // Commit the interaction lock before acknowledging readiness to the waiting worker.
        flushSync(() => {
          setUpdating(true);
          setUpdateError(null);
        });
        event.ports[0]?.postMessage({ ready: !composing && readiness.current() });
        event.ports[0]?.close();
      } else if (
        event.data?.type === "VERIFY_UPDATE" &&
        event.source === preparedWorker &&
        event.data.id === preparedId
      ) {
        event.ports[0]?.postMessage({ ready: !composing && readiness.current() });
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
    listen(document, "compositionstart", () => {
      composing = true;
    });
    listen(document, "compositionend", () => {
      composing = false;
    });
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
        } catch {
          /* Redundant workers cannot accept messages. */
        }
        if (worker.state === "redundant") fail("changed", id);
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
      clearTimeout(participantTimeout);
      unwatchPrepared?.();
      updateChannel?.port1.close();
      for (const cleanup of cleanups) cleanup();
    };
  }, []);
  return status && { ...status, updating, updateError, updateNow: () => update.current() };
}
