// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { LessonView, memoryStorage } from "@platform/lesson-runtime";
import { LESSONS } from "@al/content";
import { createBook } from "./book";
import {
  createLessonReferences,
  LessonLink,
  LessonReferenceProvider,
  numberLessonMarkdown,
} from "./lesson-references";

const lessons = [
  { id: "later", title: "Later reading", module: 1, order: 80 },
  { id: "earlier", title: "Earlier reading", module: 1, order: 20 },
  { id: "appendix-a", title: "Optional A", module: 14, order: 0 },
  { id: "appendix-b", title: "Optional B", module: 15, order: 0 },
];
const references = createLessonReferences(lessons, { 14: "A", 15: "B" });

it("derives one-based ordinals from published module order, including insertion and reordering", () => {
  expect(references.label("later")).toBe("M1, L2: Later reading");
  expect(references.label("appendix-a")).toBe("MA, L1: Optional A");
  expect(references.position("appendix-b")).toBe("Module B, lesson 1");
  expect(references.linkPosition("appendix-b")).toBe("MB, L1");
  const reordered = createLessonReferences([
    ...lessons,
    { id: "new", title: "New", module: 1, order: 50 },
  ]);
  expect(reordered.position("later")).toBe("Module 1, lesson 3");
  expect(
    createLessonReferences(
      lessons.map((lesson) => (lesson.id === "later" ? { ...lesson, order: 1 } : lesson)),
    ).position("later"),
  ).toBe("Module 1, lesson 1");
  expect(lessons[0]?.id).toBe("later");
});

it("numbers actual Markdown links without changing URLs, code, external links or authored wording", () => {
  const source =
    "[**Read** it](#/lesson/later?view=bits#section) [Elsewhere](https://example.com/#/lesson/later) [Unknown](#/lesson/missing) ` [Code](#/lesson/later) `\n\n```md\n[Fenced](#/lesson/later)\n```";
  const expected = source.replace("[**Read** it]", "[M1, L2: **Read** it]");
  expect(references.markdown(source)).toBe(expected);
  expect(references.markdown(expected)).toBe(expected);
  expect(references.markdown("[Module 1, lesson 2: **Read** it](#/lesson/later)")).toBe(
    "[M1, L2: **Read** it](#/lesson/later)",
  );
  for (const title of ["More", "M1", "Module 1"]) {
    const source = `[${title}](#/lesson/later), L2: keep this wording`;
    expect(references.markdown(source)).toBe(
      `[M1, L2: ${title}](#/lesson/later), L2: keep this wording`,
    );
  }
  const { container } = render(
    <LessonReferenceProvider references={references}>
      <LessonLink href="#/lesson/later#section">Read it</LessonLink>
      <LessonLink href="https://example.com/#/lesson/later">External</LessonLink>
    </LessonReferenceProvider>,
  );
  expect(screen.getByRole("link", { name: "M1, L2: Read it" })).toHaveAttribute(
    "href",
    "#/lesson/later#section",
  );
  expect(container.querySelector('a[href^="https"]')).toHaveTextContent("External");
});

it("keeps reference-link targets when their visible labels change", () => {
  for (const link of ["[Reading][readings]", "[readings]", "[readings][]"]) {
    const source = `${link}\n\n[readings]: #/lesson/later#section`;
    const numbered = references.markdown(source);
    expect(numbered).toContain("[M1, L2: ");
    expect(numbered).toContain("[readings]: #/lesson/later#section");
    expect(references.markdown(numbered)).toBe(numbered);
  }
});

it("replaces legacy module-only appendix labels with one complete position", () => {
  const source =
    "[Return to Module 1: Signed and unsigned readings](#/lesson/later)\n[Module 1: Subtraction flags and negation](#/lesson/earlier)";
  const numbered = references.markdown(source);
  expect(numbered).toBe(
    "[M1, L2: Signed and unsigned readings](#/lesson/later)\n[M1, L1: Subtraction flags and negation](#/lesson/earlier)",
  );
  expect(references.markdown(numbered)).toBe(numbered);
});

it("clones Markdown render fields while preserving lesson identity, artifacts and opaque props", () => {
  const source = LESSONS[0]!;
  const link = "[Read it](#/lesson/later)";
  const lesson = {
    ...source,
    sections: [
      {
        ...source.sections[0]!,
        prose: link,
        details: { summary: "Details", prose: link },
        interactives: [
          {
            id: "note",
            kind: "challenge-note",
            caption: "Caption",
            timeModel: "none",
            props: {
              text: link,
              id: link,
              nested: { body: link, program: { text: link }, text: link },
            },
          },
        ],
      },
    ],
    challenges: [
      { ...LESSONS.find((lesson) => lesson.challenges.length)!.challenges[0]!, task: link },
    ],
  };
  const numbered = numberLessonMarkdown(lesson, references);
  expect(numbered.title).toBe(lesson.title);
  expect(numbered.id).toBe(lesson.id);
  expect(numbered.sections[0]?.details?.prose).toContain("M1, L2");
  const props = numbered.sections[0]!.interactives[0]!.props;
  expect(props.text).toContain("M1, L2");
  expect(props.id).toBe(link);
  expect(props.nested).toEqual({
    body: references.markdown(link),
    program: { text: link },
    text: link,
  });
  expect(numbered.challenges[0]!.initial).toBe(lesson.challenges[0]!.initial);
  expect(numbered.challenges[0]!.tests).toBe(lesson.challenges[0]!.tests);
  expect(lesson.sections[0]!.prose).toBe(link);
});

it("renders numbered prerequisite anchors while keeping the lesson heading and author data unchanged", () => {
  const source = { ...LESSONS[1]!, prerequisites: [LESSONS[0]!.id] };
  const authorProse = JSON.stringify(LESSONS);
  const book = createBook({ title: "Course", lessons: [LESSONS[0]!, source] });
  const lesson = book.lessons.find((lesson) => lesson.id === source.id)!;
  render(
    <LessonView
      book={{ ...book, lessons: book.referenceLessons }}
      lesson={{
        ...lesson,
        sections: [{ ...lesson.sections[0]!, interactives: [] }],
        challenges: [],
      }}
      storage={memoryStorage()}
      lessonHref={(id) => `#/lesson/${id}`}
    />,
  );
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(source.title);
  expect(
    screen.getByRole("link", { name: book.references.label(source.prerequisites[0]!) }),
  ).toHaveAttribute("href", `#/lesson/${source.prerequisites[0]}`);
  expect(JSON.stringify(LESSONS)).toBe(authorProse);
});
