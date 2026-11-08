// Copyright © 2026 Christopher Snow

// Course positions come from published lesson order, never from an authored cross-reference.
// Markdown source positions let us add visible labels without rewriting URLs or code examples.
import { createContext, useContext, type ComponentProps, type ReactNode } from "react";
import { fromMarkdown } from "mdast-util-from-markdown";
import { Prose } from "@platform/lesson-runtime";
import type { Lesson } from "@platform/lesson-schema";
import { REFERENCE_STRINGS as S } from "./strings.references";

export interface ReferenceLesson {
  readonly id: string;
  readonly title: string;
  readonly module: number;
  readonly order: number;
}

export function orderLessons<T extends { module: number; order: number }>(
  lessons: readonly T[],
): T[] {
  return [...lessons].sort((a, b) => a.module - b.module || a.order - b.order);
}

// Replace legacy and already formatted prefixes with the destination's current position.
const numberedPrefix =
  /^(?:M[^,\n]+, L\d+|Module [^,\n]+, lesson \d+|(?:Return to )?Module (?:\d+|[AB])):\s*/;
const lessonId = (href: string): string | undefined =>
  /^#\/lesson\/([a-z][a-z0-9-]*)\/?(?=$|[?#])/.exec(href)?.[1];

export function createLessonReferences(
  lessons: readonly ReferenceLesson[],
  moduleLabels: Readonly<Record<number, string>> = {},
) {
  const ordinal = new Map<number, number>();
  const byId = new Map(
    orderLessons(lessons).map((lesson) => {
      const number = (ordinal.get(lesson.module) ?? 0) + 1;
      ordinal.set(lesson.module, number);
      const module = moduleLabels[lesson.module] ?? String(lesson.module);
      return [
        lesson.id,
        {
          ...lesson,
          number,
          position: S.position(module, number),
          linkPosition: S.linkPosition(module, number),
        },
      ];
    }),
  );
  const position = (id: string) => byId.get(id)?.position;
  const linkPosition = (id: string) => byId.get(id)?.linkPosition;
  const label = (id: string, title = byId.get(id)?.title ?? id): string => {
    const at = linkPosition(id);
    return at ? S.label(at, title.replace(numberedPrefix, "")) : title;
  };
  const markdown = (source: string): string => {
    if (!source.includes("#/lesson/")) return source;
    const tree = fromMarkdown(source);
    const definitions = new Map<string, string>();
    const edits: { start: number; end: number; text: string }[] = [];
    type Node = (typeof tree)["children"][number] | typeof tree;
    const visit = (node: Node, apply: (node: Node) => void) => {
      apply(node);
      if ("children" in node) for (const child of node.children) visit(child as Node, apply);
    };
    visit(tree, (node) => {
      if (node.type === "definition") definitions.set(node.identifier, node.url);
    });
    visit(tree, (node) => {
      const href =
        node.type === "link"
          ? node.url
          : node.type === "linkReference"
            ? definitions.get(node.identifier)
            : undefined;
      const id = href && lessonId(href);
      const at = id && linkPosition(id);
      if (!at || node.position?.start.offset === undefined) return;
      const start = node.position.start.offset + 1;
      const existing = numberedPrefix.exec(source.slice(start))?.[0] ?? "";
      edits.push({ start, end: start + existing.length, text: S.prefix(at) });
      if (node.type === "linkReference" && node.referenceType !== "full") {
        // A changed visible label needs the original reference key spelled out.
        const end = node.position.end.offset!;
        const labelEnd = end - (node.referenceType === "collapsed" ? 3 : 1);
        const key = source.slice(start, labelEnd);
        edits.push({
          start: node.referenceType === "collapsed" ? end - 2 : end,
          end,
          text: `[${key}]`,
        });
      }
    });
    return edits
      .sort((a, b) => b.start - a.start)
      .reduce((text, edit) => text.slice(0, edit.start) + edit.text + text.slice(edit.end), source);
  };
  return { byId, position, linkPosition, label, markdown };
}

export type LessonReferences = ReturnType<typeof createLessonReferences>;

/** Clone render data only. Grading inputs, source programs and author records retain their identity. */
export function numberLessonMarkdown(lesson: Lesson, references: LessonReferences): Lesson {
  const markdown = references.markdown;
  const markdownFields = new Set([
    "prose",
    "intro",
    "question",
    "explain",
    "says",
    "note",
    "detail",
    "body",
    "boardNote",
    "segmentNote",
    "sectionDetails",
  ]);
  const propsMarkdown = (value: unknown, key = "", prose = false): unknown => {
    if (
      [
        "program",
        "source",
        "assembly",
        "listing",
        "c",
        "sourceLines",
        "initial",
        "reference",
        "tests",
      ].includes(key)
    )
      return value;
    const render = prose || markdownFields.has(key);
    if (typeof value === "string") return render ? markdown(value) : value;
    if (Array.isArray(value)) return value.map((item) => propsMarkdown(item, key, render));
    if (value && typeof value === "object")
      return Object.fromEntries(
        Object.entries(value).map(([key, item]) => [key, propsMarkdown(item, key, render)]),
      );
    return value;
  };
  return {
    ...lesson,
    objectives: lesson.objectives.map(markdown),
    modelVsReality: markdown(lesson.modelVsReality),
    sections: lesson.sections.map((section) => ({
      ...section,
      prose: markdown(section.prose),
      details: section.details
        ? { ...section.details, prose: markdown(section.details.prose) }
        : undefined,
      interactives: section.interactives.map((interactive) => ({
        ...interactive,
        lead: interactive.lead === undefined ? undefined : markdown(interactive.lead),
        after: interactive.after === undefined ? undefined : markdown(interactive.after),
        props: Object.fromEntries(
          Object.entries(interactive.props).map(([key, value]) => [
            key,
            propsMarkdown(value, key, interactive.kind === "challenge-note" && key === "text"),
          ]),
        ),
      })),
    })),
    challenges: lesson.challenges.map((challenge) => ({
      ...challenge,
      task: markdown(challenge.task),
      hints: challenge.hints.map(markdown) as typeof challenge.hints,
    })),
  };
}

const ReferencesContext = createContext<LessonReferences | undefined>(undefined);
export function LessonReferenceProvider({
  references,
  children,
}: {
  references: LessonReferences;
  children: ReactNode;
}) {
  return <ReferencesContext.Provider value={references}>{children}</ReferencesContext.Provider>;
}

/** For course-owned JSX anchors, including links inside figures rendered outside the app shell. */
export function LessonLink({ href, children, ...props }: ComponentProps<"a">) {
  const references = useContext(ReferencesContext);
  const id = href && lessonId(href);
  const at = id && references?.linkPosition(id);
  const words = typeof children === "string" ? children.replace(numberedPrefix, "") : children;
  return (
    <a {...props} href={href}>
      {at ? (
        <>
          {S.prefix(at)}
          {words}
        </>
      ) : (
        children
      )}
    </a>
  );
}

/** The same reference labels for ancillary course prose outside the lesson data. */
export function LessonProse(props: ComponentProps<typeof Prose>) {
  const references = useContext(ReferencesContext);
  return <Prose {...props} markdown={references?.markdown(props.markdown) ?? props.markdown} />;
}
