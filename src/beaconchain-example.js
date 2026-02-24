/**
 * Beacon Chain Fetcher Example
 * 
 * Demonstrates how to use the BeaconChainFetcher to query Ethereum Beacon Chain
 * data with pagination support for kushmanmb.eth and other addresses.
 */

const BeaconChainFetcher = require('./beaconchain.js');

async function main() {
  console.log('Beacon Chain Fetcher Example\n');
  console.log('='.repeat(70));

  // Create a fetcher instance
  const fetcher = new BeaconChainFetcher();

  console.log('\n📊 API Information:');
  console.log(JSON.stringify(fetcher.getAPIInfo(), null, 2));

  // Example 1: Query validators for kushmanmb.eth with pagination
  console.log('\n\n🔍 Example 1: Get validators for kushmanmb.eth (Page 0, Limit 10)');
  console.log('-'.repeat(70));
  
  try {
    // Note: This is a demonstration. In production, you would use the actual
    // Ethereum address that kushmanmb.eth resolves to, or the API would handle
    // ENS resolution internally.
    console.log('Querying validators for kushmanmb.eth...');
    console.log('(This example shows the structure - actual API call would be made)');
    
    // Example structure of what would be returned:
    const exampleData = {
      address: 'kushmanmb.eth',
      page: 0,
      limit: 10,
      offset: 0,
      validators: [
        {
          validatorindex: 123456,
          pubkey: '0x1234567890abcdef...',
          balance: 32000000000,
          status: 'active',
          activationepoch: 100
        }
      ],
      status: 'OK',
      timestamp: Date.now()
    };
    
    console.log('\nFormatted output:');
    console.log(fetcher.formatValidatorData(exampleData));
  } catch (error) {
    console.error('Error:', error.message);
  }

  // Example 2: Demonstrate pagination for different pages
  console.log('\n\n📄 Example 2: Pagination demonstration');
  console.log('-'.repeat(70));
  
  const testAddress = '0x1234567890123456789012345678901234567890';
  
  console.log(`Address: ${testAddress}`);
  console.log('\nPagination parameters:');
  console.log('  Page 0, Limit 10 → Offset: 0-9');
  console.log('  Page 1, Limit 10 → Offset: 10-19');
  console.log('  Page 2, Limit 10 → Offset: 20-29');
  console.log('\nTo fetch different pages:');
  console.log('  fetcher.getValidatorsByAddress(address, 0, 10) // First 10 validators');
  console.log('  fetcher.getValidatorsByAddress(address, 1, 10) // Next 10 validators');
  console.log('  fetcher.getValidatorsByAddress(address, 2, 10) // Next 10 validators');

  // Example 3: Filtering validators
  console.log('\n\n🔎 Example 3: Filtering validators by status');
  console.log('-'.repeat(70));
  
  const mockValidators = [
    { validatorindex: 1, status: 'active', balance: 32000000000 },
    { validatorindex: 2, status: 'pending', balance: 32000000000 },
    { validatorindex: 3, status: 'active', balance: 32500000000 },
    { validatorindex: 4, status: 'exited', balance: 0 },
    { validatorindex: 5, status: 'active', balance: 33000000000 }
  ];

  console.log('Total validators:', mockValidators.length);
  
  const activeValidators = BeaconChainFetcher.filterValidatorsByStatus(mockValidators, 'active');
  console.log('Active validators:', activeValidators.length);
  
  const pendingValidators = BeaconChainFetcher.filterValidatorsByStatus(mockValidators, 'pending');
  console.log('Pending validators:', pendingValidators.length);
  
  const exitedValidators = BeaconChainFetcher.filterValidatorsByStatus(mockValidators, 'exited');
  console.log('Exited validators:', exitedValidators.length);

  // Example 4: Cache statistics
  console.log('\n\n💾 Example 4: Cache management');
  console.log('-'.repeat(70));
  
  console.log('Cache statistics:', fetcher.getCacheStats());
  console.log('\nCache timeout: 60 seconds');
  console.log('To clear cache: fetcher.clearCache()');

  // Example 5: Get validator performance with pagination
  console.log('\n\n📈 Example 5: Validator performance pagination');
  console.log('-'.repeat(70));
  
  console.log('Fetch performance data for a specific validator:');
  console.log('  fetcher.getValidatorPerformance(validatorIndex, page, limit)');
  console.log('\nExample:');
  console.log('  fetcher.getValidatorPerformance(123456, 0, 50) // First 50 records');
  console.log('  fetcher.getValidatorPerformance(123456, 1, 50) // Next 50 records');

  // Example 6: Get recent blocks with pagination
  console.log('\n\n🧱 Example 6: Recent blocks pagination');
  console.log('-'.repeat(70));
  
  console.log('Fetch recent blocks:');
  console.log('  fetcher.getRecentBlocks(page, limit)');
  console.log('\nExample:');
  console.log('  fetcher.getRecentBlocks(0, 20) // First 20 blocks');
  console.log('  fetcher.getRecentBlocks(1, 20) // Next 20 blocks');

  // Example 7: Complete workflow for kushmanmb.eth
  console.log('\n\n🎯 Example 7: Complete workflow for kushmanmb.eth');
  console.log('-'.repeat(70));
  
  console.log(`
1. Fetch validators for kushmanmb.eth (or resolved address)
   const data = await fetcher.getValidatorsByAddress('kushmanmb.eth', 0, 100);

2. Filter active validators
   const active = BeaconChainFetcher.filterValidatorsByStatus(data.validators, 'active');

3. Get detailed info for each validator
   for (const validator of active) {
     const details = await fetcher.getValidatorByIndex(validator.validatorindex);
     console.log(details);
   }

4. Fetch performance data with pagination
   const performance = await fetcher.getValidatorPerformance(
     active[0].validatorindex,
     0,  // page
     100 // limit
   );

5. Navigate through pages
   for (let page = 0; page < 5; page++) {
     const pageData = await fetcher.getValidatorsByAddress('kushmanmb.eth', page, 100);
     console.log(\`Page \${page}: \${pageData.validators.length} validators\`);
   }
  `);

  console.log('\n✅ Example completed!');
  console.log('\nNote: Actual API calls require a valid address and network connection.');
  console.log('For production use with kushmanmb.eth, resolve the ENS name to an');
  console.log('Ethereum address first, or use an API that supports ENS resolution.\n');
}

// Run the example
main().catch(console.error);
