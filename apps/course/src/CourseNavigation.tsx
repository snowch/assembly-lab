// Copyright © 2026 Christopher Snow

import { useEffect, useRef } from "react";
import type { Lesson } from "@platform/lesson-schema";
import { LESSONS } from "@al/content";
import { PLAN, lessonsOf } from "@al/content/plan";
import { orderLessons, type LessonCompletion } from "./lesson-completion";
import { lessonHref } from "./route";
import { STRINGS } from "./strings";
import { LAYOUT_STRINGS as S } from "./strings.layout";

/** Course navigation is independent of the mounted lesson and its simulator state. */
export function CourseNavigation({
  lesson,
  completion,
}: {
  lesson: Lesson;
  completion: LessonCompletion;
}) {
  const outline = useRef<HTMLDetailsElement>(null);
  const modules = PLAN.flatMap((part) => part.modules);
  const current = modules.find((module) => module.lessonModule === lesson.module);
  useEffect(() => {
    if (outline.current) outline.current.open = false;
  }, [lesson.id]);
  return (
    <section className="course-location" aria-label={S.courseLessons}>
      <div className="course-location-row">
        <details
          ref={outline}
          className="course-lesson-menu"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              if (outline.current) {
                outline.current.open = false;
                outline.current.querySelector("summary")?.focus();
              }
            }
          }}
        >
          <summary>{S.courseLessons}</summary>
          <div className="course-lesson-panel">
            <a href="#/">{S.courseOverview}</a>
            <div className="course-lesson-groups">
              {modules.map((module) => (
                <section key={module.id} id={"course-module-" + module.id}>
                  <h2>
                    {module.label} · {module.title}
                  </h2>
                  <ol>
                    {orderLessons(lessonsOf(module, LESSONS)).map((item) => (
                      <li key={item.id}>
                        <a
                          href={lessonHref(item.id)}
                          aria-current={item.id === lesson.id ? "page" : undefined}
                        >
                          <span>{item.title}</span>
                          {completion.completed.has(item.id) && (
                            <span aria-label={STRINGS.completion.marked}>✓</span>
                          )}
                        </a>
                      </li>
                    ))}
                  </ol>
                </section>
              ))}
            </div>
          </div>
        </details>
        <span className="course-location-progress">
          {S.completed(completion.completed.size, LESSONS.length)}
        </span>
        <nav className="course-location-crumbs" aria-label={S.breadcrumb}>
          {current && (
            <>
              <span aria-hidden="true">/</span>
              <button
                type="button"
                onClick={() => {
                  if (outline.current) outline.current.open = true;
                  requestAnimationFrame(() =>
                    document
                      .getElementById("course-module-" + current.id)
                      ?.scrollIntoView({ block: "nearest" }),
                  );
                }}
              >
                {current.title}
              </button>
            </>
          )}
          <span aria-hidden="true">/</span>
          <span aria-current="page">{lesson.title}</span>
        </nav>
      </div>
    </section>
  );
}
