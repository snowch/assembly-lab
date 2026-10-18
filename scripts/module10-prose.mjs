// Copyright © 2026 Christopher Snow
// Retain the separately drafted strings in a readable review copy.
import { writeFileSync } from "node:fs";
import { PROSE as p1 } from "../content/lessons/from-c-to-instructions.prose.ts";
import { LABELS as l1 } from "../content/lessons/from-c-to-instructions.labels.ts";
import { PROSE as p2 } from "../content/lessons/compile-a-loop.prose.ts";
import { LABELS as l2 } from "../content/lessons/compile-a-loop.labels.ts";
import { COMPILER_STRINGS as ui } from "../packages/views/src/strings.compiler.ts";
function strings(value) {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object")
    return Object.entries(value)
      .filter(([key]) => key !== "value")
      .flatMap(([, child]) => strings(child));
  return [];
}
const messages = [
  ui.editor.line("{line}", "{source}"),
  ui.playground.input("{name}"),
  ui.playground.compiled(1),
  ui.playground.compiled(2),
  ui.playground.checked("{value}"),
  ui.playground.diagnostic("{line}", "{column}", "{message}"),
];
let text =
  "# Module 10: canonical prose\n\nSeparately drafted lesson and interface strings retained for review.\n\n";
for (const [i, [prose, labels]] of [
  [p1, l1],
  [p2, l2],
].entries()) {
  text += `# Lesson ${i + 1}: ${labels.title}\n\n`;
  for (const [key, value] of Object.entries(prose))
    text += `## ${key}\n\n${strings(value).join("\n\n")}\n\n`;
  text += `## Labels\n\n${strings(labels).join("\n\n")}\n\n`;
}
text += `# Figure interface\n\n${[...strings(ui), ...messages].join("\n\n")}\n`;
writeFileSync(new URL("../docs/notes/module-10/prose.md", import.meta.url), text);
