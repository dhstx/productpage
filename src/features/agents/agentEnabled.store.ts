// Minimal, SSR-safe store with localStorage persistence (no external deps).
export type AgentEnabledMap = Record<string, boolean>;

let state: AgentEnabledMap = {}; // default all true via getter below
const listeners = new Set<() => void>();
const LS_KEY = 'agentEnabled.v1';

const canUseLS = () => typeof window !== 'undefined' && !!window.localStorage;

function load() {
  if (!canUseLS()) return;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (raw) state = JSON.parse(raw);
  } catch {}
}

function save() {
  if (!canUseLS()) return;
  try { window.localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch {}
}

export function isAgentEnabled(key: string) {
  // default ON if not present
  return state[key] !== false;
}

export function setAgentEnabled(key: string, val: boolean) {
  state[key] = val;
  save();
  listeners.forEach(fn => fn());
}

export function toggleAgentEnabled(key: string) {
  setAgentEnabled(key, !isAgentEnabled(key));
}

export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Call on client after hydration
export function initAgentEnabledStore() { load(); }
