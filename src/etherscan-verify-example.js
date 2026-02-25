/**
 * Etherscan Contract Verification Example
 * Demonstrates how to verify contracts on Etherscan
 */

const EtherscanVerifier = require('./etherscan-verify');

async function runExample() {
  console.log('Etherscan Contract Verification Example\n');
  console.log('='.repeat(50));

  // Example 1: Initialize with environment variable
  console.log('\n📦 Example 1: Initialize with Environment Variable');
  console.log('─'.repeat(50));
  const verifier = new EtherscanVerifier();
  console.log('Verifier created, checking configuration...');
  const info = verifier.getAPIInfo();
  console.log('API Base URL:', info.baseUrl);
  console.log('Has API Key:', info.hasApiKey ? 'Yes' : 'No (set ETHERSCAN_API_KEY)');

  // Example 2: Initialize with custom API key and network
  console.log('\n\n🔧 Example 2: Initialize with Custom API Key and Network');
  console.log('─'.repeat(50));
  console.log('For Sepolia testnet:');
  const sepoliaVerifier = new EtherscanVerifier('YOUR_API_KEY', 'api-sepolia.etherscan.io');
  const sepoliaInfo = sepoliaVerifier.getAPIInfo();
  console.log('API Base URL:', sepoliaInfo.baseUrl);
  console.log('Custom API key and network have been configured for this verifier.');

  // Example 3: Validate Ethereum addresses
  console.log('\n\n✅ Example 3: Address Validation');
  console.log('─'.repeat(50));
  try {
    const addr1 = verifier.validateAddress('0x983e3660c0bE01991785F80f266A84B911ab59b0');
    console.log('Valid address with 0x:', addr1);

    const addr2 = verifier.validateAddress('983e3660c0bE01991785F80f266A84B911ab59b0');
    console.log('Valid address without 0x:', addr2);
  } catch (error) {
    console.error('Validation error:', error.message);
  }

  // Example 4: Prepare contract verification parameters
  console.log('\n\n📝 Example 4: Contract Verification Parameters');
  console.log('─'.repeat(50));
  const verificationParams = {
    contractAddress: '0xYourContractAddress',
    sourceCode: `pragma solidity ^0.8.20;

contract MyContract {
    uint256 public value;
    
    constructor(uint256 _initialValue) {
        value = _initialValue;
    }
    
    function setValue(uint256 _value) public {
        value = _value;
    }
}`,
    contractName: 'MyContract',
    compilerVersion: 'v0.8.20+commit.a1b79de6',
    optimizationUsed: 1,
    runs: 200,
    constructorArguments: '0000000000000000000000000000000000000000000000000000000000000064', // ABI-encoded 100
    evmVersion: 'paris',
    licenseType: '3' // MIT License
  };

  console.log('Contract Address:', verificationParams.contractAddress);
  console.log('Contract Name:', verificationParams.contractName);
  console.log('Compiler Version:', verificationParams.compilerVersion);
  console.log('Optimization:', verificationParams.optimizationUsed ? `Enabled (${verificationParams.runs} runs)` : 'Disabled');
  console.log('EVM Version:', verificationParams.evmVersion);
  console.log('License Type:', verificationParams.licenseType);

  // Example 5: Submit contract for verification (requires API key)
  console.log('\n\n🚀 Example 5: Submit Contract for Verification');
  console.log('─'.repeat(50));
  console.log('Note: This requires a valid API key and deployed contract');
  console.log('\nCode example:');
  console.log(`
const result = await verifier.verifyContract({
  contractAddress: '0xYourAddress',
  sourceCode: 'pragma solidity ^0.8.20; contract MyContract { ... }',
  contractName: 'MyContract',
  compilerVersion: 'v0.8.20+commit.a1b79de6',
  optimizationUsed: 1,
  runs: 200,
  constructorArguments: '0000...', // ABI-encoded
  evmVersion: 'paris',
  licenseType: '3' // MIT License
});

console.log('Verification GUID:', result.guid);
console.log('Status:', result.status);
console.log('Message:', result.message);
`);

  // Example 6: Check verification status (requires API key and GUID)
  console.log('\n\n🔍 Example 6: Check Verification Status');
  console.log('─'.repeat(50));
  console.log('Note: This requires a valid API key and verification GUID');
  console.log('\nCode example:');
  console.log(`
const status = await verifier.checkVerificationStatus(result.guid);

console.log('Status:', status.status);
console.log('Message:', status.message);
console.log('Result:', status.result);

// Status responses:
// - "Pending in queue"
// - "Pass - Verified"
// - "Fail - Unable to verify"
// - "Already Verified"
`);

  // Example 7: Common license types
  console.log('\n\n📜 Example 7: Common License Types');
  console.log('─'.repeat(50));
  console.log('1  = No License (None)');
  console.log('2  = The Unlicense');
  console.log('3  = MIT License');
  console.log('4  = GNU GPLv2');
  console.log('5  = GNU GPLv3');
  console.log('6  = GNU LGPLv2.1');
  console.log('7  = GNU LGPLv3');
  console.log('8  = BSD-2-Clause');
  console.log('9  = BSD-3-Clause');
  console.log('10 = MPL-2.0');
  console.log('11 = OSL-3.0');
  console.log('12 = Apache-2.0');
  console.log('13 = GNU AGPLv3');
  console.log('14 = BSL 1.1');

  // Example 8: Common compiler versions
  console.log('\n\n🔨 Example 8: Compiler Version Format');
  console.log('─'.repeat(50));
  console.log('Format: v{version}+commit.{commit_hash}');
  console.log('Examples:');
  console.log('  - v0.8.20+commit.a1b79de6');
  console.log('  - v0.8.19+commit.7dd6d404');
  console.log('  - v0.8.18+commit.87f61d96');
  console.log('\nFind exact versions at: https://etherscan.io/solcversions');

  // Example 9: EVM versions
  console.log('\n\n⚙️  Example 9: EVM Versions');
  console.log('─'.repeat(50));
  console.log('Common EVM versions:');
  console.log('  - default (compiler default)');
  console.log('  - paris (Ethereum mainnet current)');
  console.log('  - london (Ethereum with EIP-1559)');
  console.log('  - berlin');
  console.log('  - istanbul');

  // Example 10: Constructor arguments encoding
  console.log('\n\n🔢 Example 10: Constructor Arguments Encoding');
  console.log('─'.repeat(50));
  console.log('Constructor arguments must be ABI-encoded in hex format.');
  console.log('\nExamples:');
  console.log('  uint256(100):');
  console.log('    0000000000000000000000000000000000000000000000000000000000000064');
  console.log('\n  address(0x1234...5678):');
  console.log('    0000000000000000000000001234567890123456789012345678901234567890');
  console.log('\nUse tools like ethers.js or web3.js to encode arguments:');
  console.log('  ethers.utils.defaultAbiCoder.encode(["uint256"], [100])');

  console.log('\n' + '='.repeat(50));
  console.log('\n✅ Example completed!');
  console.log('\nTo verify a real contract:');
  console.log('1. Set ETHERSCAN_API_KEY environment variable');
  console.log('2. Deploy your contract and get its address');
  console.log('3. Use verifyContract() with your parameters');
  console.log('4. Use checkVerificationStatus() to monitor progress');
}

// Run the example
runExample().catch(error => {
  console.error('Example failed:', error);
  process.exit(1);
});
