import { useEffect, useRef } from "react";
import { animate } from "animejs";

export default function FadeInSection({ children, delay = 0, className = "" }) {
  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animate(sectionRef.current, {
            opacity: [0, 1],
            translateY: [40, 0],
            duration: 800,
            delay,
            ease: "out-cubic",
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      sectionRef.current.style.opacity = "0";
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={sectionRef} className={className}>
      {children}
    </div>
  );
}
