// Copyright © 2026 Christopher Snow

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Lesson } from "@platform/lesson-schema";
import { FLAGS_LESSON_SECTIONS } from "@al/views";
import { PREVIEW_STRINGS as S } from "./strings.preview";

export const STYLE_PREVIEW_ENABLED = import.meta.env["VITE_STYLE_PREVIEW"] === "1";
export type PreviewStyle = "current" | "new";
const KEY = "assembly-lab:v1:style-preview";
export function usePreviewStyle(): [PreviewStyle, (value: PreviewStyle) => void] {
  const [style, setStyle] = useState<PreviewStyle>(() => {
    if (!STYLE_PREVIEW_ENABLED) return "current";
    const query = new URL(location.href).searchParams.get("style");
    if (query === "current" || query === "new") return query;
    try {
      return localStorage.getItem(KEY) === "current" ? "current" : "new";
    } catch {
      return "new";
    }
  });
  useLayoutEffect(() => {
    if (!STYLE_PREVIEW_ENABLED) return;
    document.documentElement.dataset["stylePreview"] = style;
    return () => {
      delete document.documentElement.dataset["stylePreview"];
    };
  }, [style]);
  return [
    style,
    (value) => {
      setStyle(value);
      try {
        localStorage.setItem(KEY, value);
      } catch {
        /* Comparison still works in memory. */
      }
      const url = new URL(location.href);
      url.searchParams.set("style", value);
      history.replaceState(history.state, "", url);
    },
  ];
}
export function StylePreviewControls({
  style,
  onChange,
  inert,
}: {
  style: PreviewStyle;
  onChange: (style: PreviewStyle) => void;
  inert?: boolean;
}) {
  return (
    <aside className="style-preview-controls" aria-label={S.title} inert={inert}>
      <details className="style-preview-info">
        <summary>{S.title}</summary>
        <div>
          <p>{S.appearanceNote}</p>
          <p>{S.progressNote}</p>
        </div>
      </details>
      <div className="style-preview-choices" role="group" aria-label={S.styleGroupLabel}>
        <button
          type="button"
          aria-pressed={style === "current"}
          onClick={() => onChange("current")}
        >
          {S.currentStyle}
        </button>
        <button type="button" aria-pressed={style === "new"} onClick={() => onChange("new")}>
          {S.newStyle}
        </button>
      </div>
    </aside>
  );
}
/** Both appearances keep exactly the same mounted lesson and interactive components. */
export function PreviewLessonLayout({
  lesson,
  style,
  children,
}: {
  lesson: Lesson;
  style: PreviewStyle;
  children: ReactNode;
}) {
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
    if (style !== "new") return;
    let frame = 0;
    const update = () => {
      const targets = entries
        .map((e) => body.current?.querySelector<HTMLElement>(`#${CSS.escape(e.id)}`))
        .filter((e): e is HTMLElement => !!e);
      const atBottom =
        scrollY > 0 && scrollY + innerHeight >= document.documentElement.scrollHeight - 2;
      const at = atBottom
        ? targets.at(-1)
        : (targets.filter((e) => e.getBoundingClientRect().top <= 180).at(-1) ?? targets[0]);
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
  }, [entries, style]);
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
            <span className="preview-outline-number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{entry.title}</span>
          </a>
        </li>
      ))}
    </ol>
  );
  return (
    <div className="style-preview-layout" data-lesson-layout={lesson.id}>
      <aside className="preview-outline-desktop">
        <nav aria-label={S.outlineTitle}>
          <p>{S.outlineTitle}</p>
          {links()}
        </nav>
      </aside>
      <div className="style-preview-body">
        <details className="preview-outline-mobile" ref={mobile}>
          <summary>{S.outlineDisclosure}</summary>
          <nav aria-label={S.outlineTitle}>{links()}</nav>
        </details>
        <div className="style-preview-content" ref={body}>
          {children}
        </div>
      </div>
    </div>
  );
}
