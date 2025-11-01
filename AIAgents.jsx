import { Link } from 'react-router-dom';
import { Bot, Brain, Lightbulb, Target, Wrench, Palette, Megaphone, Users, Archive, DollarSign, Scale, Shield, TrendingUp } from 'lucide-react';
import FadeInSection from './FadeInSection';

export default function AIAgents() {
  // All 13 specialized AI agents with icons, descriptions, and capabilities
  const agents = [
    {
      icon: <Target className="w-12 h-12" />,
      name: 'Chief of Staff',
      description: 'Strategic leadership and executive decision-making. Provides high-level oversight, aligns initiatives with business objectives, and drives long-term vision.',
      capabilities: [
        'Strategic planning',
        'Executive decisions',
        'Business alignment',
        'Vision & roadmap',
      ],
      color: '#FF6B6B',
    },
    {
      icon: <Brain className="w-12 h-12" />,
      name: 'Conductor',
      description: 'Operations management and task orchestration. Coordinates workflows, manages project timelines, and ensures smooth execution across teams.',
      capabilities: [
        'Project management',
        'Task coordination',
        'Timeline tracking',
        'Team orchestration',
      ],
      color: '#4ECDC4',
    },
    {
      icon: <Lightbulb className="w-12 h-12" />,
      name: 'Scout',
      description: 'Research and competitive intelligence. Discovers market trends, analyzes competitors, and provides data-driven insights for strategic advantage.',
      capabilities: [
        'Market research',
        'Competitive analysis',
        'Trend discovery',
        'Intelligence gathering',
      ],
      color: '#95E1D3',
    },
    {
      icon: <Wrench className="w-12 h-12" />,
      name: 'Builder',
      description: 'Technical development and engineering. Writes code, builds applications, and provides technical solutions for complex problems.',
      capabilities: [
        'Software development',
        'Code generation',
        'Technical architecture',
        'System integration',
      ],
      color: '#F38181',
    },
    {
      icon: <Palette className="w-12 h-12" />,
      name: 'Muse',
      description: 'Creative design and multimedia production. Creates visual content, designs interfaces, and produces engaging creative assets.',
      capabilities: [
        'Visual design',
        'UI/UX creation',
        'Brand identity',
        'Creative direction',
      ],
      color: '#AA96DA',
    },
    {
      icon: <Megaphone className="w-12 h-12" />,
      name: 'Echo',
      description: 'Marketing and communications. Crafts compelling messages, manages campaigns, and amplifies your brand voice across channels.',
      capabilities: [
        'Marketing campaigns',
        'Content creation',
        'Brand messaging',
        'Social media strategy',
      ],
      color: '#FCBAD3',
    },
    {
      icon: <Users className="w-12 h-12" />,
      name: 'Connector',
      description: 'Customer relations and support. Manages customer interactions, resolves issues, and builds strong relationships with stakeholders.',
      capabilities: [
        'Customer support',
        'Relationship management',
        'Issue resolution',
        'Stakeholder engagement',
      ],
      color: '#FFFFD2',
    },
    {
      icon: <Archive className="w-12 h-12" />,
      name: 'Archivist',
      description: 'Knowledge management and documentation. Organizes information, maintains records, and ensures easy access to institutional knowledge.',
      capabilities: [
        'Document management',
        'Knowledge organization',
        'Meeting summaries',
        'Information retrieval',
      ],
      color: '#A8D8EA',
    },
    {
      icon: <DollarSign className="w-12 h-12" />,
      name: 'Ledger',
      description: 'Financial operations and analysis. Tracks budgets, analyzes financial data, and provides insights for fiscal decision-making.',
      capabilities: [
        'Budget tracking',
        'Financial analysis',
        'Expense management',
        'Revenue forecasting',
      ],
      color: '#FFD93D',
    },
    {
      icon: <Scale className="w-12 h-12" />,
      name: 'Counselor',
      description: 'Legal and compliance guidance. Reviews contracts, ensures regulatory compliance, and provides risk mitigation strategies.',
      capabilities: [
        'Contract review',
        'Compliance monitoring',
        'Risk assessment',
        'Legal guidance',
      ],
      color: '#6BCB77',
    },
    {
      icon: <Shield className="w-12 h-12" />,
      name: 'Sentinel',
      description: 'Security and data protection. Monitors threats, ensures data privacy, and maintains robust security protocols.',
      capabilities: [
        'Security monitoring',
        'Threat detection',
        'Data protection',
        'Compliance auditing',
      ],
      color: '#4D96FF',
    },
    {
      icon: <TrendingUp className="w-12 h-12" />,
      name: 'Optimizer',
      description: 'Performance analytics and optimization. Analyzes metrics, identifies bottlenecks, and recommends improvements for maximum efficiency.',
      capabilities: [
        'Performance analysis',
        'Metric tracking',
        'Process optimization',
        'Efficiency insights',
      ],
      color: '#FF6B9D',
    },
    {
      icon: <Bot className="w-12 h-12" />,
      name: 'Orchestrator',
      description: 'Central intelligence hub. Routes requests to the right specialist, coordinates multi-agent workflows, and ensures seamless collaboration.',
      capabilities: [
        'Intelligent routing',
        'Agent coordination',
        'Workflow management',
        'Context synthesis',
      ],
      color: '#FFC96C',
    },
  ];

  return (
    <section className="relative w-full max-w-screen overflow-x-hidden px-4 py-16 sm:px-6">
      <FadeInSection>
        <div className="mb-12 text-center">
          <h2 className="h2 mb-4 font-bold uppercase tracking-tight text-[#F2F2F2]">
            AI-POWERED AGENTS
          </h2>
          <p className="mx-auto max-w-3xl text-[clamp(1rem,3.5vw,1.25rem)] text-[#B3B3B3] text-pretty">
            Thirteen specialized AI agents work together to enhance every aspect of your organization
          </p>
        </div>
      </FadeInSection>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {agents.map((agent, index) => (
          <FadeInSection key={agent.name} delay={0.05 * (index + 1)}>
            <div className="panel-system group flex h-full min-w-0 flex-col gap-4 p-6 transition-all duration-300 hover:bg-[#202020]">
              {/* Icon */}
              <div 
                className="transition-transform duration-300 group-hover:scale-110"
                style={{ color: agent.color }}
              >
                {agent.icon}
              </div>

              {/* Name */}
              <h3 className="h3 text-[#F2F2F2] uppercase tracking-tight">
                {agent.name}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed text-[#B3B3B3] text-pretty flex-grow">
                {agent.description}
              </p>

              {/* Capabilities */}
              <div className="space-y-2 text-pretty">
                <div className="text-xs font-semibold uppercase tracking-wide text-[#F2F2F2]">
                  Key Capabilities
                </div>
                <ul className="space-y-1">
                  {agent.capabilities.map((capability) => (
                    <li
                      key={capability}
                      className="flex items-start gap-2 text-xs text-[#B3B3B3]"
                    >
                      <span style={{ color: agent.color }}>▸</span>
                      {capability}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeInSection>
        ))}
      </div>

      {/* Additional Info */}
      <FadeInSection delay={0.6}>
        <div className="mx-auto mt-12 max-w-4xl">
          <div className="panel-system flex flex-col items-center gap-4 border border-[#FFC96C]/20 bg-[#1A1A1A] p-6 text-center sm:p-8">
            <div className="flex justify-center text-[#FFC96C]">
              <Bot className="h-8 w-8" />
            </div>
            <h4 className="h3 text-[#F2F2F2] uppercase tracking-tight">
              Synergistic Collaboration
            </h4>
            <p className="text-sm text-[#B3B3B3] text-pretty sm:text-base">
              Our AI agents work together seamlessly, coordinated by the Orchestrator to provide
              comprehensive solutions. They continuously learn from your organization's patterns,
              becoming more effective over time and adapting to your unique workflows.
            </p>
            <Link to="/login" className="btn-system">
              <Bot className="h-4 w-4" />
              View All Agents
            </Link>
          </div>
        </div>
      </FadeInSection>
    </section>
  );
}

