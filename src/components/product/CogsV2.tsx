import { useState } from "react";

function GearImg({ className }: { className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    // Fallback: inline SVG gear (always renders)
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

export default function CogsV2() {
  return (
    <section className="product-cogs-v2" data-cogs="v2" aria-hidden="true">
      <div className="gear-row-v2">
        <figure className="gear-item-v2 gear-sm"><GearImg className="gear-img-v2" /></figure>
        <figure className="gear-item-v2 gear-md"><GearImg className="gear-img-v2" /></figure>
        <figure className="gear-item-v2 gear-lg"><GearImg className="gear-img-v2" /></figure>
      </div>
    </section>
  );
}
