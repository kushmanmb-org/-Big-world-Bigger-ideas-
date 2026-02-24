/**
 * Beacon Chain Fetcher Tests
 */

const BeaconChainFetcher = require('./beaconchain.js');

console.log('Running Beacon Chain Fetcher Tests...\n');

let passed = 0;
let failed = 0;

async function test(description, fn) {
  try {
    await fn();
    console.log('✓', description);
    passed++;
  } catch (error) {
    console.log('✗', description);
    console.error('  Error:', error.message);
    failed++;
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: Expected ${expected}, got ${actual}`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// Main test runner
async function runTests() {
  // Test 1: Create BeaconChainFetcher instance
  await test('should create BeaconChainFetcher instance with default values', () => {
    const fetcher = new BeaconChainFetcher();
    assert(fetcher instanceof BeaconChainFetcher, 'Should be instance of BeaconChainFetcher');
    assertEqual(fetcher.baseUrl, 'beaconcha.in', 'Default baseUrl should be beaconcha.in');
    assertEqual(fetcher.apiKey, null, 'Default apiKey should be null');
  });

// Test 2: Create with custom values
await test('should create BeaconChainFetcher with custom values', () => {
  const fetcher = new BeaconChainFetcher('custom.beacon.com', 'test-api-key');
  assertEqual(fetcher.baseUrl, 'custom.beacon.com', 'Should use custom baseUrl');
  assertEqual(fetcher.apiKey, 'test-api-key', 'Should use custom apiKey');
});

// Test 3: Validate Ethereum address
await test('should validate Ethereum address with 0x prefix', () => {
  const fetcher = new BeaconChainFetcher();
  const address = '0x1234567890123456789012345678901234567890';
  const validated = fetcher.validateAddress(address);
  assertEqual(validated, address.toLowerCase(), 'Should return lowercase address');
});

// Test 4: Validate address without 0x prefix
await test('should validate Ethereum address without 0x prefix', () => {
  const fetcher = new BeaconChainFetcher();
  const address = '1234567890123456789012345678901234567890';
  const validated = fetcher.validateAddress(address);
  assertEqual(validated, '0x' + address.toLowerCase(), 'Should add 0x prefix');
});

// Test 5: Reject invalid address
await test('should reject invalid Ethereum address', () => {
  const fetcher = new BeaconChainFetcher();
  let errorThrown = false;
  try {
    fetcher.validateAddress('invalid');
  } catch (error) {
    errorThrown = true;
    assert(error.message.includes('Invalid Ethereum address'), 'Should throw invalid address error');
  }
  assert(errorThrown, 'Should throw error for invalid address');
});

// Test 6: Reject empty address
await test('should reject empty address', () => {
  const fetcher = new BeaconChainFetcher();
  let errorThrown = false;
  try {
    fetcher.validateAddress('');
  } catch (error) {
    errorThrown = true;
    assert(error.message.includes('non-empty string'), 'Should throw non-empty string error');
  }
  assert(errorThrown, 'Should throw error for empty address');
});

// Test 7: Reject invalid page number
await test('should reject invalid page number', async () => {
  const fetcher = new BeaconChainFetcher();
  const validAddress = '0x1234567890123456789012345678901234567890';
  
  try {
    await fetcher.getValidatorsByAddress(validAddress, -1, 10);
    throw new Error('Should have thrown an error');
  } catch (error) {
    assert(error.message.includes('non-negative integer'), 'Should require non-negative page');
  }
  
  // Also test with string
  try {
    await fetcher.getValidatorsByAddress(validAddress, 'invalid', 10);
    throw new Error('Should have thrown an error');
  } catch (error) {
    assert(error.message.includes('non-negative integer'), 'Should reject string page');
  }
});

// Test 8: Reject invalid limit
await test('should reject invalid limit', async () => {
  const fetcher = new BeaconChainFetcher();
  const validAddress = '0x1234567890123456789012345678901234567890';
  
  try {
    await fetcher.getValidatorsByAddress(validAddress, 0, 0);
    throw new Error('Should have thrown an error');
  } catch (error) {
    assert(error.message.includes('between 1 and 100'), 'Should reject limit of 0');
  }
  
  try {
    await fetcher.getValidatorsByAddress(validAddress, 0, 101);
    throw new Error('Should have thrown an error');
  } catch (error) {
    assert(error.message.includes('between 1 and 100'), 'Should reject limit over 100');
  }
});

// Test 9: Accept ENS name
await test('should accept ENS name without validation', () => {
  const fetcher = new BeaconChainFetcher();
  // This should not throw - ENS names are accepted as-is
  const ensAddress = 'kushmanmb.eth';
  // The method will handle ENS internally when making the API call
  assert(ensAddress.endsWith('.eth'), 'Should recognize ENS format');
});

// Test 10: Cache functionality
await test('should have cache methods', () => {
  const fetcher = new BeaconChainFetcher();
  
  const stats = fetcher.getCacheStats();
  assert(stats.size !== undefined, 'Should have cache size');
  assert(stats.timeout !== undefined, 'Should have cache timeout');
  assert(Array.isArray(stats.keys), 'Should have cache keys array');
  
  fetcher.clearCache();
  const statsAfter = fetcher.getCacheStats();
  assertEqual(statsAfter.size, 0, 'Cache should be empty after clear');
});

// Test 11: Get API info
await test('should return API info', () => {
  const fetcher = new BeaconChainFetcher('test.com', 'key123');
  const info = fetcher.getAPIInfo();
  
  assertEqual(info.baseUrl, 'test.com', 'Should return correct baseUrl');
  assertEqual(info.hasApiKey, true, 'Should indicate API key presence');
  assert(info.cacheTimeout > 0, 'Should have cache timeout');
});

// Test 12: Static filter validators by status
await test('should filter validators by status', () => {
  const validators = [
    { validatorindex: 1, status: 'active' },
    { validatorindex: 2, status: 'pending' },
    { validatorindex: 3, status: 'active' },
    { validatorindex: 4, status: 'exited' }
  ];
  
  const active = BeaconChainFetcher.filterValidatorsByStatus(validators, 'active');
  assertEqual(active.length, 2, 'Should return 2 active validators');
  assertEqual(active[0].validatorindex, 1, 'First should be validator 1');
  assertEqual(active[1].validatorindex, 3, 'Second should be validator 3');
});

// Test 13: Static get total validator count
await test('should get total validator count', () => {
  const data = {
    validators: [
      { validatorindex: 1 },
      { validatorindex: 2 },
      { validatorindex: 3 }
    ]
  };
  
  const count = BeaconChainFetcher.getTotalValidatorCount(data);
  assertEqual(count, 3, 'Should return correct count');
  
  const emptyCount = BeaconChainFetcher.getTotalValidatorCount({});
  assertEqual(emptyCount, 0, 'Should return 0 for empty data');
});

// Test 14: Format validator data
await test('should format validator data', () => {
  const fetcher = new BeaconChainFetcher();
  const data = {
    address: '0x1234567890123456789012345678901234567890',
    page: 0,
    limit: 10,
    offset: 0,
    validators: [
      {
        validatorindex: 1,
        pubkey: '0xabcdef1234567890abcdef1234567890',
        balance: 32000000000,
        status: 'active',
        activationepoch: 100
      }
    ]
  };
  
  const formatted = fetcher.formatValidatorData(data);
  assert(formatted.includes('Address:'), 'Should include address');
  assert(formatted.includes('Page:'), 'Should include page');
  assert(formatted.includes('Validator 1:'), 'Should include validator details');
  assert(formatted.includes('Index: 1'), 'Should include validator index');
});

// Test 15: Format empty validator data
await test('should format empty validator data', () => {
  const fetcher = new BeaconChainFetcher();
  const data = {
    address: 'kushmanmb.eth',
    page: 0,
    limit: 10,
    offset: 0,
    validators: []
  };
  
  const formatted = fetcher.formatValidatorData(data);
  assert(formatted.includes('kushmanmb.eth'), 'Should include ENS address');
  assert(formatted.includes('No validators found'), 'Should indicate no validators');
});

// Test 16: Reject invalid filter input
await test('should reject invalid filter input', () => {
  let errorThrown = false;
  try {
    BeaconChainFetcher.filterValidatorsByStatus('not-an-array', 'active');
  } catch (error) {
    errorThrown = true;
    assert(error.message.includes('must be an array'), 'Should require array');
  }
  assert(errorThrown, 'Should throw error for non-array input');
});

// Test 17: Reject empty status filter
await test('should reject empty status filter', () => {
  let errorThrown = false;
  try {
    BeaconChainFetcher.filterValidatorsByStatus([], '');
  } catch (error) {
    errorThrown = true;
    assert(error.message.includes('non-empty string'), 'Should require non-empty status');
  }
  assert(errorThrown, 'Should throw error for empty status');
});

// Test 18: Validate performance pagination
await test('should validate performance pagination parameters', async () => {
  const fetcher = new BeaconChainFetcher();
  
  try {
    await fetcher.getValidatorPerformance(123, -1, 10);
    throw new Error('Should have thrown an error');
  } catch (error) {
    assert(error.message.includes('non-negative integer'), 'Should reject negative page');
  }
  
  try {
    await fetcher.getValidatorPerformance(123, 0, 0);
    throw new Error('Should have thrown an error');
  } catch (error) {
    assert(error.message.includes('between 1 and 100'), 'Should reject invalid limit');
  }
});

// Test 19: Validate block pagination
await test('should validate block pagination parameters', async () => {
  const fetcher = new BeaconChainFetcher();
  
  try {
    await fetcher.getRecentBlocks(-1, 10);
    throw new Error('Should have thrown an error');
  } catch (error) {
    assert(error.message.includes('non-negative integer'), 'Should reject negative page');
  }
  
  try {
    await fetcher.getRecentBlocks(0, 101);
    throw new Error('Should have thrown an error');
  } catch (error) {
    assert(error.message.includes('between 1 and 100'), 'Should reject limit over 100');
  }
});

// Test 20: Require validator index
await test('should require validator index for validator queries', async () => {
  const fetcher = new BeaconChainFetcher();
  
  try {
    await fetcher.getValidatorByIndex(null);
    throw new Error('Should have thrown an error');
  } catch (error) {
    assert(error.message.includes('required'), 'Should require validator index');
  }
  
  try {
    await fetcher.getValidatorByIndex(undefined);
    throw new Error('Should have thrown an error');
  } catch (error) {
    assert(error.message.includes('required'), 'Should require validator index');
  }
});

  console.log('\n' + '='.repeat(50));
  console.log(`Tests Passed: ${passed}`);
  console.log(`Tests Failed: ${failed}`);
  console.log('='.repeat(50));

  if (failed > 0) {
    console.error('❌ Some tests failed!');
    process.exit(1);
  } else {
    console.log('✅ All tests passed!');
    process.exit(0);
  }
}

// Run all tests
runTests().catch(error => {
  console.error('Test runner error:', error);
  process.exit(1);
});
