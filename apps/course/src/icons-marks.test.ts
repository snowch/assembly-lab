// Copyright © 2026 Christopher Snow

// Every module in the plan has its mark on the front page, and no mark names a module the plan
// does not have.

import { describe, expect, it } from "vitest";

import { MODULES } from "@al/content/plan";

import { MODULE_ICONS } from "./pages/icons";

describe("the front page's module marks", () => {
  it("give every module a mark, and only the plan's modules", () => {
    expect(Object.keys(MODULE_ICONS).sort()).toEqual(MODULES.map((m) => m.id).sort());
  });
});
