// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow
import { useState } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { CSourceEditor } from "./CEditor";
import { COMPILER_STRINGS as C } from "./strings.compiler";
import { runC } from "./compilerRun";
function Harness({ seen }: { seen: (s: string) => void }) {
  const [source, setSource] = useState("");
  return (
    <CSourceEditor
      source={source}
      onChange={(s) => {
        setSource(s);
        seen(s);
      }}
      config={{
        signature: "unsigned cap_charge(unsigned distance, unsigned rate, unsigned limit)",
        names: ["distance", "rate", "limit", "charge"],
      }}
    />
  );
}
it("builds a complete conditional C function from statements and retains it when modes change", async () => {
  let source = "";
  const user = userEvent.setup({ delay: null });
  render(
    <Harness
      seen={(s) => {
        source = s;
      }}
    />,
  );
  await user.click(screen.getByRole("button", { name: C.editor.templates }));
  const choose = async (label: string, value: string) =>
    user.selectOptions(screen.getByLabelText(label), value);
  const apply = async () =>
    user.click(
      screen.getByRole("button", {
        name: new RegExp(`^(${C.editor.apply}|${C.editor.applyEmpty})$`),
      }),
    );
  const next = async () => user.click(screen.getByRole("button", { name: C.editor.addLine }));
  await choose(C.editor.statement, "function");
  await apply();
  await user.click(
    within(screen.getByRole("list", { name: C.editor.lines }))
      .getAllByRole("button")
      .at(-1)!,
  );
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
  const result = runC(source, [6, 4, 20]);
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.value).toBe(20);
  await user.click(screen.getByRole("button", { name: C.editor.text }));
  expect(
    (screen.getByRole("textbox", { name: C.editor.source }) as HTMLTextAreaElement).value,
  ).toBe(source);
  await user.clear(screen.getByRole("textbox", { name: C.editor.source }));
  await user.type(screen.getByRole("textbox", { name: C.editor.source }), "bad C");
  expect(screen.getByRole("status")).toHaveTextContent("Line 1");
}, 20000);

it("loads a selected statement, preserves untouched lines and refuses to guess complex expressions", async () => {
  const user = userEvent.setup({ delay: null });
  let source = "";
  render(
    <Harness
      seen={(s) => {
        source = s;
      }}
    />,
  );
  const original =
    "unsigned cap_charge(unsigned distance, unsigned rate, unsigned limit)\n{\n    unsigned charge = distance * rate;\n    return charge + limit * 2;\n}";
  fireEvent.change(screen.getByRole("textbox", { name: C.editor.source }), {
    target: { value: original },
  });
  await user.click(screen.getByRole("button", { name: C.editor.templates }));
  await user.click(
    screen.getByRole("button", {
      name: /^Line 3:/,
    }),
  );
  expect(screen.getByLabelText(C.editor.statement)).toHaveValue("declaration");
  expect(screen.getByLabelText(C.editor.target)).toHaveValue("charge");
  expect(screen.getByLabelText(C.editor.left)).toHaveValue("distance");
  expect(screen.getByLabelText(C.editor.operator)).toHaveValue("*");
  expect(screen.getByLabelText(C.editor.right)).toHaveValue("rate");
  await user.selectOptions(screen.getByLabelText(C.editor.right), "limit");
  await user.click(screen.getByRole("button", { name: C.editor.apply }));
  expect(source).toBe(original.replace("distance * rate", "distance * limit"));
  await user.click(screen.getByRole("button", { name: /^Line 4:/ }));
  expect(screen.getByRole("note")).toHaveTextContent(C.editor.unsupportedLine);
  expect(screen.getByRole("button", { name: C.editor.apply })).toBeDisabled();
  expect(source).toContain("return charge + limit * 2;");
  await user.selectOptions(screen.getByLabelText(C.editor.statement), "return");
  expect(screen.getByRole("button", { name: C.editor.apply })).toBeEnabled();
});

it("opens a representable statement instead of a leading comment and preserves the source", () => {
  const source =
    "// calculation\nunsigned cap_charge(unsigned distance, unsigned rate, unsigned limit)\n{\n    unsigned charge = distance * rate;\n    return charge;\n}";
  const seen: string[] = [];
  render(
    <CSourceEditor
      source={source}
      onChange={(value) => seen.push(value)}
      config={{
        signature: "unsigned cap_charge(unsigned distance, unsigned rate, unsigned limit)",
        names: ["distance", "rate", "limit", "charge"],
      }}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: C.editor.templates }));
  expect(screen.getByRole("button", { name: /^Line 4:/ })).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByLabelText(C.editor.statement)).toHaveValue("declaration");
  expect(screen.queryByRole("note")).toBeNull();
  expect(seen).toEqual([]);
});
