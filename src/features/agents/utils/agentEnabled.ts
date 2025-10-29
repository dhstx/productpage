/** Minimal global enable/disable state with SSR guards and a DOM event. */
export type EnabledMap = Record<string, boolean>;
const LS_KEY = "agentEnabled.v1";
const EVT = "agent-enabled:update";

let cache: EnabledMap = {}; // default empty -> treated as enabled

function hasWindow() {
  return typeof window !== "undefined";
}

export function readMap(): EnabledMap {
  if (!hasWindow()) return cache;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    cache = raw ? JSON.parse(raw) : {};
  } catch { /* noop */ }
  return cache;
}

export function isEnabled(agentKey: string): boolean {
  const m = readMap();
  return m[agentKey] !== false; // default ON
}

export function setEnabled(agentKey: string, value: boolean): void {
  if (!hasWindow()) return;
  const next = { ...readMap(), [agentKey]: value };
  try { window.localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch { /* noop */ }
  cache = next;
  // Notify all listeners in the app (grid, rail, etc.)
  window.dispatchEvent(new CustomEvent(EVT, { detail: { key: agentKey, value } }));
}

export function toggleEnabled(agentKey: string): void {
  setEnabled(agentKey, !isEnabled(agentKey));
}

/** Subscribe to global updates; returns an unsubscribe fn. */
export function subscribeEnabled(fn: (key?: string) => void): () => void {
  if (!hasWindow()) return () => {};
  const handler = () => fn();
  window.addEventListener(EVT, handler as EventListener);
  return () => window.removeEventListener(EVT, handler as EventListener);
}
