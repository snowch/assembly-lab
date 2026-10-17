// Copyright © 2026 Christopher Snow

// A few words of the lesson's that appear only once a challenge has been passed: the learner's saved
// work for the challenge is graded afresh, as the adder's is, and until it passes nothing is drawn.
// The words come from the lesson's data, so they are the lesson's own and checked with the rest.

import { z } from "zod";

import { Prose, useStored } from "@platform/lesson-runtime";

import { passedChallenge } from "./gate";
import { withProps } from "./props";

const Props = z.object({
  /** The id of a challenge in this lesson. */
  afterChallenge: z.string(),
  /** Markdown: what to say once the saved work for the challenge passes its tests. */
  text: z.string().min(1),
});

export const ChallengeNote = withProps(Props, function ChallengeNote({ data, store, lesson }) {
  const stored = useStored(store);
  if (!passedChallenge(lesson, stored, data.afterChallenge)) return null;
  return <Prose markdown={data.text} className="al-challenge-note" />;
});
