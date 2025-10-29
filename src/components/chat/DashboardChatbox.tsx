import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, ChevronDown, Bot, Clock } from "lucide-react";
import { useAgentSelection } from "@/context/AgentSelectionContext";
import { getAgentColorForContext } from "@/components/ui/agentThemes";
import getIcon from "@/components/ui/agentIcons";
import { agents } from "@/lib/agents-enhanced";
import { sendMessage as sendMessageAPI } from "@/lib/api/agentClient";
import ChatTools from "./ChatTools";
import MessageBubble from "../MessageBubble";
import ConversationHistory from "../ConversationHistory";
import { useAgentEnabled } from "@/features/agents/agentEnabledStore";

export default function DashboardChatbox() {
  const { selected, setSelected } = useAgentSelection();
  const allNames = useMemo(() => agents.map((a) => a.name), []);
  const color = getAgentColorForContext(selected, "dashboard");
  const Icon = getIcon(selected);
  const { isEnabled } = useAgentEnabled();

  const [message, setMessage] = useState("");
  const [showAgentMenu, setShowAgentMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowAgentMenu(false);
    };
    const onClickAway = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowAgentMenu(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickAway);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickAway);
    };
  }, []);

  const chooseAgent = (name: string) => {
    const agent = agents.find((a) => a.name === name);
    const key = agent?.id || name.toLowerCase();
    if (!isEnabled(key)) return; // Guard: cannot select disabled agent
    setSelected(name);
    setShowAgentMenu(false);
    textareaRef.current?.focus();
  };

  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage("");
    setError(null);
    setIsLoading(true);

    const newUserMessage = {
      id: Date.now(),
      role: "user",
      content: userMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newUserMessage]);

    try {
      const selectedAgentId = selected.toLowerCase();
      const response = await sendMessageAPI(userMessage, selectedAgentId, currentSessionId);

      if (!currentSessionId && response.data?.sessionId) {
        setCurrentSessionId(response.data.sessionId);
      }

      const agentMessage = {
        id: Date.now() + 1,
        role: "agent",
        agent: response.data?.agent || selected,
        content: response.data?.response || "No response",
        timestamp: new Date().toISOString(),
        metadata: response.data?.metadata || {},
      };
      setMessages((prev) => [...prev, agentMessage]);
    } catch (err: any) {
      console.error("Error sending message:", err);
      setError(err.message);
      const errorMessage = {
        id: Date.now() + 1,
        role: "error",
        content: `Error: ${err.message}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold" style={{ color }}>
          {selected} <span data-build="dash-chat-v1" />
        </h2>
      </div>
      <div className="mb-6 flex justify-center">
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setShowAgentMenu(!showAgentMenu)}
            className="select-agent flex items-center justify-between gap-3 rounded-full border border-token bg-card px-5 py-2 text-sm text-fg shadow-sm ring-1 ring-transparent hover:bg-[color:var(--accent)]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ring-offset-2 ring-offset-bg"
            aria-haspopup="menu"
            aria-expanded={showAgentMenu}
          >
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className="agent-dot"
                style={{
                  display: "inline-block",
                  width: "14px",
                  height: "14px",
                  borderRadius: "9999px",
                  backgroundColor: color,
                  boxShadow: "0 0 0 2px rgba(0,0,0,0.2)",
                }}
              />
              <span>{selected}</span>
            </span>
            <ChevronDown className={`h-4 w-4 text-[#B3B3B3] transition-transform ${showAgentMenu ? "rotate-180" : ""}`} />
          </button>

          {showAgentMenu && (
            <div ref={menuRef} role="menu" className="absolute left-1/2 z-20 mt-2 w-[min(20rem,90vw)] -translate-x-1/2 rounded-lg border border-[#202020] bg-[#0C0C0C] p-1 shadow-xl">
              {allNames.map((name) => {
                const c = getAgentColorForContext(name, "dashboard");
                const I = getIcon(name);
                const agent = agents.find((a) => a.name === name);
                const enabled = isEnabled(agent?.id || name.toLowerCase());
                return (
                  <div key={name} role="menuitem" onClick={enabled ? (() => chooseAgent(name)) : undefined} className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-white/5 ${enabled ? '' : 'opacity-50 grayscale cursor-not-allowed'}`} aria-disabled={!enabled} title={enabled ? name : 'Agent is disabled. Open bio to re-enable.'} style={{ pointerEvents: enabled ? 'auto' : 'none' }}>
                    <span className="inline-flex items-center justify-center rounded" style={{ width: 18, height: 18, backgroundColor: `${c}22` }}>
                      <I size={14} color={c} />
                    </span>
                    <span>{name}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {messages.length > 0 && (
        <div className="mb-6 panel-system max-h-[500px] overflow-y-auto p-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFC96C]/20">
                <Bot className="h-4 w-4 text-[#FFC96C] animate-pulse" />
              </div>
              <div className="bg-[#202020] text-[#F2F2F2] rounded-lg p-4">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-[#FFC96C] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-[#FFC96C] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-[#FFC96C] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative">
        <button
          type="button"
          className="history-pill"
          aria-pressed={showHistory}
          aria-label={showHistory ? "Hide history" : "Show history"}
          onClick={() => setShowHistory(!showHistory)}
        >
          <Clock className="h-4 w-4" aria-hidden="true" />
          <span className="history-label">{showHistory ? "Hide History" : "History"}</span>
        </button>
        <div className="panel-system overflow-hidden p-2">
          <ChatTools
            activeMode="chat"
            onToggleMode={() => {}}
            onAttach={() => {}}
            features={{ mic: true, upload: true, modes: ["chat", "agi"] }}
            uploadOnRight
            rightAppend={(
              <button
                type="submit"
                disabled={!message.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: message.trim() ? color : "#333" }}
                aria-label="Send message"
              >
                <ArrowUp className="h-4 w-4 text-[#1A1A1A]" />
              </button>
            )}
          >
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe what you need help with…"
              className="w-full resize-none rounded-full bg-transparent px-4 py-3 text-[#F2F2F2] focus:outline-none"
              rows={3}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
          </ChatTools>
        </div>
      </form>

      {showHistory && (
        <div className="mb-6">
          <ConversationHistory onSelectSession={() => {}} currentSessionId={currentSessionId} />
        </div>
      )}
    </div>
  );
}
