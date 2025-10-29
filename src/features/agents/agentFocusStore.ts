import { useEffect, useMemo, useState } from "react";
import type { AgentFocus } from "./agents.data";
import { agents } from "./agents.data";

export type FocusState = Record<string, boolean>; // focusId -> on/off
export type AgentFocusMap = Record<string, FocusState>; // agentKey -> FocusState

const STORAGE_KEY = "agentFocus.v1";

function loadInitialState(): AgentFocusMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AgentFocusMap;
  } catch {}
  // Seed from agent defaults
  const seeded: AgentFocusMap = {};
  for (const a of agents) {
    const fs: FocusState = {};
    for (const f of a.focuses) fs[f.id] = !!f.defaultOn;
    seeded[a.key] = fs;
  }
  return seeded;
}

function persist(state: AgentFocusMap) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

let inMemoryState: AgentFocusMap | null = null;
const listeners = new Set<() => void>();

function getState(): AgentFocusMap {
  if (!inMemoryState) inMemoryState = loadInitialState();
  return inMemoryState;
}

function setState(updater: (s: AgentFocusMap) => AgentFocusMap) {
  inMemoryState = updater(getState());
  persist(inMemoryState);
  listeners.forEach((l) => l());
}

export const AgentFocusStore = {
  getFocusState(agentKey: string): FocusState {
    const s = getState();
    return s[agentKey] ?? {};
  },
  setFocus(agentKey: string, focusId: string, onOff: boolean) {
    setState((s) => {
      const next: AgentFocusMap = { ...s };
      const prevAgent = next[agentKey] ?? {};
      next[agentKey] = { ...prevAgent, [focusId]: onOff };
      return next;
    });
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getAgentFocusVector(agentKey: string): Record<string, 1 | 0> {
    const fs = AgentFocusStore.getFocusState(agentKey);
    const out: Record<string, 1 | 0> = {};
    for (const [k, v] of Object.entries(fs)) out[k] = v ? 1 : 0;
    return out;
  },
};

export function getAgentFocusVector(agentKey: string): Record<string, 1 | 0> {
  return AgentFocusStore.getAgentFocusVector(agentKey);
}

export function useAgentFocus(agentKey: string, focuses: AgentFocus[]) {
  // Ensure defaults for any new focuses (schema drift safe)
  useEffect(() => {
    const current = AgentFocusStore.getFocusState(agentKey);
    const merged: FocusState = { ...current };
    let changed = false;
    for (const f of focuses) {
      if (!(f.id in merged)) {
        merged[f.id] = !!f.defaultOn;
        changed = true;
      }
    }
    if (changed) {
      setState((s) => ({ ...s, [agentKey]: merged }));
    }
  }, [agentKey, focuses]);

  const [tick, setTick] = useState(0);
  useEffect(() => {
    return AgentFocusStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  // Recompute on tick
  return useMemo(() => {
    const state = AgentFocusStore.getFocusState(agentKey);
    return {
      focusState: state,
      setFocus: (focusId: string, onOff: boolean) => AgentFocusStore.setFocus(agentKey, focusId, onOff),
      getVector: () => AgentFocusStore.getAgentFocusVector(agentKey),
    } as const;
  }, [agentKey, tick]);
}
