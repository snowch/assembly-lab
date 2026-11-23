// Copyright © 2026 Christopher Snow

// Labels retained from the separately drafted, approved course preview.
export const LAYOUT_STRINGS = {
  courseLessons: "Course lessons",
  courseOverview: "Course overview",
  breadcrumb: "Breadcrumb",
  currentModule: "Current module",
  currentLesson: "Current lesson",
  completed: (done: number, total: number) =>
    `${done.toLocaleString("en-GB")} of ${total.toLocaleString("en-GB")} lessons complete`,
  sourceFooter: "Source",
  outlineTitle: "On this page",
  outlineDisclosure: "On this page",
} as const;
