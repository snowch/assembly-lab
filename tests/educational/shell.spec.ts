// Copyright © 2026 Christopher Snow

// The built site, driven in a browser at desktop and phone widths, under the course's base path:
// the front page lists the plan, nothing logs an error, the theme control works and its choice
// persists, text is legible, controls are reachable on a phone, nothing scrolls sideways, the
// footer's links go where they should, and prose keeps its measure. There are no screenshot
// baselines: they would be made on a different machine from CI's.

import { expect, test, type Page } from "@playwright/test";
import { execFileSync } from "node:child_process";

import { LESSONS, WHERE_NEXT } from "@al/content";
import { MODULES, PLAN, lessonsOf, statusOf } from "@al/content/plan";

import { VIEW_STRINGS } from "../../packages/views/src/strings";

import { COMPANION_LINKS, STRINGS } from "../../apps/course/src/strings";

const THEME_KEY = "assembly-lab:v1:theme";
const sourceSha = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
const sourceDate = new Date(
  execFileSync("git", ["show", "-s", "--format=%cI", "HEAD"], { encoding: "utf8" }).trim(),
).toISOString();

async function expectSourceVersion(page: Page) {
  const version = page.locator("footer.shell-footer .build-version");
  await expect(version.getByRole("link")).toHaveText(sourceSha.slice(0, 7));
  await expect(version.getByRole("link")).toHaveAttribute(
    "href",
    `https://github.com/snowch/assembly-lab/commit/${sourceSha}`,
  );
  await expect(version.locator("time")).toHaveAttribute("datetime", sourceDate);
  await expect(version.locator("time")).toHaveText(sourceDate.slice(0, 10));
}

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
  await expect(page.locator(".cover-help")).toHaveText(STRINGS.cover.help);
  await expect(page.locator(".plan-status")).toHaveCount(0);
  await expect(page.locator("section.plan-part > h2")).toHaveText(PLAN.map((p) => p.title));
  await expect(page.locator(".plan-module")).toHaveCount(MODULES.length);
  for (const m of MODULES) {
    const item = page.locator(`.plan-module[data-module="${m.id}"]`);
    await expect(item.locator("h3")).toContainText(m.title);
    await expect(item.locator("h3")).toContainText(STRINGS.module(m.label));
    await expect(item.locator(".module-line")).toHaveText(m.line);
    // The status is worked out from the lessons: a module with a lesson is published.
    const status = statusOf(m, LESSONS);
    if (status === "published") await expect(item.locator(".module-status")).toHaveCount(0);
    else await expect(item.locator(".module-status")).toHaveText(STRINGS.status[status]);
  }
  expect(errors).toEqual([]);
  await page.getByRole("link", { name: STRINGS.start }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(LESSONS[0]!.title);
});

test("a module with a lesson is published; with one lesson its title links to it, with several it lists them", async ({
  page,
}) => {
  await page.goto("#/");
  await ready(page);
  const written = MODULES.filter((m) => lessonsOf(m, LESSONS).length > 0);
  const published = page.locator(".plan-module .module-status[data-status='published']");
  await expect(published).toHaveCount(0);
  for (const m of written) {
    const lessons = lessonsOf(m, LESSONS);
    const entry = page.locator(`.plan-module[data-module="${m.id}"]`);
    await expect(entry.locator(".module-status")).toHaveCount(0);
    if (lessons.length === 1) {
      const link = entry.locator("h3 a");
      await expect(link).toHaveText(m.title);
      await expect(link).toHaveAttribute("href", `#/lesson/${lessons[0]!.id}`);
    } else {
      await expect(entry.locator("h3 a")).toHaveCount(0);
      await expect(entry.locator(".module-lessons a")).toHaveText(lessons.map((l) => l.title));
      for (const l of lessons)
        await expect(entry.locator(`.module-lessons li[data-lesson="${l.id}"] a`)).toHaveAttribute(
          "href",
          `#/lesson/${l.id}`,
        );
    }
  }
  // No planned module links anywhere.
  await expect(page.locator(".plan-module h3 a")).toHaveCount(
    written.filter((m) => lessonsOf(m, LESSONS).length === 1).length,
  );
  const meet = page
    .locator('.plan-module[data-module="meet-the-machine"] .module-lessons li a')
    .first();
  await meet.click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(LESSONS[0]!.title);
  expect(new URL(page.url()).hash).toBe("#/lesson/one-addition");
  await page.goto("#/");
  await page
    .locator(
      '.plan-module[data-module="registers-and-readings"] li[data-lesson="constants-and-widths"] a',
    )
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Loading a constant");
  expect(new URL(page.url()).hash).toBe("#/lesson/constants-and-widths");
});

test("each lesson of a module with several is reached from the front page", async ({ page }) => {
  await page.goto("#/");
  await ready(page);
  const module2 = page.locator('.plan-module[data-module="adding-and-the-flags"]');
  for (const id of ["adding-and-the-flags", "subtracting-and-the-tick-counter"]) {
    const lesson = LESSONS.find((l) => l.id === id)!;
    await module2.locator(`.module-lessons li[data-lesson="${id}"] a`).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(lesson.title);
    expect(new URL(page.url()).hash).toBe(`#/lesson/${id}`);
    await page.goBack();
    await ready(page);
  }
});

test("Module 3 lists masks, fields, shifts and division in prerequisite order", async ({
  page,
}) => {
  await page.goto("#/");
  await ready(page);
  const module3 = page.locator('.plan-module[data-module="logic-shifts-masks"]');
  await expect(module3.locator(".module-status")).toHaveCount(0);
  await expect(module3.locator("h3 a")).toHaveCount(0);
  const ids = await module3
    .locator(".module-lessons li")
    .evaluateAll((els) => els.map((el) => el.getAttribute("data-lesson")));
  expect(ids).toEqual([
    "masks",
    "reading-and-writing-fields",
    "shifts",
    "shifts-and-signed-division",
  ]);
});

test("the tab is named for the page, and the course has an address for a lesson", async ({
  page,
}) => {
  const errors = watchErrors(page);
  await page.goto("#/");
  await expect(page).toHaveTitle(STRINGS.title);
  await page.goto("#/lesson/meet-the-machine");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Putting it together");
  await expect(page).toHaveTitle(STRINGS.pageTitle("Putting it together"));
  await page.goto("#/lesson/no-such-lesson");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    STRINGS.noLesson("no-such-lesson"),
  );
  await expect(page).toHaveTitle(STRINGS.pageTitle(STRINGS.noLesson("no-such-lesson")));
  await page.goto("#/nowhere");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(STRINGS.missing("/nowhere"));
  await page.getByRole("link", { name: STRINGS.backToPlan }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(STRINGS.title);
  expect(errors).toEqual([]);
});

test("each lesson foot names the lesson before it and the one after, in course order", async ({
  page,
}) => {
  const errors = watchErrors(page);
  // The first lesson has no previous, and the last has no next: the missing side keeps its place.
  await page.goto("#/lesson/one-addition");
  const nav = page.getByRole("navigation", { name: STRINGS.lessonNav });
  await expect(nav.locator('[data-direction="previous"]')).toHaveCount(0);
  await expect(nav.locator('[data-direction="next"] .lesson-nav-title')).toHaveText(
    LESSONS[1]!.title,
  );
  await page.getByRole("link", { name: new RegExp(STRINGS.nextLesson) }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(LESSONS[1]!.title);
  await expect(nav.locator('[data-direction="previous"] .lesson-nav-title')).toHaveText(
    LESSONS[0]!.title,
  );
  // The Pi extension follows QEMU; optional A32 remains last and has no next.
  const tail = LESSONS.filter((lesson) => lesson.module >= 12);
  expect(tail[0]!.id).toBe("from-function-to-executable");
  expect(tail.at(-1)!.id).toBe("a32-division-helper");
  expect(tail.map((lesson) => lesson.module)).toEqual([
    12, 12, 12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 14,
  ]);
  await page.goto(`#/lesson/${tail[0]!.id}`);
  for (const lesson of tail.slice(1)) {
    await expect(nav.locator('[data-direction="next"] .lesson-nav-title')).toHaveText(lesson.title);
    await page.getByRole("link", { name: new RegExp(STRINGS.nextLesson) }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(lesson.title);
  }
  await expect(nav.locator('[data-direction="next"]')).toHaveCount(0);
  await expect(nav.locator('[data-direction="previous"] .lesson-nav-title')).toHaveText(
    LESSONS.at(-2)!.title,
  );
  await page.getByRole("link", { name: new RegExp(STRINGS.previousLesson) }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(LESSONS.at(-2)!.title);
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
  await page.locator(".cover-start").click();
  await page.getByRole("button", { name: STRINGS.completion.mark, exact: true }).click();
  const keys = await page.evaluate(() => Object.keys(localStorage));
  expect(keys.length).toBeGreaterThan(0);
  for (const k of keys) expect(k.startsWith("assembly-lab:v1:"), k).toBe(true);
});

// The pages for an address the course does not have are visited too: their link is a control.
for (const route of ["#/", "#/nowhere", "#/lesson/anything"]) {
  test(`no visible text is under 11 pixels, and no control is under 40 pixels tall on a phone, at ${route}`, async ({
    page,
  }, info) => {
    await page.goto(route);
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
}

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

test("the cover runs fuel_on_board(38, 6, 10) live, one instruction at a time", async ({
  page,
}) => {
  const errors = watchErrors(page);
  await page.goto("#/");
  await ready(page);
  const cover = page.locator(".cover-stepper");
  const value = cover.locator(".cover-value");
  const next = cover.getByRole("button", { name: VIEW_STRINGS.stepper.next });
  const reset = cover.getByRole("button", { name: VIEW_STRINGS.stepper.reset });
  await expect(cover).toHaveAttribute("aria-label", STRINGS.cover.figure);
  await expect(value).toHaveText("= 38");
  await expect(reset).toBeDisabled();
  await expect(cover.locator(".cover-code")).toHaveText([
    "add w0, w0, w1",
    "add w0, w0, w2",
    "ret",
  ]);
  await expect(cover.locator(".cover-code[data-next='true']")).toHaveText("add w0, w0, w1");
  // Each press runs one instruction: the values are the simulator's.
  for (const [shown, running] of [
    ["= 44", "add w0, w0, w2"],
    ["= 54", "ret"],
  ] as const) {
    await next.click();
    await expect(value).toHaveText(shown);
    await expect(cover.locator(".cover-code[data-next='true']")).toHaveText(running);
  }
  // ret ends the run: nothing is next, and the value stays.
  await next.click();
  await expect(value).toHaveText("= 54");
  await expect(cover.locator(".cover-code[data-next='true']")).toHaveCount(0);
  await expect(next).toBeDisabled();
  await reset.click();
  await expect(value).toHaveText("= 38");
  await expect(next).toBeEnabled();
  expect(errors).toEqual([]);
});

test("the footer carries the copyright and links to the companion courses", async ({ page }) => {
  await page.goto("#/");
  await ready(page);
  const footer = page.locator("footer.shell-footer");
  await expect(footer.locator(".copyright")).toHaveText(STRINGS.copyright);
  const links = footer.getByRole("link");
  await expect(links).toHaveCount(5);
  await expect(
    footer.getByRole("navigation", { name: STRINGS.companions.label }).getByRole("link"),
  ).toHaveCount(3);
  await expect(footer.getByRole("link", { name: WHERE_NEXT.linkLabel })).toHaveAttribute(
    "href",
    "#/where-next",
  );
  await expectSourceVersion(page);
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
  // The notes' title and the first course's are set in italics in the sentence.
  await expect(footer.locator(".footer-intro em")).toHaveText([
    STRINGS.companions.digitalDesign,
    STRINGS.companions.notes,
  ]);
  // The copyright is in the footer of a page that is not the front page too.
  await page.goto("#/nowhere");
  await expect(page.locator("footer.shell-footer .copyright")).toHaveText(STRINGS.copyright);
  await expectSourceVersion(page);
});

test("the note on further reading links each companion work by its title", async ({ page }) => {
  await page.goto("#/");
  await ready(page);
  await page.locator(".prereqs-details > summary").click();
  const further = page.locator(".prereqs-further");
  await expect(further.getByRole("link", { name: "Digital Design" })).toHaveAttribute(
    "href",
    COMPANION_LINKS.digitalDesign,
  );
  await expect(further.getByRole("link", { name: "From gates to a compiled if" })).toHaveAttribute(
    "href",
    COMPANION_LINKS.notes,
  );
  // The titles stay in italics inside their links, and no mark shows as a character.
  await expect(further.locator("a em")).toHaveCount(2);
  await expect(further).not.toContainText("[");
  await expect(further).not.toContainText("*");
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

test("the skip link moves focus to the main content and leaves the plan on the page", async ({
  page,
}) => {
  const errors = watchErrors(page);
  await page.goto("#/");
  await ready(page);
  await page.keyboard.press("Tab");
  await expect(page.locator("a.skip-link")).toBeFocused();
  await page.keyboard.press("Enter");
  // The address is still the front page's, the plan is still shown, and focus is on <main>.
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(STRINGS.title);
  await expect(page.locator(".plan-module")).toHaveCount(MODULES.length);
  await expect(page.locator("main#main")).toBeFocused();
  expect(await page.evaluate(() => document.activeElement?.tagName)).toBe("MAIN");
  expect(new URL(page.url()).hash).toBe("#/");
  expect(errors).toEqual([]);
});

test("on a desk the cover and the plan share one centred column as wide as the page", async ({
  page,
}, info) => {
  // On a phone the cover is a band to both screen edges, by design; the plan keeps the gutter.
  test.skip(info.project.name !== "desktop", "the phone's cover runs to the screen's edges");
  await page.goto("#/");
  await ready(page);
  const edges = await page.evaluate(() => {
    const box = (sel: string) => {
      const r = document.querySelector(sel)!.getBoundingClientRect();
      return { left: Math.round(r.left), right: Math.round(r.right) };
    };
    return {
      cover: box(".cover-hero"),
      list: box(".plan-modules"),
      width: document.documentElement.clientWidth,
    };
  });
  expect(edges.list).toEqual(edges.cover);
  // It uses the page's width, as digital-design's front page does, not the reading measure.
  expect(edges.cover.right - edges.cover.left).toBeGreaterThan(900);
  // The column is centred.
  expect(edges.cover.left).toBe(edges.width - edges.cover.right);
});

test.describe("with scripts off", () => {
  test.use({ javaScriptEnabled: false });

  test("the plan has the app's side gutter and the footer's links", async ({ page }, info) => {
    await page.goto("#/");
    const gutter = info.project.name === "phone" ? 16 : 32;
    await expect(page.locator(".noscript-page h1")).toBeVisible();
    const heading = await page.locator(".noscript-page h1").boundingBox();
    expect(heading!.x).toBeGreaterThanOrEqual(gutter);
    await expect(page.locator("footer.shell-footer").getByRole("link")).toHaveCount(5);
    await page
      .locator("footer.shell-footer")
      .getByRole("link", { name: WHERE_NEXT.linkLabel })
      .click();
    await expect(page).toHaveURL(/#where-next$/);
    await expect(page.locator("#where-next h2")).toHaveText(WHERE_NEXT.title);
    await expect(
      page.locator("#where-next").getByRole("link", { name: WHERE_NEXT.playground.downloadLabel }),
    ).toHaveAttribute("href", /examples\/trip-playground\.s$/);
    await expectSourceVersion(page);
    await expect(page.locator("footer.shell-footer em")).toHaveText([
      STRINGS.companions.digitalDesign,
      STRINGS.companions.notes,
    ]);
  });
});
