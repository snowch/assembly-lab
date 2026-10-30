// Copyright © 2026 Christopher Snow

import type { LessonInput } from "@platform/lesson-schema";
import { splitLesson, sectionOf } from "./pacing";
import { pacing10A as COPY } from "./pacing-10-a.copy";
import { fromCToInstructions as trip } from "./from-c-to-instructions";
import { compileALoop as loop } from "./compile-a-loop";
import { cAndOverflow } from "./c-and-overflow";
import { checkedArithmetic as checked } from "./checked-arithmetic";
import { fromFunctionToExecutable as native } from "./from-function-to-executable";
import { debugNativeInstructions as debug } from "./debug-native-instructions";
import { PROSE as DEBUG_PROSE } from "./debug-native-instructions.prose";
import { raspberryPi5 as prep } from "./raspberry-pi-5";
import { raspberryPiBoot as pi } from "./raspberry-pi-boot";
import { sameCOnA32 as a32 } from "./same-c-on-a32";

type Section = LessonInput["sections"][number];
type Challenge = NonNullable<LessonInput["challenges"]>[number];
const s = sectionOf;
const paras = (section: Section, start: number, end?: number) =>
  section.prose.split("\n\n").slice(start, end).join("\n\n");
const text = (kind: Section["kind"], title: string, prose: string): Section => ({
  kind,
  title,
  prose,
});
const context = (copy: { title: string; intro: string }) =>
  text("question", copy.title, copy.intro);
const checkpoint = (copy: { title: string; checkpoint: string }) =>
  text("reflection", copy.title, copy.checkpoint);
const part = (
  id: string,
  copy: { title: string; objectives: readonly string[] },
  sections: Section[],
  introduces?: string[],
) => ({
  id,
  title: copy.title,
  objectives: [...copy.objectives],
  sections,
  ...(introduces ? { introduces } : {}),
});
const ungated = (section: Section): Section => ({
  ...section,
  interactives: section.interactives?.map((figure) => {
    const { after: _after, ...props } = figure.props ?? {};
    return { ...figure, props };
  }),
});

const tripRead = s(trip, "investigation");
const tripUnits = splitLesson(trip, [
  part("from-c-to-instructions", COPY.tripRead, [
    s(trip, "question"),
    s(trip, "motivation"),
    s(trip, "prediction"),
    { ...tripRead, prose: paras(tripRead, 0, 2) },
  ]),
  part("equivalent-trip-charge", COPY.tripAssembly, [
    context(COPY.tripAssembly),
    {
      ...s(trip, "construction"),
      prose: [s(trip, "construction").prose, paras(s(trip, "explanation"), 0, 1)].join("\n\n"),
    },
  ]),
  part("change-c-calculation", COPY.tripEdit, [
    context(COPY.tripEdit),
    {
      ...s(trip, "failureExperiment"),
      prose: [paras(tripRead, 2), s(trip, "failureExperiment").prose].join("\n\n"),
    },
    {
      ...s(trip, "generalisation"),
      prose: [paras(s(trip, "generalisation"), 0, 1), paras(s(trip, "generalisation"), 2)].join(
        "\n\n",
      ),
    },
  ]),
  part("cap-charge-in-c", COPY.tripCap, [
    context(COPY.tripCap),
    { ...s(trip, "explanation"), prose: paras(s(trip, "explanation"), 1) },
    s(trip, "challenge"),
  ]),
]);
const loopUnits = splitLesson(loop, [
  part("compile-a-loop", COPY.loopRead, [
    s(loop, "question"),
    s(loop, "motivation"),
    s(loop, "prediction"),
    s(loop, "investigation"),
  ]),
  part("write-assembly-loop", COPY.loopAssembly, [
    context(COPY.loopAssembly),
    s(loop, "construction"),
  ]),
  part("change-loop-boundary", COPY.loopBoundary, [
    context(COPY.loopBoundary),
    s(loop, "failureExperiment"),
    s(loop, "explanation"),
  ]),
  part("repeated-shifts-in-c", COPY.loopShifts, [
    context(COPY.loopShifts),
    { ...s(loop, "generalisation"), prose: paras(s(loop, "generalisation"), 1) },
    s(loop, "challenge"),
  ]),
]);
const checkedUnits = splitLesson(checked, [
  part(
    "checked-arithmetic",
    COPY.conversions,
    [
      s(checked, "question"),
      { ...s(checked, "motivation"), prose: COPY.conversions.motivation },
      s(checked, "prediction"),
      s(checked, "investigation"),
      s(checked, "construction"),
    ],
    ["integer promotion"],
  ),
  part(
    "checked-addition",
    COPY.checkedAdd,
    [
      context(COPY.checkedAdd),
      s(checked, "failureExperiment"),
      s(checked, "explanation"),
      s(checked, "generalisation"),
      s(checked, "challenge"),
      {
        ...s(checked, "reflection"),
        prose: paras(s(checked, "reflection"), 0).split("\n").slice(-2).join("\n"),
      },
    ],
    ["sanitizer"],
  ),
]);

const nativeInvestigation = s(native, "investigation");
const nativeExplanation = s(native, "explanation");
const nativeSource = {
  ...native,
  challenges: native.challenges?.map((challenge) => ({
    ...challenge,
    task: COPY.nativeBoot.finalTask,
  })),
};
const nativeUnits = splitLesson(nativeSource, [
  part("from-function-to-executable", COPY.nativeBoot, [
    s(native, "motivation"),
    s(native, "prediction"),
    {
      ...nativeInvestigation,
      prose: paras(nativeInvestigation, 0, 3),
      interactives: nativeInvestigation.interactives?.filter((f) => f.id === "native-model-trip"),
    },
    s(native, "construction"),
    s(native, "failureExperiment"),
    text("explanation", COPY.nativeBoot.repairTitle, paras(nativeExplanation, -1)),
    s(native, "challenge"),
  ]),
  part("loading-and-startup", COPY.nativeLayout, [
    context(COPY.nativeLayout),
    ungated({
      ...nativeInvestigation,
      prose: paras(nativeInvestigation, 3).replace(
        nativeInvestigation.prose.split("\n\n")[7]!,
        COPY.nativeLayout.conditionalAssembly,
      ),
      interactives: nativeInvestigation.interactives?.filter((f) => f.id === "native-elf-memory"),
    }),
    {
      ...s(native, "generalisation"),
      title: COPY.nativeLayout.title,
      prose: paras(s(native, "generalisation"), 0, 4),
      interactives: [],
    },
    checkpoint(COPY.nativeLayout),
  ]),
  part("runtime-startup", COPY.nativeRuntime, [
    context(COPY.nativeRuntime),
    ungated({ ...nativeExplanation, prose: paras(nativeExplanation, 0, -1) }),
    ungated({ ...s(native, "generalisation"), prose: COPY.nativeRuntime.loading }),
    checkpoint(COPY.nativeRuntime),
  ]),
]);

// Each debugger page starts a fresh remote session; no page depends on a terminal left open.
const freshConnection = DEBUG_PROSE.connection
  .split("### Mark the storage before startup")[0]!
  .trim();
const closeSession = DEBUG_PROSE.construction.slice(
  DEBUG_PROSE.construction.indexOf("To close this session"),
);
const debugSource = {
  ...debug,
  challenges: debug.challenges?.map((challenge) => ({
    ...challenge,
    task: challenge.task
      .split("\n\n")
      .filter((paragraph) => !paragraph.startsWith("First inspect the original"))
      .join("\n\n"),
  })),
};
const debugFailure = s(debug, "failureExperiment");
const originalTrace = s(debug, "investigation").interactives![0]!;
const debugUnits = splitLesson(debugSource, [
  part("debug-native-instructions", COPY.debugConnect, [
    {
      ...s(debug, "motivation"),
      prose: [COPY.debugConnect.intro, DEBUG_PROSE.motivation, DEBUG_PROSE.connection].join("\n\n"),
    },
    checkpoint(COPY.debugConnect),
  ]),
  part("stepping-native-function", COPY.debugStep, [
    text(
      "motivation",
      COPY.debugStep.title,
      [COPY.debugStep.intro, DEBUG_PROSE.motivation.split("\n\n")[1], freshConnection].join("\n\n"),
    ),
    s(debug, "prediction"),
    s(debug, "investigation"),
    s(debug, "construction"),
    checkpoint(COPY.debugStep),
  ]),
  part("diagnosing-native-failure", COPY.debugRepair, [
    text(
      "motivation",
      COPY.debugRepair.title,
      [
        COPY.debugRepair.intro,
        paras(nativeInvestigation, 1, 2),
        DEBUG_PROSE.motivation.split("\n\n")[1]!,
        freshConnection,
        DEBUG_PROSE.functionInputs,
      ].join("\n\n"),
    ),
    {
      ...debugFailure,
      prose: paras(debugFailure, 1),
      interactives: [
        debugFailure.interactives![0]!,
        {
          ...originalTrace,
          id: "native-gdb-original-comparison",
          caption: COPY.debugRepair.originalCaption,
          props: { ...originalTrace.props, after: "predict-native-divergence" },
        },
        ...debugFailure
          .interactives!.slice(1)
          .map((figure) => ({ ...figure, caption: COPY.debugRepair.modifiedCaption })),
      ],
    },
    { ...s(debug, "explanation"), prose: s(debug, "explanation").prose + "\n\n" + closeSession },
    { ...s(debug, "generalisation"), prose: paras(s(debug, "generalisation"), 1) },
    s(debug, "challenge"),
    s(debug, "reflection"),
  ]),
]);

const piUnits = [
  ...splitLesson(prep, [
    part("raspberry-pi-5", COPY.piConnect, [
      { ...s(prep, "question"), prose: COPY.piConnect.intro },
      s(prep, "motivation"),
      { ...s(prep, "investigation"), prose: COPY.piConnect.investigation },
      checkpoint(COPY.piConnect),
    ]),
  ]),
  ...splitLesson(pi, [
    part("raspberry-pi-boot", COPY.piBuild, [
      context(COPY.piBuild),
      s(pi, "investigation"),
      { ...s(prep, "explanation"), prose: COPY.piBuild.bootExplanation },
      {
        ...s(prep, "reflection"),
        prose: COPY.piBuild.comparison + "\n\n" + COPY.piBuild.checkpoint,
      },
    ]),
    part("capture-pi-boot", COPY.piCapture, [
      context(COPY.piCapture),
      s(pi, "construction"),
      { ...s(pi, "explanation"), prose: COPY.piCapture.troubleshooting },
      checkpoint(COPY.piCapture),
    ]),
    part("restore-pi-boot", COPY.piRestore, [
      context(COPY.piRestore),
      s(pi, "failureExperiment"),
      s(pi, "explanation"),
      { ...s(pi, "reflection"), prose: COPY.piRestore.checkpoint },
    ]),
  ]),
];

/** Keep existing recorded queries and test cases, scoped to fields taught on this page. */
function fieldsOf(
  source: Challenge,
  id: string,
  fields: string[],
  copy: { challengeTitle: string; task: string; hints: readonly string[] },
): Challenge {
  const queries = source.initial?.data?.["queries"] as Record<string, unknown>;
  const answers = source.reference?.answers ?? {};
  if (source.tests.kind !== "answers") throw new Error("Expected recorded-token cases");
  return {
    ...source,
    id,
    title: copy.challengeTitle,
    task: copy.task,
    hints: [...copy.hints] as Challenge["hints"],
    fields: source.fields?.filter((field) => fields.includes(field.id)),
    initial: {
      ...source.initial,
      data: { queries: Object.fromEntries(fields.map((field) => [field, queries[field]])) },
    },
    tests: {
      ...source.tests,
      cases: source.tests.cases.filter((row) =>
        Object.keys(row.expect).some((field) => fields.includes(field)),
      ),
    },
    reference: { answers: Object.fromEntries(fields.map((field) => [field, answers[field]!])) },
  };
}
const read = a32.challenges![0]!;
const final = a32.challenges![1]!;
const a32Challenges = [
  fieldsOf(read, "read-a32-return", ["return"], COPY.a32Orientation),
  fieldsOf(read, "read-a32-conditional", ["conditional"], COPY.a32Conditions),
  fieldsOf(final, "read-a32-constant", ["constant"], COPY.a32Constants),
  fieldsOf(final, "read-a32-target", ["helper", "divide", "result"], COPY.a32Division),
];
const mount = (id: string, caption: string) => ({
  id,
  kind: "challenge",
  role: "exercise",
  timeModel: "none",
  caption,
  props: { challengeId: id },
});
const a32Source = { ...a32, challenges: a32Challenges };
const a32Units = splitLesson(a32Source, [
  part("same-c-on-a32", COPY.a32Orientation, [
    s(a32, "question"),
    s(a32, "motivation"),
    {
      kind: "construction",
      title: COPY.a32Orientation.challengeTitle,
      prose: "",
      interactives: [mount("read-a32-return", COPY.a32Orientation.challengeTitle)],
    },
  ]),
  part("a32-conditions", COPY.a32Conditions, [
    context(COPY.a32Conditions),
    s(a32, "prediction"),
    s(a32, "investigation"),
    {
      ...s(a32, "construction"),
      prose: "",
      interactives: s(a32, "construction").interactives?.map((figure) =>
        figure.kind === "challenge"
          ? { ...figure, caption: COPY.a32Conditions.challengeTitle }
          : figure,
      ),
    },
    s(a32, "failureExperiment"),
  ]),
  part("a32-constants", COPY.a32Constants, [
    context(COPY.a32Constants),
    s(a32, "explanation"),
    {
      kind: "challenge",
      title: COPY.a32Constants.challengeTitle,
      prose: "",
      interactives: [mount("read-a32-constant", COPY.a32Constants.challengeTitle)],
    },
  ]),
  part("a32-division-helper", COPY.a32Division, [
    context(COPY.a32Division),
    s(a32, "generalisation"),
    {
      ...s(a32, "challenge"),
      interactives: s(a32, "challenge").interactives?.filter(
        (f) => f.id !== "a32-marker-reference",
      ),
    },
    s(a32, "reflection"),
  ]),
]);

export const paced10ToA: LessonInput[] = [
  ...tripUnits,
  ...loopUnits,
  {
    ...cAndOverflow,
    sections: cAndOverflow.sections
      .filter((section) => section.kind !== "reflection")
      .map((section) =>
        section.kind === "explanation"
          ? { ...section, prose: [paras(section, 0, 1), paras(section, 2)].join("\n\n") }
          : section,
      ),
  },
  ...checkedUnits,
  ...nativeUnits,
  ...debugUnits,
  ...piUnits,
  ...a32Units,
];
