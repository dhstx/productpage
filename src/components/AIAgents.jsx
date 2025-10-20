import { Link } from 'react-router-dom';
import { Bot, Brain, Lightbulb } from 'lucide-react';
import FadeInSection from './FadeInSection';

export default function AIAgents() {
  const agents = [
    {
      icon: <Bot className="w-12 h-12" />,
      name: 'Strategic Advisor',
      description: 'Analyzes your organization\'s initiatives and provides data-driven recommendations for strategic planning. Identifies high-impact opportunities and potential risks before they become problems.',
      capabilities: [
        'Initiative prioritization',
        'Risk assessment',
        'Resource allocation',
        'Timeline optimization',
      ],
    },
    {
      icon: <Brain className="w-12 h-12" />,
      name: 'Engagement Analyst',
      description: 'Monitors member participation patterns and suggests personalized engagement strategies. Predicts attendance trends and recommends optimal meeting times and formats.',
      capabilities: [
        'Participation tracking',
        'Engagement predictions',
        'Communication optimization',
        'Retention insights',
      ],
    },
    {
      icon: <Lightbulb className="w-12 h-12" />,
      name: 'Operations Assistant',
      description: 'Automates routine tasks and provides intelligent workflow suggestions. Learns from your organization\'s patterns to streamline processes and reduce administrative overhead.',
      capabilities: [
        'Task automation',
        'Workflow optimization',
        'Document generation',
        'Meeting summaries',
      ],
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
            Three specialized AI agents work behind the scenes to enhance your organization's effectiveness
          </p>
        </div>
      </FadeInSection>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent, index) => (
          <FadeInSection key={agent.name} delay={0.1 * (index + 1)}>
            <div className="panel-system group flex h-full min-w-0 flex-col gap-6 p-6 transition-all duration-300 hover:bg-[#202020]">
              {/* Icon */}
              <div className="text-[#FFC96C] transition-transform duration-300 group-hover:scale-110">
                {agent.icon}
              </div>

              {/* Name */}
              <h3 className="h3 text-[#F2F2F2] uppercase tracking-tight">
                {agent.name}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed text-[#B3B3B3] text-pretty">
                {agent.description}
              </p>

              {/* Capabilities */}
              <div className="space-y-3 text-pretty">
                <div className="text-xs font-semibold uppercase tracking-wide text-[#F2F2F2] sm:text-sm">
                  Key Capabilities
                </div>
                <ul className="space-y-2">
                  {agent.capabilities.map((capability) => (
                    <li
                      key={capability}
                      className="flex items-start gap-2 text-xs text-[#B3B3B3] sm:text-sm"
                    >
                      <span className="text-[#FFC96C]">▸</span>
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
      <FadeInSection delay={0.4}>
        <div className="mx-auto mt-12 max-w-4xl">
          <div className="panel-system flex flex-col items-center gap-4 border border-[#FFC96C]/20 bg-[#1A1A1A] p-6 text-center sm:p-8">
            <div className="flex justify-center text-[#FFC96C]">
              <Lightbulb className="h-6 w-6" />
            </div>
            <h4 className="h3 text-[#F2F2F2] uppercase tracking-tight">
              Continuous Learning
            </h4>
            <p className="text-sm text-[#B3B3B3] text-pretty sm:text-base">
              Our AI agents continuously learn from your organization's patterns and preferences,
              becoming more effective over time. They adapt to your unique workflows and provide
              increasingly personalized recommendations as they understand your needs better.
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
