// Copyright © 2026 Christopher Snow

// The course shell: header, routes, footer. Lessons render through the platform's runtime with
// the course's book; the shell itself knows nothing about the machine. The front page lists the
// plan, a lesson address shows the lesson with a way back, and an address with no lesson says so.

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import {
  FlagsLesson,
  InstructionHelpProvider,
  type InstructionHelpRequest,
  prepareViewHandoff,
  clearViewHandoff,
  LessonProse,
  LessonReferenceProvider,
} from "@al/views";
import { WHERE_NEXT } from "@al/content";
import { LessonView } from "@platform/lesson-runtime";

import { createBook, COURSE_SOURCES } from "./book";
import { LessonSourceReferences } from "./LessonSourceReferences";
import { HeaderCalculator } from "./HeaderCalculator";
import { HeaderInstructionReference, type ReferenceRequest } from "./HeaderInstructionReference";
import { THEME_TITLE } from "./strings.instruction-reference";
import { CourseNavigation } from "./CourseNavigation";
import { LAYOUT_STRINGS as L } from "./strings.layout";
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
import { GITHUB_REPOSITORY, STRINGS } from "./strings";
import { clearThemeUpdate, saveThemeForUpdate, useTheme, type Theme } from "./theme";
import { LessonLayout } from "./LessonLayout";
import { MaterialSymbol } from "./MaterialSymbol";

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
  const unsavedWork = useSyncExternalStore(persistence.subscribe, persistence.hasUnsavedWork);
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
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [referenceRequest, setReferenceRequest] = useState<ReferenceRequest | null>(null);
  const [activeChallengeId, rememberChallenge] = useState<string>();
  const referenceFocus = useRef<HTMLElement | null>(null);
  const shellHeader = useRef<HTMLElement>(null);
  const requestSerial = useRef(0);
  useLayoutEffect(() => {
    const header = shellHeader.current;
    if (!header) return;
    const root = document.documentElement;
    const previous = root.style.getPropertyValue("--course-header-height");
    let active = true;
    const measure = () => {
      if (!active) return;
      const height = header.getBoundingClientRect().height;
      if (height > 0) root.style.setProperty("--course-header-height", `${height}px`);
    };
    measure();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    observer?.observe(header);
    window.addEventListener("resize", measure);
    void document.fonts?.ready.then(measure);
    return () => {
      active = false;
      observer?.disconnect();
      window.removeEventListener("resize", measure);
      if (previous) root.style.setProperty("--course-header-height", previous);
      else root.style.removeProperty("--course-header-height");
    };
  }, []);
  const currentLesson =
    route.kind === "lesson" ? book.lessons.find((item) => item.id === route.id) : undefined;
  const openReference = useCallback((request: InstructionHelpRequest) => {
    referenceFocus.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setCalculatorOpen(false);
    setReferenceRequest({ ...request, serial: ++requestSerial.current });
  }, []);
  const closeReference = useCallback(() => {
    setReferenceRequest(null);
    referenceFocus.current?.focus({ preventScroll: true });
  }, []);
  const changeCalculator = useCallback((open: boolean) => {
    if (open) setReferenceRequest(null);
    setCalculatorOpen(open);
  }, []);
  const instructionHelp = useMemo(
    () => ({ open: openReference, rememberChallenge }),
    [openReference],
  );
  useEffect(() => {
    setReferenceRequest(null);
    rememberChallenge(undefined);
  }, [currentLesson?.id]);
  const themeName =
    theme === "auto"
      ? STRINGS.themeAuto
      : theme === "light"
        ? STRINGS.themeLight
        : STRINGS.themeDark;
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

  const flagsLayout = route.kind === "lesson" && route.id === "adding-and-the-flags";
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
    const lessonBody = lesson ? (
      <>
        <p className="lesson-back">
          <a className="back-link" href="#/">
            {STRINGS.backToPlan}
          </a>
        </p>
        {!flagsLayout && <p className="lesson-position">{book.references.position(lesson.id)}</p>}
        {flagsLayout ? (
          <FlagsLesson
            book={book}
            lesson={lesson}
            storage={storage}
            strings={RUNTIME_STRINGS}
            instructionIntroductions={COURSE_SOURCES.get(lesson.id)!.introductions}
          />
        ) : (
          <LessonView
            key={lesson.id}
            book={{ ...book, lessons: book.referenceLessons }}
            lesson={lesson}
            storage={storage}
            lessonHref={lessonHref}
            strings={RUNTIME_STRINGS}
          />
        )}
      </>
    ) : null;
    page = lesson ? (
      <>
        <LessonLayout key={lesson.id} lesson={lesson}>
          {lessonBody}
        </LessonLayout>
        {lesson.module === 9 && next?.module !== 9 && (
          <aside className="where-next-after-calls">
            <LessonProse markdown={WHERE_NEXT.afterCalls} />
          </aside>
        )}
        <div className="lesson-ending">
          <LessonSourceReferences
            key={lesson.id}
            sources={COURSE_SOURCES.get(lesson.id)!}
            lessonTitle={lesson.title}
          />
          <div className="lesson-completion-row">
            <LessonCompletionButton store={completionStore} lessonId={lesson.id} />
            <p id="lesson-completion-note" className="lesson-completion-note" role="status">
              {completion.unsaved ? STRINGS.completion.unsaved : STRINGS.completion.saved}
            </p>
          </div>
          <nav className="lesson-nav" aria-label={STRINGS.lessonNav}>
            {previous ? (
              <a
                className="lesson-nav-link"
                data-direction="previous"
                href={lessonHref(previous.id)}
              >
                <span className="lesson-nav-direction">
                  <span aria-hidden="true">←</span> {STRINGS.previousLesson}
                </span>
                <span className="lesson-nav-title">{book.references.label(previous.id)}</span>
              </a>
            ) : (
              <a className="lesson-nav-link" data-direction="previous" href="#/">
                <span className="lesson-nav-direction">{L.courseOverview}</span>
                <span className="lesson-nav-title">{STRINGS.footer.chooseLesson}</span>
              </a>
            )}
            {next ? (
              <a className="lesson-nav-link" data-direction="next" href={lessonHref(next.id)}>
                <span className="lesson-nav-direction">
                  {STRINGS.nextLesson} <span aria-hidden="true">→</span>
                </span>
                <span className="lesson-nav-title">{book.references.label(next.id)}</span>
              </a>
            ) : (
              <a className="lesson-nav-link" data-direction="next" href="#/">
                <span className="lesson-nav-direction">{L.courseOverview}</span>
                <span className="lesson-nav-title">{STRINGS.footer.chooseLesson}</span>
              </a>
            )}
          </nav>
        </div>
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
    <InstructionHelpProvider value={instructionHelp}>
      <LessonReferenceProvider references={book.references}>
        <a className="skip-link" href="#main" onClick={skipToContent}>
          {STRINGS.skip}
        </a>
        {offline?.updating && (
          <p className="update-progress" role="status">
            {STATUS_STRINGS.restarting}
          </p>
        )}
        <header className="shell-header" ref={shellHeader} inert={offline?.updating}>
          <a className="brand" href="#/" aria-label={STRINGS.title}>
            <span>{STRINGS.title}</span>
          </a>
          <AppStatus offline={offline} />
          <HeaderCalculator
            updating={offline?.updating}
            open={calculatorOpen}
            onOpenChange={changeCalculator}
          />
          <HeaderInstructionReference
            lesson={currentLesson}
            request={referenceRequest}
            activeChallengeId={activeChallengeId}
            onOpen={openReference}
            onClose={closeReference}
            updating={offline?.updating}
          />
          <label className="theme-picker" title={THEME_TITLE(themeName)}>
            <span>{STRINGS.theme}</span>
            <MaterialSymbol
              name={theme === "auto" ? "contrast" : theme === "light" ? "light_mode" : "dark_mode"}
            />
            <select value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
              <option value="auto">{STRINGS.themeAuto}</option>
              <option value="light">{STRINGS.themeLight}</option>
              <option value="dark">{STRINGS.themeDark}</option>
            </select>
          </label>
        </header>
        <div className="work-save-notice" role="status">
          {unsavedWork ? STRINGS.workNotSaved : ""}
        </div>
        <main id="main" className="shell-main" tabIndex={-1} inert={offline?.updating}>
          {currentLesson && <CourseNavigation lesson={currentLesson} completion={completion} />}
          {page}
        </main>
        <footer className="shell-footer" inert={offline?.updating}>
          <p className="copyright">{STRINGS.copyright}</p>
          <nav aria-label={STRINGS.footer.label}>
            <ul className="footer-links">
              <li>
                <a href="#/where-next">{WHERE_NEXT.linkLabel}</a>
              </li>
              <li>
                <a href={GITHUB_REPOSITORY}>{L.sourceFooter}</a>
              </li>
              <li>
                <a href={`${GITHUB_REPOSITORY}/blob/main/docs/sources.md`}>
                  {STRINGS.footer.licences}
                </a>
              </li>
              <li>
                <a href={`${GITHUB_REPOSITORY}/issues`}>{STRINGS.footer.report}</a>
              </li>
            </ul>
          </nav>
        </footer>
      </LessonReferenceProvider>
    </InstructionHelpProvider>
  );
}
