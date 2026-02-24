# Ethereum Validators Module

A comprehensive module for fetching and managing Ethereum validator data from the Beaconcha.in API.

## Overview

The Ethereum Validators module provides a simple interface to interact with the Beaconcha.in API v2 for retrieving information about Ethereum validators on the Beacon Chain (Proof of Stake). This module supports fetching validator details, performance metrics, attestation data, and balance history.

## Features

- ✅ Fetch validator information by index or public key
- ✅ Support for multiple validators in a single request
- ✅ Validator performance metrics
- ✅ Attestation performance tracking
- ✅ Balance history retrieval
- ✅ Built-in caching mechanism (60s default)
- ✅ Bearer token authentication support
- ✅ Input validation for validator identifiers
- ✅ Formatted output for easy display

## Installation

This module is part of the Big World Bigger Ideas package. Install it via npm:

```bash
npm install big-world-bigger-ideas
```

## API Key

To use this module, you need a Beaconcha.in API key:

1. Visit [https://beaconcha.in/pricing](https://beaconcha.in/pricing)
2. Sign up for a free or premium plan
3. Get your API key from the dashboard
4. Set it as an environment variable:

```bash
export BEACONCHA_API_KEY=your_api_key_here
```

Or pass it directly when creating the fetcher instance.

## Usage

### Basic Usage

```javascript
const EthereumValidatorsFetcher = require('big-world-bigger-ideas/src/ethereum-validators');

// Create fetcher instance with API key
const apiKey = process.env.BEACONCHA_API_KEY;
const fetcher = new EthereumValidatorsFetcher(apiKey);

// Fetch single validator by index
const validator = await fetcher.getValidators(12345);
console.log(fetcher.formatValidators(validator));

// Fetch multiple validators
const validators = await fetcher.getValidators([100, 200, 300]);
console.log(fetcher.formatValidators(validators));

// Fetch validator by public key
const pubkey = '0x...'; // 96 hex characters
const validatorByPubkey = await fetcher.getValidators(pubkey);
console.log(fetcher.formatValidators(validatorByPubkey));
```

### Performance Metrics

```javascript
// Get validator performance
const performance = await fetcher.getValidatorPerformance(12345);
console.log(fetcher.formatPerformance(performance));

// Get attestation performance
const attestations = await fetcher.getAttestationPerformance(12345);

// Get balance history
const balances = await fetcher.getBalanceHistory(12345);
```

### Cache Management

```javascript
// Get cache statistics
const stats = fetcher.getCacheStats();
console.log(`Cache size: ${stats.size}`);
console.log(`Cache timeout: ${stats.timeout}ms`);

// Set custom cache timeout (in milliseconds)
fetcher.setCacheTimeout(30000); // 30 seconds

// Clear cache
fetcher.clearCache();
```

## API Reference

### Constructor

#### `new EthereumValidatorsFetcher(apiKey, baseUrl)`

Creates a new instance of the Ethereum Validators fetcher.

**Parameters:**
- `apiKey` (string, optional): Beaconcha.in API key for authentication
- `baseUrl` (string, optional): Base API URL (default: 'beaconcha.in')

**Example:**
```javascript
const fetcher = new EthereumValidatorsFetcher('your-api-key');
```

### Methods

#### `getValidators(validators)`

Fetches validator information for specified validators.

**Parameters:**
- `validators` (number|string|array): Validator index, public key, or array of them

**Returns:** Promise<object> - Validator data

**Example:**
```javascript
// Single validator by index
await fetcher.getValidators(12345);

// Multiple validators
await fetcher.getValidators([100, 200, 300]);

// By public key
await fetcher.getValidators('0x...');
```

#### `getValidatorPerformance(validators)`

Fetches validator performance data.

**Parameters:**
- `validators` (number|string|array): Validator identifiers

**Returns:** Promise<object> - Performance data

#### `getAttestationPerformance(validators)`

Fetches validator attestation performance.

**Parameters:**
- `validators` (number|string|array): Validator identifiers

**Returns:** Promise<object> - Attestation performance data

#### `getBalanceHistory(validators)`

Fetches validator balance history.

**Parameters:**
- `validators` (number|string|array): Validator identifiers

**Returns:** Promise<object> - Balance history data

#### `formatValidators(data)`

Formats validator information for display.

**Parameters:**
- `data` (object): Raw validator data

**Returns:** string - Formatted output

#### `formatPerformance(data)`

Formats performance data for display.

**Parameters:**
- `data` (object): Raw performance data

**Returns:** string - Formatted output

#### `clearCache()`

Clears the internal cache.

#### `getCacheStats()`

Gets cache statistics.

**Returns:** object - Cache statistics including size, timeout, and keys

#### `setCacheTimeout(timeout)`

Sets a custom cache timeout.

**Parameters:**
- `timeout` (number): Cache timeout in milliseconds

## Validator Identifiers

The module accepts validators in multiple formats:

### Validator Index
- Type: number or numeric string
- Example: `12345` or `"12345"`
- Must be non-negative integer

### Validator Public Key
- Type: string
- Format: `0x` followed by 96 hexadecimal characters
- Example: `"0xabcd...1234"` (98 characters total)

### Array of Validators
- Type: array
- Can mix indices and public keys
- Example: `[123, 456, "0xabcd..."]`

## Data Structures

### Validator Object

```javascript
{
  validatorindex: 12345,
  pubkey: "0x...",
  status: "active_online",
  balance: 32000000000,      // Gwei
  effectivebalance: 32000000000,  // Gwei
  slashed: false,
  activationepoch: 0,
  exitepoch: 9999999999
}
```

### Performance Object

```javascript
{
  validatorindex: 12345,
  attestation_efficiency: 99.5,  // Percentage
  proposal_efficiency: 100.0,    // Percentage
  income: 1000000                // Gwei
}
```

## Error Handling

The module validates inputs and provides clear error messages:

```javascript
try {
  await fetcher.getValidators(-1);
} catch (error) {
  console.error(error.message);
  // "Invalid validator index: -1. Must be a non-negative integer."
}

try {
  await fetcher.getValidators('invalid');
} catch (error) {
  console.error(error.message);
  // "Invalid validator identifier..."
}
```

## Caching

The module implements automatic caching to reduce API calls:

- **Default timeout:** 60 seconds (60000ms)
- **Cache key format:** `{operation}-{validators}`
- **Automatic expiration:** Cached data expires after timeout
- **Manual control:** Use `clearCache()` or `setCacheTimeout()`

## Rate Limiting

Beaconcha.in API has rate limits based on your plan:

- **Free plan:** Limited requests per day
- **Premium plans:** Higher rate limits

The module's caching helps minimize API calls and stay within rate limits.

## Examples

### Monitor Multiple Validators

```javascript
const validatorIndices = [100, 200, 300, 400, 500];
const data = await fetcher.getValidators(validatorIndices);

for (const validator of data.data) {
  console.log(`Validator ${validator.validatorindex}: ${validator.status}`);
  console.log(`  Balance: ${validator.balance / 1e9} ETH`);
  console.log(`  Effective: ${validator.effectivebalance / 1e9} ETH`);
}
```

### Track Performance Over Time

```javascript
const validatorIndex = 12345;

// Fetch current performance
const performance = await fetcher.getValidatorPerformance(validatorIndex);
console.log(fetcher.formatPerformance(performance));

// Wait some time...
fetcher.clearCache(); // Force fresh data

// Fetch updated performance
const updatedPerformance = await fetcher.getValidatorPerformance(validatorIndex);
```

### Batch Processing with Error Handling

```javascript
const validators = [100, 200, 300];

for (const validator of validators) {
  try {
    const data = await fetcher.getValidators(validator);
    console.log(`✓ Validator ${validator}: OK`);
  } catch (error) {
    console.error(`✗ Validator ${validator}: ${error.message}`);
  }
}
```

## Best Practices

1. **Store API keys securely:** Use environment variables, never commit keys to code
2. **Handle errors gracefully:** Always wrap API calls in try-catch blocks
3. **Respect rate limits:** Use caching and batch requests when possible
4. **Validate inputs:** The module validates for you, but validate at your application level too
5. **Monitor performance:** Use `getCacheStats()` to monitor cache efficiency

## API Documentation

For complete API documentation, visit:
- [Beaconcha.in API v2 Docs](https://beaconcha.in/api/v2/docs)
- [Ethereum Beacon Chain Specification](https://github.com/ethereum/consensus-specs)

## Related Modules

- `consensus-tracker`: Track consensus mechanisms across blockchains
- `erc721`: Fetch ERC-721 NFT data
- `bitcoin-mining`: Bitcoin mining and network statistics

## Support

For issues, questions, or contributions:
- GitHub: https://github.com/kushmanmb-org/-Big-world-Bigger-ideas-
- Documentation: See README.md in the repository

## License

ISC License - See LICENSE file in the repository
