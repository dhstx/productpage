import { useEffect, useRef, useState } from "react";
import Gear from "./Gear";

export default function ScrollGears({
  color = "#FFC96C",
  className = "",
  sticky = true,
}) {
  const rootRef = useRef(null);
  const [progress, setProgress] = useState(0); // 0..1
  const [isInView, setIsInView] = useState(false);
  
  const wantsReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: [0, 1] }
    );
    io.observe(el);

    const onScroll = () => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const middle = vh / 2;
      const start = rect.top - middle;
      const end = rect.bottom - middle;
      const p = 1 - Math.min(1, Math.max(0, start / (end - start)));
      setProgress(p);
    };

    let rafId = 0;
    const loop = () => {
      if (isInView) onScroll();
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    const onResize = () => onScroll();
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      io.disconnect();
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, [isInView]);

  // Gear setup
  const T1 = 12, T2 = 18, T3 = 24;
  const baseDeg = wantsReducedMotion ? 0 : progress * 720;
  const θ1 = baseDeg;
  const θ2 = -θ1 * (T1 / T2);
  const θ3 = θ1 * (T1 / T3);

  const fill = color;

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <div className={`${sticky ? "sticky top-24" : ""} mx-auto max-w-5xl`}>
        <div className="grid grid-cols-3 gap-6 items-center justify-items-center">
          <Gear teeth={T1} radius={44} color={fill} rotationDeg={θ1} />
          <Gear teeth={T2} radius={58} color={fill} rotationDeg={θ2} />
          <Gear teeth={T3} radius={72} color={fill} rotationDeg={θ3} />
        </div>
      </div>
    </div>
  );
}
