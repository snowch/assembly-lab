# Compact lesson completion and hexadecimal digit notation

The user selected option A from the completion-control mockups: a compact teal button, vertically
centred between the previous/next lesson cards, using the normal button height. The user also
requested code styling for the digit symbols 0 and 9 in the hexadecimal explanation.

Checked facts and scope:

- `.button` already supplies a 2.75rem minimum height (44px at the default root size). The
  completion wrapper stretched with the navigation cards and its child stretched to fill it.
  Centre that wrapper and button, and remove the custom 48px minimum. Retain text, action,
  state colours, circle/check icon, stable width, responsive stacking and storage behaviour.
- A minimum height allows the button to grow if the learner enlarges text; do not fix a
  height that could clip the label. Both completion states must remain comfortably touchable.
- The hexadecimal paragraph describes digit symbols, with letters and bit patterns already
  styled as code. Apply the same markup to its 0 and 9 and synchronise the canonical record.
  No wording or mathematical claim changes; existing hexadecimal facts tests remain relevant.
- No platform, model, exercise or storage changes. Preserve unrelated Pi source notes.

Independent learner and technical reviewers inspect the actual built site at 375/1280 in
light/dark and tablet/intermediate widths around the navigation breakpoint, including checked,
unchecked, reload and undo. Check normal button-height comparison, vertical centring, touch
targets, focus, wrapping, long lesson titles and the rendered digit code elements. Keep initial
failures separate from successful focused reruns. Do not commit until final reviews are ready.
