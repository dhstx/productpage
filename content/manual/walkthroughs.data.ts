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
    videoId: "wrfM7Yf0Q1c",
    duration: "07:12",
  },
  {
    title: "Security walkthrough",
    summary: "Least privilege, approval gates, audit exports.",
    videoId: "sQ3Gk9HdTuV",
    duration: "05:03",
  },
  {
    title: "10-minute Quickstart",
    summary: "Connect core apps, deploy a starter, publish notes to your knowledge base.",
    videoId: "L9P2cNaXbJs",
    duration: "10:12",
  },
];
