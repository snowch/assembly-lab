// Copyright © 2026 Christopher Snow

// What the page says before any script runs, what each page calls itself in the browser's tab,
// and the icon and name a browser shows for the course.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { MODULES, PLAN } from "@al/content/plan";

import { pageTitle, parseRoute } from "./route";
import { courseTitle, staticPage } from "./static-page";
import { COMPANION_LINKS, STRINGS } from "./strings";
import { ICONS, MANIFEST_FILE, shortName, webManifest } from "./web-manifest";

const template = readFileSync(resolve(process.cwd(), "apps/course/index.html"), "utf8");
const page = staticPage(template, "/assembly-lab/");
/** The page's text with its tags taken out, as a program that reads it without scripts gets it. */
const text = (html: string) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ");
const noscript = /<noscript>([\s\S]*)<\/noscript>/.exec(page)?.[1] ?? "";

describe("the page before any script runs", () => {
  it("is named as the course is", () => {
    expect(courseTitle(template)).toBe(STRINGS.title);
    expect(page).toContain(`<meta property="og:title" content="${STRINGS.title}" />`);
  });

  it("gives search results and shared links the course's description", () => {
    const description = STRINGS.description.replace(/"/g, "&quot;");
    expect(page).toContain(`<meta name="description" content="${description}" />`);
    expect(page).toContain(`<meta property="og:description" content="${description}" />`);
  });

  it("shows a reader with no scripts the cover and the plan", () => {
    const shown = text(noscript);
    expect(shown).toContain(STRINGS.title);
    expect(shown).toContain(STRINGS.subtitle);
    expect(shown).toContain(STRINGS.intro);
    expect(shown).toContain(STRINGS.statusNote);
    expect(shown).toContain(STRINGS.noScript);
    expect(shown).toContain(STRINGS.copyright);
  });

  it("lists every part, and every module's title, number and line, from the plan's data", () => {
    const shown = text(noscript);
    for (const part of PLAN) expect(shown, part.title).toContain(part.title);
    for (const m of MODULES) {
      expect(shown, m.title).toContain(m.title);
      expect(shown, m.title).toContain(STRINGS.module(m.label));
      expect(shown, m.title).toContain(m.line);
    }
  });

  it("shows each module's status label beside it, from the plan's data", () => {
    const items = noscript.split("<li>").filter((i) => i.startsWith("<strong>"));
    expect(items).toHaveLength(MODULES.length);
    MODULES.forEach((m, i) => {
      expect(text(items[i]!), m.title).toContain(`${m.line} (${STRINGS.status[m.status]})`);
    });
  });

  it("shows the footer: the sentence with its two titles in italics, the three links and the copyright", () => {
    const footer = /<footer[^>]*>([\s\S]*)<\/footer>/.exec(noscript)?.[1] ?? "";
    const sentence = STRINGS.companions.intro.map((p) => (typeof p === "string" ? p : p.title));
    expect(text(footer)).toContain(sentence.join(""));
    expect(footer).toContain(`<em>${STRINGS.companions.digitalDesign}</em>`);
    expect(footer).toContain(`<em>${STRINGS.companions.notes}</em>`);
    for (const [key, href] of Object.entries(COMPANION_LINKS)) {
      const name = STRINGS.companions[key as keyof typeof COMPANION_LINKS];
      expect(footer, key).toContain(`<a href="${href}">${name}</a>`);
    }
    expect(footer).toContain(`aria-label="${STRINGS.companions.label}"`);
    expect(text(footer)).toContain(STRINGS.copyright);
  });

  it("puts the plan in the page's gutter, as the app's main content is", () => {
    expect(noscript).toContain(`<div class="noscript-page">`);
    const css = readFileSync(resolve(process.cwd(), "apps/course/src/styles/app.css"), "utf8");
    expect(css).toMatch(/\.shell-main,\s*\.noscript-page \{[^}]*padding:[^;]*var\(--gutter\)/);
  });

  it("comes after the root the scripts draw into, so a browser that runs them never shows it", () => {
    expect(page.indexOf("<noscript>")).toBeGreaterThan(page.indexOf(`<div id="root">`));
  });

  it("refuses a page with no name", () => {
    expect(() => staticPage("<html><head></head><body></body></html>")).toThrow();
  });
});

describe("a page's name in the browser's tab", () => {
  const none = () => undefined;

  it("is the course's title on the front page, and the page's own name elsewhere", () => {
    expect(pageTitle(parseRoute("#/"), STRINGS.title, none)).toBe(STRINGS.title);
    expect(pageTitle(parseRoute("#/nowhere"), STRINGS.title, none)).toBe(
      STRINGS.pageTitle(STRINGS.missing("/nowhere")),
    );
    expect(pageTitle(parseRoute("#/lesson/first"), STRINGS.title, (id) => `Lesson ${id}`)).toBe(
      STRINGS.pageTitle("Lesson first"),
    );
    expect(pageTitle(parseRoute("#/lesson/first"), STRINGS.title, none)).toBe(
      STRINGS.pageTitle(STRINGS.noLesson("first")),
    );
  });
});

describe("the routes", () => {
  it("know the front page and a lesson's address, and nothing else", () => {
    expect(parseRoute("")).toEqual({ kind: "front" });
    expect(parseRoute("#/")).toEqual({ kind: "front" });
    expect(parseRoute("#/lesson/meet-the-machine")).toEqual({
      kind: "lesson",
      id: "meet-the-machine",
    });
    expect(parseRoute("#/lesson/Bad Id")).toEqual({ kind: "missing", path: "/lesson/Bad Id" });
    expect(parseRoute("#/elsewhere")).toEqual({ kind: "missing", path: "/elsewhere" });
  });
});

describe("the icon and name a browser shows", () => {
  it("names the course, with the same description as the page", () => {
    const manifest = webManifest(STRINGS.title);
    expect(manifest.name).toBe(STRINGS.title);
    expect(manifest.short_name).toBe(shortName(STRINGS.title));
    expect(manifest.description).toBe(STRINGS.description);
  });

  it("links the manifest and the icons under the site's base path", () => {
    expect(page).toContain(`<link rel="manifest" href="/assembly-lab/${MANIFEST_FILE}" />`);
    expect(page).toContain(`href="/assembly-lab/${ICONS.tab}"`);
    expect(page).toContain(`href="/assembly-lab/${ICONS.homeScreen.src}"`);
  });
});
