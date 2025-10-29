import React from "react";
import getAgentIcon from "@/components/ui/agentIcons";

export type AgentCardProps = {
  name: string;
  iconName?: string;
  onOpen: (ev?: React.SyntheticEvent<HTMLElement>) => void;
};

export default function AgentCard({ name, iconName, onOpen }: AgentCardProps) {
  const Icon = getAgentIcon(iconName || name);

  const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen(e);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Open ${name} details`}
      onClick={(e) => onOpen(e)}
      onKeyDown={handleKey}
      className="group aspect-[1/1] rounded-xl border flex flex-col items-center justify-center gap-3 select-none cursor-pointer focus:outline-none"
      style={{
        background: "var(--card-bg)",
        borderColor: "var(--card-border)",
        color: "var(--text)",
      }}
    >
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: 56,
          height: 56,
          background: "var(--bg-elev)",
          border: "1px solid var(--card-border)",
        }}
      >
        <Icon size={28} color="currentColor" />
      </div>
      <div className="text-sm font-medium text-center px-2" style={{ color: "var(--text)" }}>
        {name}
      </div>
    </div>
  );
}
