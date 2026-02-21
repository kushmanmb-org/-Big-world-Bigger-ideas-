/**
 * Bitcoin Mining Module Example
 * Demonstrates how to use the Bitcoin Mining Block Rewards fetcher
 */

const BitcoinMiningFetcher = require('./bitcoin-mining.js');

async function runExample() {
  console.log('🌏 Big World Bigger Ideas - Bitcoin Mining Example\n');
  console.log('=' .repeat(60));
  
  // Create a fetcher instance
  console.log('\n📦 Creating Bitcoin Mining fetcher...');
  const fetcher = new BitcoinMiningFetcher();
  console.log('✓ Fetcher created successfully');
  
  // Example 1: Fetch 1-day block rewards
  console.log('\n' + '=' .repeat(60));
  console.log('📊 Example 1: Fetching 1-day block rewards...');
  console.log('=' .repeat(60));
  try {
    const rewards1d = await fetcher.getBlockRewards('1d');
    console.log('\n✓ Data fetched successfully!');
    console.log('\nFormatted Output:');
    console.log(fetcher.formatBlockRewards(rewards1d));
  } catch (error) {
    console.log(`\n⚠️  Note: ${error.message}`);
    console.log('This is expected in environments without internet access.');
    console.log('The module is ready to use in production with network connectivity.\n');
  }
  
  // Example 2: Fetch 1-week mining pools
  console.log('\n' + '=' .repeat(60));
  console.log('⛏️  Example 2: Fetching 1-week mining pools data...');
  console.log('=' .repeat(60));
  try {
    const pools = await fetcher.getMiningPools('1w');
    console.log('\n✓ Mining pools data fetched successfully!');
    console.log('\nSample data structure:');
    console.log(JSON.stringify(pools, null, 2).substring(0, 500) + '...');
  } catch (error) {
    console.log(`\n⚠️  Note: ${error.message}`);
    console.log('This is expected in environments without internet access.');
  }
  
  // Example 3: Fetch hashrate data
  console.log('\n' + '=' .repeat(60));
  console.log('💪 Example 3: Fetching hashrate data...');
  console.log('=' .repeat(60));
  try {
    const hashrate = await fetcher.getHashrate('1w');
    console.log('\n✓ Hashrate data fetched successfully!');
    console.log('\nSample data structure:');
    console.log(JSON.stringify(hashrate, null, 2).substring(0, 500) + '...');
  } catch (error) {
    console.log(`\n⚠️  Note: ${error.message}`);
    console.log('This is expected in environments without internet access.');
  }
  
  // Example 4: Fetch difficulty adjustment
  console.log('\n' + '=' .repeat(60));
  console.log('🎯 Example 4: Fetching difficulty adjustment data...');
  console.log('=' .repeat(60));
  try {
    const difficulty = await fetcher.getDifficultyAdjustment();
    console.log('\n✓ Difficulty adjustment data fetched successfully!');
    console.log('\nSample data structure:');
    console.log(JSON.stringify(difficulty, null, 2).substring(0, 500) + '...');
  } catch (error) {
    console.log(`\n⚠️  Note: ${error.message}`);
    console.log('This is expected in environments without internet access.');
  }
  
  // Example 5: Demonstrate formatting with mock data
  console.log('\n' + '=' .repeat(60));
  console.log('🎨 Example 5: Formatting mock data...');
  console.log('=' .repeat(60));
  
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
    },
    {
      avgRewards: 6.26,
      timestamp: 1609632000,
      totalRewards: 626,
      blockCount: 100
    }
  ];
  
  console.log('\nMock data formatting:');
  console.log(fetcher.formatBlockRewards(mockData));
  
  // Example 6: Cache statistics
  console.log('\n' + '=' .repeat(60));
  console.log('💾 Example 6: Cache statistics...');
  console.log('=' .repeat(60));
  
  const cacheStats = fetcher.getCacheStats();
  console.log('\nCache Statistics:');
  console.log(`  Size: ${cacheStats.size} entries`);
  console.log(`  Timeout: ${cacheStats.timeout / 1000} seconds`);
  console.log(`  Keys: ${cacheStats.keys.length > 0 ? cacheStats.keys.join(', ') : 'None'}`);
  
  // Example 7: Using different time periods
  console.log('\n' + '=' .repeat(60));
  console.log('📅 Example 7: Available time periods...');
  console.log('=' .repeat(60));
  
  console.log('\nSupported time periods for block rewards:');
  const periods = ['1d', '3d', '1w', '1m', '3m', '6m', '1y', '2y', '3y', 'all'];
  periods.forEach(period => {
    console.log(`  • ${period.padEnd(4)} - ${getPeriodDescription(period)}`);
  });
  
  // Clear cache at the end
  fetcher.clearCache();
  console.log('\n✓ Cache cleared');
  
  console.log('\n' + '=' .repeat(60));
  console.log('✅ Example completed successfully!');
  console.log('=' .repeat(60));
  console.log('\n💡 Usage Tips:');
  console.log('  1. Create a fetcher: const fetcher = new BitcoinMiningFetcher()');
  console.log('  2. Fetch rewards: await fetcher.getBlockRewards("1d")');
  console.log('  3. Format output: fetcher.formatBlockRewards(data)');
  console.log('  4. Check cache: fetcher.getCacheStats()');
  console.log('\n📚 For more information, see the module documentation.');
}

function getPeriodDescription(period) {
  const descriptions = {
    '1d': 'Last 24 hours',
    '3d': 'Last 3 days',
    '1w': 'Last week',
    '1m': 'Last month',
    '3m': 'Last 3 months',
    '6m': 'Last 6 months',
    '1y': 'Last year',
    '2y': 'Last 2 years',
    '3y': 'Last 3 years',
    'all': 'All time'
  };
  return descriptions[period] || 'Unknown period';
}

// Run the example
runExample().catch(error => {
  console.error('\n❌ Example failed:', error);
  process.exit(1);
});
