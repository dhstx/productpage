import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

// Global enabled/disabled state for agents with localStorage persistence.
// Uses React Context (no external deps). API mirrors Zustand example.

export type EnabledState = Record<string, boolean>; // key -> enabled

export type AgentEnabledStore = {
  enabled: EnabledState;
  isEnabled: (key: string) => boolean;
  toggle: (key: string) => void;
  set: (key: string, val: boolean) => void;
  load: () => void;
};

const LS_KEY = "agentEnabled.v1";

const AgentEnabledCtx = createContext<AgentEnabledStore | null>(null);

export const AgentEnabledProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [enabled, setEnabled] = useState<EnabledState>({});

  const isEnabled = useCallback((key: string) => {
    return (enabled[key] ?? true) === true; // default ON
  }, [enabled]);

  const persist = useCallback((next: EnabledState) => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
    setEnabled(next);
  }, []);

  const toggle = useCallback((key: string) => {
    const now = { ...enabled, [key]: !(enabled[key] ?? true) } as EnabledState;
    persist(now);
  }, [enabled, persist]);

  const set = useCallback((key: string, val: boolean) => {
    const now = { ...enabled, [key]: val } as EnabledState;
    persist(now);
  }, [enabled, persist]);

  const load = useCallback(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setEnabled(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => { load(); }, [load]);

  const value = useMemo<AgentEnabledStore>(() => ({ enabled, isEnabled, toggle, set, load }), [enabled, isEnabled, toggle, set, load]);

  return <AgentEnabledCtx.Provider value={value}>{children}</AgentEnabledCtx.Provider>;
};

export function useAgentEnabled(): AgentEnabledStore {
  const v = useContext(AgentEnabledCtx);
  if (!v) throw new Error("AgentEnabledProvider missing");
  return v;
}
