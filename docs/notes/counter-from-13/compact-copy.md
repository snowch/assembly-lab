# Compact counter controls and readings: separate draft

Copyright © 2026 Christopher Snow

Drafted independently from the current user revision in `brief.md`, the current counter strings and the repository style/authoring rules. The inherited available model was used. This draft supplies copy only; it does not certify the implementation or learner understanding.

## Proposed runtime changes

```ts
instruction:
  "Use +1 until Bits stored shows 0000. The example pauses there. Use −1 to revisit the previous tick.",
previous: "−1",
previousLabel: "−1, revisit the previous tick",
advance: "+1",
advanceLabel: "+1, advance one tick",
carryLabel: "Carry from +1",
decimalLabel: "Decimal reading",
pendingCarry: "—",
initialNote:
  "The dash means no +1 tick is shown at the starting reading.",
initialStatus: (stored: number) =>
  `Starting reading: ${stored}. No +1 tick is shown.`,
stepStatus: (ticks: number, stored: number, carry: number) =>
  `Viewing tick ${ticks}. Stored reading: ${stored}. Carry from +1: ${carry}.`,
```

The visible minus sign is the mathematical minus character. Both accessible button names begin with their visible text, then describe the action. `pendingCarry` is a missing-result mark, rather than a value of zero. It is a visual symbol; prose explains it by name instead of using a punctuation dash as a sentence break.

Retain the current title, caption, introduction, Reset label, Bits stored label, trail label, wrapped-state explanation, actual-width architecture note and same-readings next-pane join. The `noCarry` explanation and `initialLabel` become unnecessary when the equations disappear and the stored bits have the same label in every state. Do not retain a Full sum label or another decimal reading elsewhere in the pane.

## Meaning and placement

The instruction names the actual compact controls and displayed zero pattern. The pause sentence describes automatic behaviour. The final sentence identifies −1 as revisiting the previous tick of this example. It does not ask the learner to subtract from the counter or imply that the physical clock runs backwards.

Carry from +1 identifies the carry of the viewed forward increment, including when −1 revisits that increment. This label and the replay instruction keep the carry attached to its source after the decimal and binary equations are removed. The underlying model still computes that arithmetic; this copy does not replace it with a scripted result.

Decimal reading is the accessible label for the number immediately under Bits stored. The four-bit pattern and decimal value describe the same stored reading. The carry remains outside that group. There is no completed +1 tick at the initial frame, so the carry field shows the missing-result mark and the initial note explains it. The same explanation remains accurate when −1 revisits the initial frame.

The existing introduction explains counter increments and the four-bit teaching width. The wrapped-state explanation still explains why only the low bits are stored, and the actual-width note keeps this carry separate from the real instruction's architectural flag. The separate subtraction pane retains its three arithmetic rows and the shared 13-to-zero, three-tick example.

## Closing passes and verification boundary

Sentence pass: the instruction gives one action and visible stopping condition, one automatic behaviour, then a replay action. Labels are short, match the requested visible controls and avoid an extra term such as borrow. The status strings describe the viewed frame so that a rewind does not claim another forward tick happened.

Idea pass: +1 exposes ordinary increments and the wrap; −1 lets the learner inspect an earlier increment and replay the wrap. The named source of carry and the colocated decimal reading preserve the information needed when the arithmetic equations are removed. The first and final bounds, actual carry provenance, decimal/binary agreement, keyboard state, visual positions and saved-work isolation still need independent built-page checks.

No application or test file was edited in this drafting pass. No browser/native test or novice study is claimed here.
