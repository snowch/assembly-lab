// Copyright © 2026 Christopher Snow

import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderRelease } from "./plugin";
import { retainForPublish, retainPublishedReleases } from "./retain";

const template = "const release = __OFFLINE_RELEASE__;";
const release = (marker: string) =>
  renderRelease(template, [
    { path: "index.html", bytes: `<html>${marker}</html>` },
    { path: "native/example.s", bytes: marker },
    { path: "icon.svg", bytes: "<svg/>" },
    { path: `assets/runtime-${marker}.js`, bytes: `console.log(${JSON.stringify(marker)})` },
  ]);
const directories: string[] = [];
afterEach(async () => {
  await Promise.all(
    directories.splice(0).map((path) => rm(path, { recursive: true, force: true })),
  );
});
async function output(build = release("new")) {
  const directory = await mkdtemp(join(tmpdir(), "assembly-retain-"));
  directories.push(directory);
  await writeFile(join(directory, "release.json"), JSON.stringify(build.metadata));
  for (const file of build.files) {
    const path = join(directory, file.path);
    await mkdir(join(path, ".."), { recursive: true });
    await writeFile(path, file.bytes);
  }
  return directory;
}
function server(
  current = release("A"),
  previous = release("B"),
  history: string[] = [previous.metadata.buildId],
) {
  const files = new Map<string, string | Uint8Array>([
    ["release.json", JSON.stringify({ ...current.metadata, retainedReleases: history })],
  ]);
  for (const built of [current, previous]) {
    files.set(`releases/${built.metadata.buildId}/release.json`, JSON.stringify(built.metadata));
    for (const file of built.files)
      files.set(`releases/${built.metadata.buildId}/${file.path}`, file.bytes);
  }
  const fetcher = vi.fn(async (url: URL, _options: RequestInit) => {
    const bytes = files.get(url.pathname.slice("/assembly-lab/".length));
    return new Response(bytes === undefined ? "missing" : Buffer.from(bytes), {
      status: bytes === undefined ? 404 : 200,
    });
  });
  return { files, fetcher, current, previous };
}

describe("publication retention", () => {
  it("retains the two previous verified immutable trees and limits history", async () => {
    const directory = await output();
    const site = server();
    const ids = await retainPublishedReleases(directory, "https://example.test/assembly-lab/", {
      fetcher: site.fetcher,
    });
    expect(ids).toEqual([site.current.metadata.buildId, site.previous.metadata.buildId]);
    for (const built of [site.current, site.previous]) {
      for (const file of built.files)
        expect(
          await readFile(join(directory, "releases", built.metadata.buildId, file.path)),
        ).toEqual(Buffer.from(file.bytes));
      expect(
        JSON.parse(
          await readFile(
            join(directory, "releases", built.metadata.buildId, "release.json"),
            "utf8",
          ),
        ).buildId,
      ).toBe(built.metadata.buildId);
    }
    expect(site.fetcher.mock.calls.some(([url]) => url.pathname.endsWith("/icon.svg"))).toBe(false);
    expect(site.fetcher.mock.calls.every(([, options]) => options.cache === "no-store")).toBe(true);
  });

  it("ignores duplicate/current IDs and never requests a third historical tree", async () => {
    const local = release("A"),
      previous = release("B"),
      older = release("C");
    const directory = await output(local);
    const site = server(local, previous, [
      local.metadata.buildId,
      previous.metadata.buildId,
      previous.metadata.buildId,
      older.metadata.buildId,
    ]);
    // A missing historical tree must stop the artifact, rather than claiming retention.
    await expect(
      retainPublishedReleases(directory, "https://example.test/assembly-lab/", {
        fetcher: site.fetcher,
        keep: 1,
      }),
    ).resolves.toEqual([previous.metadata.buildId]);
    expect(
      site.fetcher.mock.calls.some(([url]) => url.pathname.includes(older.metadata.buildId)),
    ).toBe(false);
  });

  it("supports the pre-immutable published root only when bytes verify", async () => {
    const directory = await output();
    const site = server(release("legacy"), release("unused"), []);
    for (const file of site.current.files) {
      site.files.delete(`releases/${site.current.metadata.buildId}/${file.path}`);
      site.files.set(file.path, file.bytes);
    }
    await expect(
      retainPublishedReleases(directory, "https://example.test/assembly-lab/", {
        fetcher: site.fetcher,
      }),
    ).resolves.toEqual([site.current.metadata.buildId]);
    expect(await readFile(join(directory, "assets/runtime-legacy.js"), "utf8")).toBe(
      'console.log("legacy")',
    );
  });

  it("does not overwrite a current canonical asset when an old URL collides", async () => {
    const directory = await output();
    const site = server();
    await writeFile(join(directory, "assets/runtime-A.js"), "different current bytes");
    await expect(
      retainPublishedReleases(directory, "https://example.test/assembly-lab/", {
        fetcher: site.fetcher,
      }),
    ).rejects.toThrow("URL collision");
    expect(await readFile(join(directory, "assets/runtime-A.js"), "utf8")).toBe(
      "different current bytes",
    );
  });

  it("rejects mixed bytes and leaves current release metadata untouched", async () => {
    const directory = await output();
    const before = await readFile(join(directory, "release.json"), "utf8");
    const site = server();
    site.files.set(`releases/${site.current.metadata.buildId}/native/example.s`, "wrong bytes");
    await expect(
      retainPublishedReleases(directory, "https://example.test/assembly-lab/", {
        fetcher: site.fetcher,
      }),
    ).rejects.toThrow("verification");
    expect(await readFile(join(directory, "release.json"), "utf8")).toBe(before);
  });

  it("accepts a first-deployment 404 but refuses unavailable or malformed published metadata", async () => {
    const directory = await output();
    await expect(
      retainPublishedReleases(directory, "https://example.test/assembly-lab/", {
        fetcher: async () => new Response("missing", { status: 404 }),
      }),
    ).resolves.toEqual([]);
    await expect(
      retainPublishedReleases(directory, "https://example.test/assembly-lab/", {
        fetcher: async () => new Response("broken", { status: 503 }),
      }),
    ).rejects.toThrow("unavailable");
    const site = server();
    site.files.set(
      "release.json",
      JSON.stringify({ ...site.current.metadata, retainedReleases: ["../escape"] }),
    );
    await expect(
      retainPublishedReleases(directory, "https://example.test/assembly-lab/", {
        fetcher: site.fetcher,
      }),
    ).rejects.toThrow("history");
  });

  it("writes retained history to canonical and immutable metadata during publication", async () => {
    const directory = await output();
    const originalFetch = globalThis.fetch;
    const site = server();
    globalThis.fetch = site.fetcher as unknown as typeof fetch;
    try {
      const ids = await retainForPublish(directory, "https://example.test/assembly-lab/");
      const current = JSON.parse(await readFile(join(directory, "release.json"), "utf8"));
      expect(current.retainedReleases).toEqual(ids);
      expect(
        await readFile(join(directory, "releases", current.buildId, "release.json"), "utf8"),
      ).toBe(await readFile(join(directory, "release.json"), "utf8"));
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
