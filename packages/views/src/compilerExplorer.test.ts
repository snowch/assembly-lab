// Copyright © 2026 Christopher Snow
import { expect, it, vi } from "vitest";
import { compareGcc, gccLink } from "./compilerExplorer";
it("creates a source-preserving Compiler Explorer clientstate link without a request", () => {
  const source = "// café\nunsigned f(void) { return 7; }";
  const link = gccLink(source);
  const state = JSON.parse(atob(decodeURIComponent(link.split("/clientstate/")[1]!)));
  expect(state.sessions[0].source).toBe(source);
  expect(state.sessions[0].compilers[0]).toEqual({ id: "carm64g1610", options: "-O1" });
});
it("sends only explicit comparison calls and reuses a successful response", async () => {
  const request = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ code: 0, asm: [{ text: "f:" }, { text: "ret" }] }),
  });
  expect(request).not.toHaveBeenCalled();
  const source = "unsigned cached_test(void) { return 3; }";
  expect(await compareGcc(source, request)).toEqual({ listing: "f:\nret", cached: false });
  expect(await compareGcc(source, request)).toEqual({ listing: "f:\nret", cached: true });
  expect(request).toHaveBeenCalledTimes(1);
  const body = JSON.parse(request.mock.calls[0]![1].body);
  expect(body.source).toBe(source);
  expect(body.options.userArguments).toBe("-O1");
});
it("does not cache network failures or malformed compiler output", async () => {
  const request = vi
    .fn()
    .mockRejectedValueOnce(Error("offline"))
    .mockResolvedValue({ ok: true, json: async () => ({ code: 1 }) });
  await expect(compareGcc("failure sample", request)).rejects.toThrow();
  await expect(compareGcc("failure sample", request)).rejects.toThrow();
  expect(request).toHaveBeenCalledTimes(2);
});
