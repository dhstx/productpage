import CogwheelImage from "../../assets/product-cogwheel.svg";

export default function ScrollGears({
  color = "#FFC96C",
  className = "",
  sticky = true,
}) {
  const wantsReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const fill = color;

  // Define animation styles for smooth continuous rotation
  const animationStyle = wantsReducedMotion ? {} : {
    animation: 'spin 20s linear infinite',
  };

  const reverseAnimationStyle = wantsReducedMotion ? {} : {
    animation: 'spin-reverse 20s linear infinite',
  };

  return (
    <div className={`relative ${className}`}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}</style>
      {/* Only stick at md+ to avoid overlap on small screens */}
      <div className={`${sticky ? "md:sticky md:top-24" : ""} mx-auto max-w-5xl px-4 md:px-8`}>
        <div className="grid grid-cols-3 items-center justify-items-center gap-4 sm:gap-6 md:gap-8">
          {/* Keep sizes equivalent to previous Gear radii: (44, 58, 72) -> approx (108, 136, 164) */}
          <div style={reverseAnimationStyle} className="scale-75 sm:scale-90 md:scale-100">
            <img src={CogwheelImage} alt="Cogwheel" width={108} height={108} style={{ display: 'block' }} />
          </div>
          <div style={animationStyle} className="scale-75 sm:scale-90 md:scale-100">
            <img src={CogwheelImage} alt="Cogwheel" width={136} height={136} style={{ display: 'block' }} />
          </div>
          <div style={reverseAnimationStyle} className="scale-75 sm:scale-90 md:scale-100">
            <img src={CogwheelImage} alt="Cogwheel" width={164} height={164} style={{ display: 'block' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

