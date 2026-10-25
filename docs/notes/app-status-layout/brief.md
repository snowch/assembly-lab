# App status layout and indicators

User evidence: 2537.png shows the status panel extending beyond the left edge at an intermediate viewport. The user wants clear update/offline indications and explicitly wants commit/build/date removed from the button when the indicators are present.

Checked facts:

- AppStatus currently has independent published-version and offline-inventory states. Checking a release does not save the app. A complete offline inventory is the only source of offline ready; preparation alone must not claim a saved offline copy.
- The button currently displays a commit, build and version state, but omits the offline state. Detailed source/build/date are already inside the disclosure and the footer also retains source identity.
- The panel is absolutely positioned relative to the status button, aligned to its right edge, with a fixed maximum width. At intermediate widths the button's right edge can be less than the panel width, moving its left edge offscreen. The <=640px rule does not cover the supplied case.
- Anchor the panel to the full header, constrain both its width and scrolling height to available viewport space, and retain keyboard dismissal/focus. Verify intermediate widths, short landscapes, actual light/dark themes, static/pre-hydration entry and larger text.
- The compact control should contain its App status title and two independent readable state indicators. Preserve current/available/preparing/ready/error/checking/offline distinctions; use text as well as colour. Keep source/build/date inside the panel.
- Current offline guidance always tells a mismatched runtime to select Update, even when preparation has finished and only Restart is available. Make that guidance valid throughout preparation and waiting to restart.
- Keep downloaded bytes, update/restart decisions, cancellation, saved-work guards and storage verification unchanged. Do not add automatic updates or automatic offline downloads.

Copy requirements: short compact labels for idle/saving/ready/incomplete/unsupported offline states, existing version labels may be reused. Use docs/style.md. Draft separately; independently review the built interface and actual state transitions.
