// Copyright © 2026 Christopher Snow

export const REFERENCE_STRINGS = {
  position: (module: string, lesson: number) => `Module ${module}, lesson ${lesson}`,
  linkPosition: (module: string, lesson: number) => `M${module}, L${lesson}`,
  prefix: (position: string) => `${position}: `,
  label: (position: string, title: string) => `${position}: ${title}`,
} as const;
