// Copyright © 2026 Christopher Snow

import type { Locator } from "@playwright/test";

export async function inspectCalculator(panel: Locator) {
  const details = panel.locator(".workspace-inspection");
  if (!(await details.evaluate((node) => (node as HTMLDetailsElement).open)))
    await details.locator(":scope > summary").click();
}
