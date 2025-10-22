import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, X, ChevronDown, ChevronUp } from 'lucide-react';

export default function OnboardingChecklist({ userId }) {
  const [checklist, setChecklist] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the checklist
    const dismissed = localStorage.getItem(`onboarding_dismissed_${userId}`);
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Load checklist progress
    fetchChecklistProgress();
  }, [userId]);

  async function fetchChecklistProgress() {
    try {
      const response = await fetch(`/api/onboarding/checklist?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setChecklist(data);
        
        // Auto-dismiss if all complete
        if (data.completedCount === data.totalCount) {
          setTimeout(() => handleDismiss(), 3000);
        }
      }
    } catch (error) {
      console.error('Error fetching checklist:', error);
    }
  }

  function handleDismiss() {
    localStorage.setItem(`onboarding_dismissed_${userId}`, 'true');
    setIsDismissed(true);
  }

  if (isDismissed || !checklist) {
    return null;
  }

  const progress = (checklist.completedCount / checklist.totalCount) * 100;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md border border-blue-200 overflow-hidden">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Getting Started</h3>
              <p className="text-sm text-gray-600">
                {checklist.completedCount} of {checklist.totalCount} completed
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-600" />
              )}
            </button>
            <button
              onClick={handleDismiss}
              className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-blue-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Checklist Items */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-2">
          {checklist.items.map((item, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                item.completed
                  ? 'bg-white/50'
                  : 'bg-white hover:shadow-sm'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {item.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  item.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                }`}>
                  {item.title}
                </p>
                {!item.completed && item.description && (
                  <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                )}
                {!item.completed && item.action && (
                  <a
                    href={item.action.url}
                    className="inline-block mt-2 text-xs font-medium text-blue-600 hover:text-blue-700"
                  >
                    {item.action.label} →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Completion Message */}
      {progress === 100 && (
        <div className="px-4 pb-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
            <p className="text-sm font-medium text-green-800">
              🎉 Great job! You've completed the onboarding checklist.
            </p>
            <p className="text-xs text-green-600 mt-1">
              This message will auto-dismiss in a few seconds.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

