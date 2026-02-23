/**
 * Etherscan Token Balance Fetcher Module Tests
 * Tests for fetching token balances from Etherscan API
 */

const EtherscanTokenBalanceFetcher = require('./etherscan-token-balance.js');

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
  console.log('Running Etherscan Token Balance Fetcher Module Tests...\n');
  console.log('='.repeat(50));

  // Test 1: Constructor with default values
  console.log('\n📦 Testing Constructor with Defaults...');
  try {
    const fetcher = new EtherscanTokenBalanceFetcher();
    assert(fetcher !== null, 'Should create fetcher instance');
    assertEqual(fetcher.chainId, 1, 'Should default to Ethereum mainnet (chain ID 1)');
    assertEqual(fetcher.apiBaseUrl, 'api.etherscan.io', 'Should use Etherscan API URL');
    assert(fetcher.cache instanceof Map, 'Should initialize cache as Map');
  } catch (error) {
    assert(false, `Constructor test failed: ${error.message}`);
  }

  // Test 2: Constructor with custom values
  console.log('\n🔧 Testing Constructor with Custom Values...');
  try {
    const fetcher = new EtherscanTokenBalanceFetcher('test-api-key', 8453);
    assertEqual(fetcher.apiKey, 'test-api-key', 'Should set custom API key');
    assertEqual(fetcher.chainId, 8453, 'Should set custom chain ID');
  } catch (error) {
    assert(false, `Custom constructor test failed: ${error.message}`);
  }

  // Test 3: Validate valid Ethereum address with 0x prefix
  console.log('\n✅ Testing Valid Address with 0x Prefix...');
  try {
    const fetcher = new EtherscanTokenBalanceFetcher();
    const address = fetcher.validateAddress('0x983e3660c0bE01991785F80f266A84B911ab59b0');
    assert(address.startsWith('0x'), 'Should maintain 0x prefix');
    assertEqual(address.length, 42, 'Should be 42 characters long');
  } catch (error) {
    assert(false, `Valid address test failed: ${error.message}`);
  }

  // Test 4: Validate valid address without 0x prefix
  console.log('\n➕ Testing Valid Address without 0x Prefix...');
  try {
    const fetcher = new EtherscanTokenBalanceFetcher();
    const address = fetcher.validateAddress('983e3660c0bE01991785F80f266A84B911ab59b0');
    assert(address.startsWith('0x'), 'Should add 0x prefix');
    assertEqual(address.length, 42, 'Should be 42 characters long');
  } catch (error) {
    assert(false, `Address without prefix test failed: ${error.message}`);
  }

  // Test 5: Validate invalid address - too short
  console.log('\n⚠️  Testing Invalid Address - Too Short...');
  try {
    const fetcher = new EtherscanTokenBalanceFetcher();
    fetcher.validateAddress('0x123');
    assert(false, 'Should throw error for short address');
  } catch (error) {
    assert(error.message.includes('Invalid'), 'Should throw validation error');
  }

  // Test 6: Validate invalid address - not hex
  console.log('\n⚠️  Testing Invalid Address - Non-Hex...');
  try {
    const fetcher = new EtherscanTokenBalanceFetcher();
    fetcher.validateAddress('0xGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG');
    assert(false, 'Should throw error for non-hex address');
  } catch (error) {
    assert(error.message.includes('Invalid'), 'Should throw validation error');
  }

  // Test 7: Validate empty address
  console.log('\n⚠️  Testing Empty Address...');
  try {
    const fetcher = new EtherscanTokenBalanceFetcher();
    fetcher.validateAddress('');
    assert(false, 'Should throw error for empty address');
  } catch (error) {
    assert(error.message.includes('non-empty'), 'Should throw non-empty error');
  }

  // Test 8: Validate null address
  console.log('\n⚠️  Testing Null Address...');
  try {
    const fetcher = new EtherscanTokenBalanceFetcher();
    fetcher.validateAddress(null);
    assert(false, 'Should throw error for null address');
  } catch (error) {
    assert(error.message.includes('non-empty'), 'Should throw non-empty error');
  }

  // Test 9: getTokenBalances without API key
  console.log('\n🔑 Testing getTokenBalances without API Key...');
  try {
    const fetcher = new EtherscanTokenBalanceFetcher();
    await fetcher.getTokenBalances('0x983e3660c0bE01991785F80f266A84B911ab59b0');
    assert(false, 'Should throw error without API key');
  } catch (error) {
    assert(error.message.includes('API key is required'), 'Should throw API key error');
  }

  // Test 10: getTokenBalances with invalid page
  console.log('\n📄 Testing getTokenBalances with Invalid Page...');
  try {
    const fetcher = new EtherscanTokenBalanceFetcher('test-key');
    await fetcher.getTokenBalances('0x983e3660c0bE01991785F80f266A84B911ab59b0', 0);
    assert(false, 'Should throw error for page 0');
  } catch (error) {
    assert(error.message.includes('positive integer'), 'Should throw page validation error');
  }

  // Test 11: getTokenBalances with invalid offset
  console.log('\n📊 Testing getTokenBalances with Invalid Offset...');
  try {
    const fetcher = new EtherscanTokenBalanceFetcher('test-key');
    await fetcher.getTokenBalances('0x983e3660c0bE01991785F80f266A84B911ab59b0', 1, 101);
    assert(false, 'Should throw error for offset > 100');
  } catch (error) {
    assert(error.message.includes('between 1 and 100'), 'Should throw offset validation error');
  }

  // Test 12: getTokenBalances with negative offset
  console.log('\n⚠️  Testing getTokenBalances with Negative Offset...');
  try {
    const fetcher = new EtherscanTokenBalanceFetcher('test-key');
    await fetcher.getTokenBalances('0x983e3660c0bE01991785F80f266A84B911ab59b0', 1, -1);
    assert(false, 'Should throw error for negative offset');
  } catch (error) {
    assert(error.message.includes('between 1 and 100'), 'Should throw offset validation error');
  }

  // Test 13: filterTokensByType with valid data
  console.log('\n🔍 Testing filterTokensByType...');
  try {
    const tokens = [
      { TokenType: 'ERC-20', TokenName: 'Token1' },
      { TokenType: 'ERC-721', TokenName: 'Token2' },
      { TokenType: 'ERC-20', TokenName: 'Token3' }
    ];
    const filtered = EtherscanTokenBalanceFetcher.filterTokensByType(tokens, 'ERC-20');
    assertEqual(filtered.length, 2, 'Should filter 2 ERC-20 tokens');
  } catch (error) {
    assert(false, `Filter by type test failed: ${error.message}`);
  }

  // Test 14: filterTokensByType with empty array
  console.log('\n📋 Testing filterTokensByType with Empty Array...');
  try {
    const filtered = EtherscanTokenBalanceFetcher.filterTokensByType([], 'ERC-20');
    assertEqual(filtered.length, 0, 'Should return empty array');
  } catch (error) {
    assert(false, `Empty filter test failed: ${error.message}`);
  }

  // Test 15: filterTokensByType with invalid tokens parameter
  console.log('\n⚠️  Testing filterTokensByType with Invalid Tokens...');
  try {
    EtherscanTokenBalanceFetcher.filterTokensByType(null, 'ERC-20');
    assert(false, 'Should throw error for invalid tokens');
  } catch (error) {
    assert(error.message.includes('array'), 'Should throw array validation error');
  }

  // Test 16: filterTokensByType with invalid type parameter
  console.log('\n⚠️  Testing filterTokensByType with Invalid Type...');
  try {
    EtherscanTokenBalanceFetcher.filterTokensByType([], null);
    assert(false, 'Should throw error for invalid type');
  } catch (error) {
    assert(error.message.includes('non-empty string'), 'Should throw type validation error');
  }

  // Test 17: getTotalTokenCount with valid data
  console.log('\n🔢 Testing getTotalTokenCount...');
  try {
    const data = {
      tokens: [
        { TokenName: 'Token1' },
        { TokenName: 'Token2' },
        { TokenName: 'Token3' }
      ]
    };
    const count = EtherscanTokenBalanceFetcher.getTotalTokenCount(data);
    assertEqual(count, 3, 'Should count 3 tokens');
  } catch (error) {
    assert(false, `Token count test failed: ${error.message}`);
  }

  // Test 18: getTotalTokenCount with no tokens
  console.log('\n0️⃣  Testing getTotalTokenCount with No Tokens...');
  try {
    const count = EtherscanTokenBalanceFetcher.getTotalTokenCount({ tokens: [] });
    assertEqual(count, 0, 'Should return 0 for empty tokens');
  } catch (error) {
    assert(false, `Empty token count test failed: ${error.message}`);
  }

  // Test 19: getTotalTokenCount with null data
  console.log('\n⚠️  Testing getTotalTokenCount with Null Data...');
  try {
    const count = EtherscanTokenBalanceFetcher.getTotalTokenCount(null);
    assertEqual(count, 0, 'Should return 0 for null data');
  } catch (error) {
    assert(false, `Null token count test failed: ${error.message}`);
  }

  // Test 20: formatTokenBalances with valid data
  console.log('\n📝 Testing formatTokenBalances...');
  try {
    const fetcher = new EtherscanTokenBalanceFetcher();
    const data = {
      address: '0x983e3660c0be01991785f80f266a84b911ab59b0',
      chainId: 1,
      page: 1,
      offset: 100,
      tokens: [
        {
          TokenName: 'Test Token',
          TokenSymbol: 'TEST',
          TokenQuantity: '1000',
          TokenAddress: '0x1234567890123456789012345678901234567890',
          TokenType: 'ERC-20'
        }
      ]
    };
    const formatted = fetcher.formatTokenBalances(data);
    assert(typeof formatted === 'string', 'Should return string');
    assert(formatted.includes('Test Token'), 'Should include token name');
    assert(formatted.includes('TEST'), 'Should include token symbol');
  } catch (error) {
    assert(false, `Format test failed: ${error.message}`);
  }

  // Test 21: formatTokenBalances with no tokens
  console.log('\n📄 Testing formatTokenBalances with No Tokens...');
  try {
    const fetcher = new EtherscanTokenBalanceFetcher();
    const data = {
      address: '0x983e3660c0be01991785f80f266a84b911ab59b0',
      chainId: 1,
      page: 1,
      offset: 100,
      tokens: []
    };
    const formatted = fetcher.formatTokenBalances(data);
    assert(formatted.includes('No tokens found'), 'Should indicate no tokens');
  } catch (error) {
    assert(false, `No tokens format test failed: ${error.message}`);
  }

  // Test 22: formatTokenBalances with null data
  console.log('\n⚠️  Testing formatTokenBalances with Null Data...');
  try {
    const fetcher = new EtherscanTokenBalanceFetcher();
    const formatted = fetcher.formatTokenBalances(null);
    assertEqual(formatted, 'No data available', 'Should return no data message');
  } catch (error) {
    assert(false, `Null format test failed: ${error.message}`);
  }

  // Test 23: clearCache
  console.log('\n🗑️  Testing clearCache...');
  try {
    const fetcher = new EtherscanTokenBalanceFetcher('test-key');
    fetcher.cache.set('test', { data: 'value', timestamp: Date.now() });
    assertEqual(fetcher.cache.size, 1, 'Should have 1 item in cache');
    fetcher.clearCache();
    assertEqual(fetcher.cache.size, 0, 'Should clear cache');
  } catch (error) {
    assert(false, `Clear cache test failed: ${error.message}`);
  }

  // Test 24: getCacheStats
  console.log('\n📊 Testing getCacheStats...');
  try {
    const fetcher = new EtherscanTokenBalanceFetcher();
    fetcher.cache.set('key1', { data: 'value1', timestamp: Date.now() });
    fetcher.cache.set('key2', { data: 'value2', timestamp: Date.now() });
    const stats = fetcher.getCacheStats();
    assertEqual(stats.size, 2, 'Should report 2 items in cache');
    assert(stats.timeout === 60000, 'Should report cache timeout');
    assert(Array.isArray(stats.keys), 'Should return keys array');
  } catch (error) {
    assert(false, `Cache stats test failed: ${error.message}`);
  }

  // Test 25: getAPIInfo
  console.log('\n📡 Testing getAPIInfo...');
  try {
    const fetcher = new EtherscanTokenBalanceFetcher('my-api-key', 8453);
    const info = fetcher.getAPIInfo();
    assertEqual(info.baseUrl, 'api.etherscan.io', 'Should return base URL');
    assertEqual(info.chainId, 8453, 'Should return chain ID');
    assert(info.hasApiKey === true, 'Should indicate API key is present');
    assertEqual(info.cacheTimeout, 60000, 'Should return cache timeout');
  } catch (error) {
    assert(false, `API info test failed: ${error.message}`);
  }

  // Test 26: getAPIInfo without API key
  console.log('\n🔓 Testing getAPIInfo without API Key...');
  try {
    const fetcher = new EtherscanTokenBalanceFetcher();
    const info = fetcher.getAPIInfo();
    assert(info.hasApiKey === false, 'Should indicate no API key');
  } catch (error) {
    assert(false, `API info no key test failed: ${error.message}`);
  }

  // Final Summary
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Test Summary:');
  console.log(`✓ Passed: ${testsPassed}`);
  console.log(`✗ Failed: ${testsFailed}`);
  console.log(`Total: ${testsPassed + testsFailed}`);
  console.log('\n' + '='.repeat(50));

  if (testsFailed === 0) {
    console.log('\n🎉 All tests passed!');
  } else {
    console.log(`\n❌ ${testsFailed} test(s) failed!`);
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
});
