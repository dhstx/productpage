'use client';

export type Walkthrough = {
  id?: string;
  title?: string;
  summary?: string;
  videoId?: string;
  href?: string;
};

let list: any[] = [];

try {
  list = (await import('@/content/manual/walkthroughs.json')).default as any[];
} catch {
  try {
    list = (await import('../../../content/manual/walkthroughs.json')).default as any[];
  } catch {
    list = [];
  }
}

const resolved = Array.isArray(list) ? list : [];

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line no-console
  console.log('[walkthroughs] len =', resolved.length);
}

export const walkthroughs: Walkthrough[] = resolved.map((item) => ({
  id: typeof item?.id === 'string' ? item.id : undefined,
  title: typeof item?.title === 'string' ? item.title : undefined,
  summary: typeof item?.summary === 'string' ? item.summary : undefined,
  videoId: typeof item?.videoId === 'string' ? item.videoId : undefined,
  href: typeof item?.href === 'string' ? item.href : undefined,
}));

