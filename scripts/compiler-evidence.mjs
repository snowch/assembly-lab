// Copyright © 2026 Christopher Snow

// Refresh course compiler outputs from the recorded Module 10 C inputs. This never calls GCC.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { compileC, interpretC } from "../packages/compiler/src/index.ts";

const records = new URL("../docs/notes/module-10/compiler/", import.meta.url);
const corpus = new URL("./real-tools/corpus/", import.meta.url);
const values = [0, 1, 7, 0x7fffffff, 0x80000000, 0xffffffff];
for (const file of readdirSync(records).filter((file) => file.endsWith(".c"))) {
  const name = file.slice(0, -2),
    source = readFileSync(new URL(file, records), "utf8");
  const compiled = compileC(source);
  if (!compiled.ok) throw new Error(JSON.stringify(compiled.errors));
  const response = JSON.parse(readFileSync(new URL(`${name}.response.json`, records), "utf8"));
  if (response.code !== 0) throw new Error(`GCC rejected ${name}`);
  const gcc = response.asm
    .map((row) => row.text.trim())
    .filter(Boolean)
    .join("\n");
  let calls;
  if (name === "accumulated_charge" || name === "course_for_assignment")
    calls = [0, 1, 3, 16].flatMap((count) => values.map((rate) => [count, rate]));
  else if (name === "course_while")
    calls = values.flatMap((value) => [0, 1, 3, 31, 32].map((count) => [value, count]));
  else if (compiled.parameters.length === 3)
    calls = [
      [0, 3, 50],
      [12, 3, 50],
      [12, 7, 50],
      [0xffffffff, 2, 0xffffffff],
      [0x80000000, 2, 20],
    ];
  else if (compiled.parameters.length === 2)
    calls = values.flatMap((a) => values.map((b) => [a, b]));
  else if (compiled.parameters.length === 1) calls = values.map((a) => [a]);
  else calls = [[]];
  const results = calls.map((args) => {
    const result = interpretC(compiled, args);
    if (!result.ok) throw new Error(`${name}: ${JSON.stringify(result)}`);
    return { args, value: result.value };
  });
  writeFileSync(
    new URL(`${name}.course.json`, records),
    JSON.stringify(
      {
        compiler: "Assembly Lab C subset 1",
        source,
        listing: compiled.listing,
        lineMap: compiled.lineMap,
        calls: results,
      },
      null,
      2,
    ) + "\n",
  );
  for (const [kind, listing] of [
    ["course", compiled.listing],
    ["gcc", gcc],
  ]) {
    const basename = `module10-${name.replaceAll("_", "-")}-${kind}`;
    writeFileSync(
      new URL(`${basename}.s`, corpus),
      "// Copyright © 2026 Christopher Snow\n" + listing + "\n",
    );
    writeFileSync(
      new URL(`${basename}.json`, corpus),
      JSON.stringify(
        {
          entry: compiled.name,
          calls: calls.map((args) => ({ args: args.map((value) => [String(value), 32]) })),
        },
        null,
        2,
      ) + "\n",
    );
  }
  console.log(
    `${name}: ${results.length} checked calls, ${fileURLToPath(new URL(`${name}.course.json`, records))}`,
  );
}
