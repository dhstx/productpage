import { useRef } from "react";
import { animate } from "animejs";

export default function AnimatedButton({ children, onClick, className = "", variant = "primary", asChild = false }) {
  const buttonRef = useRef(null);

  const handleMouseEnter = () => {
    if (buttonRef.current) {
      animate(buttonRef.current, {
        scale: 1.05,
        duration: 300,
        ease: "out-elastic(1, .5)",
      });
    }
  };

  const handleMouseLeave = () => {
    if (buttonRef.current) {
      animate(buttonRef.current, {
        scale: 1,
        duration: 200,
        ease: "out-quad",
      });
    }
  };

  const handleClick = (e) => {
    // Ripple effect
    if (buttonRef.current) {
      animate(buttonRef.current, {
        scale: [1, 0.95, 1],
        duration: 400,
        ease: "out-elastic(1, .8)",
      });
    }

    if (onClick) {onClick(e);}
  };

  const baseClass = variant === "primary" 
    ? "btn-system" 
    : "px-4 py-2 rounded-[2px] border border-[#202020] bg-[#1A1A1A] text-[#F2F2F2] font-medium transition-colors";

  // If asChild, wrap the children with the animation handlers
  if (asChild) {
    const child = children;
    return (
      <div
        ref={buttonRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="inline-block"
      >
        {child}
      </div>
    );
  }

  return (
    <button
      ref={buttonRef}
      className={`${baseClass} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
