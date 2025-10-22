import PropTypes from 'prop-types';

/**
 * LoadingState Component
 * Displays a loading spinner with optional message
 */
export default function LoadingState({ 
  message = 'Loading...', 
  size = 'medium',
  fullScreen = false 
}) {
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-2',
    large: 'h-12 w-12 border-4'
  };

  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50'
    : 'flex flex-col items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center">
        <div 
          className={`animate-spin rounded-full border-b-2 border-indigo-600 ${sizeClasses[size]}`}
          role="status"
          aria-label="Loading"
        ></div>
        {message && (
          <p className={`mt-4 text-gray-600 ${textSizeClasses[size]}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

LoadingState.propTypes = {
  message: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullScreen: PropTypes.bool
};

