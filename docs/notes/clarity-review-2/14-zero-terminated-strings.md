<!-- Copyright © 2026 Christopher Snow -->

# Fresh clarity review: Strings and the zero byte

Reviewed `zero-terminated-strings`, the second lesson in Module 7, against the
[brief](brief.md). This is a review only. No lesson text was changed.

## Result

No new actionable clarity finding. The source reading and browser pass agree:
the explanation makes the stopping rules, empty case and readable-memory
requirements explicit. It distinguishes a zero byte from the character `0`, and
a byte count from a displayed-character count. The captions and exercise test
names describe the condition being inspected without relying on unstated jargon.

After forming that assessment, I read the
[previous review](../english-review/14-zero-terminated-strings.md). Its clean
chapter result still holds; there is no chapter-specific retained or rejected
issue ID to change. This does not close the separately tracked shared-message
issues.

The shared “Common mistake” heading was considered explicitly. Here the second
hints identify forbidden actions: “A zero capacity permits no read, even to check
for a terminator” and “Do not compare or count bytes after the zero terminator”.
Those warnings name the relevant error sufficiently clearly; I do not add an M6
occurrence simply because the hint also gives corrective guidance. The smaller
example hints each supply concrete input bytes and explain the stopping point.

## Assumed knowledge checked

The front-page prerequisites cover small C functions, conditions, loops and array
indexing. The following additional knowledge is supplied before it is needed:

- Pointers, `const`, byte addresses and the `w`/`x` register relationship:
  [Memory and addresses](../../../content/lessons/memory-and-addresses.prose.ts),
  especially its opening pointer definition and motivation.
- Byte types, `ldrb` and zero extension:
  [Loading widths](../../../content/lessons/loading-widths.prose.ts), opening
  explanation and motivation.
- Element indices, byte offsets and post-index addressing:
  [Array addresses](../../../content/lessons/array-addresses.prose.ts), opening
  definition, motivation and investigation.
- Zero/nonzero branches and C increment syntax: the preceding branch and counting
  lessons. GCC, its optimisation setting and target terminology have also already
  been introduced.
- String, terminator and ASCII are explained in this lesson's opening paragraph.
  Capacity is defined as “the maximum number of bytes it may read” in “The C loop
  and its boundary”; that note also explains `break` before the C listing.
  “Scan” is made concrete by reading a byte, testing it and advancing. The final
  task describes the marker as the nonzero ASCII byte to count.

No additional unexplained prerequisite was identified. No later lesson was used
to dismiss an assumed-knowledge concern.

## Coverage and evidence

Read the complete [prose](../../../content/lessons/zero-terminated-strings.prose.ts),
[labels](../../../content/lessons/zero-terminated-strings.labels.ts),
[lesson configuration](../../../content/lessons/zero-terminated-strings.ts) and
the relevant [listings](../../../content/lessons/arrays.listings.ts). This includes
all ten sections, both notes, both prediction explanations, both exercise tasks,
all ten hints, test labels, reflection and model limitations. Also read the shared
memory figure labels and memory-specific exercise feedback.

Used Chromium at
`http://127.0.0.1:4253/assembly-lab/#/lesson/zero-terminated-strings`, at 1280 × 900
and 375 × 900, in light and dark themes. In each configuration:

- Opened the details notes and inspected the rendered chapter.
- Submitted every offered choice in both prediction widgets, reading their
  feedback.
- Ran both exercises with the initial `ret` program and revealed all five hints
  for each. Read the failed-test labels, inputs, actual results and expectations.
- Advanced all five memory steppers to their final state: the bounded scan,
  moving pointer, empty label, changed loop and capacity-limited scan.
- Inspected screenshots of the opening text in all four configurations and the
  expanded phone exercise. Captured the final bounded figure in all four.

This pass did not submit successful exercise solutions, deliberately trigger
every assembler diagnostic or test arbitrary byte arrays. The verdict concerns
the reviewed wording; it is not a replacement for the course's automated checks.

Temporary evidence: `/tmp/clarity2-14.mjs`, rendered logs
`/tmp/clarity2-14-{width}-{theme}.txt`, and screenshots with the same prefix and
`-initial`, `-write-label-length`, `-write-count-marker` or `-bounded` suffix.
Widths are `1280` and `375`; themes are `light` and `dark`. No challenge solution
is reproduced in this report.
