// Copyright © 2026 Christopher Snow
import { expect, test, type Page } from "@playwright/test";
import { LESSONS } from "@al/content";
import { COMPILER_STRINGS as C } from "../../packages/views/src/strings.compiler";
import { VIEW_STRINGS as V } from "../../packages/views/src/strings";
import { DEFAULT_STRINGS as S } from "../../platform/lesson-runtime/src/strings";
import { runC } from "../../packages/views/src/compilerRun";
import { viewAt, wValue, traceOf } from "../../packages/views/src/trace";
import { designProblems } from "./design";
import {
  challenge,
  commit,
  figureOverflow,
  openLesson,
  passing,
  press,
  run,
  status,
  storageKey,
  watchErrors,
} from "./module1";

const routes = ["from-c-to-instructions", "compile-a-loop"];
const lesson = (route: string) => LESSONS.find((l) => l.id === route)!;
const figures = (route: string) => lesson(route).sections.flatMap((s) => s.interactives);
interface Props {
  source: string;
  args: number[];
  program: { listing: string };
  call: { entry: string; args: number[] };
  options: { value: string; label: string }[];
}
async function unlock(page: Page, route: string) {
  for (const f of figures(route).filter((f) => f.kind === "trace-prediction")) {
    const p = f.props as unknown as Props;
    const trace = traceOf(p.program, p.call);
    const value = String(Number(BigInt.asUintN(32, trace.result.final.x[0]!)));
    await commit(page, f.id, p.options.find((o) => o.value === value)!.label.replaceAll("`", ""));
  }
}
for (const route of routes) {
  test(`${route}: prediction gates and source edits persist`, async ({ page }) => {
    const errors = watchErrors(page);
    await openLesson(page, route);
    await expect(page.locator(".al-locked")).toHaveCount(2);
    await unlock(page, route);
    await expect(page.locator(".al-locked")).toHaveCount(0);
    const fig = page.locator(`#ix-play-${route}`);
    const source = fig.getByRole("textbox", { name: C.editor.source });
    const original = await source.inputValue();
    await source.fill(original + "\n// saved edit");
    await page.reload();
    await expect(source).toHaveValue(original + "\n// saved edit");
    await press(page, fig.getByRole("button", { name: C.playground.reset }));
    await expect(source).toHaveValue(original);
    expect(errors).toEqual([]);
  });
  for (const theme of ["light", "dark"])
    test(`${route}: editor and compiled trace fit ${theme}`, async ({ page }, info) => {
      await page.goto("#/");
      await page.evaluate((v) => localStorage.setItem("assembly-lab:v1:theme", v), theme);
      await page.reload();
      await openLesson(page, route);
      await unlock(page, route);
      const fig = page.locator(`#ix-play-${route}`);
      await press(page, fig.getByRole("button", { name: C.playground.run, exact: true }));
      await press(page, fig.getByRole("button", { name: C.editor.templates }));
      expect(await designProblems(page, info.project.name === "phone")).toEqual([]);
      expect(await figureOverflow(page)).toEqual([]);
    });
  test(`${route}: edited C runs with instruction and source highlights from the model`, async ({
    page,
  }) => {
    await openLesson(page, route);
    await unlock(page, route);
    const f = figures(route).find((f) => f.id === `play-${route}`)!;
    const p = f.props as unknown as Props;
    const result = runC(p.source, p.args);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const fig = page.locator(`#ix-${f.id}`);
    await press(page, fig.getByRole("button", { name: C.playground.run, exact: true }));
    for (let k = 0; k <= result.trace.result.steps.length; k++) {
      const view = viewAt(result.trace, k);
      await expect(fig.locator("[data-compiler-step]")).toHaveAttribute(
        "data-compiler-step",
        String(k),
      );
      await expect(fig.locator('[data-register="w0"] .al-dreg-value')).toHaveText(
        String(wValue(view.state, 0)),
      );
      const lit = fig.locator('.al-cline[data-lit="true"]');
      if (view.litC.length === 0) await expect(lit).toHaveCount(0);
      else {
        expect(await lit.count()).toBeGreaterThan(0);
        expect(
          await lit.evaluateAll((rows) => [
            ...new Set(rows.map((row) => row.getAttribute("data-line"))),
          ]),
        ).toEqual(view.litC.map(String));
        await expect(fig.locator('.al-insn[data-ran="true"] .al-ctag')).toHaveAttribute(
          "data-lit",
          "true",
        );
      }
      const next = view.next === null ? undefined : result.trace.lines[view.next];
      const context = fig.locator(".al-compiler-current");
      if (next?.kind === "instruction") {
        await expect(context).toContainText(next.text);
        if (next.cLine !== null) {
          await expect(context).toHaveAttribute("data-next-source-line", String(next.cLine));
          await expect(context).toContainText(p.source.split("\n")[next.cLine - 1]!.trim());
        }
      } else await expect(context).toHaveCount(0);
      if (k < view.total)
        await press(page, fig.getByRole("button", { name: V.stepper.next, exact: true }));
    }
    await expect(fig.getByRole("status")).toHaveText(C.playground.checked(result.value));
    await press(page, fig.getByRole("button", { name: V.stepper.reset, exact: true }));
    await expect(fig.locator("[data-compiler-step]")).toHaveAttribute("data-compiler-step", "0");
    const source = fig.getByRole("textbox", { name: C.editor.source });
    await source.fill("unsigned unsafe(unsigned value) { return value / 0; }");
    await press(page, fig.getByRole("button", { name: C.playground.run, exact: true }));
    await expect(fig.getByRole("alert")).toContainText("zero");
    await expect(fig.locator("[data-compiler-step]")).toHaveCount(0);
    await source.fill("unsigned invalid(");
    await expect(fig.getByRole("status")).toContainText("Line 1");
  });
  for (const cdata of lesson(route).challenges)
    test(`${cdata.id}: failure, reference, stored regrade and reset`, async ({ page }) => {
      await openLesson(page, route);
      const c = challenge(page, cdata.id),
        isC = cdata.tests.kind === "answers" && cdata.tests.grader === "run-c";
      const box = c.getByRole("textbox", { name: isC ? C.editor.source : V.editor.textLabel });
      await press(page, run(c));
      await expect(c.locator(".verdict-failure").first()).toBeVisible();
      if (isC) {
        const failure = c.locator(".verdict-failure").first();
        await expect(failure.locator(".verdict-detail")).toHaveCount(0);
        await expect(failure.locator(".verdict-values")).toContainText(
          `w0=${cdata.tests.kind === "answers" ? cdata.tests.cases[0]!.expect["w0"] : ""}`,
        );
      }
      await box.fill(cdata.reference.text!);
      await press(page, run(c));
      await expect(status(c)).toHaveText(passing(5));
      await page.reload();
      await expect(c.locator(".challenge-complete")).toBeVisible();
      await page.evaluate(
        ({ key, id, text }) => {
          const saved = JSON.parse(localStorage.getItem(key)!);
          saved.challenges[id].artifact.text = text;
          localStorage.setItem(key, JSON.stringify(saved));
        },
        { key: storageKey(route), id: cdata.id, text: cdata.initial.text! },
      );
      await page.reload();
      await expect(c.locator(".challenge-complete")).toHaveCount(0);
      await press(page, c.getByRole("button", { name: new RegExp(`^${S.challenge.reset}`) }));
      await press(page, c.getByRole("button", { name: S.challenge.resetConfirm }));
      await expect(box).toHaveValue(cdata.initial.text!);
    });
}
test("GCC comparison sends only on press, caches success, preserves source link and fails offline", async ({
  page,
}) => {
  let requests = 0;
  const sources: string[] = [];
  await page.route("https://godbolt.org/api/compiler/*/compile", async (route) => {
    requests++;
    sources.push(route.request().postDataJSON().source);
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ code: 0, asm: [{ text: "test:" }, { text: "ret" }] }),
    });
  });
  await openLesson(page, routes[0]!);
  await unlock(page, routes[0]!);
  const fig = page.locator("#ix-play-from-c-to-instructions");
  const box = fig.getByRole("textbox", { name: C.editor.source });
  const source = await box.inputValue();
  await box.fill(source + "\n// comparison");
  expect(requests).toBe(0);
  await fig.locator("summary").filter({ hasText: C.playground.compare }).click();
  await expect(fig.getByText(C.playground.privacy, { exact: false })).toBeVisible();
  await expect(fig.getByRole("link", { name: C.playground.privacyLink })).toHaveAttribute(
    "href",
    "https://godbolt.org/privacy",
  );
  const href = await fig.getByRole("link", { name: C.playground.openGcc }).getAttribute("href");
  const state = JSON.parse(
    Buffer.from(decodeURIComponent(href!.split("/clientstate/")[1]!), "base64").toString(),
  );
  expect(state.sessions[0].source).toBe(source + "\n// comparison");
  await press(page, fig.getByRole("button", { name: C.playground.compare, exact: true }));
  await expect(fig.locator(".al-c-output")).toContainText("test:");
  expect(sources).toEqual([source + "\n// comparison"]);
  await press(page, fig.getByRole("button", { name: C.playground.compare, exact: true }));
  await expect(fig.getByText(C.playground.cached, { exact: true })).toBeVisible();
  expect(requests).toBe(1);
  await page.unroute("https://godbolt.org/api/compiler/*/compile");
  await page.route("https://godbolt.org/api/compiler/*/compile", (route) => route.abort());
  await box.fill(source + "\n// offline edit");
  await press(page, fig.getByRole("button", { name: C.playground.compare, exact: true }));
  await expect(fig.getByText(C.playground.failed, { exact: true })).toBeVisible();
  await press(page, fig.getByRole("button", { name: C.playground.run, exact: true }));
  await expect(fig.locator("[data-compiler-step]")).toBeVisible();
});

test("phone builds a complete C conditional using statement controls", async ({ page }, info) => {
  test.skip(info.project.name !== "phone", "touch editor");
  await openLesson(page, routes[0]!);
  const c = challenge(page, "write-cap-charge");
  await c.getByRole("textbox", { name: C.editor.source }).fill("");
  await press(page, c.getByRole("button", { name: C.editor.templates }));
  const choose = async (label: string, value: string) =>
    c.getByLabel(label, { exact: true }).selectOption(value);
  const apply = async () =>
    press(
      page,
      c.getByRole("button", { name: new RegExp(`^(${C.editor.apply}|${C.editor.applyEmpty})$`) }),
    );
  const next = async () =>
    press(page, c.getByRole("button", { name: C.editor.addLine, exact: true }));
  await choose(C.editor.statement, "function");
  await apply();
  await press(page, c.getByRole("list", { name: C.editor.lines }).getByRole("button").last());
  await next();
  await choose(C.editor.statement, "declaration");
  await choose(C.editor.target, "charge");
  await choose(C.editor.left, "distance");
  await choose(C.editor.operator, "*");
  await choose(C.editor.right, "rate");
  await apply();
  await next();
  await choose(C.editor.statement, "if");
  await choose(C.editor.left, "charge");
  await choose(C.editor.operator, ">");
  await choose(C.editor.right, "limit");
  await apply();
  await next();
  await choose(C.editor.statement, "assignment");
  await choose(C.editor.target, "charge");
  await choose(C.editor.left, "limit");
  await choose(C.editor.operator, "");
  await apply();
  await next();
  await choose(C.editor.statement, "end");
  await apply();
  await next();
  await choose(C.editor.statement, "return");
  await choose(C.editor.left, "charge");
  await apply();
  await next();
  await choose(C.editor.statement, "end");
  await apply();
  await press(page, run(c));
  await expect(c.locator(".challenge-complete")).toBeVisible();
  await press(page, c.getByRole("button", { name: C.editor.text }));
  await expect(c.getByRole("textbox", { name: C.editor.source })).toHaveValue(
    /unsigned charge = distance \* rate;/,
  );
  expect(await designProblems(page, true)).toEqual([]);
});

test("phone builds a complete C loop using statement controls", async ({ page }, info) => {
  test.skip(info.project.name !== "phone", "touch editor");
  await openLesson(page, routes[1]!);
  const c = challenge(page, "write-c-dimming");
  await c.getByRole("textbox", { name: C.editor.source }).fill("");
  await press(page, c.getByRole("button", { name: C.editor.templates }));
  const choose = async (label: string, value: string) =>
    c.getByLabel(label, { exact: true }).selectOption(value);
  const apply = async () =>
    press(
      page,
      c.getByRole("button", { name: new RegExp(`^(${C.editor.apply}|${C.editor.applyEmpty})$`) }),
    );
  const next = async () =>
    press(page, c.getByRole("button", { name: C.editor.addLine, exact: true }));
  await choose(C.editor.statement, "function");
  await apply();
  await press(page, c.getByRole("list", { name: C.editor.lines }).getByRole("button").last());
  await next();
  await choose(C.editor.statement, "while");
  await choose(C.editor.left, "count");
  await choose(C.editor.operator, "!=");
  await choose(C.editor.right, "$number");
  await apply();
  await next();
  await choose(C.editor.statement, "assignment");
  await choose(C.editor.target, "value");
  await choose(C.editor.left, "value");
  await choose(C.editor.operator, ">>");
  await press(
    page,
    c
      .getByRole("group", { name: C.editor.number, exact: true })
      .getByRole("button", { name: "1", exact: true }),
  );
  await apply();
  await next();
  await choose(C.editor.target, "count");
  await choose(C.editor.left, "count");
  await choose(C.editor.operator, "-");
  await apply();
  await next();
  await choose(C.editor.statement, "end");
  await apply();
  await next();
  await choose(C.editor.statement, "return");
  await choose(C.editor.left, "value");
  await choose(C.editor.operator, "");
  await apply();
  await next();
  await choose(C.editor.statement, "end");
  await apply();
  await press(page, run(c));
  await expect(c.locator(".challenge-complete")).toBeVisible();
  await press(page, c.getByRole("button", { name: C.editor.text }));
  await expect(c.getByRole("textbox", { name: C.editor.source })).toHaveValue(
    /value = value >> 1;/,
  );
  expect(await designProblems(page, true)).toEqual([]);
});

test("C editor loads the selected statement and preserves the rest of the source", async ({
  page,
}) => {
  await openLesson(page, routes[0]!);
  const c = challenge(page, "write-cap-charge");
  const original = lesson(routes[0]!).challenges[1]!.reference.text!;
  const lines = original.split("\n"),
    at = lines.findIndex((line) => line.includes("unsigned charge"));
  await c.getByRole("textbox", { name: C.editor.source }).fill(original);
  await press(page, c.getByRole("button", { name: C.editor.templates }));
  await press(
    page,
    c.getByRole("button", { name: C.editor.line(at + 1, lines[at]!).replace(/\s+/g, " ") }),
  );
  await expect(c.getByLabel(C.editor.statement, { exact: true })).toHaveValue("declaration");
  await expect(c.getByLabel(C.editor.target, { exact: true })).toHaveValue("charge");
  await expect(c.getByLabel(C.editor.operator, { exact: true })).toHaveValue("*");
  await c.getByLabel(C.editor.right, { exact: true }).selectOption("limit");
  await expect(c.locator(".al-c-preview")).toContainText("unsigned charge = distance * limit;");
  await press(page, c.getByRole("button", { name: C.editor.apply, exact: true }));
  await press(page, c.getByRole("button", { name: C.editor.text }));
  await expect(c.getByRole("textbox", { name: C.editor.source })).toHaveValue(
    original.replace("distance * rate", "distance * limit"),
  );
});

test("an assembly budget stop is reported separately from a wrong returned value", async ({
  page,
}) => {
  await openLesson(page, routes[1]!);
  await unlock(page, routes[1]!);
  const fig = page.locator("#ix-play-compile-a-loop");
  await fig.getByLabel(C.playground.input("count"), { exact: true }).fill("800");
  await press(page, fig.getByRole("button", { name: C.playground.run, exact: true }));
  await expect(fig.getByRole("alert")).toContainText("10000");
  await expect(fig.getByRole("alert")).not.toContainText(C.playground.machineFailed);
  await expect(fig.locator("[data-compiler-step]")).toHaveCount(0);
});
