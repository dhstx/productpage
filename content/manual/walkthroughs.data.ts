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
      "See Manus Hub route natural language through agents (Conductor, Builder, Connector) to apps like GitHub, Vercel, Notion.",
    videoId: "wrfM7Yf0Q1c",
    duration: "07:12",
  },
  {
    title: "Security walk-through",
    summary: "Set scopes, audit logs, and approval gates for sensitive flows.",
    videoId: "sQ3Gk9HdTuV",
    duration: "05:46",
  },
  {
    title: "Quickstart",
    summary: "Connect Notion/GitHub/Vercel, ship a starter site, and post the link to your knowledge base.",
    videoId: "L9P2cNaXbJs",
    duration: "04:58",
  },
];
