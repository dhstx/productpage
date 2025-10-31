export type Walkthrough = {
  title: string;
  summary?: string;
  videoId: string;
  duration?: string;
  poster?: string;
};

export const WALKTHROUGHS: Walkthrough[] = [
  {
    title: "Workflows: from prompt to action",
    summary:
      "Manus Hub routes natural language through agents (Conductor, Builder, Connector) to apps like GitHub, Vercel, Notion.",
    videoId: "REPLACE_ME_1",
    duration: "07:12",
  },
  {
    title: "Security walkthrough",
    summary: "Least privilege, approval gates, and audit exports.",
    videoId: "REPLACE_ME_2",
    duration: "05:03",
  },
  {
    title: "10-minute Quickstart",
    summary: "Connect core apps, deploy a starter, publish notes to your KB.",
    videoId: "REPLACE_ME_3",
    duration: "10:12",
  },
];
