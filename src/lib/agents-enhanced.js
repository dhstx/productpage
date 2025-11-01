// DHStx Enhanced AI Agents Configuration
// Version 2.0 - Production Ready
// Based on Notion Database + Google Drive Specifications

export const agents = [
  {
    id: 'orchestrator',
    name: 'Orchestrator',
    tagline: 'Your Intelligent Command Center',
    description: 'Central intelligence hub that analyzes your requests and coordinates the perfect team of specialists to deliver exceptional results',
    version: '2.0.0',
    status: 'active',
    tier: 'core',
    capabilities: [
      'Natural language understanding and intent classification',
      'Multi-agent workflow orchestration',
      'Session management and context preservation',
      'Real-time performance monitoring',
      'Adaptive routing based on agent availability',
      'Result aggregation and synthesis'
    ],
    useCase: 'Routes all requests to optimal agents, manages complex multi-agent workflows, maintains conversation context',
    workflows: ['Intent Analysis', 'Agent Routing', 'Session Management', 'Performance Monitoring'],
    voice: 'Professional, welcoming, and efficient',
    tone: 'Acts as your intelligent assistant, understanding context and anticipating needs',
    domain: 'Core System',
    icon: '🎯',
    color: '#6366f1', // Indigo
    integrations: ['OpenAI GPT-4', 'Anthropic Claude', 'Supabase', 'Redis'],
    metrics: {
      routingAccuracy: 98.5,
      responseTime: 0.18,
      uptime: 99.9,
      tasksCompleted: 25840
    }
  },
  {
    id: 'commander',
    name: 'Chief of Staff',
    tagline: 'Strategic Vision & Leadership',
    description: 'Executive-level strategic planning and multi-agent coordination for company-wide initiatives and high-stakes decisions',
    version: '2.0.0',
    status: 'active',
    tier: 'leadership',
    capabilities: [
      'Company-wide strategic planning and goal setting',
      'Cross-functional initiative coordination',
      'Executive decision support with data-driven insights',
      'Investor relations and stakeholder communication',
      'Business development opportunity identification',
      'Multi-agent team assembly and mission planning'
    ],
    useCase: 'Strategic planning, investor relations, business development, executive decisions, cross-department coordination',
    workflows: ['Strategic Planning', 'Investor Relations', 'Business Development', 'Crisis Management'],
    voice: 'Authoritative, visionary, and decisive',
    tone: 'Provides strategic direction with clear rationale and confidence',
    domain: 'Strategy & Leadership',
    icon: '👔',
    color: '#8b5cf6', // Purple
    integrations: ['Notion Strategic Plans', 'Tableau', 'Gmail API', 'Slack'],
    metrics: {
      initiativeSuccessRate: 87.2,
      stakeholderSatisfaction: 92.5,
      responseTime: 0.45,
      tasksCompleted: 3420
    }
  },
  {
    id: 'conductor',
    name: 'Conductor',
    tagline: 'Operational Excellence Manager',
    description: 'Orchestrates daily operations, manages tasks and schedules, and ensures smooth workflow execution across all projects',
    version: '2.0.0',
    status: 'active',
    tier: 'operations',
    capabilities: [
      'Daily task capture, prioritization, and assignment',
      'Meeting scheduling, agenda creation, and follow-up tracking',
      'Project timeline management with dependency mapping',
      'Resource allocation and workload balancing',
      'Deadline monitoring with proactive alerts',
      'Workflow automation and process optimization'
    ],
    useCase: 'Task management, meeting coordination, project tracking, resource planning, deadline management',
    workflows: ['Daily Operations', 'Meeting Management', 'Project Coordination', 'Resource Planning'],
    voice: 'Organized, efficient, and supportive',
    tone: 'Keeps operations running smoothly with gentle reminders and clear structure',
    domain: 'Operations & Project Management',
    icon: '📋',
    color: '#10b981', // Green
    integrations: ['Notion Tasks', 'Google Calendar', 'Asana', 'Slack'],
    metrics: {
      onTimeCompletion: 93.8,
      meetingEfficiency: 88.5,
      automationRate: 74.2,
      tasksCompleted: 18650
    }
  },
  {
    id: 'scout',
    name: 'Scout',
    tagline: 'Intelligence & Research Specialist',
    description: 'Conducts rapid research, competitive intelligence, and trend analysis to keep you informed and ahead of the market',
    version: '2.0.0',
    status: 'active',
    tier: 'specialist',
    capabilities: [
      'Rapid web research with source citation',
      'Competitive landscape analysis and monitoring',
      'Market trend identification and forecasting',
      'Technical research and feasibility studies',
      'Patent and IP landscape analysis',
      'Experimental AI model testing and evaluation'
    ],
    useCase: 'Market research, competitive intelligence, trend analysis, technical feasibility, patent research',
    workflows: ['Quick Research', 'Deep Dive Analysis', 'Competitive Monitoring', 'Trend Analysis'],
    voice: 'Analytical, objective, and insightful',
    tone: 'Presents data-driven findings with clear implications and recommendations',
    domain: 'Research & Intelligence',
    icon: '🔍',
    color: '#3b82f6', // Blue
    integrations: ['Google Search API', 'Perplexity AI', 'Crunchbase', 'Notion Research DB'],
    metrics: {
      researchAccuracy: 96.3,
      sourceQuality: 91.8,
      responseTime: 0.28,
      tasksCompleted: 12340
    }
  },
  {
    id: 'builder',
    name: 'Builder',
    tagline: 'Technical Development Lead',
    description: 'Full-stack development, infrastructure management, and technical implementation with a focus on quality and scalability',
    version: '2.0.0',
    status: 'active',
    tier: 'specialist',
    capabilities: [
      'Full-stack application development (React, Node.js, Python)',
      'Database design and optimization',
      'API development and integration',
      'CI/CD pipeline management',
      'Infrastructure as code (Terraform, Docker)',
      'Code review and quality assurance',
      'Technical documentation'
    ],
    useCase: 'Software development, API integration, infrastructure management, code review, technical documentation',
    workflows: ['Feature Development', 'Infrastructure Management', 'Technical Debt', 'Integration Projects'],
    voice: 'Technical, precise, and solution-oriented',
    tone: 'Explains complex concepts clearly and provides actionable recommendations',
    domain: 'Development & Infrastructure',
    icon: '⚙️',
    color: '#f59e0b', // Amber
    integrations: ['GitHub', 'Vercel', 'Supabase', 'Datadog', 'Sentry'],
    metrics: {
      codeQuality: 92.5,
      testCoverage: 84.7,
      deploymentSuccess: 98.2,
      tasksCompleted: 8920
    }
  },
  {
    id: 'muse',
    name: 'Muse',
    tagline: 'Creative Design Director',
    description: 'Brings ideas to life through stunning visual design, multimedia content, and brand experiences that captivate audiences',
    version: '2.0.0',
    status: 'active',
    tier: 'specialist',
    capabilities: [
      'Brand identity development and style guide creation',
      'Marketing collateral design (decks, graphics, infographics)',
      'Video content creation and editing',
      'UI/UX design for web and mobile applications',
      'Animation and motion graphics',
      'AI-powered image and video generation'
    ],
    useCase: 'Brand design, marketing graphics, video production, UI/UX design, presentation decks',
    workflows: ['Brand Development', 'Marketing Assets', 'Presentation Design', 'Video Production'],
    voice: 'Creative, inspiring, and collaborative',
    tone: 'Balances artistic vision with business objectives',
    domain: 'Creative & Design',
    icon: '🎨',
    color: '#ec4899', // Pink
    integrations: ['Figma', 'Midjourney', 'Runway ML', 'Adobe Creative Suite', 'Canva'],
    metrics: {
      approvalRate: 87.3,
      brandConsistency: 96.8,
      responseTime: 1.2,
      tasksCompleted: 6780
    }
  },
  {
    id: 'echo',
    name: 'Echo',
    tagline: 'Marketing & Communications Lead',
    description: 'Amplifies your brand through strategic marketing campaigns, compelling content, and data-driven audience engagement',
    version: '2.0.0',
    status: 'active',
    tier: 'specialist',
    capabilities: [
      'Multi-channel marketing campaign planning and execution',
      'Content marketing strategy and editorial calendar management',
      'Social media management and community engagement',
      'Email marketing automation and segmentation',
      'SEO/SEM optimization and performance tracking',
      'Marketing analytics and attribution modeling',
      'PR and media relations'
    ],
    useCase: 'Marketing campaigns, content strategy, social media, email marketing, SEO, brand communications',
    workflows: ['Campaign Management', 'Content Marketing', 'Social Media', 'Email Marketing'],
    voice: 'Engaging, persuasive, and brand-aligned',
    tone: 'Adapts based on channel and audience while maintaining brand consistency',
    domain: 'Marketing & Communications',
    icon: '📢',
    color: '#14b8a6', // Teal
    integrations: ['HubSpot', 'Mailchimp', 'Hootsuite', 'Google Analytics', 'SEMrush'],
    metrics: {
      campaignROI: 342.5,
      engagementRate: 6.8,
      leadGrowth: 18.3,
      tasksCompleted: 9560
    }
  },
  {
    id: 'connector',
    name: 'Connector',
    tagline: 'Client Relations Manager',
    description: 'Builds lasting relationships through exceptional customer service, proactive communication, and genuine care for client success',
    version: '2.0.0',
    status: 'active',
    tier: 'specialist',
    capabilities: [
      'Customer inquiry handling and response drafting',
      'Support ticket management and resolution tracking',
      'Call logging and follow-up coordination',
      'Customer feedback collection and analysis',
      'Relationship nurturing and upsell identification',
      'Onboarding and training coordination',
      'Escalation management'
    ],
    useCase: 'Customer support, client communication, relationship management, onboarding, feedback collection',
    workflows: ['Email Management', 'Support Tickets', 'Customer Success', 'Feedback Loop'],
    voice: 'Professional, empathetic, and solution-focused',
    tone: 'Builds trust and demonstrates genuine care for customer success',
    domain: 'Customer Relations',
    icon: '🤝',
    color: '#06b6d4', // Cyan
    integrations: ['Intercom', 'Zendesk', 'Gmail API', 'Supabase CRM', 'Slack'],
    metrics: {
      responseTime: 1.8,
      resolutionRate: 91.5,
      customerSatisfaction: 4.6,
      tasksCompleted: 15230
    }
  },
  {
    id: 'archivist',
    name: 'Archivist',
    tagline: 'Knowledge Management Specialist',
    description: 'Organizes, preserves, and surfaces institutional knowledge to ensure information is always accessible when you need it',
    version: '2.0.0',
    status: 'active',
    tier: 'specialist',
    capabilities: [
      'Standard Operating Procedure (SOP) creation and maintenance',
      'Meeting transcription and summarization',
      'Document organization and taxonomy management',
      'Knowledge base development and curation',
      'File storage and retrieval optimization',
      'Historical data preservation and archiving',
      'Semantic search and information discovery'
    ],
    useCase: 'Documentation, knowledge management, meeting notes, SOP creation, information retrieval',
    workflows: ['Meeting Documentation', 'SOP Management', 'Knowledge Curation', 'Archival'],
    voice: 'Systematic, precise, and helpful',
    tone: 'Organizes information logically and makes knowledge easily accessible',
    domain: 'Knowledge & Documentation',
    icon: '📚',
    color: '#84cc16', // Lime
    integrations: ['Notion Knowledge DB', 'Google Drive', 'Otter.ai', 'Algolia'],
    metrics: {
      documentationAccuracy: 98.7,
      searchRelevance: 92.3,
      completeness: 96.5,
      tasksCompleted: 11450
    }
  },
  {
    id: 'ledger',
    name: 'Ledger',
    tagline: 'Financial Operations Manager',
    description: 'Maintains financial health through meticulous tracking, accurate reporting, and strategic budget management',
    version: '2.0.0',
    status: 'active',
    tier: 'specialist',
    capabilities: [
      'Transaction tracking and categorization',
      'Invoice generation and accounts receivable management',
      'Expense management and approval workflows',
      'Budget planning and variance analysis',
      'Financial reporting (P&L, balance sheet, cash flow)',
      'Tax preparation support and compliance',
      'Financial forecasting and scenario modeling'
    ],
    useCase: 'Financial tracking, invoicing, expense management, budget planning, financial reporting',
    workflows: ['Transaction Management', 'Invoicing', 'Budget Management', 'Financial Reporting'],
    voice: 'Precise, compliance-focused, and trustworthy',
    tone: 'Handles financial matters with accuracy and confidentiality',
    domain: 'Finance & Accounting',
    icon: '💰',
    color: '#22c55e', // Green
    integrations: ['QuickBooks', 'Stripe', 'Plaid API', 'Notion Finance DB', 'Excel'],
    metrics: {
      reconciliationAccuracy: 99.6,
      collectionRate: 96.2,
      budgetVariance: 3.8,
      tasksCompleted: 7890
    }
  },
  {
    id: 'counselor',
    name: 'Counselor',
    tagline: 'Legal & Compliance Advisor',
    description: 'Provides expert legal guidance, ensures regulatory compliance, and protects your interests through proactive risk management',
    version: '2.0.0',
    status: 'active',
    tier: 'specialist',
    capabilities: [
      'Contract drafting, review, and negotiation support',
      'Compliance monitoring and regulatory updates',
      'Risk assessment and mitigation strategies',
      'Intellectual property protection (trademarks, patents, copyrights)',
      'Policy development (privacy, terms of service, employee handbook)',
      'Dispute resolution and legal research',
      'Vendor and partnership agreement management'
    ],
    useCase: 'Contract management, compliance monitoring, legal research, IP protection, policy development',
    workflows: ['Contract Management', 'Compliance Monitoring', 'Policy Development', 'Risk Assessment'],
    voice: 'Supportive, development-focused, and clear',
    tone: 'Explains legal concepts in accessible language while maintaining professional rigor',
    domain: 'Legal & Compliance',
    icon: '⚖️',
    color: '#a855f7', // Purple
    integrations: ['DocuSign', 'Notion Contracts DB', 'OneTrust', 'LexisNexis'],
    metrics: {
      contractTurnaround: 2.5,
      complianceAuditPass: 96.8,
      riskMitigation: 91.3,
      tasksCompleted: 4560
    }
  },
  {
    id: 'sentinel',
    name: 'Sentinel',
    tagline: 'Security & Compliance Guardian',
    description: 'Vigilantly protects your systems, data, and operations through proactive security monitoring and compliance enforcement',
    version: '2.0.0',
    status: 'active',
    tier: 'specialist',
    capabilities: [
      'Security monitoring and threat detection',
      'Vulnerability assessment and penetration testing',
      'Data privacy management (GDPR, CCPA, HIPAA)',
      'Access control and identity management',
      'Incident response and forensics',
      'Security policy enforcement',
      'Compliance auditing and reporting'
    ],
    useCase: 'Security monitoring, threat detection, vulnerability management, data privacy, incident response',
    workflows: ['Security Monitoring', 'Vulnerability Management', 'Compliance Auditing', 'Incident Response'],
    voice: 'Vigilant, protective, and compliance-oriented',
    tone: 'Balances security rigor with business enablement',
    domain: 'Security & Compliance',
    icon: '🛡️',
    color: '#ef4444', // Red
    integrations: ['Datadog Security', 'Snyk', 'Auth0', 'Vanta', 'AWS KMS'],
    metrics: {
      threatDetection: 99.2,
      meanTimeToDetect: 4.2,
      meanTimeToRespond: 12.5,
      tasksCompleted: 21340
    }
  },
  {
    id: 'optimizer',
    name: 'Optimizer',
    tagline: 'Performance Analytics Lead',
    description: 'Transforms data into actionable insights, driving continuous improvement through rigorous analysis and experimentation',
    version: '2.0.0',
    status: 'active',
    tier: 'specialist',
    capabilities: [
      'Business intelligence and data visualization',
      'KPI dashboard creation and monitoring',
      'A/B testing design and statistical analysis',
      'Conversion rate optimization (CRO)',
      'ROI assessment and attribution modeling',
      'Process efficiency analysis',
      'Predictive analytics and forecasting',
      'Causal inference and correlation analysis'
    ],
    useCase: 'Data analysis, performance monitoring, A/B testing, ROI assessment, process optimization',
    workflows: ['Performance Monitoring', 'Experimentation', 'Deep Analysis', 'Optimization'],
    voice: 'Data-driven, insight-focused, and objective',
    tone: 'Distinguishes correlation from causation and provides clear, actionable recommendations',
    domain: 'Analytics & Optimization',
    icon: '📈',
    color: '#f97316', // Orange
    integrations: ['Google Analytics', 'Mixpanel', 'Tableau', 'Optimizely', 'Python/R'],
    metrics: {
      analysisAccuracy: 96.8,
      insightActionability: 83.5,
      optimizationImpact: 24.7,
      tasksCompleted: 14560
    }
  }
];

// Helper functions
export function getAgentById(id) {
  return agents.find(agent => agent.id === id);
}

export function getActiveAgents() {
  return agents.filter(agent => agent.status === 'active');
}

export function getAgentsByDomain(domain) {
  return agents.filter(agent => agent.domain === domain);
}

export function getAgentsByTier(tier) {
  return agents.filter(agent => agent.tier === tier);
}

export function getAgentDomains() {
  return [...new Set(agents.map(agent => agent.domain))];
}

export function getAgentTiers() {
  return [...new Set(agents.map(agent => agent.tier))];
}

export function getAgentStats() {
  const totalTasks = agents.reduce((sum, agent) => sum + (agent.metrics?.tasksCompleted || 0), 0);
  const activeCount = getActiveAgents().length;
  
  return {
    totalAgents: agents.length,
    activeAgents: activeCount,
    totalTasks,
    domains: getAgentDomains().length,
    tiers: getAgentTiers().length
  };
}

// Orchestrator routing logic
export function routeRequest(userMessage, context = {}) {
  // This is a simplified routing logic - in production, this would use
  // a more sophisticated intent classification model
  
  const message = userMessage.toLowerCase();
  
  // Strategic/Executive keywords
  if (message.match(/strategy|strategic|vision|investor|stakeholder|executive|business development/i)) {
    return getAgentById('commander');
  }
  
  // Task/Project management keywords
  if (message.match(/task|schedule|meeting|deadline|project|timeline|coordinate/i)) {
    return getAgentById('conductor');
  }
  
  // Research keywords
  if (message.match(/research|competitive|market|trend|analyze|study|investigate/i)) {
    return getAgentById('scout');
  }
  
  // Development keywords
  if (message.match(/develop|code|build|api|infrastructure|deploy|technical/i)) {
    return getAgentById('builder');
  }
  
  // Design keywords
  if (message.match(/design|creative|visual|brand|video|graphic|ui|ux/i)) {
    return getAgentById('muse');
  }
  
  // Marketing keywords
  if (message.match(/marketing|campaign|social media|email|seo|content|pr/i)) {
    return getAgentById('echo');
  }
  
  // Customer keywords
  if (message.match(/customer|client|support|ticket|inquiry|feedback|relationship/i)) {
    return getAgentById('connector');
  }
  
  // Documentation keywords
  if (message.match(/document|sop|knowledge|archive|transcribe|meeting notes/i)) {
    return getAgentById('archivist');
  }
  
  // Financial keywords
  if (message.match(/financial|budget|invoice|expense|accounting|payment|tax/i)) {
    return getAgentById('ledger');
  }
  
  // Legal keywords
  if (message.match(/legal|contract|compliance|policy|intellectual property|trademark/i)) {
    return getAgentById('counselor');
  }
  
  // Security keywords
  if (message.match(/security|threat|vulnerability|privacy|incident|access control/i)) {
    return getAgentById('sentinel');
  }
  
  // Analytics keywords
  if (message.match(/analytics|performance|optimize|dashboard|kpi|a\/b test|data/i)) {
    return getAgentById('optimizer');
  }
  
  // Default to Orchestrator for complex or unclear requests
  return getAgentById('orchestrator');
}

// A2A Protocol message structure
export function createA2AMessage(fromAgent, toAgent, taskType, payload, priority = 'normal') {
  return {
    id: crypto.randomUUID(),
    from_agent: fromAgent,
    to_agent: toAgent,
    task_type: taskType,
    priority: priority,
    timestamp: new Date().toISOString(),
    context: {
      session_id: payload.session_id || null,
      user_id: payload.user_id || null,
      parent_task_id: payload.parent_task_id || null
    },
    payload: payload
  };
}

export default agents;

