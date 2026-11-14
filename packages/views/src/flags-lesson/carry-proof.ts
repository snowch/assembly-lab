// Copyright © 2026 Christopher Snow

import type { FlagsModel } from "./model";
import { CARRY_PROOF_COPY as C } from "./strings.carry-proof";

const esc = (value: string | number) =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
const fill = (text: string, values: Record<string, string | number>) =>
  Object.entries(values).reduce((s, [key, value]) => s.replaceAll(`{${key}}`, esc(value)), text);
const fmt = (n: string) => n.replace(/^-/, "−");
const signedEquation = (m: FlagsModel) =>
  `${fmt(m.a.signed)} + ${BigInt(m.b.signed) < 0n ? `(${fmt(m.b.signed)})` : fmt(m.b.signed)} = ${fmt(m.signedSum)}`;

/** A complete miniature with its sign column enlarged; every value is from the course model. */
function bits(m: FlagsModel) {
  return `<div class="carry-proof-bits">${[
    [C.firstInput, m.a.bits],
    [C.secondInput, m.b.bits],
    [C.stored, m.result.bits],
  ]
    .map(
      ([label, pattern], row) =>
        `<div class="carry-proof-bitrow${row === 2 ? " carry-proof-result" : ""}"><span class="carry-proof-rowlabel">${esc(label!)}</span><span class="carry-proof-pattern" role="img" aria-label="${esc(label!)}: ${esc(pattern!)}">${[...pattern!].map((bit, i) => `<span class="carry-proof-bit${i === 0 ? " carry-proof-sign" : ""}" aria-hidden="true">${bit}</span>`).join("")}</span></div>`,
    )
    .join("")}</div>`;
}

function carries(m: FlagsModel, column = false) {
  const top = m.columns[m.width - 1]!;
  return `<div class="carry-proof-flow">
    <div class="carry-proof-port"><span>${C.outgoing}</span><strong data-proof-out>${top.carryOut}</strong></div>
    <span class="carry-proof-arrow" aria-hidden="true">←</span>
    <div class="carry-proof-column"><span>${C.column}</span><strong data-proof-column>${top.a} + ${top.b} + ${top.carryIn} = ${top.total.toString(2)}</strong></div>
    <span class="carry-proof-arrow" aria-hidden="true">←</span>
    <div class="carry-proof-port"><span>${C.incoming}</span><strong data-proof-in>${top.carryIn}</strong></div>
    ${column ? `<div class="carry-proof-kept"><span aria-hidden="true">↓</span><span>${C.kept}: <strong data-proof-kept>${top.kept}</strong></span></div>` : ""}
  </div>`;
}

export function carryProofMarkup(positive: FlagsModel, negative: FlagsModel, fresh: FlagsModel) {
  if ([positive, negative, fresh].some((m) => m.width !== 4))
    throw new Error("The carry explanation needs four-bit teaching columns.");
  const examples = [
    [positive, C.positiveTitle, C.positiveWhy],
    [negative, C.negativeTitle, C.negativeWhy],
  ] as const;
  const panelIds = ["carryProofPositive", "carryProofNegative"] as const;
  return `<p class="carry-proof-summary">${C.summary}</p>
    <div class="switcher fit-switcher carry-proof-switcher" role="tablist" aria-label="${C.tabsLabel}">
      ${[C.positiveTab, C.negativeTab].map((label, index) => `<button type="button" class="purple${index === 0 ? " active" : ""}" id="${panelIds[index]}Tab" role="tab" aria-selected="${index === 0}" aria-controls="${panelIds[index]}" tabindex="${index === 0 ? 0 : -1}">${label}</button>`).join("")}
    </div>
    <div class="carry-proof-examples">${examples
      .map(([m, title, why], index) => {
        return `<article class="carry-proof-example" data-proof-example="${index}" id="${panelIds[index]}" role="tabpanel" aria-labelledby="${panelIds[index]}Tab" tabindex="0"${index === 0 ? "" : " hidden"}>
        <h3>${esc(title)}</h3>
        <p class="carry-proof-equation"><span>${C.exactSum}</span><strong>${signedEquation(m)}</strong></p>
        ${bits(m)}${carries(m, true)}
        <p class="carry-proof-reading">${fill(C.retained, { bits: m.result.bits, signed: fmt(m.result.signed) })}</p>
        <p>${esc(why)}</p>
        <p class="carry-proof-verdict">${fill(C.verdict, { carryIn: m.carryIn, carryOut: m.carryOut, v: m.flags.v })}</p>
      </article>`;
      })
      .join("")}</div>
    <div class="carry-proof-matching"><h3>${C.matchingTitle}</h3><p>${C.matching}</p><p>${C.opposite}</p></div>
    <div class="carry-proof-check"><h3>${C.checkTitle}</h3><p>${C.checkPrompt}</p>
      <p class="carry-proof-fresh-inputs"><span>${C.firstInput}: <code>${fresh.a.bits}</code></span><span>${C.secondInput}: <code>${fresh.b.bits}</code></span></p>
      ${carries(fresh)}
      <details><summary>${C.reveal}</summary><div><p>${fill(C.feedback, { v: fresh.flags.v, signedSum: fmt(fresh.signedSum) })}</p><p class="carry-proof-equation">${signedEquation(fresh)}</p><p>${fill(C.retained, { bits: fresh.result.bits, signed: fmt(fresh.result.signed) })}</p></div></details>
    </div>`;
}
