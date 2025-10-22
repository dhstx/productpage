import { useState } from 'react';
import { Book, MessageSquare, Zap, CreditCard, Users, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GettingStartedGuide({ onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: MessageSquare,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      title: 'Start Your First Conversation',
      description: 'Chat with our AI agents to get help with your tasks. Choose from 13 specialized agents.',
      tips: [
        'Start with the Orchestrator for general tasks',
        'Be specific in your questions for better responses',
        'You can switch agents mid-conversation',
      ],
      action: {
        label: 'Go to Agents',
        url: '/agents',
      },
    },
    {
      icon: Zap,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
      title: 'Understand Platform Tokens (PT)',
      description: 'PT is our usage currency. Core PT is for standard models, Advanced PT is for premium models.',
      tips: [
        'Your tier determines your monthly PT allocation',
        'Core PT: Standard AI responses (most tasks)',
        'Advanced PT: Premium models for complex work',
        'PT resets on your billing cycle date',
      ],
      action: {
        label: 'View PT Usage',
        url: '/billing',
      },
    },
    {
      icon: CreditCard,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
      title: 'Choose the Right Plan',
      description: 'Select a plan that matches your usage needs. You can upgrade or downgrade anytime.',
      tips: [
        'Free tier: 100 Core PT/month (great for trying out)',
        'Entry: $19/mo for regular users',
        'Pro: $49/mo for power users',
        'Business: $159/mo for teams',
      ],
      action: {
        label: 'View Pricing',
        url: '/pricing',
      },
    },
    {
      icon: Users,
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-100',
      title: 'Invite Your Team (Business+)',
      description: 'Collaborate with your team by sharing PT pools and chat history.',
      tips: [
        'Available on Business tier and above',
        'Share PT pool across team members',
        'Collaborate on conversations',
        'Manage team permissions',
      ],
      action: {
        label: 'Manage Team',
        url: '/team',
      },
    },
  ];

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg">
                <Book className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Getting Started Guide</h2>
                <p className="text-sm text-gray-600">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Progress Dots */}
          <div className="flex items-center gap-2 mt-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-blue-600'
                    : index < currentStep
                    ? 'bg-blue-300'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className={`flex items-center justify-center w-16 h-16 ${currentStepData.iconBg} rounded-lg mb-6 mx-auto`}>
            <Icon className={`h-8 w-8 ${currentStepData.iconColor}`} />
          </div>

          <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
            {currentStepData.title}
          </h3>

          <p className="text-gray-600 text-center mb-6">
            {currentStepData.description}
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Key Points:</h4>
            <ul className="space-y-2">
              {currentStepData.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {currentStepData.action && (
            <Link
              to={currentStepData.action.url}
              onClick={onClose}
              className="block w-full py-3 px-4 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {currentStepData.action.label}
            </Link>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <button
            onClick={onClose}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Skip for now
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Get Started!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

