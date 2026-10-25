// Copyright © 2026 Christopher Snow

import { useEffect, useRef, useState } from "react";
import { BUILD_VERSION, commitHref } from "./build-version";
import { RUNNING_BUILD, usePublishedRelease } from "./latest-commit";
import type { useOffline } from "./offline";
import { STRINGS } from "./strings";
import { STATUS_STRINGS as S } from "./strings.status";

type Offline = ReturnType<typeof useOffline>;
export function AppStatus({ offline }: { offline: Offline }) {
  const published = usePublishedRelease();
  const [remove, setRemove] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [removeError, setRemoveError] = useState(false);
  const downloadButton = useRef<HTMLButtonElement>(null);
  const details = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const element = details.current;
    const header = element?.closest("header");
    if (!element || !header) return;
    const resize = () => {
      const viewport = window.visualViewport;
      const bottom = (viewport?.height ?? innerHeight) + (viewport?.offsetTop ?? 0);
      const available = Math.max(0, bottom - header.getBoundingClientRect().bottom - 8);
      element.style.setProperty("--status-panel-space", `${available}px`);
    };
    resize();
    const observer = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(resize);
    observer?.observe(header);
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", resize, { passive: true });
    window.visualViewport?.addEventListener("resize", resize);
    window.visualViewport?.addEventListener("scroll", resize);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", resize);
      window.visualViewport?.removeEventListener("resize", resize);
      window.visualViewport?.removeEventListener("scroll", resize);
    };
  }, []);
  useEffect(() => {
    if (removed) downloadButton.current?.focus();
  }, [removed]);
  const [open, setOpen] = useState(false);
  const pending = offline?.preparedVersion;
  const currentManifest =
    published.release?.buildId === RUNNING_BUILD ? published.release : undefined;
  const version = offline?.preparing
    ? "downloading"
    : pending
      ? "ready"
      : offline?.runtimeMismatch
        ? "available"
        : published.state;
  const identity = BUILD_VERSION?.sha.slice(0, 7) ?? RUNNING_BUILD?.slice(0, 7) ?? S.unknownBuild;
  return (
    <>
      <span className="status-announcement" role="status" aria-live="polite">
        {!open
          ? `${S.title}: ${S.versionStates[version]}. ${S.offlineStates[offline?.state ?? "unsupported"]}`
          : ""}
      </span>
      <details
        ref={details}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.currentTarget.open = false;
            event.currentTarget.querySelector("summary")?.focus();
          }
        }}
        className="app-status"
        onToggle={(event) => {
          setOpen(event.currentTarget.open);
          if (event.currentTarget.open) {
            void published.check();
            offline?.refresh();
          }
        }}
      >
        <summary>
          <span className="app-status-title">
            {S.title}{" "}
            <span className="status-chevron" aria-hidden="true">
              ▾
            </span>
          </span>
          <span className="app-status-compact">
            <span className="status-indicator" data-version-status={version}>
              {S.versionStates[version]}
            </span>
            <span
              className="status-indicator"
              data-offline-status={offline?.state ?? "unsupported"}
            >
              {S.compactOfflineStates[offline?.state ?? "unsupported"]}
            </span>
          </span>
        </summary>
        <div className="app-status-panel">
          <section aria-labelledby="app-version-heading" data-version={version}>
            <h2 id="app-version-heading">{S.versionHeading}</h2>
            <p>
              {S.running}:{" "}
              {BUILD_VERSION ? (
                <a className="running-version" href={commitHref(BUILD_VERSION.sha)}>
                  {identity}
                </a>
              ) : (
                identity
              )}
            </p>
            {RUNNING_BUILD && (
              <p className="running-build">
                {S.build}: <code>{RUNNING_BUILD.slice(0, 12)}</code>
              </p>
            )}
            {BUILD_VERSION && (
              <p>
                {S.committed}{" "}
                <time dateTime={BUILD_VERSION.committedAt}>
                  {BUILD_VERSION.committedAt.slice(0, 10)}
                </time>{" "}
                {STRINGS.version.utc}
              </p>
            )}
            <p role="status" aria-live="polite">
              {S.versionStates[version]}
            </p>
            <div className="status-actions">
              <button
                type="button"
                onClick={() => {
                  void published.check();
                  offline?.refresh();
                }}
                disabled={published.state === "checking"}
              >
                {published.state === "error" ? S.actions.retry : S.actions.check}
              </button>
              {published.release &&
                (published.release.buildId !== RUNNING_BUILD || offline?.runtimeMismatch) &&
                (!pending || pending !== published.release.buildId) && (
                  <button
                    type="button"
                    disabled={
                      offline?.preparing ||
                      !offline ||
                      offline.state === "unsupported" ||
                      !navigator.onLine
                    }
                    onClick={() => void offline?.prepare(published.release!)}
                  >
                    {S.actions.update}
                  </button>
                )}
              {offline?.preparing && offline.canCancel && (
                <button type="button" onClick={offline.cancelDownload}>
                  {S.actions.cancel}
                </button>
              )}
            </div>
            {offline?.preparing && (
              <>
                <progress
                  aria-label={S.versionStates.downloading}
                  max={offline.updateProgress.totalBytes || undefined}
                  value={
                    offline.updateProgress.totalBytes
                      ? offline.updateProgress.completedBytes
                      : undefined
                  }
                />
                {offline.updateProgress.totalBytes && (
                  <p>
                    {S.progress(
                      offline.updateProgress.completedBytes ?? 0,
                      offline.updateProgress.totalBytes,
                    )}
                  </p>
                )}
              </>
            )}
            {pending && (
              <>
                <p>{S.restartExplanation}</p>
                <div className="status-actions">
                  <button type="button" onClick={offline.updateNow}>
                    {S.actions.restart}
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      const details = event.currentTarget.closest("details");
                      details?.removeAttribute("open");
                      details?.querySelector("summary")?.focus();
                    }}
                  >
                    {S.actions.later}
                  </button>
                </div>
              </>
            )}
            {offline?.updateError && <p role="alert">{S.updateErrors[offline.updateError]}</p>}
          </section>
          <section
            aria-labelledby="app-offline-heading"
            data-offline={offline?.state ?? "unsupported"}
          >
            <h2 id="app-offline-heading">{S.offlineHeading}</h2>
            <p role="status" aria-live="polite">
              {S.offlineStates[offline?.state ?? "unsupported"]}
            </p>
            <p>
              {offline?.state === "unsupported" || !offline
                ? S.unsupportedExplanation
                : S.offlineExplanation}
            </p>
            {offline && offline.state !== "unsupported" && (
              <>
                {(offline.totalBytes ?? published.release?.totalBytes) !== undefined && (
                  <p className="download-size">
                    {S.bytes(offline.totalBytes ?? published.release!.totalBytes)}
                  </p>
                )}
                {offline.runtimeMismatch && <p>{S.offlineRequiresUpdate}</p>}
                {offline.state === "incomplete" && <p>{S.incompleteExplanation}</p>}
                {offline.state === "saving" ? (
                  <>
                    <progress
                      aria-label={S.offlineStates.saving}
                      max={offline.totalBytes || undefined}
                      value={offline.totalBytes ? offline.completedBytes : undefined}
                    />
                    <p>
                      {offline.totalBytes
                        ? S.progress(offline.completedBytes ?? 0, offline.totalBytes)
                        : S.offlineStates.saving}
                    </p>
                    <button type="button" onClick={offline.cancelDownload}>
                      {S.actions.cancel}
                    </button>
                  </>
                ) : (
                  <div className="status-actions">
                    {offline.state !== "ready" && (
                      <button
                        type="button"
                        ref={downloadButton}
                        className="status-download"
                        disabled={
                          !navigator.onLine ||
                          offline.preparing ||
                          (!currentManifest && !offline.canDownloadSelected) ||
                          offline.runtimeMismatch ||
                          offline.totalBytes === undefined
                        }
                        onClick={() => {
                          setRemoved(false);
                          void offline.download(currentManifest);
                        }}
                      >
                        {offline.state === "incomplete" ? S.actions.resume : S.actions.download}
                      </button>
                    )}
                    {(offline.state === "ready" || offline.state === "incomplete") && !remove && (
                      <button
                        className="status-remove"
                        type="button"
                        onClick={() => {
                          setRemoveError(false);
                          setRemove(true);
                        }}
                      >
                        {S.actions.remove}
                      </button>
                    )}
                  </div>
                )}
                {offline.downloadError && <p role="alert">{S.downloadFailed}</p>}
                {remove && (
                  <div className="remove-confirmation">
                    <p>{S.removeQuestion}</p>
                    <p>{S.removeExplanation}</p>
                    <div className="status-actions">
                      <button
                        type="button"
                        onClick={() => {
                          void offline
                            .remove()
                            ?.then(() => {
                              setRemove(false);
                              setRemoved(true);
                            })
                            .catch(() => setRemoveError(true));
                        }}
                      >
                        {S.actions.confirmRemove}
                      </button>
                      <button
                        type="button"
                        autoFocus
                        onClick={() => {
                          setRemove(false);
                          queueMicrotask(() =>
                            document
                              .querySelector<HTMLButtonElement>(".app-status .status-remove")
                              ?.focus(),
                          );
                        }}
                      >
                        {S.actions.keep}
                      </button>
                    </div>
                  </div>
                )}
                {removeError && <p role="alert">{S.removeFailed}</p>}
                {removed && <p role="status">{S.removed}</p>}
              </>
            )}
            <p>{S.limits}</p>
            <p>{S.storage}</p>
          </section>
        </div>
      </details>
    </>
  );
}
