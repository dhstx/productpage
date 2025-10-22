/**
 * Error handling utilities for the application
 * Provides consistent error handling and user-friendly messages
 */

/**
 * Custom API Error class
 */
export class APIError extends Error {
  constructor(message, status, details = {}) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      details: this.details,
      timestamp: this.timestamp
    };
  }
}

/**
 * Handle API errors and convert to APIError
 * @param {Error} error - The error to handle
 * @returns {APIError} - Standardized API error
 */
export function handleAPIError(error) {
  // Already an APIError
  if (error instanceof APIError) {
    return error;
  }

  // Axios/Fetch error with response
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || error.response.statusText || 'Server error';
    const details = error.response.data || {};
    
    return new APIError(message, status, details);
  }

  // Network error (no response)
  if (error.request) {
    return new APIError(
      'Network error - please check your connection',
      0,
      { type: 'network_error', request: error.request }
    );
  }

  // Other errors
  return new APIError(
    error.message || 'An unexpected error occurred',
    -1,
    { type: 'unknown_error', originalError: error }
  );
}

/**
 * Get user-friendly error message based on error status
 * @param {Error|APIError} error - The error to get message for
 * @returns {string} - User-friendly error message
 */
export function getUserFriendlyMessage(error) {
  const apiError = error instanceof APIError ? error : handleAPIError(error);

  // Custom messages based on status code
  const statusMessages = {
    0: 'Unable to connect. Please check your internet connection.',
    400: 'Invalid request. Please check your input and try again.',
    401: 'Please log in to continue.',
    403: 'You don\'t have permission to perform this action.',
    404: 'The requested resource was not found.',
    409: 'This action conflicts with existing data.',
    422: 'The data provided is invalid. Please check and try again.',
    429: 'Too many requests. Please wait a moment and try again.',
    500: 'Server error. Our team has been notified.',
    502: 'Service temporarily unavailable. Please try again shortly.',
    503: 'Service under maintenance. Please try again later.',
    504: 'Request timed out. Please try again.'
  };

  return statusMessages[apiError.status] || apiError.message || 'An unexpected error occurred';
}

/**
 * Log error to console (and potentially to monitoring service)
 * @param {Error|APIError} error - The error to log
 * @param {Object} context - Additional context about the error
 */
export function logError(error, context = {}) {
  const apiError = error instanceof APIError ? error : handleAPIError(error);
  
  const errorLog = {
    ...apiError.toJSON(),
    context,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    url: typeof window !== 'undefined' ? window.location.href : 'unknown'
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', errorLog);
  }

  // TODO: Send to monitoring service (Sentry, LogRocket, etc.)
  // Example: Sentry.captureException(error, { extra: errorLog });

  return errorLog;
}

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - The async function to retry
 * @param {number} maxRetries - Maximum number of retries (default: 3)
 * @param {number} baseDelay - Base delay in ms (default: 1000)
 * @returns {Promise} - Result of the function
 */
export async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on certain error codes
      const apiError = handleAPIError(error);
      const noRetryStatuses = [400, 401, 403, 404, 422];
      
      if (noRetryStatuses.includes(apiError.status)) {
        throw apiError;
      }

      // Don't retry if this was the last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      const jitter = Math.random() * 200; // Add jitter to prevent thundering herd
      
      await new Promise(resolve => setTimeout(resolve, delay + jitter));
    }
  }

  throw handleAPIError(lastError);
}

/**
 * Wrap an async function with error handling
 * @param {Function} fn - The async function to wrap
 * @param {Function} onError - Optional error handler
 * @returns {Function} - Wrapped function
 */
export function withErrorHandling(fn, onError = null) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      const apiError = handleAPIError(error);
      logError(apiError, { function: fn.name, args });

      if (onError) {
        return onError(apiError);
      }

      throw apiError;
    }
  };
}

/**
 * Check if error is a specific type
 * @param {Error} error - The error to check
 * @param {number} status - The status code to check for
 * @returns {boolean} - True if error matches status
 */
export function isErrorStatus(error, status) {
  const apiError = error instanceof APIError ? error : handleAPIError(error);
  return apiError.status === status;
}

/**
 * Check if error is a network error
 * @param {Error} error - The error to check
 * @returns {boolean} - True if network error
 */
export function isNetworkError(error) {
  return isErrorStatus(error, 0);
}

/**
 * Check if error is an authentication error
 * @param {Error} error - The error to check
 * @returns {boolean} - True if auth error
 */
export function isAuthError(error) {
  return isErrorStatus(error, 401) || isErrorStatus(error, 403);
}

/**
 * Check if error is a validation error
 * @param {Error} error - The error to check
 * @returns {boolean} - True if validation error
 */
export function isValidationError(error) {
  return isErrorStatus(error, 400) || isErrorStatus(error, 422);
}

/**
 * Check if error is a server error
 * @param {Error} error - The error to check
 * @returns {boolean} - True if server error
 */
export function isServerError(error) {
  const apiError = error instanceof APIError ? error : handleAPIError(error);
  return apiError.status >= 500 && apiError.status < 600;
}

export default {
  APIError,
  handleAPIError,
  getUserFriendlyMessage,
  logError,
  retryWithBackoff,
  withErrorHandling,
  isErrorStatus,
  isNetworkError,
  isAuthError,
  isValidationError,
  isServerError
};

