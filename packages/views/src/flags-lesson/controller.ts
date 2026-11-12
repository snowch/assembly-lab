// Copyright © 2026 Christopher Snow

// Imperative adapter over the approved, authored HTML. All queries are scoped to one lesson
// root, all arithmetic comes from the course model, and work is held by the shared runtime.
// There is no embedded script, eval, iframe, second storage namespace or prototype model bundle.
import type { LessonStore } from "@platform/lesson-runtime";
import type { Challenge } from "@platform/lesson-schema";
import type { RecordedProgram } from "../listing";
import { grade } from "../grader";
import { S, A, E } from "./strings";
import {
  FLAG_NAMES,
  flagsModel,
  type FlagsModel,
  type Width,
  type FlagName,
  type Digit,
} from "./model";
import {
  FLAGS_VIEW_SLOT,
  blank,
  emptyAnswers,
  complete,
  stateFor,
  committedCase,
  gradeCase,
  currentArtifact,
  commitCase,
  type FlagsState,
  type Answers,
} from "./state";

export function mountFlagsLesson(
  root: HTMLElement,
  store: LessonStore,
  program: RecordedProgram,
  challenge: Challenge,
): () => void {
  const $ = <T extends HTMLElement = HTMLElement>(id: string): T => {
    const node = root.querySelector<T>(`[id="${id}"]`);
    if (!node) throw new Error(`Missing flags lesson element: ${id}`);
    return node;
  };
  const names = FLAG_NAMES;

  const esc = (s: unknown) =>
    String(s).replace(
      /[&<>"']/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
    );
  function t(key: keyof typeof S, values: Record<string, string | number> = {}): string {
    const source = S[key];
    if (typeof source !== "string") throw new Error(`Expected flags copy string: ${key}`);
    return Object.entries(values).reduce(
      (text, [k, v]) => text.replaceAll("{" + k + "}", String(v)),
      source as string,
    );
  }
  const fmt = (x: string | number | bigint) => BigInt(x).toLocaleString("en-GB").replace(/^-/, "−");
  const sum = (
    a: string | number | bigint,
    b: string | number | bigint,
    total: string | number | bigint,
  ) => `${fmt(a)} + ${BigInt(b) < 0n ? "(" + fmt(b) + ")" : fmt(b)} = ${fmt(total)}`;
  const M = { compute: (width: Width, a: number, b: number) => flagsModel(program, width, a, b) };
  const comparisonModels = (
    [
      [15, 1],
      [7, 1],
      [8, 8],
      [8, 15],
    ] as const
  ).map(([a, b]) => M.compute(4, a, b));
  const mini = M.compute(4, 5, 12),
    practiceModels = (
      [
        [0xffffffff, 1],
        [5, 3],
        [0x80000000, 0x80000000],
      ] as const
    ).map(([a, b]) => M.compute(32, a, b)),
    followup = M.compute(32, 1, 0xffffffff);
  let state: FlagsState = stateFor(store, challenge);
  function save() {
    store.setSlot(FLAGS_VIEW_SLOT, structuredClone(state));
  }
  const good = (a: Answers, m: FlagsModel) =>
    complete(a) && names.every((n) => a.choices[n] === m.flags[n]);
  const casePassed = (i: number) =>
    committedCase(store, challenge, i, state.practice.cases[i]!) &&
    gradeCase(store, challenge, i).passed;
  const allPassed = () =>
    practiceModels.every((_, i) => casePassed(i)) &&
    grade(challenge, currentArtifact(store, challenge)).passed;
  function flags(m: FlagsModel, only: readonly FlagName[] = names) {
    return `<div class="flag-strip flag-row" role="group" aria-label="${esc(only.length === 4 ? S.allFlags : t("flagLabel", { flag: only[0]!.toUpperCase() }))}">${only.map((n) => `<span class="flag-chip flag ${n === "c" && m.flags.c ? "hot-c" : n === "v" && m.flags.v ? "hot-v" : ""}" data-flag="${n}" data-set="${m.flags[n] === 1}" aria-label="${n.toUpperCase()}: ${m.flags[n]}"><span>${n.toUpperCase()}</span><strong>${m.flags[n]}</strong></span>`).join("")}</div>`;
  }
  function miniBits(bits: string) {
    return [...bits]
      .map((b, i) => `<span class="mini-bit ${i === 0 ? "top-bit" : ""}">${b}</span>`)
      .join("");
  }
  function matrix(m: FlagsModel) {
    return `<div class="math-wrap matrix" role="img" aria-label="${esc(S.firstInput)}: ${m.a.bits}; ${esc(S.secondInput)}: ${m.b.bits}; ${esc(S.retained)}: ${m.result.bits}">${[m.a.bits, m.b.bits, m.result.bits].map((bits, i) => `<div class="math-row ${i === 2 ? "result" : ""}" ${i === 2 ? 'data-result="true"' : ""}><span class="math-prefix" aria-hidden="true">${i === 1 ? "+" : ""}</span><span class="mini-bit-row">${miniBits(bits)}</span></div>`).join("")}</div>`;
  }
  function ranges(width: Width) {
    const top = 1n << BigInt(width - 1);
    return `<div class="range-choices range-pair" data-width="${width}"><div class="range-choice"><span>${esc(S.unsignedRange)}</span><strong>0 … ${fmt((top << 1n) - 1n)}</strong></div><div class="range-choice"><span>${esc(S.signedRange)}</span><strong>${fmt(-top)} … ${fmt(top - 1n)}</strong></div></div>`;
  }
  function readings(m: FlagsModel) {
    return (["unsigned", "signed"] as const)
      .map((reading) => {
        const flag = reading === "unsigned" ? "c" : "v";
        return `<div class="fit-cell ${m.flags[flag] ? (reading === "unsigned" ? "overflow" : "overflow-signed") : ""}" data-reading="${reading}" data-overflow="${m.flags[flag] === 1}"><span>${esc(S[reading])} · ${flag.toUpperCase()}</span><strong>${sum(m.a[reading], m.b[reading], reading === "unsigned" ? m.unsignedSum : m.signedSum)}</strong><p>${esc(m.flags[flag] ? S.outside : S.fits)} · ${flag.toUpperCase()} = ${m.flags[flag]}</p><div>${esc(S.storedReading)}: ${fmt(m.result[reading])}</div></div>`;
      })
      .join("");
  }
  function carry(m: FlagsModel) {
    return `<details><summary>${esc(S.carryDetail)}</summary><div><div class="carry-pair"><div>${esc(S.carryIn)}<strong>${m.carryIn}</strong></div><div>${esc(S.carryOut)}<strong>${m.carryOut}</strong></div></div><p>${esc(S.carryRule)}</p></div></details>`;
  }
  function choices(prefix: string, a: Answers) {
    return `<div class="flag-form">${names.map((n) => `<fieldset class="flag-input"><legend class="char">${n.toUpperCase()}</legend><div class="bit-choices radios">${[0, 1].map((v) => `<label class="${a.choices[n] === v ? "selected" : ""}"><input class="visually-hidden" type="radio" name="${prefix}-${n}" value="${v}" ${a.choices[n] === v ? "checked" : ""}><span>${v}</span></label>`).join("")}</div></fieldset>`).join("")}</div>`;
  }
  function bits32(m: FlagsModel) {
    return `<div class="byte-groups">${[0, 1, 2, 3].map((i) => `<div class="byte"><span class="label">${31 - i * 8}–${24 - i * 8}</span><div>${[...m.result.bits.slice(i * 8, i * 8 + 8)].map((b) => `<span class="bit" data-on="${b === "1"}">${b}</span>`).join("")}</div></div>`).join("")}</div>`;
  }
  let inspectMode = "N",
    fitMode = "C",
    signedDirection = 0;
  function bitMarkup(bits: string, spotted: number[] = [], dim = false) {
    return [...bits]
      .map(
        (b, i) =>
          `<span class="bit ${b === "1" ? "on" : ""} ${spotted.includes(i) ? "spot" : ""} ${dim && !spotted.includes(i) ? "dim" : ""}">${b}<small class="bit-index">${bits.length - 1 - i}</small></span>`,
      )
      .join("");
  }
  function selectTab(ids: string[], active: string) {
    ids.forEach((id) => {
      const b = $(id),
        yes = id === active;
      b.classList.toggle("active", yes);
      b.setAttribute("aria-pressed", String(yes));
    });
  }
  function renderResults() {
    const m = inspectMode === "N" ? M.compute(4, 8, 1) : M.compute(4, 0, 0),
      n = inspectMode === "N";
    selectTab(["tabN", "tabZ"], n ? "tabN" : "tabZ");
    $("inspectBadge").textContent = inspectMode;
    $("inspectTitle").textContent = n ? S.nInspectTitle : S.zInspectTitle;
    $("inspectDesc").textContent = n ? S.nInspectDescription : S.zInspectDescription;
    $("inspectVisualTitle").textContent = n ? S.nInspectHint : S.zInspectHint;
    $("inspectCaution").innerHTML = n ? S.nInspectCaution : S.zInspectCaution;
    $("inspectBits").innerHTML = bitMarkup(m.result.bits, n ? [0] : [0, 1, 2, 3], n);
    $("inspectVerdict").innerHTML =
      `<strong>${inspectMode} = ${m.flags[n ? "n" : "z"]}</strong> · ${esc(t("resultReadings", { unsigned: fmt(m.result.unsigned), signed: fmt(m.result.signed) }))}`;
  }
  function renderFit() {
    const m = comparisonModels[0]!,
      panel = $("carryPanel");
    panel.querySelector(".carry-digit")!.innerHTML =
      `<small>${esc(S.carryOutLabel)}</small>${m.carryOut}`;
    panel.querySelector(".stored")!.innerHTML = [...m.result.bits]
      .map((b) => `<span class="bit">${b}</span>`)
      .join("");
    panel.querySelector(".hintline")!.textContent =
      sum(m.a.unsigned, m.b.unsigned, m.unsignedSum) + " · " + S.unsignedTooLarge;
    panel.querySelector(".insight span:last-child")!.innerHTML = t("carryExample", {
      flag: m.flags.c,
      sum: fmt(m.unsignedSum),
      max: fmt((1n << BigInt(m.width)) - 1n),
      bits: m.result.bits,
    });
    selectTab(["tabC", "tabV"], fitMode === "C" ? "tabC" : "tabV");
    $("carryPanel").hidden = fitMode !== "C";
    $("overflowPanel").hidden = fitMode !== "V";
    renderDirection();
  }
  function renderDirection() {
    const m = signedDirection ? comparisonModels[3]! : comparisonModels[1]!;
    selectTab(["positiveBtn", "negativeBtn"], signedDirection ? "negativeBtn" : "positiveBtn");
    $("overflowEquation").textContent = sum(m.a.signed, m.b.signed, m.signedSum);
    $("overflowOutcome").textContent =
      `V = ${m.flags.v} · ${S.outside} · ${S.retained}: ${m.result.bits} · ${S.signed}: ${fmt(m.result.signed)}`;
  }
  function renderComparison() {
    const m = comparisonModels[state.example]!,
      q = E[state.example]!;
    selectTab(
      ["exampleC", "exampleV", "exampleBoth", "exampleNegative"],
      ["exampleC", "exampleV", "exampleBoth", "exampleNegative"][state.example]!,
    );
    $("exampleHeading").textContent = q.title;
    $("exampleIntro").textContent = q.intro;
    $("exampleA").innerHTML = miniBits(m.a.bits);
    $("exampleB").innerHTML = miniBits(m.b.bits);
    $("exampleR").innerHTML = miniBits(m.result.bits);
    $("exampleCarryOut").textContent = String(m.carryOut);
    $("exampleCarryIn").textContent = String(m.carryIn);
    $("exampleCarryRule").textContent = m.carryIn === m.carryOut ? S.carryMatch : S.carryDiffer;
    for (const [key, reading, flag] of [
      ["Unsigned", "unsigned", "c"],
      ["Signed", "signed", "v"],
    ] as const) {
      $("example" + key + "Main").textContent = sum(
        m.a[reading],
        m.b[reading],
        reading === "unsigned" ? m.unsignedSum : m.signedSum,
      );
      $("example" + key + "Sub").textContent = m.flags[flag] ? S.outside : S.fits;
      $("example" + key + "Verdict").textContent =
        (m.flags[flag] ? S.yes : S.no) + " · " + flag.toUpperCase() + " = " + m.flags[flag];
      $("example" + key).className =
        "fit-cell " +
        (m.flags[flag] ? (reading === "unsigned" ? "overflow" : "overflow-signed") : "");
    }
    $("cChip").className = "flag-chip " + (m.flags.c ? "hot-c" : "");
    $("vChip").className = "flag-chip " + (m.flags.v ? "hot-v" : "");
    $("cChip").innerHTML = `C · unsigned <strong>${m.flags.c}</strong>`;
    $("vChip").innerHTML = `V · signed <strong>${m.flags.v}</strong>`;
    $("exampleConsequence").innerHTML = q.consequence;
  }

  function syncChoiceLabels() {
    root
      .querySelectorAll(".bit-choices label")
      .forEach((l) =>
        l.classList.toggle("selected", l.querySelector<HTMLInputElement>("input")!.checked),
      );
  }
  function bindChoiceForm(
    id: string,
    prefix: string,
    onChange: (flag: FlagName, value: Digit) => void,
  ) {
    $(id).addEventListener("change", (e) => {
      const input = e.target;
      if (
        input instanceof HTMLInputElement &&
        input.type === "radio" &&
        input.name.startsWith(prefix + "-")
      ) {
        const flag = input.name.slice(prefix.length + 1) as FlagName;
        if (names.includes(flag) && (input.value === "0" || input.value === "1"))
          onChange(flag, Number(input.value) as Digit);
      }
      syncChoiceLabels();
    });
  }
  function miniFeedback() {
    const a = state.mini;
    if (!a.checked || !complete(a) || !a.intent) {
      $("miniFeedback").innerHTML = "";
      return;
    }
    $("miniFeedback").innerHTML =
      `<div class="feedback" data-correct="${good(a, mini) && a.intent === "c"}"><p><strong>${esc(good(a, mini) ? S.miniCorrect : S.miniIncorrect)}</strong></p>${flags(mini)}<div class="math-notes">${readings(mini)}</div><p>${esc(a.intent === "c" ? S.intentCorrect : S.intentIncorrect)}</p><p>${esc(S.miniTakeaway)}</p></div>`;
  }
  function renderMini() {
    $("miniBits").innerHTML = matrix(mini);
    $("miniChoices").innerHTML = choices("mini", state.mini);
    $("intentChoices").innerHTML = ["c", "v"]
      .map(
        (n) =>
          `<label><input type="radio" name="intent" value="${n}" ${state.mini.intent === n ? "checked" : ""}>${n.toUpperCase()}</label>`,
      )
      .join("");
    miniFeedback();
  }
  let armResult: FlagsModel | undefined;
  function arm(): FlagsModel {
    return (armResult ??= M.compute(32, 0x7fffffff, 1));
  }
  function armCorrectChoice() {
    return arm().flags.c ? (arm().flags.v ? 3 : 2) : arm().flags.v ? 1 : 0;
  }
  function renderArmFeedback() {
    const a = state.arm;
    if (a.committed === null || a.draft !== a.committed) {
      $("armFeedback").innerHTML = "";
      return;
    }
    $("armFeedback").innerHTML =
      `<div class="feedback" data-correct="${a.committed === armCorrectChoice()}"><p><strong>${esc(a.committed === armCorrectChoice() ? S.armCorrect : S.armIncorrect)}</strong></p><p class="mono">${esc(S.exactSum)}: ${fmt(arm().unsignedSum)}</p><ul><li>${esc(S.unsigned)}: ${esc(S.fits)} · C = ${arm().flags.c}</li><li>${esc(S.signed)}: ${esc(S.outside)} · V = ${arm().flags.v}</li></ul><p>${esc(S.armExplanation)}</p></div>`;
  }
  function renderArmInspection() {
    const a = state.arm;
    if (a.committed === null) {
      $("armInspection").innerHTML = `<p class="locked">${esc(S.choosePrediction)}</p>`;
      return;
    }
    $("armInspection").innerHTML =
      `<p class="label">${esc(S.checked)}: ${esc(S.armChoices[a.committed])}</p><details id="explorer" ${a.open ? "open" : ""}><summary>${esc(S.exploreTitle)}</summary><div><p>${esc(S.exploreLead)}</p><p class="label">${esc(S.registerResult)}</p><code class="value" data-fixed-result>${arm().result.hex}</code><div class="switcher" id="readingButtons" role="group" aria-label="${esc(S.exploreTitle)}">${(["unsigned", "signed"] as const).map((r) => `<button type="button" data-reading="${r}" aria-pressed="${a.reading === r}">${esc(S[r])}</button>`).join("")}</div><div id="readerValue"></div>${flags(arm())}<p class="stable">${esc(S.unchanged)}</p><details id="allBits" ${a.bits ? "open" : ""}><summary>${esc(S.showAllBits)}</summary><div>${bits32(arm())}</div></details></div></details><details id="columnTrace" ${a.trace ? "open" : ""}><summary>${esc(S.traceTitle)}</summary><div><p>${esc(S.traceLead)}</p><p class="muted">${esc(S.carryNote)}</p><div class="trace-scroll" tabindex="0" role="region" aria-label="${esc(S.traceTitle)}"><div id="traceRows" class="trace"></div></div><div id="columnDetail" class="column-detail" role="status" aria-live="polite"></div><div class="controls"><button type="button" id="nextCol">${esc(S.nextColumn)}</button><button type="button" id="nextGroup">${esc(S.nextGroup)}</button><button type="button" id="allCols">${esc(S.showAll)}</button><button type="button" id="prevCol">${esc(S.back)}</button><button type="button" id="resetCols">${esc(S.resetTrace)}</button></div></div></details>`;
    $("explorer").ontoggle = () => {
      state.arm.open = $<HTMLDetailsElement>("explorer").open;
      save();
    };
    $("allBits").ontoggle = () => {
      state.arm.bits = $<HTMLDetailsElement>("allBits").open;
      save();
    };
    $("columnTrace").ontoggle = () => {
      state.arm.trace = $<HTMLDetailsElement>("columnTrace").open;
      save();
      if (state.arm.trace) requestAnimationFrame(renderTrace);
    };
    $("readingButtons").onclick = (e) => {
      const b = e.target instanceof Element ? e.target.closest<HTMLButtonElement>("button") : null;
      if (!b) return;
      state.arm.reading = b.dataset.reading === "signed" ? "signed" : "unsigned";
      save();
      renderReader();
    };
    for (const [id, act] of [
      ["nextCol", (d: number) => Math.min(32, d + 1)],
      ["nextGroup", (d: number) => Math.min(32, (Math.floor(d / 4) + 1) * 4)],
      ["allCols", () => 32],
      ["prevCol", (d: number) => Math.max(0, d - 1)],
      ["resetCols", () => 0],
    ] as const)
      $(id).onclick = () => {
        state.arm.done = act(state.arm.done);
        save();
        renderTrace();
      };
    renderReader();
    renderTrace();
  }
  function renderReader() {
    const a = state.arm;
    root
      .querySelectorAll<HTMLButtonElement>("#readingButtons button")
      .forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.reading === a.reading)));
    $("readerValue").innerHTML =
      `<div class="value" data-reading-value>${fmt(arm().result[a.reading])}</div><p>${esc(S[a.reading === "unsigned" ? "unsignedExplanation" : "signedExplanation"])}</p><p class="mono">${esc(S.exactSum)}: ${fmt(a.reading === "unsigned" ? arm().unsignedSum : arm().signedSum)}</p><p><strong>${a.reading === "unsigned" ? "C" : "V"} = ${arm().flags[a.reading === "unsigned" ? "c" : "v"]}</strong> · ${esc(arm().flags[a.reading === "unsigned" ? "c" : "v"] ? S.outside : S.fits)}</p>`;
  }
  function renderTrace() {
    const d = state.arm.done,
      selected = d - 1;
    const cells = (label: string, get: (bit: number) => string | number) =>
      `<div class="trace-line"><span class="label">${esc(label)}</span>${Array.from(
        { length: 32 },
        (_, i) => {
          const bit = 31 - i,
            value = get(bit);
          return `<span class="trace-cell" data-selected="${bit === selected}" data-on="${value === 1 || value === "1"}">${value}</span>`;
        },
      ).join("")}</div>`;
    $("traceRows").innerHTML =
      cells(S.positions, (b) => b) +
      cells(S.traceCarry, (b) => (b < d + 1 ? arm().columns[b]!.carryIn : "?")) +
      cells("w0", (b) => arm().a.bits[31 - b]!) +
      cells("+ w1", (b) => arm().b.bits[31 - b]!) +
      cells(S.retained, (b) => (b < d ? arm().columns[b]!.kept : "?"));
    if (!d)
      $("columnDetail").innerHTML =
        `<strong>${esc(S.noColumn)}</strong><p>${esc(S.carryStart)}</p>`;
    else {
      const c = arm().columns[selected]!;
      $("columnDetail").innerHTML =
        `<h4>${esc(t("selectedColumn", { bit: c.bit }))}</h4><dl><dt>${esc(S.rowTotal)}</dt><dd>${c.a} + ${c.b} + ${c.carryIn} = ${c.total}</dd><dt>${esc(S.resultBit)}</dt><dd>${c.kept}</dd><dt>${esc(S.carryNext)}</dt><dd>${c.carryOut}</dd></dl>${d === 32 ? carry(arm()) + flags(arm()) : ""}`;
    }
    $<HTMLButtonElement>("nextCol").disabled = d === 32;
    $<HTMLButtonElement>("nextGroup").disabled = d === 32;
    $<HTMLButtonElement>("allCols").disabled = d === 32;
    $<HTMLButtonElement>("prevCol").disabled = d === 0;
    $<HTMLButtonElement>("resetCols").disabled = d === 0;
    const scroller = $("traceRows").parentElement;
    const active = $("traceRows").querySelector(
      d ? '[data-selected="true"]' : ".trace-line:first-child .trace-cell:last-child",
    );
    if (active && scroller!.clientWidth) {
      const r = active.getBoundingClientRect(),
        box = scroller!.getBoundingClientRect(),
        left =
          box.left +
          ($("traceRows").querySelector<HTMLElement>(".trace-line>.label")?.offsetWidth ?? 0) +
          5;
      if (r.right > box.right - 5) scroller!.scrollLeft += r.right - box.right + 5;
      else if (r.left < left) scroller!.scrollLeft -= left - r.left;
    }
  }
  function renderCaseTabs() {
    if ($("caseTabs").children.length !== 3)
      $("caseTabs").innerHTML = practiceModels
        .map(
          (_, i) =>
            `<button type="button" data-case="${i}">${i + 1}<span class="pass-mark"></span></button>`,
        )
        .join("");
    Array.from($("caseTabs").querySelectorAll<HTMLButtonElement>("button")).forEach((button, i) => {
      button.setAttribute("aria-pressed", String(state.practice.index === i));
      button.querySelector(".pass-mark")!.textContent = casePassed(i)
        ? S.passed
        : state.practice.cases[i]!.checked && complete(state.practice.cases[i]!)
          ? S.notPassed
          : S.notChecked;
    });
  }
  function renderPracticeWork() {
    const i = state.practice.index,
      m = practiceModels[i]!;
    $("practicePosition").textContent = t("practicePosition", { current: i + 1, total: 3 });
    $("caseEquation").innerHTML =
      `<span class="label">${esc(S.caseLabels[i])}</span><div class="hex-equation mono">${m.a.hex} + ${m.b.hex}</div>`;
    $("realFlags").innerHTML = choices("practice", state.practice.cases[i]!);
    renderPracticeStatus();
  }
  function renderPracticeStatus() {
    const i = state.practice.index,
      a = state.practice.cases[i]!,
      m = practiceModels[i]!;
    $<HTMLButtonElement>("prevCase").disabled = i === 0;
    $<HTMLButtonElement>("nextCase").disabled = i === 2 || !casePassed(i);
    if (a.checked && complete(a)) {
      $("caseFeedback").innerHTML =
        `<div class="feedback" data-correct="${good(a, m)}"><strong>${esc(
          good(a, m)
            ? S.caseCorrect
            : t("wrongFlags", {
                flags: names
                  .filter((n) => a.choices[n] !== m.flags[n])
                  .map((n) => n.toUpperCase())
                  .join(", "),
              }),
        )}</strong>${good(a, m) ? `<p class="mono">${m.result.hex}</p>${flags(m)}<div class="math-notes">${readings(m)}</div>` : ""}</div>`;
    } else $("caseFeedback").innerHTML = "";
    $("aggregate").textContent = allPassed() ? S.allCorrect : S.notComplete;
    $("challenge-predict-flags").dataset["complete"] = String(allPassed());
    renderCaseTabs();
    renderFollowup();
  }
  function renderFollowup() {
    $("followup").innerHTML = allPassed()
      ? `<p>${esc(S.followupLead)}</p><code class="instruction">adds w0, w0, w1</code><p class="mono">${followup.a.hex} + ${followup.b.hex} = ${followup.result.hex}</p>${flags(followup)}<div class="math-notes">${readings(followup)}</div>${carry(followup)}`
      : `<p class="locked">${esc(S.followupLocked)}</p>`;
  }
  function initialise() {
    root
      .querySelectorAll<HTMLElement>("[data-copy]")
      .forEach((el) => (el.textContent = String(S[el.dataset.copy as keyof typeof S] ?? "")));
    $("recap").innerHTML = S.recap.map((line) => `<li><span>${esc(line)}</span></li>`).join("");
    $("nzSummary").innerHTML = A.nzSummary
      .map((x) => `<p><strong>${x.flag} · ${esc(x.title)}.</strong> ${esc(x.text)}</p>`)
      .join("");
    $("cvSummary").innerHTML = A.cvSummary
      .map((x) => `<p><strong>${esc(x.title)}.</strong> ${esc(x.text)} ${esc(x.range)}</p>`)
      .join("");
    const v = comparisonModels[1]!;
    $("visibleVWorked").innerHTML =
      `${esc(S.exactSum)}: <strong>${sum(v.a.signed, v.b.signed, v.signedSum)}</strong>. V = ${v.flags.v} · ${esc(S.outside)}. ${esc(S.retained)}: <code>${v.result.bits}</code>; ${esc(S.signed)}: ${fmt(v.result.signed)}.`;
    const read = M.compute(4, 8, 1);
    root.querySelector("#read .bit-row")!.innerHTML = bitMarkup(read.result.bits);
    const values = root.querySelectorAll("#read .reading-value");
    values[0]!.textContent = fmt(read.result.unsigned);
    values[1]!.textContent = fmt(read.result.signed);
    $("armRanges").innerHTML = ranges(32);
    $("caseTabs").setAttribute("aria-label", S.progressLabel);
    $("armChoices").innerHTML = S.armChoices
      .map(
        (label, i) =>
          `<label class="choice"><input type="radio" name="arm-choice" value="${i}" ${state.arm.draft === i ? "checked" : ""}>${esc(label)}</label>`,
      )
      .join("");
    $("practiceWork").innerHTML =
      `<div id="caseEquation"></div><form id="realForm"><div id="realFlags"></div><div class="actions controls"><button type="submit" class="primary">${esc(S.checkFlags)}</button><button type="button" class="secondary" id="prevCase">${esc(S.previous)}</button><button type="button" class="secondary" id="nextCase">${esc(S.next)}</button></div></form><div id="caseFeedback" role="status" aria-live="polite"></div>`;
    const ids = ["exampleC", "exampleV", "exampleBoth", "exampleNegative"];
    ids.forEach((id, i) => ($(id).dataset.example = String(i)));
    renderResults();
    renderFit();
    renderComparison();
    renderMini();
    renderArmFeedback();
    renderArmInspection();
    renderPracticeWork();
    save();
  }
  initialise();
  $("tabN").onclick = () => {
    inspectMode = "N";
    renderResults();
  };
  $("tabZ").onclick = () => {
    inspectMode = "Z";
    renderResults();
  };
  $("tabC").onclick = () => {
    fitMode = "C";
    renderFit();
  };
  $("tabV").onclick = () => {
    fitMode = "V";
    renderFit();
  };
  $("positiveBtn").onclick = () => {
    signedDirection = 0;
    renderDirection();
  };
  $("negativeBtn").onclick = () => {
    signedDirection = 1;
    renderDirection();
  };

  root.querySelector<HTMLElement>("#compare .example-switcher")!.onclick = (e) => {
    const b = e.target instanceof Element ? e.target.closest<HTMLButtonElement>("button") : null;
    if (!b) return;
    state.example = Number(b.dataset.example);
    renderComparison();
    save();
  };
  bindChoiceForm("miniForm", "mini", (n, v) => {
    state.mini.choices[n] = v;
    state.mini.checked = false;
    miniFeedback();
    save();
  });
  $("miniForm").addEventListener("change", (e) => {
    const input = e.target;
    if (
      input instanceof HTMLInputElement &&
      input.name === "intent" &&
      (input.value === "c" || input.value === "v")
    ) {
      state.mini.intent = input.value;
      state.mini.checked = false;
      miniFeedback();
      save();
    }
  });
  $("miniForm").onsubmit = (e) => {
    e.preventDefault();
    if (!complete(state.mini) || !state.mini.intent) {
      $("miniFeedback").textContent = S.chooseAll;
      return;
    }
    state.mini.checked = true;
    save();
    miniFeedback();
  };
  $("clearMini").onclick = () => {
    state.mini = { ...emptyAnswers(), intent: null };
    save();
    renderMini();
  };
  $("armForm").onchange = (e) => {
    if (!(e.target instanceof HTMLInputElement)) return;
    state.arm.draft = Number(e.target.value);
    save();
    renderArmFeedback();
  };
  $("armForm").onsubmit = (e) => {
    e.preventDefault();
    if (state.arm.draft === null) {
      $("armFeedback").textContent = S.choosePrediction;
      return;
    }
    state.arm.committed = state.arm.draft;
    store.setSlot("predict-readings", {
      choice: ["both", "unsigned", "signed", "neither"][state.arm.committed],
    });
    save();
    renderArmFeedback();
    renderArmInspection();
  };
  $("clearPrediction").onclick = () => {
    state.arm = blank().arm;
    store.setSlot("predict-readings", undefined);
    $("armChoices")
      .querySelectorAll<HTMLInputElement>("input")
      .forEach((n) => (n.checked = false));
    save();
    renderArmFeedback();
    renderArmInspection();
  };
  bindChoiceForm("realForm", "practice", (n, v) => {
    const a = state.practice.cases[state.practice.index]!;
    a.choices[n] = v;
    a.checked = false;
    commitCase(store, challenge, state.practice.index, a, false);
    save();
    renderPracticeStatus();
  });
  $("realForm").onsubmit = (e) => {
    e.preventDefault();
    const a = state.practice.cases[state.practice.index]!;
    if (!complete(a)) {
      $("caseFeedback").textContent = S.chooseFlags;
      return;
    }
    a.checked = true;
    commitCase(store, challenge, state.practice.index, a, true);
    save();
    renderPracticeStatus();
  };
  $("prevCase").onclick = () => {
    if (state.practice.index > 0) {
      state.practice.index--;
      save();
      renderPracticeWork();
    }
  };
  $("nextCase").onclick = () => {
    if (casePassed(state.practice.index) && state.practice.index < 2) {
      state.practice.index++;
      save();
      renderPracticeWork();
    }
  };
  $("caseTabs").onclick = (e) => {
    const b = e.target instanceof Element ? e.target.closest<HTMLButtonElement>("button") : null;
    if (!b) return;
    state.practice.index = Number(b.dataset.case);
    save();
    renderPracticeWork();
  };
  $("practiceReset").onclick = () => {
    state.practice = blank().practice;
    store.resetChallenge(challenge.id);
    save();
    renderPracticeWork();
  };
  function updatePath() {
    const sections = [...root.querySelectorAll(".lesson-step")];
    const active =
      sections.filter((s) => s.getBoundingClientRect().top <= 160).at(-1) ?? sections[0]!;
    root.querySelectorAll("#nav a").forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === "#" + active.id);
      if (a.getAttribute("href") === "#" + active.id) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    });
  }
  let pathFrame = 0;
  const onScroll = () => {
    cancelAnimationFrame(pathFrame);
    pathFrame = requestAnimationFrame(updatePath);
  };
  const onLink = (event: MouseEvent) => {
    const link = event.target instanceof Element ? event.target.closest("a") : null;
    const href = link?.getAttribute("href");
    if (!href?.startsWith("#") || href.startsWith("#/")) return;
    const target = root.querySelector<HTMLElement>(href);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({
      block: "start",
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };
  root.addEventListener("click", onLink);
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", updatePath);
  updatePath();
  return () => {
    cancelAnimationFrame(pathFrame);
    root.removeEventListener("click", onLink);
    removeEventListener("scroll", onScroll);
    removeEventListener("resize", updatePath);
  };
}
