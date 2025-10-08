import { useEffect, useRef } from "react";
import { animate } from "animejs";
import Gear from "./Gear";

export default function ScrollGearsAnime({
  color = "#FFC96C",
  className = "",
  sticky = true,
}) {
  const rootRef = useRef(null);
  const gear1Ref = useRef(null);
  const gear2Ref = useRef(null);
  const gear3Ref = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    // Scroll-based rotation using direct DOM manipulation for performance
    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.max(0, Math.min(1, 1 - rect.top / vh));

      if (gear1Ref.current) {
        gear1Ref.current.style.transform = `rotate(${progress * 360}deg)`;
      }

      if (gear2Ref.current) {
        gear2Ref.current.style.transform = `rotate(${-progress * 270}deg)`;
      }

      if (gear3Ref.current) {
        gear3Ref.current.style.transform = `rotate(${progress * 180}deg)`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <div className={`${sticky ? "sticky top-24" : ""} mx-auto max-w-5xl`}>
        <div className="grid grid-cols-3 gap-6 items-center justify-items-center">
          <div ref={gear1Ref}>
            <Gear teeth={12} radius={44} color={color} />
          </div>
          <div ref={gear2Ref}>
            <Gear teeth={18} radius={58} color={color} />
          </div>
          <div ref={gear3Ref}>
            <Gear teeth={24} radius={72} color={color} />
          </div>
        </div>
      </div>
    </div>
  );
}
