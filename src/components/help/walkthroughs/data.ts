import rawData from '@/content/manual/walkthroughs.json';
import type { Walkthrough } from './types';

function isWalkthrough(value: any): value is Walkthrough {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.title === 'string' &&
    typeof value.videoId === 'string' &&
    value.videoId.trim().length > 0
  );
}

const parsed = Array.isArray(rawData) ? (rawData as Walkthrough[]) : [];

export const walkthroughs: Walkthrough[] = parsed.filter(isWalkthrough).map((item) => ({
  ...item,
  title: item.title.trim(),
  summary: item.summary?.trim(),
  videoId: item.videoId.trim(),
  duration: item.duration?.trim(),
  poster: item.poster?.trim(),
}));
