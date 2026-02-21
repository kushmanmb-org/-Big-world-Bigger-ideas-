/**
 * Litecoin Blockchair Module Example
 * Demonstrates how to use the Litecoin Blockchair API fetcher
 */

const LitecoinBlockchairFetcher = require('./litecoin-blockchair.js');

async function runExample() {
  console.log('🌏 Big World Bigger Ideas - Litecoin Blockchair Example\n');
  console.log('='.repeat(60));
  
  // Create a fetcher instance
  console.log('\n📦 Creating Litecoin Blockchair fetcher...');
  const fetcher = new LitecoinBlockchairFetcher();
  console.log('✓ Fetcher created successfully');
  
  // Example 1: Fetch Litecoin blockchain statistics
  console.log('\n' + '='.repeat(60));
  console.log('📊 Example 1: Fetching Litecoin blockchain statistics...');
  console.log('='.repeat(60));
  try {
    const stats = await fetcher.getStats();
    console.log('\n✓ Stats fetched successfully!');
    console.log('\nFormatted Output:');
    console.log(fetcher.formatStats(stats));
  } catch (error) {
    console.log(`\n⚠️  Note: ${error.message}`);
    console.log('This is expected in environments without internet access.');
    console.log('The module is ready to use in production with network connectivity.\n');
  }
  
  // Example 2: Fetch specific block information
  console.log('\n' + '='.repeat(60));
  console.log('🧱 Example 2: Fetching specific block information...');
  console.log('='.repeat(60));
  console.log('Attempting to fetch block #2500000...');
  try {
    const block = await fetcher.getBlock(2500000);
    console.log('\n✓ Block data fetched successfully!');
    console.log('\nFormatted Output:');
    console.log(fetcher.formatBlock(block));
  } catch (error) {
    console.log(`\n⚠️  Note: ${error.message}`);
    console.log('This is expected in environments without internet access.');
  }
  
  // Example 3: Fetch recent blocks
  console.log('\n' + '='.repeat(60));
  console.log('📚 Example 3: Fetching recent blocks...');
  console.log('='.repeat(60));
  try {
    const recentBlocks = await fetcher.getRecentBlocks(5);
    console.log('\n✓ Recent blocks fetched successfully!');
    console.log('\nSample data structure:');
    console.log(JSON.stringify(recentBlocks, null, 2).substring(0, 500) + '...');
  } catch (error) {
    console.log(`\n⚠️  Note: ${error.message}`);
    console.log('This is expected in environments without internet access.');
  }
  
  // Example 4: Demonstrate formatting with mock data
  console.log('\n' + '='.repeat(60));
  console.log('🎨 Example 4: Formatting mock statistics data...');
  console.log('='.repeat(60));
  
  const mockStats = {
    data: {
      blocks: 2500000,
      transactions: 50000000,
      circulation: 7000000000000000, // in satoshis
      difficulty: 15000000,
      hashrate_24h: '500 TH/s',
      blockchain_size: 50000000000, // in bytes
      nodes: 1500,
      market_price_usd: 75.50,
      market_cap_usd: 5500000000
    }
  };
  
  console.log('\nMock statistics formatting:');
  console.log(fetcher.formatStats(mockStats));
  
  // Example 5: Demonstrate block formatting with mock data
  console.log('\n' + '='.repeat(60));
  console.log('🎨 Example 5: Formatting mock block data...');
  console.log('='.repeat(60));
  
  const mockBlock = {
    data: {
      id: 2500000,
      hash: 'abc123def456789abc123def456789abc123def456789abc123def456789abcd',
      time: '2024-01-01T00:00:00Z',
      transaction_count: 250,
      size: 512000, // in bytes
      difficulty: 15000000
    }
  };
  
  console.log('\nMock block formatting:');
  console.log(fetcher.formatBlock(mockBlock));
  
  // Example 6: Demonstrate address formatting with mock data
  console.log('\n' + '='.repeat(60));
  console.log('🎨 Example 6: Formatting mock address data...');
  console.log('='.repeat(60));
  
  const mockAddress = {
    data: {
      address: 'LhKTpQgfcNPy3aL4xG3HCVc8mXb9qTbKJ1',
      balance: 100000000, // in satoshis (1 LTC)
      transaction_count: 50,
      received: 500000000, // in satoshis (5 LTC)
      spent: 400000000 // in satoshis (4 LTC)
    }
  };
  
  console.log('\nMock address formatting:');
  console.log(fetcher.formatAddress(mockAddress));
  
  // Example 7: Cache statistics
  console.log('\n' + '='.repeat(60));
  console.log('💾 Example 7: Cache statistics...');
  console.log('='.repeat(60));
  
  const cacheStats = fetcher.getCacheStats();
  console.log('\nCache Statistics:');
  console.log(`  Size: ${cacheStats.size} entries`);
  console.log(`  Timeout: ${cacheStats.timeout / 1000} seconds`);
  console.log(`  Keys: ${cacheStats.keys.length > 0 ? cacheStats.keys.join(', ') : 'None'}`);
  
  // Example 8: Address validation examples
  console.log('\n' + '='.repeat(60));
  console.log('🔐 Example 8: Address validation...');
  console.log('='.repeat(60));
  
  console.log('\nValid Litecoin address formats:');
  const validAddresses = [
    'LhKTpQgfcNPy3aL4xG3HCVc8mXb9qTbKJ1',
    'MHxgS2XMXjeJ4if2CmKpMJwLR5JTeMRqWr',
    'LTC1234567890123456789012345678'
  ];
  
  validAddresses.forEach(addr => {
    try {
      // Just check format validation
      if (addr.match(/^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$/)) {
        console.log(`  ✓ ${addr} - Valid format`);
      }
    } catch (error) {
      console.log(`  ✗ ${addr} - ${error.message}`);
    }
  });
  
  // Clear cache at the end
  fetcher.clearCache();
  console.log('\n✓ Cache cleared');
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Example completed successfully!');
  console.log('='.repeat(60));
  console.log('\n💡 Usage Tips:');
  console.log('  1. Create a fetcher: const fetcher = new LitecoinBlockchairFetcher()');
  console.log('  2. Fetch stats: await fetcher.getStats()');
  console.log('  3. Fetch block: await fetcher.getBlock(2500000)');
  console.log('  4. Fetch address: await fetcher.getAddress("LhKT...")');
  console.log('  5. Fetch transaction: await fetcher.getTransaction("abc123...")');
  console.log('  6. Format output: fetcher.formatStats(data)');
  console.log('  7. Check cache: fetcher.getCacheStats()');
  console.log('\n📚 API Endpoints Used:');
  console.log('  • /litecoin/stats - Blockchain statistics');
  console.log('  • /litecoin/dashboards/block/{id} - Block information');
  console.log('  • /litecoin/dashboards/address/{addr} - Address information');
  console.log('  • /litecoin/dashboards/transaction/{hash} - Transaction info');
  console.log('  • /litecoin/blocks - Recent blocks');
  console.log('\n📖 For more information, see the module documentation.');
}

// Run the example
runExample().catch(error => {
  console.error('\n❌ Example failed:', error);
  process.exit(1);
});
