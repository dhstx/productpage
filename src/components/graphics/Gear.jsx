export default function Gear({
  // Props kept for API compatibility with existing callers
  teeth = 12,
  radius = 48,
  toothWidth = 6,
  toothHeight = 10,
  hubRadius = 14,
  color = "#FFC96C",
  rotationDeg = 0,
  className = "",
}) {
  // Preserve external sizing behavior: total size is outer radius plus tooth height
  const size = (radius + toothHeight) * 2;

  // Render the provided modern gear asset inline so it inherits currentColor
  // Animations are applied by wrappers; we only keep initial rotation support
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 512 512"
      style={{
        transform: `rotate(${rotationDeg}deg)`,
        transformBox: "fill-box",
        transformOrigin: "50% 50%",
        display: "block",
        color: color,
      }}
      aria-hidden="true"
    >
      <defs>
        {/* Mask to carve inner ring and hub as transparent holes */}
        <mask id="gearHoleMask">
          <rect width="100%" height="100%" fill="#fff" />
          <circle cx="256" cy="256" r="150" fill="#000" />
          <circle cx="256" cy="256" r="80" fill="#000" />
        </mask>
      </defs>
      {/* Outer gear shape (12-tooth), filled with currentColor */}
      <path
        d="M256 32h28l12 56a206 206 0 0 1 46 19l48-34 20 20-34 48a206 206 0 0 1 19 46l56 12v28l-56 12a206 206 0 0 1-19 46l34 48-20 20-48-34a206 206 0 0 1-46 19l-12 56h-28l-12-56a206 206 0 0 1-46-19l-48 34-20-20 34-48a206 206 0 0 1-19-46L32 284v-28l56-12a206 206 0 0 1 19-46L73 148l20-20 48 34a206 206 0 0 1 46-19l12-56z"
        fill="currentColor"
        stroke="currentColor"
        strokeLinejoin="round"
        mask="url(#gearHoleMask)"
      />
    </svg>
  );
}
