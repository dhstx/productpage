import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";

export default function AnimatedCounter({ end, duration = 2000, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0);
  const counterRef = useRef({ value: 0 });
  const elementRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animate(counterRef.current, {
            value: end,
            duration,
            ease: "out-expo",
            onUpdate: () => {
              setCount(Math.floor(counterRef.current.value));
            },
          });
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={elementRef}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}
