// Copyright © 2026 Christopher Snow

// The look of a page, held to the rules the shell's tests hold the front page to: no visible text
// under 11 pixels, every control at least 40 pixels tall on a phone, no sideways scroll, and no
// line of prose over about 85 characters. It returns the problems it finds, as sentences.

import type { Page } from "@playwright/test";

export async function designProblems(page: Page, phone: boolean): Promise<string[]> {
  return page.evaluate((isPhone) => {
    const out: string[] = [];
    const visible = (el: Element) => {
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    };
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const seen = new Set<Element>();
    let node: Node | null;
    while ((node = walker.nextNode())) {
      const el = node.parentElement;
      if (!el || !(node.textContent ?? "").trim() || seen.has(el)) continue;
      seen.add(el);
      if (el.closest(".visually-hidden") || !visible(el)) continue;
      const px = parseFloat(getComputedStyle(el).fontSize);
      if (px < 11)
        out.push(`text ${px.toFixed(1)}px: "${(node.textContent ?? "").trim().slice(0, 30)}"`);
    }
    if (isPhone)
      for (const c of document.querySelectorAll("a, button, select, input, textarea, summary")) {
        if (c.closest(".visually-hidden") || !visible(c)) continue;
        const r = c.getBoundingClientRect();
        if (r.height < 40)
          out.push(
            `control ${Math.round(r.height)}px tall: "${(c.textContent ?? c.getAttribute("aria-label") ?? "").trim().slice(0, 30)}"`,
          );
      }
    const { scrollWidth, clientWidth } = document.documentElement;
    if (scrollWidth > clientWidth)
      out.push(`the page scrolls sideways by ${scrollWidth - clientWidth}px`);
    for (const p of document.querySelectorAll("main p")) {
      if (!visible(p)) continue;
      const r = p.getBoundingClientRect();
      const chars = r.width / (parseFloat(getComputedStyle(p).fontSize) * 0.5);
      if (chars > 85)
        out.push(
          `line of ${Math.round(chars)} characters: "${(p.textContent ?? "").trim().slice(0, 30)}"`,
        );
    }
    // A register's 32 cells, and every figure, stay inside the box that holds them. A listing is
    // the one exception: it keeps the C beside its instructions at every width, and on a narrow
    // screen it scrolls sideways itself, as one contained piece, rather than the page scrolling.
    for (const el of document.querySelectorAll(".al-reg, .asm-editor, .answer-editor")) {
      if (!visible(el)) continue;
      if (el.scrollWidth > el.clientWidth + 1)
        out.push(`${el.className} is ${el.scrollWidth - el.clientWidth}px wider than its box`);
    }
    for (const el of document.querySelectorAll(".al-listing")) {
      if (!visible(el)) continue;
      if (getComputedStyle(el).overflowX !== "auto")
        out.push(`al-listing does not contain its own sideways scroll`);
      const r = el.getBoundingClientRect();
      if (r.right > document.documentElement.clientWidth + 1)
        out.push(`al-listing reaches ${Math.round(r.right)}px, outside the page`);
    }
    return out;
  }, phone);
}
