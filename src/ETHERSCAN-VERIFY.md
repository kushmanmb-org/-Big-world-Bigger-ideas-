# Etherscan Contract Verification

This module provides comprehensive functionality to verify and publish smart contracts on Etherscan and other block explorers using their APIs. It implements secure key management practices and supports multiple EVM-compatible blockchains.

## Features

- **Contract Verification**: Verify contracts with source code on Etherscan
- **Bytecode Verification**: Verify deployed bytecode matches expected bytecode
- **Multi-Chain Support**: Works with Ethereum, Base, Polygon, Arbitrum, Optimism, and more
- **Constructor Arguments Encoding**: Helper to encode constructor arguments for verification
- **Secure API Key Management**: Environment variable loading and key redaction
- **Verification Status Checking**: Track verification progress with GUID
- **Contract ABI Fetching**: Retrieve ABIs for verified contracts
- **Source Code Fetching**: Get source code and metadata for verified contracts
- **Caching**: Built-in caching to reduce API calls and improve performance

## Security Best Practices

This module implements several security best practices:

1. **Environment Variable Loading**: API keys are loaded from `ETHERSCAN_API_KEY` environment variable
2. **Key Redaction**: API keys are never fully displayed in logs or info methods
3. **Secure Key Preview**: Only first and last 4 characters shown when displaying key info
4. **No Hardcoded Keys**: Module encourages use of environment variables over hardcoded keys
5. **Clear Security Recommendations**: Built-in methods provide security guidance

## Installation

This module is part of the Big World Bigger Ideas blockchain utilities package.

```javascript
const EtherscanVerifier = require('./etherscan-verify.js');
```

## Quick Start

### Setting Up API Key

**SECURITY: Never hardcode API keys in your source code!**

```bash
# Set environment variable (recommended)
export ETHERSCAN_API_KEY="your-etherscan-api-key-here"

# Or use a .env file
echo "ETHERSCAN_API_KEY=your-key-here" >> .env
```

### Basic Usage

```javascript
const EtherscanVerifier = require('./etherscan-verify.js');

// Initialize verifier (loads API key from environment)
const verifier = new EtherscanVerifier(null, 1); // 1 = Ethereum mainnet

// Or explicitly pass API key
const verifier = new EtherscanVerifier(process.env.ETHERSCAN_API_KEY, 1);

// Verify a contract
const result = await verifier.verifyContract({
  contractAddress: '0xYourContractAddress',
  sourceCode: 'pragma solidity ^0.8.0; contract MyContract { ... }',
  contractName: 'MyContract',
  compilerVersion: 'v0.8.20+commit.a1b79de6',
  optimizationUsed: 1,
  runs: 200,
  constructorArguments: '', // ABI-encoded constructor args
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

```javascript
new EtherscanVerifier(apiKey, chainId)
```

Creates a new Etherscan Verifier instance.

**Parameters:**
- `apiKey` (string, optional): Etherscan API key. If null, loads from `ETHERSCAN_API_KEY` env var.
- `chainId` (number, optional): Chain ID of the blockchain. Default: `1` (Ethereum mainnet)

**Example:**
```javascript
// Load from environment
const verifier = new EtherscanVerifier();

// Or specify explicitly
const verifier = new EtherscanVerifier('my-api-key', 8453); // Base
```

### verifyContract(options)

Verifies a contract with source code on Etherscan.

**Parameters:**
- `options` (object, required): Verification options
  - `contractAddress` (string, required): Contract address to verify
  - `sourceCode` (string, required): Complete Solidity source code
  - `contractName` (string, required): Name of the main contract
  - `compilerVersion` (string, required): Compiler version (e.g., 'v0.8.20+commit.a1b79de6')
  - `optimizationUsed` (number, optional): 0 or 1. Default: `1`
  - `runs` (number, optional): Optimization runs. Default: `200`
  - `constructorArguments` (string, optional): ABI-encoded constructor args (hex without 0x). Default: `''`
  - `evmVersion` (string, optional): EVM version. Default: `'default'`
  - `licenseType` (string, optional): License type (1=None, 3=MIT, etc.). Default: `'3'`

**Returns:** Promise resolving to:
```javascript
{
  status: 'success',
  message: 'Contract verification submitted',
  guid: 'verification-guid',
  contractAddress: '0x...',
  chainId: 1,
  timestamp: 1234567890
}
```

**Example:**
```javascript
const result = await verifier.verifyContract({
  contractAddress: '0xA9D1e08C7793af67e9d92fe308d5697FB81d3E43',
  sourceCode: `
    pragma solidity ^0.8.20;
    contract SimpleStorage {
      uint256 public value;
      constructor(uint256 _value) { value = _value; }
    }
  `,
  contractName: 'SimpleStorage',
  compilerVersion: 'v0.8.20+commit.a1b79de6',
  optimizationUsed: 1,
  runs: 200,
  constructorArguments: '0000000000000000000000000000000000000000000000000000000000000064',
  evmVersion: 'paris',
  licenseType: '3'
});
```

### checkVerificationStatus(guid)

Checks the status of a contract verification.

**Parameters:**
- `guid` (string, required): Verification GUID from `verifyContract()`

**Returns:** Promise resolving to:
```javascript
{
  status: 'verified', // or 'pending'
  message: 'Pass - Verified',
  guid: 'verification-guid',
  timestamp: 1234567890
}
```

**Example:**
```javascript
const status = await verifier.checkVerificationStatus('your-guid-here');
if (status.status === 'verified') {
  console.log('Contract verified successfully!');
}
```

### verifyBytecode(contractAddress, bytecode)

Verifies that deployed bytecode matches expected bytecode.

**Parameters:**
- `contractAddress` (string, required): Contract address
- `bytecode` (string, required): Expected bytecode (hex with or without 0x)

**Returns:** Promise resolving to:
```javascript
{
  address: '0x...',
  match: true, // or false
  onChainBytecode: '0x606060...',
  providedBytecode: '0x606060...',
  chainId: 1,
  message: 'Bytecode matches on-chain bytecode',
  timestamp: 1234567890
}
```

**Example:**
```javascript
const result = await verifier.verifyBytecode(
  '0xA9D1e08C7793af67e9d92fe308d5697FB81d3E43',
  '0x606060405236156100b9...'
);
console.log('Bytecode matches:', result.match);
```

### getContractABI(contractAddress)

Gets the ABI for a verified contract.

**Parameters:**
- `contractAddress` (string, required): Contract address

**Returns:** Promise resolving to:
```javascript
{
  address: '0x...',
  abi: [...], // Parsed ABI JSON
  chainId: 1,
  timestamp: 1234567890
}
```

**Example:**
```javascript
const abiData = await verifier.getContractABI('0xYourContractAddress');
console.log('Contract ABI:', abiData.abi);
```

### getContractSourceCode(contractAddress)

Gets the source code and metadata for a verified contract.

**Parameters:**
- `contractAddress` (string, required): Contract address

**Returns:** Promise resolving to:
```javascript
{
  address: '0x...',
  sourceCode: 'pragma solidity...',
  abi: '[...]',
  contractName: 'MyContract',
  compilerVersion: 'v0.8.20',
  optimizationUsed: '1',
  runs: '200',
  constructorArguments: '000...',
  evmVersion: 'paris',
  library: '',
  licenseType: 'MIT',
  proxy: '0',
  implementation: '',
  swarmSource: '',
  chainId: 1,
  timestamp: 1234567890
}
```

**Example:**
```javascript
const sourceData = await verifier.getContractSourceCode('0xYourContractAddress');
console.log('Source code:', sourceData.sourceCode);
console.log('Compiler:', sourceData.compilerVersion);
```

### Static Methods

#### encodeConstructorArguments(types, values)

Encodes constructor arguments for contract verification.

**Parameters:**
- `types` (array, required): Array of parameter types (e.g., `['address', 'uint256']`)
- `values` (array, required): Array of parameter values

**Supported Types:**
- `address`: Ethereum addresses
- `uint256`, `uint8`, etc.: Unsigned integers
- `int256`, `int8`, etc.: Signed integers
- `bool`: Boolean values
- `bytes32`: Fixed-size bytes

**Returns:** String of hex-encoded constructor arguments (without 0x prefix)

**Example:**
```javascript
const encoded = EtherscanVerifier.encodeConstructorArguments(
  ['address', 'uint256'],
  ['0xA9D1e08C7793af67e9d92fe308d5697FB81d3E43', '1000']
);
// Returns: "000000000000000000000000a9d1e08c7793af67e9d92fe308d5697fb81d3e4300000000000000000000000000000000000000000000000000000000000003e8"
```

### Validation Methods

#### validateAddress(address)

Validates and normalizes an Ethereum address.

**Parameters:**
- `address` (string, required): Address to validate

**Returns:** Normalized address with 0x prefix

**Throws:** Error if address is invalid

**Example:**
```javascript
const validated = verifier.validateAddress('A9D1e08C7793af67e9d92fe308d5697FB81d3E43');
// Returns: "0xa9d1e08c7793af67e9d92fe308d5697fb81d3e43"
```

### Utility Methods

#### formatVerificationResult(result)

Formats verification result for display.

**Parameters:**
- `result` (object, required): Verification result object

**Returns:** Formatted string for console output

**Example:**
```javascript
const result = await verifier.verifyContract({...});
console.log(verifier.formatVerificationResult(result));
```

#### getAPIKeyInfo()

Gets API key information without revealing the key.

**Returns:** Object with API key info:
```javascript
{
  hasApiKey: true,
  keyLength: 34,
  keyPreview: 'ABCD...WXYZ',
  recommendation: 'Store API keys in environment variables (ETHERSCAN_API_KEY)'
}
```

**Example:**
```javascript
const keyInfo = verifier.getAPIKeyInfo();
console.log('Has API key:', keyInfo.hasApiKey);
console.log('Key preview:', keyInfo.keyPreview); // Never shows full key
```

#### getAPIInfo()

Gets API configuration information.

**Returns:** Object with API configuration:
```javascript
{
  baseUrl: 'api.etherscan.io',
  chainId: 1,
  hasApiKey: true,
  cacheTimeout: 300000
}
```

#### clearCache()

Clears the internal cache.

**Example:**
```javascript
verifier.clearCache();
```

#### getCacheStats()

Gets cache statistics.

**Returns:** Object with cache stats:
```javascript
{
  size: 5,
  timeout: 300000,
  keys: ['key1', 'key2', ...]
}
```

## Supported Blockchains

The module automatically selects the correct API endpoint based on chain ID:

| Network | Chain ID | API Base URL |
|---------|----------|--------------|
| Ethereum Mainnet | 1 | api.etherscan.io |
| Goerli Testnet | 5 | api-goerli.etherscan.io |
| Sepolia Testnet | 11155111 | api-sepolia.etherscan.io |
| BSC Mainnet | 56 | api.bscscan.com |
| Polygon Mainnet | 137 | api.polygonscan.com |
| Base Mainnet | 8453 | api.basescan.org |
| Arbitrum One | 42161 | api.arbiscan.io |
| Optimism | 10 | api-optimistic.etherscan.io |
| Avalanche C-Chain | 43114 | api.snowtrace.io |

## Getting an API Key

1. Visit the appropriate block explorer:
   - Ethereum: [Etherscan.io](https://etherscan.io/)
   - Base: [Basescan.org](https://basescan.org/)
   - Polygon: [Polygonscan.com](https://polygonscan.com/)
   - etc.

2. Create a free account
3. Navigate to API Keys section
4. Generate a new API key
5. Store securely in environment variables

## Security Best Practices

### ✅ DO

1. **Use Environment Variables**
   ```bash
   export ETHERSCAN_API_KEY="your-key-here"
   ```

2. **Use .env Files with .gitignore**
   ```bash
   echo "ETHERSCAN_API_KEY=your-key" >> .env
   echo ".env" >> .gitignore
   ```

3. **Never Commit API Keys**
   - Add `.env` to `.gitignore`
   - Use `.env.example` for templates
   - Rotate keys if accidentally committed

4. **Use Key Redaction in Logs**
   ```javascript
   const keyInfo = verifier.getAPIKeyInfo();
   console.log('Key:', keyInfo.keyPreview); // Only shows ABCD...WXYZ
   ```

5. **Separate Development and Production Keys**
   - Use different keys for dev/staging/prod
   - Rotate production keys regularly

### ❌ DON'T

1. **Hardcode API Keys**
   ```javascript
   // DON'T DO THIS!
   const verifier = new EtherscanVerifier('my-secret-key-12345', 1);
   ```

2. **Log Full API Keys**
   ```javascript
   // DON'T DO THIS!
   console.log('API Key:', verifier.apiKey);
   ```

3. **Share Keys in Public Repositories**
   - Never commit keys to GitHub
   - Use secret management for CI/CD

4. **Use Production Keys in Development**
   - Keep environments separate
   - Use rate-limited dev keys

5. **Embed Keys in Client-Side Code**
   - Never expose keys in frontend
   - Use backend proxy for API calls

## Examples

### Example 1: Verify a Simple Contract

```javascript
const EtherscanVerifier = require('./etherscan-verify.js');

async function verifySimpleContract() {
  const verifier = new EtherscanVerifier(); // Loads from env
  
  const sourceCode = `
    pragma solidity ^0.8.20;
    
    contract SimpleStorage {
      uint256 public value;
      
      constructor(uint256 _initialValue) {
        value = _initialValue;
      }
      
      function setValue(uint256 _value) public {
        value = _value;
      }
    }
  `;
  
  // Encode constructor argument (initial value = 100)
  const constructorArgs = EtherscanVerifier.encodeConstructorArguments(
    ['uint256'],
    ['100']
  );
  
  const result = await verifier.verifyContract({
    contractAddress: '0xYourContractAddress',
    sourceCode: sourceCode,
    contractName: 'SimpleStorage',
    compilerVersion: 'v0.8.20+commit.a1b79de6',
    optimizationUsed: 1,
    runs: 200,
    constructorArguments: constructorArgs,
    evmVersion: 'paris',
    licenseType: '3'
  });
  
  console.log('Verification submitted!');
  console.log('GUID:', result.guid);
  
  // Wait and check status
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  const status = await verifier.checkVerificationStatus(result.guid);
  console.log('Status:', status.message);
}
```

### Example 2: Verify Multi-Parameter Constructor

```javascript
async function verifyMultiParamContract() {
  const verifier = new EtherscanVerifier();
  
  // Contract with multiple constructor parameters
  const constructorArgs = EtherscanVerifier.encodeConstructorArguments(
    ['address', 'uint256', 'bool'],
    ['0xA9D1e08C7793af67e9d92fe308d5697FB81d3E43', '1000000', true]
  );
  
  const result = await verifier.verifyContract({
    contractAddress: '0xYourContractAddress',
    sourceCode: '...',
    contractName: 'MyContract',
    compilerVersion: 'v0.8.20+commit.a1b79de6',
    constructorArguments: constructorArgs,
    // ... other options
  });
  
  console.log('Verification GUID:', result.guid);
}
```

### Example 3: Verify Bytecode Without Source

```javascript
async function verifyBytecodeOnly() {
  const verifier = new EtherscanVerifier();
  
  const bytecode = '0x606060405236156100b9...'; // Your bytecode
  
  const result = await verifier.verifyBytecode(
    '0xYourContractAddress',
    bytecode
  );
  
  if (result.match) {
    console.log('✓ Bytecode matches on-chain bytecode');
  } else {
    console.log('✗ Bytecode does not match');
  }
}
```

### Example 4: Get Contract Information

```javascript
async function getContractInfo() {
  const verifier = new EtherscanVerifier();
  const contractAddress = '0xYourVerifiedContractAddress';
  
  // Get ABI
  const abiData = await verifier.getContractABI(contractAddress);
  console.log('Contract ABI:', abiData.abi);
  
  // Get source code
  const sourceData = await verifier.getContractSourceCode(contractAddress);
  console.log('Contract name:', sourceData.contractName);
  console.log('Compiler:', sourceData.compilerVersion);
  console.log('Optimization runs:', sourceData.runs);
}
```

### Example 5: Multi-Chain Verification

```javascript
async function verifyOnBase() {
  // Verify contract on Base blockchain
  const verifier = new EtherscanVerifier(null, 8453); // Base chain ID
  
  const result = await verifier.verifyContract({
    contractAddress: '0xYourBaseContractAddress',
    sourceCode: '...',
    contractName: 'MyContract',
    compilerVersion: 'v0.8.20+commit.a1b79de6',
    // ... other options
  });
  
  console.log('Base contract verification submitted');
  console.log('View on Basescan:', 
    `https://basescan.org/address/${result.contractAddress}`);
}
```

## Error Handling

The module throws descriptive errors for various failure scenarios:

```javascript
try {
  const result = await verifier.verifyContract({...});
} catch (error) {
  if (error.message.includes('API key')) {
    console.error('API key is missing or invalid');
  } else if (error.message.includes('Invalid')) {
    console.error('Invalid input parameters');
  } else {
    console.error('Verification failed:', error.message);
  }
}
```

Common error scenarios:
- Missing or invalid API key
- Invalid contract address format
- Missing required fields
- Invalid bytecode format
- Network/API errors
- Rate limiting

## Rate Limiting

Etherscan APIs have rate limits:
- **Free tier**: 5 calls/second, 100,000 calls/day
- **Paid tiers**: Higher limits available

The module includes caching (5-minute default) to reduce API calls.

## Testing

Run the test suite:

```bash
npm run test:etherscan-verify
```

Run the demo:

```bash
npm run etherscan-verify:demo
```

## Related Modules

- **etherscan-token-balance.js**: Fetch token balances from Etherscan
- **contract-abi.js**: Fetch contract ABIs
- **erc721.js**: Work with ERC-721 NFTs
- **wallet.js**: Secure wallet encryption and key management

## License

ISC

## Author

Matthew Brace <kushmanmb@gmx.com>

## Additional Resources

- [Etherscan API Documentation](https://docs.etherscan.io/)
- [Basescan API Documentation](https://docs.basescan.org/)
- [Contract Verification Guide](https://info.etherscan.com/how-to-verify-a-contract/)
- [Security Best Practices](../SECURITY-GUIDE.md)
