# Reading explanations in sequence: canonical strings

Drafted separately in [draft.md](draft.md). The unsigned lesson introduction and weights are also held in the Module 1, pacing and appendix canonical records. View guidance is rendered beside the active figure; its optional appendix link appears only with Signed or Compare.

```json
{
  "viewsLabel": "Reading",
  "views": {
    "unsigned": "Unsigned",
    "signed": "Signed",
    "compare": "Compare"
  },
  "guidance": {
    "unsigned": "Change a bit and follow its contribution to the unsigned total. Then select Signed.",
    "signed": "The **signed reading** gives the top bit weight −2,147,483,648. Every other weight stays positive. Add the contributions using these weights to get the signed reading.\n\nThis representation is called **two’s complement**. The top bit contributes a negative amount; it is not a separate minus sign. C’s `int` uses this signed reading here.\n\nSelecting a reading leaves the bits unchanged. Change a bit and follow the signed total. Then select Compare.\n\nFor a smaller worked example, see [Appendix B: Two’s complement](#/lesson/twos-complement).",
    "compare": "Both columns read the same bits. The top bit’s weight is +2,147,483,648 in Unsigned and −2,147,483,648 in Signed. All the other weights agree.\n\nChange the top bit and compare its contribution to each total. When the top bit is 0, it contributes zero to both totals, so the readings agree.\n\nFor a smaller worked example, see [Appendix B: Two’s complement](#/lesson/twos-complement)."
  },
  "bit": "Bit",
  "value": "Value",
  "weight": "Weight",
  "unsignedWeight": "Unsigned weight",
  "signedWeight": "Signed weight",
  "reset": "Reset to all ones",
  "resetExample": "Reset example",
  "scrollCue": "Scroll to see the bit weights",
  "omittedBits": "Bits 29 to 4 omitted",
  "diagramLabel": "Selected bit positions and their weights",
  "caption": "Selected bit positions, with each value above its weight."
}
```
