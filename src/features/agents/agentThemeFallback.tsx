import React from "react";

// Fallback token-based color (avoid hex and color-mix)
export function agentColor(_name?: string): string {
  // If per-agent tokens are added later, switch on name here.
  return 'var(--accent-gold)';
}

export type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

export function AgentIconFallback({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...rest}>
      <rect x="4" y="4" width="16" height="16" rx="4" fill="currentColor" />
    </svg>
  );
}

export default agentColor;
