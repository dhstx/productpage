import { useEffect, useRef, useState } from "react";
import anime from "animejs/lib/anime.es.js";
import { cleanupCogs } from "@/utils/cleanupCogs";

function GearImage({ className }: { className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    // SVG fallback (looks like your reference; tinted by its own color values)
    return (
      <svg viewBox="0 0 512 512" aria-hidden="true" className={className}>
        <defs>
          <radialGradient id="gearFill" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#F2C06B" stopOpacity="0.95"/>
            <stop offset="100%" stopColor="#F2C06B" stopOpacity="0.80"/>
          </radialGradient>
        </defs>
        <path d="M256 32l38 5 15 43 45 9 28-34 35 20-9 44 37 26 31-18 24 34-31 32 18 41 39 8v40l-39 8-18 41 31 32-24 34-31-18-37 26 9 44-35 20-28-34-45 9-15 43-38 5-38-5-15-43-45-9-28 34-35-20 9-44-37-26-31 18-24-34 31-32-18-41-39-8v-40l39-8 18-41-31-32 24-34 31 18 37-26-9-44 35-20 28 34 45-9 15-43 38-5z" fill="url(#gearFill)"/>
        <circle cx="256" cy="256" r="140" fill="none" stroke="#F2C06B" strokeWidth="20"/>
        <circle cx="256" cy="256" r="180" fill="none" stroke="#F2C06B" strokeWidth="20" opacity="0.9"/>
      </svg>
    );
  }
  return (
    <img
      className={className}
      src="/assets/gear-modern.png"
      srcSet="/assets/gear-modern.png 1x, /assets/gear-modern@2x.png 2x, /assets/gear-modern@3x.png 3x"
      alt=""
      decoding="async"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export default function CogsV3() {
  const rowRef = useRef<HTMLDivElement>(null);
  const smRef = useRef<HTMLDivElement>(null);
  const mdRef = useRef<HTMLDivElement>(null);
  const lgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1) Remove any old wheels and verify
    const { removed, remaining } = cleanupCogs();
    if (remaining > 0) console.warn("[cogs] legacy nodes persisted; they were force-removed earlier.");

    // 2) Sanity check the PNG asset exists
    fetch("/assets/gear-modern.png", { method: "HEAD" }).then(r => {
      if (!r.ok) console.warn("[cogs] PNG missing at /assets/gear-modern.png — SVG fallback will be used.");
    }).catch(() => {});

    // 3) Spin with anime.js (match existing timings)
    // Each adds a continuous rotation; use separate animations to keep speeds distinct
    anime({ targets: smRef.current, rotate: '360deg', duration: 16000, easing: 'linear', loop: true });
    anime({ targets: mdRef.current, rotate: '360deg', duration: 22000, easing: 'linear', loop: true });
    anime({ targets: lgRef.current, rotate: '360deg', duration: 28000, easing: 'linear', loop: true });

    return () => {
      // Clean up animations on unmount
      anime.remove(smRef.current as any);
      anime.remove(mdRef.current as any);
      anime.remove(lgRef.current as any);
    };
  }, []);

  return (
    <section className="product-cogs-v3" data-cogs="v3" aria-hidden="true">
      <div className="gear-row-v3" ref={rowRef}>
        <div className="gear-item-v3 gear-sm" ref={smRef}><GearImage className="gear-media-v3" /></div>
        <div className="gear-item-v3 gear-md" ref={mdRef}><GearImage className="gear-media-v3" /></div>
        <div className="gear-item-v3 gear-lg" ref={lgRef}><GearImage className="gear-media-v3" /></div>
      </div>
    </section>
  );
}
