// Copyright © 2026 Christopher Snow

import { useEffect, useRef, useState } from "react";
import { BUILD_VERSION, commitHref } from "./build-version";
import { RUNNING_BUILD, usePublishedRelease } from "./latest-commit";
import type { useOffline } from "./offline";
import { STRINGS } from "./strings";
import { STATUS_STRINGS as S } from "./strings.status";
import { MaterialSymbol } from "./MaterialSymbol";
import type { Theme } from "./theme";

type Offline = ReturnType<typeof useOffline>;

/** A single course state and primary action; technical identity stays optional. */
export function AppStatus({
  offline,
  theme,
  onThemeChange,
}: {
  offline: Offline;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}) {
  const published = usePublishedRelease();
  const [open, setOpen] = useState(false);
  const [remove, setRemove] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [removeError, setRemoveError] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const pending = offline?.preparedVersion;
  const saving = Boolean(offline?.preparing || offline?.state === "saving");
  const supported = Boolean(offline && offline.state !== "unsupported");
  const currentManifest =
    published.release?.buildId === RUNNING_BUILD ? published.release : undefined;
  const savedCurrent =
    offline?.savedCurrent ?? (offline?.state === "ready" && !offline.runtimeMismatch);
  const olderSaved = offline?.state === "ready" && !savedCurrent;
  const newer = published.state === "available" || Boolean(offline?.runtimeMismatch) || olderSaved;
  const version = saving ? "downloading" : pending ? "ready" : published.state;
  const headerBadge =
    published.state === "available" || pending || olderSaved
      ? "update"
      : !saving && offline?.state === "ready" && savedCurrent
        ? "ready"
        : undefined;
  const headerOfflineState = pending
    ? S.offlineDownloadReady
    : olderSaved
      ? S.offlineCopyOlder
      : S.offlineStates[offline?.state ?? "unsupported"];
  const headerState = `${S.versionStates[version]}. ${headerOfflineState}`;
  const identity = BUILD_VERSION?.sha.slice(0, 7) ?? RUNNING_BUILD?.slice(0, 7) ?? S.unknownBuild;
  const size = published.release?.totalBytes ?? offline?.totalBytes;
  const progress = offline?.preparing ? offline.updateProgress : offline;
  const canSave =
    supported &&
    offline?.totalBytes !== undefined &&
    navigator.onLine &&
    !saving &&
    (Boolean(published.release) || Boolean(offline?.canDownloadSelected));
  const replacementAvailable = Boolean(
    pending &&
    published.release &&
    published.release.buildId !== pending &&
    published.release.buildId !== RUNNING_BUILD,
  );
  const showSave =
    supported &&
    !saving &&
    ((!pending && (offline?.state !== "ready" || newer)) || replacementAvailable);
  const hasSavedCopy = offline?.state === "ready" || offline?.state === "incomplete";
  const reloadAvailable =
    published.state === "available" && !pending && !saving && navigator.onLine;
  const reloadPrimary = reloadAvailable && !hasSavedCopy;
  const primary =
    newer && hasSavedCopy
      ? S.actions.update
      : offline?.state === "incomplete"
        ? S.actions.resume
        : S.actions.download;
  const close = () => {
    dialog.current?.close();
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  };
  useEffect(() => {
    const panel = dialog.current;
    if (!panel) return;
    if (open && !panel.open) panel.showModal();
    else if (!open && panel.open) panel.close();
  }, [open]);
  const openStatus = () => {
    setOpen(true);
    void published.check();
    offline?.refresh();
  };
  const save = () => {
    setRemoved(false);
    const target = published.release;
    if (target && (target.buildId !== RUNNING_BUILD || offline?.runtimeMismatch || olderSaved))
      void offline?.prepare(target);
    else void offline?.download(currentManifest);
  };
  return (
    <>
      <button
        id="app-status-open"
        className="app-status-trigger header-icon-control"
        type="button"
        ref={trigger}
        aria-haspopup="dialog"
        aria-controls="app-status-dialog"
        aria-label={S.headerLabel}
        aria-describedby="app-status-header-state app-status-header-offline"
        title={`${S.headerLabel}: ${headerState}`}
        data-header-badge={headerBadge}
        onClick={openStatus}
      >
        <MaterialSymbol name="cloud_download" />
        {headerBadge === "ready" && (
          <span className="header-offline-badge" aria-hidden="true">
            <MaterialSymbol name="check" />
          </span>
        )}
        {headerBadge === "update" && <span className="header-update-badge" aria-hidden="true" />}
        <span
          id="app-status-header-state"
          className="app-status-header-state header-control-state"
          data-version-status={version}
        >
          {S.versionStates[version]}
        </span>
        <span id="app-status-header-offline" className="header-control-state">
          {headerOfflineState}
        </span>
      </button>
      <dialog
        id="app-status-dialog"
        ref={dialog}
        className="app-status app-status-dialog"
        aria-labelledby="app-status-title"
        onClose={() => {
          setOpen(false);
          trigger.current?.focus({ preventScroll: true });
        }}
      >
        <div className="app-status-heading">
          <h2 id="app-status-title">{S.title}</h2>
          <button type="button" autoFocus onClick={close}>
            {S.close}
          </button>
        </div>
        <div className="app-status-panel">
          <section
            aria-labelledby="course-status-heading"
            data-version={version}
            data-offline={offline?.state ?? "unsupported"}
            data-published-state={published.state}
          >
            <h3 id="course-status-heading">{S.courseHeading}</h3>
            <p className="course-status-main" role="status">
              {S.versionStates[version]}
            </p>
            {pending ? (
              <p>{S.offlineDownloadReady}</p>
            ) : (
              !saving && (
                <p className="course-status-offline" role="status">
                  {olderSaved
                    ? S.offlineCopyOlder
                    : S.offlineStates[offline?.state ?? "unsupported"]}
                </p>
              )
            )}
            {pending ? (
              <p>{S.restartExplanation}</p>
            ) : (
              !saving && (
                <>
                  {olderSaved && <p>{S.olderOfflineExplanation}</p>}
                  {!supported ? (
                    <p>{S.unsupportedExplanation}</p>
                  ) : offline?.state === "incomplete" ? (
                    <p>{S.incompleteExplanation}</p>
                  ) : offline?.state !== "ready" ? (
                    <p>{S.offlineExplanation}</p>
                  ) : null}
                  {newer && hasSavedCopy && <p>{S.updateExplanation}</p>}
                  {reloadAvailable && <p>{S.reloadOnlineExplanation}</p>}
                  {size !== undefined && showSave && (
                    <p className="download-size">{S.bytes(size)}</p>
                  )}
                </>
              )
            )}
            <div className="status-actions">
              {pending && (
                <>
                  <button className="primary" type="button" onClick={offline?.updateNow}>
                    {S.actions.restart}
                  </button>
                  <button type="button" onClick={close}>
                    {S.actions.later}
                  </button>
                </>
              )}
              {reloadAvailable && (
                <button
                  className={reloadPrimary ? "primary" : undefined}
                  type="button"
                  onClick={offline?.reloadOnline}
                >
                  {S.actions.reloadOnline}
                </button>
              )}
              {showSave && (
                <button
                  className={
                    pending || reloadPrimary ? "status-download" : "primary status-download"
                  }
                  type="button"
                  disabled={!canSave}
                  onClick={save}
                >
                  {primary}
                </button>
              )}
              {saving && offline?.canCancel && (
                <button type="button" onClick={offline.cancelDownload}>
                  {S.actions.cancel}
                </button>
              )}
            </div>
            {saving && (
              <div className="course-download-progress">
                <progress
                  aria-label={S.offlineStates.saving}
                  max={progress?.totalBytes || undefined}
                  value={progress?.totalBytes ? progress.completedBytes : undefined}
                />
                <p role="status">
                  {progress?.totalBytes
                    ? S.progress(progress.completedBytes ?? 0, progress.totalBytes)
                    : S.offlineStates.saving}
                </p>
              </div>
            )}
            {offline?.reloadError && <p role="alert">{S.reloadErrors[offline.reloadError]}</p>}
            {offline?.updateError && <p role="alert">{S.updateErrors[offline.updateError]}</p>}
            {offline?.downloadError && <p role="alert">{S.downloadFailed}</p>}
            {offline?.downloadCancelled && !saving && <p role="status">{S.cancelled}</p>}
            {removed && <p role="status">{S.removed}</p>}
          </section>
          <details className="theme-settings">
            <summary>{STRINGS.themeSettings}</summary>
            <label className="theme-picker">
              <span>{STRINGS.theme}</span>
              <select
                value={theme}
                onChange={(event) => onThemeChange(event.target.value as Theme)}
              >
                <option value="auto">{STRINGS.themeAuto}</option>
                <option value="light">{STRINGS.themeLight}</option>
                <option value="dark">{STRINGS.themeDark}</option>
              </select>
            </label>
            <p>{STRINGS.themeSettingsHint}</p>
          </details>
          <details id="app-status-details">
            <summary>{S.detailHeading}</summary>
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
            {size !== undefined && <p>{S.exactBytes(size)}</p>}
            <p>{S.automaticChecks}</p>
            <p>{S.onlineExplanation}</p>
            <p>{S.hashNavigationExplanation}</p>
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
            <p>{S.limits}</p>
            <p>{S.storage}</p>
            {supported &&
              (offline?.state === "ready" || offline?.state === "incomplete") &&
              !remove && (
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
            {remove && (
              <div className="remove-confirmation">
                <p>{S.removeQuestion}</p>
                <p>{S.removeExplanation}</p>
                <div className="status-actions">
                  <button
                    type="button"
                    onClick={() => {
                      void offline
                        ?.remove()
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
                    onClick={() => {
                      setRemove(false);
                      queueMicrotask(() =>
                        dialog.current?.querySelector<HTMLButtonElement>(".status-remove")?.focus(),
                      );
                    }}
                  >
                    {S.actions.keep}
                  </button>
                </div>
              </div>
            )}
            {removeError && <p role="alert">{S.removeFailed}</p>}
          </details>
        </div>
      </dialog>
    </>
  );
}
