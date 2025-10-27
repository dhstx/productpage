import React, {useEffect, useMemo, useRef, useState} from "react";
import "@/styles/public-chatbox.css";
import getIcon from "@/components/ui/agentIcons";
import { getAgentColorForContext } from "@/components/ui/agentThemes";

const PUBLIC_AGENTS = ["Commander","Conductor","Connector"] as const;
type PublicAgent = typeof PUBLIC_AGENTS[number];

export default function PublicChatbox() {
  const rootRef = useRef<HTMLElement | null>(null);
  // Keep selection stable across refresh for nicer demos
  const [selected, setSelected] = useState<PublicAgent>(() => {
    if (typeof window !== "undefined") {
      const s = window.localStorage.getItem("publicAgent");
      if (s && PUBLIC_AGENTS.includes(s as PublicAgent)) return s as PublicAgent;
    }
    return "Commander";
  });

  useEffect(() => {
    try { window.localStorage.setItem("publicAgent", selected); } catch {}
  }, [selected]);

  // Typewriter that starts with the currently selected agent (no flicker)
  const queue = useMemo<PublicAgent[]>(() => {
    const idx = PUBLIC_AGENTS.indexOf(selected);
    return [...PUBLIC_AGENTS.slice(idx), ...PUBLIC_AGENTS.slice(0, idx)];
  }, [selected]);

  const color = getAgentColorForContext(selected, "public");
  const titleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = titleRef.current; if (!el) return;
    let abort = false;
    const sleep = (ms:number)=> new Promise(r=>setTimeout(r,ms));
    const type = async (word:string) => {
      el.textContent = "";
      el.style.color = color;  // color BEFORE typing
      for (let i=0; i<word.length && !abort; i++) { el.textContent += word[i]; await sleep(32); }
      await sleep(850);
    };
    (async ()=>{
      for (const name of queue) { if (abort) break; await type(name); }
    })();
    return () => { abort = true; };
  }, [queue, color]);

  // Fade-in without changing layout height
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    requestAnimationFrame(() => el.classList.add("is-ready"));
  }, []);

  // Optional: measure height once and set reserved variable on slot
  useEffect(() => {
    const slot = document.querySelector<HTMLElement>(".public-chatbox-slot");
    const el = rootRef.current as HTMLElement | null;
    if (!slot || !el) return;
    const update = () => {
      const h = Math.ceil(el.getBoundingClientRect().height);
      if (h > 0) slot.style.setProperty("--public-chatbox-min-h", `${Math.max(600, h)}px`);
    };
    // One-time tune after first paint; avoids CLS while preventing bottom peek on small screens
    setTimeout(update, 0);
  }, []);

  return (
    <section ref={rootRef as any} aria-label="Public Chatbox" className="public-chatbox-appear mx-auto max-w-5xl px-4">
      <header className="text-center mb-6">
        <h1 className="text-5xl font-extrabold tracking-wide">SYNTEK AUTOMATIONS</h1>
        <h2 className="mt-2 text-2xl font-semibold">
          WELCOME. CONFER WITH YOUR{" "}
          <span ref={titleRef} style={{ color }} className="underline underline-offset-4"> </span>.
        </h2>
      </header>

      {/* Controls row (legacy spacing) */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <button className="px-4 py-1.5 rounded-full border" style={{borderColor:"var(--card-border)"}}>
          <span className="mr-2">⏺</span>History
        </button>
        <div className="relative">
          <button className="px-4 py-1.5 rounded-full border" style={{borderColor:"var(--card-border)"}}>
            <span className="inline-flex items-center gap-2">
              {React.createElement(getIcon(selected), { size: 14, color })}
              {selected}
            </span>
            <span className="ml-2">▾</span>
          </button>

          {/* Simple dropdown */}
          <div className="absolute left-0 mt-2 w-44 rounded-lg border bg-[var(--card-bg)] shadow-lg z-10">
            {PUBLIC_AGENTS.map(name => {
              const c = getAgentColorForContext(name, "public");
              const Icon = getIcon(name);
              const active = name === selected;
              return (
                <div
                  key={name}
                  role="menuitem"
                  onClick={() => setSelected(name)}
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-black/10"
                  style={{ backgroundColor: active ? `${c}12` : undefined }}
                >
                  <span className="inline-flex items-center justify-center rounded" style={{ width:18,height:18, background:`${c}22` }}>
                    {React.createElement(Icon, { size: 12, color: c })}
                  </span>
                  <span>{name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legacy large rounded input */}
      <div className="mx-auto mb-4 rounded-3xl py-5 px-6 border"
           style={{ maxWidth: "900px", background:"var(--card-bg)", borderColor:"var(--card-border)" }}>
        <input
          placeholder="Describe what you need help with..."
          className="w-full bg-transparent outline-none text-lg"
          style={{ color:"var(--text)" }}
        />
        {/* Actions row (icon buttons) */}
        <div className="mt-3 flex gap-2">
          <button className="px-3 py-1.5 rounded-full border" style={{borderColor:"var(--card-border)"}}>✎</button>
          <button className="px-3 py-1.5 rounded-full border" style={{borderColor:"var(--card-border)"}}>Chat</button>
          <button className="px-3 py-1.5 rounded-full border" style={{borderColor:"var(--card-border)"}}>Agent</button>
        </div>
      </div>

      {/* Legacy suggestion buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl mx-auto">
        <button className="rounded-md border px-4 py-2 text-left" style={{borderColor:"var(--card-border)"}}>✧ Draft a meeting agenda</button>
        <button className="rounded-md border px-4 py-2 text-left" style={{borderColor:"var(--card-border)"}}>✧ Summarize board engagement</button>
        <button className="rounded-md border px-4 py-2 text-left" style={{borderColor:"var(--card-border)"}}>✧ Prioritize initiatives</button>
        <button className="rounded-md border px-4 py-2 text-left" style={{borderColor:"var(--card-border)"}}>✧ Generate a progress report</button>
      </div>
    </section>
  );
}
