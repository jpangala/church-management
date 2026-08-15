export const ProjectStatus = {
  PLANNED: "PLANNED",
  ONGOING: "ONGOING",
  DONE: "DONE",
} as const;

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];
