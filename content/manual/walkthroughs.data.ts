export type Walkthrough = {
  title: string;
  summary?: string;
  videoId: string; // public/unlisted YouTube ID
  duration?: string;
};

export const WALKTHROUGHS: Walkthrough[] = [
  {
    title: 'Workflows: from prompt to action',
    summary: 'Manus Hub routes natural language via agents (Conductor, Builder, Connector) to GitHub, Vercel, Notion.',
    videoId: 'wrfM7Yf0Q1c',
    duration: '07:12',
  },
  {
    title: 'Security walkthrough',
    summary: 'Least-privilege access, approval gates, and audit exports.',
    videoId: 'sQ3Gk9HdTuV',
    duration: '05:03',
  },
  {
    title: '10-minute Quickstart',
    summary: 'Connect Notion/GitHub/Vercel, deploy a starter, and publish notes.',
    videoId: 'L9P2cNaXbJs',
    duration: '10:12',
  },
];
