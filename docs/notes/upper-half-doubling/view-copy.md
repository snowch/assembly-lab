# Contribution-view copy

Separately drafted from the checked visual brief. The editor shortened the shared label to Contributes; other template wording is unchanged. All values are projections of the current model state. The worked caption introduces groups and units before their first visual use.

```json
{
  "templates": {
    "upperGroups": {
      "one": "{count} group of 65536",
      "other": "{count} groups of 65536"
    },
    "lowerUnits": {
      "one": "{count} extra unit",
      "other": "{count} extra units"
    },
    "contribution": "Contributes",
    "wholeValue": "Whole value of {name}",
    "wholeEquation": "{upperContribution} + {lowerContribution} = {wholeValue}"
  },
  "caption": {
    "old": "Step through the instructions to see which halves of w0 are written or kept.",
    "new": "The upper half counts groups of 65536. The lower half adds extra units. Press Next to see what each half contributes to w0 and which half is written or kept."
  },
  "prose": {
    "old": "So an upper-half value of 1 contributes 65536 to the whole number. An upper-half value of 2 contributes 131072. Each upper-half bit is worth a multiple of 65536, so the upper half counts whole groups of 65536.\n\n",
    "new": "Each upper-half bit is worth a multiple of 65536, so the upper half counts whole groups of 65536.\n\n"
  }
}
```
