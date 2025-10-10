const STORAGE_KEYS = {
  lastUrl: 'dhstx:lastUrl',
  lastScroll: 'dhstx:lastScroll',
  pendingScroll: 'dhstx:pendingScroll',
};

const clampScroll = (value) => {
  const numeric = Number.parseInt(value, 10);
  if (Number.isNaN(numeric) || numeric < 0) {
    return 0;
  }
  return numeric;
};

const getSessionStorage = () => {
  if (typeof window === 'undefined' || !window.sessionStorage) {
    return null;
  }
  return window.sessionStorage;
};

export const isSameOrigin = (url) => {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const candidate = new URL(url, window.location.href);
    return candidate.origin === window.location.origin;
  } catch {
    return false;
  }
};

const normalizeForComparison = (url) => {
  if (typeof window === 'undefined') {
    return url;
  }

  try {
    const parsed = new URL(url, window.location.href);
    return parsed.toString();
  } catch {
    return url;
  }
};

export const storeLastLocation = (url, scrollPosition = 0) => {
  const storage = getSessionStorage();
  if (!storage || !url || !isSameOrigin(url)) {
    return;
  }

  storage.setItem(STORAGE_KEYS.lastUrl, normalizeForComparison(url));
  storage.setItem(STORAGE_KEYS.lastScroll, String(clampScroll(scrollPosition)));
};

export const clearLastLocation = () => {
  const storage = getSessionStorage();
  if (!storage) {
    return;
  }

  storage.removeItem(STORAGE_KEYS.lastUrl);
  storage.removeItem(STORAGE_KEYS.lastScroll);
};

export const getLastLocation = () => {
  const storage = getSessionStorage();
  if (!storage) {
    return null;
  }

  const url = storage.getItem(STORAGE_KEYS.lastUrl);
  if (!url) {
    return null;
  }

  const scroll = clampScroll(storage.getItem(STORAGE_KEYS.lastScroll) ?? '0');
  return { url, scroll };
};

export const queueScrollRestoration = (scrollPosition = 0) => {
  const storage = getSessionStorage();
  if (!storage) {
    return;
  }

  storage.setItem(STORAGE_KEYS.pendingScroll, String(clampScroll(scrollPosition)));
};

export const consumePendingScroll = () => {
  const storage = getSessionStorage();
  if (!storage) {
    return null;
  }

  const value = storage.getItem(STORAGE_KEYS.pendingScroll);
  if (value === null) {
    return null;
  }

  storage.removeItem(STORAGE_KEYS.pendingScroll);
  return clampScroll(value);
};

export const shouldShowBackArrow = (currentUrl) => {
  const lastLocation = getLastLocation();
  if (!lastLocation) {
    return false;
  }

  if (!isSameOrigin(lastLocation.url)) {
    return false;
  }

  const targetUrl = currentUrl ?? (typeof window !== 'undefined' ? window.location.href : undefined);
  if (!targetUrl) {
    return false;
  }

  return normalizeForComparison(lastLocation.url) !== normalizeForComparison(targetUrl);
};

export const storageKeys = STORAGE_KEYS;

export const isBackArrowEnabled = () => {
  const rawValue =
    import.meta.env?.VITE_ENABLE_BACK_ARROW ??
    import.meta.env?.NEXT_PUBLIC_ENABLE_BACK_ARROW;

  if (rawValue === undefined) {
    return true;
  }

  if (typeof rawValue === 'string') {
    return rawValue !== 'false' && rawValue !== '0';
  }

  return Boolean(rawValue);
};

