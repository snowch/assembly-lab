// Copyright © 2026 Christopher Snow
// Compiler Explorer's documented compile API and /clientstate/<base64> format.
export const GCC_ID = "carm64g1610";
const cache = new Map<string, string>();
export function gccLink(source: string): string {
  const state = JSON.stringify({
    sessions: [{ id: 1, language: "c", source, compilers: [{ id: GCC_ID, options: "-O1" }] }],
  }).replace(/[\u007f-\uffff]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);
  return `https://godbolt.org/clientstate/${encodeURIComponent(btoa(state))}`;
}
export async function compareGcc(
  source: string,
  request: typeof fetch = fetch,
): Promise<{ listing: string; cached: boolean }> {
  const known = cache.get(source);
  if (known !== undefined) return { listing: known, cached: true };
  const controller = new AbortController(),
    timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await request(`https://godbolt.org/api/compiler/${GCC_ID}/compile`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        source,
        options: {
          userArguments: "-O1",
          filters: { directives: true, labels: true, commentOnly: true, intel: false },
        },
      }),
      signal: controller.signal,
    });
    if (!response.ok) throw Error("Compiler Explorer request failed");
    const result: unknown = await response.json();
    if (!result || typeof result !== "object") throw Error("Invalid compiler response");
    const data = result as { code?: unknown; asm?: unknown };
    if (data.code !== 0 || !Array.isArray(data.asm))
      throw Error("Compiler Explorer compilation failed");
    const listing = data.asm
      .map((row: unknown) => {
        if (!row || typeof row !== "object" || typeof (row as { text?: unknown }).text !== "string")
          throw Error("Invalid assembly row");
        return (row as { text: string }).text;
      })
      .join("\n");
    if (cache.size >= 32) cache.delete(cache.keys().next().value!);
    cache.set(source, listing);
    return { listing, cached: false };
  } finally {
    clearTimeout(timer);
  }
}
