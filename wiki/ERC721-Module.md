# ERC-721 Token Fetcher Module

The ERC-721 module provides a comprehensive API for interacting with NFT tokens on EVM-compatible blockchains.

## 🎨 Overview

The ERC721Fetcher class allows you to:
- Fetch token ownership information
- Retrieve token metadata (name, symbol, URI)
- Check token balances
- Query collection details
- Access contract ABIs and function signatures

## 📦 Installation

```javascript
const { ERC721Fetcher } = require('big-world-bigger-ideas');
// or
const ERC721Fetcher = require('big-world-bigger-ideas/src/erc721');
```

## 🚀 Usage

### Creating a Fetcher Instance

```javascript
// Default RPC (Ethereum mainnet)
const fetcher = new ERC721Fetcher('0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D');

// Custom RPC endpoint
const fetcher = new ERC721Fetcher(
  '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
  'https://base.publicnode.com'  // Base network
);
```

### Get Token Owner

```javascript
const result = await fetcher.getOwner(1234);
console.log(`Owner: ${result.owner}`);
console.log(`Contract: ${result.contractAddress}`);
console.log(`Token ID: ${result.tokenId}`);
```

### Get Token Balance

```javascript
const result = await fetcher.getBalance('0x1234...abcd');
console.log(`Balance: ${result.balance} tokens`);
```

### Get Token Metadata

```javascript
const metadata = await fetcher.getTokenMetadata(1234);
console.log(`Name: ${metadata.name}`);
console.log(`Symbol: ${metadata.symbol}`);
console.log(`URI: ${metadata.tokenURI}`);
```

### Get Collection Name

```javascript
const result = await fetcher.getName();
console.log(`Collection: ${result.name}`);
```

### Get Collection Symbol

```javascript
const result = await fetcher.getSymbol();
console.log(`Symbol: ${result.symbol}`);
```

### Get Token URI

```javascript
const result = await fetcher.getTokenURI(1234);
console.log(`Token URI: ${result.tokenURI}`);
```

## 🔧 Advanced Features

### Access Function ABIs

```javascript
const ownerOfAbi = fetcher.getFunctionAbi('ownerOf');
console.log(ownerOfAbi);
```

### Get Function Signature

```javascript
const signature = fetcher.getFunctionSignature('ownerOf');
console.log(`Function signature: ${signature}`);
```

### Clear Metadata Cache

```javascript
fetcher.clearMetadataCache();
```

## 📊 API Reference

### Constructor

**`new ERC721Fetcher(contractAddress, rpcUrl?)`**

- `contractAddress` (string): The ERC-721 contract address
- `rpcUrl` (string, optional): Custom RPC endpoint (default: Ethereum mainnet)

### Methods

#### `getOwner(tokenId)`
Returns the owner of a specific token.

**Parameters:**
- `tokenId` (number|string): The token ID

**Returns:**
```javascript
{
  owner: string,           // Owner address
  contractAddress: string, // Contract address
  tokenId: string         // Token ID
}
```

#### `getBalance(address)`
Returns the token balance for an address.

**Parameters:**
- `address` (string): Ethereum address

**Returns:**
```javascript
{
  address: string,         // Queried address
  balance: string,         // Token balance
  contractAddress: string  // Contract address
}
```

#### `getTokenMetadata(tokenId)`
Returns comprehensive metadata for a token.

**Parameters:**
- `tokenId` (number|string): The token ID

**Returns:**
```javascript
{
  tokenId: string,
  name: string,
  symbol: string,
  tokenURI: string,
  contractAddress: string
}
```

#### `getName()`
Returns the collection name.

**Returns:**
```javascript
{
  name: string,
  contractAddress: string
}
```

#### `getSymbol()`
Returns the collection symbol.

**Returns:**
```javascript
{
  symbol: string,
  contractAddress: string
}
```

#### `getTokenURI(tokenId)`
Returns the token URI.

**Parameters:**
- `tokenId` (number|string): The token ID

**Returns:**
```javascript
{
  tokenURI: string,
  tokenId: string,
  contractAddress: string
}
```

## ⚠️ Error Handling

The module validates all inputs and throws descriptive errors:

```javascript
try {
  const result = await fetcher.getOwner('invalid');
} catch (error) {
  console.error(error.message);
  // "Invalid token ID. Must be a non-negative integer."
}
```

Common validation errors:
- Invalid contract address format
- Invalid token ID (must be non-negative integer)
- Invalid Ethereum address format

## 🌐 Multi-Chain Support

Works with any EVM-compatible blockchain:

```javascript
// Ethereum
const ethFetcher = new ERC721Fetcher(address, 'https://ethereum.publicnode.com');

// Base
const baseFetcher = new ERC721Fetcher(address, 'https://base.publicnode.com');

// Polygon
const polygonFetcher = new ERC721Fetcher(address, 'https://polygon.publicnode.com');

// Arbitrum
const arbFetcher = new ERC721Fetcher(address, 'https://arbitrum.publicnode.com');
```

## 🧪 Testing

Run the ERC-721 tests:

```bash
npm run test:erc721
```

Run the demo:

```bash
npm run erc721:demo
```

## 💡 Best Practices

1. **Address Validation**: Always validate addresses before querying
2. **Error Handling**: Wrap async calls in try-catch blocks
3. **Caching**: Use the built-in metadata cache for efficiency
4. **RPC Selection**: Choose reliable RPC endpoints for production
5. **Token ID Format**: Large token IDs are supported (BigInt compatible)

## 📖 Examples

See the [Examples & Use Cases](Examples-and-Use-Cases) page for more real-world examples.

## 🔗 Related Modules

- [Token History Tracker](Token-History-Module) - Track NFT ownership history
- [Contract ABI](Contract-ABI-Module) - Work with contract ABIs
- [Address Tracker](Address-Tracker-Module) - Track addresses across chains

---

**Next**: [Bitcoin Mining Module](Bitcoin-Mining-Module)
