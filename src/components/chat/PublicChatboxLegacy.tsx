import React, {useEffect, useMemo, useRef, useState} from "react";
import "@/styles/public-chatbox-legacy.css";
import getIcon from "@/components/ui/agentIcons";
import { getAgentColorForContext } from "@/components/ui/agentThemes";

const AGENTS = ["Commander","Conductor","Connector"] as const;
type A = typeof AGENTS[number];

/** EXACT legacy timings */
const CHAR_MS = 32;
const WORD_PAUSE_MS = 850;

export default function PublicChatboxLegacy() {
  const [agent, setAgent] = useState<A>("Commander");

  // keep the first rendered word == selected to avoid any flicker
  const rotation = useMemo<A[]>(() => {
    const i = AGENTS.indexOf(agent);
    return [...AGENTS.slice(i), ...AGENTS.slice(0, i)];
  }, [agent]);

  const color = getAgentColorForContext(agent, "public");
  const wordRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = wordRef.current; if (!el) return;
    let stop = false;
    const sleep = (ms:number)=> new Promise(r=>setTimeout(r,ms));
    async function type(word:string) {
      el.textContent = "";
      for (let i=0; i<word.length && !stop; i++) { el.textContent += word[i]; await sleep(CHAR_MS); }
      await sleep(WORD_PAUSE_MS);
    }
    (async () => { for (const w of rotation) { if (stop) break; await type(w); } })();
    return () => { stop = true; };
  }, [rotation]);

  return (
    <section className="hero-legacy-wrap" aria-label="Public Chatbox (Legacy)">
      <h1 className="hero-legacy-title">SYNTEK AUTOMATIONS</h1>
      <h2 className="hero-legacy-sub">
        WELCOME. CONFER WITH YOUR{" "}
        <span ref={wordRef} className="legacy-typer" style={{ color }}>{agent}</span>.
      </h2>

      <div className="legacy-controls">
        <button className="legacy-pill"><span>⏺</span>History</button>

        {/* Agent dropdown (3 only, original colors) */}
        <div className="relative">
          <button className="legacy-pill" aria-haspopup="menu">
            {React.createElement(getIcon(agent), { size: 14, color })}
            {agent} ▾
          </button>
          <div className="absolute left-0 mt-2 w-44 rounded-lg border bg-[var(--card-bg)] shadow-lg z-10">
            {AGENTS.map(n => {
              const c = getAgentColorForContext(n,"public");
              const I = getIcon(n);
              return (
                <div key={n} role="menuitem" onClick={()=>setAgent(n)}
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-white/5">
                  <span
                    className="inline-flex items-center justify-center rounded"
                    style={{
                      width:18,
                      height:18,
                      // If c is a CSS variable, use color-mix for a soft tint; otherwise use hex with alpha suffix
                      background: c.startsWith('var(')
                        ? `color-mix(in srgb, ${c} 13%, transparent)`
                        : `${c}22`
                    }}
                  >
                    {React.createElement(I, { size: 12, color: c })}
                  </span>
                  <span>{n}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="legacy-shell">
        <div className="flex items-center gap-2 mb-2">
          {/* attach any extra controls here if you had them */}
        </div>
        <input className="legacy-input" placeholder="Describe what you need help with..." />
      </div>

      <div className="legacy-actions">
        <button className="legacy-action">✧ Draft a meeting agenda</button>
        <button className="legacy-action">✧ Summarize board engagement</button>
        <button className="legacy-action">✧ Prioritize initiatives</button>
        <button className="legacy-action">✧ Generate a progress report</button>
      </div>
    </section>
  );
}
