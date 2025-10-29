export type AgentFocus = { id: string; label: string; description?: string; defaultOn: boolean };
export type AgentProfile = {
  name: string;
  key: string; // stable key, lowercase
  icon: string; // icon key (matches getAgentIcon map)
  bio: string;
  focuses: AgentFocus[];
};

export const agents: AgentProfile[] = [
  {
    name: "Archivist",
    key: "archivist",
    icon: "Archivist",
    bio:
      "Syntek’s second brain. Archivist curates, structures, and preserves institutional knowledge so decisions, documents, and discussions remain traceable and findable. It enforces metadata and ownership, maintains communications logs, and surfaces relevant past context when it matters. The outcome is living knowledge that accelerates work, reduces repeated effort, and preserves rationale for future teams.",
    focuses: [
      { id: "briefs", label: "Brief Creation", description: "Compact, actionable summaries.", defaultOn: true },
      { id: "metadata", label: "Metadata Enforcement", description: "Ownership, tags, freshness.", defaultOn: true },
      { id: "comms-log", label: "Comms Log", description: "Persistent decision history.", defaultOn: true },
      { id: "retrieval", label: "Curation & Retrieval", description: "Surface the right past work.", defaultOn: true },
    ],
  },
  {
    name: "Builder",
    key: "builder",
    icon: "Builder",
    bio:
      "Principal software engineering agent. Builder designs, scaffolds, and ships production systems with policy-driven precision. It orchestrates the full lifecycle—from analysis and planning to automation, release, and verification—while coordinating with Sentinel and Optimizer for compliance and performance. The result is maintainable, audited, deployable software that turns intent into reality.",
    focuses: [
      { id: "code-quality", label: "Code Quality", description: "Readable, maintainable, standards-led.", defaultOn: true },
      { id: "speed", label: "Speed-to-Ship", description: "Ship fast without breaking safety.", defaultOn: true },
      { id: "tests", label: "Test Coverage", description: "Guardrails for regressions.", defaultOn: true },
      { id: "risk-aware", label: "Risk-Aware Changes", description: "Planful rollouts, safe diffs.", defaultOn: true },
    ],
  },
  {
    name: "Commander",
    key: "commander",
    icon: "Commander",
    bio:
      "Strategic architect of Syntek. Commander translates vision into structured systems of work—clarifying priorities, quantifying risks and rewards, and aligning people and roles. It turns abstraction into direction, and direction into coordinated action with measurable outcomes.",
    focuses: [
      { id: "roi-priority", label: "ROI Priority", description: "Maximize value vs. effort.", defaultOn: true },
      { id: "horizon", label: "Time Horizon", description: "Near-term vs. long-term balance.", defaultOn: true },
      { id: "risk", label: "Risk Appetite", description: "Bounded, explicit tradeoffs.", defaultOn: true },
      { id: "staffing", label: "Staffing Rigor", description: "Fit roles to roadmap.", defaultOn: true },
    ],
  },
  {
    name: "Conductor",
    key: "conductor",
    icon: "Conductor",
    bio:
      "Operational orchestrator. Conductor converts strategy into structured project plans, tracks owners and dependencies, and keeps progress synchronized. It maintains transparent schedules, metrics, and change logs so execution remains aligned, predictable, and accountable.",
    focuses: [
      { id: "strategy-to-action", label: "Strategy → Action", description: "Clear, trackable objectives.", defaultOn: true },
      { id: "project-mgmt", label: "Project Management", description: "Plans, metrics, milestones.", defaultOn: true },
      { id: "ownership", label: "Task & Owner Mgmt", description: "Responsibilities and deps.", defaultOn: true },
      { id: "reporting", label: "Progress Reporting", description: "Summaries and schedules.", defaultOn: true },
    ],
  },
  {
    name: "Connector",
    key: "connector",
    icon: "Connector",
    bio:
      "Systems integration specialist. Connector makes APIs, webhooks, and agents interoperate securely. It authenticates events, manages credentials and permissions, and maintains traceability so data flows reliably across systems without compromising security.",
    focuses: [
      { id: "integration", label: "Integration Setup", description: "Safe, stepwise connections.", defaultOn: true },
      { id: "event-verification", label: "Event Verification", description: "Authenticated, trustworthy feeds.", defaultOn: true },
      { id: "resource", label: "Resource Management", description: "Credentials and endpoints.", defaultOn: true },
      { id: "security", label: "Security Stewardship", description: "Encrypted, compliant flows.", defaultOn: true },
    ],
  },
  {
    name: "Counselor",
    key: "counselor",
    icon: "Counselor",
    bio:
      "Legal and compliance oversight. Counselor evaluates open-source licensing, verifies AI and data practices against GDPR/CCPA, and prepares clear disclosures. It acts as a gatekeeper with pass/fail decisions and practical remediation guidance to keep work lawful and trusted.",
    focuses: [
      { id: "oss-licenses", label: "License Policy", description: "Compatibility and obligations.", defaultOn: true },
      { id: "ai-compliance", label: "AI & Data Compliance", description: "GDPR/CCPA alignment.", defaultOn: true },
      { id: "disclosure", label: "Disclosure & Transparency", description: "Clear user comms.", defaultOn: true },
      { id: "gatekeeping", label: "Compliance Gatekeeping", description: "Verdicts with fixes.", defaultOn: true },
    ],
  },
  {
    name: "Echo",
    key: "echo",
    icon: "Echo",
    bio:
      "Communications and launch operations. Echo shapes value propositions, synchronizes creative and technical assets, maps channels, and tracks campaign performance. Its mission is consistent, resonant messaging that reaches the right audience at the right time.",
    focuses: [
      { id: "messaging", label: "Message Development", description: "Positioning and value props.", defaultOn: true },
      { id: "assets", label: "Asset Coordination", description: "Creative + technical sync.", defaultOn: true },
      { id: "channels", label: "Channel Mapping", description: "Right story, right place.", defaultOn: true },
      { id: "tracking", label: "Performance Tracking", description: "Metrics and loops.", defaultOn: true },
    ],
  },
  {
    name: "Ledger",
    key: "ledger",
    icon: "Ledger",
    bio:
      "Financial intelligence. Ledger analyzes cost behavior across infrastructure and AI workloads, issues budget alerts, and links spending impact to engineering actions. It syncs with finance systems to keep innovation sustainable and decisions financially informed.",
    focuses: [
      { id: "tco", label: "TCO Tracking", description: "Live cost visibility.", defaultOn: true },
      { id: "alerts", label: "Budget Alerts", description: "Thresholds and notices.", defaultOn: true },
      { id: "pr-cost", label: "PR Cost Notes", description: "Change impact context.", defaultOn: true },
      { id: "finance-sync", label: "Finance Sync", description: "Stripe/Mercury links.", defaultOn: true },
    ],
  },
  {
    name: "Muse",
    key: "muse",
    icon: "Muse",
    bio:
      "Design and brand systems agent. Muse turns specs into accessible, content-first artifacts and component lists ready for development. It leads with clarity, WCAG compliance, and cohesive language so experiences feel human and on-brand.",
    focuses: [
      { id: "wireframes", label: "Wireframes & Assets", description: "Content-first outputs.", defaultOn: true },
      { id: "components", label: "Component Listing", description: "States and variants.", defaultOn: true },
      { id: "a11y", label: "Accessibility First", description: "WCAG baked in.", defaultOn: true },
      { id: "copy", label: "Copy & Microcopy", description: "Clear, concise language.", defaultOn: true },
    ],
  },
  {
    name: "Optimizer",
    key: "optimizer",
    icon: "Optimizer",
    bio:
      "Experimental design and decision intelligence. Optimizer defines metrics, designs rigorous experiments, analyzes results, and records learnings. It reduces risk by turning data into decisions and building cumulative organizational knowledge.",
    focuses: [
      { id: "experiments", label: "Experimental Design", description: "A/B and multivariate.", defaultOn: true },
      { id: "metrics", label: "Metric Definition", description: "Primary and guardrails.", defaultOn: true },
      { id: "analysis", label: "Analysis & Decisions", description: "Scale vs. rollback.", defaultOn: true },
      { id: "knowledge", label: "Knowledge Graph", description: "Record outcomes.", defaultOn: true },
    ],
  },
  {
    name: "Scout",
    key: "scout",
    icon: "Scout",
    bio:
      "Research and technical intelligence. Scout evaluates SDKs, APIs, and models, compares vendors, and produces concise due-diligence summaries. It supports quick proofs of concept and decision trees while keeping findings traceable.",
    focuses: [
      { id: "due-diligence", label: "Technical Diligence", description: "SDK/API comparisons.", defaultOn: true },
      { id: "research", label: "Research & Validation", description: "Landscape scans, risk.", defaultOn: true },
      { id: "enablement", label: "Dev Enablement", description: "PoC snippets.", defaultOn: true },
      { id: "docs", label: "Documentation", description: "Transparent archive.", defaultOn: true },
    ],
  },
  {
    name: "Sentinel",
    key: "sentinel",
    icon: "Sentinel",
    bio:
      "Security and compliance enforcement. Sentinel scans for secrets and PHI/PII, enforces license policies, and assesses dependency risk before anything reaches production. It safeguards trust so velocity never compromises security.",
    focuses: [
      { id: "secrets", label: "Secrets Scanning", description: "Detect exposed credentials.", defaultOn: true },
      { id: "license", label: "License Policy", description: "Approve safe deps.", defaultOn: true },
      { id: "phi-pii", label: "PHI/PII Guard", description: "Classify sensitive data.", defaultOn: true },
      { id: "cve", label: "CVE Gate", description: "Block risky versions.", defaultOn: true },
    ],
  },
  
];

// Export as a map for quick access and stable ordering by name
export const agentsByKey: Record<string, AgentProfile> = Object.fromEntries(
  agents.map((a) => [a.key, a])
);

export function getAllAgentsSorted(): AgentProfile[] {
  return [...agents].sort((a, b) => a.name.localeCompare(b.name));
}
