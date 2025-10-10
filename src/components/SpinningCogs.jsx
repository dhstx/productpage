// components/SpinningCogs.jsx
import React from 'react';
import '../styles/cogs.css'; // ensure path matches your setup

/**
 * Three accessible, GPU-friendly spinning cogs.
 * Directions: Left CCW, Middle CW, Right CCW.
 * Speeds: slight variance to feel organic.
 */
export default function SpinningCogs() {
  return (
    <div
      className="cogs-wrap"
      aria-hidden="true"
      role="img"
      aria-label="Decorative spinning cogwheels"
    >
      <svg
        className="cogs-svg"
        viewBox="0 0 1200 360"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left Cog — CCW */}
        <g className="cog spin-reverse speed-slow" transform="translate(180,180)">
          {teeth(12, 58, 78)}
          <circle r="58" fill="#FBC366"/>
          <circle r="16" fill="#0F0F0F"/>
        </g>

        {/* Middle Cog — CW */}
        <g className="cog spin speed-med" transform="translate(600,180)">
          {teeth(18, 80, 104)}
          <circle r="80" fill="#FBC366"/>
          <circle r="18" fill="#0F0F0F"/>
        </g>

        {/* Right Cog — CCW */}
        <g className="cog spin-reverse speed-fast" transform="translate(1020,180)">
          {teeth(24, 98, 128)}
          <circle r="98" fill="#FBC366"/>
          <circle r="20" fill="#0F0F0F"/>
        </g>
      </svg>
    </div>
  );
}

/**
 * Draws rectangular teeth around a circle using <rect>s rotated around center.
 * count: number of teeth
 * innerR: distance from center to inner edge of tooth
 * outerR: distance to outer edge (controls tooth length)
 */
function teeth(count, innerR, outerR) {
  const toothW = 8;             // tooth thickness
  const toothH = outerR - innerR;
  const items = [];
  for (let i = 0; i < count; i++) {
    const angle = (i * 360) / count;
    items.push(
      <rect
        key={i}
        x={-toothW / 2}
        y={-outerR}
        width={toothW}
        height={toothH}
        fill="#FBC366"
        transform={`rotate(${angle})`}
        rx="1"
      />
    );
  }
  return items;
}
