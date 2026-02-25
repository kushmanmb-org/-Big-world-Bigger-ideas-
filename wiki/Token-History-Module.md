# Token History Tracker Module

Track the complete ownership history of ERC-721 NFT tokens, similar to git commit history.

## 📊 Overview

The TokenHistoryTracker provides:
- Complete ownership history for NFT tokens
- Git-style tracking of transfers
- Historical ownership analysis
- Current owner lookup
- Transfer count statistics

## 📦 Installation

```javascript
const { TokenHistoryTracker } = require('big-world-bigger-ideas');
// or
const TokenHistoryTracker = require('big-world-bigger-ideas/src/token-history');
```

## 🚀 Usage

### Creating a Tracker Instance

```javascript
// Default RPC (Ethereum mainnet)
const tracker = new TokenHistoryTracker(
  '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',  // Contract address
  1234  // Token ID
);

// Custom RPC endpoint
const tracker = new TokenHistoryTracker(
  '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
  1234,
  'https://base.publicnode.com'  // Base network
);
```

### Track Ownership History

```javascript
const history = await tracker.trackOwnership();

console.log(`Current Owner: ${history.currentOwner}`);
console.log(`Total Transfers: ${history.totalTransfers}`);

// Display history
history.history.forEach((record, index) => {
  console.log(`${index + 1}. ${record.owner}`);
  console.log(`   Block: ${record.blockNumber}`);
  console.log(`   Time: ${new Date(record.timestamp * 1000).toLocaleString()}`);
});
```

### Get Current Owner

```javascript
const currentOwner = await tracker.getCurrentOwner();
console.log(`Current owner: ${currentOwner}`);
```

### Get Full History

```javascript
const fullHistory = tracker.getOwnershipHistory();
console.log(`History records: ${fullHistory.length}`);
```

## 📊 API Reference

### Constructor

**`new TokenHistoryTracker(contractAddress, tokenId, rpcUrl?)`**

- `contractAddress` (string): ERC-721 contract address
- `tokenId` (number|string): Token ID to track
- `rpcUrl` (string, optional): Custom RPC endpoint

### Methods

#### `trackOwnership()`
Track the complete ownership history of the token.

**Returns:**
```javascript
{
  currentOwner: string,        // Current token owner
  totalTransfers: number,      // Number of transfers
  history: Array<{
    owner: string,             // Owner address
    blockNumber: number,       // Block number of transfer
    timestamp: number,         // Unix timestamp
    transactionHash: string    // Transaction hash
  }>
}
```

#### `getCurrentOwner()`
Get the current owner of the token.

**Returns:** `Promise<string>` - Owner address

#### `getOwnershipHistory()`
Get the cached ownership history.

**Returns:** `Array` - History records (empty if not yet tracked)

## 💡 Use Cases

### NFT Provenance Tracking

```javascript
async function analyzeProvenance(contractAddress, tokenId) {
  const tracker = new TokenHistoryTracker(contractAddress, tokenId);
  const history = await tracker.trackOwnership();
  
  console.log(`\n📊 NFT #${tokenId} Provenance`);
  console.log('='.repeat(50));
  
  // Original minter
  const firstOwner = history.history[0];
  console.log(`\nOriginal Minter: ${firstOwner.owner}`);
  console.log(`Minted at block: ${firstOwner.blockNumber}`);
  
  // Current owner
  console.log(`\nCurrent Owner: ${history.currentOwner}`);
  console.log(`Total transfers: ${history.totalTransfers}`);
  
  // Calculate holding periods
  const holdingPeriods = [];
  for (let i = 0; i < history.history.length - 1; i++) {
    const period = history.history[i + 1].timestamp - history.history[i].timestamp;
    holdingPeriods.push({
      owner: history.history[i].owner,
      days: Math.round(period / 86400)
    });
  }
  
  console.log(`\nHolding Periods:`);
  holdingPeriods.forEach((period, index) => {
    console.log(`${index + 1}. ${period.owner.slice(0, 10)}... - ${period.days} days`);
  });
}

// Usage
analyzeProvenance('0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D', 1);
```

### Ownership Timeline

```javascript
async function createTimeline(contractAddress, tokenId) {
  const tracker = new TokenHistoryTracker(contractAddress, tokenId);
  const history = await tracker.trackOwnership();
  
  console.log(`\n🕐 Ownership Timeline for Token #${tokenId}`);
  console.log('='.repeat(60));
  
  history.history.forEach((record, index) => {
    const date = new Date(record.timestamp * 1000);
    const arrow = index < history.history.length - 1 ? '→' : '✓';
    
    console.log(`\n${arrow} ${date.toLocaleDateString()}`);
    console.log(`  Owner: ${record.owner}`);
    console.log(`  Block: ${record.blockNumber}`);
    console.log(`  Tx: ${record.transactionHash}`);
  });
}
```

### Collector Analysis

```javascript
async function analyzeCollector(contractAddress, tokenIds) {
  const results = [];
  
  for (const tokenId of tokenIds) {
    const tracker = new TokenHistoryTracker(contractAddress, tokenId);
    const history = await tracker.trackOwnership();
    results.push(history);
  }
  
  // Find which tokens the collector currently owns
  const collector = '0xCollectorAddress...';
  const ownedTokens = results.filter(r => 
    r.currentOwner.toLowerCase() === collector.toLowerCase()
  );
  
  console.log(`Collector owns ${ownedTokens.length} tokens`);
  
  // Analyze purchase history
  results.forEach((result, index) => {
    const collectorHistory = result.history.filter(h => 
      h.owner.toLowerCase() === collector.toLowerCase()
    );
    
    if (collectorHistory.length > 0) {
      console.log(`\nToken #${tokenIds[index]}:`);
      console.log(`  Owned ${collectorHistory.length} time(s)`);
      collectorHistory.forEach(h => {
        console.log(`  - Acquired at block ${h.blockNumber}`);
      });
    }
  });
}
```

## ⚠️ Error Handling

```javascript
try {
  const tracker = new TokenHistoryTracker(contractAddress, tokenId);
  const history = await tracker.trackOwnership();
} catch (error) {
  if (error.message.includes('Invalid address')) {
    console.error('Invalid contract address format');
  } else if (error.message.includes('Invalid token ID')) {
    console.error('Token ID must be a non-negative integer');
  } else if (error.message.includes('Network')) {
    console.error('Network error - check RPC endpoint');
  } else {
    console.error('Tracking error:', error.message);
  }
}
```

## 🌐 Multi-Chain Support

Track tokens on any EVM-compatible chain:

```javascript
// Ethereum
const ethTracker = new TokenHistoryTracker(
  address, tokenId, 
  'https://ethereum.publicnode.com'
);

// Base
const baseTracker = new TokenHistoryTracker(
  address, tokenId,
  'https://base.publicnode.com'
);

// Polygon
const polygonTracker = new TokenHistoryTracker(
  address, tokenId,
  'https://polygon.publicnode.com'
);
```

## 🧪 Testing

Run tests:

```bash
npm run test:token-history
```

Run demo:

```bash
npm run token-history:demo
```

## 📈 Performance Tips

1. **Cache results** - History doesn't change frequently
2. **Batch queries** - Track multiple tokens in parallel
3. **Use reliable RPCs** - Faster RPC = faster tracking
4. **Index events** - For large collections, use event indexing

## 🔗 Related Modules

- [ERC-721 Module](ERC721-Module) - Fetch NFT data
- [Address Tracker](Address-Tracker-Module) - Track addresses
- [Blockchain Council](Blockchain-Council-Module) - NFT governance

## 💡 Advanced Examples

### Compare Ownership Patterns

```javascript
async function comparePatterns(contract1, contract2, tokenId) {
  const tracker1 = new TokenHistoryTracker(contract1, tokenId);
  const tracker2 = new TokenHistoryTracker(contract2, tokenId);
  
  const history1 = await tracker1.trackOwnership();
  const history2 = await tracker2.trackOwnership();
  
  console.log('Collection 1 transfers:', history1.totalTransfers);
  console.log('Collection 2 transfers:', history2.totalTransfers);
  
  // Calculate average holding time
  const avgHoldingTime1 = calculateAvgHolding(history1.history);
  const avgHoldingTime2 = calculateAvgHolding(history2.history);
  
  console.log(`Avg holding time 1: ${avgHoldingTime1} days`);
  console.log(`Avg holding time 2: ${avgHoldingTime2} days`);
}

function calculateAvgHolding(history) {
  if (history.length < 2) return 0;
  
  let totalDays = 0;
  for (let i = 0; i < history.length - 1; i++) {
    const days = (history[i + 1].timestamp - history[i].timestamp) / 86400;
    totalDays += days;
  }
  
  return Math.round(totalDays / (history.length - 1));
}
```

---

**Next**: [Consensus Tracker Module](Consensus-Tracker-Module)
