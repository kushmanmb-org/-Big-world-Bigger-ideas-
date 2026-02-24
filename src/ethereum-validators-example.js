/**
 * Ethereum Validators Module Example
 * Demonstrates how to use the Ethereum Validators fetcher with Beaconcha.in API
 */

const EthereumValidatorsFetcher = require('./ethereum-validators.js');

async function runExample() {
  console.log('🌏 Big World Bigger Ideas - Ethereum Validators Example\n');
  console.log('='.repeat(60));
  
  // Create a fetcher instance
  console.log('\n📦 Creating Ethereum Validators fetcher...');
  
  // Note: In production, use environment variable for API key
  const apiKey = process.env.BEACONCHA_API_KEY || null;
  const fetcher = new EthereumValidatorsFetcher(apiKey);
  
  if (!apiKey) {
    console.log('⚠️  Note: No API key provided. Some features may require authentication.');
    console.log('   Set BEACONCHA_API_KEY environment variable to use authenticated endpoints.');
  } else {
    console.log('✓ Fetcher created with API key');
  }
  
  // Example 1: Fetch single validator by index
  console.log('\n' + '='.repeat(60));
  console.log('📊 Example 1: Fetching validator by index...');
  console.log('='.repeat(60));
  try {
    console.log('\nAttempting to fetch validator 12345...');
    const validator = await fetcher.getValidators(12345);
    console.log('\n✓ Data fetched successfully!');
    console.log('\nFormatted Output:');
    console.log(fetcher.formatValidators(validator));
  } catch (error) {
    console.log(`\n⚠️  Note: ${error.message}`);
    console.log('This is expected in environments without internet access or valid API key.');
    console.log('The module is ready to use in production with network connectivity.\n');
  }
  
  // Example 2: Fetch multiple validators
  console.log('\n' + '='.repeat(60));
  console.log('👥 Example 2: Fetching multiple validators...');
  console.log('='.repeat(60));
  try {
    console.log('\nAttempting to fetch validators 100, 200, 300...');
    const validators = await fetcher.getValidators([100, 200, 300]);
    console.log('\n✓ Multiple validators fetched successfully!');
    console.log('\nSample data structure:');
    console.log(JSON.stringify(validators, null, 2).substring(0, 500) + '...');
  } catch (error) {
    console.log(`\n⚠️  Note: ${error.message}`);
    console.log('This is expected in environments without internet access or valid API key.');
  }
  
  // Example 3: Fetch validator by public key
  console.log('\n' + '='.repeat(60));
  console.log('🔑 Example 3: Fetching validator by public key...');
  console.log('='.repeat(60));
  try {
    // Example public key (this is a mock example)
    const pubkey = '0x' + 'a'.repeat(96);
    console.log(`\nAttempting to fetch validator with pubkey: ${pubkey.substring(0, 20)}...`);
    const validator = await fetcher.getValidators(pubkey);
    console.log('\n✓ Validator fetched by pubkey successfully!');
    console.log('\nSample data structure:');
    console.log(JSON.stringify(validator, null, 2).substring(0, 500) + '...');
  } catch (error) {
    console.log(`\n⚠️  Note: ${error.message}`);
    console.log('This is expected - the example uses a mock public key.');
  }
  
  // Example 4: Fetch validator performance
  console.log('\n' + '='.repeat(60));
  console.log('📈 Example 4: Fetching validator performance...');
  console.log('='.repeat(60));
  try {
    console.log('\nAttempting to fetch performance for validator 12345...');
    const performance = await fetcher.getValidatorPerformance(12345);
    console.log('\n✓ Performance data fetched successfully!');
    console.log('\nFormatted Output:');
    console.log(fetcher.formatPerformance(performance));
  } catch (error) {
    console.log(`\n⚠️  Note: ${error.message}`);
    console.log('This is expected in environments without internet access or valid API key.');
  }
  
  // Example 5: Fetch attestation performance
  console.log('\n' + '='.repeat(60));
  console.log('✅ Example 5: Fetching attestation performance...');
  console.log('='.repeat(60));
  try {
    console.log('\nAttempting to fetch attestations for validator 12345...');
    const attestations = await fetcher.getAttestationPerformance(12345);
    console.log('\n✓ Attestation data fetched successfully!');
    console.log('\nSample data structure:');
    console.log(JSON.stringify(attestations, null, 2).substring(0, 500) + '...');
  } catch (error) {
    console.log(`\n⚠️  Note: ${error.message}`);
    console.log('This is expected in environments without internet access or valid API key.');
  }
  
  // Example 6: Fetch balance history
  console.log('\n' + '='.repeat(60));
  console.log('💰 Example 6: Fetching balance history...');
  console.log('='.repeat(60));
  try {
    console.log('\nAttempting to fetch balance history for validator 12345...');
    const balances = await fetcher.getBalanceHistory(12345);
    console.log('\n✓ Balance history fetched successfully!');
    console.log('\nSample data structure:');
    console.log(JSON.stringify(balances, null, 2).substring(0, 500) + '...');
  } catch (error) {
    console.log(`\n⚠️  Note: ${error.message}`);
    console.log('This is expected in environments without internet access or valid API key.');
  }
  
  // Example 7: Demonstrate formatting with mock data
  console.log('\n' + '='.repeat(60));
  console.log('🎨 Example 7: Formatting mock validator data...');
  console.log('='.repeat(60));
  
  const mockValidatorData = {
    data: [
      {
        validatorindex: 12345,
        pubkey: '0x' + 'abcd'.repeat(24),
        status: 'active_online',
        balance: 32500000000, // 32.5 ETH in Gwei
        effectivebalance: 32000000000, // 32 ETH in Gwei
        slashed: false,
        activationepoch: 0,
        exitepoch: 9999999999
      },
      {
        validatorindex: 67890,
        pubkey: '0x' + '1234'.repeat(24),
        status: 'active_online',
        balance: 33200000000, // 33.2 ETH in Gwei
        effectivebalance: 32000000000,
        slashed: false,
        activationepoch: 1000,
        exitepoch: 9999999999
      }
    ]
  };
  
  console.log('\nMock validator data formatting:');
  console.log(fetcher.formatValidators(mockValidatorData));
  
  // Example 8: Demonstrate performance formatting with mock data
  console.log('\n' + '='.repeat(60));
  console.log('📊 Example 8: Formatting mock performance data...');
  console.log('='.repeat(60));
  
  const mockPerformanceData = {
    data: [
      {
        validatorindex: 12345,
        attestation_efficiency: 99.8,
        proposal_efficiency: 100.0,
        income: 15000000 // Gwei
      }
    ]
  };
  
  console.log('\nMock performance data formatting:');
  console.log(fetcher.formatPerformance(mockPerformanceData));
  
  // Example 9: Cache statistics
  console.log('\n' + '='.repeat(60));
  console.log('💾 Example 9: Cache statistics...');
  console.log('='.repeat(60));
  
  const cacheStats = fetcher.getCacheStats();
  console.log('\nCache Statistics:');
  console.log(`  Size: ${cacheStats.size} entries`);
  console.log(`  Timeout: ${cacheStats.timeout / 1000} seconds`);
  console.log(`  Keys: ${cacheStats.keys.length > 0 ? cacheStats.keys.join(', ') : 'None'}`);
  
  // Example 10: Custom cache timeout
  console.log('\n' + '='.repeat(60));
  console.log('⏰ Example 10: Setting custom cache timeout...');
  console.log('='.repeat(60));
  
  console.log('\nDefault cache timeout: 60 seconds');
  fetcher.setCacheTimeout(30000); // 30 seconds
  console.log('✓ Cache timeout updated to 30 seconds');
  
  // Clear cache at the end
  fetcher.clearCache();
  console.log('\n✓ Cache cleared');
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Example completed successfully!');
  console.log('='.repeat(60));
  console.log('\n💡 Usage Tips:');
  console.log('  1. Create fetcher: const fetcher = new EthereumValidatorsFetcher(apiKey)');
  console.log('  2. Fetch by index: await fetcher.getValidators(12345)');
  console.log('  3. Fetch multiple: await fetcher.getValidators([100, 200, 300])');
  console.log('  4. Fetch by pubkey: await fetcher.getValidators("0x...")');
  console.log('  5. Get performance: await fetcher.getValidatorPerformance(12345)');
  console.log('  6. Format output: fetcher.formatValidators(data)');
  console.log('  7. Check cache: fetcher.getCacheStats()');
  console.log('\n🔑 API Key:');
  console.log('  Get your free API key from: https://beaconcha.in/pricing');
  console.log('  Set environment variable: export BEACONCHA_API_KEY=your_key_here');
  console.log('\n📚 For more information, see the module documentation.');
}

// Run the example
runExample().catch(error => {
  console.error('\n❌ Example failed:', error);
  process.exit(1);
});
