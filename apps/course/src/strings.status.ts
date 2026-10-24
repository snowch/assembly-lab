// Copyright © 2026 Christopher Snow

// Separate draft from checked facts: docs/notes/app-status/brief.md and copy.md.
export const STATUS_STRINGS = {
  title: "App status",
  versionHeading: "Version",
  offlineHeading: "Offline access",
  versionStates: {
    checking: "Checking for updates",
    current: "Up to date",
    available: "Update available",
    downloading: "Downloading update",
    ready: "Update ready",
    offline: "Cannot check for updates",
    error: "Couldn’t check for updates",
  },
  offlineStates: {
    idle: "Not saved for offline use",
    saving: "Saving for offline use",
    ready: "Available offline",
    incomplete: "Offline download incomplete",
    unsupported: "Offline access unavailable",
  },
  actions: {
    check: "Check for updates",
    retry: "Retry",
    update: "Update",
    restart: "Restart to update",
    later: "Later",
    download: "Download for offline use",
    resume: "Resume download",
    cancel: "Cancel download",
    remove: "Remove offline copy",
    confirmRemove: "Remove offline copy",
    keep: "Keep offline copy",
  },
  running: "Running version",
  build: "Build",
  unknownBuild: "Source version unavailable",
  source: "View source commit",
  committed: "Committed",
  restartExplanation:
    "Restart reloads all open Assembly Lab tabs and app windows. Your saved work, theme and current lesson are kept.",
  restarting:
    "Checking saved work in all open Assembly Lab tabs and app windows before restarting.",
  offlineRequiresUpdate:
    "Select Update, then Restart to update. You can then select Download for offline use to save the course.",
  offlineExplanation:
    "Save the whole course, including its browser tools and example downloads. You can then reopen it in this browser without an internet connection.",
  incompleteExplanation:
    "Some files are not saved yet. Resume the download when you are connected to the internet.",
  unsupportedExplanation:
    "This browser cannot save the course for offline use. You can still use it while connected to the internet.",
  limits:
    "Other websites and Compare with GCC need an internet connection. Running the native examples needs tools installed outside this browser.",
  storage:
    "Your browser may remove saved files to free space. App status checks that the complete course is still saved.",
  removeQuestion: "Remove this browser’s offline copy of Assembly Lab?",
  removeExplanation:
    "This removes the saved app files. Your answers, exercise edits, achievements and theme stay. Other apps’ saved files stay too.",
  removed: "The offline copy has been removed. Your work is kept.",
  removeFailed:
    "Some offline files could not be removed. Your work is kept. Try removing the offline copy again.",
  noScript: "App status checks and offline downloads need JavaScript.",
  updateFailed:
    "The update could not be prepared. Your current version is still available. Try again while online.",
  downloadFailed: "The download stopped. Files already saved can be used when you resume.",
  cancelled: "Download cancelled. You can resume it later.",
  updateErrors: {
    unsaved:
      "Restart is paused because a tab has unsaved work, unfinished input or an operation still running. Finish or save your work, then retry.",
    tabs: "Another Assembly Lab tab did not respond. Check your work in the other tabs, close them, then retry.",
    download:
      "The prepared update is incomplete. Reconnect to the internet, then prepare the update again.",
    changed:
      "A newer update arrived. You can keep working. Check for updates, then prepare the latest version.",
  },
  bytes: (value: number) => `${value.toLocaleString("en-GB")} bytes`,
  progress: (completed: number, total: number) =>
    `${completed.toLocaleString("en-GB")} of ${total.toLocaleString("en-GB")} bytes saved`,
} as const;
