// Copyright © 2026 Christopher Snow

// Addition-only adaptation of Bit Lab's AluCircuit.tsx at 659ec31dd8e52b8a067c6acbf15cce841f47f004.
// Preserve its connected full-adder/XOR/NOR geometry, using this course's recorded columns.
// No Bit Lab model, editable inputs, lab state or physical Arm implementation is imported.
import type { FlagsModel } from "./model";
import { LOGIC_COPY as L } from "./strings.logic";

const esc = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

export function flagsLogicMarkup(model: FlagsModel): string {
  if (model.width !== 4)
    throw new Error("The optional logic diagram needs four-bit teaching columns.");
  const bits = [3, 2, 1, 0];
  const x = (bit: number) => 410 - bit * 90;
  const wire = (path: string, value: number, carry = false) =>
    `<path class="flags-logic-wire${carry ? " flags-logic-carry" : ""}" data-signal="${value}" d="${path}"/>`;
  const cell = (bit: number, row: "a" | "b" | "result", y: number, value: number) =>
    `<g class="flags-logic-cell" data-row="${row}" data-bit="${bit}" data-value="${value}" transform="translate(${x(bit)} ${y})"><rect x="-22" y="-22" width="44" height="44" rx="6"/><text y="9" text-anchor="middle">${value}</text></g>`;
  const values = {
    a: model.a.bits,
    b: model.b.bits,
    result: model.result.bits,
    carries: model.columns.map((column) => column.carryOut).join(", "),
    carryIn: model.carryIn,
    carryOut: model.carryOut,
    ...model.flags,
  };
  const description = Object.entries(values).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    L.diagramDescription as string,
  );
  const rule = (flag: "n" | "z" | "c" | "v", text: string, extra = "") =>
    `<div data-logic-rule="${flag}"><dt><span>${flag.toUpperCase()}</span><strong data-logic-flag="${flag}">${model.flags[flag]}</strong></dt><dd>${esc(text)}${extra}</dd></div>`;
  return `<div class="flags-logic-body" data-logic-a="${model.a.bits}" data-logic-b="${model.b.bits}" data-logic-result="${model.result.bits}">
    <div class="flags-logic-intro"><p>${esc(L.limitation)}</p><p>${esc(L.adder)} ${esc(L.carryDirection)}</p></div>
    <div class="flags-logic-layout">
      <figure class="flags-logic-figure"><figcaption>${esc(L.legend)}</figcaption>
        <p class="flags-logic-scroll-cue">${esc(L.scrollCue)}</p>
        <div class="flags-logic-scroll" role="region" aria-label="${esc(L.regionLabel)}" tabindex="0">
        <svg class="flags-logic-diagram" viewBox="0 -8 480 482" role="img" aria-labelledby="flags-logic-title flags-logic-description">
          <title id="flags-logic-title">${esc(L.title)}</title><desc id="flags-logic-description">${esc(description)}</desc>
          ${bits.map((bit) => `<text x="${x(bit)}" y="20" text-anchor="middle">${bit}</text>`).join("")}
          <text x="469" y="58" text-anchor="middle">A</text><text x="469" y="122" text-anchor="middle">B</text>
          ${bits
            .map((bit) => {
              const column = model.columns[bit]!;
              const cx = x(bit);
              return `<g data-logic-column="${bit}" data-a="${column.a}" data-b="${column.b}" data-in="${column.carryIn}" data-out="${column.carryOut}" data-result="${column.kept}">
              ${wire(`M${cx},72 V82 H${cx - 30} V170 H${cx - 11} V190`, column.a)}
              ${wire(`M${cx + 11},136 V190`, column.b)}
              <g class="flags-logic-gate" data-gate="FA"><rect x="${cx - 25}" y="190" width="50" height="40" rx="4"/><text x="${cx}" y="218" text-anchor="middle">FA</text></g>
              ${wire(`M${cx - 25},210 H${bit === 3 ? 70 : x(bit + 1) + 25}`, column.carryOut, true)}
              <text data-logic-carry="${bit + 1}" data-value="${column.carryOut}" x="${bit === 3 ? 92 : cx - 45}" y="200" text-anchor="middle">${column.carryOut}</text>
              ${bit === 0 ? `${wire("M435,210 H470", column.carryIn, true)}<text data-logic-carry="0" data-value="${column.carryIn}" x="457" y="200" text-anchor="middle">${column.carryIn}</text>` : ""}
              ${wire(`M${cx},230 V278`, column.kept)}
            </g>`;
            })
            .join("")}
          ${wire("M70,210 V170", model.carryOut, true)}
          <text data-logic-output="c" x="70" y="160" text-anchor="middle">C=${model.flags.c}</text>
          ${wire("M70,210 V257", model.carryOut, true)}
          ${wire("M185,210 V240 H94 V257", model.carryIn, true)}
          <circle class="flags-logic-junction" cx="185" cy="210" r="3"/><circle class="flags-logic-junction" cx="70" cy="210" r="3"/>
          <g class="flags-logic-gate" data-gate="XOR" transform="translate(82 274) scale(.8)"><path d="M-22,-24 Q0,-16 22,-24 Q22,12 0,24 Q-22,12 -22,-24 Z"/><path d="M-22,-30 Q0,-22 22,-30"/></g>
          <text x="8" y="282">XOR</text>
          ${wire("M82,294 V302", model.flags.v)}
          <text data-logic-output="v" x="82" y="322" text-anchor="middle">V=${model.flags.v}</text>
          ${bits
            .map((bit) => {
              const cx = x(bit);
              const fraction = (cx - 115) / 320;
              return `${wire(`M${cx},322 V${366 + 48 * fraction * (1 - fraction)}`, model.columns[bit]!.kept)}${cell(bit, "result", 300, model.columns[bit]!.kept)}`;
            })
            .join("")}
          <text x="469" y="308" text-anchor="middle">R</text>
          ${wire("M140,336 H65", model.flags.n)}
          <circle class="flags-logic-junction" cx="140" cy="336" r="3"/>
          <text data-logic-output="n" x="65" y="358" text-anchor="middle">N=${model.flags.n}</text>
          <g class="flags-logic-gate" data-gate="NOR"><path d="M115,366 Q275,390 435,366 Q410,400 275,414 Q140,400 115,366 Z"/><circle cx="275" cy="420" r="5"/><text x="275" y="402" text-anchor="middle">NOR</text></g>
          ${wire("M275,425 V440", model.flags.z)}
          <text data-logic-output="z" x="275" y="458" text-anchor="middle">Z=${model.flags.z}</text>
          ${bits.map((bit) => cell(bit, "a", 50, model.columns[bit]!.a) + cell(bit, "b", 114, model.columns[bit]!.b)).join("")}
        </svg>
        </div>
      </figure>
      <section class="flags-logic-why" aria-labelledby="flags-logic-why-title"><h4 id="flags-logic-why-title">${esc(L.xorWhyTitle)}</h4><p>${esc(L.vRule)} ${esc(L.xorDefinition)}</p><p class="flags-logic-equation"><code>${model.carryIn} XOR ${model.carryOut} = <strong data-logic-flag="v">${model.flags.v}</strong></code></p><p>${esc(L.xorWhy)}</p><ul><li>${esc(L.xorWhyPositive)}</li><li>${esc(L.xorWhyNegative)}</li></ul><p>${esc(L.xorWhyConclusion)}</p></section>
    </div>
      <dl class="flags-logic-rules">
        ${rule("n", L.nRule)}
        ${rule("z", L.zRule, `<p>${esc(L.norDefinition)}</p>`)}
        ${rule("c", L.cRule)}
      </dl>
  </div>`;
}
