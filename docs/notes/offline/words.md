# Offline footer draft

Separate drafting pass from `brief.md`, the existing shell strings and
`docs/style.md`. These strings assume no technical knowledge. The implementation
must establish each state before showing its text.

| Key | Draft |
| --- | --- |
| `preparing` | Saving the course for offline use. Keep this page open and stay connected until it is ready. |
| `ready` | Ready to use offline in this browser. |
| `unavailable` | The course could not be saved for offline use. Reopen it with an internet connection to try again. |
| `unsupported` | This browser cannot save the course for offline use. You can use it while connected to the internet. |
| `updateWaiting` | An update is ready. Close every Assembly Lab tab or window, then reopen the course to use the update. |
| `limitations` | Links to other websites and the optional “Compare with GCC” feature need an internet connection. |
| `storage` | Clearing this site's browser data removes the saved course. Your browser may also remove it to free space. |

Use `unavailable` for a failed first save; `unsupported` is for a browser that
cannot support saving. A failed update must not report the existing saved course
as unavailable. The limitations and storage note belong with the ready state so
that the short status does not promise every feature or permanent storage.

Both style passes completed: each state says what happened, names the course or
browser where needed, and gives a useful next action. “Compare with GCC” names a
control rather than requiring the reader to know what GCC means. The update text
includes installed app windows as well as browser tabs.
