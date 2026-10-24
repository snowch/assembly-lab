// Copyright © 2026 Christopher Snow

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

import { RUNNING_BUILD, type PublishedRelease } from "./latest-commit";
export type OfflineState = "idle" | "saving" | "ready" | "incomplete" | "unsupported";
interface WorkerStatus {
  ready?: boolean;
  prepared?: boolean;
  pendingVersion?: string | null;
  pendingPrepared?: boolean;
  partial?: boolean;
  consent?: boolean;
  version?: string;
  runtimeVersion?: string;
  completedBytes?: number;
  totalBytes?: number;
  ok?: boolean;
  error?: string;
  progress?: boolean;
}
export function workerRequest(
  worker: ServiceWorker,
  type: string,
  payload: Record<string, unknown> = {},
  progress?: (value: WorkerStatus) => void,
): Promise<WorkerStatus> {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel();
    let timeout: ReturnType<typeof setTimeout>;
    const finish = (value?: WorkerStatus) => {
      clearTimeout(timeout);
      channel.port1.close();
      value ? resolve(value) : reject(new Error("Worker did not respond"));
    };
    const reset = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => finish(), 30000);
    };
    reset();
    channel.port1.onmessage = (event) => {
      reset();
      if (event.data?.progress) progress?.(event.data);
      else finish(event.data);
    };
    try {
      worker.postMessage({ type, ...payload }, [channel.port2]);
    } catch {
      finish();
    }
  });
}
export interface OfflineStatus {
  state: OfflineState;
  updateWaiting: boolean;
  runtimeMismatch?: boolean;
  canDownloadSelected?: boolean;
  completedBytes?: number;
  totalBytes?: number;
}
type UpdateError = "unsaved" | "tabs" | "download" | "changed";

/** Ask the controlling release, not a waiting update, whether its files are saved. */
/** Production only: development files must never be held by an offline worker. */
export function useOffline(canReload: () => boolean, onCancel: () => void) {
  const [status, setStatus] = useState<OfflineStatus | null>(
    import.meta.env.PROD ? { state: "idle", updateWaiting: false } : null,
  );
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<UpdateError | null>(null);
  const update = useRef(() => {});
  const access = useRef<{
    download: (release?: PublishedRelease) => Promise<void>;
    prepare: (release: PublishedRelease) => Promise<void>;
    remove: () => Promise<void>;
    cancel: () => void;
    refresh: () => void;
  } | null>(null);
  const [downloadError, setDownloadError] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [canCancel, setCanCancel] = useState(false);
  const [updateProgress, setUpdateProgress] = useState<{
    completedBytes?: number;
    totalBytes?: number;
  }>({});
  const [preparedVersion, setPreparedVersion] = useState<string | null>(null);
  const preparedRelease = useRef(preparedVersion);
  preparedRelease.current = preparedVersion;
  const statusReady = useRef(false);
  statusReady.current = status?.state === "ready";
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
    let transfer: { worker: ServiceWorker; id: string } | null = null;
    const refresh = async () => {
      const current = ++generation;
      const controller = registration?.active ?? null;
      const snapshot = controller
        ? await workerRequest(controller, "OFFLINE_STATUS").catch(() => null)
        : null;
      const ready = snapshot?.ready === true;
      if (disposed || current !== generation || transfer) return;
      setStatus({
        state:
          (controller && !snapshot) || snapshot?.error === "storage"
            ? "unsupported"
            : ready
              ? "ready"
              : (snapshot?.partial && !snapshot.prepared) || snapshot?.consent
                ? "incomplete"
                : "idle",
        completedBytes: snapshot?.completedBytes,
        totalBytes: snapshot?.totalBytes,
        updateWaiting: registration?.waiting != null,
        runtimeMismatch:
          !!controller &&
          !!snapshot &&
          (!snapshot.version || (!!RUNNING_BUILD && snapshot.runtimeVersion !== RUNNING_BUILD)),
        canDownloadSelected:
          !!RUNNING_BUILD &&
          snapshot?.version === RUNNING_BUILD &&
          snapshot?.runtimeVersion === RUNNING_BUILD,
      });
      setPreparedVersion(snapshot?.pendingPrepared ? (snapshot.pendingVersion ?? null) : null);
    };
    const watchInstall = () => {
      const worker = registration?.installing;
      if (worker) listen(worker, "statechange", () => void refresh());
      void refresh();
    };
    const register = async () => {
      try {
        const base = new URL(import.meta.env.BASE_URL, location.href);
        registration = await navigator.serviceWorker.getRegistration(base.href);
        if (registration?.scope !== base.href) registration = undefined;
        registration ??= await navigator.serviceWorker.register(new URL("sw.js", base), {
          scope: base.pathname,
          updateViaCache: "none",
        });
        if (disposed) return;
        listen(registration, "updatefound", watchInstall);
        watchInstall();
      } catch {
        // An existing controlling copy can still work if registration checks fail.
        if (registration?.active) void refresh();
        else setStatus({ state: "unsupported", updateWaiting: false });
      }
    };
    const transferFiles = async (
      worker: ServiceWorker,
      type: string,
      payload: Record<string, unknown>,
    ) => {
      const id = crypto.randomUUID();
      transfer = { worker, id };
      setCanCancel(true);
      setDownloadError(false);
      try {
        const result = await workerRequest(worker, type, { ...payload, id }, (value) => {
          if (type === "PREPARE_RELEASE")
            setUpdateProgress({
              completedBytes: value.completedBytes,
              totalBytes: value.totalBytes,
            });
          if (type === "DOWNLOAD_OFFLINE")
            setStatus(
              (previous) =>
                previous && {
                  ...previous,
                  state: "saving",
                  completedBytes: value.completedBytes,
                  totalBytes: value.totalBytes,
                },
            );
        });
        if (!result.ok) throw new Error("Download incomplete");
        return result;
      } finally {
        if (transfer?.id === id) {
          transfer = null;
          setCanCancel(false);
        }
      }
    };
    access.current = {
      refresh: () => void refresh(),
      cancel: () => {
        if (transfer)
          void workerRequest(transfer.worker, "CANCEL_DOWNLOAD", { id: transfer.id }).catch(
            () => {},
          );
      },
      download: async (release) => {
        if (!registration) await register();
        const worker = registration?.active;
        if (!worker) return;
        setStatus((previous) => previous && { ...previous, state: "saving" });
        try {
          if (!release) {
            const selected = await workerRequest(worker, "OFFLINE_STATUS");
            if (
              !RUNNING_BUILD ||
              selected.version !== RUNNING_BUILD ||
              selected.runtimeVersion !== RUNNING_BUILD
            )
              throw new Error("Selected release does not match this document");
          }
          await transferFiles(worker, "DOWNLOAD_OFFLINE", { release });
        } catch {
          setDownloadError(true);
        } finally {
          await refresh();
        }
      },
      prepare: async (release) => {
        if (!registration) await register();
        if (!registration) return;
        setPreparing(true);
        setUpdateProgress({});
        setUpdateError(null);
        try {
          await registration.update();
          const worker = await new Promise<ServiceWorker>((resolve, reject) => {
            const deadline = Date.now() + 10000;
            const inspect = async () => {
              const worker = registration?.waiting ?? registration?.active;
              const snapshot = worker
                ? await workerRequest(worker, "OFFLINE_STATUS").catch(() => null)
                : null;
              if (worker && snapshot?.runtimeVersion === release.buildId) return resolve(worker);
              if (Date.now() > deadline) return reject(new Error("Published runtime changed"));
              setTimeout(() => void inspect(), 100);
            };
            void inspect();
          });
          const result = await transferFiles(worker, "PREPARE_RELEASE", {
            persistent: statusReady.current,
            release,
          });
          if (!result.ok) throw new Error("Incomplete update");
          setPreparedVersion(release.buildId);
        } catch {
          setUpdateError("download");
        } finally {
          setPreparing(false);
          await refresh();
        }
      },
      remove: async () => {
        if (transfer)
          await workerRequest(transfer.worker, "CANCEL_DOWNLOAD", { id: transfer.id }).catch(
            () => {},
          );
        const worker = registration?.active;
        if (worker) {
          const snapshot = await workerRequest(worker, "OFFLINE_STATUS");
          if (!snapshot.version) {
            // Old workers only implement {ready}; unregister before removing their cache.
            await registration?.unregister();
            const base = new URL(import.meta.env.BASE_URL, location.href).href;
            const prefix = `assembly-lab-offline:${encodeURIComponent(base)}:`;
            for (const name of await caches.keys())
              if (
                name.startsWith(prefix) ||
                name === `assembly-lab-settings:${encodeURIComponent(base)}`
              )
                await caches.delete(name);
            registration = undefined;
          } else {
            const result = await workerRequest(worker, "REMOVE_OFFLINE");
            if (!result.ok) throw new Error("Removal failed");
          }
        }
        await refresh();
      },
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
        (event.source === registration?.active || event.source === registration?.waiting) &&
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
        event.data?.type === "COMMIT_UPDATE" &&
        event.source === preparedWorker &&
        event.data.id === preparedId &&
        !reloading
      ) {
        reloading = true;
        location.reload();
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
    update.current = async () => {
      const worker = registration?.waiting ?? registration?.active;
      if (!worker || preparedWorker) return;
      setUpdating(true);
      setUpdateError(null);
      try {
        const snapshot = await workerRequest(worker, "OFFLINE_STATUS");
        if (!preparedRelease.current || snapshot.runtimeVersion !== preparedRelease.current) {
          setUpdating(false);
          setUpdateError("changed");
          setPreparedVersion(null);
          return;
        }
      } catch {
        setUpdating(false);
        setUpdateError("tabs");
        return;
      }
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
          void refresh();
        }
      };
      try {
        worker.postMessage(
          { type: "ACTIVATE_UPDATE", id, replaceRuntime: worker === registration?.waiting },
          [channel.port2],
        );
      } catch {
        fail("tabs", id);
      }
    };
    listen(navigator.serviceWorker, "controllerchange", () => void refresh());
    listen(window, "focus", () => void refresh());
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
      access.current = null;
      clearTimeout(updateTimeout);
      clearTimeout(participantTimeout);
      unwatchPrepared?.();
      updateChannel?.port1.close();
      for (const cleanup of cleanups) cleanup();
    };
  }, []);
  return (
    status && {
      ...status,
      updating,
      updateError,
      updateNow: () => update.current(),
      preparing,
      canCancel,
      updateProgress,
      preparedVersion,
      downloadError,
      download: (release?: PublishedRelease) => access.current?.download(release),
      prepare: (release: PublishedRelease) => access.current?.prepare(release),
      remove: () => access.current?.remove(),
      cancelDownload: () => access.current?.cancel(),
      refresh: () => access.current?.refresh(),
    }
  );
}
