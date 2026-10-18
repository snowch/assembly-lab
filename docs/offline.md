# Offline operation

Copyright © 2026 Christopher Snow.

The production app saves its complete release on the first successful online visit.
The footer reports readiness after the controlling service worker confirms that all
required files are present. Lessons, recorded listings, exercise grading, the assembler,
simulator and small C compiler work without a connection. The optional Compiler Explorer
comparison and links to other websites require internet access.

## Build and cache

`apps/course/offline/plugin.ts` emits `sw.js` after Vite has emitted the HTML, JavaScript,
CSS, manifest and fonts. It also includes the icons from `public/`. Source maps and the
worker itself are excluded. No runtime dependency or third-party cache service is used.
The plugin supports an absolute base path ending in `/`, including `/` and the deployed
`/assembly-lab/`. The worker derives its URLs from its registration scope.

Each asset has a SHA-256 integrity value. The release identifier covers those values,
file names and the worker source. Installation fetches the complete release with
integrity checking, bypassing the HTTP cache. Cache API `addAll` commits the batch only
when all downloads succeed. A failed or mixed deployment cannot replace the old cache.

The worker serves known assets from its release cache. It serves the saved `index.html`
for navigation to the app root or `index.html`, including query strings; lesson routes
are in the URL fragment. It leaves unknown paths, other sites and non-GET requests to
the network. A missing cached asset falls back to the network without adding an
unverified response to the release cache.

## Updates and recovery

A newly installed release waits until all tabs and installed windows controlled by the
previous worker close. There is no forced reload or `skipWaiting`. The footer explains
when an update is waiting. On activation, cleanup deletes only older caches with this
app's exact registration scope. Other courses on the same origin keep their caches.

The client asks the controlling worker about readiness through a MessageChannel.
`OFFLINE_STATUS` checks that every required response exists. `OFFLINE_REPAIR` first
tries to restore an incomplete cache using the same atomic, integrity-checked download.
The app checks on registration, controller changes, connection changes and return to
the tab. A failed update check does not hide a usable installed release.

Browsers can evict cached files, and clearing site data removes them. Clearing site data
also removes locally saved exercise work and theme choices. Cache replacement itself
does not change local storage. A cleared cache requires another online visit; an old
release whose unhashed files have changed on the server cannot be repaired from a
different release. Closing the old tabs allows a successfully downloaded update to take
over. Offline availability is not a permanent backup.

Service workers require HTTPS or localhost. Registration is enabled only in production
builds. Browsers without support retain the online app and show that offline saving is
unavailable. A development server does not register a worker; use a separate origin or
port from a production preview to avoid an already registered worker on that origin.

## Verification

`npm run build` produces the offline release. `npm run preview` serves it on localhost.
Open the app while connected, wait for the footer's ready message, then disconnect and
reopen a lesson. A first-ever offline visit cannot download the app.

The automated browser checks in `tests/educational/offline.spec.ts` exercise offline
navigation through every lesson with the HTTP cache disabled, local compilation and
grading, saved work after reopening, cache loss/repair and unsupported browsers.
`offline-lifecycle.spec.ts` uses a temporary server to test successive deployments and
failed downloads. Build and worker unit tests live beside the plugin. These checks are
part of the normal `npm run check` suite.
