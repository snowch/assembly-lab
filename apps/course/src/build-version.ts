// Copyright © 2026 Christopher Snow

export interface BuildVersion {
  sha: string;
  committedAt: string;
}

// Vite embeds the checked-out source identity in the bundle. Tests and standalone SSR
// can load the module without a Vite define; the static cover receives the same data explicitly.
declare const __COURSE_VERSION__: BuildVersion;
export const BUILD_VERSION: BuildVersion | null =
  typeof __COURSE_VERSION__ === "undefined" ? null : __COURSE_VERSION__;

export const commitHref = (sha: string) => `https://github.com/snowch/assembly-lab/commit/${sha}`;
