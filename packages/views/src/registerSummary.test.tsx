// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RegisterSummary } from "./parts";
import { traceOf, viewAt } from "./trace";

describe("compact register summaries", () => {
  it("keeps preformatted 64-bit values exact and marks a write independently of value", () => {
    const { rerender, container } = render(
      <RegisterSummary name="x0" value="0xffffffffffffffff" written={false} />,
    );
    expect(screen.getByText("0xffffffffffffffff")).toBeVisible();
    expect(screen.queryByText("Written")).toBeNull();
    rerender(<RegisterSummary name="x0" value="0xffffffffffffffff" written />);
    expect(screen.getByText("Written")).toBeVisible();
    expect(container.querySelector('[data-changed="true"]')).toHaveAttribute("data-register", "x0");
  });
  it("records identical-bit writes and clears the marker after ret", () => {
    const trace = traceOf({ listing: "f:\n add w0, w0, #0\n ret" }, { entry: "f", args: [0] });
    expect(viewAt(trace, 1).written.has(0)).toBe(true);
    expect(viewAt(trace, 2).written.has(0)).toBe(false);
  });
});
