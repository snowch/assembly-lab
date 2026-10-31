// Copyright © 2026 Christopher Snow

// The front page: the cover (the course's name, what it is), where the plan stands, and then the
// plan itself, listed from content/plan/plan.ts: each part with its modules, each module with its
// number, its title, one line on what the learner does, and its status.

import { LESSONS, WHERE_NEXT } from "@al/content";
import { PLAN, lessonsOf, statusOf } from "@al/content/plan";

import { lessonHref } from "../route";
import { STRINGS } from "../strings";
import { orderLessons, type LessonCompletion } from "../lesson-completion";
import { CoverFigure, MODULE_ICONS } from "./icons";
import "../styles/module-lessons.css";

/** Backticks become code, asterisks emphasis, and `[words](address)` a link: the only marks the front page's strings use. */
function Marked({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|`[^`]+`|\*[^*]+\*)/);
  return (
    <>
      {parts.map((p, i) => {
        // A link, `[words](address)`, whose words may hold the other marks.
        const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(p);
        if (link)
          return (
            <a key={i} href={link[2]}>
              <Marked text={link[1]!} />
            </a>
          );
        return p.startsWith("`") ? (
          <code key={i}>{p.slice(1, -1)}</code>
        ) : p.startsWith("*") ? (
          <em key={i}>{p.slice(1, -1)}</em>
        ) : (
          p
        );
      })}
    </>
  );
}

function BeforeYouStart() {
  const P = STRINGS.prereqs;
  return (
    <section className="prereqs" aria-labelledby="prereqs-title">
      <h2 id="prereqs-title">{P.heading}</h2>
      <p>{P.lead}</p>
      <details className="prereqs-details">
        <summary>{P.showDetails}</summary>
        <div className="prereqs-grid">
          <div className="prereqs-needs">
            <p>{P.cLead}</p>
            <ul>
              {P.cItems.map((item) => (
                <li key={item}>
                  <Marked text={item} />
                </li>
              ))}
            </ul>
            <p>
              <Marked text={P.cNot} />
            </p>
            <p>
              <Marked text={P.numbers} />
            </p>
            <p>{P.assembly}</p>
          </div>
          <div className="prereqs-check">
            <p>
              <Marked text={P.checkLead} />
            </p>
            <pre className="prereqs-code">
              <code>{P.checkCode}</code>
            </pre>
            <details className="prereqs-answer">
              <summary>{P.checkShow}</summary>
              <p>{P.checkAnswer}</p>
            </details>
          </div>
        </div>
        <p className="prereqs-further">
          <Marked text={P.further} />
        </p>
      </details>
    </section>
  );
}

const EMPTY_COMPLETION: LessonCompletion = { completed: new Set(), unsaved: false };

function CompletionMark() {
  return (
    <span className="lesson-complete-mark">
      {" "}
      <span aria-hidden="true">✓</span>
      <span className="visually-hidden">{STRINGS.completion.marked}</span>
    </span>
  );
}

function Cover({ completion }: { completion: LessonCompletion }) {
  const ordered = orderLessons(LESSONS);
  const firstUnfinished = ordered.find((lesson) => !completion.completed.has(lesson.id));
  const started = completion.completed.size > 0;
  return (
    <section className="cover-hero" aria-labelledby="cover-title">
      <div className="cover-text">
        <h1 id="cover-title">{STRINGS.title}</h1>
        <p className="cover-subtitle">{STRINGS.subtitle}</p>
        <p className="cover-intro">{STRINGS.intro}</p>
        {firstUnfinished ? (
          <a
            className={`cover-start${started ? " cover-continue" : ""}`}
            href={lessonHref(firstUnfinished.id)}
          >
            {started ? (
              <>
                <span>{STRINGS.completion.continue}</span>{" "}
                <span className="cover-continue-title">{firstUnfinished.title}</span>
              </>
            ) : (
              STRINGS.start
            )}
          </a>
        ) : (
          <p className="cover-all-complete">{STRINGS.completion.all}</p>
        )}
        {(started || completion.unsaved) && (
          <p className="cover-completion-note" role="status">
            {completion.unsaved ? STRINGS.completion.unsaved : STRINGS.completion.saved}
          </p>
        )}
      </div>
      <CoverFigure />
    </section>
  );
}

export function FrontPage({ completion = EMPTY_COMPLETION }: { completion?: LessonCompletion }) {
  return (
    <div className="front-column">
      <Cover completion={completion} />
      <BeforeYouStart />
      {PLAN.map((part) => (
        <section key={part.id} className="plan-part" aria-labelledby={`part-${part.id}`}>
          <h2 id={`part-${part.id}`}>{part.title}</h2>
          <ul className="plan-modules">
            {part.modules.map((m) => {
              // A module's status and its links come from the lessons that are written: a module
              // of one lesson links its title to it, and a module of several lists them.
              const status = statusOf(m, LESSONS);
              const lessons = lessonsOf(m, LESSONS);
              const first = lessons[0];
              const several = lessons.length > 1;
              return (
                <li key={m.id} className="plan-module" data-module={m.id}>
                  <span className="module-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">{MODULE_ICONS[m.id]}</svg>
                  </span>
                  <h3>
                    <span className="module-number">{STRINGS.module(m.label)}</span>
                    <span className="module-title">
                      {first && !several ? (
                        <a href={lessonHref(first.id)} data-lesson={first.id}>
                          {m.title}
                          {completion.completed.has(first.id) && <CompletionMark />}
                        </a>
                      ) : (
                        m.title
                      )}
                    </span>
                  </h3>
                  <p className="module-line">{m.line}</p>
                  {several && (
                    <ol className="module-lessons" aria-label={STRINGS.lessonsOf(m.title)}>
                      {lessons.map((l) => (
                        <li key={l.id} data-lesson={l.id}>
                          <a href={lessonHref(l.id)}>
                            {l.title}
                            {completion.completed.has(l.id) && <CompletionMark />}
                          </a>
                        </li>
                      ))}
                    </ol>
                  )}
                  {status !== "published" && (
                    <span className="module-status" data-status={status}>
                      {STRINGS.status[status]}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
      <section className="where-next-discovery" aria-labelledby="where-next-title">
        <h2 id="where-next-title">
          <a href="#/where-next">{WHERE_NEXT.linkLabel}</a>
        </h2>
        <p>
          <Marked text={WHERE_NEXT.directoryText} />
        </p>
      </section>
    </div>
  );
}
