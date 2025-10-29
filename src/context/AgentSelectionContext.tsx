import React, { createContext, useContext, useState, useMemo } from "react";
import { useAgentEnabled } from "@/features/agents/agentEnabledStore";

type AgentSel = { selected: string; setSelected: (name: string) => void };
const Ctx = createContext<AgentSel | null>(null);

export const useAgentSelection = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("AgentSelectionProvider missing");
  return v;
};

export const AgentSelectionProvider: React.FC<React.PropsWithChildren<{ initial?: string }>> = ({ initial = "Commander", children }) => {
  const [selected, setSelectedRaw] = useState(initial);
  const { isEnabled } = useAgentEnabled();
  const setSelected = (name: string) => {
    const key = name?.toLowerCase?.() || name;
    if (!isEnabled(key)) return; // Guard disabled agent selection
    setSelectedRaw(name);
  };
  const value = useMemo(() => ({ selected, setSelected }), [selected]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};
