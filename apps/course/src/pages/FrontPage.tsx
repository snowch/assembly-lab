// Copyright © 2026 Christopher Snow

// The front page: the cover (the course's name, what it is), where the plan stands, and then the
// plan itself, listed from content/plan/plan.ts: each part with its modules, each module with its
// number, its title, one line on what the learner does, and its status.

import { LESSONS } from "@al/content";
import { PLAN, lessonsOf, statusOf } from "@al/content/plan";

import { lessonHref } from "../route";
import { STRINGS } from "../strings";
import { CoverFigure, MODULE_ICONS } from "./icons";

function Cover() {
  return (
    <section className="cover-hero" aria-labelledby="cover-title">
      <div className="cover-text">
        <h1 id="cover-title">{STRINGS.title}</h1>
        <p className="cover-subtitle">{STRINGS.subtitle}</p>
        <p className="cover-intro">{STRINGS.intro}</p>
      </div>
      <CoverFigure />
    </section>
  );
}

export function FrontPage() {
  return (
    <div className="front-column">
      <Cover />
      <div className="plan-status" role="note">
        <p>{STRINGS.statusNote}</p>
      </div>
      {PLAN.map((part) => (
        <section key={part.id} className="plan-part" aria-labelledby={`part-${part.id}`}>
          <h2 id={`part-${part.id}`}>{part.title}</h2>
          <ul className="plan-modules">
            {part.modules.map((m) => {
              // A module's status and its link come from the lessons that are written.
              const status = statusOf(m, LESSONS);
              const first = lessonsOf(m, LESSONS)[0];
              return (
                <li key={m.id} className="plan-module" data-module={m.id}>
                  <span className="module-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">{MODULE_ICONS[m.id]}</svg>
                  </span>
                  <h3>
                    <span className="module-number">{STRINGS.module(m.label)}</span>
                    <span className="module-title">
                      {first ? <a href={lessonHref(first.id)}>{m.title}</a> : m.title}
                    </span>
                  </h3>
                  <p className="module-line">{m.line}</p>
                  <span className="module-status" data-status={status}>
                    {STRINGS.status[status]}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
