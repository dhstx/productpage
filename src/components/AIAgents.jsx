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
    <section className="container mx-auto px-6 py-16">
      <FadeInSection>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
            AI-POWERED AGENTS
          </h2>
          <p className="text-[#B3B3B3] text-lg max-w-3xl mx-auto">
            Three specialized AI agents work behind the scenes to enhance your organization's effectiveness
          </p>
        </div>
      </FadeInSection>

      <div className="grid md:grid-cols-3 gap-8">
        {agents.map((agent, index) => (
          <FadeInSection key={agent.name} delay={0.1 * (index + 1)}>
            <div className="panel-system p-8 h-full hover:bg-[#202020] transition-all duration-300 group">
              {/* Icon */}
              <div className="text-[#FFC96C] mb-6 transform group-hover:scale-110 transition-transform duration-300">
                {agent.icon}
              </div>

              {/* Name */}
              <h3 className="text-[#F2F2F2] text-xl font-bold mb-4 uppercase tracking-tight">
                {agent.name}
              </h3>

              {/* Description */}
              <p className="text-[#B3B3B3] mb-6 leading-relaxed">
                {agent.description}
              </p>

              {/* Capabilities */}
              <div className="space-y-2">
                <div className="text-[#F2F2F2] text-sm font-bold uppercase tracking-wide mb-3">
                  Key Capabilities
                </div>
                <ul className="space-y-2">
                  {agent.capabilities.map((capability) => (
                    <li
                      key={capability}
                      className="text-[#B3B3B3] text-sm flex items-start"
                    >
                      <span className="text-[#FFC96C] mr-2">▸</span>
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
        <div className="mt-12 panel-system p-8 bg-[#1A1A1A] border border-[#FFC96C]/20">
          <div className="flex items-start gap-4">
            <div className="text-[#FFC96C] mt-1">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-[#F2F2F2] font-bold mb-2 uppercase tracking-tight">
                Continuous Learning
              </h4>
              <p className="text-[#B3B3B3]">
                Our AI agents continuously learn from your organization's patterns and preferences, 
                becoming more effective over time. They adapt to your unique workflows and provide 
                increasingly personalized recommendations as they understand your needs better.
              </p>
            </div>
          </div>
        </div>
      </FadeInSection>
    </section>
  );
}
