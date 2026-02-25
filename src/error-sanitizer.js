/**
 * Error Sanitizer Module
 * Provides utilities to sanitize error messages before logging
 * to prevent leakage of sensitive information like passwords, API keys, etc.
 * 
 * SECURITY: This module helps prevent clear-text logging of sensitive information
 */

/**
 * List of sensitive keywords that should trigger redaction
 * @private
 */
const SENSITIVE_KEYWORDS = [
  'password',
  'apikey',
  'api_key',
  'privatekey',
  'private_key',
  'secret',
  'token',
  'authorization',
  'bearer',
  'credential',
  'auth',
];

/**
 * Sanitizes error messages to prevent logging of sensitive information.
 * If the error message contains sensitive keywords, it returns a generic
 * message instead of the actual error details.
 * 
 * @param {Error|string} error - Error object or error message string
 * @returns {string} Sanitized error message safe for logging
 * 
 * @example
 * const error = new Error('Invalid password: mysecret123');
 * console.error(sanitizeError(error)); 
 * // Outputs: "Error processing request (sensitive data redacted for security)"
 * 
 * @example
 * const error = new Error('Network timeout');
 * console.error(sanitizeError(error));
 * // Outputs: "Network timeout" (no sensitive keywords detected)
 */
function sanitizeError(error) {
  // Convert error to string
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  // Convert to lowercase for case-insensitive matching
  const errorLower = errorMessage.toLowerCase();
  
  // Check if error message contains sensitive keywords
  for (const keyword of SENSITIVE_KEYWORDS) {
    if (errorLower.includes(keyword)) {
      // Return generic error message to avoid leaking sensitive data
      return 'Error processing request (sensitive data redacted for security)';
    }
  }
  
  // No sensitive keywords detected, return original message
  return errorMessage;
}

/**
 * Sanitizes a full error object for logging, preserving the stack trace
 * but redacting the message if it contains sensitive information.
 * 
 * @param {Error} error - Error object
 * @returns {object} Object with sanitized message and safe stack trace
 * 
 * @example
 * try {
 *   // some code
 * } catch (error) {
 *   const sanitized = sanitizeErrorObject(error);
 *   console.error('Error:', sanitized.message);
 *   console.error('Stack:', sanitized.stack);
 * }
 */
function sanitizeErrorObject(error) {
  if (!(error instanceof Error)) {
    return {
      message: sanitizeError(error),
      stack: null
    };
  }
  
  return {
    message: sanitizeError(error.message),
    name: error.name,
    // Stack trace typically doesn't contain sensitive data, but sanitize just in case
    stack: error.stack ? sanitizeStackTrace(error.stack) : null
  };
}

/**
 * Sanitizes stack trace to remove any sensitive information
 * @private
 * @param {string} stackTrace - Stack trace string
 * @returns {string} Sanitized stack trace
 */
function sanitizeStackTrace(stackTrace) {
  // For now, just check if stack contains sensitive keywords
  // In most cases, stack traces don't contain sensitive data
  const stackLower = stackTrace.toLowerCase();
  
  for (const keyword of SENSITIVE_KEYWORDS) {
    if (stackLower.includes(keyword)) {
      // If stack contains sensitive keywords, return generic message
      return '(Stack trace redacted for security)';
    }
  }
  
  return stackTrace;
}

module.exports = {
  sanitizeError,
  sanitizeErrorObject,
  SENSITIVE_KEYWORDS
};
