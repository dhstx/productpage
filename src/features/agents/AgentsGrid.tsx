import React, { useMemo, useRef, useState } from "react";
import AgentCard from "./AgentCard";
import AgentBioPanel from "./AgentBioPanel";
import { getAllAgentsSorted } from "./agents.data";

export default function AgentsGrid() {
  const agents = useMemo(() => getAllAgentsSorted(), []);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);

  const open = (key: string, el: HTMLElement) => {
    lastTriggerRef.current = el;
    setOpenKey(key);
  };
  const close = () => setOpenKey(null);

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
        {agents.map((a) => (
          <div key={a.key}>
            <AgentCard
              name={a.name}
              iconName={a.icon}
              onOpen={(e?: any) => {
                const target = (e?.currentTarget as HTMLElement) || (document.activeElement as HTMLElement);
                open(a.key, target);
              }}
            />
          </div>
        ))}
      </div>

      {openKey && (
        <AgentBioPanel
          agent={agents.find((x) => x.key === openKey)!}
          onClose={close}
          restoreFocusEl={lastTriggerRef.current}
        />
      )}
    </div>
  );
}
