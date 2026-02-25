# Etherscan Contract Verification Module

A Node.js module for verifying smart contracts on Etherscan programmatically using the Etherscan API.

## Features

- ✅ Submit contracts for verification on Etherscan
- 🔍 Check verification status
- 🌐 Support for multiple networks (Ethereum, Sepolia, etc.)
- ✨ Comprehensive parameter validation
- 🛡️ Address validation
- 📝 Support for all Etherscan verification options

## Installation

This module is part of the big-world-bigger-ideas package:

```bash
npm install big-world-bigger-ideas
```

## Quick Start

```javascript
const EtherscanVerifier = require('./etherscan-verify');

// Initialize (loads API key from environment)
const verifier = new EtherscanVerifier();

// Verify a contract
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

// Check verification status
const status = await verifier.checkVerificationStatus(result.guid);
console.log('Status:', status.message);
```

## API Reference

### Constructor

#### `new EtherscanVerifier(apiKey?, apiBaseUrl?)`

Creates a new Etherscan Verifier instance.

**Parameters:**
- `apiKey` (string, optional): Etherscan API key. If not provided, loads from `ETHERSCAN_API_KEY` environment variable
- `apiBaseUrl` (string, optional): Etherscan API base URL. Defaults to `'api.etherscan.io'`

**Example:**
```javascript
// Using environment variable
const verifier = new EtherscanVerifier();

// With custom API key
const verifier = new EtherscanVerifier('YOUR_API_KEY');

// For Sepolia testnet
const verifier = new EtherscanVerifier('YOUR_API_KEY', 'api-sepolia.etherscan.io');
```

### Methods

#### `verifyContract(params)`

Submits a smart contract for verification on Etherscan.

**Parameters:**
- `params.contractAddress` (string, required): The deployed contract address
- `params.sourceCode` (string, required): The Solidity source code
- `params.contractName` (string, required): The contract name
- `params.compilerVersion` (string, required): Compiler version (e.g., `'v0.8.20+commit.a1b79de6'`)
- `params.optimizationUsed` (number, optional): Whether optimization was used (0 or 1). Default: 0
- `params.runs` (number, optional): Number of optimization runs. Default: 200
- `params.constructorArguments` (string, optional): ABI-encoded constructor arguments. Default: ''
- `params.evmVersion` (string, optional): EVM version (e.g., 'paris', 'london'). Default: 'default'
- `params.licenseType` (string, optional): License type (1-14). Default: '1'

**Returns:** Promise<object>
```javascript
{
  status: '1',           // '1' for success, '0' for error
  message: 'OK',         // Status message
  guid: 'unique-guid',   // Verification GUID for status checks
  timestamp: 1234567890  // Unix timestamp
}
```

**Example:**
```javascript
const result = await verifier.verifyContract({
  contractAddress: '0x1234567890123456789012345678901234567890',
  sourceCode: `
    pragma solidity ^0.8.20;
    
    contract MyToken {
        string public name = "MyToken";
        uint256 public totalSupply;
        
        constructor(uint256 _supply) {
            totalSupply = _supply;
        }
    }
  `,
  contractName: 'MyToken',
  compilerVersion: 'v0.8.20+commit.a1b79de6',
  optimizationUsed: 1,
  runs: 200,
  constructorArguments: '0000000000000000000000000000000000000000000000000000000000000064',
  evmVersion: 'paris',
  licenseType: '3' // MIT
});

console.log('GUID:', result.guid);
```

#### `checkVerificationStatus(guid)`

Checks the verification status of a previously submitted contract.

**Parameters:**
- `guid` (string, required): The verification GUID returned by `verifyContract()`

**Returns:** Promise<object>
```javascript
{
  status: '1',                    // '1' for success, '0' for error
  message: 'Pass - Verified',     // Status message
  result: 'Pass - Verified',      // Verification result
  timestamp: 1234567890           // Unix timestamp
}
```

**Possible status messages:**
- `"Pending in queue"` - Verification is queued
- `"Pass - Verified"` - Successfully verified
- `"Fail - Unable to verify"` - Verification failed
- `"Already Verified"` - Contract was already verified

**Example:**
```javascript
const status = await verifier.checkVerificationStatus('your-guid-here');

if (status.message === 'Pass - Verified') {
  console.log('✅ Contract verified successfully!');
} else if (status.message === 'Pending in queue') {
  console.log('⏳ Verification in progress...');
} else {
  console.log('❌ Verification failed:', status.message);
}
```

#### `validateAddress(address)`

Validates an Ethereum address format.

**Parameters:**
- `address` (string): The address to validate

**Returns:** string - Validated address with 0x prefix

**Example:**
```javascript
const addr = verifier.validateAddress('983e3660c0bE01991785F80f266A84B911ab59b0');
console.log(addr); // 0x983e3660c0be01991785f80f266a84b911ab59b0
```

#### `getAPIInfo()`

Gets API configuration information.

**Returns:** object
```javascript
{
  baseUrl: 'api.etherscan.io',
  hasApiKey: true
}
```

## Configuration

### Environment Variables

Set your Etherscan API key as an environment variable:

```bash
export ETHERSCAN_API_KEY=your_api_key_here
```

Or create a `.env` file:
```
ETHERSCAN_API_KEY=your_api_key_here
```

Get your free API key from: https://etherscan.io/apis

### Network Configuration

Different Etherscan networks use different base URLs:

| Network | Base URL |
|---------|----------|
| Ethereum Mainnet | `api.etherscan.io` |
| Sepolia Testnet | `api-sepolia.etherscan.io` |
| Goerli Testnet | `api-goerli.etherscan.io` |

## License Types

| Code | License |
|------|---------|
| 1 | No License (None) |
| 2 | The Unlicense |
| 3 | MIT License |
| 4 | GNU GPLv2 |
| 5 | GNU GPLv3 |
| 6 | GNU LGPLv2.1 |
| 7 | GNU LGPLv3 |
| 8 | BSD-2-Clause |
| 9 | BSD-3-Clause |
| 10 | MPL-2.0 |
| 11 | OSL-3.0 |
| 12 | Apache-2.0 |
| 13 | GNU AGPLv3 |
| 14 | BSL 1.1 |

## Compiler Versions

Compiler versions must be in the format: `v{version}+commit.{commit_hash}`

Examples:
- `v0.8.20+commit.a1b79de6`
- `v0.8.19+commit.7dd6d404`
- `v0.8.18+commit.87f61d96`

Find the complete list at: https://etherscan.io/solcversions

## EVM Versions

Common EVM versions:
- `default` - Compiler default
- `paris` - Current Ethereum mainnet
- `london` - Ethereum with EIP-1559
- `berlin`
- `istanbul`

## Constructor Arguments

Constructor arguments must be ABI-encoded in hexadecimal format without the `0x` prefix.

### Encoding Examples

**uint256:**
```javascript
// Value: 100
// Encoded: 0000000000000000000000000000000000000000000000000000000000000064
```

**address:**
```javascript
// Value: 0x1234567890123456789012345678901234567890
// Encoded: 0000000000000000000000001234567890123456789012345678901234567890
```

**Using ethers.js:**
```javascript
const { ethers } = require('ethers');

// Single uint256
const encoded = ethers.utils.defaultAbiCoder.encode(['uint256'], [100]);
console.log(encoded.slice(2)); // Remove 0x prefix

// Multiple arguments
const encoded = ethers.utils.defaultAbiCoder.encode(
  ['uint256', 'address', 'string'],
  [100, '0x1234...', 'MyToken']
);
console.log(encoded.slice(2));
```

## Error Handling

The module provides detailed error messages for validation and API failures:

```javascript
try {
  const result = await verifier.verifyContract(params);
  console.log('Success:', result.guid);
} catch (error) {
  if (error.message.includes('API key is required')) {
    console.error('Set ETHERSCAN_API_KEY environment variable');
  } else if (error.message.includes('Invalid')) {
    console.error('Validation error:', error.message);
  } else {
    console.error('Verification failed:', error.message);
  }
}
```

## Complete Example

```javascript
const EtherscanVerifier = require('./etherscan-verify');

async function verifyMyContract() {
  // Initialize verifier
  const verifier = new EtherscanVerifier();
  
  // Check API configuration
  const info = verifier.getAPIInfo();
  if (!info.hasApiKey) {
    console.error('Please set ETHERSCAN_API_KEY environment variable');
    return;
  }
  
  try {
    // Submit for verification
    console.log('Submitting contract for verification...');
    const result = await verifier.verifyContract({
      contractAddress: '0x1234567890123456789012345678901234567890',
      sourceCode: `
        pragma solidity ^0.8.20;
        
        contract MyContract {
            uint256 public value;
            
            constructor(uint256 _value) {
                value = _value;
            }
        }
      `,
      contractName: 'MyContract',
      compilerVersion: 'v0.8.20+commit.a1b79de6',
      optimizationUsed: 1,
      runs: 200,
      constructorArguments: '0000000000000000000000000000000000000000000000000000000000000064',
      evmVersion: 'paris',
      licenseType: '3'
    });
    
    console.log('✅ Submitted! GUID:', result.guid);
    
    // Poll for status
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      console.log(`Checking status (attempt ${attempts + 1}/${maxAttempts})...`);
      
      const status = await verifier.checkVerificationStatus(result.guid);
      console.log('Status:', status.message);
      
      if (status.message === 'Pass - Verified') {
        console.log('🎉 Contract verified successfully!');
        break;
      } else if (status.message.includes('Fail')) {
        console.error('❌ Verification failed:', status.message);
        break;
      }
      
      // Wait 5 seconds before next check
      await new Promise(resolve => setTimeout(resolve, 5000));
      attempts++;
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

verifyMyContract();
```

## Testing

Run the tests:
```bash
npm run test:etherscan-verify
```

Run the example:
```bash
npm run etherscan-verify:demo
```

## Related Modules

- [etherscan-token-balance](./ETHERSCAN-TOKEN-BALANCE.md) - Fetch token balances from Etherscan
- [erc721](./ERC721.md) - Interact with ERC-721 NFT contracts
- [erc20](./ERC20.md) - Interact with ERC-20 token contracts
- [contract-abi](./CONTRACT-ABI.md) - Fetch and decode contract ABIs

## Resources

- [Etherscan API Documentation](https://docs.etherscan.io/api-endpoints/contracts#verify-source-code)
- [Get API Key](https://etherscan.io/apis)
- [Compiler Versions](https://etherscan.io/solcversions)
- [Solidity Documentation](https://docs.soliditylang.org/)

## License

ISC
