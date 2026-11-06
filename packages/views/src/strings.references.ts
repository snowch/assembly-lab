// Copyright © 2026 Christopher Snow

export const REFERENCE_STRINGS = {
  position: (module: string, lesson: number) => `Module ${module}, lesson ${lesson}`,
  prefix: (position: string) => `${position}: `,
  label: (position: string, title: string) => `${position}: ${title}`,
} as const;
