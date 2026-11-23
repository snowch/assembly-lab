// Copyright © 2026 Christopher Snow

// Keep two verified published releases for tabs whose documents outlive a deploy.
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { parseRelease, type PublishedRelease, type ReleaseAsset } from "../src/latest-commit.ts";

type Fetcher = (url: URL, init: RequestInit) => Promise<Response>;
const matches = (bytes: Buffer, file: ReleaseAsset) =>
  bytes.length === file.bytes &&
  `sha256-${createHash("sha256").update(bytes).digest("base64")}` === file.integrity;

export async function retainPublishedReleases(
  directory: string,
  source: string,
  { keep = 2, fetcher = fetch }: { keep?: number; fetcher?: Fetcher } = {},
) {
  const local = parseRelease(JSON.parse(await readFile(join(directory, "release.json"), "utf8")));
  const base = new URL(source.endsWith("/") ? source : `${source}/`);
  const request = (path: string) =>
    fetcher(new URL(path, base), {
      cache: "no-store",
      signal: AbortSignal.timeout(30000),
    });
  const response = await request("release.json");
  // A first deployment has no published course to retain. Other failures must
  // stop publication instead of silently dropping assets from open windows.
  if (response.status === 404) return [];
  if (!response.ok) throw new Error("Published release unavailable for retention");
  const published = parseRelease(await response.json()) as PublishedRelease & {
    retainedReleases?: unknown;
  };
  const history = published.retainedReleases ?? [];
  if (
    !Array.isArray(history) ||
    history.some((id) => typeof id !== "string" || !/^[a-f0-9]{64}$/.test(id))
  )
    throw new Error("Invalid published release history");
  const ids = [...new Set([published.buildId, ...(history as string[])])]
    .filter((id) => id !== local.buildId)
    .slice(0, keep);
  for (const id of ids) {
    let release = published as PublishedRelease;
    if (id !== published.buildId) {
      const response = await request(`releases/${id}/release.json`);
      if (!response.ok) throw new Error("Previous release manifest unavailable");
      release = parseRelease(await response.json());
      if (release.buildId !== id) throw new Error("Previous release identity mismatch");
    }
    const pending = [...release.assets];
    const results = await Promise.allSettled(
      Array.from({ length: Math.min(4, pending.length) }, async () => {
        while (pending.length) {
          const file = pending.shift()!;
          let bytes: Buffer | undefined;
          try {
            const candidate = await readFile(join(directory, file.path));
            if (matches(candidate, file)) bytes = candidate;
          } catch {
            /* The old file may only exist in the published release. */
          }
          if (!bytes) {
            let response = await request(`releases/${id}/${file.path}`);
            // Compatibility with the last deployment before immutable trees existed.
            if (!response.ok && id === published.buildId) response = await request(file.path);
            if (!response.ok)
              throw new Error(`Cannot retain ${file.path}: HTTP ${response.status}`);
            bytes = Buffer.from(await response.arrayBuffer());
            if (!matches(bytes, file))
              throw new Error(`Published asset failed verification: ${file.path}`);
          }
          // Pre-immutable tabs still request Vite's content-addressed asset URLs.
          // Keep those original URLs as well as the immutable tree. Never replace
          // a current file: a same-URL/different-byte collision blocks publication.
          if (file.path.startsWith("assets/")) {
            const canonical = join(directory, file.path);
            await mkdir(dirname(canonical), { recursive: true });
            try {
              await writeFile(canonical, bytes, { flag: "wx" });
            } catch (error) {
              if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
              if (!matches(await readFile(canonical), file))
                throw new Error(`Retained asset URL collision: ${file.path}`);
            }
          }
          const path = join(directory, "releases", id, file.path);
          await mkdir(dirname(path), { recursive: true });
          await writeFile(path, bytes);
        }
      }),
    );
    const failure = results.find((result) => result.status === "rejected");
    if (failure?.status === "rejected") throw failure.reason;
    await writeFile(
      join(directory, "releases", id, "release.json"),
      `${JSON.stringify(release)}\n`,
    );
  }
  return ids;
}

export async function retainForPublish(directory: string, source: string) {
  const release = parseRelease(JSON.parse(await readFile(join(directory, "release.json"), "utf8")));
  const retainedReleases = await retainPublishedReleases(directory, source);
  const metadata = `${JSON.stringify({ ...release, retainedReleases })}\n`;
  await mkdir(join(directory, "releases", release.buildId), { recursive: true });
  for (const path of ["release.json", `releases/${release.buildId}/release.json`])
    await writeFile(join(directory, path), metadata);
  return retainedReleases;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const source = process.env.PUBLISHED_COURSE_URL;
  if (!source) throw new Error("PUBLISHED_COURSE_URL is required for publication retention");
  const retained = await retainForPublish(process.argv[2] ?? "apps/course/dist", source);
  console.log(`Retained ${retained.length} verified prior course releases`);
}
