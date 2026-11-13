// Copyright © 2026 Christopher Snow

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Lesson } from "@platform/lesson-schema";
import { FLAGS_LESSON_SECTIONS } from "@al/views";
import { LAYOUT_STRINGS as S } from "./strings.layout";

/** The course outline and its lesson keep the same mounted interactive components. */
export function LessonLayout({ lesson, children }: { lesson: Lesson; children: ReactNode }) {
  const body = useRef<HTMLDivElement>(null);
  const mobile = useRef<HTMLDetailsElement>(null);
  const entries = useMemo(
    () =>
      lesson.id === "adding-and-the-flags"
        ? FLAGS_LESSON_SECTIONS.map((s) => ({ id: s.id, title: s.label }))
        : lesson.sections.map((s) => ({ id: `section-${s.kind}`, title: s.title })),
    [lesson],
  );
  const [active, setActive] = useState(entries[0]?.id ?? "");
  useEffect(() => {
    let frame = 0;
    const update = () => {
      const targets = entries
        .map((e) => body.current?.querySelector<HTMLElement>(`#${CSS.escape(e.id)}`))
        .filter((e): e is HTMLElement => !!e);
      const atBottom =
        scrollY > 0 && scrollY + innerHeight >= document.documentElement.scrollHeight - 2;
      const at = atBottom
        ? targets.at(-1)
        : (targets.filter((e) => e.getBoundingClientRect().top <= 120).at(-1) ?? targets[0]);
      if (at) setActive(at.id);
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
    };
  }, [entries]);
  const go = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const target = body.current?.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
    if (!target) return;
    if (mobile.current) mobile.current.open = false;
    const heading = target.matches("h2")
      ? target
      : (target.querySelector<HTMLElement>("h2") ?? target);
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
    target.scrollIntoView({
      block: "start",
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
    setActive(id);
  };
  const links = () => (
    <ol>
      {entries.map((entry, index) => (
        <li key={entry.id}>
          <a
            href={`#${entry.id}`}
            onClick={(event) => go(event, entry.id)}
            aria-current={active === entry.id ? "location" : undefined}
          >
            <span className="lesson-outline-number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{entry.title}</span>
          </a>
        </li>
      ))}
    </ol>
  );
  return (
    <div className="lesson-layout" data-lesson-layout={lesson.id}>
      <aside className="lesson-outline-desktop">
        <nav aria-label={S.outlineTitle}>
          <p>{S.outlineTitle}</p>
          {links()}
        </nav>
      </aside>
      <div className="lesson-layout-body">
        <details className="lesson-outline-mobile" ref={mobile}>
          <summary>{S.outlineDisclosure}</summary>
          <nav aria-label={S.outlineTitle}>{links()}</nav>
        </details>
        <div className="lesson-layout-content" ref={body}>
          {children}
        </div>
      </div>
    </div>
  );
}
