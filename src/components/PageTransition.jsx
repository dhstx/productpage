import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { animate } from "animejs";

export default function PageTransition({ children }) {
  const location = useLocation();
  const contentRef = useRef(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // Fade in and slide up animation on route change
    animate(contentRef.current, {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 600,
      ease: "out-cubic",
    });
  }, [location.pathname]);

  return (
    <div ref={contentRef} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
