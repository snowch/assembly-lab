<!-- Copyright © 2026 Christopher Snow -->

# Stable CSS across course releases

Pages run45816652496 failed after the copy-only PR176 merge58670c1. Retention rejected assets/index-KLEDHylH.css: the published stylesheet and new build used the same Vite filename but contained different embedded release IDs. The guard correctly refused to replace bytes needed by an older document. The carry-rule correction is merged but remains unpublished until this blocker is fixed.

The offline plugin had rewritten CSS resource URLs after Vite computed filenames. Replace those release-specific URLs with paths relative to each stylesheet. Canonical assets/index.css can reach ../fonts/example.woff2; its immutable releases/ID/assets/index.css copy reaches the same relative path inside that release. Stylesheet bytes then depend on their own contents, rather than unrelated lesson text, source metadata or worker revisions. Query/hash suffixes are preserved outside path normalisation; external and already-relative resources are unchanged.

Use a CSS-only relative-v1 output-name suffix for the one-time transition away from old release-pinned stylesheet bytes. Vite generates references to that filename normally; no JavaScript or HTML reference is renamed after hashing. Retention's verification, collision guard, history limit, worker and platform remain unchanged. This applies equally to source archives without commit metadata.

Regression evidence must cover stable CSS bytes across unrelated release changes, canonical/immutable URL resolution, nested CSS and URL suffixes, external resources, and two retained releases sharing a stylesheet. The existing true-collision test must still reject different bytes at the same URL. A real production build and retention against the currently published old-pinned releases must confirm migration and emitted references. Inspect current and retained pages for font/resource loading, then run full CI and verify the actual live merge. Independent technical review is required. No learner-facing explanation or arithmetic is changed by this repair.

## Verification record

Focused plugin/retention checks passed57 tests. TypeScript, production build, formatting, copyright and platform-copy checks passed. The actual build emits the new CSS filename and its normal Vite-generated HTML reference. A publication dry run retained both currently published old-pinned releases successfully; the initial local attempt failed at transport setup because direct Node HTTPS was refused, and the separate retry used the environment proxy. This is distinct from the production collision failure.

Independent technical checks confirmed two real Vite builds with changed JavaScript and no Git metadata share identical CSS bytes/name/integrity, while their release IDs differ. The reviewer verified all assets in the current and two retained trees, then checked fonts and stylesheet loading in four actual size/theme contexts. The parent staged-site run passed eight size/theme contexts, including the carry-rule emphasis, calculations, saved work/reload, gates and no overflow. The integrity/collision guard tests remain intact. Full exact-head CI, deployment identity and final live evidence are recorded in the repair PR.
