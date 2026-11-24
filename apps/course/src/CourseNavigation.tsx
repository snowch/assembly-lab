// Copyright © 2026 Christopher Snow

import { useEffect, useRef, useState } from "react";
import type { Lesson } from "@platform/lesson-schema";
import { LESSONS } from "@al/content";
import { PLAN, lessonsOf } from "@al/content/plan";
import { orderLessons, type LessonCompletion } from "./lesson-completion";
import { lessonHref } from "./route";
import { STRINGS } from "./strings";
import { COURSE_REFERENCES } from "./book";
import { LAYOUT_STRINGS as S } from "./strings.layout";
import { MaterialSymbol } from "./MaterialSymbol";

/** Course navigation is independent of the mounted lesson and its simulator state. */
export function CourseNavigation({
  lesson,
  completion,
}: {
  lesson: Lesson;
  completion: LessonCompletion;
}) {
  const trigger = useRef<HTMLButtonElement>(null);
  const [expanded, setExpanded] = useState(false);
  const modules = PLAN.flatMap((part) => part.modules);
  const current = modules.find((module) => module.lessonModule === lesson.module);
  useEffect(() => {
    setExpanded(false);
  }, [lesson.id]);
  return (
    <section
      className="course-location"
      aria-label={S.courseLessons}
      onKeyDown={(event) => {
        if (event.key === "Escape" && expanded) {
          event.preventDefault();
          setExpanded(false);
          trigger.current?.focus();
        }
      }}
    >
      <div className="course-location-row">
        <button
          ref={trigger}
          type="button"
          className="course-lesson-trigger"
          aria-expanded={expanded}
          aria-controls="course-lesson-panel"
          onClick={() => setExpanded(!expanded)}
        >
          {S.courseLessons}
          <MaterialSymbol name="expand_more" className="course-outline-chevron" />
        </button>
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
                  setExpanded(true);
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
      <div id="course-lesson-panel" className="course-lesson-panel" hidden={!expanded}>
        <a href="#/" onClick={() => setExpanded(false)}>
          {S.courseOverview}
        </a>
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
                      onClick={() => {
                        setExpanded(false);
                        if (item.id === lesson.id) trigger.current?.focus();
                      }}
                      aria-current={item.id === lesson.id ? "page" : undefined}
                    >
                      <span>{COURSE_REFERENCES.label(item.id)}</span>
                      {completion.completed.has(item.id) && (
                        <span className="course-outline-complete">
                          <MaterialSymbol name="check" />
                          <span className="visually-hidden">{STRINGS.completion.marked}</span>
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
