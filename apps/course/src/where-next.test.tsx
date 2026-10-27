// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { readFileSync } from "node:fs";
import { URL as NodeURL } from "node:url";
import { render, cleanup } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { WHERE_NEXT, PLAYGROUND_STARTER } from "@al/content";
import { WhereNextPage } from "./pages/WhereNextPage";
import { parseRoute, pageTitle } from "./route";
import { STRINGS } from "./strings";

afterEach(cleanup);
const strings = (v: unknown): string[] =>
  typeof v === "string"
    ? [v]
    : Array.isArray(v)
      ? v.flatMap(strings)
      : v && typeof v === "object"
        ? Object.values(v).flatMap(strings)
        : [];

it("has a distinct ancillary route and tab title without becoming a numbered lesson", () => {
  expect(parseRoute("#/where-next")).toEqual({ kind: "where-next" });
  expect(parseRoute("#/where-next/")).toEqual({ kind: "where-next" });
  expect(pageTitle(parseRoute("#/where-next"), STRINGS.title, () => undefined)).toBe(
    STRINGS.pageTitle(WHERE_NEXT.title),
  );
  expect(parseRoute("#/elsewhere")).toEqual({ kind: "missing", path: "/elsewhere" });
});

it("renders the complete checked starter and separate playground and native routes", () => {
  const { container, getByRole } = render(<WhereNextPage />);
  expect(getByRole("heading", { level: 1 })).toHaveTextContent(WHERE_NEXT.title);
  expect(container.querySelector(".where-next-starter code")?.textContent).toBe(PLAYGROUND_STARTER);
  expect(getByRole("link", { name: WHERE_NEXT.playground.downloadLabel })).toHaveAttribute(
    "href",
    "examples/trip-playground.s",
  );
  expect(getByRole("link", { name: WHERE_NEXT.playground.downloadLabel })).toHaveAttribute(
    "download",
  );
  expect(getByRole("link", { name: WHERE_NEXT.playground.openLabel })).toHaveAttribute(
    "target",
    "_blank",
  );
  expect(container.querySelector('a[href="#/lesson/calls-and-returns"]')).not.toBeNull();
  expect(container.querySelector('a[href="#/lesson/from-function-to-executable"]')).not.toBeNull();
  expect(container.querySelector('a[href="#/lesson/raspberry-pi-5"]')).not.toBeNull();
});

it("keeps the page and discovery labels in the separate canonical prose record", () => {
  const text = readFileSync(
    new NodeURL("../../../docs/notes/where-next/prose.md", import.meta.url),
    "utf8",
  );
  const flat = (s: string) => s.replace(/[`*]/g, "").replace(/\s+/g, " ").trim();
  for (const s of strings(WHERE_NEXT)) expect(flat(text), s).toContain(flat(s));
});
