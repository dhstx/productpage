export default function ScrollGears({ className = "", sticky = true }) {
  const wantsReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const animationOverride = wantsReducedMotion ? { animation: "none" } : undefined;

  const commonImgProps = {
    className: "cog__img",
    src: "/assets/gear-modern.png",
    srcSet:
      "/assets/gear-modern.png 1x, /assets/gear-modern@2x.png 2x, /assets/gear-modern@3x.png 3x",
    alt: "",
    decoding: "async",
    loading: "lazy",
    // Fallback to SVG if PNG assets are unavailable during development
    onError: (e) => {
      const img = e.currentTarget;
      if (img && !img.dataset.fallbackApplied) {
        img.dataset.fallbackApplied = "true";
        img.src = "/assets/gear-modern.svg";
        img.removeAttribute("srcset");
      }
    },
  };

  return (
    <div className={`relative ${className}`}>
      {/* Only stick at md+ to avoid overlap on small screens */}
      <div className={`${sticky ? "md:sticky md:top-24" : ""} mx-auto max-w-5xl px-4 md:px-8`}>
        <div className="cog-row" aria-hidden="true">
          <div className="cog cog--sm cog--reverse" style={animationOverride}>
            <img {...commonImgProps} />
          </div>
          <div className="cog cog--md" style={animationOverride}>
            <img {...commonImgProps} />
          </div>
          <div className="cog cog--lg cog--reverse" style={animationOverride}>
            <img {...commonImgProps} />
          </div>
        </div>
      </div>
    </div>
  );
}

