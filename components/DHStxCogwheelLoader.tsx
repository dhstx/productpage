// components/DHStxCogwheelLoader.tsx
"use client";
import { useEffect, useRef } from "react";
import { animate } from "animejs";

type Speed = "slow" | "normal" | "fast";
type Size = "sm" | "md" | "lg";

const SIZE_MAP: Record<Size, number> = { sm: 80, md: 120, lg: 160 };
const DUR_MAP: Record<Speed, { big: number; small: number }> = {
  slow:   { big: 4000, small: 3000 },
  normal: { big: 3000, small: 2000 },
  fast:   { big: 2000, small: 1000 },
};

export function DHStxCogwheelLoader({
  text = "Processing...",
  size = "md",
  speed = "normal",
}: { text?: string; size?: Size; speed?: Speed }) {
  const bigRef = useRef<SVGSVGElement>(null);
  const smallRef = useRef<SVGSVGElement>(null);
  const container = SIZE_MAP[size];
  const { big, small } = DUR_MAP[speed];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const a1 = animate(bigRef.current, {
      rotate: 360,
      duration: big,
      ease: "linear",
      loop: true,
      autoplay: true,
    });
    const a2 = animate(smallRef.current, {
      rotate: -360,
      duration: small,
      ease: "linear",
      loop: true,
      autoplay: true,
    });
    return () => { a1.pause(); a2.pause(); };
  }, [big, small]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4" role="status" aria-live="polite">
      <div className="relative" style={{ width: container, height: container }}>
        {/* Large Gear */}
        <svg ref={bigRef} className="absolute inset-0 m-auto w-4/5 h-4/5" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="20" fill="#1A1A1A" stroke="#FFC96C" strokeWidth="2" />
          <circle cx="50" cy="50" r="35" fill="none" stroke="#FFC96C" strokeWidth="2" />
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 360) / 8; const rad = (angle * Math.PI) / 180;
            const x1 = 50 + 35 * Math.cos(rad); const y1 = 50 + 35 * Math.sin(rad);
            const x2 = 50 + 45 * Math.cos(rad); const y2 = 50 + 45 * Math.sin(rad);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFC96C" strokeWidth="6" />;
          })}
        </svg>
        {/* Small Gear */}
        <svg ref={smallRef} className="absolute top-0 right-0 w-1/3 h-1/3" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="15" fill="#1A1A1A" stroke="#FFC96C" strokeWidth="2" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="#FFC96C" strokeWidth="2" />
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i * 360) / 6; const rad = (angle * Math.PI) / 180;
            const x1 = 50 + 30 * Math.cos(rad); const y1 = 50 + 30 * Math.sin(rad);
            const x2 = 50 + 40 * Math.cos(rad); const y2 = 50 + 40 * Math.sin(rad);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFC96C" strokeWidth="5" />;
          })}
        </svg>
      </div>
      {text !== "" && (
        <p className="font-mono text-xs text-[#B3B3B3]">
          <span className="text-[#FFC96C]">▮</span> {text}
        </p>
      )}
    </div>
  );
}
