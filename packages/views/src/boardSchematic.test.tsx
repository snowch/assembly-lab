// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";
import { BoardSchematic, BoardSchematicProps } from "./interactives/BoardSchematic";

const diagram = {
  kind: "serial",
  title: "Serial output path",
  note: "A wiring schematic, not a pin-orientation drawing.",
  nodes: [
    { id: "host", title: "Computer", detail: "Terminal window" },
    { id: "probe", title: "Debug Probe", detail: "Socket **U**" },
    { id: "pi", title: "Raspberry Pi 5", detail: "Connector **UART**" },
  ],
  links: [
    { from: "probe", to: "host", label: "USB serial data" },
    { from: "pi", to: "probe", label: "Serial output · three-pin cable" },
  ],
};

describe("source-checked board schematics", () => {
  it("shows serial output from Pi to probe to host without implying a physical pin order", () => {
    const interactive = Interactive.parse({
      id: "serial-path",
      kind: "board-schematic",
      role: "diagram",
      timeModel: "none",
      caption: "Serial connection",
      props: diagram,
    });
    const { container, getByRole } = render(
      <BoardSchematic
        lesson={{} as Lesson}
        interactive={interactive}
        store={new LessonStore(memoryStorage(), "assembly-lab", "pi")}
      />,
    );
    expect(getByRole("group", { name: diagram.title })).toBeVisible();
    expect(container.querySelectorAll('.al-board-link[data-forward="false"]')).toHaveLength(2);
    expect(container.textContent).toContain("Raspberry Pi 5 → Debug Probe");
    expect(container.textContent).toContain("Debug Probe → Computer");
    expect(container.querySelectorAll(".al-board-node strong")).toHaveLength(5);
    expect(container.querySelector(".interactive-problem")).toBeNull();
  });

  it("rejects broken source relationships rather than silently drawing a false path", () => {
    expect(
      BoardSchematicProps.safeParse({
        ...diagram,
        links: [diagram.links[0], { from: "pi", to: "gpio", label: "Wrong target" }],
      }).success,
    ).toBe(false);
    expect(
      BoardSchematicProps.safeParse({ ...diagram, nodes: [...diagram.nodes, diagram.nodes[0]] })
        .success,
    ).toBe(false);
  });
});
