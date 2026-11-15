// Copyright © 2026 Christopher Snow

import { expect, it } from "vitest";
import {
  linkInstructionMarkdown,
  linkInstructionIntroductionHtml,
} from "./instruction-reference-links";
const ref = { mnemonic: "add", url: "https://support.arm.com/add" };
it("links only the first explanatory occurrence and preserves exact code text", () => {
  const linked = new Set<string>();
  expect(linkInstructionMarkdown("Use `add w0, w1, w2`, then `add`.", [ref], linked)).toBe(
    "Use [`add w0, w1, w2`](https://support.arm.com/add), then `add`.",
  );
  expect(linkInstructionMarkdown("Again `add`.", [ref], linked)).toBe("Again `add`.");
});
it("does not alter fenced/indented source or nest existing links", () => {
  const input =
    "```asm\nadd w0, w1, w2\n```\n\n    add w1, w0, w1\n\n[`add`](https://example.com/old)\n\nUse `add`.";
  expect(linkInstructionMarkdown(input, [ref])).toBe(
    input.replace("Use `add`.", "Use [`add`](https://support.arm.com/add)."),
  );
});
it("retains a bracketed load operand as a valid code link and handles conditional branches", () => {
  const ldr = { mnemonic: "ldr", url: "https://support.arm.com/ldr" };
  expect(linkInstructionMarkdown("Read `ldr w0, [x1]`.", [ldr])).toBe(
    "Read [`ldr w0, [x1]`](https://support.arm.com/ldr).",
  );
  expect(
    linkInstructionMarkdown("Use `b.ge next`.", [
      { mnemonic: "b.cond", url: "https://support.arm.com/branch" },
    ]),
  ).toContain("[`b.ge next`](https://support.arm.com/branch)");
});
it("uses the custom flags introduction slot without touching later code", () => {
  const input =
    '<code data-instruction-introduction="adds">adds</code><pre><code>adds w0, w0, w1</code></pre>';
  const output = linkInstructionIntroductionHtml(input, [{ mnemonic: "adds", url: ref.url }]);
  expect(output).toContain(
    `<a class="instruction-reference-link" href="${ref.url}"><code data-instruction-introduction="adds">adds</code></a>`,
  );
  expect(output).toContain("<pre><code>adds w0, w0, w1</code></pre>");
});

it("links a new register-offset form at its own example rather than an earlier immediate load", () => {
  const ref = {
    mnemonic: "ldr",
    url: "https://support.arm.com/ldr-register",
    codePattern: "^ldr\\s+.*\\[[^,\\]]+,\\s*x[0-9]",
  };
  const text = "Known `ldr w0, [x0, 8]`. New `ldr w0, [x0, x1]`.";
  expect(linkInstructionMarkdown(text, [ref])).toBe(
    "Known `ldr w0, [x0, 8]`. New [`ldr w0, [x0, x1]`](https://support.arm.com/ldr-register).",
  );
});
