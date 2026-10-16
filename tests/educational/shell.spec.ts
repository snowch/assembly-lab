// Copyright © 2026 Christopher Snow

// The built site, driven in a browser at desktop and phone widths, under the course's base path:
// the front page lists the plan, nothing logs an error, the theme control works and its choice
// persists, text is legible, controls are reachable on a phone, nothing scrolls sideways, the
// footer's links go where they should, and prose keeps its measure. There are no screenshot
// baselines: they would be made on a different machine from CI's.

import { expect, test, type Page } from "@playwright/test";

import { MODULES, PLAN } from "@al/content/plan";

import { COMPANION_LINKS, STRINGS } from "../../apps/course/src/strings";

const THEME_KEY = "assembly-lab:v1:theme";

/** Everything the page logs as an error, or throws, until the test ends. */
function watchErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console: ${m.text()}`);
  });
  page.on("pageerror", (e) => errors.push(`page: ${e.message}`));
  return errors;
}

/** Waits for the typefaces the site ships: until they arrive, text is drawn in a fallback face. */
async function ready(page: Page): Promise<void> {
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
}

test("the front page lists the plan, every part and every module", async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto("#/");
  await ready(page);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(STRINGS.title);
  await expect(page.locator(".cover-subtitle")).toHaveText(STRINGS.subtitle);
  await expect(page.locator(".cover-intro")).toHaveText(STRINGS.intro);
  await expect(page.locator(".plan-status")).toHaveText(STRINGS.statusNote);
  await expect(page.locator("section.plan-part > h2")).toHaveText(PLAN.map((p) => p.title));
  await expect(page.locator(".plan-module")).toHaveCount(MODULES.length);
  for (const m of MODULES) {
    const item = page.locator(`.plan-module[data-module="${m.id}"]`);
    await expect(item.locator("h3")).toContainText(m.title);
    await expect(item.locator("h3")).toContainText(STRINGS.module(m.label));
    await expect(item.locator(".module-line")).toHaveText(m.line);
    await expect(item.locator(".module-status")).toHaveText(STRINGS.status[m.status]);
  }
  expect(errors).toEqual([]);
});

test("the tab is named for the page, and the course has an address for a lesson", async ({
  page,
}) => {
  const errors = watchErrors(page);
  await page.goto("#/");
  await expect(page).toHaveTitle(STRINGS.title);
  await page.goto("#/lesson/meet-the-machine");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    STRINGS.noLesson("meet-the-machine"),
  );
  await expect(page).toHaveTitle(STRINGS.pageTitle(STRINGS.noLesson("meet-the-machine")));
  await page.goto("#/nowhere");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(STRINGS.missing("/nowhere"));
  await page.getByRole("link", { name: STRINGS.backToPlan }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(STRINGS.title);
  expect(errors).toEqual([]);
});

test("the theme control cycles through its choices, and the choice survives a reload", async ({
  page,
}) => {
  const errors = watchErrors(page);
  await page.goto("#/");
  await ready(page);
  const picker = page.getByLabel(STRINGS.theme);
  const html = page.locator("html");
  await expect(picker).toHaveValue("auto");
  await expect(html).not.toHaveAttribute("data-theme", /.*/);

  const choices = [
    ["dark", STRINGS.themeDark],
    ["light", STRINGS.themeLight],
    ["auto", STRINGS.themeAuto],
  ] as const;
  for (const [value, label] of choices) {
    await picker.selectOption({ label });
    await expect(picker).toHaveValue(value);
    if (value === "auto") await expect(html).not.toHaveAttribute("data-theme", /.*/);
    else await expect(html).toHaveAttribute("data-theme", value);
    // The choice is kept under the course's own key; "auto" keeps nothing.
    const kept = await page.evaluate((k) => localStorage.getItem(k), THEME_KEY);
    expect(kept).toBe(value === "auto" ? null : value);
    await page.reload();
    await ready(page);
    await expect(picker).toHaveValue(value);
    if (value !== "auto") await expect(html).toHaveAttribute("data-theme", value);
  }

  // The page's colours change with the theme: its ground in each is the token's.
  await picker.selectOption({ label: STRINGS.themeDark });
  const ground = (theme: string) =>
    page.evaluate(() => getComputedStyle(document.body).backgroundColor).then((c) => [theme, c]);
  const dark = await ground("dark");
  await picker.selectOption({ label: STRINGS.themeLight });
  const light = await ground("light");
  expect(dark[1]).not.toBe(light[1]);
  expect(errors).toEqual([]);
});

test("every learner state key the course writes starts assembly-lab:v1:", async ({ page }) => {
  await page.goto("#/");
  await ready(page);
  await page.getByLabel(STRINGS.theme).selectOption({ label: STRINGS.themeDark });
  const keys = await page.evaluate(() => Object.keys(localStorage));
  expect(keys.length).toBeGreaterThan(0);
  for (const k of keys) expect(k.startsWith("assembly-lab:v1:"), k).toBe(true);
});

test("no visible text is under 11 pixels, and no control is under 40 pixels tall on a phone", async ({
  page,
}, info) => {
  await page.goto("#/");
  await ready(page);
  const problems = await page.evaluate((isPhone) => {
    const out: string[] = [];
    const visible = (el: Element) => {
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    };
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const seen = new Set<Element>();
    let node: Node | null;
    while ((node = walker.nextNode())) {
      const el = node.parentElement;
      if (!el || !(node.textContent ?? "").trim() || seen.has(el)) continue;
      seen.add(el);
      if (!visible(el)) continue;
      const px = parseFloat(getComputedStyle(el).fontSize);
      if (px < 11)
        out.push(`text ${px.toFixed(1)}px: "${(node.textContent ?? "").trim().slice(0, 30)}"`);
    }
    if (isPhone)
      for (const c of document.querySelectorAll("a, button, select, input, textarea, summary")) {
        if (!visible(c)) continue;
        const r = c.getBoundingClientRect();
        if (r.height < 40)
          out.push(
            `control ${Math.round(r.height)}px tall: "${(c.textContent ?? "").trim().slice(0, 30)}"`,
          );
      }
    return out;
  }, info.project.name === "phone");
  expect(problems).toEqual([]);
});

test("the page does not scroll sideways", async ({ page }) => {
  await page.goto("#/");
  await ready(page);
  const [scroll, width] = await page.evaluate(
    () => [document.documentElement.scrollWidth, document.documentElement.clientWidth] as const,
  );
  expect(scroll).toBeLessThanOrEqual(width);
});

test("prose keeps its measure: no line of about 85 characters or more", async ({ page }) => {
  await page.goto("#/");
  await ready(page);
  const long = await page.evaluate(() => {
    const out: string[] = [];
    for (const p of document.querySelectorAll("main p")) {
      const r = p.getBoundingClientRect();
      if (r.width === 0) continue;
      // A character of this face is about half its size wide, as the lesson aesthetics test of
      // Digital Design measures it.
      const chars = r.width / (parseFloat(getComputedStyle(p).fontSize) * 0.5);
      if (chars > 85)
        out.push(
          `line of ${Math.round(chars)} characters: "${(p.textContent ?? "").slice(0, 30)}"`,
        );
    }
    return out;
  });
  expect(long).toEqual([]);
});

test("the footer carries the copyright and links to the companion courses", async ({ page }) => {
  await page.goto("#/");
  await ready(page);
  const footer = page.locator("footer.shell-footer");
  await expect(footer.locator(".copyright")).toHaveText(STRINGS.copyright);
  const links = footer.getByRole("link");
  await expect(links).toHaveCount(3);
  await expect(
    footer.getByRole("link", { name: STRINGS.companions.digitalDesign }),
  ).toHaveAttribute("href", COMPANION_LINKS.digitalDesign);
  await expect(footer.getByRole("link", { name: STRINGS.companions.notes })).toHaveAttribute(
    "href",
    COMPANION_LINKS.notes,
  );
  await expect(footer.getByRole("link", { name: STRINGS.companions.hub })).toHaveAttribute(
    "href",
    COMPANION_LINKS.hub,
  );
  // The copyright is in the footer of a page that is not the front page too.
  await page.goto("#/nowhere");
  await expect(page.locator("footer.shell-footer .copyright")).toHaveText(STRINGS.copyright);
});

test("every icon the page names loads from the course's own path", async ({ page, baseURL }) => {
  await page.goto("#/");
  const hrefs = await page
    .locator('link[rel~="icon"], link[rel="apple-touch-icon"], link[rel="manifest"]')
    .evaluateAll((all) => all.map((l) => (l as HTMLLinkElement).href));
  expect(hrefs).toHaveLength(4);
  for (const href of hrefs) {
    expect(href.startsWith(baseURL ?? ""), href).toBe(true);
    expect((await page.request.get(href)).status(), href).toBe(200);
  }
});

test("the skip link stays off the page until the keyboard reaches it", async ({ page }) => {
  await page.goto("#/");
  await ready(page);
  const skip = page.locator("a.skip-link");
  await expect(skip).not.toBeInViewport();
  await page.keyboard.press("Tab");
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
});
