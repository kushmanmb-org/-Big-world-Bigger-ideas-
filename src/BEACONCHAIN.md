# Beacon Chain Fetcher Module

## Overview

The Beacon Chain Fetcher module provides comprehensive functionality to interact with the Ethereum Beacon Chain (ETH 2.0) API. It supports pagination for efficient data retrieval and works seamlessly with ENS names like `kushmanmb.eth`.

## Features

- ✅ **Pagination Support**: Fetch data in pages for efficient querying
- ✅ **ENS Name Support**: Works with ENS names (kushmanmb.eth) and Ethereum addresses
- ✅ **Validator Queries**: Get validator information, performance, and details
- ✅ **Block Queries**: Fetch recent blocks with pagination
- ✅ **Built-in Caching**: Automatic response caching to reduce API calls
- ✅ **Status Filtering**: Filter validators by status (active, pending, exited)
- ✅ **Type Safety**: Comprehensive input validation

## Installation

```bash
npm install big-world-bigger-ideas
```

## Usage

### Basic Setup

```javascript
const { BeaconChainFetcher } = require('big-world-bigger-ideas');

// Create a fetcher instance
const fetcher = new BeaconChainFetcher();

// Or with API key for higher rate limits
const fetcherWithKey = new BeaconChainFetcher('beaconcha.in', 'your-api-key');
```

### Get Validators for an Address (with Pagination)

```javascript
// Fetch validators for kushmanmb.eth - Page 0, Limit 100
const validators = await fetcher.getValidatorsByAddress('kushmanmb.eth', 0, 100);

console.log(`Found ${validators.validators.length} validators`);
console.log(`Page: ${validators.page}, Limit: ${validators.limit}`);

// Navigate through pages
for (let page = 0; page < 5; page++) {
  const data = await fetcher.getValidatorsByAddress('kushmanmb.eth', page, 100);
  console.log(`Page ${page}: ${data.validators.length} validators`);
}
```

### Get Validator Details by Index

```javascript
// Get detailed information about a specific validator
const details = await fetcher.getValidatorByIndex(123456);

console.log(`Validator Index: ${details.validatorIndex}`);
console.log(`Status: ${details.data.status}`);
console.log(`Balance: ${details.data.balance}`);
```

### Get Validator Performance (with Pagination)

```javascript
// Fetch performance data for a validator
const performance = await fetcher.getValidatorPerformance(123456, 0, 50);

console.log(`Validator: ${performance.validatorIndex}`);
console.log(`Performance records: ${performance.performance.length}`);
console.log(`Page: ${performance.page}, Offset: ${performance.offset}`);
```

### Get Recent Blocks (with Pagination)

```javascript
// Fetch recent blocks
const blocks = await fetcher.getRecentBlocks(0, 20);

console.log(`Fetched ${blocks.blocks.length} blocks`);
console.log(`Page: ${blocks.page}, Limit: ${blocks.limit}`);
```

### Filter Validators by Status

```javascript
// Get validators and filter by status
const data = await fetcher.getValidatorsByAddress('kushmanmb.eth', 0, 100);

const activeValidators = BeaconChainFetcher.filterValidatorsByStatus(
  data.validators, 
  'active'
);

const pendingValidators = BeaconChainFetcher.filterValidatorsByStatus(
  data.validators, 
  'pending'
);

console.log(`Active: ${activeValidators.length}`);
console.log(`Pending: ${pendingValidators.length}`);
```

### Format Validator Data

```javascript
// Format validator data for display
const data = await fetcher.getValidatorsByAddress('kushmanmb.eth', 0, 10);
const formatted = fetcher.formatValidatorData(data);

console.log(formatted);
```

### Cache Management

```javascript
// Get cache statistics
const stats = fetcher.getCacheStats();
console.log(`Cache size: ${stats.size}`);
console.log(`Cache timeout: ${stats.timeout}ms`);

// Clear the cache
fetcher.clearCache();
```

## API Reference

### Constructor

```javascript
new BeaconChainFetcher(baseUrl?, apiKey?)
```

- `baseUrl` (string, optional): API base URL (default: 'beaconcha.in')
- `apiKey` (string, optional): API key for higher rate limits

### Methods

#### `getValidatorsByAddress(address, page, limit)`

Fetches validators for an Ethereum address or ENS name with pagination.

**Parameters:**
- `address` (string): Ethereum address or ENS name (e.g., 'kushmanmb.eth')
- `page` (number): Page number (default: 0)
- `limit` (number): Results per page (default: 100, max: 100)

**Returns:** Promise<object> with validator data

#### `getValidatorByIndex(validatorIndex)`

Fetches detailed information about a specific validator.

**Parameters:**
- `validatorIndex` (number|string): The validator index

**Returns:** Promise<object> with validator details

#### `getValidatorPerformance(validatorIndex, page, limit)`

Fetches validator performance data with pagination.

**Parameters:**
- `validatorIndex` (number|string): The validator index
- `page` (number): Page number (default: 0)
- `limit` (number): Results per page (default: 100, max: 100)

**Returns:** Promise<object> with performance data

#### `getRecentBlocks(page, limit)`

Fetches recent blocks with pagination.

**Parameters:**
- `page` (number): Page number (default: 0)
- `limit` (number): Results per page (default: 10, max: 100)

**Returns:** Promise<object> with block data

#### `formatValidatorData(data)`

Formats validator data for display.

**Parameters:**
- `data` (object): Validator data object

**Returns:** string - Formatted output

#### Static Methods

##### `filterValidatorsByStatus(validators, status)`

Filters validators by status.

**Parameters:**
- `validators` (Array): Array of validator objects
- `status` (string): Status to filter by ('active', 'pending', 'exited', etc.)

**Returns:** Array of filtered validators

##### `getTotalValidatorCount(data)`

Gets total validator count from data object.

**Parameters:**
- `data` (object): Validator data object

**Returns:** number - Total validator count

#### Cache Methods

##### `clearCache()`

Clears the internal cache.

##### `getCacheStats()`

Returns cache statistics.

**Returns:** object with size, timeout, and keys

##### `getAPIInfo()`

Returns API configuration information.

**Returns:** object with baseUrl, hasApiKey, and cacheTimeout

## Pagination Examples

### Example 1: Paginate Through All Validators

```javascript
async function fetchAllValidators(address) {
  const allValidators = [];
  let page = 0;
  const limit = 100;
  
  while (true) {
    const data = await fetcher.getValidatorsByAddress(address, page, limit);
    
    if (data.validators.length === 0) {
      break; // No more validators
    }
    
    allValidators.push(...data.validators);
    page++;
    
    console.log(`Fetched page ${page}, total: ${allValidators.length}`);
  }
  
  return allValidators;
}

const allVals = await fetchAllValidators('kushmanmb.eth');
console.log(`Total validators: ${allVals.length}`);
```

### Example 2: Get Active Validators with Pagination

```javascript
async function getActiveValidators(address, maxPages = 10) {
  const activeValidators = [];
  
  for (let page = 0; page < maxPages; page++) {
    const data = await fetcher.getValidatorsByAddress(address, page, 100);
    
    const active = BeaconChainFetcher.filterValidatorsByStatus(
      data.validators,
      'active'
    );
    
    activeValidators.push(...active);
    
    if (data.validators.length < 100) {
      break; // Last page
    }
  }
  
  return activeValidators;
}

const active = await getActiveValidators('kushmanmb.eth');
console.log(`Found ${active.length} active validators`);
```

### Example 3: Path Pagination to kushmanmb.eth

```javascript
// Configure path pagination for kushmanmb.eth
async function paginateThroughValidatorPath(ensName) {
  console.log(`Configuring path pagination for ${ensName}`);
  
  const results = {
    address: ensName,
    pages: [],
    totalValidators: 0
  };
  
  // Paginate through validator data
  for (let page = 0; page < 10; page++) {
    try {
      const data = await fetcher.getValidatorsByAddress(ensName, page, 100);
      
      results.pages.push({
        page: page,
        count: data.validators.length,
        offset: data.offset
      });
      
      results.totalValidators += data.validators.length;
      
      console.log(`Page ${page}: ${data.validators.length} validators (offset: ${data.offset})`);
      
      // Stop if we got less than the limit (last page)
      if (data.validators.length < 100) {
        break;
      }
    } catch (error) {
      console.error(`Error on page ${page}:`, error.message);
      break;
    }
  }
  
  return results;
}

// Use it for kushmanmb.eth
const pathConfig = await paginateThroughValidatorPath('kushmanmb.eth');
console.log(`Total validators found: ${pathConfig.totalValidators}`);
console.log(`Total pages: ${pathConfig.pages.length}`);
```

## Error Handling

```javascript
try {
  const validators = await fetcher.getValidatorsByAddress('kushmanmb.eth', 0, 100);
  console.log('Success:', validators);
} catch (error) {
  console.error('Error:', error.message);
  
  // Common errors:
  // - Invalid address format
  // - Invalid pagination parameters
  // - Network timeout
  // - API rate limit exceeded
}
```

## Response Formats

### Validator Data Response

```javascript
{
  address: 'kushmanmb.eth',
  page: 0,
  limit: 100,
  offset: 0,
  validators: [
    {
      validatorindex: 123456,
      pubkey: '0x...',
      balance: 32000000000,
      status: 'active',
      activationepoch: 100
    }
  ],
  status: 'OK',
  timestamp: 1234567890
}
```

### Performance Data Response

```javascript
{
  validatorIndex: 123456,
  page: 0,
  limit: 50,
  offset: 0,
  performance: [
    {
      epoch: 12345,
      attestations: 30,
      proposals: 1
    }
  ],
  status: 'OK',
  timestamp: 1234567890
}
```

## Best Practices

1. **Use Pagination**: Always use pagination for large datasets
2. **Cache Awareness**: Responses are cached for 60 seconds by default
3. **Error Handling**: Always wrap API calls in try-catch blocks
4. **Rate Limiting**: Consider the API rate limits when making multiple requests
5. **ENS Resolution**: For production use, resolve ENS names to addresses when possible

## Notes

- The Beacon Chain API endpoint is: `https://beaconcha.in/api/v1/`
- Default cache timeout: 60 seconds (60000ms)
- Maximum limit per page: 100
- Page numbers start at 0
- ENS names like `kushmanmb.eth` are supported

## Related Resources

- [Beaconcha.in API Documentation](https://beaconcha.in/api/v1/docs/index.html)
- [Ethereum Beacon Chain Explorer](https://beaconcha.in)
- [ENS Documentation](https://docs.ens.domains/)

## License

ISC

## Author

Matthew Brace (kushmanmb)  
Email: kushmanmb@gmx.com  
ENS: kushmanmb.eth
