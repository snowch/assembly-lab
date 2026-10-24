// Copyright © 2026 Christopher Snow

// What the page says before any script runs: to a search engine, to the preview of a shared link,
// to a program that reads the page without running it, and to a reader whose browser runs no
// scripts. The build writes the cover's own words into index.html (vite.config.ts): the
// description a search result shows, what a shared link's preview shows, and, for a page that
// runs no script, the cover itself, the course plan and the footer, listed from the same data the
// front page lists (content/plan/plan.ts), so they say what the front page says and cannot drift.
// The head
// also names the course's icon, for a tab and a phone's home screen, and the manifest a browser
// installs the course from (web-manifest.ts), each under the site's base path.

import { LESSONS } from "@al/content";
import { PLAN, statusOf } from "@al/content/plan";

import { STATUS_STRINGS as S } from "./strings.status";
import { COMPANION_LINKS, STRINGS } from "./strings";
import { commitHref, type BuildVersion } from "./build-version";
import { BACKGROUND, ICONS, MANIFEST_FILE, shortName } from "./web-manifest";

const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** The course's name, as index.html's title gives it. */
export function courseTitle(html: string): string {
  const title = /<title>([^<]*)<\/title>/.exec(html)?.[1];
  if (!title) throw new Error("index.html has no <title>, so the page has no name to give.");
  return title;
}

/**
 * index.html with the cover's words written in, its title kept as the course's name, and its icons
 * and manifest named under `base`, the path the site is served from.
 */
export function staticPage(html: string, base = "/", version: BuildVersion | null = null): string {
  const title = courseTitle(html);
  const description = escape(STRINGS.description);
  const head = [
    `<meta name="description" content="${description}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escape(title)}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<link rel="icon" href="${base}${ICONS.tabPng.src}" sizes="32x32" type="image/png" />`,
    `<link rel="icon" href="${base}${ICONS.tab}" type="image/svg+xml" />`,
    `<link rel="apple-touch-icon" href="${base}${ICONS.homeScreen.src}" />`,
    `<link rel="manifest" href="${base}${MANIFEST_FILE}" />`,
    `<meta name="apple-mobile-web-app-title" content="${escape(shortName(title))}" />`,
    `<meta name="theme-color" content="${BACKGROUND.light}" media="(prefers-color-scheme: light)" />`,
    `<meta name="theme-color" content="${BACKGROUND.dark}" media="(prefers-color-scheme: dark)" />`,
  ];
  const plan = PLAN.map((part) => {
    const modules = part.modules.map(
      (m) =>
        `<li><strong>${escape(m.title)}</strong> (${escape(STRINGS.module(m.label))}): ` +
        `${escape(m.line)} (${escape(STRINGS.status[statusOf(m, LESSONS)])})</li>`,
    );
    return `<h2>${escape(part.title)}</h2>\n    <ul>${modules.join("")}</ul>`;
  });
  const intro = STRINGS.companions.intro.map((part) =>
    typeof part === "string" ? escape(part) : `<em>${escape(part.title)}</em>`,
  );
  const link = (href: string, name: string) => `<li><a href="${href}">${escape(name)}</a></li>`;
  // The footer the app draws, with the classes the stylesheet gives it, so the two look alike.
  const footer = [
    `<footer class="shell-footer">`,
    `<p class="footer-intro">${intro.join("")}</p>`,
    `<nav aria-label="${escape(STRINGS.companions.label)}">`,
    `<ul class="footer-links">`,
    link(COMPANION_LINKS.digitalDesign, STRINGS.companions.digitalDesign),
    link(COMPANION_LINKS.notes, STRINGS.companions.notes),
    link(COMPANION_LINKS.hub, STRINGS.companions.hub),
    `</ul>`,
    `</nav>`,
    `<p class="copyright">${escape(STRINGS.copyright)}</p>`,
    ...(version
      ? [
          `<p class="build-version">${escape(STRINGS.version.commit)} <a href="${escape(commitHref(version.sha))}">${escape(version.sha.slice(0, 7))}</a> · ${escape(STRINGS.version.committed)} <time datetime="${escape(version.committedAt)}">${escape(version.committedAt.slice(0, 10))}</time> ${escape(STRINGS.version.utc)}</p>`,
        ]
      : []),
    `</footer>`,
  ];
  // The stylesheet is linked from the head, so it applies without scripts: the page gets the
  // app's gutter and width from the same classes.
  const initialHeader = `<header class="shell-header"><strong>${escape(title)}</strong><details class="app-status"><summary>${escape(S.title)} · ${version ? escape(version.sha.slice(0, 7)) : escape(S.unknownBuild)}</summary><div class="app-status-panel"><h2>${escape(S.versionHeading)}</h2><p>${escape(S.running)}: ${version ? `<a href="${escape(commitHref(version.sha))}">${escape(version.sha.slice(0, 7))}</a>` : escape(S.unknownBuild)}</p><h2>${escape(S.offlineHeading)}</h2><p>${escape(S.noScript)}</p></div></details></header>`;
  const noScript = [
    "<noscript>",
    `<div class="noscript-page">`,
    `<h1>${escape(title)}</h1>`,
    `<p><strong>${escape(STRINGS.subtitle)}</strong></p>`,
    `<p>${escape(STRINGS.intro)}</p>`,
    `<p>${escape(STRINGS.statusNote)}</p>`,
    ...plan,
    `<p>${escape(STRINGS.noScript)}</p>`,
    `</div>`,
    ...footer,
    "</noscript>",
  ];
  return html
    .replace("</title>", `</title>${head.map((t) => `\n    ${t}`).join("")}`)
    .replace(
      `<div id="root"></div>`,
      `<div id="root">${initialHeader}</div>\n    ${noScript.join("\n    ")}`,
    );
}
