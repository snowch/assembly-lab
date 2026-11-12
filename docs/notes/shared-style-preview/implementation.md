# Shared appearance experiment

Historical record of the private comparison build approved on 12 November 2026.
The promotion removes its toolbar, build flag, saved appearance preference and
preview-only commands. The normal course build now uses the approved appearance;
use `npm run build` and `npm run check`. See `promotion-brief.md` for the current scope.

`npm run build:style-preview` builds the real course at the origin root with the exact build flag `VITE_STYLE_PREVIEW=1`, then copies it to the ignored `.style-preview-build/` directory. That immutable copy can be reviewed while the normal check script builds into `apps/course/dist` independently. Run `npm run test:style-preview` against the preview copy; the separate config uses an available local port (`AL_STYLE_PORT`, default 4441), and listens on IPv4 for the origin-isolation test. `node scripts/style-preview-report.mjs` makes the screenshot comparison index.

The switch changes root CSS attributes and shared shell presentation. Both appearances keep the same mounted lesson and interactive components, their keys, model state, graders and stores. Query selection is supported only in a preview build; normal builds retain their current appearance even if a saved preference or URL requests New. Desktop/mobile outlines use the lesson's actual sections; the flags page uses its seven-stage metadata. Native selection closes the mobile disclosure, focuses the heading and preserves the SPA route.

The comparison controls reserve a 60px strip above the app. This is experimental chrome, not a proposed extra product header. The compact app header sits below it. A 156px target scroll margin leaves room for both. The focused skip link appears above them. Screenshot comparisons omit this extra chrome so the actual course appearances can be compared.

The preview's private Site identity is in `.openai/hosting.json`. The live course remains a GitHub Pages deployment from main. The preview branch is for review and must not be treated as approval to promote the experiment. A distinct Site origin gives the browser its own storage and service-worker scope without changing course persistence code.

Calculator scratch and transient simulator steps retain the existing ordinary-reload behaviour. The style switch must preserve them in the mounted page; saved exercise answers, notes and grades retain their normal reload behaviour. A preview does not add new persistence rules.

See `recovery.md` for historical interrupted/failed commands, and the independent current-build review files for their observed scope and limits. Complete test and publication results will be recorded in the draft PR and handoff.
