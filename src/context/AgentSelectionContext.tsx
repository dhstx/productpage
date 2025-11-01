import React, { createContext, useContext, useState, useMemo } from "react";

type AgentSel = { selected: string; setSelected: (name: string) => void };
const Ctx = createContext<AgentSel | null>(null);

export const useAgentSelection = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("AgentSelectionProvider missing");
  return v;
};

export const AgentSelectionProvider: React.FC<React.PropsWithChildren<{ initial?: string }>> = ({ initial = "Chief of Staff", children }) => {
  const normalizedInitial = /^commander$/i.test(initial ?? '') ? "Chief of Staff" : initial;
  const [selected, setSelected] = useState(normalizedInitial);
  const value = useMemo(() => ({ selected, setSelected }), [selected]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};
