import React, { useEffect, useMemo, useRef } from "react";
import type { AgentProfile } from "./agents.data";
import { useAgentFocus } from "./agentFocusStore";

export type AgentBioPanelProps = {
  agent: AgentProfile;
  onClose: () => void;
  restoreFocusEl?: HTMLElement | null;
};

export default function AgentBioPanel({ agent, onClose, restoreFocusEl }: AgentBioPanelProps) {
  const { focusState, setFocus } = useAgentFocus(agent.key, agent.focuses);

  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFocusable = useRef<HTMLButtonElement>(null);
  const lastFocusable = useRef<HTMLButtonElement>(null);

  // Return focus to the triggering tile when closing
  useEffect(() => {
    return () => {
      restoreFocusEl?.focus?.();
    };
  }, [restoreFocusEl]);

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        // Simple focus trap between first/last
        const active = document.activeElement;
        if (e.shiftKey && active === firstFocusable.current) {
          e.preventDefault();
          lastFocusable.current?.focus();
        } else if (!e.shiftKey && active === lastFocusable.current) {
          e.preventDefault();
          firstFocusable.current?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Close on click outside
  const onOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const toggle = (id: string) => setFocus(id, !focusState[id]);

  return (
    <div
      ref={overlayRef}
      onClick={onOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.35)" }}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={panelRef}
        className="agents-flicker-in rounded-xl overflow-hidden"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          color: "var(--text)",
          width: "min(92vw, 800px)",
          maxWidth: "min(92vw, 800px)",
        }}
      >
        <div className="relative p-4 md:p-6 grid gap-4 md:gap-6 md:grid-cols-[1fr_260px]">
          {/* Close button */}
          <button
            ref={firstFocusable}
            onClick={onClose}
            aria-label="Close agent details"
            className="absolute right-3 top-3 rounded-md px-2 py-1 border"
            style={{ background: "var(--bg-elev)", borderColor: "var(--card-border)", color: "var(--text)" }}
          >
            ✕
          </button>

          {/* Left: Bio */}
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="h-3 w-3 rounded-full"
                style={{ background: "var(--accent-muted)" }}
                aria-hidden
              />
              <h2 className="text-xl font-semibold" style={{ color: "var(--text)" }}>{agent.name}</h2>
            </div>
            <div className="text-sm leading-6 pr-1" style={{ color: "var(--muted)", maxHeight: "60vh", overflow: "auto" }}>
              {agent.bio}
            </div>
          </div>

          {/* Right: Focus toggles */}
          <div className="border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6" style={{ borderColor: "var(--card-border)" }}>
            <div className="text-sm font-medium mb-2" style={{ color: "var(--text)" }}>Focus Areas</div>
            <div className="flex flex-col gap-3">
              {agent.focuses.map((f, idx) => {
                const checked = !!focusState[f.id];
                return (
                  <div key={f.id} className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium" style={{ color: "var(--text)" }}>{f.label}</div>
                      {f.description ? (
                        <div className="text-xs" style={{ color: "var(--muted)" }}>{f.description}</div>
                      ) : null}
                    </div>
                    <button
                      role="switch"
                      aria-checked={checked}
                      onClick={() => toggle(f.id)}
                      onKeyDown={(e) => {
                        if (e.key === " ") {
                          e.preventDefault();
                          toggle(f.id);
                        }
                      }}
                      className={`relative h-6 w-11 rounded-full transition-colors border`}
                      style={{
                        background: checked ? "var(--accent-muted)" : "var(--bg-elev)",
                        borderColor: "var(--card-border)",
                      }}
                    >
                      <span
                        className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full transition-all"
                        style={{
                          background: "var(--card-bg)",
                          border: "1px solid var(--card-border)",
                          transform: checked ? "translateX(20px)" : "translateX(0)",
                        }}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Focus trap end */}
          <button ref={lastFocusable} className="sr-only" onClick={() => {}} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
