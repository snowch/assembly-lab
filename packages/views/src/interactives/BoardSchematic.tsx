// Copyright © 2026 Christopher Snow

// A source-checked relationship diagram, not an execution trace or a board simulation.
// Labels and relationships are content data; no pin numbering or board orientation is inferred.
import { Fragment, useId } from "react";
import { z } from "zod";
import { Prose } from "@platform/lesson-runtime";
import { withProps } from "./props";

export const BoardSchematicProps = z
  .object({
    kind: z.enum(["boot", "serial"]),
    title: z.string().min(1),
    note: z.string(),
    nodes: z
      .array(z.object({ id: z.string().min(1), title: z.string().min(1), detail: z.string() }))
      .min(2),
    links: z.array(z.object({ from: z.string(), to: z.string(), label: z.string().min(1) })),
    footnote: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const ids = data.nodes.map((node) => node.id);
    const pairs = data.nodes.slice(1).map((node, i) => [ids[i], node.id]);
    if (new Set(ids).size !== ids.length || data.links.length !== pairs.length) {
      ctx.addIssue({
        code: "custom",
        message: "Provide unique nodes and one link per adjacent pair.",
      });
      return;
    }
    for (const [from, to] of pairs) {
      const matches = data.links.filter(
        (link) => (link.from === from && link.to === to) || (link.from === to && link.to === from),
      );
      if (matches.length !== 1)
        ctx.addIssue({ code: "custom", message: "Each link must connect one adjacent pair." });
    }
  });

export const BoardSchematic = withProps(BoardSchematicProps, function BoardSchematic({ data }) {
  const titleId = useId();
  return (
    <div
      className="al-figure al-board-schematic"
      data-figure="board-schematic"
      data-board-schematic={data.kind}
      role="group"
      aria-labelledby={titleId}
    >
      <h3 id={titleId}>{data.title}</h3>
      <Prose markdown={data.note} />
      <div className="al-board-route">
        {data.nodes.map((node, index) => {
          const previous = data.nodes[index - 1];
          const link = previous
            ? data.links.find(
                (edge) =>
                  (edge.from === previous.id && edge.to === node.id) ||
                  (edge.to === previous.id && edge.from === node.id),
              )
            : undefined;
          const forward = link?.to === node.id;
          const source = forward ? previous : node;
          const destination = forward ? node : previous;
          return (
            <Fragment key={node.id}>
              {link && (
                <div className="al-board-link" data-forward={forward}>
                  <span className="visually-hidden">{`${source?.title} → ${destination?.title}: `}</span>
                  <span>{link.label}</span>
                  <svg viewBox="0 0 24 48" aria-hidden="true" focusable="false">
                    <path d="M12 3V42M4 33L12 42L20 33" />
                  </svg>
                </div>
              )}
              <div className="al-board-node" data-board-node={node.id}>
                <strong>{node.title}</strong>
                <Prose markdown={node.detail} />
              </div>
            </Fragment>
          );
        })}
      </div>
      {data.footnote && <Prose markdown={data.footnote} />}
    </div>
  );
});
