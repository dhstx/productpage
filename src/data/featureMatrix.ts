export type Tier = "Starter" | "Pro" | "Enterprise";
export type FeatureRow = {
  id: string;
  name: string;
  section: "Core" | "Advanced" | "Security" | "Support";
  icon?: string;
  notes?: Partial<Record<Tier, string>>;
  available: Record<Tier, boolean | "value">;
};

export const TIERS: Tier[] = ["Starter", "Pro", "Enterprise"];

export const FEATURES: FeatureRow[] = [
  { id:"strategic-planning", name:"Strategic Planning & Tracking", section:"Core",
    available:{ Starter:true, Pro:true, Enterprise:true } },
  { id:"member-db", name:"Member Database", section:"Core",
    available:{ Starter:true, Pro:true, Enterprise:true } },
  { id:"event-mgmt", name:"Event Management & Calendar", section:"Core",
    available:{ Starter:true, Pro:true, Enterprise:true } },
  { id:"doc-storage", name:"Document Storage", section:"Core",
    available:{ Starter:"value", Pro:"value", Enterprise:"value" },
    notes:{ Starter:"5 GB", Pro:"50 GB", Enterprise:"Unlimited" } },
  { id:"seats", name:"User Seats", section:"Core",
    available:{ Starter:"value", Pro:"value", Enterprise:"value" },
    notes:{ Starter:"25", Pro:"50", Enterprise:"Unlimited" } },
  // Advanced
  { id:"ai-insights", name:"AI-Powered Insights", section:"Advanced",
    available:{ Starter:false, Pro:true, Enterprise:true } },
  { id:"custom-branding", name:"Custom Branding", section:"Advanced",
    available:{ Starter:false, Pro:true, Enterprise:true } },
  { id:"analytics", name:"Advanced Analytics & Reports", section:"Advanced",
    available:{ Starter:false, Pro:true, Enterprise:true } },
  { id:"api", name:"API Access", section:"Advanced",
    available:{ Starter:false, Pro:false, Enterprise:true } },
  { id:"whitelabel", name:"White-Label Solution", section:"Advanced",
    available:{ Starter:false, Pro:false, Enterprise:true } },
  { id:"custom-integrations", name:"Custom Integrations", section:"Advanced",
    available:{ Starter:false, Pro:false, Enterprise:true } },
  // Security
  { id:"enc", name:"256-bit Encryption", section:"Security",
    available:{ Starter:true, Pro:true, Enterprise:true } },
  { id:"sso", name:"SSO/SAML Integration", section:"Security",
    available:{ Starter:false, Pro:true, Enterprise:true } },
  { id:"rbac", name:"Role-Based Access Control", section:"Security",
    available:{ Starter:"value", Pro:"value", Enterprise:"value" },
    notes:{ Starter:"Basic", Pro:"Advanced", Enterprise:"Enterprise" } },
  { id:"audit", name:"Audit Logs", section:"Security",
    available:{ Starter:false, Pro:true, Enterprise:true } },
  { id:"policies", name:"Custom Security Policies", section:"Security",
    available:{ Starter:false, Pro:false, Enterprise:true } },
  // Support
  { id:"email-support", name:"Email Support", section:"Support",
    available:{ Starter:true, Pro:true, Enterprise:true } },
  { id:"priority-support", name:"Priority Support", section:"Support",
    available:{ Starter:false, Pro:true, Enterprise:true } },
  { id:"phone-support", name:"Phone Support", section:"Support",
    available:{ Starter:false, Pro:false, Enterprise:true } },
  { id:"account-manager", name:"Dedicated Account Manager", section:"Support",
    available:{ Starter:false, Pro:false, Enterprise:true } },
  { id:"custom-training", name:"Custom Training", section:"Support",
    available:{ Starter:false, Pro:false, Enterprise:true } },
];
