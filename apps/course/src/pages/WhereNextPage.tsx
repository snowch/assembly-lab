// Copyright © 2026 Christopher Snow

import { WHERE_NEXT, PLAYGROUND_STARTER } from "@al/content";
import { LessonProse as Prose, LessonReferenceProvider } from "@al/views";
import { COURSE_REFERENCES } from "../book";
import { COMPANION_LINKS, STRINGS } from "../strings";
import "../styles/where-next.css";

export function WhereNextPage() {
  const P = WHERE_NEXT;
  return (
    <LessonReferenceProvider references={COURSE_REFERENCES}>
      <p className="lesson-back">
        <a className="back-link" href="#/">
          {STRINGS.backToPlan}
        </a>
      </p>
      <article className="where-next-page" data-page="where-next">
        <h1>{P.title}</h1>
        <Prose markdown={P.lead} />
        <Prose markdown={P.preparation.prose} />
        <section aria-labelledby="playground-heading">
          <h2 id="playground-heading">{P.playground.title}</h2>
          <Prose markdown={P.playground.prose} />
          <Prose markdown={P.playground.beforeCode} />
          <pre className="where-next-starter" tabIndex={0} aria-label={P.playground.caption}>
            <code>{PLAYGROUND_STARTER}</code>
          </pre>
          <div className="where-next-actions">
            <a className="button secondary" href="examples/trip-playground.s" download>
              {P.playground.downloadLabel}
            </a>
            <a
              className="button primary"
              href="https://aarch64-playground.com/playground"
              target="_blank"
              rel="noopener noreferrer"
            >
              {P.playground.openLabel}
            </a>
          </div>
          <Prose markdown={P.playground.afterCode} />
          <ol className="where-next-steps">
            {P.playground.steps.map((step, i) => (
              <li key={i}>
                <Prose markdown={step} />
              </li>
            ))}
          </ol>
          <Prose markdown={P.limits.prose} />
        </section>
        <section aria-labelledby="extend-heading">
          <h2 id="extend-heading">{P.extend.title}</h2>
          <Prose markdown={P.extend.prose} />
        </section>
        <section aria-labelledby="routes-heading">
          <h2 id="routes-heading">{P.routes.title}</h2>
          <Prose markdown={P.routes.prose} />
        </section>
        <section aria-labelledby="companions-heading" className="where-next-companions">
          <h2 id="companions-heading">{STRINGS.companions.label}</h2>
          <p>
            {STRINGS.companions.intro.map((part, i) =>
              typeof part === "string" ? part : <em key={i}>{part.title}</em>,
            )}
          </p>
          <nav aria-label={STRINGS.companions.label}>
            <ul>
              <li>
                <a href={COMPANION_LINKS.digitalDesign}>{STRINGS.companions.digitalDesign}</a>
              </li>
              <li>
                <a href={COMPANION_LINKS.bitLab}>{STRINGS.companions.bitLab}</a>
              </li>
              <li>
                <a href={COMPANION_LINKS.hub}>{STRINGS.companions.hub}</a>
              </li>
            </ul>
          </nav>
        </section>
      </article>
    </LessonReferenceProvider>
  );
}
