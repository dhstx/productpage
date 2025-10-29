import React from 'react';

// Context state is a simple record of agentKey -> enabled boolean
// Default behavior: agents are enabled unless explicitly set to false in state

export type AgentEnabledState = Record<string, boolean>;

type AgentEnabledContextValue = {
  state: AgentEnabledState;
  isEnabled: (key: string) => boolean;
  setEnabled: (key: string, value: boolean) => void;
  toggleEnabled: (key: string) => void;
};

const AgentEnabledContext = React.createContext<AgentEnabledContextValue | undefined>(undefined);

function reducer(state: AgentEnabledState, action: { type: 'set' | 'toggle'; key: string; value?: boolean }): AgentEnabledState {
  switch (action.type) {
    case 'set':
      return { ...state, [action.key]: !!action.value };
    case 'toggle':
      return { ...state, [action.key]: !(state[action.key] ?? true) };
    default:
      return state;
  }
}

const STORAGE_KEY = 'agent-enabled';

export function AgentEnabledProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, {});
  const hydratedRef = React.useRef(false);

  // Hydrate from localStorage on mount only
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          hydratedRef.current = true;
          // Replace the whole state by dispatching individual sets for stability
          Object.entries(parsed as Record<string, boolean>).forEach(([key, value]) => {
            dispatch({ type: 'set', key, value: !!value });
          });
        }
      }
    } catch {
      // noop - safe default keeps all enabled
    }
  }, []);

  // Debounce-save to localStorage on changes
  const stateRef = React.useRef(state);
  stateRef.current = state;
  React.useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stateRef.current));
      } catch {
        // ignore persistence errors
      }
    }, 250);
    return () => window.clearTimeout(id);
  }, [state]);

  const value = React.useMemo<AgentEnabledContextValue>(() => ({
    state,
    isEnabled: (key: string) => {
      if (!key) return true;
      const v = state[key];
      return v === undefined ? true : !!v;
    },
    setEnabled: (key: string, value: boolean) => dispatch({ type: 'set', key, value }),
    toggleEnabled: (key: string) => dispatch({ type: 'toggle', key }),
  }), [state]);

  return <AgentEnabledContext.Provider value={value}>{children}</AgentEnabledContext.Provider>;
}

export function useAgentEnabled(): AgentEnabledContextValue {
  const ctx = React.useContext(AgentEnabledContext);
  if (!ctx) {
    // Provide a safe fallback (all enabled, no-op setters) to avoid crashes in SSR or missing provider
    return {
      state: {},
      isEnabled: () => true,
      setEnabled: () => {},
      toggleEnabled: () => {},
    };
  }
  return ctx;
}
