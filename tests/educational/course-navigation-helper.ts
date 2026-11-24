// Copyright © 2026 Christopher Snow

import { expect, type Page } from "@playwright/test";
import { LAYOUT_STRINGS as S } from "../../apps/course/src/strings.layout";

/** Open the visible course return control without replacing the mounted lesson. */
export async function courseOverview(page: Page) {
  const trigger = page.getByRole("button", { name: S.courseLessons, exact: true });
  if ((await trigger.getAttribute("aria-expanded")) !== "true") await trigger.click();
  const link = page.locator("#course-lesson-panel").getByRole("link", {
    name: S.courseOverview,
    exact: true,
  });
  await expect(link).toBeVisible();
  return link;
}

export async function returnToCourse(page: Page) {
  await (await courseOverview(page)).click();
  await expect(page).toHaveURL(/#\/$/);
}
