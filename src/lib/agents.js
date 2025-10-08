// 12 AI Agents for DHStx Platform
// Based on Notion AI Agent Ecosystem

export const agents = [
  {
    id: 'commander',
    name: 'Commander',
    description: 'Strategic oversight and cross-department coordination',
    version: '3.1.0',
    status: 'active',
    tasks: 1547,
    accuracy: 96,
    responseTime: 1.4,
    uptime: 99.9,
    capabilities: [
      'Strategic planning',
      'Multi-agent coordination',
      'Executive decisions',
      'Business development',
      'Investor relations'
    ],
    useCase: 'Company-wide strategy, cross-department coordination, executive decisions',
    voice: 'Authoritative and visionary'
  },
  {
    id: 'counselor',
    name: 'Counselor',
    description: 'Legal guidance, compliance oversight, and risk management',
    version: '2.8.5',
    status: 'active',
    tasks: 892,
    accuracy: 98,
    responseTime: 1.1,
    uptime: 99.8,
    capabilities: [
      'Contract management',
      'Compliance oversight',
      'Risk assessment',
      'IP protection',
      'Policy development'
    ],
    useCase: 'Legal guidance, compliance, risk management, policy development',
    voice: 'Supportive and development-focused'
  },
  {
    id: 'connector',
    name: 'Connector',
    description: 'Public relations, marketing, and stakeholder communication',
    version: '2.9.2',
    status: 'active',
    tasks: 1203,
    accuracy: 94,
    responseTime: 0.9,
    uptime: 99.7,
    capabilities: [
      'Public relations',
      'Marketing strategy',
      'Stakeholder communication',
      'Brand management',
      'Content distribution'
    ],
    useCase: 'PR, marketing, stakeholder engagement, brand communication',
    voice: 'Engaging and relationship-focused'
  },
  {
    id: 'scout',
    name: 'Scout',
    description: 'External research and competitive intelligence',
    version: '3.0.1',
    status: 'active',
    tasks: 1678,
    accuracy: 95,
    responseTime: 1.3,
    uptime: 99.6,
    capabilities: [
      'Market research',
      'Competitive analysis',
      'Trend identification',
      'Data gathering',
      'Intelligence reporting'
    ],
    useCase: 'Research, trend reports, competitive intelligence, market analysis',
    voice: 'Analytical and data-driven'
  },
  {
    id: 'echo',
    name: 'Echo',
    description: 'Content creation, brand voice, and communication optimization',
    version: '2.7.8',
    status: 'active',
    tasks: 2134,
    accuracy: 93,
    responseTime: 0.8,
    uptime: 99.5,
    capabilities: [
      'Content creation',
      'Brand voice management',
      'Editorial tone',
      'Communication optimization',
      'Media labeling'
    ],
    useCase: 'Content creation, brand messaging, editorial management',
    voice: 'Creative and expressive'
  },
  {
    id: 'conductor',
    name: 'Conductor',
    description: 'Workflow orchestration and task coordination',
    version: '3.2.0',
    status: 'active',
    tasks: 1456,
    accuracy: 97,
    responseTime: 1.0,
    uptime: 99.9,
    capabilities: [
      'Workflow orchestration',
      'Task coordination',
      'Resource allocation',
      'Priority management',
      'Adaptive planning'
    ],
    useCase: 'Workflow management, task coordination, resource optimization',
    voice: 'Organized and systematic'
  },
  {
    id: 'optimizer',
    name: 'Optimizer',
    description: 'Performance analysis and process improvement',
    version: '2.9.7',
    status: 'active',
    tasks: 1089,
    accuracy: 96,
    responseTime: 1.2,
    uptime: 99.7,
    capabilities: [
      'Performance analysis',
      'Process optimization',
      'Causal analysis',
      'Efficiency improvement',
      'Data-driven insights'
    ],
    useCase: 'Performance optimization, process improvement, efficiency analysis',
    voice: 'Analytical and improvement-focused'
  },
  {
    id: 'ledger',
    name: 'Ledger',
    description: 'Financial management and institutional-grade accounting',
    version: '3.0.5',
    status: 'active',
    tasks: 967,
    accuracy: 99,
    responseTime: 1.1,
    uptime: 99.9,
    capabilities: [
      'Financial tracking',
      'Budget management',
      'Expense analysis',
      'Revenue forecasting',
      'Compliance reporting'
    ],
    useCase: 'Financial management, accounting, budget tracking, forecasting',
    voice: 'Precise and detail-oriented'
  },
  {
    id: 'sentinel',
    name: 'Sentinel',
    description: 'Security monitoring and threat detection',
    version: '3.1.2',
    status: 'active',
    tasks: 2345,
    accuracy: 98,
    responseTime: 0.6,
    uptime: 99.9,
    capabilities: [
      'Security monitoring',
      'Threat detection',
      'Vulnerability assessment',
      'Incident response',
      'Access control'
    ],
    useCase: 'Security monitoring, threat detection, incident response',
    voice: 'Vigilant and protective'
  },
  {
    id: 'builder',
    name: 'Builder',
    description: 'Development, deployment, and technical implementation',
    version: '2.8.9',
    status: 'active',
    tasks: 1234,
    accuracy: 95,
    responseTime: 1.5,
    uptime: 99.6,
    capabilities: [
      'Code development',
      'System deployment',
      'Technical implementation',
      'Infrastructure management',
      'DevOps automation'
    ],
    useCase: 'Development, deployment, technical implementation, DevOps',
    voice: 'Technical and solution-oriented'
  },
  {
    id: 'muse',
    name: 'Muse',
    description: 'Creative ideation and innovation facilitation',
    version: '2.6.4',
    status: 'active',
    tasks: 876,
    accuracy: 91,
    responseTime: 1.0,
    uptime: 99.4,
    capabilities: [
      'Creative ideation',
      'Innovation facilitation',
      'Design thinking',
      'Brainstorming',
      'Concept development'
    ],
    useCase: 'Creative projects, innovation, design thinking, ideation',
    voice: 'Imaginative and inspiring'
  },
  {
    id: 'archivist',
    name: 'Archivist',
    description: 'Knowledge management and information organization',
    version: '3.0.3',
    status: 'active',
    tasks: 1567,
    accuracy: 97,
    responseTime: 0.9,
    uptime: 99.8,
    capabilities: [
      'Knowledge management',
      'Information organization',
      'Document archiving',
      'Search optimization',
      'Data categorization'
    ],
    useCase: 'Knowledge management, documentation, information retrieval',
    voice: 'Organized and methodical'
  }
];

export function getAgentById(id) {
  return agents.find(agent => agent.id === id);
}

export function getActiveAgents() {
  return agents.filter(agent => agent.status === 'active');
}

export function getAgentStats() {
  const totalTasks = agents.reduce((sum, agent) => sum + agent.tasks, 0);
  const avgAccuracy = agents.reduce((sum, agent) => sum + agent.accuracy, 0) / agents.length;
  const activeCount = getActiveAgents().length;
  
  return {
    totalAgents: agents.length,
    activeAgents: activeCount,
    totalTasks,
    avgAccuracy: Math.round(avgAccuracy)
  };
}
