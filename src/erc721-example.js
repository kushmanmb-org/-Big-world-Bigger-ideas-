/**
 * Example usage of ERC-721 Token Fetching functionality
 * This demonstrates how to interact with ERC-721 (NFT) contracts
 */

const ERC721Fetcher = require('./erc721');

console.log('🎨 ERC-721 Token Fetcher Demo\n');
console.log('='.repeat(50));

// Example NFT contract addresses (for demonstration)
const EXAMPLE_CONTRACTS = {
  cryptoPunks: '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB',
  boredApes: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
  // This is a made-up address for demo purposes
  demoNFT: '0x1234567890123456789012345678901234567890'
};

const EXAMPLE_ADDRESSES = {
  alice: '0xabcdefabcdef1234567890abcdefabcdef123456',
  bob: '0x9876543210987654321098765432109876543210'
};

async function runDemo() {
  try {
    console.log('\n📝 1. Creating ERC-721 Fetcher Instance');
    console.log('-'.repeat(50));
    const fetcher = new ERC721Fetcher(EXAMPLE_CONTRACTS.demoNFT);
    console.log(`✓ Created fetcher for contract: ${fetcher.contractAddress}`);

    console.log('\n📊 2. Getting Collection Information');
    console.log('-'.repeat(50));
    const name = await fetcher.getCollectionName();
    console.log(`Collection Name: ${name.name || '(Not fetched - demo mode)'}`);
    console.log(`Function Signature: ${name.abi.signature}`);

    const symbol = await fetcher.getCollectionSymbol();
    console.log(`Collection Symbol: ${symbol.symbol || '(Not fetched - demo mode)'}`);
    console.log(`Function Signature: ${symbol.abi.signature}`);

    const totalSupply = await fetcher.getTotalSupply();
    console.log(`Total Supply: ${totalSupply.totalSupply || '(Not fetched - demo mode)'}`);
    console.log(`Function Signature: ${totalSupply.abi.signature}`);

    console.log('\n💰 3. Checking Token Balance');
    console.log('-'.repeat(50));
    const balance = await fetcher.getBalance(EXAMPLE_ADDRESSES.alice);
    console.log(`Owner: ${balance.owner}`);
    console.log(`Balance: ${balance.balance} tokens`);
    console.log(`Method: ${balance.method}`);
    console.log(`Function Signature: ${balance.abi.signature}`);

    console.log('\n🎭 4. Getting Token Ownership');
    console.log('-'.repeat(50));
    const tokenId = 123;
    const owner = await fetcher.getOwner(tokenId);
    console.log(`Token ID: ${owner.tokenId}`);
    console.log(`Owner: ${owner.owner}`);
    console.log(`Method: ${owner.method}`);
    console.log(`Function Signature: ${owner.abi.signature}`);

    console.log('\n🔗 5. Getting Token URI');
    console.log('-'.repeat(50));
    const uri = await fetcher.getTokenURI(tokenId);
    console.log(`Token ID: ${uri.tokenId}`);
    console.log(`URI: ${uri.uri || '(Not fetched - demo mode)'}`);
    console.log(`Method: ${uri.method}`);
    console.log(`Function Signature: ${uri.abi.signature}`);

    console.log('\n📄 6. Getting Token Metadata');
    console.log('-'.repeat(50));
    const metadata = await fetcher.getTokenMetadata(tokenId);
    console.log(`Token ID: ${metadata.tokenId}`);
    console.log(`Name: ${metadata.name || '(Not fetched - demo mode)'}`);
    console.log(`Description: ${metadata.description || '(Not fetched - demo mode)'}`);
    console.log(`Image: ${metadata.image || '(Not fetched - demo mode)'}`);
    console.log(`Attributes: ${metadata.attributes.length} attributes`);

    console.log('\n🔍 7. Verifying Token Ownership');
    console.log('-'.repeat(50));
    const verification = await fetcher.verifyOwnership(EXAMPLE_ADDRESSES.alice, tokenId);
    console.log(`Address: ${verification.owner}`);
    console.log(`Token ID: ${verification.tokenId}`);
    console.log(`Is Owner: ${verification.isOwner}`);

    console.log('\n📦 8. Getting Complete Token Information');
    console.log('-'.repeat(50));
    const tokenInfo = await fetcher.getTokenInfo(456);
    console.log(`Token ID: ${tokenInfo.tokenId}`);
    console.log(`Owner: ${tokenInfo.owner}`);
    console.log(`URI: ${tokenInfo.uri || '(Not fetched - demo mode)'}`);
    console.log(`Metadata:`, tokenInfo.metadata);

    console.log('\n🔧 9. Working with ABI Information');
    console.log('-'.repeat(50));
    const balanceOfABI = ERC721Fetcher.getABI('balanceOf');
    console.log(`Function: ${balanceOfABI.name}`);
    console.log(`Signature: ${balanceOfABI.signature}`);
    console.log(`Inputs:`, balanceOfABI.inputs);
    console.log(`Outputs:`, balanceOfABI.outputs);

    console.log('\n📚 10. Available ERC-721 Functions');
    console.log('-'.repeat(50));
    const allABIs = ERC721Fetcher.getAllABIs();
    const functionNames = Object.keys(allABIs);
    console.log(`Available functions: ${functionNames.length}`);
    functionNames.forEach(name => {
      const abi = allABIs[name];
      console.log(`  - ${name}() [${abi.signature}]`);
    });

    console.log('\n💡 11. Address Validation Examples');
    console.log('-'.repeat(50));
    try {
      // Valid address with 0x prefix
      const valid1 = fetcher.validateAddress('0xabcdefABCDEF1234567890abcdefABCDEF123456');
      console.log(`✓ Valid address (with 0x): ${valid1}`);

      // Valid address without 0x prefix
      const valid2 = fetcher.validateAddress('1234567890123456789012345678901234567890');
      console.log(`✓ Valid address (without 0x): ${valid2}`);

      // Invalid address - will throw error
      try {
        fetcher.validateAddress('invalid');
      } catch (error) {
        console.log(`✗ Invalid address rejected: ${error.message}`);
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }

    console.log('\n💡 12. Token ID Validation Examples');
    console.log('-'.repeat(50));
    try {
      // Valid token IDs
      console.log(`✓ Valid token ID (number): ${fetcher.validateTokenId(123)}`);
      console.log(`✓ Valid token ID (string): ${fetcher.validateTokenId('456')}`);
      console.log(`✓ Valid token ID (zero): ${fetcher.validateTokenId(0)}`);
      console.log(`✓ Valid token ID (large): ${fetcher.validateTokenId('999999999999999')}`);

      // Invalid token ID - will throw error
      try {
        fetcher.validateTokenId('abc');
      } catch (error) {
        console.log(`✗ Invalid token ID rejected: ${error.message}`);
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }

    console.log('\n🗂️ 13. Cache Management');
    console.log('-'.repeat(50));
    console.log('Fetching metadata (will be cached)...');
    await fetcher.getTokenMetadata(999);
    console.log('✓ Metadata cached');

    console.log('Fetching same metadata again (from cache)...');
    await fetcher.getTokenMetadata(999);
    console.log('✓ Retrieved from cache');

    console.log('Clearing cache...');
    fetcher.clearCache();
    console.log('✓ Cache cleared');

    console.log('\n📡 14. Using with Different Networks');
    console.log('-'.repeat(50));
    console.log('You can connect to different networks by providing RPC URLs:');
    console.log('');
    console.log('// Ethereum Mainnet');
    console.log('const mainnetFetcher = new ERC721Fetcher(');
    console.log('  \'0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D\',');
    console.log('  \'https://ethereum.publicnode.com\'');
    console.log(');');
    console.log('');
    console.log('// Base Mainnet');
    console.log('const baseFetcher = new ERC721Fetcher(');
    console.log('  \'0x1234567890123456789012345678901234567890\',');
    console.log('  \'https://mainnet.base.org\'');
    console.log(');');

    console.log('\n' + '='.repeat(50));
    console.log('✅ ERC-721 Fetcher Demo Completed Successfully!');
    console.log('='.repeat(50));
    console.log('\n📚 Next Steps:');
    console.log('  1. Connect to a real RPC endpoint to fetch live data');
    console.log('  2. Integrate with ethers.js or web3.js for blockchain calls');
    console.log('  3. Add IPFS support for metadata fetching');
    console.log('  4. Implement caching strategies for production use');
    console.log('');
    console.log('💡 Note: This is a skeleton implementation showing the structure');
    console.log('   and API design. To fetch real blockchain data, you need to:');
    console.log('   - Add a Web3 provider (ethers.js, web3.js, etc.)');
    console.log('   - Make actual RPC calls to the blockchain');
    console.log('   - Handle network errors and retries');
    console.log('');

  } catch (error) {
    console.error('\n❌ Error in demo:', error.message);
    console.error(error.stack);
  }
}

// Run the demo
runDemo();
