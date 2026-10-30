// Copyright © 2026 Christopher Snow

import type { LessonInput } from "@platform/lesson-schema";

type Section = LessonInput["sections"][number];
export interface LessonPart {
  id: string;
  title: string;
  objectives: readonly string[];
  sections: Section[];
  introduces?: string[];
  challengeIds?: string[];
}

/** Authoring provenance, used to check that splitting does not lose exercises or figures. */
export const pacingOrigins = new Map<string, string>();

/** A published unit owns only the challenges mounted by its own figures. */
export function splitLesson(source: LessonInput, parts: readonly LessonPart[]): LessonInput[] {
  return parts.map((part, order) => {
    pacingOrigins.set(part.id, source.id);
    const mounted = new Set(
      part.sections.flatMap((section) =>
        (section.interactives ?? []).flatMap((figure) =>
          typeof figure.props?.["challengeId"] === "string" ? [figure.props["challengeId"]] : [],
        ),
      ),
    );
    for (const id of part.challengeIds ?? []) mounted.add(id);
    return {
      ...source,
      id: part.id,
      title: part.title,
      order,
      objectives: [...part.objectives],
      sectionLayout: "selected",
      showTimeModelNotes: false,
      introduces: part.introduces ?? (order === 0 ? source.introduces : []),
      sections: part.sections,
      challenges: (source.challenges ?? []).filter((challenge) => mounted.has(challenge.id)),
    };
  });
}

export function sectionOf(source: LessonInput, kind: Section["kind"]): Section {
  const section = source.sections.find((section) => section.kind === kind);
  if (!section) throw new Error(`${source.id}: missing ${kind}`);
  return section;
}
