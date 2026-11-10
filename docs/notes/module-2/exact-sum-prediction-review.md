# Exact sums and valid readings

10 November 2026. This revision changes the prediction in “Adding, and the four flags”,
its caption, choices and feedback, and the matching canonical prose. It distinguishes
valid signed/unsigned readings of a bit pattern from whether either reading represents
the exact mathematical sum. It does not change the instructions, model results, option
values, stored choice shape or prediction gate.

The learning-design brief checked the existing facts tests, `RunPrediction` and the
preceding lessons on signed/unsigned readings and fixed-width arithmetic. Its observable
outcome is to distinguish interpreting stored bits from checking whether a sum fits.
The earlier lessons provide the bit weights and ranges; the new lead identifies how
ADD/ADDS treat the inputs. The numerical explanation remains behind the commitment gate.
No additional visual or arithmetic exercise is needed for this wording correction.

A separate GPT-6.1 Sol Medium agent drafted the changed copy. Independent Sol High learner
and Sol Extra High technical reviewers read the actual lesson and prerequisites and checked
the built page. The technical review confirmed that the shared feedback must qualify each
sum by its input reading: signed and unsigned interpretations can give different input
values. The model already made those separate comparisons. Renaming its local booleans
from `Right` to `Fits` leaves their expressions and classifications unchanged.

Accepted and independently checked: two alternate-call unit fixtures inherited explanatory
text for the default call. They now omit that text while preserving the default fixture's
numerical and code-rendering assertion and every model-feedback assertion. Rejected: new
choice labels need a storage migration, since their saved values are unchanged. Rejected:
a nonmatching commitment should retain the follow-up lock; this activity intentionally
unlocks after commitment so the learner can investigate the feedback.

The managing session's built-browser checks covered 375×812 and 1280×800 in both actual
light and dark themes, including rendered backgrounds. The new lead, question and all
four choices render correctly. Initial and selected states reveal no solution. Every
committed choice receives the expected model feedback; reload restores the saved choice.
The follow-up gate, column stepping, reveal and reset remain intact. No console/page errors,
raw code markup or page-level horizontal overflow were observed.

Focused checks passed: six files, 136 tests, including canonical-text fidelity, numerical
facts and generic shared feedback cases. The technical review independently passed three
files and 106 tests and compared 52 GNU/QEMU instruction states with no differences.
Full `npm run check` started before pushing; exact-head CI and deployment evidence are
recorded in the pull request. Final fixture verification is recorded separately from the
initial focused run. Agent review and browser checks are not a novice study or a screen-reader
validation.

A subsequent reader request concerned the existing “Carries and the four flags” section.
The reader independently confirmed a separate sequencing issue: on a 375×812 viewport,
1,106 pixels separate the first figure-reference paragraph from its caption, and 1,628
pixels separate the navigation paragraph from its controls. Column arithmetic, four flag
rules, C/V interpretation and an optional compiler example intervene. The recommendation
is to place the short carry setup and named action with the figure, then explain the flags
at the relevant stage or directly afterwards, with the compiler disclosure after the main
investigation. This review does not change that section; its essential flag rules must
remain visible before the three-additions exercise. The exact-sum correction is independent
of this follow-up structure review.
