/**
 * Test suite for Etherscan Contract Verification Module
 */

const EtherscanVerifier = require('./etherscan-verify');

console.log('🧪 Running Etherscan Verifier Tests\n');
console.log('='.repeat(70));

let passed = 0;
let failed = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`✓ ${description}`);
    passed++;
  } catch (error) {
    console.log(`✗ ${description}`);
    console.log(`  Error: ${error.message}`);
    failed++;
  }
}

// Test 1: Constructor - Create instance without API key
test('Constructor: Should create instance without API key', () => {
  const verifier = new EtherscanVerifier();
  if (!verifier) {
    throw new Error('Failed to create verifier instance');
  }
});

// Test 2: Constructor - Create instance with API key and chain ID
test('Constructor: Should create instance with API key and chain ID', () => {
  const verifier = new EtherscanVerifier('test-api-key', 1);
  if (!verifier || !verifier.apiKey || verifier.chainId !== 1) {
    throw new Error('Failed to create verifier with API key and chain ID');
  }
});

// Test 3: Chain ID mapping - Ethereum mainnet
test('Chain ID mapping: Should use correct API URL for Ethereum mainnet', () => {
  const verifier = new EtherscanVerifier('test-key', 1);
  if (verifier.apiBaseUrl !== 'api.etherscan.io') {
    throw new Error(`Expected api.etherscan.io, got ${verifier.apiBaseUrl}`);
  }
});

// Test 4: Chain ID mapping - Base
test('Chain ID mapping: Should use correct API URL for Base', () => {
  const verifier = new EtherscanVerifier('test-key', 8453);
  if (verifier.apiBaseUrl !== 'api.basescan.org') {
    throw new Error(`Expected api.basescan.org, got ${verifier.apiBaseUrl}`);
  }
});

// Test 5: Chain ID mapping - Polygon
test('Chain ID mapping: Should use correct API URL for Polygon', () => {
  const verifier = new EtherscanVerifier('test-key', 137);
  if (verifier.apiBaseUrl !== 'api.polygonscan.com') {
    throw new Error(`Expected api.polygonscan.com, got ${verifier.apiBaseUrl}`);
  }
});

// Test 6: Address validation - Valid address with 0x
test('Address validation: Should validate address with 0x prefix', () => {
  const verifier = new EtherscanVerifier();
  const validated = verifier.validateAddress('0x1234567890123456789012345678901234567890');
  if (validated !== '0x1234567890123456789012345678901234567890') {
    throw new Error('Address validation failed');
  }
});

// Test 7: Address validation - Valid address without 0x
test('Address validation: Should validate address without 0x prefix', () => {
  const verifier = new EtherscanVerifier();
  const validated = verifier.validateAddress('1234567890123456789012345678901234567890');
  if (validated !== '0x1234567890123456789012345678901234567890') {
    throw new Error('Address validation failed');
  }
});

// Test 8: Address validation - Invalid address (too short)
test('Address validation: Should reject address that is too short', () => {
  const verifier = new EtherscanVerifier();
  try {
    verifier.validateAddress('0x123');
    throw new Error('Should have thrown error for short address');
  } catch (error) {
    if (!error.message.includes('Invalid')) {
      throw error;
    }
  }
});

// Test 9: Address validation - Invalid address (not hex)
test('Address validation: Should reject address with non-hex characters', () => {
  const verifier = new EtherscanVerifier();
  try {
    verifier.validateAddress('0xGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG');
    throw new Error('Should have thrown error for non-hex address');
  } catch (error) {
    if (!error.message.includes('Invalid')) {
      throw error;
    }
  }
});

// Test 10: Address validation - Empty address
test('Address validation: Should reject empty address', () => {
  const verifier = new EtherscanVerifier();
  try {
    verifier.validateAddress('');
    throw new Error('Should have thrown error for empty address');
  } catch (error) {
    if (!error.message.includes('non-empty')) {
      throw error;
    }
  }
});

// Test 11: Constructor arguments encoding - Single address
test('Constructor arguments encoding: Should encode single address', () => {
  const encoded = EtherscanVerifier.encodeConstructorArguments(
    ['address'],
    ['0x1234567890123456789012345678901234567890']
  );
  if (!encoded || encoded.length !== 64) {
    throw new Error('Failed to encode address correctly');
  }
  if (!encoded.includes('1234567890123456789012345678901234567890')) {
    throw new Error('Encoded address does not contain expected value');
  }
});

// Test 12: Constructor arguments encoding - Single uint256
test('Constructor arguments encoding: Should encode single uint256', () => {
  const encoded = EtherscanVerifier.encodeConstructorArguments(
    ['uint256'],
    ['1000']
  );
  if (!encoded || encoded.length !== 64) {
    throw new Error('Failed to encode uint256 correctly');
  }
});

// Test 13: Constructor arguments encoding - Boolean
test('Constructor arguments encoding: Should encode boolean', () => {
  const encoded = EtherscanVerifier.encodeConstructorArguments(
    ['bool'],
    [true]
  );
  if (!encoded || encoded.length !== 64) {
    throw new Error('Failed to encode boolean correctly');
  }
});

// Test 14: Constructor arguments encoding - Multiple parameters
test('Constructor arguments encoding: Should encode multiple parameters', () => {
  const encoded = EtherscanVerifier.encodeConstructorArguments(
    ['address', 'uint256'],
    ['0x1234567890123456789012345678901234567890', '100']
  );
  if (!encoded || encoded.length !== 128) {
    throw new Error('Failed to encode multiple parameters correctly');
  }
});

// Test 15: Constructor arguments encoding - Mismatched arrays
test('Constructor arguments encoding: Should reject mismatched arrays', () => {
  try {
    EtherscanVerifier.encodeConstructorArguments(
      ['address', 'uint256'],
      ['0x1234567890123456789012345678901234567890']
    );
    throw new Error('Should have thrown error for mismatched arrays');
  } catch (error) {
    if (!error.message.includes('same length')) {
      throw error;
    }
  }
});

// Test 16: API key info - Without key
test('API key info: Should report no API key', () => {
  const verifier = new EtherscanVerifier();
  const info = verifier.getAPIKeyInfo();
  if (info.hasApiKey) {
    throw new Error('Should report no API key');
  }
});

// Test 17: API key info - With key
test('API key info: Should report API key present', () => {
  const verifier = new EtherscanVerifier('test-api-key-123456');
  const info = verifier.getAPIKeyInfo();
  if (!info.hasApiKey) {
    throw new Error('Should report API key present');
  }
  if (info.keyLength !== 19) {
    throw new Error('Key length should be 19');
  }
});

// Test 18: API key info - Should not reveal full key
test('API key info: Should not reveal full API key', () => {
  const apiKey = 'test-api-key-123456';
  const verifier = new EtherscanVerifier(apiKey);
  const info = verifier.getAPIKeyInfo();
  if (info.keyPreview === apiKey) {
    throw new Error('API key should not be fully revealed');
  }
  if (!info.keyPreview.includes('...')) {
    throw new Error('Key preview should be redacted');
  }
});

// Test 19: API configuration
test('API configuration: Should return correct API info', () => {
  const verifier = new EtherscanVerifier('test-key', 137);
  const info = verifier.getAPIInfo();
  if (info.chainId !== 137) {
    throw new Error('Chain ID mismatch');
  }
  if (info.baseUrl !== 'api.polygonscan.com') {
    throw new Error('Base URL mismatch');
  }
  if (!info.hasApiKey) {
    throw new Error('Should report API key present');
  }
});

// Test 20: Cache management
test('Cache management: Should initialize cache', () => {
  const verifier = new EtherscanVerifier();
  const stats = verifier.getCacheStats();
  if (stats.size !== 0) {
    throw new Error('Cache should be empty initially');
  }
  if (!stats.timeout) {
    throw new Error('Cache timeout should be set');
  }
});

// Test 21: Cache management - Clear cache
test('Cache management: Should clear cache', () => {
  const verifier = new EtherscanVerifier();
  verifier.clearCache();
  const stats = verifier.getCacheStats();
  if (stats.size !== 0) {
    throw new Error('Cache should be empty after clear');
  }
});

// Test 22: Verify contract validation - Missing API key
test('Verify contract validation: Should reject verification without API key', async () => {
  const verifier = new EtherscanVerifier();
  try {
    await verifier.verifyContract({
      contractAddress: '0x1234567890123456789012345678901234567890',
      sourceCode: 'contract Test {}',
      contractName: 'Test',
      compilerVersion: 'v0.8.20'
    });
    throw new Error('Should have thrown error for missing API key');
  } catch (error) {
    if (!error.message.includes('API key')) {
      throw error;
    }
  }
});

// Test 23: Verify contract validation - Missing required fields
test('Verify contract validation: Should reject verification with missing fields', async () => {
  const verifier = new EtherscanVerifier('test-key');
  try {
    await verifier.verifyContract({
      contractAddress: '0x1234567890123456789012345678901234567890'
    });
    throw new Error('Should have thrown error for missing required fields');
  } catch (error) {
    if (!error.message.includes('Missing required fields')) {
      throw error;
    }
  }
});

// Test 24: Check verification status - Invalid GUID
test('Check verification status: Should reject invalid GUID', async () => {
  const verifier = new EtherscanVerifier('test-key');
  try {
    await verifier.checkVerificationStatus('');
    throw new Error('Should have thrown error for empty GUID');
  } catch (error) {
    if (!error.message.includes('GUID')) {
      throw error;
    }
  }
});

// Test 25: Bytecode verification validation - Invalid bytecode format
test('Bytecode verification: Should reject invalid bytecode format', async () => {
  const verifier = new EtherscanVerifier('test-key');
  try {
    await verifier.verifyBytecode(
      '0x1234567890123456789012345678901234567890',
      'GGGGGGGG'
    );
    throw new Error('Should have thrown error for invalid bytecode');
  } catch (error) {
    if (!error.message.includes('Invalid bytecode')) {
      throw error;
    }
  }
});

// Test 26: Format verification result
test('Format verification result: Should format result correctly', () => {
  const verifier = new EtherscanVerifier();
  const result = {
    contractAddress: '0x1234567890123456789012345678901234567890',
    chainId: 1,
    status: 'success',
    message: 'Verification submitted',
    guid: 'test-guid-123'
  };
  const formatted = verifier.formatVerificationResult(result);
  if (!formatted.includes('0x1234567890123456789012345678901234567890')) {
    throw new Error('Formatted result should include address');
  }
  if (!formatted.includes('test-guid-123')) {
    throw new Error('Formatted result should include GUID');
  }
});

// Test 27: Environment variable loading
test('Environment variable loading: Should load API key from env', () => {
  // Set environment variable
  process.env.ETHERSCAN_API_KEY = 'env-test-key';
  const verifier = new EtherscanVerifier();
  if (!verifier.apiKey) {
    throw new Error('Should load API key from environment');
  }
  // Clean up
  delete process.env.ETHERSCAN_API_KEY;
});

// Test 28: Security - API key redaction
test('Security: Should redact API key in info methods', () => {
  const apiKey = 'my-secret-api-key-that-should-not-be-revealed';
  const verifier = new EtherscanVerifier(apiKey);
  const info = verifier.getAPIKeyInfo();
  
  // Ensure full key is not in the output
  if (JSON.stringify(info).includes(apiKey)) {
    throw new Error('Full API key should not be in info output');
  }
  
  // Ensure preview is redacted
  if (!info.keyPreview.includes('...')) {
    throw new Error('Key preview should be redacted');
  }
});

// Test 29: Multiple chain support
test('Multiple chain support: Should support various chains', () => {
  const chains = [
    { id: 1, url: 'api.etherscan.io' },
    { id: 56, url: 'api.bscscan.com' },
    { id: 137, url: 'api.polygonscan.com' },
    { id: 8453, url: 'api.basescan.org' },
    { id: 42161, url: 'api.arbiscan.io' },
    { id: 10, url: 'api-optimistic.etherscan.io' }
  ];
  
  for (const chain of chains) {
    const verifier = new EtherscanVerifier('test', chain.id);
    if (verifier.apiBaseUrl !== chain.url) {
      throw new Error(`Chain ${chain.id} should use ${chain.url}, got ${verifier.apiBaseUrl}`);
    }
  }
});

// Test 30: Default chain ID
test('Default chain ID: Should default to Ethereum mainnet', () => {
  const verifier = new EtherscanVerifier('test');
  if (verifier.chainId !== 1) {
    throw new Error('Should default to chain ID 1 (Ethereum mainnet)');
  }
});

// Summary
console.log('\n' + '='.repeat(70));
console.log(`\nTest Results: ${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  console.log('❌ Some tests failed!\n');
  process.exit(1);
} else {
  console.log('✅ All tests passed!\n');
  process.exit(0);
}
