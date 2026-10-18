// Copyright © 2026 Christopher Snow

// The course shell: header, routes, footer. Lessons render through the platform's runtime with
// the course's book; the shell itself knows nothing about the machine. The front page lists the
// plan, a lesson address shows the lesson with a way back, and an address with no lesson says so.

import { useEffect, useMemo } from "react";

import { browserStorage, LessonView } from "@platform/lesson-runtime";

import { createBook } from "./book";
import { useOffline } from "./offline";
import { FrontPage } from "./pages/FrontPage";
import { lessonHref, pageTitle, useRoute } from "./route";
import { RUNTIME_STRINGS } from "./runtime-strings";
import { COMPANION_LINKS, STRINGS } from "./strings";
import { useTheme, type Theme } from "./theme";

/**
 * The skip link moves focus to the main content and leaves the address alone: its `#main` is not a
 * route, and following it would replace the page with "no page at this address". A keyboard's
 * Enter on a link is a click, so this serves the keyboard and a screen reader alike.
 */
function skipToContent(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  document.getElementById("main")?.focus();
}

export function App() {
  const offline = useOffline();
  const route = useRoute();
  const [theme, setTheme] = useTheme();
  const storage = useMemo(() => browserStorage(), []);
  const book = useMemo(() => createBook(), []);
  // The tab names the page, so a reader with several pages open can tell them apart.
  useEffect(() => {
    document.title = pageTitle(
      route,
      book.title,
      (id) => book.lessons.find((l) => l.id === id)?.title,
    );
  }, [route, book]);

  let page: React.ReactNode;
  if (route.kind === "front") page = <FrontPage />;
  else if (route.kind === "lesson") {
    const lesson = book.lessons.find((l) => l.id === route.id);
    page = lesson ? (
      <>
        <p className="lesson-back">
          <a className="back-link" href="#/">
            {STRINGS.backToPlan}
          </a>
        </p>
        <LessonView
          key={lesson.id}
          book={book}
          lesson={lesson}
          storage={storage}
          lessonHref={lessonHref}
          strings={RUNTIME_STRINGS}
        />
      </>
    ) : (
      <>
        <h1>{STRINGS.noLesson(route.id)}</h1>
        <p>
          <a className="back-link" href="#/">
            {STRINGS.backToPlan}
          </a>
        </p>
      </>
    );
  } else {
    page = (
      <>
        <h1>{STRINGS.missing(route.path)}</h1>
        <p>
          <a className="back-link" href="#/">
            {STRINGS.backToPlan}
          </a>
        </p>
      </>
    );
  }

  return (
    <>
      <a className="skip-link" href="#main" onClick={skipToContent}>
        {STRINGS.skip}
      </a>
      <header className="shell-header">
        <a className="brand" href="#/">
          {STRINGS.title}
        </a>
        <label className="theme-picker">
          <span>{STRINGS.theme}</span>
          <select value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
            <option value="auto">{STRINGS.themeAuto}</option>
            <option value="light">{STRINGS.themeLight}</option>
            <option value="dark">{STRINGS.themeDark}</option>
          </select>
        </label>
      </header>
      <main id="main" className="shell-main" tabIndex={-1}>
        {page}
      </main>
      <footer className="shell-footer">
        {offline && (
          <div className="offline-status" data-offline={offline.state}>
            <p aria-live="polite">{STRINGS.offline[offline.state]}</p>
            {offline.updateWaiting && <p>{STRINGS.offline.updateWaiting}</p>}
            {offline.state === "ready" && (
              <>
                <p>{STRINGS.offline.limitations}</p>
                <p>{STRINGS.offline.storage}</p>
              </>
            )}
          </div>
        )}
        <p className="footer-intro">
          {STRINGS.companions.intro.map((part, i) =>
            typeof part === "string" ? part : <em key={i}>{part.title}</em>,
          )}
        </p>
        <nav aria-label={STRINGS.companions.label}>
          <ul className="footer-links">
            <li>
              <a href={COMPANION_LINKS.digitalDesign}>{STRINGS.companions.digitalDesign}</a>
            </li>
            <li>
              <a href={COMPANION_LINKS.notes}>{STRINGS.companions.notes}</a>
            </li>
            <li>
              <a href={COMPANION_LINKS.hub}>{STRINGS.companions.hub}</a>
            </li>
          </ul>
        </nav>
        <p className="copyright">{STRINGS.copyright}</p>
      </footer>
    </>
  );
}
