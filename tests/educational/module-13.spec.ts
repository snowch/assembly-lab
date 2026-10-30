// Copyright © 2026 Christopher Snow

import { expect, test } from "@playwright/test";
import { designProblems } from "./design";
import { watchErrors } from "./module3";

for (const theme of ["light", "dark"] as const) {
  test(`Pi 5 prerequisites and source schematics in ${theme}`, async ({ page, isMobile }) => {
    const errors = watchErrors(page);
    await page.goto("#/lesson/raspberry-pi-5");
    await page.getByRole("combobox", { name: "Theme", exact: true }).selectOption(theme);
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "official Raspberry Pi Debug Probe", exact: true }),
    ).toHaveAttribute("href", "https://www.raspberrypi.com/products/debug-probe/");
    const serial = page.locator("#ix-pi5-serial-connection");
    await expect(serial.locator("[data-board-node]")).toHaveCount(3);
    await expect(serial).toContainText("UART");
    await expect(serial).toContainText("Socket labelled U");
    await expect(serial.locator(".al-board-link svg")).toHaveCount(2);
    await expect(page.locator("#ix-pi5-boot-path")).toHaveCount(0);
    await page.goto("#/lesson/raspberry-pi-boot");
    const boot = page.locator("#ix-pi5-boot-path");
    await expect(boot.locator("[data-board-node]")).toHaveCount(6);
    await expect(boot).toContainText("not a recording");
    await expect(page.locator(".al-problem, .al-locked")).toHaveCount(0);
    expect(await designProblems(page, isMobile)).toEqual([]);
    await page.reload();
    await expect(boot).toContainText("not a recording");
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    expect(errors).toEqual([]);
  });

  test(`Pi 5 build, download and physical test in ${theme}`, async ({
    page,
    isMobile,
    request,
  }) => {
    const errors = watchErrors(page);
    await page.goto("#/lesson/raspberry-pi-boot");
    await page.getByRole("combobox", { name: "Theme", exact: true }).selectOption(theme);
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const link = page.getByRole("link", { name: "Download the Pi 5 source bundle", exact: true });
    const href = await link.getAttribute("href");
    expect(href).toContain("native/pi5/assembly-lab-pi5.zip");
    const archive = await request.get(href!);
    expect(archive.ok()).toBe(true);
    expect((await archive.body()).subarray(0, 2).toString()).toBe("PK");
    for (const name of ["boot.ld", "config.txt", "trip_distance.s", "boot.s"]) {
      const file = page.getByRole("link", { name, exact: true });
      const response = await request.get((await file.getAttribute("href"))!);
      expect(response.ok()).toBe(true);
      expect(await response.text()).toContain("Copyright © 2026 Christopher Snow");
    }
    await expect(page.locator("main")).toContainText("device_tree=");
    await expect(page.locator("main")).toContainText("make card-files");
    await expect(page.locator("main")).toContainText(
      /Hardware verification (?:is|remains) pending/,
    );
    await expect(page.locator("main")).not.toContainText("picocom --baud");
    await expect(page.locator(".al-problem, .al-locked")).toHaveCount(0);
    expect(await designProblems(page, isMobile)).toEqual([]);
    expect(errors).toEqual([]);
  });
  for (const route of ["capture-pi-boot", "restore-pi-boot"]) {
    test(`${route}: complete physical workflow in ${theme}`, async ({ page, isMobile }) => {
      await page.goto(`#/lesson/${route}`);
      await page.getByRole("combobox", { name: "Theme", exact: true }).selectOption(theme);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await expect(page.locator("main")).toContainText(
        /Hardware verification (?:is|remains) pending/,
      );
      if (route === "capture-pi-boot") {
        await expect(page.locator("main")).toContainText("picocom --baud 115200");
        await expect(page.locator("main")).toContainText("Ctrl-X");
        await expect(page.locator("main")).not.toContainText(
          "Change the third arithmetic instruction",
        );
      } else {
        await expect(page.locator("main")).toContainText("Restore the subtraction");
        await expect(page.locator("main")).toContainText("fresh power-on");
      }
      expect(await designProblems(page, isMobile)).toEqual([]);
    });
  }
}
