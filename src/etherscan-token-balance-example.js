/**
 * Etherscan Token Balance Fetcher Demo
 * Demonstrates fetching token balances from Etherscan API
 */

const EtherscanTokenBalanceFetcher = require('./etherscan-token-balance.js');

console.log('='.repeat(70));
console.log('🪙 Etherscan Token Balance Fetcher Demo');
console.log('='.repeat(70));

// Demo address from the problem statement
const demoAddress = '0x983e3660c0bE01991785F80f266A84B911ab59b0';

// Demo 1: Create fetcher instance
console.log('\n📦 Creating Token Balance Fetcher:\n');

// IMPORTANT: Use environment variable for API key or replace with your key
// Get from environment variable first, fallback to placeholder
const apiKey = process.env.ETHERSCAN_API_KEY || 'YourApiKeyToken';
const chainId = 1; // Ethereum mainnet

const fetcher = new EtherscanTokenBalanceFetcher(apiKey, chainId);
console.log(`✓ Created fetcher for chain ID ${chainId}`);
console.log(`✓ API Base URL: ${fetcher.apiBaseUrl}`);

// Demo 2: Get API information
console.log('\n' + '='.repeat(70));
console.log('\n📡 API Configuration:\n');

const apiInfo = fetcher.getAPIInfo();
console.log(`Base URL: ${apiInfo.baseUrl}`);
console.log(`Chain ID: ${apiInfo.chainId}`);
const apiKeyStatus = apiInfo.hasApiKey ? 'configured' : 'not configured';
console.log(`API Key Status: ${apiKeyStatus}`);
console.log(`Cache Timeout: ${apiInfo.cacheTimeout}ms`);

// Demo 3: Validate address
console.log('\n' + '='.repeat(70));
console.log('\n✅ Validating Ethereum Address:\n');

try {
  const validatedAddress = fetcher.validateAddress(demoAddress);
  console.log(`Original: ${demoAddress}`);
  console.log(`Validated: ${validatedAddress}`);
  console.log('✓ Address is valid!');
} catch (error) {
  console.error(`✗ Address validation failed: ${error.message}`);
}

// Demo 4: Fetch token balances (requires valid API key and network connection)
console.log('\n' + '='.repeat(70));
console.log('\n🔍 Fetching Token Balances:\n');
console.log('Note: This requires a valid Etherscan API key and network connection.\n');

async function fetchTokenBalances() {
  try {
    console.log(`Fetching token balances for: ${demoAddress}`);
    console.log('Please wait...\n');

    // Fetch first page with 100 results per page
    const balances = await fetcher.getTokenBalances(demoAddress, 1, 100);

    console.log('✓ Successfully fetched token balances!\n');
    console.log('='.repeat(70));
    console.log(fetcher.formatTokenBalances(balances));
    console.log('='.repeat(70));

    // Demo 5: Filter tokens by type
    if (balances.tokens && balances.tokens.length > 0) {
      console.log('\n🔍 Filtering Tokens by Type:\n');

      const erc20Tokens = EtherscanTokenBalanceFetcher.filterTokensByType(
        balances.tokens,
        'ERC-20'
      );
      console.log(`ERC-20 Tokens: ${erc20Tokens.length}`);

      const erc721Tokens = EtherscanTokenBalanceFetcher.filterTokensByType(
        balances.tokens,
        'ERC-721'
      );
      console.log(`ERC-721 Tokens (NFTs): ${erc721Tokens.length}`);

      // Demo 6: Show token details
      if (erc20Tokens.length > 0) {
        console.log('\n💰 Sample ERC-20 Token:\n');
        const sample = erc20Tokens[0];
        console.log(`  Name: ${sample.TokenName || 'N/A'}`);
        console.log(`  Symbol: ${sample.TokenSymbol || 'N/A'}`);
        console.log(`  Balance: ${sample.TokenQuantity || 'N/A'}`);
        console.log(`  Contract: ${sample.TokenAddress || 'N/A'}`);
      }

      if (erc721Tokens.length > 0) {
        console.log('\n🎨 Sample ERC-721 Token (NFT):\n');
        const sample = erc721Tokens[0];
        console.log(`  Name: ${sample.TokenName || 'N/A'}`);
        console.log(`  Symbol: ${sample.TokenSymbol || 'N/A'}`);
        console.log(`  Token ID: ${sample.TokenId || 'N/A'}`);
        console.log(`  Contract: ${sample.TokenAddress || 'N/A'}`);
      }
    }

    // Demo 7: Cache statistics
    console.log('\n' + '='.repeat(70));
    console.log('\n📊 Cache Statistics:\n');
    const cacheStats = fetcher.getCacheStats();
    console.log(`Cache Size: ${cacheStats.size} entries`);
    console.log(`Cache Timeout: ${cacheStats.timeout}ms`);
    console.log(`Cached Keys: ${cacheStats.keys.length}`);

    // Demo 8: Fetch again (should use cache)
    console.log('\n' + '='.repeat(70));
    console.log('\n🔄 Fetching Again (Using Cache):\n');
    const cachedBalances = await fetcher.getTokenBalances(demoAddress, 1, 100);
    console.log('✓ Retrieved from cache!');
    console.log(`Total Tokens: ${cachedBalances.tokens.length}`);

  } catch (error) {
    console.error(`\n❌ Error: ${error.message}\n`);
    console.log('Common Issues:');
    console.log('  1. Invalid or missing Etherscan API key');
    console.log('  2. Network connection issues');
    console.log('  3. Rate limiting (too many requests)');
    console.log('  4. Invalid address format\n');
    console.log('To get an Etherscan API key:');
    console.log('  1. Visit https://etherscan.io/');
    console.log('  2. Create a free account');
    console.log('  3. Generate an API key in your account settings');
  }
}

// Demo 9: Show example data format
console.log('\n' + '='.repeat(70));
console.log('\n📋 Expected Data Format:\n');
console.log(`
{
  "address": "0x983e3660c0be01991785f80f266a84b911ab59b0",
  "chainId": 1,
  "page": 1,
  "offset": 100,
  "tokens": [
    {
      "TokenAddress": "0x...",
      "TokenName": "Token Name",
      "TokenSymbol": "SYMBOL",
      "TokenQuantity": "1000000000000000000",
      "TokenDivisor": "18",
      "TokenType": "ERC-20"
    },
    ...
  ],
  "status": "1",
  "message": "OK",
  "timestamp": 1234567890
}
`);

// Run the demo
console.log('='.repeat(70));
console.log('\n▶️  Starting Token Balance Fetch Demo...\n');

fetchTokenBalances().then(() => {
  console.log('\n' + '='.repeat(70));
  console.log('\n✨ Demo Complete!');
  console.log('='.repeat(70));
}).catch(error => {
  console.error('\n💥 Demo failed:', error.message);
});
