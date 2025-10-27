import React from 'react';

// Lightweight custom icons (inline SVGs). No external packs.
// Style: rounded corners, 2px stroke, slight geometric motif.

export type IconProps = React.SVGProps<SVGSVGElement> & { size?: number; color?: string };
const S = ({ size = 20, color = 'currentColor', ...rest }: IconProps) => ({
  size, color, rest
});

export const CommanderIcon = (p: IconProps) => {
  const { size, color, rest } = S(p);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest}>
      <g fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l4 4-4 4-4-4z" />
        <path d="M12 13v8" />
        <circle cx="12" cy="12" r="10" opacity=".2" />
      </g>
    </svg>
  );
};

export const ConductorIcon = (p: IconProps) => {
  const { size, color, rest } = S(p);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest}>
      <g fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 16h6M14 16h6" />
        <path d="M10 16V8M14 16V6" />
        <circle cx="10" cy="8" r="2" />
        <circle cx="14" cy="6" r="2" />
      </g>
    </svg>
  );
};

export const ConnectorIcon = (p: IconProps) => {
  const { size, color, rest } = S(p);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest}>
      <g fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="12" r="3" />
        <path d="M9 12h6" />
      </g>
    </svg>
  );
};

// Additional agents — simple emblematic shapes (distinct but cohesive)
export const ScoutIcon      = (p: IconProps) => { const {size,color,rest}=S(p); return (<svg width={size} height={size} viewBox="0 0 24 24" {...rest}><g fill="none" stroke={color} strokeWidth="2"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4-4"/></g></svg>); };
export const BuilderIcon    = (p: IconProps) => { const {size,color,rest}=S(p); return (<svg width={size} height={size} viewBox="0 0 24 24" {...rest}><g fill="none" stroke={color} strokeWidth="2"><path d="M3 14l6-6 7 7"/><path d="M14 3h7v7"/></g></svg>); };
export const MuseIcon       = (p: IconProps) => { const {size,color,rest}=S(p); return (<svg width={size} height={size} viewBox="0 0 24 24" {...rest}><g fill="none" stroke={color} strokeWidth="2"><path d="M5 19c3-6 11-6 14 0"/><path d="M12 3v6"/><circle cx="12" cy="11" r="2"/></g></svg>); };
export const EchoIcon       = (p: IconProps) => { const {size,color,rest}=S(p); return (<svg width={size} height={size} viewBox="0 0 24 24" {...rest}><g fill="none" stroke={color} strokeWidth="2"><path d="M4 10v4l6 3V7z"/><path d="M14 9a6 6 0 010 6"/></g></svg>); };
export const ArchivistIcon  = (p: IconProps) => { const {size,color,rest}=S(p); return (<svg width={size} height={size} viewBox="0 0 24 24" {...rest}><g fill="none" stroke={color} strokeWidth="2"><rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 9h8M8 13h6"/></g></svg>); };
export const LedgerIcon     = (p: IconProps) => { const {size,color,rest}=S(p); return (<svg width={size} height={size} viewBox="0 0 24 24" {...rest}><g fill="none" stroke={color} strokeWidth="2"><path d="M4 4h12v16H4z"/><path d="M8 8h4M8 12h6M8 16h6"/></g></svg>); };
export const CounselorIcon  = (p: IconProps) => { const {size,color,rest}=S(p); return (<svg width={size} height={size} viewBox="0 0 24 24" {...rest}><g fill="none" stroke={color} strokeWidth="2"><path d="M12 4l7 4-7 4-7-4 7-4z"/><path d="M5 12v4a7 7 0 0014 0v-4"/></g></svg>); };
export const SentinelIcon   = (p: IconProps) => { const {size,color,rest}=S(p); return (<svg width={size} height={size} viewBox="0 0 24 24" {...rest}><g fill="none" stroke={color} strokeWidth="2"><path d="M12 3l8 4v5c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V7z"/></g></svg>); };
export const OptimizerIcon  = (p: IconProps) => { const {size,color,rest}=S(p); return (<svg width={size} height={size} viewBox="0 0 24 24" {...rest}><g fill="none" stroke={color} strokeWidth="2"><path d="M3 17l6-6 4 4 5-5"/><path d="M14 10h7v7"/></g></svg>); };
export const OrchestratorIcon = (p: IconProps) => { const {size,color,rest}=S(p); return (<svg width={size} height={size} viewBox="0 0 24 24" {...rest}><g fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 5v2M12 17v2M5 12h2M17 12h2M7 7l1.5 1.5M15.5 15.5L17 17M7 17l1.5-1.5M15.5 8.5L17 7"/></g></svg>); };

export function getAgentIcon(name?: string) {
  const m: Record<string, React.FC<IconProps>> = {
    Commander: CommanderIcon,
    Conductor: ConductorIcon,
    Connector: ConnectorIcon,
    Scout: ScoutIcon,
    Builder: BuilderIcon,
    Muse: MuseIcon,
    Echo: EchoIcon,
    Archivist: ArchivistIcon,
    Ledger: LedgerIcon,
    Counselor: CounselorIcon,
    Sentinel: SentinelIcon,
    Optimizer: OptimizerIcon,
    Orchestrator: OrchestratorIcon,
  };
  return m[name || ''] || CommanderIcon;
}

export default getAgentIcon;
