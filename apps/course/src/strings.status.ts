// Copyright © 2026 Christopher Snow

// Separate draft from checked facts: docs/notes/shared-course-style/status-copy.md.
const megabytes = (value: number) =>
  (value / 1_000_000).toLocaleString("en-GB", { maximumFractionDigits: 2 });

export const STATUS_STRINGS = {
  title: "App status",
  courseHeading: "Course status",
  detailHeading: "Version and download details",
  close: "Close",
  versionHeading: "Version",
  offlineHeading: "Offline copy",
  versionStates: {
    checking: "Checking for updates",
    current: "Up to date online",
    available: "New version available",
    downloading: "Updating offline copy",
    ready: "Ready to restart",
    offline: "Update status unknown while offline",
    error: "Couldn’t check for updates",
  },
  offlineCopyOlder: "Offline copy is older",
  readyOnline: "Ready online",
  offlineStates: {
    idle: "Not saved for offline use",
    saving: "Saving for offline use",
    ready: "Downloaded and ready to use offline",
    incomplete: "Offline copy incomplete",
    unsupported: "Offline access unavailable",
  },
  compactOfflineStates: {
    idle: "Not saved offline",
    saving: "Saving offline copy",
    ready: "Saved offline",
    incomplete: "Offline copy incomplete",
    unsupported: "Offline unavailable",
  },
  actions: {
    check: "Check for updates",
    retry: "Retry",
    update: "Update offline copy",
    reloadOnline: "Reload latest course",
    restart: "Restart to update",
    later: "Later",
    download: "Save offline copy",
    resume: "Resume download",
    cancel: "Cancel download",
    remove: "Remove offline copy",
    confirmRemove: "Remove offline copy",
    keep: "Keep offline copy",
    close: "Close",
  },
  running: "Running version",
  build: "Build",
  unknownBuild: "Source version unavailable",
  source: "View source commit",
  committed: "Committed",
  automaticChecks:
    "Small update checks happen automatically while you are online. These checks do not download the course.",
  onlineExplanation:
    "Opening or reloading online loads the current published version without saving the complete course offline. Your existing offline copy stays as it is.",
  hashNavigationExplanation: "Moving between lessons in this tab keeps the version already open.",
  reloadOnlineExplanation:
    "Reload latest course loads the latest version in this tab. Your saved work, current page, view and theme are kept. Other tabs and your offline copy stay as they are.",
  reloadErrors: {
    offline: "Connect to the internet, then choose Reload latest course. This tab has stayed open.",
    unsaved:
      "This tab has stayed open because your work is not ready to reload. Finish typing or running operations, then save your work and resolve any saving problems before retrying.",
  },
  olderOfflineExplanation:
    "Your saved copy is an older version. You can still use that copy offline until you choose to update it.",
  freshnessUnknown: "We could not check for a newer published version.",
  updateExplanation:
    "Update offline copy downloads the complete course. When the download finishes, choose Restart to update.",
  offlineDownloadReady:
    "The complete course has been downloaded and checked. Restart to update will open the new version.",
  restartExplanation:
    "Restart checks your work in every open Arm Assembly Lab tab and app window, then reloads them. Your saved work, theme and current page are kept.",
  restarting:
    "Checking saved work in all open Arm Assembly Lab tabs and app windows before restarting.",
  offlineRequiresUpdate: "Update offline copy to save the current course in this browser.",
  offlineExplanation:
    "Save the whole course, including its browser tools and example downloads. You can then reopen it in this browser without an internet connection.",
  incompleteExplanation:
    "Some files are not saved yet. Resume download keeps the files already checked and downloads the rest.",
  unsupportedExplanation:
    "This browser cannot save the course for offline use. You can still use it while connected to the internet.",
  limits:
    "External documentation and the optional Compare with GCC need an internet connection. Running native examples needs separate tools outside this browser.",
  storage:
    "Your browser may remove saved files to free space. App status checks that the complete course is still saved.",
  removeQuestion: "Remove this browser’s offline copy of Arm Assembly Lab?",
  removeExplanation:
    "This removes this course’s downloads. Your drafts, answers, lesson completion and preferences stay. Other apps’ downloads stay too.",
  removed: "The offline copy has been removed. Your work is kept.",
  removeFailed:
    "Some offline files could not be removed. Your work is kept. Try removing the offline copy again.",
  noScript: "App status checks and offline downloads need JavaScript.",
  updateFailed:
    "The update stopped. You can resume while online. Files already checked and any complete offline copy are kept.",
  downloadFailed:
    "The download stopped. Resume download keeps the files already checked. Any complete offline copy you saved is kept.",
  cancelled:
    "Download cancelled. You can resume it later. Any complete offline copy you saved is kept.",
  updateErrors: {
    unsaved:
      "Restart is paused. A tab has unsaved or conflicting work, unfinished input or an operation still running. Finish or save your work, then retry.",
    tabs: "Another Arm Assembly Lab tab did not respond. Check your work in the other tabs, close them, then retry.",
    download:
      "The update download is incomplete. Reconnect to the internet, then choose Update offline copy to resume.",
    changed:
      "A newer version is available. You can keep working. Check for updates, then choose Update offline copy.",
  },
  bytes: (value: number) => `${megabytes(value)} MB`,
  exactBytes: (value: number) => `${value.toLocaleString("en-GB")} bytes`,
  progress: (completed: number, total: number) =>
    `${megabytes(completed)} of ${megabytes(total)} MB saved`,
} as const;
