// Copyright © 2026 Christopher Snow

import { LESSONS } from "@al/content";
import { pacingOrigins } from "../../content/lessons/pacing";

/** Resolve an existing activity's published page after its authoring group is split. */
export function lessonForFigure(source: string, figureId: string): string {
  const lesson = LESSONS.find(
    (lesson) =>
      (pacingOrigins.get(lesson.id) ?? lesson.id) === source &&
      lesson.sections.some((section) =>
        section.interactives.some((figure) => figure.id === figureId),
      ),
  );
  if (!lesson) throw new Error(`${source}: no published page owns figure ${figureId}`);
  return lesson.id;
}

export function lessonForChallenge(source: string, challengeId: string): string {
  const lesson = LESSONS.find(
    (lesson) =>
      (pacingOrigins.get(lesson.id) ?? lesson.id) === source &&
      lesson.challenges.some((challenge) => challenge.id === challengeId),
  );
  if (!lesson) throw new Error(`${source}: no published page owns challenge ${challengeId}`);
  return lesson.id;
}
