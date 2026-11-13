# Header calculator copy draft

Drafted separately from the managing session's checked facts, `CLAUDE.md` and
`docs/style.md`. This draft adds only the header tool's labels and help. Existing
calculator controls retain their reviewed copy.

The learner can open scratch work without leaving a lesson. Closing the tool and
moving between lessons retain its value and settings within the current tab. The
tool has no exercises and does not change exercise answers. This draft makes no
claim about retaining state after a page refresh.

## Proposed strings

```ts
export const HEADER_CALCULATOR = {
  button: "Calculator",
  title: "Programmer calculator",
  close: "Close",
  closeLabel: "Close calculator",
  help: "Use this calculator as scratch work. It does not change your exercise answers.",
  persistence:
    "In this tab, your value and settings stay when you close the calculator or move between lessons.",
  widthHelp:
    "Narrowing discards the upper bits. Widening fills the new upper bits with zeros, even with Signed selected. These controls resize the calculator; they do not run instructions.",
} as const;
```

`help` and `persistence` may sit together in the optional help. Put `widthHelp`
beside the width control if the header tool exposes resizing. Retain the existing
calculator help that explains that its controls change numbers and bits rather
than execute instructions.

Both style passes are complete: the sentences identify the actions and their
effects, and the width qualification stays local to the control. No new worked
examples were introduced. This record is a drafting pass, not an
independent review or a browser check.

## Guidance beside the controls

The independent learner review found that the global tool exposes number
readings before early lessons teach them. This follow-up draft uses the managing
session's checked model facts: unsigned bit weights are positive; the highest
signed bit has a negative weight; both decimal readings use the same pattern;
hexadecimal uses base sixteen, digits 0–9 and A–F, with four bits per digit.

The screenshot review found that introductory paragraphs pushed value entry below
the first screen. These four short fields replace `toolReadingsTitle` and
`toolReadingsHelp`. Add them to the existing `PROGRAMMER_CALCULATOR` strings beside
the respective controls or readings. Keep the existing explanation that the
controls do not run instructions visible once. Move persistence help to the bottom.

```ts
unsignedHelp: "Unsigned: zero or positive.",
signedHelp: "Signed: the highest bit has negative weight.",
hexHelp: "Hex: digits 0–9 and A–F; four bits per digit.",
toolWidthHelp:
  "Narrowing discards upper bits. Widening adds upper zeros, even with Signed selected, without copying the highest bit.",
```

Both style passes preserve the distinction between a bit's weight and its
contribution. The width help states that widening adds zeros without copying the
highest bit, including with Signed selected. The four strings add no exercise or
worked numerical example.
