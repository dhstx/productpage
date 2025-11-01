import React, { createContext, useContext, useState, useMemo } from "react";

type AgentSel = { selected: string; setSelected: (name: string) => void };
const Ctx = createContext<AgentSel | null>(null);

export const useAgentSelection = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("AgentSelectionProvider missing");
  return v;
};

const normalizeInitial = (value: string) => (value === "Commander" ? "Chief of Staff" : value);

export const AgentSelectionProvider: React.FC<React.PropsWithChildren<{ initial?: string }>> = ({ initial = "Chief of Staff", children }) => {
  const [selected, setSelected] = useState(() => normalizeInitial(initial));
  const value = useMemo(() => ({ selected, setSelected }), [selected]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};
