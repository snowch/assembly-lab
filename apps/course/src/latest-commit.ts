// Copyright © 2026 Christopher Snow

import { useEffect, useState } from "react";

export const LATEST_COMMIT_URL = "https://api.github.com/repos/snowch/assembly-lab/commits/main";

/** An unverified, offline or outdated copy never earns a latest-commit tick. */
export function useLatestCommit(sha: string | null, enabled: boolean): boolean {
  const [verifiedSha, setVerifiedSha] = useState<string | null>(null);
  useEffect(() => {
    if (!sha || !enabled) return;
    let controller: AbortController | undefined;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const clear = () => {
      controller?.abort();
      clearTimeout(timeout);
      setVerifiedSha(null);
    };
    const check = async () => {
      clear();
      if (!navigator.onLine) return;
      const request = new AbortController();
      controller = request;
      timeout = setTimeout(() => request.abort(), 5000);
      try {
        const response = await fetch(LATEST_COMMIT_URL, {
          signal: request.signal,
          cache: "no-store",
          credentials: "omit",
          referrerPolicy: "no-referrer",
        });
        if (!response.ok) return;
        const commit: unknown = await response.json();
        if (!request.signal.aborted && commit && typeof commit === "object" && "sha" in commit) {
          setVerifiedSha(commit.sha === sha ? sha : null);
        }
      } catch {
        // Version checking is optional; the course still works without GitHub access.
      } finally {
        if (controller === request) clearTimeout(timeout);
      }
    };
    const refresh = () => void check();
    refresh();
    window.addEventListener("online", refresh);
    window.addEventListener("focus", refresh);
    window.addEventListener("offline", clear);
    return () => {
      controller?.abort();
      clearTimeout(timeout);
      window.removeEventListener("online", refresh);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("offline", clear);
    };
  }, [sha, enabled]);
  return enabled && sha !== null && verifiedSha === sha;
}
