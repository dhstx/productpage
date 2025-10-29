import React from "react";

export type AgentEnabledMap = Record<string, boolean>;

type AgentEnabledContextValue = {
  isEnabled: (key?: string) => boolean;
  setEnabled: (key: string, enabled: boolean) => void;
  toggle: (key: string) => void;
  all: AgentEnabledMap;
};

const DEFAULT_CONTEXT: AgentEnabledContextValue = {
  isEnabled: () => true,
  setEnabled: () => void 0,
  toggle: () => void 0,
  all: {},
};

const STORAGE_KEY = "agents:enabled:v1";

const AgentEnabledContext = React.createContext<AgentEnabledContextValue>(DEFAULT_CONTEXT);

export function AgentEnabledProvider({ children }: { children: React.ReactNode }) {
  const [enabledMap, setEnabledMap] = React.useState<AgentEnabledMap>({});

  // Hydrate from localStorage (SSR-safe: only in effect)
  React.useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw) as AgentEnabledMap;
        if (parsed && typeof parsed === "object") {
          setEnabledMap(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist to localStorage
  React.useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(enabledMap));
      }
    } catch {
      // ignore
    }
  }, [enabledMap]);

  const normalize = React.useCallback((key?: string) => (key ?? "").toLowerCase().trim(), []);

  const isEnabled = React.useCallback(
    (key?: string) => {
      const k = normalize(key);
      if (!k) return true; // default to enabled when unknown
      const val = enabledMap[k];
      return val === undefined ? true : !!val;
    },
    [enabledMap, normalize]
  );

  const setEnabled = React.useCallback((key: string, enabled: boolean) => {
    const k = normalize(key);
    if (!k) return;
    setEnabledMap((prev) => ({ ...prev, [k]: enabled }));
  }, [normalize]);

  const toggle = React.useCallback((key: string) => {
    const k = normalize(key);
    if (!k) return;
    setEnabledMap((prev) => ({ ...prev, [k]: !(prev[k] ?? true) }));
  }, [normalize]);

  const value = React.useMemo<AgentEnabledContextValue>(() => ({
    isEnabled,
    setEnabled,
    toggle,
    all: enabledMap,
  }), [enabledMap, isEnabled, setEnabled, toggle]);

  return (
    <AgentEnabledContext.Provider value={value}>
      {children}
    </AgentEnabledContext.Provider>
  );
}

export function useAgentEnabled(): AgentEnabledContextValue {
  return React.useContext(AgentEnabledContext);
}

export default AgentEnabledProvider;
