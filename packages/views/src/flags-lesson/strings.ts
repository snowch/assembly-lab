// Copyright © 2026 Christopher Snow

// Separate drafting pass from the user-approved v4 prototype. Numerical result targets
// in MARKUP are deliberately empty: the scoped controller fills them from the model.
// This is trusted, authored HTML; no learner input is interpolated into this template.

import { LOGIC_COPY } from "./strings.logic";

export const S = {
  nInspectTitle: "Is the sign bit 1?",
  zInspectTitle: "Are all retained bits zero?",
  nInspectDescription: "N copies the leftmost bit, bit 3 in this example.",
  zInspectDescription: "Z is 1 only when every retained bit is 0.",
  nInspectHint: "Look at bit 3 only",
  zInspectHint: "Look at all four bits together",
  nInspectCaution:
    "<strong>N is not the overflow flag.</strong> It describes the sign of the <em>stored result</em>. V, coming next, tells us whether the <em>signed addition</em> fitted.",
  zInspectCaution:
    "<strong>Z is also about the stored bits.</strong> It does not tell you whether the exact sum fitted.",
  carryOutLabel: "carry out",
  unsignedTooLarge: "too big",
  carryExample:
    "<strong>C = {flag}.</strong> {sum} does not fit in 0 to {max}. The fifth bit carries out; the stored result is {bits}.",
  carryMatch: "The carries match, so V = 0.",
  carryDiffer: "The carries differ, so V = 1.",
  yes: "Yes",
  no: "No",
  visibleVWorked:
    "{exactSum}: <strong>{equation}</strong>. V = {v} · {fit}. {retained}: <code>{bits}</code>; {signed}: {reading}.",
  title: "What the flags tell you",
  subtitle: "Read the stored result. Then check whether the exact sum fits.",
  module: "M2, L1",
  theme: "Change theme",
  reset: "Reset saved answers",
  saved: "Your checked answers are saved in this browser.",
  storageUnavailable:
    "This browser cannot save your answers. You can still use the lesson during this visit.",
  nav: [
    "ADD and ADDS",
    "Result flags",
    "Check the ranges",
    "Small practice",
    "32-bit prediction",
    "Real practice",
  ],
  introTitle: "ADD and ADDS",
  introLead:
    "An addition keeps the bits that fit in the destination. The flags give you more information about that addition.",
  flagDefinition:
    "A flag is a single bit that records a condition. A set flag has value 1; a clear flag has value 0.",
  addMeaning: "ADD writes the result without updating the flags.",
  addsMeaning: "ADDS writes the same result bits and updates the flags.",
  nzcvNames: "The flags appear in the order N, Z, C, V: negative, zero, carry and signed overflow.",
  miniatureNote:
    "These four-bit examples are teaching miniatures, not Arm registers. Instructions using w register names, such as w0, keep 32 result bits.",
  resultTitle: "N and Z describe the stored result",
  resultLead:
    "Read each result as unsigned and signed. Both readings describe the same stored bits.",
  nTitle: "N: the top bit",
  nRule:
    "N copies the top bit of the stored result. A set N means the signed reading is negative. N does not tell you whether the exact sum fits.",
  zTitle: "Z: all bits are zero",
  zRule: "Z is set when every bit of the stored result is zero.",
  resultReadings: "Unsigned: {unsigned}. Signed: {signed}.",
  compareTitle: "C is for unsigned. V is for signed.",
  compareLead:
    "Use the same input bits for both readings. Add the unsigned inputs for one exact sum, and the signed inputs for the other.",
  cRule:
    "For addition, C is set when the exact unsigned sum is outside the unsigned range. It is the carry out beyond the retained bits.",
  vRule:
    "For addition, V is set when the exact signed sum is outside the signed range. This is signed overflow.",
  unsignedRange: "Unsigned range",
  signedRange: "Signed range",
  cases: ["C only", "V only", "Both C and V", "Too negative"],
  firstInput: "First input",
  secondInput: "Second input",
  retained: "Stored result bits",
  unsigned: "Unsigned reading",
  signed: "Signed reading",
  exactSum: "Exact sum",
  fits: "Fits the range",
  outside: "Outside the range",
  carryDetail: "Optional: inspect the carries",
  carryIn: "Carry into the top bit",
  carryOut: "Carry out of the top bit",
  carryRule:
    "C is the carry out of the top bit. V is set when the carries into and out of the top bit differ.",
  programUse:
    "The program's intended meaning decides which range to check: C for unsigned addition, V for signed addition.",
  miniTitle: "Check a fresh small addition",
  miniLead:
    "The inputs and stored result are supplied below. Predict the flags after this four-bit addition, then choose the flag the program needs.",
  intentQuestion:
    "This fresh program uses unsigned counts. Which flag tells it that the exact sum does not fit?",
  flagLabel: "Value of {flag}",
  checkMini: "Check small example",
  clearMini: "Clear small example",
  chooseAll: "Choose a value for each flag and answer the program question before checking.",
  miniCorrect: "Your flags match this addition.",
  miniIncorrect:
    "Some flags differ from this addition. Compare the stored result for N and Z, then the exact sums for C and V.",
  intentCorrect: "You chose the flag that checks the program's unsigned range.",
  intentIncorrect:
    "Use the flag that checks the unsigned sum. The signed sum answers a different question.",
  miniTakeaway:
    "This program needs C because its values are unsigned counts. V would miss the unsigned overflow in this example.",
  armTitle: "Predict a real 32-bit addition",
  armLead:
    "This instruction uses w0 to keep 32 result bits. It adds the supplied starting inputs once.",
  armQuestion:
    "Which readings of the exact sum fit their 32-bit ranges? Predict before inspecting the result.",
  armRanges: "Use these ranges with the unsigned and signed readings of the starting inputs.",
  armInputDisplayLabel: "Display inputs as",
  armInputHex: "Hex",
  armInputUnsigned: "Unsigned decimal",
  armInputSigned: "Signed decimal",
  armInputReadingNote: "The input bits stay the same; only their displayed reading changes.",
  armInputReadingsMatch:
    "Both starting inputs have clear sign bits, so their signed and unsigned decimal readings match.",
  armChoices: ["Both", "Unsigned only", "Signed only", "Neither"],
  checkPrediction: "Check prediction",
  clearPrediction: "Clear prediction",
  choosePrediction: "Choose a range prediction before checking.",
  armCorrect: "Your range prediction matches the addition.",
  armIncorrect: "Your range prediction differs from the addition.",
  armUnsignedMatch: "Matches the exact sum.",
  armSignedDifference: "Differs from the exact sum.",
  armExplanation:
    "The exact signed sum exceeds the signed range. The stored negative reading is valid.",
  registerResult: "Result written to w0",
  practiceTitle: "Predict flags for real additions",
  practiceLead:
    "Each case starts a fresh 32-bit addition with the inputs shown. Predict every flag after ADDS.",
  practicePosition: "Case {current} of {total}",
  caseLabels: [
    "Adding one at the unsigned limit",
    "A small sum",
    "Two inputs with their top bit set",
  ],
  inputLabel: "Starting inputs",
  checkFlags: "Check flags",
  previous: "Previous case",
  next: "Next case",
  chooseFlags: "Choose a value for every flag before checking.",
  wrongFlags: "Check these flags again: {flags}.",
  caseCorrect: "Your flags match this case.",
  allCorrect: "Every case has a checked, correct answer. The follow-up is ready.",
  notComplete:
    "Check a correct answer for every case to open the follow-up. Moving to the next case does not complete it.",
  editInvalidates:
    "You changed an answer. Check this case again; the follow-up stays locked until every case is correct.",
  practiceReset: "Clear practice answers",
  followupTitle: "Inspect the first case with its inputs reversed",
  followupLocked: "Complete every practice case correctly to open this addition.",
  followupLead:
    "The first practice case appears below with its input order reversed. Inspect the result and flags using the same checks.",
  recapTitle: "Keep the bits and the sums separate",
  recap: [
    "N reads the stored result's top bit.",
    "Z checks whether all stored result bits are zero.",
    "For addition, C checks whether the exact unsigned sum fits.",
    "For addition, V checks whether the exact signed sum fits.",
  ],
  nextLessonLabel: "Next lesson",
  nextLessonTitle: "M2, L2: Flags and overflow",
  calculatorLabel: "Revisit the programmer calculator",
  calculatorNote:
    "Optional: use the programmer calculator in the register-width lesson to explore other inputs.",
  zero: "0 · clear",
  one: "1 · set",
  intentLabel: "Flag for the program's range check",
  resetDone: "Saved answers cleared.",
  copyright: "Copyright © 2026 Christopher Snow",
  bits: "Bits",
  allFlags: "All flags",
  exampleLabel: "Comparison example",
  chooseExample: "Choose an example",
  carryZero: "No incoming carry",
  traceResult: "Stored result",
  traceInputs: "Input bits",
  notChecked: "Not checked",
  passed: "Correct",
  notPassed: "Needs another check",
  progressLabel: "Practice progress",
  showExplorer: "Inspect the result",
  hideExplorer: "Hide the result explorer",
  showBitsHint: "Show the full bit pattern for this result.",
  caseInvalidated: "You changed this case. Check your new answer to count it towards completion.",
  predictionLegend: "Your prediction",
  storedReading: "Stored result as a number",
} as const;

export const A = {
  nzSummary: [
    {
      flag: "N",
      title: "The top bit",
      text: "N copies the top bit of the stored result. N = 1 means its signed reading is negative. It does not report signed overflow.",
    },
    {
      flag: "Z",
      title: "All bits zero",
      text: "Z = 1 only when every stored result bit is 0.",
    },
  ],
  cvSummary: [
    {
      flag: "C",
      title: "Unsigned addition",
      text: "C = 1 when the exact unsigned sum exceeds the unsigned maximum.",
      range: "Four bits: 0 to 15.",
    },
    {
      flag: "V",
      title: "Signed addition",
      text: "V = 1 when the exact signed sum falls outside the signed range.",
      range: "Four bits: −8 to 7.",
    },
  ],
  negativeExample: {
    title: "The signed sum is too negative.",
    intro: "The unsigned sum also exceeds its range.",
    consequence:
      "Using signed values? V = 1 warns that −8 + (−1) does not fit. Check V even though C is also 1 here.",
  },
} as const;

export const E = [
  {
    title: "The unsigned answer doesn't fit.",
    intro: "But the signed answer does.",
    consequence:
      "<strong>Using unsigned values?</strong> C = 1 warns that 15 + 1 did not fit. If your program checked V = 0 instead, it would miss the unsigned overflow.",
  },
  {
    title: "The signed answer doesn't fit.",
    intro: "But the unsigned answer does.",
    consequence:
      "<strong>Using signed values?</strong> V = 1 warns that +7 + 1 did not fit. If your program checked C = 0 instead, it would miss the signed overflow.",
  },
  {
    title: "Both answers are out of range.",
    intro: "A single addition can set C and V together.",
    consequence:
      "<strong>Both checks detect overflow here.</strong> C = 1 for unsigned 8 + 8, and V = 1 for signed −8 + (−8). Your program still checks the flag appropriate to its numbers.",
  },
  {
    title: "The signed sum is too negative.",
    intro: "The unsigned sum also exceeds its range.",
    consequence:
      "Using signed values? V = 1 warns that −8 + (−1) does not fit. Check V even though C is also 1 here.",
  },
] as const;

export const FLAGS_LESSON_SECTIONS = [
  {
    id: "read",
    title: "One pattern. Two readings.",
    label: "First, a mental model",
  },
  {
    id: "resultflags",
    title: "N and Z look at the result.",
    label: "The first two flags",
  },
  {
    id: "checkranges",
    title: "C is for unsigned. V is for signed.",
    label: "Two interpretations",
  },
  {
    id: "compare",
    title: "How do you know whether the answer fitted?",
    label: "Why this matters",
  },
  {
    id: "smallpractice",
    title: "",
    label: "Small practice",
  },
  {
    id: "arm",
    title: "ARM uses the same rules with 32 bits.",
    label: "Apply it to a real instruction",
  },
  {
    id: "realpractice",
    title: "Predict the four flags.",
    label: "Your turn",
  },
] as const;

export const MARKUP = `<div class="layout lesson al-flags-lesson" id="top" data-lesson="adding-and-the-flags" aria-labelledby="lesson-title">
  <nav class="sidebar" aria-label="On this page" id="nav"><p class="sidebar-title">Your path</p>
    <a class="side-link active" href="#read"><span class="side-no">01</span>Read the bits</a>
    <a class="side-link" href="#resultflags"><span class="side-no">02</span>N and Z</a>
    <a class="side-link" href="#checkranges"><span class="side-no">03</span>C and V</a>
    <a class="side-link" href="#compare"><span class="side-no">04</span>Why the flag matters</a><a class="side-link" href="#smallpractice"><span class="side-no">05</span>Small practice</a>
    <a class="side-link" href="#arm"><span class="side-no">06</span>Move to ARM</a>
    <a class="side-link" href="#realpractice"><span class="side-no">07</span>Try three additions</a>


    <p class="side-note">One idea at a time. Extra explanation is tucked away until you need it.</p>
  </nav>
  <div class="page">
    <section class="hero" aria-labelledby="lesson-title"><div class="eyebrow"><span class="dot"></span> Adding, subtracting and the flags</div><h1 id="lesson-title">Adding and the flags</h1><p class="lede">What if the exact answer to an addition doesn't fit in the register?</p>
      <div class="bridge-intro" aria-label="What we already know and what is new"><div class="bridge-head">Picking up where we left off</div><p class="bridge-foot" data-copy="flagDefinition"></p><p>You've already used <code>add</code> to save a sum. <code>adds</code> saves the <strong>same result</strong>, but its extra <code>s</code> means <strong>set flags</strong>: update four separate one-bit indicators, N, Z, C and V.</p>
      <p class="bridge-foot" data-copy="nzcvNames"></p><div class="command-pair" aria-label="Comparison of add and adds"><div class="command-row"><code>add w0, w0, w1</code><span>Save the sum</span></div><div class="command-row emphasis"><code>adds w0, w0, w1</code><span>Sum + N Z C V</span></div></div>
      <p class="bridge-foot" data-copy="miniatureNote">We'll use four-bit teaching examples before returning to 32-bit ARM.</p></div>
      <a class="hero-start" href="#read">Start with four bits <span aria-hidden="true">↓</span></a></section>

    <section class="lesson-step lesson-section" id="read"><div class="step-head"><div class="step-kicker"><span class="step-counter">01</span> First, a mental model</div><h2><span class="section-title">One pattern. Two readings.</span></h2><p class="step-description">Four bits are a small container. They store a pattern. The pattern does not say whether its reading is signed or unsigned.</p></div>
      <div class="focus-card"><div class="focus-label">The retained result</div><div class="single-visual"><div class="bit-row"></div></div><div class="readings"><div class="reading"><div class="reading-label">Read as unsigned</div><div class="reading-value"></div></div><div class="reading"><div class="reading-label">Read as signed</div><div class="reading-value"></div></div></div><div class="insight"><span class="bulb">!</span><span><strong>Same four bits.</strong> The unsigned range is 0 to 15. The signed range is −8 to +7.</span></div></div>
      <a class="next-link" href="#resultflags">Next: inspect the result <span aria-hidden="true">→</span></a>
    </section>

    <section class="lesson-step lesson-section" id="resultflags"><div class="step-head"><div class="step-kicker"><span class="step-counter">02</span> The first two flags</div><h2><span class="section-title">N and Z look at the result.</span></h2><p class="step-description">They don't need to know how the calculation happened. They only inspect the four saved bits.</p><div class="essential-note" id="nzSummary"></div></div>
      <div class="focus-card"><div class="switcher" role="group" aria-label="Choose a result flag"><button id="tabN" class="active" aria-pressed="true">N · Negative</button><button id="tabZ" aria-pressed="false">Z · Zero</button></div><div class="one-flag"><span class="flag-badge" id="inspectBadge">N</span><div><h3 class="flag-title" id="inspectTitle">Is the sign bit 1?</h3><p class="flag-description" id="inspectDesc">N copies the leftmost bit, bit 3 in this example.</p></div></div><div class="flag-visual"><div class="hintline" id="inspectVisualTitle">Only the leftmost bit matters</div><div class="bit-row" id="inspectBits"></div></div><div class="result-verdict" id="inspectVerdict"></div><p class="plain-note" id="inspectCaution"><strong>N isn't the overflow flag.</strong> It describes the sign of the <em>stored result</em>. V, coming next, tells us whether the <em>signed addition</em> fitted.</p></div>
      <a class="next-link" href="#checkranges">Next: check whether the answer fitted <span aria-hidden="true">→</span></a>
    </section>

    <section class="lesson-step lesson-section" id="checkranges">
      <div class="step-head">
        <div class="step-kicker"><span class="step-counter">03</span> Two interpretations</div>
        <h2><span class="section-title">C is for unsigned. V is for signed.</span></h2>
        <p class="step-description">The CPU performs one addition. Choose the interpretation you care about, then check its flag.</p>
      <div class="essential-note" id="cvSummary"></div><p class="plain-note" id="visibleVWorked"></p></div>
      <div class="focus-card">
        <div class="switcher fit-switcher" role="group" aria-label="Choose which interpretation to examine">
          <button id="tabC" class="orange active" aria-pressed="true">C · Unsigned</button>
          <button id="tabV" class="purple" aria-pressed="false">V · Signed</button>
        </div>
        <div id="carryPanel">
          <div class="one-flag">
            <span class="flag-badge orange">C</span>
            <div>
              <h3 class="flag-title">Is the unsigned sum too big?</h3>
              <p class="flag-description">Four unsigned bits hold 0 to 15.</p>
            </div>
          </div>
          <div class="flag-visual">
            <div class="hintline"></div>
            <div class="carry-visual">
              <div class="carry-digit"><small>carry out</small></div>
              <div class="carry-divider"></div>
              <div class="stored"></div>
            </div>
            <div class="stored-label">← extra bit &nbsp; | &nbsp; four retained bits</div>
          </div>
          <div class="insight"><span class="bulb">!</span><span></span></div>
        </div>
        <div id="overflowPanel" hidden="">
          <div class="one-flag">
            <span class="flag-badge purple">V</span>
            <div>
              <h3 class="flag-title">Is the signed sum too big or too small?</h3>
              <p class="flag-description">Four signed bits hold −8 to +7. Overflow can happen at either end.</p>
            </div>
          </div>
          <div class="flag-visual">
            <div class="hintline">The four-bit signed range</div>
            <div class="range">
              <div class="range-labels"><span>below −8</span><span>−8</span><span>+7</span><span>above +7</span></div>
              <div class="range-track"><span class="range-left"></span><span class="range-middle"></span><span class="range-right"></span></div>
              <div class="range-foot"><span>overflow</span><span>representable</span><span>overflow</span></div>
            </div>
            <div class="range-example" aria-live="polite">
              <div class="equation" id="overflowEquation"></div>
              <div class="sub" id="overflowOutcome"></div>
            </div>
            <div class="subswitch" role="group" aria-label="Select a direction of signed overflow">
              <button id="positiveBtn" class="active" aria-pressed="true">Too positive →</button>
              <button id="negativeBtn" aria-pressed="false">← Too negative</button>
            </div>
          </div>
          <p class="fit-footnote"><strong>V = 1</strong> when the exact signed sum falls outside −8 to +7.</p>
        </div>
      </div>
      <a class="next-link" href="#compare">Next: why checking the right flag matters <span aria-hidden="true">→</span></a>
    </section>

    <section class="lesson-step lesson-section" id="compare">
      <div class="step-head">
        <div class="step-kicker"><span class="step-counter">04</span> Why this matters</div>
        <h2><span class="section-title">How do you know whether the answer fitted?</span></h2>
        <p class="step-description">After <code>adds</code>, both flags have values. <strong>Your program must check the flag that matches its numbers.</strong> Checking the other one can miss an overflow.</p>
      </div>
      <div class="focus-card">
        <div class="program-choice" aria-label="Choose which flag to use based on the kind of numbers in your program">
          <div class="program-choice-title">Which numbers does your program use?</div>
          <div class="program-options">
            <div class="program-option unsigned-option"><span>Unsigned numbers</span><strong>Check C</strong></div>
            <div class="program-option signed-option"><span>Signed numbers</span><strong>Check V</strong></div>
          </div>
        </div>
        <div class="compare-divider" role="presentation"></div>
        <h3 class="compare-prompt">See why checking the right one matters</h3>
        <p class="compare-subtitle">Try these additions. The same operation may overflow under one interpretation, but not the other.</p>
        <div class="switcher example-switcher" role="group" aria-label="Choose which flags are set by the example addition">
          <button class="active orange" id="exampleC" aria-pressed="true" aria-label="C only: unsigned overflow without signed overflow">C only</button>
          <button class="purple" id="exampleV" aria-pressed="false" aria-label="V only: signed overflow without unsigned overflow">V only</button>
          <button id="exampleBoth" aria-pressed="false" aria-label="Both C and V set">Both</button>
        <button id="exampleNegative" class="purple" type="button" data-example="3">Too negative</button></div>
        <h3 class="flag-title" id="exampleHeading">The unsigned answer doesn't fit.</h3>
        <p class="flag-description" id="exampleIntro">But the signed answer does.</p>
        <div class="math-wrap" aria-live="polite">
          <div class="msb-carry" aria-label="Carry entering and leaving the leftmost bit, bit 3">
            <div class="msb-carry-caption">Only look at the top bit (bit 3)</div>
            <div class="msb-flow">
              <span class="carry-tag out"><small>Carry out</small><strong id="exampleCarryOut"></strong></span>
              <span class="flow-arrow" aria-hidden="true">←</span>
              <span class="msb-box">bit 3</span>
              <span class="flow-arrow" aria-hidden="true">←</span>
              <span class="carry-tag into"><small>Carry in</small><strong id="exampleCarryIn"></strong></span>
            </div>
          </div>
          <div class="math-row"><span class="math-prefix"></span><span id="exampleA" class="mini-bit-row"></span></div>
          <div class="math-row"><span class="math-prefix">+</span><span id="exampleB" class="mini-bit-row"></span></div>
          <div class="math-row result"><span class="math-prefix"></span><span id="exampleR" class="mini-bit-row"></span></div>
          <div class="carry-explain" id="exampleCarryRule"></div>
        </div>
        <div class="math-notes">
          <div class="fit-cell" id="exampleUnsigned"><span>C · Unsigned: too big?</span><strong id="exampleUnsignedMain"></strong><p id="exampleUnsignedSub"></p><div class="fit-verdict" id="exampleUnsignedVerdict"></div></div>
          <div class="fit-cell" id="exampleSigned"><span>V · Signed: too big or too small?</span><strong id="exampleSignedMain"></strong><p id="exampleSignedSub"></p><div class="fit-verdict" id="exampleSignedVerdict"></div></div>
        </div>
        <div class="flag-strip" aria-label="Flags set by this addition"><span class="flag-chip" id="cChip">C · unsigned <strong></strong></span><span class="flag-chip" id="vChip">V · signed <strong></strong></span></div>
        <div class="program-consequence" aria-live="polite">
          <div class="consequence-label">Why your program cares</div>
          <p id="exampleConsequence"></p>
        </div>
        <details class="flags-logic-disclosure" id="flagsLogic"><summary>${LOGIC_COPY.summary}</summary><div id="flagsLogicContent"></div><div class="flags-logic-links"><a href="#/lesson/four-bit-arithmetic" data-lesson-reference="four-bit-arithmetic">${LOGIC_COPY.carryLink}</a><a href="https://snowch.github.io/bit-lab/#/lesson/alu">${LOGIC_COPY.bitLabLink}</a></div></details>
      </div>
      <a class="next-link" href="#smallpractice">Next: check a fresh small addition →</a>
    </section><section id="smallpractice" class="lesson-step lesson-section"><div class="step-head"><div class="step-kicker"><span class="step-counter">05</span>Small practice</div><h2><span class="section-title" data-copy="miniTitle"></span></h2><p class="step-description" data-copy="miniLead"></p></div><div class="focus-card"><div id="miniBits"></div><form id="miniForm"><div id="miniChoices"></div><fieldset class="intent-field"><legend data-copy="intentLabel"></legend><p data-copy="intentQuestion"></p><div class="radios" id="intentChoices"></div></fieldset><div class="actions"><button type="submit" class="primary" data-copy="checkMini"></button><button type="button" class="secondary" id="clearMini" data-copy="clearMini"></button></div></form><div id="miniFeedback" role="status" aria-live="polite"></div></div></section>

    <section class="lesson-step lesson-section" id="arm"><div class="step-head"><div class="step-kicker"><span class="step-counter">06</span> Apply it to a real instruction</div><h2><span class="section-title">ARM uses the same rules with 32 bits.</span></h2><p class="step-description">The sign bit is now bit 31, not bit 3. First, predict which interpretation of this exact addition fits.</p></div>
      <div class="focus-card"><div class="focus-label">ARM instruction</div><div class="instruction">adds w0, w0, w1</div><div class="quiz-heading" id="armInputsLabel" data-copy="inputLabel"></div>
        <div class="hex-equation" id="armInputValues" aria-labelledby="armInputsLabel" aria-live="polite" aria-atomic="true"></div>
        <fieldset class="input-format-field" id="armInputFormats"><legend data-copy="armInputDisplayLabel"></legend><div class="input-format-options">
          <button type="button" data-input-format="hex" aria-pressed="true" aria-controls="armInputValues" data-copy="armInputHex"></button>
          <button type="button" data-input-format="unsigned" aria-pressed="false" aria-controls="armInputValues" data-copy="armInputUnsigned"></button>
          <button type="button" data-input-format="signed" aria-pressed="false" aria-controls="armInputValues" data-copy="armInputSigned"></button>
        </div></fieldset>
        <p class="label-small input-format-note"><span data-copy="armInputReadingNote"></span><span id="armInputReadingsMatch" data-copy="armInputReadingsMatch" hidden></span></p>
        <div id="armRanges"></div><p class="label-small" data-copy="armRanges"></p><form id="armForm"><fieldset><legend data-copy="armQuestion"></legend><div class="choice-list" id="armChoices"></div></fieldset><div class="actions"><button type="submit" class="primary" data-copy="checkPrediction"></button><button type="button" class="secondary" id="clearPrediction" data-copy="clearPrediction"></button></div></form><div id="armFeedback" role="status" aria-live="polite"></div></div><a class="next-link" href="#realpractice">Next: predict flags yourself <span aria-hidden="true">→</span></a>
    </section>

    <section class="lesson-step lesson-section" id="realpractice"><div class="step-head"><div class="step-kicker"><span class="step-counter">07</span> Your turn</div><h2><span class="section-title">Predict the four flags.</span></h2><p class="step-description">One addition at a time. Use N and Z to inspect the retained bits; C and V to decide whether each interpretation fits.</p></div>
      <section class="focus-card challenge" data-challenge="predict-flags" id="challenge-predict-flags" aria-labelledby="practicePosition"><div class="practice-meta"><div class="quiz-heading" style="margin-bottom:0" id="practicePosition"></div><span class="practice-counter">adds w0, w0, w1</span></div><div id="caseTabs" class="case-tabs switcher" role="group"></div><div id="practiceWork"></div><p id="aggregate" role="status" class="live-status"></p><button type="button" class="secondary" id="practiceReset" data-copy="practiceReset"></button><div id="challengeHints"></div></section>

    <div class="focus-card"><h3 class="flag-title" data-copy="followupTitle"></h3><div id="followup"></div></div></section>




    <div class="end"><div class="summary"><h2 data-copy="recapTitle"></h2><ul class="summary-list" id="recap"></ul></div><a class="next-link" href="#/lesson/flags-and-overflow" data-copy="nextLessonTitle" data-lesson-reference="flags-and-overflow"></a><p class="plain-note" data-copy="calculatorNote"></p><a class="next-link" href="#/lesson/register-widths" data-copy="calculatorLabel" data-lesson-reference="register-widths"></a></div>
  </div>
</div>`;
