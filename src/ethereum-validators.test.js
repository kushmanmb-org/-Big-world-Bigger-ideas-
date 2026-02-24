/**
 * Ethereum Validators Module Tests
 * Tests for the Ethereum validators functionality
 */

const EthereumValidatorsFetcher = require('./ethereum-validators.js');

// Test utilities
let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✓ ${message}`);
    testsPassed++;
  } else {
    console.error(`✗ ${message}`);
    testsFailed++;
  }
}

function assertEqual(actual, expected, message) {
  if (actual === expected) {
    console.log(`✓ ${message}`);
    testsPassed++;
  } else {
    console.error(`✗ ${message}`);
    console.error(`  Expected: ${expected}`);
    console.error(`  Actual: ${actual}`);
    testsFailed++;
  }
}

async function runTests() {
  console.log('Running Ethereum Validators Module Tests...\n');
  console.log('='.repeat(50));

  // Test 1: Constructor without API key
  console.log('\n📦 Testing Constructor (No API Key)...');
  try {
    const fetcher = new EthereumValidatorsFetcher();
    assert(fetcher !== null, 'Should create fetcher instance');
    assert(fetcher.apiKey === null, 'Should have null API key');
    assert(fetcher.baseUrl === 'beaconcha.in', 'Should use default base URL');
    assert(fetcher.cache instanceof Map, 'Should initialize cache as Map');
  } catch (error) {
    assert(false, `Constructor test failed: ${error.message}`);
  }

  // Test 2: Constructor with API key
  console.log('\n🔑 Testing Constructor (With API Key)...');
  try {
    const fetcher = new EthereumValidatorsFetcher('test-api-key');
    assertEqual(fetcher.apiKey, 'test-api-key', 'Should store API key');
  } catch (error) {
    assert(false, `API key constructor test failed: ${error.message}`);
  }

  // Test 3: Constructor with custom URL
  console.log('\n🌐 Testing Constructor with Custom URL...');
  try {
    const customFetcher = new EthereumValidatorsFetcher('key', 'custom.beaconcha.in');
    assertEqual(customFetcher.baseUrl, 'custom.beaconcha.in', 'Should use custom base URL');
  } catch (error) {
    assert(false, `Custom URL test failed: ${error.message}`);
  }

  // Test 4: Validator validation - null/undefined
  console.log('\n⚠️  Testing Validator Validation (Null/Undefined)...');
  try {
    const fetcher = new EthereumValidatorsFetcher();
    await fetcher.getValidators(null);
    assert(false, 'Should throw error for null validators');
  } catch (error) {
    assert(error.message.includes('required'), 'Should throw error for null validators');
  }

  // Test 5: Validator validation - empty array
  console.log('\n⚠️  Testing Validator Validation (Empty Array)...');
  try {
    const fetcher = new EthereumValidatorsFetcher();
    await fetcher.getValidators([]);
    assert(false, 'Should throw error for empty array');
  } catch (error) {
    assert(error.message.includes('At least one'), 'Should throw error for empty array');
  }

  // Test 6: Validator validation - negative index
  console.log('\n⚠️  Testing Validator Validation (Negative Index)...');
  try {
    const fetcher = new EthereumValidatorsFetcher();
    await fetcher.getValidators(-1);
    assert(false, 'Should throw error for negative index');
  } catch (error) {
    assert(error.message.includes('non-negative'), 'Should throw error for negative index');
  }

  // Test 7: Validator validation - invalid pubkey format
  console.log('\n⚠️  Testing Validator Validation (Invalid Pubkey)...');
  try {
    const fetcher = new EthereumValidatorsFetcher();
    await fetcher.getValidators('invalid-pubkey');
    assert(false, 'Should throw error for invalid pubkey');
  } catch (error) {
    assert(error.message.includes('Invalid validator identifier'), 'Should throw error for invalid pubkey');
  }

  // Test 8: Validator validation - valid index
  console.log('\n✅ Testing Validator Validation (Valid Index)...');
  try {
    const fetcher = new EthereumValidatorsFetcher();
    // Just test validation, not actual request
    const validated = fetcher._validateValidators(12345);
    assert(Array.isArray(validated), 'Should return array');
    assertEqual(validated[0], 12345, 'Should contain the validator index');
  } catch (error) {
    assert(false, `Valid index test failed: ${error.message}`);
  }

  // Test 9: Validator validation - valid pubkey
  console.log('\n✅ Testing Validator Validation (Valid Pubkey)...');
  try {
    const fetcher = new EthereumValidatorsFetcher();
    const validPubkey = '0x' + 'a'.repeat(96);
    const validated = fetcher._validateValidators(validPubkey);
    assert(Array.isArray(validated), 'Should return array');
    assertEqual(validated[0], validPubkey, 'Should contain the pubkey');
  } catch (error) {
    assert(false, `Valid pubkey test failed: ${error.message}`);
  }

  // Test 10: Validator validation - array of validators
  console.log('\n✅ Testing Validator Validation (Array)...');
  try {
    const fetcher = new EthereumValidatorsFetcher();
    const validators = [123, 456, '789'];
    const validated = fetcher._validateValidators(validators);
    assert(Array.isArray(validated), 'Should return array');
    assertEqual(validated.length, 3, 'Should have 3 validators');
  } catch (error) {
    assert(false, `Array validation test failed: ${error.message}`);
  }

  // Test 11: Cache functionality
  console.log('\n💾 Testing Cache Functionality...');
  try {
    const fetcher = new EthereumValidatorsFetcher();
    
    // Test cache stats
    const stats = fetcher.getCacheStats();
    assert(stats.size === 0, 'Cache should be empty initially');
    assert(Array.isArray(stats.keys), 'Cache stats should include keys array');
    assertEqual(stats.timeout, 60000, 'Default cache timeout should be 60000ms');
    
    // Test clear cache
    fetcher.clearCache();
    assertEqual(fetcher.cache.size, 0, 'Cache should be cleared');
  } catch (error) {
    assert(false, `Cache test failed: ${error.message}`);
  }

  // Test 12: Set cache timeout
  console.log('\n⏰ Testing Cache Timeout Setting...');
  try {
    const fetcher = new EthereumValidatorsFetcher();
    fetcher.setCacheTimeout(30000);
    assertEqual(fetcher.cacheTimeout, 30000, 'Should update cache timeout');
  } catch (error) {
    assert(false, `Cache timeout test failed: ${error.message}`);
  }

  // Test 13: Invalid cache timeout
  console.log('\n⚠️  Testing Invalid Cache Timeout...');
  try {
    const fetcher = new EthereumValidatorsFetcher();
    fetcher.setCacheTimeout(-1);
    assert(false, 'Should throw error for negative timeout');
  } catch (error) {
    assert(error.message.includes('non-negative'), 'Should throw error for negative timeout');
  }

  // Test 14: Format validators with array data
  console.log('\n📊 Testing Format Validators (Array)...');
  try {
    const fetcher = new EthereumValidatorsFetcher();
    const mockData = {
      data: [
        {
          validatorindex: 12345,
          pubkey: '0x' + 'a'.repeat(96),
          status: 'active_online',
          balance: 32000000000,
          effectivebalance: 32000000000,
          slashed: false,
          activationepoch: 0,
          exitepoch: 9999999999
        }
      ]
    };
    
    const formatted = fetcher.formatValidators(mockData);
    assert(formatted.includes('Ethereum Validator Information'), 'Should include title');
    assert(formatted.includes('Total validators: 1'), 'Should include validator count');
    assert(formatted.includes('Index: 12345'), 'Should include validator index');
    assert(formatted.includes('Status: active_online'), 'Should include status');
  } catch (error) {
    assert(false, `Format array test failed: ${error.message}`);
  }

  // Test 15: Format validators with null data
  console.log('\n🚫 Testing Format with Null Data...');
  try {
    const fetcher = new EthereumValidatorsFetcher();
    const formatted = fetcher.formatValidators(null);
    assertEqual(formatted, 'No data available', 'Should return "No data available" for null');
  } catch (error) {
    assert(false, `Format null test failed: ${error.message}`);
  }

  // Test 16: Format performance data
  console.log('\n📈 Testing Format Performance...');
  try {
    const fetcher = new EthereumValidatorsFetcher();
    const mockData = {
      data: [
        {
          validatorindex: 12345,
          attestation_efficiency: 99.5,
          proposal_efficiency: 100,
          income: 1000000
        }
      ]
    };
    
    const formatted = fetcher.formatPerformance(mockData);
    assert(formatted.includes('Validator Performance'), 'Should include title');
    assert(formatted.includes('Validator Index: 12345'), 'Should include validator index');
    assert(formatted.includes('Attestation Efficiency'), 'Should include attestation efficiency');
  } catch (error) {
    assert(false, `Format performance test failed: ${error.message}`);
  }

  // Test 17: Format performance with null data
  console.log('\n🚫 Testing Format Performance (Null)...');
  try {
    const fetcher = new EthereumValidatorsFetcher();
    const formatted = fetcher.formatPerformance(null);
    assertEqual(formatted, 'No performance data available', 'Should return "No performance data available" for null');
  } catch (error) {
    assert(false, `Format performance null test failed: ${error.message}`);
  }

  // Test 18: Multiple instances
  console.log('\n🔄 Testing Multiple Instances...');
  try {
    const fetcher1 = new EthereumValidatorsFetcher('key1');
    const fetcher2 = new EthereumValidatorsFetcher('key2');
    
    assert(fetcher1.apiKey !== fetcher2.apiKey, 'Should have different API keys');
    assert(fetcher1.cache !== fetcher2.cache, 'Should have separate caches');
  } catch (error) {
    assert(false, `Multiple instances test failed: ${error.message}`);
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Test Summary:');
  console.log(`✓ Passed: ${testsPassed}`);
  console.log(`✗ Failed: ${testsFailed}`);
  console.log(`Total: ${testsPassed + testsFailed}`);
  
  if (testsFailed === 0) {
    console.log('\n🎉 All tests passed!');
  } else {
    console.log('\n⚠️  Some tests failed.');
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  console.error('\n❌ Test suite failed:', error);
  process.exit(1);
});
