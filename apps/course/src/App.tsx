// Copyright © 2026 Christopher Snow

// The course shell: header, routes, footer. Lessons render through the platform's runtime with
// the course's book; the shell itself knows nothing about the machine. The front page lists the
// plan, a lesson address shows the lesson with a way back, and an address with no lesson says so.

import { useCallback, useEffect, useMemo } from "react";

import { prepareViewHandoff, clearViewHandoff } from "@al/views";
import { WHERE_NEXT } from "@al/content";
import { LessonView, Prose } from "@platform/lesson-runtime";

import { createBook } from "./book";
import { BUILD_VERSION, commitHref } from "./build-version";
import { AppStatus } from "./AppStatus";
import { STATUS_STRINGS } from "./strings.status";
import { useOffline } from "./offline";
import { updateStorage } from "./update-storage";
import { LessonCompletionStore, orderLessons, useLessonCompletion } from "./lesson-completion";
import { LessonCompletionButton } from "./LessonCompletionButton";
import { WhereNextPage } from "./pages/WhereNextPage";
import { FrontPage } from "./pages/FrontPage";
import { lessonHref, pageTitle, useRoute } from "./route";
import { RUNTIME_STRINGS } from "./runtime-strings";
import { COMPANION_LINKS, STRINGS } from "./strings";
import { clearThemeUpdate, saveThemeForUpdate, useTheme, type Theme } from "./theme";

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
  const persistence = useMemo(updateStorage, []);
  const book = useMemo(() => createBook(), []);
  const completionStore = useMemo(
    () =>
      new LessonCompletionStore(
        persistence,
        book.lessons.map((lesson) => lesson.id),
      ),
    [persistence, book],
  );
  const completion = useLessonCompletion(completionStore);
  const route = useRoute();
  const [theme, setTheme] = useTheme();
  const canReload = useCallback(
    () =>
      !document.querySelector('[aria-busy="true"], [data-app-busy="true"]') &&
      persistence.saved() &&
      prepareViewHandoff() &&
      saveThemeForUpdate(theme),
    [persistence, theme],
  );
  const offline = useOffline(canReload, () => {
    clearThemeUpdate();
    clearViewHandoff();
  });
  const storage = persistence.storage;
  // The tab names the page, so a reader with several pages open can tell them apart.
  useEffect(() => {
    document.title = pageTitle(
      route,
      book.title,
      (id) => book.lessons.find((l) => l.id === id)?.title,
    );
  }, [route, book]);

  let page: React.ReactNode;
  if (route.kind === "front") page = <FrontPage completion={completion} />;
  else if (route.kind === "where-next") page = <WhereNextPage />;
  else if (route.kind === "lesson") {
    const lesson = book.lessons.find((l) => l.id === route.id);
    // The lessons in course order: module first, then the module's own order.
    const ordered = orderLessons(book.lessons);
    const at = lesson ? ordered.findIndex((l) => l.id === lesson.id) : -1;
    const previous = ordered[at - 1];
    const next = ordered[at + 1];
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
        {lesson.module === 9 && next?.module !== 9 && (
          <aside className="where-next-after-calls">
            <Prose markdown={WHERE_NEXT.afterCalls} />
          </aside>
        )}
        <nav className="lesson-nav" aria-label={STRINGS.lessonNav}>
          {previous ? (
            <a className="lesson-nav-link" data-direction="previous" href={lessonHref(previous.id)}>
              <span className="lesson-nav-direction">{STRINGS.previousLesson}</span>
              <span className="lesson-nav-title">{previous.title}</span>
            </a>
          ) : (
            <span />
          )}
          <div className="lesson-nav-forward">
            <LessonCompletionButton store={completionStore} lessonId={lesson.id} />
            {next ? (
              <a className="lesson-nav-link" data-direction="next" href={lessonHref(next.id)}>
                <span className="lesson-nav-direction">{STRINGS.nextLesson}</span>
                <span className="lesson-nav-title">{next.title}</span>
              </a>
            ) : null}
          </div>
        </nav>
        <p id="lesson-completion-note" className="lesson-completion-note" role="status">
          {completion.unsaved ? STRINGS.completion.unsaved : STRINGS.completion.saved}
        </p>
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
      {offline?.updating && (
        <p className="update-progress" role="status">
          {STATUS_STRINGS.restarting}
        </p>
      )}
      <header className="shell-header" inert={offline?.updating}>
        <a className="brand" href="#/">
          {STRINGS.title}
        </a>
        <AppStatus offline={offline} />
        <label className="theme-picker">
          <span>{STRINGS.theme}</span>
          <select value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
            <option value="auto">{STRINGS.themeAuto}</option>
            <option value="light">{STRINGS.themeLight}</option>
            <option value="dark">{STRINGS.themeDark}</option>
          </select>
        </label>
      </header>
      <main id="main" className="shell-main" tabIndex={-1} inert={offline?.updating}>
        {page}
      </main>
      <footer className="shell-footer" inert={offline?.updating}>
        <p className="footer-next">
          <a href="#/where-next">{WHERE_NEXT.linkLabel}</a>
        </p>
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
              <a href={COMPANION_LINKS.bitLab}>{STRINGS.companions.bitLab}</a>
            </li>
            <li>
              <a href={COMPANION_LINKS.hub}>{STRINGS.companions.hub}</a>
            </li>
          </ul>
        </nav>
        <p className="copyright">{STRINGS.copyright}</p>
        {BUILD_VERSION && (
          <p className="build-version">
            {STRINGS.version.commit}{" "}
            <a href={commitHref(BUILD_VERSION.sha)}>{BUILD_VERSION.sha.slice(0, 7)}</a>
            {" · "}
            {STRINGS.version.committed}{" "}
            <time dateTime={BUILD_VERSION.committedAt}>
              {BUILD_VERSION.committedAt.slice(0, 10)}
            </time>{" "}
            {STRINGS.version.utc}
          </p>
        )}
      </footer>
    </>
  );
}
