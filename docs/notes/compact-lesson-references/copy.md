# Reference copy

Drafted separately by GPT-6.1 Sol at Medium effort from the checked brief and `docs/style.md`. No existing separate canonical record for these formatters was found.

```ts
// Copyright © 2026 Christopher Snow

export const REFERENCE_STRINGS = {
  position: (module: string, lesson: number) => `Module ${module}, lesson ${lesson}`,
  linkPosition: (module: string, lesson: number) => `M${module}, L${lesson}`,
  prefix: (position: string) => `${position}: `,
  label: (position: string, title: string) => `${position}: ${title}`,
} as const;
```

Link labels use `M1, L2: Title`; lettered labels use the same convention, for example `MA, L2: Title`. The current-page position retains `Module 1, lesson 2`. The course plan retains `L2: Title` beneath its module heading.
