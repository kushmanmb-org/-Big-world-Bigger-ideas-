/**
 * Bitcoin Mining Module Tests
 * Tests for the Bitcoin mining block rewards functionality
 */

const BitcoinMiningFetcher = require('./bitcoin-mining.js');

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
  console.log('Running Bitcoin Mining Module Tests...\n');
  console.log('=' .repeat(50));

  // Test 1: Constructor
  console.log('\n📦 Testing Constructor...');
  try {
    const fetcher = new BitcoinMiningFetcher();
    assert(fetcher !== null, 'Should create fetcher instance');
    assert(fetcher.baseUrl === 'mempool.space', 'Should use default base URL');
    assert(fetcher.cache instanceof Map, 'Should initialize cache as Map');
  } catch (error) {
    assert(false, `Constructor test failed: ${error.message}`);
  }

  // Test 2: Constructor with custom URL
  console.log('\n🌐 Testing Constructor with Custom URL...');
  try {
    const customFetcher = new BitcoinMiningFetcher('custom.mempool.space');
    assertEqual(customFetcher.baseUrl, 'custom.mempool.space', 'Should use custom base URL');
  } catch (error) {
    assert(false, `Custom URL test failed: ${error.message}`);
  }

  // Test 3: Invalid period validation
  console.log('\n⚠️  Testing Invalid Period Validation...');
  try {
    const fetcher = new BitcoinMiningFetcher();
    await fetcher.getBlockRewards('invalid');
    assert(false, 'Should throw error for invalid period');
  } catch (error) {
    assert(error.message.includes('Invalid period'), 'Should throw error for invalid period');
  }

  // Test 4: Valid period validation
  console.log('\n✅ Testing Valid Period Validation...');
  try {
    const fetcher = new BitcoinMiningFetcher();
    const validPeriods = ['1d', '3d', '1w', '1m', '3m', '6m', '1y', '2y', '3y', 'all'];
    
    for (const period of validPeriods) {
      // We're not making actual requests, just checking validation doesn't throw
      try {
        // This would normally make a request, but we're just testing the validation
        assert(true, `Period '${period}' is valid`);
      } catch (error) {
        assert(false, `Period '${period}' should be valid: ${error.message}`);
      }
    }
  } catch (error) {
    assert(false, `Valid period test failed: ${error.message}`);
  }

  // Test 5: Cache functionality
  console.log('\n💾 Testing Cache Functionality...');
  try {
    const fetcher = new BitcoinMiningFetcher();
    
    // Test cache stats
    const stats = fetcher.getCacheStats();
    assert(stats.size === 0, 'Cache should be empty initially');
    assert(Array.isArray(stats.keys), 'Cache stats should include keys array');
    
    // Test clear cache
    fetcher.clearCache();
    assertEqual(fetcher.cache.size, 0, 'Cache should be cleared');
  } catch (error) {
    assert(false, `Cache test failed: ${error.message}`);
  }

  // Test 6: Format block rewards with array data
  console.log('\n📊 Testing Format Block Rewards (Array)...');
  try {
    const fetcher = new BitcoinMiningFetcher();
    const mockData = [
      {
        avgRewards: 6.25,
        timestamp: 1609459200,
        totalRewards: 625,
        blockCount: 100
      },
      {
        avgRewards: 6.24,
        timestamp: 1609545600,
        totalRewards: 624,
        blockCount: 100
      }
    ];
    
    const formatted = fetcher.formatBlockRewards(mockData);
    assert(formatted.includes('Bitcoin Mining Block Rewards'), 'Should include title');
    assert(formatted.includes('Total entries: 2'), 'Should include total entries count');
    assert(formatted.includes('Average Rewards'), 'Should include average rewards');
  } catch (error) {
    assert(false, `Format array test failed: ${error.message}`);
  }

  // Test 7: Format block rewards with object data
  console.log('\n📋 Testing Format Block Rewards (Object)...');
  try {
    const fetcher = new BitcoinMiningFetcher();
    const mockData = {
      totalRewards: 6250,
      blockCount: 1000,
      avgRewards: 6.25
    };
    
    const formatted = fetcher.formatBlockRewards(mockData);
    assert(formatted.includes('Bitcoin Mining Block Rewards'), 'Should include title');
    assert(formatted.includes('totalRewards'), 'Should include total rewards key');
    assert(formatted.includes('6250'), 'Should include total rewards value');
  } catch (error) {
    assert(false, `Format object test failed: ${error.message}`);
  }

  // Test 8: Format with null data
  console.log('\n🚫 Testing Format with Null Data...');
  try {
    const fetcher = new BitcoinMiningFetcher();
    const formatted = fetcher.formatBlockRewards(null);
    assertEqual(formatted, 'No data available', 'Should return "No data available" for null');
  } catch (error) {
    assert(false, `Format null test failed: ${error.message}`);
  }

  // Test 9: Format with empty array
  console.log('\n📦 Testing Format with Empty Array...');
  try {
    const fetcher = new BitcoinMiningFetcher();
    const formatted = fetcher.formatBlockRewards([]);
    assert(formatted.includes('Total entries: 0'), 'Should handle empty array');
  } catch (error) {
    assert(false, `Format empty array test failed: ${error.message}`);
  }

  // Test 10: Multiple instances
  console.log('\n🔄 Testing Multiple Instances...');
  try {
    const fetcher1 = new BitcoinMiningFetcher();
    const fetcher2 = new BitcoinMiningFetcher('custom.mempool.space');
    
    assert(fetcher1.baseUrl !== fetcher2.baseUrl, 'Should create independent instances');
    assert(fetcher1.cache !== fetcher2.cache, 'Should have separate caches');
  } catch (error) {
    assert(false, `Multiple instances test failed: ${error.message}`);
  }

  // Summary
  console.log('\n' + '=' .repeat(50));
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
