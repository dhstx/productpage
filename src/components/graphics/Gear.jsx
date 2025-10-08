export default function Gear({
  teeth = 12,
  radius = 48,
  toothWidth = 6,
  toothHeight = 10,
  hubRadius = 14,
  color = "#FFC96C",
  rotationDeg = 0,
  className = "",
}) {
  const size = (radius + toothHeight) * 2;
  const center = size / 2;
  const teethEls = Array.from({ length: teeth }).map((_, i) => {
    const angle = (i * 360) / teeth;
    return (
      <rect
        key={i}
        x={center - toothWidth / 2}
        y={center - radius - toothHeight}
        width={toothWidth}
        height={toothHeight}
        rx={1}
        transform={`rotate(${angle} ${center} ${center})`}
      />
    );
  });

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{
        transform: `rotate(${rotationDeg}deg)`,
        transformBox: "fill-box",
        transformOrigin: "50% 50%",
        display: "block",
      }}
      aria-hidden="true"
    >
      <g fill={color}>
        {teethEls}
        {/* gear body */}
        <circle cx={center} cy={center} r={radius} />
        {/* inner hub (hole) */}
        <circle cx={center} cy={center} r={hubRadius} fill="#0C0C0C" />
      </g>
    </svg>
  );
}
