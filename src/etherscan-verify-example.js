/**
 * Etherscan Contract Verification Example
 * Demonstrates how to verify contracts on Etherscan using the API
 * with secure key management practices
 */

const EtherscanVerifier = require('./etherscan-verify');

console.log('🔍 Etherscan Contract Verification Demo\n');
console.log('='.repeat(70));

// SECURITY NOTE: Always use environment variables for API keys
// Never hardcode API keys in your source code
const apiKey = process.env.ETHERSCAN_API_KEY;

if (!apiKey) {
  console.log('\n⚠️  Warning: ETHERSCAN_API_KEY environment variable not set');
  console.log('This demo will show examples without making actual API calls.\n');
  console.log('To use this module with real API calls:');
  console.log('  1. Get a free API key from https://etherscan.io/apis');
  console.log('  2. Set environment variable: export ETHERSCAN_API_KEY="your-key"');
  console.log('  3. Run this demo again\n');
}

// Example 1: Initialize the verifier
console.log('\n📋 Example 1: Initialize the Verifier\n');
const verifier = new EtherscanVerifier(apiKey, 1); // 1 = Ethereum mainnet

console.log('Verifier created:');
const apiInfo = verifier.getAPIInfo();
console.log('  Chain ID:', apiInfo.chainId);
console.log('  API Base URL:', apiInfo.baseUrl);
console.log('  Has API Key:', apiInfo.hasApiKey);

const keyInfo = verifier.getAPIKeyInfo();
console.log('\nAPI Key Security Info:');
console.log('  Has Key:', keyInfo.hasApiKey);
if (keyInfo.hasApiKey) {
  console.log('  Key Preview:', keyInfo.keyPreview, '(redacted for security)');
  console.log('  Key Length:', keyInfo.keyLength);
}
console.log('  Recommendation:', keyInfo.recommendation);

// Example 2: Address validation
console.log('\n\n📋 Example 2: Address Validation\n');

const addresses = [
  '0xA9D1e08C7793af67e9d92fe308d5697FB81d3E43', // Valid with 0x
  'A9D1e08C7793af67e9d92fe308d5697FB81d3E43',   // Valid without 0x
  '0x123',                                       // Invalid - too short
];

addresses.forEach(addr => {
  try {
    const validated = verifier.validateAddress(addr);
    console.log(`✓ Valid: ${addr}`);
    console.log(`  Normalized: ${validated}`);
  } catch (error) {
    console.log(`✗ Invalid: ${addr}`);
    console.log(`  Error: ${error.message}`);
  }
});

// Example 3: Encode constructor arguments
console.log('\n\n📋 Example 3: Encode Constructor Arguments\n');

console.log('Example 1: Single address parameter');
const encoded1 = EtherscanVerifier.encodeConstructorArguments(
  ['address'],
  ['0xA9D1e08C7793af67e9d92fe308d5697FB81d3E43']
);
console.log('  Types: ["address"]');
console.log('  Values: ["0xA9D1e08C7793af67e9d92fe308d5697FB81d3E43"]');
console.log('  Encoded:', encoded1);

console.log('\nExample 2: Multiple parameters (address + uint256)');
const encoded2 = EtherscanVerifier.encodeConstructorArguments(
  ['address', 'uint256'],
  ['0xA9D1e08C7793af67e9d92fe308d5697FB81d3E43', '1000000']
);
console.log('  Types: ["address", "uint256"]');
console.log('  Values: ["0xA9D1e08C7793af67e9d92fe308d5697FB81d3E43", "1000000"]');
console.log('  Encoded:', encoded2);

console.log('\nExample 3: Boolean parameter');
const encoded3 = EtherscanVerifier.encodeConstructorArguments(
  ['bool'],
  [true]
);
console.log('  Types: ["bool"]');
console.log('  Values: [true]');
console.log('  Encoded:', encoded3);

// Example 4: Verify a contract (demonstration only)
console.log('\n\n📋 Example 4: Verify a Contract (Demonstration)\n');

const verificationOptions = {
  contractAddress: '0xA9D1e08C7793af67e9d92fe308d5697FB81d3E43',
  sourceCode: `
pragma solidity ^0.8.20;

contract SimpleStorage {
    uint256 private value;
    
    constructor(uint256 _initialValue) {
        value = _initialValue;
    }
    
    function setValue(uint256 _value) public {
        value = _value;
    }
    
    function getValue() public view returns (uint256) {
        return value;
    }
}
  `,
  contractName: 'SimpleStorage',
  compilerVersion: 'v0.8.20+commit.a1b79de6',
  optimizationUsed: 1,
  runs: 200,
  constructorArguments: encoded1,
  evmVersion: 'paris',
  licenseType: '3' // MIT License
};

console.log('Contract Verification Options:');
console.log('  Contract Address:', verificationOptions.contractAddress);
console.log('  Contract Name:', verificationOptions.contractName);
console.log('  Compiler Version:', verificationOptions.compilerVersion);
console.log('  Optimization:', verificationOptions.optimizationUsed ? 'Enabled' : 'Disabled');
console.log('  Runs:', verificationOptions.runs);
console.log('  Constructor Args:', verificationOptions.constructorArguments.substring(0, 20) + '...');
console.log('  EVM Version:', verificationOptions.evmVersion);
console.log('  License:', verificationOptions.licenseType === '3' ? 'MIT' : 'Other');

if (apiKey) {
  console.log('\n⚠️  Skipping actual API call in demo mode.');
  console.log('To verify the contract, call:');
  console.log('  const result = await verifier.verifyContract(verificationOptions);');
} else {
  console.log('\n⚠️  API key not set - cannot make actual API calls.');
}

// Example 5: Check verification status (demonstration)
console.log('\n\n📋 Example 5: Check Verification Status (Demonstration)\n');

const sampleGuid = 'example-guid-12345';
console.log('After submitting verification, you receive a GUID.');
console.log('Use the GUID to check verification status:');
console.log(`  const status = await verifier.checkVerificationStatus("${sampleGuid}");`);
console.log('\nStatus response will include:');
console.log('  - status: "verified" or "pending"');
console.log('  - message: Status message from Etherscan');
console.log('  - guid: Your verification GUID');

// Example 6: Bytecode verification
console.log('\n\n📋 Example 6: Bytecode Verification\n');

// Sample bytecode from the issue (multisig wallet)
const sampleBytecode = '0x606060405236156100b95760e060020a6000350463173825d9811461010b';
console.log('Bytecode verification allows you to verify that deployed bytecode');
console.log('matches your expected bytecode without source code.');
console.log('\nExample bytecode:', sampleBytecode.substring(0, 40) + '...');
console.log('\nTo verify bytecode:');
console.log('  const result = await verifier.verifyBytecode(address, bytecode);');
console.log('\nResult will show:');
console.log('  - match: true/false');
console.log('  - onChainBytecode: Actual bytecode from blockchain');
console.log('  - providedBytecode: Your provided bytecode');

// Example 7: Multi-chain support
console.log('\n\n📋 Example 7: Multi-Chain Support\n');

const chains = [
  { id: 1, name: 'Ethereum Mainnet', url: 'api.etherscan.io' },
  { id: 8453, name: 'Base', url: 'api.basescan.org' },
  { id: 137, name: 'Polygon', url: 'api.polygonscan.com' },
  { id: 42161, name: 'Arbitrum One', url: 'api.arbiscan.io' },
  { id: 10, name: 'Optimism', url: 'api-optimistic.etherscan.io' }
];

console.log('Supported chains:');
chains.forEach(chain => {
  const chainVerifier = new EtherscanVerifier(apiKey, chain.id);
  console.log(`  ${chain.name} (ID: ${chain.id})`);
  console.log(`    API URL: ${chainVerifier.apiBaseUrl}`);
});

// Example 8: Get contract ABI (for verified contracts)
console.log('\n\n📋 Example 8: Get Contract ABI\n');

console.log('For verified contracts, you can fetch the ABI:');
console.log('  const abiData = await verifier.getContractABI(contractAddress);');
console.log('\nResponse includes:');
console.log('  - address: Contract address');
console.log('  - abi: Contract ABI (as JSON)');
console.log('  - chainId: Chain ID');

// Example 9: Get contract source code (for verified contracts)
console.log('\n\n📋 Example 9: Get Contract Source Code\n');

console.log('For verified contracts, you can fetch the source code:');
console.log('  const sourceData = await verifier.getContractSourceCode(contractAddress);');
console.log('\nResponse includes:');
console.log('  - sourceCode: Contract source code');
console.log('  - contractName: Contract name');
console.log('  - compilerVersion: Compiler version used');
console.log('  - optimizationUsed: Whether optimization was enabled');
console.log('  - constructorArguments: Constructor arguments');
console.log('  - and more metadata...');

// Security best practices
console.log('\n\n📋 Security Best Practices\n');

console.log('✅ DO:');
console.log('  1. Store API keys in environment variables');
console.log('     export ETHERSCAN_API_KEY="your-key-here"');
console.log('  2. Use .env files with .gitignore');
console.log('  3. Never commit API keys to version control');
console.log('  4. Use key preview/redaction in logs');
console.log('  5. Rotate API keys periodically');

console.log('\n❌ DON\'T:');
console.log('  1. Hardcode API keys in source code');
console.log('  2. Log full API keys to console');
console.log('  3. Share API keys in public repositories');
console.log('  4. Use production keys in development');
console.log('  5. Embed keys in client-side code');

// Summary
console.log('\n' + '='.repeat(70));
console.log('\n🎉 Demo Complete!\n');

if (apiKey) {
  console.log('You have an API key set. You can now:');
  console.log('  - Verify contracts with verifyContract()');
  console.log('  - Check verification status with checkVerificationStatus()');
  console.log('  - Get contract ABIs with getContractABI()');
  console.log('  - Get source code with getContractSourceCode()');
  console.log('  - Verify bytecode with verifyBytecode()');
} else {
  console.log('To use this module with real API calls:');
  console.log('  1. Get a free API key from https://etherscan.io/apis');
  console.log('  2. Set environment variable: export ETHERSCAN_API_KEY="your-key"');
  console.log('  3. Run your verification scripts');
}

console.log('\nFor more information:');
console.log('  - See src/ETHERSCAN-VERIFY.md for full documentation');
console.log('  - See src/etherscan-verify.test.js for test examples');
console.log('  - See SECURITY-GUIDE.md for security best practices');
console.log('\n' + '='.repeat(70));
