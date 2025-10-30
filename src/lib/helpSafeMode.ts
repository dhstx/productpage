export function isHelpSafeMode(): boolean {
  try {
    // Prefer Next-style env var name but also accept Vite-style for local use
    const v1 = (import.meta as any)?.env?.NEXT_PUBLIC_HELP_SAFE_MODE;
    const v2 = (import.meta as any)?.env?.VITE_HELP_SAFE_MODE;
    const p1 = typeof process !== 'undefined' ? (process as any)?.env?.NEXT_PUBLIC_HELP_SAFE_MODE : undefined;
    const p2 = typeof process !== 'undefined' ? (process as any)?.env?.VITE_HELP_SAFE_MODE : undefined;
    const ls = typeof window !== 'undefined' ? window.localStorage?.getItem('NEXT_PUBLIC_HELP_SAFE_MODE') : undefined;
    const raw = (v1 ?? v2 ?? p1 ?? p2 ?? ls ?? '').toString().toLowerCase();
    return raw === '1' || raw === 'true' || raw === 'yes' || raw === 'on';
  } catch {
    return false;
  }
}

export function isDevEnvironment(): boolean {
  try {
    const mode = (import.meta as any)?.env?.MODE || (process as any)?.env?.NODE_ENV;
    return (mode || '').toString() !== 'production';
  } catch {
    return false;
  }
}
