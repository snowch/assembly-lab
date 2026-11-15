// Copyright © 2026 Christopher Snow

import { fromMarkdown } from "mdast-util-from-markdown";
import type { Lesson } from "@platform/lesson-schema";

export interface InstructionIntroduction {
  readonly mnemonic?: string;
  readonly url: string;
  readonly codePattern?: string;
}
const identity = (url: string) => url.split("?")[0]!;
function matches(code: string, reference: InstructionIntroduction) {
  const word = code
    .trim()
    .match(/^([a-z][a-z0-9]*(?:\.[a-z]+)?)(?=\s|$)/i)?.[1]
    ?.toLowerCase();
  if (!word || !reference.mnemonic) return false;
  const name = word.startsWith("b.") ? "b.cond" : word;
  const a32Conditional =
    reference.url.includes("/ddi0597/") &&
    new RegExp(`^${reference.mnemonic}(?:eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)$`, "i").test(
      word,
    );
  return (
    (name === reference.mnemonic || a32Conditional) &&
    (!reference.codePattern || new RegExp(reference.codePattern, "i").test(code))
  );
}
/** Link inline code only. Fenced/indented listings and existing Markdown links are never rewritten. */
export function linkInstructionMarkdown(
  markdown: string,
  references: readonly InstructionIntroduction[],
  linked = new Set<string>(),
): string {
  if (!references.some((entry) => entry.mnemonic && !linked.has(identity(entry.url))))
    return markdown;
  const edits: { start: number; end: number; replacement: string }[] = [];
  const visit = (
    node: ReturnType<typeof fromMarkdown>["children"][number] | ReturnType<typeof fromMarkdown>,
    inLink = false,
  ) => {
    const insideLink = inLink || node.type === "link" || node.type === "linkReference";
    if (node.type === "inlineCode" && !insideLink) {
      const reference = references.find(
        (entry) => !linked.has(identity(entry.url)) && matches(node.value, entry),
      );
      const start = node.position?.start.offset,
        end = node.position?.end.offset;
      if (reference && start !== undefined && end !== undefined) {
        linked.add(identity(reference.url));
        edits.push({
          start,
          end,
          replacement: `[${markdown.slice(start, end)}](${reference.url})`,
        });
      }
    }
    if ("children" in node) node.children.forEach((child) => visit(child, insideLink));
  };
  visit(fromMarkdown(markdown));
  for (const edit of edits.reverse())
    markdown = markdown.slice(0, edit.start) + edit.replacement + markdown.slice(edit.end);
  return markdown;
}
const TEACHING_FIELDS =
  /^(?:prose|intro|explain|says|note|detail|body|boardNote|segmentNote|sectionDetails|bareMetalNote)$/;
const SOURCE_FIELDS = new Set([
  "program",
  "source",
  "assembly",
  "listing",
  "c",
  "sourceLines",
  "initial",
  "reference",
  "tests",
  "options",
  "question",
  "answers",
  "hints",
]);
/** Clone presentation Markdown, preserving all program, grading and answer objects. */
export function linkLessonInstructionIntroductions(
  lesson: Lesson,
  references: readonly InstructionIntroduction[],
  linked = new Set<string>(),
): Lesson {
  const markdown = (text: string) => linkInstructionMarkdown(text, references, linked);
  const props = (value: unknown, key = ""): unknown => {
    if (SOURCE_FIELDS.has(key)) return value;
    if (typeof value === "string") return TEACHING_FIELDS.test(key) ? markdown(value) : value;
    if (Array.isArray(value)) return value.map((item) => props(item, key));
    if (value && typeof value === "object")
      return Object.fromEntries(
        Object.entries(value).map(([name, item]) => [name, props(item, name)]),
      );
    return value;
  };
  return {
    ...lesson,
    sections: lesson.sections.map((section) => ({
      ...section,
      prose: markdown(section.prose),
      ...(section.details &&
      !/^(answer|compare your answer|solution)$/i.test(section.details.summary)
        ? { details: { ...section.details, prose: markdown(section.details.prose) } }
        : {}),
      interactives: section.interactives.map((interactive) => ({
        ...interactive,
        ...(interactive.lead === undefined ? {} : { lead: markdown(interactive.lead) }),
        props: Object.fromEntries(
          Object.entries(interactive.props).map(([key, value]) => [key, props(value, key)]),
        ),
        ...(interactive.after === undefined ? {} : { after: markdown(interactive.after) }),
      })),
    })),
  };
}
/** The custom flags page has an explicit authored introduction slot instead of Markdown. */
export function linkInstructionIntroductionHtml(
  html: string,
  references: readonly InstructionIntroduction[],
): string {
  const escape = (value: string) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  return html.replace(
    /<code data-instruction-introduction="([a-z]+)">([^<]+)<\/code>/g,
    (code, name: string) => {
      const ref = references.find((entry) => entry.mnemonic === name);
      return ref
        ? `<a class="instruction-reference-link" href="${escape(ref.url)}">${code}</a>`
        : code;
    },
  );
}
