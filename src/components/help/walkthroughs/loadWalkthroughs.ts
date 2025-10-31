export type Walkthrough = {
  videoId: string;
  title: string;
  summary?: string;
  duration?: string;
};

let cached: Walkthrough[] | null = null;
let loading: Promise<Walkthrough[]> | null = null;

async function importWalkthroughs(): Promise<Walkthrough[]> {
  const shouldTryAlias = typeof window !== 'undefined' && Boolean((window as any).__NEXT_DATA__);
  if (shouldTryAlias) {
    try {
      const aliasSpecifier = '@/content/manual/walkthroughs.json';
      const mod: any = await import(/* @vite-ignore */ aliasSpecifier);
      const value = mod?.default ?? mod;
      if (Array.isArray(value)) return value as Walkthrough[];
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn('[walkthroughs:data] alias import failed', error);
      }
    }
  }

  try {
    const mod: any = await import('../../../../content/manual/walkthroughs.json');
    const value = mod?.default ?? mod;
    if (Array.isArray(value)) return value as Walkthrough[];
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('[walkthroughs:data] relative import failed', error);
    }
  }

  return [];
}

export async function loadWalkthroughs(): Promise<Walkthrough[]> {
  if (cached) return cached;
  if (loading) return loading;

  loading = importWalkthroughs().then((data) => {
    cached = Array.isArray(data) ? data : [];
    loading = null;
    return cached;
  });

  return loading;
}

