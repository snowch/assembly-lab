// Copyright © 2026 Christopher Snow

import { expect, test } from "@playwright/test";
import { LESSONS, WHERE_NEXT, PLAYGROUND_STARTER } from "@al/content";
import { designProblems } from "./design";
import { watchErrors } from "./module3";

for (const theme of ["light", "dark"] as const) {
  test(`optional progression is discoverable with a complete starter in ${theme}`, async ({
    page,
    isMobile,
  }) => {
    const errors = watchErrors(page);
    await page.goto("#/");
    await page.getByRole("combobox", { name: "Theme", exact: true }).selectOption(theme);
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    const home = page.locator(".where-next-discovery");
    await home.getByRole("link", { name: WHERE_NEXT.linkLabel }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(WHERE_NEXT.title);
    await expect(page).toHaveTitle(`Where next? / Assembly Lab`);
    await expect(page.locator(".where-next-starter code")).toHaveText(PLAYGROUND_STARTER);
    await expect(page.getByRole("link", { name: WHERE_NEXT.playground.openLabel })).toHaveAttribute(
      "href",
      "https://aarch64-playground.com/playground",
    );
    await expect(page.getByRole("link", { name: WHERE_NEXT.playground.openLabel })).toHaveAttribute(
      "target",
      "_blank",
    );
    const download = page.getByRole("link", { name: WHERE_NEXT.playground.downloadLabel });
    const [file] = await Promise.all([page.waitForEvent("download"), download.click()]);
    const stream = await file.createReadStream();
    if (!stream) throw new Error("Missing downloaded starter stream");
    const chunks: Buffer[] = [];
    for await (const chunk of stream) chunks.push(Buffer.from(chunk));
    expect(Buffer.concat(chunks).toString("utf8")).toBe(PLAYGROUND_STARTER);
    expect(file.suggestedFilename()).toBe("trip-playground.s");
    const code = page.locator(".where-next-starter");
    await code.focus();
    await expect(code).toBeFocused();
    const dimensions = await code.evaluate((el) => ({
      client: el.clientWidth,
      scroll: el.scrollWidth,
    }));
    if (dimensions.scroll > dimensions.client) {
      await code.evaluate((el) => {
        el.scrollLeft = el.scrollWidth;
      });
      const before = await code.evaluate((el) => el.scrollLeft);
      expect(before).toBeGreaterThan(0);
      await page.keyboard.press("ArrowLeft");
      await expect.poll(() => code.evaluate((el) => el.scrollLeft)).toBeLessThan(before);
    }
    expect(await designProblems(page, isMobile)).toEqual([]);
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(WHERE_NEXT.title);
    const lastCallsLesson = LESSONS.filter((lesson) => lesson.module === 9).at(-1)!;
    await page.goto(`#/lesson/${lastCallsLesson.id}`);
    await page
      .locator(".where-next-after-calls")
      .getByRole("link", { name: WHERE_NEXT.linkLabel })
      .click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(WHERE_NEXT.title);
    await page.getByRole("link", { name: "Back to the course plan", exact: true }).click();
    await page.locator("footer").getByRole("link", { name: WHERE_NEXT.linkLabel }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(WHERE_NEXT.title);
    expect(errors).toEqual([]);
  });
}
