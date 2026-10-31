// Copyright © 2026 Christopher Snow

import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { COMPLEMENT_PROSE, SIGNED_WEIGHTS } from "./twos-complement.prose";
import { COMPLEMENT_STRINGS } from "../../packages/views/src/strings.complement";

it("keeps the separately drafted words in the canonical record", () => {
  const record = readFileSync(
    new URL("../../docs/notes/twos-complement-appendix/prose.md", import.meta.url),
    "utf8",
  );
  const json = record.match(/```json\n([\s\S]*?)\n```/)?.[1];
  expect(json).toBeDefined();
  expect(JSON.parse(json!)).toEqual({
    SIGNED_WEIGHTS,
    COMPLEMENT_PROSE,
    COMPLEMENT_STRINGS: { ...COMPLEMENT_STRINGS, bit: [0, 1, 2, 3].map(COMPLEMENT_STRINGS.bit) },
  });
});
