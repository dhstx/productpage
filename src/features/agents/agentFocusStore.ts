import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AgentFocus } from './agents.data';
import { AGENTS } from './agents.data';

const STORAGE_KEY = 'agentFocus.v1';

export type FocusMap = Record<string, boolean>; // focusId -> on/off
export type AgentFocusStore = Record<string, FocusMap>; // agentKey -> FocusMap

function readStore(): AgentFocusStore {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed as AgentFocusStore;
    return {};
  } catch {
    return {};
  }
}

function writeStore(next: AgentFocusStore) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore quota or privacy errors
  }
}

function ensureAgentFocus(store: AgentFocusStore, agentKey: string, focuses: AgentFocus[]): AgentFocusStore {
  if (store[agentKey]) return store;
  const defaults: FocusMap = {};
  focuses.forEach(f => { defaults[f.id] = !!f.defaultOn; });
  return { ...store, [agentKey]: defaults };
}

export function getAgentFocusState(agentKey: string, focuses: AgentFocus[]): FocusMap {
  const store = ensureAgentFocus(readStore(), agentKey, focuses);
  return store[agentKey] || {};
}

export function setAgentFocus(agentKey: string, focusId: string, on: boolean, focuses: AgentFocus[]) {
  const base = ensureAgentFocus(readStore(), agentKey, focuses);
  const next: AgentFocusStore = {
    ...base,
    [agentKey]: { ...base[agentKey], [focusId]: on },
  };
  writeStore(next);
}

export function toggleAgentFocus(agentKey: string, focusId: string, focuses: AgentFocus[]) {
  const base = ensureAgentFocus(readStore(), agentKey, focuses);
  const current = !!base[agentKey]?.[focusId];
  setAgentFocus(agentKey, focusId, !current, focuses);
}

export function useAgentFocus(agentKey: string, focuses: AgentFocus[]) {
  const initial = useMemo(() => getAgentFocusState(agentKey, focuses), [agentKey, focuses]);
  const [state, setState] = useState<FocusMap>(initial);

  useEffect(() => {
    // Sync from storage if changed externally
    setState(getAgentFocusState(agentKey, focuses));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentKey]);

  const set = useCallback((focusId: string, on: boolean) => {
    setAgentFocus(agentKey, focusId, on, focuses);
    setState(prev => ({ ...prev, [focusId]: on }));
  }, [agentKey, focuses]);

  const toggle = useCallback((focusId: string) => {
    const next = !state[focusId];
    setAgentFocus(agentKey, focusId, next, focuses);
    setState(prev => ({ ...prev, [focusId]: next }));
  }, [agentKey, focuses, state]);

  return { state, set, toggle } as const;
}

function getFocusListForAgent(agentKey: string): AgentFocus[] {
  const a = AGENTS.find(a => a.key === agentKey);
  return a?.focuses ?? [];
}

export function getAgentFocusVector(agentKey: string): number[] {
  const focuses = getFocusListForAgent(agentKey);
  if (focuses.length === 0) return [];
  const state = getAgentFocusState(agentKey, focuses);
  return focuses.map(f => (state[f.id] ? 1 : 0));
}
