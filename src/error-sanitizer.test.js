/**
 * Tests for Error Sanitizer Module
 * Ensures sensitive information is properly redacted from error messages
 */

const { sanitizeError, sanitizeErrorObject, SENSITIVE_KEYWORDS } = require('./error-sanitizer');
const { test, assertEqual, assertNotNull, printSummary } = require('./test-helpers');

console.log('Running Error Sanitizer Tests...\n');

// Test 1: Should redact password in error message
test('should redact error message containing "password"', () => {
  const error = new Error('Invalid password: mysecret123');
  const sanitized = sanitizeError(error);
  
  assertEqual(
    sanitized,
    'Error processing request (sensitive data redacted for security)',
    'Password should be redacted'
  );
});

// Test 2: Should redact API key in error message
test('should redact error message containing "apiKey"', () => {
  const error = 'Failed to authenticate with apiKey: sk_live_abc123';
  const sanitized = sanitizeError(error);
  
  assertEqual(
    sanitized,
    'Error processing request (sensitive data redacted for security)',
    'API key should be redacted'
  );
});

// Test 3: Should redact private key in error message
test('should redact error message containing "privateKey"', () => {
  const error = new Error('Invalid privateKey format: 0x123abc...');
  const sanitized = sanitizeError(error);
  
  assertEqual(
    sanitized,
    'Error processing request (sensitive data redacted for security)',
    'Private key should be redacted'
  );
});

// Test 4: Should redact secret in error message
test('should redact error message containing "secret"', () => {
  const error = 'Missing secret token for authentication';
  const sanitized = sanitizeError(error);
  
  assertEqual(
    sanitized,
    'Error processing request (sensitive data redacted for security)',
    'Secret should be redacted'
  );
});

// Test 5: Should NOT redact safe error messages
test('should not redact safe error messages', () => {
  const error = new Error('Network timeout after 30 seconds');
  const sanitized = sanitizeError(error);
  
  assertEqual(
    sanitized,
    'Network timeout after 30 seconds',
    'Safe error message should not be redacted'
  );
});

// Test 6: Should handle non-Error objects
test('should handle string error messages', () => {
  const error = 'Simple error message';
  const sanitized = sanitizeError(error);
  
  assertEqual(
    sanitized,
    'Simple error message',
    'String error should be handled'
  );
});

// Test 7: Should be case-insensitive
test('should redact regardless of case', () => {
  const error = new Error('Invalid PASSWORD provided');
  const sanitized = sanitizeError(error);
  
  assertEqual(
    sanitized,
    'Error processing request (sensitive data redacted for security)',
    'Should be case-insensitive'
  );
});

// Test 8: Should redact authorization header
test('should redact error message containing "authorization"', () => {
  const error = 'Missing Authorization header';
  const sanitized = sanitizeError(error);
  
  assertEqual(
    sanitized,
    'Error processing request (sensitive data redacted for security)',
    'Authorization should be redacted'
  );
});

// Test 9: Should redact bearer token
test('should redact error message containing "bearer"', () => {
  const error = new Error('Invalid Bearer token format');
  const sanitized = sanitizeError(error);
  
  assertEqual(
    sanitized,
    'Error processing request (sensitive data redacted for security)',
    'Bearer should be redacted'
  );
});

// Test 10: Should sanitize error objects
test('should sanitize error objects', () => {
  const error = new Error('Invalid password: test123');
  const sanitized = sanitizeErrorObject(error);
  
  assertNotNull(sanitized, 'Sanitized object should not be null');
  assertEqual(
    sanitized.message,
    'Error processing request (sensitive data redacted for security)',
    'Error object message should be redacted'
  );
  assertEqual(sanitized.name, 'Error', 'Error name should be preserved');
});

// Test 11: Should handle error objects with safe messages
test('should preserve safe error object messages', () => {
  const error = new Error('Connection timeout');
  const sanitized = sanitizeErrorObject(error);
  
  assertEqual(
    sanitized.message,
    'Connection timeout',
    'Safe error object message should not be redacted'
  );
});

// Test 12: Should handle non-Error objects in sanitizeErrorObject
test('should handle non-Error objects in sanitizeErrorObject', () => {
  const error = 'String error';
  const sanitized = sanitizeErrorObject(error);
  
  assertEqual(
    sanitized.message,
    'String error',
    'Should handle non-Error objects'
  );
  assertEqual(sanitized.stack, null, 'Stack should be null for non-Error objects');
});

// Test 13: Should redact stack trace if it contains sensitive data
test('should redact stack trace containing sensitive keywords', () => {
  const error = new Error('Test error');
  error.stack = 'Error: Invalid password at function1\n  at function2';
  const sanitized = sanitizeErrorObject(error);
  
  if (sanitized.stack && sanitized.stack.includes('password')) {
    throw new Error('Stack trace should be redacted when containing sensitive keywords');
  }
});

// Test 14: Should preserve safe stack traces
test('should preserve safe stack traces', () => {
  const error = new Error('Safe error');
  error.stack = 'Error: Safe error\n  at safeFunction (test.js:10:5)';
  const sanitized = sanitizeErrorObject(error);
  
  assertEqual(
    sanitized.stack,
    'Error: Safe error\n  at safeFunction (test.js:10:5)',
    'Safe stack trace should be preserved'
  );
});

// Test 15: Should check all sensitive keywords
test('should have comprehensive list of sensitive keywords', () => {
  const expectedKeywords = [
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
  
  // Verify all expected keywords are present
  for (const keyword of expectedKeywords) {
    if (!SENSITIVE_KEYWORDS.includes(keyword)) {
      throw new Error(`Missing sensitive keyword: ${keyword}`);
    }
  }
  
  if (SENSITIVE_KEYWORDS.length < expectedKeywords.length) {
    throw new Error('SENSITIVE_KEYWORDS list is incomplete');
  }
});

// Test 16: Should handle empty error messages
test('should handle empty error messages', () => {
  const error = '';
  const sanitized = sanitizeError(error);
  
  assertEqual(sanitized, '', 'Empty error should return empty string');
});

// Test 17: Should handle null/undefined gracefully
test('should handle null gracefully', () => {
  const error = null;
  const sanitized = sanitizeError(error);
  
  assertEqual(sanitized, 'null', 'Null should be converted to string');
});

// Test 18: Should redact credential
test('should redact error message containing "credential"', () => {
  const error = new Error('Invalid credentials provided');
  const sanitized = sanitizeError(error);
  
  assertEqual(
    sanitized,
    'Error processing request (sensitive data redacted for security)',
    'Credential should be redacted'
  );
});

// Summary
printSummary();
